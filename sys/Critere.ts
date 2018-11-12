import { bind, reflection, collection, utils } from "./Corelib";
import { UI } from "./UI";
import { sdata } from "./System";

var $Bool = Boolean;
export namespace Critere {

    var __typesDesc = new collection.Dictionary<Function, Critere.CritereMVC>("test");

    export abstract class Critere<T> /*extends bind.DObject*/ extends utils.Filter<T, utils.IPatent<T>> implements utils.IPatent<T>{
        Check(s: T): boolean {
            { }
            return this.isMatch(s);
        }

        //////////*******************************************//////////////////////////////////
        private deb: number;
        private fin: number;
        protected convertFromString(x: string): utils.IPatent<T> {
            throw new Error("Method not implemented.");
        }
        public Begin(deb: number, count: number) {
            this.deb = deb;
            this.fin = deb + count;
            return !this.IsQuerable();
        }

        public IsMatch(i: number, item: T) {
            return i >= this.deb && i < this.fin && this.isMatch(item);
        }
        equals(p: utils.IPatent<T>): boolean {
            return p as any == this;
        }
        ////////**************************************************/////////////////////////////
        abstract IsQuerable(): boolean;
        protected _view: UI.JControl;
        protected abstract getView(): UI.JControl;
        public Activate() {
            this.Scop.setAttribute('activate', true);
            var s = this.Scop.getScop('activate');
        }
        public Disactivate() {
            this.Scop.setAttribute('activate', false);
        }

        public GetMatchs(p: T[]): T[] {
            if (!this.IsQuerable()) return p;
            var v = [];
            for (var i = 0; i < p.length; i++) {
                var x = p[i];
                if (this.isMatch(x)) v.push(x);
            }
            return v;
        }

        abstract clear(): void;
        constructor() {
            super();
        }
        protected Scop: bind.ValueScop = new bind.ValueScop(this, bind.BindingMode.TwoWay);
        public get View() {
            return this._view || (this._view = this.getView());
        }
        public isMatch(v: T): boolean {
            return this._isMatch(v);
        }
        public IsActivated() {
            var s = this.Scop.getScop('activate');
            return !!(s && s.Value);
        }
        protected abstract _isMatch(v: T): boolean;
        protected init() {
            var vls = this.GetType().getFields();
            for (var i = 0; i < vls.length; i++) {
                var p = vls[i];
                if (reflection.IsInstanceOf(p.Type, Text)) {
                    this.set(p, new Text(p.Name));
                }
                else if (reflection.IsInstanceOf(p.Type, Vector)) {
                    this.set(p, new Vector(p.Name));
                }
                else if (reflection.IsInstanceOf(p.Type, Period)) {
                    this.set(p, new Period(p.Name));
                }
                else if (reflection.IsInstanceOf(p.Type, Boolean)) {
                    this.set(p, new Boolean(p.Name));
                }
                else throw null;
            }
        }

        protected static getTypeOf(type: Function | reflection.GenericType | reflection.DelayedType): Function {
            return this.Get(type).CritereType;
        }
        protected smartClear() {
            var vls = this.GetValues();
            for (var n in vls) {
                var v = vls[n] as Critere.Critere<T>;
                if (v instanceof Critere)
                    v.clear();
            }
        }

        static ctor() {
            this.Register(String, Text, {}, (o, dp, mvc, prm) => new Text((prm && prm.label) || dp.Name));
            this.Register($Bool, Boolean, {}, (o, dp, mvc, prm) => new Boolean((prm && prm.label) || dp.Name));
            this.Register(Number, Vector, {}, (o, dp, mvc, prm) => new Vector((prm && prm.label) || dp.Name));
            this.Register(Date, Period, {}, (o, dp, mvc, prm) => new Period((prm && prm.label) || dp.Name));
        }
        public static Register(PropertyType: Function,
            CritereType: Function,
            Properties: any,
            CreateView: (owner: Critere<any>, prop: bind.DProperty<any, any>, CritereMVC, params: { [n: string]: any }) => Critere<any>) {
            __typesDesc.Set(PropertyType, { CritereType: CritereType, PropertyType: PropertyType, CreateView: CreateView, Properties: Properties });
        }
        public static Get(type: Function | reflection.GenericType | reflection.DelayedType, strict?: boolean): CritereMVC {
            if (type instanceof reflection.GenericType)
                type = type.Constructor;
            else if (type instanceof reflection.DelayedType)
                type = type.Type;
            return __typesDesc.Get(type) || (strict ? null : __typesDesc.Get(String));
        }
        public Open(callback: (n: this) => void) {
            if (!this.modal) this.modal = new UI.Modal();
            var m = this.modal;
            if (!m.IsInit)
                m.OnInitialized = (m) => { m.Add(this.View); m.OkTitle('Search'); m.Canceltitle('Cancel'); m.Title('QSearch'); }
            m.OnClosed.Add((m) => {
                if (m.Result == UI.MessageResult.ok) callback(this);
                m.Modal.OnClosed.Remove('');
            }, '');
            m.Open();
        }
        private modal: UI.Modal;
    }

