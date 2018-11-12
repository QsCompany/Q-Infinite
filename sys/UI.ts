///. ULkit CSS Framework
/// Pure CSS Frame Work
/// <references src="../dts/jquery.d.ts" >
import { basic, css, helper, encoding, bind, mvc, thread, collection, utils, ScopicCommand, Api, BuckupList, UIDispatcher, ScopicControl, reflection, net, attributes, Attributes, PaintThread } from './corelib';
import { defs } from './defs';
import { Controller } from './System';
import { filters } from './Filters';
import { context, NameOf } from 'context';
//import * as ui_tmplates from 'template|../assets/templates/UITemplates.html';
import { Parser } from './Syntaxer';
export declare type conv2template = mvc.ITemplate | string | Function | UI.Template | HTMLElement;

declare var _this;
declare var $: any;
declare type JQuery = { show(); hide(); };
const px = 'px';
const $Error = Error;
declare type $text = Text;
const $Text = Text;

export module UI {

    export enum KeyboardControllerResult {
        Handled = 0,
        Release = -1,
        ByPass = 2,
    }

    export interface IKeyCombinerTarget extends basic.ITBindable<(k: keyCominerEvent, e: IKeyCombinerTarget) => void> {
        target?: Node | JControl;
    }
    export interface IKeyA {
        [s: string]: IKeyCombinerTarget[];
    }

    class DragableElement implements EventListenerObject {
        pos1 = 0; pos2 = 0; pos3 = 0; pos4 = 0;
        private closeDragElementHandler = {
            handleEvent(e) {
                (this.owner as DragableElement).closeDragElement();
            }, owner: this
        };
        private elementDragHandler = {
            handleEvent(e: MouseEvent) {
                (this.owner as DragableElement).elementDrag(e);
            }, owner: this
        };
        elementDrag(e: MouseEvent) {
            e = e || (window.event as MouseEvent);
            e.preventDefault();
            // calculate the new cursor position:
            this.pos1 = this.pos3 - e.clientX;
            this.pos2 = this.pos4 - e.clientY;
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            // set the element's new position:
            this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
            this.element.style.left = (this.element.offsetLeft - this.pos1) + "px";
        }
        closeDragElement() {
            document.removeEventListener('mouseup', this.closeDragElementHandler);
            document.removeEventListener('mousemove', this.elementDragHandler);
        }
        handleEvent(e: MouseEvent) {
            e = e || (window.event as MouseEvent);
            e.preventDefault();
            // get the mouse cursor position at startup:
            this.pos3 = e.clientX;
            this.pos4 = e.clientY;
            document.addEventListener('mouseup', this.closeDragElementHandler);            //document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.addEventListener('mousemove', this.elementDragHandler);               //document.onmousemove = elementDrag;
        }
        constructor(public element: HTMLElement, public header: HTMLElement) {
            this.initialize(element, header);
        }
        public initialize(element: HTMLElement, header: HTMLElement) {
            this.Dispose();
            this.element = element;
            this.header = header;
            this.header.addEventListener('mousedown', this);
        }
        public Dispose() {
            this.closeDragElement();
            this.header.removeEventListener('mousedown', this);
            this.element = void 0;
            this.header = void 0;
        }
    }

    export class keyCominerEvent {
        public OnComined = new bind.EventListener<(owner: this, e: IKeyCombinerTarget) => void>(0);
        private _keyA: KeyboardEvent; private _keyB: KeyboardEvent;
        private handlers: { [s: string]: IKeyA } = {};

        sort(ar: IKeyCombinerTarget[]):undefined {
            function depth(el: Node) {
                var i = 0;
                while (el) {
                    i++;
                    el = el.parentElement;
                }
                return i;
            }
            function order(a1: Node, a2: Node) {
                if (a1 == a2) return 0;
                while (a1) {
                    a1 = a1.nextSibling;
                    if (a1 == a2) return -1;
                }
                return 1;
            }
            ar.sort((a, b) => {
                if (!a.target) return -1;
                if (!b.target) return 1;
                if (!a.target && !b.target) return 0;
                var v1 = a.target instanceof JControl ? a.target.View : a.target;
                var v2 = b.target instanceof JControl ? b.target.View : b.target;
                var x: number;
                return v1.contains(v2) ? 1 : v2.contains(v1) ? -1 : x = (depth(v2) - depth(v1)) > 0 ? 1 : x < 0 ? -1 : order(v1, v2);
            });
            return void 0;
        }
        sort1(ar: Node[]) {
            function depth(el: Node) {
                var i = 0;
                while (el) {
                    i++;
                    el = el.parentElement;
                }
                return i;
            }
            function order(a1: Node, a2: Node) {
                if (a1 == a2) return 0;
                while (a1) {
                    a1 = a1.nextSibling;
                    if (a1 == a2) return -1;
                }
                return 1;
            }
            ar.sort((v1, v2) => {
                var x: number;
                return v1.contains(v2) ? 1 : v2.contains(v1) ? -1 : x = (depth(v2) - depth(v1)) > 0 ? 1 : x < 0 ? -1 : order(v1, v2);
            });
        }
        public set KeyA(v: KeyboardEvent) {
            this._keyA = v;
            this._keyB = null;
        }
        public set KeyB(v: KeyboardEvent) {
            if (this._keyA == null) {
                this._keyA = v;
                this._keyB = null;
                return;
            }
            this._keyB = v;
            this._rise();
        }
        public get KeyA() { return this._keyA; }
        public get KeyB() { return this._keyB; }

        constructor(public Owner: any) {

        }
        private elementInViewport1(el: HTMLElement) {
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;

            while (el.offsetParent) {
                el = el.offsetParent as HTMLElement;
                top += el.offsetTop;
                left += el.offsetLeft;
            }

            return (
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
        }
        private elementInViewport(el: HTMLElement) {
            if (!this.dom.contains(el)) return false;
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;

            while (el.offsetParent) {
                el = el.offsetParent as HTMLElement;
                top += el.offsetTop;
                left += el.offsetLeft;
            }
            var window = this.dom;
            return (
                top < (window.offsetTop + window.offsetHeight) &&
                left < (window.offsetLeft + window.offsetWidth) &&
                (top + height) > window.offsetTop &&
                (left + width) > window.offsetLeft
            );
        }
        public set Cancel(v: boolean) {
            this._stopEvent = !!v;
        }
        private _stopEvent: boolean;
        private _rise() {
            var c = this.handlers[this._keyA.key.toUpperCase()] && this.handlers[this._keyA.key.toUpperCase()][this._keyB.key.toUpperCase()];
            this._stopEvent = false;
            if (c)
                for (var i = this.sort(c) || 0; i < c.length; i++) {

                    try {

                        var k = c[i];
                        var t = k.target;
                        if (t) {
                            if (!this.elementInViewport(t instanceof JControl ? t.View as HTMLElement : t as any))
                                continue;
                        }
                        k.Invoke.call(k.Owner || k.target || this.Owner, this, k);

                    } catch (e) {
                    }
                    if (this._stopEvent) break;
                }
            this._stopEvent = undefined;
            this.OnComined.PInvok(0, [this], this.Owner);
            this.reset();
        }
        reset() {
            this._keyB = null;
            this._keyA = null;
        }
        handleEvent(e: KeyboardEvent) {
            e.preventDefault();
            if (!this._pause && e.ctrlKey) {
                if ((e.keyCode > 47 && e.keyCode < 91) || (e.keyCode > 97 && e.keyCode < 123)) {
                    this.KeyB = e;
                }
                return;
            }
            this.reset();
        }
        private isValid(keyA: string | number) {
            if (typeof keyA === 'string') {
                if (keyA.length == 1) {
                    keyA = keyA.charCodeAt(0);
                    return (keyA > 47 && keyA < 91) || (keyA > 97 && keyA < 123);
                }
            }
            else if (typeof keyA === 'number')
                return (keyA > 47 && keyA < 91) || (keyA > 97 && keyA < 123);
            return false;
        }
        public On(keyA: string, keyB: string, handle: (s: keyCominerEvent, e: IKeyCombinerTarget) => void, target?: JControl | Node, owner?) {
            if (this.isValid(keyA) && this.isValid(keyB) && typeof handle === 'function') {
                keyA = keyA.toUpperCase();
                keyB = keyB.toUpperCase();
                !this.handlers[keyA] && (this.handlers[keyA] = {});
                var c = this.handlers[keyA][keyB];
                !c && (this.handlers[keyA][keyB] = c = []);
                var x = <IKeyCombinerTarget>{ Invoke: handle, Owner: owner, target: target };
                c.push(x);
                c.sort()
                return x;
            } else throw "unvalide arguments";
        }
        public Off(keyA: string, keyB: string, e: IKeyCombinerTarget) {
            if (this.isValid(keyA) && this.isValid(keyB)) {
                keyA = keyA.toUpperCase();
                keyB = keyB.toUpperCase();
                var c = this.handlers[keyA] && this.handlers[keyA][keyB];
                if (!c) return;
                var i = c.indexOf(e);
                if (i !== -1)
                    c.splice(i, 1);
            } else throw "unvalide arguments";
        }
        private _pause: boolean;
        protected dom: HTMLElement;
        public pause() { this._pause = true; }
        public resume() { this._pause = false; }
        public attachTo(dom: HTMLElement) {
            if (this.dom)
                this.dom.removeEventListener('keyup', this);
            this.dom = dom;
            this.dom.addEventListener('keyup', this);
        }
        stopPropagation() {

        }
    }
    export class DesktopKeyboardManager extends keyCominerEvent {
        constructor(protected desk: Desktop) {
            super(desk);
            super.attachTo(desk.View);
        }
        get dom(): HTMLElement {
            var app = this.desk.CurrentApp;
            return ((app && app.CurrentModal) || app || this.desk).View as any;
        }
        set dom(v) { }
        attachTo(v: HTMLElement) {

        }
    }
    export interface IKeyboardControllerEventArgs {
        e?: KeyboardEvent;
        Result?: KeyboardControllerResult;
        Controller: IKeyboardController;

    }

    export interface IKeyboardController {
        owner?: any;
        invoke(e: IKeyboardControllerEventArgs);
        onResume?(e: IKeyboardControllerEventArgs): boolean;
        onPause?(e: IKeyboardControllerEventArgs): boolean;
        onStop?(e: IKeyboardControllerEventArgs): boolean;
        stackable?: boolean;
        params?: any[];
    }

    export class KeyboardControllerManager {
        private _controllers: IKeyboardController[] = [];
        public _current: IKeyboardController;
        constructor(public Desktop: UI.Desktop) { }
        public Current() {
            return this._current;
        }
        public GetController(nc: IKeyboardController): boolean {
            if (!nc) throw 'Argument null exception';
            if (this._current == nc) return true;
            if (!nc) throw "Argument null exception";
            var c = this._current;
            var e: IKeyboardControllerEventArgs = { Controller: nc };
            if (c)
                if (c.stackable ? c.onStop && !c.onStop(e) : c.onPause && !c.onPause(e)) return false;

            if (nc.onResume && !nc.onResume(e))
                return this.ResumeStack();
            if (c)
                if (!c.stackable) this._controllers.pop();
            this._controllers.push(nc);
            return true;
        }
        public Release(c: IKeyboardController) {
            var i = this._controllers.indexOf(c);
            if (i == -1) return false;
            var j = this._controllers.length - i;
            while (j-- >= 0) {
                var c = this._controllers[this._controllers.length - 1];
                if (c && c.onStop && !c.onStop({ Controller: c })) return false;
                this._controllers.pop();
                this._current = this._controllers[this._controllers.length - 1];
            }
            return true;
        }
        public ResumeStack() {
            var nc = this._controllers[this._controllers.length - 1];
            var e: IKeyboardControllerEventArgs;
            while (nc && nc.onResume && !nc.onResume(e = { Controller: nc })) {
                this._controllers.pop();
                this._current = nc = this._controllers[this._controllers.length - 1];
            }
            return true;
        }
        Invoke(e: KeyboardEvent): KeyboardControllerResult {
            var c: IKeyboardController;
            var i = this._controllers.length;
            var a: IKeyboardControllerEventArgs[] = <any>[void 0];
            while (c = c = this._controllers[--i]) {
                a[0] = { Controller: c, e: e };
                helper.TryCatch(c, c.invoke, void 0, <any>a);
                var r = a[0].Result || 0;
                if ((r & KeyboardControllerResult.Release) == KeyboardControllerResult.Release)
                    this.Release(c);
                if ((r & KeyboardControllerResult.ByPass) !== KeyboardControllerResult.ByPass)
                    return r;
            }
            return r || 0;
        }
    }
}

export module UI {

    function _() {
        this.init = true;
        this.initialize();
        this.OnFullInitialized();
    }
    function __(/*this: JControl,*/ v: JControl) {
        if (v != null && !this.init) {
            if ((v as any).init) {
                _.call(this);
            } else {
                var pv = this.parent;
                if (pv && !pv.init) pv._onInitialize.Remove(this._id);
                v._onInitialize.Add((_v) => {
                    if (this.parent == _v)
                        _.call(this);
                    else throw "";
                }, this._id);
            }
        }
    }

    export enum Events {
        keydown = 2,
        keyup = 3,
        keypress = 5,
    }
    export abstract class JControl extends bind.Scop implements EventListenerObject {
        private _parentScop: bind.Scop;

        public getParent(): bind.Scop {
            return this.Parent || this._parentScop;
        }
        protected _OnValueChanged(e: bind.EventArgs<any, any>) {
            //throw new (Error as any)("Method not implemented.");
        }
        public setParent(v: bind.Scop) {
            if (!this.canBeParent(v)) throw null;
            if (v instanceof JControl)
                v.Add(this);
            else this._parentScop = v;
            return true;
        }

        public CombinatorKey(keyA: string, keyB: string, callback: (this: this, e: keyCominerEvent) => void) {
            return Desktop.Current.KeyCombiner.On(keyA, keyB, callback, this, this);
        }

        public SearchParents<T extends JControl>(type: Function): T {
            var p = this.Parent;
            while (p)
                if (p instanceof type) return p as T;
                else p = p.Parent;
        }
        public static LoadCss(url) {
            var head = document.head;
            var link = document.createElement('link');
            link.setAttribute('as', 'style');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
            return link;
        }
        static __fields__(): any[] { return []; }
        public get InnerHtml() { return this._view.innerHTML; }
        public Float(v: HorizontalAlignement) {
            this._view.style.cssFloat = v === 0 ? 'left' : (v === 1 ? 'initiale' : 'right');
        }
        public Clear() {
            this._view.innerHTML = '';
        }
        protected parent: JControl;
        public _presenter: JControl;
        private _hotKey: HotKey;
        public _onInitialize: bind.EventListener<(s: JControl) => void> = new bind.EventListener<(s: JControl) => void>(this, true);
        public set OnInitialized(m: (s: this) => void) {
            if (this.init) m(this);
            else this._onInitialize.On = m;
        }

        public get Presenter() { return this._presenter || this; }
        public set Presenter(v: JControl) { this._presenter = v || this; }
        public setAttribute(name, value) {
            this.View.setAttribute(name, value);
            return this;
        }
        OnKeyDown(e: KeyboardEvent): any | void { }
        OnContextMenu(e: MouseEvent): any {
        }
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any | void { }
        public setAttributes(attributes: { [s: string]: string }) {
            var v = this.View;
            for (var i in attributes)
                v.setAttribute(i, attributes[i]);
            return this;
        }
        public applyStyle(a: string, b: string, c: string, d: string, e: string, f: string);
        public applyStyle(a: string, b: string, c: string, d: string, e: string);
        public applyStyle(a: string, b: string, c: string, d: string);
        public applyStyle(a: string, b: string, c: string);
        public applyStyle(a: string, b: string);
        public applyStyle(a: string);
        public applyStyle() {
            //RegisterLayout(this._view, arguments);
            this._view.classList.add.apply(this._view.classList, arguments);
            return this;
        }


        public disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string, x: string);
        public disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string);
        public disapplyStyle(a: string, b: string, c: string, d: string, e: string);
        public disapplyStyle(a: string, b: string, c: string, d: string);
        public disapplyStyle(a: string, b: string, c: string);
        public disapplyStyle(a: string, b: string);
        public disapplyStyle(a: string);

        public disapplyStyle() {
            this._view.classList.remove.apply(this._view.classList, arguments);
            //RegisterLayout(this._view, arguments, true);
            return this;
        }
        private _display = undefined;
        public set Visible(v: boolean) {
            v = v === true;
            if (v === this._display) return;
            this._display = this.View.style.display !== 'none' ? this.View.style.display : "";
            if (v)
                this.View.style.display = this._display;
            else this.View.style.display = 'none';
            //this.View.classList[v ? 'remove' : 'add']('collapse');
        }

        public set Wait(v: boolean) {
            if (v)
                this.applyStyle('Wait');
            else this.disapplyStyle('Wait');
        }

        public get Visible() {
            return this.View.style.display != 'none' && this.View.style.visibility == 'visible';
        }
        public set Enable(v: boolean) {
            this.View.style.pointerEvents = v ? 'all' : 'none';
        }
        public get Enable() {
            return this.View.style.pointerEvents != 'none';
        }


        public get Parent(): JControl {
            return this.parent;
        }
        private static counter = 0;
        private _id = ++JControl.counter;
        private init = false;


        /** @override */
        public get IsInit() { return this.init; }

        protected OnFullInitialized() {
            this._onInitialize.PInvok(this, [this], this);
        }
        protected set OnPaint(method: (this: this, n: this) => void) {
            PaintThread.OnPaint({ args: [this], method, owner: this });
        }
        public set Parent(v: JControl) {
            this.parent = v;
            __.call(this, v);
        }
        protected instantanyInitializeParent() { return false;}
        public set ToolTip(t: string) { this.View.title = t; }

        public get View() {
            return this._view;
        }
        constructor(protected _view: HTMLElement) {
            super(3);
            if (_view) {
                if (_view.id === '')
                    _view.id = this._id + "";
            }
            if (!this._hasValue_())
                this.Value = this;
        }
        protected _hasValue_() { return false; }
        protected abstract initialize();
        public static createDiv() { return document.createElement('div'); }

        public addEventListener<T>(event: string, handle: (sender: this, e: Event, param: T) => void, param: T, owner?) {
            var x = new basic.DomEventHandler(this._view, event, owner, JControl._handle, { jc: this, handle: handle, p: param });
            x.Start();
            return x;
        }

        private static _handle(eth: basic.DomEventHandler<any, any>, ev: Event, p) {
            p.handle.call(this, p.jc, ev, p.p);
        }
        public AddRange(chidren: JControl[]) {
            for (var i = 0, l = chidren.length; i < l; i++)
                this.Add(chidren[i]);
            return this;
        }
        public Add(child: JControl) {
            if (child.parent != null) {
                if (child.parent === this)
                    return;

                child.parent.Remove(child, false);
            }
            child = this.getTemplate(child);
            child.Parent = this;
            this.View.appendChild(child.View);
            return this;
        }
        public IndexOf(child: JControl) {

        }
        public Insert(child: JControl, to: number) {
            if (child.parent != null) {
                child.parent.Remove(child, false);
            }
            child = this.getTemplate(child);
            child.Parent = this;
            (this.View as any).insertChildAtIndex(child.View, to);
            return this;
        }
        public Remove(child: JControl, dispose?: boolean): boolean {
            if (child.parent != this) return false;
            child.Parent = null;
            if (this.View.contains(child.View))
                this.View.removeChild(child.View);
            else if (child._view.parentNode != null) child.View.remove();
            if (dispose) child.Dispose();
            return true;
        }
        protected getTemplate(child: JControl): JControl {
            return child;
        }
        public get Id() {
            return this._id;
        }
        Dispose() {

            var h = this.OnDispose();
            if (h === null) return;
            if (this.parent) this.parent.Remove(this, false);
            if ((this._presenter != null) && (this._presenter != this)) this._presenter.Dispose();
            this._presenter = null;
            this.Parent = null;
            this._view = null;
            this._display = null;

            this._onInitialize.Dispose();
            this._presenter = null;
            this.parent = null;
            this.Presenter
            basic.DomEventHandler.Dispose(this._view);
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }

        protected OnHotKey() {
        }

        public set HotKey(v: HotKey) {
            if (!this.isEventRegistred(Events.keyup)) this.registerEvent(Events.keypress);
            this._hotKey = v;
        }
        public get HotKey() { return this._hotKey; }

        handleEvent(e: Event) {
            switch (Events[e.type]) {
                case Events.keydown:
                    break;
                case Events.keyup:
                    if (this._hotKey && this._hotKey.IsPressed(e as KeyboardEvent))
                        this.OnHotKey();
                    break;
                case Events.keypress:
                    break;
            }
        }

