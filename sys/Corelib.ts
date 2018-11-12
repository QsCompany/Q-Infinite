/// <reference path="../qloader.d.ts" />
import { context } from 'context';
import { UI } from './UI';
// import * as plg_template from 'plugin|template';
// import * as plg_json from 'plugin|json';
import { models } from './QModel';
import { Parser } from './Syntaxer';
import value from 'html|*';
namespace __corelib__ {
    
    var plg_template = require('plugin|template');
    var plg_json = require('plugin|json');
    export const key = [234, 23, 196, 234, 69, 238, 92, 244, 50, 110, 70, 181, 109, 139, 252, 209, 146, 174, 40, 140, 129, 41, 58, 89, 102, 193, 99, 194, 178, 192, 239, 152];

    export var _Instance: mvc.Initializer;
    if (plg_template)
        plg_template.addEventListener(ModuleStat.Executed, (e) => mvc.Initializer.Register(e), null);
    if (plg_json)
        plg_json.addEventListener(ModuleStat.Executed, (e) => {
            var c = encoding.SerializationContext.GlobalContext.reset();
            var v = e.exports.value;
            var type = v.__type__;
            var name = v.__name__;
            var tt = c.FromJson(v, context.GetType(type) || Object, new encoding.Path(e, 'data'));

        }, null);
    
    export function $defineProperty(o: any, p: string, attributes: PropertyDescriptor & ThisType<any>, onError?: (o: any, p: string, attributes: PropertyDescriptor & ThisType<any>) => any): any {
        return helper.TryCatch(Object, Object.defineProperty, onError as any, [o, p, attributes]) || false;
    }
    
    export function setProperty<T>(type: typeof Object, p: bind.DProperty<T, bind.DObject>) {
        $defineProperty(type.prototype, p.Name, {
            get: function () { return this.get(p); },
            set: function (v: T) { this.set(p, v); },
            configurable: false,
            enumerable: false
        });
    }
    (function (constructor) {
        if (constructor &&
            constructor.prototype && !('childElementCount' in constructor.prototype)) {
            Object.defineProperty(constructor.prototype, 'childElementCount', {
                get: function () {
                    var i = 0, count = 0, node, nodes = this.childNodes;
                    while (node = nodes[i++]) {
                        if (node.nodeType === 1) count++;
                    }
                    return count;
                }
            });
        }
    })((window as any).Node || (window as any).Element);
    export const  max = 9223372036854775807;
}
declare var stop: () => void;

export declare type GFunction = Function | reflection.GenericType | reflection.DelayedType;



export namespace Common {
    export var Message: models.Message = null;
    export var Math = Math;
    export class RichMenu {

    }
}
export namespace TemplateTypes {
    export function RichMenu() {
    }
}
namespace vars {
    export var _c = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    export var _cnts = [7, 11, 15, 19, 32];
    export var names_scop_fromIn = false;
}


export namespace css {

    
   export var cssRules = [];
export class CSSRule {
    constructor(cssrule, parent) {
        var t;
        t = this;
        if (cssrule instanceof CSSMediaRule) {
            var mr = cssrule;
            var rs = mr.cssRules;
            for (var j = 0; j < rs.length; j++) {
                var r = rs[j];
                if (r instanceof CSSMediaRule)
                    new CSSRule(r, this);
            }
            t.IsMedia = true;
        }
        if (parent) {
            t.Parent = parent;
            if (!parent.children) parent.children = [this];
            else parent.children.push(this);
        }
        cssRules.push(this); t.Rule = cssrule;
    }
    Dispose() {
        var i = cssRules.indexOf(this);
        if (i == -1) return;
        cssRules.splice(i, 1);
    }
    get Selectors() {
        var t = null;
        t = this;
        var r = t.Rule;
        if (t.IsMedia) {
            return [];
        }
        t._selectors = r.selectorText.split(',');
        return t._selectors;
    }
    IsMatch(selector) {
        var c = this.Selectors;
        for (var i = 0; c.length; i++) {
            //var x = c[i].split(/\:\+\>/);
        }
    }
} 
export function collectCss() {
    var d;
    d = document;
    var ss = d.styleSheets;
    for (var i = 0; i < ss.length; i++) {
        var s = ss.item(i);
        var rs = s.cssRules;
        for (var j = 0; j < rs.length; j++) {
            var r = rs[j];
            new CSSRule(r, null);
        }
    }
}
    export function getVar(name: string) {

    }
    export function toValidCssName(c) {
        if (typeof c !== 'string') return c;
        for (var i = 0; i < c.length; i++) {
            var h = c.charCodeAt(i);
            if (h > 64 && h < 91) {
                c = c.substring(0, i) + '-' + String.fromCharCode(h + 32) + c.substring(i + 1);
                i++;
            }
            else if (h === 36) {
                c = c.substring(0, i) + '-' + c.substring(++i);
            }

            else if (h === 95) {
                c = c.substring(0, i) + '--' + c.substring(++i);
            }
        }
        return c;
    }
    export function toValidEnumName(c) {
        if (typeof c !== 'string') return c;
        for (var i = 0; i < c.length; i++) {
            var h = c.charCodeAt(i);
            if (h >= 65 && h <= 90)
                throw "InvalidCssName";
            var nh = c.charCodeAt(i + 1);

            if (h === 45) {
                if (nh >= 97 && nh <= 122) {
                    c = c.substring(0, i) + String.fromCharCode(nh - 32) + c.substring(i + 2);
                }
                else {
                    if (c.charCodeAt(i + 1) === 45) {
                        {
                            c = c.substring(0, i) + '_' + c.substring(i + 2); continue;
                        }
                    } else
                        c = c.substring(0, i) + '$' + c.substring(i + 1);
                    i += 1;
                }

            }
        }
        return c;
    }

    export function Css2Less<T>(css: string, callback: (less: string, param: T) => void, param: T) {
        //var url = 'http://beautifytools.com/css-to-less-converter.php';
        var t = new XMLHttpRequest();
        t.open("POST", '/css-to-less.php');
        t.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        t.setRequestHeader('Access-Control-Allow-Origin', 'true');
        t.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        t.send(encodeURIComponent("data") + "=" + encodeURIComponent("body{display:none}"));
        t.onload = (t) => {
            stop();
        }
    }

    export namespace animation {

        export interface animateProperties<T> {
            dom: HTMLElement;
            props: propValues<T>[];
            oncomplete?(e: this);
            onstart?(e: this);
            timespan: number;
            start?: number;
            cursor?: number;
            thread?: number;
            interval?: number;
            stat?: T;
        }
        export interface animations {
            animations: animateProperties<any>[];
            thread?: number;
            timespan: number;
            interval?: number;
        }
        export interface propValues<T> {
            func?: (cur: number) => number;
            name: string;
            animate(e: animateProperties<T>): void;
            oncomplete?(e: animateProperties<T>): void;
            val?;
        }


        export function animate<T>(anim: animateProperties<T>) {
            stopAnimation(anim);
            anim.start = performance.now();
            anim.cursor = 0;
            anim.onstart && anim.onstart(anim);
            anim.thread = setInterval(() => {
                var n = performance.now();
                anim.cursor = (n - anim.start) / anim.timespan;
                if (anim.cursor >= 1) {
                    clearInterval(anim.thread);
                    anim.cursor = 1;
                }
                for (var i = 0; i < anim.props.length; i++)
                    anim.props[i].animate(anim);
                if (anim.cursor == 1) {
                    anim.oncomplete && anim.oncomplete(anim);
                    var t;
                    for (var i = 0; i < anim.props.length; i++)
                        (t = anim.props[i]).oncomplete && t.oncomplete(anim);
                }
            }, anim.interval);
            return anim;
        }
        export function animates<T>(anim: animations) {
            var start = performance.now();
            stopAnimations(anim);

            anim.thread = setInterval(() => {
                var es = anim.animations;
                var n = performance.now();
                var cursor = (n - start) / anim.timespan;
                if (cursor >= 1) {
                    clearInterval(anim.thread);
                    cursor = 1;
                }
                cursor = 1 - (1 - cursor) * (1 - cursor);
                for (var i = 0; i < es.length; i++) {
                    var e = es[i];
                    e.cursor = cursor;
                    for (var j = 0; j < e.props.length; j++)
                        e.props[j].animate(e);
                }
                if (cursor == 1)
                    complete(es);
            }, anim.interval);
            var es = anim.animations;
            for (var i = 0; i < es.length; i++) {
                var ae = es[i];
                ae.start = start;
                ae.cursor = 0;
                ae.onstart && ae.onstart(ae);
            }
            return anim;
        }
        export function stopAnimation<T>(e: animateProperties<T>) {
            if (!e.thread) return;
            clearInterval(e.thread);
            complete([e]);
            return e;
        }
        export function stopAnimations(e: animations) {
            if (!e.thread) return;
            clearInterval(e.thread);
            complete(e.animations);
            return e;
        }
        function complete(es: animateProperties<any>[]) {
            for (var i = 0; i < es.length; i++) {
                var e = es[i];
                e.thread = 0;
                e.oncomplete && e.oncomplete(e);
                var t;
                for (var j = 0; j < e.props.length; j++)
                    (t = e.props[j]).oncomplete && t.oncomplete(e);
            }
        }

        function colect(f: HTMLElement, attrs: string[]) {
            var r = {};
            for (var i of attrs)
                r[i] = f.style[i];
            return r;
        }
        function grabber(e: cssDebugger) {
            var d = performance.now();
            for (var i = 0; i < e.elements.length; i++)
                e.elements[i].result = [colect(e.elements[i].dom, e.attrs)];

            e.thread = setInterval(() => {
                if (performance.now() - d > e.timespan) { clearInterval(e.thread); }
                for (var i = 0; i < e.elements.length; i++)
                    e.elements[i].result.push(colect(e.elements[i].dom, e.attrs));
            }, e.interval);
        }

        export interface cssDebugger {
            elements: { dom: HTMLElement, result: any[] }[];
            attrs: string[];
            interval: number;
            thread: number;
            timespan: number;
        }


        export function trigger(prop: string, from: number, to: number, finalvalue: string = '', suffx = 'px'): propValues<any> {
            return <any>{
                name: prop,
                def: to - from,
                from: from,
                fnl: finalvalue,
                suffx: suffx || 'px',
                animate(e) {
                    e.dom.style[this.name] = (this.from + this.def * e.cursor) + suffx
                },
                oncomplete(e) {
                    e.dom.style[this.name] = this.fnl
                }
            }
        }

        export namespace constats {
            export var hideOpacity: propValues<any> = { name: 'opacity', animate(e) { e.dom.style.opacity = String(1 - e.cursor); }, oncomplete(e) { e.dom.style[this.name] = ''; } }
            export var showOpacity: propValues<any> = { name: 'opacity', animate(e) { e.dom.style.opacity = String(e.cursor); } }
        }

    }
}


export namespace math {
    export function round1(_n, x) {

        var n = _n + '';
        var i = n.indexOf('.');
        var e = n.indexOf('e');
        if (i === -1) i = n.length;
        var ex = 0;
        if (e !== -1)
            if (i > e) return n;
            else {

                ex = parseFloat(n.substring(e + 1));
                if (ex < x - 1) return '0';
                n = n.substring(0, e);
            }
        var l = n.length;
        if (ex !== 0) {
            if (i + ex > 1) {
                var fi = n.substr(0, i);
                var li = n.substring(i + 1);
                var shift = l - i <= ex ? l - i : ex;
                shift--;
                ex -= shift;
                i += shift;
                if (shift > 0) {
                    n = fi + li.substr(0, shift);
                    var lm = li.substring(shift);
                    if (lm.length > 0) n += lm;
                    i = n.indexOf('.');
                }
                if (i === -1) i = n.length;
                l = n.length;
            }
        }

        var l1 = x == 0 ? i : i + x + 1;
        var r = l1 - l;
        if (r > 0) l1 = l;
        n = n.substr(0, l1);

        if (r > 0) {
            if (i == l) { n += '.'; r--; }
            for (; r > 0; r--)
                n += '0';
        }
        n = ex !== 0 ? n + 'e' + ex : n;
        return n;
    }

    export function round(_n, x) {
        var n = _n + '';
        var i = n.indexOf('.');
        var e = n.indexOf('e');
        if (i === -1) i = e === -1 ? n.length : e;
        var ex = 0;
        if (e !== -1)
            if (i <= e) {
                ex = parseFloat(n.substring(e + 1));
                if (ex < x - 1) return '0';
                n = n.substring(0, e);
            } else {
                ex = parseFloat(n.substring(e + 1));
                n = n.substring(0, e);
            }
        var l = n.length;
        if (ex !== 0) {
            if (i + ex > 1) {
                var fi = n.substr(0, i);
                var li = n.substring(i + 1);
                var shift = l - i <= ex ? l - i : ex;
                shift = Math.abs(shift + shift === 0 ? 0 : (shift < 0 ? 1 : -1));
                ex -= shift;
                i += shift;
                if (shift > 0) {
                    n = fi + li.substr(0, shift);
                    var lm = li.substring(shift);
                    if (lm.length > 0) n += lm;
                    i = n.indexOf('.');
                }
                if (i === -1) i = n.length;
                l = n.length;
            }
        }

        var l1 = x == 0 ? i : i + x + 1;
        var r = x - (n.length - i);
        if (r > 0) l1 = l;
        n = n.substr(0, l1);

        if (r > 0) {
            if (i == l) { n += '.'; r--; }
            for (; r >= 0; r--)
                n += '0';
        }
        n = ex !== 0 ? n + 'e' + ex : n;
        return n;
    }

}

export namespace string {

    export function IsPrintable(keyCode: number, charCode: number) {
        // What a control/printable character is varies wildly based on the browser.
        // - most control characters (arrows, backspace) do not send a `keypress` event
        //   in Chrome, but the *do* on Firefox
        // - in Firefox, when they do send a `keypress` event, control chars have
        //   a charCode = 0, keyCode = xx (for ex. 40 for down arrow)
        // - printable characters always send a keypress event.
        // - in Firefox, printable chars always have a keyCode = 0. In Chrome, the keyCode
        //   always matches the charCode.
        // None of this makes any sense.
        // For these keys, ASCII code == browser keycode.

        var anyNonPrintable =
            (keyCode == 8) ||  // backspace
            (keyCode == 9) ||  // tab
            (keyCode == 13) ||  // enter
            (keyCode == 27);     // escape

        // For these keys, make sure it's a browser keycode and not an ASCII code.
        var mozNonPrintable =
            (keyCode == 19) ||  // pause
            (keyCode == 20) ||  // caps lock
            (keyCode == 45) ||  // insert
            (keyCode == 46) ||  // delete
            (keyCode == 144) ||  // num lock
            (keyCode == 145) ||  // scroll lock
            (keyCode > 32 && keyCode < 41) || // page up/down, end, home, arrows
            (keyCode > 111 && keyCode < 124); // fn keys

        return !anyNonPrintable && !(charCode == 0 && mozNonPrintable);
    }
}
export namespace helper {
    export function TryCatch<T>(owner: any, Try: (...args: any[]) => T, Catch?: (e: Error,...args:any[]) => T, params?: any[]): T {
        try {
            if (Try)
                return Try.apply(owner, params);
            var e = new Error('Undefined Try Block');
        } catch (ei) {
            e = ei;
        }
        return Catch && Catch.apply(owner, (params = params.slice(), params.unshift(e), params));
    }
}
export namespace basic {

    export namespace Settings {
        var _store = {};
        export function get(name) {
            return _store[name];
        }
        export function set(name, value) {
            _store[name] = value;
            value = helper.TryCatch(JSON, JSON.stringify, void 0, [value]);
            localStorage.setItem(name, value);

        }
        (() => {
            var arr = new Array(1);
            for (var i = 0; i < localStorage.length; i++) {
                var n = localStorage.key(i);
                arr[0] = localStorage.getItem(n);
                if (!arr[0] || arr[0] === 'undefined') _store[n] = void 0;
                _store[n] = helper.TryCatch(JSON, JSON.parse, void 0, arr);
            }
        })();
    }


    export enum DataStat {

        Fail = 0,
        Success = 1,
        OperationCanceled = 2,
        UnknownStat = 3,
        DataCheckError = 4,
        DataWasChanged = 16,
        None = 5
    }
    export namespace polyfill {

        export var supportTemplate = 'content' in document.createElement('template');
        export function IsTemplate(x) {
            return supportTemplate ? x instanceof HTMLTemplateElement : (x instanceof HTMLUnknownElement) && x.tagName === 'TEMPLATE';
        }
        if (!supportTemplate) __corelib__.$defineProperty(HTMLUnknownElement.prototype, 'content', { get: function () { return this.tagName === 'TEMPLATE' ? this : undefined; } });
    }
    function defaultUrl(url) {
        if (!url) url = document.location.origin;
        if (url.endsWith('/')) {
            url = url.substr(0, url.length - 1);
        }
        return url;
    }
    export var host = defaultUrl(true ? null : 'http://127.0.0.1:801');// 'https://localhost:5000';

    export interface ICrypto {
        Encrypt(data: Uint8Array | number[]): (Uint8Array | number[]);
        Decrypt(data: Uint8Array | number[]): (Uint8Array | number[]);


        SEncrypt(data: string): string;
        SDecrypt(data: string): string;
    }
    export const Crypto: ICrypto = { Decrypt: (d) => d, Encrypt: (d) => d, SEncrypt: (d) => d, SDecrypt: (d) => d };

    var _guid = null;
    var _end = null;
    export function setGuidRange(start: number, end: number) {
        _guid = start;
        _end = end;
    }
    export function New() {
        if (_guid == null || _guid >= _end) {
            var x = Date.now() * 100000 + Math.floor(Math.random() * 775823);
            return x < __corelib__. max ? x : (Date.now() * 10000) / 10000 | (Math.random() * 771);
        } else {
            if (_guid >= _end - 300) GuidManager.update();
            return _guid++;
        }
    }


    export class GuidManager {
        static get current(): number {
            return _guid;
        }
        constructor(public vars) {
        }
        static get isValid(): boolean {
            return _guid !== 0 && _guid < _end;
        }
        public static get Next() {
            return ++_guid;
        }
        public static New<T>(callback: (id: number, param: T) => void, pram: T) {
            if (_guid !== 0 && _guid < _end)
                callback(++_guid, pram);
            else {
                this.update(callback, pram);
            }

        }
        static t: net.WebRequest;
        static isLoading: boolean;
        public static update<T>(callback?: (id: number, param: T) => void, pram?: T) {
            if (this.t != null) return;
            this.t = new net.WebRequest(null);
            this.t.Download({ Url: '/~Guid', HasBody: false, Method: net.WebRequestMethod.Get }, callback);
            this.t.OnComplete.On = (e) => {
                GuidManager.t.Dispose();
                GuidManager.t = null;
                callback && callback(++_guid, pram);
            }
        }
    }

    export function isFocused(v: Element) {
        var t = document.activeElement;
        while (t) {
            if (t == v) return true;
            t = t.parentElement;
        }
        return false;
    }
    export class focuser {
        focuse(rebound: boolean, toPrev: boolean): any {
            return this[toPrev ? 'focusePrev' : 'focuseNext'](rebound);
        }

        constructor(public bound: HTMLElement, private andButton: boolean) { }


        _focuseOn(v: Element) {
            try {
                (v as any).focus();
                if (document.activeElement == v) {
                    if ((v as any).select) (v as any).select();
                    return v;
                }
            } catch{ }
        }

        getNext(p: Element) {
            var ns;
            while (p && !(ns = p.nextElementSibling)) {
                if (this.bound.contains(p))
                    p = p.parentElement;
                else return null;
            }
            return ns;
        }
        _focuseNext(v: Element, array: Element[]) {
            if (!v) return false;
            if (array.indexOf(v) !== -1) return false;
            array.push(v);
            if (v === document.activeElement) {
                v = this.getNext(v);
                if (!v) return true;
                array.push(v);
            }
            var tmp;
            if ((v as any).tabIndex >= 0 && typeof (v as any).focus === 'function') {
                if (this.andButton || v.constructor !== HTMLButtonElement) {
                    if (this._focuseOn(v)) return v;
                }
            }
            if (v instanceof HTMLElement)
                if ((tmp = this._focuseNext(v.firstElementChild, array))) return tmp;
            var n = this.getNext(v);
            if (n) return this._focuseNext(n, array);
            return true;
        }

        getPrev(p: Element) {
            var ns;
            while (p && !(ns = p.previousElementSibling)) {
                if (this.bound.contains(p))
                    p = p.parentElement;
                else return null;
            }
            return ns;
        }
        _focusePrev(v: Element, array: Element[]) {
            if (!v) return false;
            if (array.indexOf(v) !== -1) return false;
            array.push(v);
            if (v === document.activeElement) {
                v = this.getPrev(v);
                if (!v) return true;
                array.push(v);
            }
            var tmp;
            if ((v as any).tabIndex >= 0 && typeof (v as any).focus === 'function')
                if (this._focuseOn(v)) return v;
            
            if (v instanceof HTMLElement)
                if ((tmp = this._focusePrev(v.lastElementChild, array))) return tmp;
            var n = this.getPrev(v);
            if (n) return this._focusePrev(n, array);
            return true;
        }

        focusePrev(rebound: boolean) {
            if (this.bound.contains(document.activeElement))
                var x = this._focusePrev(document.activeElement, []);
            else x = true;
            if (rebound)
                if (x == true) return this._focusePrev(this.bound, []);
            return x;
        }

        focuseNext(rebound: boolean) {
            if (this.bound.contains(document.activeElement))
                var x = this._focuseNext(document.activeElement, []);
            else x = true;
            if (rebound)
                if (x == true) return this._focuseNext(this.bound, []);
            return x;
        }
        reFocuseOn() {
            return this._focuseNext(this.bound, []);
        }
        focusOn() {
            if (this.bound.contains(document.activeElement)) return;
            return this._focuseNext(this.bound, []);
        }
    }
    var _fc = new focuser(null, false);
    export function focuseOn(v: HTMLElement): boolean {
        (_fc as any).bound = v;
        return _fc.focuseNext(true);
    }
    export function _focuseOn(v: HTMLElement): boolean {
        (_fc as any).bound = v;
        return _fc.focusOn();
    }
    function __focuseOn(v: Element) {
        try {
            (v as any).focus();
            if (document.activeElement == v) {
                if ((v as any).select) (v as any).select();
                return v;
            }
        } catch{ }
    }

    function getNext(p: Element) {
        var ns;
        while (p && !(ns = p.nextElementSibling))
            p = p.parentElement;
        return ns;
    }
    function _xfocuseNext(v: Element, array: Element[]) {
        if (!v) return false;
        if (array.indexOf(v) != -1) return false;
        array.push(v);
        if (v === document.activeElement) {
            v = getNext(v);
            if (!v) return true;
            array.push(v);
        }
        var tmp;
        if (v instanceof HTMLInputElement)
            if (__focuseOn(v)) return v;
        
        if (v instanceof HTMLElement)
            if ((tmp = _xfocuseNext(v.firstElementChild, array))) return tmp;
        var n = getNext(v);
        if (n) return _xfocuseNext(n, array);
        return true;
    }
    export function focuseNext(v: Element) {
        return _xfocuseNext(v || document.activeElement, []);
    }


    export interface IRef<T> {
        value: T;
        aux?: any;
    }
    export interface IEventHandler extends IDisposable {
        Started: boolean;
        Start();
        Pause();
        Dispose();
        Reset();
    }
    export interface Module {
    }
    export interface IContext {
        CanAccessToMe(type: string, folder: string, name: string);
        GetPath(path: string): string;
        NameOf(type: Function): string;
        GetType(path: string): Function;
    }

    export interface IDisposable {
        Dispose(force?: boolean);
    }
    export interface IBindable {
        Owner?: any;
        Invoke(...args: any[]);
    }
    export interface ITBindable<T extends (...args: any[]) => void> extends IBindable {
        Invoke: T;
    }
    export type Invoker<T extends (...args: any[]) => void> = ITBindable<T> | T;
    export interface IOnDisposing extends IDisposable {
        OnDisposing: (s: this) => void;
        Dispose();
    }
    export interface IDelegate extends IDisposable, EventListenerObject, IBindable {

        handleEvent(...args: any[]): void;
    }
    export class Delegate<T> implements IDelegate {
        constructor(public Owner: T, public Invoke: (...args: any[]) => void, private _dispose: (ihe: Delegate<T>) => void, public objectStat?: any) {
        }
        handleEvent(...args: any[]): void {
            this.Invoke.apply(this.Owner, args);
        }
        Dispose() {
            this._dispose(this);
            this.Owner = null;
            this._dispose = null;
            this.Invoke = null;
        }
    }

    export interface IValueCheck {
        [s: string]: (v: any) => boolean;
    }
    export interface IJob {
        Name: string,
        Todo?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        Check?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnError?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
    }

    export class Rectangle {

        private _x: number;
        public get Left(): number {
            return this._x;
        }
        public set Left(v: number) {
            this._x = v;
            this.OnChanged();
        }


        private _y: number;
        public get Top(): number {
            return this._y;
        }
        public set Top(v: number) {
            this._y = v;
            this.OnChanged();
        }

        private _w: number;
        public get Width(): number {
            return this._w;
        }
        public set Width(v: number) {
            this._w = v;
            this.OnChanged();
        }

        private _h: number;
        public get Height(): number {
            return this._h;
        }
        public set Height(v: number) {
            this._h = v;
            this.OnChanged();
        }
        private OnChanged() {
            for (var i = 0; i < this._onchanged.length; i++) {
                var dlg = this._onchanged[i];
                dlg(this);
            }
        }
        private _onchanged: Array<(___this: Rectangle) => void> = [];
        constructor() {
            Object.freeze(this);
            Object.preventExtensions(this);
        }
        public Set(left: number, top: number, width: number, height: number) {
            this._x = left;
            this._y = top;
            this._w = width;
            this._h = height;
            this.OnChanged();
        }
    }
    export interface EqualInterface {
        Equals(o: Object): boolean;
    }
    export interface scopCollection {
        [s: string]: bind.Scop;
    }

    export class SessionId {
        static Id = new Array<number>(16);
        public get Data() { return SessionId.Id; }
        constructor(guid: string) {
            SessionId.parse(guid);
        }
        public static parse(guid: string) {
            if (guid == null) {
                return;
            }
            var t = SessionId.Id;
            var i = 0;
            for (var i = 0; i < 16; i++) {
                var c = guid.substr(2 * i, 2);
                if (c === '') break;
                t[i] = parseInt(c, 16);
            }
        }
    }
    export class iGuid implements EqualInterface {
        public static Empty = new iGuid('00000000-0000-0000-0000-000000000000');
        private _id: string;
        public get Id() { return this._id; }
        constructor(g: string) {
            this._id = g.toUpperCase();
        }
        Equals(o: any): boolean {
            if (o instanceof iGuid)
                return this._id == (<iGuid>o)._id;
            return false;
        }
        toString() { return this._id.toString(); }

        private static FromNumber(v: number) {
            var c = vars._c;
            var cnts = vars._cnts;
            var cc = 0;
            var l = "";
            var i = 0;
            while (i < 32) {
                var d: number, r: number;
                if (v !== 0) {
                    var d = v / 16;
                    var r = Math.floor(v % 16);
                    v = Math.floor(d);
                } else
                    r = Math.floor(Math.random() * 16);
                l += c[r];
                if (i == cnts[cc]) {
                    l += '-';
                    cc++;
                }
                i++;
            }
            return new iGuid(l);
        }

        public static get New() {
            return iGuid.FromNumber(Date.now());
        }

    }

    export interface IId {
        Id: number;
    }

    export class EnumValue {
        constructor(
            public Name: string,
            public Value: number) { Object.freeze(this); }
        toString() { return this.Name; }
        public static GetValue(lst: collection.List<EnumValue>, n: number | string) {
            var c = lst.AsList();
            if (typeof n === 'number') {
                for (var i = 0; i < c.length; i++)
                    if (c[i].Value === n) return c[i];
            } else {
                for (var i = 0; i < c.length; i++)
                    if (c[i].Name === n) return c[i];
            }
            return undefined;
        }
    }

    var enums = {};
    export function getEnum(enumPath: string, enumValue?: Object): collection.List<EnumValue> {
        var _enum;
        if (typeof enumPath === 'string')
            _enum = enums[enumPath] || enumValue || context.GetEnum(enumPath);
        else throw "the Path Inspecified";
        if (!(_enum instanceof collection.List && (<collection.List<EnumValue>>_enum).IsFrozen())) {
            if (_enum == null) return undefined;
            if (_enum.constructor !== Object) throw "Error Parsing Enum";
            enums[enumPath] = _enum = new collection.List(EnumValue, gen(_enum));
            _enum.Freeze();
        }
        return _enum;
    }
    function gen(_enum) {
        var o = [];
        for (var i in _enum)
            if (isNaN(parseFloat(i)))
                o.push(new basic.EnumValue(i, _enum[i]));
        return o;
    }
    var t = /@([a-zA-Z][a-zA-Z\d\.]*)/mgi;
    export interface SIndex {
        Name: string;
        Index: number;
    }
    export function CompileString(s: string, getString?: (value: any, param: any) => string, params?: any) {
        return StringCompile.Compile(s, getString, params);
    }
    export class CodeCompiler {
        private script: IReg[] = [];        
        constructor() {
            this.OnFnSuccess = this.OnFnSuccess.bind(this);
        }
        
        private toRegString(s: string) {
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                var cc = s[i];
                if (cc === '"' || cc === '\'') {
                    rs += "\\" + cc;
                }
                else rs += cc;
            }
            return rs;
        }
        private static params = ["$ovalue", "$value", "$scope", "$dom", "$job", "$fn"];
        public generateFn(stack: (string | Parser. ICode)[], hasNoReturn?: boolean) {
            var strs = new Array(stack.length);
            var hasCode = false;
            for (var i = 0; i < stack.length; i++) {
                var s = stack[i];
                if (typeof s === 'string')
                    strs[i] = '"' + this.toRegString(s) + '"';
                else {
                    hasCode = true; strs[i] = s.Code;
                }
            }
            var fn = strs.join(" + ");
            if (!hasNoReturn) fn = "return " + fn;
            var reg = internal.getExpression(fn, CodeCompiler.params, this.OnFnSuccess, this, true);
            this.script.push(reg);
            reg.IsString = !hasCode;
            return reg;
        }

        private _push(code: string) {
            var hasNoReturn = true;
            if (code[0] === "=") hasNoReturn = false, code = code.substr(1);
            return this.generateFn(Parser. StringTemplate.Compile(code), hasNoReturn);
        }
        public push(code: string | string[]) {
            if (typeof code === "string") return this._push(code);
            var ret = new Array(code.length);
            for (var i = 0; i < code.length; i++)
                ret[i] = this._push(code[i]);
            return ret;
        }
        public Compile() {
            var code = new Array(this.script.length)
            for (var i = 0; i < code.length; i++)
                code[i] = this.script[i].code;
            EvalCode.Compile(code.join('\r\n'), this._onload, this._onerror, this);
        }
        public reset() { this.script.length = 0; }
        private _onload(t: this) {
            t.onload && t.onload(t);
        }
        private _onerror(t: this) {
            t.onerror && t.onerror(t);
        }
        private OnFnSuccess(fn: Function, t: IReg) {
            helper.TryCatch(this, this.onFnLoad, void 0, [fn, t]);
        }
        public onFnLoad: (fn: Function, t: IReg) => void;
        public onload: (t: this) => void;
        public onerror: (t: this) => void;

