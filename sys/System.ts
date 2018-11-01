import {net, Common, bind, basic, collection, utils, encoding,reflection} from './Corelib';
import {context} from 'context';
var _services = {};
var _defualt: Controller.ProxyData;
var apis = new collection.Dictionary<Function, Controller.Api<any>>("Apis", false);
export declare type RequestMethodShema = net.RequestMethodShema;
export module Controller {
    export function Register(service: IService) {
        Object.freeze(service);
        Object.defineProperty(_services,
            service.Name,
            {
                configurable: false,
                enumerable: false,
                value: service,
                writable: false
            });
    }
    export function decorator<C>(ClassDefinition: C): C {
        return ClassDefinition
    }
    export abstract class Api<T> {

        public abstract GetType();

        public abstract GetRequest(data: T, shema: RequestMethodShema | string | net.WebRequestMethod, params: net.IRequestParams): net.RequestUrl;

        public abstract OnResponse(response: JSON, data: T, context: encoding.SerializationContext);

        constructor( reg?: boolean) {
            apis.Set(this.GetType(), this);
        }
        public Register(method: RequestMethodShema) {
            method.Name = method.Name.toUpperCase();
            if (typeof method.ParamsFormat === 'string')
                method.ParamsFormat = basic.CompileString(method.ParamsFormat);
            this._methodsShema[method.Name] = method;
        }
        public ERegister(method: net.WebRequestMethod, name: string, paramsFormat: string, sendData: boolean) {
            this.Register({ Method: method, Name: name, ParamsFormat: paramsFormat && basic.CompileString(paramsFormat), SendData: sendData });
        }
        public GetMethodShema(m: net.WebRequestMethod | string | net.RequestMethodShema): net.RequestMethodShema {
            if (typeof m === 'string') return this._methodsShema[m.toUpperCase()];//|| { Name: m, Method: 0} as any;
            if (typeof m === 'number') {
                var x = this._methodsShema[net.WebRequestMethod[m].toUpperCase()];
                if (x != null) return x;
                for (var i in this._methodsShema) {
                    var v: net.RequestMethodShema = this._methodsShema[i];
                    if (v.Method === m) return v;
                }
                return;
            } else if (m) {
                if (!m.Name) return m;
            }
            for (var i in this._methodsShema) {
                return this._methodsShema[i];
            }
        }
        private _methodsShema: { [n: string]: RequestMethodShema } = {};
    }
    export class CostumeApi<T> extends Api<T> {
        public GetType() { return this._type; }
        public GetRequest(data: T): net.RequestUrl { return this._getRequest(data); }
        public OnResponse(response: JSON, data: T) { return this._onResponse(response, data); }
        constructor(private _type: Function,
            private _getRequest: (data: T) => net.RequestUrl,
            private _onResponse: (response: JSON, data: T) => void) {
            super();
        }
    }

    var mt;
    function messageType() { return mt || (mt = context.GetType('models.Message')); }

    export interface IService {
        
        Name: string;
        OnResponse(proxy: ProxyCallback<any>, webr: net.QueeDownloader, json: IServiceResponse);
    }

    export interface IServiceResponse {
        __service__: string;
        dropRequest: boolean;
        iss: boolean;
        rdata: any;
        sdata: any;
    }

    export class ProxyCallback<T> extends net.RequestParams<T,net.QueeDownloader> {
        constructor(data: T,
            public param: any,
            public api: Api<T>,
            public context?: encoding.SerializationContext,
            public callBack?: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void,
            public method?: net.WebRequestMethod) {
            super(null, data, true);
        }

        private static parse(json) {
            if (json == null || json.trim() == "") return null;
            try { return JSON.parse(json); } catch (e) { return null; }
        }

        public Callback(sender: net.QueeDownloader, result: net.WebRequest) {
            var iss = true;
            try {
                var r = sender.Request.IsSuccess ? ProxyCallback.parse(result.Response) : null;
                
                if (r && r.hasOwnProperty('__service__')) {
                    var sr: IServiceResponse = r;
                    if (sr.__service__) {
                        var s = _services[sr.__service__] as IService;
                        if (s)
                            s.OnResponse(this, sender, sr);
                        if (sr.dropRequest) return;
                        
                    }
                    iss = sr.iss;
                    r = sr.rdata;
                }
                if (this.api)
                    this.api.OnResponse(r, this.data, this.context || encoding.SerializationContext.GlobalContext);
            } catch (ee) {
                iss = false;
            }
            if (this.callBack)
                this.callBack(this, r, iss && this.IsSuccess, result);
        }

