import { bind, reflection, utils } from "./Corelib";
import { UI } from "./UI";
export declare namespace Critere {
    abstract class Critere<T> extends utils.Filter<T, utils.IPatent<T>> implements utils.IPatent<T> {
        Check(s: T): boolean;
        private deb;
        private fin;
        protected convertFromString(x: string): utils.IPatent<T>;
        Begin(deb: number, count: number): boolean;
        IsMatch(i: number, item: T): boolean;
        equals(p: utils.IPatent<T>): boolean;
        abstract IsQuerable(): boolean;
        protected _view: UI.JControl;
        protected abstract getView(): UI.JControl;
        Activate(): void;
        Disactivate(): void;
        GetMatchs(p: T[]): T[];
        abstract clear(): void;
        constructor();
        protected Scop: bind.ValueScop;
        readonly View: UI.JControl;
        isMatch(v: T): boolean;
        IsActivated(): boolean;
        protected abstract _isMatch(v: T): boolean;
        protected init(): void;
        protected static getTypeOf(type: Function | reflection.GenericType | reflection.DelayedType): Function;
        protected smartClear(): void;
        static ctor(): void;
        static Register(PropertyType: Function, CritereType: Function, Properties: any, CreateView: (owner: Critere<any>, prop: bind.DProperty<any, any>, CritereMVC: any, params: {
            [n: string]: any;
        }) => Critere<any>): void;
        static Get(type: Function | reflection.GenericType | reflection.DelayedType, strict?: boolean): CritereMVC;
        Open(callback: (n: this) => void): void;
        private modal;
    }
    interface CritereMVC {
        PropertyType: Function;
        CritereType: Function;
        Properties: any;
        CreateView(owner: Critere<any>, prop: bind.DProperty<any, any>, desc: CritereMVC, params: {
            [n: string]: any;
        }): Critere<any>;
    }
    abstract class Unaire<T> extends Critere<T> {
        clear(): void;
        static __fields__(): bind.DProperty<any, Unaire<any>>[];
        static CheckType(e: bind.EventArgs<any, Unaire<any>>): void;
        static DPValue: bind.DProperty<any, Unaire<any>>;
        Value: T;
        constructor();
        protected abstract CheckType(e: bind.EventArgs<T, Unaire<T>>): void;
    }
    abstract class Couple<T> extends Critere<T> {
        static __fields__(): bind.DProperty<Object, Couple<any>>[];
        static CheckType(e: bind.EventArgs<any, Couple<any>>): void;
        static DPX: bind.DProperty<Object, Couple<any>>;
        X: T;
        static DPY: bind.DProperty<Object, Couple<any>>;
        Y: T;
        constructor();
        protected abstract CheckType(e: bind.EventArgs<T, Couple<T>>): void;
        abstract clear(): any;
    }
    class Text extends Unaire<string | any> {
        clear(): void;
        getView(): UI.JControl;
        Label: string;
        protected CheckType(e: bind.EventArgs<string | any, Unaire<string | any>>): void;
        protected _isMatch(v: string | any): boolean;
        constructor(label: string);
        Value: any;
        IsQuerable(): boolean;
    }
    class Boolean extends Unaire<boolean> {
        clear(): void;
        getView(): UI.JControl;
        Label: string;
        protected CheckType(e: bind.EventArgs<boolean, Unaire<boolean>>): void;
        protected _isMatch(v: boolean): boolean;
        IsQuerable(): boolean;
        constructor(label: string);
    }
    class Vector extends Couple<number> {
        protected getView(): UI.JControl;
        protected CheckType(e: bind.EventArgs<number, Couple<number>>): void;
        protected _isMatch(v: number): boolean;
        Title: string;
        constructor(title: string);
        clear(): void;
        IsQuerable(): boolean;
    }
    class Period extends Couple<Date> {
        protected getView(): UI.JControl;
        protected CheckType(e: bind.EventArgs<Date, Couple<Date>>): Date;
        IsQuerable(): boolean;
        protected _isMatch(v: Date): boolean;
        Title: string;
        constructor(title: string);
        clear(): void;
    }
    abstract class ComplexCritere<T extends bind.DObject> extends Critere<T> {
        protected static __shema: CritereShema;
        protected readonly Shema: Critere.CritereShema;
        protected static generateFieldsFrom(type: Function, fields?: bind.DProperty<any, any>[]): bind.DProperty<any, any>[];
        protected InitProperties(prams?: any): void;
        protected init(): void;
        protected getView(container?: UI.JControl): UI.JControl;
        clear(): void;
        IsQuerable(): boolean;
        isMatch(p: T): boolean;
        protected _isMatch(v: T): boolean;
        constructor();
        private indexes;
    }
    interface PropertyCritereShema {
        critereDP: bind.DProperty<any, any>;
        propertyDP: bind.DProperty<any, any>;
    }
    interface PropertyCritere {
        critereValue: Critere<any>;
        propertyDP: bind.DProperty<any, any>;
    }
    interface CritereShema {
        proxyType: Function;
        critereType: Function;
        propertiesSheam: PropertyCritereShema[];
        critereProperties: Array<bind.DProperty<any, any>>;
    }
}