        public remove(t: IReg) {
            var i = this.script.indexOf(t);
            if (i !== -1) this.script.splice(i, 1);

        }
        
    }
    export class EvalCode {
        /** @param {string} code*/
        /**@param {function} callback*/
        /** @returns {void} */

        static Compile(code: string, callback?: Function, onerror?: Function, stat?) {
            var b = new Blob([code], { type: "text/javascript" });
            var scrpt = document.createElement('script');
            scrpt.src = (URL as any).createObjectURL(b, { oneTimeOnly: true });
            scrpt.addEventListener('load', function () {
                ('msClose' in b) && (b as any).msClose();
                document.head.removeChild(scrpt);
                callback && callback(stat);
            });
            scrpt.addEventListener('error', (e) => {
                ('msClose' in b) && (b as any).msClose();
                document.head.removeChild(scrpt);
                onerror && onerror(stat);
            });
            document.head.appendChild(scrpt);
        }
        /** @param {string} code*/
        /**@param {function} callback*/
        /**@param {Array<string>} params*/
        /** @returns {void} */

        static CompileExpression(expression: string, params: string[], callback?: (exprFn: Function, stat: any) => void, stat?: any, exludeReturn?: boolean) {
            var code: IReg = internal.getExpression(expression, params, callback, stat, exludeReturn);
            var b = new Blob([code.code], { type: "text/javascript" });
            var url = (URL as any).createObjectURL(b, { oneTimeOnly: true });
            var scrpt = document.createElement('script');
            scrpt.src = url;
            scrpt.addEventListener('load', function () {
                ('msClose' in b) && (b as any).msClose();
                document.head.removeChild(scrpt);
            });
            document.head.appendChild(scrpt);
        }
    }
    export interface IReg {
        name: string;
        stat?: any;
        callback: (exprFn: Function, IReg: this) => void;
        onError?: (stat: any) => void;
        code: string;
        evalCode?: Function;
        IsString?: boolean;
    }
    namespace internal {
        var reg: { [s: string]: IReg } = {};
        var i = 0;
        function register(rg: IReg) {
            if (reg[rg.name]) console.error("Duplicated ExprFn Occurred {}");
            reg[rg.name] = rg;
        }
        function defineExpression(name, expr) {
            var rg = reg[name];
            delete reg[name];
            rg.evalCode = expr;
            if (rg.callback)
                rg.callback(expr, rg);
        }
        export function getExpression(expression: string, params: string[], callback: (exprFn: Function, stat: any) => void, stat?: any, exludeReturn?: boolean) {
            var _expressionName = "$$__exprFn__" + i++;
            var _params = params.join(',');
            var code = "window.defineExpression('" + _expressionName + "', function (" + _params + ") { " + (exludeReturn ? "" : " return ") + expression + "; });";
            var rg: IReg = {
                name: _expressionName,
                callback: callback,
                stat: stat,
                code: code
            };
            register(rg);
            return rg;
        }
        __corelib__.$defineProperty(window, "defineExpression", { get: () => { return defineExpression; }, set: () => { }, configurable: false, enumerable: false });
    }
    export class StringCompile {

        constructor(protected indexer: (string | SIndex)[], private getString: (name: string, value: any) => string, public params: any) {
            this.onDataChanged = this.onDataChanged.bind(this);
        }
        private static generateIndexer(s, array: SIndex[]) {
            var x: (string | SIndex)[] = [];
            var lcur = 0;
            for (var i = 0; i < array.length; i++) {
                var n = array[i];
                var l = n.Index - lcur;
                if (l > 0)
                    x.push(s.substr(lcur, l));
                x.push(n);
                lcur = n.Index + n.Name.length + 1;
            }
            l = s.length - lcur;
            if (l > 0)
                x.push(s.substr(lcur, l));
            return x;
        }
        public static Compile(s: string, getString?: (name: string, value: any) => string, params?: any) {
            var rslt: RegExpExecArray;
            var array: SIndex[] = [];
            while (rslt = t.exec(s))
                array.push(<SIndex>{ Name: rslt[1], Index: rslt.index });
            return new StringCompile(this.generateIndexer(s, array), getString, params);
        }

        public apply(data: any): string {
            var a = this.indexer.slice();
            for (var i = 0; i < a.length; i++) {
                var t = a[i] as SIndex;
                if (typeof t !== 'string')
                    a[i] = this.getString ? this.getString(t.Name, data[t.Name]) : String(data[t.Name]);
            }
            return String.prototype.concat.apply("", a);
        }
        public bind(data: bind.DObject) {
            var ld = this.data;
            if (ld)
                ld.removeListener(this.onDataChanged);
            if (data)
                data.addListener(this.onDataChanged);
            this.data = data;
            return this.onDataChanged(null);
        }
        private data: bind.DObject;
        private onDataChanged(ev: bind.EventArgs<any, any>): void {
            var a = this.indexer.slice();
            for (var i = 0; i < a.length; i++) {
                var t = a[i] as SIndex;
                if (typeof t !== 'string')
                    a[i] = this.data[t.Name] || "";
            }
            return this.Value = String.prototype.concat.apply("", a);
        }
        public Value: string;
    }

    export interface Stat {
        Data: any;
        Back();
        Go();
        Forward();
    }
    export class History {
        private index: number = -1;
        private stats: Stat[] = [];
        public Push(stat: Stat) {
            this.stats.splice(this.index + 1, 0, stat);
        }
        public goBack() {
            var c = this.Current;
            c.Back();
            this.Index--;
            var c = this.Current;
            if (c) c.Go();
        }
        public goForward() {
            var c = this.Current;
            if (c)
                c.Forward();
            this.Index++;
            var c = this.Current;
            if (c) c.Go();
        }
        public get Current() { return this.stats[this.index]; }
        private set Index(i: number) {
            if (i < 0) this.index = -1;
            else if (i >= this.stats.length) this.index = this.stats.length - 1;
            else this.index = i;
        }
        private get Index() { return this.index; }
    }

    export namespace Routing {
        export namespace history {
            export var supported = !!(window.history && window.history.pushState);
            export var fallback: null;
            export var initial = {
                popped: <boolean>null,
                URL: <string>null
            };
            // Empty container for "Initial Popstate" checking variables.
            export function pushState(state, title, path) {
                if (history.supported) {
                    if (Path.dispatch(path)) {
                        history.pushState(state, title, path);
                    }
                } else {
                    if (history.fallback) {
                        window.location.hash = "#" + path;
                    }
                }
            }
            export function popState(event) {
                var initialPop = !history.initial.popped && location.href == history.initial.URL;
                history.initial.popped = true;
                if (initialPop) return;
                Path.dispatch(document.location.pathname);
            }
            export function listen(fallback) {
                history.supported = !!(window.history && window.history.pushState);
                history.fallback = fallback;
                if (history.supported) {
                    history.initial.popped = ('state' in window.history), history.initial.URL = location.href;
                    window.onpopstate = history.popState;
                } else {
                    if (history.fallback) {
                        for (var route in Path.routes.defined) {
                            if (route.charAt(0) != "#") {
                                Path.routes.defined["#" + route] = Path.routes.defined[route];
                                Path.routes.defined["#" + route].path = "#" + route;
                            }
                        }
                        Path.listen();
                    }
                }
            }
        }
        export namespace Path {
            export function map(path) {
                if (Path.routes.defined.hasOwnProperty(path)) {
                    return Path.routes.defined[path];
                } else {
                    return new Path.core.route(path);
                }
            }
            export function root(path) {

                Path.routes.root = path;
            }
            export function rescue(fn) {
                Path.routes.rescue = fn;
            }
            export function match(path: string, parameterize?: any) {
                var params = {}, route = null, possible_routes, slice, i, j, compare;
                for (route in Path.routes.defined) {
                    if (route !== null && route !== undefined) {
                        route = Path.routes.defined[route];
                        possible_routes = route.partition();
                        for (j = 0; j < possible_routes.length; j++) {
                            slice = possible_routes[j];
                            compare = path;
                            if (slice.search(/:/) > 0) {
                                for (i = 0; i < slice.split("/").length; i++) {
                                    if ((i < compare.split("/").length) && (slice.split("/")[i].charAt(0) === ":")) {
                                        params[slice.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                                        compare = compare.replace(compare.split("/")[i], slice.split("/")[i]);
                                    }
                                }
                            }
                            if (slice === compare) {
                                if (parameterize) {
                                    route.params = params;
                                }
                                return route;
                            }
                        }
                    }
                }
                return null;
            }
            export function dispatch(passed_route: string) {
                var previous_route, matched_route;
                if (Path.routes.current !== passed_route) {
                    Path.routes.previous = Path.routes.current;
                    Path.routes.current = passed_route;
                    matched_route = Path.match(passed_route, true);

                    if (Path.routes.previous) {
                        previous_route = Path.match(Path.routes.previous);
                        if (previous_route !== null && previous_route.do_exit !== null) {
                            previous_route.do_exit();
                        }
                    }

                    if (matched_route !== null) {
                        matched_route.run();
                        return true;
                    } else {
                        if (Path.routes.rescue !== null) {
                            Path.routes.rescue();
                        }
                    }
                }
            }
            export function listen() {
                var fn = function () { Path.dispatch(location.hash); }

                if (location.hash === "" && Path.routes.root !== null)
                    location.hash = Path.routes.root;

                // The 'document.documentMode' checks below ensure that PathJS fires the right events
                // even in IE "Quirks Mode".
                if ("onhashchange" in window && (!(document as any).documentMode || (document as any).documentMode >= 8)) {
                    var cc = Object.getOwnPropertyDescriptor(window, 'onhashchange');
                    __corelib__.$defineProperty(window, 'onhashchange', { set: function (v) { cc.set.call(this, fn); }, get: function () { return fn; }, configurable: false, enumerable: false });

                    var cc = Object.getOwnPropertyDescriptor(window, 'onpopstate');
                    __corelib__.$defineProperty(window, 'onpopstate', { set: function (v) { cc.set.call(this, fn); }, get: function () { return fn; }, configurable: false, enumerable: false });

                } else {
                    setInterval(fn, 50);
                }

                if (location.hash !== "") {
                    Path.dispatch(location.hash);
                }
            }
            export namespace core {
                export class route {
                    action = null;
                    do_enter = [];
                    do_exit = null;
                    params = {};
                    constructor(public path: string) {
                        Path.routes.defined[path] = this;
                    }
                    to(fn) {
                        this.action = fn;
                        return this;
                    }
                    enter(fns) {
                        if (fns instanceof Array) {
                            this.do_enter = this.do_enter.concat(fns);
                        } else {
                            this.do_enter.push(fns);
                        }
                        return this;
                    }
                    exit(fn) {
                        this.do_exit = fn;
                        return this;
                    }
                    partition() {
                        var parts = [], options = [], re = /\(([^}]+?)\)/g, text, i;
                        while (text = re.exec(this.path)) {
                            parts.push(text[1]);
                        }
                        options.push(this.path.split("(")[0]);
                        for (i = 0; i < parts.length; i++) {
                            options.push(options[options.length - 1] + parts[i]);
                        }
                        return options;
                    }
                    run() {
                        var halt_execution = false, i, result;

                        if (Path.routes.defined[this.path].hasOwnProperty("do_enter")) {
                            if (Path.routes.defined[this.path].do_enter.length > 0) {
                                for (i = 0; i < Path.routes.defined[this.path].do_enter.length; i++) {
                                    result = Path.routes.defined[this.path].do_enter[i].apply(this, null);
                                    if (result === false) {
                                        halt_execution = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (!halt_execution) {
                            Path.routes.defined[this.path].action();
                        }
                    }
                }
            }
            export var routes = {
                'current': null,
                'root': null,
                'rescue': null,
                'previous': null,
                'defined': {},

            }
        };
    }



    export interface IUrl {
        moduleType: ModuleType;
        IsExternal: boolean;
        host: string;
        path: string[];
        moduleName: string;
        ext: string;
        isAsset: boolean;
        params: string;
        getEName(defaultExt?: string): string;
        IsInternal: boolean;
        FullPath: string;
    }
    export class Url implements IUrl {
        private _path: string[];
        moduleType: ModuleType;
        host: string;
        moduleName: string;
        ext: string;

        getEName(defaultExt?: string): string {
            if (this.IsFolder) return "";
            var defaultExt = this.ext ? this.ext : this.moduleType >= 0 ? ModuleExt[this.moduleType] || defaultExt : defaultExt;

            var s = this.moduleName;
            if (defaultExt) s += "." + defaultExt;
            if (this.params) s += "?" + this.params;
            return s;
        }

        params: string;
        IsFolder: boolean;
        constructor(url?: string) {
            if (url)
                this.init(url);
        }

        public toString() {
            var s = "";
            if (this.IsExternal)
                s = this.host;
            s += "/";
            if (this.path.length > 0)
                s += this.path.join('/') + '/';
            s += this.getEName();
            return s;
        }

        private init(url: string) {
            url = url.toLowerCase().trim();
            var i = url.indexOf('|');
            if (i !== -1) {
                this.moduleType = ModuleType[url.substr(0, i)];
                url = url.substr(i + 1);
            }
            if (url.indexOf('//') === 0)
                [this.host, this.path] = Url.getHost(url = url.substr(2));
            else
                [this.host, this.path] = Url.getFullHost(url);
            var lp = this.path.pop();
            if (lp) {
                this.IsFolder = false;
                var iq = lp.indexOf('?');
                var ename = iq === -1 ? lp : lp.substr(0, iq);
                if (iq == -1) this.params = "";
                else this.params = lp.substr(iq + 1);
                iq = iq === -1 ? lp.length - 1 : i;
                var iext = ename.lastIndexOf('.');

                if (iext !== -1) {
                    this.ext = ename.substr(iext + 1);
                    this.moduleName = ename.substr(0, iext);
                } else {
                    this.moduleName = ename;
                }
            } else {
                this.IsFolder = true;
                this.moduleType = ModuleType.folder;
            }

            if (this.moduleType == undefined)
                this.moduleType = !this.ext ? ModuleType.code : (ModuleType[ModuleType[ModuleExt[this.ext]]]);
            if (this.moduleType === undefined && this.ext)
                this.moduleType = ModuleType.uknown;
            return this;
        }
        static getHost(url: string): [string, string[]] {
            var i = url.indexOf('://');
            var pi = url.indexOf('/');
            if (pi < i) {
                path = url.split('/');
                if (pi === 0) path.shift(), host = Url.rootUrl.host;;
                return [host, path];
            }
            if (i === -1) throw " Invalid Url ";
            var s = url.indexOf('/', i + 3);
            var host = s === -1 ? url : url.substr(0, s);
            var path = s === -1 ? [""] : url.substr(s + 1).split('/');
            return [host, path];
        }
        static getFullHost(url: string): [string, string[]] {
            var i = url.indexOf('://');
            var pi = url.indexOf('/');
            if (i === -1 || pi < i) {
                path = url.split('/');
                if (pi === 0) path.shift(), host = Url.rootUrl.host;;
            }
            else {
                var s = url.indexOf('/', i + 3);
                var host = s === -1 ? url : url.substr(0, s);
                var path = s === -1 ? [""] : url.substr(s + 1).split('/');
            }
            return [host, path];
        }
        public Combine(path: string | Url) {
            var t = typeof path === 'string' ? new Url(path) : path;
            if (t.IsExternal)
                return t;
            var c = new Url();
            c.host = this.host;
            c.path = this.path == null ? t.path : t.path == null ? null : this.path.concat(t.path);
            c.moduleType = t.moduleType;
            c.moduleName = t.moduleName;
            c.ext = t.ext;
            c.params = t.params;
            return c;
        }


        get IsExternal(): boolean { return this.host != null && this.host != ""; }
        get isAsset(): boolean { return this.moduleType !== ModuleType.code; }
        get path() { return this._path; }
        set path(v: string[]) { Url.RevalidatePath(v, this.IsExternal); this._path = v; }
        get FullPath() { return this.toString(); }
        public SameHostAs(url: Url) {
            var h1 = this.IsExternal ? this.host : Url.rootUrl.host;
            var h2 = url.IsExternal ? url.host : Url.rootUrl.host;
            return h1 === h2;
        }
        static RevalidatePath(ary: string[], isFullPath?: boolean) {
            if (!ary) return;
            let i;
            let part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (isFullPath) {
                        if (i == 0) {
                            ary.splice(i, 1);
                            i -= 1;
                        } else {
                            ary.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                    else if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        public intersect(url: Url): Url {
            if (!this.SameHostAs(url)) return null;
            var c = new Url();
            c.host = this.host;
            return c;
        }
        public get IsInternal(): boolean {
            return this.IsExternal ? Url.rootUrl.SameHostAs(this) : true;
        }
        public static rootUrl = new Url(document.location.href);
    }

}

export namespace query {
    export declare type selector = (t: _$, node: Node, param) => boolean;
    export interface _$ {
        detach(): this;
        insertBefore(thisDom: Node): this;
        insertAfter(thisDom: Node): this;
        children(selector: selector, param): __;
        removeChildren(selector: selector, param): this;
        find(selector: selector, param): __;
        add(dom: Node | Node[]);
        toggleClass(calssName: string);
        siblings(selector: selector, param): __;
        appendTo(dom: Node);
        length: number;
        submit();
        parent(selector: selector, param): _$;
        hasClass(className: string): boolean;
        removeClass(className: string): this;
        addClass(className: string): this
        eq(n: number): _$;
        toArray(): Node[];
    }

    export function hasClass(t: _$, d: Node, param: string) {
        return d instanceof Element && d.classList.contains(param);
    }
    export function hasTag(t: _$, d: Node, param: string) {
        return d instanceof Element && d.tagName === param.toUpperCase();
    }
    function insertAfter(newNode: Node, referenceNode: Node) {
        var next = referenceNode.nextSibling;
        if (next)
            referenceNode.parentNode.insertBefore(newNode, next);
        else referenceNode.parentNode.appendChild(newNode);
    }
    export class __ implements _$ {

        eq(n: number): _$ {
            var d = n < 0 ? this.dom[this.dom.length - n] : this.dom[n];
            if (d) return new _(d);
            return new ___();
        }

        removeClass(className: string): this {

            for (var i = 0; i < this.dom.length; i++) {
                var d = this.dom[i];
                if (d instanceof Element) d.classList.remove(className);
            }
            return this;
        }
        addClass(className: string): this {

            for (var i = 0; i < this.dom.length; i++) {
                var d = this.dom[i];
                if (d instanceof Element) d.classList.add(className);
            }
            return this;
        }

        hasClass(className: string): boolean {
            for (var i = 0; i < this.dom.length; i++) {
                var cd = this.dom[i];
                if (cd instanceof Element)
                    if (cd.classList.contains(className)) return true;
            }
            return false;
        }
        parent(selector: selector, param): _$ {
            if (this.dom.length == 1) return new _(this.dom[0]).parent(selector, param);
            else if (this.dom.length === 0) return new ___();
            throw null;
        }
        submit() {

            for (var i = 0; i < this.dom.length; i++) {
                var cd = this.dom[i];
                if (cd instanceof HTMLFormElement)
                    cd.submit();
            }
        }
        siblings(selector: selector, param: any): __ {
            throw new Error("Method not implemented.");
        }
        appendTo(dom: Node) {
            throw new Error("Method not implemented.");
        }

        constructor(private dom: Node[]) { }
        public get length() { return this.dom.length; }
        public detach() {
            for (var i = 0; i < this.dom.length; i++) {
                var cd = this.dom[i];
                cd.parentNode.removeChild(cd);
            }
            return this;
        }
        public insertBefore(thisDom: Node) {
            for (var i = 0; i < this.dom.length; i++) {
                var cd = this.dom[i];
                if (cd != null) cd.parentNode.removeChild(cd);
                thisDom.parentElement.insertBefore(cd, thisDom);
            }
            return this;
        }
        public insertAfter(referenceNode: Node) {
            for (var i = 0; i < this.dom.length; i++) {
                var cd = this.dom[i];
                if (cd != null) cd.parentNode.removeChild(cd);
                insertAfter(cd, referenceNode);
            }
            return this;
        }
        public find(selector: selector, param) {
            var array = [];
            for (var i = 0; i < this.dom.length; i++) {
                var d = this.dom[i];
                var w = document.createTreeWalker(d, NodeFilter.SHOW_ALL, <any>{
                    param: param,
                    this: this,
                    acceptNode: function (node) {
                        return selector(this.this, node, this.param) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                }, false);
                while (w.nextNode()) array.push(w.currentNode);
            }
            return new __(array);
        }
        public children(selector: selector, param) {
            var r = [];
            for (var i = 0; i < this.dom.length; i++) {
                var d = this.dom[i];
                if (d instanceof Element)
                    for (var i = 0; i < d.children.length; i++) {
                        var t = d.children[i];
                        if (selector(this, t, param))
                            r.push(t);
                    }
            }
            return new __(r);
        }
        public removeChildren(selector: selector, param) {

            for (var i = 0; i < this.dom.length; i++) {
                var d = this.dom[i];
                if (d instanceof Element)
                    for (var i = 0; i < d.children.length; i++) {
                        var t = d.children[i];
                        if (selector(this, t, param)) {
                            d.removeChild(t);
                            i--;
                        }
                    }
            }
            return this;
        }

        public add(dom: Node | Node[]) {
            if (dom instanceof Array) {
                for (var i = 0; i < dom.length; i++)
                    this.dom.push(dom[i]);
            } else
                this.dom.push(dom);
            return this;
        }

        public toggleClass(className: string): this {
            var d = this.dom;
            for (var i = 0; i < d.length; i++) {
                var c = d[i];
                if (c instanceof Element)
                    if (c.classList.contains(className))
                        c.classList.remove(className)
                    else c.classList.add(className)
            }
            return this;
        }
        toArray(): Node[] {
            return this.dom;
        }
    }
    export class _ implements _$ {
        eq(n: number): _$ {
            if (n === 0 || n === -1) return this;
            return new ___();
        }

        hasClass(className: string): boolean {
            var cd = this.dom;
            if (cd instanceof Element)
                if (cd.classList.contains(className)) return true;
            return false;
        }
        parent(selector: selector, param: any): _$ {
            var t = this.dom.parentNode;
            while (t != document) {
                if (selector(this, t, param)) return new _(t);
                t = t.parentNode;
            }
            return new ___();
        }

        constructor(private dom: Node) { }
        public get length() { return 1; }

        submit() {
            var cd = this.dom;
            if (cd instanceof HTMLFormElement)
                cd.submit();
        }
        siblings(selector: selector, param): __ {
            var t: Node = this.dom;
            while (t.previousSibling) {
                t = t.previousSibling;
            }
            var arr = [];
            do {
                if (selector(this, t, param))
                    arr.push(t);
                t = t.nextSibling;
            } while (t);
            return new __(arr);
        }
        public detach() {
            if (this.dom.parentNode != null) this.dom.parentNode.removeChild(this.dom);
            return this;
        }
        public add(dom: Node | Node[]) {
            var array: Array<Node>;
            if (dom instanceof Array) {
                array = dom.slice();
                array.unshift(this.dom);
            } else array = [this.dom, dom];
            return new __(array);
        }
        public toggleClass(className: string) {
            var c = this.dom;
            if (c instanceof Element)
                if (c.classList.contains(className))
                    c.classList.remove(className)
                else c.classList.add(className)

        }
        public insertBefore(thisDom: Node) {
            if (this.dom.parentNode != null) this.dom.parentNode.removeChild(this.dom);
            thisDom.parentElement.insertBefore(this.dom, thisDom);
            return this;
        }
        public insertAfter(thisDom: Node) {
            if (this.dom.parentNode != null) this.dom.parentNode.removeChild(this.dom);
            insertAfter(this.dom, thisDom);
            return this;
        }
        public children(selector: selector, param) {
            var r = [];
            var d = this.dom;
            if (d instanceof HTMLElement)
                for (var i = 0; i < d.children.length; i++) {
                    var t = d.children[i];
                    if (selector(this, t, param))
                        r.push(t);
                }
            return new __(r);
        }
        public removeChildren(selector: selector, param) {
            var d = this.dom;
            if (d instanceof HTMLElement)
                for (var i = 0; i < d.children.length; i++) {
                    var t = d.children[i];
                    if (selector(this, t, param)) {
                        d.removeChild(t);
                        i--;
                    }
                }
            return this;
        }
        public appendTo(dom: Node) {
            this.detach();
            dom.appendChild(this.dom);
        }
        public find(selector: selector, param) {
            var array = [];
            var w = document.createTreeWalker(this.dom, NodeFilter.SHOW_ALL, <any>{
                param: param,
                this: this,
                acceptNode: function (node) {
                    return selector(this.this, node, this.param) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                }
            }, false);
            while (w.nextNode()) array.push(w.currentNode);
            return new __(array);
        }

        removeClass(className: string): this {
            var d = this.dom;
            if (d instanceof Element) d.classList.remove(className);
            return this;
        }
        addClass(className: string): this {
            var d = this.dom;
            if (d instanceof Element) d.classList.add(className);
            return this;
        }
        toArray(): Node[] {
            return [this.dom];
        }
    }


    class ___ implements _$ {
        eq(n: number): _$ {
            return this;
        }

        removeClass(className: string): this {
            return this;
        }
        addClass(classNm) { return this; }
        hasClass(className: string): boolean {
            return false;
        }
        detach(): this {
            return this;
        }
        insertBefore(thisDom: Node): this {
            return this;
        }
        insertAfter(thisDom: Node): this {
            return this;
        }
        children(selector: selector, param: any): __ {
            return new __([]);
        }
        removeChildren(selector: selector, param: any): this {
            return this;
        }
        find(selector: selector, param: any): __ {
            return new __([]);
        }
        add(dom: Node | Node[]) {
            return query.$$(dom);
        }
        toggleClass(calssName: string) {
            return this;
        }
        siblings(selector: selector, param: any): __ {
            return new __([]);
        }
        appendTo(dom: Node) {
            return this;
        }
        get length(): number { return 0; }
        submit() {
            return this;
        }
        parent(selector: selector, param: any): _$ {
            return this;
        }
        toArray(): Node[] {
            return [];
        }
    }



    export function $$(dom: Node | Node[]) {
        return dom instanceof Array ? new __(dom) : new _(dom);
    }
}

export function $$(dom: Node | Node[]) { return query.$$(dom); }

export namespace reflection {
    var _p=false;
    export interface ICallHistory {
        caller: any;
        arguments: any[];
        fn: Function;
    }
    export declare type Method<RET, T extends (...args: any[]) => RET> = MethodGroup<RET, T> | T | basic.ITBindable<T>;
    
    export class MethodGroup<RET,T extends (...args:any[]) => RET> implements basic.ITBindable<T> {
        private _list: Method<RET,T>[] = [];
        constructor(f?: Method<RET,T>, public Owner?: any) {
            if (f) this._list.push(f);
        }
        public Invoke: T;
        public add(m: T | Method<RET, T>) {
            this._list.push(m);
            return this;
        }
        public With(owner: any, ...args: any[]) {
            var x = this.Owner;
            this.Owner = owner;
            var r = helper.TryCatch<RET>(this, this.Invoke, void 0, args);
            this.Owner = x;
            return r;
        }
        public Clone(): MethodGroup<RET, T> {
            var t = new MethodGroup<RET, T>();
            t._list = this._list.slice();
            return t;
        }
    }
    MethodGroup.prototype.Invoke = function() {
        for (var i = 0; i < this._list.length; i++) {
            var f = this._list[i];
            var r;
            try {
                if (typeof f === 'function') {
                    r = f.apply(this.Owner, arguments);
                } else if (f instanceof MethodGroup)
                    r = f.Invoke.apply(f, arguments);
                else if ('Invoke' in f) {
                    r = f.Invoke.apply(f.Owner || this.Owner, arguments);
                }
            } catch (e) {

            }
        }
        return r;
    }
     
    export function ToMethodGroup<RET, T extends (...args: any[]) => RET>(x: Method<RET, T>) {
        if (x instanceof MethodGroup) return x;
        return new MethodGroup(x);
    }
    export function Invoke<RET, T extends (...args: any[]) => RET>(f: Method<RET, T>, owner: any, args: any[]): RET {
        var r: RET;
        try {
            if (typeof f === 'function') {
                r = f.apply(owner, args);
            } else if (f instanceof MethodGroup)
                r = f.Invoke.apply(f, args);
            else if ('Invoke' in f) {
                r = f.Invoke.apply(f.Owner || owner, args);
            }
        } catch (e) {

        }
        return r;
    }
    export interface IDebuggerInfo {
        obsArgs: boolean;
        Stack?: ICallHistory[];
        debug?: boolean;
        save?: boolean;
        callback?: Function;
        fn: Function;
        proxy?: Function;
        ReCalc?: (callHistory: ICallHistory | number, direct: boolean) => any;
    }
    var $slice = Array.prototype.slice;

    function ReCalc(callHistory, befor, direct) {
        if (!callHistory) callHistory = this.Stack[this.Stack.length - 1];
        if (typeof callHistory === 'number')
            var callHistory = this.Stack[callHistory];
        if (befor) befor.apply(callHistory.caller, callHistory.arguments);
        if (callHistory)
            return (direct ? this.fn : this.proxy).apply(callHistory.caller, callHistory.arguments);
    }
    function debug(dbgInfo, callback) {
        if (!dbgInfo.Stack) dbgInfo.Stack = [];
        dbgInfo.ReCalc = ReCalc;
        dbgInfo.proxy = function () {
            var args = $slice.call(arguments);
            if (dbgInfo.obsArgs !== false)
                for (var i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'function')
                        if (args[i].__isProxy)
                            debug({
                                save: dbgInfo.save,
                                callback: dbgInfo.callback,
                                obsArgs: dbgInfo.obsArgs,
                                Stack: dbgInfo.Stack,
                                fn: args[i],
                                ReCalc: ReCalc,
                                debug: false
                            }, (s) => { args[i] = s.proxy; });
                }
            if (dbgInfo.debug)
                stop();
            if (dbgInfo.save)
                dbgInfo.Stack.push({ caller: this, arguments: args, fn: dbgInfo.fn });
            if (dbgInfo.callback)
                dbgInfo.callback.apply(this, args);
            return dbgInfo.fn && dbgInfo.fn.apply(this, args);
        }
        dbgInfo.proxy.__isProxy = true;
        dbgInfo.proxy.__Fn = dbgInfo.fn;

        if (callback) callback(dbgInfo);
        //debug({ fn: XMLHttpRequest.prototype.send, debug: true }, (s) => { XMLHttpRequest.prototype.send = s.proxy as any; });
        return dbgInfo;
    }
    function debugObj(obj, stack) {
        for (var i in obj) {
            try {
                var v = obj[i];
            } catch (e) { continue; }
            if (typeof v === 'function')
                ((fName) => {
                    debug({ save: true, Stack: stack, fn: obj[fName], debug: false }, (s) => { obj[fName] = s.proxy; });
                })(i);
        }
    }

    export function isInstanceOfClassName(instance, className) {
        while ((instance = instance.__proto__)) {
            if (instance.constructor.name == className)
                return true;
        }
        return false;
    }
    export function isInstanceOfClass(instance, type) {
        while ((instance = instance.__proto__)) {
            if (instance.constructor === type)
                return true;
        }
        return false;
    }
    export function _isInstanceOf(type: Function, superType: Function): boolean {
        var t: any = type;
        while (type) {
            if (type == superType) return true;
            t = t.base;
        }
        return false;
    }

    export function GetBaseType(type) {
        if (type instanceof reflection.GenericType) {
            return (type as reflection.GenericType).GetBaseType();
        }
        var p = type.prototype.__proto__;
        if (p == null) return null;
        return p.constructor;
    }

    export function GetBaseTypes(type, totype?): typeof Object[] {
        var l = [];
        var pr = type.prototype;
        do {
            if (pr.constructor == totype) break;
            l.push(pr.constructor);
            pr = pr.__proto__;
        } while (pr !== null);
        return l;
    }

    export function IsInstanceOf(type, superType) {
        if (type === superType || superType === Object) return true;
        if (type.constructor == reflection.GenericType) type = (type as reflection.GenericType).Constructor;
        if (superType.constructor == reflection.GenericType) superType = (superType as reflection.GenericType).Constructor;

        var pr = type.prototype;
        do {
            if (pr.constructor === superType) return true;
            pr = pr.__proto__;
        } while (pr !== null);
        return false;
    }

    export class Type {
        private passed = [];
        type: Function;
        constructor(type) {
            this.type = type;
        }
        _getPath(root) {
            for (var i in root) {
                var v = root[i];
                if (this.passed.indexOf(v) !== -1) continue;
                this.passed.push(v);
                switch (typeof v) {
                    case 'string': case 'number': case 'boolean': case 'undefined': continue;
                    default:
                        if (v === this.type) { return i; }
                        if (v instanceof Function) continue;
                        var x = this._getPath(v);
                        if (x != null) return i + '.' + x;
                        break;
                }
            }
        }
        GetType(root) {
            if (this.passed == null) this.passed = [];
            this.passed.length = 0;
            return this._getPath(root);
        }
    }
    var _gtypes: collection.Dictionary<GenericType, Function>
    function gtypes() {
        return _gtypes || (_gtypes = new collection.Dictionary<GenericType, Function>("GTypes", true));
    }

    export class GenericType {
        public prototype;
        constructor(
            public Constructor: Function,
            public Params: Function[], base: Function) {
            //super();
            this.prototype = Constructor.prototype;
            if (!_p) throw this;
            gtypes().Set(this, base);
            _p = false;
        }

        public get base() { return gtypes().Get(this) }
        public GetBaseType() {
            return gtypes().Get(this);
        }
        public static GetType(type: Function, params?: Function[], checkOnly?: boolean, base?: Function): GenericType | Function {
            if (typeof type !== 'function') throw 'type must be fanction';
            if (params == null || params.length === 0) return type;
            var i = this.i(type);
            for (var i = gtypes().Count - 1; i >= 0; i--) {
                var e = gtypes().GetKeyAt(i);
                if (type == e.Constructor) {
                    if (params.length == e.Params.length) {
                        var p = e.Params;
                        for (var j = p.length - 1; j >= 0; j--) {
                            if (p[j] != params[j]) {
                                p = undefined; break;
                            }
                        }
                        if (p) return e;
                    }
                }
            }
            if (checkOnly) return
            _p = true;
            return new GenericType(type, params, base == null ? GetBaseType(type) : base);
        }

        private static i(f) { return f instanceof GenericType ? 1 : 0; }
        public static IsInstanceOf(type, superType) {
            return (this as any)._isInstanceOf[this.i(type) + this.i(superType) * 2](type, superType);
        }
        public static _isInstanceOf = [
            (type: Function, superType: Function) => {
                return IsInstanceOf(type, superType);
            },
            (type: Function, superGType: GenericType) => {
                return IsInstanceOf(type, superGType.Constructor);
            },
            (gtype: GenericType, superGType: GenericType) => {
                return IsInstanceOf(gtype.Constructor, superGType.Constructor);
            },
            (gtype: GenericType, superType: Function) => {
                return IsInstanceOf(gtype.Constructor, superType);
            }];
    }

    (<any>Function).prototype.IsInstanceOf = reflection.IsInstanceOf;

    export class DelayedType {
        get Type(): Function {
            return this._type();
        }
        private _type: () => Function;
        constructor(type: () => Function) {
            this._type = type;
        }
    };

    export namespace Observable {

        var events = [];
        export function observeProperty(obj, propName: string, evnt: string) {
            var c = Object.getOwnPropertyDescriptor(obj, propName);
            __corelib__.$defineProperty(obj, propName, {
                get: c.get,
                set: function (v) {
                    var oldValue = c.get.call(this);
                    if (v === oldValue) return;
                    c.set.call(this, v);
                    var event = events.length == 0 ? document.createEvent('Event') as any : events.pop();
                    event.initEvent(evnt, true, true);
                    event.oldValue = oldValue;
                    event.newValue = v;
                    dispatchEvent(new Event(evnt,<any> { bubbles: false, cancelable: true, scoped: false }));
                    if (this instanceof EventTarget)
                        this.dispatchEvent(event);
                    else dispatchEvent(event);
                    events.push(event);
                }
            });
        }

        export function setObservableProperty<T>(obj, propName: string, get: () => T, set: (val: T) => void, evnt: string) {
            __corelib__.$defineProperty(obj, propName, {
                get: get,
                set: function (v) {
                    var oldValue = get.call(this);
                    if (v === oldValue) return;
                    set.call(this, v);
                    var event = events.length == 0 ? document.createEvent('Event') as any : events.pop();
                    event.initEvent(evnt, true, true);
                    event.oldValue = oldValue;
                    event.newValue = v;
                    dispatchEvent(new Event(evnt, <any>{ bubbles: true, cancelable: true, scoped: true }));
                    if (this instanceof EventTarget)
                        this.dispatchEvent(event);
                    else dispatchEvent(event);
                    events.push(event);
                }
            });
        }

        __corelib__.$defineProperty(Node.prototype, 'value', { get: function () { return this.textContent; }, set: function (v) { this.textContent = v; } });

        observeProperty(Node.prototype, 'textContent', 'textContentChanged');

        export function ObjectToObservable(o: Object) {
            //o.get = function e() {
            //    var n: bind.DObject;n.get
            //}
        }
    }

    export function IsClass(obj: ObjectConstructor) {
        return obj && 'prototype' in obj && typeof obj === 'function';
    }
    export function IsPrototype(obj: any) {
        return typeof obj === 'object' && 'constructor' in obj && IsClass(obj.constructor) && !(obj instanceof obj.constructor);
    }
    export function IsInstance(obj: any) {
        return 'constructor' in obj && obj instanceof obj.constructor;
    }
}

namespace internal {
    export class __data {
        constructor(public name: string, public event: string, public delegate: EventListenerOrEventListenerObject) { }
    }
}

export namespace attributes {
    var _store = new Map();
    function getOrCreate(k) {
        var v = _store.get(k);
        if (typeof v === 'undefined') _store.set(k, v = []);
        return v;
    }
    function setDPValue(target: any, name: string, dpprop: bind.DProperty<any, any>) {
        Object.defineProperty(target, name, { value: dpprop, configurable: false, enumerable: false, writable: false });
    }
    export function property<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, Name?: string, changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void, check?: (e: bind.EventArgs<PropertyType, ClassType>) => void, attribute?: bind.PropertyAttribute, StaticName?: string) {
        return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
            if (!reflection.IsPrototype(target)) throw 'Invalid Implimentation of property Attribute';
            var x = getOrCreate(target.constructor);
            var y = bind.DObject.CreateField<any, any>(Name || propertyKey, type, defaultValue, changed, check, attribute);
            if (StaticName === void 0) StaticName = "DP" + (Name || propertyKey);
            if (StaticName) setDPValue(target.constructor, StaticName, y);
            x.push(y);
            type = void 0;
            defaultValue = void 0;
            changed = void 0;
            check = void 0;
        };
    }
    export function property1<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, options: { Name?: string, StaticName?: string, defaultValue?: PropertyType, changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void, check?: (e: bind.EventArgs<PropertyType, ClassType>) => void, attribute?: bind.PropertyAttribute }): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any {
        return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
            if (!reflection.IsPrototype(target)) throw 'Invalid Implimentation of property Attribute';
            var x = getOrCreate(target.constructor);
            var y = bind.DObject.CreateField<any, any>(options.Name || propertyKey, type, options.defaultValue, options.changed, options.check, options.attribute);
            if (options.StaticName === void 0) options.StaticName = "DP" + (options.Name || propertyKey);
            if (options.StaticName) setDPValue(target.constructor, options.StaticName, y);
            x.push(y);
            options = void 0;
        };
    }

    export function getProperties<classType>(type): bind.DProperty<any, classType>[] {
        type = reflection.IsClass(type) ? type : type.constructor;
        return getOrCreate(type);
    }
    export function Delete(type) {
        return _store.delete(type);
    }

    export function ComponentParser(
        tagName: string,
        createControl: (x: Processor.Tree, p: Processor.Instance) => Processor.Result,
        check?: (x: Processor.Tree, p: Processor.Instance) => boolean
    ) {
        Processor.Manager.registerComponent({
            name: tagName, execute: createControl, check: check, attribute: void 0
        });
        return void 0;
    }
}

export namespace bind {
    var jobs = {};
    export class Job implements basic.IJob {

        constructor(
            public Name: string,
            public Todo: (job: JobInstance, e: bind.EventArgs<any, any>) => void,
            public Check?: (job: JobInstance, e: bind.EventArgs<any, any>) => void,
            public OnError?: (job: JobInstance, e: bind.EventArgs<any, any>) => void,
            public OnInitialize?: (job: JobInstance, e: bind.EventArgs<any, any>) => void,
            public OnScopDisposing?: (job: JobInstance, e: bind.EventArgs<any, any>) => void

        ) {
            jobs[Name] = this;
        }
    }
    export class Jobs implements basic.IJob {
        public Todo(job: JobInstance, e: bind.EventArgs<any, any>): void {
        }
        public Check(job: JobInstance, e: bind.EventArgs<any, any>): void {
        }
        public OnError(job: JobInstance, e: bind.EventArgs<any, any>): void { }
        public OnInitialize(job: JobInstance, e: bind.EventArgs<any, any>): void { }
        public OnScopDisposing(job: JobInstance, e: bind.EventArgs<any, any>): void {
        }
        constructor(public Name: string) {
            jobs[Name] = this;
        }
        public push(jobName) {
        }
    }
    export class JobInstance implements EventListenerObject {
        public Control: UI.JControl;
        private _events: internal.__data[] = [];
        public Handle: (ji: JobInstance, e: Event) => void;
        public addEventListener(name: string, event: string, delegate: EventListenerOrEventListenerObject | any) {
            this._events.push(new internal.__data(name, event, delegate));
            (this.dom as HTMLElement).addEventListener(event, delegate);
        }
        public removeEventListener(name: string) {
            var t = this._events;
            for (var i = t.length - 1; i >= 0; i--) {
                var d = t[i];
                if (d.name == name) {
                    this.dom.removeEventListener(d.event, d.delegate);
                    t.splice(i, 1);
                    return;
                }
            }
        }
        public getEvent(name: string) {
            var t = this._events;
            for (var i = t.length; i >= 0; i--) {
                var d = t[i];
                if (d.name == name)
                    return d.delegate;

            }
            return null;
        }
        constructor(public Scop: bind.Scop, public job: basic.IJob, public dom: Node) {
            this.propb = Scop.OnPropertyChanged(bind.Scop.DPValue, this.ValueChanged, this);
        }

        private propb: PropBinding;
        private ValueChanged(s, e: bind.EventArgs<any, Scop>) {
            PaintThread.Push(this, e, s);
            //if (this.job != null && this.job.Todo != null)
            //    this.job.Todo(this, e);
        }
        public Dispose() {
            var dx = this.job.OnScopDisposing;
            if (dx != null) dx(this, null);
            var t = this._events;
            for (var i = t.length - 1; i >= 0; i--) {
                var d = t[i];
                this.dom.removeEventListener(d.event, d.delegate);
                t[i] = null;
            }
            this._events.splice(0);
            this._events = null;
            this._store = null;
            this.Checker = null;
            this.dom = null;
            this.Handle = null;
            this.job = null;
            this.Scop.removeEvent(bind.Scop.DPValue, this.propb);
            this.Scop = null;
            this.propb.Dispose();
            this.propb = null;
            this.IsDisposed = true;
        }
        public IsDisposed;
        public _store: any = {};
        public addValue(name: string, value: any) {
            this._store[name] = value;
        }
        public getValue(name: string) {
            return this._store[name];
        }

        public Checker: (value: any) => boolean;
        public Ischanging: boolean;
        handleEvent(e: Event) {
            if (this.Handle) this.Handle(this, e);
        }
    }
    export function GetJob(name: string): basic.IJob {
        var l = jobs[name];
        if (l == null) return Register(new Job(name, null, null, null, null, null));
        return l;
    };
    export function Register(job: basic.IJob, override?: boolean): basic.IJob {
        var l: Job = jobs[job.Name];
        if (l != null)

            if (override) {
                jobs[job.Name] = job;
                return job;
            } else
                return l;
        else return jobs[job.Name] = job;
    };

}


export namespace thread {

    //secured vars
    var isRunning = false;
    var id = -1;
    var stack: thread.IDispatcherCallback[] = [];
    var djobs: thread.IDispatcherCallback[] = [];
    var cj = 0;
    export interface IDispatcherCallback {
        callback: (delegate: (...param: any[]) => void, param: any, _this: any) => void;
        params: JobParam;
        _this: any;
        optimizable: boolean;
        isWaiting: boolean;
        id: number;
        children: IDispatcherCallback[];
        ce: number;
    };
    export class JobParam {
        public params: any[];
        constructor(public id: number, params?: any[]) {
            this.params = params || [];
        }
        public Set(...params: any[]) {
            let p;
            for (var i = params.length - 1; i >= 0; i--)
                if ((p = params[i]) === undefined) continue;
                else
                    this.params[i] = p;
            return this;
        }
        public Set1(params: any[]) {
            let p;
            for (var i = params.length - 1; i >= 0; i--)
                if ((p = params[i]) === undefined) continue;
                else
                    this.params[i] = p;
            return this;
        }
        public Clone() {
            var t = new JobParam(this.id);
            t.Set1(this.params);
            return t;
        }
    }
    var OnIdle: ({ owner: any, callback: () => void, once: boolean })[] = [];
    var isIdle: boolean;
    function asIdle() {
        isIdle = true;
        var idls = OnIdle.slice();
        var j = 0;
        for (var i = 0; i < idls.length; i++) {
            var t = idls[i];
            if (t.once) {
                OnIdle.splice(i - j, 1);
                j++;
            }
            helper.TryCatch(t.owner, t.callback);
        }
        isIdle = false;
        if (stack.length != 0) {
            clearTimeout(id);
            id = setTimeout((<any>Dispatcher).start, 1);
            isRunning = true;
        }
    }
    export class Dispatcher {
        public static OnIdle(owner: any, callback: () => void, once?: boolean) {
            if (isIdle || !isRunning)
                helper.TryCatch(owner, callback);
            else
                OnIdle.push({ owner: owner, callback: callback, once: once == true });
        }

        static InIdle() { return !isRunning; }
        static GC() {
            for (var i = 0, l = djobs.length; i < l; i++) {
                var c = djobs[i];
                c.children.length = 0;
                c.ce = 0;
            }
            stack.length = 0;
            cj = 0;
            asIdle();
        }
        static clone(ojob: IDispatcherCallback, params: any[], __this?: any) {
            var l = {
                callback: ojob.callback,
                _this: __this === undefined ? ojob._this : __this,
                id: ojob.id,
                isWaiting: true,
                optimizable: false,
                params: new JobParam(ojob.id).Set1(params || ojob.params.params)
            };
            ojob.children.push(l as thread.IDispatcherCallback);
            return l as IDispatcherCallback;
        }
        public static cretaeJob(delegate: (...param: any[]) => void, param: any[], _this: any, optimizable: boolean) {
            var t = {
                callback: delegate,
                params: new JobParam(djobs.length, param),
                _this: _this,
                optimizable: optimizable,
                isWaiting: false,
                id: djobs.length, children: [], ce: 0
            };
            djobs.push(t);
            return t.params;
        }
        public static Clear(o: JobParam) {
            var k = djobs[o.id];
            var pj = k.children;
            var ce = k.ce;
            var l = pj.length;
            for (var i = l - 1; i > ce; i--) {
                var c = pj[i];
                c.isWaiting = false;
                c.optimizable = true;
            }
            pj.length = 0;
            k.ce = 0;
        }
        public static get CurrentJob() {
            return stack[cj];
        }
        private static start() {
            isRunning = true;
            if (stack.length === 0) {
                isRunning = false;
                asIdle();
                return;
            }
            isIdle = false;
            var to = cj + Math.min(3, stack.length - cj);
            for (; cj < to; cj++) {
                var c = stack[cj];
                if (c.isWaiting)
                    helper.TryCatch(c._this, c.callback, void 0, c.params.params);
                if (!c.optimizable) {
                    var pj = djobs[c.id];
                    pj.ce++;
                }
                c.isWaiting = false;
                stack[cj] = null;
            }

            isRunning = cj < stack.length;
            if (isRunning)
                id = setTimeout(Dispatcher.start, 0);
            else Dispatcher.GC();

        }
        public static Push(ojob: JobParam, params?: any[], _this?: any) {
            var job = djobs[ojob.id];
            if (!job.optimizable)
                job = this.clone(job, params, _this);
            else {
                if (params)
                    job.params.Set(params);
                job._this = _this === undefined ? job._this : _this;
                if (job.isWaiting) { return; }
            }
            job.isWaiting = true;
            stack.push(job);
            if (!isRunning)
                if (stack.length > 0) {
                    clearTimeout(id);
                    id = setTimeout(Dispatcher.start, 0);
                    isRunning = true;
                    isIdle = false;
                }
            return job;
        }
        public static call(_this, fn: Function, ...args: any[]) {
            this.Push(delayedJob, [_this, fn, args]);
        }

        public static IsRunning() {
            return isRunning;
        }
    }
    var delayedJob = thread.Dispatcher.cretaeJob((context, fun: Function, args) => {
        fun.apply(context, args);
    }, [], null, false);
}

export namespace bind {

    export class DProperty<T, P> {
        Index: number;
        GType: reflection.GenericType;
        constructor(public Attribute: PropertyAttribute, public Name: string, public Type: GFunction, public DefaultValue?: T, public Changed?: (e: EventArgs<T, P>) => void, public Check?: (e: EventArgs<T, P>) => void) {
            if (Type instanceof reflection.GenericType)
                this.GType = Type as reflection.GenericType;
            this.RedifineChecker();
        }
        public get IsKey() {
            return (this.Attribute & PropertyAttribute.IsKey) === PropertyAttribute.IsKey;
        }
        private RedifineChecker() {
            switch (this.Type) {
                case reflection.GenericType:
                    this.checkType = this.isGenerictype;
                    break;
                case Object:
                    this.checkType = DProperty.isObject;
                    break;
                case String:
                    this.checkType = DProperty.isString;
                    break;

                case Number:
                    this.checkType = DProperty.isNumber;
                    break;

                case Boolean:
                    this.checkType = DProperty.isBoolean;
                    break;

                case reflection.DelayedType:
                    break;
                default:
                    if (this.Type.constructor == reflection.DelayedType)
                        break;
                    else if (this.Type.constructor === reflection.GenericType)
                        this.checkType = this.isGenerictype;
                    else
                        this.checkType = this._checkType;
                    break;
            }
        }
        public checkType(val: T): boolean {
            var t = <reflection.DelayedType>this.Type;
            this.Type = t.Type;
            if (this.Type instanceof reflection.GenericType)
                this.GType = this.Type as reflection.GenericType;
            this.RedifineChecker();
            return this.checkType(val);
        }
        public _checkType<T>(val: T): boolean {
            return val instanceof <Function>this.Type;
        }

        private isGenerictype<T>(val: T) {
            return val instanceof (<reflection.GenericType>this.Type).Constructor;
        }
        private static isObject<T>(val: T) {
            return true;
        }
        private static isString<T>(val: T) {
            return typeof val == 'string';
        }
        private static isNumber<T>(val: T) {
            return typeof val == 'number';
        }

        private static isBoolean<T>(val: T) {
            return typeof val == 'boolean';
        }
    }
    var _events: EventArgs<any, any>[] = [];
    export class EventArgs<T, P> implements basic.IDisposable {
        static New<T, P>(prop: DProperty<T, P>, ithis: P, _old: T, _new: T): EventArgs<T, P> {
            var _this = _events.length == 0 ? new EventArgs() : _events.pop();
            _this.prop = prop;
            _this.__this = ithis;
            _this._new = _new;
            _this._old = _old;
            return _this;
        }
        prop: DProperty<T, P>;
        __this: P;
        _old: T;
        _new: T;
        IsValid = true;
        public Dispose() {
            _events.push(this);
        }
    }
    export class Ref<T> {
        private _key: T;
        public get key(): T {
            return this._key;
        }
        public set key(v: T) {
            this._key = v;
        }
    }
    export class EventListener<T extends Function> implements basic.IDisposable {
        private _deleagtes: T[] = [];
        private key: Object = new Object();
        private isSingliton: boolean;
        constructor(key: any, isSingliton?: boolean) {
            this.key = key;
            this.isSingliton = isSingliton === true;
        }
        public set On(delegate: T) {
            this._deleagtes.push(delegate);
        }
        private locks: T[] = [];
        public set Off(delegate: T) {
            if (this.lock) { this.locks.push(delegate); return; }
            var i = this._deleagtes.indexOf(delegate);
            if (i == -1) return;
            this._deleagtes.splice(i, 1);
        }
        private lock: boolean = false;
        public Invoke(key: Object, params: any[]) {
            if (key != this.key || l <= 0) return;
            this.lock = true;
            var locks = this.locks;
            if (this.isSingliton) {
                while (this._deleagtes.length > 0)
                    helper.TryCatch(this, this._deleagtes.shift() as any, void 0, params);
                this.locks.length = 0;
            } else {
                for (var i = 0, l = this._deleagtes.length; i < l; i++)
                    helper.TryCatch(this, this._deleagtes[i] as any, void 0, params);
                this.lock = false;
                while (locks.length > 0)
                    this.Off = this.locks.pop();
            }
            this.lock = false;
        }
        public Invok(key: Object, callBack: (delegate: T) => any) {
            if (key != this.key || l <= 0) return;
            var lr;
            this.lock = true;
            var x = new Array(1);
            if (this.isSingliton) {                
                while (this._deleagtes.length > 0)
                    x[0] = this._deleagtes.shift(), helper.TryCatch(this, callBack, void 0, x);
                this.locks.length = 0;
            } else {
                for (var i = 0, l = this._deleagtes.length; i < l; i++)
                    x[0] = this._deleagtes[i], helper.TryCatch(this, callBack, void 0, x);
                this.lock = false;
                while (this.locks.length > 0)
                    this.Off = this.locks.pop();
            }
            this.lock = false;
            return lr;
        }
        public PInvok(key: Object, params: any[], owner?: any) {
            var l = this._deleagtes.length;
            if (key != this.key || l <= 0) return;
            var dlg = this._deleagtes.slice();
            var lr;
            if (this.isSingliton)
                this._deleagtes.length = 0;
            for (var i = 0; i < l; i++)
                lr = helper.TryCatch(owner, dlg[i] as any, void 0, params);
                //try { lr = dlg[i].apply(owner, params); } catch (e) { }
            this.locks.length = 0;
            return lr;
        }
        public Add(delegate: T, key?: any) {
            if (this._store == null) this._store = [];
            if (key !== undefined)
                this._store[key] = delegate;
            this._deleagtes.push(delegate);
        }
        public Remove(key: any) {
            if (this._store) {
                var d = this._store[key];
                delete this._store[key];
                this.Off = d;
            }
        }
        private _store: any[];
        public Dispose() {
            this.key = null;
            this.locks.length = 0;
            this.locks = null;
            if (this._store) { this._store.length = 0; this._store = null; }
            this._deleagtes.length = 0;
            this._deleagtes = null;
        }
    }

    export class FEventListener<T extends basic.Invoker<(...args: any[]) => void>> implements basic.IDisposable {
        private _deleagtes: T[] = [];
        private key: Object = new Object();
        private isSingliton: boolean;
        constructor(key: any, isSingliton?: boolean) {
            this.key = key;
            this.isSingliton = isSingliton === true;
        }
        public set On(delegate: T) {
            this._deleagtes.push(delegate);
        }
        public set Off(delegate: T) {
            var i = this._deleagtes.indexOf(delegate);
            if (i == -1) return;
            this._deleagtes.splice(i, 1);
            if (this.currentIndex != -1)
                if (i <= this.currentIndex) this.currentIndex--;
        }
        private currentIndex = -1;
        public PInvok(key: Object, params: any[], owner?: any) {
            if (this.currentIndex != -1) throw "";
            var l = this._deleagtes.length;
            if (key != this.key || l <= 0) return;
            var dlg = this._deleagtes.slice();
            var lr;
            for (this.currentIndex = 0; this.currentIndex < this._deleagtes.length; this.currentIndex++) {
                var fn = dlg[this.currentIndex] as any;
                var crnt;
                if (fn && typeof fn !== 'function') crnt = fn.Owner, fn = fn.Invoke;
                lr = helper.TryCatch(crnt || owner, fn, void 0, params);// fn.apply(crnt || owner, params);
            }

            if (this.isSingliton)
                this._deleagtes.length = 0;
            this.currentIndex = -1;
            return lr;
        }
        public Add(delegate: T, key?: any) {
            if (this._store == null) this._store = [];
            if (key != undefined)
                this._store[key] = delegate;
            this._deleagtes.push(delegate);
        }
        public Remove(key: any) {
            if (this._store) {
                var d = this._store[key];
                delete this._store[key];
                this.Off = d;
            }
        }
        private _store: any[];
        public Dispose() {
            this.key = null;
            if (this._store) { this._store.length = 0; this._store = null; }
            this._deleagtes.length = 0;
            this._deleagtes = null;
        }
    }

    export class PropBinding implements basic.IDisposable, basic.IDelegate {
        public IsWaiting: boolean;
        constructor(public Invoke: (sender: PropBinding, e: EventArgs<any, any>) => void, public Owner?: any) {

        }
        private _isIvnoked;
        handleEvent(e: EventArgs<any, any>) {
            if (this._isIvnoked) return;
            if (this.Invoke == null) return true;
            this._isIvnoked = true;
            helper.TryCatch(this.Owner || e.__this, this.Invoke, void 0, [this, e]);
            this._isIvnoked = false;
        }

        public Dispose() {
            this.Owner = null;
            this.Invoke = null;
        }
    }
    export class PropertyStore implements basic.IDisposable {
        public _bindings: Array<PropBinding>;
        public get InsBindings() { if (this._bindings === undefined) this._bindings = []; return this._bindings; }
        constructor(public Value?) {

        }
        public Dispose() {
            this.Value = null;
            if (this._bindings) {
                for (var i = this._bindings.length - 1; i >= 0; i--)
                    this._bindings[i].Dispose();
                this._bindings.length = 0
                this._bindings = null;
            }
        }
    }
    export enum PropertyAttribute {
        NonSerializable = 2,
        Private = 4,
        SerializeAsId = 8,
        IsKey = 16,
        Optional = 32,
    }
    export enum ObjectAttribute {
        NonSerializable = 2,
    }
    class TypesMap {
        public get length() { return this.Fields.length; }
        public Fields: DProperty<any, DObject>[] = [];
        constructor(public Base: TypesMap) {
            this.Fields = Base ? Base.Fields.slice(0) : [];
        }
        public GetField(name: string) {
            var f: DProperty<any, DObject>;
            if (this.Base) {
                f = this.Base.GetField(name);
                if (f) return f;
            }
            for (var i = 0; i < this.Fields.length; i++)
                if ((f = this.Fields[i]).Name == name) return f;

        }
    }

    export abstract class DObject implements basic.IDisposable {
        private static _dpStore: Array<TypesMap> = [];
        private static _isOpen: boolean = false;
        public GetType() { return (<any>this).constructor; }
        public static __fields__(): bind.DProperty<any, any>[] { return []; }
        public static __attributes__() {

        }
        public static get isOpen(): boolean {
            return this._isOpen;
        }
        public static GetProperty(type: Function, name: string) {
            var id = DObject.getId(type);
            var s = DObject._dpStore[id];
            var f = s.Fields;
            for (var i = f.length - 1; i >= 0; i--) {
                var p = f[i];
                if (p.Name == name) return p;
            }
        }
        public static GetDPropertyAt(type: Function, index: number): DProperty<any, any> {
            var map = DObject.register(type);
            //var id = DObject.getId(type);
            //var s = DObject._dpStore[id];
            return map.Fields[index];
        }
        public GetProperty(name: string) {
            var types = reflection.GetBaseTypes(this.constructor, DObject);
            for (var j = 0; j < types.length; j++) {
                var id = DObject.getId(types[j]);
                var tm = DObject._dpStore[id];
                if (tm) {
                    for (var i = tm.Fields.length - 1; i >= 0; i--) {
                        if (tm.Fields[i].Name == name) { return tm.Fields[i]; }
                    }
                }
            }
            return null;
        }
        ToJson(_context: encoding.SerializationContext, indexer?: encoding.IIndexer): Object {
            indexer = indexer == undefined ? _context.getJson(this) : indexer;
            indexer.valid = true;
            var json = indexer.json;
            for (var tm = DObject._dpStore[DObject.getId(this.constructor)].Fields, j = 0, l = tm.length; j < l; j++) {
                var prop = tm[j];
                if ((prop.Attribute & 2) === 2) continue;
                var v = this.get(prop) as basic.IId;
                if ((prop.Attribute & 8) == 8)
                    if (v && v.Id) {
                        json[prop.Name] = v.Id;
                        continue;
                    } else continue;
                json[prop.Name] = _context.ToJson(v);
            }
            return json;
        }

        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {
            if (json == null) return this;
            var ref = json['@ref'] as encoding.IRef;
            delete json['@ref'];
            if (ref)
                context.set(ref.__ref__, this);
            update = update || false;
            for (var tm = DObject._dpStore[DObject.getId(this.constructor)].Fields, j = 0, l = tm.length; j < l; j++) {
                var prop = tm[j];
                if ((prop.Attribute & 4) === 4) continue;
                var val = json[prop.Name];
                if (val === undefined) continue;
                context.FromJson(val, prop.Type as any, new encoding.Path(this, prop));
            }
            return this;
        }
        public static IsClass(x: any) {
            if (typeof x == "function") {
                if (x == (<any>DObject).IsClass.constructor) return false;
                return true;
            }
            return false;
        }

        public static CreateField<PropertyType, ClassType>(name: string, type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, changed?: (e: EventArgs<PropertyType, ClassType>) => void, check?: (e: EventArgs<PropertyType, ClassType>) => void, attribute?: PropertyAttribute) {
            if (type == null)
                type = Object;
            return new DProperty<PropertyType, ClassType>(attribute, name, type, defaultValue, changed, check);
        }
        private static typeCount = 0;
        private static getId(type: any) {
            if (type.hasOwnProperty("__id__")) return type.__id__;
            var val = ++DObject.typeCount;
            __corelib__.$defineProperty(type, "__id__", {
                value: val, writable: false, configurable: false, enumerable: false
            });
            return val;
        }

        private static _buildProperty(obj, propName: string) {
            var v = obj[propName];
            if (v != null) var t = v.constructor;
            else t = Object;
            return bind.DObject.CreateField(propName, t, v);
        }

        public IsPropertiesChanged(m: BuckupList<this>) {
            if (!m) return true;
            var t = m.values;
            var x = this.store;
            var c;
            for (var i = 0; i < x.length; i++)
                if (c = x[i])
                    if (c.Value !== t[i]) return true;
            return false;
        }

        public static ToDObject(obj: any, props: string[]) {
            if (obj instanceof this || obj.hasOwnProperty("__id__")) return obj;
            var type = obj.getType instanceof Function ? obj.getType() : obj.constructor;
            if (!type.hasOwnProperty("__id__"))
                __corelib__.$defineProperty(type, "__id__", {
                    value: -1, writable: false, configurable: false, enumerable: false
                });
            else if (type !== -1) throw "Invalid type";

            var flds = new Array<bind.DProperty<any, any>>(props.length);
            for (var i = 0; i < props.length; i++) {
                var dp = flds[i] = this._buildProperty(obj, props[i]);
                dp.Index = i;
                __corelib__. setProperty(obj, dp);
            }
        }

        private static register(type: any) {

            var id = DObject.getId(type);
            var x = DObject._dpStore[id];
            if (x != null) return x;
            var c = reflection.GetBaseTypes(typeof (type) === 'function' ? type : type.constructor, DObject);
            var u: TypesMap, lu: TypesMap;
            for (var i = c.length - 1; i >= 0; i--) {
                var bc = c[i];
                var id = DObject.getId(bc);
                u = DObject._dpStore[id];
                if (u == null) {
                    if (bc.hasOwnProperty('ctor'))
                        (bc as any).ctor();

                    if (bc.hasOwnProperty('_ctor'))
                        (bc as any)._ctor();
                    if (bc.hasOwnProperty('__fields__'))
                        var nld: () => DProperty<any, any>[] = bc["__fields__"];
                    else nld = null;

                    DObject._isOpen = true;
                    u = new TypesMap(lu);

                    var cnt = lu ? lu.length : 0;
                    var uf: bind.DProperty<any, any>[] = nld ? bc["__fields__"]() : [];
                    uf.push.apply(uf, attributes.getProperties(bc));
                    for (var j = 0; j < uf.length; j++) {
                        var dp = uf[j] as DProperty<any, DObject>;
                        if (u.GetField(dp.Name)) continue;
                        dp.Index = cnt + j;
                        if (!(dp.Type instanceof reflection.DelayedType))
                            Object.freeze(dp);
                        if (!bc.prototype.hasOwnProperty(dp.Name))
                           __corelib__. setProperty(bc, dp);
                        u.Fields.push(dp);
                    }
                    attributes.Delete(bc);
                    DObject._isOpen = false;
                    DObject._dpStore[id] = u;
                    Object.freeze(u);
                }
                lu = u;
            }
            return DObject._dpStore[id];
        }

        private store: PropertyStore[] = [];
        private __events__: typeof PropertyStore
        public getType() {
            return (<any>this).constructor;
        }

        constructor() {
            DObject.register(this.constructor);
        }
        public static getFieldsCount() {
            return this.register(this).Fields.length;
        }
        public static getFields(type?: Function) {
            return this.register(type || this).Fields;
        }


        protected _isFrozen: boolean;

        protected set<T>(prop: DProperty<T, this>, value: T, keepEvent?: boolean): void | EventArgs<T, this> {
            if (this._isFrozen) return;
            var ps = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
            var old = ps.Value;
            if (old === value) return;
            if (value != null)
                if (!prop.checkType(value))
                    throw { message: "Uncompatible type", this: this, property: prop, value: value };
            var ev = EventArgs.New(prop, this, <T>old, value);
            if (prop.Check)
                prop.Check.call(this, ev);
            if (old === ev._new || !ev.IsValid) return;
            ps.Value = ev._new;

            if (prop.Changed)
                prop.Changed.call(this, ev);
            this.onPropertyChanged(ev);
            if (keepEvent) return ev;
            ev.Dispose();
        }
        protected raise<T>(e: DProperty<T, this>) {
            var c = this.get(e);
            var ev = EventArgs.New(e, this, c, c);
            this.onPropertyChanged(ev);
        }
        protected get<T>(prop: DProperty<T, this>): T {
            var ps = this.store[prop.Index];
            return ps ? ps.Value as T : prop.DefaultValue;
        }
        protected GetValues() {
            return this.store.map((v, i, a) => v && v.Value);
        }

        public GetValue<T>(prop: DProperty<T, this>): T {
            var ps = this.store[prop.Index];
            return ps ? ps.Value as T : prop.DefaultValue;
        }
        public SetValue<T>(prop: DProperty<T, this>, p: T) {
            this.set(prop, p);
        }

        private _propertyChanged: ((ev: EventArgs<any, this>) => void)[] = [];
        public removeListener(v: (ev: EventArgs<any, this>) => void) {
            var x = this._propertyChanged.indexOf((<any>v).Ref);
            if (x !== -1)
                this._propertyChanged.splice(x, 1);
            else
                return false;
            return true;
        }

        public addListener(v: (ev: EventArgs<any, this>) => void) {
            if (this._propertyChanged.indexOf(v) !== -1) return false;
            this._propertyChanged.push(v);
            return true;
        }
        protected onPropertyChanged(ev: EventArgs<any, any>): void {
            for (var i = 0; i < this._propertyChanged.length; i++) {
                let dlg = this._propertyChanged[i];
                dlg(ev);attributes.property
            }
            var x: PropBinding[];
            if ((x = ((x = this.store[ev.prop.Index] as any) && (<any>x)._bindings)))
                for (var i = 0; i < x.length; i++)
                    if (x[i].handleEvent(ev)) {
                        x.splice(i, 1);
                        i--;
                    }
        }

        public Observe<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding {
            var ps:any = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
            ps.InsBindings.push(ps = new PropBinding(ev, owner));
            return ps;
        }
        public UnObserve<T>(prop: DProperty<T, this>, y: PropBinding | ((sender: PropBinding, ev: EventArgs<T, this>) => void), owner?: any) {
            var ps = this.store[prop.Index] && this.store[prop.Index]._bindings;
            var i: number;
            if (ps) {
                if (typeof y !== 'function') {                    
                    if ((i = ps.indexOf(y)) != -1)
                        return this._disposeProp(this.store[prop.Index], y, i);
                } else {
                    var t, j;
                    for (var i = ps.length - 1; i >= 0; i--) {
                        var p = ps[i];
                        if (p.Invoke === y) {
                            if (p.Owner === owner)
                                if (!this._disposeProp(this.store[prop.Index], p, i)) return true;
                            if (!t) t = p, j = i;
                        }
                    }
                    if (t)
                        return this._disposeProp(this.store[prop.Index], t, j);
                }
            }
            return false;
        }
        private _disposeProp<T>(prs: PropertyStore, t: PropBinding, index: number) {
            var ps = prs._bindings;
            t.Dispose();
            if (ps.length == 1) {
                prs._bindings = void 0;
                return false;
            }
            ps.splice(index, 1);
            return true;
        }
        OnPropertyChanged<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding {
            return this.Observe(prop, ev, owner);
        }
        public addEvent<T>(prop: DProperty<T, this>, b: PropBinding) {
            var ps: any = this.store[prop.Index] || (this.store[prop.Index] = new PropertyStore(prop.DefaultValue));
            ps.Bindings.push(b);
        }

        public removeEvent<T>(prop: DProperty<T, this>, y: PropBinding) {
            var ps = this.store[prop.Index] && this.store[prop.Index]._bindings;
            if (ps) {
                var i = ps.indexOf(y);
                if (i != -1) {
                    return this._disposeProp(this.store[prop.Index], y, i);
                    //y.Dispose();
                    //return ps.splice(i, 1);
                }
            }
            return null;
        }
        public get Disposed() { return this.store.length === 0; }
        protected DisposingStat: DisposingStat;
        protected OnDispose(): boolean {
            if (this.DisposingStat === 2) return null;
            var h = this.DisposingStat == 1;
            this.DisposingStat = 1;
            if (!h && this.OnDisposing)
                this._onDisposing.Invoke(0, [this]);
            return h;
        }
        public Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this._propertyChanged.length = 0;
            var t = DObject.getFields(this.GetType());
            //for (var i = 0; i < t.length; i++)
            //    this.set(t[i], undefined);
            for (var i = 0, l = this.store.length; i < l; i++)
                this.store[i] && this.store[i].Dispose();
            this.store.length = 0;
            if (!h) this.DisposingStat = 2;
        }
        private _onDisposing: bind.EventListener<(o: DObject) => void>;
        public set OnDisposing(v: (s: this) => void) { if (this._onDisposing === undefined) this._onDisposing = new bind.EventListener<(x: this) => void>(0, true); this._onDisposing.On = v; }
        public set OffDisposing(v: (s: this) => void) { if (this._onDisposing == undefined) return; this._onDisposing.Off = v; }
        public CloneTo(o: DObject) {
            o._propertyChanged = this._propertyChanged;
            o.addListener = this.addListener;
            o.store = this.store;
        }

        public Freeze() {
            this._isFrozen = true;
            //for (var i = this.store.length - 1; i >= 0; i--)
            //Object.freeze(this.store[i]);
            //Object.freeze(this.store);
        }
        public UnFreeze() {
            this._isFrozen = false;
            //for (var i = this.store.length - 1; i >= 0; i--)
            //Object.freeze(this.store[i]);
        }

        public IsFrozen() { return this._isFrozen; }
        public CreateBackup(OnUndo?: (self: this, bl: BuckupList<this>) => void) {
            var e: BuckupList<this>;
            __corelib__.backups.GetOrAdd(this.store, []).push(e = { OnUndo: OnUndo, values: this.store.map((p, i) => { return p.Value }) });
            return e;
        }
        public Commit(r?: BuckupList<any>) {
            var l = __corelib__.backups.Get(this.store);
            if (l == null || l.length === 0) return false;
            if (r) {
                var i = l.indexOf(r);
                if (i === -1) return;
                l.splice(i);
            } else l.pop();
        }
        public Rollback(b?: BuckupList<this>, walkTrougth?: boolean): boolean {
            if (b) return this.UndoTo(b, walkTrougth);
            var l = __corelib__.backups.Get(this.store);
            if (l == null || l.length === 0) return false;
            var x = l.pop();
            var ps = DObject._dpStore[(this.constructor as any).__id__];
            var c = x.values;
            for (var i = 0; i < c.length; i++)
                this.set(ps.Fields[i], c[i]);
            if (x.OnUndo) x.OnUndo(this, x);
            return true;
        }

        private UndoTo(b: BuckupList<this>, walkTrougth: boolean): boolean {
            var l = __corelib__.backups.Get(this.store);
            if (l == null || l.length === 0) return;
            var i = l.indexOf(b);
            if (i === -1) return false;
            var arr = l.splice(i, l.length - i);
            var ps = DObject._dpStore[(this.constructor as any).__id__];
            if (walkTrougth)
                for (var i = arr.length; i >= 0; i--) {
                    var x = arr[i];
                    var c = x.values;
                    for (var i = 0; i < c.length; i++)
                        this.set(ps.Fields[i], c[i]);
                }
            else {
                var x = arr[0];
                var c = x.values;
                for (var i = 0; i < c.length; i++)
                    this.set(ps.Fields[i], c[i]);
            }
            return true;
        }
    }


    export enum DisposingStat { None = 0, Disposing = 1, Disposed = 2 }
    export class XPath {
        Name: string;
        Property: bind.DProperty<any, DObject>;
        Value: any;
        Binding: bind.PropBinding;
        d: DObject;
        constructor(name: string) {
            this.Name = name;
        }
        public ListenTo(d: bind.DObject, callback: (sender: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any) {
            if (!this.Property && d instanceof bind.DObject) this.Property = d.GetProperty(this.Name);
            if (this.Property) {
                this.Binding != null && this.d && this.d.UnObserve(this.Property, this.Binding, owner);
                this.Binding = void 0;
                if (d) {
                    this.Value = d.GetValue(this.Property);
                    this.Binding = d.Observe(this.Property, callback, owner);
                }
            }
            else {
                this.Binding != null && this.d && injecter.unobserve(this.d, this.Name, this.Binding, owner);
                this.Binding = void 0;
                if (d && d.hasOwnProperty(this.Name))
                    this.Binding = injecter.observe(d, this.Name, callback, owner);
                d && (this.Value = d[this.Name]);
            }
            this.d = d;
        }

        public Dispose() {
            if (this.Property && this.d instanceof bind.DObject)
                this.Binding != null && this.d != null && this.d.UnObserve(this.Property, this.Binding);
            else this.Binding != null && this.d != null && injecter.unobserve(this.d, this.Name, this.Binding );
            this.Value = null;
            this.Binding = null;
        }
    }
    export class Observer extends bind.DObject {

        public static DPMe = bind.DObject.CreateField<any, Observer>("Me", Object, null, function (e) { this.Start(0); }, Observer.prototype.disposePath);
        public get Me(): any { return this.get<any>(Observer.DPMe); }
        public set Me(value: any) { this.set<any>(Observer.DPMe, value); }

        public static DPPath = bind.DObject.CreateField<string[], Observer>("Path", Array, null, Observer.prototype.rebuidPath);
        public get Path(): string[] { return this.get<string[]>(Observer.DPPath); }
        public set Path(value: string[]) { this.set<string[]>(Observer.DPPath, value); }

        public static DPValue = bind.DObject.CreateField<any, Observer>("Value", Object, null);
        public get Value(): any { return this.get<any>(Observer.DPValue); }
        public set Value(value: any) { this.set(Observer.DPValue, value); }

        public static __fields__() {
            return [
                Observer.DPMe, Observer.DPPath, Observer.DPValue
            ];
        }

        GenType() { return Observer; }

        public xpath: XPath[] = [];
        constructor(me: any, path: string[], private controller?: Controller) {
            super();
            this.Me = me;
            this.Path = path;
        }
        private calcPrefix(str:string) {
            switch (str) {
                case 'this':
                    return this.controller && this.controller.MainControll;
                case 'window': return bind.windowScop;
                default:
            }
        }
        private rebuidPath(e: bind.EventArgs<string[], this>) {
            var path = e._new;
            this.disposePath();
            this.xpath = new Array<XPath>(path.length);
            for (var i = 0; i < path.length; i++) {
                var p = path[i];
                this.xpath[i] = new XPath(p);
            }
            this.Start(0);
        }
        private disposePath() {
            let r = this.xpath;
            let l = r.length;
            for (let i = 0; i < l; i++) {
                var p = r[i];
                p.Dispose();
            }
            this.Value = null;
        }
        public getValue(l: number) {
            let t = this.Me;
            let r = this.xpath;
            for (let i = 0; i < l; i++) {
                var p = r[i];
                if (t == null) return null;
                if (p.Property)
                    t = t.get(p.Property);
                else
                    t = t[p.Name];
                p.Value = t;
            }
            return t;
        }

        
        private Start(i?: number) {
            if (i == void 0) i = 0;
            var r = this.xpath;
            let t = this.getValue(i);
            for (var j = i; j < r.length; j++) {
                var p = r[j];
                if (t) {
                    p.ListenTo(t, this.callMe, this);
                    t = p.Value;
                }
                else
                    p && p.Dispose();
            }
            this.Value = t;
        }

        public ESetValue(value: any) {
            var l = this.xpath.length;
            if (l < 1) return;
            var last = this.xpath[l - 1];
            var prevlast = l - 2 < 0 ? this.Me : this.xpath[l - 2].Value;
            if (prevlast)
                if (last.Property)
                    (prevlast as bind.DObject).SetValue(last.Property, value);
                else {
                    this.Value = value;
                    prevlast[last.Name] = value;
                }
        }
        private callMe(binding: bind.PropBinding, e: bind.EventArgs<any, any>) {
            for (var i = this.xpath.length - 1; i >= 0; i--) {
                var p = this.xpath[i];
                if (p.Binding == binding) {
                    this.Start(i + 1);
                    break;
                }
            }
            this.Value = this.getValue(this.xpath.length);
        }
        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            
            this.disposePath();
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }

    }

    export interface IJobScop {
        IsNew: boolean;
        Scop: Scop;
        Jobs: JobInstance[];
        Control: UI.JControl;
        dom?: Node;
        events?: bind.events
    }
    export enum ProcessStat {
        NotProcessed = 0,
        Processing = 1,
        Processed = 2,
    }

    export class Controller extends DObject implements basic.IDisposable {
        OnNodeLoaded(): any {
            this.ProcessBinding();
        }
        get MainControll(): UI.JControl { return this.JCParent[0]; }
        public static Attach(control: UI.JControl, data?: any | Scop) {
            var t = new Controller(control);
            t.Scop = data instanceof Scop || data == null ? data : new ValueScop(data);
            t.View = control.View;
            return t;
        }

        public getStat(): ProcessStat { return this._stat; };
        private set Stat(v: ProcessStat) {
            if (v <= this._stat) return;
            this._stat = v;
            if (v === 1 || v === 2)
                this.processEvent(v);
        }
        private _stat: ProcessStat = 0;
        public get processHowEver() { return false; }
        public set processHowEver(v) { }

        static __feilds__() { return [Controller.DPView]; }
        public static DPView = bind.DObject.CreateField<HTMLElement, Controller>("View", HTMLElement, null, (e) => e.__this.ViewChanged(e), (e) => e.__this.PDispose());
        public get View(): HTMLElement { return this.get<HTMLElement>(Controller.DPView); }
        public set View(value: HTMLElement) { this.set<HTMLElement>(Controller.DPView, value); }
        public JCParent: UI.JControl[] = [];

        private _onCompiled: basic.ITBindable<(t: this) => void>[] = [];
        public set OnCompiled(callback: basic.ITBindable<(t: this) => void>) {
            if (this._stat > 1)
                callback.Invoke.call(callback.Owner, this);
            else this._onCompiled.push(callback);
        }
        private _onCompiling: basic.ITBindable<(t: this) => void>[] = [];
        public set OnCompiling(callback: basic.ITBindable<(t: this) => void>) {
            if (this._stat > 0)
                callback.Invoke.call(callback.Owner, this);
            else this._onCompiling.push(callback);
        }
        private ViewChanged(e: bind.EventArgs<HTMLElement, Controller>) {
            var dom = e._new;
            var odom = e._old;
            if (dom === odom) return;
            if (odom)
                this.unlistenForNodeInsertion(odom), odom.removeAttribute('controlled');
            if (dom == null) return;
            dom.setAttribute('controlled', '');
            if (this.processHowEver || this.implemented(dom)) {
                this.Stat = 0;
                this.ProcessBinding();
            }
            else
                this.listenForNodeInsertion(dom);
        }

        unlistenForNodeInsertion(odom: Node, ndisp?: boolean) {
            if (!ndisp) this.PDispose();
            help.RemoveListener(odom);
        }
        private listenForNodeInsertion(dom: Node) {
            help.OnNodeInserted(this, dom);
        }
        private implemented(d: HTMLElement): boolean {
            return document.body.contains(d);
        }
        public handleEvent(e: Event) {
            var v = this.View;
            if (e.srcElement == e.target && e.currentTarget == v) {
                e.preventDefault();
                this.unlistenForNodeInsertion(v, true);
                this.ProcessBinding(e);
            }
        }
        private ProcessBinding(e?: Event) {
            if (this._stat) return;
            thread.Dispatcher.Push(Controller.explorerJob, [this]);
        }

        private static pb(t: Controller) {
            if (t._stat) return;
            t.Stat = 1;
            var root = Processor.Tree.Root(null, t.Scop, t.CurrentControl, t);
            helper.TryCatch(t, t.ParseBinding, void 0, [root.New(t.View)]);
            t.Stat = 2;
        }
        public Scop: Scop;
        public static explorerJob = thread.Dispatcher.cretaeJob(Controller.pb, [null], null, false);

        public get CurrentControl() { return this.JCParent[this.JCParent.length - 1]; }
        public instances: IJobScop[] = [];

        public CompileChild(dom: Node, scop: Scop, control: UI.JControl) {
            this.JCParent.push(control);
            var root = Processor.Tree.Root(null, scop, control, this);
            var t = this.ParseBinding(root.New(dom));
            this.JCParent.pop();
            return t;
        }

        private ParseBinding(data: Processor.Tree) {
            return Processor.MyClass.ParseBinding(data);
        }
        private processEvent(v: number) {
            var c = v === 1 ? this._onCompiling : this._onCompiled;

            var x = c.slice();
            c.length = 0;
            for (var i = 0; i < x.length; i++) {
                var t = x[i];
                helper.TryCatch(t.Owner, t.Invoke, void 0, [this]);
            }
        }
        constructor(cnt: UI.JControl) {
            super();
            if (cnt)
                this.JCParent.push(cnt);
        }
        PDispose() {
            var s: IJobScop;
            var j: bind.JobInstance;
            var v = this.View;
            if (v != null) {
                this.unlistenForNodeInsertion(v);
            }

            for (var i = 0, s = this.instances[0]; i < this.instances.length; ++i, s = this.instances[i]) {
                if (s.IsNew)
                    s.Scop.Dispose();
                for (var ii = 0, j = s.Jobs[0]; ii < s.Jobs.length; ii++ , j = s.Jobs[ii])
                    j.Dispose();
                s.Jobs = null;
                s.Scop = null;
            }
            this.Stat = 0;
            this.instances.length = 0;
        }
        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.PDispose();
            super.Dispose();
            if (!h) this.DisposingStat = 2;

        }
    }
}

