import { mvc, utils, basic, thread, encoding, net, bind, reflection, collection, ScopicCommand } from './Corelib';
import { UI } from './UI';

export module filters {
    export namespace scopic {
        export interface IListFilterParam {
            Filter: string;
            Source: string;
            Patent: string;
            shift: string;
            max: string;
        }
        export class ListFilter<T> extends bind.Filter<collection.List<T>, collection.ExList<T, list.StringPatent<T>>>{

            private isConst: boolean;
            constructor(s: bind.Scop, m: bind.BindingMode, private p: string, private fl?: collection.ExList<T, filters.list.StringPatent<T>>) {
                super(s, 1);

            }
            private sourceBind: bind.TwoBind<any>;
            private getFilter(s: any): any {
                return null;
            }

            private getSource(s: any): any {
                if (s instanceof Array) {
                    this.fl.Source = new collection.List<any>(Object, s);
                    this.isConst = true;
                }
                return null;
            }
            private getPatent(s): any {
                return s;
            }

            protected Convert(data: collection.List<T>): collection.ExList<T, any> {
                if (this.isConst) return;
                if (this.fl == null) this.fl = new collection.ExList<T, filters.list.StringPatent<T>>(Object);
                this.fl.Source = data;
                return this.fl;
            }
            protected ConvertBack(data: collection.ExList<T, any>): collection.List<T> {
                return data.Source;
            }
            Initialize() {
                var fl = this.fl;
                var p = this.p;
                if (!fl) this.fl = fl = new collection.ExList<T, filters.list.StringPatent<T>>(Object);
                if (p) {
                    var x = JSON.parse(decodeURI(p));

                    for (var i in x) {
                        if (i === 'filter')
                            fl.Filter = this.getFilter(x[i]);
                        if (i === 'source')
                            fl.Source = this.getSource(x[i]);
                        if (i === 'patent') {
                            if (fl.Filter == null)
                                fl.Filter = new list.LStringFilter();
                            fl.Filter.Patent = this.getPatent(x[i]);
                        }
                        if (i === 'max')
                            fl.MaxResult = parseInt(i);
                        if (i === 'shift')
                            fl.Shift = parseInt(i);
                    }
                }
                if (fl.Filter == null)
                    fl.Filter = new list.LStringFilter();

                if (fl.Source == null && this.source)
                    fl.Source = this.source.Value;
                super.Initialize();
            }
        }
        bind.RegisterFilter({
            BindingMode: 1, Name: 'listfilter', CreateNew(s: bind.Scop, m: bind.BindingMode, p: string) {

                return new ListFilter<any>(s, m, p);
            }
        });
    }
    export namespace list {

        export class SubListPatent implements utils.IPatent<any> {
            public Start: number;
            public End: number;
            constructor(start: number, end: number) {
                if (start > end) {
                    this.Start = end;
                    this.End = start;
                }
                else {
                    this.Start = start;
                    this.End = end;
                }
            }
            Check(i: any) {
                return i <= this.End && i >= this.Start;
            }
            public equals(p: SubListPatent) {
                return this._refresh ? (delete this._refresh && false) : this.Start == p.Start && this.End == p.End;
            }
            public Refresh() { this._refresh = true; return this; }
            private _refresh;
        }
        export class StringPatent<T> implements utils.IPatent<T> {
            private p: string[];
            private o;
            constructor(s: string) {
                this.o = s = s.trim().toLowerCase();
                this.p = s === '' ? [] : s.split(' ');
            }
            Check(s: any) {
                if (!s) return true;
                var p = this.p;
                s = s.toLowerCase();
                for (var i = 0, l = p.length; i < l; i++)
                    if (s.indexOf(p[i]) === -1) return false;
                return true;
            }
            public equals(p: StringPatent<any>) {
                return p.o === this.o;
            }
        }
        export class PropertyPatent<T> implements utils.IPatent<T> {
            constructor(public s: T) {
            }
            Check(s: any) {
                return this.s === undefined ? true : s === this.s;
            }
            public equals(p: PropertyPatent<any>) {
                return p.s === this.s;
            }
        }

