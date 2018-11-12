import { net, bind, basic, collection, encoding, reflection } from './Corelib';
export declare module Controller {
    type RequestMethodShema = net.RequestMethodShema;
    function Register(service: IService): void;
    function decorator<C>(ClassDefinition: C): C;
    abstract class Api<T> {
        abstract GetType(): any;
        abstract GetRequest(data: T, shema: RequestMethodShema | string | net.WebRequestMethod, params: net.IRequestParams): net.RequestUrl;
        abstract OnResponse(response: JSON, data: T, context: encoding.SerializationContext): any;
        constructor(reg?: boolean);
        Register(method: RequestMethodShema): void;
        ERegister(method: net.WebRequestMethod, name: string, paramsFormat: string, sendData: boolean): void;
        GetMethodShema(m: net.WebRequestMethod | string | net.RequestMethodShema): net.RequestMethodShema;
        private _methodsShema;
    }
    class CostumeApi<T> extends Api<T> {
        private _type;
        private _getRequest;
        private _onResponse;
        GetType(): Function;
        GetRequest(data: T): net.RequestUrl;
        OnResponse(response: JSON, data: T): void;
        constructor(_type: Function, _getRequest: (data: T) => net.RequestUrl, _onResponse: (response: JSON, data: T) => void);
    }
    interface IService {
        Name: string;
        OnResponse(proxy: ProxyCallback<any>, webr: net.QueeDownloader, json: IServiceResponse): any;
    }
    interface IServiceResponse {
        __service__: string;
        dropRequest: boolean;
        iss: boolean;
        rdata: any;
        sdata: any;
    }
    class ProxyCallback<T> extends net.RequestParams<T, net.QueeDownloader> {
        param: any;
        api: Api<T>;
        context?: encoding.SerializationContext;
        callBack?: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void;
        method?: net.WebRequestMethod;
        constructor(data: T, param: any, api: Api<T>, context?: encoding.SerializationContext, callBack?: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void, method?: net.WebRequestMethod);
        private static parse;
        Callback(sender: net.QueeDownloader, result: net.WebRequest): void;
        OutputData(): string;
    }
    class ProxyData {
        private http;
        private quee;
        private apis;
        SetAuth(uid: string, pwd: string): void;
        Crypto: basic.ICrypto;
        constructor(crpt: basic.ICrypto, isCostume: boolean);
        Register<T>(api: Api<any>): void;
        private static getMethod;
        Costume<T>(url: net.IRequestUrl, data: T, parms: net.IRequestParams, callback: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void, objectStat: any): void;
        Request<T>(type: Function | reflection.GenericType, method: string | net.RequestMethodShema | net.WebRequestMethod, data?: T, params?: net.IRequestParams, callback?: RequestCallback<T>, costumize?: RequestCostumize<T>, beforRequest?: (req: net.IRequestUrl) => void, objectStat?: any): void;
        Push<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, method?: net.WebRequestMethod, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, beforRequest?: (req: net.IRequestUrl) => void, params?: net.IRequestParams): void;
        Post<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
        Put<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
        Get<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): void;
        Delete<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams): net.RequestUrl;
        static readonly Default: ProxyData;
    }
    type RequestCallback<T> = (_s: ProxyCallback<T>, r: JSON, issuccess: boolean, result?: net.WebRequest) => void;
    type RequestCostumize<T> = (_req: net.IRequestUrl, t: ProxyCallback<any>) => void;
}
export declare module sdata {
    enum DataStat {
        IsNew = 0,
        Modified = 1,
        Saved = 2,
        Updating = 4,
        Uploading = 8,
        Updated = 16,
        Frozed = 32
    }
    interface INew {
        CreateNew(id: number): DataRow;
        getById(id: number): DataRow;
    }
    abstract class DataRow extends bind.DObject implements basic.IId {
        static DPId: bind.DProperty<number, DataRow>;
        protected static DPStat: bind.DProperty<DataStat, DataRow>;
        Stat: sdata.DataStat;
        static DPLastModified: bind.DProperty<Date, DataRow>;
        LastModified: Date;
        static CreateFromJson(json: any, type: typeof DataRow, requireNew: boolean): any;
        protected OnIdChanged(old: number, nw: number): void;
        protected abstract getStore(): collection.Dictionary<number, this>;
        Id: number;
        constructor(id: number);
        static __fields__(): Array<any>;
        static getById(id: number, type: Function): DataRow;
        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this;
        readonly TableName: string;
        abstract Update(): any;
        abstract Upload(): any;
    }
    abstract class QShopRow extends sdata.DataRow {
        static __fields__(): any[];
        GenType(): Function;
        private static _QueryApi;
        static readonly QueryApi: string;
        constructor(id?: number);
        Update(): void;
        Upload(): void;
    }
    abstract class DataTable<T extends DataRow> extends collection.List<T> {
        private _parent;
        private ctor;
        private static DPOwner;
        static DPStat: bind.DProperty<DataStat, DataTable<any>>;
        Stat: DataStat;
        static __fields__(): bind.DProperty<DataRow, DataTable<any>>[];
        Owner: DataRow;
        constructor(_parent: DataRow, argType: Function, ctor: (id: number) => T, array?: T[]);
        CreateNewItem(id: number): T;
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this;
        GetById(id: number): T;
        Update(): void;
        Upload(): void;
        Add(item: T): this;
        FromCsv(input: string, context?: encoding.SerializationContext, parser?: encoding.fillArgs): void;
    }
    type bindCallback = (e: bind.EventArgs<any, any>) => void;
    interface Property {
        jname?: string;
        sname?: string;
        type: Function | reflection.DelayedType | reflection.GenericType;
        default?: any;
        onchange?: bindCallback;
        check?: bindCallback;
        get: () => any;
        set: (v: any) => any;
    }
    interface Properties {
        [name: string]: Property | Function;
    }
    interface Model {
        namespace: string;
        class: string;
        super: string | Model;
        properties: Properties;
        prototype: any;
        init(): any;
        ctor(): any;
        cctor(): any;
        onPropertyChanged(e: bindCallback): any;
    }
}
export declare module base {
    interface Vecteur<T> extends bind.DObject {
        From: T;
        To: T;
        Check(val: T): any;
    }
    class DateVecteur extends bind.DObject implements Vecteur<Date> {
        static DPFrom: bind.DProperty<Date, DateVecteur>;
        static DPTo: bind.DProperty<Date, DateVecteur>;
        From: Date;
        To: Date;
        static __fields__(): bind.DProperty<Date, DateVecteur>[];
        Check(date: Date): boolean;
    }
    class NumberVecteur extends bind.DObject implements Vecteur<number> {
        static DPFrom: bind.DProperty<number, NumberVecteur>;
        static DPTo: bind.DProperty<number, NumberVecteur>;
        From: number;
        To: number;
        static __fields__(): bind.DProperty<number, NumberVecteur>[];
        Check(val: number): boolean;
    }
}