export namespace utils {
    export interface Node<T> {
        Depth: number;
        Value: T;
        param?: any;
        children: Node<T>[];
        Parent: Node<T>;
    }

    export class Tree<T> {
        private dic = new collection.Dictionary<T, Node<T>>("nodes");
        constructor(private source: collection.List<T>, private getParent: (item: T) => T, listen: (base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void) {
            this.OnChange.On = listen;
            this.Reset();
        }
        Remove(c: T) {
            if (this.OnRemove(c))
                this.source.Remove(c);
        }
        Add(c: T) {
            this.OnAdd(c);
            this.source.Add(c);
        }
        Clear() {
            this.OnClear();
            this.source.Clear();
        }

        Reset() {
            this.OnClear();
            var e = this.source.AsList();
            for (var i = 0; i < e.length; i++)
                this.OnAdd(e[i]);
        }
        private OnAdd(target: T) {
            var parent = this.getParent(target);
            var node_parent;
            var node_target = this.dic.GetOrAdd(target, <any>{
                children: [], Value: target, Parent: null, get Depth(): number {
                    return this._depth ? this._depth : (this._depth = this.Parent ? this.Prent.Depth + 1 : 0);
                }
            });
            if (parent) {
                (node_parent = this.dic.GetOrAdd(parent, {
                    children: [], Value: parent, Parent: null, get Depth(): number {
                        return this._depth ? this._depth : (this._depth = this.Parent ? this.Prent.Depth + 1 : 0);
                    }
                })).children.push(node_target);
                node_target.Parent = node_parent;
            }
            this.OnChange.Invoke(this.source, [node_parent, node_target, true]);
        }
        public getNodes() { return this.dic.getValues(); }
        public getBases() {
            var t: Node<T>[] = [];
            var e = this.dic.getValues();
            for (var i = 0; i < e.length; i++)
                if (e[i].Parent == null)
                    t.push(e[i]);
            return t;
        }
        private OnRemove(item: T): boolean {
            var node_target = this.dic.Get(item), parent = this.getParent(item);
            if (node_target)
                if (node_target.children.length > 0)
                    return false;
                else
                    if (parent) {
                        var node_parent = this.dic.Get(parent);
                        var t = node_parent.children.indexOf(node_target);
                        if (t >= 0)
                            node_parent.children.splice(t, 1);
                    }
            this.OnChange.Invoke(this.source, [node_parent, node_target, false]);
            return true;
        }
        private OnClear() {
            this.OnChange.Invoke(this.source, []);
            this.dic.Clear();
        }
        public OnChange = new bind.EventListener<(base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void>(this.source);
    }
    export class RemoveRef<T> {
        public Ref: T;
        constructor(ref: T) {
            this.Ref = ref;
        }
    }



    export class ListEventArgs<P, T> implements basic.IDisposable {
        constructor(
            public oldItem: T,
            public newItem: T,
            public startIndex: P,
            public event: collection.CollectionEvent,
            public collection?: T[]
        ) { }
        public Dispose() {
            this.oldItem = null;
            this.newItem = null;
            this.startIndex = null;
            this.event = null;
        }
        public static get ResetEvent() {
            return this._r || (this._r = new ListEventArgs(null, null, 0, collection.CollectionEvent.Reset, []));
        }
        private static _r;
    }
    export interface IPatent<T> {
        Check(s: T): boolean;
        equals(p: IPatent<T>): boolean;
    }
    export abstract class Filter<T, P extends IPatent<T>> extends bind.DObject {
        protected _patent: P;
        public get Patent(): P | string { return this._patent; }
        protected abstract convertFromString(x: string): P;
        public abstract Begin(deb: number, count: number);
        public set Patent(p: P | string) {
            if (typeof p == 'string') v = this.convertFromString(p as any);
            var v: P = p as any;
            if (!v) {
                if (!this._patent) return;
                else if (this._patent.equals(null)) return;
            }
            else if (this._patent) { if (v.equals(this._patent)) return; }
            //else return;

            this._patent = v as P;
            var s = this._store;
            for (var i = 0; i < s.length; i++) {
                var e = s[i];
                e.callback(this, e.data);
            }
        }
        private _store: utils.filterCallback<T, P>[] = [];

        constructor() {
            super();
        }
        public OnChanged(callback: (filter: Filter<T, P>, data: any) => void, data: any, name?: string) {
            var t = new filterCallback(callback, data, name, Date.now());
            this._store.push(t);
            return t.id;
        }
        public OffChanged(name_id: string | number) {
            if (typeof (name_id) == 'string') {
                var name = name_id as string;
                var s = this._store;
                for (var i = s.length - 1; i >= 0; i--) {
                    var e = s[i]; if (e.name == name) { s.splice(i, 1); }
                }
            }
            else if (typeof (name_id) == 'number') {
                let id = name_id as number;
                var s = this._store;
                for (var i = s.length - 1; i >= 0; i--) {
                    var e = s[i]; if (e.id == id) { s.splice(i, 1); return; }
                }
            }
        }

        protected _ismath(str: string[]) {
            for (var i = 0; i < str.length; i++)
                if (str[i].indexOf(this._patent as any) !== -1) return true;

            return false;
        }
        public abstract IsMatch(index: number, item: T);
    }

    export class CostumeFilter<T, P extends IPatent<T>> extends Filter<T, P> {
        constructor(public _isMatch: (patent: P, item: T) => boolean) { super(); }
        public IsMatch(index: number, item: T): boolean {
            return this._isMatch == null ? true : this._isMatch(this._patent, item);
            
        }
        public convertFromString(x: string): P { return x as any as P; }
        public Begin(deb: number, count: number) { }
    }

    export class filterCallback<T, P extends IPatent<T>> {
        constructor(
            public callback: (filter: utils.Filter<T, P>, data: any) => void,
            public data: any,
            public name?: string, public id?: number) { if (id == void 0) id = Date.now(); }
    }
}

export namespace collection {

