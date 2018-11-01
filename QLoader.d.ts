declare var enumProperty: RegExp;
declare var enumPropertyEs6: string;
declare var QReqConfig: any;
declare enum ModuleType {
    folder = 9007199254740991,
    uknown = -1,
    code = 0,
    json = 1,
    xml = 2,
    html = 3,
    Image = 4,
    template = 5,
    style = 6,
    none = 7
}
declare enum ModuleExt {
    js = 0,
    json = 1,
    xml = 2,
    html = 3,
    img = 4,
    template = 5,
    svg = 6,
    ico = 6,
    css = 6,
    none = 7
}
declare enum ModuleStat {
    New = 0,
    Downloading = 1,
    Downloaded = 2,
    Defining = 3,
    Defined = 4,
    Executing = 5,
    Executed = 6,
    Failed = 7
}
declare class Map {
    public delete(key);
    public get(key):any;
    public set(key, value);
}
declare namespace System {
    interface IRef<T> {
        value: T;
    }
    type IPluginEventCallback = (e: PluginsEvent) => void;
    interface PluginsEvent {
        exports: any;
        url: System.basics.IUrl;
        data: any;
    }
    namespace basics {
        interface IUrl extends Url {
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
            IsEquals(url: Url): boolean;
            private _directory;
            readonly Directory: Url;
            readonly ParentDirectory: Url;
            PluginName: string;
            private _path;
            getmoduleType(_default?: ModuleType): ModuleType;
            readonly moduleType: ModuleType;
            host: string;
            moduleName: string;
            ext: string;
            getEName(defaultExt?: string): string;
            setDefaultExt(ext: string): this;
            setDefaultType(type: ModuleType): this;
            params: string;
            IsFolder: boolean;
            readonly IsPlugin: boolean;
            constructor(url?: string);
            toString(): string;
            getDirectory(): any;
            private fragment;
            private _isContextual;
            readonly IsContextual: boolean;
            private getUrl;
            private init;
            readonly IsRooted: boolean;
            getHost(url: string): void;
            getFullHost(url: string): void;
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
    namespace net {
        class Header {
            private _key;
            private _value;
            constructor(_key: string, _value: number | string | boolean);
            readonly key: string;
            readonly value: string;
        }
        class EventListener {
            private key;
            private _deleagtes;
            private _store;
            constructor(key: any);
            On: Function;
            Off: Function;
            private call;
            PInvoke(key: any, _this: any, array: any[]): void;
            Invok(key: any, callBack: (d: Function) => void): void;
            Add(delegate: Function, key: any): void;
            Remove(key: any): void;
        }
        enum ResponseType {
            json = 0,
            Document = 1,
            Text = 2,
            ArrayBuffer = 3,
            Blob = 4,
            "" = 8
        }
        enum WebRequestMethod {
            Get = 0,
            Post = 1,
            Head = 2,
            Put = 3,
            Delete = 4,
            Options = 5,
            Connect = 6
        }
        class WebRequest {
            http: XMLHttpRequest;
            _method: WebRequestMethod;
            _responseType: ResponseType;
            key: Object;
            OnComplete: EventListener;
            constructor();
            method: 0 | WebRequestMethod.Post | WebRequestMethod.Head | WebRequestMethod.Put | WebRequestMethod.Delete | WebRequestMethod.Options | WebRequestMethod.Connect;
            ResponseType: ResponseType.Document | ResponseType.Text | ResponseType.ArrayBuffer | ResponseType.Blob | ResponseType.json;
            _onprogress(e: any): void;
            readonly IsSuccess: boolean;
            Download<T>(url: basics.IUrl, data: downloadCallback<T>): void;
            readonly Response: any;
        }
        class downloadCallback<T> {
            callback: (http: Downloader, data: downloadCallback<T>) => void;
            data: T;
            isPrivate?: any;
            IsSuccess: boolean;
            constructor(callback: (http: Downloader, data: downloadCallback<T>) => void, data: T, isPrivate?: any);
        }
        class __data<T> {
            url: basics.IUrl;
            data: downloadCallback<T>;
            constructor(url: basics.IUrl, data: downloadCallback<T>);
        }
        class Downloader {
            webr: WebRequest;
            quee: __data<any>[];
            current: __data<any>;
            isRunning: boolean;
            isDownloading: boolean;
            success: any[];
            fails: any[];
            OnSuccess: EventListener;
            OnFail: EventListener;
            OnFinish: EventListener;
            constructor();
            readonly Request: WebRequest;
            DownloadComplete(xmlRequest: any): void;
            Push<T>(url: basics.IUrl, data: downloadCallback<T>): void;
            Start(): void;
            Next(): void;
            Restart(): void;
        }
    }
    function checkOverFlow(): any[];
    function checkStat(): any[];
    function getUnExecuted(): any;
    function getUnUnSuccessed(): any;
    function getUExecuted(): any;
    function collectAssets(): any;
    function getCmdCopy(dest: string): any;
}
declare function ValidateImport(...styles: any[]): void;
declare var __extends: any;
declare var exports: any;
declare var __global: {
    https: boolean;
    supportTemplate: boolean;
    useListenerOrMutation: boolean;
    ApiServer?: System.basics.Url;
    CaseSensitive: boolean;
    GetApiAddress(url: string): string;
};
declare var envirenment: {
    isBrowser: boolean;
    isWebWorker: boolean;
    isOpera: boolean;
};
declare function clone<T>(obj: T): T;
declare var $: (selector: any, context: any) => void;
declare var $defineProperty: (o: any, p: string, attributes: PropertyDescriptor & ThisType<any>, onError?: (o: any, p: string, attributes: PropertyDescriptor & ThisType<any>) => any) => any;
declare var $bench: (f: () => any, timeSpan: number) => number;
declare var w: Window;
interface IContext {
    context: IContext;
    CanAccessToMe(type: string, folder: string, name: string): any;
    GetPath(path: string): string;
    NameOf(type: Function): string;
    GetType(path: string): Function;
    GetEnum(path: string): IEnum;
    GetStat(): ModuleStat;
    OnStat(target: string, stat: ModuleStat, callback: (me: string, target: string, cstat: ModuleStat, stat: ModuleStat) => void): any;
    OnGStat(stat: ModuleStat, callback: (me: string, target: string, cstat: ModuleStat, stat: ModuleStat) => void): any;
    Assemblies: any;
}
interface IEnum {
    [n: string]: number;
}
declare module "define" {
    var define: $define;
}
declare module "context" {
    var context: IContext;
    function CanAccessToMe(type: string, folder: string, name: string): any;
    function GetPath(path: string): string;
    function NameOf(type: Function): string;
    function GetType(path: string): Function;
    function GetEnum(path: string): IEnum;
    function GetStat(): ModuleStat;
    function OnStat(target: string, stat: ModuleStat, callback: (me: string, target: string, cstat: ModuleStat, stat: ModuleStat) => void): any;
    function OnGStat(stat: ModuleStat, callback: (me: string, target: string, cstat: ModuleStat, stat: ModuleStat) => void): any;
    var Assemblies: any;
}
declare interface ITemplateModule {
    get(name: string): HTMLTemplateElement;
    get(i: number): ITemplateModule;
}
interface ilib {
    require: $require;
    define: $define;
    entryPoint: any;
}
declare module "lib:*" {
    var require: $require;
    var define: $define;
    var entryPoint: any;
}
declare module "json|*" {
    function require(path: string, callback: (e: any) => void, onError: () => void): any;
    var value: any;
}
declare module "html|*" {
    const value: any;
    export default value;
    function Validate(): any;
    var context: IContext;
}
declare module "style|*" {
    function require(path: string, callback: (e: any) => void, onError: () => void): any;
    var style: StyleSheet;
    function Validate(): any;
}
declare module "template|*" {
    function require(path: string, callback: (e: any) => void, onError: () => void): any;
    var template: ITemplateModule;
    function Validate(): any;
    var context: IContext;
}
declare module "plugin|*" {
    var moduleType: ModuleType;
    function addEventListener(stat: string | number, callback: IPluginEventCallback, data: any): any;
    function removeEventlistenr(stat: string | number, callback: IPluginEventCallback): any;
}
declare module "xml|*" {
    function require(path: string, callback: (e: any) => void, onError: () => void): any;
    var xml: XMLDocument;
    function Validate(): any;
}
declare module "code|*" {
    var s: any;
}
declare module "|*" {
    var s: any;
}
declare module "*|?" {
    var moduleType: ModuleType;
    function addEventListener(stat: string, callback: IPluginEventCallback, data: any): any;
    function removeEventlistenr(stat: string, callback: IPluginEventCallback): any;
}
declare interface PluginsEvent {
    exports: any;
    url: IUrl;
    data: any;
}
declare interface IEvent {
    moduleType: ModuleType;
    addEventListener(stat: string, callback: IPluginEventCallback, data: any): any;
    removeEventlistenr(stat: string, callback: IPluginEventCallback): any;
}
declare interface IUrl {
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
    toString(): string;
}
declare type IPluginEventCallback = (e: PluginsEvent) => void;
declare interface ITemplateExport {
    require: (m: any) => void;
    template: ITemplateModule;
    html: HTMLElement;
    context: IContext;
}
declare type $define = (path: string, dependencies: string[], module: (...args: string[]) => void) => void;
declare type $require = (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => any;
declare var require: $require;
interface ITemplatePlugin {
    require(path: string, callback: (e: any) => void, onError: () => void): any;
    template: ITemplateModule;
    Validate(): any;
    context: IContext;
}