        private _events: Events = 0;
        private isEventRegistred(event: string | number) {
            var t = typeof (event) == 'number' ? event : Events[event];
            if (t === undefined) throw "event is not registred";
            return (this._events / t) % 1 === 0;
        }
        private registerEvent(event: Events) {
            this._view.addEventListener(Events[event], this);
        }
        static toggleClass(dom, className) {
            if (dom.classList.contains(className))
                dom.classList.remove(className);
            else dom.classList.add(className);
        }

    }


    export namespace attributes {
        interface ComponentContent {
            SelfProcessing: boolean;
            AddChildMethod?: string;
            ContentProperty?: string;
        }
        export function ContentProperty(propertyName: string|bind.DProperty<any,any>) {
            return function (target: typeof UI.JControl) {
                if (!reflection.IsInstanceOf(target, UI.JControl)) throw "Attribute ContentControl cannot apply to non-UI.JControl Element";
                (ContentProperty as Attributes.Attribute<string | bind.DProperty<any, any>>).declare(target, propertyName);
            }
        }
        export function ChildrenProperty(e: { PropertyName?: string, MethodName?: string }) {
            return function (target: typeof UI.JControl) {
                if (!reflection.IsInstanceOf(target, UI.JControl)) throw "Attribute ChildrenProperty cannot apply to non-UI.JControl Element";
                (ChildrenProperty as Attributes.Attribute<typeof e>).declare(target, e);
            }
        }
        export function SelfProcessing() {
            return function (target: typeof UI.JControl) {
                if (!reflection.IsInstanceOf(target, UI.JControl)) throw "Attribute ChildrenProperty cannot apply to non-UI.JControl Element";
                (SelfProcessing as Attributes.Attribute<boolean>).declare(target, true);
            }
        }
        Attributes.asAttribute(<any>ContentProperty, { AllowMultiple: false, Heritable: true, Target: Attributes.AttributeTargets.Class });
        Attributes.asAttribute(<any>ChildrenProperty, { AllowMultiple: false, Heritable: true, Target: Attributes.AttributeTargets.Class });
        Attributes.asAttribute(<any>SelfProcessing, { AllowMultiple: false, Heritable: true, Target: Attributes.AttributeTargets.Class });

    }
    export interface IContentControl extends JControl {
        Content: JControl;
    }
    export abstract class Control<T extends JControl> extends JControl {
        private _c: T[];
        private get Children(): T[] { return this._c || (this._c = []); }
        //private templates: JControl[] = [];
        public Add(child: T) {
            if (!this.Check(child)) throw 'Uncompatible';
            let t: JControl;
            if (child instanceof JControl) {
                t = child.Presenter;
                if (t === undefined) t = child;
                if (t.Parent != null) {
                    t.Parent.Remove(t, false);
                }
            }
            t = this.getTemplate(child);
            t.Parent = this;
            if (t !== child)
                child._presenter = t;
            this.Children.push(child);
            this.View.appendChild(t.View);
            this.OnChildAdded(child);
            return this;
        }

        public Insert(child: T, to: number) {
            if (!this.Check(child)) throw 'Uncompatible';
            let t: JControl;
            if (child instanceof JControl) {
                t = child.Presenter;
                if (t === undefined) t = child;
                if (t.Parent != null) {
                    t.Parent.Remove(t, false);
                }
            }
            t = this.getTemplate(child);
            t.Parent = this;
            this.Children.splice(to, 0, child);
            (this.View as any).insertChildAtIndex(child.View, to);
            this.OnChildAdded(child);
            return this;
        }
        public Remove(child: T, dispose?: boolean): boolean {
            let i = this.Children.indexOf(child);
            if (i == -1) return true;
            let t = child.Presenter;
            if (t.Parent != this) return false;
            t.Parent = null;
            if (this.Children.splice(i, 1).length != 0)
                this.View.removeChild(t.View);
            return true;
        }
        public RemoveAt(i: number, dispose: boolean): boolean {
            let child = this.Children[i];
            if (!child) return;
            let t = child.Presenter;
            t.Parent = null;
            this.Children.splice(i, 1);
            this.View.removeChild(this.Presenter ? t.Presenter.View : t.View);
            if (dispose)
                child.Dispose();
            return true;
        }

        protected abstract Check(child: T);
        protected get HasTemplate() { return false; }
        protected getTemplate(child: T): JControl {
            return child;
        }
        protected OnChildAdded(child: T) {

        }
        public getChild(i: number): T {
            return this.Children[i];
        }
        public IndexOf(item: T) {
            return this.Children.indexOf(item);
        }
        constructor(view: HTMLElement) {
            super(view);
        }

        public get Count() {
            return this.Children.length;
        }
        public CloneChildren() {
            var c = this.Children;
            var arr = new Array(c.length);
            for (var i = 0, l = arr.length; i < l; i++)
                arr[i] = c[i];
        }
        public Clear(dispose?: boolean) {
            for (var i = 0, l = this.Count; i < l; i++)
                this.RemoveAt(0, dispose);
        }

        Dispose() {

            var h = this.OnDispose();
            if (h === null) return;
            this.Clear(true);
            this._c.length = 0;
            this._c = null;
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }

    }

    var authApp: defs.$UI.IAuthApp;

    var isLogged = function (v) { _dsk.AuthStatChanged(v); }

    export class Desktop extends Control<App> {
        public static DPCurrentApp: bind.DProperty<App, Desktop>;
        public static DPCurrentLayout: bind.DProperty<JControl, Desktop>;
        public CurrentLayout: JControl;

        Logout(): any {
            if (this.AuthenticationApp)
                this.AuthenticationApp.Logout();
            else this.CurrentApp.Logout();
        }
        OpenSignin() {
            this.CurrentApp = this.AuthenticationApp;
        }
        isReq: number;
        public KeyCombiner: keyCominerEvent = new DesktopKeyboardManager(this);

        public CurrentApp: defs.$UI.IApp;
        static ctor() {
            this.DPCurrentApp = bind.DObject.CreateField<App, Desktop>('CurrentApp', Object, null, (e) => {
                e.__this.selectApp(e._old, e._new);
            });
            this.DPCurrentLayout = bind.DObject.CreateField<JControl, Desktop>("CurrentLayout", JControl, null, this.prototype._currentLayoutChanged);
        }

        private _currentLayoutChanged(e: bind.EventArgs<JControl, this>) {
            //(this.KeyCombiner as any).dom = e._new && e._new.View || this.View;
        }
        private selectApp(oldApp: App, app: App) {
            if (oldApp) {
                this.Remove(oldApp, false);
                _app = null;
                helper.TryCatch(oldApp, oldApp.OnDetached);
            }
            if (app) {
                super.Add(app);
                _app = app;
                this.CurrentLayout = (app && app.CurrentModal) || app;
                helper.TryCatch(app, app.OnAttached);
            } else this.CurrentLayout = this;
            window.sessionStorage.setItem('app', app && app.Name);
        }
        static __fields__() {
            return [Desktop.DPCurrentApp, Desktop.DPCurrentLayout];
        }
        public AuthStatChanged(v: boolean) {
            if (v) this.Show(this.AuthenticationApp.RedirectApp);
            else this.Show(this.AuthenticationApp);
        }


        private apps: collection.List<defs.$UI.IApp> = new collection.List<defs.$UI.IApp>(Object);

        public IsSingleton = true;

        constructor() {
            super(document.body);
            _.call(this);
            if (_dsk != null) throw '';
            _dsk = this;
        }

        initialize() {
            document.addEventListener('keydown', this);
            document.addEventListener('contextmenu', this);
            this.KeyCombiner.attachTo(this.View);
            this.KeyCombiner.OnComined.Add(this.OnKeyCombined);
            this.observer = new bind.Observer(this, ['CurrentApp', 'CurrentModal']);
            this.observer.OnPropertyChanged(bind.Observer.DPValue, (s, e) => {
                this.CurrentLayout = e._new || this.CurrentApp || this;
            });
        }

        private observer: bind.Observer;
        private mouseController(e) {
        }
        public KeyboardManager: UI.KeyboardControllerManager = new UI.KeyboardControllerManager(this);
        private _keyboardControllers: { owner: any, invoke: (e: KeyboardEvent) => KeyboardControllerResult, params: any[] }[] = [];
        private _keyboardController: { owner: any, invoke: (e: KeyboardEvent) => KeyboardControllerResult, params: any[] };
        private get KeyboardController() {
            return this._keyboardController;
        }
        private set KeyboardController(v) {
            this._keyboardController = v;
        }
        public GetKeyControl(owner: any, invoke: (e: KeyboardEvent, ...params: any[]) => KeyboardControllerResult, params: any[]) {
            this.KeyCombiner.pause();
            this.KeyboardController = { owner: owner, invoke: invoke, params: params };
        }
        public ReleaseKeyControl() {
            this.KeyCombiner.resume();
            this.KeyboardController = null;
        }


        private focuser: basic.focuser = new basic.focuser(this.View, true);
        private handleTab(e: KeyboardEvent, _view: HTMLElement) {
            this.focuser.bound = _view;
            this.focuser.focuse(true, e.shiftKey);
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget) {
            var b = this.CurrentApp;
            if (b) b.OnKeyCombined(e, v);
        }
        public defaultKeys = 'jtpneruosdfhgkwl';
        OnKeyDown(e: KeyboardEvent) {

            if (e.ctrlKey && this.defaultKeys.indexOf(e.key && e.key.toLowerCase()) != -1 || e.altKey && e.keyCode == 18)
                e.preventDefault();
            var x = this.KeyboardController;
            let currentApp = this.CurrentApp;
            if (x) {
                var p = x.params.slice();
                p.unshift(e);
                var r = x.invoke.apply(this.KeyboardController.owner, p);
                if ((r & KeyboardControllerResult.Release) == KeyboardControllerResult.Release)
                    this.ReleaseKeyControl();
                if ((r & KeyboardControllerResult.ByPass) != KeyboardControllerResult.ByPass)
                    return;
            }

            var cd = currentApp && currentApp.CurrentModal;

            if (e.keyCode > 111 && e.keyCode < 124) { e.stopPropagation(); e.preventDefault(); }

            if (cd) {
                if (!cd.OnKeyDown(e))
                    if (e.keyCode === 9)
                        this.handleTab(e, cd.View);
                    else;
                else {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                }
                return;
            }

            if (e.keyCode === 114) {
                if (e.ctrlKey)
                    (this.CurrentApp as any).ToggleTitle();
                else
                    this.CurrentApp.OnDeepSearche();
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.keyCode === Keys.F5) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                this.CurrentApp.Update();
            }

            else if (e.keyCode == Keys.F12) {
                if (e.ctrlKey) {
                    this.Logout();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    return;
                }
                if (currentApp) {
                    if (currentApp.SelectedPage instanceof UI.NavPage)
                        currentApp.SelectedPage.ToggleNav();
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            else if (e.ctrlKey && e.shiftKey && e.keyCode == 66) {
                if ((Date.now() - this.isReq) < 500) {
                    Api.RiseApi('Settings', { data: e, callback: () => { } });
                }
                else
                    this.isReq = Date.now();
            }
            else if (e.ctrlKey && (e.keyCode == 112 || e.keyCode === 80)) {
                currentApp.OnPrint();
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            else {
                if (currentApp && e.ctrlKey && e.keyCode === 80)
                    this.CurrentApp.OnPrint();
                (currentApp as any).OnKeyDown(e);
            }
        }
        handleEvent(e: Event) {
            switch (e.type) {
                case 'keydown':
                    if ((e as KeyboardEvent).keyCode !== 93)
                        return this.OnKeyDown(e as KeyboardEvent);
                    else {
                        var oe = e;
                        var r: HTMLElement = e.srcElement as any;
                        var x = r.clientLeft, y = r.clientTop;
                        e = <MouseEvent>{
                            preventDefault() { oe.preventDefault(); }, stopPropagation() { oe.stopPropagation();} , x, y, screenX: x, screenY: y, clientY: y, clientX: x, pageX: x, pageY: y };
                    }
                case 'contextmenu':
                    return this.OnContextMenu(e as MouseEvent);
                default:
            }
        }
        OnContextMenu(e: MouseEvent) {
            e.preventDefault();
            let currentApp = this.CurrentApp;
            var cd = currentApp && currentApp.CurrentModal;
            if (cd) return cd.OnContextMenu(e);
            else if (currentApp) return currentApp.OnContextMenu(e);

        }
        private ShowStart() {
            var t = this.apps;
            var s = "Select app :";
            var ap = this.CurrentApp == null ? null : this.CurrentApp.Name;
            for (var i = 0, l = t.Count; i < l; i++) {
                if (ap == null) ap = t.Get(i).Name;
                s += "\r        " + t.Get(i).Name;
            }

            var e = prompt(s, ap == null ? "" : ap);
            for (var i = 0, l = t.Count; i < l; i++)
                if (t.Get(i).Name.toLowerCase() == e) {
                    { this.Show(t.Get(i)); }
                    return;
                }
        }
        public static get Current() { return _dsk; }
        Check(v: defs.$UI.IApp) {
            return v instanceof Object;
        }
        Show(app: defs.$UI.IApp) {
            if (authApp)
                authApp.IsLogged((v, app) => {
                    var currentApp = this.CurrentApp;
                    if (!v) {
                        if (currentApp && currentApp.IsAuthentication) return;
                        if (app !== this.AuthenticationApp)
                            this.AuthenticationApp.RedirectApp = app;
                        app = this.AuthenticationApp;
                    }
                    else {
                        app = app && app.IsAuthentication ? (app as defs.$UI.IAuthApp).RedirectApp : app;
                    }
                    if (!app)
                        for (var i = 0; i < this.apps.Count; i++) {
                            var appx = this.apps.Get(i);
                            if (!(appx && appx.IsAuthentication)) {
                                app = appx;
                                break;
                            }
                        }
                    thread.Dispatcher.Push(this.loadApp.Set(app));
                }, app);
            else thread.Dispatcher.Push(this.loadApp.Set(app));
        }
        private to;
        private loadApp = thread.Dispatcher.cretaeJob((app: App) => {
            this.CurrentApp = app;
        }, [null], this, !true);
        Add(i: defs.$UI.IApp) {
            if (i.IsAuthentication) this.AuthenticationApp = i as any;
            else this.Register(i);
            return this;
        }

        Register(app: defs.$UI.IApp) {
            if (this.apps.IndexOf(app) !== -1) return;
            this.apps.Add(app);
            app.Parent = this;
        }

        public get AuthenticationApp(): defs.$UI.IAuthApp { return authApp; }
        public set AuthenticationApp(v: defs.$UI.IAuthApp) {
            if (authApp || v == null) throw '';
            authApp = v;
            v.OnStatStatChanged.On = (auth, v) => {
                if (v) {
                    this.Redirect(auth);
                } else {
                    this.Show(auth);
                }
            };
            //authApp.OnLogged = { Owner: this, Invoke: this.Redirect };

        }
        private Redirect(app: defs.$UI.IAuthApp) {
            this.Show(app.RedirectApp);
        }
        OnUsernameChanged(job, e) {

        }
    }
    @attributes.ChildrenProperty({ MethodName: "Add" })
    export class Container extends Control<JControl>{
        constructor() {
            super(document.createElement('div'));
        }
        initialize() { this.applyStyle('container'); }
        Check(child: JControl) { return child instanceof JControl; }
    }
    export enum Icons {
        Bar, Next, Prev,
    }
    export enum Glyphs {
        none,
        asterisk, plus, eur, euro, minus, cloud, envelope, pencil, glass, music, search, heart, star, starEmpty, user, film, thLarge, th, thList, ok, remove, zoomIn, zoomOut, off, signal, cog, trash, home, file, time, road, downloadAlt, download, upload, inbox, playCircle, repeat, refresh, listAlt, lock, flag, headphones, volumeOff, volumeDown, volumeUp, qrcode, barcode, tag, tags, book, bookmark, print, camera, font, bold, italic, textHeight, textWidth, alignLeft, alignCenter, alignRight, alignJustify, list, indentLeft, indentRight, facetimeVideo, picture, mapMarker, adjust, tint, edit, share, check, move, stepBackward, fastBackward, backward, play, pause, stop, forward, fastForward, stepForward, eject, chevronLeft, chevronRight, plusSign, minusSign, removeSign, okSign, questionSign, infoSign, screenshot, removeCircle, okCircle, banCircle, arrowLeft, arrowRight, arrowUp, arrowDown, shareAlt, resizeFull, resizeSmall, exclamationSign, gift, leaf, fire, eyeOpen, eyeClose, warningSign, plane, calendar, random, comment, magnet, chevronUp, chevronDown, retweet, shoppingCart, folderClose, folderOpen, resizeVertical, resizeHorizontal, hdd, bullhorn, bell, certificate, thumbsUp, thumbsDown, handRight, handLeft, handUp, handDown, circleArrowRight, circleArrowLeft, circleArrowUp, circleArrowDown, globe, wrench, tasks, filter, briefcase, fullscreen, dashboard, paperclip, heartEmpty, link, phone, pushpin, usd, gbp, sort, sortByAlphabet, sortByAlphabetAlt, sortByOrder, sortByOrderAlt, sortByAttributes, sortByAttributesAlt, unchecked, expand, collapseDown, collapseUp, logIn, flash, logOut, newWindow, record, save, open, saved, import, export, send, floppyDisk, floppySaved, floppyRemove, floppySave, floppyOpen, creditCard, transfer, cutlery, header, compressed, earphone, phoneAlt, tower, stats, sdVideo, hdVideo, subtitles, soundStereo, soundDolby, sound$5$1, sound$6$1, sound$7$1, copyrightMark, registrationMark, cloudDownload, cloudUpload, treeConifer, treeDeciduous, cd, saveFile, openFile, levelUp, copy, paste, alert, equalizer, king, queen, pawn, bishop, knight, babyFormula, tent, blackboard, bed, apple, erase, hourglass, lamp, duplicate, piggyBank, scissors, bitcoin, btc, xbt, yen, jpy, ruble, rub, scale, iceLolly, iceLollyTasted, education, optionHorizontal, optionVertical, menuHamburger, modalWindow, oil, grain, sunglasses, textSize, textColor, textBackground, objectAlignTop, objectAlignBottom, objectAlignHorizontal, objectAlignLeft, objectAlignVertical, objectAlignRight, triangleRight, triangleLeft, triangleBottom, triangleTop, console, superscript, subscript, menuLeft, menuRight, menuDown, menuUp
    }
    export class Glyph extends JControl {

        public static AllGlyphs(panel: JControl) {
            for (var i in Glyphs) {
                if (isNaN(i as any)) {
                    panel.Add(new Glyph(Glyphs[i as string], false));
                }
            }
        }
        public static Test() {
            var c = new UI.Div().applyStyle('row');
            for (var i in Glyphs) {
                if (isNaN(i as any)) {
                    var v = new Glyph(Glyphs[i as string], false).applyStyle('col');
                    c.Add(v);
                    v.ToolTip = i;
                }
            }
            c.Parent = UI.Desktop.Current;
            var reg = document.getElementById('51');
            reg.appendChild(c.View);
            c.View.style.fontSize = '-webkit-xxx-large';
            c.View.style.padding = '15px';

            return c;
        }
        public static CreateGlyphDom(glyph: UI.Glyphs, toolTip: string, cssClass?: string): HTMLSpanElement {
            var v = document.createElement('span');
            v.classList.add('glyphicon', Glyph.GetGlyphCSS(glyph), 'bgr');
            if (cssClass) v.classList.add(cssClass);
            v.title = toolTip;
            return v;
        }
        private static GetGlyphCSS(name: Glyphs): string {
            let c = css.toValidCssName(Glyphs[name]);
            return 'glyphicon' + (c == null ? '' : '-' + c);
        }
        private static GetIconCSS(name: Icons): string {
            let c = Icons[name];
            return 'icon-' + (c == null ? '' : c.toLowerCase());
        }
        private getStyle() {
            if (this.isIcon) return Glyph.GetIconCSS(this.v as Icons);
            else return Glyph.GetGlyphCSS(this.v as Glyphs);
        }
        constructor(glyph: Glyphs | Icons, private isIcon?: boolean, toolTip?: string) {
            super(document.createElement('span'));
            isIcon = isIcon == true;
            this.Type = glyph;
            this._view.classList.add('bgr');
            this._view.title = toolTip;
        }
        initialize() {
        }
        private v: Glyphs | Icons;
        public set Type(v: Glyphs | Icons) {
            if (this.v != null)
                this.View.classList.remove(this.getStyle());
            this.v = v;
            if (v != null)
                this.applyStyle('glyphicon', this.getStyle());
        }
        public get Type() { return this.v; }
    }
    @attributes.ContentProperty("Content")
    export class Button extends JControl {
        Focus(): any {
            this._view.focus();
        }
        private v: ButtonStyle = 0;
        set Style(v: ButtonStyle) {
            this.View.classList.remove('btn-' + ButtonStyle[this.v].toLowerCase());
            this.applyStyle('btn-' + ButtonStyle[v].toLowerCase());
            this.v = v;
        }
        initialize() {
            this.applyStyle('btn', 'btn-default');
            this.Type = 'button';
        }
        constructor() { super(document.createElement('button')); }
        private _text: $text;
        private _content: Node;
        public set Text(s: string) {
            if (s)
                if (this._text) {
                    this._text.textContent = s;
                    return;
                } else
                    this._text = document.createTextNode(s);
            else
                if (!this._text) return;
                else this._text = null;
            this.reset();
        }
        public set Content(s: Node) {
            if (this._content) try { this._view.removeChild(this._content); } catch{ }
            this._content = s;
            this.reset();
        }
        public get Content() { return this._content; }
        public get Text() { return this._text && this._text.textContent; }
        public set Type(s: string) { (this.View as HTMLButtonElement).type = s; }

        private reset() {
            this.Clear();
            if (this._text)
                this._view.appendChild(this._text);
            if (this._content)
                this._view.appendChild(this._content);
        }
    }
    export class GlyphButton extends Button {
        initialize() {
            let v = this.View;
            this.AddGlyphs(() => true, Icons.Bar, Icons.Bar, Icons.Bar);
            super.initialize();
        }
        AddGlyphs(isIcon: (i: number) => boolean, ...glyphs: (Glyphs | Icons)[]) {
            for (var i = 0; i < glyphs.length; i++)
                this.AddGlyph(glyphs[i], isIcon(i));
        }
        AddGlyph(glyph: Glyphs | Icons, isIcon?: boolean): Glyph {
            if (typeof glyph == 'number') {
                let g = new Glyph(glyph, isIcon);
                super.Add(g);
                return g;
            }
            return null;
        }
        protected Check(child: JControl) {
            return child instanceof Glyph;
        }
        private target: JControl;
        public set CollapsedZone(target: JControl) {
            let v = this.View;
            this.applyStyle('navbar-toggle');
            v.setAttribute('data-toggle', 'collapse');
            v.setAttribute('data-target', '#' + target.Id);
            target.applyStyle('collapse');
        }
    }
    export class Dom extends JControl {
        constructor(tagName: string | HTMLElement, classList?: string[]) {
            super(typeof tagName == 'string' ? document.createElement(tagName as string) : (tagName as HTMLElement));
            if (classList)
                for (var i = 0; i < classList.length; i++)
                    this.View.classList.add(classList[i]);
        }
        initialize() {
        }
    }
    export class Anchore extends JControl {
        constructor(content?: string | HTMLElement | JControl, href?: string) {
            super(f = document.createElement('a'));
            var f: HTMLAnchorElement;

            if (href != null && href != '#') f.href = href;
            if (content != null)
                if (content instanceof JControl)
                    this.Add(content);
                else if (content instanceof HTMLElement)
                    f.appendChild(content);
                else if (typeof content === 'string')
                    f.text = content;
        }
        initialize() {
        }
        Add(child: JControl) {
            this.View.innerHTML = '';
            super.Add(child);
            return this;
        }
        Remove(child: JControl): boolean { return false; }

        get Text(): string {
            return (this.View as HTMLAnchorElement).text;
        }
        set Text(v: string) {
            (this.View as HTMLAnchorElement).text = v;
        }
        get Href(): string {
            return (this.View as HTMLAnchorElement).href;
        }
        set Href(v: string) {
            (this.View as HTMLAnchorElement).href = v;
        }
    }
    export class Label extends JControl {
        constructor(text: string) {
            super(f = document.createElement('label'));
            var f: HTMLLabelElement;
            f.textContent = text;
        }
        initialize() { /*this.applyStyle('mySearch');*/ }

        get Text(): string {
            return (this.View as HTMLLabelElement).textContent;
        }
        set Text(v: string) {
            (this.View as HTMLLabelElement).textContent = v;
        }
    }
    export class Text extends JControl {
        constructor(text: string) {
            super(f = document.createElement('div'));
            var f: HTMLDivElement;
            f.textContent = text;
        }
        initialize() { }

        get Text(): string {
            return this.View.textContent;
        }
        set Text(v: string) {
            (this.View as HTMLLabelElement).textContent = v;
        }
    }

    export class Textbox extends JControl {
        constructor(text?: string) {
            super(f = document.createElement('input'));
            var f: HTMLInputElement;
            f.type = 'search';
            if (text != void 0)
                f.value = text;
        }
        public Focus() {
            this.View.focus();
        }
        initialize() {
        }
        Add(child: JControl) { return this; }
        Remove(child: JControl): boolean { return false; }

        get Text(): string {
            return (this.View as HTMLInputElement).value;
        }
        set Text(v: string) {
            (this.View as HTMLInputElement).value = v;
        }
        get PlaceHolder(): string {
            return this.View.getAttribute('placeholder');
        }
        set PlaceHolder(v: string) {
            this.View.setAttribute('placeholder', v);
        }

    }
    export enum ListType {
        Ordred,
        UnOrdred,
    }
    export class List extends Control<JControl>{
        constructor(type?: ListType) {
            super(document.createElement(type === undefined ? 'div' : (type === 0 ? 'ol' : (type === 1 ? 'ul' : 'ul'))));
        }
        initialize() {
            this._view.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.keyCode === Keys.Down)
                    this.SelectedIndex++;
                else if (e.keyCode === Keys.Up)
                    this.SelectedIndex--;
            });
        }

        Check(child: JControl): boolean {
            return child instanceof JControl;// || typeof (child) == 'string';
        }
        get HasTemplate() { return true; }
        getTemplate(child: JControl | HTMLElement | string): JControl {
            let l = new Dom('li');
            if (child instanceof JControl) {
                l.Add(child);
            }
            else if (child instanceof HTMLElement)
                l.View.appendChild(child);
            else {
                let a = new Anchore(child, '#');
                l.Add(a);
            }
            return l;
        }
        public AddText(item: string) {
            var t = new Div(); t.View.textContent = item;
            this.Add(t);
            return t;
        }
        protected OnChildAdded(child: JControl) {
            if (this._si == -1) this.SelectedIndex = 0;
        }
        private _si = -1;
        public set SelectedIndex(i: number) {
            let ox = this.getChild(this._si);
            if (ox) {
                if (ox.Presenter)
                    ox.Presenter.View.classList.remove('active');
                else if (ox.Parent)
                    ox.Parent.disapplyStyle('active');
            }
            let x = this.getChild(i);
            if (x)
                if (x.Presenter) x.Presenter.applyStyle('active');
                else if (x.Parent) x.Parent.applyStyle('active');
        }
        public get SelectedIndex(): number {
            return this._si;
        }
    }
    export class DivControl extends Control<JControl>{
        constructor(tag?: string | HTMLElement) {
            super(typeof tag === 'string' ? document.createElement(tag || 'div') : tag as HTMLElement);
        }
        initialize() {
            //this.applyStyle('list-group');
        }
        Check(child: JControl): boolean {
            return child instanceof JControl;
        }
    }

    export class Div extends Control<JControl> {
        constructor() {
            super(document.createElement('div'));
        }
        initialize() {

        }
        Check(item: JControl) { return true; }
    }

    export class ServiceNavBar<T extends IItem> extends JControl {
        constructor(public App: defs.$UI.IApp, private autoInitializePanels: boolean) {
            super(document.createElement('div'));
            this.OnClick = this.OnClick.bind(this);
            this.serviceNotified = this.serviceNotified.bind(this);
        }
        initialize() {
            if (this.autoInitializePanels) {
                this.LeftTabs = this._lefttabs || new Navbar<T>();
                this.RightTabs = this._righttabs || new Navbar<T>();
                delete this.autoInitializePanels;
            }
            this.applyStyle('navbar', 'navbar-fixed-bottom', 'appFoot', 'uncolapsed');
        }
        private _lefttabs: Navbar<T>;
        private _righttabs: Navbar<T>;
        private bi;
        public set LeftTabs(v: Navbar<T>) {
            if (this._lefttabs === v) return;
            if (this._lefttabs) {
                super.Remove(this._lefttabs);
                this._lefttabs.OnSelectedItem.Remove(this);
            }
            if (v) {
                super.Add(v);
                v.OnSelectedItem.Add((s) => { if (this.OnPageSelected) this.OnPageSelected(s); }, this);
                v.Float(HorizontalAlignement.Left);
            }
            this._lefttabs = v;
        }
        public set RightTabs(v: Navbar<T>) {
            if (this._righttabs === v) return;
            if (this._righttabs) {
                super.Remove(this._righttabs);
                this._righttabs.OnSelectedItem.Remove(this);
            }
            if (v) {
                super.Add(v);
                v.OnSelectedItem.Add((s) => { if (this.OnPageSelected) this.OnPageSelected(s) }, this);
                v.Float(HorizontalAlignement.Right);
            }
            this._righttabs = v;
        }

        private createItem(page: Page): MenuItem {
            let x = new MenuItem(page);
            x.OnClick = this.OnClick;
            return x;
        }
        public OnPageSelected: (page: T) => void;
        public OnClick(page: T) {
            if (this.OnPageSelected) this.OnPageSelected(page);
        }
        public Add(child: JControl): this {
            throw "Not Allowed";
        }
        public AddRange(child: JControl[]): this {
            throw "Not Allowed";
        }
        public Remove(child: JControl): boolean {
            if (child === this._lefttabs)
                this.LeftTabs = null;
            else if (child === this._righttabs)
                this.RightTabs = null;
            else
                throw "Not Allowed";
            return true;
        }

        /////////
        public serviceNotified(s: IService, n: NotifyType) {
            if (this.App === App.CurrentApp)
                if (n === NotifyType.Focuse)
                    this.Push(s);
                else if (n === NotifyType.UnFocus)
                    this.Pop(s);
        }
        private services: BarStack[] = [];
        private get currentStack() { return this.services[this.services.length - 1]; }
        private CurrentService() { const t = this.services[this.services.length - 1]; if (t) return t.Current; return null; }
        public PushGBar(ser: IService) {
            this.HideCurrentService();
            this.services.push(new BarStack(ser));
            this.ShowCurrentService();
        }
        public PopGBar(ser: IService) {
            this.HideCurrentService();
            this.services.pop();
            this.Add(ser.GetLeftBar());
        }
        public ExitBar() {
            this.HideCurrentService();
            this.currentStack.Exit();
            this.ShowCurrentService();
        }
        public PushBar(ser: IService) {
            this.HideCurrentService();
            this.currentStack.Push(ser);
            this.ShowCurrentService();
        }
        public PopBar() {
            this.HideCurrentService();
            this.currentStack.Pop();
            this.ShowCurrentService();
        }

        private HideCurrentService() {
            const cs = this.currentStack;
            if (cs) {
                var l = cs.Current.GetLeftBar();
                var r = cs.Current.GetRightBar();
                if (l) {
                    if (l instanceof Navbar)
                        this.LeftTabs = null;
                    else
                        this.Remove(l);
                }
                if (r) {
                    if (r instanceof Navbar)
                        this.RightTabs = null;
                    else
                        this.Remove(r);
                }
            }
        }
        private ShowCurrentService() {
            const cs = this.currentStack;
            if (cs) {
                var l = cs.Current.GetLeftBar();
                var r = cs.Current.GetRightBar();
                UI.MenuItem
                if (l) {
                    if (l instanceof Navbar)
                        this.LeftTabs = l;
                    else
                        this.Add(l);
                }
                if (r) {
                    if (r instanceof Navbar)
                        this.RightTabs = r;
                    else {
                        this.Add(r);
                    }
                }
                this.Visible = l != null || r != null;
            }
        }
        public Push(s: IService) {
            if (!s || s === this.CurrentService()) return;
            this.HideCurrentService();
            const c = this.CurrentService();
            if (c)
                if (c.ServiceType == ServiceType.Instantany)
                    this.currentStack.Pop();
            if (s.ServiceType == ServiceType.Main)
                this.services.push(new BarStack(s));
            else {
                const t = this.currentStack;
                if (t == null)
                    this.services.push(new BarStack(s));
                else
                    this.currentStack.Push(s);
            }
            this.ShowCurrentService();
        }
        private Has(s: IService) {
            const c = this.services;
            let r; let l = c.length;
            for (let i = l - 1; i >= 0; i--) {
                let x = c[i];
                if ((r = x.Has(s)) !== 0) return { stack: l - i + (r === -1 ? 0 : -1), serv: r };
            }
            return null;
        }

        public Pop(s?: IService) {
            this.HideCurrentService();
            if (s) {
                let t = this.Has(s);
                if (t) {
                    while (t.stack > 0) {
                        this.services.pop();
                        t.stack--;
                    }
                    let l = this.currentStack;
                    while (t.serv > 0) {
                        l.Pop();
                        t.serv--;
                    }
                }
            } else {
                let c = this.CurrentService();
                if (c)
                    if (c.ServiceType === ServiceType.Main)
                        this.services.pop();
                    else this.currentStack.Pop();
            }
            this.ShowCurrentService();
        }

        public Register(service: IService) {
            if (service.Handler && !service.Handled()) {
                service.Handler.addEventListener('pointerenter', (e) => {
                    App.CurrentApp.Foot.Push(service);
                });
                service.Handler.addEventListener('pointerout', (e) => {
                    App.CurrentApp.Foot.Pop(service);
                });
            }
            if (service.Notify)
                service.Notify.On = this.serviceNotified;
        }
        private _services: IService[] = [];

        ////////
    }

    export class Navbar<T extends IItem> extends List {
        private _items: collection.ExList<T, any> = new collection.ExList<T, any>(Object);
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.onClick = this.onClick.bind(this);
            this.applyStyle('nav', 'navbar-nav');
            this._items.Listen = this.oicd;//this.ItemsChanged.bind(this);
            this.ItemsChanged(utils.ListEventArgs.ResetEvent);
        }
        private oicd: basic.IBindable = { Owner: this, Invoke: this.ItemsChanged };
        private ItemsChanged(e: utils.ListEventArgs<number, Page>) {
            if (this.IsInit === false) return;
            let m = this;
            let _items = this._items;
            switch (e.event) {
                case collection.CollectionEvent.Added:
                    m.Add(this.createItem(e.newItem));
                    break;
                case collection.CollectionEvent.Cleared:
                    this.CClear(m);
                    break;
                case collection.CollectionEvent.Removed:
                    for (var i = 0, l = m.Count; i < l; i++) {
                        let c = m.getChild(i) as MenuItem;
                        if (c.Source == e.oldItem) {
                            m.RemoveAt(i + 1, true);
                            break;
                        }
                    }
                    break;
                case collection.CollectionEvent.Replace:
                    for (var i = 0, l = m.Count; i < l; i++) {
                        let c = m.getChild(i) as MenuItem;
                        if (c.Source == e.oldItem) {
                            m.RemoveAt(i + 1, true);
                            break;
                        }
                    }
                    m.Add(new MenuItem(e.newItem));
                    break;
                case collection.CollectionEvent.Reset:
                    this.CClear(m);
                    for (var i = 0, l = _items.Count; i < l; i++) {
                        let c = _items.Get(0);
                        m.Add(new MenuItem(c));
                    }
                    break;
            }

        }
        private createItem(page: Page): MenuItem {
            let x = new MenuItem(page);
            x.OnClick = this.onClick;
            return x;
        }
        public selectable: boolean = true;
        private _selectedItem: MenuItem;
        public get SelectedItem() { return this._selectedItem; }

        private onClick(page: T, sender: MenuItem) {
            if (this._selectedItem != null) {
                var p = this._selectedItem.Presenter;
                p.disapplyStyle('active');
            }
            if (sender != null) {
                var p = sender.Presenter;
                this._selectedItem = sender;
                p.applyStyle('active');
            }
            if (!this.selectable)
                setTimeout((nb: Navbar<T>, si: MenuItem) => si.Presenter.disapplyStyle('active'), 500, this, sender);
            this.OnSelectedItem.Invok(this, (c) => c(page));
        }

        public Float(v: HorizontalAlignement) {
            if (v == HorizontalAlignement.Right) { this.disapplyStyle('pull-left'); this.applyStyle('pull-right'); }
            else if (v == HorizontalAlignement.Left) { this.applyStyle('pull-left'); this.disapplyStyle('pull-right'); }
            else { this.disapplyStyle('pull-left'); this.disapplyStyle('pull-right'); }
        }

        private CClear(m: Navbar<T>) {
            for (var i = 2, l = m.Count; i < l; i++)
                m.RemoveAt(i, true);
        }

        public get Items() {
            return this._items;
        }

        public OnSelectedItem = new bind.EventListener<(item: T) => void>(this);
    }

    export class NavbarHeader extends JControl {
        public set Title(v: string) {
            this._brand.Text = v;
        }
        public get Title(): string {
            return this._brand.Text;
        }

        private _brand: Anchore;
        private _brandContainer: JControl;
        private _toggleButton: GlyphButton;
        public get Brand() { return this._brandContainer; }
        public get ToggleButton() { return this._toggleButton; }


        constructor() {
            super(document.createElement('div'));
        }

        initialize() {
            let v = this.View;
            //v.style.height = '50px';
            this.applyStyle('navbar-header');
            this._brand = new Anchore('QShop', '#');
            this._brandContainer = new Div();
            this._brandContainer.Add(this._brand);
            this._brandContainer.applyStyle('navbar-brand');

            bind.NamedScop.Create('GlobalPatent', {});
            let b = this._toggleButton = new GlyphButton();
            this.Add(this._brandContainer);
            this.Add(this._toggleButton);
        }
        public set IsFixedTop(v: boolean) {
            if (v)
                this.applyStyle('navbar-fixed-top');
            else this.View.classList.remove('navbar-fixed-top');
        }
        public set IsHeader(v: boolean) {
            if (v)
                this.applyStyle('navbar-header');
            else this.View.classList.remove('navbar-header');
        }
    }

    export interface IItem {
        Tag: any;
        Content: string | HTMLElement | JControl;
        Url: string;
        OnItemSelected(menuItem: MenuItem);
    }

    export class MenuItem extends Anchore implements EventListenerObject, basic.IDisposable {
        constructor(public Source: IItem) {
            super(Source.Content, Source.Url);
            this.View.addEventListener('click', this);
        }

        propChanged(p: bind.PropBinding, e: bind.EventArgs<string, Page>) {
            if (e.prop == Page.DPTitle)
                this.Text = e._new;
            else if (e.prop == Page.DPUrl)
                this.Href = e._new;
        }

        public handleEvent(e: Event) {
            if (this.OnClick) this.OnClick(this.Source, this);
            this.Source.OnItemSelected(this);
        }
        public OnClick: (page: IItem, sender: MenuItem) => void;
        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.View.removeEventListener('click', this);
            this.Source = null;
            this.OnClick = null;
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }
    }

    @attributes.ContentProperty("Content")
    export class ContentControl extends JControl implements IContentControl {
        constructor(dom?: HTMLElement) {
            super(dom || document.createElement('div'));
        }
        initialize() { }
        private _content: JControl;
        public get Content() { return this._content; }
        public set Content(v: JControl) {
            if (this._content == v) return;
            if (this._content)
                this.Remove(this._content);
            this._content = v;
            if (v)
                this.Add(v);
        }
        OnKeyDown(e) {
            return this._content && this._content.OnKeyDown(e);
        }
        OnContextMenu(e) {
            return this._content && this._content.OnContextMenu(e);
        }
    }

    export enum ButtonStyle {
        Default,
        Primary,
        success,
        Info,
        Warning,
        Danger,
        Link,
        Block
    }

    export class Input extends JControl {
        Disable(disable: any) {
            var c = $('input', this._view) as HTMLInputElement[];
            for (var i = 0; i < c.length; i++) {
                c[i].disabled = disable;
            }
        }
        constructor(dom?) { super(dom || document.createElement('input')); }
        initialize() {
            this.applyStyle('input', 'form-control');
            if (this._view instanceof HTMLInputElement) {
                (this._view as HTMLInputElement).addEventListener('focusout', this);
                (this._view as HTMLInputElement).addEventListener('focusin', this);
            }
        }
        public set Placeholder(v: string) { (this.View as HTMLInputElement).placeholder = v; }
        public set Text(v: string) { (this.View as HTMLInputElement).value = v; }
        public get Text(): string { return (this.View as HTMLInputElement).value; }
        Blur() {
            this._view && this._view.blur();
        }
        handleEvent(e: FocusEvent) {
            if (e.type === 'focusout')
                this.OnFocusOut(e);
            else if (e.type === 'focusin')
                this.OnFocusIn(e);
        }
        OnFocusIn(e: FocusEvent) {
            UI.Desktop.Current.GetKeyControl(this, this.OnKeyPressed, []);
        }
        OnKeyPressed(e: KeyboardEvent): KeyboardControllerResult {
            if (e.keyCode == 27 || e.keyCode == 13)
                this.Blur();
            return KeyboardControllerResult.Handled;
        }
        OnFocusOut(e: FocusEvent) {
            UI.Desktop.Current.ReleaseKeyControl();
        }
    }
    export enum SearchActionMode {
        None,
        Validated,
        Instantany,
        NoSearch
    }

    export class ActionText extends JControl {
        private btn_ok: Button;
        private txtInput: Input;
        public get Box() { return this.txtInput; }
        public get Icon() { return this.btn_ok; }
        public OnAction: bind.EventListener<(sender: ActionText, oldText: string, newText: string) => void> = new bind.EventListener<() => void>(this.Id);
        Bur() {
            this.txtInput.Blur();
        }
        constructor(input?: HTMLInputElement) {
            super(document.createElement('div'));
            this.txtInput = new Input(input);
        }
        initialize() {
            this.applyStyle('csTB', 'input-group');

            var btn = new Button().applyStyle('form-control', 'glyphicon', 'glyphicon-search');
            btn.Style = ButtonStyle.Primary;
            btn.Text = '';

            var sp = new Dom('span');
            sp.applyStyle('input-group-btn');

            var inp = this.txtInput;
            inp.ToolTip = 'Entrer you email';
            inp.Placeholder = 'Entrer you email';

            this.Add(inp);
            this.Add(sp);
            sp.Add(btn);
            this.btn_ok = btn;
            this.txtInput = inp;
            this.btnClicked = this.btnClicked.bind(this);
            //this.txtChanged = this.txtChanged.bind(this);
            btn.View.addEventListener('click', this.btnClicked);
        }
        private ia: SearchActionMode = 0;
        public set AutoAction(v: SearchActionMode) {
            if (v == this.ia) return;
            switch (v) {
                case 3:
                case 0:
                    this.txtInput.View.removeEventListener('change', this);
                    this.txtInput.View.removeEventListener('keyup', this);
                    break;
                case 1:
                    this.txtInput.View.addEventListener('change', this);
                    this.txtInput.View.removeEventListener('keyup', this);
                    break;
                case 2:
                    this.txtInput.View.removeEventListener('change', this);
                    this.txtInput.View.addEventListener('keyup', this);
                    break;
            }
            var x =
                (this.txtInput.View[v ? 'addEventListener' : 'removeEventListener'] as any)('change', this);
            this.ia = v;
        }
        public get AutoAction(): SearchActionMode {
            return this.ia;
        }

        btnClicked(ev: Event) {
            var n = this.txtInput.Text;
            var o = this.ls;
            this.ls = n;
            var t = this;
            this.OnAction.Invok(this.Id, function (e) { e(t, o, n); });
        }

        txtChanged(ev: Event) {
            var n = this.txtInput.Text;
            var o = this.ls;
            if (n == o) return;
            this.ls = n;
            var t = this;
            this.OnAction.Invok(this.Id, function (e) { e(t, o, n); });
        }
        handleEvent(e: Event) {
            switch (e.type) {
                case 'click':
                    this.txtChanged(e);
                    break;
                case 'change':
                    if (e.srcElement === this.txtInput.View)
                        return this.txtChanged(e);
                    break;
                case 'keyup':
                    if (e.srcElement === this.txtInput.View) {
                        if (this.isExecuting) return;
                        this.isExecuting = true;
                        //clearTimeout(this.tout);
                        this.tout = setTimeout((t, x) => { this.isExecuting = false; t.txtChanged(e); }, 500, this, e);
                        return;
                        //return this.txtChanged(e);
                    }
                default:
                    super.handleEvent(e);
            }
        }

        private isExecuting: boolean;
        private tout = -1;
        private job = thread.Dispatcher.cretaeJob(this.txtChanged, [null], this, true);
        private ls = "";
        public set Text(v: string) { (this.txtInput.View as HTMLInputElement).value = v; }
        public get Text(): string { return (this.txtInput.View as HTMLInputElement).value; }
        public Focus() {
            this.Box.View.focus();
        }
    }
    export class CItem implements IItem {
        OnPropertyChanged(e: bind.DProperty<string, any>, m: (p: bind.PropBinding, e: bind.EventArgs<string, Page>) => void): void {

        }
        constructor(public Tag, public Content: string | HTMLElement | JControl, public Url: string, private onselect: basic.ITBindable<(menuItem: MenuItem) => void>) {
            this.Content = new Anchore(Content);
        }
        OnItemSelected(menuItem: MenuItem) {
            if (this.onselect) this.onselect.Invoke.call(this.onselect.Owner, menuItem);
        }
    }

    export class QBar<T extends IItem> extends JControl {
        private _header: NavbarHeader;
        private _container: Container;
        private _lefttabs: Navbar<T>;
        private _righttabs: Navbar<T>;
        private _colapsedZone: Dom;
        private bi;
        public set LeftTabs(v: Navbar<T>) {
            if (this._lefttabs) {
                this._colapsedZone.Remove(this._lefttabs, false);
                this._lefttabs.OnSelectedItem.Remove(this);
            }
            if (v) {
                this._colapsedZone.Add(v);
                v.OnSelectedItem.Add((s) => { if (this.OnPageSelected) this.OnPageSelected(s); }, this);
            }
            this._lefttabs = v;
        }
        public set RightTabs(v: Navbar<T>) {
            if (this._righttabs) {
                this._colapsedZone.Remove(this._righttabs, false);
                this._righttabs.OnSelectedItem.Remove(this);
            }
            if (v) {
                this._colapsedZone.Add(v);
                v.OnSelectedItem.Add((s) => { if (this.OnPageSelected) this.OnPageSelected(s) }, this);
                v.Float(HorizontalAlignement.Right);
            }
            this._righttabs = v;
        }
        public get Header(): NavbarHeader { return this._header; }

        constructor(private top: boolean) {
            super(document.createElement('ul'));
            this.OnClick = this.OnClick.bind(this);
        }
        private createItem(page: Page): MenuItem {
            let x = new MenuItem(page);
            x.OnClick = this.OnClick;
            return x;
        }
        initialize() {
            this.bi = true;
            this.applyStyle('navbar', /*'navbar-inverse',*/ this.top ? 'navbar-fixed-top' : 'navbar-fixed-bottom');
            this._header = new NavbarHeader();
            this._container = new Div();
            this._colapsedZone = new Dom('div').applyStyle('collapse', 'navbar-collapse');
            this.Add(this._container.AddRange([this._header, this._colapsedZone]));
            this.bi = false;
            this._header.OnInitialized = (x) => x.ToggleButton.CollapsedZone = this._colapsedZone;

            this._header.ToggleButton.addEventListener('click', (h, e, p) => p.Open(), this);
        }
        public Open(on?: boolean) {
            var v = this._colapsedZone.View.classList;
            v[(on == undefined ? v.contains('in') : !on) ? 'remove' : 'add']('in');
        }

        public OnPageSelected: (page: T) => void;
        public OnClick(page: T) {
            if (this.OnPageSelected) this.OnPageSelected(page);
        }
        public Add(child: JControl) {
            if (this.bi) super.Add(child);
            else
                this._colapsedZone.Add(child);
            return this;
        }
        public Remove(child: JControl) {
            return this._colapsedZone.Remove(child);
        }
    }
    export class Head<T extends IItem> extends JControl {
        private _container: Container;
        private _header: NavbarHeader;
        private _tabs: Navbar<T>;
        private _stabs: Navbar<T>;
        public get Menu() { return this._tabs; }
        public get SubsMenu() { return this._tabs; }

        private _colapsedZone: Dom;
        public get Header(): NavbarHeader {
            return this._header;
        }
        public get Container() {
            return this._container;
        }
        constructor(private top: boolean) {
            super(document.createElement('ul'));
            this.OnClick = this.OnClick.bind(this);
        }
        private createItem(page: Page): MenuItem {
            let x = new MenuItem(page);
            x.OnClick = this.OnClick;
            return x;
        }
        static __fields__() { return [this.DPSelectedItem] as any; }
        public Clear() {
            this._tabs.Clear();
            this._stabs.Clear();
        }
        private CClear(m: Navbar<T>) {
            for (var i = 2, l = m.Count; i < l; i++)
                m.RemoveAt(i, true);
        }

        initialize() {
            this._header = new NavbarHeader();
            this._container = new Div();
            this._colapsedZone = new Dom('div').applyStyle('collapse', 'navbar-collapse');
            this._tabs = new Navbar<T>();
            this._stabs = new Navbar<T>();
            this._stabs.Float(HorizontalAlignement.Right);

            this._stabs.OnSelectedItem.Add((s) => this.SelectedItem = s, this);
            this._tabs.OnSelectedItem.Add((s) => this.SelectedItem = s, this);
            this.Add(this._container.AddRange([this._header, this._colapsedZone.AddRange([this._tabs])]));

            this._header.OnInitialized = (x) => x.ToggleButton.CollapsedZone = this._colapsedZone;

            this._header.ToggleButton.addEventListener('click', (h, e, p) => {
                var v = p._colapsedZone.View.classList;
                v[v.contains('in') ? 'remove' : 'add']('in');
            }, this);
        }
        public OnClick(item: T) {
            this.SelectedItem = item;
        }

        public static DPSelectedItem = bind.DObject.CreateField<IItem, Head<IItem>>("SelectedItem", Object);
        public SelectedItem: T;
    }

    export class Foot extends JControl {
        constructor() {
            super(document.createElement('div'));
        }
        initialize() {
            this.applyStyle('navbar', 'navbar-fixed-bottom');
            this.View.style.width = '100%';
        }
        Check(c: JControl) { return c instanceof JControl; }
    }

    export enum Keys {
        Enter = 13,
        Tab = 9,
        Esc = 27,
        Escape = 27,
        Up = 38,
        Down = 40,
        Left = 37,
        Right = 39,
        PgDown = 34,
        PageDown = 34,
        PgUp = 33,
        PageUp = 33,
        End = 35,
        Home = 36,
        Insert = 45,
        Delete = 46,
        Backspace = 8,
        Space = 32,
        Meta = 91,
        Win = 91,
        Mac = 91,
        Multiply = 106,
        Add = 107,
        Subtract = 109,
        Decimal = 110,
        Divide = 111,
        Scrollock = 145,
        Pausebreak = 19,
        Numlock = 144,
        "5numlocked" = 12,
        Shift = 16,
        Capslock = 20,
        F1 = 112, F2 = 113, F3 = 114, F4 = 115, F5 = 116, F6 = 117, F7 = 118, F8 = 119, F9 = 120, F10 = 121, F11 = 122, F12 = 123,

        AltLeft = 18,
        AltRight = 18,

        ShiftLeft = 18,
        ShiftRight = 18,

        ControlLeft = 17,
        ControlRight = 17,

        MetaLeft = 91,
        MetaRight = 91,
    }

    export enum Controlkeys {
        Alt = 18,
        Shift = 16,
        Control = 17,
        Meta = 91
    }

    export class HotKey {
        private _key: Keys;
        private __ctrl: Controlkeys;
        public get Key(): Keys { return this._key; }
        public get Control(): Controlkeys { return this.__ctrl; };

        public set Key(v: Keys) { if (Keys[v] === undefined) throw "controls key is uncorrect"; this._key = v; }
        public set Control(v: Controlkeys) { if (Controlkeys[v] === undefined) throw "controls key is uncorrect"; this.__ctrl = v; };


        public IsPressed(e: KeyboardEvent) {
            return this.checkKey(e) && this.checkControl(e);
        }
        private checkKey(e: KeyboardEvent) {
            var l = this.Key;
            if (l == null) return true;
            return e.keyCode == l;
        }
        private checkControl(e: KeyboardEvent) {
            switch (this.Control) {
                case 18:
                    return e.altKey;
                case 16:
                    return e.shiftKey;

                case 17:
                    return e.ctrlKey;

                case 91:
                    return e.metaKey;
            }
            return true;
        }
    }

    export class Page extends Control<JControl> implements defs.$UI.IPage, basic.IDisposable, IService, IItem {
        Tag;
        Callback(args: any) {
        }
        _fl = true;
        public get FloatLeft(): boolean { return this._fl; }
        public set FloatLeft(v: boolean) { this._fl = v; }

        public static DPTitle = Page.CreateField<string | HTMLElement | JControl, Page>('Title', Object, 'Page', (e) => { var t = e.__this; });

        getDPTitle() { return Page.DPTitle; }
        getDPUrl() { return Page.DPUrl; }

        public get Content() { return this.get(Page.DPTitle); }
        public set Content(v: string | HTMLElement | JControl) { this.set(Page.DPTitle, v); }

        public ServiceType: ServiceType = ServiceType.Main;
        public Notify: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void> = new bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>(this);

        public static DPUrl = Page.CreateField('Url', String, '#');
        public get Url() { return this.get(Page.DPUrl); }
        public set Url(v: string) { this.set(Page.DPUrl, v); }

        public static __fields__() { return [Page.DPTitle, Page.DPUrl]; }

        public HasSearch: UI.SearchActionMode;

        public getSuggessions() { return Empty; }

        public OnSearche(oldPatent: string, newPatent: string) {
        }

        initialize() {
        }

        Update() {
        }

        private get intern(): boolean { return !false };

        Check(c: Page) {
            return this.intern && c instanceof JControl;
        }

        constructor(protected app: App, title: string | HTMLElement | JControl, public Name: string) {
            super(document.createElement('div'));
            this.Content = title;
        }

        Dispose() {
            this.Parent.Remove(this);
            bind.DObject.prototype.Dispose.call(this);
        }

        GetLeftBar(): JControl | QBar<any> {
            return null;
        }

        GetRightBar() { return null; }

        OnItemSelected(menuItem: MenuItem) {
            this.OnSelected.Invok(this, (p) => p(this));
        }

        public _onSelected: bind.EventListener<(p: this) => void> = new bind.EventListener<(p: Page) => void>(this, false);

        public get OnSelected() { return this._onSelected; }

        public ContextMenu: ContextMenu;

        Handled() {
            return true;
        }
        public OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget) {
            var s = this.Content;
            if (s instanceof JControl) return s.OnKeyCombined(e, v);
        }
        OnKeyDown(e: KeyboardEvent) {
            if (this.Content instanceof JControl)
                return this.Content.OnKeyDown(e);
        }
        OnPrint(): any {
        }
        public OnDeepSearche() {

        }
        OnContextMenu(e: MouseEvent) {
            if (this.Content instanceof JControl)
                if (this.Content.OnContextMenu(e)) return true;
            if (this.ContextMenu)
                this.ContextMenu.Show(e.pageX, e.pageY);
            else return;
            return true;
        }
    }
    export class BarStack {
        private _current: IService;
        private others: IService[] = [];
        constructor(current: IService) {
            this._current = current;
        }
        public get Current() {
            if (this.others.length == 0) return this._current;
            return this.others[this.others.length - 1];
        }
        public Push(s: IService) {
            this.others.push(s);
        }
        public Pop() {
            return this.others.pop();
        }
        public Has(s: IService) {
            let c = this.others, l = c.length;
            if (this._current == s) return -1;
            for (var i = l - 1; i >= 0; i--) {
                let x = c[i];
                if (x == s) return l - i;
            }
            return 0;
        }
        public Exit() { this.others.length = 0; }
    }

    export enum HorizontalAlignement { Left, Center, Right }
    export enum VerticalAlignement { Top, Center, Bottom }

    export class Point {
        constructor(public x: number, public y: number) {
        }
    }
    var ms = ['px', '%', 'in', 'em'];
    export enum MetricType {
        Pixel, Percentage, Inch, Em
    }
    export class Metric {
        public Value: number;
        public Type: MetricType
        constructor(value: number | string, type?: MetricType) {
            if (typeof value === 'string') {
                this.fromString(value);
            } else {
                this.Value = value;
                this.Type = type;
            }
        }
        minus(v): Metric {
            if (this.Type == MetricType.Pixel) return new Metric(this.Value - v, MetricType.Pixel);
            if (this.Type == MetricType.Percentage) return new Metric(this.Value - v, MetricType.Percentage);
            if (this.Type == MetricType.Em) return new Metric(this.Value - v, MetricType.Em);
            if (this.Type == MetricType.Inch) return new Metric(this.Value - v, MetricType.Inch);
        }
        toString() { return this.Value + ms[this.Type || 0]; }
        fromString(s: string) {
            for (var i = 0; i < ms.length; i++)
                if ((<any>s).endsWith(ms[i])) {
                    this.Value = parseFloat(s);
                    this.Type = <any>i;
                    return;
                }
        }
    }

    export class Error extends JControl {
        public IsInfo: boolean;
        private container: HTMLDivElement;
        private _text: string;
        public set Message(v: string) {
            this._text = v;
            if (this.container) this.container.textContent = v;
        }
        public Expire: number;
        public get Message() { return this._text; }
        constructor() {
            super(document.createElement('div'));
        }
        initialize() {
            this.applyStyle(this.IsInfo ? 'webix_info' : 'webix_error');
            this.container = document.createElement('div');
            this.container.innerHTML = this._text;
            this._view.appendChild(this.container);
            this._view.addEventListener('mousedown', this);
        }
        handleEvent(e) {
            if (e.type == 'mousedown') {
                this._view.removeEventListener('mousedown', this);
                this.Pop();
            } else super.handleEvent(e);
        }
        public Push() {
            InfoArea.Default.Add(this);
            this.timeout = setTimeout((t: this) => { t.Pop(); }, this.Expire || 3000, this);
        }
        private timeout;
        public Pop() {
            this.applyStyle('ihidden');
            var x: any = {};
            clearTimeout(this.timeout);
            x.id = setTimeout((t: this, x) => { clearTimeout(x.id); InfoArea.Default.Remove(t); t.Dispose(); }, 2000, this, x);
        }
        Dispose() {
            this.container = null;
            this._text = null;
            super.Dispose();
        }
    }
    var ia: InfoArea;
    export class InfoArea extends Control<JControl> {
        public static get Default(): InfoArea {
            if (!ia) {
                ia = new InfoArea();
                ia.Parent = Desktop.Current;
            }
            return ia;
        }
        constructor() {
            super(document.createElement('div'));
            this.initialize();
        }
        initialize() {
            this.applyStyle('webix_message_area');
            document.body.appendChild(this._view);
        }
        Check(j: JControl) {
            return j instanceof Error;
        }
        public static push(msg: string, isInfo?: boolean, expire?: number) {
            var t = new Error();
            t.Message = msg;
            t.IsInfo = isInfo;
            t.Expire = expire;
            t.Push();
        }
    }

    export class Size {
        public w: Metric;
        public h: Metric;
        constructor(w: Metric | string | number, h: Metric | number | string) {
            if (typeof w === 'number' || typeof w === 'string') this.w = new Metric(w, 0);
            else this.w = w;
            if (typeof h === 'number' || typeof h === 'string') this.h = new Metric(h, 0);
            else this.h = h;
        }
    }
    export class Badge extends JControl {
        constructor() {
            super(document.createElement('span'));
        }
        initialize() {
            this.applyStyle('badge');
        }
        public set Content(v: any) {
            this.Clear();
            if (v instanceof HTMLElement)
                this.Add(new DivControl(v));
            else this.View.innerText = v.toString();
        }
    }
    export class DragManager {
        private View: HTMLElement;
        private loc: Point = new Point(0, 0);
        constructor(private handler: JControl, private target: JControl) {
            handler.View.addEventListener('dragstart', this);
            this.handler.View.draggable = true;
            this.View = target.View;
        }
        private mouseloc = { x: undefined, y: undefined };
        private cntloc = { x: this.loc.x, y: this.loc.y };

        handleEvent(e: DragEvent) {
            if (e.type == 'dragstart') {
                this.mouseloc = { x: e.x, y: e.y };
                this.cntloc = { x: this.target.View.offsetLeft, y: this.target.View.offsetTop };
                this.handler.View.addEventListener('dragend', this);
            }
            else if (e.type == 'dragend') {
                var c = this.cntloc;
                var m = this.mouseloc;
                this.Location = { x: c.x + (e.x - m.x), y: Math.max(0, c.y + (e.y - m.y)) };
                this.handler.View.removeEventListener('dragend', this);
            }
            if (e.type === 'resize')
                thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
        }
        public set Location(l: Point) {
            this.loc = l;
            this.RelocationJob[0] = true;
            this.RelocationJob[1] = true;
            thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
        }
        private RelocationJob = thread.Dispatcher.cretaeJob(this.reLocation, [], this, true);
        reLocation(hr: boolean, vr: boolean) {
            var v = this.View;
            var s = v.style;
            var l = this.loc;
            var w = window;
            if (hr) {
                s.left = l.x + px;
            }
            if (vr) {
                s.top = l.y + px;
            }
        }
    }
    export class FixedPanel extends JControl {
        private ha: HorizontalAlignement;
        private va: VerticalAlignement;
        private loc: Point = new Point(0, 0);
        private body: JControl;

        private size: Size = new Size(window.screen.availWidth / 2, window.screen.availHeight / 2);
        constructor(view?: HTMLElement) {
            super(view || document.createElement('div'));
        }

        initialize() {
            window.addEventListener('resize', this);
            this.body = new Dom('div');

            var v = this.View.style;
            //v.zIndex = "2000";
            v.display = 'block';
            v.background = 'radial-gradient( #222,black)';
            v.position = 'fixed';
            v.border = '2px gray solid';
            this.HorizontalAlignement = HorizontalAlignement.Center;
            this.VerticalAlignement = VerticalAlignement.Center;

            this.Location = { x: 200, y: 200 };
            this.Size = new Size(new Metric(90, MetricType.Percentage), new Metric(90, MetricType.Percentage));

            this.body.OnInitialized = (b) => {
                var tt = this.Height;
                this.Height = new Metric(89, MetricType.Percentage);
            }
            this.body.View.style.marginTop = '50px';
            this.body.View.style.overflow = 'auto';

            super.Add(this.body);
        }
        Check(i) {
            return i instanceof JControl;
        }
        private mouseloc = { x: undefined, y: undefined };
        private cntloc = { x: this.loc.x, y: this.loc.y };

        handleEvent(e: DragEvent) {

            if (e.type == 'dragstart') {
                this.mouseloc = { x: e.x, y: e.y };
                this.cntloc = { x: this.View.offsetLeft, y: this.View.offsetTop };
                window.document.styleSheets.item(0)
            }
            else if (e.type == 'dragend') {
                var c = this.cntloc;
                var m = this.mouseloc;
                this.Location = { x: c.x + (e.x - m.x), y: c.y + (e.y - m.y) };
            }
            if (e.type === 'resize')
                thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
        }
        private static resizeBody = thread.Dispatcher.cretaeJob((t: FixedPanel) => {
            t.body.View.style.height = t.View.clientHeight + 'px';
            t.body.View.style.width = t.View.clientWidth + 'px';
        }, [], null, false);
        public set Height(v: Metric) {
            var h = v.toString();
            this.View.style.maxHeight = h;
            this.View.style.minHeight = h;
            thread.Dispatcher.Push(this.RelocationJob.Set(undefined, true));
            thread.Dispatcher.Push(FixedPanel.resizeBody, [this]);
        }
        public set Width(v: Metric) {
            var w = v.toString();
            this.View.style.maxWidth = w;
            this.View.style.minWidth = w;
            this.body.View.style.width = v.minus(5).toString();
            thread.Dispatcher.Push(this.RelocationJob.Set(true, undefined));
            thread.Dispatcher.Push(FixedPanel.resizeBody, [this]);
        }
        public set HorizontalAlignement(ha: HorizontalAlignement) {
            this.ha = ha || 0;
            thread.Dispatcher.Push(this.RelocationJob.Set(true, undefined));
        }
        public set VerticalAlignement(va: VerticalAlignement) {
            this.va = va || 0;
            thread.Dispatcher.Push(this.RelocationJob.Set(undefined, true));
        }
        public set Location(l: Point) {
            this.loc = l;
            thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
        }
        public set Size(s: Size) {
            this.size = s;
            this.Width = s.w;
            this.Height = s.h;
            thread.Dispatcher.Push(this.RelocationJob.Set(true, true));
            thread.Dispatcher.Push(FixedPanel.resizeBody, [this]);
        }
        private RelocationJob = thread.Dispatcher.cretaeJob(this.reLocation, [], this, true);
        private reLocation(hr: boolean, vr: boolean) {
            var v = this.View;
            var s = v.style;
            var l = this.loc;
            var w = window;
            const px = 'px';
            if (hr) {
                switch (this.ha) {

                    case HorizontalAlignement.Left:
                        s.left = l.x + px;
                        break;

                    case HorizontalAlignement.Center:
                        s.left = (w.innerWidth - this.View.clientWidth) / 2 + px;
                        break;

                    case HorizontalAlignement.Right:
                        s.left = (w.innerWidth - this.View.clientWidth - l.x) + px;
                        break;
                }
            }
            if (vr) {
                switch (this.va) {
                    case VerticalAlignement.Top:
                        s.top = l.y + px;
                        break;

                    case VerticalAlignement.Center:
                        s.top = (w.innerHeight - this.View.clientHeight) / 2 + px;
                        break;

                    case VerticalAlignement.Bottom:
                        s.top = (w.innerHeight - this.View.clientHeight - l.y) + px;
                        break;
                }
            }
        }
        Add(child: JControl) {
            this.body.Add(child);
            return this;
        }
        AddRange(childs: JControl[]) {
            for (var i = 0, l = childs.length; i < l; i++)
                this.body.Add(childs[i]);
            return this;
        }
    }

    let intern = false;
    let _app: defs.$UI.IApp = null;
    var Empty = new collection.List<any>(String);
    Empty.Freeze();
    export abstract class Layout<T extends defs.$UI.IPage> extends Control<T> implements defs.$UI.IApp {
        get IsAuthentication(): boolean { return false; }
        protected OnPageChanging(e: bind.EventArgs<T, this>) { }
        protected OnPageChanged(e: bind.EventArgs<T, this>) {
            var page = e._new;
            this.silentSelectPage(e._old, page);
            page && page.OnSelected.Invoke(page, [page]);
        }

        public static DPSelectedPage = bind.DObject.CreateField<defs.$UI.IPage, Layout<any>>("SelectedPage", Object, null, (e) => e.__this.OnPageChanged(e), e => e.__this.OnPageChanging(e));

        public static DPCurrentModal: bind.DProperty<Modal, Layout<any>>;
        public CurrentModal: Modal;

        public SelectedPage: T;
        static __fields__() { return [this.DPSelectedPage, this.DPCurrentModal = bind.DObject.CreateField<Modal, Layout<any>>("CurrentModal", Modal, null, this.prototype._onCurrentModalChanged)]; }

        public Name: string;
        public abstract Foot: ServiceNavBar<IItem>;
        public abstract SearchBox: ActionText;
        public Pages: collection.List<T> = new collection.List<T>(Object);
        protected abstract showPage(page: T);
        Logout() {

        }
        constructor(view) {
            super(view)
            this.PagesChanged = this.PagesChanged.bind(this);
        }
        //**************************************************************************************************************************************
        //***** ************************************************************  Pages  **********************************************************
        //**************************************************************************************************************************************
        //protected cpage: Page;

        protected silentSelectPage(oldPage: T, page: T) {
            this.Foot.Pop(oldPage);
            this.showPage(page);
            this.Foot.Push(page);
        }
        //public OnPageSelected = new bind.EventListener<(s: this, p: Page) => void>('');
        public Open(page: T) {
            this.SelectedPage = page;
        }
        private PagesChanged(e: utils.ListEventArgs<number, T>) {
            if (e.event == collection.CollectionEvent.Added) {
                this.Foot.Register(e.newItem);
            }
        }

        public OpenPage(pageNme: string) {
            var ps = this.Pages.AsList();
            for (var i = 0, l = ps.length; i < l; i++) {
                var p = ps[i];
                if (p.Name !== pageNme) continue;
                this.SelectedPage = p;
                return true;
            }
            return false;
        }

        public AddPage(child: T) {
            if (child == null) return;
            this.Pages.Add(child);
        }

        public SelectNaxtPage() {
            var t = this.Pages;
            var i = t.IndexOf(this.SelectedPage);
            var p = t.Get(i + 1);
            if (p)
                this.SelectedPage = p;
        }

        public SelectPrevPage() {
            var t = this.Pages;
            var i = t.IndexOf(this.SelectedPage);
            var p = t.Get(i - 1);
            if (p)
                this.SelectedPage = p;
        }

        private opcd: basic.IBindable = { Owner: this, Invoke: this.PagesChanged };

        public Update() {
            var s = this.SelectedPage;
            if (s) s.Update();
        }
        public OnKeyDown(e: KeyboardEvent) {
            var s = this.SelectedPage;
            if (s) s.OnKeyDown(e);
        }
        public OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget) {
            var s = this.SelectedPage;
            if (s) return s.OnKeyCombined(e, v);
        }
        OnPrint(): any {
            var s = this.SelectedPage;
            if (s) s.OnPrint();
        }
        public OnDeepSearche() {
            var s = this.SelectedPage;
            if (s) s.OnDeepSearche();
        }

        public OnContextMenu(e: MouseEvent) {
            var cp = this.SelectedPage;
            if (cp)
                cp.OnContextMenu(e);
        }
        handleEvent(e: KeyboardEvent) { }
        public Show() {
            if (_app != null)
                document.body.removeChild(_app.View);
            _app = this;
            Desktop.Current.Show(this);
        }

        initialize() {
            this.Pages.Listen = this.opcd;
        }
        protected static getView() {
            let app = document.createElement('app');
            app.id = 'app-' + Date.now();
            return app;
        }
        protected searchActioned(s: ActionText, o: string, n: string) {
            this.SelectedPage.OnSearche(o, n);
        }
        OnAttached() {
        }
        OnDetached() { }

        OpenModal(m: Modal) {
            this.CurrentModal = m;
        }
        CloseModal(m: Modal) {
            var im = this.openedModal.indexOf(m);
            if (im != -1) this.openedModal.splice(im, 1);
            this.CurrentModal = this.openedModal[this.openedModal.length - 1];
        }
        _onCurrentModalChanged(e: bind.EventArgs<Modal, Layout<any>>): any {
            var m = e._old;
            if (m) {
                m.disapplyStyle('in');
                if (m.View.parentNode)
                    helper.TryCatch(m.View, Element.prototype.remove);
                m.Parent = null;
                m.Visible = false;
            }
            m = e._new;
            if (m) {
                if (this.openedModal.indexOf(m) == -1)
                    this.openedModal.push(m);
                if (m.View.parentNode)
                    helper.TryCatch(m.View, Element.prototype.remove);
                this._view.appendChild(m.View);
                m.applyStyle('in');
                this.applyStyle('modal-open');
                m.View.style.display = 'block';
                m.View.style.zIndex = this.zIndex++ + "";
                m.Visible = true;
                m.Parent = this;

            } else this.disapplyStyle('modal-open');
        }
        private openedModal: Modal[] = [];
        private zIndex = 1000;

        public OpenContextMenu<T>(cm: IContextMenu<T>, e: IContextMenuEventArgs<T>): boolean {
            if (!this._contextMenuLayer) {
                this._contextMenuLayer = new UI.ContentControl().applyStyle('context-menu-layer');
                this._contextMenuLayer.Parent = this;
                this._contextMenuLayer.addEventListener('click', (s, e: MouseEvent, p) => {
                    var src = e.target || e.srcElement;
                    if (src === this._contextMenuLayer.View) {
                        this.CloseContextMenu<any>(void 0);
                    }
                }, void 0, this);
                this._view.appendChild(this._contextMenuLayer.View);
            } else if (this._currentContextMenu && !this.CloseContextMenu<any>())
                return false;
            this._contextMenuLayer.disapplyStyle('hidden');
            this._contextMenuLayer.View.style.zIndex = "" + (++this._contextMenuZIndex);
            this._contextMenuLayer.Content = cm.getView();
            this._currentContextMenu = cm;
            this._currentContextMenuEventArgs = e;
            cm.OnAttached(e);
        }
        public CloseContextMenu<T>(r?: T) {
            if (this._currentContextMenuEventArgs) {
                this._currentContextMenuEventArgs.cancel = false;
                if (this._currentContextMenu && this._currentContextMenu.OnClosed(r, this._currentContextMenuEventArgs)) return false;
            }
            this._contextMenuLayer.Content = void 0;
            this._currentContextMenu = void 0;
            this._currentContextMenuEventArgs = void 0;
            this._contextMenuLayer.applyStyle('hidden');
            return true;
        }
        private _contextMenuLayer: UI.ContentControl = void 0;
        private _currentContextMenu: IContextMenu<any> = void 0;
        private _currentContextMenuEventArgs: IContextMenuEventArgs<any> = void 0;
        private _contextMenuZIndex = 1000000;
    }

    export class App extends Layout<Page>{
        public static DPTitle = App.CreateField<String, App>('Title', String, 'App');
        public get Title() { return this.get(App.DPTitle); }
        public set Title(v: String) { this.set(App.DPTitle, v); }
        public static DPBadge = App.CreateField<String, App>('Badge', String, null);
        public get Badge() { return this.get(App.DPBadge); }
        public set Badge(v: String) {
            this.set(App.DPBadge, v);
        }
        private static Apps: collection.List<App> = new collection.List<App>(App);
        public static get CurrentApp(): defs.$UI.IApp { return _app; }
        public get Name(): string { return this.name; }
        public Head: Head<Page>;
        private AppBody: DivControl;
        public Foot: ServiceNavBar<IItem>;

        public PageBody: ContentControl;
        private AppTitle: ContentControl;
        private _search: ActionText;
        public slogant: Dom;
        public get SearchBox(): ActionText {
            if (!this._search) {
                this._search = new ActionText();
                this._search.OnInitialized = n => {
                    n.Box.applyStyle("inputPage");
                    n.applyStyle("actionPage");
                    n.Box.View.style.borderWidth = '0';
                    n.Box.View.style.boxShadow = '0 0 transparent';
                    n.OnAction.Add(this.searchActioned.bind(this), 'ts');
                    n.AutoAction = UI.SearchActionMode.Instantany;
                    n.addEventListener('focusout', (s, e, p) => {

                        var cp = p._this.SelectedPage;
                        var hs = cp && cp.HasSearch;
                        if (hs == UI.SearchActionMode.Instantany)
                            p.wrapper.Content = p._this.slogant;
                    }, { _this: this, wrapper: this.AppTitle });
                }
            }
            return this._search;
        }

        createTitle(t: string) {
            var div = new ContentControl();
            div.applyStyle('page_title');
            var c = new Dom('div');
            div.Content = c;
            div.addEventListener('click', (s, e, p) => {
                var cp = this.SelectedPage;
                var hs = cp && cp.HasSearch;
                if (hs !== SearchActionMode.None && hs != null) {
                    var isLabel = p.wrapper.Content == p._this.slogant;
                    if (isLabel) {
                        p.wrapper.Content = p._this.SearchBox;
                        p._this.SearchBox.Focus();
                    }
                    else
                        p.wrapper.Content = p._this.slogant;
                }
                else {
                    if (!isLabel)
                        p.wrapper.Content = p._this.slogant;
                }
            }, { _this: this, wrapper: div });
            c.View.textContent = t;
            this.slogant = c;
            return div;
        }

        constructor(private name: string) {
            super(App.getView());
        }

        protected showPage(page: Page) {
            this.PageBody.Content = page;
        }
        protected OnPageChanged(e: bind.EventArgs<Page, this>) {
            document.title = this.Title as any + "(Version D'Essaie)";
            this.slogant.View.textContent = e._new.GetValue(e._new.getDPTitle()) as string;
            super.OnPageChanged(e as any);
        }
        initialize() {
            super.initialize();
            this.applyStyle('app');

            this.Head = new Head<Page>(true).applyStyle('top-navbar');
            this.AppBody = new DivControl('div').applyStyle('app-body');
            this.Foot = new ServiceNavBar<IItem>(this, false).applyStyle('bottom-navbar');

            this.AppTitle = this.createTitle(this.Title as any).applyStyle('app-title');
            this.PageBody = new ContentControl().applyStyle('app-page');

            this.AppBody.Add(this.AppTitle).Add(this.PageBody);

            intern = true;
            this.Add(this.Head).Add(this.AppBody).Add(this.Foot);
            intern = false;

            this.Foot.applyStyle('appFoot', 'app-foot');
            this.PageBody.disapplyStyle('container');

            this.Head.OnInitialized = (h) => h.Header.OnInitialized = (h) => h.Title = this.Name;
            this.Head.Menu.Items.Source = this.Pages;
            this.Head.OnPropertyChanged(Head.DPSelectedItem, (v, e) => { this.SelectedPage = (e._new || e._old) as Page; });
            if (basic.Settings.get("AppTitleHidden") == true)
                this.AppTitle.applyStyle('hideTitle');
            else this.AppTitle.disapplyStyle('hideTitle');

            init.loadCss();
            window['App'] = this;
        }
        public IsTopNavBarhidden() {
            var t = new URL(context.GetPath('../assets/style/bundle.css')).href;
            for (var i in document.styleSheets) {
                var s = document.styleSheets[i] as CSSStyleSheet;
                if (s.href && s.href === t) {
                    var last: CSSStyleRule;
                    for (var k = 0; k < s.cssRules.length; k++) {
                        var r = s.cssRules[k] as CSSStyleRule;
                        if (r.selectorText === ".app" && r.style.getPropertyValue("--top-navbar-height")) {
                            last = r;
                        }
                    }
                    if (last)
                        return parseInt(last.style.getPropertyValue("--top-navbar-height")) < 5;
                }
            }
            return void 0;
        }
        public HideTopNavBar(v: boolean) {
            var t = new URL(context.GetPath('../assets/style/bundle.css')).href;
            for (var i in document.styleSheets) {
                var s = document.styleSheets[i] as CSSStyleSheet;
                if (s.href && s.href === t) {
                    var last: CSSStyleRule;
                    for (var k = 0; k < s.cssRules.length; k++) {
                        var r = s.cssRules[k] as CSSStyleRule;
                        if (r.selectorText === ".app" && r.style.getPropertyValue("--top-navbar-height")) {
                            last = r;
                        }
                    }
                    if (last) {
                        if (v) {
                            last.style.setProperty("--top-navbar-height", "0px");
                            this.Head.Visible = false;
                        } else {
                            last.style.setProperty("--top-navbar-height", "50px");
                            this.Head.Visible = true;
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        public ToggleTitle() {
            if (this.AppTitle.View.classList.contains('hideTitle')) {
                basic.Settings.set("AppTitleHidden", false);
                this.AppTitle.disapplyStyle('hideTitle');
            }
            else {
                basic.Settings.set("AppTitleHidden", true);
                this.AppTitle.applyStyle('hideTitle');
            }

        }
        public IsTitleBringged() { return this.AppTitle.View.classList.contains('hideTitle'); }

        private intern: boolean = true;
        Check(page: any) {
            return ((page instanceof JControl) || (page instanceof QBar) || (page instanceof Head) || (page instanceof Foot) || (page instanceof ContentControl));
        }
        public Add(child: Page | Head<IItem> | Foot | QBar<IItem> | ContentControl | ServiceNavBar<IItem>) {
            if (child instanceof Page)
                this.AddPage(child);
            else JControl.prototype.Add.call(this, child);
            return this;
        }
        static __fields__() { return [this.DPTitle, this.DPBadge] as any; }
    }

    export abstract class AuthApp extends App implements defs.$UI.IAuthApp {
        public get IsAuthentication() { return true; }
        constructor(key, b: bind.EventListener<(v: boolean) => void>) {
            super('Authentication');
            if (authApp || !(b instanceof bind.EventListener)) throw '';
            b.On = isLogged.bind(this);
            this.OnStatStatChanged = new bind.EventListener<(auth: this, isLogged: boolean) => void>(key);
        }
        public abstract IsLogged<T>(callback: (v: boolean, param: T) => void, param: T);
        public abstract RedirectApp: defs.$UI.IApp;
        public OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
    }

    export enum NotifyType {
        Focuse = 0,
        UnFocus = 1
    }
    export enum ServiceType {
        Main = 0,
        Stackable = 1,
        Instantany = 3
    }

    export interface IService {
        GetLeftBar(): JControl;
        GetRightBar(): JControl;
        Handler?: EventTarget;
        ServiceType: ServiceType;
        Notify?: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
        Callback(args: any);
        Handled(): boolean;
    }

    var _dsk = new UI.Desktop();

    export class FunctionGroup<T extends Function> extends Function {
        private _: T[] = [];
        private map = {};
        constructor() {
            super();
        }
        public Push(f: T, name?: string) {
            this._.push(f);
            if (name !== undefined) {
                this.map[name] = f;
            }
        }
        public Remove(name: string) {
            var t: T = this.map[name];
            if (t !== undefined) {
                var c = this._.indexOf(t);
                if (c !== -1)
                    this._.splice(c, 1);
                delete this.map[name];
            }
            return t;
        }

        public Create(): Function {
            class FunctionGroup extends Function {
                private static _ = [];
                private static map = {};
                constructor(context: any, args: any[]) {
                    super();
                    for (var i = 0; i < FunctionGroup._.length; i++) {
                        var t = FunctionGroup._[i] as () => void;
                        t.apply(context, args);
                    }
                }
                public static Push<T extends Function>(f: T, name?: string) {
                    this._.push(f);
                    if (name !== undefined) {
                        this.map[name] = f;
                    }
                }
                public static Remove<T extends Function>(name: string) {
                    var t: T = this.map[name];
                    if (t !== undefined) {
                        var c = this._.indexOf(t);
                        if (c !== -1)
                            this._.splice(c, 1);
                        delete this.map[name];
                    }
                    return t;
                }
            }
            return FunctionGroup;
        }
    }


    //var openedModal: Modal[] = [];
    export class Modal extends JControl {
        set Content(v: UI.JControl) {
            this._body.Content = v;
        }
        protected focuser: basic.focuser;
        private _searchBox;
        private abonment: ProxyAutoCompleteBox<any>;
        private getSearchBox(d: collection.List<any>) {
            if (!this._searchBox) {
                var group_cnt: UI.Div = new UI.Div().applyStyle('pull-left', 'flat');
                var btn_filter = new Glyph(Glyphs.filter, false, 'Search');
                var div = group_cnt;
                div.Add(btn_filter);
                div.Add(btn_filter);
                this.abonment = new ProxyAutoCompleteBox(new UI.Input(document.createElement('input')), d);
                this.abonment.Box.Placeholder = 'Search ...';
                div.Add(this.abonment.Box);
                div.Enable = true;
                this._searchBox = div;
                this.abonment.OnValueChanged(this, this.callBack);
                return div;
            }
            this.abonment.DataSource = d;
            return this._searchBox;
        }
        private callBack(b: ProxyAutoCompleteBox<any>, old: any, _new) {
            if (this.onSearch)
                this.onSearch(this, b, old, _new);
        }

        onSearch: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void;
        public OnSearch(i: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void) {
            this.onSearch = i;
        }
        private _container: Dom;
        private _container1: Dom;
        private _fm = false;
        private _head: JControl;
        private _body: ContentControl;
        private _foot: JControl;
        public OkTitle(v: string): this {
            return this.createBtn(MessageResult.ok, v);
        }
        public AbortTitle(v: string) {
            return this.createBtn(MessageResult.abort, v);
        }
        public Canceltitle(v: string): this {
            return this.createBtn(MessageResult.cancel, v);
        }

        public Title(v: string): this {
            this._ts = v;
            if (this._dtitle) this._dtitle.View.innerHTML = v;
            this.asSearch = false;
            return this;
        }
        public Search(d: collection.List<any>) {
            if (this._dtitle) {

                this._dtitle.Clear();
                this._dtitle.View.innerHTML = '';
                this._dtitle.Add(this.getSearchBox(d));
            } else this.getSearchBox(d);
            this.asSearch = true;
        }
        private asSearch: boolean;
        private drgmngr: DragManager;

        public SetDialog(title: string, content: JControl) {
            var t: bind.Scop;
            if (!this.IsInit)
                this.OnInitialized = n => {
                    n._body.Clear();
                    n.Title(title);
                    n._body.Content = content;
                }
            else {
                this._body.Clear();
                this.Title(title);
                this._body.Add(content);
            }
        }
        private static zIndex = 10000;
        public static NextZIndex() { return ++this.zIndex; }
        public get IsOpen() { return document.body.contains(this.View); }
        public Open() {
            Desktop.Current.CurrentApp.OpenModal(this);
            this.OnInitialized = n => {
                var c = document.activeElement as HTMLInputElement;
                c && c.blur && c.blur();
                thread.Dispatcher.call(n.focuser, function (this: basic.focuser) {
                    thread.Dispatcher.OnIdle(this, this.reFocuseOn, true);
                });
            }
        }
        public targetApp: defs.$UI.IApp;
        protected silentClose() {
            (this.targetApp || Desktop.Current.CurrentApp).CloseModal(this);
        }
        public Close(msg: MessageResult) {
            var e = new MessageEventArgs(this, msg, MessageResult[msg]);
            var r = this._onClick.PInvok('test', [e], this);
            if (!e.stayOpen) this.silentClose();
        }
        constructor() {
            super(document.createElement('div'));
        }
        initialize() {
            this.applyStyle('modal', 'fade');
            this.View.setAttribute('role', 'dialog');

            this._container = new Dom('div').applyStyle('modal-dialog');
            this._container1 = new Dom('div').applyStyle('modal-content');

            this._head = new Dom('div').applyStyle('modal-header');
            this._body = new ContentControl().applyStyle('modal-body');
            this._foot = new Dom('div').applyStyle('modal-footer');

            this.createHeader(this._head);
            this.createFoot(this._foot);
            this._container.Add(this._container1.AddRange([this._head, this._body, this._foot]));
            super.Add(this._container);
            this.drgmngr = new DragManager(this._head, this._container1);

            this._container1.View.style.top = 0 + px;
            this.focuser = new basic.focuser(this._view, false);
        }
        
        private lastRect: ClientRect;
        private _dtitle: Dom;
        private _ts: string;
        protected createHeader(head: JControl) {
            var b = new Dom('div')
                .applyStyle('close').setAttribute('data-dismiss', 'modal').setAttribute('aria-label', 'close');
            var sp = new Dom('span').setAttribute('aria-hidden', 'true');
            sp.View.innerHTML = '&times;';
            var h4 = new Dom('h4').applyStyle('modal-title');
            if (this.asSearch) h4.Add(this._searchBox);
            else h4.View.innerHTML = this._ts == null ? 'Dialog' : this._ts;
            head.AddRange([b.Add(sp), h4]);
            b.View.onclick = (e) => this.Close(MessageResult.Exit);
            this._dtitle = h4;
        }
        protected createFoot(foot: JControl) {
            this.createBtn(MessageResult.ok);
            this.createBtn(MessageResult.cancel);
        }
        private events: { event: basic.DomEventHandler<any, any>, btn: Button }[] = [];
        private static casses = ['', 'btn-primary', 'btn-danger', 'btn-warning'];
        private _setText(role: MessageResult, text: string) {
            var b1 = this.events[role];
            b1.btn.Visible = text !== null && text !== "";
            b1.btn.Text = text === undefined ? MessageResult[role].toUpperCase() : text == null ? "" : text;
        }

        public SetVisible(role: MessageResult, visible: boolean) {
            var b1 = this.events[role];
            if (b1)
                b1.btn.Visible = visible;
            else {
                this.OnInitialized = n => {
                    var b1 = this.events[role];
                    if (b1) b1.btn.Visible = visible;
                    else {
                        this.createBtn(role);
                        var b1 = this.events[role];
                        b1.btn.Visible = visible;
                    }
                };
            }
        }

        private createBtn(result: MessageResult, title?: string) {
            var b1 = this.events[result];
            if ((title !== null && title !== "") || b1)
                if (this.IsInit)
                    if (b1)
                        this._setText(result, title);
                    else this._initBtn(title, result);
                else
                    this.OnInitialized = n => n._initBtn(title, result);
            return this;
        }
        private _initBtn(title: string, result: MessageResult) {
            var b1 = this.events[result];
            if (!b1)
                if (title === null || title === "") return;
                else {
                    this.events[result] = b1 = {
                        btn: new Button().applyStyle(Modal.casses[result]),
                        event: null
                    };
                    b1.event = b1.btn.addEventListener('click', this._btnClicked, result, this);
                    this._foot.Add(b1.btn);
                }
            this._setText(result, title);
        }
        private _btnClicked(sender: Button, e: Event, t: MessageResult) {
            return this.Close(t);
        }
        public Add(child: JControl) {
            if (!this._body) this.initialize();
            this._body.Add(child);
            return this;
        }
        public Remove(child: JControl) {
            return this._body.Remove(child);
        }

        public Insert(child: JControl, i: number) {
            this._body.Insert(child, i);
            return this;
        }

        Dispose() {
            this.silentClose();
            super.Dispose();
        }

        private _onClick = new bind.EventListener<(e: MessageEventArgs) => void | void>('test');
        public get OnClosed() { return this._onClick; }
        public OnKeyDown(e: KeyboardEvent) {
            var c = this._body.Content;
            if (c && c['OnKeyDown'] && c['OnKeyDown'](e))
                return true;
            if (e.keyCode == 27)
                this.Close(MessageResult.cancel);
            else if (e.keyCode == 13) {
                var t = this.focuser.focuse(false, e.shiftKey);
                if (t == true) {
                    //if (!false)
                    //{
                    for (var i = 1; i < 4; i++) {
                        let x = this.events[i];
                        if (x && x.btn.View === document.activeElement)
                            return false;
                    }
                    let x = this.events[1] || this.events[2] || this.events[3];
                    x.btn.Focus();
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                }
                else return t;
            }
        }
        public OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget) {
            var s = this._body.Content;
            if (s) return s.OnKeyCombined(e, v);
        }
        public Clear() {
            this.Content = null;
            this._body.Clear();
        }
        public static _ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (r, m: Modal) => void, ok?: string, cancel?: string): (msg: any) => void | void {
            if (this.closedMessages.length == 0) {
                var message = new Modal();
            } else {
                message = this.closedMessages.pop();
            }
            message.OnInitialized = (m) => {
                message.Title(title == null ? 'Confirm' : title);
                message.Clear();
                if (typeof msg === 'string')
                    message._body.View.innerHTML = '<h5>' + msg + '</h5>';
                else if (msg instanceof HTMLElement)
                    message._body.View.appendChild(msg);
                else
                    message._body.Content = msg;

                message.OkTitle(ok == null ? 'Ok' : ok);
                message.Canceltitle(cancel === undefined ? 'Cancel' : cancel);
                message.OnClosed.Add((s/*, l*/) => {
                    message.OnClosed.Remove(0);
                    if (callback) callback(s.msg, s.Modal);
                    var c = Modal.closedMessages.indexOf(message);
                    if (c == -1) Modal.closedMessages.push(message);
                },
                    0);
            }
            message.Open();
            return message.Close.bind(message);
        }
        private static closedMessages: Modal[] = [];

        public static ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (e: MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): Modal// (msg: any) => void | void
        {
            if (this.closedMessages.length == 0) {
                var message = new Modal();
            } else {
                message = this.closedMessages.pop();
            }
            message.OnInitialized = (m) => {
                message.Title(title == null ? 'Confirm' : title);
                message.Clear();
                if (typeof msg === 'string')
                    message._body.View.innerHTML = '<h5>' + msg + '</h5>';
                else if (msg instanceof HTMLElement)
                    message._body.View.appendChild(msg);
                else
                    message._body.Content = msg;

                message.OkTitle(ok == null ? 'Ok' : ok);
                message.Canceltitle(cancel === undefined ? 'Cancel' : cancel);
                message.AbortTitle(abort);
                message.OnClosed.Add((s/*, l*/) => {
                    if (callback) callback(s);
                    if (s.stayOpen) return;
                    message.OnClosed.Remove(0);
                    var c = Modal.closedMessages.indexOf(message);
                    if (c == -1) Modal.closedMessages.push(message);
                },
                    0);
            }
            message.Open();
            return message;
        }

        setStyle(name: string, value: string): this {
            this._container.View.style[name] = value;
            return this;
        }
        setWidth(value: string): this {
            this._container.View.style.width = value;
            return this;
        }

        setHeight(value: string): this {
            this._container.View.style.height = value;
            return this;
        }

        public set IsMaterial(v: boolean) {
            if (v)
                this.applyStyle('material');
            else this.disapplyStyle('material');
        }
        OnContextMenu(e) {
            var c = this.Content;
            if (c)
                return c.OnContextMenu(e);
        }
    }
    export enum MessageResult {
        Exit,
        ok,
        cancel,
        abort = 3
    }

    export class MessageEventArgs {

        private _stayOpen: boolean;

        get stayOpen(): boolean {
            return this._stayOpen;
        }


        StayOpen() {
            this._stayOpen = true;
        }
        Close() {
            this._stayOpen = true;
        }
        constructor(public Modal: Modal, public Result: MessageResult, public msg: string) {

        }
    }
    export class Image extends JControl {
        public get Source() { return (this._view as HTMLImageElement).src; }
        public set Source(v: string) { (this._view as HTMLImageElement).src = v; }

        constructor() {
            super(document.createElement('img'));
        }
        initialize() {

        }
    }
    export class CarouselItem extends JControl {
        public Indicator: any;
        private _image: Image;
        private _caption: Div;
        constructor(url: string, caption: any) {
            super(document.createElement('div'));
            this.OnInitialized = (x) => {
                x._image.Source = url;
                if (caption instanceof HTMLElement)
                    x._caption.View.appendChild(caption);
                else if (typeof caption === 'string')
                    x._caption.View.innerText = caption;
                else throw '';
            }
        }
        initialize() {
            this.applyStyle('item');
            this._image = new Image();
            this._caption = new Div().applyStyle('carousel-caption');
            this.AddRange([this._image, this._caption]);
        }
        public set Active(v: boolean) {
            if (v) this.applyStyle('active');
            else this.disapplyStyle('active');
        }
    }
    export class Carousel extends Control<CarouselItem> {
        private _items: collection.List<CarouselItem>;
        private _indecators: Dom;
        private _inner: Div;
        private leftButton: Dom;
        private rightButton: Dom;

        constructor() {
            super(document.createElement('div'));
            this.OnInitialized = (x) => x.ItemsChanged(utils.ListEventArgs.ResetEvent);
        }
        initialize() {
            this.applyStyle('carousel', 'slide');
            this.View.setAttribute('data-ride', 'carousel');
            this._indecators = new Dom('ol').applyStyle('carousel-indicators');
            this._inner = new Div().applyStyle('carousel-inner');
            this._items = new collection.List<CarouselItem>(CarouselItem);

            this._items.Listen = this.opcd;// this.ItemsChanged.bind(this);
            this.leftButton = this.createButton(true);
            this.rightButton = this.createButton(false);

            this.fromInit = true;
            super.Add(this._indecators as any);
            super.Add(this._inner as any);
            super.Add(this.leftButton as any);
            super.Add(this.rightButton as any);
            this.fromInit = false;
        }
        private opcd: basic.IBindable = { Owner: this, Invoke: this.ItemsChanged };
        private fromInit = false;
        protected createButton(isLeft: boolean) {
            var fl = isLeft === true ? 'left' : 'right';
            var i = new Dom('a').applyStyle(fl, 'carousel-control');
            var v = i.View;
            v.setAttribute('href', '#' + this.Id);
            v.setAttribute('role', 'button');
            v.setAttribute('data-slide', isLeft === true ? 'prev' : 'next');
            var x = document.createElement('span');
            x.classList.add('glyphicon', 'glyphicon-chevron-' + fl);
            v.appendChild(x);
            return i;
        }
        private createIndecator(i: number) {
            var d = new Dom('li');
            d.View.setAttribute('data-target', '#' + this.Id);
            d.View.setAttribute('data-slide-to', i + '');
            return d;
        }
        private b: boolean;
        private ItemsChanged(e: utils.ListEventArgs<number, CarouselItem>) {
            if (this.IsInit) {
                let m = this._inner;
                let n = this._indecators;
                let t = e.newItem;
                let ind, rit: CarouselItem;
                switch (e.event) {
                    case collection.CollectionEvent.Added:
                        ind = this.createIndecator(e.startIndex);
                        m.Add(t);
                        n.Add(ind);
                        t.Indicator = ind;
                    case collection.CollectionEvent.Cleared:
                        this.Clear();
                        return;
                    case collection.CollectionEvent.Removed:
                        rit = e.oldItem;
                        n.Remove(rit.Indicator);
                        m.Remove(rit);
                        break;
                    case collection.CollectionEvent.Replace:
                        rit = e.oldItem;
                        n.Remove(rit.Indicator);
                        m.Remove(rit);

                        ind = this.createIndecator(e.startIndex);
                        m.Add(t);
                        n.Add(ind);
                        t.Indicator = ind;
                        break;
                    case collection.CollectionEvent.Reset:
                        this.Clear();
                        for (var i = 0, l = this._items.Count; i < l; i++) {
                            let c = this._items.Get(0);
                            let ind = c.Indicator || this.createIndecator(e.startIndex);
                            m.Add(c);
                            n.Add(ind);
                            c.Indicator = ind;
                        }
                        break;
                }
                this.selectNext();
            }
        }
        private selectNext() {
            var t = this._items;
            for (var i = 0, l = t.Count; i < l; i++) {
                if (t.Get(i).View.classList.contains('active')) return;
            }
            if (l > 0) t.Get(0).Active = true;
        }
        public Clear() {
            this._indecators.Clear();
            this._inner.Clear();
        }
        Check(child: CarouselItem) { return this.fromInit || child instanceof CarouselItem; }
        Add(child: CarouselItem) {
            if (this.fromInit) super.Add(child);
            else this._items.Add(child);
            return this;
        }
        Remove(child: CarouselItem) {
            this._items.Remove(child as any);
            return true;

        } RemoveAt(i: number) {
            this._items.RemoveAt(i);
            return true;
        }
    }
    export class PaginationSurf extends JControl {
        private anchore: Anchore;
        private span: Dom;
        private text: Dom;
        constructor(private isNext?: boolean) {
            super(document.createElement('li'));
            var t: Node;
        }
        initialize() {
            var a = new Anchore();
            var s = new Dom('span');
            var t = new Dom('a');
            this.anchore = a;
            this.span = s;
            this.text = t;

            if (this.isNext != null) {
                a.View.setAttribute('aria-label', this.isNext ? 'Next' : 'Previous');
                s.View.setAttribute('aria-hidden', this.isNext ? 'true' : 'false');
                if (this.isNext)
                    s.View.innerHTML = '»';
                else s.View.innerHTML = '«';
            }
            this.View.addEventListener('click', this);

            this.Add(a.AddRange([s, t]));
        }
        public set Icon(v: string) {
            this.span.View.innerHTML = v;
        }
        public set Title(v: string) {
            this.text.View.innerHTML = v;
        }
        public OnClick: (e: PaginationSurf) => void;
        handleEvent(e: MouseEvent) {
            if (this.OnClick) this.OnClick(this);
        }

    }
    export class BiPagination extends JControl {
        static __fields__() {
            return [BiPagination.DPMax, BiPagination.DPIndex];
        }
        private isc: boolean = false;
        public static DPIndex: bind.DProperty<number, BiPagination>;

        public Index: number;
        public Max: number;
        public static DPMax: bind.DProperty<number, BiPagination>;
        private prev: PaginationSurf;
        private next: PaginationSurf;
        private list: Dom;
        private actionText: Textbox;
        constructor() {
            super(document.createElement('nav'));
        }
        initialize() {

            this.list = new Dom('ul').applyStyle('pager');
            this.prev = new PaginationSurf(false).applyStyle('previous');
            this.next = new PaginationSurf(true).applyStyle('next');
            var li = new Dom('li');
            this.actionText = new Textbox().applyStyle('text-center', 'borderless');
            this.actionText.View.addEventListener('change', this);
            this.actionText.View.style.width = '80px';
            this.actionText.View.style.border = '0px';
            this.actionText.Text = '0';

            li.Add(new Anchore(this.actionText));

            this.Add(this.list.AddRange([this.prev, li, this.next]));
            this.prev.Icon = '<';
            this.prev.Title = '<<<<';

            this.next.Icon = '>';
            this.next.Title = '>>>>';
            this.next.OnClick = () => { this.Index++; }
            this.prev.OnClick = () => { this.Index--; }

        }
        handleEvent(e: Event) {
            if (this.isc) return;
            var t: HTMLInputElement;
            this.Index = parseFloat(this.actionText.Text);
        }
        static ctor() {
            this.DPMax = BiPagination.CreateField<number, BiPagination>('Max', Number, Infinity, function (e) {
                var n = e._new;
                if (e.__this.Index > n) e.__this.Index = n;
            }, function (e) {
                if (e._new < 0) e._new = 0;
            });
            this.DPIndex = BiPagination.CreateField<number, BiPagination>('Index', Number, 0, this.prototype._onIndexChanged, function (e) {
                if (e._new < 0) e._new = 0;
                else if (isNaN(e._new)) e._new = isNaN(e._old) ? 0 : e._old;
                else if (e._new > e.__this.Max) e._new = e.__this.Max;
            });
        }
        _onIndexChanged(e: bind.EventArgs<number, this>) {
            this.isc = true;
            this.actionText.Text = e._new + '/' + this.Max;
            this.isc = false;
        }
    }
    export class Pagination extends JControl {
        private prev: UI.PaginationSurf;
        private next: UI.PaginationSurf;
        private items: collection.List<PaginationSurf> = new collection.List<PaginationSurf>(PaginationSurf);
        public static DPRange = Pagination.CreateField<number, Pagination>('Range', Number, 0, (e) => e.__this.OnRangeChanged(e._old, e._new));
        public static DPStartIndex = Pagination.CreateField<number, Pagination>('StartIndex', Number, 0, (e) => e.__this.OnStartIndexChanged(e._new));
        public static DPCount = Pagination.CreateField<number, Pagination>('Count', Number, 10, (e) => e.__this.OnCountChanged(e._old, e._new));

        public get SelectedRange() {
            return this.get(Pagination.DPRange);
        }
        public get Count() {
            return this.get(Pagination.DPCount);
        }
        public get StartIndex() {
            return this.get(Pagination.DPStartIndex);
        }
        public set StartIndex(v: number) {
            this.set(Pagination.DPStartIndex, v);
        }
        private OnCountChanged(o: number, n: number) {
            let t: PaginationSurf;
            for (var i = o; i < n; i++) {
                this.items.Add(t = new PaginationSurf());
                t.OnClick = this.OnClick;
            }
            for (var i = n; i < o; i++) {
                t = this.items.Get(i - 1);
                var j = this.items.RemoveAt(i - 1);
                t.OnClick = null;
            }
            this.StartIndex = n * this.SelectedRange;
        }

        private OnRangeChanged(o: number, n: number) {
            this.StartIndex = n * this.Count;
        }

        private OnStartIndexChanged(n: number) {
            var c = this.Count;
            for (var i = 0; i < c; i++) {
                var t = this.items.Get(i);
                t.Icon = i + '';
            }
        }

        constructor() {
            super(document.createElement('ul'));
        }

        AddItem(page: PaginationSurf) {

        }
        initialize() {
            this.applyStyle('pagination')
            this.prev = new PaginationSurf(false);
            this.next = new PaginationSurf(true);
            //this.items.AddRange([this.prev, this.next]);
            this.Add(this.prev);
            this.Add(this.next);
            this.items.Listen = this.opcd;// this.OnItemsChanged.bind(this);

            for (var i = 0; i < 10; i++) {
                var t = new PaginationSurf();
                ((i) => t.OnInitialized = (t) => t.Icon = i.toString())(i);
                this.items.Add(t);
            }

            for (var i = 0; i < this.items.Count; i++)
                this.Add(this.items.Get(i));
        }
        private opcd: basic.IBindable = { Owner: this, Invoke: this.OnItemsChanged };
        private sp: PaginationSurf;
        OnClick(e: PaginationSurf) {
            if (this.sp) this.sp.disapplyStyle('active');
            this.sp = e;
            this.sp.applyStyle('active');
        }
        private isInRange(i: number) {
            var s = i - this.SelectedRange * this.Count;
            return s < this.Count && s >= 0;
        }
        private convert(i: number) {
            return i - this.SelectedRange * this.Count;
        }

        private OnItemsChanged(e: utils.ListEventArgs<number, UI.PaginationSurf>) {

            switch (e.event) {
                case collection.CollectionEvent.Added:
                    e.newItem.OnClick = this.OnClick;
                    var t = e.startIndex;
                    if (t < 0 || t >= this.Count)
                        this.Insert(e.newItem, t + 1);
                    break;

                case collection.CollectionEvent.Removed:
                    this.Remove(e.oldItem)
                    e.oldItem.OnClick = null;
                    break;
                case collection.CollectionEvent.Cleared:
                    var c = e.collection;
                    for (var i = 0, l = this.Count; i < l; i++) {
                        var m = c[0];
                        this.Remove(m);
                        m.OnClick = null;
                    }
                    break;
                case collection.CollectionEvent.Reset:
                    var ci = this.items;
                    for (var i = 0, l = this.Count; i < l; i++) {
                        var m = ci.Get(0);
                        this.Remove(m);
                        m.OnClick = null;
                    }
                    break;
            }
        }
    }

    export class NumericUpDown extends JControl {
        private f = false;
        public static DPValue = bind.DObject.CreateField<number, NumericUpDown>('Value', Number, 0, (e) => {

            e.__this.text.Text = (e._new == null ? 0 : e._new) + '';

        }, (e) => {
            var t = e.__this;
            var n = e._new;
            if (n == null || !isFinite(n)) {
                e._new = t.defaultValue;
            } else if (n < t.minValue) e._new = t.minValue;
            else if (n > t.maxvalue) e._new = t.maxvalue;
        });
        public get Value() { return this.get(NumericUpDown.DPValue); }
        public set Value(v) { this.set(NumericUpDown.DPValue, v); }
        static __fields__() { return [NumericUpDown.DPValue]; }
        private minValue = -Number.MAX_VALUE;
        private defaultValue = 0;
        private maxvalue = Number.MAX_VALUE;
        private sleft: Dom;
        private sright: Dom;
        private text: Input;
        protected _hasValue_() { return true; }
        constructor() {
            super(document.createElement('div'));
        }
        initialize() {
            this.applyStyle('input-group', 'input-group-lg');
            var l = new Dom('a').applyStyle('btn', 'btn-primary', 'input-group-addon', 'glyphicon', 'glyphicon-minus-sign');
            var r = new Dom('a').applyStyle('btn', 'btn-primary', 'input-group-addon', 'glyphicon', 'glyphicon-plus-sign');
            var t = new Input();
            this.AddRange([this.sleft = l, this.text = t, this.sright = r]);
            this.text.Text = '0';
            this.text.View.onchange = this.textChanged.bind(this);
            l.View.onclick = () => {
                this.Value--;
            };
            r.View.onclick = () => {
                this.Value++;
            };

        }

        private textChanged(e) {

            this.Value = parseFloat(this.text.Text);
        }
        public Focus() {
            this.text.View.focus();
        }
        public SelectAll() {
            var inp = this.text.View as HTMLInputElement;
            inp.select();
        }
    }

    export interface pair<K, P> {
        Key: K;
        Value: P;
    }
    interface INavEventArgs {
        List: NavPage;
        Item: NavPanel;
    }
    class NavList extends JControl {
        private caption: HTMLDivElement = document.createElement('div');
        private _toolTip: Text;
        public set Caption(v: string) {
            this.caption.textContent = v;
        }
        constructor() {
            super(document.createElement('div'));
            this._view.appendChild(this.caption);
        }
        initialize() {
            this.applyStyle('inavigation');
            this.caption.classList.add('icaption');

        }
        public getTemplate(child: Button) {
            return new Div().applyStyle('itab-header', 'sp-tooltip').Add(child);
        }
        Add(panel: NavPanel): this {
            super.Add(panel.CaptionControl);
            return this;
        }
        AddRange(c: NavPanel[]): this {
            throw "Not Implimented";
        }
        Remove(c: NavPanel) {
            return super.Remove(c.CaptionControl);
        }
        Insert(c: NavPanel, i: number) {
            super.Insert(c.CaptionControl, i);
            return this;
        }
        SetSeparator() {
            var i = new Div();
            i.applyStyle('separator');
            super.Add(i);
        }
    }
    export class NavPanel extends JControl implements IService {
        OnPrint(): any {

        }
        private title = new Div().applyStyle('icontent-header', 'hidden');
        private container = new Div();
        private caption = new Button();
        public HasSearch: UI.SearchActionMode;

        public get CaptionControl() { return this.caption; }
        public set Title(v: string | HTMLElement) {
            if (v != null && v != "") {
                if (typeof v === 'string')
                    this.title.View.textContent = v;
                else this.title.View.appendChild(v);
                this.title.disapplyStyle('hidden');
            } else {
                this.title.View.innerHTML = '';
                this.title.applyStyle('hidden');
            }
        }
        public set Caption(v: string) {
            this.caption.Text = v;
        }
        constructor(public Name: string, caption: string) {
            super(document.createElement('div'));
            this.Caption = caption;
        }

        public initialize() {
            this.applyStyle('fitHeight');
            this.container.applyStyle('fitHeight', 'nav-panel');
            super.Add(this.title);
            super.Add(this.container);

        }
        public set ToolTip(v: string) {
            var c = document.createElement('text');
            c.textContent = v;
            c.classList.add('sp-tooltiptext');
            this.caption.Content = c;
        }
        public Add(item: JControl) {
            this.container.Add(item);
            return this;
        }
        public AddRange(items: JControl[]) {
            this.container.AddRange(items);
            return this;
        }
        public Remove(item: JControl) {
            return this.container.Remove(item);
        }
        public RemoveAt(i: number, dispose?: boolean) {
            return this.container.RemoveAt(i, dispose);
        }
        public Clear() {
            this.container.Clear();
        }
        Update() {
        }
        GetLeftBar() {
            return null;
        }
        GetRightBar() {
            return null;
        }
        Handled() {
            return true;
        }
        get ServiceType() {
            return ServiceType.Instantany;
        }
        Callback() { }

        public OnBringIntoFront() {

        }
        public IsActive: boolean;
        OnKeyDown(e: KeyboardEvent) {
        }
        public OnSearche(oldPatent: string, newPatent: string) {

        }
        public OnDeepSearch() {
        }
        public getHelp(t: Object) {
            var l = ["primary", "success", "danger", "info", "warning"]; var k = 0;
            var s = "";
            for (var i in t) {
                s += '<div class="input-group" style="background:gray"> <span class="input-group-btn"> <label class="btn btn-' + l[(k++) % l.length] + '">' + i + '</label> </span> <label class="form-control" >' + t[i] + '</label> </div>';
            }
            UI.InfoArea.push(s, true, 10000);
        }
    }
    export class IContent extends JControl {
        constructor(private navPage: NavPage) {
            super(document.createElement('div'));
        }
        initialize() {
            this.applyStyle('icontent');
        }
        Check(item: JControl) { return true; }

        public Add(p: NavPanel) {
            this._view.appendChild(p.View);
            p.Parent = this.navPage;
            return this;
        }
        public Remove(p: NavPanel) {
            this._view.removeChild(p.View);
            p.Parent = null;
            return true;
        }
    }
    export class NavPage extends UI.Page {
        public static DPSelectedItem = bind.DObject.CreateField<NavPanel, NavPage>("SelectedItem", NavPanel, null, NavPage.prototype._onSelectedItemChanged);
        static __fields__() { return [NavPage.DPSelectedItem] as any; }

        private _onSelectedItemChanged(e: bind.EventArgs<NavPanel, NavPage>) {
            var o = e._old;
            var n = e._new;
            if (o) {
                this.con.Remove(o);
                o.IsActive = false;
                o.CaptionControl.Parent.disapplyStyle('selected');
                o.disapplyStyle('selected');
                this.app.Foot.Pop(o);
            }
            if (n) {
                this.con.Add(n);
                n.IsActive = true;
                n.CaptionControl.Parent.applyStyle('selected');
                n.applyStyle('selected');
                n.OnBringIntoFront();
                this.app.Foot.Push(n);
            }
        }

        private con = new IContent(this);
        private nav = new NavList();
        private caption = new Button();

        public set Caption(v: string) { this.nav.Caption = v; }

        constructor(app: App, title: string | HTMLElement | JControl, name: string) {
            super(app, title, name);
        }
        private islocal: boolean;
        initialize() {
            super.initialize();
            this._view.classList.add('inavPanel');
            this.caption.applyStyle('icaption');
            this.islocal = true;
            super.Add(this.nav);
            super.Add(this.con);
            delete this.islocal;
        }
        public ToggleNav() {
            var v = this.nav.View;
            var x = v.classList.contains('hideNav');
            if (x) v.classList.remove('hideNav');
            else v.classList.add('hideNav');
        }
        Add(c: JControl): this {
            throw "Not Implimented";
        }
        AddRange(c: JControl[]): this {
            throw "Not Implimented";
        }

        Check(j: JControl) { return !!this.islocal; }

        public get SelectedItem() {
            return this.get(NavPage.DPSelectedItem);
        }

        public set SelectedItem(v) {
            this.set(NavPage.DPSelectedItem, v);
        }
        private children: NavPanel[] = [];
        public SetPanel(panel: NavPanel) {
            var p = this.panels[panel.Name];
            if (p) throw "this panel exist";
            this.panels[panel.Name] = panel;
            this.children.push(panel);
            var itemList = this.nav.Add(panel);
            this.events.push(panel.CaptionControl.addEventListener('click', NavPage._onItemSelected, <INavEventArgs>{ Item: panel, List: this }));
            if (!this.get(NavPage.DPSelectedItem))
                this.SelectedItem = panel;
        }
        public GetPanelOf(type: typeof NavPanel): NavPanel {
            for (var i in this.panels) {
                if (this.panels[i] instanceof type) return this.panels[i];
            }
            return undefined;
        } public GetPanelsOf(type: typeof NavPanel): NavPanel[] {
            var x = [];
            for (var i in this.panels) {
                if (this.panels[i] instanceof type) x.push(this.panels[i]);
            }
            return x;
        }
        SetSeparator() {
            this.nav.SetSeparator();
        }
        public OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget) {
            var s = this.SelectedItem;
            if (s) return s.OnKeyCombined(e, v);
        }
        OnKeyDown(e: KeyboardEvent) {
            var s = this.SelectedItem;
            if (e.altKey)
                if (e.keyCode === UI.Keys.Down) {
                    this.SelectedItem = this.children[(1 + this.children.indexOf(s)) % this.children.length];
                    e.stopPropagation();
                    return e.preventDefault();
                } else if (e.keyCode === UI.Keys.Up) {
                    var i = this.children.indexOf(s);
                    if (i == 0) i = this.children.length;
                    this.SelectedItem = this.children[(-1 + i) % this.children.length];
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                };

            if (!s) return;
            (s as any).OnKeyDown(e);
        }
        OnContextMenu(e: MouseEvent) {
            var s = this.SelectedItem;
            if (s && s.OnContextMenu(e)) return true;
            return super.OnContextMenu(e);
        }
        OnPrint(): any {
            var s = this.SelectedItem;
            if (s) s.OnPrint();
        }
        private static _onItemSelected(s, e, p: INavEventArgs) {
            var o = p.List.SelectedItem;
            if (o) o.IsActive = false;
            var n = p.Item;
            if (n) n.IsActive = true;
            p.List.SelectedItem = p.Item;
        }

        private events: basic.DomEventHandler<any, any>[] = [];
        public Select(name: string): boolean {
            var p = this.panels[name];
            if (p)
                this.SelectedItem = p;
            else return false;
            return true;
        }

        public GetLeftBar() {
            var p = this.SelectedItem;
            return p && p.GetLeftBar();
        }
        public get HasSearch(): UI.SearchActionMode {
            return this.SelectedItem && this.SelectedItem.HasSearch;
        }
        public set HasSearch(v) { }
        public GetRightBar() {
            var p = this.SelectedItem;
            return p && p.GetRightBar();
        }
        public Update() {
            var n = this.SelectedItem;
            if (n) n.Update();
        }

        private panels: d = {};

        public OnSearche(oldPatent: string, newPatent: string) {
            var p = this.SelectedItem;
            if (p) p.OnSearche(oldPatent, newPatent);
        }

        public OnDeepSearche() {
            var p = this.SelectedItem;
            if (p) p.OnDeepSearch();
        }
    }
    interface d { [s: string]: NavPanel; }
}

export module UI {
    export interface ITemplateShadow {
        setDataContext(data: any);
        getDataContext();
    }
    export abstract class TemplateShadow extends JControl implements ITemplateShadow {
        abstract setDataContext(data: any);
        abstract getDataContext();
        public static Create(item) {
            var isscop = item instanceof bind.Scop;
            var c = document.createElement('label');
            c.textContent = ((isscop ? item.Value : item) || '').toString();
            return new ScopicTemplateShadow(c, isscop ? item : new bind.ValueScop(item));
        }
        abstract getScop(): bind.Scop;
        public abstract get Controller(): bind.Controller;

    }
    declare var stop: () => void;
    export class ScopicTemplateShadow extends TemplateShadow {
        public get Controller(): bind.Controller { return this.cnt; }
        private cnt: bind.Controller;
        setDataContext(data: any) { if (this.scop) this.scop.Value = data; }
        getDataContext() { return this.scop ? this.scop.Value : null; }
        constructor(dom: HTMLElement, private scop?: bind.Scop, cnt?: UI.JControl) {
            super(dom);
            this.cnt = new bind.Controller(cnt || this);
            if (!scop) stop();
        }
        initialize() {
            if (this.scop == undefined) {
                var c = this._view.getAttribute('db-bind');
                if (c)
                    if (c.indexOf('$') === 0)
                        this.scop = bind.Scop.Create(c);// bind.NamedScop.Create(c.substring(1));
            }

            var oldAttribute = this._view.getAttribute('db-bind');
            this._view.setAttribute('db-bind', '~' + bind.AnonymouseScop.Register(this.scop) + (oldAttribute && oldAttribute != '' ? '.' + oldAttribute : ''));
            this.cnt.processHowEver = true;
            this.cnt.View = this._view;
        }
        Check(c: JControl) {
            return false;
        }
        public get Scop() { return this.scop; }
        public getScop() { return this.scop; }
        Dispose() {
            stop();
        }
    }


    export class EScopicTemplateShadow  {
        public get Controller(): bind.Controller { return this.cnt; }
        private cnt:bind.Controller;
        setDataContext(data: any) { if (this.scop) this.scop.Value = data; }
        getDataContext() { return this.scop ? this.scop.Value : null; }
        constructor(private control: JControl, private scop?: bind.Scop) {
            this.cnt = new bind.Controller(control);
            this.initialize();
        }
        initialize() {
            if (this.scop == undefined) {
                var c = this.control.View.getAttribute('db-bind');
                if (c)
                    if (c.indexOf('$') === 0)
                        this.scop = bind.Scop.Create(c);
            }

            var oldAttribute = this.control.View.getAttribute('db-bind');
            //this.cnt.Scop = this.scop;
            this.control.View.setAttribute('db-bind', '~' + bind.AnonymouseScop.Register(this.scop) + (oldAttribute && oldAttribute != '' ? '.' + oldAttribute : ''));
            this.cnt.processHowEver = true;
            this.cnt.View = this.control.View;
        }
        Check(c: JControl) {
            return false;
        }
        public get Scop() { return this.scop; }
        public getScop() { return this.scop; }

    }

    export interface ITemplate {
        CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): TemplateShadow;

    }

    export abstract class Template implements ITemplate {
        /**
        *   if(data is scop) scop=data;
        *   if(data is undefined) scop=null;
        *   else scop=new ScopValue(data);
        **/
        abstract CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
        public static ToTemplate(itemTemplate: conv2template, asTemplate: boolean): Template {
            if (itemTemplate instanceof Template|| itemTemplate instanceof HtmlTemplate)
                return itemTemplate;
            else if (itemTemplate instanceof HTMLTemplateElement)
                return new HtmlTemplate(itemTemplate.content.firstElementChild as any, true);
            else if (itemTemplate instanceof HTMLElement)
                return new HtmlTemplate(itemTemplate, asTemplate);
            else if (typeof itemTemplate === "string") {
                var x = ListAdapter._getTemplate(itemTemplate);
                if (x == null) {
                    var cc = "the template { " + itemTemplate + " } was not found";
                    console.error(new $Error(cc));
                    var d = document.createElement('error');
                    d.innerText = cc;
                    return new HtmlTemplate(d, false);
                }
                return new ScopicTemplate(x);
            }
            else
                return new ScopicTemplate(ListAdapter._getTemplate(itemTemplate));
        }

    }

    export class HtmlTemplate implements Template {
        private asTemplate: boolean;
        constructor(public dom: HTMLElement, asTemplate?: boolean) {
            if (dom instanceof HTMLTemplateElement) {
                this.dom = dom.content.firstElementChild as any;
                this.asTemplate = true;
            } else
                this.asTemplate = !!asTemplate;
            Object.freeze(this);
        }
        //private template: mvc.ITemplate;
        /**
        *   if(data is scop) scop=data;
        *   if(data is undefined) scop=null;
        *   else scop=new ScopValue(data);
        **/
        CreateShadow<T>(data?: T | bind.Scop,cnt?:UI.JControl): TemplateShadow {
            return new ScopicTemplateShadow(this.asTemplate ? this.dom.cloneNode(true) as HTMLElement : this.dom, data instanceof bind.Scop ? data : new bind.ValueScop(data), cnt);
        }

    }
    export class ScopicTemplate implements Template {
        private template: mvc.ITemplate;
        /**
        *   if(data is scop) scop=data;
        *   if(data is undefined) scop=null;
        *   else scop=new ScopValue(data);
        **/
        CreateShadow<T>(data?: T | bind.Scop,cnt?:UI.JControl): TemplateShadow {
            return new ScopicTemplateShadow(this.template.Create(), data instanceof bind.Scop ? data : (new bind.ValueScop(data)), cnt);
        }
        constructor(templatePath: string | mvc.ITemplate) {
            this.template = typeof templatePath === 'string' ? mvc.MvcDescriptor.Get(templatePath) : templatePath;
            if (this.template == null) { throw new $Error("the template { " + templatePath + " } was not found");  }
        }
    }
    var actions: ((e: utils.ListEventArgs<number, any>) => void)[];
    
    export class TControl<T> extends JControl {
        public static DPData: bind.DProperty<any, TControl<any>>;
        public Data: T; 
        static __fields__() { return [this.DPData]; }
        static ctor() {
            this.DPData = bind.DObject.CreateField<any, TControl<any>>("Data", Object, null, TControl.prototype.OnDataChanged);
        }
        public static Me: any = new Object();
        constructor(itemTemplate: mvc.ITemplate | string | Function | Template | HTMLElement, private data: T | bind.Scop) {
            super(null);
            this._template = Template.ToTemplate(itemTemplate, false);
            if (this._template == null) {}
            this.Shadow = this._template.CreateShadow(data === TControl.Me ? this : data, this);
            this.Shadow.Parent = this;
            this._view = this.Shadow.View;
        }
        protected OnFullInitialized() {
            var c = this.Shadow.Controller;
            c && (c.OnCompiled = <basic.ITBindable<(cnt: bind.Controller) => void>>{ Owner: this, Invoke: this._onTemplateCompiled });
            super.OnFullInitialized();
        }
        private _onTemplateCompiled(cnt: bind.Controller) {
            this.compiled = true;
            this.OnCompileEnd(cnt);
            this._onCompiled.PInvok(this, [this, cnt]);
        }
        protected OnCompileEnd(cnt: bind.Controller) {

        }
        private Shadow: TemplateShadow;
        public getScop() { return this.Shadow instanceof ScopicTemplateShadow ? (this.Shadow as ScopicTemplateShadow).Scop : null; }
        private _template: Template;
        initialize() {
        }

        public _onCompiled = new bind.EventListener<(s: this, cnt: bind.Controller) => void>(this, true);
        private compiled = false;
        public set OnCompiled(m: (s: this) => void) {
            if (this.compiled) m(this);
            else this._onCompiled.On = m;
        }
        public get IsCompiled() {
            return this.compiled;
        }
        OnDataChanged(e: bind.EventArgs<T, this>) {
            this.Shadow.setDataContext(e._new);
        }
    }
    export interface ListAdapterEventArgs<T,P> {
        sender: ListAdapter<T, P>;
        index: number;
        template: TemplateShadow;
        oldIndex?: number;
        oldTemplate?: TemplateShadow,
        Cancel?: boolean;
        Event?: Event;
    }

    export class ListAdapter<T, P> extends TControl<P> {
        instantanyInitializeParent() { return true; }
        private garbage: TemplateShadow[] = [];
        public static __fields__() { return [ListAdapter.DPSelectedIndex, ListAdapter.DPTemplate, ListAdapter.DPSource, this.DPSelectedItem]; }
        public static DPSource = bind.DObject.CreateField<collection.List<any>, ListAdapter<any, any>>('Source', collection.List, null, (e) => {
            var t = e.__this;
            if (e._old) e._old.Unlisten = e.__this.sli;
            if (e._new) e._new.Listen = e.__this.sli;
            if (t.IsInit)
                t.Reset(e as any);
        }, (e) => { if (e.__this.IsInit) e.__this.Clear(); });

        public get Source() { return this.get<collection.List<any>>(ListAdapter.DPSource); }
        public set Source(v: collection.List<T>) { this.set<collection.List<T>>(ListAdapter.DPSource, v); }

        public static DPSelectedIndex = bind.DObject.CreateField<number, ListAdapter<any, any>>('SelectedIndex', Number, -2,
            (e) => e.__this.OnSelectedIndexChanged(e._old, e._new),
            ListAdapter.prototype.__checkSelectedIndex);
        private __checkSelectedIndex(e: bind.EventArgs<number, this>) {
            var s = this.Source;
            var l = s == null ? 0 : s.Count;
            var n = isNaN(e._new) || e._new == null || e._new < 0 ? -1 : e._new;
            if (n === -1) e._new = this.AcceptNullValue || l == 0 ? -1 : 0;
            else if (n >= l) e._new = this.AcceptNullValue ? l : l - 1;
        }
        public AcceptNullValue: boolean = true;
        private swap(i: number): number {
            var s = this.Source;
            var l = s == null ? 0 : s.Count;
            var n = i;
            if (i < 0) return - 1;
            else if (n >= l)
                return l - 1;
            return i;
        }
        public get SelectedIndex() { return this.get<number>(ListAdapter.DPSelectedIndex); }
        public set SelectedIndex(v: number) { this.set<number>(ListAdapter.DPSelectedIndex, v); }

        public static DPItemStyle = bind.DObject.CreateField<string[], ListAdapter<any,any>>('ItemStyle', Array, undefined, (e) => {
            var t = e.__this._content;
            if (!t) return;
            var n = e._new;
            var o = e._old;
            for (var i = 0, l = t.Count; i < l; i++) {
                var c = t.getChild(i).View.classList;
                if (o)
                    c.remove.apply(c, o);
                if (n)
                    c.add.apply(c, n);
            }
        });

        public get ItemStyle(): string[] {
            return this.get(ListAdapter.DPItemStyle);
        }
        public set ItemStyle(v: string[]) {
            this.set<string[]>(ListAdapter.DPItemStyle, v);
        }

        public static DPTemplate = bind.DObject.CreateField<ITemplate, ListAdapter<any,any>>('Template', Object, null, (e) => e.__this.Recycle(), (e) => {
            if (e._new)
                if (typeof e._new.CreateShadow !== 'function') e.IsValid = false;
        });
        public get Template(): ITemplate {
            return this.get(ListAdapter.DPTemplate);
        }
        public set Template(v: ITemplate) {
            this.set<ITemplate>(ListAdapter.DPTemplate, v);
        }
        public OnItemSelected = new bind.EventListener<(s: ListAdapter<T,P>, index: number, template: TemplateShadow, oldIndex?: number, oldTemplate?: TemplateShadow) => void>('');
        public OnItemInserted = new bind.EventListener<(s: ListAdapter<T,P>, index: number, data: T, template: TemplateShadow) => void>('');
        public OnItemRemoved = new bind.EventListener<(s: ListAdapter<T,P>, index: number, data: T, template: TemplateShadow) => void>('');
        public OnChildClicked = new bind.EventListener<(e: ListAdapterEventArgs<T, P>) => void>('');
        public static DPSelectedItem = bind.DObject.CreateField<any, ListAdapter<any, any>>("SelectedItem", Object);
        
        private _content: Control<TemplateShadow>;
        public get Content() { return this._content; }
        public _selectedItem: TemplateShadow;

        public get SelectedChild() { return this._selectedItem; }
        public get SelectedItem(): T { return this._selectedItem && this._selectedItem.getDataContext(); }
        public set SelectedItem(v: T) {
            this.SelectedIndex = this.Source && this.Source.IndexOf(v);
        }
        public activateClass: string;
        private OnSelectedIndexChanged(_old: number, _new: number) {
            var x = this._content.getChild(_new) as TemplateShadow;// this._selectedItem;
            var lx = this._content.getChild(_old) as TemplateShadow;// this._selectedItem;
            var li = _old;
            if (lx)
                lx.disapplyStyle(this.activateClass || 'active');
            if (x)
                x.applyStyle(this.activateClass || 'active');
            this._selectedItem = x;
            if (_old !== _new) {
                this.set(ListAdapter.DPSelectedItem, x && x.getDataContext());
                this.riseItemSelectedEvent(this.SelectedIndex, x, li, lx);
                return true;
            }
        }
        private riseItemSelectedEvent(ni: number, nc: TemplateShadow, oi: number, oc: TemplateShadow) {
            this.OnItemSelected.Invoke('', [this, ni, nc, oi, oc]);
            var v = nc && nc.View as any;
            if (v)
                if (v.scrollIntoViewIfNeeded) v.scrollIntoViewIfNeeded();
                else v.scrollIntoView();
        }
        public Select(t: TemplateShadow) {
            this.SelectedIndex = this._content.IndexOf(t);
        }
        public SelectItem(t: T) {
            var s = this.Source;
            if (s)
                this.SelectedIndex = s.IndexOf(t);
        }
        public static _getTemplate(template: mvc.ITemplate | string | Function): mvc.ITemplate {
            switch (typeof template) {
                case 'string':
                    return mvc.MvcDescriptor.Get(template as string);
                case 'function':
                    return mvc.MvcDescriptor.GetByType(template as Function).Default;
                default:
                    if (template instanceof mvc.ITemplate)
                        return template;
                    var c = mvc.MvcDescriptor.GetByType(template as Function);
                    return c ? c.Default : undefined;
            }
        }
        public static _getTemplateShadow(template: mvc.ITemplate | string | Function | HTMLElement): HTMLElement {
            if (template instanceof HTMLElement) return template;
            var t = ListAdapter._getTemplate(template as (mvc.ITemplate | string | Function));
            return t == undefined ? document.createElement('div') : t.Create();
        }

        static ctor() {
            actions = [this.prototype.OnAdd, this.prototype.OnRemove, this.prototype.OnReplace, this.prototype.OnClear, this.prototype.Reset, this.prototype.OnSet];
        }

        constructor(template: conv2template, itemTemplate?: conv2template, data?: P | bind.Scop, getSourceFromScop?: boolean) {
            super(template || document.createElement('div'), data);
            this.initTemplate(itemTemplate, getSourceFromScop);
        }
        private params: { template: conv2template, itemTemplate?: conv2template, data?: P, getSourceFromScop?: boolean };
        private initTemplate(itemTemplate?: conv2template, getSourceFromScop?: boolean) {
            var dom = this._view;
            var x = $('[db-content]', dom)[0] || dom;
            var attSI = $('[attach-SelectedItem]', dom)[0];
            if (attSI)
                this.AttachSelectedItem(attSI);
            if (getSourceFromScop)
                this.getSourceFromScop(x);
            this._content = new DivControl(x) as any;
            var itemStyle = dom.getAttribute('item-style') || x.getAttribute('item-style');
            if (itemStyle)
                this.ItemStyle = itemStyle.split(' ');
            this.Template = Template.ToTemplate(itemTemplate || ListAdapter.getTemplate(x) || this._content.View.getAttribute('item-template') || dom.getAttribute('item-template'), true);
            this._content.Parent = this;
        }
        private static getFirstChild(dom: DocumentFragment) {
            var f:Node = dom.firstChild as any;
            var node: Node;
            while (f) {
                if (f instanceof Element) return f;
                if (!node && f instanceof Node) node = f;
                f = f.nextSibling;
            }
            return node;
        }
        private static getTemplate(d: HTMLElement) {
            var t = d.children;
            for (var i = 0, l = t.length; i < l; i++) {
                var x = t[i];
                if (basic.polyfill.IsTemplate(x)) {
                    var w = ListAdapter.getFirstChild((x as any).content) as HTMLElement;
                    x.remove();
                    return w;
                }
            }
        }
        private sli: basic.IBindable = <basic.IBindable>{ Owner: this, Invoke: this.OnSourceChanged };
        private getSourceFromScop(x:HTMLElement) {
            x.setAttribute('db-cmd', ScopicCommand.Register({ Invoke: this.CmdExecuter, Owner: this }));
        }
        private CmdExecuter(n: string, d: HTMLElement, s: bind.Scop) {
            ScopicCommand.Delete(n);
            this._scop = s;
            this.Source = s.Value;
            this.RlSourceScop = new bind.TwoBind(bind.BindingMode.TwoWay, s, this, bind.Scop.DPValue, ListAdapter.DPSource);
            this.Source = s.Value;
        }

        private AttachSelectedItem(x: HTMLElement) {
            x.setAttribute('db-cmd', ScopicCommand.Register({ Invoke: this.CmdAttacheSelectedItemExecuter, Owner: this }));
        }
        private CmdAttacheSelectedItemExecuter(n: string, d: HTMLElement, s: bind.Scop) {
            ScopicCommand.Delete(n);            
            this.OnPropertyChanged(ListAdapter.DPSelectedIndex, function(s, e)  {
                this.s.Value = this.t.SelectedItem;
            }, { t: this, s: s });
        }

        private RlSourceScop: bind.TwoBind<collection.List<any>>;
        initialize() {
            var s = this.Source;
            this.Content.OnInitialized = (n) => this.Reset(s ? new utils.ListEventArgs(null, null, null, collection.CollectionEvent.Reset, s.AsList()) : undefined);
        }
        private OnSourceChanged(e: utils.ListEventArgs<number, T>) {
            if (this.Template)
                actions[e.event].call(this, e);
        }
        private ReSelect() {
            var i = this.get<number>(ListAdapter.DPSelectedIndex);
            var j = this.swap(i);
            if (!this.AcceptNullValue && j < 0 && this.Source && this.Source.Count > 0) j = 0;
            if (i !== j) {
                this.SelectedIndex = j;
                return true;
            }
            return this.OnSelectedIndexChanged(i, j);
        }
        private _scop: bind.Scop;
        private get Scop() {
            if (!this._scop) {
                var pscop = super.getScop();
                if (pscop) return pscop;                
                this._scop = bind.NamedScop.Create(null, this.Source);                
                this._scop.setParent(this);
                return this._scop;
            }
        }

        public BindTo(scop: bind.Scop) {
            if (scop) {
                scop.OnPropertyChanged(bind.Scop.DPValue, this.OnScopValueChanged, this);
                this.Source = scop.Value;
            }
        }
        private OnScopValueChanged(pb: bind.PropBinding, e: bind.EventArgs<any, bind.Scop>) {
            this.Source = e._new;
        }
        OnItemClicked(s: TemplateShadow, e: Event, t: ListAdapter<any, any>) {
            var e1: ListAdapterEventArgs<T, P> = { sender: this, Event: e, index: this.Source.IndexOf(s.getDataContext()), template: s };
            this.OnChildClicked.PInvok('', [e1], this);
            if (e1.Cancel) return;
            t.Select(s);
        }
        protected getItemShadow(item: T, i: number) {
            var ch = this.garbage.pop();
            if (!ch) {
                var t = this.Template;
                ch = t == null ? TemplateShadow.Create(item) : t.CreateShadow(item, undefined);
            }
            return ch;
        }
        protected disposeItemShadow(item: T, child: TemplateShadow, i: number) {
            if (item instanceof Array && i == NaN && child == void 0) {
                this.garbage.push.apply(this.garbage, this.CloneChildren());
            } else {
                if (!child) return;
                this.garbage.push(child);
                return child;
            }
        }
        protected disposeItemsShadow(items: T[], child: TemplateShadow[]) {
            this.garbage.push.apply(this.garbage, this.CloneChildren());
        }

        private _insert(item: T, i: number) {
            this.count++;
            var ch = this.getItemShadow(item, i);
            var sc = ch.getScop();
            if (sc)
                sc.setParent(this.Scop);
            ch.setDataContext(item);
            if (i)
                this.Insert(ch, i);
            else this.Add(ch);
            if (i == undefined) i = this.Source.Count - 1;
            var h = (ch as any).__events;
            if (h != undefined)
                h.Dispose();
            (ch as any).__events = [ch.addEventListener('click', this.OnItemClicked, this, this), ch.addEventListener('contextmenu', this.OnItemClicked, this, this)];

            var c = ch.View.classList;
            if (this.ItemStyle) c.add.apply(c, this.ItemStyle);
            this.OnItemInserted.Invok('', (f) => f(this, i, item, ch));
            var r = this.ReSelect();
            if (!r && i == this.SelectedIndex)
                this.riseItemSelectedEvent(i, ch, i, this._content.getChild(i));
        }
        private _remove(item: T, i: number) {
            var ch = this.disposeItemShadow(item, this._content.getChild(i) as TemplateShadow, i);
            var res = i === this.SelectedIndex;
            this.count--;
            ch.disapplyStyle(this.activateClass || 'active');
            this._content.RemoveAt(i, false);
            for (var h of (ch as any).__events)
                if (h != undefined)
                    h.Dispose();
            
            (ch as any).__events = undefined;
            var c = ch.View.classList;
            if (this.ItemStyle)
                c.remove.apply(c, this.ItemStyle);
            this.OnItemRemoved.Invok('', (f) => f(this, i, item, ch));
            var r = this.ReSelect();
            if (!r && i == this.SelectedIndex)
                this.riseItemSelectedEvent(i, this._content.getChild(i), i, ch);
        }

        private count = 0;

        private OnAdd(e: utils.ListEventArgs<number, T>) {            
            this._insert(e.newItem, e.startIndex);
        }

        private OnSet(e: utils.ListEventArgs<number, T>) {
            var ch = this._content.getChild(e.startIndex) as TemplateShadow;
            if (!ch) return;
            ch.setDataContext(e.newItem);
        }

        private OnClear(e?: utils.ListEventArgs<number, T>) {
            this.SelectedIndex = -1;
            this.disposeItemsShadow(e && e.collection, this.CloneChildren() as any);
            if (e && e.collection && this.count > 0)
                for (var i = e.collection.length - 1; i >= 0; i--)
                    this._remove(e.collection[i], i);
            this.count = 0;
        }

        private OnRemove(e: utils.ListEventArgs<number, T>) {
            this._remove(e.oldItem, e.startIndex);
        }

        private OnReplace(e: utils.ListEventArgs<number, T>) {
            (<TemplateShadow>this._content.getChild(e.startIndex)).setDataContext(e.newItem);
        }

        private Reset(e?: utils.ListEventArgs<number, T>) {
            var si = this.SelectedIndex;
            var c = this.Source;
            this.OnClear(e);
            if (c)
                for (var i = 0, l = c.Count; i < l; i++)
                    this._insert(c.Get(i), i);
            thread.Dispatcher.call(this, (si) => { this.SelectedIndex = si; }, si);
        }

        protected clearGarbage() {
            for (var i = 0, l = this.garbage.length; i < l; i++)
                this.garbage[i].Dispose();
            this.garbage.length = 0;
        }

        private Recycle() {
            this.Clear();
            this.clearGarbage();
            this.Reset();
        }

        Dispose() {
            var h = this.OnDispose();
            if (h === null) return;
            this.Source.Unlisten = this.sli; this.sli = null;
            this.clearGarbage();
            this._content.Dispose();
            this._content = null;
            super.Dispose();
            if (!h) this.DisposingStat = 2;
        }

        Add(child: JControl) {
            this._content.Add(child as any);
            return this;
        }
        AddRange(children: JControl[]) {
            this._content.AddRange(children);
            return this;
        }
        Remove(child: JControl, dispose: boolean) {
            return this._content.Remove(child as any);
        }
        RemoveAt(i: number, dispose: boolean) {
            return this._content.RemoveAt(i, dispose);
        }
        Clear(dispose?: boolean) {
            var c = this.Source;
            if (c) {
                for (var i =this.Content.Count - 1; i >= 0; i--)
                    this._remove(c.Get(i), i);
            }
        }
        Insert(c: JControl, i: number) {
            this._content.Insert(c as any, i);
            return this;
        }
        CloneChildren() { return this._content.CloneChildren(); }
        Check(c: JControl) {
            return c instanceof TemplateShadow;
        }
        public OnKeyDown(e: KeyboardEvent):boolean {
            if (e.keyCode == UI.Keys.Down)
                this.SelectedIndex++;
            else if (e.keyCode == UI.Keys.Up)
                this.SelectedIndex--;
            else if (e.keyCode == UI.Keys.End)
                this.SelectedIndex = Number.MAX_VALUE;
            else if (e.keyCode == UI.Keys.Home)
                this.SelectedIndex = -1;
            else return false;
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
    }

    export class Spinner extends JControl {
        private container: HTMLElement;
        private circle: HTMLDivElement;
        private message: HTMLParagraphElement;

        constructor(test) {
            super(document.createElement('div'));
        }
        initialize() {
            this.container = document.createElement('div');
            this.circle = document.createElement('div');
            this.message = document.createElement('p');
            this.message.textContent = 'Wait';

            this.applyStyle('full-fixedlayout');
            this.container.classList.add('spinner');
            this.circle.classList.add('spinner-circle');
            this.message.classList.add('spinner-message');

            this.container.appendChild(this.circle);
            this.container.appendChild(this.message);
            this._view.appendChild(this.container);

        }
        private isStarted = false;
        public Start(logo: string) {
            this.OnInitialized = (l) => l.circle.classList.add('spinner-start');
            this.Parent = Desktop.Current;
            this.OnInitialized = n => {
                this.Message = logo || 'Wait';
                document.body.appendChild(this.View);
            }
            this.isStarted = true;
        }
        public Pause() {
            if (this.isStarted) {
                this.Parent = null;
                this.circle.classList.remove('spinner-start');
                document.body.removeChild(this.View);
            }
            this.isStarted = false;
        }
        public set Message(v: string) { this.message.textContent = v; }
        public static Default: Spinner = new Spinner(undefined);
    }
    (() => {
        var e = document.getElementById('spinner');
        if (e) {
            e.parentElement.removeChild(e);
        }
        Spinner.Default.Start("Loadding");
    })();
    var t = Date.now();
    export class RichMenu<T> extends JControl {
        private menu: Div;
        private adapter: ListAdapter<T, any>;
        private itemTemplate: Template;
        constructor(itemTemplate?: conv2template, data?: T[], parent?: JControl) {
            super(document.createElement('div'));
            this._view.classList.add('full-fixedlayout1');
            this._view.addEventListener('click', this);

            if (itemTemplate)
                this.itemTemplate = Template.ToTemplate(itemTemplate, false);
            if (parent === void 0)
                this.Parent = UI.Desktop.Current;
            else this.Parent = parent;
            if (data)
                this.OnInitialized = rm => rm.Data = data;
        }
        handleEvent(e) {
            this.Close(true);
        }
        initialize() {
            this.menu = new Div().applyStyle('contextmenu', 'panel');            
            this.adapter = new ListAdapter<T,any>(document.createElement('div'), 'menu.simple').applyStyle('panel-body', 'verticalList');            
            this.adapter.ItemStyle = ['focusable'];
            this.adapter.AcceptNullValue = true;
            this.Add(this.menu.Add(this.adapter));
            this.menu.View.style.backgroundColor = '#333';
            this.menu.View.style.color = 'white';

            this.adapter.OnItemSelected.On = (x, k, j) => {
                if (k == -1) return;
                if (!this.isOpen) return;
                this.Close(true);
                if (this.i && j)
                    this.i.Invoke.call(this.i.Owner, this, j.getDataContext());
            }          
        

            this.menu.addEventListener('mouseleave', function (s, e, p) {
                p.Close(false);
            }, this);

            this.menu.addEventListener('mouseenter', function (s, e, p) {
                clearTimeout(p.timeout);
            }, this);

            this._view.style.zIndex = '2000000';

        }
        private timeout: number;
        private isOpen: boolean = false;
        
        private i: basic.ITBindable<(r: RichMenu<T>, si: T) => void>
        private toInt(b: boolean) { return b === false ? 0 : b == null ? -0.5 : -1; }
        public Open(e: MouseEvent, callback:basic.ITBindable<(r: RichMenu<T>, si: T) => void>,left:boolean,bottom:boolean) {
            if (this.isOpen == true) return;
            this.adapter.SelectedIndex = -1;
            this.menu.disapplyStyle('chide');
            var mn = this.menu.View;
            var v = this.menu.View.style;            
            e = { x: e.x, y: e.y } as any;            
            this.adapter.SelectedIndex = -1;
            document.body.appendChild(this._view);
            this.i = callback;
            this.isOpen = true;
            this.adapter.OnInitialized = n =>
                setTimeout(() => {
                    var l = (this.toInt(left) * mn.clientWidth + e.x);
                    var p = (this.toInt(bottom) * mn.clientHeight + e.y);
                    v.left = (l < 0 ? 0 : l) + px;
                    v.top = (p < 0 ? 0 : p) + px;
                }, 200);
        }
        public Close(imediate: boolean) {
            if (this.isOpen==false) return;            
            if (imediate)
            {
                this.isOpen = null;
                this.menu.applyStyle('chide');
                setTimeout(() => {
                    this.isOpen = false;
                    this._view.remove();
                }, 500);
                this.adapter.SelectedIndex = -1;
            }
            else
                this.timeout = setTimeout((p) => p.Close(true), 1500, this);
        }
        public set Data(items: any[]) {
            var a = this.adapter;
            if (a.Source) {
                a.Source.Clear()
                a.Source.AddRange(items);
            } else
                a.Source = new collection.List(Object, items);
        }
    }

    (window as any).rm = RichMenu;
    (window as any).rmt = () => {
        var rm = new RichMenu();
        
        rm.Parent = UI.Desktop.Current;
        rm.OnInitialized = rm => {
            rm.Data = ["File", "Save", "Close", "Discart"];
            document.addEventListener('click', function (e) {
                ii = (ii + 1) % lst.length;
                rm.Open(e, { Owner: null, Invoke: function (r, s) {  } }, lst[ii], lst1[ii]);
                e.stopPropagation();
                e.preventDefault();
            });
        }
        var lst = [null, null, null, true, true, true, false, false, false];
        var lst1 = [null, true, false, null, true, false, null, true, false];

        var ii = 0;
    }
    export interface IContextMenuItem {
        Title: string;
        Shortcut?: string;
        Icon?: string;
    }
   export enum Location {
        Left = 1,
        Top = 2,
        Right = 4,
        Bottom = 8,

        HCenter = Left | Right,
        VCenter = Top | Bottom,

        Center = VCenter | HCenter,
        TopLeft = Left | Top
    }
    export interface IContextMenuEventArgs<T> {
        ObjectStat?: any;
        e: MouseEvent;
        x: number;
        y: number;
        selectedItem?: T;
        cancel?: boolean;
        callback(e: IContextMenuEventArgs<T>);
    }

    export interface IContextMenu<T> {
        getTarget(): JControl;
        OnAttached(e: IContextMenuEventArgs<T>);
        OnClosed(result: T, e: IContextMenuEventArgs<T>): boolean;
        getView(): UI.JControl;
    }

   export class ExContextMenu extends JControl {
       public static DPTitle = bind.DObject.CreateField<string, ExContextMenu>('Title', String, 'Menu');
       public static DPItems = bind.DObject.CreateField<collection.List<IContextMenuItem>, ExContextMenu>('Items', collection.List);
       public Title: string;
       public Items: collection.List<IContextMenuItem>;
       static __fields__() { return [this.DPTitle, this.DPItems]; }
       private dic = new collection.Dictionary<TemplateShadow, any>('');
       private list = new UI.ListAdapter<IContextMenuItem, any>("templates.contextmenu", undefined, this, true);
       private static zIndex = 20000;
       public static get NextZIndex() { return ++this.zIndex; }
       constructor(items?: IContextMenuItem[]) {
           super(document.createElement('div'));
           this.Items = new collection.List<IContextMenuItem>(Object, items);
       }
       initialize() {
           this.applyStyle("fit");
           this.list.OnItemSelected.Add(this.OnItemSelected.bind(this));
           this.list.OnItemInserted.Add(this.OnItemInserted.bind(this));
           this.list.OnItemRemoved.Add(this.OnItemRemoved.bind(this));
           this.list.applyStyle('shadow')
           this._view.addEventListener('mousedown', this);
           this.Add(this.list);
       }
       private OnItemSelected(lst: UI.ListAdapter<IContextMenuItem, any>, i: number, tmp: UI.TemplateShadow, oldi: number, oldtmp: UI.TemplateShadow) {

       }
       private OnItemInserted(lst: UI.ListAdapter<IContextMenuItem, any>, i: number, data: IContextMenuItem, cnt: UI.TemplateShadow) {
           var t = { p: this, cnt: cnt, data: data, handleEvent: function (e) { this.p.Action(this.cnt, this.data, e); } };
           this.dic.Set(cnt, t);
           cnt.applyStyle('focusable');
           cnt.View.addEventListener('click', t);
       }

       private OnItemRemoved(lst: UI.ListAdapter<IContextMenuItem, any>, i: number, data: IContextMenuItem, cnt: TemplateShadow) {
           var t = this.dic.Get(cnt);
           var v = cnt.View;
           v.removeEventListener('click', t);
           this.dic.Remove(cnt);
       }
       private Action(cnt: TemplateShadow, data: IContextMenuItem, e: Event) {
           e.stopPropagation();
           e.preventDefault();
           this.OnAction.PInvok('', [this, data]);
           this.Close();
       }
       public OnAction = new bind.EventListener<(sender: this, selected: IContextMenuItem) => void>('', false);
       public location: Location = Location.TopLeft;
       ShowForTarget() {
           var v: any = this.target as any;
           v = v instanceof HTMLElement ? v : v instanceof JControl ? (<JControl>v).View:null;
           if (v == null) return;
           var x = v.offsetLeft + v.offsetWidth;
           var y = v.offsetTop + v.offsetHeight;
           this.Show(x, y + 7);
       }
       Show(x, y) {
           this.list.SelectedIndex = -1;
           var ths = this.list;
           this.disapplyStyle('hidden');
           this._view.style.zIndex = ExContextMenu.NextZIndex.toString();
           if (!this.parent)
               this.Parent = Desktop.Current;
           document.body.appendChild(this._view);
           this.OnInitialized = n =>
               thread.Dispatcher.call(n, () => {
                   var mn = this.list.View;
                   var l = (this.HorizontalFraction * mn.clientWidth + x);
                   var p = (this.VerticalFraction * mn.clientHeight + y);
                   var v = this.list.View.style;
                   var tv = this.list.View;
                   var wv = { w: this.View.clientWidth, h: this.View.clientHeight };
                   l = l < 0 ? 0 : l;
                   p = p < 0 ? 0 : p;

                   l = l + tv.clientWidth > wv.w ? wv.w - tv.clientWidth : l;
                   p = p + tv.clientHeight > wv.h ? wv.h - tv.clientHeight : p;

                   v.left = l + px;
                   v.top = p + px;
               });
       }
       private toInt(b: boolean) { return b === false ? 0 : b == null ? -0.5 : -1; }
       private get HorizontalFraction() {
           var v = this.location;
           if ((v & Location.HCenter) == Location.HCenter) return -0.5;
           if ((v & Location.Left) == Location.Left) return 0;
           return -1;
       }
       private get VerticalFraction() {
           var v = this.location;
           if ((v & Location.VCenter) == Location.VCenter) return -0.5;
           if ((v & Location.Top) == Location.Top) return 0;
           return -1;
       }
       handleEvent(e: MouseEvent) {
           switch (e.type) {
               case 'mousedown':
                   if (e.srcElement == this._view) this.Close();
                   return;
               case 'contextmenu':
                   this._OnContextMenu(this.target instanceof JControl ? this.target : null, this.target instanceof HTMLElement ? this.target : this.target.View, e);
                   return;
           }
       }

       private _OnContextMenu(target: JControl, dom: HTMLElement, e: MouseEvent) {
           this.Show(e.x, e.y);
           e.preventDefault();
           e.stopPropagation();
       }
       Close() {
           this.applyStyle('hidden');
           this._view.remove();
       }

       public set Target(v: JControl | HTMLElement) {
           if (this.target) {
               var ov = this.target instanceof HTMLElement ? this.target : this.target.View;
               ov.removeEventListener('contextmenu', this);
               this.target = null;
           }
           if (!v) return;
           var nv = v instanceof HTMLElement ? v : v.View;
           nv.addEventListener('contextmenu', this);
           this.target = v;
       }
       private target: JControl | HTMLElement;
   }

    export class ContextMenu extends JControl {
        private dic = new collection.Dictionary<CItem, MenuItem>('');
        public Items: collection.List<CItem>;
        constructor(items?: (CItem | string)[]) {
            super(document.createElement('div'));
            if (items)
                for (var i = 0; i < items.length; i++) {
                    var e = items[i] as any;
                    if (e instanceof MenuItem) continue;
                    var c = items[i] = new CItem(e, e, '#', null);
                    (c.Content as JControl).applyStyle('col-xs-12');

                }
            this.Items = new collection.List<CItem>(CItem, items as CItem[]);
        }
        initialize() {
            this.applyStyle('contextmenu');
            this.reset();
            this.Items.Listen = this.itemChangedDlg;
        }
        private itemChangedDlg: basic.ITBindable<(e: utils.ListEventArgs<number, CItem>) => void> = { Invoke: this.SourceChanged, Owner: this };

        private SourceChanged(e: utils.ListEventArgs<number, CItem>): void {
            switch (e.event) {
                case collection.CollectionEvent.Added:
                    this.add(e.newItem);
                    break;
                case collection.CollectionEvent.Replace:
                    this.replace(e.oldItem, e.newItem);
                    break;
                case collection.CollectionEvent.Removed:
                    this.remove(e.oldItem);
                    break;
                case collection.CollectionEvent.Cleared:
                    this.clear();
                    break;
                case collection.CollectionEvent.Reset:
                    this.clear();
                    this.reset();
                    break;
            }
        }
        private add(t: CItem) {
            var jc = new MenuItem(t).applyStyle('row');
            super.Add(jc);
            this.dic.Set(t, jc);
            t.OnItemSelected = this.OnItemSelected;
        }

        private OnItemSelected = function (m: MenuItem) {
            this.OnMenuItemSelected.Invoke(this.OnItemSelected, [this, m]);
        }.bind(this);
        public OnMenuItemSelected = new bind.EventListener<(s: ContextMenu, i: MenuItem) => void>(this.OnItemSelected);
        private remove(t: CItem) {
            super.Remove(this.dic.Remove(t), true);
        }
        private replace(o: CItem, n: CItem) {
            throw 'not implimented';
        }
        private clear() {
            var d = this.dic;
            for (var i = d.Count - 1; i >= 0; i--)
                super.Remove(this.dic.RemoveAt(i).Value, true);
        }
        reset() {
            for (var i = 0, l = this.Items.Count; i < l; i++) {
                var t = this.Items.Get(i);
                this.add(t);
            }
        }

        Add(j: JControl): this {
            throw '';
        }
        AddRange(citem: JControl[]): this {
            throw '';
        }
        Remove(j: JControl, dispose: boolean): boolean {
            return false;
        }
        Show(x, y) {
            this.disapplyStyle('hidden');
            var s = this._view.style;
            s.left = x + "px";
            s.top = y + "px";
            this._view.addEventListener('mouseout', this);
            this._view.addEventListener('mousein', this);
            if (!this.parent)
                this.Parent = Desktop.Current;
            document.body.appendChild(this._view);
        }
        private thrid;
        private dateout: Date;
        handleEvent(e: MouseEvent) {
            switch (e.type) {
                case 'mouseout':
                    break;
                case 'mousein':
                    clearTimeout(this.thrid);
                    break;
                case 'contextmenu':
                    this._OnContextMenu(this.target, this.target instanceof HTMLElement ? this.target:this.target.View, e);
                    break;
            }
        }

        private _OnContextMenu(target: JControl, dom: HTMLElement, e: MouseEvent) {
            this.Show(e.x, e.y);
            e.preventDefault();
            e.stopPropagation();
            
        }
        private timeout(t: this) {
            t.applyStyle('hidden');
            t._view.remove();
        }
        public set Target(v: JControl) {
            if (this.target) {
                var ov = this.target instanceof HTMLElement ? this.target : this.target.View;
                ov.removeEventListener('contextmenu', this);
                this.target = null;
            }
            if (!v) return;
            var nv = v instanceof HTMLElement ? v : v.View;
            nv.addEventListener('contextmenu', this);
            this.target = v;
        }
        private target: JControl;
    }

    export class Gage {
        initialize() {
        }
        public static deg2str(diam: number, n: number) {
            return n * (2 * Math.PI * diam) / 360;
        }
        public static createDashArray(diam: number, degs: number[]) {
            var t = '';
            var c = (2 * Math.PI * diam) / 360;
            for (var i = 0; i < degs.length; i++)
                t += (i !== 0 ? ',' : '') + (c * degs[i]) + 'px';
        }
    }

    export class CostumizedShadow extends TemplateShadow {
        public Controller;
        setDataContext(data) { this.data = data; this._view.textContent = (this._view as HTMLOptionElement).label = data ? data.toString() : ""; }
        getDataContext() { return this.data; }
        constructor(dom: HTMLOptionElement, private data?: any) {
            super(dom);
            this.setDataContext(this.data);
        }
        initialize() {
            this.setDataContext(this.data);
        }
        getScop() { return this.data instanceof bind.Scop ? this.data : null; }

    }
    export class CostumizedTemplate extends Template {
        constructor() { super(); }
        CreateShadow(data): TemplateShadow {
            return new CostumizedShadow(document.createElement('option'), data);
        }
    }
    export class ComboBox extends ListAdapter<any,any> {
        constructor(dom: HTMLSelectElement, DataSource: collection.List<any>) {
            super(dom || document.createElement('select'), new CostumizedTemplate());
            this.Source = DataSource;
        }
    }
    export class TreeComboBox<T> extends JControl {

        constructor(private tree: utils.Tree<T>, private getString: (v: T) => string) {
            super(document.createElement('select'));
        }
        initialize() {
            this.Reset();
        }
        public Reset() {
            var t = this.tree;
            t.Reset();
            var b = t.getBases();
            for (var i = 0; i < b.length; i++) {
                this.add(<HTMLSelectElement>this._view, b[i]);
            }
            this._view.innerHTML = this._view.innerHTML;
        }
        private add(cont: HTMLSelectElement | HTMLOptGroupElement, node: utils.Node<T>) {
            if (node.children.length === 0) {
                var t = document.createElement('option');
                t.label = this.getString(node.Value);
                t.textContent = t.label;
                node.param = t;
                cont.appendChild(t);
                return;
            }
            var pt = document.createElement('optgroup');
            pt.label = this.getString(node.Value);
            var t = document.createElement('option');
            t.label = this.getString(node.Value);
            t.textContent = t.label;
            //pt.appendChild(t);            
            node.param = [pt, t];
            for (var i = 0; i < node.children.length; i++)
                this.add(pt, node.children[i]);
            cont.appendChild(pt);
            
        }

        //TODO::
        /*
        function createCategory(parent: models.Category, name: any) {
                ii += 2300;
                var e = new models.Category(ii);
                (e as any).set(models.Category.DPName, name.toString());
                (e as any).set(models.Category.DPBase, parent);
                t.push(e);
                return e;
            }
            function testx() {
                var e = {
                    Achour: { Slimane: ["Brahim", "Hammou", "Bakir"] , Bahmed: ["Salim", "Slimane", "Amine"] },
                    Abismail: { a: "achour", b: "slimane" }, test:["Mohamed"],
                    Hani: ["Karim", "Khodir"]
                };
                l(t[0], 'root', e);
            }
            function m(parent: models.Category, any: Object | string) {
                if (typeof any === 'string') {
                    createCategory(parent, any);
                } else {
                    for (var i in any)
                        l(parent, i, any[i]);
                }
            }
            function l(parent: models.Category, name, any: Object | Array<any>) {
                var e: models.Category[] = [];
                if (any instanceof Array) {
                    for (var i = 0; i < any.length; i++)
                        m(parent, any[i]);
                    return;
                }
                var cat = createCategory(parent, name);
                m(cat, any);
            }

        */
    }

    export module help {
        export function createHeader<Owner>(hd: HTMLTableRowElement, cols: IColumnTableDef[], orderBy?: basic.ITBindable<(sender: Owner, orderBy: string, col: IColumnCellHeaderDef,view:HTMLTableHeaderCellElement) => void>) {
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (typeof col.Header === 'string')
                    col.Header = { Content: col.Header as any };
                var b = generateCell(col.Header, 'th');
                if (orderBy && col.Header && col.Header.OrderBy) {
                    var owner = {
                        handleEvent(e) {
                            this.method.Invoke.apply(this.method.Owner, [this.method.Owner, this.col.Header.OrderBy, this.col,this.view]);
                        }, method: orderBy, col: clone(col), view: b
                    };
                    b.addEventListener('click', owner);
                }
                hd.appendChild(b);
            }
            return hd;
        }
        export function createTemplate(cols: IColumnTableDef[],tmp?:HTMLTableRowElement) {
            tmp = tmp || document.createElement('tr');
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (typeof col.Header === 'string')
                    col.Header = { Content: col.Header as any };
                tmp.appendChild(generateCell(col.Cell, 'td'));
            }
            return tmp;
        }
        export function generateCell<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement>(h: IColumnCellDef<T>, stype: 'th' | 'td'): T {
            var type = HTMLTableCellElement;
            var hdr: T;
            if (h.Content == null) h.Content = "";
            if (h.Content instanceof type) {
                hdr = h.Content;
            }
            else if (h.Content instanceof Node) {
                hdr = document.createElement(stype) as any;
                /*if (h.TdAttributes)
                    applyAttrybute(hdr, h.TdAttributes);*/
                hdr.appendChild(h.Content);
            }
            else {
                hdr = document.createElement(stype) as any;
                h.ContentAsHtml ? (hdr.innerHTML = String(h.Content)) : (hdr.innerText = String(h.Content));
            }
            if (h.Attributes)
                applyAttrybute(hdr, h.Attributes);
            return hdr;
        }
        function applyAttrybute(hdr: Element, h: { [s: string]: IAttribute | string }) {
            for (var n in h) {
                var isb = false;
                var o = h[n];
                if (typeof o === 'object') {
                    if (hdr.hasAttribute(n)) {
                        var t = o.values.slice();
                        t.unshift(hdr.getAttribute(n));
                        hdr.setAttribute(n, t.join(o.spliter));
                    } else
                        hdr.setAttribute(n, o.values.join(o.spliter));
                } else hdr.setAttribute(n, o);
            }
        }
        export interface IAttribute {
            values: string[];
            spliter: string;
        }
        export interface IColumnCellDef<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement> {
            Attributes?: { [s: string]: IAttribute | string };
            TdAttributes?: { [s: string]: IAttribute | string };
            Content?: string | T | Node;
            ContentAsHtml?: boolean;
        }
        export interface IColumnCellHeaderDef extends IColumnCellDef<HTMLTableHeaderCellElement> {
            OrderBy?: string;
        }
        export interface IColumnCellDataDef extends IColumnCellDef<HTMLTableDataCellElement> {
        }

        export interface IColumnTableDef {
            Header: IColumnCellHeaderDef | string,
            Cell: IColumnCellDataDef,
            editable?: boolean
        }
    }
    export class _Grid  {
        constructor() {
            Grid;
        }
    }

}