        public OutputData():string {
            if ('string' === typeof this.data) return this.data as any as string;
            if (this.data instanceof ArrayBuffer) return this.data as any;
            var r = this.context == null;
            var e = r ? new encoding.SerializationContext(true) : this.context.reset();
            var d = e.ToJson(this.data);
            if (r) e.Dispose();
            return JSON.stringify(d);
        }

    }
    export class ProxyData {
        private http: net.QueeDownloader;
        private quee: ProxyCallback<any>[] = [];
        private apis: collection.Dictionary<Function | reflection.GenericType, Api<any>>;

        public SetAuth(uid: string, pwd: string) {
            this.http.Uid = uid;
            this.http.Pwd = pwd;
        }
        public set Crypto(v: basic.ICrypto) {
            this.http.Crypto = v;
        }

        constructor(crpt: basic.ICrypto, isCostume: boolean) {
            if (_defualt != null) throw null;
            this.http = new net.QueeDownloader(crpt);
            this.apis = isCostume ? new collection.Dictionary<Function, Api<any>>("Apis", false) : apis;
        }

        public Register<T>(api: Api<any>) {
            this.apis.Set(api.GetType(), api);
        }
        private static getMethod(api: Api<any>, m: net.WebRequestMethod | string | net.RequestMethodShema): net.WebRequestMethod {
            if (typeof m === 'number') return m;
            if (typeof m === 'string') {
                var x = api.GetMethodShema(m);
                return x ? x.Method : 0;
            }
            if (x.Name)
                return net.WebRequestMethod[(m as net.RequestMethodShema).Name] || 0;
            return 0;
        }

        public Costume<T>(url: net.IRequestUrl, data: T, parms: net.IRequestParams, callback: (s: ProxyCallback<T>, result: T, success: boolean, req?: net.WebRequest) => void, objectStat: any) {
            return this.http.Push(url, new ProxyCallback(data, objectStat, void 0, encoding.SerializationContext.GlobalContext, callback), parms);
        }

        public Request<T>(
            type: Function | reflection.GenericType, method: string | net.RequestMethodShema | net.WebRequestMethod, data?: T, params?: net.IRequestParams,
            callback?: RequestCallback<T>, costumize?: RequestCostumize<T>, beforRequest?: (req: net.IRequestUrl) => void, objectStat?: any) {
            const api = this.apis.Get(type != null ? type : data.constructor);
            const t = new ProxyCallback(data, objectStat, api, encoding.SerializationContext.GlobalContext, callback, ProxyData.getMethod(api, method));
            const req = api.GetRequest(data, method, params);
            req.beforRequest = beforRequest;
            if (costumize) costumize(req, t);
            this.http.Push(req, t, null);
        }
        public Push<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, method?: net.WebRequestMethod, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, beforRequest?: (req: net.IRequestUrl) => void, params?: net.IRequestParams) {
			const api = this.apis.Get(type != null ? type : data.constructor);
			const t = new ProxyCallback(data, param, api, serializer || new encoding.SerializationContext(true) || encoding.SerializationContext.GlobalContext, callBack);
            const req = api.GetRequest(data, null, params);
            req.HasBody = true;
			req.beforRequest = beforRequest;
            if (method != undefined)
                req.Method = method;
            if (costumize) costumize(req, t);
            this.http.Push(req, t, params);
        }

