"use strict";
var exports = {};
Object.defineProperty(exports, "__esModule", { value: true });
var isWorker = typeof importScripts === 'function' && !(typeof window !== 'undefined' && window instanceof Window);
if (typeof exports === 'undefined' && typeof window !== 'undefined')
    window['exports'] = {};
var Workers;
(function (Workers) {
    var WebWorker;
    (function (WebWorker) {
        var _handlers = {};
        function registerHandler(name, handler) {
            if (!name)
                return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            if (!handler)
                return false;
            _handlers[name] = handler;
            return true;
        }
        WebWorker.registerHandler = registerHandler;
        function getHandler(name) {
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            return _handlers[name];
        }
        WebWorker.getHandler = getHandler;
        function unregisterHandler(name) {
            if (!name)
                return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            return delete _handlers[name];
        }
        WebWorker.unregisterHandler = unregisterHandler;
        var _private = false;
        var Server = (function () {
            function Server() {
                this.onPostMessageError = function (e, data) {
                    this.postMessage({ Id: data.Id, IsError: true, Data: "UnExpectedError", keepAlive: false });
                }.bind(this);
                this.Start();
            }
            Server.prototype.Start = function () {
                this._worker = self;
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            };
            Server.prototype._onerror = function (e) {
            };
            Server.prototype._onmessage = function (e) {
                var data = e.data;
                var handler = _handlers[data.Handler];
                var event = { e: e, Msg: data, Result: undefined, Handled: false, Thread: this };
                var rslt = tryCatch(handler, this._onHandlerError, [event], this);
                if (event.Handled)
                    return;
                this.postMessage({ Id: data.Id, Data: event.Result || rslt, keepAlive: event.keepAlive }, e.origin, e.ports, e.ports.slice());
            };
            Server.prototype._onHandlerError = function (e, v) {
                v.Error = true;
                v.Handled = true;
                this.postMessage({ Id: v.Msg.Id, IsError: true, Data: e, keepAlive: false });
            };
            Server.prototype.postMessage = function (data, targetOrigin, transfers, ports) {
                if (!ports || ports.length == 0) {
                    var p = isWorker ? [data, transfers] : [data, !targetOrigin ? void 0 : targetOrigin, transfers];
                    tryCatch(this._worker.postMessage, this.onPostMessageError, p, this._worker);
                }
                else {
                    p = [data];
                    for (var i = 0; i < ports.length; i++)
                        tryCatch(ports[i].postMessage, this.onPostMessageError, p, ports[i]);
                }
            };
            Server.Start = function () {
                this.Default = new Server();
            };
            return Server;
        }());
        WebWorker.Server = Server;
        var Client = (function () {
            function Client(_url) {
                this._url = _url;
                this._quee = {};
                this.Start();
            }
            Client.prototype.Start = function () {
                this._worker = new Worker(this._url);
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            };
            Client.prototype.Send = function (packet) {
                var id = performance.now();
                packet.Id = id;
                this._quee[id] = packet;
                this._worker.postMessage({ Id: id, Data: packet.data, Handler: packet.handler });
            };
            Client.prototype._onmessage = function (e) {
                var data = e.data;
                var q = this._quee[data.Id];
                if (!q)
                    return;
                tryCatch(q.callback, undefined, [q, data], q);
                if (!data.keepAlive)
                    delete this._quee[data.Id];
            };
            Client.prototype._onerror = function (e) {
            };
            Client.counter = 0;
            return Client;
        }());
        WebWorker.Client = Client;
        function tryCatch(_try, _catch, params, owner) {
            try {
                return _try && _try.apply(owner, params);
            }
            catch (e) {
                (params = params.slice()).unshift(e);
                return _catch && _catch.apply(owner, params);
            }
        }
        (function () {
            function registerHandler(name, handler) {
                _handlers[name] = handler;
            }
            registerHandler('getValue', function (e) { return self[e.Msg.Data]; });
            registerHandler('__close__', function (e) {
                if (isWorker)
                    self.close(); return isWorker;
            });
            registerHandler('__loadScripts__', function (e) { importScripts(e.Msg.Data); });
            registerHandler('__hasHandler__', function (e) { return _handlers[e.Msg.Handler] instanceof Function; });
            registerHandler('__href__', function (e) { return location.href; });
            registerHandler('__getHandlers__', function (e) { return Object.keys(_handlers); });
            registerFetchHandler();
        })();
        function registerFetchHandler() {
            Workers.WebWorker.registerHandler('fetch', function (e) {
                var dt = e.Msg.Data;
                e.keepAlive = true;
                e.Handled = true;
                fetch(new Request(dt.request.request)).then(function (e1) {
                    e.Result = e1;
                    dt.response = e1;
                    e.Thread.postMessage({ Data: dt, Id: e.Msg.Id, IsError: false, keepAlive: false });
                });
            });
        }
    })(WebWorker = Workers.WebWorker || (Workers.WebWorker = {}));
})(Workers = exports.Workers || (exports.Workers = {}));
var swReg;
function clone(obj) {
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
}
;
var ServiceWorker = (function () {
    function ServiceWorker() {
    }
    ServiceWorker.Start = function (url, scope) {
        return navigator.serviceWorker.register(url, scope ? { scope: scope } : void 0).then(function (reg) {
            swReg = clone(swReg);
            console.log("SW registration succeeded. Scope is " + reg.scope);
        }).catch(function (err) {
            console.error("SW registration failed with error " + err);
        });
    };
    ServiceWorker.postMessageToSW = function (data) {
        return new Promise(function (onSucc, onErr) {
            navigator.serviceWorker.getRegistration().then(function (reg) {
                var msg_chan = new MessageChannel();
                reg.active.postMessage(data, [msg_chan.port2]);
                msg_chan.port1.onmessage = function (e) {
                    var dt = e.data;
                    (dt.IsError ? onErr : onSucc)(dt.IsError ? { IsError: true, Action: data, Result: dt } : { Action: data, Result: dt });
                };
            }).catch(function (e) {
                onErr({ IsError: true, Action: data, Result: e });
            });
        });
    };
    return ServiceWorker;
}());