    export enum CollectionEvent {
        Added,
        Removed,
        Replace,
        Cleared,
        Reset,
        Setted
    }
    export declare type ListEventInvoker<T> = (e: utils.ListEventArgs<number, T>) => void;
    export declare type ListEventHandler<T> = ListEventInvoker<T> | (basic.ITBindable<ListEventInvoker<T>>);
    export declare type ListEventBindable<T> = basic.ITBindable<ListEventInvoker<T>>;

    export class List<T> extends bind.DObject {
        static __fields__(): any[] { return [List.DPCount]; }
        public static DPCount = List.CreateField<number, List<any>>('Count', Number, 0, null, null, 2);

        private UCount() { this.set(List.DPCount, this._list.length); }
        protected _list: T[] = [];
        public get ArgType() { return this.argType; }

        GetType(): Function | reflection.GenericType { return reflection.GenericType.GetType(this.constructor, [this.argType]) as reflection.GenericType }
        constructor(protected argType: Function, array?: T[]) {
            super();
            if (array)
                if (array.length)
                    for (var i = 0, len = array.length; i < len; i++)
                        this._list.push(array[i]);
            this.UCount();
        }
        public AsList(): T[] {
            return this._list;
        }
        public Order(comp: (a: T, b: T) => boolean | number) {
            var p = this._list;
            var l = p.length;
            for (var i = 0; i < l; i++)
                for (var j = i + 1; j < l; j++) {
                    if (comp(p[i], p[j]) > 0) {
                        var c = p[j];
                        p[j] = p[i];
                        p[i] = c;
                    }
                }
        }
        public OrderBy(comp: (a: T, b: T) => number) {
            var x = this._list.sort(comp);
            this.OnChanged(null, 0, CollectionEvent.Reset, null, x);
        }

        Filtred(filter: utils.Filter<T, utils.IPatent<T>>): ExList<T, utils.IPatent<T>> {
            var c = new ExList<T, utils.IPatent<T>>(this.argType);
            c.Filter = filter;
            c.Source = this;
            return c;

        }
        public Set(i: number, item: T): boolean {
            if (i < 0) return false;
            if (this._list.length <= i) return false;
            var old = this._list[i];
            if (old === item) return true;
            this._list[i] = item;
            this.OnChanged(item, i, CollectionEvent.Setted, old);
        }
        public Get(i: number): T {
            if (i < 0) return null;
            if (this._list.length <= i) return null;
            return this._list[i];
        }
        public Insert(i: number, item: T): boolean {
            if (this._isFrozen) return;
            if (i >= 0 && i <= this._list.length) {
                this._list.splice(i, 0, item);
                this.OnChanged(item, i, CollectionEvent.Added, null);
                return true;
            }
            return false;
        }
        public Add(item: T) {
            if (this._isFrozen) return;
            if (item == null) throw 'NullArgument detected';
            this._list.push(item);
            this.OnChanged(item, this._list.length - 1, CollectionEvent.Added, null);
            return this;
        }
        public AddRange(items: T[]) {
            if (this._isFrozen) return;
            for (var i = 0; i < items.length; i++) {
                this.Add(items[i]);
            }
        }

        public CheckIndex(i: number) {
            return i >= 0 && i < this._list.length;
        }
        public Remove(item: T | number) {
            if (this._isFrozen) return;
            if (typeof item != "number")
                item = this.IndexOf(item as any);
            return this.RemoveAt(item as any);
        }

        public RemoveAt(item: number) {
            if (this._isFrozen) return;
            if (typeof item != "number") return;
            if (this.CheckIndex(item)) {
                var t = this._list[item];
                this._list.splice(item, 1);
                this.OnChanged(t, item, CollectionEvent.Removed, t);
                return true;
            }
            return false;
        }
        public Clear() {
            if (this._isFrozen) return;
            var l = this._list.length;
            if (l > 0) {
                this.OnChanged(null, 0, CollectionEvent.Cleared, null, this._list.splice(0, this._list.length));
            }
        }

        public get Count(): number { return this._list.length; }

        public IndexOf(item: T) {
            return this._list.indexOf(item);

        }
        set Listen(delegate: ListEventHandler<T>) {
            this._changed.push(delegate);
        }
        set Unlisten(delegate: ListEventHandler<T>) {
            var x = this._changed.indexOf(delegate);
            if (x < 0) return;
            this._changed.splice(x, 1);
        }
        private OnChanged(item: T, startIndex: number, event: CollectionEvent, oldItem: T, collection?: T[]) {
            var e = new utils.ListEventArgs<number, T>(oldItem, item, startIndex, event, collection);
            var l = this._changed.length;
            this.UCount();
            for (var i = 0; i < l; i++) {
                var con = this._changed[i];
                if (typeof con === 'function')
                    (con as ListEventInvoker<T>)(e);
                else {
                    (<basic.ITBindable<ListEventInvoker<T>>>con).Invoke.call((<basic.ITBindable<ListEventInvoker<T>>>con).Owner, e);
                }
            }
        }

        private _changed: ListEventHandler<T>[] = [];
        private _changing: ListEventHandler<T>[] = [];

        protected getArgType(json): Function {
            var type = this.ArgType;
            if (type != null) return type;
            var typeName = json['__argtype__'];
            type = (typeName == undefined ? Object as Function : context.GetType(typeName)) as Function;
            return (type == undefined) ? this.argType == undefined ? Object : this.argType : type;
        }

        public ToJson(x: encoding.SerializationContext, indexer: encoding.IIndexer) {
            indexer = indexer == undefined ? x.getJson(this) : indexer;
            var ret: any | encoding.IRef = x.getJson(this);
            if (indexer.valid)
                return indexer.ref;
            else ret = super.ToJson(x, indexer);

            indexer.valid = true;
            var list = [];
            var t = this._list;
            for (var i = 0; i < t.length; i++) {
                var d = t[i];
                d = x.ToJson(d);
                list.push(d);
            }
            ret['__list__'] = list;
            ret['__argtype__'] = context.NameOf(this.argType);
            return ret;
        }
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object) {
            var list = json['__list__'] as Array<any> || [];
            this._list = new Array<any>(0);
            var type = this.argType = this.getArgType(json);
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                if (c === undefined) continue;
                var st = List.getType(c);
                if (st === undefined) st = this.argType;
                x.FromJson(c, st === undefined ? type : st, new encoding.LPath(this, i));
            }
            super.FromJson(json, x, update);
            this.OnDeserialize(this._list);
            if (json != null && json.IsFrozen)
                this.Freeze();
            return this;
        }
        OnDeserialize(list: T[]) {
        }
        private static getType(json) {
            var tn = json['__type__'];
            if (tn == undefined) return undefined;
            return context.GetType(tn);
        }
        UpdateDelegate: () => T[];

        public static GenType(T: Function) { return reflection.GenericType.GetType(this, [T]); }
    }
    export interface IKeyValuePair<T, P> {
        Key: T;
        Value: P;
    }
    export class Dictionary<T, P> extends bind.DObject {
        private keys: T[] = [];
        private values: P[] = [];

        constructor(public Name: string, public ReadOnly?: boolean) {
            super();
            ReadOnly = ReadOnly == null ? true : false;
        }
        public GetKeyAt(i: number) { return this.keys[i]; }
        public GetValueAt(i: number) { return this.values[i]; }
        public get Count() { return this.keys.length; }
        public Clear() {
            this.keys.length = 0;
            this.values.length = 0;
            this.OnChanged(null, null, CollectionEvent.Cleared, null);
        }
        public IndexOf(key: T, fromIndex?: number) {
            return this.keys.indexOf(key, fromIndex);
        }
        public IndexOfValue(val: P, fromIndex?: number) {
            return this.values.indexOf(val, fromIndex);
        }
        public Set(key: T, value: P) {
            var i = this.keys.indexOf(key);
            if (i === -1) {
                i = this.keys.length;
                this.keys.push(key);
            } else
                if (this.ReadOnly) if (this.values[i] === value) return; else throw "key is exist";
            this.values[i] = value;
        }
        public Remove(key: T) {
            var i = this.keys.indexOf(key);
            if (i === -1)
                return undefined;
            var val = this.values[i];
            this.values.splice(i, 1);
            this.keys.splice(i, 1);
            return val;
        }
        public RemoveAllValues(val: P): T[] {
            var keys = [];
            do {
                var i = this.values.indexOf(val, i);
                if (i === -1)
                    return keys;
                keys.push(this.keys[i]);
                this.values.splice(i, 1);
                this.keys.splice(i, 1);
            } while (true);
        }

        public RemoveAt(i: number): IKeyValuePair<T, P> {
            if (i < this.keys.length && i >= 0) {
                var r: IKeyValuePair<T, P> = { Key: this.keys[i], Value: this.values[i] };
                this.values.splice(i, 1);
                this.keys.splice(i, 1);
                return r;
            }
            return undefined;
        }
        public getValues() { return this.values; }
        public Get(key: T): P {
            var i = this.keys.indexOf(key);
            return i === -1 ? undefined : this.values[i];
        }


        public GetOrAdd(key: T, value?: P): P {
            var i = this.keys.indexOf(key);
            if (i !== -1) return this.values[i];
            this.keys.push(key);
            this.values.push(value);
            return value;
        }
        public GetOrCreate<S>(key: T, New: (key: T, param?: S) => P, param?: S): P {
            var i = this.keys.indexOf(key);
            if (i !== -1) return this.values[i];
            var value = New(key, param);
            this.keys.push(key);
            this.values.push(value);
            return value;
        }
        public GetKeyOf(val: P): T {
            var i = this.values.indexOf(val);
            return i === -1 ? undefined : this.keys[i];
        }
        set Listen(delegate: (e: utils.ListEventArgs<T, P>) => void) {
            this._changed.push(delegate);
        }
        set Unlisten(delegate: (e: utils.ListEventArgs<T, P>) => void) {
            var x = this._changed.indexOf(delegate);
            if (x < 0) return;
            this._changed.splice(x, 1);
        }
        private OnChanged(item: P, startIndex: T, event: CollectionEvent, oldItem: P) {
            var e = new utils.ListEventArgs<T, P>(oldItem, item, startIndex, event);
            var l = this._changed.length;
            for (var i = 0; i < l; i++) {
                var con = this._changed[i];
                con(e);
            }
        }
        private _changed: ((e: utils.ListEventArgs<T, P>) => void)[] = [];
        UpdateDelegate: () => T[];
    }
    export class ExList<T, P extends utils.IPatent<T>> extends List<T>{
        public static DPSource = bind.DObject.CreateField<List<any>, ExList<any, any>>("Source", List, null, (e) => { e.__this.sourceChanged(e); });
        public get Source(): List<T> { return this.get<List<T>>(ExList.DPSource); }
        public set Source(value: List<T>) { this.set(ExList.DPSource, value); }

        public static DPFilter = bind.DObject.CreateField<utils.Filter<any, any>, ExList<any, any>>("Filter", utils.Filter, null, (e) => { e.__this.filterChanged(e); });
        public get Filter(): utils.Filter<T, P> { return this.get<utils.Filter<T, P>>(ExList.DPFilter); }
        public set Filter(value: utils.Filter<T, P>) { this.set(ExList.DPFilter, value); }

        public static DPMaxResult = bind.DObject.CreateField<number, ExList<any, any>>("MaxResult", Number, Infinity, (e) => { e.__this.MaxResultChanged(e); });
        public get MaxResult(): number { return this.get(ExList.DPMaxResult); }
        public set MaxResult(value: number) { this.set(ExList.DPMaxResult, value); }

        public static DPShift = bind.DObject.CreateField<number, ExList<any, any>>("Shift", Number, 0, (e) => { e.__this.MaxResultChanged(e); });
        public get Shift(): number { return this.get(ExList.DPShift); }
        public set Shift(value: number) { this.set(ExList.DPShift, value); }

        static __fields__() { return [ExList.DPFilter, ExList.DPMaxResult, ExList.DPShift, ExList.DPSource]; }

        private _fid: number = null;
        private filterChanged(e: bind.EventArgs<utils.Filter<T, P>, ExList<T, P>>) {
            if (e._old)
                e._old.OffChanged(this._fid);
            if (e._new) this._fid = e._new.OnChanged(ExList.patentChanged, this);
            this.Reset();
        }
        private sourceChanged(e: bind.EventArgs<List<T>, ExList<T, P>>) {
            if (e._old)
                e._old.Unlisten = this.sicd;
            if (e._new) e._new.Listen = this.sicd;
            this.Reset();
        }
        private sicd: basic.IBindable = { Owner: this, Invoke: this.sourceItemChanged };
        private MaxResultChanged(e: bind.EventArgs<number, ExList<T, P>>) {
            this.Reset();
        }
        public static New<T, P extends utils.IPatent<T>>(source: List<T>, filter: utils.Filter<T, P>, argType?: Function) {
            var t = new ExList<T, P>(source == null ? argType : source.ArgType);
            t.Filter = filter;
            t.Source = source;
            return t;
        }

        constructor(argType: Function) {
            super(argType);
        }
        private static patentChanged<T, P extends utils.IPatent<T>>(e: utils.Filter<T, P>, t: ExList<T, P>) {
            t.Reset();
        }
        private sourceItemChanged(e: utils.ListEventArgs<number, T>):void {
            switch (e.event) {
                case CollectionEvent.Added:
                    if (this.MaxResult <= this.Count) return;
                    if (this.isMatch(e.startIndex, e.newItem)) super.Add(e.newItem);
                    return;
                case CollectionEvent.Cleared:
                    return super.Clear();
                case CollectionEvent.Removed:
                    super.Remove(e.oldItem);
                    return;
                case CollectionEvent.Replace:
                    var i = this.IndexOf(e.oldItem);
                    var m = this.isMatch(e.startIndex, e.newItem);
                    if (m) {
                        if (i == -1) super.Add(e.newItem);
                        else
                            this.Set(i, e.newItem);
                    }
                    else if (i != -1) super.RemoveAt(i);
                    return;
                case CollectionEvent.Reset:
                    return this.Reset();
                case CollectionEvent.Setted:
                    var i = this.IndexOf(e.oldItem);
                    var m = this.isMatch(e.startIndex, e.newItem);
                    if (m)
                        if (i == -1)
                            super.Add(e.newItem);
                        else super.Set(i, e.newItem);
                    else if (i !== -1)
                        super.RemoveAt(i);
                    return;
            }
        }
        private isMatch(i: number, item: T): boolean {
            var f = this.Filter;
            if (f == null) return true;
            return f.IsMatch(i, item);
        }
        public start: number;
        public Reset() {
            super.Clear();
            var s = this.Source;
            if (s == null) return;
            var f = this.Filter;
            var fin = f == null;
            var max = this.MaxResult;
            if (!fin)
                if (f.Begin(this.Shift, this.MaxResult))
                    super.AddRange(s.AsList());
                else
                    for (var i = 0, l = s.Count; i < l && max > 0; i++) {
                        var e = s.Get(i);
                        if (fin) super.Add(e);
                        else {
                            var r = f.IsMatch(i, e);
                            if (r === null) break;
                            if (r)
                                super.Add(e);
                        }
                    }
        }
    }

    export interface Converter<A, B> {
        ConvertA2B(sender: TransList<A, B>, index: number, a: A, d): B;
        ConvertB2A(sender: TransList<A, B>, index: number, b: B, d): A;
    }

    export class TransList<From, To> extends List<To> {
        static __fields__() { return [this.DPSource]; }
        private sli: basic.IBindable = <basic.IBindable>{ Owner: this, Invoke: this.OnSourceChanged };
        private SourceChanged<T, U>(e: bind.EventArgs<List<From>, this>): void {
            var o = e._old;
            var n = e._new;
            if (o) o.Unlisten = this.sli;
            if (n) n.Listen = this.sli;
            this.Reset();
        }

        public static DPSource = bind.DObject.CreateField<List<any>, TransList<any, any>>("Source", List, null, TransList.prototype.SourceChanged);
        public Source: List<any>;
        constructor(argType: Function, private converter: Converter<From, To>, private stat?: any) {
            super(argType);
        }
        private _internal: boolean;
        private OnSourceChanged(e: utils.ListEventArgs<number, From>) {
            this._internal = true;
            try {
                switch (e.event) {
                    case CollectionEvent.Added:
                        var x = this.converter.ConvertA2B(this, e.startIndex, e.newItem, this.stat);
                        super.Add(x);
                        break;
                    case CollectionEvent.Cleared:
                        super.Clear();
                        break;
                    case CollectionEvent.Removed:
                        super.Remove(e.startIndex);
                        break;
                    case CollectionEvent.Replace:
                        var x = this.converter.ConvertA2B(this, e.startIndex, e.newItem, this.stat);
                        super.Set(e.startIndex, x);
                        break;
                    case CollectionEvent.Reset:
                        this.Reset();
                        break;
                }
            } catch (e) {

            }
            this._internal = false;
        }
        private Reset() {
            super.Clear();
            var n: any = this.Source;
            if (!n) return;
            n = n.AsList();
            for (var i = 0, l = n.length; i < l; i++) {
                var x = this.converter.ConvertA2B(this, i, n[i], this.stat);
                super.Add(x);
            }
        }
        Add(t: To) {
            if (this._internal) return super.Add(t);
            this.Source.Add(this.converter.ConvertB2A(this, this._list.length, t, this.stat));
        }
        Remove(x: To): boolean {
            if (this._internal) return super.Remove(x);
            this.Source.Remove(this.converter.ConvertB2A(this, this._list.indexOf(x), x, this.stat))
        }
        Insert(i: number, item: To) {
            if (this._internal) return super.Insert(i, item);
            this.Source.Insert(i, this.converter.ConvertB2A(this, i, item, this.stat));
        }
        Clear() {
            if (this._internal) return super.Clear();
            this.Source.Clear();
        }
        Order(n: (a: To, b: To) => boolean) {
        }
        OrderBy(n: (a: To, b: To) => number) {

        }
        Set(i: number, item: To) {
            if (this._internal) return super.Set(i, item);
            this.Source.Set(i, this.converter.ConvertB2A(this, i, item, this.stat));
        }
    }


    export abstract class Binding<T> {
        GetType() { return Binding; }
        private _dataContext: collection.List<T>;
        get DataContext(): collection.List<T> { return this._dataContext; }
        set DataContext(value: collection.List<T>) {
            if (value == this._dataContext) return;
            var t = this._dataContext;
            if (t != null) t.Unlisten = this.initChanged;
            if (value != null) value.Listen = this.initChanged;
            this._dataContext = value;
            this.OnSourceInitialized(t, value);
        }

        constructor(dataContext: collection.List<T>) {
            this.DataContext = dataContext;
        }
        abstract OnItemAdded(item: T, index: number);
        abstract OnItemRemoved(item: T, index: number);
        abstract OnSourceCleared();
        abstract OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>);
        abstract OnSourceReset();
        abstract OnSourceReplace(oldItem: T, newItem: T, index: number);
        private initChanged(e: utils.ListEventArgs<number, T>) {
            switch (e.event) {
                case collection.CollectionEvent.Added:
                    this.OnItemAdded(e.newItem, e.startIndex);
                    break;
                case collection.CollectionEvent.Removed:
                    this.OnItemRemoved(e.oldItem, e.startIndex);
                    break;
                case collection.CollectionEvent.Cleared:
                    this.OnSourceCleared();
                    break;
                case collection.CollectionEvent.Reset:
                    this.OnSourceReset();
                    break;
                case collection.CollectionEvent.Replace:
                    this.OnSourceReplace(e.oldItem, e.newItem, e.startIndex);
            }
        }
    }

    export abstract class Render<T, P> extends Binding<T> {
        GetType() { return Render; }
        private _rendredList: collection.List<P>;
        public get RendredList(): collection.List<P> {
            if (this._rendredList == null) this._rendredList = new collection.List<P>(Object, []);
            return this._rendredList;
        }
        constructor(dataContext: collection.List<T>) {
            super(dataContext);
        }
        abstract Render(item: T): P;

        OnItemAdded(item: T, index: number) {
            this.RendredList.Insert(index, this.Render(item));
        }
        OnItemRemoved(item: T, index: number) {
            this.RendredList.RemoveAt(index);
        }
        OnSourceCleared() {
            this.RendredList.Clear();
        }
        OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>) {
            if (_nex != null) {
                var c = _nex.Count;
                this.RendredList.Clear();
                for (var i = 0; i < c; i++) {
                    var e = _nex.Count;
                    this._rendredList.Add(this.Render(_nex.Get(e)));
                }
            }
        }
    }
    export class SyncQuee<T> extends bind.DObject {
        public handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>
        private quee: T[] = [];
        private _isExecuting: boolean = false;

        @attributes.property(Object)
        public CurrentData: T;

        public push(data: T) {
            this.quee.push(data);
            if (!this._isExecuting) this.EndOperation(void 0);
        }
        constructor(handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>) {
            super();
            if (!this.handler || !this.handler.Invoke) throw "argument (handler) null";
            this.handler = { Invoke: handler.Invoke, Owner: handler.Owner };
            Object.preventExtensions(this);
        }
        public EndOperation(e: QueeEventArgs<T>) {
            if (qstore.Get(this) !== e)
                throw new Error("Unknown frame");
            if (this.quee.length) {
                this._isExecuting = true;
                this.CurrentData = this.quee.shift();

                var e = <QueeEventArgs<T>>{
                    data: this.CurrentData, quee: this
                };
                qstore.Set(this, e);
                helper.TryCatch(this.handler.Owner || this,
                    this.handler.Invoke,
                    function (error, e: QueeEventArgs<T>) { e.quee.EndOperation(e); },
                    [e]);

            } else {
                this._isExecuting = false;
                this.CurrentData = void 0;
                qstore.Set(this, void 0);
            }
        }
    }
    export interface QueeEventArgs<T> {
        quee: SyncQuee<T>;
        data: T;
    }
    var qstore = new collection.Dictionary<SyncQuee<any>, QueeEventArgs<any>>("quee_sync_frame");
}

export namespace mvc {
    interface IContext {
        _this: mvc.Initializer;
        tmpl: mvc.iTemplate;
    }
    interface IGContext {
        _this: mvc.Initializer;
        tmpl: mvc.ITemplateGroup;
    }

    export abstract class ITemplate {
        abstract Create(): HTMLElement;
        public Name: string;
        constructor(Name: string) {
            this.Name = Name.toLowerCase();
        }
    }

    export class iTemplate extends ITemplate {
        private _Url: string;
        public get Url(): string {
            return this._Url;
        }
        private _Shadow: HTMLTemplateElement;
        public get Shadow(): HTMLTemplateElement {
            return this._Shadow;
        }
        public set Shadow(v: HTMLTemplateElement) {
            if (v != null) {
                if (!(v instanceof HTMLElement))
                    throw 'shadow is not HTMLElement';
            }
            this._Shadow = v;
        }
        public Create(): HTMLElement {
            var s = this._Shadow;
            return s == null ? null : (s.content as any).firstElementChild.cloneNode(true) as HTMLElement;
        }
        constructor(relativeUrl: string, name: string, shadow?: HTMLTemplateElement) {
            super(name);
            if (relativeUrl == null) throw "url is null";
            if (name == null) throw "category is null";
            this._Url = relativeUrl;
            if (shadow == undefined) return;
            this.Shadow = shadow;
        }
        public Load() {
        }
    }

    export enum Devices {
        Desktop,
        Mobile,
        Tablete,
    }

    export class NULL { }

    var des = new collection.Dictionary<Function | string, collection.List<MvcDescriptor>>("tfolders");
    export interface ITemplateGroup {
        Url: string;
        OnError(init: Initializer);
        OnSuccess(init: Initializer);
    }
    export interface FolderEntries {
        [name: string]: MvcDescriptor;
    }

