import { $$,mvc, query, basic, bind, collection, reflection, ScopicCommand } from "./../../sys/Corelib";
import { UI } from './../../sys/UI';
import { context } from 'context';
import { Material as side,test as testQSidebar,counter } from './../QSidebar/script';

//import * as cssStyle from 'style|style.css';
import * as tmpl from 'template|../../assets/Components/StrechyButton/dom.html';

ValidateImport(tmpl/*, cssStyle*/);

var t = [1, 2, 4];
var t1 = [...t, 1, 2, 4];

declare var require;
declare var $: (s: string, dom?: any) => HTMLElement;

export class Replit{
    static url = "wss://eval.repl.it/ws";
    auth = { "command": "auth", "data": "ZXlKamNtVmhkR1ZrSWpveE5URTBNak0yT1RJNU5Ea3hmUT09OlFLU2hySi9IczRONVQ5MDVrSmErZDJmK0hhTHNvN2FRdVJmUFZaVCtwUHc9" };
    select = { "command": "select_language", "data": "csharp" }
    ws: WebSocket;
    private stat = 0;
    constructor() {
        this.ws = new WebSocket(Replit.url);
        this.ws.onopen = this._onopen.bind(this);
        this.ws.onclose = this._onclose.bind(this);
        this.ws.onmessage = this._onmessage.bind(this);
    }
    send(data) {
        data = JSON.stringify(data);
        setTimeout(() => {
            console.log('sending data', data);
            this.ws.send(data);
        }, 1000);
        
    }
    _onopen(t: WebSocket, e) {
        switch (this.stat) {
            case 0:

                this.stat++;
                this.send(this.auth);
            default:
        }
    }
    _onclose(t: WebSocket, e) {
        console.log("Disconnected");
        this.stat = -1;
    }
    _onmessage(t: WebSocket, e: Event) {
        switch (this.stat) {
            case 0:
                break;
            case 1:
                this.stat++;
                this.send(this.select);
                break;
            case 2:
                console.log("Connected");
                break;
            case 0:
                break;
            default:
        }
    }
    public OnMessage() {

    }
}


export module Material {
    export class StrechyButton extends UI.TControl<StrechyButton> {
        private _Title: Text;
        private _Items: HTMLUListElement;
        private _Trigger: HTMLDivElement;
        constructor() {            
            super(tmpl.template.get('strechy-button') /*'templates.strechy-button'*/, UI.TControl.Me);
        }

        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            this['_'.concat(name)] = dom;
        }
        initialize() {
            UI.JControl.LoadCss(context.GetPath('style.css'));
        }
        OnCompileEnd() {
            this._Trigger.addEventListener('click', this);
        }
        handleEvent(event: Event) {
            $$(this.View).toggleClass('nav-is-visible');
        }

        static ctor() {
            require('style|../../assets/Components/StrechyButton/style.css');
        }
    }
}
export class Css {
    private style: HTMLLinkElement | HTMLStyleElement;
    private sheet: CSSStyleSheet;
    static create() {
        // Create the <style> tag
        var style = document.createElement("style");

        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style;
    }
    constructor(style: HTMLLinkElement|HTMLStyleElement) {
        if (style === void 0) style = Css.create();
        if (style && style.sheet instanceof CSSStyleSheet)
            this.sheet = style.sheet as CSSStyleSheet;
        else throw null;
        this.style = style;
    }
    public add(selector ) {
    }
}

//export function test() {
//    var r = testQSidebar();
//    r.app.OnInitialized = app => {
//        var s = new Material.StrechyButton();
//        app.Add(s);
//    }
//}
//window['testSButton'] = test;