        public Post<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams) {
            const api = this.apis.Get(type != null ? type : data.constructor);
            const t = new ProxyCallback(data, param, api, serializer || encoding.SerializationContext.GlobalContext, callBack);
            const req = api.GetRequest(data, null, params);
            req.HasBody = true;
            req.Method = net.WebRequestMethod.Post;
            if (costumize) costumize(req, t);
            this.http.Push(req, t, params);
        }

        public Put<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams) {
            const api = this.apis.Get(type != null ? type : data.constructor);
            const t = new ProxyCallback(data, param, api, serializer || encoding.SerializationContext.GlobalContext, callBack);
            const req = api.GetRequest(data, null, params);
            req.HasBody = true;
            req.Method = net.WebRequestMethod.Put;
            if (costumize) costumize(req, t);
            this.http.Push(req, t,params);
        }

        public Get<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams) {
            const api = this.apis.Get(type != null ? type : data.constructor);
            const t = new ProxyCallback(data, param, api, serializer || encoding.SerializationContext.GlobalContext, callBack);
            const req = api.GetRequest(data, null, params);
            req.Method = net.WebRequestMethod.Get;
            if (costumize) costumize(req, t);
            this.http.Push(req, t, params);
        }
        public Delete<T>(type: Function | reflection.GenericType, data: T, param: any, callBack?: RequestCallback<T>, costumize?: RequestCostumize<T>, serializer?: encoding.SerializationContext, params?: net.IRequestParams) {
            const api = this.apis.Get(type != null ? type : data.constructor);
            const t = new ProxyCallback(data, param, api, serializer || encoding.SerializationContext.GlobalContext, callBack);
            const req = api.GetRequest(data, null, params);
            req.Method = net.WebRequestMethod.Delete;
            if (costumize) costumize(req, t);
            this.http.Push(req, t, params);
            return req;
        }

        public static get Default() { return _defualt || (_defualt = new ProxyData(basic.Crypto, false)); }
    }
    export declare type RequestCallback<T> = (_s: ProxyCallback<T>, r: JSON, issuccess: boolean, result?: net.WebRequest) => void;
    export declare type RequestCostumize<T> = (_req: net.IRequestUrl, t: ProxyCallback<any>) => void;
}



export module sdata {

    export enum DataStat {
        IsNew = 0,
        Modified = 1,
        Saved = 2,
        Updating = 4,
        Uploading = 8,
        Updated = 16,   
        Frozed = 32
    }
    export interface INew {
        CreateNew(id: number): DataRow;
        getById(id: number): DataRow;
    }

    var dic = new collection.Dictionary<Function, INew>('sd');
    export abstract class DataRow extends bind.DObject implements basic.IId {

        public static DPId: bind.DProperty<number, DataRow> = bind.DObject.CreateField<number, DataRow>("Id", Number, 0, (e) => {
            e.__this.OnIdChanged(e._old, e._new);
        }, (e) => {
            if (e._new == null || e._new === 0)
                e._new = basic.New();
        }, bind.PropertyAttribute.IsKey);
        protected static DPStat: bind.DProperty<DataStat, DataRow> = bind.DObject.CreateField<DataStat, DataRow>("Stat", Number, 0, null, null, bind.PropertyAttribute.Private | bind.PropertyAttribute.NonSerializable);
        public get Stat() { return this.get(DataRow.DPStat); }
        public set Stat(s: sdata.DataStat) { this.set(DataRow.DPStat, s); }


        public static DPLastModified = bind.DObject.CreateField<Date, DataRow>("LastModified", Date);
        public LastModified: Date;

        public static CreateFromJson(json, type: typeof DataRow, requireNew: boolean) {
            if (requireNew) return null;
            const id = (typeof json === 'number' ? json : json.Id) as number;
            if (!requireNew)
                if (typeof id === 'number') var x = type.getById(id, type) as any;
            if (!x) {
                var c = dic.Get(type);
                if (c) x = c.CreateNew(id);
                if (!x) x = new (type as any)(id);
            }
            return x;
        }

        protected OnIdChanged(old: number, nw: number) {
            const store = this.getStore();
            if (old)
                store.Remove(old);
            if (nw)
                store.Set(nw, this);
        }
        protected abstract getStore(): collection.Dictionary<number, this>;
        get Id(): number {
            return this.get(DataRow.DPId);
        }
        set Id(v: number) {
            this.set(DataRow.DPId, v);
        }
        constructor(id: number) {
            super();
            const st = this.getStore();
            if (id && st) {
                if (st.Get(id) != null) return st.Get(id);
                this.set(DataRow.DPId, id);
            }
        }
        public static __fields__(): Array<any> {
            return [
                DataRow.DPId, this.DPLastModified, DataRow.DPStat
            ];
        }
        public static getById(id: number, type: Function): DataRow {
            return undefined;
        }
        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {            
            if (typeof json === 'number') {
                if (this.Stat >= DataStat.Updating)
                    return this;
                this.Id = json;
                this.set(DataRow.DPStat, DataStat.Updating);
                Controller.ProxyData.Default.Request(this.constructor, "UPDATE", this, this as any, () => { if (this.Stat > DataStat.Updating) { return false; } return true; });
            } else {
                this.set(DataRow.DPStat, DataStat.Updated);
                super.FromJson(json, context, update);
                if (json != null && json.IsFrozen == true) {
                    this.Freeze();
                }
            }
            return this;
        }
        