    export interface TemplateEntries {
        [name: string]: ITemplate;
    }
    export class MvcDescriptor {
        Name: string;
        private _dataType: Function | string;
        public get DataType(): Function | string {
            return this._dataType;
        }
        public set DataType(dataType: Function | string) {
            if (dataType == this._dataType) return;
            if (!dataType) return;
            if (this._dataType != NULL && typeof this._dataType == "function" && dataType)
                throw "Conflit types";

            var tt = des.Get(this._dataType || NULL);
            if (tt) {
                var i = tt.IndexOf(this);
                if (i !== -1) tt.RemoveAt(i);
            }
            var tt = des.Get(dataType || NULL);
            if (!tt) des.Set(dataType || NULL, tt = new collection.List<MvcDescriptor>(Object));
            tt.Add(this);
            this._dataType = dataType;
        }
        Subs: FolderEntries = {};
        Items: TemplateEntries = {};
        Parent: MvcDescriptor;
        Default: ITemplate;
        constructor(Name: string, dataType?: Function | string) {
            this.Name = Name.toLowerCase();
            this.DataType = dataType;
        }
        public get Root(): MvcDescriptor {
            var c: MvcDescriptor = this;
            while (c.Parent) c = c.Parent;
            return c;
        }
        public Get(path: string | string[]) {
            path = typeof path == 'string' ? path.toLowerCase().split('.') : path;
            var t: MvcDescriptor = this.GetFoder(path, path.length - 1);
            return t && t.Items[path[path.length - 1]];
        }
        public GetFoder(path: string | string[], max?: number) {
            path = path || "";
            if (typeof path == 'string') {
                path = path.trim().toLowerCase();
                if (path == '') return this;
                path = path.split('.');
            }
            var t: MvcDescriptor = this;
            for (var i = 0, max = max || path.length - 1; i < max; i++) {
                var n = path[i];
                if (!t) return undefined;
                switch (n) {
                    case '':
                    case '.':
                        continue;
                    case '..':
                        t = t.Parent;
                        break;
                    case '/':
                        t = t.Root;
                    default:
                        t = t.Subs[n];
                }
            }
            return t;
        }
        public CreateFolder(path: string | string[], type?: Function) {
            path = path || "";
            if (typeof path == 'string') {
                path = path.trim().toLowerCase();
                if (path == '') {
                    this.DataType = type;
                }
                path = path.split('.');
            }
            var t: MvcDescriptor = this;
            for (var i = 0, max = path.length; i < max; i++) {
                var n = path[i];
                if (!t) return undefined;
                switch (n) {
                    case '':
                    case '.':
                        continue;
                    case '..':
                        t = t.Parent || t;
                        break;
                    case '/':
                        t = t.Root;
                    default:
                        t = t.Subs[n] || t.AddFolder(n, i == max - 1 ? type : undefined);
                }
            }
            return t;
        }
        public Add(templ: ITemplate) {
            if (!this.Subs) this.Subs = {};
            this.Items[templ.Name] = templ;
            if (!this.Default) this.Default = templ;
            return this;
        }
        public AddFolder(name: string, dataType?: Function | string) {
            var x = this.Subs[name = name.toLowerCase()];
            if (x)
                if (x.DataType) {
                    if (dataType && x.DataType != dataType) throw "Conflit types";
                    return x;
                } else {
                    x.DataType = dataType;
                    return x;
                }
            this.Subs[name] = x = new MvcDescriptor(name, dataType);
            return x;
        }

        private registerTemplates(dom: HTMLElement, url: string, getType: (name: string) => Function) {
            var des: HTMLElement;
            var name = dom.getAttribute('name');
            var type = dom.hasAttribute('type') ? getType(dom.getAttribute('type')) : undefined;
            for (var i = 0; i < dom.children.length; i++) {
                des = dom.children.item(i) as HTMLElement;
                this.Process(des, url, getType);
            }
            return this;
        }
        private registerTemplate(cat: HTMLTemplateElement, url: string, name?: string) {
            let templateName = name || cat.getAttribute('name');
            if (templateName == null) {
                console.error('template must have a name \r\nfrom :' + url, cat);
                return;
            }
            if (cat.children.length > 1) {
                var v: HTMLDivElement = document.createElement('div');
                var x = cat.children;
                for (var i = 0; i < x.length; i++) {
                    var f = x.item(i);
                    f.remove();
                    v.appendChild(f);
                }
                cat.appendChild(v);
            }
            var p;
            this.Add(p = new mvc.iTemplate(url + '#' + name + '+' + templateName, templateName, cat) as any);
            if (cat.hasAttribute('default')) this.Default = p;

            return this;
        }
        public static Root = new MvcDescriptor('root', () => { });

        public static Get(path: string | string[]) {
            return this.Root.Get(path);
        }

        public static GetByType(datatype: Function) {
            var t = des.Get(datatype || NULL);
            return t && t.Count > 0 && t.Get(0);
        }

        public static GetByName(folderName: string) {
            var r = this.Root;
            for (var f in r.Subs)
                if (f == folderName) return r.Subs[f];
            return null;

        }
        public static Add(template: HTMLTemplateElement, path: string, name?: string) {
            var t = this.Root.CreateFolder('templates', bind.DObject);
            return t.registerTemplate(template, path, name);
        }
        public static New(name: string, dataType: Function) {
            return new MvcDescriptor(name, dataType);
        }
        public Register(path: string, tmp: HTMLTemplateElement, url: string, name?: string) {
            var t = this.CreateFolder(path, undefined);
            return t.registerTemplate(tmp, url, name);
        }
        public Process(des: HTMLElement, url: string, getType: (t: string) => Function) {
            switch (des.tagName) {
                case 'TEMPLATE':
                    return this.registerTemplate(des as HTMLTemplateElement, url);
                case 'DESCRIPTOR': case 'TEMPLATES':
                    var name = des.getAttribute('name');
                    var type = des.hasAttribute('type') ? getType(des.getAttribute('type')) : undefined;
                    return this.CreateFolder(name, type).registerTemplates(des, url, getType);
                case 'IMPORT': {
                    var name = des.getAttribute('name');
                    if (!name) return;
                    var from = this.GetFoder(des.getAttribute('from') || '');
                    from.Subs[name] = from;
                    return;
                }
                case 'DEBUGGER': stop(); return;
                case 'REQUIRE': case 'DEBUGGER':
                    return;
                default:
                    console.error('Tag {' + des.tagName + "} Unresolved");
            }
        }
    }
    interface ITypeResolverCollection {
        [typeName: string]: Function;
    }



    export class Initializer {

        public static get Instances(): Initializer {
            return __corelib__._Instance || (__corelib__._Instance = new Initializer(require));
        }

        constructor(private require: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => void) {
            if (require == null) throw 'require argument is null';
            if (__corelib__._Instance) throw "App cannot have more than initializer";
            __corelib__._Instance = this;
            this.Init();
        }
        Init() { }
        Dispose() { }
        get System(): collection.List<MvcDescriptor> { return this._system; }
        private readonly _system: collection.List<mvc.MvcDescriptor> = new collection.List<mvc.MvcDescriptor>(mvc.MvcDescriptor);
        public Add(templGroup: ITemplateGroup, require?: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => any) {
            this.pending++;
            (require || this.require)('template|' + templGroup.Url, Initializer.gonsuccess, Initializer.gonerror, { _this: this, tmpl: templGroup });
        }
        private static typeResolvers: ITypeResolverCollection = {};
        public static SetTypeResolver(name, typeResolver: (typeName: string) => Function) {
            Initializer.typeResolvers[name] = typeResolver;
        }
        private _pending: number = 0;
        private get pending() {
            return this._pending;
        }
        private set pending(v: number) {
            if (v < 0) throw "pending cannot be less then 0";
            if (v === this._pending) return;
            this._pending = v;
            if (v === 0) Initializer.onfinish(this);
        }
        private static gonsuccess(r: ITemplateExport) {
            var t = this as any as IGContext;
            var __this = t._this;
            try {
                Initializer.MakeAsParsed(r);
                __this.ExcecuteTemplate(t.tmpl.Url, r.html);
                if (t.tmpl.OnSuccess)
                    thread.Dispatcher.call(t.tmpl, t.tmpl.OnSuccess, t._this);
            } catch (e) {
            }
            __this.pending--;
        }
        private static gonerror(r: any) {
            var t = this as any as IGContext;
            console.error(" Group of templates [" + t.tmpl.Url + "]: error downloading");
            if (t.tmpl && t.tmpl.OnError)
                thread.Dispatcher.call(t.tmpl, t.tmpl.OnError, t._this);
            t._this.pending--;
        }
        private static onsuccess(r: any) {
            var t = this as any as IContext;
            var tmpl = t.tmpl;
            var __this = t._this;
            __this.pending--;

            tmpl.Shadow = Initializer.htmlToElements(r) as any;
            if (__this.pending === 0) Initializer.onfinish(t._this);
        }
        private static onerror(r: any) {
            var t = this as any as IContext;
            t._this.pending--;
            console.error("template [" + t.tmpl.Url + "] error downloading");
            t.tmpl.Shadow = Initializer.html2Template("<error>Error Downloading Template</error>");
            if (t._this.pending === 0)
                Initializer.onfinish(t._this);
        }
        static html2Template(html: string) {
            var t = document.createElement('template') as HTMLTemplateElement;
            t.innerHTML = html;
            return t;
        }
        static htmlToElements(html) {
            var t = document.createElement('div');
            t.innerHTML = html;
            return t;
        }
        public then(call: (Initializer: Initializer) => void) {
            if (this.pending <= 0) return call(this);
            Initializer.callbacks.push(call);
        }
        public static then(call: (Initializer: Initializer) => void) {
            Initializer.callbacks.push(call);
        }
        private static callbacks: ((Initializer: Initializer) => void)[] = [];
        protected onfinish() {
            var c = Initializer.callbacks;
            while (c.length)
                c.shift()(this);
        }
        private static onfinish(t: Initializer) {
            for (var i = 0; i < Initializer.callbacks.length; i++)
                Initializer.callbacks[i](t);
        }
        public static Get(type: Function) {
            var n = __corelib__._Instance.System;
            {
                var l = n.Count;
                for (var i = 0; i < l; i++) {
                    var e = n.Get(i);
                    if (e.DataType == type) return e;
                }
            }
            return null;
        }
        public getDescriptor(name: string, type: Function): MvcDescriptor {
            name = name.toLowerCase();
            if (!name && !type) return this.templatesDescrpt;
            if (name) var descipter = MvcDescriptor.GetByName(name);
            if (!descipter && type) descipter = MvcDescriptor.GetByType(type);
            if (descipter && descipter.Name.toLowerCase() != name.toLowerCase()) descipter = null;
            if (!descipter) descipter = MvcDescriptor.Root.AddFolder(name, type);
            else if (descipter.Name !== name.toLowerCase() || descipter.DataType !== type)
                console.log(`Conflit with others template: Name(${name},${descipter.Name})==Type(${type},${descipter.DataType})`);
            return descipter;
        }
        private templatesDescrpt = this.getDescriptor("templates", bind.DObject);
        public ExcecuteTemplate(url: string, templ: HTMLElement, typeResolver?: (typeName: string) => Function, e?: ITemplateExport) {
            var types = {};
            var templatesDescrpt = this.getDescriptor("templates", bind.DObject);
            function getType(name: string) {
                var t = types[name = name];
                if (t != null) return t;
                if (typeResolver) t = typeResolver(name);
                if (t == null || !(t instanceof Function)) {
                    t = (e && e.context && e.context.GetType(name)) || context.GetType(name);
                    if (t == undefined || !(t instanceof Function))
                        throw "type " + name + " unresolved";
                }
                types[name] = t;
                return t;
            }
            MvcDescriptor.Root.Process(templ, url, getType);
        }
        static Register(e: PluginsEvent) {
            var tempate = e.exports as ITemplateExport;
            if (this.parsed.indexOf(tempate) !== -1)
                return;
            else if (tempate.html.hasAttribute('private')) return;
            else this.Instances.ExcecuteTemplate(e.url.toString(), tempate.html, null, tempate);
        }
        static MakeAsParsed(r: ITemplateExport) {
            this.parsed.push(r);
        }
        private static parsed: ITemplateExport[] = [];
    }
    export class Template {
        private static _store;
        public static TempplatesPath: string = "./templates/";
        private _type: any;
        private _view: HTMLElement;
        private _name: string = "";
        private _for: string = "";

        public get forType(): any { return this._type; }
        public get View() { return this._view; }
        public get Name() { return this._name; }
        public get For() { return this._for; }

        constructor(templateDOM: HTMLElement) {
            if (Template._store === undefined) Template._store = new collection.List<Template>(Template);
            if (Template.fromInside == true) {
                this._view = templateDOM;
                this._name = templateDOM.getAttribute("name");
                this._for = templateDOM.getAttribute("for");

                if (this._name == null) throw "name is null";

                Template._store.Add(this);
            } else throw "Access violatile";
        }

        public static getTemplates(type): Template[] {
            var c = Template._store;
            var rt: Template[] = [];
            for (var i = c.Count - 1; i >= 0; i--) {
                var t = c.Get(i);
                if (t.forType == type) rt.push(t);
            }
            return rt;
        }
        private static fromInside = false;
        public static LoadTemplate(templateName: string, context: basic.IContext) {
            var templatePath = Template.TempplatesPath + templateName;
            Template.getWebRequest().Download(new net.RequestUrl(templatePath, context), null);
        }
        public static getWebRequest() {
            if (Template._webRequest) return Template._webRequest;
            var c = <basic.ICrypto>basic.Crypto;
            var w = new net.WebRequest(c);
            w.OnComplete.On = Template.OnRecieveTemplates;
            return Template._webRequest = w;
        }
        private static _webRequest;
        private static OnRecieveTemplates(result: net.WebRequest) {
            if (Template.getWebRequest().IsSuccess == false)
                return;
            var x = Template.getWebRequest();
            var r = x.Response;
            var templates = document.createElement("templates");
            templates.innerHTML = r;
            templates = <HTMLElement>templates.firstChild;
            for (var i = 0; i < templates.childElementCount; i++) {

                Template.createTemplate(<HTMLElement>templates.children.item(i));
            }
        }
        private static createTemplate(tmplate: HTMLElement) {
            Template.fromInside = true;
            var t = null;
            try {
                t = new Template(tmplate);
            } catch (error) {
            }
            Template.fromInside = false;
            return t;
        }
        public static GetAll(name: string) {
            if (arguments.length == 2)
                var a = Template._store;
            var x = [];
            for (var i = 0; i < a.Count; i++) {
                var t = a.Get(i);
                if (t._name == name) x.push(t);
            }
            return x;
        }
        public static Get(name: string, vtype: string) {
            var a = Template._store;
            for (var i = 0; i < a.Count; i++) {
                var t = a.Get(i);
                if (t._name == name && vtype == t._for) return t;
            }
            return null;
        }
        public static Foreach(callback: (tmplate: Template) => boolean) {
            var s = Template._store;
            for (var i = s.Count - 1; i >= 0; i--) {
                var t = s.Get(i);
                if (callback(t)) return;
            }
        }
    }
}

export namespace bind {
    
    export interface IJobCollection { [s: string]: basic.IJob; }
    export abstract class Scop extends bind.DObject {
        private _scops: basic.scopCollection;
        protected _parent: Scop;
        public Value: any;
        public getScop(path: string, createIfNotEist?: boolean) {
            return Scop.getAttribute(this, path.split(/[\s\\\/\.]+/), createIfNotEist);
        }
        public findScop(path: string[]) {
            var cs: Scop = this;
            do {
                var t = path.pop();
                switch (t) {
                    case '.':
                        continue;
                    case '..':
                        cs = cs.getParent();
                        break;
                    default:
                        var c = t.charCodeAt(0);
                        if (c === 36 || c === 126)
                            throw "optimize your code by delete the first part befor ($|~)";
                        if (c === 64) {

                        }
                        cs = cs._scops && cs._scops[t];
                        break;
                }
            } while (path.length > 0);
        }
        public getParent(): Scop { return this._parent; }
        public setParent(v: Scop) {
            if (v == this._parent) return true;
            if (this.canBeParent(v)) this._parent = v;
            else return false;
            return true;
        }
        protected canBeParent(v: Scop) {
            var t = v;
            while (t && t != this) {
                t = t.getParent();
            }
            return !t;
        }
        public SetExParent(scop: Scop, parent: Scop) {
            return this.setParent(scop) || this.setParent(parent);
        }
        private findAttribute(name: string) {
            var scp: Scop = this;
            var x = [];
            while (scp) {
                if (x.indexOf(scp) != -1) return undefined;
                if (scp._scops && scp._scops.hasOwnProperty(name))
                    return scp._scops[name];
                x.push(scp);
                scp = this.getParent();
            }
        }
        private static getAttribute(scp: Scop, name: string[] | string, createIfNotEist?: boolean): Scop {
            if (typeof name == 'string') name = [name];
            if (!name || name.length == 0) return scp;
            var fscp = scp.findAttribute(name[0]);
            if (!fscp && !createIfNotEist) return null;
            if (fscp) {
                scp = fscp;
                name.shift();
            }
            while (name.length) {
                var fname = name.shift();
                let s: Scop;
                if (scp._scops && scp._scops.hasOwnProperty(fname))
                    s = scp._scops[fname];
                else if (createIfNotEist) {
                    if (!scp._scops) scp._scops = {};
                    scp._scops[fname] = s = new ValueScop(null);
                    s.setParent(scp);
                }
                else return null;
                scp = s;
            }
            return scp;
        }
        public setAttribute(name: string, value: any) {
            var s = this.getScop(name, true);
            s.Value = value;
        }
        public getAttribute(name: string, createIfNotEist?: boolean): Scop {
            return Scop.getAttribute(this, [name], createIfNotEist);
        }
        public static __fields__() { return [Scop.DPValue]; }
        public static DPValue = bind.DObject.CreateField<any, Scop>("Value", Object, void 0, Scop.prototype._OnValueChanged_);
        public get BindingMode() { return this._bindingMode; }
        protected _bindingMode: BindingMode;
        public set BindingMode(value: BindingMode) { this._bindingMode = value == null ? 1 : value; }

        constructor(_bindingMode: BindingMode) {
            super();
            this._bindingMode = _bindingMode == null ? 1 : _bindingMode;
        }
        protected valueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, this>) {
            e.__this._OnValueChanged(e);
        }
        private _OnValueChanged_(e: bind.EventArgs<any, any>) { return this._OnValueChanged(e); }
        
        protected abstract _OnValueChanged(e: bind.EventArgs<any, any>);
        public static Create(s: string, parent?: Scop, bindingMode?: BindingMode, controller?: Controller): Scop {
            bindingMode = bindingMode == null ? 1 : bindingMode;
            var e = s.split('|');
            if (e.length === 1) return this.GenerateScop(s, parent, bindingMode, controller);
            for (var i = 0; i < e.length; i += 2) {
                var f1 = e[i], f2 = e[i + 1];
                parent = f1.length === 0 ? parent : this.GenerateScop(f1, parent, bindingMode, controller);
                parent = f2.length == 0 ? parent : CreateFilter(f2, parent, bindingMode || 3) || parent;
            }
            return parent;
        }
        
        public static BuildScop(p:Parser.ParserResult, parent: Scop, bindingMode:bind.BindingMode, controller?: Controller,) {
            var scop: Scop = parent;
            switch (p.tokon) {
                case 'keyword':     
                    scop = p.resut === 'this' ? controller && controller.MainControll
                        : p.resut === 'window' ? windowScop : parent;
                    break;
                case 'anonymousscop':
                    var scop = AnonymouseScop.UnRegister(p.resut as number);
                    scop.setParent(parent);
                    break;
                case 'bindscope':
                    scop = new bind.Bind(p.resut as Parser.IBindScope, scop, bindingMode);
                    break;
                case 'namedscop':
                    scop = NamedScop.Create(p.resut as Parser.INamedScop, null, bindingMode);
                    break;
                case 'parentscop':
                    for (var j = p.resut as Parser.IParentScop - 1; j >= 0; j--)
                        scop = scop && scop.getParent();
                    break;
                case 'subscop':
                    scop = Scop.getAttribute(scop, p.resut as Parser.ISubsScop, true);
                    break;
                case 'typedscope':
                    scop = new TypedScop(scop, (p.resut as Parser.ITypedScop), bindingMode);
                    scop.setParent(parent);
                    break;
                case Parser.CToken.functionCall:
                    scop = new FunctionCallScop((p.resut as Parser.parsers.FunctionResult), parent, controller, bindingMode);
                    scop.setParent(parent);
                    break;
                case Parser.CToken.arrayCall:
                    scop = new ArrayCallScop((p.resut as Parser.parsers.ArrayResult), parent, controller);
                    scop.setParent(parent);
                    break;
                case Parser.CToken.path:
                    for (var i of p.resut as Parser.ParserResult[])
                        scop = this.BuildScop(i, scop, bindingMode, controller);
                    break;
                default:
                    return null;
            }
            return scop;
        }

        public static GenerateScop(s: string, _parent?: Scop, bindingMode?: BindingMode, controller?: Controller): Scop {
            if (s == "" || s == null || s == ".") return _parent;
            var t = Parser.parseExpression(s);
            if (!t.success) return console.error('bind path : ' + s), null;
            return Scop.BuildScop(t, _parent, bindingMode, controller);
        }
        public static GetStringScop(s: string, _parent: bind.Scop, controller: Controller) {
            return StringScop.GetStringScop(s, _parent, controller);
        }
        public AddJob(job: basic.IJob, dom: Node) {
            var ji: bind.JobInstance = new bind.JobInstance(this, job, dom);
            if (!this.__jobs__) this.__jobs__ = [ji];
            else this.__jobs__.push(ji);
            if (job.OnInitialize != null)
                job.OnInitialize(ji, null);
            return ji;
        }
        private __jobs__: bind.JobInstance[];
        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.setParent(null);
            if (this.__jobs__) {
                for (var i = 0; i < this.__jobs__.length; i++) {
                    var ji = this.__jobs__[i];
                    if (ji.IsDisposed) continue;
                    ji.Dispose();
                    basic.Url
                }
                this.__jobs__.length = 0;
                this.__jobs__ = null;
            }
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }
        public RegisterJob(job: basic.IJob) {
            if (!this.__mjobs__) this.__mjobs__ = {};
            this.__mjobs__[job.Name] = job;
        }
        public GetJob(name: string) {
            return this.__mjobs__ && this.__mjobs__[name];
        }
        protected __mjobs__: IJobCollection;
        __Controller__: Controller;
        public getThis() {
            return this.__Controller__ && this.__Controller__.CurrentControl;
        }
        get __hasSegments__() { return false; }
        forEach<T>(callback: (s: any, param: T) => boolean, param?: T) {
        }
        get ParentValue(): any { var p = this.getParent(); return p && p.Value; }

        public WhenIschanged<T>(callback: (s: bind.PropBinding, e: bind.EventArgs<T, any>) => void, owner?: any) {
            return this.OnPropertyChanged(Scop.DPValue, callback, owner).Dispose;
        }
        public OffIsIchangeing(callback: ($new, $old?) => void) {

        }
        private _valueChanegedCallbacks: ({ c: (o, n) => void, o })[];
    }

    export class StringScop extends bind.Scop {
        private _dom: Node;
        AttacheTo(Dom: Node): any {
            this._dom = Dom;
            this._dom && (this._dom.textContent = this.Value || "");
        }
        private pb: bind.PropBinding;
        constructor(private template: (string | Parser.ICode)[], _parent: bind.Scop,controller:Controller) {
            super(bind.BindingMode.SourceToTarget);
            for (var str of template) {
                if ((typeof str)[0] !== 'o') continue;
                (str as Parser.ICode).scop = Scop.GenerateScop((str as Parser.ICode).Code, _parent, BindingMode.SourceToTarget, controller);
                (str as Parser.ICode).pb = (str as Parser.ICode).scop.OnPropertyChanged(Scop.DPValue, this.Reset, this);
            }
            this.setParent(_parent);
            this.Reset(void 0, void 0);
        }
        public static GetStringScop(s: string, _parent: bind.Scop, controller: Controller) {
            var d = Parser.StringTemplate.Compile(s);
            for (var x of d)
                if ((typeof x)[0] !== 'o') continue;
                else return new StringScop(d, _parent, controller);
            return s;
        }
        protected _OnValueChanged(e: bind.EventArgs<any, any>) { this._dom && (this._dom.textContent = e._new || ""); }
        public setParent(v: Scop) {
            if (!this.canBeParent(v)) return false;
            var lp = this._parent;
            if (lp && this.pb)
                lp.removeEvent(bind.Scop.DPValue, this.pb);
            else this.pb = null;
            this._parent = v;
            for (var i = 0; i < this.template.length; i++) {
                var r = this.template[i] as Parser.ICode;
                if ((typeof r)[0] !== 'o' || !(r.scop instanceof bind.Bind)) continue;
                r.scop && r.scop.setParent(v);
            }
            return true;
        }
        Reset(sender?: bind.PropBinding, e?: bind.EventArgs<any, any>) {
            for (var i = 0; i < this.template.length; i++) {
                var r = this.template[i] as Parser.ICode;
                if ((typeof r)[0] !== 'o') continue;
                r.result = r.scop && r.scop.Value;
            }
            this.Value = Parser.StringTemplate.GenearteString(this.template);
        }
        FromJson(json, context: encoding.SerializationContext, update) {
            return this;
        }
        ToJson(context: encoding.SerializationContext, iintexder?: encoding.IIndexer) {
            var o = super.ToJson(context, iintexder);
            return o;
        }
        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.setParent(null);
            for (var i = 0; i < this.template.length; i++) {
                var r = this.template[i] as Parser.ICode;
                if ((typeof r)[0] !== 'o' || !(r.scop instanceof bind.Bind)) continue;
                r.scop.Dispose();
            }
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }
    }
    function isConstant(t:Parser.ParserResult) {
        return t.tokon <= Parser.CToken.string;
    }
    export class FunctionCallScop extends bind.Scop {
        protected _OnValueChanged(e: EventArgs<any, any>) { }
        Invoke(s?: PropBinding, e?: EventArgs<any, Scop>) {
            var caller = this.caller.scop.Value as Function;
            if (typeof caller !== 'function') {
                this.Value = caller;
                return;
            }
            var args = new Array(this.args.length);
            for (var i = 0; i < this.args.length; i++) {
                var arg = this.args[i];
                args[i] = arg.isConstant ? arg.value : arg.value = this.args[i].scop.Value;
            }
            this.Value = helper.TryCatch(this.caller.scop.ParentValue, caller as any, void 0, args);
        }
        private args: { scop: Scop, isConstant: boolean, pb?: bind.PropBinding, value?: any  }[];
        private caller: { scop: Scop, pb?: bind.PropBinding};
        constructor(rslt: Parser.parsers.FunctionResult, _parent: bind.Scop, controller?: Controller, mode: bind.BindingMode = 1) {
            super(mode);
            this.caller = {
                scop: Scop.BuildScop(rslt.caller, _parent, BindingMode.SourceToTarget, controller)
            };
            if (this._bindingMode)
                this.caller.pb = this.caller.scop.OnPropertyChanged(Scop.DPValue, this.Invoke, this);

            this.args = new Array(rslt.args.length);
            for (var i = 0; i < rslt.args.length; i++) {
                var arg = rslt.args[i];
                this.args[i] = {
                    isConstant: isConstant(arg),
                    value: isConstant(arg) ? arg.resut : void 0,
                    scop: isConstant(arg) ? void 0 : Scop.BuildScop(arg, _parent, BindingMode.SourceToTarget, controller)
                };
                if (!this.args[i].isConstant && this._bindingMode)
                    this.args[i].pb = this.args[i].scop.OnPropertyChanged(Scop.DPValue, this.Invoke, this);
            }
            if (this._bindingMode)
                this.Invoke();
        }
    }
    export class ArrayCallScop extends bind.Scop {
        protected _OnValueChanged(e: EventArgs<any, any>) { }
        Reset(s?: PropBinding, e?: EventArgs<any, Scop>) {
            var caller = this.caller.scop.Value;
            var index = this.index.isConstant ? this.index.value : this.index.scop.Value;
            if (caller == void 0) this.Value = void 0;
            else if (caller instanceof collection.List)
                this.Value = caller.Get(index);
            else this.Value = caller[index];
        }
        private index: { scop: Scop, isConstant: boolean, pb?: bind.PropBinding, value?: any };
        private caller: { scop: Scop, pb?: bind.PropBinding };
        constructor(rslt: Parser.parsers.ArrayResult, _parent: bind.Scop, controller?: Controller) {
            super(1);
            this.caller = {
                scop: Scop.BuildScop(rslt.caller, _parent, BindingMode.SourceToTarget, controller)
            };
            this.caller.pb = this.caller.scop.OnPropertyChanged(Scop.DPValue, this.Reset, this);
            var arg = rslt.index;
            this.index = {
                isConstant: isConstant(arg),
                value: isConstant(arg) ? arg.resut : void 0,
                scop: isConstant(arg) ? void 0 : Scop.BuildScop(arg, _parent, BindingMode.SourceToTarget, controller)
            };
            if (!this.index.isConstant)
                this.index.pb = this.index.scop.OnPropertyChanged(Scop.DPValue, this.Reset, this);
            this.Reset();
        }
    }

    var scops = {};
    export class NamedScop extends Scop {

        private _name: string;
        public get Name(): string { return this._name; }
        constructor(name: string, bindingMode: BindingMode) {
            super(bindingMode);
            if (name.charAt(0) == '$') throw "Name of scop cannot be started with '$' char";
            if (vars.names_scop_fromIn != true) throw "Access violatil";
            this._name = name;
            if (name)
                scops[name] = this;
            vars.names_scop_fromIn = false;
            
        }
        public static Get(name: string): bind.NamedScop {
            return scops[name];
        }

        protected _OnValueChanged(e: bind.EventArgs<any, any>) {

        }
        public static Create(name: string, value?: any, twoWay?: BindingMode) {
            var t: NamedScop = scops[name];
            if (t != null) return t;
            vars.names_scop_fromIn = true;
            t = new NamedScop(name, twoWay);
            t.Value = value;
            return t;
        }
        public Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            super.Dispose();
            scops[this.Name] = undefined;
            delete scops[this.Name];
            if (!h) this.DisposingStat = 2;
        }
    }

    export class Bind extends Scop {
        public static __fields__() {
            return [Bind.DPParent, Bind.DPPath];
        }
        private PathChanged(e: bind.EventArgs<string[], Bind>) {
            this.int = true;
            this.observer.Path = e._new == null ? [] : e._new;
            this.int = false;
        }

        private pb: bind.PropBinding = null;
        private static ParentChanged(e: bind.EventArgs<Scop, Bind>) {
            var t = e.__this;
            var n = e._new;
            var o = e._old;
            if (o != null && t.pb != null) {
                o.removeEvent(Scop.DPValue, t.pb);
            }
            if (n != null) {
                t.pb = n.OnPropertyChanged(Scop.DPValue, t.ParentValueChanged, t);
                t.observer.Me = n.Value;
            } else t.observer.Me = null;
        }

        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.removeEvent(Scop.DPValue as any, this.pb);
            this.observer.removeEvent(Observer.DPValue, this.observerBinding);
            this.observer.Dispose();
            this.pb = null;
            this.observerBinding = null;
            this.observer = null;
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }

        ParentValueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, any>) {
            this.int = true;
            this.observer.Me = e._new;
            this.int = false;
        }

        private static DPPath = bind.DObject.CreateField<string[], Bind>("Path", Array, null, Bind.prototype.PathChanged);
        public get Path(): string[] { return this.get<string[]>(Bind.DPPath); }
        public set Path(value: string[]) { this.set<string[]>(Bind.DPPath, value); }

        private static DPParent = bind.DObject.CreateField<Scop, Bind>("Parent", Scop, null, Bind.ParentChanged);
        public get Parent(): Scop { return this.get<Scop>(Bind.DPParent); }
        public set Parent(value: Scop) { this.set<Scop>(Bind.DPParent, value); }

        private observer: bind.Observer = new bind.Observer(null, []);

        private observerBinding: PropBinding;
        constructor(path: string | string[], parent: Scop, bindMode?: BindingMode) {
            super(bindMode);
            if (typeof path === 'string') path = path.split('.');
            this.Path = path as any;
            if (typeof (parent) == "string") parent = NamedScop.Create(parent as any, undefined);
            this.int = true;
            this.Parent = parent;
            this.Value = this.observer.Value;
            if ((bindMode & 1) == 1)
                this.observerBinding = this.observer.OnPropertyChanged(Observer.DPValue, this.__OnValueChanged, this);
            this.int = false;
        }
        private isChanging: boolean;
        private __OnValueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, any>) {
            this.isChanging = true;
            this.Value = e._new;
            this.isChanging = false;
        }
        protected AttributeChanged(e: Event) {
        }
        private int: boolean = false;
        protected _OnValueChanged(e: bind.EventArgs<any, any>) {
            if (this.isChanging) return;
            if (((this.BindingMode & 2) === 2) && !this.int) {
                var o = this.observer;
                var p = o.xpath;
                var l = p.length;
                if (l === 0) return;
                var parent;

                var lp = p[l - 1];
                if (l === 1)
                    parent = o.Me;
                else
                    parent = p[l - 2].Value;

                if (parent)
                    if (lp.Property != null)
                        (parent as any).set(lp.Property, e._new);
                    else
                        parent[lp.Name] = e._new;
            }
        }
        getParent() { return this.get(Bind.DPParent); }
        setParent(v: Scop) { if (this.canBeParent(v)) this.set(Bind.DPParent, v); else return false; return true; }
        getChildren() { return [] as Scop[]; }
        get Values() { return this.observer.xpath; }
        get Segments() { return this.observer.xpath; }
        forEach<T>(callback: (s: any, param: T) => boolean, param?: T) {
            var t = this.observer.xpath;
            for (var i = t.length - 1; i >= 0; i--) {
                if (callback(t[i].Value, param)) return <basic.IRef<any>>{ value: t[i].Value };
            }
        }
        get ParentValue(): any {
            var pth = this.observer.xpath;
            if (pth.length == 1) { var p = this.getParent(); return p && p.Value; }
            return pth[pth.length - 2].Value;
        }
    }
    var i = -1;
    var ascops: Scop[] = [];
    export namespace AnonymouseScop {
        export function Register(scop: Scop): number {
            ascops[++i] = scop;
            return i;
        }
        export function UnRegister(i: number): Scop {
            var t = ascops[i];
            ascops[i] = undefined;
            return t;
        }
        export function Get(i: number): Scop {
            return ascops[i];
        }
    }
    export class ValueScop extends Scop {
        constructor(value: any, bindMode?: BindingMode) {
            super(bindMode);
            this.Value = value;
        }
        _OnValueChanged(e: EventArgs<any, any>) {
        }
    }
    export var  windowScop = new ValueScop(window, 0);
    export class TypedScop extends Scop {
        itself: boolean;
        private pB: PropBinding;
        private parent: Scop
        public getParent(): Scop {
            return this.parent;
        }
        public setParent(v: Scop) {
            if (v == this.parent) return;
            if (this.parent && this.pB)
                this.parent.removeEvent(Scop.DPValue, this.pB);
            this.pB = v.OnPropertyChanged(Scop.DPValue, this.OnParentValueChanged, this);
            this.parent = v;
            this.reProcess();
            return true;
        }
        protected _OnValueChanged(e: EventArgs<any, any>) {
        }
        private type: Function | string;
        private eq: boolean;
        constructor(parent: Scop, type: Parser.ITypedScop, bindingMode: BindingMode) {
            super(bindingMode);
            this.eq = type.type == '=';
            this.itself = type.type == ':';
            this.type = context.GetType(type.path) || type.type;
            this.setParent(parent);

        }
        private OnParentValueChanged(pB: PropBinding, e: EventArgs<any, Scop>) {
            this.reProcess();
        }
        private reProcess() {
            var pS = this.parent;
            var tiss = typeof this.type === 'string';
            while (pS) {
                if (pS.__hasSegments__ && pS.forEach((s, p) => p.checkType(s, tiss, true), this) !== undefined) return;
                else if (this.checkType(pS, tiss, this.itself)) return;
                pS = pS.getParent();
                this.setAttribute
            }
        }
        private checkType(pS, tiss, itself) {
            var pv = itself ? pS : pS.Value;
            if (pv != null)
                if (tiss) {
                    if (pv.constructor.name == this.type) {
                        this.Value = pv;
                        return true;
                    }
                }
                else if (this.eq ? pv.constructor === this.type : pv instanceof (this.type as Function)) {
                    this.Value = pv;
                    return true;
                }
        }
    }
    var tx = {
        '3': 3,
        '2': 2,
        '1': 1,
        '': 0,
        'false': 1,
        'true': 3
    }
    function getDbTwoWay(t) {
        if (t == null) return 1;
        return tx[t] || BindingMode[t];
    }
    export class db {
        public todo: string;
        public init: { [n: string]: any };
        public bind: string;
        public name: string;
        public job: string;
        public twoway: BindingMode;
        public filter: string;
        public cmd: string;
        public exec: string;
        public template: string;
        public dec: string;
        public control: string;
        public stop: string;
        public foreach: string;
        public way: string;
        public events: { [eventName: string]: string } = {};

        constructor(dom: Element) {
            var a = dom.attributes;
            for (var i = 0; i < a.length; i++) {
                var n = a[i].name;
                if (n.indexOf('db-') === 0)
                    this[n.substr(3)] = a[i].value;
                else if (n.indexOf('on-') === 0) {
                    this.events[n.substr(3)] = a[i].value;
                }
            }
            if (this.twoway)
                this.twoway = getDbTwoWay(this.twoway);
            this.init = helper.TryCatch(JSON, JSON.parse, void 0, [this.init]);
            if (this.stop != undefined) { if (typeof stop !== undefined) stop(); stop(); }
        }
    }
    export interface DomCompilerArgs {
        parentScop: Scop;
        parentControl: UI.JControl;
        controller: Controller;
        e: bind.IJobScop;
        attributes?: db;
    }

    export class Todo implements basic.IJob {
        get Name() { return "Todo"; }
        Todo?(job: JobInstance, e: EventArgs<any, any>): void {
            var v: (job: JobInstance, e: EventArgs<any, any>) => void = this.scopFunction.Value;
            if (!(v instanceof Function)) return;
            var p = this.scopFunction.getParent();
            v.call(p && p.Value, job, e);
        }
        constructor(private scopFunction: bind.Scop) { }
    }

    export type delg = (ovalue, value, scop: bind.Scop, job: JobInstance, event: EventArgs<any, any>) => void;
    class FnJob implements basic.IJob {
        private static fns: { [name: string]: delg } = {};
        get Name() { return "FnTodo"; }
        private fn: delg;
        Todo?(job: JobInstance, e: EventArgs<any, any>): void {
            var v = this.fn;
            if (!(v instanceof Function)) return;
            var scp = job.Scop;
            var p = scp.__Controller__ && scp.__Controller__.MainControll
            v.call(p, e._old, e._new, scp, job, e);
        }
        constructor(private fns: string) {
            if (fns.indexOf('=') == 0) fns = fns.substr(1);

        }
        public static register(fn: string) {
            var t = basic.EvalCode.CompileExpression(fn, ["ovalue", "value", "scop", "job", "event"], (fn, b) => { stop(); }, this, true);
        }
    }

    export class EventData {
        scop?: Scop;
        constructor(public events: events, public interpolation: string) {

        }
        get dom() {return this.events.xx.Dom;}
        get controller() { return this.events.xx.controller; }
        get parentScop() { return this.events.xx.Scop; }
    }
    export class events implements basic.IJob, EventListenerObject {
        private events: { [eventType: string]: EventData[] };
        Name: string = "Events";
        Todo?(job: JobInstance, e: EventArgs<any, any>): void {
            throw new Error("Method not implemented.");
        }
        Register(eventType: string, v: string) {
            if (!this.events) this.events = {};
            var a = this.events[eventType];
            var s: EventData = new EventData(this, v);
            if (!a) {
                this.events[eventType] = a = [s];
                this.xx.Dom.addEventListener(eventType, this);
            }
            else a.push(s);

        }
        private getScop(e: EventData):EventData {
            if (e.scop !== undefined) return e;
            if (e.interpolation.indexOf('.') == 0) var parentScop = this.xx.Scop, v = v.substring(1);
            else var parentScop = this.scop;            
            e.scop = bind.Scop.Create(e.interpolation, parentScop, 0, this.xx.controller);
            if (!e.scop) e.scop = null;
            return e;
        }
        handleEvent(e: Event) {
            var scps = this.events[e.type];
            for (var i = 0; i < scps.length; i++) {
                var scp = this.getScop(scps[i]);
                helper.TryCatch(this, this.exec, void 0, [scp, this.scop, e]);
            }
        }

        private exec(dt: EventData, scopValue: Scop, e: Event) {
            var scp = dt.scop;
            var scpv = scp.Value;
            if (scp instanceof FunctionCallScop)
                return scp.Invoke();
            if (typeof scpv === 'function') {
                var p = scp.ParentValue;
                scpv.call(p, e, dt, scopValue, this);
            } else if (scpv instanceof Object && scpv.handleEvent) {
                scpv.handleEvent(e, dt, scopValue, this);
            }
        }
        constructor(public xx: Processor.Tree, private m: Processor.Manager, ) { this.scop = xx.Scop; }
        public scop: Scop
    }
    export abstract class Filter<T, CT> extends Scop {
        private dbb: PropBinding;

        constructor(protected source: Scop, bindingMode?: BindingMode) {
            super(bindingMode);
        }
        public Initialize() {
            if (this.source)
                this.dbb = this.source.OnPropertyChanged(Scop.DPValue, this.SourceChanged, this);
            this.Value = this.Convert(this.source ? this.source.Value : null);
        }
        protected isChanging: boolean;
        protected SourceChanged(p: PropBinding, e: EventArgs<any, Scop>) {
            if ((this._bindingMode & 1) === 0) return;
            if (this.isChanging) return;
            this.isChanging = true;
            this.Value = this.Convert(e._new);
            this.isChanging = false;
        }
        protected _OnValueChanged(e: bind.EventArgs<any, any>) {
            if ((this._bindingMode & 2) === 0) return;
            if (this.isChanging) return;
            this.isChanging = true;
            this.source.Value = this.ConvertBack(e._new);
            this.isChanging = false;
        }

        public Update() {
            this.Value = this.Convert(this.source.Value);
        }
        public UpdateBack() {
            this.source.Value = this.ConvertBack(this.Value);
        }
        protected abstract Convert(data: T): CT;
        protected abstract ConvertBack(data: CT): T;
        getParent() { return this.source; }
        setParent(v: Scop) {
            if (!this.canBeParent(v)) return false;
            if (this.source)
                this.source.removeEvent(Scop.DPValue, this.dbb);
            if (v)
                this.dbb = v.OnPropertyChanged(Scop.DPValue, this.SourceChanged, this);
            this.source = v;
            this.Initialize();
            return true;
        }
        Dispose() {
            if (this.source)
                this.source.removeEvent(Scop.DPValue, this.dbb);
            this.source = null;
            super.Dispose();
        }
    }
    export class DoubleFilter extends Filter<number, number> {
        public set Fraction(v: number) {
            if (this.fraction === v) return;
            this.fraction = v;
            switch (this._bindingMode) {
                case 0:
                    return;
                case 2:
                    this.UpdateBack();
                    return;
                case 1:
                case 3:
                    this.Update();
                    return;
            }
        }
        private fraction: number = 0.3333;
        protected Convert(data: number): number { return data / this.fraction; }
        protected ConvertBack(data: number): number { return data * this.fraction; }
    }

    export interface IFilter {
        Name: string;
        BindingMode: BindingMode;
        CreateNew(source: Scop, bindingMode: BindingMode, param: string): Filter<any, any>;
    }
    var filters = {};
    export function RegisterFilter(filter: IFilter) {
        if (filters[filter.Name]) return false;
        __corelib__.$defineProperty(filters, filter.Name, { value: filter, writable: false, configurable: false, enumerable: false });
        return true;
    }
    export function CreateFilter(filterName: string, parent: Scop, bindingMode: BindingMode) {
        var i = filterName.indexOf(':');
        if (i == -1) var p = null, name = filterName;
        else {
            name = filterName.substring(0, i);
            p = filterName.substring(i + 1);
        }
        var f = filters[name] as IFilter;
        if (!f) return parent;

        var e = f.CreateNew(parent, bindingMode & f.BindingMode, p);
        e.Initialize();
        return e;
    }

    export enum BindingMode {
        SourceToTarget = 1,
        TwoWay = 3,
        TargetToSource = 2,
    }
    /*
    export class ScopBinder {
        private events = { eventA: null, eventB: null, eventO: null };
        private obs: Observer;
        private get IsSourceToTarget() { return (this.mode & BindingMode.SourceToTarget) === BindingMode.SourceToTarget; }
        private get IsTargetToSource() { return (this.mode & BindingMode.TargetToSource) === BindingMode.TargetToSource; }

        constructor(private a: Scop, private mode: BindingMode, private path: string[], private b: Scop) {
            if (0 === (mode & 3)) return;
            var o = new Observer(a.Value, path);
            if (1 === (mode & 1))
                this.events.eventA = a.OnPropertyChanged(Scop.DPValue, this.aChanged);
            if (2 === (mode & 2))
                this.events.eventB = b.OnPropertyChanged(Scop.DPValue, this.bChanged);
            
            this.events.eventB = o.OnPropertyChanged(Observer.DPValue, this.oChanged);
        }
        private initialize() {
        }
        private aChanged(s: PropBinding, ev: EventArgs<any, Scop>) {
            if ((this.mode & BindingMode.SourceToTarget) === BindingMode.SourceToTarget)
                this.obs.Me = ev._new;
        }
        private bChanged(s: PropBinding, ev: EventArgs<any, Scop>) {

        }
        private oChanged(s: PropBinding, ev: EventArgs<any, Observer>) {

        }
    }

    */

    export class TwoBind<T> {
        private dba: PropBinding;
        private dbb: PropBinding;
        private IsChanging: boolean;
        constructor(private bindingMode: BindingMode, private a: DObject, private b: DObject, private pa: DProperty<T, any>, private pb: DProperty<T, any>) {
            this.dba = a.OnPropertyChanged(pa, this.pac, this);
            this.dbb = b.OnPropertyChanged(pb, this.pab, this);
            this.Dispose = this.Dispose.bind(this);
            a.OnDisposing = this.Dispose;
            b.OnDisposing = this.Dispose;
            if (bindingMode == BindingMode.TargetToSource)
                this.initB();
            else
                this.init();
        }

        protected init() {
            var va = this.a.GetValue(this.pa);
            (this.b as any).set(this.pb, va);
        }

        protected initB() {
            var vb = this.b.GetValue(this.pb);
            (this.a as any).set(this.pa, vb);
        }
        protected pac(p: PropBinding, e: EventArgs<any, any>) {

            if ((this.bindingMode & 1) == 0) return;
            if (this.IsChanging) return;
            this.IsChanging = true;
            (this.b as any).set(this.pb, e._new);
            this.IsChanging = false;
        }
        protected pab(p: PropBinding, e: EventArgs<any, any>) {

            if ((this.bindingMode & 2) == 0) return;
            if (this.IsChanging) return;
            this.IsChanging = true;
            (this.a as any).set(this.pa, e._new);
            this.IsChanging = false;
        }
        private disposed
        Dispose() {
            if (this.disposed) return;
            this.disposed = true;
            this.a.OffDisposing = this.Dispose;
            this.b.OffDisposing = this.Dispose;
            this.disposed = null;
            this.a.removeEvent(this.pa, this.dba);
            this.b.removeEvent(this.pb, this.dbb);
            this.a = null;
            this.b = null;
            this.dba = null;
            this.dbb = null;
            this.pa = null;
            this.pb = null;

        }
    }
    export class TwoDBind<T, P> {
        private dba: PropBinding;
        private dbb: PropBinding;
        private IsChanging: boolean;
        constructor(private bindingMode: BindingMode, private a: DObject, private b: DObject, private pa: DProperty<T, any>, private pb: DProperty<P, any>, private con: (v: T) => P, private conBack: (v: P) => T) {
            this.dba = a.OnPropertyChanged(pa, this.pac, this);
            this.dbb = b.OnPropertyChanged(pb, this.pab, this);
            this.Dispose = this.Dispose.bind(this);
            a.OnDisposing = this.Dispose;
            b.OnDisposing = this.Dispose;
            if (bindingMode == 2)
                this.initB();
            else
                this.init();
        }
        protected pac(p: PropBinding, e: EventArgs<any, any>) {
            if ((this.bindingMode & 1) == 0) return;
            if (this.IsChanging) return;
            this.IsChanging = true;
            (this.b as any).set(this.pb, this.con ? this.con(e._new) : e._new);
            this.IsChanging = false;
        }
        protected pab(p: PropBinding, e: EventArgs<any, any>) {
            if ((this.bindingMode & 2) == 0) return;
            if (this.IsChanging) return;
            this.IsChanging = true;
            (this.a as any).set(this.pa, this.conBack ? this.conBack(e._new) : e._new);
            this.IsChanging = false;
        }
        protected init() {
            var va = this.a.GetValue(this.pa);
            (this.b as any).set(this.pb, this.con ? this.con(va) : va);
        }
        protected initB() {
            var vb = this.b.GetValue(this.pb);
            (this.a as any).set(this.pa, this.con ? this.conBack(vb) : vb);
        }
        private disposed
        Dispose() {
            if (this.disposed) return;
            this.disposed = true;
            this.a.OffDisposing = this.Dispose;
            this.b.OffDisposing = this.Dispose;
            this.disposed = null;
            this.a.removeEvent(this.pa, this.dba);
            this.b.removeEvent(this.pb, this.dbb);
            this.a = null;
            this.b = null;
            this.dba = null;
            this.dbb = null;
            this.pa = null;
            this.pb = null;

        }
    }
}
export namespace Processor {

