if (typeof exports === 'undefined') var exports = {};
var isWorker = typeof importScripts === 'function' && !(typeof window !== 'undefined' && window instanceof Window);
if (typeof exports === 'undefined' && typeof window !== 'undefined') window['exports'] = {};
declare var Promise;
interface IWorker {
    addEventListener(k: 'error', handler: (e: ErrorEvent) => any, options?: boolean | AddEventListenerOptions);
    addEventListener(k: 'message', handler: (e: MessageEvent) => any, options?: boolean | AddEventListenerOptions);
    postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
}

export namespace Workers {
    export namespace WebWorker {
        export interface IMessageAction<T> {
            Id: number;
            Handler: string;
            Data: T;
        }
        export interface IMessageResult<T> {
            Id: number;
            IsError?: boolean;
            Data?: T;
            keepAlive: boolean;
        }
        export interface MessageEventArgs<T> {
            e: MessageEvent;
            Msg: IMessageAction<T>;
            Handled: boolean;
            Result: any;
            Error?: boolean;
            Thread: Server;
            keepAlive?: boolean;
        }
        export interface ThreadPacket {
            handler: string; data: any;
            callback(owner: ThreadPacket, data: IMessageResult<any>): void;
            Id: number
        }
        let _handlers: { [name: string]: (e: MessageEventArgs<any>) => any } = {};
        export function registerHandler<T>(name: string, handler: (e: MessageEventArgs<T>) => any): boolean {
            if (!name) return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2) return false;
            if (!handler) return false;
            _handlers[name] = handler;
            return true;
        }
        export function getHandler(name: string) {
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2) return false;
            return _handlers[name];
        }
        export function unregisterHandler(name: string) {
            if (!name) return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2) return false;
            return delete _handlers[name];

        }
        var _private: boolean = false;

        export class Server {
            private _worker: IWorker;
            constructor() {
                this.Start();
            }
            Start() {
                this._worker = self as any;//as any as Worker;
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            }
            private _onerror(e: ErrorEvent) {
            }
            private _onmessage(e: MessageEvent) {
                var data = e.data as IMessageAction<any>;
                var handler = _handlers[data.Handler];
                var event: MessageEventArgs<any> = { e: e, Msg: data, Result: undefined, Handled: false, Thread: this };
                var rslt = tryCatch(handler, this._onHandlerError, [event], this);
                if (event.Handled) return;
                this.postMessage({ Id: data.Id, Data: event.Result || rslt, keepAlive: event.keepAlive }, e.origin, e.ports as any, e.ports.slice());
            }
            private _onHandlerError(e: Error, v: MessageEventArgs<any>) {
                v.Error = true;
                v.Handled = true;
                this.postMessage({ Id: v.Msg.Id, IsError: true, Data: e, keepAlive: false });
            }
            postMessage<T>(data: IMessageResult<T>, targetOrigin?: string, transfers?: any[], ports?: MessagePort[]) {
                if (!ports || ports.length == 0) {
                    var p = isWorker ? [data, transfers] : [data, !targetOrigin ? void 0 : targetOrigin, transfers];
                    tryCatch(this._worker.postMessage, this.onPostMessageError, p, this._worker);
                } else {
                    p = [data];
                    for (var i = 0; i < ports.length; i++)
                        tryCatch(ports[i].postMessage, this.onPostMessageError, p, ports[i]);
                }
            }
            private onPostMessageError = function (e: Error, data: IMessageResult<any>) {
                (this as Server).postMessage({ Id: data.Id, IsError: true, Data: "UnExpectedError", keepAlive: false });
            }.bind(this);


            public static Default: Server;
            public static Start() {
                this.Default = new Server();
            }
        }
        export class Client {
            private _worker: Worker;
            private _quee: { [id: number]: ThreadPacket } = {};
            private static counter = 0;
            constructor(private _url: string) {
                this.Start();
            }
            Start() {
                this._worker = new Worker(this._url);
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            }
            public Send(packet: ThreadPacket) {
                var id = performance.now();
                packet.Id = id;
                this._quee[id] = packet;
                this._worker.postMessage(<IMessageAction<any>>{ Id: id, Data: packet.data, Handler: packet.handler });
            }
            private _onmessage(e: MessageEvent) {
                var data = e.data as IMessageResult<any>;
                var q = this._quee[data.Id];
                if (!q) return;
                tryCatch(q.callback, undefined, [q, data], q);
                if (!data.keepAlive) delete this._quee[data.Id];
            }
            private _onerror(e: ErrorEvent) {
            }
        }

        function tryCatch(_try: Function, _catch: Function, params: any[], owner: any) {
            try {
                return _try && _try.apply(owner, params);
            } catch (e) {
                (params = params.slice()).unshift(e);
                return _catch && _catch.apply(owner, params);
            }
        }
        (() => {
            function registerHandler<T>(name: string, handler: (e: MessageEventArgs<T>) => any) {
                _handlers[name] = handler;
            }
            registerHandler<string>('getValue', (e) => { return self[e.Msg.Data]; });
            registerHandler<void>('__close__', (e) => { if (isWorker) self.close(); return isWorker; });
            registerHandler<string>('__loadScripts__', (e) => { importScripts(e.Msg.Data); });
            registerHandler<string>('__hasHandler__', (e) => _handlers[e.Msg.Handler] instanceof Function);
            registerHandler<void>('__href__', (e) => location.href);
            registerHandler<void>('__getHandlers__', (e) => Object.keys(_handlers));
            registerFetchHandler();
        })();
        function registerFetchHandler() {
            Workers.WebWorker.registerHandler<IFetch>('fetch', (e) => {
                var dt = e.Msg.Data;
                e.keepAlive = true;
                e.Handled = true;
                var pors = e.e.ports && e.e.ports.slice();
                var org = e.e.origin;
                fetch(new Request(dt.request.request)).then(e1 => {
                    if (e1.status == 200 && e1.statusText === 'ok')
                        return e1.text().then(
                            txt => {
                                e.Thread.postMessage({ Data: txt, Id: e.Msg.Id, IsError: false, keepAlive: false }, org, pors, pors);
                            }, v => {
                                e.Thread.postMessage({ Data: v, Id: e.Msg.Id, IsError: true, keepAlive: false }, org, pors, pors);
                            });
                    e.Thread.postMessage({ Data: void 0, Id: e.Msg.Id, IsError: true, keepAlive: false }, org, pors, pors);

                }
                );
            });
        }
        interface IFetch {
            request: IFetchRequest;
            response: Response;
        }

        interface IFetchRequest {
            body?: BodyInit;
            request: string;
            init?: RequestInit;
        }

        interface IFetchResponse {
            response: string | JSON | XMLDocument;
            headers: Headers;
            type: string;
        }


    }
}
var swReg: ServiceWorkerRegistration;
function clone (obj) {
    if (!obj)
        return obj;
    if (typeof obj === 'object') {
        var copy = {};
        for (var attr in obj)
            if (obj.hasOwnProperty(attr))
                copy[attr] = obj[attr];
        return copy;
    }
    else if (obj instanceof Array)
        return obj.splice(0);
    return obj;
};
export class ServiceWorker {

    public static Start(url: string, scope: string) {
        return navigator.serviceWorker.register(url, scope ? { scope: scope } : void 0).then(reg => {
            swReg = clone(swReg);
            console.log("SW registration succeeded. Scope is " + reg.scope);
        }).catch(err => {
            console.error("SW registration failed with error " + err);
        });
    }
    public static postMessageToSW<T>(data: Workers.WebWorker.IMessageAction<T>): Promise<{ Action: Workers.WebWorker.IMessageAction<T>, Result: Workers.WebWorker.IMessageResult<T> }> {
        return new Promise((onSucc, onErr) => {
            navigator.serviceWorker.getRegistration().then((reg) => {
                var msg_chan = new MessageChannel();
                reg.active.postMessage(data, [msg_chan.port2]);
                msg_chan.port1.onmessage = (e) => {
                    var dt = e.data as Workers.WebWorker.IMessageResult<T>;
                    (dt.IsError ? onErr : onSucc)(dt.IsError ? { IsError: true, Action: data, Result: dt } : { Action: data, Result: dt });
                };
            }).catch(e => {
                onErr({ IsError: true, Action: data, Result: e });
            });
        });
    }
}
if (typeof window !== 'undefined')
    window['SW'] = ServiceWorker;