    export interface CritereMVC {
        PropertyType: Function;
        CritereType: Function;
        Properties: any;
        CreateView(owner: Critere<any>, prop: bind.DProperty<any, any>, desc: CritereMVC, params: { [n: string]: any }): Critere<any>;
    }

    export abstract class Unaire<T> extends Critere<T> {
        clear() {
            this.Value = null;
        }
        static __fields__() { return [this.DPValue]; }
        static CheckType(e: bind.EventArgs<any, Unaire<any>>) {
            e.__this.CheckType(e);
        }

        public static DPValue = bind.DObject.CreateField<any, Unaire<any>>('Value', Object, null, null, Unaire.CheckType);
        public Value: T;

        constructor() {
            super();
        }

        protected abstract CheckType(e: bind.EventArgs<T, Unaire<T>>): void;
    }


    export abstract class Couple<T> extends Critere<T> {
        static __fields__() { return [this.DPX, this.DPY]; }
        static CheckType(e: bind.EventArgs<any, Couple<any>>) {
            e.__this.CheckType(e);
        }
        public static DPX = bind.DObject.CreateField<Object, Couple<any>>('X', Object, null, null, Couple.CheckType);
        public X: T;
        public static DPY = bind.DObject.CreateField<Object, Couple<any>>('Y', Object, null, null, Couple.CheckType);
        public Y: T;
        constructor() {
            super();
        }
        protected abstract CheckType(e: bind.EventArgs<T, Couple<T>>): void;
        abstract clear();
    }


    export class Text extends Unaire<string | any> {
        clear() {
            this.Value = null;
        }
        getView(): UI.JControl {
            return new UI.TControl('templates.crtText', this.Scop);
        }
        set Label(v: string) {
            this.Scop.setAttribute('label', v);
        }
        protected CheckType(e: bind.EventArgs<string | any, Unaire<string | any>>): void {
            e._new = e._new == null ? null : String(e._new).toLowerCase();
        }
        protected _isMatch(v: string | any) {
            var sv = this.Value;
            if (sv == null || sv == "") return true;
            if (v == null) return false;
            if (v == sv) return true;
            return String(v).toLowerCase().indexOf(sv) != -1;
        }

        constructor(label: string) {
            super();
            this.Label = label || "Label";
        }
        get Value() {
            return this.get(Unaire.DPValue);
        }
        set Value(v) {
            this.set(Unaire.DPValue, v);
        }
        IsQuerable(): boolean {
            return (this.Value != null && String(this.Value).trim() !== "");
        }
    }

    export class Boolean extends Unaire<boolean> {
        clear() {
            this.Value = undefined;
        }
        getView(): UI.JControl {
            return new UI.TControl('templates.crtBool', this.Scop);
        }
        set Label(v: string) {
            this.Scop.setAttribute('label', v);
        }
        protected CheckType(e: bind.EventArgs<boolean, Unaire<boolean>>): void {
            e._new = e._new == null ? null : e._new === undefined ? undefined : !!e._new;
        }
        protected _isMatch(v: boolean) {
            var sv = this.Value;
            if (sv === undefined) return true;
            return sv === v;
        }

        IsQuerable(): boolean {
            return this.Value != null;
        }

        constructor(label: string) {
            super();
            this.Label = label || "Label";
        }
    }


    export class Vector extends Couple<number> {
        protected getView(): UI.JControl {
            return new UI.TControl('templates.crtVector', this.Scop);
        }
        protected CheckType(e: bind.EventArgs<number, Couple<number>>) {
            if (typeof e._new === 'number') return;
            if (typeof e._new === 'string')
                e._new = parseFloat(e._new as string);
            else if (e._new == null)
                return;
            else e._new = e._old;
        }
        protected _isMatch(v: number) {
            if (isNaN(v)) return true;
            var a = isNaN(this.X) ? -Number.MAX_VALUE : this.X || 0;
            var b = isNaN(this.Y) ? Number.MAX_VALUE : this.Y || 0;
            return v >= a && v <= b;
        }
        public set Title(v: string) {
            this.Scop.setAttribute('title', v);
        }
        public get Title(): string {
            var x = this.Scop.getScop('title', false);
            if (x) return x.Value;
            return null;
        }
        constructor(title: string) {
            super();
            this.Title = title || "Vector Title";
            this.clear();
        }
        clear() { this.X = 0; this.Y = 0; }

        IsQuerable(): boolean {
            return this.X != null || this.Y != null;
        }
    }

    var minDate = new Date("1/1/1000");
    var maxDate = new Date("12/12/9999");