    export class debug {
        private static lst = [];
        public static OnAttribute(name, value) {
            this.lst.push({ check: (p: Instance) => { return p.instance.attribute == name && p.value == value; } });

        }
        public static check(p: Instance) {
            for (var i of this.lst) {
                if (i.check(p)) debugger;
            }
        }
    }

    export interface Result {
        e?: bind.IJobScop;
        Break?: boolean;
    }
    export enum Stat {
        None,
        Waitting,
        Executing,
        Executed
    }

    export interface Def {
        name: string;
        attribute: string;
        check?(x: Tree, e: Instance): boolean;
        execute: (x: Processor.Tree, e: Instance) => Result;
        valueParser?(value: string): any;
        priority?: number;
        isPrimitive?: boolean;
        isFinalizer?: boolean;
    }

    export interface Instance {
        stat: Stat;
        value: any;
        instance: Def;
        manager: Manager;
    }
    export interface ComponentCreator {
        Def: Def;
        css: string[];
        context: IContext;
        TagName: string;
    }
    export class Manager {
        private static _components: { [s: string]: Def } = {}
        private static _processors: { [s: string]: Def } = {};
        private static enumerator: Def[] = [];
        static maxPriority = 0;
        static getPrcessorByName(name: string) {
            for (var i in this._processors) {
                if (this._processors[i].name == name) return this._processors[i];
            }
            return undefined;
        }
        static getPrcessorByAttribute(name: string) {
            return this._processors[name];
        }
        static stringIsNullOrWhiteSpace(s: string) {
            return !(s && s.trim());
        }
        static registerComponent(p: Def) {
            if (this.stringIsNullOrWhiteSpace(p.name))
                throw new Error("attribute value is null");
            if (p.check && typeof p.check != 'function')
                throw new Error("check property is not function");
            if (typeof p.execute !== "function")
                throw new Error("create property is not function");
            if (this._components[p.name]) console.warn(`The component ${p.name} was overrided`);
            p.name = p.name.toUpperCase();
            p.isPrimitive = true;
            p.isFinalizer = false;
            p.priority = Number.POSITIVE_INFINITY;
            this._components[p.name] = p;
        }
        static register(p: Def) {
            if (this.stringIsNullOrWhiteSpace(p.attribute))
                throw new Error("attribute value is null");
            if (p.check && typeof p.check != 'function')
                throw new Error("check value is not function");
            if (this.stringIsNullOrWhiteSpace(p.name))
                p.name = p.attribute;
            p.attribute = p.attribute.toLowerCase();
            p.name = p.name.toLowerCase();
            if (!p.priority) p.priority = ++this.maxPriority;
            if (this.maxPriority < p.priority) this.maxPriority = p.priority;
            if (this._processors[p.attribute]) throw 'processor ' + p.attribute + ' cannot be re-define ';

            p.isPrimitive = !!p.isPrimitive;
            p.isFinalizer = !!p.isFinalizer;
            if (p.isFinalizer === p.isPrimitive && p.isFinalizer === true) throw new Error("invalid arguments isPremitive && isFinalizer set to true");
            this._processors[p.attribute] = p;
            this.enumerator.push(p);
            this.enumerator.sort(this.orderDefs);
        }
        private static orderDefs(a: Def, b: Def) {
            if (!!a.isPrimitive == !!b.isPrimitive)
                return a.priority - b.priority;
            else if (a.isPrimitive)
                return -1;
            else if (a.isFinalizer)
                return 1;
        }

        private static orderInstances(a: Instance, b: Instance) {
            return Manager.orderDefs(a.instance, b.instance);
        }
        public enumerator: Instance[] = [];
        public events: { [s: string]: string } = {};
        public ComponentCreator: Instance;
        getProcessorByAttribute(processor: string): Instance {
            for (var i of this.enumerator)
                if (i.instance.attribute == processor) return i;
            return undefined;
        }

        constructor(dom: Node) {
            var a = (dom as Element).attributes;
            if (dom instanceof HTMLElement) {
                if (Manager._components[dom.tagName])
                    this.enumerator.push(
                        this.ComponentCreator = {
                            instance: Manager._components[dom.tagName], manager: this, stat: Stat.Waitting, value: dom
                        });
            }
            for (var i = 0; i < a.length; i++) {
                var n = a[i].name;
                if (n.indexOf('on-') === 0) {
                    this.events[n.substr(3)] = a[i].value;
                }
                if (!Manager._processors.hasOwnProperty(n)) continue;
                var p = Manager.getPrcessorByAttribute(n);
                if (n.indexOf('db-') === 0) {
                    if (p) {
                        this.enumerator.push({ manager: this, instance: p, value: p.valueParser ? p.valueParser(a[i].value) : a[i].value, stat: Stat.Waitting });
                    }
                    else throw new Error('the processor ' + n + ' is not defined');
                }
                else {
                    p && this.enumerator.push({ instance: p, value: p.valueParser ? p.valueParser(a[i].value) : a[i].value, manager: this, stat: Stat.Waitting });
                }
            }
            this.enumerator = this.enumerator.sort(Manager.orderInstances);
        }
    }
    export class Tree {
        get Scop(): bind.Scop { return this.e.Scop || (this.parent && this.parent.Scop) || (this.controller.Scop); }
        get Control(): UI.JControl { return this.e.Control || (this.parent && this.parent.Control) || this.controller.CurrentControl };
        get Dom() { return this.e.dom; }
        public get IsNew() {
            if (this.parent)
                return this.e.Scop != this.parent.Scop || this.e.Control != this.parent.Control || this.e.Jobs.length != 0;
            else return this.e.Scop != null || this.e.Jobs.length != 0;
        }
        constructor(public e: bind.IJobScop,
            public parent: Tree,
            public controller: bind.Controller) {
        }
        public validateE() {
            if (this.IsNew) {
                this.e.Scop = this.Scop;
            }
        }
        public static New(dom: Node, parent: Tree, controller: bind.Controller): Tree {
            return new Tree({ dom: dom, Scop: null, Control: null, IsNew: false, Jobs: [] }, parent, controller);
        }
        public static Root(dom: Node, Scop: bind.Scop, Control: UI.JControl, controller?: bind.Controller) {
            return new Tree({ dom: dom, Scop: Scop, Control: Control, IsNew: false, Jobs: [] }, null, controller || Control.__Controller__);
        }
        public New(dom: Node) {
            return new Tree({ dom: dom, Scop: null, Control: null, IsNew: false, Jobs: [] }, this, this.controller);
        }
        public get Depth() {
            return this.parent ? this.parent.Depth + 1 : 1;
        }
    }



    export class MyClass {

        public static ParseBinding(data: Processor.Tree) {
            var instance = Processor.Compiler.Compile(data);
            data.e = instance;
            var cnt = instance.Control;
            if (instance.Jobs.length !== 0 || instance.IsNew)
                data.controller.instances.push(instance);
            if (!instance.Control)
                MyClass.ExploreTree(data);
            return instance;
        }

        public static ExploreTree(data: Processor.Tree) {
            var dom = data.Dom as Element;
            for (var i = 0; i < dom.childElementCount; i++) {
                var el = <HTMLElement>dom.children.item(i);
                if (el.hasAttribute('controlled'))
                    continue;
                this.ParseBinding(data.New(el));
            }
        }
    }

    export function register(p: Def) {
        Manager.register(p);
    }

    export class Compiler {
        private static initEvents(xx: Tree, m: Manager): bind.events {
            var e: bind.IJobScop = xx.e, parentScop: bind.Scop = xx.parent.Scop, controller: bind.Controller = xx.controller;

            if (!m.events) return;
            var x: bind.events;
            for (var i in m.events) {
                if (!x) x = new bind.events(xx, m);
                x.Register(i, m.events[i]);
            }
            return x;
        }

        public static Compile(x: Tree): bind.IJobScop {
            var dom = x.e.dom as Element;
            if (dom.hasAttribute('compiled')) return x.e;
            dom.setAttribute('compiled', '');
            var e: bind.IJobScop = x.e;
            var m = new Manager(dom);
            if (dom.hasAttribute('debugger')) debugger;
            for (var i of m.enumerator) {
                if (!i.instance.check || i.instance.check(x, i)) {
                    var r = i.instance.execute(x, i);
                    if (r) {
                        if (r.e) e = r.e;
                        if (r.Break) break;
                    }
                }
            }
            Compiler.initEvents(x, m);
            x.e.IsNew = x.Scop != x.parent.Scop || x.Control != x.parent.Control;
            x.validateE();
            if (!x.e.Scop) x.e.Scop = x.parent.Scop || x.controller.Scop;
            if (!e) stop();
            return e;
        }
    }

    export function Register(p: Processor.Def) {
        return Processor.Manager.register(p);
    }
    export function Compile(x: Tree) {
        return Compiler.Compile(x)
    }

}

bind.RegisterFilter({
    Name: '2bl', BindingMode: 3, CreateNew(s, b, p) {
        var e = new bind.DoubleFilter(s, b);
        if (p)
            e.Fraction = parseFloat(p);
        return e;
    }
});

export namespace ScopicControl {
    export interface ControlCreatorEventArgs {
        name: string;
        dom: HTMLElement;
        currentScop: bind.Scop;
        parentScop: bind.Scop;
        parentControl: UI.JControl;
        controller: bind.Controller;
        e: bind.IJobScop;
        Result?: UI.JControl;
    }
    export declare type IControlCreater = (e: ControlCreatorEventArgs) => UI.JControl;
    var _stor: { [name: string]: IControlCreater } = {};
    export function register(name: string, creator: IControlCreater) {
        _stor[name] = creator;
    }
    export function create(e:ControlCreatorEventArgs /*name: string, dom: Node, currentScop: bind.Scop, parentScop: bind.Scop, parentControl: UI.JControl, controller: bind.Controller, e: bind.IJobScop*/) {
        var c = _stor[e.name];
        if (c) return c(e);
    }
}

export namespace ScopicCommand {
    interface scmd<T> {
        callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>;
        Param: T;
    }
    interface cb { [i: string]: scmd<any> }
    var store: cb = {};
    var i = 0;
    export function Register<T>(callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>, param?: T, name?: string): string {
        var n = name ? name : '@' + ++i;
        store[n] = {
            callback: callback, Param: param
        };
        return n;
    }
    export function Call(n: string, dom: Node, scop: bind.Scop) {
        var cb = store[n];
        return cb ? cb.callback.Invoke.call(cb.callback.Owner, n, dom, scop, cb.Param) : void 0;
    }
    export function Delete(n: string) {
        delete store[n];
    }
    export function contains(n: string) {
        return store[n] != null;
    }

}

export namespace Api {
    var $freeze = Object.freeze;
    var _apis: apiGarbage = {};
    export interface IApiTrigger {
        Name: string;
        Filter: (cmdCallback: IApiCallback, params: any) => boolean;
        CheckAccess: (t: IApiTrigger) => boolean;
        Params?: any;
    }

    export interface IApiCallback {
        hash?: string;
        Name: string;
        DoApiCallback: (trigger: IApiTrigger, callback: IApiCallback, params: IApiParam) => void;
        Owner?: any;
        Params?: any;
    }
    export function RegisterApiCallback(api: IApiCallback) {
        if (typeof api.Name !== 'string') return false;
        if (api.DoApiCallback instanceof Function === false) return false;
        var c = _apis[api.Name];
        if (c == null) {
            c = { Callback: [api], Trigger: undefined };
            __corelib__.$defineProperty(_apis, api.Name, { value: c, configurable: false, enumerable: false, writable: false });
        } else {
            if (c.Callback.indexOf(api) !== -1) return;
            c.Callback.push(api);
        }
        $freeze(api);
    }
    export function RegisterTrigger(api: IApiTrigger) {
        if (typeof api.Name !== 'string') return false;
        if (api.Filter && !(api.Filter instanceof Function)) return false;
        var c = _apis[api.Name];
        if (c == null) {
            c = { Callback: [], Trigger: api };
            _apis[api.Name] = c;
            $freeze(c);
        } else if (c.Trigger == null) {
            c.Trigger = api;
            $freeze(c);
        } else throw "This Command Exist";
        $freeze(api);

    }
    export function RiseApi(apiName: string, params: IApiParam) {
        var api = _apis[apiName];
        if (!api) throw "Cmd Is Not Exist";
        var t = api.Trigger;
        if (t) {
            if (t.CheckAccess) if (!t.CheckAccess(t)) throw "Access denied";
            var f = t.Filter;
        }

        var cs = api.Callback;
        for (var i = 0, l = cs.length; i < l; i++) {
            var c = cs[i];
            if (f && !t.Filter(c, params)) continue;
            helper.TryCatch(c, c.DoApiCallback, void 0, [t, c, params]);
            //try {
            //    c.DoApiCallback(t, c, params);
            //} catch (e) { }
        }
    }
    export interface IApiParam {
        data: any;
        callback?(p: IApiParam, args);
    }
    export interface IApi {
        Trigger: IApiTrigger;
        Callback: IApiCallback[]
    }
    export interface apiGarbage {
        [name: string]: IApi;
    }

}

export namespace encoding {
    interface IDRef {
        val: any;
        paths?: IPath<any, any>[];
        setted?: boolean

    }
    export interface IPath<OB, DP> {
        Owner: OB;
        Property: DP;
        Set<T>(value: T): T;
        executed: boolean;
    }

    export interface colReader {
        value: string;//value
        cursor: charReader;//charCursor
        EOF: boolean;//EOF
    }

    export interface charReader {
        cursor: number;//index;
        value: string;//char;
        len?: number;//charLength;
        newLine?: boolean;//newLine;
        EOF?: boolean;//eof
    }


    function error(e:fillArgs) {
        try {
            return e.parser ? e.parser(e.e) : e.e.value;
        } catch (e) {
            return e.e.value;
        }
    }

    export class BPath implements IPath<bind.DObject, bind.DProperty<any, any>> {
        executed: boolean;
        public Set(value: any) {
            (this.Owner as any).set(this.Property, value);
            this.executed = true;
            return value;
        }
        constructor(public Owner: bind.DObject, public Property: bind.DProperty<any, any>) {

        }
    }
    export class Path implements IPath<any | bind.DObject, string | bind.DProperty<any, any>> {
        executed: boolean;
        public Set(value: any) {
            if (this.Property instanceof bind.DProperty)
                (this.Owner as any).set(this.Property, value);
            else
                this.Owner[this.Property as string] = value;
            this.executed = true;
            return value;
        }
        constructor(public Owner: any | bind.DObject, public Property: string | bind.DProperty<any, any>) {

        }
    }
    export class LPath implements IPath<collection.List<any>, number> {
        executed: boolean;
        public Set(value: any) {
            if (!this.Owner.Insert(this.Property, value))
                this.Owner.Add(value);
            this.executed = true;
            return value;
        }
        constructor(public Owner: collection.List<any>, public Property: number) {

        }
    }

    export interface Serialization<T> {
        FromJson(json, context: SerializationContext, ref: IRef): T;
        ToJson(data: T, context: SerializationContext, indexer: encoding.IIndexer);
    }
    export interface IRef {
        __ref__: number;
    }
    export interface IIndexer {
        ref: IRef;
        json: any;
        valid: boolean;
    }
    var _sstore = new collection.Dictionary<Function, Serialization<any>>("SerializationContext", false);
    export class SerializationContext {
        public static GlobalContext = new SerializationContext(true);
        private _store: collection.Dictionary<Function, Serialization<any>>;
        private _ext: SerializationContext[] = [];
        public RequireNew: (json: any, type: Function | reflection.GenericType) => boolean;
        public Dispose() {
            this.reset();
            this._ext = null;
            this._store = null;
            this.cnt = null;
            this.indexer = null;
            this.refs = null;
        }
        constructor(isDefault: boolean) {
            if (isDefault) this._store = _sstore;
            else this._store = new collection.Dictionary<Function, Serialization<any>>("SerializationContext", false);
        }
        public Register<T>(type: Function, ser: Serialization<T>) {
            this._store.Set(type, ser);
        }

        public UnRegister<T>(type: Function): Serialization<any> {
            return this._store.Remove(type);
        }
        public GetRegistration(type: Function): Serialization<any> {
            return this._store.Get(type);
        }
        public Append(con: SerializationContext) {
            this._ext.push(con);
        }
        public Get(type: Function): Serialization<any> {
            var v = this._store.Get(type);
            if (v) return v;
            var c = this._ext;
            for (var i = c.length - 1; i >= 0; i--)
                if ((v = c[i].Get(type)) != null) return v;
            return null;
        }
        private indexer = new collection.Dictionary<any, IIndexer>("Indexer", true);
        private refs: IDRef[] = [];
        public get(ref: number, path: IPath<any, any>) {
            var dref = this.refs[ref];
            if (dref) {
                if (dref.setted)
                    return path ? path.Set(this.refs[ref].val) : this.refs[ref].val;
                else
                    if (path) {
                        if (!dref.paths) dref.paths = [path];
                        else dref.paths.push(path);
                    }
                    else throw "entry Point not Found";
            }
            else {
                var i: IDRef = { val: undefined, paths: [path] };
                this.refs[ref] = i;

            }
            return undefined;
        }
        public set(ref: number, obj) {
            var x = this.refs[ref];
            if (x) {
                x.val = obj;
                x.setted = true;
                if (x.paths)
                    for (var i = 0; i < x.paths.length; i++)
                        x.paths[i].Set(obj);
            } else
                this.refs[ref] = { val: obj, setted: true };
        }

        private cnt: number = 0;
        public getJson(obj): IIndexer {
            var l = this.indexer.Get(obj);
            if (l == null) {
                var ref = { __ref__: ++this.cnt };
                var json = { '@ref': ref };
                this.indexer.Set(obj, l = { ref: ref, json: json, valid: false });
                if (obj instanceof bind.DObject) {
                    var type = context.NameOf(obj.constructor);
                    if (type != null) json['__type__'] = type;
                }
            }
            return l;
        }
        public reset() {
            this.indexer.Clear();
            this.cnt = 0;
            this.refs.length = 0;
            return this;
        }
        public static getType(type: Function) {
            while (true) {
                if (type instanceof reflection.DelayedType)
                    type = (type as any as reflection.DelayedType).Type;
                else if (type instanceof reflection.GenericType)
                    type = (type as any as reflection.GenericType).Constructor;
                else return type;
            }
        }

        public FromJson(json: any, type: Function | reflection.GenericType, path: IPath<any, any>) {
            if (json == null) return path ? path.Set(json) : json;
            if (type instanceof reflection.DelayedType)
                type = (type as any as reflection.DelayedType).Type;
            if (type instanceof reflection.GenericType)
                type = (type as any as reflection.GenericType).Constructor;
            if (type === String || type === Number || type === Boolean)
                return path ? path.Set(json) : json;
            else if (type === Date) {

                if (typeof json === 'string')
                    return path.Set(new Date(Date.parse(json)));
                return path.Set(new Date(json));
            }
            if (typeof json.__ref__ == 'number')
                return this.get(json.__ref__, path);
            var obj;
            var ref = json['@ref'] as IRef;
            delete json['@ref'];

            if (reflection.IsInstanceOf(type, bind.DObject)) {
                if ((type as any).CreateFromJson)
                    obj = (type as any).CreateFromJson(json, type, this.RequireNew ? this.RequireNew(json, type) : false);

                if (obj == null)
                    obj = new (type as any)() as bind.DObject;

                if (ref) this.set(ref.__ref__, obj);
                obj = (obj as bind.DObject).FromJson(json, this);
            }
            else {
                if (type.prototype != null && type.prototype.hasOwnProperty('fromJson'))
                    obj = type.prototype.fromJson(json, context, ref);
                else {

                    var c = this.Get(type as any);
                    obj = c != null ? c.FromJson(json, this, ref) : json;

                } if (ref) this.set(ref.__ref__, obj);
            }
            return path ? path.Set(obj) : obj;
        }

        public ToJson(obj: any) {
            if (obj === null) return null;
            switch (typeof obj) {
                case 'undefined':
                case 'boolean':
                case 'number':
                case 'string':                
                    return obj;
                case 'function':
                    return (obj as Function).toString();
                default:
                    var ref_json: encoding.IIndexer = this.getJson(obj);
                    if (ref_json.valid) return ref_json.ref;
                    if (obj === Object) return this._toJson(obj, ref_json);
                    else if (obj instanceof bind.DObject)
                        return (obj as bind.DObject).ToJson(this, ref_json);
                    else {
                        var c = this.Get(obj.constructor);
                        if (c) {
                            return c.ToJson(obj, this, ref_json);
                        }
                        else return this._toJson(obj, ref_json);
                    }
            }
        }
        private _toJson(obj, ret: IIndexer) {
            ret.valid = true;
            if (obj instanceof Array)
                return this._arrayToJson(obj, ret);
            ret.json = {};
            for (let i in obj)
                ret.json[i] = this.ToJson(obj[i]);
            return ret.json;
        }
        public toString() {
            JSON.stringify(this);
        }
        _arrayToJson(arr: Array<any>, ret: IIndexer) {
            var lst = [];
            var json = { "__type__": NativeTypes.Array, "__value__": lst, "@ref": ret.ref.__ref__ };
            for (let i = 0; i < arr.length; i++)
                lst[i] = this.ToJson(arr[i]);
            return json;
        }
    }

    export interface CsvEventArgs {
        csv: CSV;
        index?: number;
        value?: any;
        set(this: CsvEventArgs, value: any, index: number): CsvEventArgs;
    }

    export interface fillArgs {
        csv?: CSV;
        parser?: (e: CsvEventArgs) => any;
        header?: string[];
        cols?: Object | any[];
        e?: CsvEventArgs;
    }

    export class CSV {
        static separator = ';';
        static emptyArray: string[] = Object.freeze([] as string[]) as any;
        private e: CsvEventArgs = {
            csv: this, index: -1, value: void 0, set(this: CsvEventArgs, value: any, index: number) { this.value = value; this.index= index; return this; }
        };
        public Columns = new Array();
        private _cursor: charReader;
        private _startCursor: charReader;
        public static ReadAllLines(s: string): string[] {
            var t: string[] = [];
            var pi = 0;
            var inq = false;
            for (var i = 0; i < s.length; i++) {
                var c = s[i];
                if (c == '\\') { i++; continue; }
                if (c == '"' && s[i - 1] !== '\\') inq = !inq;
                if (inq) continue;
                if (c == '\r') {
                    t.push(s.substr(pi, i - pi));
                    if (s[i + 1] == '\n')
                        i++;
                    pi = i + 1;
                }
            }
            return t;
        }