export module UI {
    class Popup extends JControl {
        private _isOpen: boolean;
        constructor(private target: HTMLElement) {
            super(document.createElement('div'));
        }
    
        initialize() {
        }
        Close(valid) {
            this.applyStyle('ihide');
        }
        Open(acb: IAutoCompleteBox) {
            if (this._isOpen) return;
            this._isOpen = false;
            var l = this._view;
            l.classList.remove('ihide');

            var v = acb.View.getBoundingClientRect();
            l.style.left = v.left + "px";
            l.style.top = v.top + v.height + "px";
            l.style.width = v.width + "px";
            acb.Box.Text = (acb.Value || '').toString();
            acb.IsChanged = false;
        }
    }
}

export module UI {

    

    class ACBManager implements UI.IKeyboardController {
        owner?: any;
        private _isopen;
        IsOpen(v: boolean) {
            console.log('popup ' + (v ? 'open' : 'close'));
            this._isopen = v;
        }

        invoke(c: IKeyboardControllerEventArgs) {
            if (0) {
                var e = c.e;
                var kc = e.keyCode;
                if (!this._isopen) {
                    if (kc === 9 || kc === 13) return c.Result = KeyboardControllerResult.Release || KeyboardControllerResult.ByPass;
                    if (kc === 27) { this.box.Blur(); return KeyboardControllerResult.Release; }
                    else if (kc === UI.Keys.Delete) del(e);
                    else if (isControlKey(kc)) return KeyboardControllerResult.Handled;
                    else return this.Open(c);
                }
            }
            document.title = document.title !== "A" ? "A" : "B";
        }
        onResume?(e: IKeyboardControllerEventArgs): boolean {
            console.log('Resume');
            return true;
        }
        onPause?(e: IKeyboardControllerEventArgs): boolean {
            console.log('Pause');
            return true;
        }
        onStop?(e: IKeyboardControllerEventArgs): boolean {
            console.log('Stop');
            return true;

        }
        public FocuseOn(box: IAutoCompleteBox) {
            this.box = box;
            UI.Desktop.Current.KeyboardManager.GetController(this);
        }
        public Blur() {
            UI.Desktop.Current.KeyboardManager.Release(this);
        }
        private box: IAutoCompleteBox;
        del(e: KeyboardEvent) {
            if (e.shiftKey) {
                _ithis.Value = null;
                Close(true);
            }
        }



