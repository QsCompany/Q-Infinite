import { utils, bind, collection } from './Corelib';
export declare module filters {
    namespace scopic {
        interface IListFilterParam {
            Filter: string;
            Source: string;
            Patent: string;
            shift: string;
            max: string;
        }
        class ListFilter<T> extends bind.Filter<collection.List<T>, collection.ExList<T, list.StringPatent<T>>> {
            private p;
            private fl?;
            private isConst;
            constructor(s: bind.Scop, m: bind.BindingMode, p: string, fl?: collection.ExList<T, filters.list.StringPatent<T>>);
            private sourceBind;
            private getFilter;
            private getSource;
            private getPatent;
            protected Convert(data: collection.List<T>): collection.ExList<T, any>;
            protected ConvertBack(data: collection.ExList<T, any>): collection.List<T>;
            Initialize(): void;
        }
    }
    namespace list {
        class SubListPatent implements utils.IPatent<any> {
            Start: number;
            End: number;
            constructor(start: number, end: number);
            Check(i: any): boolean;
            equals(p: SubListPatent): boolean;
            Refresh(): this;
            private _refresh;
        }
        class StringPatent<T> implements utils.IPatent<T> {
            private p;
            private o;
            constructor(s: string);
            Check(s: any): boolean;
            equals(p: StringPatent<any>): boolean;
        }
        class PropertyPatent<T> implements utils.IPatent<T> {
            s: T;
            constructor(s: T);
            Check(s: any): boolean;
            equals(p: PropertyPatent<any>): boolean;
        }
        class PropertyFilter<T extends bind.DObject> extends utils.Filter<T, PropertyPatent<T>> {
            DP: bind.DProperty<any, any>;
            private deb;
            private fin;
            private _skip;
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): any;
            protected convertFromString(x: string): PropertyPatent<T>;
            constructor(DP: bind.DProperty<any, any>);
        }
        class StringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb;
            private fin;
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): boolean;
            protected convertFromString(x: string): StringPatent<T>;
        }
        class BoundStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb;
            private fin;
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): boolean;
            protected convertFromString(x: string): StringPatent<T>;
        }
        class DObjectPatent implements utils.IPatent<bind.DObject> {
            private p;
            private o;
            constructor(s: string);
            Check(s: bind.DObject): boolean;
            equals(p: DObjectPatent): boolean;
        }
        class DObjectFilter<T> extends utils.Filter<T, StringPatent<T>> {
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): boolean;
            protected convertFromString(x: string): StringPatent<T>;
        }
        abstract class PatentGroup<T> implements utils.IPatent<T> {
            left: utils.IPatent<T>;
            right: utils.IPatent<T>;
            constructor(left: utils.IPatent<T>, right: utils.IPatent<T>);
            abstract Clone(): any;
            abstract Check(item: T): any;
            equals(p: utils.IPatent<T>): boolean;
            protected areEquals(a: utils.IPatent<T>, b: utils.IPatent<T>): boolean;
        }
        class ANDPatentGroup<T> extends PatentGroup<T> {
            Check(item: T): boolean;
            Clone(): ANDPatentGroup<T>;
        }
        class ORPatentGroup<T> extends PatentGroup<T> {
            Clone(): ORPatentGroup<T>;
            Check(item: T): boolean;
        }
        class FilterGroup<T> extends utils.Filter<T, PatentGroup<T>> {
            constructor(patent: PatentGroup<T>);
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): any;
            protected convertFromString(x: string): PatentGroup<T>;
            LeftPatent: utils.IPatent<T>;
            RightPatent: utils.IPatent<T>;
        }
        class LStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb;
            private count;
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): boolean;
            protected convertFromString(x: string): StringPatent<T>;
        }
        class SubListFilter<T> extends utils.Filter<T, SubListPatent> {
            private deb;
            private count;
            Begin(deb: number, count: number): void;
            IsMatch(i: number, item: T): boolean;
            protected convertFromString(x: string): SubListPatent;
        }
        function indexdFilter(source: collection.List<any>, count: number): {
            update(): void;
            reset(): void;
            next(): void;
            previouse(): void;
            readonly List: collection.ExList<any, utils.IPatent<any>>;
            readonly numPages: number;
            Index: number;
            CountPerPage: number;
        };
    }
}
