import { sdata, Controller } from './System';
import { bind, net, collection } from './Corelib';
export declare namespace models {
    enum MessageType {
        Info = 0,
        Error = 1,
        Command = 2,
        Confirm = 3
    }
    class CallBackMessage {
        ProxyCallback: Controller.ProxyCallback<any>;
        Request: net.Request;
        QueeDownloader: net.QueeDownloader;
    }
    class Message extends sdata.QShopRow {
        static DPData: bind.DProperty<string, Message>;
        Data: string;
        static DPContent: bind.DProperty<string, Message>;
        Content: string;
        static DPTitle: bind.DProperty<string, Message>;
        Title: string;
        static DPOkText: bind.DProperty<string, Message>;
        OKText: string;
        Callback: CallBackMessage;
        static DPType: bind.DProperty<MessageType, Message>;
        Type: MessageType;
        static DPAction: bind.DProperty<string, Message>;
        Action: string;
        static DPCancelText: bind.DProperty<string, Message>;
        static DPAbortText: bind.DProperty<string, Message>;
        AbortText: string;
        CancelText: string;
        privateDecompress: boolean;
        static __fields__(): (bind.DProperty<string, Message> | bind.DProperty<MessageType, Message>)[];
        constructor(id: number, message?: string);
        static getById(id: number, type: Function): Message;
        getStore(): collection.Dictionary<number, any>;
        private static pstore;
    }
}