        Close(e: IKeyboardControllerEventArgs) {

        }
        Open(e: IKeyboardControllerEventArgs) {

        }
    }


    var list: ListAdapter<any, any>;
    var filtred: collection.ExList<any, filters.list.StringPatent<any>>;
    //var pager: collection.ExList<any, filters.list.SubListPatent>;

    var sf = new filters.list.LStringFilter();
    var tmp = document.createElement('li');
    tmp.innerHTML = '<div db-job="tostring"></div>'
    var defTemplate = UI.Template.ToTemplate(tmp, true);
    var fisc;

    var tm: number;
    var lto = false;
    function keyup() {
        list.SelectedIndex--;
        var sc = list.SelectedChild;
        if (sc) sc.View.scrollIntoView(false);
    }
    function keydown() {
        list.SelectedIndex++;
        var sc = list.SelectedChild;
        if (sc) sc.View.scrollIntoView(false);
    }
    function keyleft(e: KeyboardEvent, acb: typeof _ithis) {
        //if (e.ctrlKey) return pager.previouse();
        list.SelectedIndex -= 4;
        var sc = list.SelectedChild;
        if (sc) sc.View.scrollIntoView(false);
    }
    function keyright(e: KeyboardEvent, acb: typeof _ithis) {
        //if (e.ctrlKey) return pager.next();
        list.SelectedIndex += 4;
        var sc = list.SelectedChild;
        if (sc) sc.View.scrollIntoView(false);
    }