        export class PropertyFilter<T extends bind.DObject> extends utils.Filter<T, PropertyPatent<T>> {
            private deb: number;
            private fin: number;
            private _skip;
            public Begin(deb: number, count: number) {
                if (!this._patent) this._skip = true;
                if (!this._patent.s) this._skip = true;
                this._skip = false;
            }
            IsMatch(i: number, item: T) {
                return (this._skip || !item) || this._patent.Check(item.GetValue(this.DP));
            }
            protected convertFromString(x: string): PropertyPatent<T> {
                return null;
            }
            constructor(public DP: bind.DProperty<any, any>) { super(); }
        }
        export class StringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb: number;
            private fin: number;

            public Begin(deb: number, count: number) {
            }
            IsMatch(i: number, item: T) {
                return (this._patent == null) || this._patent.Check(item.toString());
            }
            protected convertFromString(x: string): StringPatent<T> {
                let p = new StringPatent<T>(x);
                return (this._patent && this._patent.equals(p)) ? this._patent : p;
            }
        }

        export class BoundStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb: number;
            private fin: number;

            public Begin(deb: number, count: number) {
                this.deb = deb;
                this.fin = deb + count;
            }
            IsMatch(i: number, item: T) {
                return i >= this.deb && i < this.fin ? (this._patent == null) || this._patent.Check(item.toString()) : null;
            }
            protected convertFromString(x: string): StringPatent<T> {
                let p = new StringPatent<T>(x);
                return (this._patent && this._patent.equals(p)) ? this._patent : p;
            }
        }
        export class DObjectPatent implements utils.IPatent<bind.DObject> {
            private p: string[];
            private o;
            constructor(s: string) {
                this.o = s = s.trim().toLowerCase();
                this.p = s === '' ? [] : s.split(' ');
            }
            Check(s: bind.DObject) {
                if (!s) return true;
            }
            public equals(p: DObjectPatent) {
                return p.o === this.o;
            }
        }
        export class DObjectFilter<T> extends utils.Filter<T, StringPatent<T>> {
            public Begin(deb: number, count: number) {
            }
            IsMatch(i: number, item: T) {
                return (this._patent == null) || this._patent.Check(item.toString());
            }
            protected convertFromString(x: string): StringPatent<T> {
                let p = new StringPatent(x);
                return (this._patent && this._patent.equals(p)) ? this._patent : p;
            }
        }
        export abstract class PatentGroup<T> implements utils.IPatent<T>{
            constructor(public left: utils.IPatent<T>, public right: utils.IPatent<T>) { }
            abstract Clone();
            abstract Check(item: T);
            equals(p: utils.IPatent<T>) {
                var v = p as this;
                var l, r;
                if (v) l = v.left, r = v.right;
                if (!p || p instanceof this.constructor)
                    return this.areEquals(this.left, l) && this.areEquals(this.right, r);
                return false;
            }
            protected areEquals(a: utils.IPatent<T>, b: utils.IPatent<T>) {
                if (a == null && b == null) return true;
                if (a == null) return b.equals(a);
                return a.equals(b);
            }
        }
        export class ANDPatentGroup<T> extends PatentGroup<T>{
            Check(item: T) {
                var l = !this.left || this.left.Check(item);
                if (l == null) return null;
                var r = !this.right || this.right.Check(item);
                if (r == null) return null;
                return l && r;
            }
            Clone() {
                return new ANDPatentGroup(this.left, this.right);
            }
        }
        export class ORPatentGroup<T> extends PatentGroup<T>{
            Clone() {
                return new ORPatentGroup(this.left, this.right);
            }
            Check(item: T) {
                var l = !!this.left && this.left.Check(item);
                if (l == null) return null;
                var r = !!this.right && this.right.Check(item);
                if (r == null) return null;
                return r || l;
            }
        }
        export class FilterGroup<T> extends utils.Filter<T, PatentGroup<T>> {
            constructor(patent: PatentGroup<T>) {
                super();
                if (!patent) throw "";
                this.Patent = patent;
            }
            public Begin(deb: number, count: number) {

            }
            IsMatch(i: number, item: T) {
                return (this._patent == null) || this._patent.Check(item);
            }
            protected convertFromString(x: string): PatentGroup<T> {
                throw "null";
            }
            public set LeftPatent(v: utils.IPatent<T>) {
                (this.Patent as PatentGroup<T>).left = v;
                this.Patent = (this.Patent as PatentGroup<T>).Clone();
            }

            public set RightPatent(v: utils.IPatent<T>) {
                (this.Patent as PatentGroup<T>).right = v;
                this.Patent = (this.Patent as PatentGroup<T>).Clone();
            }

        }
        export class LStringFilter<T> extends utils.Filter<T, StringPatent<T>> {
            private deb: number;
            private count: number;
            public Begin(deb: number, count: number) {
                this.deb = deb || 0;
                this.count = count;

            }
            IsMatch(i: number, item: T) {
                if (this.deb === 0) {
                    if (this.count > 0) {
                        if (!(this._patent == null || this._patent.Check(item.toString())))
                            return false;
                        this.count--;
                        return true;
                    }
                } else
                    this.deb--;
                return false;
            }
            protected convertFromString(x: string): StringPatent<T> {
                let p = new StringPatent<T>(x);
                return (this._patent && this._patent.equals(p)) ? this._patent : p;
            }
        }

        export class SubListFilter<T> extends utils.Filter<T, SubListPatent> {
            private deb = 0;
            private count = 50;
            public Begin(deb: number, count: number) {
                this.deb = deb;
                this.count = count;
            }
            IsMatch(i: number, item: T) {
                var t = (this._patent == null) || this._patent.Check(i);
                if (t) {
                    if (this.deb > 0) {
                        this.deb--;
                        return false;
                    }
                    if (this.count > 0) {
                        this.count--;
                        return true;
                    }
                    return null;
                }
                return false;
            }
            protected convertFromString(x: string): SubListPatent {
                let e = x.split(/[\s|\\|\.|\/]+/);
                let s = 0;
                let n = 0;
                if (e.length > 0) s = parseFloat(e[0]);
                if (e.length > 1) n = parseFloat(e[1]);
                else n = s + (this._patent == null ? 10 : this._patent.End - this._patent.Start);
                let p = new SubListPatent(s, n);
                return (this._patent && this._patent.equals(p)) ? this._patent : p;
            }
        }

        export function indexdFilter(source: collection.List<any>, count: number) {
            var filter = new filters.list.SubListFilter<any>();
            var index: number = 0;
            var data = source.Filtred(filter);
            function numPages() {
                var c = source.Count / count;
                if (c % 1 == 0) return c;
                return Math.floor(c) + 1;
            }
            function getPatent() {
                var np = numPages();
                index = Math.max(0, Math.min(index, np - 1));
                return new filters.list.SubListPatent(index * count, ((index + 1) * count - 1));
            }
            filter.Patent = getPatent();
            return {
                update() {
                    filter.Patent = getPatent();
                },
                reset() {
                    index = 0;
                    filter.Patent = getPatent();
                },
                next() {
                    ++index;
                    filter.Patent = getPatent();
                },
                previouse() {
                    --index;
                    filter.Patent = getPatent();
                },
                get List() { return data; },
                get numPages() {
                    var c = source.Count / count;
                    if (c % 1 == 0) return c;
                    return c + 1;
                },
                get Index() { return index; },
                set Index(v: number) {
                    index = v;
                    filter.Patent = getPatent();
                },
                get CountPerPage() { return count; },
                set CountPerPage(v: number) {
                    count = v;
                    filter.Patent = getPatent();
                }
            };
        }
    }
}