        //private t: string;
        public get TableName() {
            return context.NameOf(this.constructor).replace("models.", "");// this.t;
        }
        abstract Update();
        abstract Upload();
    }

    export abstract class QShopRow extends sdata.DataRow {
        static __fields__() { return []; }
        GenType(): Function { return QShopRow; }
        private static _QueryApi: string;
        public static get QueryApi(): string {
            return this._QueryApi;
        }
        constructor(id?: number) {super(id);}
        Update() {
            
        }
        Upload() {
            
        }
    }
    export abstract class DataTable<T extends DataRow> extends collection.List<T>{
        private static DPOwner = DataTable.CreateField<DataRow, DataTable<any>>('Owner', DataRow, null, null, null, bind.PropertyAttribute.SerializeAsId);

        public static DPStat = bind.DObject.CreateField<DataStat, DataTable<any>>('Stat', Number, 0, null, null, bind.PropertyAttribute.Private);
        public Stat: DataStat;

        static __fields__() {
            return [DataTable.DPOwner];
        }
        get Owner() { return this.get(DataTable.DPOwner); }
        set Owner(v: DataRow) { this.set(DataTable.DPOwner, v); }
        constructor(private _parent: DataRow, argType: Function, private ctor: (id: number) => T, array?: T[]) {
            super(argType, array);
            this.Owner = _parent;
        }
        public CreateNewItem(id: number): T {
            return DataRow.getById(id, this.ArgType) as T || this.ctor(id);
        }
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object) {
            if (this.Stat == sdata.DataStat.Frozed) return;
            this.set(DataTable.DPStat, DataStat.Updating);
            const obj = super.FromJson(json, x, update, callback) as DataTable<T>;
            this.set(DataTable.DPStat, DataStat.Updated);
            if (json == null) return this;
            if (json != null && json.IsFrozen == true)
                this.Freeze();
            return this;
        }

        public GetById(id: number): T {
            var t = this.AsList();
            var _ = DataRow.DPId;
            for (var i = 0, l = t.length; i < l; i++)
                if (t[i].GetValue<number>(_) === id) return t[i];
            return undefined;
        }

        Update() {

        }
        Upload() {
        }
        Add(item: T) {
            return (this._list.indexOf(item) == -1) ? super.Add(item) : this;
        }
        FromCsv(input: string, context?: encoding.SerializationContext, parser?: encoding.fillArgs) {
            var csv = new encoding.CSV(input, true, true);
            var key = csv.ColumnIndex("Id");
            if (key == -1) key = void 0;
            context = context || encoding.SerializationContext.GlobalContext;
            var lst: T[] = [];
            while (csv.Next(parser)) {
                var c = csv.Current as basic.IId;
                var t = this.CreateNewItem(key === void 0 ? basic.New() : c.Id || basic.New());
                lst.push(t.FromJson(c, context));
            }
            this.AddRange(lst);
        }
    }
    var stp = true;

    export declare type bindCallback = (e: bind.EventArgs<any, any>) => void;
    export interface Property {
        jname?: string;
        sname?: string;
        type: Function | reflection.DelayedType | reflection.GenericType;
        default?: any;
        onchange?: bindCallback;
        check?: bindCallback;
        get: () => any;
        set: (v: any) => any;
    }
    export interface Properties {
        [name: string]: Property | Function;
    }

    export interface Model {
        namespace: string;
        class: string;
        super: string | Model;
        properties: Properties;
        prototype: any;
        init();
        ctor();
        cctor();
        onPropertyChanged(e: bindCallback);
    }
}