        private parse(pind: number, s: string) {

        }
        private static isEmptyLine(s: string, pchar: charReader): boolean {
            if (!pchar) pchar = { cursor: 0, value: void 0 };
            else if (pchar.EOF) return true;
            var c = pchar.cursor || 0;
            var cchar = s[c];
            var r = s[c + 1];
            if (r == '\r') {
                var n = s[c + 2];
                if (n == '\n')
                    var nchar = <charReader>{ cursor: c + 3, EOF: s[c + 3] == null, len: 2, newLine: true, value: '\r\n' };
                else nchar = <charReader>{ cursor: c + 2, EOF: n == void 0, len: 1, newLine: true, value: '\r' };
            } else nchar = { cursor: c + 1, EOF: r == void 0, len: 0, newLine: false, value: '' };

            if (nchar.EOF) return true;
            if (nchar.newLine && pchar.newLine) return true;
            return false;
        }
        private static trim(s: string, pchar: charReader): charReader {
            if (!pchar) pchar = { cursor: 0, value: void 0 };
            else if (pchar.EOF) return pchar;
            var c = pchar.cursor || 0;
            var cchar = s[c];
            var r = s[c + 1];
            if (r == '\r') {
                var n = s[c + 2];
                if (n == '\n')
                    var nchar = <charReader>{ cursor: c + 3, EOF: s[c + 3] == null, len: 2, newLine: true, value: '\r\n' };
                else nchar = <charReader>{ cursor: c + 2, EOF: n == void 0, len: 1, newLine: true, value: '\r' };
            } else if (r == void 0) {
                nchar = { cursor: c + 1, EOF: true, len: 0, newLine: void 0, value: void 0 };
            }else return pchar;
            return nchar;
        }

        private static nextChar(s: string, pchar: charReader): charReader {
            if (!pchar) pchar = { cursor: 0, value: void 0 };
            else if (pchar.EOF) return pchar;
            var start: number = pchar.cursor;
            var i = start;
            var lc: string;
            while (i < s.length) {
                lc = c;
                var c = s[i++];
                if (c === this.separator)
                    return { value: c, cursor: i };
                if (c === '"') {
                    if (lc !== '\\')
                        return { value: '"', cursor: i - 1 };
                }
                else if (c === '\r') {
                    var hasn = s[i] === '\n';
                    if (hasn) i++;
                    return { value: hasn ? '\r\n' : c, cursor: i, newLine: true, len: hasn ? 2 : 1 };
                }
            }
            return { value: void 0, cursor: s.length, EOF: true };
        }
        private static readString(s: string, stat: charReader): charReader {
            var start = stat.cursor;
            var i = start;
            var lc = s[i];
            if (lc !== '"') return null;

            while (++i < s.length) {
                if (s[i] == '"' && lc !== '\\')
                    return { value: s.substring(stat.cursor, i + 1), cursor: i + 1, EOF: i == s.length - 1 };
                else
                    lc = s[i];
            }
            return { value: s.substring(start), cursor: s.length, EOF: true };
        }
        private static readColumn(s: string, cursor: charReader): colReader {
            if (!cursor) cursor = { cursor: 0, value: void 0 };
            else if (cursor.EOF) return void 0;
            var i = cursor;
            while (true) {
                var nchar = this.nextChar(s, i);
                if (nchar.value === this.separator)
                    return { value: s.substring(cursor.cursor, nchar.cursor - 1), EOF: false, cursor: nchar };
                else if (nchar.EOF) {
                    return { value: s.substr(cursor.cursor), EOF: true, cursor: nchar };
                }
                else if (nchar.newLine)
                    return { value: s.substring(cursor.cursor, nchar.cursor - nchar.len), EOF: false, cursor: nchar };
                else if (nchar.value === '"') {
                    var t = this.readString(s, nchar);
                    i = t;
                }
            }
        }
        private static clear(arr: any[], start: number) {
            for (; start < arr.length; start++)
                arr[start] = void 0;
            return arr;
        }

        private static fillColumns(s: string, stat: charReader, e: fillArgs): charReader {
            if (!e.e) {
                e.e = {
                    csv: void 0,
                    set(v, i) { this.value = v; this.index = i; return this; }
                }
            };
            var cols = e.cols;
            var header = e.header;
            const isarr = cols instanceof Array;
            if (stat && stat.EOF) {
                if (isarr)
                    this.clear(cols as any, 0);
                return stat;
            }
            var i = 0;
            var cursor = stat;
            do {
                var p = this.readColumn(s, cursor);
                if (!p) {
                    if (isarr)
                        this.clear(cols as any, i);
                    return { EOF: true, cursor: s.length, value: void 0 };
                }
                cursor = p.cursor;
                e.e.set(p.value, i);
                var v = error(e);
                if (isarr)
                    (cols as Array<any>)[i] = v;
                else if (header[i]) cols[header[i]] = v;
                i++;
            } while (!cursor.EOF && i < (isarr ? cols as any : header).length && !cursor.newLine);

            if (!cursor.EOF && !p.cursor.newLine)
                while (cursor && !cursor.EOF && !cursor.newLine)
                    p = this.readColumn(s, cursor), cursor = p && p.cursor;
            if (isarr)
                this.clear(cols as any, i);
            return cursor;
        }
        private static readLine(s: string, stat: charReader, e: fillArgs): charReader {
            if (!e.e) {
                e.e = {
                    csv: void 0,
                    set(v, i) { this.value = v; this.index = i; return this; }
                }
            };
            var cols = e.cols;
            var header = e.header;
            var isarr = cols instanceof Array;
            if (isarr)
                (cols as Array<any>).length = 0;
            if (stat && stat.EOF) return stat;
            var cursor = stat;
            var i = 0;
            do {
                var p = this.readColumn(s, cursor);
                if (!p)
                    return { EOF: true, cursor: s.length, value: void 0 };
                cursor = p.cursor;
                e.e.set(p.value, i);
                var v = error(e);
                if (isarr)
                    (cols as Array<any>).push(v);
                else if (header[i]) cols[header[i]] = v;
                i++;
            } while (!p.EOF && !p.cursor.newLine);
            return cursor;
        }

        public constructor(private input: string, private autoParse: boolean, private asJson) {
            this._cursor = CSV.readLine(input, void 0, { cols: this.Columns, csv: this, e: this.e, parser: (v) => v.value });
            Object.defineProperty(this, '_startCursor', { value: this._cursor, configurable: false, writable: false, enumerable: false });
            this._current = asJson ? {} : new Array(this.Columns.length);
        }

        public ColumnName(index: number): string {
            return this.Columns[index] || "";
        }
        public ColumnIndex(name: string) { return this.Columns.indexOf(name); }
        private _current: string[] | Object = void 0;
        public get Cursor() { return this._cursor; }
        public Reset() { this._cursor = this._startCursor; return this; }
        public AllowNullValue: boolean;
        public Next(e?: fillArgs) {
            if (this._cursor.EOF) return false;
            if (!this.AllowNullValue)
                while (true) {
                    var x = CSV.trim(this.input, this._cursor);
                    if (x === this._cursor) break;
                    if (x.EOF) return false;
                    if (x.newLine) { this._cursor = x; continue; }
                    else break;
                }
            this._cursor = CSV.fillColumns(this.input, this._cursor, this.swapArgs(e));
            return true;
        }
        swapArgs(e: fillArgs): fillArgs {
            if (!e) return {
                cols: this._current,
                parser: this.autoParse ? this.jsonParser : void 0,
                header: this.Columns || []
                , csv: this, e: this.e
            }
            if (!e.cols) e.cols = this._current;
            if (!e.header) e.header = this.Columns || [];
            if (!e.csv) e.csv = this;
            if (!e.e) e.e = this.e;
            return e;
        }
        private jsonParser(e: CsvEventArgs) { return !e.value ? void 0 : JSON.parse(e.value); }
        public get Current(): any[] | Object { return this._current; }
        public Field(name_index: string | number) {
            var c = this.Current;
            return c ? this.Current[typeof name_index === 'string' ? this.Columns.indexOf(name_index) : name_index] : null;
        }
    }

    export enum NativeTypes {
        Nullable = 0,
        Boolean = 1,
        Number = 2,
        String = 3,
        Function = 4,
        Array = 5,
        Object = 6,
        DObject = 7
    }
    window['GC'] = () => encoding.SerializationContext.GlobalContext;
    declare var TextDecoder;
    export class UTF8 {

        static UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
        static ToArray(str: string, outU8Array: (Uint8Array | number[]), outIdx: number, maxBytesToWrite: number) {
            if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
                return 0;

            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
            for (var i = 0; i < str.length; ++i) {
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
                var u = str.charCodeAt(i); // possibly a lead surrogate
                if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
                if (u <= 0x7F) {
                    if (outIdx >= endIdx) break;
                    outU8Array[outIdx++] = u;
                } else if (u <= 0x7FF) {
                    if (outIdx + 1 >= endIdx) break;
                    outU8Array[outIdx++] = 0xC0 | (u >> 6);
                    outU8Array[outIdx++] = 0x80 | (u & 63);
                } else if (u <= 0xFFFF) {
                    if (outIdx + 2 >= endIdx) break;
                    outU8Array[outIdx++] = 0xE0 | (u >> 12);
                    outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 0x80 | (u & 63);
                } else if (u <= 0x1FFFFF) {
                    if (outIdx + 3 >= endIdx) break;
                    outU8Array[outIdx++] = 0xF0 | (u >> 18);
                    outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 0x80 | (u & 63);
                } else if (u <= 0x3FFFFFF) {
                    if (outIdx + 4 >= endIdx) break;
                    outU8Array[outIdx++] = 0xF8 | (u >> 24);
                    outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 0x80 | (u & 63);
                } else {
                    if (outIdx + 5 >= endIdx) break;
                    outU8Array[outIdx++] = 0xFC | (u >> 30);
                    outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
                    outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 0x80 | (u & 63);
                }
            }
            // Null-terminate the pointer to the buffer.
            outU8Array[outIdx] = 0;
            return outIdx - startIdx;
        }
        static lengthOf(str: string) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i); // possibly a lead surrogate
                if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
                if (u <= 0x7F) {
                    ++len;
                } else if (u <= 0x7FF) {
                    len += 2;
                } else if (u <= 0xFFFF) {
                    len += 3;
                } else if (u <= 0x1FFFFF) {
                    len += 4;
                } else if (u <= 0x3FFFFFF) {
                    len += 5;
                } else {
                    len += 6;
                }
            }
            return len;
        }
        static ToString(u8Array: Uint8Array, idx: number) {
            var endPtr = idx;
            // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
            // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
            while (u8Array[endPtr])++endPtr;

            if (endPtr - idx > 16 && u8Array.subarray && UTF8.UTF8Decoder) {
                return UTF8.UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
            } else {
                var u0, u1, u2, u3, u4, u5;

                var str = '';
                while (1) {
                    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
                    u0 = u8Array[idx++];
                    if (!u0) return str;
                    if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
                    u1 = u8Array[idx++] & 63;
                    if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
                    u2 = u8Array[idx++] & 63;
                    if ((u0 & 0xF0) == 0xE0) {
                        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                    } else {
                        u3 = u8Array[idx++] & 63;
                        if ((u0 & 0xF8) == 0xF0) {
                            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
                        } else {
                            u4 = u8Array[idx++] & 63;
                            if ((u0 & 0xFC) == 0xF8) {
                                u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
                            } else {
                                u5 = u8Array[idx++] & 63;
                                u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
                            }
                        }
                    }
                    if (u0 < 0x10000) {
                        str += String.fromCharCode(u0);
                    } else {
                        var ch = u0 - 0x10000;
                        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
                    }
                }
            }
        }
        static GetBytes(str: string) {
            var l = this.lengthOf(str) + 1;
            var buffer = new Array(l);
            this.ToArray(str, buffer, 0, l);
            return buffer;
        }
    }
    export class UTF16 {
        static UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
        static ToString(HEAP16: Uint16Array, ptr: number) {
            console.assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
            var endPtr = ptr;
            // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
            // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
            var idx = endPtr >> 1;
            while (HEAP16[idx])++idx;
            endPtr = idx << 1;

            if (endPtr - ptr > 32 && UTF16.UTF16Decoder) {
                return UTF16.UTF16Decoder.decode(new Uint8Array(HEAP16, ptr, endPtr - ptr + 1));
            } else {
                var i = 0;

                var str = '';
                while (1) {
                    var codeUnit = HEAP16[(((ptr) + (i * 2)) >> 1)];
                    if (codeUnit == 0) return str;
                    ++i;
                    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
                    str += String.fromCharCode(codeUnit);
                }
            }
        }


        static ToArray(str: string, HEAP16: Uint16Array, outPtr: number, maxBytesToWrite: number) {
            console.assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
            console.assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
            // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
            if (maxBytesToWrite === undefined) {
                maxBytesToWrite = 0x7FFFFFFF;
            }
            if (maxBytesToWrite < 2) return 0;
            maxBytesToWrite -= 2; // Null terminator.
            var startPtr = outPtr;
            var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
            for (var i = 0; i < numCharsToWrite; ++i) {
                // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
                var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
                HEAP16[((outPtr) >> 1)] = codeUnit;
                outPtr += 2;
            }
            // Null-terminate the pointer to the HEAP.
            HEAP16[((outPtr) >> 1)] = 0;
            return outPtr - startPtr;
        }

        static lengthBytesUTF16(str: string) {
            return str.length * 2;
        }
    }
    export class UTF32 {
        static UTF32ToString(HEAP32: Uint32Array, ptr: number) {
            console.assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
            var i = 0;

            var str = '';
            while (1) {
                var utf32 = HEAP32[(((ptr) + (i * 4)) >> 2)];
                if (utf32 == 0)
                    return str;
                ++i;
                // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                if (utf32 >= 0x10000) {
                    var ch = utf32 - 0x10000;
                    str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
                } else {
                    str += String.fromCharCode(utf32);
                }
            }
        }
        /**@description  
         Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
         null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
         Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
         Parameters:
           str: the Javascript string to copy.
           outPtr: Byte address in Emscripten HEAP where to write the string to.
           maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
                            terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
                            maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
         Returns the number of bytes written, EXCLUDING the null terminator.
        */
        static stringToUTF32(str: string, HEAP32: Uint32Array, outPtr: number, maxBytesToWrite: number) {
            console.assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
            console.assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
            // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
            if (maxBytesToWrite === undefined) {
                maxBytesToWrite = 0x7FFFFFFF;
            }
            if (maxBytesToWrite < 4) return 0;
            var startPtr = outPtr;
            var endPtr = startPtr + maxBytesToWrite - 4;
            for (var i = 0; i < str.length; ++i) {
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
                if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
                    var trailSurrogate = str.charCodeAt(++i);
                    codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
                }
                HEAP32[((outPtr) >> 2)] = codeUnit;
                outPtr += 4;
                if (outPtr + 4 > endPtr) break;
            }
            // Null-terminate the pointer to the HEAP.
            HEAP32[((outPtr) >> 2)] = 0;
            return outPtr - startPtr;
        }

        // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.
        static lengthBytesUTF32(str: string) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                var codeUnit = str.charCodeAt(i);
                if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF)++i; // possibly a lead surrogate, so skip over the tail surrogate.
                len += 4;
            }

            return len;
        }


    }

    export namespace Utf8 {
        const root = () => {
        };
        const stringFromCharCode = String.fromCharCode;

        // Taken from https://mths.be/punycode
        export function ucs2decode(string) {
            const output = [];
            let counter = 0;
            const length = string.length;
            let value;
            let extra;
            while (counter < length) {
                value = string.charCodeAt(counter++);
                if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                    // high surrogate, and there is a next character
                    extra = string.charCodeAt(counter++);
                    if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                    } else {
                        // unmatched surrogate; only append this code unit, in case the next
                        // code unit is the high surrogate of a surrogate pair
                        output.push(value);
                        counter--;
                    }
                } else {
                    output.push(value);
                }
            }
            return output;
        }

        // Taken from https://mths.be/punycode
        export function ucs2encode(array) {
            const length = array.length;
            let index = -1;
            let value;
            let output = '';
            while (++index < length) {
                value = array[index];
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                    value = 0xDC00 | value & 0x3FF;
                }
                output += stringFromCharCode(value);
            }
            return output;
        }

        function checkScalarValue(codePoint) {
            if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
                throw Error(
                    `Lone surrogate U+${codePoint.toString(16).toUpperCase()} is not a scalar value`
                );
            }
        }
        /*--------------------------------------------------------------------------*/

        function createByte(codePoint, shift) {
            return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
        }

        function encodeCodePoint(codePoint) {
            if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
                return stringFromCharCode(codePoint);
            }
            let symbol = '';
            if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
                symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
            }
            else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
                checkScalarValue(codePoint);
                symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
                symbol += createByte(codePoint, 6);
            }
            else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
                symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
                symbol += createByte(codePoint, 12);
                symbol += createByte(codePoint, 6);
            }
            symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
            return symbol;
        }

        export function utf8encode(string) {
            const codePoints = ucs2decode(string);
            const length = codePoints.length;
            let index = -1;
            let codePoint;
            let byteString = '';
            while (++index < length) {
                codePoint = codePoints[index];
                byteString += encodeCodePoint(codePoint);
            }
            return byteString;
        }

        /*--------------------------------------------------------------------------*/

        function readContinuationByte() {
            if (byteIndex >= byteCount) {
                throw Error('Invalid byte index');
            }

            const continuationByte = byteArray[byteIndex] & 0xFF;
            byteIndex++;

            if ((continuationByte & 0xC0) == 0x80) {
                return continuationByte & 0x3F;
            }

            // If we end up here, it�s not a continuation byte
            throw Error('Invalid continuation byte');
        }

        function decodeSymbol() {
            let byte1;
            let byte2;
            let byte3;
            let byte4;
            let codePoint;

            if (byteIndex > byteCount) {
                throw Error('Invalid byte index');
            }

            if (byteIndex == byteCount) {
                return false;
            }

            // Read first byte
            byte1 = byteArray[byteIndex] & 0xFF;
            byteIndex++;

            // 1-byte sequence (no continuation bytes)
            if ((byte1 & 0x80) == 0) {
                return byte1;
            }

            // 2-byte sequence
            if ((byte1 & 0xE0) == 0xC0) {
                byte2 = readContinuationByte();
                codePoint = ((byte1 & 0x1F) << 6) | byte2;
                if (codePoint >= 0x80) {
                    return codePoint;
                } else {
                    throw Error('Invalid continuation byte');
                }
            }

            // 3-byte sequence (may include unpaired surrogates)
            if ((byte1 & 0xF0) == 0xE0) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
                if (codePoint >= 0x0800) {
                    checkScalarValue(codePoint);
                    return codePoint;
                } else {
                    throw Error('Invalid continuation byte');
                }
            }

            // 4-byte sequence
            if ((byte1 & 0xF8) == 0xF0) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                byte4 = readContinuationByte();
                codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
                    (byte3 << 0x06) | byte4;
                if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
                    return codePoint;
                }
            }

            throw Error('Invalid UTF-8 detected');
        }

        var byteArray;
        var byteCount;
        var byteIndex;
        export function utf8decode(byteString) {
            byteArray = ucs2decode(byteString);
            byteCount = byteArray.length;
            byteIndex = 0;
            const codePoints = [];
            let tmp;
            while ((tmp = decodeSymbol()) !== false) {
                codePoints.push(tmp);
            }
            return ucs2encode(codePoints);
        }

        /*--------------------------------------------------------------------------*/

        export var version = '3.0.0';
        export var encode = utf8encode;
        export var decode = utf8decode;
    }
}


export class xNode<T> {
    children: xNode<T>[] = [];
    parent: xNode<T>;
    constructor(public node: Node, public param: T, public unknown?: xNode<T>[]) {
        if (!unknown) this.unknown = [];
    }
    add(node: Node, param: T) {
        var v = new xNode(node, param, this.unknown);
        v = this.__add(v);
        if (this.unknown.length)
            return this.Validate();
        return v;
    }
    __add(v:xNode<T>) {
        var t = this._add(v);
        if (t) return t;
        for (var i = 0; i < this.unknown.length; i++) {
            if (t = this.unknown[i]._add(v)) return t;
        }
        for (var i = 0; i < this.unknown.length; i++)
            if (this.unknown[i].node == v.node) return this;
        this.unknown.push(v);
        return this;
    }
    public Validate() {
        var t = this;
        for (var i = 0; i < this.unknown.length; i++) {
            var t1 = this._add(this.unknown[i]);
            if (t1) {
                this.unknown.splice(i, 1);
                i--;
            }
        }
        return this;
    }
    public ReValidate(callback: (node: xNode<T>) => void) {
        if (this.unknown) {
            for (var i = 0; i < this.unknown.length; i++) {
                if (this.node.contains(this.unknown[i].node)) {
                    callback(this.unknown[i])
                    this.unknown.splice(i, 1);
                    i--;
                }
            }
        }
    }

    get(node: Node) {
        for (var i = 0; i < this.children.length; i++) {
            var c = this.children[i];
            if (c.node == node)
                return c;
            if (c = c.get(node)) return c;
        }
    }
    private _add(node: xNode<T>):xNode<T> {
        var s = false;
        if (this.node.contains(node.node)) {
            for (var i = 0; i < this.children.length; i++) {
                var c = this.children[i]
                if (node.node == c.node) return this;
                if (c._add(node)) return this;
                if (node.node.contains(c.node))
                    this.children.splice(i, 1, c);
            }
            if (this.children.indexOf(node) == -1)
                this.children.push(node);
            return this;
        }
        if (this.node == node.node) return this;
        if (node.node.contains(this.node))
            return node._add(this);
        return undefined;
    }
    public remove(node: Node) {
        for (var i = 0; i < this.children.length; i++) {
            var c = this.children[i];
            if (c.node == node) {
                this.children.push.apply(this.children, c.children);
                this.children.splice(i, 1);
                return c;
            } else if (c = c.remove(node)) return c;
        }

    }
    //public remove(node: Node) {
    //    //var n = this.unknown;
    //    //for (var i = 0; i < n.length; i++)
    //    //    if (n[i].node == node) {
    //    //        n.splice(i, 1);
    //    //        return n[i];
    //    //    }
    //    return this._remove(node);
    //}
    hasChild(node: Node) {
        for (var i = 0; i < this.children.length; i++) {
            var c = this.children[i];
            if (node.contains(c.node))
                return c;
            if (c = c.hasChild(node))
                return c;
        }
    }

    foreach(callback: (parent: xNode<T>, child: xNode<T>) => number,parent?:xNode<T>) {
        var t = callback(parent, this);
        if (t > 0) return t;
        for (var i = 0; i < this.children.length; i++) {
            var t = this.children[i].foreach(callback, this);
            if (t > 0) return t - 1;
        }
        return 0;
    }
}

class fast {
    public dic = new collection.Dictionary<Node, bind.Controller>("s");
    public unknown = new collection.Dictionary<Node, bind.Controller>("s1");
    //public unknown: { node: Node, param: bind.Controller }[] = [];
    public add(node: Node, param: bind.Controller) {
        var x = this.dic.Get(node);
        if (x) return;
        var l = this.unknown.Get(node);
        if (l) return;
        if (window.document.body.contains(node))
            return this.dic.Set(node, param);
        else this.unknown.Set(node, param);
    }
    public ReValidate(callback: (node: Node, param: bind.Controller) => void, onficish: () => void) {
        var n: Node;
        if (this.unknown) {
            for (var i = 0, l = this.unknown.Count; i < l; i++) {
                if (window.document.body.contains(n = this.unknown.GetKeyAt(i))) {
                    callback(n, this.unknown.GetValueAt(i));
                    this.unknown.RemoveAt(i);
                    i--;
                }
            }
        }
        onficish && onficish();
    }
    public Remove(node: Node) {
        var c = this.dic.Remove(node);
    }
    public GetAndRemove(node: Node) {
        return this.dic.Remove(node);
    }
    public Dispose(node: Node) {
        var l = this.dic.Remove(node);
        return this.unknown.Remove(node) || l;
    }
}
export namespace UIDispatcher {
    export function OnIdle(f: () => void) {
        help.pushToIdl(f);
    }
}
namespace help {
    var uiListDispatcher: (() => void)[] = [];
    var isExecuting: boolean;
    var f: fast;
    export function OnNodeInserted(controller: bind.Controller, dom: Node) {
        f.add(dom, controller);
        if (!__global.useListenerOrMutation)
            dom.addEventListener("DOMNodeInsertedIntoDocument", controller);
    }
    export function RemoveListener(dom: Node) {
        var c = f.Dispose(dom);
        if (!__global.useListenerOrMutation)
            dom.removeEventListener("DOMNodeInsertedIntoDocument", c);
    }
    function observe(mutations: MutationRecord[], observer: MutationObserver): void {
        var cmd: string;
        var n: NodeList;
        var t = [];
        if (f.dic.Count)
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type == 'childList') {
                    n = m.addedNodes;
                    for (var j = 0; j < n.length; j++) {
                        var c = f.GetAndRemove(n[j]);
                        if (c)
                            c.OnNodeLoaded();
                    }
                }
            }
        if (f.unknown.Count)
            thread.Dispatcher.call(f, f.ReValidate, (node, controller) => {
                controller.OnNodeLoaded();
            }, OnMutationFinished);
    }
    function OnMutationFinished() {
        if (isExecuting) return;
        runQueue();
    }
    function runQueue() {
        if (uiListDispatcher.length == 0) return;
        isExecuting = true;
        if (thread.Dispatcher.IsRunning())
            return thread.Dispatcher.OnIdle(null, runQueue);
        else
            thread.Dispatcher.call(null, execute);
    }
    function execute() {
        for (var i = 0; i < uiListDispatcher.length; i++)
            helper.TryCatch(undefined, uiListDispatcher[i]);
            //try {
            //    uiListDispatcher[i]();
            //} catch{ }

        uiListDispatcher.splice(0, uiListDispatcher.length);
        isExecuting = false;
    }
    export function pushToIdl(f) {
        if (!(f instanceof Function)) return;
        uiListDispatcher.push(f);
        OnMutationFinished();
    }
    function init() {
        f = new fast();
        if (__global.useListenerOrMutation) {
            var t = new MutationObserver(observe);
            t.observe(document.body, { childList: true, subtree: true });
        }
    }
    init();

}

export namespace net {
    export class Header {
        private _key: string;

        public get key(): string {
            return this._key;
        }

        private _value: string;

        public get value(): string {
            return this._value;
        }

        constructor(key, value) {
            this._key = key;
            this._value = value;
        }
    }

    export enum ResponseType {
        json,
        document,
        text,
        arraybuffer,
        blob
    }

    export enum WebRequestMethod {
        Get,
        Post,
        Head,
        Put,
        Delete,
        Options,
        Connect,
        Create,
        Open,
        Close,
        Validate,
        FastValidate,
        Print,
        UPDATE,
        SUPDATE,
        Set

    }

    export class WebRequest implements basic.IDisposable {

        public Uid: string;
        public Pwd: string;

        private http: XMLHttpRequest = new XMLHttpRequest();
        private _responseType: ResponseType = null;

        public getResponseType(): ResponseType {
            return  typeof this._responseType === 'number' ? this._responseType : ResponseType.text;
        }

        public setResponseType(v: ResponseType): ResponseType {
            this._responseType = v;
            return v;
        }
        public set Crypto(v: basic.ICrypto) {
            this.crypt = v;
        }

        private key: Object = new Object();
        private downloadDelegate: basic.IDelegate;

        constructor(public crypt?: basic.ICrypto) {
            this.OnComplete = new bind.EventListener<(e: WebRequest) => void>(this.key);
            this.http.addEventListener('loadend',
                this.downloadDelegate = new basic.Delegate(this,
                    this._onprogress,
                    (p) => {
                        p.Owner.http.removeEventListener('loadend', p);
                        p.Owner.http.removeEventListener('error', p);
                    }));
            if (typeof __global.https != 'undefined' && __global.https)
                this.crypt = new crypto.AesCBC(__corelib__. key.slice(0));
            this.http.addEventListener('error', this.downloadDelegate);
        }

        Dispose() {
            /*
            this.OnInitialized.Dispose();
            this.OnSetup.Dispose();
            this.OnSended.Dispose();
            this.OnProgress.Dispose();*/
            this.OnComplete.Dispose();
            this.downloadDelegate.Dispose();
            this.key = null;
            this.http = null;
            /*
            this.OnInitialized = null;
            this.OnSetup = null;
            this.OnSended = null;
            this.OnProgress = null;*/
            this.OnComplete = null;
            this.downloadDelegate = null;
        }

        private _onprogress(e) {
            var cur: bind.EventListener<any> = null;
            switch (this.http.readyState) {
                //case 0:
                //    cur = this.OnInitialized;
                //    break;
                //case 1:
                //    cur = this.OnSetup;
                //    break;
                //case 2:
                //    cur = this.OnSended;
                //    break;
                //case 3:
                //    cur = this.OnProgress;
                //    break;
                case 4:
                    cur = this.OnComplete;
                    break;
                default: return;
            }

            if (cur) {
                var t = this;
                cur.Invoke(this.key, [t]); // function (dlg) { dlg(t); });
            }
        }

        public get IsSuccess() { return this.http.status == 200 && this.http.readyState == 4; }

        public Download(req: IRequestUrl, data: any) {
            this.http.open(WebRequestMethod[req.Method], req.Url, true, this.Uid, this.Pwd);
            this.http.setRequestHeader('xreq', btoa((this.Uid || '') + ':' + (this.Pwd || '')));
            this.http.responseType = <any>ResponseType[this.getResponseType()].toLowerCase();
            if (req.Method === WebRequestMethod.Get)
                this.http.send();
            else this.http.send(JSON.stringify(data));
        }

        public Download2(c: Request) {
            if (c.url.beforRequest && !(c as any).url.beforRequest(c.url))
                return this.OnComplete && this.OnComplete.Invoke(this.key, [this]);
            
            var req = c.url;
            this.http.open(WebRequestMethod[req.Method], this.getUrlOf(c), true, this.Uid, this.Pwd);
            this.http.setRequestHeader('xreq', btoa((this.Uid || '') + ':' + (this.Pwd || '')));
            this.http.setRequestHeader('Access-Control-Allow-Origin', '*');

            if (c.url.timeout)
                this.http.timeout = c.url.timeout;
            else this.http.timeout = 0;

            this.http.responseType = <any>ResponseType[c.url.ResponseType] || 'text';
            this.http.send(this.getDataOf(c));
        }
        private getUrlOf(c: Request) {
            var req = c.url;
            var url = req.Url;
            if (c.params) {
                var s = url.lastIndexOf('?') != -1;
                for (var i in c.params)
                    url += (!s ? ((s = true) && '?') : '&') + (encodeURI(i) + '=' + encodeURI(String(c.params[i])));
            }
            return url;
        }

        private getDataOf(c: Request) {
            var req = c.url;
            if (req.HasBody === true && req.Method !== WebRequestMethod.Get && c.data !== undefined) {
                if (__global['https']) {
                    var bytes = encoding.Utf8.ucs2decode(c.data.OutputData());                    
                    this.crypt && (bytes = this.crypt.Encrypt(bytes) as any);
                    return new Uint8Array(bytes);
                } else
                    return c.data.OutputData();
            }
        }
        GetFileSize(url, callback) {
            this.http.open("HEAD", url, true, this.Uid, this.Pwd);
            this.http.onreadystatechange = function () {
                if (this.readyState == this.DONE) {
                    if (callback)
                        callback(parseInt(this.getResponseHeader("Content-Length")));
                }
            };
            this.http.send();
        }

        RequestHeader(url, callback) {
            this.http.open("HEAD", url, true);
            this.http.onreadystatechange = function () {
                if (this.readyState == this.DONE) {
                    if (callback) {

                        var h = this.getAllResponseHeaders().split('\r\n');
                        var t: Header[] = [];
                        for (var i = h.length - 1; i >= 0; i--) {
                            var p: string = h[i];
                            if (p) {
                                var vk = p.split(': ');
                                t.push(new Header(vk[0], vk[1]));
                            }
                        }
                        callback(t);
                    }
                }
            };
            this.http.send();
        }

        //public OnInitialized: bind.EventListener<(e: WebRequest) => void>; //0
        //public OnSetup: bind.EventListener<(e: WebRequest) => void>; //1
        //public OnSended: bind.EventListener<(e: WebRequest) => void>; //2
        //public OnProgress: bind.EventListener<(e: WebRequest) => void>; //3
        public OnComplete: bind.EventListener<(e: WebRequest) => void>; //4

        public get Response(): string {
            return this.http.response;//  ResponseType[this.http.responseType];
        }
        public GetHeader(name: string): string {
            return this.http.getResponseHeader(name);
        }
        public GetHeaders(): string {
            return this.http.getAllResponseHeaders();
        }
    }
    export abstract class RequestParams<T, S>
    {
        public IsSuccess: boolean = null;

        constructor(protected callback: (sender: S, result: any) => void, public data: T, public isPrivate?: boolean) {
            if (isPrivate == void 0) this.isPrivate = false;
        }

        public Callback(sender: S, result: any) {
            if (this.callback)
                this.callback(sender, result);
        }
        public abstract OutputData(): string;
        public InputData: string;
    }
    
    export interface RequestMethodShema {
        Method: WebRequestMethod;
        Name: string;
        SendData: boolean;
        ParamsFormat?: basic.StringCompile;
    }
    export interface IRequestParams {
        [name: string]: string | number | boolean;
    }
    export class Request {
        public fail: boolean = undefined;
        constructor(public url: IRequestUrl, public data: RequestParams<any, QueeDownloader>, public params: IRequestParams) {
        }
    }

    export class QueeDownloader {
        private webr: net.WebRequest;
        public set Uid(v: string) { this.webr.Uid = v; }
        public set Pwd(v: string) { this.webr.Pwd = v; }
        public get Request(): net.WebRequest { return this.webr; }

        private quee: Request[] = [];
        private isRunning: boolean = false;
        private isDownloading = false;

        public set Crypto(v: basic.ICrypto) {
            this.webr.Crypto = v;
        }

        constructor(public crypt: basic.ICrypto) {
            this.webr = new net.WebRequest(crypt);
            this.webr.setResponseType(net.ResponseType.text);
            this.webr.OnComplete.Add(this.DownloadComplete.bind(this), "DCT");
        }

        public current: Request;
        private OnError() {
            this.isDownloading = false;
            if (this.current) {
                var ip = true;
                const c = this.current.data;
                if (c instanceof RequestParams) {
                    c.IsSuccess = false;
                    helper.TryCatch(c, c.Callback, void 0, [this, this.webr]);
                    ip = !(c.isPrivate);
                }
                if (ip)
                    this.OnFail.PInvok(1, [this, c], this);
            }
            this.Next();
        }
        private DownloadComplete(xmlRequest) {
            this.isDownloading = false;
            var x = this.webr.IsSuccess ? this.OnSuccess : this.OnFail;
            if (this.current) {
                var ip = true;
                var c = this.current.data;
                if (c instanceof RequestParams) {
                    c.IsSuccess = this.webr.IsSuccess;
                    helper.TryCatch(c, c.Callback, void 0, [this, this.webr]);
                    ip = !(c.isPrivate);
                }
                if (ip)
                    x.PInvok(1, [this, c], this);
            }
            this.Next();
        }

        public Push(url: IRequestUrl, data: RequestParams<any, QueeDownloader>, params: IRequestParams) {
            this.quee.push(new Request(url, data, params));
            if (!this.isRunning) this.Start();
        }

        public Insert(dcall: Request) {
            this.quee.push(dcall);
            if (!this.isRunning) this.Start();
        }

        public Start() {
            if (this.isDownloading) return;
            this.isRunning = true;
            this.Next();
        }

        Next() {
            if (0 == this.quee.length) {
                this.isRunning = false;
                this.isDownloading = false;
                var ___this = this;
                this.OnFinish.Invoke(1, [___this, ___this.current.data]);
                return;
            }
            try {
                this.webr.Download2(this.current = this.quee.shift());
                this.isDownloading = true;
            } catch (e) {
                this.isDownloading = false;
                this.OnError();
            }
        }

        public Restart() {
            this.isDownloading = false;
            this.Start();
        }

        public OnSuccess: bind.EventListener<any> = new bind.EventListener<any>(1);
        public OnFail: bind.EventListener<any> = new bind.EventListener<any>(1);
        public OnFinish: bind.EventListener<any> = new bind.EventListener<any>(1);
    }
}


export namespace net {

    export interface IRequestHeader {
        [key: string]: string;
    }

    export interface IRequestUrl {
        beforRequest?: (req: net.IRequestUrl) => void;
        Url: string;
        Method?: net.WebRequestMethod;
        Header?: IRequestHeader;
        HasBody?: boolean;
        timeout?: number;
        ResponseType?: ResponseType;
    }

    export class RequestUrl implements IRequestUrl {
        beforRequest: (req: net.IRequestUrl) => void;
        timeout?: number;
        public get Url() {
            if (this.context)
                return this.context.GetPath(this._url);
            return this._url;
        }
        public set Url(v: string) { this._url = v; }