    function pageDown() {
        pager.next();
        //list.SelectedIndex += 8;
        //var sc = list.SelectedChild;
        //if (sc) sc.View.scrollIntoView(false);
    }
    function pageUp() {
        pager.previouse();
        //list.SelectedIndex -= 8;
        //var sc = list.SelectedChild;
        //if (sc) sc.View.scrollIntoView(false);
    }
    function del(e: KeyboardEvent) {
        if (!isclosed) return others(e);
        if (e.shiftKey) {
            _ithis.Value = null;
            Close(true);
        }
    }
    function enter() {
        if (isclosed) return;
        fisc = false
        return Close(true);
    }
    function esc() { fisc = false; Close(false); }
    function isControlKey(k) {
        if (k === 8) return false;
        return k < 32 || (k > 126 && k < 160);
    }

    function others(e: KeyboardEvent) {
        if (isControlKey(e.keyCode)) return;
        var lt = tm;
        var nt = Date.now();
        if (lto) return;
        setTimeout(() => {
            helper.TryCatch(filtred, function(filters) { this.Filter.Patent = new filters.list.StringPatent(_ithis.Box.Text || ''); },null, [filters]);
            //filtred.Filter.Patent = new filters.list.StringPatent(_ithis.Box.Text || '');
            lto = false;
            pager.update();
        }, 200);
        lto = true;
    }