    export class Period extends Couple<Date> {
        protected getView(): UI.JControl {
            return new UI.TControl('templates.crtPeriod', this.Scop);
        }

        protected CheckType(e: bind.EventArgs<Date, Couple<Date>>) {
            if (typeof e._new === 'number' || typeof e._new === 'string') e._new = new Date(e._new);
            else if (e._new instanceof Date) return;
            else if (e._new == null)
                return e._new = new Date();
            else e._new = e._old;
        }


        IsQuerable(): boolean {
            return (this.X != null || this.Y != null);
        }

        protected _isMatch(v: Date) {
            if (v == null) return true;
            var iv = v && v.getTime();
            return iv >= this.X.getTime() && iv <= this.Y.getTime();
        }

        public set Title(v: string) {
            this.Scop.setAttribute('title', v);
        }
        public get Title(): string {
            var x = this.Scop.getScop('title', false);
            if (x) return x.Value;
            return null;
        }

        constructor(title: string) {
            super();
            this.Title = title || "Period Title";
        }
        clear() { this.Y = new Date(Date.now()); this.Y = new Date(0); }
    }

    export abstract class ComplexCritere<T extends bind.DObject> extends Critere<T> {
        protected static __shema: CritereShema;
        protected get Shema(): Critere.CritereShema { return (this.constructor as any).__shema; }
        protected static generateFieldsFrom(type: Function, fields?: bind.DProperty<any, any>[]): bind.DProperty<any, any>[] {
            fields = fields || bind.DObject.getFields(type);
            var _flds: bind.DProperty<any, any>[] = [];
            var _propertiesSheam: PropertyCritereShema[] = [];

            for (var i = 0; i < fields.length; i++) {
                var fld = fields[i];
                if (!reflection.IsInstanceOf(fld.Type, collection.List)) {
                    var crDP = bind.DObject.CreateField(fld.Name, this.getTypeOf(fld.Type));
                    _flds.push(crDP);
                    _propertiesSheam.push({ critereDP: crDP, propertyDP: fld });
                }
            }
            this.__shema = {
                critereType: this,
                proxyType: type,
                critereProperties: _flds,
                propertiesSheam: _propertiesSheam
            }
            return this.__shema.critereProperties;
        }
        protected InitProperties(prams?) {
            prams = prams || {};
            var flds = this.Shema.propertiesSheam;
            for (var i = 0; i < flds.length; i++) {
                var p = flds[i];
                var mvc = Critere.Get(p.propertyDP.Type);
                this.set(p.critereDP, mvc.CreateView(this, p.propertyDP, mvc, prams[p.propertyDP.Name]));
            }
        }
        protected init() {
            this.InitProperties();
        }
        protected getView(container?: UI.JControl): UI.JControl {
            var c = container || new UI.DivControl('section');
            var flds = this.Shema.propertiesSheam;
            flds = flds.sort((a, b) => __typesDesc.IndexOf(a.propertyDP.Type as Function));
            for (var i = 0; i < flds.length; i++) {
                var p = flds[i].critereDP;
                var v = this.get(p) as Critere<any>;
                if (v instanceof Critere)
                    c.Add(v.View)
            }
            return c;
        }
        clear(): void {
            var flds = bind.DObject.getFields(this.GetType());
            for (var i = 0; i < flds.length; i++) {
                var p = flds[i];
                var v = this.get(p) as Critere<any>;
                if (v instanceof Critere)
                    v.clear();
            }
        }
        IsQuerable() {
            this.indexes = [];
            var crPrps = this.Shema.propertiesSheam;
            for (var i = 0; i < crPrps.length; i++) {
                var prSch = crPrps[i];
                var v = this.get(prSch.critereDP) as Critere<any>;
                if (v.IsActivated() && v.IsQuerable())
                    this.indexes.push({ critereValue: v, propertyDP: prSch.propertyDP });
            }
            return this.indexes.length != 0;
        }
        public isMatch(p: T): boolean {
            for (var i = 0; i < this.indexes.length; i++) {
                var v = this.indexes[i];
                if (!v.critereValue.isMatch(p.GetValue(v.propertyDP))) return false;
            }
            return true;
        }

        protected _isMatch(v: T): boolean {
            throw new Error("Method not implemented.");
        }
        constructor() {
            super();
            this.init();
        }
        private indexes: PropertyCritere[];

    }
    export interface PropertyCritereShema {
        critereDP: bind.DProperty<any, any>
        propertyDP: bind.DProperty<any, any>
    }
    export interface PropertyCritere {
        critereValue: Critere<any>;
        propertyDP: bind.DProperty<any, any>
    }
    export interface CritereShema {
        proxyType: Function;
        critereType: Function;
        propertiesSheam: PropertyCritereShema[];
        critereProperties: Array<bind.DProperty<any, any>>;
    }
}
