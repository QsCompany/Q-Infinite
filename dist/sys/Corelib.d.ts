/// <reference path="../../qloader.d.ts" />
import { UI } from './UI';
import { models } from './QModel';
import { Parser } from './Syntaxer';
export declare type GFunction = Function | reflection.GenericType | reflection.DelayedType;
export declare namespace Common {
    var Message: models.Message;
    var Math: any;
    class RichMenu {
    }
}
export declare namespace TemplateTypes {
    function RichMenu(): void;
}
export declare namespace css {
    var cssRules: any[];
    class CSSRule {
        constructor(cssrule: any, parent: any);
        Dispose(): void;
        readonly Selectors: any;
        IsMatch(selector: any): void;
    }
    function collectCss(): void;
    function getVar(name: string): void;
    function toValidCssName(c: any): any;
    function toValidEnumName(c: any): any;
    function Css2Less<T>(css: string, callback: (less: string, param: T) => void, param: T): void;
    namespace animation {
        interface animateProperties<T> {
            dom: HTMLElement;
            props: propValues<T>[];
            oncomplete?(e: this): any;
            onstart?(e: this): any;
            timespan: number;
            start?: number;
            cursor?: number;
            thread?: number;
            interval?: number;
            stat?: T;
        }
        interface animations {
            animations: animateProperties<any>[];
            thread?: number;
            timespan: number;
            interval?: number;
        }
        interface propValues<T> {
            func?: (cur: number) => number;
            name: string;
            animate(e: animateProperties<T>): void;
            oncomplete?(e: animateProperties<T>): void;
            val?: any;
        }
        function animate<T>(anim: animateProperties<T>): animateProperties<T>;
        function animates<T>(anim: animations): animations;
        function stopAnimation<T>(e: animateProperties<T>): animateProperties<T>;
        function stopAnimations(e: animations): animations;
        interface cssDebugger {
            elements: {
                dom: HTMLElement;
                result: any[];
            }[];
            attrs: string[];
            interval: number;
            thread: number;
            timespan: number;
        }
        function trigger(prop: string, from: number, to: number, finalvalue?: string, suffx?: string): propValues<any>;
        namespace constats {
            var hideOpacity: propValues<any>;
            var showOpacity: propValues<any>;
        }
    }
}
export declare namespace math {
    function round1(_n: any, x: any): string;
    function round(_n: any, x: any): string;
}
export declare namespace string {
    function IsPrintable(keyCode: number, charCode: number): boolean;
}
export declare namespace helper {
    function TryCatch<T>(owner: any, Try: (...args: any[]) => T, Catch?: (e: Error, ...args: any[]) => T, params?: any[]): T;
}
export declare namespace basic {
    namespace Settings {
        function get(name: any): any;
        function set(name: any, value: any): void;
    }
    enum DataStat {
        Fail = 0,
        Success = 1,
        OperationCanceled = 2,
        UnknownStat = 3,
        DataCheckError = 4,
        DataWasChanged = 16,
        None = 5
    }
    namespace polyfill {
        var supportTemplate: boolean;
        function IsTemplate(x: any): boolean;
    }
    var host: any;
    interface ICrypto {
        Encrypt(data: Uint8Array | number[]): (Uint8Array | number[]);
        Decrypt(data: Uint8Array | number[]): (Uint8Array | number[]);
        SEncrypt(data: string): string;
        SDecrypt(data: string): string;
    }
    const Crypto: ICrypto;
    function setGuidRange(start: number, end: number): void;
    function New(): number;
    class GuidManager {
        vars: any;
        static readonly current: number;
        constructor(vars: any);
        static readonly isValid: boolean;
        static readonly Next: number;
        static New<T>(callback: (id: number, param: T) => void, pram: T): void;
        static t: net.WebRequest;
        static isLoading: boolean;
        static update<T>(callback?: (id: number, param: T) => void, pram?: T): void;
    }
    function isFocused(v: Element): boolean;
    class focuser {
        bound: HTMLElement;
        private andButton;
        focuse(rebound: boolean, toPrev: boolean): any;
        constructor(bound: HTMLElement, andButton: boolean);
        _focuseOn(v: Element): Element;
        getNext(p: Element): any;
        _focuseNext(v: Element, array: Element[]): any;
        getPrev(p: Element): any;
        _focusePrev(v: Element, array: Element[]): any;
        focusePrev(rebound: boolean): any;
        focuseNext(rebound: boolean): any;
        reFocuseOn(): any;
        focusOn(): any;
    }
    function focuseOn(v: HTMLElement): boolean;
    function _focuseOn(v: HTMLElement): boolean;
    function focuseNext(v: Element): any;
    interface IRef<T> {
        value: T;
        aux?: any;
    }
    interface IEventHandler extends IDisposable {
        Started: boolean;
        Start(): any;
        Pause(): any;
        Dispose(): any;
        Reset(): any;
    }
    interface Module {
    }
    interface IContext {
        CanAccessToMe(type: string, folder: string, name: string): any;
        GetPath(path: string): string;
        NameOf(type: Function): string;
        GetType(path: string): Function;
    }
    interface IDisposable {
        Dispose(force?: boolean): any;
    }
    interface IBindable {
        Owner?: any;
        Invoke(...args: any[]): any;
    }
    interface ITBindable<T extends (...args: any[]) => void> extends IBindable {
        Invoke: T;
    }
    type Invoker<T extends (...args: any[]) => void> = ITBindable<T> | T;
    interface IOnDisposing extends IDisposable {
        OnDisposing: (s: this) => void;
        Dispose(): any;
    }
    interface IDelegate extends IDisposable, EventListenerObject, IBindable {
        handleEvent(...args: any[]): void;
    }
    class Delegate<T> implements IDelegate {
        Owner: T;
        Invoke: (...args: any[]) => void;
        private _dispose;
        objectStat?: any;
        constructor(Owner: T, Invoke: (...args: any[]) => void, _dispose: (ihe: Delegate<T>) => void, objectStat?: any);
        handleEvent(...args: any[]): void;
        Dispose(): void;
    }
    interface IValueCheck {
        [s: string]: (v: any) => boolean;
    }
    interface IJob {
        Name: string;
        Todo?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        Check?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnError?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing?(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
    }
    class Rectangle {
        private _x;
        Left: number;
        private _y;
        Top: number;
        private _w;
        Width: number;
        private _h;
        Height: number;
        private OnChanged;
        private _onchanged;
        constructor();
        Set(left: number, top: number, width: number, height: number): void;
    }
    interface EqualInterface {
        Equals(o: Object): boolean;
    }
    interface scopCollection {
        [s: string]: bind.Scop;
    }
    class SessionId {
        static Id: number[];
        readonly Data: number[];
        constructor(guid: string);
        static parse(guid: string): void;
    }
    class iGuid implements EqualInterface {
        static Empty: iGuid;
        private _id;
        readonly Id: string;
        constructor(g: string);
        Equals(o: any): boolean;
        toString(): string;
        private static FromNumber;
        static readonly New: iGuid;
    }
    interface IId {
        Id: number;
    }
    class EnumValue {
        Name: string;
        Value: number;
        constructor(Name: string, Value: number);
        toString(): string;
        static GetValue(lst: collection.List<EnumValue>, n: number | string): EnumValue;
    }
    function getEnum(enumPath: string, enumValue?: Object): collection.List<EnumValue>;
    interface SIndex {
        Name: string;
        Index: number;
    }
    function CompileString(s: string, getString?: (value: any, param: any) => string, params?: any): StringCompile;
    class CodeCompiler {
        private script;
        constructor();
        private toRegString;
        private static params;
        generateFn(stack: (string | Parser.ICode)[], hasNoReturn?: boolean): IReg;
        private _push;
        push(code: string | string[]): any[] | IReg;
        Compile(): void;
        reset(): void;
        private _onload;
        private _onerror;
        private OnFnSuccess;
        onFnLoad: (fn: Function, t: IReg) => void;
        onload: (t: this) => void;
        onerror: (t: this) => void;
        remove(t: IReg): void;
    }
    class EvalCode {
        static Compile(code: string, callback?: Function, onerror?: Function, stat?: any): void;
        static CompileExpression(expression: string, params: string[], callback?: (exprFn: Function, stat: any) => void, stat?: any, exludeReturn?: boolean): void;
    }
    interface IReg {
        name: string;
        stat?: any;
        callback: (exprFn: Function, IReg: this) => void;
        onError?: (stat: any) => void;
        code: string;
        evalCode?: Function;
        IsString?: boolean;
    }
    class StringCompile {
        protected indexer: (string | SIndex)[];
        private getString;
        params: any;
        constructor(indexer: (string | SIndex)[], getString: (name: string, value: any) => string, params: any);
        private static generateIndexer;
        static Compile(s: string, getString?: (name: string, value: any) => string, params?: any): StringCompile;
        apply(data: any): string;
        bind(data: bind.DObject): void;
        private data;
        private onDataChanged;
        Value: string;
    }
    interface Stat {
        Data: any;
        Back(): any;
        Go(): any;
        Forward(): any;
    }
    class History {
        private index;
        private stats;
        Push(stat: Stat): void;
        goBack(): void;
        goForward(): void;
        readonly Current: Stat;
        private Index;
    }
    namespace Routing {
        namespace history {
            var supported: boolean;
            var fallback: null;
            var initial: {
                popped: boolean;
                URL: string;
            };
            function pushState(state: any, title: any, path: any): void;
            function popState(event: any): void;
            function listen(fallback: any): void;
        }
        namespace Path {
            function map(path: any): any;
            function root(path: any): void;
            function rescue(fn: any): void;
            function match(path: string, parameterize?: any): any;
            function dispatch(passed_route: string): boolean;
            function listen(): void;
            namespace core {
                class route {
                    path: string;
                    action: any;
                    do_enter: any[];
                    do_exit: any;
                    params: {};
                    constructor(path: string);
                    to(fn: any): this;
                    enter(fns: any): this;
                    exit(fn: any): this;
                    partition(): any[];
                    run(): void;
                }
            }
            var routes: {
                'current': any;
                'root': any;
                'rescue': any;
                'previous': any;
                'defined': {};
            };
        }
    }
    interface IUrl {
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
    class Url implements IUrl {
        private _path;
        moduleType: ModuleType;
        host: string;
        moduleName: string;
        ext: string;
        getEName(defaultExt?: string): string;
        params: string;
        IsFolder: boolean;
        constructor(url?: string);
        toString(): string;
        private init;
        static getHost(url: string): [string, string[]];
        static getFullHost(url: string): [string, string[]];
        Combine(path: string | Url): Url;
        readonly IsExternal: boolean;
        readonly isAsset: boolean;
        path: string[];
        readonly FullPath: string;
        SameHostAs(url: Url): boolean;
        static RevalidatePath(ary: string[], isFullPath?: boolean): void;
        intersect(url: Url): Url;
        readonly IsInternal: boolean;
        static rootUrl: Url;
    }
}
export declare namespace query {
    type selector = (t: _$, node: Node, param: any) => boolean;
    interface _$ {
        detach(): this;
        insertBefore(thisDom: Node): this;
        insertAfter(thisDom: Node): this;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        find(selector: selector, param: any): __;
        add(dom: Node | Node[]): any;
        toggleClass(calssName: string): any;
        siblings(selector: selector, param: any): __;
        appendTo(dom: Node): any;
        length: number;
        submit(): any;
        parent(selector: selector, param: any): _$;
        hasClass(className: string): boolean;
        removeClass(className: string): this;
        addClass(className: string): this;
        eq(n: number): _$;
        toArray(): Node[];
    }
    function hasClass(t: _$, d: Node, param: string): boolean;
    function hasTag(t: _$, d: Node, param: string): boolean;
    class __ implements _$ {
        private dom;
        eq(n: number): _$;
        removeClass(className: string): this;
        addClass(className: string): this;
        hasClass(className: string): boolean;
        parent(selector: selector, param: any): _$;
        submit(): void;
        siblings(selector: selector, param: any): __;
        appendTo(dom: Node): void;
        constructor(dom: Node[]);
        readonly length: number;
        detach(): this;
        insertBefore(thisDom: Node): this;
        insertAfter(referenceNode: Node): this;
        find(selector: selector, param: any): __;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        add(dom: Node | Node[]): this;
        toggleClass(className: string): this;
        toArray(): Node[];
    }
    class _ implements _$ {
        private dom;
        eq(n: number): _$;
        hasClass(className: string): boolean;
        parent(selector: selector, param: any): _$;
        constructor(dom: Node);
        readonly length: number;
        submit(): void;
        siblings(selector: selector, param: any): __;
        detach(): this;
        add(dom: Node | Node[]): __;
        toggleClass(className: string): void;
        insertBefore(thisDom: Node): this;
        insertAfter(thisDom: Node): this;
        children(selector: selector, param: any): __;
        removeChildren(selector: selector, param: any): this;
        appendTo(dom: Node): void;
        find(selector: selector, param: any): __;
        removeClass(className: string): this;
        addClass(className: string): this;
        toArray(): Node[];
    }
    function $$(dom: Node | Node[]): __ | _;
}
export declare function $$(dom: Node | Node[]): query.__ | query._;
export declare namespace reflection {
    interface ICallHistory {
        caller: any;
        arguments: any[];
        fn: Function;
    }
    type Method<RET, T extends (...args: any[]) => RET> = MethodGroup<RET, T> | T | basic.ITBindable<T>;
    class MethodGroup<RET, T extends (...args: any[]) => RET> implements basic.ITBindable<T> {
        Owner?: any;
        private _list;
        constructor(f?: Method<RET, T>, Owner?: any);
        Invoke: T;
        add(m: T | Method<RET, T>): this;
        With(owner: any, ...args: any[]): RET;
        Clone(): MethodGroup<RET, T>;
    }
    function ToMethodGroup<RET, T extends (...args: any[]) => RET>(x: Method<RET, T>): MethodGroup<{}, T>;
    function Invoke<RET, T extends (...args: any[]) => RET>(f: Method<RET, T>, owner: any, args: any[]): RET;
    interface IDebuggerInfo {
        obsArgs: boolean;
        Stack?: ICallHistory[];
        debug?: boolean;
        save?: boolean;
        callback?: Function;
        fn: Function;
        proxy?: Function;
        ReCalc?: (callHistory: ICallHistory | number, direct: boolean) => any;
    }
    function isInstanceOfClassName(instance: any, className: any): boolean;
    function isInstanceOfClass(instance: any, type: any): boolean;
    function _isInstanceOf(type: Function, superType: Function): boolean;
    function GetBaseType(type: any): any;
    function GetBaseTypes(type: any, totype?: any): typeof Object[];
    function IsInstanceOf(type: any, superType: any): boolean;
    class Type {
        private passed;
        type: Function;
        constructor(type: any);
        _getPath(root: any): any;
        GetType(root: any): any;
    }
    class GenericType {
        Constructor: Function;
        Params: Function[];
        prototype: any;
        constructor(Constructor: Function, Params: Function[], base: Function);
        readonly base: Function;
        GetBaseType(): Function;
        static GetType(type: Function, params?: Function[], checkOnly?: boolean, base?: Function): GenericType | Function;
        private static i;
        static IsInstanceOf(type: any, superType: any): any;
        static _isInstanceOf: (((type: Function, superType: Function) => boolean) | ((type: Function, superGType: GenericType) => boolean) | ((gtype: GenericType, superGType: GenericType) => boolean) | ((gtype: GenericType, superType: Function) => boolean))[];
    }
    class DelayedType {
        readonly Type: Function;
        private _type;
        constructor(type: () => Function);
    }
    namespace Observable {
        function observeProperty(obj: any, propName: string, evnt: string): void;
        function setObservableProperty<T>(obj: any, propName: string, get: () => T, set: (val: T) => void, evnt: string): void;
        function ObjectToObservable(o: Object): void;
    }
    function IsClass(obj: ObjectConstructor): boolean;
    function IsPrototype(obj: any): boolean;
    function IsInstance(obj: any): boolean;
}
export declare namespace attributes {
    function property<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, Name?: string, changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void, check?: (e: bind.EventArgs<PropertyType, ClassType>) => void, attribute?: bind.PropertyAttribute, StaticName?: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
    function property1<PropertyType, ClassType>(type: Function | reflection.GenericType | reflection.DelayedType, options: {
        Name?: string;
        StaticName?: string;
        defaultValue?: PropertyType;
        changed?: (e: bind.EventArgs<PropertyType, ClassType>) => void;
        check?: (e: bind.EventArgs<PropertyType, ClassType>) => void;
        attribute?: bind.PropertyAttribute;
    }): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
    function getProperties<classType>(type: any): bind.DProperty<any, classType>[];
    function Delete(type: any): any;
    function ComponentParser(tagName: string, createControl: (x: Processor.Tree, p: Processor.Instance) => Processor.Result, check?: (x: Processor.Tree, p: Processor.Instance) => boolean): any;
}
export declare namespace bind {
    class Job implements basic.IJob {
        Name: string;
        Todo: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        Check?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnError?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnInitialize?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        OnScopDisposing?: (job: JobInstance, e: bind.EventArgs<any, any>) => void;
        constructor(Name: string, Todo: (job: JobInstance, e: bind.EventArgs<any, any>) => void, Check?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnError?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnInitialize?: (job: JobInstance, e: bind.EventArgs<any, any>) => void, OnScopDisposing?: (job: JobInstance, e: bind.EventArgs<any, any>) => void);
    }
    class Jobs implements basic.IJob {
        Name: string;
        Todo(job: JobInstance, e: bind.EventArgs<any, any>): void;
        Check(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnError(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnInitialize(job: JobInstance, e: bind.EventArgs<any, any>): void;
        OnScopDisposing(job: JobInstance, e: bind.EventArgs<any, any>): void;
        constructor(Name: string);
        push(jobName: any): void;
    }
    class JobInstance implements EventListenerObject {
        Scop: bind.Scop;
        job: basic.IJob;
        dom: Node;
        Control: UI.JControl;
        private _events;
        Handle: (ji: JobInstance, e: Event) => void;
        addEventListener(name: string, event: string, delegate: EventListenerOrEventListenerObject | any): void;
        removeEventListener(name: string): void;
        getEvent(name: string): EventListenerOrEventListenerObject;
        constructor(Scop: bind.Scop, job: basic.IJob, dom: Node);
        private propb;
        private ValueChanged;
        Dispose(): void;
        IsDisposed: any;
        _store: any;
        addValue(name: string, value: any): void;
        getValue(name: string): any;
        Checker: (value: any) => boolean;
        Ischanging: boolean;
        handleEvent(e: Event): void;
    }
    function GetJob(name: string): basic.IJob;
    function Register(job: basic.IJob, override?: boolean): basic.IJob;
}
export declare namespace thread {
    interface IDispatcherCallback {
        callback: (delegate: (...param: any[]) => void, param: any, _this: any) => void;
        params: JobParam;
        _this: any;
        optimizable: boolean;
        isWaiting: boolean;
        id: number;
        children: IDispatcherCallback[];
        ce: number;
    }
    class JobParam {
        id: number;
        params: any[];
        constructor(id: number, params?: any[]);
        Set(...params: any[]): this;
        Set1(params: any[]): this;
        Clone(): JobParam;
    }
    class Dispatcher {
        static OnIdle(owner: any, callback: () => void, once?: boolean): void;
        static InIdle(): boolean;
        static GC(): void;
        static clone(ojob: IDispatcherCallback, params: any[], __this?: any): IDispatcherCallback;
        static cretaeJob(delegate: (...param: any[]) => void, param: any[], _this: any, optimizable: boolean): JobParam;
        static Clear(o: JobParam): void;
        static readonly CurrentJob: IDispatcherCallback;
        private static start;
        static Push(ojob: JobParam, params?: any[], _this?: any): IDispatcherCallback;
        static call(_this: any, fn: Function, ...args: any[]): void;
        static IsRunning(): boolean;
    }
}
export declare namespace bind {
    class DProperty<T, P> {
        Attribute: PropertyAttribute;
        Name: string;
        Type: GFunction;
        DefaultValue?: T;
        Changed?: (e: EventArgs<T, P>) => void;
        Check?: (e: EventArgs<T, P>) => void;
        Index: number;
        GType: reflection.GenericType;
        constructor(Attribute: PropertyAttribute, Name: string, Type: GFunction, DefaultValue?: T, Changed?: (e: EventArgs<T, P>) => void, Check?: (e: EventArgs<T, P>) => void);
        readonly IsKey: boolean;
        private RedifineChecker;
        checkType(val: T): boolean;
        _checkType<T>(val: T): boolean;
        private isGenerictype;
        private static isObject;
        private static isString;
        private static isNumber;
        private static isBoolean;
    }
    class EventArgs<T, P> implements basic.IDisposable {
        static New<T, P>(prop: DProperty<T, P>, ithis: P, _old: T, _new: T): EventArgs<T, P>;
        prop: DProperty<T, P>;
        __this: P;
        _old: T;
        _new: T;
        IsValid: boolean;
        Dispose(): void;
    }
    class Ref<T> {
        private _key;
        key: T;
    }
    class EventListener<T extends Function> implements basic.IDisposable {
        private _deleagtes;
        private key;
        private isSingliton;
        constructor(key: any, isSingliton?: boolean);
        On: T;
        private locks;
        Off: T;
        private lock;
        Invoke(key: Object, params: any[]): void;
        Invok(key: Object, callBack: (delegate: T) => any): any;
        PInvok(key: Object, params: any[], owner?: any): any;
        Add(delegate: T, key?: any): void;
        Remove(key: any): void;
        private _store;
        Dispose(): void;
    }
    class FEventListener<T extends basic.Invoker<(...args: any[]) => void>> implements basic.IDisposable {
        private _deleagtes;
        private key;
        private isSingliton;
        constructor(key: any, isSingliton?: boolean);
        On: T;
        Off: T;
        private currentIndex;
        PInvok(key: Object, params: any[], owner?: any): any;
        Add(delegate: T, key?: any): void;
        Remove(key: any): void;
        private _store;
        Dispose(): void;
    }
    class PropBinding implements basic.IDisposable, basic.IDelegate {
        Invoke: (sender: PropBinding, e: EventArgs<any, any>) => void;
        Owner?: any;
        IsWaiting: boolean;
        constructor(Invoke: (sender: PropBinding, e: EventArgs<any, any>) => void, Owner?: any);
        private _isIvnoked;
        handleEvent(e: EventArgs<any, any>): boolean;
        Dispose(): void;
    }
    class PropertyStore implements basic.IDisposable {
        Value?: any;
        _bindings: Array<PropBinding>;
        readonly InsBindings: PropBinding[];
        constructor(Value?: any);
        Dispose(): void;
    }
    enum PropertyAttribute {
        NonSerializable = 2,
        Private = 4,
        SerializeAsId = 8,
        IsKey = 16,
        Optional = 32
    }
    enum ObjectAttribute {
        NonSerializable = 2
    }
    abstract class DObject implements basic.IDisposable {
        private static _dpStore;
        private static _isOpen;
        GetType(): any;
        static __fields__(): bind.DProperty<any, any>[];
        static __attributes__(): void;
        static readonly isOpen: boolean;
        static GetProperty(type: Function, name: string): DProperty<any, DObject>;
        static GetDPropertyAt(type: Function, index: number): DProperty<any, any>;
        GetProperty(name: string): DProperty<any, DObject>;
        ToJson(_context: encoding.SerializationContext, indexer?: encoding.IIndexer): Object;
        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this;
        static IsClass(x: any): boolean;
        static CreateField<PropertyType, ClassType>(name: string, type: Function | reflection.GenericType | reflection.DelayedType, defaultValue?: PropertyType, changed?: (e: EventArgs<PropertyType, ClassType>) => void, check?: (e: EventArgs<PropertyType, ClassType>) => void, attribute?: PropertyAttribute): DProperty<PropertyType, ClassType>;
        private static typeCount;
        private static getId;
        private static _buildProperty;
        IsPropertiesChanged(m: BuckupList<this>): boolean;
        static ToDObject(obj: any, props: string[]): any;
        private static register;
        private store;
        private __events__;
        getType(): any;
        constructor();
        static getFieldsCount(): number;
        static getFields(type?: Function): DProperty<any, DObject>[];
        protected _isFrozen: boolean;
        protected set<T>(prop: DProperty<T, this>, value: T, keepEvent?: boolean): void | EventArgs<T, this>;
        protected raise<T>(e: DProperty<T, this>): void;
        protected get<T>(prop: DProperty<T, this>): T;
        protected GetValues(): any[];
        GetValue<T>(prop: DProperty<T, this>): T;
        SetValue<T>(prop: DProperty<T, this>, p: T): void;
        private _propertyChanged;
        removeListener(v: (ev: EventArgs<any, this>) => void): boolean;
        addListener(v: (ev: EventArgs<any, this>) => void): boolean;
        protected onPropertyChanged(ev: EventArgs<any, any>): void;
        Observe<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding;
        UnObserve<T>(prop: DProperty<T, this>, y: PropBinding | ((sender: PropBinding, ev: EventArgs<T, this>) => void), owner?: any): boolean;
        private _disposeProp;
        OnPropertyChanged<T>(prop: DProperty<T, this>, ev: (sender: PropBinding, ev: EventArgs<T, this>) => void, owner?: any): PropBinding;
        addEvent<T>(prop: DProperty<T, this>, b: PropBinding): void;
        removeEvent<T>(prop: DProperty<T, this>, y: PropBinding): boolean;
        readonly Disposed: boolean;
        protected DisposingStat: DisposingStat;
        protected OnDispose(): boolean;
        Dispose(): void;
        private _onDisposing;
        OnDisposing: (s: this) => void;
        OffDisposing: (s: this) => void;
        CloneTo(o: DObject): void;
        Freeze(): void;
        UnFreeze(): void;
        IsFrozen(): boolean;
        CreateBackup(OnUndo?: (self: this, bl: BuckupList<this>) => void): BuckupList<this>;
        Commit(r?: BuckupList<any>): boolean;
        Rollback(b?: BuckupList<this>, walkTrougth?: boolean): boolean;
        private UndoTo;
    }
    enum DisposingStat {
        None = 0,
        Disposing = 1,
        Disposed = 2
    }
    class XPath {
        Name: string;
        Property: bind.DProperty<any, DObject>;
        Value: any;
        Binding: bind.PropBinding;
        d: DObject;
        constructor(name: string);
        ListenTo(d: bind.DObject, callback: (sender: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
        Dispose(): void;
    }
    class Observer extends bind.DObject {
        private controller?;
        static DPMe: DProperty<any, Observer>;
        Me: any;
        static DPPath: DProperty<string[], Observer>;
        Path: string[];
        static DPValue: DProperty<any, Observer>;
        Value: any;
        static __fields__(): DProperty<any, Observer>[];
        GenType(): typeof Observer;
        xpath: XPath[];
        constructor(me: any, path: string[], controller?: Controller);
        private calcPrefix;
        private rebuidPath;
        private disposePath;
        getValue(l: number): any;
        private Start;
        ESetValue(value: any): void;
        private callMe;
        Dispose(): void;
    }
    interface IJobScop {
        IsNew: boolean;
        Scop: Scop;
        Jobs: JobInstance[];
        Control: UI.JControl;
        dom?: Node;
        events?: bind.events;
    }
    enum ProcessStat {
        NotProcessed = 0,
        Processing = 1,
        Processed = 2
    }
    class Controller extends DObject implements basic.IDisposable {
        OnNodeLoaded(): any;
        readonly MainControll: UI.JControl;
        static Attach(control: UI.JControl, data?: any | Scop): Controller;
        getStat(): ProcessStat;
        private Stat;
        private _stat;
        processHowEver: boolean;
        static __feilds__(): DProperty<HTMLElement, Controller>[];
        static DPView: DProperty<HTMLElement, Controller>;
        View: HTMLElement;
        JCParent: UI.JControl[];
        private _onCompiled;
        OnCompiled: basic.ITBindable<(t: this) => void>;
        private _onCompiling;
        OnCompiling: basic.ITBindable<(t: this) => void>;
        private ViewChanged;
        unlistenForNodeInsertion(odom: Node, ndisp?: boolean): void;
        private listenForNodeInsertion;
        private implemented;
        handleEvent(e: Event): void;
        private ProcessBinding;
        private static pb;
        Scop: Scop;
        static explorerJob: thread.JobParam;
        readonly CurrentControl: UI.JControl;
        instances: IJobScop[];
        CompileChild(dom: Node, scop: Scop, control: UI.JControl): IJobScop;
        private ParseBinding;
        private processEvent;
        constructor(cnt: UI.JControl);
        PDispose(): void;
        Dispose(): void;
    }
}
export declare namespace utils {
    interface Node<T> {
        Depth: number;
        Value: T;
        param?: any;
        children: Node<T>[];
        Parent: Node<T>;
    }
    class Tree<T> {
        private source;
        private getParent;
        private dic;
        constructor(source: collection.List<T>, getParent: (item: T) => T, listen: (base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void);
        Remove(c: T): void;
        Add(c: T): void;
        Clear(): void;
        Reset(): void;
        private OnAdd;
        getNodes(): Node<T>[];
        getBases(): Node<T>[];
        private OnRemove;
        private OnClear;
        OnChange: bind.EventListener<(base: Node<T>, target: Node<T>, add_remove_clear: boolean) => void>;
    }
    class RemoveRef<T> {
        Ref: T;
        constructor(ref: T);
    }
    class ListEventArgs<P, T> implements basic.IDisposable {
        oldItem: T;
        newItem: T;
        startIndex: P;
        event: collection.CollectionEvent;
        collection?: T[];
        constructor(oldItem: T, newItem: T, startIndex: P, event: collection.CollectionEvent, collection?: T[]);
        Dispose(): void;
        static readonly ResetEvent: any;
        private static _r;
    }
    interface IPatent<T> {
        Check(s: T): boolean;
        equals(p: IPatent<T>): boolean;
    }
    abstract class Filter<T, P extends IPatent<T>> extends bind.DObject {
        protected _patent: P;
        Patent: P | string;
        protected abstract convertFromString(x: string): P;
        abstract Begin(deb: number, count: number): any;
        private _store;
        constructor();
        OnChanged(callback: (filter: Filter<T, P>, data: any) => void, data: any, name?: string): number;
        OffChanged(name_id: string | number): void;
        protected _ismath(str: string[]): boolean;
        abstract IsMatch(index: number, item: T): any;
    }
    class CostumeFilter<T, P extends IPatent<T>> extends Filter<T, P> {
        _isMatch: (patent: P, item: T) => boolean;
        constructor(_isMatch: (patent: P, item: T) => boolean);
        IsMatch(index: number, item: T): boolean;
        convertFromString(x: string): P;
        Begin(deb: number, count: number): void;
    }
    class filterCallback<T, P extends IPatent<T>> {
        callback: (filter: utils.Filter<T, P>, data: any) => void;
        data: any;
        name?: string;
        id?: number;
        constructor(callback: (filter: utils.Filter<T, P>, data: any) => void, data: any, name?: string, id?: number);
    }
}
export declare namespace collection {
    enum CollectionEvent {
        Added = 0,
        Removed = 1,
        Replace = 2,
        Cleared = 3,
        Reset = 4,
        Setted = 5
    }
    type ListEventInvoker<T> = (e: utils.ListEventArgs<number, T>) => void;
    type ListEventHandler<T> = ListEventInvoker<T> | (basic.ITBindable<ListEventInvoker<T>>);
    type ListEventBindable<T> = basic.ITBindable<ListEventInvoker<T>>;
    class List<T> extends bind.DObject {
        protected argType: Function;
        static __fields__(): any[];
        static DPCount: bind.DProperty<number, List<any>>;
        private UCount;
        protected _list: T[];
        readonly ArgType: Function;
        GetType(): Function | reflection.GenericType;
        constructor(argType: Function, array?: T[]);
        AsList(): T[];
        Order(comp: (a: T, b: T) => boolean | number): void;
        OrderBy(comp: (a: T, b: T) => number): void;
        Filtred(filter: utils.Filter<T, utils.IPatent<T>>): ExList<T, utils.IPatent<T>>;
        Set(i: number, item: T): boolean;
        Get(i: number): T;
        Insert(i: number, item: T): boolean;
        Add(item: T): this;
        AddRange(items: T[]): void;
        CheckIndex(i: number): boolean;
        Remove(item: T | number): boolean;
        RemoveAt(item: number): boolean;
        Clear(): void;
        readonly Count: number;
        IndexOf(item: T): number;
        Listen: ListEventHandler<T>;
        Unlisten: ListEventHandler<T>;
        private OnChanged;
        private _changed;
        private _changing;
        protected getArgType(json: any): Function;
        ToJson(x: encoding.SerializationContext, indexer: encoding.IIndexer): any;
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this;
        OnDeserialize(list: T[]): void;
        private static getType;
        UpdateDelegate: () => T[];
        static GenType(T: Function): Function | reflection.GenericType;
    }
    interface IKeyValuePair<T, P> {
        Key: T;
        Value: P;
    }
    class Dictionary<T, P> extends bind.DObject {
        Name: string;
        ReadOnly?: boolean;
        private keys;
        private values;
        constructor(Name: string, ReadOnly?: boolean);
        GetKeyAt(i: number): T;
        GetValueAt(i: number): P;
        readonly Count: number;
        Clear(): void;
        IndexOf(key: T, fromIndex?: number): number;
        IndexOfValue(val: P, fromIndex?: number): number;
        Set(key: T, value: P): void;
        Remove(key: T): P;
        RemoveAllValues(val: P): T[];
        RemoveAt(i: number): IKeyValuePair<T, P>;
        getValues(): P[];
        Get(key: T): P;
        GetOrAdd(key: T, value?: P): P;
        GetOrCreate<S>(key: T, New: (key: T, param?: S) => P, param?: S): P;
        GetKeyOf(val: P): T;
        Listen: (e: utils.ListEventArgs<T, P>) => void;
        Unlisten: (e: utils.ListEventArgs<T, P>) => void;
        private OnChanged;
        private _changed;
        UpdateDelegate: () => T[];
    }
    class ExList<T, P extends utils.IPatent<T>> extends List<T> {
        static DPSource: bind.DProperty<List<any>, ExList<any, any>>;
        Source: List<T>;
        static DPFilter: bind.DProperty<utils.Filter<any, any>, ExList<any, any>>;
        Filter: utils.Filter<T, P>;
        static DPMaxResult: bind.DProperty<number, ExList<any, any>>;
        MaxResult: number;
        static DPShift: bind.DProperty<number, ExList<any, any>>;
        Shift: number;
        static __fields__(): (bind.DProperty<utils.Filter<any, any>, ExList<any, any>> | bind.DProperty<number, ExList<any, any>> | bind.DProperty<List<any>, ExList<any, any>>)[];
        private _fid;
        private filterChanged;
        private sourceChanged;
        private sicd;
        private MaxResultChanged;
        static New<T, P extends utils.IPatent<T>>(source: List<T>, filter: utils.Filter<T, P>, argType?: Function): ExList<T, P>;
        constructor(argType: Function);
        private static patentChanged;
        private sourceItemChanged;
        private isMatch;
        start: number;
        Reset(): void;
    }
    interface Converter<A, B> {
        ConvertA2B(sender: TransList<A, B>, index: number, a: A, d: any): B;
        ConvertB2A(sender: TransList<A, B>, index: number, b: B, d: any): A;
    }
    class TransList<From, To> extends List<To> {
        private converter;
        private stat?;
        static __fields__(): bind.DProperty<List<any>, TransList<any, any>>[];
        private sli;
        private SourceChanged;
        static DPSource: bind.DProperty<List<any>, TransList<any, any>>;
        Source: List<any>;
        constructor(argType: Function, converter: Converter<From, To>, stat?: any);
        private _internal;
        private OnSourceChanged;
        private Reset;
        Add(t: To): this;
        Remove(x: To): boolean;
        Insert(i: number, item: To): boolean;
        Clear(): void;
        Order(n: (a: To, b: To) => boolean): void;
        OrderBy(n: (a: To, b: To) => number): void;
        Set(i: number, item: To): boolean;
    }
    abstract class Binding<T> {
        GetType(): typeof Binding;
        private _dataContext;
        DataContext: collection.List<T>;
        constructor(dataContext: collection.List<T>);
        abstract OnItemAdded(item: T, index: number): any;
        abstract OnItemRemoved(item: T, index: number): any;
        abstract OnSourceCleared(): any;
        abstract OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>): any;
        abstract OnSourceReset(): any;
        abstract OnSourceReplace(oldItem: T, newItem: T, index: number): any;
        private initChanged;
    }
    abstract class Render<T, P> extends Binding<T> {
        GetType(): typeof Render;
        private _rendredList;
        readonly RendredList: collection.List<P>;
        constructor(dataContext: collection.List<T>);
        abstract Render(item: T): P;
        OnItemAdded(item: T, index: number): void;
        OnItemRemoved(item: T, index: number): void;
        OnSourceCleared(): void;
        OnSourceInitialized(_old: collection.List<T>, _nex: collection.List<T>): void;
    }
    class SyncQuee<T> extends bind.DObject {
        handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>;
        private quee;
        private _isExecuting;
        CurrentData: T;
        push(data: T): void;
        constructor(handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>);
        EndOperation(e: QueeEventArgs<T>): void;
    }
    interface QueeEventArgs<T> {
        quee: SyncQuee<T>;
        data: T;
    }
}
export declare namespace mvc {
    abstract class ITemplate {
        abstract Create(): HTMLElement;
        Name: string;
        constructor(Name: string);
    }
    class iTemplate extends ITemplate {
        private _Url;
        readonly Url: string;
        private _Shadow;
        Shadow: HTMLTemplateElement;
        Create(): HTMLElement;
        constructor(relativeUrl: string, name: string, shadow?: HTMLTemplateElement);
        Load(): void;
    }
    enum Devices {
        Desktop = 0,
        Mobile = 1,
        Tablete = 2
    }
    class NULL {
    }
    interface ITemplateGroup {
        Url: string;
        OnError(init: Initializer): any;
        OnSuccess(init: Initializer): any;
    }
    interface FolderEntries {
        [name: string]: MvcDescriptor;
    }
    interface TemplateEntries {
        [name: string]: ITemplate;
    }
    class MvcDescriptor {
        Name: string;
        private _dataType;
        DataType: Function | string;
        Subs: FolderEntries;
        Items: TemplateEntries;
        Parent: MvcDescriptor;
        Default: ITemplate;
        constructor(Name: string, dataType?: Function | string);
        readonly Root: MvcDescriptor;
        Get(path: string | string[]): ITemplate;
        GetFoder(path: string | string[], max?: number): MvcDescriptor;
        CreateFolder(path: string | string[], type?: Function): MvcDescriptor;
        Add(templ: ITemplate): this;
        AddFolder(name: string, dataType?: Function | string): MvcDescriptor;
        private registerTemplates;
        private registerTemplate;
        static Root: MvcDescriptor;
        static Get(path: string | string[]): ITemplate;
        static GetByType(datatype: Function): MvcDescriptor;
        static GetByName(folderName: string): MvcDescriptor;
        static Add(template: HTMLTemplateElement, path: string, name?: string): MvcDescriptor;
        static New(name: string, dataType: Function): MvcDescriptor;
        Register(path: string, tmp: HTMLTemplateElement, url: string, name?: string): MvcDescriptor;
        Process(des: HTMLElement, url: string, getType: (t: string) => Function): MvcDescriptor;
    }
    class Initializer {
        private require;
        static readonly Instances: Initializer;
        constructor(require: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => void);
        Init(): void;
        Dispose(): void;
        readonly System: collection.List<MvcDescriptor>;
        private readonly _system;
        Add(templGroup: ITemplateGroup, require?: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => any): void;
        private static typeResolvers;
        static SetTypeResolver(name: any, typeResolver: (typeName: string) => Function): void;
        private _pending;
        private pending;
        private static gonsuccess;
        private static gonerror;
        private static onsuccess;
        private static onerror;
        static html2Template(html: string): HTMLTemplateElement;
        static htmlToElements(html: any): HTMLDivElement;
        then(call: (Initializer: Initializer) => void): void;
        static then(call: (Initializer: Initializer) => void): void;
        private static callbacks;
        protected onfinish(): void;
        private static onfinish;
        static Get(type: Function): MvcDescriptor;
        getDescriptor(name: string, type: Function): MvcDescriptor;
        private templatesDescrpt;
        ExcecuteTemplate(url: string, templ: HTMLElement, typeResolver?: (typeName: string) => Function, e?: ITemplateExport): void;
        static Register(e: PluginsEvent): void;
        static MakeAsParsed(r: ITemplateExport): void;
        private static parsed;
    }
    class Template {
        private static _store;
        static TempplatesPath: string;
        private _type;
        private _view;
        private _name;
        private _for;
        readonly forType: any;
        readonly View: HTMLElement;
        readonly Name: string;
        readonly For: string;
        constructor(templateDOM: HTMLElement);
        static getTemplates(type: any): Template[];
        private static fromInside;
        static LoadTemplate(templateName: string, context: basic.IContext): void;
        static getWebRequest(): any;
        private static _webRequest;
        private static OnRecieveTemplates;
        private static createTemplate;
        static GetAll(name: string): any[];
        static Get(name: string, vtype: string): any;
        static Foreach(callback: (tmplate: Template) => boolean): void;
    }
}
export declare namespace bind {
    interface IJobCollection {
        [s: string]: basic.IJob;
    }
    abstract class Scop extends bind.DObject {
        private _scops;
        protected _parent: Scop;
        Value: any;
        getScop(path: string, createIfNotEist?: boolean): Scop;
        findScop(path: string[]): void;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        protected canBeParent(v: Scop): boolean;
        SetExParent(scop: Scop, parent: Scop): boolean;
        private findAttribute;
        private static getAttribute;
        setAttribute(name: string, value: any): void;
        getAttribute(name: string, createIfNotEist?: boolean): Scop;
        static __fields__(): DProperty<any, Scop>[];
        static DPValue: DProperty<any, Scop>;
        BindingMode: BindingMode;
        protected _bindingMode: BindingMode;
        constructor(_bindingMode: BindingMode);
        protected valueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, this>): void;
        private _OnValueChanged_;
        protected abstract _OnValueChanged(e: bind.EventArgs<any, any>): any;
        static Create(s: string, parent?: Scop, bindingMode?: BindingMode, controller?: Controller): Scop;
        static BuildScop(p: Parser.ParserResult, parent: Scop, bindingMode: bind.BindingMode, controller?: Controller): Scop;
        static GenerateScop(s: string, _parent?: Scop, bindingMode?: BindingMode, controller?: Controller): Scop;
        static GetStringScop(s: string, _parent: bind.Scop, controller: Controller): string | StringScop;
        AddJob(job: basic.IJob, dom: Node): JobInstance;
        private __jobs__;
        Dispose(): void;
        RegisterJob(job: basic.IJob): void;
        GetJob(name: string): basic.IJob;
        protected __mjobs__: IJobCollection;
        __Controller__: Controller;
        getThis(): UI.JControl;
        readonly __hasSegments__: boolean;
        forEach<T>(callback: (s: any, param: T) => boolean, param?: T): void;
        readonly ParentValue: any;
        WhenIschanged<T>(callback: (s: bind.PropBinding, e: bind.EventArgs<T, any>) => void, owner?: any): () => void;
        OffIsIchangeing(callback: ($new: any, $old?: any) => void): void;
        private _valueChanegedCallbacks;
    }
    class StringScop extends bind.Scop {
        private template;
        private _dom;
        AttacheTo(Dom: Node): any;
        private pb;
        constructor(template: (string | Parser.ICode)[], _parent: bind.Scop, controller: Controller);
        static GetStringScop(s: string, _parent: bind.Scop, controller: Controller): string | StringScop;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        setParent(v: Scop): boolean;
        Reset(sender?: bind.PropBinding, e?: bind.EventArgs<any, any>): void;
        FromJson(json: any, context: encoding.SerializationContext, update: any): this;
        ToJson(context: encoding.SerializationContext, iintexder?: encoding.IIndexer): Object;
        Dispose(): void;
    }
    class FunctionCallScop extends bind.Scop {
        protected _OnValueChanged(e: EventArgs<any, any>): void;
        Invoke(s?: PropBinding, e?: EventArgs<any, Scop>): void;
        private args;
        private caller;
        constructor(rslt: Parser.parsers.FunctionResult, _parent: bind.Scop, controller?: Controller);
    }
    class ArrayCallScop extends bind.Scop {
        protected _OnValueChanged(e: EventArgs<any, any>): void;
        Reset(s?: PropBinding, e?: EventArgs<any, Scop>): void;
        private index;
        private caller;
        constructor(rslt: Parser.parsers.ArrayResult, _parent: bind.Scop, controller?: Controller);
    }
    class NamedScop extends Scop {
        private _name;
        readonly Name: string;
        constructor(name: string, bindingMode: BindingMode);
        static Get(name: string): bind.NamedScop;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        static Create(name: string, value?: any, twoWay?: BindingMode): NamedScop;
        Dispose(): void;
    }
    class Bind extends Scop {
        static __fields__(): (DProperty<Scop, Bind> | DProperty<string[], Bind>)[];
        private PathChanged;
        private pb;
        private static ParentChanged;
        Dispose(): void;
        ParentValueChanged(sender: bind.PropBinding, e: bind.EventArgs<any, any>): void;
        private static DPPath;
        Path: string[];
        private static DPParent;
        Parent: Scop;
        private observer;
        private observerBinding;
        constructor(path: string | string[], parent: Scop, bindMode?: BindingMode);
        private isChanging;
        private __OnValueChanged;
        protected AttributeChanged(e: Event): void;
        private int;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        getChildren(): Scop[];
        readonly Values: XPath[];
        readonly Segments: XPath[];
        forEach<T>(callback: (s: any, param: T) => boolean, param?: T): basic.IRef<any>;
        readonly ParentValue: any;
    }
    namespace AnonymouseScop {
        function Register(scop: Scop): number;
        function UnRegister(i: number): Scop;
        function Get(i: number): Scop;
    }
    class ValueScop extends Scop {
        constructor(value: any, bindMode?: BindingMode);
        _OnValueChanged(e: EventArgs<any, any>): void;
    }
    var windowScop: ValueScop;
    class TypedScop extends Scop {
        itself: boolean;
        private pB;
        private parent;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        protected _OnValueChanged(e: EventArgs<any, any>): void;
        private type;
        private eq;
        constructor(parent: Scop, type: Parser.ITypedScop, bindingMode: BindingMode);
        private OnParentValueChanged;
        private reProcess;
        private checkType;
    }
    class db {
        todo: string;
        init: {
            [n: string]: any;
        };
        bind: string;
        name: string;
        job: string;
        twoway: BindingMode;
        filter: string;
        cmd: string;
        exec: string;
        template: string;
        dec: string;
        control: string;
        stop: string;
        foreach: string;
        way: string;
        events: {
            [eventName: string]: string;
        };
        constructor(dom: Element);
    }
    interface DomCompilerArgs {
        parentScop: Scop;
        parentControl: UI.JControl;
        controller: Controller;
        e: bind.IJobScop;
        attributes?: db;
    }
    class Todo implements basic.IJob {
        private scopFunction;
        readonly Name: string;
        Todo?(job: JobInstance, e: EventArgs<any, any>): void;
        constructor(scopFunction: bind.Scop);
    }
    type delg = (ovalue: any, value: any, scop: bind.Scop, job: JobInstance, event: EventArgs<any, any>) => void;
    class EventData {
        events: events;
        interpolation: string;
        scop?: Scop;
        constructor(events: events, interpolation: string);
        readonly dom: Node;
        readonly controller: Controller;
        readonly parentScop: Scop;
    }
    class events implements basic.IJob, EventListenerObject {
        xx: Processor.Tree;
        private m;
        private events;
        Name: string;
        Todo?(job: JobInstance, e: EventArgs<any, any>): void;
        Register(eventType: string, v: string): void;
        private getScop;
        handleEvent(e: Event): void;
        private exec;
        constructor(xx: Processor.Tree, m: Processor.Manager);
        scop: Scop;
    }
    abstract class Filter<T, CT> extends Scop {
        protected source: Scop;
        private dbb;
        constructor(source: Scop, bindingMode?: BindingMode);
        Initialize(): void;
        protected isChanging: boolean;
        protected SourceChanged(p: PropBinding, e: EventArgs<any, Scop>): void;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        Update(): void;
        UpdateBack(): void;
        protected abstract Convert(data: T): CT;
        protected abstract ConvertBack(data: CT): T;
        getParent(): Scop;
        setParent(v: Scop): boolean;
        Dispose(): void;
    }
    class DoubleFilter extends Filter<number, number> {
        Fraction: number;
        private fraction;
        protected Convert(data: number): number;
        protected ConvertBack(data: number): number;
    }
    interface IFilter {
        Name: string;
        BindingMode: BindingMode;
        CreateNew(source: Scop, bindingMode: BindingMode, param: string): Filter<any, any>;
    }
    function RegisterFilter(filter: IFilter): boolean;
    function CreateFilter(filterName: string, parent: Scop, bindingMode: BindingMode): Scop;
    enum BindingMode {
        SourceToTarget = 1,
        TwoWay = 3,
        TargetToSource = 2
    }
    class TwoBind<T> {
        private bindingMode;
        private a;
        private b;
        private pa;
        private pb;
        private dba;
        private dbb;
        private IsChanging;
        constructor(bindingMode: BindingMode, a: DObject, b: DObject, pa: DProperty<T, any>, pb: DProperty<T, any>);
        protected init(): void;
        protected initB(): void;
        protected pac(p: PropBinding, e: EventArgs<any, any>): void;
        protected pab(p: PropBinding, e: EventArgs<any, any>): void;
        private disposed;
        Dispose(): void;
    }
    class TwoDBind<T, P> {
        private bindingMode;
        private a;
        private b;
        private pa;
        private pb;
        private con;
        private conBack;
        private dba;
        private dbb;
        private IsChanging;
        constructor(bindingMode: BindingMode, a: DObject, b: DObject, pa: DProperty<T, any>, pb: DProperty<P, any>, con: (v: T) => P, conBack: (v: P) => T);
        protected pac(p: PropBinding, e: EventArgs<any, any>): void;
        protected pab(p: PropBinding, e: EventArgs<any, any>): void;
        protected init(): void;
        protected initB(): void;
        private disposed;
        Dispose(): void;
    }
}
export declare namespace Processor {
    class debug {
        private static lst;
        static OnAttribute(name: any, value: any): void;
        static check(p: Instance): void;
    }
    interface Result {
        e?: bind.IJobScop;
        Break?: boolean;
    }
    enum Stat {
        None = 0,
        Waitting = 1,
        Executing = 2,
        Executed = 3
    }
    interface Def {
        name: string;
        attribute: string;
        check?(x: Tree, e: Instance): boolean;
        execute: (x: Processor.Tree, e: Instance) => Result;
        valueParser?(value: string): any;
        priority?: number;
        isPrimitive?: boolean;
        isFinalizer?: boolean;
    }
    interface Instance {
        stat: Stat;
        value: any;
        instance: Def;
        manager: Manager;
    }
    interface ComponentCreator {
        Def: Def;
        css: string[];
        context: IContext;
        TagName: string;
    }
    class Manager {
        private static _components;
        private static _processors;
        private static enumerator;
        static maxPriority: number;
        static getPrcessorByName(name: string): Def;
        static getPrcessorByAttribute(name: string): Def;
        static stringIsNullOrWhiteSpace(s: string): boolean;
        static registerComponent(p: Def): void;
        static register(p: Def): void;
        private static orderDefs;
        private static orderInstances;
        enumerator: Instance[];
        events: {
            [s: string]: string;
        };
        ComponentCreator: Instance;
        getProcessorByAttribute(processor: string): Instance;
        constructor(dom: Node);
    }
    class Tree {
        e: bind.IJobScop;
        parent: Tree;
        controller: bind.Controller;
        readonly Scop: bind.Scop;
        readonly Control: UI.JControl;
        readonly Dom: Node;
        readonly IsNew: boolean;
        constructor(e: bind.IJobScop, parent: Tree, controller: bind.Controller);
        validateE(): void;
        static New(dom: Node, parent: Tree, controller: bind.Controller): Tree;
        static Root(dom: Node, Scop: bind.Scop, Control: UI.JControl, controller?: bind.Controller): Tree;
        New(dom: Node): Tree;
        readonly Depth: any;
    }
    class MyClass {
        static ParseBinding(data: Processor.Tree): bind.IJobScop;
        static ExploreTree(data: Processor.Tree): void;
    }
    function register(p: Def): void;
    class Compiler {
        private static initEvents;
        static Compile(x: Tree): bind.IJobScop;
    }
    function Register(p: Processor.Def): void;
    function Compile(x: Tree): bind.IJobScop;
}
export declare namespace ScopicControl {
    interface ControlCreatorEventArgs {
        name: string;
        dom: HTMLElement;
        currentScop: bind.Scop;
        parentScop: bind.Scop;
        parentControl: UI.JControl;
        controller: bind.Controller;
        e: bind.IJobScop;
        Result?: UI.JControl;
    }
    type IControlCreater = (e: ControlCreatorEventArgs) => UI.JControl;
    function register(name: string, creator: IControlCreater): void;
    function create(e: ControlCreatorEventArgs): UI.JControl;
}
export declare namespace ScopicCommand {
    function Register<T>(callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>, param?: T, name?: string): string;
    function Call(n: string, dom: Node, scop: bind.Scop): any;
    function Delete(n: string): void;
    function contains(n: string): boolean;
}
export declare namespace Api {
    interface IApiTrigger {
        Name: string;
        Filter: (cmdCallback: IApiCallback, params: any) => boolean;
        CheckAccess: (t: IApiTrigger) => boolean;
        Params?: any;
    }
    interface IApiCallback {
        hash?: string;
        Name: string;
        DoApiCallback: (trigger: IApiTrigger, callback: IApiCallback, params: IApiParam) => void;
        Owner?: any;
        Params?: any;
    }
    function RegisterApiCallback(api: IApiCallback): boolean;
    function RegisterTrigger(api: IApiTrigger): boolean;
    function RiseApi(apiName: string, params: IApiParam): void;
    interface IApiParam {
        data: any;
        callback?(p: IApiParam, args: any): any;
    }
    interface IApi {
        Trigger: IApiTrigger;
        Callback: IApiCallback[];
    }
    interface apiGarbage {
        [name: string]: IApi;
    }
}
export declare namespace encoding {
    interface IPath<OB, DP> {
        Owner: OB;
        Property: DP;
        Set<T>(value: T): T;
        executed: boolean;
    }
    interface colReader {
        value: string;
        cursor: charReader;
        EOF: boolean;
    }
    interface charReader {
        cursor: number;
        value: string;
        len?: number;
        newLine?: boolean;
        EOF?: boolean;
    }
    class BPath implements IPath<bind.DObject, bind.DProperty<any, any>> {
        Owner: bind.DObject;
        Property: bind.DProperty<any, any>;
        executed: boolean;
        Set(value: any): any;
        constructor(Owner: bind.DObject, Property: bind.DProperty<any, any>);
    }
    class Path implements IPath<any | bind.DObject, string | bind.DProperty<any, any>> {
        Owner: any | bind.DObject;
        Property: string | bind.DProperty<any, any>;
        executed: boolean;
        Set(value: any): any;
        constructor(Owner: any | bind.DObject, Property: string | bind.DProperty<any, any>);
    }
    class LPath implements IPath<collection.List<any>, number> {
        Owner: collection.List<any>;
        Property: number;
        executed: boolean;
        Set(value: any): any;
        constructor(Owner: collection.List<any>, Property: number);
    }
    interface Serialization<T> {
        FromJson(json: any, context: SerializationContext, ref: IRef): T;
        ToJson(data: T, context: SerializationContext, indexer: encoding.IIndexer): any;
    }
    interface IRef {
        __ref__: number;
    }
    interface IIndexer {
        ref: IRef;
        json: any;
        valid: boolean;
    }
    class SerializationContext {
        static GlobalContext: SerializationContext;
        private _store;
        private _ext;
        RequireNew: (json: any, type: Function | reflection.GenericType) => boolean;
        Dispose(): void;
        constructor(isDefault: boolean);
        Register<T>(type: Function, ser: Serialization<T>): void;
        UnRegister<T>(type: Function): Serialization<any>;
        GetRegistration(type: Function): Serialization<any>;
        Append(con: SerializationContext): void;
        Get(type: Function): Serialization<any>;
        private indexer;
        private refs;
        get(ref: number, path: IPath<any, any>): any;
        set(ref: number, obj: any): void;
        private cnt;
        getJson(obj: any): IIndexer;
        reset(): this;
        static getType(type: Function): Function;
        FromJson(json: any, type: Function | reflection.GenericType, path: IPath<any, any>): any;
        ToJson(obj: any): any;
        private _toJson;
        toString(): void;
        _arrayToJson(arr: Array<any>, ret: IIndexer): {
            "__type__": NativeTypes;
            "__value__": any[];
            "@ref": number;
        };
    }
    interface CsvEventArgs {
        csv: CSV;
        index?: number;
        value?: any;
        set(this: CsvEventArgs, value: any, index: number): CsvEventArgs;
    }
    interface fillArgs {
        csv?: CSV;
        parser?: (e: CsvEventArgs) => any;
        header?: string[];
        cols?: Object | any[];
        e?: CsvEventArgs;
    }
    class CSV {
        private input;
        private autoParse;
        private asJson;
        static separator: string;
        static emptyArray: string[];
        private e;
        Columns: any[];
        private _cursor;
        private _startCursor;
        static ReadAllLines(s: string): string[];
        private parse;
        private static isEmptyLine;
        private static trim;
        private static nextChar;
        private static readString;
        private static readColumn;
        private static clear;
        private static fillColumns;
        private static readLine;
        constructor(input: string, autoParse: boolean, asJson: any);
        ColumnName(index: number): string;
        ColumnIndex(name: string): number;
        private _current;
        readonly Cursor: charReader;
        Reset(): this;
        AllowNullValue: boolean;
        Next(e?: fillArgs): boolean;
        swapArgs(e: fillArgs): fillArgs;
        private jsonParser;
        readonly Current: any[] | Object;
        Field(name_index: string | number): any;
    }
    enum NativeTypes {
        Nullable = 0,
        Boolean = 1,
        Number = 2,
        String = 3,
        Function = 4,
        Array = 5,
        Object = 6,
        DObject = 7
    }
    class UTF8 {
        static UTF8Decoder: any;
        static ToArray(str: string, outU8Array: (Uint8Array | number[]), outIdx: number, maxBytesToWrite: number): number;
        static lengthOf(str: string): number;
        static ToString(u8Array: Uint8Array, idx: number): any;
        static GetBytes(str: string): any[];
    }
    class UTF16 {
        static UTF16Decoder: any;
        static ToString(HEAP16: Uint16Array, ptr: number): any;
        static ToArray(str: string, HEAP16: Uint16Array, outPtr: number, maxBytesToWrite: number): number;
        static lengthBytesUTF16(str: string): number;
    }
    class UTF32 {
        static UTF32ToString(HEAP32: Uint32Array, ptr: number): string;
        static stringToUTF32(str: string, HEAP32: Uint32Array, outPtr: number, maxBytesToWrite: number): number;
        static lengthBytesUTF32(str: string): number;
    }
    namespace Utf8 {
        function ucs2decode(string: any): any[];
        function ucs2encode(array: any): string;
        function utf8encode(string: any): string;
        function utf8decode(byteString: any): string;
        var version: string;
        var encode: typeof utf8encode;
        var decode: typeof utf8decode;
    }
}
export declare class xNode<T> {
    node: Node;
    param: T;
    unknown?: xNode<T>[];
    children: xNode<T>[];
    parent: xNode<T>;
    constructor(node: Node, param: T, unknown?: xNode<T>[]);
    add(node: Node, param: T): xNode<T>;
    __add(v: xNode<T>): xNode<T>;
    Validate(): this;
    ReValidate(callback: (node: xNode<T>) => void): void;
    get(node: Node): xNode<T>;
    private _add;
    remove(node: Node): xNode<T>;
    hasChild(node: Node): xNode<T>;
    foreach(callback: (parent: xNode<T>, child: xNode<T>) => number, parent?: xNode<T>): number;
}
export declare namespace UIDispatcher {
    function OnIdle(f: () => void): void;
}
export declare namespace net {
    class Header {
        private _key;
        readonly key: string;
        private _value;
        readonly value: string;
        constructor(key: any, value: any);
    }
    enum ResponseType {
        json = 0,
        document = 1,
        text = 2,
        arraybuffer = 3,
        blob = 4
    }
    enum WebRequestMethod {
        Get = 0,
        Post = 1,
        Head = 2,
        Put = 3,
        Delete = 4,
        Options = 5,
        Connect = 6,
        Create = 7,
        Open = 8,
        Close = 9,
        Validate = 10,
        FastValidate = 11,
        Print = 12,
        UPDATE = 13,
        SUPDATE = 14,
        Set = 15
    }
    class WebRequest implements basic.IDisposable {
        crypt?: basic.ICrypto;
        Uid: string;
        Pwd: string;
        private http;
        private _responseType;
        getResponseType(): ResponseType;
        setResponseType(v: ResponseType): ResponseType;
        Crypto: basic.ICrypto;
        private key;
        private downloadDelegate;
        constructor(crypt?: basic.ICrypto);
        Dispose(): void;
        private _onprogress;
        readonly IsSuccess: boolean;
        Download(req: IRequestUrl, data: any): void;
        Download2(c: Request): void;
        private getUrlOf;
        private getDataOf;
        GetFileSize(url: any, callback: any): void;
        RequestHeader(url: any, callback: any): void;
        OnComplete: bind.EventListener<(e: WebRequest) => void>;
        readonly Response: string;
        GetHeader(name: string): string;
        GetHeaders(): string;
    }
    abstract class RequestParams<T, S> {
        protected callback: (sender: S, result: any) => void;
        data: T;
        isPrivate?: boolean;
        IsSuccess: boolean;
        constructor(callback: (sender: S, result: any) => void, data: T, isPrivate?: boolean);
        Callback(sender: S, result: any): void;
        abstract OutputData(): string;
        InputData: string;
    }
    interface RequestMethodShema {
        Method: WebRequestMethod;
        Name: string;
        SendData: boolean;
        ParamsFormat?: basic.StringCompile;
    }
    interface IRequestParams {
        [name: string]: string | number | boolean;
    }
    class Request {
        url: IRequestUrl;
        data: RequestParams<any, QueeDownloader>;
        params: IRequestParams;
        fail: boolean;
        constructor(url: IRequestUrl, data: RequestParams<any, QueeDownloader>, params: IRequestParams);
    }
    class QueeDownloader {
        crypt: basic.ICrypto;
        private webr;
        Uid: string;
        Pwd: string;
        readonly Request: net.WebRequest;
        private quee;
        private isRunning;
        private isDownloading;
        Crypto: basic.ICrypto;
        constructor(crypt: basic.ICrypto);
        current: Request;
        private OnError;
        private DownloadComplete;
        Push(url: IRequestUrl, data: RequestParams<any, QueeDownloader>, params: IRequestParams): void;
        Insert(dcall: Request): void;
        Start(): void;
        Next(): void;
        Restart(): void;
        OnSuccess: bind.EventListener<any>;
        OnFail: bind.EventListener<any>;
        OnFinish: bind.EventListener<any>;
    }
}
export declare namespace net {
    interface IRequestHeader {
        [key: string]: string;
    }
    interface IRequestUrl {
        beforRequest?: (req: net.IRequestUrl) => void;
        Url: string;
        Method?: net.WebRequestMethod;
        Header?: IRequestHeader;
        HasBody?: boolean;
        timeout?: number;
        ResponseType?: ResponseType;
    }
    class RequestUrl implements IRequestUrl {
        private _url;
        private context;
        Header?: IRequestHeader;
        Method?: net.WebRequestMethod;
        HasBody?: boolean;
        ResponseType?: ResponseType;
        beforRequest: (req: net.IRequestUrl) => void;
        timeout?: number;
        Url: string;
        constructor(_url: string, context: basic.IContext, Header?: IRequestHeader, Method?: net.WebRequestMethod, HasBody?: boolean, ResponseType?: ResponseType);
    }
}
export declare namespace basic {
    class DomEventHandler<T extends Event, P> implements IEventHandler, EventListenerObject {
        dom: Element;
        event: string;
        private owner;
        private handle;
        private param?;
        Started: boolean;
        constructor(dom: Element, event: string, owner: any, handle: (eh: DomEventHandler<T, P>, ev: T, param: P) => void, param?: P);
        Start(): void;
        Pause(): void;
        Dispose(): void;
        Reset(): void;
        handleEvent(evt: Event): void;
        static Dispose(dom: EventTarget, event?: string): void;
    }
}
export declare namespace crypto {
    function string2bytes_16(a: string): Uint16Array;
    function bytes2string_16(a: Uint16Array): string;
    function string2bytes(a: string | number[]): any[];
    function bytes2string(a: any): string;
    class Aes implements basic.ICrypto {
        protected Key: number[];
        constructor(key: string | number[] | Uint8Array);
        InitKey(key: number[]): number[];
        static ExpandKey(b: number[]): void;
        Encrypt(data: number[]): number[];
        Decrypt(data: number[]): number[];
        SEncrypt(data: string): string;
        SDecrypt(data: string): string;
        static SubBytes(a: any, c: any): void;
        static AddRoundKey(a: any, c: any): void;
        static ShiftRows(a: any, c: any): void;
        static MixColumns(b: any): void;
        static MixColumns_Inv(b: any): void;
    }
    class AesCBC extends Aes {
        constructor(key: string | number[]);
        InitKey(key: number[]): number[];
        static blockXOR(a: any, c: any): any[];
        static blockIV(): number[];
        static pad16(a: number[]): number[];
        static depad(a: number[]): number[];
        Encrypt(data: number[]): number[];
        Decrypt(data: number[]): number[];
    }
}
export declare namespace crypto {
    class SecureRandom {
        nextBytes(a: any): void;
        rng_get_byte(): any;
    }
}
export declare module crypto1 {
    function string2bytes(a: string): Uint8Array;
    function bytes2string(a: Uint8Array): string;
    class ExAes {
        protected Key: Uint8Array;
        constructor(key: string | Uint8Array);
        InitKey(key: Uint8Array): Uint8Array;
        static ExpandKey(b: Uint8Array): void;
        Encrypt(data: Uint8Array): Uint8Array;
        Decrypt(data: Uint8Array): Uint8Array;
        static SubBytes(a: Uint8Array, c: Uint8Array): void;
        static AddRoundKey(a: any, c: any): void;
        static ShiftRows(a: any, c: any): void;
        static MixColumns(b: any): void;
        static MixColumns_Inv(b: any): void;
    }
    class AesCBC extends ExAes {
        constructor(key: string | Uint8Array);
        InitKey(key: Uint8Array): Uint8Array;
        static blockXOR(a: Uint8Array, c: Uint8Array): Uint8Array;
        static blockIV(): Uint8Array;
        static pad16(a: Uint8Array): Uint8Array;
        static depad(a: Uint8Array): Uint8Array;
        concate(a: Uint8Array, b: Uint8Array): Uint8Array;
        Encrypt(data: Uint8Array): Uint8Array;
        Decrypt(data: Uint8Array): Uint8Array;
    }
}
export declare module crypto1 {
    class SecureRandom {
        nextBytes(a: any): void;
        rng_get_byte(): any;
    }
}
export interface BuckupList<T> {
    values: any[];
    OnUndo?: (self: T, bl: BuckupList<T>) => void;
}
export declare namespace Ids {
    class t1 {
    }
    class t2 {
    }
    class t3 {
    }
}
export declare namespace injecter {
    function observe(obj: any, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): bind.PropBinding;
    function observePath(obj: any, props: string[], callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
    function unobserve(obj: any, prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?: any): boolean | bind.PropBinding[];
}
export declare namespace Notification {
    interface NotificationArgs {
        name: string;
        data: any;
        handler: NotificationHandler<any>;
    }
    interface NotificationHandler<Owner> {
        Id?: any;
        callback: (this: Owner, e: NotificationArgs, ...args: any[]) => void;
        owner?: Owner;
        params?: any;
        context?: IContext;
    }
    function on(name: string, handler: NotificationHandler<any>): void;
    function fire(name: string, params: any[]): void;
    function off(name: string, hndl_id: NotificationHandler<any> | any): boolean;
}
export declare namespace Attributes {
    type attributeType = (...args: any[]) => any;
    interface Attribute<T> extends attributeType {
        declare(_target: any, data: T): void;
        getData(_target: any): T;
    }
    enum AttributeTargets {
        Class = 2,
        Object = 4,
        Function = 8,
        Property = 16,
        All = -1
    }
    interface AttributeDefinition {
        AllowMultiple?: boolean;
        Heritable?: boolean;
        Target?: AttributeTargets;
    }
    function asAttribute(attributer: Function, e: AttributeDefinition): void;
    function getAttributeDef(attr: Function): AttributeDefinition;
    function check(attr: Function, args: IArguments): boolean;
    function getAttributesOf(_target: any): Attribute<any>;
    function getAttributeOf<T>(_target: any, _attribute: Attribute<T>): T;
}
export declare namespace PaintThread {
    interface task2 {
        owner: any;
        method: Function;
        args: any[];
    }
    function Push(ins: bind.JobInstance, e: bind.EventArgs<any, any>, scop?: bind.Scop): void;
    function OnPaint(task: task2): void;
}