    function initPopup() {
        var ex = document.createElement('ul');
        ex.classList.add('popup', 'ihide');
        list = new ListAdapter(ex, defTemplate);
        list.OnInitialized = (list) => list.Source = pager.List;
        list.Parent = Desktop.Current;
        document.body.appendChild(list.View);
    }
    var lt = Date.now();
    filtred = new collection.ExList<any, filters.list.StringPatent<any>>(null);
    filtred.Filter = sf;
    var pager = filters.list.indexdFilter(filtred, 15);
    

    initPopup();
    list.OnItemSelected.On = (s, i, t) => {
        if (i == -1) return;
        fisc = true;
        thread.Dispatcher.call(_ithis.Box.View, _ithis.Box.View.focus);
    };
    list.Content.addEventListener('click', (s, e, p) => {
        fisc = true;
        if (lt - (lt = Date.now()) < -500) return;
        else lt = 0;
        _ithis.Value = list.SelectedItem || _ithis.Value;
        fisc = false;
        Close(false);
    }, list);
    list.Content.View.addEventListener('pointerenter', () => clearTimeout(to));
    list.Content.View.onmouseleave = (e) => { if (!fisc) to = setTimeout(Close, 500, e); fisc = false; }

    var fns = {
        //9: tab,
        40: keydown,
        38: keyup,
        37: keyleft,
        39: keyright,
        //46: del,
        13: enter,
        27: esc,
        33: pageUp,
        34: pageDown,


    }
    function Init(acb: IAutoCompleteBox) {
        clearTimeout(to);
        UI.Desktop.Current.GetKeyControl(null, _onkeydown, [acb]);
        if (_ithis !== acb)
            resetEvents(acb);
    }

