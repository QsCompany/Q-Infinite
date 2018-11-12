export declare namespace Workers {
    interface IWorker {
        addEventListener(k: 'error', handler: (e: ErrorEvent) => any, options?: boolean | AddEventListenerOptions): any;
        addEventListener(k: 'message', handler: (e: MessageEvent) => any, options?: boolean | AddEventListenerOptions): any;
        postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
    }
    namespace WebWorker {
        interface IMessageAction<T> {
            Id: number;
            Handler: string;
            Data: T;
        }
        interface IMessageResult<T> {
            Id: number;
            IsError?: boolean;
            Data?: T;
            keepAlive: boolean;
        }
        interface MessageEventArgs<T> {
            e: MessageEvent;
            Msg: IMessageAction<T>;
            Handled: boolean;
            Result: any;
            Error?: boolean;
            Thread: Server;
            keepAlive?: boolean;
        }
        interface ThreadPacket {
            handler: string;
            data: any;
            callback(owner: ThreadPacket, data: IMessageResult<any>): void;
            Id: number;
        }
        function registerHandler<T>(name: string, handler: (e: MessageEventArgs<T>) => any): boolean;
        function getHandler(name: string): false | ((e: MessageEventArgs<any>) => any);
        function unregisterHandler(name: string): boolean;
        class Server {
            private _worker;
            constructor();
            Start(): void;
            private _onerror;
            private _onmessage;
            private _onHandlerError;
            postMessage<T>(data: IMessageResult<T>, targetOrigin?: string, transfers?: any[], ports?: MessagePort[]): void;
            private onPostMessageError;
            static Default: Server;
            static Start(): void;
        }
        class Client {
            private _url;
            private _worker;
            private _quee;
            private static counter;
            constructor(_url: string);
            Start(): void;
            Send(packet: ThreadPacket): void;
            private _onmessage;
            private _onerror;
        }
    }
    class ServiceWorker {
        static Start(url: string, scope: string): Promise<void>;
        static postMessageToSW<T>(data: Workers.WebWorker.IMessageAction<T>): Promise<{
            Action: Workers.WebWorker.IMessageAction<T>;
            Result: Workers.WebWorker.IMessageResult<T>;
        }>;
    }
}
