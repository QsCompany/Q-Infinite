import { sdata, Controller } from './System';
import { bind, basic, net, collection } from './Corelib';

export namespace models {
    export enum MessageType {
        Info = 0,
        Error = 1,
        Command = 2, Confirm = 3
    }
    export class CallBackMessage {
        ProxyCallback: Controller.ProxyCallback<any>;
        Request: net.Request;
        QueeDownloader: net.QueeDownloader;
    }
    export class Message extends sdata.QShopRow {

        public static DPData = bind.DObject.CreateField<string, Message>("Data", Object);

        public Data: string;

        public static DPContent = bind.DObject.CreateField<string, Message>("Content", String, "", null, null, bind.PropertyAttribute.NonSerializable);

        public Content: string;

        public static DPTitle = bind.DObject.CreateField<string, Message>("Title", String, "", null, null, bind.PropertyAttribute.NonSerializable);

        public Title: string;

        public static DPOkText = bind.DObject.CreateField<string, Message>("OKText", String, undefined, null, null, bind.PropertyAttribute.NonSerializable);

        public OKText: string;

        public Callback: CallBackMessage;

        public static DPType = bind.DObject.CreateField<MessageType, Message>("Type", Number, MessageType.Info, null, null, bind.PropertyAttribute.NonSerializable);

        public Type: MessageType;

        public static DPAction = bind.DObject.CreateField<string, Message>("Action", String, undefined);

        public Action: string;
        public static DPCancelText = bind.DObject.CreateField<string, Message>("CancelText", String, undefined, null, null, bind.PropertyAttribute.NonSerializable);


        public static DPAbortText = bind.DObject.CreateField<string, Message>("AbortText", String);
        public AbortText: string; 

        public CancelText: string;

        public privateDecompress: boolean;

        static __fields__() { return [Message.DPContent, Message.DPTitle, Message.DPOkText, Message.DPCancelText,this.DPAbortText, Message.DPAction, Message.DPType, Message.DPData]; }

        constructor(id: number, message?: string) {
            super(id || basic.New());
            this.Content = message;
        }

        public static getById(id: number, type: Function): Message {
            return Message.pstore.Get(id);
        }

        public getStore(): collection.Dictionary<number, any> { return Message.pstore; }

        private static pstore = new collection.Dictionary<number, Message>("Messages", true);
    }
}