    function resetEvents(acb: typeof _ithis) {
        acb.IsChanged = false;
        _ithis = acb;
        filtred.Source = acb.DataSource;
        thread.Dispatcher.call(null, () => { filtred.Filter.Patent = new filters.list.StringPatent(acb.Box.Text); });


        if (okd) okd.Dispose();
        if (ofo) ofo.Dispose();

        tm = Date.now();
        lto = false;
        UI.Desktop.Current.GetKeyControl(null, _onkeydown, [acb]);
        ofo = _ithis.Box.addEventListener('focusout', onfocusout, null);
    }

    function relocate(acb: typeof _ithis) {
        var l = list.View;
        var v = acb.View.getBoundingClientRect();
        l.style.left = v.left + "px";
        l.style.top = v.top + v.height + "px";
        l.style.width = v.width + "px";
    }
    function onfocusout(s: Input, e: KeyboardEvent, acb: typeof _ithis) {
        clearTimeout(to);
        to = setTimeout(focusOutImediate, 500, false);
        fisc = false;
    }
    function focusOutImediate(valid: boolean) {
        UI.Desktop.Current.ReleaseKeyControl();
        Close(valid);
    }
    function _onkeydown(e: KeyboardEvent, acb: typeof _ithis): KeyboardControllerResult {
        relocate(acb);
        var kc = e.keyCode;
        if (isclosed)
            if (kc === 9 || kc === 13) return acb.View.hasAttribute('handleClose') ? KeyboardControllerResult.Handled : KeyboardControllerResult.Release || KeyboardControllerResult.ByPass;
            else if (kc === 27) { acb.View.blur(); return KeyboardControllerResult.Release; }
            else if (kc === UI.Keys.Delete) return del(e) as any;
            else if (isControlKey(kc)) return KeyboardControllerResult.Handled;
            else return Open(acb, true);
        else if (kc == 9) {
            fisc = false;
            Close(false);
            return KeyboardControllerResult.Release;
        }
        return (fns[e.keyCode] || others)(e, acb) || KeyboardControllerResult.Handled;
    }


    function Open(acb: IAutoCompleteBox, forceOpen: boolean): KeyboardControllerResult {
        Init(acb);
        if (acb.AutoPopup || forceOpen) {
            isclosed = false;
            list.Template = acb.Template || defTemplate;
            try {
                list.SelectedIndex = 0;
            } catch (e) {

            }
            var l = list.View;
            l.classList.remove('ihide');
            relocate(acb);
        }
        return KeyboardControllerResult.Handled;
    }
    function _Open(acb: IAutoCompleteBox, forceOpen: boolean) {
        Init(acb);
        if (acb.AutoPopup || forceOpen) {
            isclosed = false;
            try {
                list.SelectedIndex = 0;
            } catch (e) {

            }
            var l = list.View;
            l.classList.remove('ihide');
            relocate(acb);
        }
    }


    var isclosed = true;
    var to: number;
    var okd: basic.DomEventHandler<any, any>;
    var ofo: basic.DomEventHandler<any, any>;
    var _ithis: IAutoCompleteBox;
    var zindex = 100000;
    function Close(valid) {
        if (fisc) {
            fisc = false;
            return;
        }
        isclosed = true;
        list.applyStyle('ihide');

        if (valid == true)
            _ithis.Value = list.SelectedItem;
        if (valid) {
            _ithis.Box.Text = (_ithis.Value || '').toString();
        } else {
            if (_ithis.Value != null)
                _ithis.Box.Text = _ithis.Value.toString();
            else {
                _ithis.Box.Text = "";
            }
        }
        return _ithis.View.hasAttribute('handleClose') ? KeyboardControllerResult.Handled : KeyboardControllerResult.ByPass;
    }

    export interface IAutoCompleteBox {
        Box: Input;
        DataSource: collection.List<any>;
        View: HTMLElement;
        IsChanged: boolean;
        Value: any;
        PrintSelection?: boolean;
        AutoPopup: boolean;
        Blur();
        Template: ITemplate;
    }

    export class AutoCompleteBox extends ActionText implements IAutoCompleteBox {
        Box: Input;
        View: HTMLElement;
        PrintSelection?: boolean;
        Template: ITemplate;
        AutoPopup: boolean;
        private dataSource: collection.List<any> = new collection.List<any>(Object);
        public IsChanged: boolean;
        public get DataSource(): collection.List<any> { return this.dataSource; }
        public set DataSource(d: collection.List<any>) {
            if (d === this.dataSource) return;
            this.IsChanged
            this.dataSource.Clear();
            if (d)
                this.dataSource.AddRange(d.AsList());
        }
        constructor(input?: HTMLInputElement) {
            super(input);
            input.setAttribute('autocomplete', 'off');
        }
        initialize() {
            super.initialize();
            this.Box.View.addEventListener('focusin', (e) => { return Init(this); });
        }
        Value: any;
        Blur() {

        }
    }
    export declare type AutoCompleteCallback<T> = (box: IAutoCompleteBox, oldValue: T, newValue: T) => void;
    export class ProxyAutoCompleteBox<T> implements IAutoCompleteBox {
        Template: ITemplate;
        PrintSelection?: boolean;
        Blur() {
            this.Box.Blur();
        }
        AutoPopup: boolean;
        private callback: basic.ITBindable<AutoCompleteCallback<T>>[] = [];
        private _value: T;
        public DataSource: collection.List<any>;
        public OnValueChanged(owner: any, invoke: AutoCompleteCallback<T>) {
            this.callback.push({ Invoke: invoke, Owner: owner });
        }
        get View() { return this.Box.View; }
        set Value(v: T) {
            var ov = this._value;
            if (v == ov) return;
            this._value = v;
            this.Box.Text = v ? v.toString() : '';
            for (var t of this.callback)
                t.Invoke.call(t.Owner, this, ov, v);
        }
        get Value(): T { return this._value; }
        public IsChanged: boolean;
        constructor(public Box: Input, source: collection.List<T>) {
            Box.View.setAttribute('autocomplete', 'off');
            this.DataSource = source;
        }
        initialize() {
            this.Box.View.addEventListener('focusin', (e) => { return Init(this); });
            return this;
        }
    }

}
export module UI {
    export class Paginator<T> extends JControl {
        static InputScop: bind.Scop;
        private content: Div;
        private paginator: BiPagination;
        private paginationFilter: filters.list.SubListFilter<T>;
        public get Filter() { return this.paginationFilter; }
        constructor(public countPerPage: number, dom?: HTMLElement, private full?: boolean) {
            super(dom || document.createElement('div'));
            this.paginationFilter = new filters.list.SubListFilter<T>();
            this.paginationFilter.Patent = new filters.list.SubListPatent(0, this.countPerPage - 1);
            if (full) {
                var c = new collection.ExList<T, filters.list.SubListPatent>(Object);
                c.Filter = this.paginationFilter;
                this.set(Paginator.DPOutput, c);
            }
        }
        initialize() {
            this.applyStyle('paginator');
            
            super.Add(this.content = new Div().applyStyle('fitHeight'));
            super.Add(this.paginator = new BiPagination());
            this.paginator.OnPropertyChanged(BiPagination.DPIndex, this.whenIndexChanged, this);
            this.paginationFilter.Patent = new filters.list.SubListPatent(0, this.countPerPage - 1);
        }
        Refresh() {
        }
        private _cnt: JControl;
        public set Content(v: JControl) {
            if (this._cnt)
                this.content.Remove(this._cnt, true);
            this._cnt = v;
            if (v)
                this.content.Add(v);

        }
        private whenIndexChanged(b: bind.PropBinding, e: bind.EventArgs<number, BiPagination>) {
            this.paginationFilter.Patent = new filters.list.SubListPatent(e._new * this.countPerPage, (e._new + 1) * this.countPerPage - 1);
        }
        public OnIndexChanged(ev: (b: bind.PropBinding, e: bind.EventArgs<number, BiPagination>) => void) {
            return this.paginator.OnPropertyChanged(BiPagination.DPIndex, ev, this);
        }
        public OffIndexChanged(b: bind.PropBinding) {
            return this.paginator.removeEvent(BiPagination.DPIndex, b);
        }
        public set Max(v: number) { this.paginator.Max = v; }
        public get Max() { return this.paginator.Max; }
        public BindMaxToSourceCount(x: collection.List<any>) {
            this.bm2sc = x.OnPropertyChanged(collection.ExList.DPCount, function (s, e) { this.paginator.Max = Math.floor(e._new / this.countPerPage); }, this);
            this.paginator.Max = Math.floor(x.Count / this.countPerPage);
        }
        public UnbindMaxFromSourceCount(x: collection.List<T>) {
            if (this.bm2sc)
                x.removeEvent(collection.List.DPCount, this.bm2sc);
        }
        private bm2sc;
        public Next() {
            this.paginator.Index++;
        }
        public Previous() {
            this.paginator.Index--;
        }
        public OnKeyCombined(e: keyCominerEvent,v:IKeyCombinerTarget) {
            var s = this.Content;
            if (s) return s.OnKeyCombined(e,v);
        }
        public OnKeyDown(e: KeyboardEvent) {
            var c = this._cnt;
            if (c)
                if (c.OnKeyDown(e)) return true;
            switch (e.keyCode) {    
                case UI.Keys.Left:
                    this.Previous();
                    return true;
                case UI.Keys.Right:
                    this.Next();
                    return true;
            }
            return super.OnKeyDown(e);
        }


        public static DPInput = bind.DObject.CreateField<collection.List<any>, Paginator<any>>("Input", collection.List, null, Paginator.prototype.OnInputChanged);
        public Input: collection.List<T>;


        public static DPOutput = bind.DObject.CreateField<collection.ExList<any, filters.list.SubListPatent>, Paginator<any>>("Output", collection.ExList);
        public get Output(): collection.ExList<T, filters.list.SubListPatent> { return this.get(Paginator.DPOutput); }
        private bindInputToMax;
        private OnInputChanged(e: bind.EventArgs<collection.List<T>, Paginator<T>>) {
            if (e._old && this.bindInputToMax)
                e._old.removeEvent(collection.List.DPCount, this.bindInputToMax);
            this.bindInputToMax = null;
            this.Output.Source = e._new;
            if (e._new) {
                this.bindInputToMax = e._new.OnPropertyChanged(collection.ExList.DPCount, function (s, e) { this.paginator.Max = Math.floor(e._new / this.countPerPage); }, this);
                this.paginator.Max = Math.floor(e._new.Count / this.countPerPage);
            }
        }
        private bindScopToInput: bind.PropBinding;
        public set InputScop(scop: bind.Scop) {
            if (this.bindInputToMax) { (this.bindScopToInput.Owner as bind.Scop).removeEvent(bind.Scop.DPValue, this.bindScopToInput); this.bindScopToInput = null; }
            this.bindScopToInput = scop.OnPropertyChanged(bind.Scop.DPValue, (s, e) => {
                this.Input = e._new;
            }, scop);
            this.Input = scop.Value;
        }
        static __fields__() { return [this.DPInput, this.DPOutput]; }

        public static createPaginator<T, P>(adapter: ListAdapter<T, P>, dataSource: collection.List<T>, max: number = 10) {
            var paginator = new UI.Paginator<T>(max, undefined, true);
            paginator.OnInitialized = (p) => {
                adapter.OnInitialized = (l) => {
                    p.Input = dataSource;
                    l.Source = p.Output;
                }
                paginator.Content = adapter;
            };
            paginator.OnPropertyChanged(this.DPOutput, (s, e) => {
                adapter.Source = e._new; 
            });
            return paginator;
        }
    }
}

export module UI {
    export class Grid extends UI.JControl {
        initialize() {
            this._view.classList.add('grid');
        }
        private createRule() {
            var e = document.styleSheets.item(document.styleSheets.length - 1) as CSSStyleSheet;
            
        }
    }

}

export module UI {
    export interface IStrechyButtonItemData {
        Title: string;
        Icon?: string;
    }
    export class StrechyButtonItemData extends bind.DObject {

        public static DPTitle = bind.DObject.CreateField<string, StrechyButtonItemData>('Title', String, null);

        public static DPIcon = bind.DObject.CreateField<string, StrechyButtonItemData>('Icon', String, null);
        public Icon: string;

        static __fields__() { return [this.DPTitle, this.DPIcon]; }
        constructor(public Title: string) {
            super();
        }
    }


    export class StrechyButton extends UI.ListAdapter<IStrechyButtonItemData, collection.List<IStrechyButtonItemData>> {
        private triggerButton: HTMLElement;
        private listDom: HTMLDivElement;
        private itemTemplate;
        private IsOpen: boolean;
        constructor(private __data?: collection.List<IStrechyButtonItemData>) {
            super('controls.StretchyButton', 'controls.StretchyButtonItem');
        }