export module base {
    export  interface Vecteur<T> extends bind.DObject{
        From: T;
        To: T;
        Check(val: T);
    }
    export class DateVecteur extends bind.DObject implements Vecteur<Date>{
        public static DPFrom = bind.DObject.CreateField<Date, DateVecteur>('From', Date);
        public static DPTo = bind.DObject.CreateField<Date, DateVecteur>('To', Date);
        get From() { return this.get(DateVecteur.DPFrom); } set From(v: Date) { this.set(DateVecteur.DPFrom, v); }
        get To() { return this.get(DateVecteur.DPTo); } set To(v: Date) { this.set(DateVecteur.DPTo, v); }
        static __fields__() { return [DateVecteur.DPFrom, DateVecteur.DPTo]; }
        Check(date: Date) {
            if (!sdata) return true;
            var f = this.From;
            var t = this.To;
            var val = date.getTime();
            return (f == null || f.getTime() <= val) && (t == null || t.getTime() >= val);
        }
    }
    export class NumberVecteur extends bind.DObject implements Vecteur<number>{
        public static DPFrom = bind.DObject.CreateField<number, NumberVecteur>('From', Number);
        public static DPTo = bind.DObject.CreateField<number, NumberVecteur>('To', Number);
        get From() { return this.get(NumberVecteur.DPFrom); } set From(v: number) { this.set(NumberVecteur.DPFrom, v); }
        get To() { return this.get(NumberVecteur.DPTo); } set To(v: number) { this.set(NumberVecteur.DPTo, v); }
        static __fields__() { return [NumberVecteur.DPFrom, NumberVecteur.DPTo];}
        Check(val: number) {
            if (!val) return true;
            return (this.From == null || this.From <= val) && (this.To == null || this.To >= val);
        }
    }


}




export namespace System{
    var co: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    class Color {            
            toHex (t, e) {
                t = parseInt(t, 10);
                for (var i = ""; t > 0;)
                    i = co[t % 16] + i, t = Math.floor(t / 16);
                for (; i.length < e;)
                    i = "0" + i;
                return i
            }
            hexToDec (t) {
                return parseInt(t, 16)
            }
            toRgb (t) {
                var e, i, s, n;
                return "string" != typeof t
                    ? (e = t[0], i = t[1], s = t[2])
                    : -1 != t.indexOf("rgb")
                        ? (n = t.substr(t
                            .indexOf("(") +
                            1,
                            t.lastIndexOf(")") - t.indexOf("(") - 1)
                            .split(","), e = n[0], i = n[1], s = n[2])
                        : ("#" == t.substr(0, 1) && (t = t.substr(1)), e = this.hexToDec(t.substr(0, 2)), i = this
                            .hexToDec(t.substr(2, 2)), s = this
                                .hexToDec(t
                                    .substr(4, 2))), e = parseInt(e, 10) || 0, i = parseInt(i, 10) || 0, s =
                    parseInt(s, 10) || 0,
                    (0 > e || e > 255) && (e = 0), (0 > i || i > 255) && (i = 0), (0 > s || s > 255) && (s = 0), [e, i, s]
            }
            hsvToRgb (t, e, i) {
                var s, n, a, r, h, o, l, c;
                switch (s = Math
                    .floor(t / 60) %
                6, n = t / 60 - s, a = i * (1 - e), r = i * (1 - n * e), h = i * (1 - (1 - n) * e), o = 0, l = 0,
                c = 0, s
                ) {
                    case 0:
                        o = i, l = h, c = a;
                        break;
                    case 1:
                        o = r, l = i, c = a;
                        break;
                    case 2:
                        o = a, l = i, c = h;
                        break;
                    case 3:
                        o = a, l = r, c = i;
                        break;
                    case 4:
                        o = h, l = a, c = i;
                        break;
                    case 5:
                        o = i, l = a, c = r
                }
                return o = Math.floor(255 * o), l = Math.floor(255 * l), c = Math.floor(255 * c), [o, l, c]
            }
            rgbToHsv (t, e, i) {
                var s, n, a, r, h, o, l, c;
                return s = t / 255, n = e / 255, a = i / 255, r = Math.min(s, n, a), h = Math
                    .max(s, n, a), l = 0, o = 0 === h ? 0 : 1 - r / h, c = h,
                    h == r
                        ? l = 0
                        : h == s && n >= a
                            ? l = 60 * (n - a) / (h - r) + 0
                            : h == s && a > n
                                ? l = 60 * (n - a) / (h - r) + 360
                                : h == n ? l = 60 * (a - s) / (h - r) + 120 : h == a && (l = 60 * (s - n) / (h - r) + 240),
                    [l, o, c]
            }
        }
    }