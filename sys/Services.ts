import {net, Common, bind, basic, collection, utils, encoding,Api} from './Corelib';
import {context} from 'context';
import {Controller} from './System';
import {UI} from './UI';
import { models } from './QModel';


var requester: Controller.ProxyData;


namespace services {
    export class AlertMessage implements Controller.IService {
        Name= 'alert';
        OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {
            UI.Modal.ShowDialog(json.sdata.Title, json.sdata.Content, null, 'OK',null);
        }
    }

    export class ConfirmMessage implements Controller.IService {
        Name= 'confirm';

        OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {
            const c = new encoding.SerializationContext(true);
            const e = c.FromJson(json.sdata, models.Message,null) as models.Message;
            c.Dispose();
            switch (e.Type) {
                case 0:
                case 1:
                    if (proxy.callBack)
                        proxy.callBack(proxy, json, undefined);
                    return;
                case 2:
                case 3: 
                    e.Callback = {
                        ProxyCallback: proxy,
                        Request: webr.current,
                        QueeDownloader: webr,
                    }; 

                    var elm = document.createElement('div'); elm.innerHTML = e.Content;
                    var t = new UI.TControl(elm, e.Data);
                    UI.Modal.ShowDialog(e.Title, t, (xx) => this.OnMessageClosed(xx, e), e.OKText, e.CancelText, e.AbortText);
                    return;
            }
        }

        public OnMessageClosed(xx:UI.MessageEventArgs,e:models.Message) {
            e.Action = UI.MessageResult[xx.Result].toLowerCase();
            requester.Post(models.Message, e, null, (s, r, iss, req) => {
                if (iss) {
                    var t = e.Callback;
                    t.QueeDownloader.Insert(t.Request);
                    e.Dispose();
                } else e.Dispose();
            });
        }
    }
    export class SpeechMessage implements Controller.IService {
        Name = 'speech';

        OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {
            const c = new encoding.SerializationContext(true);
            const e = c.FromJson(json.sdata, models.Message, null) as models.Message;
            c.Dispose();
            switch (e.Type) {
                case 0:
                case 1:
                    if (proxy.callBack)
                        proxy.callBack(proxy, json, undefined);
                    return;
                case 2:
                case 3:
                    e.Callback = {
                        ProxyCallback: proxy,
                        Request: webr.current,
                        QueeDownloader: webr,
                    };

                    var elm = document.createElement('div'); elm.innerHTML = e.Content;
                    var t = new UI.TControl(elm, e.Data);
                    UI.Modal.ShowDialog(e.Title, t, (xx) => this.OnMessageClosed(xx, e), e.OKText, e.CancelText, e.AbortText);
                    return;
            }
        }

        public OnMessageClosed(xx: UI.MessageEventArgs, e: models.Message) {
            e.Action = UI.MessageResult[xx.Result].toLowerCase();
            e.privateDecompress = true;
            requester.Post(models.Message, e, null, (s, r, iss, req) => {
                e.Callback.ProxyCallback.Callback(e.Callback.QueeDownloader, req);

            });
        }
    }
    export class InfoNotification implements Controller.IService {
        Name= 'notification';

        OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {
            UI.InfoArea.push(json.sdata.Content, json.sdata.IsInfo, json.sdata.Expire);
        }
    }
    export class notfication implements Controller.IService {
        Name = 'notfication';
        OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {
            var x = document.location.origin;
            window.location.assign(x + "/admin");
            localStorage.clear();
            document.cookie = 'id=;';
            document.close();
            json.dropRequest = true;
            UI.InfoArea.push(json.sdata.Content, json.sdata.IsInfo, json.sdata.Expire);
        }
    }


}

export function Load(_requester: Controller.ProxyData) {
    requester = _requester;
    Controller.Register(new services.AlertMessage());
    Controller.Register(new services.ConfirmMessage());
    Controller.Register(new services.SpeechMessage());
    Controller.Register(new services.InfoNotification());    
    Controller.Register(new services.notfication());    

    Controller.Register({
        Name: 'guid', OnResponse(proxy: Controller.ProxyCallback<any>, webr: net.QueeDownloader, json: Controller.IServiceResponse) {            
            var d = json.sdata;
            if (typeof d === 'number') {
                basic.setGuidRange(d, d + 2000 - 1);
            } else if (d instanceof Array) {
                basic.setGuidRange(d[0], d[1]);
            } else
                throw "Invalide Exception";
        }
    });
}