        initialize() {
            this.triggerButton = $('.cd-nav-trigger', this._view)[0];;
            this.triggerButton.addEventListener('click', this);
            this.Source = this.__data;
        }
        private static EventCloseIsRegistered: boolean;
        private static OpenedStrechyButtons: StrechyButton[] = [];
        private static RegisterEvents(enable: boolean) {
            if (this.EventCloseIsRegistered == enable) return;
            if (!enable)
                document.removeEventListener('click', this.handleEvent);
            else document.addEventListener('click', this.handleEvent);
            this.EventCloseIsRegistered = enable;
        }
        public static CloseAll(enableEvent: boolean) {
            for (var i = 0; i < StrechyButton.OpenedStrechyButtons.length; i++) {
                var x = StrechyButton.OpenedStrechyButtons[i];
                x.simpleClose();
            }
            StrechyButton.OpenedStrechyButtons = [];
            this.RegisterEvents(enableEvent);
        }

        public Open() {
            StrechyButton.CloseAll(true);
            StrechyButton.OpenedStrechyButtons = [this];
            this.simpleOpen();
        }
        public Close() {
            StrechyButton.CloseAll(false);
        }

        private simpleClose() {
            this.IsOpen = false;
            this._view.classList.remove('nav-is-visible');
            this._view.classList.add('cd-stretchy-nav-collapsed');
        }
        private simpleOpen() {
            this.IsOpen = true;
            this._view.classList.add('nav-is-visible');
            this._view.classList.remove('cd-stretchy-nav-collapsed');
        }
        public static handleEvent(event) {
            var target = event.target;
            var classList = target.classList;
            if (classList.contains('cd-nav-trigger')) return;
            if (classList.contains('cd-nav-trigger') || target.tagName === 'SPAN') return;
            StrechyButton.CloseAll(false);
        }
        public handleEvent(event: Event) {
            event.preventDefault();
            if (this.IsOpen)
                this.Close();
            else this.Open();
        }
    }
    export class UISearch extends UI.JControl {
        inputEl: HTMLInputElement;
        constructor(el: HTMLElement) {
            super(el);
            this.inputEl = el.querySelector('form > input.sb-search-input') as HTMLInputElement;
        }
        public OnSearch: (data: string) => void;
        initialize() {
            var initSearchFn = (ev) => this.validate(ev);
            this._view.addEventListener('click', initSearchFn);
            this._view.addEventListener('touchstart', initSearchFn);
            this.inputEl.addEventListener('click', function (ev) { ev.stopPropagation(); });
            this.inputEl.addEventListener('touchstart', function (ev) { ev.stopPropagation(); });
            this.inputEl.addEventListener('keydown', this);

        }
        handleEvent(e: KeyboardEvent) {
            if (e.keyCode == 13) {
                this.validate(e);
            } else if (e.keyCode == 27) {
                if (this.inputEl.value == "") this.close();
                else { this.inputEl.value = ""; e.stopImmediatePropagation(); e.preventDefault(); }
            }
        }
        private validate(ev: Event) {
            ev.stopPropagation();
            this.inputEl.value = this.inputEl.value.trim();
            if (!this._view.classList.contains('sb-search-open')) {
                ev.preventDefault();
                this.open();
            }
            else if (/^\s*$/.test(this.inputEl.value)) {
                ev.preventDefault();
                this.close();
            } else if (this.OnSearch)
                this.OnSearch(this.inputEl.value);

        }
        public IsOpen: boolean;
        open() {
            var self = this;
            this.applyStyle('sb-search-open');
            this.IsOpen = true;
            this.inputEl.focus && this.inputEl.focus();
            var bodyFn = function (ev) {
                self.close();
                this.removeEventListener('click', bodyFn);
                this.removeEventListener('touchstart', bodyFn);
            };
            document.addEventListener('click', bodyFn);
            document.addEventListener('touchstart', bodyFn);
        }
        close() {
            this.inputEl.blur();
            this.disapplyStyle('sb-search-open');
            this.IsOpen = false;
        }

    }

    export function showSPTooltips(v: boolean) {
        basic.Settings.set('show-sp-tooltips', v);
        if (v) document.body.classList.add('sp-show');
        else document.body.classList.remove('sp-show');
    }
    showSPTooltips(basic.Settings.get('show-sp-tooltips'));
}

export module UI.Modals {
    export function CreateGlyph(dom, icon, title, type, attri: any) {
        var t = document.createElement(dom);
        t.classList.add('btn', 'btn-' + type, 'glyphicon', 'glyphicon-' + icon);
        t.textContent = '  ' + title;
        for (var i in attri)
            t.setAttribute(i, attri[i]);
        return t;
    }
    export declare type EModalAction<T extends bind.DObject> = (sender: EModalEditer<T>, e?: ModalEditorEventArgs<T>) => void;
    export declare type EModalEditorHandler<T extends bind.DObject> = basic.ITBindable<EModalAction<T>>;

    export declare type ModalAction<T> = (product: T, isNew: boolean, err?: basic.DataStat, e?: MessageEventArgs) => boolean;
    export declare type ModalEditorResult<T> = basic.ITBindable<ModalAction<T>>;
    export type ModalListAction<T> = (s: ModalList<T>, selected: T, result: MessageResult, e: MessageEventArgs) => void;

    export class ModalEditorEventArgs<T extends bind.DObject>  {
        IsNew: boolean;
        Data: T;
        BackupData: BuckupList<T>;
        Owner?: any;
        CommitOrBackupHandled?: boolean;
        Editor: EModalEditer<T>;
        Error?: basic.DataStat;
        E: MessageEventArgs;
        IsDataChanged: boolean;
    }
    export declare type EModalEditorCallback<T extends bind.DObject> = reflection.Method<void, (s: EModalEditer<T>, e: ModalEditorEventArgs<T>) => void>;

    export abstract class BasicModalEditor<T extends bind.DObject> extends UI.Modal {
        static __fields__() { return [this.DPIsEditable]; }
        public static DPIsEditable = bind.DObject.CreateField<boolean, BasicModalEditor<any>>("IsEditable", Boolean, true);
        protected scop: bind.Scop = new bind.ValueScop(null, 3);
        public ChangedStatControled: boolean;
        public IsEditable: boolean;

        public set Data(v: T) {
            this.scop.Value = v;
        }
        public get Data() {
            return this.scop.Value;
        }
        OnKeyDown(e: KeyboardEvent) {
            return (this.Content && this.Content.OnKeyDown(e)) || super.OnKeyDown(e);
        }
    }

    export class EModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
        action: reflection.Method<void, (s: this, e: ModalEditorEventArgs<T>) => void>;
        constructor(private templateName: string, public allowEditNullVaue: boolean) {
            super();
        }
        initialize() {
            super.initialize();
            this.Content = new UI.TControl<T>(this.templateName, this.scop);
        }
        private IsNew: boolean;
        private backupData: BuckupList<T>;
        private _isOpen: boolean;
        public edit(data: T, isNew: boolean, action: EModalEditorCallback<T>, editable: boolean = true) {
            if (!data && !this.allowEditNullVaue) return;
            if (this.IsOpen || this._isOpen) throw new $Error("The editor is Open. Close it first .");
            this._isOpen = true;
            this.IsNew = isNew;
            if (data !== undefined)
                this.scop.Value = data;
            this.backupData = data && data.CreateBackup();
            this.action = action;
            this.IsEditable = editable;
            super.Open();
            this.SetVisible(MessageResult.ok, editable);
        }
        Open() {
            this.edit(this.scop.Value, this.IsNew, this.action);
        }
        Close(msg: MessageResult,) {
            var e = new MessageEventArgs(this, msg, MessageResult[msg]);
            var data = this.scop.Value as T;
            var e1: ModalEditorEventArgs<T> = {
                Data: data, BackupData: this.backupData, E: e, Editor: this, IsDataChanged: data&& data.IsPropertiesChanged(this.backupData),
                IsNew: this.IsNew, Error: basic.DataStat.None
            };
            reflection.Invoke(this.action, this, [this, e1]);
            if (data && this.backupData && !e1.CommitOrBackupHandled)
                if (e.msg == 'ok' && this.IsEditable)
                    data.Commit(e1.BackupData);
                else data.Rollback(e1.BackupData);
            var r = this.OnClosed.PInvok('test', [e], this);
            if (!e.stayOpen) this.silentClose();
        }
        NativeClose(msg: MessageResult,commit:boolean) {
            var e = new MessageEventArgs(this, msg, MessageResult[msg]);
            var t = this.scop.Value as T;
            if (t)
                if (this.backupData && commit)
                    t.Commit(this.backupData);
                else t.Rollback(this.backupData);
            this.OnClosed.PInvok('test', [e], this);
            if (!e.stayOpen) this.silentClose();
        }
        silentClose() {
            this._isOpen = false;
            super.silentClose();
        }
    }



    export class ModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
        constructor(private templateName: string) {
            super();
        }
        initialize() {
            super.initialize();
            this.Content = new UI.TControl<T>(this.templateName, this.scop);
            this.OnClosed.On = (e) => {
                var t = this.scop.Value as T;
                var action = false;           
                if (e.msg === 'ok' && this.IsEditable === true) {
                    if (this.ChangedStatControled || t.IsPropertiesChanged(this.backupData)) {
                        if (this.Action.OnSuccess)
                            action = this.Action.OnSuccess.Invoke.call(this.Action.OnSuccess.Owner, t, this.IsNew, e);

                        if (!action) t.Commit(this.backupData);
                        this.IsNew = false;
                        return;
                    }
                }
                if (this.Action.OnError) action = this.Action.OnError.Invoke.call(this.Action.OnError.Owner, t, this.IsNew, e);
                if (!action) t.Rollback(this.backupData);
            }
        }
        
        
        private IsNew: boolean;
        private backupData: BuckupList<T>;
        public edit(product: T, isNew: boolean, action: IEditorAction<T>,editable:boolean=true) {
            if (!product) return;
            this.IsNew = isNew;
            if (product !== undefined)
                this.scop.Value = product;
            this.backupData = product.CreateBackup();
            this.Action = action || emptyAction;
            this.IsEditable = editable;
            super.Open();
            this.SetVisible(MessageResult.ok, editable);
            //this.bok.Visible = editable;
        }
        Open() {
            this.edit(this.scop.Value, this.IsNew, this.Action);
        }
        private Action: IEditorAction<T>;
    }

    var emptyAction: IEditorAction<any> = {} as any;
    export interface IEditorAction<T> {
        OnSuccess?: ModalEditorResult<T>;
        OnError?: ModalEditorResult<T>;
    }
    export interface IEEditorAction<T extends bind.DObject> {
        OnSuccess?: EModalEditorHandler<T>;
        OnError?: EModalEditorHandler<T>;
    }
    export class EditorAction<T> implements IEditorAction<T>
    {
        private invoke(x: basic.ITBindable<(product: T, isNew: boolean) => boolean>, p: T, isNew: boolean) {
            if (x && x.Invoke) return x.Invoke.call(x.Owner, p, isNew, this.callback);
            return undefined;
        }
        OnSuccess: ModalEditorResult<T> = { Owner: this, Invoke: this.onSuccess }
        OnError: ModalEditorResult<T> = { Owner: this, Invoke: this.onError }
        constructor(private proxyAction: IEditorAction<T>, private callback: DBCallback<T>) {
        }

        onSuccess(p: T, isNew: boolean): boolean {
            return this.invoke(this.proxyAction.OnSuccess, p, isNew);
        }
        onError(p: T, isNew: boolean): boolean {
            return this.invoke(this.proxyAction.OnError, p, isNew);
        }

        public Clone(callback: DBCallback<T>) {
            return new EditorAction<T>(this.proxyAction, callback);
        }
        public static Create<T>(_this: any, onSuccess: ModalAction<T>, onError: ModalAction<T>, defaltCallback?: DBCallback<T>): EditorAction<T> {
            if (!onSuccess && !onError) return undefined;
            var t: IEditorAction<T> = {};
            if (onSuccess) t.OnSuccess = { Owner: _this, Invoke: onSuccess };
            if (onError) t.OnError = { Owner: _this, Invoke: onError };
            return new EditorAction(t, defaltCallback);
        }
    }

    export type DBCallback<T> = (data: T, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => void | boolean;

}

export module UI.Modals {
    export class ModalList<T> extends UI.Modal {
        private paginator: UI.Paginator<T>;
        private Datacontext: UI.ListAdapter<T, any>;
        constructor(private source: collection.List<T>, private tableTmplate: string, private itemTemplate: string, private datas?: any, private asScopic?: boolean, public isMatch?: (p: utils.IPatent<T>, item: T) => boolean) {
            super();
        }
        public static IsMatch<T>(p: utils.IPatent<T>, item: T):boolean {
            return p.Check(item);
        }
        public set IsMatch(v: (p: utils.IPatent<T>, item: T) => boolean) {
            if (this._exList) {
                var flt = this._exList.Filter as utils.CostumeFilter<T, utils.IPatent<T>>;
                if (flt._isMatch === v) return;
                flt._isMatch = v;
                this._exList.Reset();
                //thread.Dispatcher.call(this._exList, this._exList.Reset);
            }
            this.isMatch = v;
        }
        public get IsMatch() { return this.isMatch; }
        //private selectedItem;
        initialize() {
            super.initialize();
            var l = this.Datacontext = new UI.ListAdapter<T, any>(this.tableTmplate, this.itemTemplate, this.datas, this.asScopic);
            var p: UI.Paginator<T>;
            
            l.AcceptNullValue = true;
            if (this.isMatch)
                this.createFilter();
            var r1 = new Div().applyStyle('row');
            var r2 = new Div().applyStyle('row');
            var t = new UI.ActionText();
            t.AutoAction = UI.SearchActionMode.Instantany;
            
            var c1 = new Div().applyStyle('col-md-12', 'col-xs-12', 'col-sm-12');
            t.View.style.maxWidth = 'none';
            t.View.style.width = '100%';
            c1.View.style.padding = '0';
            c1.Add(t);
            r1.Add(c1);

            if (!this.asScopic) {
                this._exList = collection.ExList.New(this.source, new filters.list.BoundStringFilter());
                this.paginator = p = ModalList.createPaginator<T>(l, this._exList);
                r2.Add(p);
            } else {
                r2.Add(l);
            }

            this.Add(r1);
            this.Add(r2);
            t.OnAction.On = (l, o, n) => {
                this._exList.Filter.Patent = new filters.list.StringPatent(n);
            }

            l.OnItemSelected.On = (l, i, t) => this.SelectedItem = t && t.getDataContext();
        }

        private static createPaginator<T>(adapterView: UI.ListAdapter<T, any>,source:collection.List<T>) {
            var paginator = new UI.Paginator<T>(12, undefined, true);
            source = source || adapterView.Source;
            paginator.OnInitialized = (p) => {
                adapterView.OnInitialized = l => adapterView.Source = p.Output;
                paginator.Content = adapterView;
                paginator.Input = source;
            };
            return paginator;
        }
        public set SelectedItem(v: T) { this.Datacontext && this.Datacontext.SelectItem(v); }
        public get SelectedItem() { return  this.Datacontext && this.Datacontext.SelectedItem; }
        public show(onc: UI.Modals.ModalListAction<T>, list?: collection.List<T>) {
            if (list) this.OnInitialized = n => this._exList.Source = list;            
            this.onc = onc;
            super.Open();            
        }


        public set Source(l: collection.List<T>) {
            this.OnInitialized = n => n._exList.Source = l;
        }
        
        Open() { }
        public OnKeyCombined(e: keyCominerEvent,v:IKeyCombinerTarget) {
            return this.paginator.OnKeyCombined(e,v);
        }
        public OnKeyDown(e: KeyboardEvent) {
            if (!this.paginator.OnKeyDown(e))
                return super.OnKeyDown(e);
        }
        Close(msg) {            
            var c = this.onc;
            var s = this.SelectedItem;
            this.onc = null;
            super.Close(msg);
            try {
                this.Datacontext.SelectedIndex = -1;
            } catch (e) {

            }
            if (c)
                c.call(this, this, s, msg);
        }
        private onc: (s: this, i: T, result: MessageResult, e?: MessageEventArgs) => void;
        public _exList: collection.ExList<T, any>;
        private createFilter() {
            var v = this.Datacontext.Content.View;
            this._exList = new collection.ExList<T, utils.IPatent<T>>(Object);
            this._exList.Filter = new utils.CostumeFilter(this.IsMatch);
            var spec = basic.New() + '';
            v.setAttribute('db-filter', spec);
            bind.RegisterFilter({
                Name: spec, BindingMode: 1, CreateNew: (p, f, s) => {
                    
                    return new filters.scopic.ListFilter(p, 1, null, this._exList);
                }
            });
        }

    }
}


export module UI {
    export interface ITabControlData<OwnerClassType,ContentType> {
        Title: string;
        Content: ContentType;
        OnSelected?(sender: OwnerClassType, item: this);
    }
    export interface ITabControlItem extends ITabControlData<TabControl, JControl> {
        Title: string;
        Content: JControl;
        OnSelected?(sender: TabControl, item: this);
    }

    export class TabControl extends UI.NavPanel {

        public static DPItems = bind.DObject.CreateField<collection.List<ITabControlItem>, TabControl>("Items", collection.List);
        public Items: collection.List<ITabControlItem>;


        private static DPTabNav = bind.DObject.CreateField<UI.ListAdapter<any, any>, TabControl>("TabNav", UI.ListAdapter);
        private TabNav: UI.ListAdapter<ITabControlItem, any>;

        private static DPTabContent = bind.DObject.CreateField<UI.ContentControl, TabControl>("TabContent", UI.ContentControl);
        private TabContent: UI.ContentControl;


        public static DPSelectedItem = bind.DObject.CreateField<ITabControlItem, TabControl>("SelectedItem", Object, null, (e) => { e.__this.TabNav.SelectedIndex = e.__this.Items.IndexOf(e._new); });
        public SelectedItem: ITabControlItem;

        static __fields__() { return [this.DPItems, this.DPSelectedItem, this.DPTabContent, this.DPTabNav] as any; }

        initialize() {
            super.initialize();
            this.TabNav = new UI.ListAdapter('tabcontrol.navTabsItem', undefined);
            this.TabContent = new UI.ContentControl().applyStyle('tab-content');
            this.TabNav.AcceptNullValue = false;
            super.Add(this.TabNav);
            super.Add(this.TabContent);
            this.TabNav.OnItemSelected.On = (n, ind, indCNT, oind, oindCNT) => this.onSelectedTabChanged(ind, oind, indCNT, oindCNT);
            this.TabNav.OnInitialized = n => {
                n.Source = this.Items;
                thread.Dispatcher.call(this, function (this: ListAdapter<any, any>) { this.SelectedIndex = 0; });
            }
        }
        OnBringIntoFront() {
            this.TabNav.SelectedIndex = 0;
        }
        constructor(name: string, caption: string, items: ITabControlItem[]) {
            super(name, caption);
            this.Items = new collection.List(Object, items);
        }
        private onSelectedTabChanged(newIndex: number, oldIndex: number, newChild: TemplateShadow, oldChild: TemplateShadow) {
            var si = this.Items.Get(newIndex);
            if (si) {
                this.TabContent.Content = si.Content;
                if (si.OnSelected)
                    si.OnSelected(this, si);
            } else this.TabContent.Content = null;
            this.SelectedItem = si;
        }
        private Reslect() {
            var si = this.TabNav.SelectedItem;
            if (si) {
                this.TabContent.Content = si.Content;
                if (si.OnSelected)
                    si.OnSelected(this, si);
            } else this.TabContent.Content = null;
            this.SelectedItem = si;
        }
        public OnKeyCombined(e: keyCominerEvent,v:IKeyCombinerTarget) {
            var s = this.SelectedItem;
            if (s) return s.Content && s.Content.OnKeyCombined(e,v);
        }
        OnKeyDown(e: KeyboardEvent) {
            var s = this.SelectedItem;
            if (e.ctrlKey) {
                var i = e.shiftKey ? 1 : -1;
                switch (e.keyCode) {
                    case UI.Keys.Left:
                        this.TabNav.SelectedIndex += i;
                        return true;
                    case UI.Keys.Right:
                        this.TabNav.SelectedIndex -= i;
                        return true;
                }
            }
            if (s && s.Content) return s.Content.OnKeyDown(e);
        }
        CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events) {
            var x = (dt.controller.MainControll as UI.ScopicTemplateShadow).getDataContext();
            if (x) {
                this.Items.Remove(x);
            }
        }
    }

    export class UniTabControl<T> extends UI.NavPanel {

        public static DPItems = bind.DObject.CreateField<collection.List<ITabControlData<UniTabControl<any>, any>>, UniTabControl<any>>("Items", collection.List);
        public Items: collection.List<ITabControlData<this, T>>;


        private static DPTabNav = bind.DObject.CreateField<UI.ListAdapter<ITabControlData<UniTabControl<any>, any>, any>, UniTabControl<any>>("TabNav", UI.ListAdapter);
        private TabNav: UI.ListAdapter<ITabControlData<this, T>, any>;

        private static DPTabContent = bind.DObject.CreateField<UI.ContentControl, UniTabControl<any>>("TabContent", UI.ContentControl);
        private TabContent: UI.ContentControl;


        public static DPSelectedItem = bind.DObject.CreateField<ITabControlData<UniTabControl<any>, any>, UniTabControl<any>>("SelectedItem", Object, null, (e) => { e.__this.TabNav.SelectedIndex = e.__this.Items.IndexOf(e._new); });
        public SelectedItem: ITabControlData<this, T>;

        static __fields__() { return [this.DPItems, this.DPSelectedItem, this.DPTabContent, this.DPTabNav] as any; }

        initialize() {
            super.initialize();
            this.TabNav = new UI.ListAdapter('unitabcontrol.navTabsItem', undefined);
            this.TabContent = new UI.ContentControl().applyStyle('tab-content');
            this.TabNav.AcceptNullValue = false;
            super.Add(this.TabNav);
            super.Add(this.TabContent);
            this.TabNav.OnItemSelected.On = (n, ind, indCNT, oind, oindCNT) => this.onSelectedTabChanged(ind, oind, indCNT, oindCNT);
            this.TabNav.OnInitialized = n => { n.Source = this.Items; n.SelectedIndex = 0; }            
            this.TabContent.Content = this.content;
            this.Items.Listen = (t) => {
                if (t.event == collection.CollectionEvent.Removed) {
                    var e: ITabControlEventArgs<T> = <ITabControlEventArgs<T>>{ Sender: <UniTabControl<T>>this, Cancel: false, Stat: 'closed', Target: t.newItem as any };
                    this.OnTabClosed.PInvok(0, [e]);
                }
            }
        }
        constructor(name: string, caption: string, items: collection.List<ITabControlData<UniTabControl<T>, T>>, private content: JControl, private onSelectedItemChanged: (s: UniTabControl<T>, cnt: JControl, selected: ITabControlData<UniTabControl<T>, T>) => string) {
            super(name, caption);
            this.Items = items;
        }
        private onSelectedTabChanged(newIndex: number, oldIndex: number, newChild: TemplateShadow, oldChild: TemplateShadow) {
            var si = this.Items.Get(newIndex);
            if (si && this.content) {
                this.content.Visible = true;
                this.TabContent.Content = this.content;
                si.Title = this.onSelectedItemChanged(this, this.content, si);
                if (si.OnSelected)
                    si.OnSelected(this, si);

            } else this.TabContent.Content = null;
            this.SelectedItem = si;
        }
        public OnKeyCombined(e: keyCominerEvent,v:IKeyCombinerTarget) {
            var s:any = this.SelectedItem;
            s = s.Content;
            if (s instanceof JControl) return s.OnKeyCombined(e,v);
        }
        OnKeyDown(e: KeyboardEvent) {
            var s = this.SelectedItem;
            if (e.ctrlKey) {
                var i = e.shiftKey ? 1 : -1;
                switch (e.keyCode) {
                    case UI.Keys.Left:
                        this.TabNav.SelectedIndex += i;
                        return true;
                    case UI.Keys.Right:
                        this.TabNav.SelectedIndex -= i;
                        return true;
                }
            }
            if (this.content) return this.content.OnKeyDown(e);
        }
        CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events) {
            var x = (dt.controller.MainControll as UI.ScopicTemplateShadow).getDataContext();
            if (x) {
                var ex: ITabControlEventArgs<T> = <ITabControlEventArgs<T>>{ Sender: <UniTabControl<T>>this, Cancel: false, Stat: 'closing', Target: x };
                this.OnTabClosed.PInvok(0, [ex]);
                if (ex.Cancel) return;
                this.Items.Remove(x);
                if (x.Dispose) x.Dispose(true);
            }
        }
        
        OnTabSelected = new bind.EventListener<(e: ITabControlEventArgs<T>) => void>(0);
        OnTabClosed = new bind.EventListener<(e: ITabControlEventArgs<T>) => void>(0);
        GetLeftBar() {
            if ((this.content as NavPanel).GetLeftBar) return (this.content as NavPanel).GetLeftBar();
        }
        GetRightBar() {
            if ((this.content as NavPanel).GetRightBar) return (this.content as NavPanel).GetRightBar();
        }
        OnPrint() {
            if ((this.content as NavPanel).OnPrint) return (this.content as NavPanel).OnPrint();
            else super.OnPrint();
        }
        Update() {
            if ((this.content as NavPanel).Update) return (this.content as NavPanel).Update();
            else super.Update();
        }
       
        public OnSearche(oldPatent: string, newPatent: string) {
            if ((this.content as NavPanel).OnSearche) return (this.content as NavPanel).OnSearche(oldPatent, newPatent);
        }
        OnDeepSearch() {
            if ((this.content as NavPanel).OnDeepSearch) return (this.content as NavPanel).OnDeepSearch();
        }
        get HasSearch() {
            var x = (this.content as NavPanel).HasSearch;
            if (x == undefined) return;
            return x;
        }
    }
    export interface ITabControlEventArgs<T> {
        Sender: UniTabControl<T>;
        Cancel: boolean;
        Target: ITabControlData<ITabControlData<UniTabControl<T>, T>, T>;
        Stat: 'opened' | 'closing' | 'closed';
    }

    export class TabControlItem<OwnerType, ContentType> extends bind.DObject implements ITabControlData<OwnerType, ContentType> {

        public static DPTitle = bind.DObject.CreateField<string, TabControlItem<any, any>>("Title", String);

        public static DPContent = bind.DObject.CreateField<any, TabControlItem<any, any>>("Content", Object);
        static __fields__() { return [this.DPContent, this.DPTitle]; }

        constructor(public Title: string, public Content: ContentType) {
            super();
        }
    }
}

module init {
    const layout: IApplyStyle[] = [];

    function for_each(e: ScopicControl.ControlCreatorEventArgs) {
        if (e.dom.hasAttribute('as-pager')) {
            e.dom.removeAttribute('as-pager');
            return createPaginator(e);
        }
        var x = new UI.ListAdapter(e.dom, undefined, e.parentScop);
        x.BindTo(e.currentScop);
        e.Result = x;
        return x;
    }
    function createPaginator(e: ScopicControl.ControlCreatorEventArgs) {
        var dom = e.dom as HTMLElement;
        if (dom.hasAttribute('as-pager'))
            dom.removeAttribute('as-pager');
        dom.setAttribute('compiled', '');
        var count: string | number = dom.getAttribute('count-per-page');
        count = count ? parseInt(count) || 24 : 24;
        var p = new UI.Paginator(count, dom, true);
        p.Parent = e.parentControl || UI.Desktop.Current;
        p.InputScop = e.currentScop;
        var fdom = $('[db-content]', dom)[0] as HTMLElement;
        if (fdom && fdom !== dom) {
            dom.removeAttribute('db-content');
            var output = bind.Scop.Create('Output', p, bind.BindingMode.TwoWay, e.controller);
            if (!fdom.hasAttribute('db-foreach')) fdom.setAttribute('db-foreach', '');
            var iscp = e.controller.CompileChild(fdom, output, p);
            //var l = for_each(name, fdom, output, scop, p, controller, e);
            var l = iscp.Control;
            if (!l) l = new UI.Dom(iscp.dom as any || fdom);
            p.Content = l;
        }
        return p;
    }

    ScopicControl.register('foreach', for_each);
    ScopicControl.register('pager', createPaginator);
    ScopicControl.register('adapter', for_each);
    function x() { }
    interface IApplyStyle {
        A: Element;
        B: string[];
        C?: boolean;
    }

    export function RegisterLayout(View: Element, classList: IArguments, remove?: boolean) {
        if (thread.Dispatcher.InIdle()) thread.Dispatcher.call(null, x);
        layout.push({ A: View, B: classList as any, C: remove });
    }
    function apply() {
        var layout1 = layout.splice(0);
        for (var i = 0; i < layout1.length; i++) {
            var l = layout1[i];
            if (l.C)
                l.A.classList.remove.apply(l.A.classList, l.B);
            else l.A.classList.add.apply(l.A.classList, l.B);
        }
        if (layout.length !== 0) apply();
    }
    function animation() {
        apply();
    }
    thread.Dispatcher.OnIdle(null, apply);
    //ValidateImport(ui_tmplates);

    export function loadCss(callback?, onerror?) {
        var csses = ["../assets/style/bundle.css"
            //: '../assets/style/bootstrap.min.css', '../assets/style/bootstrap-override.css',
            //'../assets/style/app.css', '../assets/style/hbar.css', '../assets/style/aapp.css', '../assets/style/site.css'
        ];
        for (var i of csses)
            require('style|' + i, callback, onerror, context);
    }
    //requestAnimationFrame(animation);
}
export var LoadDefaultCSS = (callback?, onerror?) => { init.loadCss(callback, onerror); }