        constructor(private _url: string, private context: basic.IContext,
            public Header?: IRequestHeader, public Method?: net.WebRequestMethod, public HasBody?: boolean, public ResponseType?:ResponseType) {            
            if (Method == undefined) this.Method = net.WebRequestMethod.Get;
        }
    }
}

export namespace basic {
    var _events = new collection.Dictionary<DomEventHandler<any, any>, EventTarget>("ethandler");
    export class DomEventHandler<T extends Event, P> implements IEventHandler, EventListenerObject {
        Started: boolean = false;
        constructor(public dom: Element, public event: string, private owner: any, private handle: (eh: DomEventHandler<T, P>, ev: T, param: P) => void, private param?: P) {
            _events.Set(this, dom);
        }
        Start() {
            if (this.Started === false) {
                this.Started = true;
                this.dom.addEventListener(this.event, this);
            }
        }
        Pause() {
            if (this.Started === true) {
                this.Started = false;
                this.dom.removeEventListener(this.event, this);
            }
        }
        Dispose() {
            if (this.Started === undefined) return;
            this.Pause();
            _events.Remove(this);
            this.dom = undefined;
            this.event = undefined;
            this.handle = undefined;
            this.Started = undefined;
            this.param = undefined;
        }
        Reset() {
            this.Pause();
            this.Start();
        }
        handleEvent(evt: Event): void {
            this.handle.call(this.owner, this, evt, this.param);
            //this.handle(this, evt as T, this.param);
        }
        public static Dispose(dom: EventTarget, event?: string) {
            let i;
            if (event == null)
                for (let i = 0, ks = _events.RemoveAllValues(dom); i < ks.length; i++)
                    ks[i].Dispose();
            else
                do
                    if ((i = _events.IndexOfValue(dom, i)) === -1) break;
                    else _events.RemoveAt(i).Key.Dispose();
                while (true);
        }
    }

}


export namespace crypto {

    var Sbox = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22];
    var ShiftRowTab = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];
    var ShiftRowTab_Inv: number[];
    var Sbox_Inv: number[], xtime: number[];

    export function string2bytes_16(a: string): Uint16Array {
        var c = new Uint16Array(a.length);
        for (var d = 0; d < a.length; d++)
            c[d] = a.charCodeAt(d);
        return c;
    }

    export function bytes2string_16(a: Uint16Array) {
        for (var c = "", d = 0; d < a.length; d++)
            c += String.fromCharCode(a[d]);
        return c;
    }


    export function string2bytes(a: string | number[]) {
        if (a instanceof Array) return a.slice(0);
        var c = new Array(a.length);
        for (var d = 0; d < a.length; d++) {
            var x = (a as string).charCodeAt(d);
            if (x > 255)
                throw "Invalid ASCII Charactere";
            c[d] = x;
        }
        return c;
    }

    export function bytes2string(a) {
        for (var c = "", d = 0; d < a.length; d++)
            c += String.fromCharCode(a[d]);
        return c
    }

    
    Sbox_Inv = Array(256);
    for (var b = 0; b < 256; b++)
        Sbox_Inv[Sbox[b]] = b;
    ShiftRowTab_Inv = Array(16);
    for (b = 0; b < 16; b++)
        ShiftRowTab_Inv[ShiftRowTab[b]] = b;
    xtime = Array(256);
    for (b = 0; b < 128; b++)
        xtime[b] = b << 1,
            xtime[128 + b] = b << 1 ^ 27;


    export class Aes implements basic.ICrypto {

        protected Key: number[];
        constructor(key: string | number[] | Uint8Array) {
            if ('string' === typeof (key))
                this.Key = this.InitKey(string2bytes(key));
            else if (key instanceof Array)
                this.Key = this.InitKey(key);
            else throw "Invalid Key";
        }
        InitKey(key: number[]): number[] {
            return key;
        }

        static ExpandKey(b: number[]) {
            var c = b.length, d, e = 1;
            var c1 = c;
            if (c <= 16) { c1 = 16; d = 176; }
            else if (c <= 24) { c1 = 24; d = 208; }
            else if (c <= 32) { c1 = 32; d = 240; }
            else throw "my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!"
            b.length = c1;
            for (; c < c1; c++) {
                b[c] = 0;
            }

            for (var g = c; g < d; g += 4) {
                var h = b.slice(g - 4, g);
                if (g % c == 0) {
                    if (h = [Sbox[h[1]] ^ e, Sbox[h[2]], Sbox[h[3]], Sbox[h[0]]], (e <<= 1) >= 256)
                        e ^= 283;
                } else
                    c > 24 && g % c == 16 && (h = [Sbox[h[0]], Sbox[h[1]], Sbox[h[2]], Sbox[h[3]]]);
                for (var f = 0; f < 4; f++)
                    b[g + f] = b[g + f - c] ^ h[f]
            }
        }

        Encrypt(data: number[]): number[] {
            ;
            var Key = this.Key;
            var d = Key.length;
            Aes.AddRoundKey(data, Key.slice(0, 16));
            for (var e = 16; e < d - 16; e += 16)
                Aes.SubBytes(data, Sbox),
                    Aes.ShiftRows(data, ShiftRowTab),
                    Aes.MixColumns(data),
                    Aes.AddRoundKey(data, Key.slice(e, e + 16));
            Aes.SubBytes(data, Sbox);
            Aes.ShiftRows(data, ShiftRowTab);
            Aes.AddRoundKey(data, Key.slice(e, d));
            return data;

        }

        Decrypt(data: number[]): number[] {
            ;
            var Key = this.Key;
            var d = Key.length;
            Aes.AddRoundKey(data, Key.slice(d - 16, d));
            Aes.ShiftRows(data, ShiftRowTab_Inv);
            Aes.SubBytes(data, Sbox_Inv);
            for (d -= 32; d >= 16; d -= 16)
                Aes.AddRoundKey(data, Key.slice(d, d + 16)),
                    Aes.MixColumns_Inv(data),
                    Aes.ShiftRows(data, ShiftRowTab_Inv),
                    Aes.SubBytes(data, Sbox_Inv);
            Aes.AddRoundKey(data, Key.slice(0, 16))
            return data;
        }

        SEncrypt(data: string): string {
            return bytes2string(this.Encrypt(string2bytes(data)));
        }
        SDecrypt(data: string): string {
            return bytes2string(this.Decrypt(string2bytes(data)));
        }

        static SubBytes(a, c) {
            ;
            for (var d = 0; d < 16; d++)
                a[d] = c[a[d]]
        }
        static AddRoundKey(a, c) {
            ;
            for (var d = 0; d < 16; d++)
                a[d] ^= c[d]
        }

        static ShiftRows(a, c) {
            ;
            for (var d = [].concat(a), e = 0; e < 16; e++)
                a[e] = d[c[e]]
        }

        static MixColumns(b) {
            ;
            var _xtime = xtime;
            for (var c = 0; c < 16; c += 4) {
                var d = b[c + 0]
                    , e = b[c + 1]
                    , g = b[c + 2]
                    , h = b[c + 3]
                    , f = d ^ e ^ g ^ h;
                b[c + 0] ^= f ^ _xtime[d ^ e];
                b[c + 1] ^= f ^ _xtime[e ^ g];
                b[c + 2] ^= f ^ _xtime[g ^ h];
                b[c + 3] ^= f ^ _xtime[h ^ d]
            }
        }
        static MixColumns_Inv(b) {
            ;
            var _xtime = xtime;
            for (var c = 0; c < 16; c += 4) {
                var d = b[c + 0]
                    , e = b[c + 1]
                    , g = b[c + 2]
                    , h = b[c + 3]
                    , f = d ^ e ^ g ^ h
                    , o = _xtime[f]
                    , p = _xtime[_xtime[o ^ d ^ g]] ^ f;
                f ^= _xtime[_xtime[o ^ e ^ h]];
                b[c + 0] ^= p ^ _xtime[d ^ e];
                b[c + 1] ^= f ^ _xtime[e ^ g];
                b[c + 2] ^= p ^ _xtime[g ^ h];
                b[c + 3] ^= f ^ _xtime[h ^ d]
            }
        }
    }

    export class AesCBC extends Aes {
        constructor(key: string | number[]) {
            super(key);
        }
        InitKey(key: number[]) {
            Aes.ExpandKey(key);
            return key;
        }
        static blockXOR(a, c) {
            ;
            for (var d = Array(16), e = 0; e < 16; e++)
                d[e] = a[e] ^ c[e];
            return d
        }
        static blockIV(): number[] {
            ;
            var a = new crypto.SecureRandom(), c = Array(16);
            a.nextBytes(c);
            return c;
        }

        static pad16(a: number[]): number[] {
            var c = a.slice(0)
                , d = (16 - a.length % 16) % 16;
            for (var i = a.length; i < a.length + d; i++)
                c.push(0);
            return c
        }
        ;
        static depad(a: number[]) {
            for (a = a.slice(0); a[a.length - 1] == 0;)
                a = a.slice(0, a.length - 1);
            return a
        }


        Encrypt(data: number[]) {
            for (var e = AesCBC.pad16(data), g = AesCBC.blockIV(), h = 0; h < e.length / 16; h++) {
                var f = e.slice(h * 16, h * 16 + 16);
                f = AesCBC.blockXOR(g.slice(h * 16, h * 16 + 16), f);
                super.Encrypt(f);
                g = g.concat(f);
            }
            return g;
        }

        Decrypt(data: number[]) {
            ;
            var g = [];
            for (var h = 1; h < data.length / 16; h++) {
                var f = data.slice(h * 16, h * 16 + 16)
                    , o = data.slice((h - 1) * 16, (h - 1) * 16 + 16);
                super.Decrypt(f);
                f = AesCBC.blockXOR(o, f);
                g = g.concat(f)
            }
            return AesCBC.depad(g);
        }

    }

}

export namespace crypto {
    class Arcfour {
        public j: number;
        public i: number;
        public S: number[] = [];
        init(a) {
            ;
            var b, c, d;
            for (b = 0; b < 256; ++b)
                this.S[b] = b;
            for (b = c = 0; b < 256; ++b)
                c = c + this.S[b] + a[b % a.length] & 255,
                    d = this.S[b],
                    this.S[b] = this.S[c],
                    this.S[c] = d;
            this.j = this.i = 0
        }
        next() {
            ;
            var a;
            this.i = this.i + 1 & 255;
            this.j = this.j + this.S[this.i] & 255;
            a = this.S[this.i];
            this.S[this.i] = this.S[this.j];
            this.S[this.j] = a;
            return this.S[a + this.S[this.i] & 255]
        }
    }

    var rng_psize = 256, rng_state, rng_pool: Uint8Array, rng_pptr;

    if (rng_pool == null) {
        rng_pool = new Uint8Array(rng_psize);
        rng_pptr = 0;
        var t;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
            var z = (window.crypto as any).random(32);
            for (t = 0; t < z.length; ++t)
                rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
        }
        for (; rng_pptr < rng_psize;)
            t = Math.floor(65536 * Math.random()),
                rng_pool[rng_pptr++] = t >>> 8,
                rng_pool[rng_pptr++] = t & 255;
        rng_pptr = 0;
        rng_seed_time()
    }
    function prng_newstate() {
        return new Arcfour
    }

    function rng_seed_int(a) {
        ;
        rng_pool[rng_pptr++] ^= a & 255;
        rng_pool[rng_pptr++] ^= a >> 8 & 255;
        rng_pool[rng_pptr++] ^= a >> 16 & 255;
        rng_pool[rng_pptr++] ^= a >> 24 & 255;
        rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
    }
    function rng_seed_time() {
        rng_seed_int((new Date).getTime())
    }
    export class SecureRandom {
        nextBytes(a) {
            ;
            var b;
            for (b = 0; b < a.length; ++b)
                a[b] = this.rng_get_byte()
        }
        rng_get_byte() {
            if (rng_state == null) {
                rng_seed_time();
                rng_state = prng_newstate();
                rng_state.init(rng_pool);
                for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
                    rng_pool[rng_pptr] = 0;
                rng_pptr = 0
            }
            return rng_state.next()
        }
    }
}

export module crypto1 {

    var aes_store = {};
    var Sbox = new Uint8Array([99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22]);
    var ShiftRowTab = new Uint8Array([0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11]);
    var ShiftRowTab_Inv: Uint8Array;
    var Sbox_Inv: Uint8Array, xtime: Uint8Array;
    export function string2bytes(a: string): Uint8Array {
        var c = new Uint8Array(a.length);
        for (var d = 0; d < a.length; d++)
            c[d] = (a as string).charCodeAt(d);
        return c;
    }
    export function bytes2string(a: Uint8Array) {
        for (var c = "", d = 0; d < a.length; d++)
            c += String.fromCharCode(a[d]);
        return c
    }
    {
        ;
        Sbox_Inv = new Uint8Array(256);
        for (var b = 0; b < 256; b++)
            Sbox_Inv[Sbox[b]] = b;
        ShiftRowTab_Inv = new Uint8Array(16);
        for (b = 0; b < 16; b++)
            ShiftRowTab_Inv[ShiftRowTab[b]] = b;
        xtime = new Uint8Array(256);
        for (b = 0; b < 128; b++)
            xtime[b] = b << 1,
                xtime[128 + b] = b << 1 ^ 27;
    }

    export class ExAes {

        protected Key: Uint8Array;
        constructor(key: string | Uint8Array) {
            if ('string' === typeof (key))
                this.Key = this.InitKey(string2bytes(key as string));
            else if (key instanceof Uint8Array)
                this.Key = this.InitKey(key);
            else throw "Invalid Key";
        }
        InitKey(key: Uint8Array): Uint8Array {
            return key;
        }

        static ExpandKey(b: Uint8Array) {
            ;
            var c = b.length, d, e = 1;
            switch (c) {
                case 16:
                    d = 176;
                    break;
                case 24:
                    d = 208;
                    break;
                case 32:
                    d = 240;
                    break;
                default:
                    alert("my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!")
            }
            for (var g = c; g < d; g += 4) {
                var h = b.slice(g - 4, g);
                if (g % c == 0) {
                    if (h = new Uint8Array([Sbox[h[1]] ^ e, Sbox[h[2]], Sbox[h[3]], Sbox[h[0]]]),
                        (e <<= 1) >= 256)
                        e ^= 283
                } else
                    c > 24 && g % c == 16 && (h = new Uint8Array([Sbox[h[0]], Sbox[h[1]], Sbox[h[2]], Sbox[h[3]]]));
                for (var f = 0; f < 4; f++)
                    b[g + f] = b[g + f - c] ^ h[f]
            }
        }

        Encrypt(data: Uint8Array): Uint8Array {
            ;
            var Key = this.Key;
            var d = Key.length;
            ExAes.AddRoundKey(data, Key.slice(0, 16));
            for (var e = 16; e < d - 16; e += 16)
                ExAes.SubBytes(data, Sbox),
                    ExAes.ShiftRows(data, ShiftRowTab),
                    ExAes.MixColumns(data),
                    ExAes.AddRoundKey(data, Key.slice(e, e + 16));
            ExAes.SubBytes(data, Sbox);
            ExAes.ShiftRows(data, ShiftRowTab);
            ExAes.AddRoundKey(data, Key.slice(e, d));
            return data;

        }

        Decrypt(data: Uint8Array): Uint8Array {
            ;
            var Key = this.Key;
            var d = Key.length;
            ExAes.AddRoundKey(data, Key.slice(d - 16, d));
            ExAes.ShiftRows(data, ShiftRowTab_Inv);
            ExAes.SubBytes(data, Sbox_Inv);
            for (d -= 32; d >= 16; d -= 16)
                ExAes.AddRoundKey(data, Key.slice(d, d + 16)),
                    ExAes.MixColumns_Inv(data),
                    ExAes.ShiftRows(data, ShiftRowTab_Inv),
                    ExAes.SubBytes(data, Sbox_Inv);
            ExAes.AddRoundKey(data, Key.slice(0, 16))
            return data;
        }

        static SubBytes(a: Uint8Array, c: Uint8Array) {
            ;
            for (var d = 0; d < 16; d++)
                a[d] = c[a[d]]
        }
        static AddRoundKey(a, c) {
            ;
            for (var d = 0; d < 16; d++)
                a[d] ^= c[d]
        }

        static ShiftRows(a, c) {
            ;
            for (var d = [].concat(a), e = 0; e < 16; e++)
                a[e] = d[c[e]]
        }

        static MixColumns(b) {
            ;
            var _xtime = xtime;
            for (var c = 0; c < 16; c += 4) {
                var d = b[c + 0]
                    , e = b[c + 1]
                    , g = b[c + 2]
                    , h = b[c + 3]
                    , f = d ^ e ^ g ^ h;
                b[c + 0] ^= f ^ _xtime[d ^ e];
                b[c + 1] ^= f ^ _xtime[e ^ g];
                b[c + 2] ^= f ^ _xtime[g ^ h];
                b[c + 3] ^= f ^ _xtime[h ^ d]
            }
        }
        static MixColumns_Inv(b) {
            ;
            var _xtime = xtime;
            for (var c = 0; c < 16; c += 4) {
                var d = b[c + 0]
                    , e = b[c + 1]
                    , g = b[c + 2]
                    , h = b[c + 3]
                    , f = d ^ e ^ g ^ h
                    , o = _xtime[f]
                    , p = _xtime[_xtime[o ^ d ^ g]] ^ f;
                f ^= _xtime[_xtime[o ^ e ^ h]];
                b[c + 0] ^= p ^ _xtime[d ^ e];
                b[c + 1] ^= f ^ _xtime[e ^ g];
                b[c + 2] ^= p ^ _xtime[g ^ h];
                b[c + 3] ^= f ^ _xtime[h ^ d]
            }
        }
    }

    export class AesCBC extends ExAes {
        constructor(key: string | Uint8Array) {
            super(key);
        }
        InitKey(key: Uint8Array) {
            ExAes.ExpandKey(key);
            return key;
        }
        static blockXOR(a: Uint8Array, c: Uint8Array): Uint8Array {
            ;
            for (var d = new Uint8Array(16), e = 0; e < 16; e++)
                d[e] = a[e] ^ c[e];
            return d
        }
        static blockIV(): Uint8Array {
            ;
            var a = new crypto.SecureRandom(), c = new Uint8Array(16);
            a.nextBytes(c);
            return c;
        }

        static pad16(a: Uint8Array): Uint8Array {
            ;
            var c = a.slice(0), d = (16 - a.length % 16) % 16;
            var c = new Uint8Array(a.length + d);
            for (var i = 0, l = a.length; i < l; i++)
                c[i] = a[i];
            return c;
        }
        ;
        static depad(a: Uint8Array) {
            ;
            for (var i = a.length - 1; i >= 0; i--)
                if (a[i] != 0) return a.slice(0, i + 1);
            return new Uint8Array(0);
        }

        concate(a: Uint8Array, b: Uint8Array) {
            var x = new Uint8Array(a.length + b.length);
            for (var i = 0, l = a.length; i < l; i++)
                x[i] = a[i];
            for (var i = 0, j = a.length, l = b.length; i < l; i++ , j++)
                x[j] = b[i];
            return x;
        }
        Encrypt(data: Uint8Array): Uint8Array {
            ;
            var Key = this.Key;
            data = AesCBC.pad16(data);
            var g = AesCBC.blockIV();
            for (var h = 0; h < data.length / 16; h++) {
                var f = data.slice(h * 16, h * 16 + 16);
                var o = g.slice(h * 16, (h + 1) * 16);
                f = AesCBC.blockXOR(o, f);
                super.Encrypt(f);
                g = this.concate(g, f);
            }
            return g;
        }

        Decrypt(data: Uint8Array): Uint8Array {
            ;
            var g = new Uint8Array(data.length);
            var i0 = 0;
            var i1 = 16;
            var i2 = 32;
            for (var h = 1; h < data.length / 16; h++) {
                var f = data.slice(i1, i2);
                var o = data.slice(i0, i1);
                super.Decrypt(f);
                f = AesCBC.blockXOR(o, f);
                g.set(f, i0);
                i0 = i1;
                i1 = i2;
                i2 += 16;
            }
            return AesCBC.depad(g);
        }

    }
}

export module crypto1 {
    class Arcfour {
        ;
        public j: number;
        public i: number;
        public S: Uint8Array = new Uint8Array(256);
        init(a) {
            ;
            var b, c, d;
            for (b = 0; b < 256; ++b)
                this.S[b] = b;
            for (b = c = 0; b < 256; ++b)
                c = c + this.S[b] + a[b % a.length] & 255,
                    d = this.S[b],
                    this.S[b] = this.S[c],
                    this.S[c] = d;
            this.j = this.i = 0
        }
        next() {
            ;
            var a;
            this.i = this.i + 1 & 255;
            this.j = this.j + this.S[this.i] & 255;
            a = this.S[this.i];
            this.S[this.i] = this.S[this.j];
            this.S[this.j] = a;
            return this.S[a + this.S[this.i] & 255]
        }
    }

    var rng_psize = 256, rng_state, rng_pool: Uint8Array, rng_pptr;

    if (rng_pool == null) {
        rng_pool = new Uint8Array(rng_psize);
        rng_pptr = 0;
        var t;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
            var z = (window.crypto as any).random(32);
            for (t = 0; t < z.length; ++t)
                rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
        }
        for (; rng_pptr < rng_psize;)
            t = Math.floor(65536 * Math.random()),
                rng_pool[rng_pptr++] = t >>> 8,
                rng_pool[rng_pptr++] = t & 255;
        rng_pptr = 0;
        rng_seed_time()
    }
    function prng_newstate() {
        return new Arcfour
    }

    function rng_seed_int(a) {
        ;
        rng_pool[rng_pptr++] ^= a & 255;
        rng_pool[rng_pptr++] ^= a >> 8 & 255;
        rng_pool[rng_pptr++] ^= a >> 16 & 255;
        rng_pool[rng_pptr++] ^= a >> 24 & 255;
        rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
    }
    function rng_seed_time() {
        rng_seed_int((new Date).getTime())
    }
    export class SecureRandom {
        nextBytes(a) {
            ;
            var b;
            for (b = 0; b < a.length; ++b)
                a[b] = this.rng_get_byte()
        }
        rng_get_byte() {
            ;
            if (rng_state == null) {
                rng_seed_time();
                rng_state = prng_newstate();
                rng_state.init(rng_pool);
                for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
                    rng_pool[rng_pptr] = 0;
                rng_pptr = 0
            }
            return rng_state.next()
        }
    }
}
namespace __corelib__ {
    export const backups = new collection.Dictionary<Array<any>, BuckupList<any>[]>("buckups");
    
    bind.NamedScop.Create('window', window, <bind.BindingMode>0);
}
export interface BuckupList<T> {
    values: any[];
    OnUndo?: (self: T, bl: BuckupList<T>) => void;
}



export namespace Ids {
    export class t1 { }
    export class t2 { }
    export class t3 { }
}


export namespace injecter {

    interface IDObject {
        [prop: string]: IEvent[];
    }

    class DObject {
        props: { [name: string]: IEvent } = {};
        constructor(public obj) {

        }
        public create(prop: string, p?: PropertyDescriptor) {
            var x = this.props[prop];
            if (x) return x;
            return this.props[prop] = new IEvent(this, prop, p);
        }
        public get(prop: string) {
            return this.props[prop];
        }
        static store: collection.Dictionary<object, DObject> = new collection.Dictionary("");
        static create(obj) {
            var t = this.store.Get(obj);
            if (!t)
                this.store.Set(obj, t = new DObject(obj));
            return t;
        }
        static get(obj) {
            return this.store.Get(obj);
        }
        observe(p: PropertyDescriptor, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner) {
            p = Object.getOwnPropertyDescriptor(this.obj, prop);
            if (!p || (p && p.configurable && !p.get)) {
                var e = this.create(prop, p);
                if (!p) {
                    Object.defineProperty(this.obj, prop, p = { get: e.get, set: e.set });
                }
                else if (p.set)
                    Object.defineProperty(this.obj, prop, { get: p.get, set: e.set, enumerable: p.enumerable });
                else
                    Object.defineProperty(this.obj, prop, { get: e.get, set: e.set, enumerable: p.enumerable });
                var pb: bind.PropBinding;
                e.callback.push(pb = new bind.PropBinding(callback, owner));
                return pb;
            }
            return null;
        }
        set Obj(v) {
            for (var i in this.props)
                this.props[i].set(v && v[i]);
        }
        unobserve(prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?) {
            var e = this.get(prop);
            if (e) return e.UnObserve(stat, owner);
            return false;
        }

    }

    class IEvent {
        public callback: bind.PropBinding[] = [];
        private getInstCallback() { return this.callback; }
        value?: any;
        prop: bind.DProperty<any, any>;
        constructor(public parent: DObject, prop: string, public p?: PropertyDescriptor) {
            this.prop = { Name: prop, Type: Object, Index: -1 } as any;
            this.set = this.set.bind(this);
            this.get = this.get.bind(this);
            this.value = parent.obj[prop];
        }
        set(v) {
            var o = this.value;
            if (v == o) return;
            this.value = v;

            this.p && this.p.set && this.p.set.call(this.parent.obj, v);
            this.onPropertyChanged(o, v);
        }
        get() {
            if (this.p && this.p.get) this.p.get.call(this.parent.obj);
            return this.value;
        }
        onPropertyChanged(o, v) {
            var e = bind.EventArgs.New(this.prop, this.parent.obj, o, v);
            for (var i = 0; i < this.callback.length; i++) {
                var c = this.callback[i];
                helper.TryCatch(c, c.handleEvent, void 0, [e]);
            }
        }
        addEventListener(callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner) {
            this.callback.push(new bind.PropBinding(callback, owner));
        }

        public UnObserve<T>(y: bind.PropBinding | ((sender: bind.PropBinding, ev: bind.EventArgs<T, this>) => void), owner?: any) {
            if (this) {
                if (typeof y !== 'function') {
                    var i = this.callback.indexOf(y);
                    if (i != -1) {
                        y.Dispose();
                        return this.callback.splice(i, 1);
                    }
                } else {
                    var t, j;
                    for (var i = this.callback.length - 1; i >= 0; i--) {
                        var p = this.callback[i];
                        if (p.Invoke == y) {
                            if (p.Owner === owner) {
                                p.Dispose();
                                this.callback.splice(i, 1);
                                return true;
                            }
                            if (!t) t = p, j = i;
                        }
                    }
                    if (t) {
                        t.Dispose();
                        this.callback.splice(j, 1);
                        return true;
                    }
                }
            }
            return false;
        }
    }
    var ldobj: DObject | bind.DObject;
    export function observe(obj, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?) {
        prop = String(prop);
        if (obj instanceof bind.DObject) {
            let p = obj.GetProperty(prop);
            if (p) {
                ldobj = obj;
                return obj.OnPropertyChanged(p, (s, e) => {
                    callback(e._new, e._old);
                }, owner);
            }
        }
        let p = Object.getOwnPropertyDescriptor(obj, prop);
        if (!p || (p && p.configurable && !p.get)) {
            var dobj = DObject.create(obj);
            return dobj.observe(p, prop, callback, owner);
        }
        ldobj = null;
        return null;
    }

    interface IPath {
        obj: bind.DObject | DObject;
        pb: bind.PropBinding;
        value: any,
        propName: string;
    }
    export function observePath(obj, props: string[], callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?) {
        var path = new Array<IPath>(props.length);
        var val;
        var o = obj;
        for (var i = 0; i < props.length; i++) {
            var v = o[props[i]];
            path.push({ propName: props[i], obj: null, value: v, pb: null });
            o = v;
        }
        rebuild(0);
        function rebuild(i) {
            var prevObj = obj;
            for (i = 0; i < props.length; i++) {
                var prop = props[i];
                var leaf = path[i];
                var curObj = leaf.obj;
                if (!curObj) return;

                if (leaf.pb) {
                    if (curObj instanceof DObject)
                        curObj.unobserve(leaf.propName, leaf.pb);
                    else curObj.UnObserve(curObj.GetProperty(leaf.propName), leaf.pb);
                    leaf.pb = null;
                }
            }
        }
        function dispose(i: number) {
            for (; i < path.length; i++) {
                var p = path[i];
                if (!p.obj) return;
                unobserve(p.obj, p.propName, p.pb);
                p.pb = null;
                p.value = null;
            }
        }
        function recalc(i: number) {

        }
        function onValueChanged(s: bind.PropBinding, e: bind.EventArgs<any, any>) {

        }
    }
    export function unobserve(obj, prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?) {
        prop = String(prop);
        if (obj instanceof bind.DObject) {
            let p = obj.GetProperty(prop);
            if (p) return obj.UnObserve(p, stat, owner);
        }
        var dobj = DObject.create(obj);
        if (!dobj) return false;
        
        dobj.unobserve(prop, stat, owner);
        var e = dobj.get(prop);
        if (e) return e.UnObserve(stat, owner);
        return false;
    }
    function _observe(prop: string | bind.DProperty<any, any>, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?) {
        if (!callback || !prop) return;
        return observe(this, typeof prop === 'string' ? prop : prop.Name, callback, owner);
    }
    function _unobserve(prop: string | bind.DProperty<any, any>, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?) {
        if (!callback || !prop) return;
        return unobserve(this, typeof prop === 'string' ? prop : prop.Name, callback, owner);
    }

    Object.defineProperty(Object.prototype, 'Observe', {
        writable: false, enumerable: false,
        value: _observe
    });
    Object.defineProperty(Object.prototype, 'UnObserve', {
        writable: false, enumerable: false,
        value: _unobserve
    });
}

export namespace Notification {
    export interface NotificationArgs {
        name: string;
        data: any;
        handler: NotificationHandler<any>;
    }

    export interface NotificationHandler<Owner> {
        Id?: any;
        callback: (this: Owner, e: NotificationArgs,...args) => void;
        owner?: Owner;
        params?;
        context?: IContext
    }
    interface NotificationsStore {
        [s: string]: NotificationHandler<any>[];
    }
    var _store: NotificationsStore = {};
    var id = 0;
    export function on(name: string, handler: NotificationHandler<any>) {
        __corelib__.$defineProperty(handler, 'Id', { value: handler.Id || ++id, writable: false, configurable: false, enumerable: true });
        if (!_store[name]) _store[name] = [handler];
        else _store[name].push(handler);
    }
    export function fire(name: string, params: any[]) {
        var s = _store[name];
        if (!s || !s.length) return;
        var e: NotificationArgs = { data: params, name: name, handler: void 0 };
        params = params ? params.slice(0) : [];
        params.unshift(e);
        for (var i = 0; i < s.length; i++) {
            var h = s[i];
            e.handler = h;
            helper.TryCatch(h.owner || h, h.callback, void 0, params);
        }
    }
    export function off(name: string, hndl_id: NotificationHandler<any> | any) {
        var s = _store[name];
        if (!s || !s.length) return true;
        var j = s.indexOf(hndl_id);
        if (j == -1)
            for (var i = 0; i < s.length; i++) {
                var h = s[i];
                if (h.Id !== hndl_id) continue;
                j = i;
                break;
            }
        if (j !== -1)
            s.splice(j, 1);
        return true;
    }
}
export namespace Attributes {
    export type attributeType = (...args: any[]) => any;
    export interface Attribute<T> extends attributeType {
        declare(_target: any, data: T): void;
        getData(_target): T;
    }
    export enum AttributeTargets {
        Class = 2,
        Object = 4,
        Function = 8,
        Property = 16,
        All = -1
    }
    export interface AttributeDefinition {
        AllowMultiple?: boolean;
        Heritable?: boolean;
        Target?: AttributeTargets;
    }
    var __attributes: Map = new Map();
    var __defs = new Map();
    function getAttributes(_target): Map {
        return __attributes.get(_target);
    }

    function setAttributeToClass(_target, _attribute, value) {
        var x: Map = __attributes.get(_target);
        if (!x) __attributes.set(_target, x = new Map());
        x.set(_attribute, value);
    }
    function _declare(_target: any, value) {
        setAttributeToClass(_target, this, value);
    }
    function getData<T>(_target) {
        return getAttributeOf<T>(_target, this);
    }
    export function asAttribute(attributer: Function, e: AttributeDefinition) {
        attributer['declare'] = _declare;
        attributer['getData'] = getData;
        __defs.set(attributer, e);
    }
    export function getAttributeDef(attr: Function) {
        return __defs.get(attr) as AttributeDefinition;
    }
    export function check(attr: Function, args: IArguments) {
        var a = getAttributeDef(attr);
        if (!a) return true;
        var d = args[2] as PropertyDescriptor;
        var n = args[1] as string;
        var t = args[0];
        switch (a.Target) {
            case AttributeTargets.All:
                return true;
            case AttributeTargets.Class:
                return reflection.IsClass(t);
            case AttributeTargets.Function:
                return !!(d && (typeof d.value === 'function'));
            case AttributeTargets.Object:
                return !!reflection.IsInstance(t);
            case AttributeTargets.Property:
                return !!d;
            default:
                return false;
        }
    }
    function _getAttributeOf<T>(_target, _attribute: Attribute<T>): T {
        var x = __attributes.get(_target);
        return x && x.get(_attribute);
    }
    export function getAttributesOf(_target) {
        return __attributes.get(_target) as Attribute<any>
    }
    export function getAttributeOf<T>(_target, _attribute: Attribute<T>): T {
        var x = _getAttributeOf(_target, _attribute);
        if (!x) {
            var def = getAttributeDef(_attribute);
            if (def && def.Heritable) {
                var types = reflection.GetBaseTypes(_target, Object);
                for (var t in types)
                    if (x = _getAttributeOf(t, _attribute)) return x;
            }
        }
        return x;
    }
}


export namespace PaintThread {
    enum JobsQueeStat {
        Stoped = 0,
        Waitting = 1,
        Executing = 2
    }

    interface task1 {
        ins: bind.JobInstance;
        e: bind.EventArgs<any, any>;
        scop: bind.Scop;
    }
    export interface task2 {
        owner: any;
        method: Function;
        args: any[];
    }
    declare type task = task1 | task2;
    var _stat: JobsQueeStat = 0;
    var _array: task[] = new Array<task>(100);
    var currIndex = -1;
    export function Push(ins: bind.JobInstance, e: bind.EventArgs<any, any>, scop?: bind.Scop) {
        if (!ins) throw "Argument inst is null";
        switch (_stat) {
            case JobsQueeStat.Stoped:
                _stat = JobsQueeStat.Waitting;
                _defreredExecution();
            case JobsQueeStat.Waitting:
                _array[++currIndex] = { ins, e, scop };
                break;
            case JobsQueeStat.Executing:
                _execute1({ ins, e, scop });
                break;
        }
    }
    export function OnPaint(task:task2) {
        if (!task.method) throw "Argument inst is null";
        switch (_stat) {
            case JobsQueeStat.Stoped:
                _stat = JobsQueeStat.Waitting;
                _defreredExecution();
            case JobsQueeStat.Waitting:
                _array[++currIndex] = task;
                break;
            case JobsQueeStat.Executing:
                _execute2(task);
                break;
        }
    }
    function _defreredExecution() {
        var raf: typeof window.requestAnimationFrame = window.requestAnimationFrame
            || (window).webkitRequestAnimationFrame
            || (window as any).mozRequestAnimationFrame
            || (window as any).msRequestAnimationFrame;
        if (raf) {
            raf(_executeAll);
        } else
            thread.Dispatcher.OnIdle(PaintThread, _executeAll, true);
    }
    function _execute1(e: task1) {
        try {
            var j = e.ins.job;
            j && j.Todo && j.Todo(e.ins, e.e);
        } catch{ }
    }
    function _execute2(e:task2) {
        try {
            let x = e as task2;
            x.method && x.method.apply(x.owner, x.args);
        } catch{ }
    }
    function _execute(e: task) {
        try {
            if ((e as task1).ins) {
                var j = (e as task1).ins.job;
                j && j.Todo && j.Todo((e as task1).ins, (e as task1).e);
            } else {
                let x = e as task2;
                x.method && x.method.apply(x.owner, x.args);
            }
        } catch { }
    }
    function _executeAll() {
        _stat = JobsQueeStat.Executing;
        for (; currIndex >= 0; currIndex--)
            _execute(_array[currIndex]);
        _stat = JobsQueeStat.Stoped;
    }
}

