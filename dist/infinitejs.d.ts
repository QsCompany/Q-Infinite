/// <reference path="../qloader.d.ts" />
declare module "sys/System" {
    import { net, bind, basic, collection, encoding, reflection } from "sys/Corelib";
    export module Controller {
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
    export module sdata {
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
    export module base {
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
}
declare module "sys/Filters" {
    import { utils, bind, collection } from "sys/Corelib";
    export module filters {
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
}
declare module "sys/Syntaxer" {
    import { bind } from "sys/Corelib";
    export namespace Parser {
        enum JSToken {
            None = 0,
            EndOfFile = 1,
            Semicolon = 2,
            RightCurly = 3,
            LeftCurly = 4,
            Debugger = 5,
            Var = 6,
            If = 7,
            For = 8,
            Do = 9,
            While = 10,
            Continue = 11,
            Break = 12,
            Return = 13,
            With = 14,
            Switch = 15,
            Throw = 16,
            Try = 17,
            Function = 18,
            Else = 19,
            ConditionalCommentStart = 20,
            ConditionalCommentEnd = 21,
            ConditionalCompilationOn = 22,
            ConditionalCompilationSet = 23,
            ConditionalCompilationIf = 24,
            ConditionalCompilationElseIf = 25,
            ConditionalCompilationElse = 26,
            ConditionalCompilationEnd = 27,
            ConditionalCompilationVariable = 28,
            Identifier = 29,
            Null = 30,
            True = 31,
            False = 32,
            This = 33,
            StringLiteral = 34,
            IntegerLiteral = 35,
            NumericLiteral = 36,
            TemplateLiteral = 37,
            LeftParenthesis = 38,
            LeftBracket = 39,
            AccessField = 40,
            ArrowFunction = 41,
            RestSpread = 42,
            FirstOperator = 43,
            Delete = 43,
            Increment = 44,
            Decrement = 45,
            Void = 46,
            TypeOf = 47,
            LogicalNot = 48,
            BitwiseNot = 49,
            FirstBinaryOperator = 50,
            Plus = 50,
            Minus = 51,
            Multiply = 52,
            Divide = 53,
            Modulo = 54,
            BitwiseAnd = 55,
            BitwiseOr = 56,
            BitwiseXor = 57,
            LeftShift = 58,
            RightShift = 59,
            UnsignedRightShift = 60,
            Equal = 61,
            NotEqual = 62,
            StrictEqual = 63,
            StrictNotEqual = 64,
            LessThan = 65,
            LessThanEqual = 66,
            GreaterThan = 67,
            GreaterThanEqual = 68,
            LogicalAnd = 69,
            LogicalOr = 70,
            InstanceOf = 71,
            In = 72,
            Comma = 73,
            Assign = 74,
            PlusAssign = 75,
            MinusAssign = 76,
            MultiplyAssign = 77,
            DivideAssign = 78,
            ModuloAssign = 79,
            BitwiseAndAssign = 80,
            BitwiseOrAssign = 81,
            BitwiseXorAssign = 82,
            LeftShiftAssign = 83,
            RightShiftAssign = 84,
            UnsignedRightShiftAssign = 85,
            LastAssign = 85,
            ConditionalIf = 86,
            Colon = 87,
            LastOperator = 87,
            Case = 88,
            Catch = 89,
            Default = 90,
            Finally = 91,
            New = 92,
            RightParenthesis = 93,
            RightBracket = 94,
            SingleLineComment = 95,
            MultipleLineComment = 96,
            UnterminatedComment = 97,
            PreprocessorDirective = 98,
            Enum = 99,
            Extends = 100,
            Super = 101,
            Class = 102,
            Const = 103,
            Export = 104,
            Import = 105,
            Module = 106,
            Let = 107,
            Implements = 108,
            Interface = 109,
            Package = 110,
            Private = 111,
            Protected = 112,
            Public = 113,
            Static = 114,
            Yield = 115,
            Native = 116,
            Get = 117,
            Set = 118,
            AspNetBlock = 119,
            ReplacementToken = 120,
            EndOfLine = 121,
            WhiteSpace = 122,
            Error = 123,
            RegularExpression = 124,
            Limit = 125
        }
        interface ref<T> {
            value?: T;
        }
        enum TokenType {
            uknown = 0,
            alpha = 1,
            num = 2,
            prnt = 4,
            brkt = 8,
            dot = 16,
            prefix = 32,
            filter = 64,
            whites = 128,
            alphanum = 3
        }
        interface stat {
            index: number;
        }
        interface Token {
            index: number;
            char: string;
            code: number;
            type: TokenType;
        }
        type parser = (strm: syntaxer, result: ParserResult) => boolean;
        enum CToken {
            whitespace = 0,
            undefined = 1,
            boolean = 2,
            number = 3,
            string = 4,
            word = 5,
            keyword = 6,
            path = 7,
            functionCall = 8,
            arrayCall = 9
        }
        interface ParserResult {
            start?: Token;
            end?: Token;
            success: boolean;
            resut?: any;
            msg?: string;
            tokon?: CToken | string;
            parent: ParserResult;
            children: ParserResult[];
        }
        function ands(parsers: parser[]): (b: syntaxer, rslt: ParserResult) => boolean;
        function ors(parsers: parser[]): <parse>(b: syntaxer, result: ParserResult) => boolean;
        function _ors(parsers: parser[]): <parse>(b: syntaxer, result: ParserResult) => boolean;
        enum oper {
            or = 0,
            and = 1,
            xor = 2,
            eq = 3,
            neq = 4,
            dot = 5
        }
        interface Term {
            oper: oper;
            parser: parser;
            neq: boolean;
        }
        class parserBuilder {
            token: CToken | string;
            private _parser;
            private terms;
            parent: parserBuilder;
            constructor(token: CToken | string);
            and(p: parser, neq?: boolean): this;
            set(p: parser, neq?: boolean): this;
            $open(token: CToken | string, oper: oper, neq?: boolean): parserBuilder;
            $close(): parserBuilder;
            or(p: parser, neq?: boolean): this;
            xor(p: parser, neq?: boolean): this;
            eq(p: parser, neq?: boolean): this;
            neq(p: parser, neq?: boolean): this;
            readonly Parser: parser;
            private exect;
        }
        class syntaxer {
            src: string;
            readonly CurrentString: string;
            readonly ShiftIndex: number;
            static opers: number[];
            static whites: number[];
            private stack;
            Tokens: Token[];
            private index;
            validate(s?: stat): true;
            save(): stat;
            restore(s?: stat): false;
            readonly current: Token;
            readonly previous: Token;
            next(): Token;
            back(): Token;
            shift(): true;
            unshift(): true;
            JumpBy(length: number): void;
            JumpTo(index: number): void;
            private static getToken;
            constructor(src: string);
            currentNode: ParserResult;
            exec(p: parser, nonstrorable?: boolean): ParserResult;
            fastExec(p: (...args: any[]) => boolean, ths?: any, args?: any[]): boolean;
            getChar(): string;
            testChar(chr: string): boolean;
            getNextChar(inc: any): string;
            get(shift: number): string;
            private static IsHexDigit;
            static IsDigit(character: any): boolean;
            private ScanNumber;
            ScanString(o: string): string | false;
            private IsUnicode;
            private ScanIdentifier;
            isChar(t: Token): boolean;
            private SkipToEndOfLine;
            private IsLineTerminator;
            private SkipMultilineComment;
            private static spaceSeparators;
            private static spaceSeparatorsChars;
            private static IsBlankSpace;
            protected _getNextToken(val?: ref<any>): JSToken.None | JSToken.EndOfFile | JSToken.EndOfFile | JSToken.Semicolon | JSToken.Semicolon | JSToken.RightCurly | JSToken.RightCurly | JSToken.LeftCurly | JSToken.LeftCurly | JSToken.Debugger | JSToken.Var | JSToken.If | JSToken.For | JSToken.Do | JSToken.While | JSToken.Continue | JSToken.Break | JSToken.Return | JSToken.With | JSToken.Switch | JSToken.Throw | JSToken.Try | JSToken.Function | JSToken.Else | JSToken.ConditionalCommentStart | JSToken.ConditionalCommentEnd | JSToken.ConditionalCompilationOn | JSToken.ConditionalCompilationSet | JSToken.ConditionalCompilationIf | JSToken.ConditionalCompilationElseIf | JSToken.ConditionalCompilationElse | JSToken.ConditionalCompilationEnd | JSToken.ConditionalCompilationVariable | JSToken.Identifier | JSToken.Identifier | JSToken.Null | JSToken.True | JSToken.False | JSToken.This | JSToken.StringLiteral | JSToken.StringLiteral | JSToken.IntegerLiteral | JSToken.NumericLiteral | JSToken.TemplateLiteral | JSToken.LeftParenthesis | JSToken.LeftParenthesis | JSToken.LeftBracket | JSToken;
        }
        namespace parsers {
            namespace expr {
                function Term(s: syntaxer, rslt: ParserResult): boolean;
                function parent(s: syntaxer, rslt: ParserResult): boolean;
                function Expre(): void;
                function chain(s: parser): void;
            }
            function _keyword(strm: syntaxer, word: string, rslt: ParserResult, token?: string | CToken): boolean;
            function whitespace(strm: syntaxer, rslt: ParserResult): boolean;
            function keyword(word: string): parser;
            function undefined(strm: syntaxer, rslt: ParserResult): boolean;
            function boolean(strm: syntaxer, rslt: ParserResult): boolean;
            function string(strm: syntaxer, rslt: ParserResult): boolean;
            function number(strm: syntaxer, rslt: ParserResult): boolean;
            function constant(strm: syntaxer, rslt: ParserResult): boolean;
            function digit(strm: syntaxer, rslt: ParserResult): boolean;
            function word(strm: syntaxer, rslt: ParserResult): boolean;
            function pint(b: syntaxer, rslt: ParserResult): boolean;
            function anonymouseScop(s: syntaxer, rslt: ParserResult): boolean;
            function namedScop(s: syntaxer, rslt: ParserResult): boolean;
            function subScop(s: syntaxer, rslt: ParserResult): boolean;
            function typedScop(s: syntaxer, rslt: ParserResult): boolean;
            function bindscope(b: syntaxer, rslt: ParserResult): boolean;
            function stringChainedScop(b: syntaxer, rslt: ParserResult): boolean;
            function composedPath(b: syntaxer, rslt: ParserResult): boolean;
            function parent(b: syntaxer, rslt: ParserResult): boolean;
            function expression(b: syntaxer, rslt: ParserResult): boolean;
            interface FunctionResult {
                caller: ParserResult;
                args: ParserResult[];
            }
            interface ArrayResult {
                caller: ParserResult;
                index: ParserResult;
            }
            function functionCall(b: syntaxer, rslt: ParserResult): boolean;
            function arrayCall(b: syntaxer, rslt: ParserResult): boolean;
            enum coPathType {
                bindscope = 0,
                typedscope = 1,
                subscop = 2,
                parentscop = 3,
                namedscop = 4,
                anonymousscop = 5,
                thisscope = 6,
                keyword = 7
            }
        }
        interface IComposePath {
            t: parsers.coPathType;
            v: string | string[] | ISubsScop | ITypedScop | INamedScop | IParentScop | IKeywordScop | IBindScope;
        }
        interface ITypedScop {
            type: undefined | ':' | '=';
            path: string;
        }
        type INamedScop = string;
        type IParentScop = number;
        type ISubsScop = string[];
        type IBindScope = string[];
        type IKeywordScop = string;
        function parseComposePath(str: string): ParserResult;
        function parseExpression(str: string): ParserResult;
        function Execute(code: string, parser: Parser.parser): ParserResult;
    }
    export namespace Parser {
        class JSKeyword<T extends string> {
            readonly token: JSToken;
            readonly name: T;
            private static keywors;
            static get<T extends string>(s: T): JSKeyword<T>;
            constructor(token: JSToken, name: T, next?: JSKeyword<any>);
            static InitKeywords(): void;
        }
        class AST extends Parser.syntaxer {
            private currentContext;
            getNextToken(): JSToken;
            private ParseStatement;
        }
    }
    export namespace Parser {
        interface ICode {
            Code: string;
            scop?: bind.Scop;
            result?: any;
            pb?: bind.PropBinding;
        }
        class StringTemplate {
            private code;
            private curs;
            private len;
            private stack;
            private pcurs;
            private isCode;
            private readonly currentChar;
            private readonly nextChar;
            private readonly MoveNext;
            private init;
            private getString;
            private _toStack;
            Compile(code: string): (string | ICode)[];
            static default: StringTemplate;
            static Compile(code: string): (string | ICode)[];
            private static toRegString;
            static GenearteString(stack: (string | ICode)[]): string;
        }
    }
}
declare module "sys/UI" {
    import { basic, bind, mvc, collection, utils, BuckupList, reflection } from "sys/Corelib";
    import { defs } from "sys/defs";
    import { filters } from "sys/Filters";
    export type conv2template = mvc.ITemplate | string | Function | UI.Template | HTMLElement;
    export module UI {
        enum KeyboardControllerResult {
            Handled = 0,
            Release = -1,
            ByPass = 2
        }
        interface IKeyCombinerTarget extends basic.ITBindable<(k: keyCominerEvent, e: IKeyCombinerTarget) => void> {
            target?: Node | JControl;
        }
        interface IKeyA {
            [s: string]: IKeyCombinerTarget[];
        }
        class keyCominerEvent {
            Owner: any;
            OnComined: bind.EventListener<(owner: this, e: IKeyCombinerTarget) => void>;
            private _keyA;
            private _keyB;
            private handlers;
            sort(ar: IKeyCombinerTarget[]): undefined;
            sort1(ar: Node[]): void;
            KeyA: KeyboardEvent;
            KeyB: KeyboardEvent;
            constructor(Owner: any);
            private elementInViewport1;
            private elementInViewport;
            Cancel: boolean;
            private _stopEvent;
            private _rise;
            reset(): void;
            handleEvent(e: KeyboardEvent): void;
            private isValid;
            On(keyA: string, keyB: string, handle: (s: keyCominerEvent, e: IKeyCombinerTarget) => void, target?: JControl | Node, owner?: any): IKeyCombinerTarget;
            Off(keyA: string, keyB: string, e: IKeyCombinerTarget): void;
            private _pause;
            protected dom: HTMLElement;
            pause(): void;
            resume(): void;
            attachTo(dom: HTMLElement): void;
            stopPropagation(): void;
        }
        class DesktopKeyboardManager extends keyCominerEvent {
            protected desk: Desktop;
            constructor(desk: Desktop);
            dom: HTMLElement;
            attachTo(v: HTMLElement): void;
        }
        interface IKeyboardControllerEventArgs {
            e?: KeyboardEvent;
            Result?: KeyboardControllerResult;
            Controller: IKeyboardController;
        }
        interface IKeyboardController {
            owner?: any;
            invoke(e: IKeyboardControllerEventArgs): any;
            onResume?(e: IKeyboardControllerEventArgs): boolean;
            onPause?(e: IKeyboardControllerEventArgs): boolean;
            onStop?(e: IKeyboardControllerEventArgs): boolean;
            stackable?: boolean;
            params?: any[];
        }
        class KeyboardControllerManager {
            Desktop: UI.Desktop;
            private _controllers;
            _current: IKeyboardController;
            constructor(Desktop: UI.Desktop);
            Current(): IKeyboardController;
            GetController(nc: IKeyboardController): boolean;
            Release(c: IKeyboardController): boolean;
            ResumeStack(): boolean;
            Invoke(e: KeyboardEvent): KeyboardControllerResult;
        }
    }
    export module UI {
        enum Events {
            keydown = 2,
            keyup = 3,
            keypress = 5
        }
        abstract class JControl extends bind.Scop implements EventListenerObject {
            protected _view: HTMLElement;
            private _parentScop;
            getParent(): bind.Scop;
            protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
            setParent(v: bind.Scop): boolean;
            CombinatorKey(keyA: string, keyB: string, callback: (this: this, e: keyCominerEvent) => void): IKeyCombinerTarget;
            SearchParents<T extends JControl>(type: Function): T;
            static LoadCss(url: any): HTMLLinkElement;
            static __fields__(): any[];
            readonly InnerHtml: string;
            Float(v: HorizontalAlignement): void;
            Clear(): void;
            protected parent: JControl;
            _presenter: JControl;
            private _hotKey;
            _onInitialize: bind.EventListener<(s: JControl) => void>;
            OnInitialized: (s: this) => void;
            Presenter: JControl;
            setAttribute(name: any, value: any): this;
            OnKeyDown(e: KeyboardEvent): any | void;
            OnContextMenu(e: MouseEvent): any;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any | void;
            setAttributes(attributes: {
                [s: string]: string;
            }): this;
            applyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
            applyStyle(a: string, b: string, c: string, d: string, e: string): any;
            applyStyle(a: string, b: string, c: string, d: string): any;
            applyStyle(a: string, b: string, c: string): any;
            applyStyle(a: string, b: string): any;
            applyStyle(a: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string, x: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string, e: string): any;
            disapplyStyle(a: string, b: string, c: string, d: string): any;
            disapplyStyle(a: string, b: string, c: string): any;
            disapplyStyle(a: string, b: string): any;
            disapplyStyle(a: string): any;
            private _display;
            Visible: boolean;
            Wait: boolean;
            Enable: boolean;
            Parent: JControl;
            private static counter;
            private _id;
            private init;
            readonly IsInit: boolean;
            protected OnFullInitialized(): void;
            protected OnPaint: (this: this, n: this) => void;
            protected instantanyInitializeParent(): boolean;
            ToolTip: string;
            readonly View: HTMLElement;
            constructor(_view: HTMLElement);
            protected _hasValue_(): boolean;
            protected abstract initialize(): any;
            static createDiv(): HTMLDivElement;
            addEventListener<T>(event: string, handle: (sender: this, e: Event, param: T) => void, param: T, owner?: any): basic.DomEventHandler<any, any>;
            private static _handle;
            AddRange(chidren: JControl[]): this;
            Add(child: JControl): this;
            IndexOf(child: JControl): void;
            Insert(child: JControl, to: number): this;
            Remove(child: JControl, dispose?: boolean): boolean;
            protected getTemplate(child: JControl): JControl;
            readonly Id: number;
            Dispose(): void;
            protected OnHotKey(): void;
            HotKey: HotKey;
            handleEvent(e: Event): void;
            private _events;
            private isEventRegistred;
            private registerEvent;
            static toggleClass(dom: any, className: any): void;
        }
        namespace attributes {
            function ContentProperty(propertyName: string | bind.DProperty<any, any>): (target: typeof JControl) => void;
            function ChildrenProperty(e: {
                PropertyName?: string;
                MethodName?: string;
            }): (target: typeof JControl) => void;
            function SelfProcessing(): (target: typeof JControl) => void;
        }
        interface IContentControl extends JControl {
            Content: JControl;
        }
        abstract class Control<T extends JControl> extends JControl {
            private _c;
            private readonly Children;
            Add(child: T): this;
            Insert(child: T, to: number): this;
            Remove(child: T, dispose?: boolean): boolean;
            RemoveAt(i: number, dispose: boolean): boolean;
            protected abstract Check(child: T): any;
            protected readonly HasTemplate: boolean;
            protected getTemplate(child: T): JControl;
            protected OnChildAdded(child: T): void;
            getChild(i: number): T;
            IndexOf(item: T): number;
            constructor(view: HTMLElement);
            readonly Count: number;
            CloneChildren(): void;
            Clear(dispose?: boolean): void;
            Dispose(): void;
        }
        class Desktop extends Control<App> {
            static DPCurrentApp: bind.DProperty<App, Desktop>;
            static DPCurrentLayout: bind.DProperty<JControl, Desktop>;
            CurrentLayout: JControl;
            Logout(): any;
            OpenSignin(): void;
            isReq: number;
            KeyCombiner: keyCominerEvent;
            CurrentApp: defs.$UI.IApp;
            static ctor(): void;
            private _currentLayoutChanged;
            private selectApp;
            static __fields__(): bind.DProperty<JControl, Desktop>[];
            AuthStatChanged(v: boolean): void;
            private apps;
            IsSingleton: boolean;
            constructor();
            initialize(): void;
            private observer;
            private mouseController;
            KeyboardManager: UI.KeyboardControllerManager;
            private _keyboardControllers;
            private _keyboardController;
            private KeyboardController;
            GetKeyControl(owner: any, invoke: (e: KeyboardEvent, ...params: any[]) => KeyboardControllerResult, params: any[]): void;
            ReleaseKeyControl(): void;
            private focuser;
            private handleTab;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): void;
            defaultKeys: string;
            OnKeyDown(e: KeyboardEvent): void;
            handleEvent(e: Event): any;
            OnContextMenu(e: MouseEvent): any;
            private ShowStart;
            static readonly Current: Desktop;
            Check(v: defs.$UI.IApp): boolean;
            Show(app: defs.$UI.IApp): void;
            private to;
            private loadApp;
            Add(i: defs.$UI.IApp): this;
            Register(app: defs.$UI.IApp): void;
            AuthenticationApp: defs.$UI.IAuthApp;
            private Redirect;
            OnUsernameChanged(job: any, e: any): void;
        }
        class Container extends Control<JControl> {
            constructor();
            initialize(): void;
            Check(child: JControl): boolean;
        }
        enum Icons {
            Bar = 0,
            Next = 1,
            Prev = 2
        }
        enum Glyphs {
            none = 0,
            asterisk = 1,
            plus = 2,
            eur = 3,
            euro = 4,
            minus = 5,
            cloud = 6,
            envelope = 7,
            pencil = 8,
            glass = 9,
            music = 10,
            search = 11,
            heart = 12,
            star = 13,
            starEmpty = 14,
            user = 15,
            film = 16,
            thLarge = 17,
            th = 18,
            thList = 19,
            ok = 20,
            remove = 21,
            zoomIn = 22,
            zoomOut = 23,
            off = 24,
            signal = 25,
            cog = 26,
            trash = 27,
            home = 28,
            file = 29,
            time = 30,
            road = 31,
            downloadAlt = 32,
            download = 33,
            upload = 34,
            inbox = 35,
            playCircle = 36,
            repeat = 37,
            refresh = 38,
            listAlt = 39,
            lock = 40,
            flag = 41,
            headphones = 42,
            volumeOff = 43,
            volumeDown = 44,
            volumeUp = 45,
            qrcode = 46,
            barcode = 47,
            tag = 48,
            tags = 49,
            book = 50,
            bookmark = 51,
            print = 52,
            camera = 53,
            font = 54,
            bold = 55,
            italic = 56,
            textHeight = 57,
            textWidth = 58,
            alignLeft = 59,
            alignCenter = 60,
            alignRight = 61,
            alignJustify = 62,
            list = 63,
            indentLeft = 64,
            indentRight = 65,
            facetimeVideo = 66,
            picture = 67,
            mapMarker = 68,
            adjust = 69,
            tint = 70,
            edit = 71,
            share = 72,
            check = 73,
            move = 74,
            stepBackward = 75,
            fastBackward = 76,
            backward = 77,
            play = 78,
            pause = 79,
            stop = 80,
            forward = 81,
            fastForward = 82,
            stepForward = 83,
            eject = 84,
            chevronLeft = 85,
            chevronRight = 86,
            plusSign = 87,
            minusSign = 88,
            removeSign = 89,
            okSign = 90,
            questionSign = 91,
            infoSign = 92,
            screenshot = 93,
            removeCircle = 94,
            okCircle = 95,
            banCircle = 96,
            arrowLeft = 97,
            arrowRight = 98,
            arrowUp = 99,
            arrowDown = 100,
            shareAlt = 101,
            resizeFull = 102,
            resizeSmall = 103,
            exclamationSign = 104,
            gift = 105,
            leaf = 106,
            fire = 107,
            eyeOpen = 108,
            eyeClose = 109,
            warningSign = 110,
            plane = 111,
            calendar = 112,
            random = 113,
            comment = 114,
            magnet = 115,
            chevronUp = 116,
            chevronDown = 117,
            retweet = 118,
            shoppingCart = 119,
            folderClose = 120,
            folderOpen = 121,
            resizeVertical = 122,
            resizeHorizontal = 123,
            hdd = 124,
            bullhorn = 125,
            bell = 126,
            certificate = 127,
            thumbsUp = 128,
            thumbsDown = 129,
            handRight = 130,
            handLeft = 131,
            handUp = 132,
            handDown = 133,
            circleArrowRight = 134,
            circleArrowLeft = 135,
            circleArrowUp = 136,
            circleArrowDown = 137,
            globe = 138,
            wrench = 139,
            tasks = 140,
            filter = 141,
            briefcase = 142,
            fullscreen = 143,
            dashboard = 144,
            paperclip = 145,
            heartEmpty = 146,
            link = 147,
            phone = 148,
            pushpin = 149,
            usd = 150,
            gbp = 151,
            sort = 152,
            sortByAlphabet = 153,
            sortByAlphabetAlt = 154,
            sortByOrder = 155,
            sortByOrderAlt = 156,
            sortByAttributes = 157,
            sortByAttributesAlt = 158,
            unchecked = 159,
            expand = 160,
            collapseDown = 161,
            collapseUp = 162,
            logIn = 163,
            flash = 164,
            logOut = 165,
            newWindow = 166,
            record = 167,
            save = 168,
            open = 169,
            saved = 170,
            import = 171,
            export = 172,
            send = 173,
            floppyDisk = 174,
            floppySaved = 175,
            floppyRemove = 176,
            floppySave = 177,
            floppyOpen = 178,
            creditCard = 179,
            transfer = 180,
            cutlery = 181,
            header = 182,
            compressed = 183,
            earphone = 184,
            phoneAlt = 185,
            tower = 186,
            stats = 187,
            sdVideo = 188,
            hdVideo = 189,
            subtitles = 190,
            soundStereo = 191,
            soundDolby = 192,
            sound$5$1 = 193,
            sound$6$1 = 194,
            sound$7$1 = 195,
            copyrightMark = 196,
            registrationMark = 197,
            cloudDownload = 198,
            cloudUpload = 199,
            treeConifer = 200,
            treeDeciduous = 201,
            cd = 202,
            saveFile = 203,
            openFile = 204,
            levelUp = 205,
            copy = 206,
            paste = 207,
            alert = 208,
            equalizer = 209,
            king = 210,
            queen = 211,
            pawn = 212,
            bishop = 213,
            knight = 214,
            babyFormula = 215,
            tent = 216,
            blackboard = 217,
            bed = 218,
            apple = 219,
            erase = 220,
            hourglass = 221,
            lamp = 222,
            duplicate = 223,
            piggyBank = 224,
            scissors = 225,
            bitcoin = 226,
            btc = 227,
            xbt = 228,
            yen = 229,
            jpy = 230,
            ruble = 231,
            rub = 232,
            scale = 233,
            iceLolly = 234,
            iceLollyTasted = 235,
            education = 236,
            optionHorizontal = 237,
            optionVertical = 238,
            menuHamburger = 239,
            modalWindow = 240,
            oil = 241,
            grain = 242,
            sunglasses = 243,
            textSize = 244,
            textColor = 245,
            textBackground = 246,
            objectAlignTop = 247,
            objectAlignBottom = 248,
            objectAlignHorizontal = 249,
            objectAlignLeft = 250,
            objectAlignVertical = 251,
            objectAlignRight = 252,
            triangleRight = 253,
            triangleLeft = 254,
            triangleBottom = 255,
            triangleTop = 256,
            console = 257,
            superscript = 258,
            subscript = 259,
            menuLeft = 260,
            menuRight = 261,
            menuDown = 262,
            menuUp = 263
        }
        class Glyph extends JControl {
            private isIcon?;
            static AllGlyphs(panel: JControl): void;
            static Test(): any;
            static CreateGlyphDom(glyph: UI.Glyphs, toolTip: string, cssClass?: string): HTMLSpanElement;
            private static GetGlyphCSS;
            private static GetIconCSS;
            private getStyle;
            constructor(glyph: Glyphs | Icons, isIcon?: boolean, toolTip?: string);
            initialize(): void;
            private v;
            Type: Glyphs | Icons;
        }
        class Button extends JControl {
            Focus(): any;
            private v;
            Style: ButtonStyle;
            initialize(): void;
            constructor();
            private _text;
            private _content;
            Text: string;
            Content: Node;
            Type: string;
            private reset;
        }
        class GlyphButton extends Button {
            initialize(): void;
            AddGlyphs(isIcon: (i: number) => boolean, ...glyphs: (Glyphs | Icons)[]): void;
            AddGlyph(glyph: Glyphs | Icons, isIcon?: boolean): Glyph;
            protected Check(child: JControl): boolean;
            private target;
            CollapsedZone: JControl;
        }
        class Dom extends JControl {
            constructor(tagName: string | HTMLElement, classList?: string[]);
            initialize(): void;
        }
        class Anchore extends JControl {
            constructor(content?: string | HTMLElement | JControl, href?: string);
            initialize(): void;
            Add(child: JControl): this;
            Remove(child: JControl): boolean;
            Text: string;
            Href: string;
        }
        class Label extends JControl {
            constructor(text: string);
            initialize(): void;
            Text: string;
        }
        class Text extends JControl {
            constructor(text: string);
            initialize(): void;
            Text: string;
        }
        class Textbox extends JControl {
            constructor(text?: string);
            Focus(): void;
            initialize(): void;
            Add(child: JControl): this;
            Remove(child: JControl): boolean;
            Text: string;
            PlaceHolder: string;
        }
        enum ListType {
            Ordred = 0,
            UnOrdred = 1
        }
        class List extends Control<JControl> {
            constructor(type?: ListType);
            initialize(): void;
            Check(child: JControl): boolean;
            readonly HasTemplate: boolean;
            getTemplate(child: JControl | HTMLElement | string): JControl;
            AddText(item: string): Div;
            protected OnChildAdded(child: JControl): void;
            private _si;
            SelectedIndex: number;
        }
        class DivControl extends Control<JControl> {
            constructor(tag?: string | HTMLElement);
            initialize(): void;
            Check(child: JControl): boolean;
        }
        class Div extends Control<JControl> {
            constructor();
            initialize(): void;
            Check(item: JControl): boolean;
        }
        class ServiceNavBar<T extends IItem> extends JControl {
            App: defs.$UI.IApp;
            private autoInitializePanels;
            constructor(App: defs.$UI.IApp, autoInitializePanels: boolean);
            initialize(): void;
            private _lefttabs;
            private _righttabs;
            private bi;
            LeftTabs: Navbar<T>;
            RightTabs: Navbar<T>;
            private createItem;
            OnPageSelected: (page: T) => void;
            OnClick(page: T): void;
            Add(child: JControl): this;
            AddRange(child: JControl[]): this;
            Remove(child: JControl): boolean;
            serviceNotified(s: IService, n: NotifyType): void;
            private services;
            private readonly currentStack;
            private CurrentService;
            PushGBar(ser: IService): void;
            PopGBar(ser: IService): void;
            ExitBar(): void;
            PushBar(ser: IService): void;
            PopBar(): void;
            private HideCurrentService;
            private ShowCurrentService;
            Push(s: IService): void;
            private Has;
            Pop(s?: IService): void;
            Register(service: IService): void;
            private _services;
        }
        class Navbar<T extends IItem> extends List {
            private _items;
            constructor();
            initialize(): void;
            private oicd;
            private ItemsChanged;
            private createItem;
            selectable: boolean;
            private _selectedItem;
            readonly SelectedItem: MenuItem;
            private onClick;
            Float(v: HorizontalAlignement): void;
            private CClear;
            readonly Items: collection.ExList<T, any>;
            OnSelectedItem: bind.EventListener<(item: T) => void>;
        }
        class NavbarHeader extends JControl {
            Title: string;
            private _brand;
            private _brandContainer;
            private _toggleButton;
            readonly Brand: JControl;
            readonly ToggleButton: GlyphButton;
            constructor();
            initialize(): void;
            IsFixedTop: boolean;
            IsHeader: boolean;
        }
        interface IItem {
            Tag: any;
            Content: string | HTMLElement | JControl;
            Url: string;
            OnItemSelected(menuItem: MenuItem): any;
        }
        class MenuItem extends Anchore implements EventListenerObject, basic.IDisposable {
            Source: IItem;
            constructor(Source: IItem);
            propChanged(p: bind.PropBinding, e: bind.EventArgs<string, Page>): void;
            handleEvent(e: Event): void;
            OnClick: (page: IItem, sender: MenuItem) => void;
            Dispose(): void;
        }
        class ContentControl extends JControl implements IContentControl {
            constructor(dom?: HTMLElement);
            initialize(): void;
            private _content;
            Content: JControl;
            OnKeyDown(e: any): any;
            OnContextMenu(e: any): any;
        }
        enum ButtonStyle {
            Default = 0,
            Primary = 1,
            success = 2,
            Info = 3,
            Warning = 4,
            Danger = 5,
            Link = 6,
            Block = 7
        }
        class Input extends JControl {
            Disable(disable: any): void;
            constructor(dom?: any);
            initialize(): void;
            Placeholder: string;
            Text: string;
            Blur(): void;
            handleEvent(e: FocusEvent): void;
            OnFocusIn(e: FocusEvent): void;
            OnKeyPressed(e: KeyboardEvent): KeyboardControllerResult;
            OnFocusOut(e: FocusEvent): void;
        }
        enum SearchActionMode {
            None = 0,
            Validated = 1,
            Instantany = 2,
            NoSearch = 3
        }
        class ActionText extends JControl {
            private btn_ok;
            private txtInput;
            readonly Box: Input;
            readonly Icon: Button;
            OnAction: bind.EventListener<(sender: ActionText, oldText: string, newText: string) => void>;
            Bur(): void;
            constructor(input?: HTMLInputElement);
            initialize(): void;
            private ia;
            AutoAction: SearchActionMode;
            btnClicked(ev: Event): void;
            txtChanged(ev: Event): void;
            handleEvent(e: Event): void;
            private isExecuting;
            private tout;
            private job;
            private ls;
            Text: string;
            Focus(): void;
        }
        class CItem implements IItem {
            Tag: any;
            Content: string | HTMLElement | JControl;
            Url: string;
            private onselect;
            OnPropertyChanged(e: bind.DProperty<string, any>, m: (p: bind.PropBinding, e: bind.EventArgs<string, Page>) => void): void;
            constructor(Tag: any, Content: string | HTMLElement | JControl, Url: string, onselect: basic.ITBindable<(menuItem: MenuItem) => void>);
            OnItemSelected(menuItem: MenuItem): void;
        }
        class QBar<T extends IItem> extends JControl {
            private top;
            private _header;
            private _container;
            private _lefttabs;
            private _righttabs;
            private _colapsedZone;
            private bi;
            LeftTabs: Navbar<T>;
            RightTabs: Navbar<T>;
            readonly Header: NavbarHeader;
            constructor(top: boolean);
            private createItem;
            initialize(): void;
            Open(on?: boolean): void;
            OnPageSelected: (page: T) => void;
            OnClick(page: T): void;
            Add(child: JControl): this;
            Remove(child: JControl): boolean;
        }
        class Head<T extends IItem> extends JControl {
            private top;
            private _container;
            private _header;
            private _tabs;
            private _stabs;
            readonly Menu: Navbar<T>;
            readonly SubsMenu: Navbar<T>;
            private _colapsedZone;
            readonly Header: NavbarHeader;
            readonly Container: Container;
            constructor(top: boolean);
            private createItem;
            static __fields__(): any;
            Clear(): void;
            private CClear;
            initialize(): void;
            OnClick(item: T): void;
            static DPSelectedItem: bind.DProperty<IItem, Head<IItem>>;
            SelectedItem: T;
        }
        class Foot extends JControl {
            constructor();
            initialize(): void;
            Check(c: JControl): boolean;
        }
        enum Keys {
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
            F1 = 112,
            F2 = 113,
            F3 = 114,
            F4 = 115,
            F5 = 116,
            F6 = 117,
            F7 = 118,
            F8 = 119,
            F9 = 120,
            F10 = 121,
            F11 = 122,
            F12 = 123,
            AltLeft = 18,
            AltRight = 18,
            ShiftLeft = 18,
            ShiftRight = 18,
            ControlLeft = 17,
            ControlRight = 17,
            MetaLeft = 91,
            MetaRight = 91
        }
        enum Controlkeys {
            Alt = 18,
            Shift = 16,
            Control = 17,
            Meta = 91
        }
        class HotKey {
            private _key;
            private __ctrl;
            Key: Keys;
            Control: Controlkeys;
            IsPressed(e: KeyboardEvent): boolean;
            private checkKey;
            private checkControl;
        }
        class Page extends Control<JControl> implements defs.$UI.IPage, basic.IDisposable, IService, IItem {
            protected app: App;
            Name: string;
            Tag: any;
            Callback(args: any): void;
            _fl: boolean;
            FloatLeft: boolean;
            static DPTitle: bind.DProperty<string | HTMLElement | JControl, Page>;
            getDPTitle(): bind.DProperty<string | HTMLElement | JControl, Page>;
            getDPUrl(): bind.DProperty<string, {}>;
            Content: string | HTMLElement | JControl;
            ServiceType: ServiceType;
            Notify: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
            static DPUrl: bind.DProperty<string, {}>;
            Url: string;
            static __fields__(): (bind.DProperty<string | HTMLElement | JControl, Page> | bind.DProperty<string, {}>)[];
            HasSearch: UI.SearchActionMode;
            getSuggessions(): collection.List<any>;
            OnSearche(oldPatent: string, newPatent: string): void;
            initialize(): void;
            Update(): void;
            private readonly intern;
            Check(c: Page): boolean;
            constructor(app: App, title: string | HTMLElement | JControl, Name: string);
            Dispose(): void;
            GetLeftBar(): JControl | QBar<any>;
            GetRightBar(): any;
            OnItemSelected(menuItem: MenuItem): void;
            _onSelected: bind.EventListener<(p: this) => void>;
            readonly OnSelected: bind.EventListener<(p: this) => void>;
            ContextMenu: ContextMenu;
            Handled(): boolean;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): any;
            OnPrint(): any;
            OnDeepSearche(): void;
            OnContextMenu(e: MouseEvent): boolean;
        }
        class BarStack {
            private _current;
            private others;
            constructor(current: IService);
            readonly Current: IService;
            Push(s: IService): void;
            Pop(): IService;
            Has(s: IService): number;
            Exit(): void;
        }
        enum HorizontalAlignement {
            Left = 0,
            Center = 1,
            Right = 2
        }
        enum VerticalAlignement {
            Top = 0,
            Center = 1,
            Bottom = 2
        }
        class Point {
            x: number;
            y: number;
            constructor(x: number, y: number);
        }
        enum MetricType {
            Pixel = 0,
            Percentage = 1,
            Inch = 2,
            Em = 3
        }
        class Metric {
            Value: number;
            Type: MetricType;
            constructor(value: number | string, type?: MetricType);
            minus(v: any): Metric;
            toString(): string;
            fromString(s: string): void;
        }
        class Error extends JControl {
            IsInfo: boolean;
            private container;
            private _text;
            Message: string;
            Expire: number;
            constructor();
            initialize(): void;
            handleEvent(e: any): void;
            Push(): void;
            private timeout;
            Pop(): void;
            Dispose(): void;
        }
        class InfoArea extends Control<JControl> {
            static readonly Default: InfoArea;
            constructor();
            initialize(): void;
            Check(j: JControl): boolean;
            static push(msg: string, isInfo?: boolean, expire?: number): void;
        }
        class Size {
            w: Metric;
            h: Metric;
            constructor(w: Metric | string | number, h: Metric | number | string);
        }
        class Badge extends JControl {
            constructor();
            initialize(): void;
            Content: any;
        }
        class DragManager {
            private handler;
            private target;
            private View;
            private loc;
            constructor(handler: JControl, target: JControl);
            private mouseloc;
            private cntloc;
            handleEvent(e: DragEvent): void;
            Location: Point;
            private RelocationJob;
            reLocation(hr: boolean, vr: boolean): void;
        }
        class FixedPanel extends JControl {
            private ha;
            private va;
            private loc;
            private body;
            private size;
            constructor(view?: HTMLElement);
            initialize(): void;
            Check(i: any): boolean;
            private mouseloc;
            private cntloc;
            handleEvent(e: DragEvent): void;
            private static resizeBody;
            Height: Metric;
            Width: Metric;
            HorizontalAlignement: HorizontalAlignement;
            VerticalAlignement: VerticalAlignement;
            Location: Point;
            Size: Size;
            private RelocationJob;
            private reLocation;
            Add(child: JControl): this;
            AddRange(childs: JControl[]): this;
        }
        abstract class Layout<T extends defs.$UI.IPage> extends Control<T> implements defs.$UI.IApp {
            readonly IsAuthentication: boolean;
            protected OnPageChanging(e: bind.EventArgs<T, this>): void;
            protected OnPageChanged(e: bind.EventArgs<T, this>): void;
            static DPSelectedPage: bind.DProperty<defs.$UI.IPage, Layout<any>>;
            static DPCurrentModal: bind.DProperty<Modal, Layout<any>>;
            CurrentModal: Modal;
            SelectedPage: T;
            static __fields__(): (bind.DProperty<defs.$UI.IPage, Layout<any>> | bind.DProperty<Modal, Layout<any>>)[];
            Name: string;
            abstract Foot: ServiceNavBar<IItem>;
            abstract SearchBox: ActionText;
            Pages: collection.List<T>;
            protected abstract showPage(page: T): any;
            Logout(): void;
            constructor(view: any);
            protected silentSelectPage(oldPage: T, page: T): void;
            Open(page: T): void;
            private PagesChanged;
            OpenPage(pageNme: string): boolean;
            AddPage(child: T): void;
            SelectNaxtPage(): void;
            SelectPrevPage(): void;
            private opcd;
            Update(): void;
            OnKeyDown(e: KeyboardEvent): void;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnPrint(): any;
            OnDeepSearche(): void;
            OnContextMenu(e: MouseEvent): void;
            handleEvent(e: KeyboardEvent): void;
            Show(): void;
            initialize(): void;
            protected static getView(): HTMLElement;
            protected searchActioned(s: ActionText, o: string, n: string): void;
            OnAttached(): void;
            OnDetached(): void;
            OpenModal(m: Modal): void;
            CloseModal(m: Modal): void;
            _onCurrentModalChanged(e: bind.EventArgs<Modal, Layout<any>>): any;
            private openedModal;
            private zIndex;
            OpenContextMenu<T>(cm: IContextMenu<T>, e: IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T): boolean;
            private _contextMenuLayer;
            private _currentContextMenu;
            private _currentContextMenuEventArgs;
            private _contextMenuZIndex;
        }
        class App extends Layout<Page> {
            private name;
            static DPTitle: bind.DProperty<String, App>;
            Title: String;
            static DPBadge: bind.DProperty<String, App>;
            Badge: String;
            private static Apps;
            static readonly CurrentApp: defs.$UI.IApp;
            readonly Name: string;
            Head: Head<Page>;
            private AppBody;
            Foot: ServiceNavBar<IItem>;
            PageBody: ContentControl;
            private AppTitle;
            private _search;
            slogant: Dom;
            readonly SearchBox: ActionText;
            createTitle(t: string): ContentControl;
            constructor(name: string);
            protected showPage(page: Page): void;
            protected OnPageChanged(e: bind.EventArgs<Page, this>): void;
            initialize(): void;
            IsTopNavBarhidden(): boolean;
            HideTopNavBar(v: boolean): boolean;
            ToggleTitle(): void;
            IsTitleBringged(): boolean;
            private intern;
            Check(page: any): boolean;
            Add(child: Page | Head<IItem> | Foot | QBar<IItem> | ContentControl | ServiceNavBar<IItem>): this;
            static __fields__(): any;
        }
        abstract class AuthApp extends App implements defs.$UI.IAuthApp {
            readonly IsAuthentication: boolean;
            constructor(key: any, b: bind.EventListener<(v: boolean) => void>);
            abstract IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
            abstract RedirectApp: defs.$UI.IApp;
            OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
        }
        enum NotifyType {
            Focuse = 0,
            UnFocus = 1
        }
        enum ServiceType {
            Main = 0,
            Stackable = 1,
            Instantany = 3
        }
        interface IService {
            GetLeftBar(): JControl;
            GetRightBar(): JControl;
            Handler?: EventTarget;
            ServiceType: ServiceType;
            Notify?: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
            Callback(args: any): any;
            Handled(): boolean;
        }
        class FunctionGroup<T extends Function> extends Function {
            private _;
            private map;
            constructor();
            Push(f: T, name?: string): void;
            Remove(name: string): T;
            Create(): Function;
        }
        class Modal extends JControl {
            Content: UI.JControl;
            protected focuser: basic.focuser;
            private _searchBox;
            private abonment;
            private getSearchBox;
            private callBack;
            onSearch: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void;
            OnSearch(i: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void): void;
            private _container;
            private _container1;
            private _fm;
            private _head;
            private _body;
            private _foot;
            OkTitle(v: string): this;
            AbortTitle(v: string): this;
            Canceltitle(v: string): this;
            Title(v: string): this;
            Search(d: collection.List<any>): void;
            private asSearch;
            private drgmngr;
            SetDialog(title: string, content: JControl): void;
            private static zIndex;
            static NextZIndex(): number;
            readonly IsOpen: boolean;
            Open(): void;
            targetApp: defs.$UI.IApp;
            protected silentClose(): void;
            Close(msg: MessageResult): void;
            constructor();
            initialize(): void;
            private lastRect;
            private _dtitle;
            private _ts;
            protected createHeader(head: JControl): void;
            protected createFoot(foot: JControl): void;
            private events;
            private static casses;
            private _setText;
            SetVisible(role: MessageResult, visible: boolean): void;
            private createBtn;
            private _initBtn;
            private _btnClicked;
            Add(child: JControl): this;
            Remove(child: JControl): boolean;
            Insert(child: JControl, i: number): this;
            Dispose(): void;
            private _onClick;
            readonly OnClosed: bind.EventListener<(e: MessageEventArgs) => void>;
            OnKeyDown(e: KeyboardEvent): any;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            Clear(): void;
            static _ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (r: any, m: Modal) => void, ok?: string, cancel?: string): (msg: any) => void | void;
            private static closedMessages;
            static ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (e: MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): Modal;
            setStyle(name: string, value: string): this;
            setWidth(value: string): this;
            setHeight(value: string): this;
            IsMaterial: boolean;
            OnContextMenu(e: any): any;
        }
        enum MessageResult {
            Exit = 0,
            ok = 1,
            cancel = 2,
            abort = 3
        }
        class MessageEventArgs {
            Modal: Modal;
            Result: MessageResult;
            msg: string;
            private _stayOpen;
            readonly stayOpen: boolean;
            StayOpen(): void;
            Close(): void;
            constructor(Modal: Modal, Result: MessageResult, msg: string);
        }
        class Image extends JControl {
            Source: string;
            constructor();
            initialize(): void;
        }
        class CarouselItem extends JControl {
            Indicator: any;
            private _image;
            private _caption;
            constructor(url: string, caption: any);
            initialize(): void;
            Active: boolean;
        }
        class Carousel extends Control<CarouselItem> {
            private _items;
            private _indecators;
            private _inner;
            private leftButton;
            private rightButton;
            constructor();
            initialize(): void;
            private opcd;
            private fromInit;
            protected createButton(isLeft: boolean): any;
            private createIndecator;
            private b;
            private ItemsChanged;
            private selectNext;
            Clear(): void;
            Check(child: CarouselItem): boolean;
            Add(child: CarouselItem): this;
            Remove(child: CarouselItem): boolean;
            RemoveAt(i: number): boolean;
        }
        class PaginationSurf extends JControl {
            private isNext?;
            private anchore;
            private span;
            private text;
            constructor(isNext?: boolean);
            initialize(): void;
            Icon: string;
            Title: string;
            OnClick: (e: PaginationSurf) => void;
            handleEvent(e: MouseEvent): void;
        }
        class BiPagination extends JControl {
            static __fields__(): bind.DProperty<number, BiPagination>[];
            private isc;
            static DPIndex: bind.DProperty<number, BiPagination>;
            Index: number;
            Max: number;
            static DPMax: bind.DProperty<number, BiPagination>;
            private prev;
            private next;
            private list;
            private actionText;
            constructor();
            initialize(): void;
            handleEvent(e: Event): void;
            static ctor(): void;
            _onIndexChanged(e: bind.EventArgs<number, this>): void;
        }
        class Pagination extends JControl {
            private prev;
            private next;
            private items;
            static DPRange: bind.DProperty<number, Pagination>;
            static DPStartIndex: bind.DProperty<number, Pagination>;
            static DPCount: bind.DProperty<number, Pagination>;
            readonly SelectedRange: number;
            readonly Count: number;
            StartIndex: number;
            private OnCountChanged;
            private OnRangeChanged;
            private OnStartIndexChanged;
            constructor();
            AddItem(page: PaginationSurf): void;
            initialize(): void;
            private opcd;
            private sp;
            OnClick(e: PaginationSurf): void;
            private isInRange;
            private convert;
            private OnItemsChanged;
        }
        class NumericUpDown extends JControl {
            private f;
            static DPValue: bind.DProperty<number, NumericUpDown>;
            Value: number;
            static __fields__(): bind.DProperty<number, NumericUpDown>[];
            private minValue;
            private defaultValue;
            private maxvalue;
            private sleft;
            private sright;
            private text;
            protected _hasValue_(): boolean;
            constructor();
            initialize(): void;
            private textChanged;
            Focus(): void;
            SelectAll(): void;
        }
        interface pair<K, P> {
            Key: K;
            Value: P;
        }
        class NavPanel extends JControl implements IService {
            Name: string;
            OnPrint(): any;
            private title;
            private container;
            private caption;
            HasSearch: UI.SearchActionMode;
            readonly CaptionControl: Button;
            Title: string | HTMLElement;
            Caption: string;
            constructor(Name: string, caption: string);
            initialize(): void;
            ToolTip: string;
            Add(item: JControl): this;
            AddRange(items: JControl[]): this;
            Remove(item: JControl): boolean;
            RemoveAt(i: number, dispose?: boolean): boolean;
            Clear(): void;
            Update(): void;
            GetLeftBar(): any;
            GetRightBar(): any;
            Handled(): boolean;
            readonly ServiceType: ServiceType;
            Callback(): void;
            OnBringIntoFront(): void;
            IsActive: boolean;
            OnKeyDown(e: KeyboardEvent): void;
            OnSearche(oldPatent: string, newPatent: string): void;
            OnDeepSearch(): void;
            getHelp(t: Object): void;
        }
        class IContent extends JControl {
            private navPage;
            constructor(navPage: NavPage);
            initialize(): void;
            Check(item: JControl): boolean;
            Add(p: NavPanel): this;
            Remove(p: NavPanel): boolean;
        }
        class NavPage extends UI.Page {
            static DPSelectedItem: bind.DProperty<NavPanel, NavPage>;
            static __fields__(): any;
            private _onSelectedItemChanged;
            private con;
            private nav;
            private caption;
            Caption: string;
            constructor(app: App, title: string | HTMLElement | JControl, name: string);
            private islocal;
            initialize(): void;
            ToggleNav(): void;
            Add(c: JControl): this;
            AddRange(c: JControl[]): this;
            Check(j: JControl): boolean;
            SelectedItem: NavPanel;
            private children;
            SetPanel(panel: NavPanel): void;
            GetPanelOf(type: typeof NavPanel): NavPanel;
            GetPanelsOf(type: typeof NavPanel): NavPanel[];
            SetSeparator(): void;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): void;
            OnContextMenu(e: MouseEvent): boolean;
            OnPrint(): any;
            private static _onItemSelected;
            private events;
            Select(name: string): boolean;
            GetLeftBar(): any;
            HasSearch: UI.SearchActionMode;
            GetRightBar(): any;
            Update(): void;
            private panels;
            OnSearche(oldPatent: string, newPatent: string): void;
            OnDeepSearche(): void;
        }
    }
    export module UI {
        interface ITemplateShadow {
            setDataContext(data: any): any;
            getDataContext(): any;
        }
        abstract class TemplateShadow extends JControl implements ITemplateShadow {
            abstract setDataContext(data: any): any;
            abstract getDataContext(): any;
            static Create(item: any): ScopicTemplateShadow;
            abstract getScop(): bind.Scop;
            abstract readonly Controller: bind.Controller;
        }
        class ScopicTemplateShadow extends TemplateShadow {
            private scop?;
            readonly Controller: bind.Controller;
            private cnt;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(dom: HTMLElement, scop?: bind.Scop, cnt?: UI.JControl);
            initialize(): void;
            Check(c: JControl): boolean;
            readonly Scop: bind.Scop;
            getScop(): bind.Scop;
            Dispose(): void;
        }
        class EScopicTemplateShadow {
            private control;
            private scop?;
            readonly Controller: bind.Controller;
            private cnt;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(control: JControl, scop?: bind.Scop);
            initialize(): void;
            Check(c: JControl): boolean;
            readonly Scop: bind.Scop;
            getScop(): bind.Scop;
        }
        interface ITemplate {
            CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): TemplateShadow;
        }
        abstract class Template implements ITemplate {
            abstract CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
            static ToTemplate(itemTemplate: conv2template, asTemplate: boolean): Template;
        }
        class HtmlTemplate implements Template {
            dom: HTMLElement;
            private asTemplate;
            constructor(dom: HTMLElement, asTemplate?: boolean);
            CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
        }
        class ScopicTemplate implements Template {
            private template;
            CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
            constructor(templatePath: string | mvc.ITemplate);
        }
        class TControl<T> extends JControl {
            private data;
            static DPData: bind.DProperty<any, TControl<any>>;
            Data: T;
            static __fields__(): bind.DProperty<any, TControl<any>>[];
            static ctor(): void;
            static Me: any;
            constructor(itemTemplate: mvc.ITemplate | string | Function | Template | HTMLElement, data: T | bind.Scop);
            protected OnFullInitialized(): void;
            private _onTemplateCompiled;
            protected OnCompileEnd(cnt: bind.Controller): void;
            private Shadow;
            getScop(): bind.Scop;
            private _template;
            initialize(): void;
            _onCompiled: bind.EventListener<(s: this, cnt: bind.Controller) => void>;
            private compiled;
            OnCompiled: (s: this) => void;
            readonly IsCompiled: boolean;
            OnDataChanged(e: bind.EventArgs<T, this>): void;
        }
        interface ListAdapterEventArgs<T, P> {
            sender: ListAdapter<T, P>;
            index: number;
            template: TemplateShadow;
            oldIndex?: number;
            oldTemplate?: TemplateShadow;
            Cancel?: boolean;
            Event?: Event;
        }
        class ListAdapter<T, P> extends TControl<P> {
            instantanyInitializeParent(): boolean;
            private garbage;
            static __fields__(): bind.DProperty<any, ListAdapter<any, any>>[];
            static DPSource: bind.DProperty<collection.List<any>, ListAdapter<any, any>>;
            Source: collection.List<T>;
            static DPSelectedIndex: bind.DProperty<number, ListAdapter<any, any>>;
            private __checkSelectedIndex;
            AcceptNullValue: boolean;
            private swap;
            SelectedIndex: number;
            static DPItemStyle: bind.DProperty<string[], ListAdapter<any, any>>;
            ItemStyle: string[];
            static DPTemplate: bind.DProperty<ITemplate, ListAdapter<any, any>>;
            Template: ITemplate;
            OnItemSelected: bind.EventListener<(s: ListAdapter<T, P>, index: number, template: TemplateShadow, oldIndex?: number, oldTemplate?: TemplateShadow) => void>;
            OnItemInserted: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
            OnItemRemoved: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
            OnChildClicked: bind.EventListener<(e: ListAdapterEventArgs<T, P>) => void>;
            static DPSelectedItem: bind.DProperty<any, ListAdapter<any, any>>;
            private _content;
            readonly Content: Control<TemplateShadow>;
            _selectedItem: TemplateShadow;
            readonly SelectedChild: TemplateShadow;
            SelectedItem: T;
            activateClass: string;
            private OnSelectedIndexChanged;
            private riseItemSelectedEvent;
            Select(t: TemplateShadow): void;
            SelectItem(t: T): void;
            static _getTemplate(template: mvc.ITemplate | string | Function): mvc.ITemplate;
            static _getTemplateShadow(template: mvc.ITemplate | string | Function | HTMLElement): HTMLElement;
            static ctor(): void;
            constructor(template: conv2template, itemTemplate?: conv2template, data?: P | bind.Scop, getSourceFromScop?: boolean);
            private params;
            private initTemplate;
            private static getFirstChild;
            private static getTemplate;
            private sli;
            private getSourceFromScop;
            private CmdExecuter;
            private AttachSelectedItem;
            private CmdAttacheSelectedItemExecuter;
            private RlSourceScop;
            initialize(): void;
            private OnSourceChanged;
            private ReSelect;
            private _scop;
            private readonly Scop;
            BindTo(scop: bind.Scop): void;
            private OnScopValueChanged;
            OnItemClicked(s: TemplateShadow, e: Event, t: ListAdapter<any, any>): void;
            protected getItemShadow(item: T, i: number): TemplateShadow;
            protected disposeItemShadow(item: T, child: TemplateShadow, i: number): TemplateShadow;
            protected disposeItemsShadow(items: T[], child: TemplateShadow[]): void;
            private _insert;
            private _remove;
            private count;
            private OnAdd;
            private OnSet;
            private OnClear;
            private OnRemove;
            private OnReplace;
            private Reset;
            protected clearGarbage(): void;
            private Recycle;
            Dispose(): void;
            Add(child: JControl): this;
            AddRange(children: JControl[]): this;
            Remove(child: JControl, dispose: boolean): boolean;
            RemoveAt(i: number, dispose: boolean): boolean;
            Clear(dispose?: boolean): void;
            Insert(c: JControl, i: number): this;
            CloneChildren(): void;
            Check(c: JControl): boolean;
            OnKeyDown(e: KeyboardEvent): boolean;
        }
        class Spinner extends JControl {
            private container;
            private circle;
            private message;
            constructor(test: any);
            initialize(): void;
            private isStarted;
            Start(logo: string): void;
            Pause(): void;
            Message: string;
            static Default: Spinner;
        }
        class RichMenu<T> extends JControl {
            private menu;
            private adapter;
            private itemTemplate;
            constructor(itemTemplate?: conv2template, data?: T[], parent?: JControl);
            handleEvent(e: any): void;
            initialize(): void;
            private timeout;
            private isOpen;
            private i;
            private toInt;
            Open(e: MouseEvent, callback: basic.ITBindable<(r: RichMenu<T>, si: T) => void>, left: boolean, bottom: boolean): void;
            Close(imediate: boolean): void;
            Data: any[];
        }
        interface IContextMenuItem {
            Title: string;
            Shortcut?: string;
            Icon?: string;
        }
        enum Location {
            Left = 1,
            Top = 2,
            Right = 4,
            Bottom = 8,
            HCenter = 5,
            VCenter = 10,
            Center = 15,
            TopLeft = 3
        }
        interface IContextMenuEventArgs<T> {
            ObjectStat?: any;
            e: MouseEvent;
            x: number;
            y: number;
            selectedItem?: T;
            cancel?: boolean;
            callback(e: IContextMenuEventArgs<T>): any;
        }
        interface IContextMenu<T> {
            getTarget(): JControl;
            OnAttached(e: IContextMenuEventArgs<T>): any;
            OnClosed(result: T, e: IContextMenuEventArgs<T>): boolean;
            getView(): UI.JControl;
        }
        class ExContextMenu extends JControl {
            static DPTitle: bind.DProperty<string, ExContextMenu>;
            static DPItems: bind.DProperty<collection.List<IContextMenuItem>, ExContextMenu>;
            Title: string;
            Items: collection.List<IContextMenuItem>;
            static __fields__(): (bind.DProperty<string, ExContextMenu> | bind.DProperty<collection.List<IContextMenuItem>, ExContextMenu>)[];
            private dic;
            private list;
            private static zIndex;
            static readonly NextZIndex: number;
            constructor(items?: IContextMenuItem[]);
            initialize(): void;
            private OnItemSelected;
            private OnItemInserted;
            private OnItemRemoved;
            private Action;
            OnAction: bind.EventListener<(sender: this, selected: IContextMenuItem) => void>;
            location: Location;
            ShowForTarget(): void;
            Show(x: any, y: any): void;
            private toInt;
            private readonly HorizontalFraction;
            private readonly VerticalFraction;
            handleEvent(e: MouseEvent): void;
            private _OnContextMenu;
            Close(): void;
            Target: JControl | HTMLElement;
            private target;
        }
        class ContextMenu extends JControl {
            private dic;
            Items: collection.List<CItem>;
            constructor(items?: (CItem | string)[]);
            initialize(): void;
            private itemChangedDlg;
            private SourceChanged;
            private add;
            private OnItemSelected;
            OnMenuItemSelected: bind.EventListener<(s: ContextMenu, i: MenuItem) => void>;
            private remove;
            private replace;
            private clear;
            reset(): void;
            Add(j: JControl): this;
            AddRange(citem: JControl[]): this;
            Remove(j: JControl, dispose: boolean): boolean;
            Show(x: any, y: any): void;
            private thrid;
            private dateout;
            handleEvent(e: MouseEvent): void;
            private _OnContextMenu;
            private timeout;
            Target: JControl;
            private target;
        }
        class Gage {
            initialize(): void;
            static deg2str(diam: number, n: number): number;
            static createDashArray(diam: number, degs: number[]): void;
        }
        class CostumizedShadow extends TemplateShadow {
            private data?;
            Controller: any;
            setDataContext(data: any): void;
            getDataContext(): any;
            constructor(dom: HTMLOptionElement, data?: any);
            initialize(): void;
            getScop(): bind.Scop;
        }
        class CostumizedTemplate extends Template {
            constructor();
            CreateShadow(data: any): TemplateShadow;
        }
        class ComboBox extends ListAdapter<any, any> {
            constructor(dom: HTMLSelectElement, DataSource: collection.List<any>);
        }
        class TreeComboBox<T> extends JControl {
            private tree;
            private getString;
            constructor(tree: utils.Tree<T>, getString: (v: T) => string);
            initialize(): void;
            Reset(): void;
            private add;
        }
        module help {
            function createHeader<Owner>(hd: HTMLTableRowElement, cols: IColumnTableDef[], orderBy?: basic.ITBindable<(sender: Owner, orderBy: string, col: IColumnCellHeaderDef, view: HTMLTableHeaderCellElement) => void>): HTMLTableRowElement;
            function createTemplate(cols: IColumnTableDef[], tmp?: HTMLTableRowElement): HTMLTableRowElement;
            function generateCell<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement>(h: IColumnCellDef<T>, stype: 'th' | 'td'): T;
            interface IAttribute {
                values: string[];
                spliter: string;
            }
            interface IColumnCellDef<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement> {
                Attributes?: {
                    [s: string]: IAttribute | string;
                };
                TdAttributes?: {
                    [s: string]: IAttribute | string;
                };
                Content?: string | T | Node;
                ContentAsHtml?: boolean;
            }
            interface IColumnCellHeaderDef extends IColumnCellDef<HTMLTableHeaderCellElement> {
                OrderBy?: string;
            }
            interface IColumnCellDataDef extends IColumnCellDef<HTMLTableDataCellElement> {
            }
            interface IColumnTableDef {
                Header: IColumnCellHeaderDef | string;
                Cell: IColumnCellDataDef;
                editable?: boolean;
            }
        }
        class _Grid {
            constructor();
        }
    }
    export module UI {
    }
    export module UI {
        interface IAutoCompleteBox {
            Box: Input;
            DataSource: collection.List<any>;
            View: HTMLElement;
            IsChanged: boolean;
            Value: any;
            PrintSelection?: boolean;
            AutoPopup: boolean;
            Blur(): any;
            Template: ITemplate;
        }
        class AutoCompleteBox extends ActionText implements IAutoCompleteBox {
            Box: Input;
            View: HTMLElement;
            PrintSelection?: boolean;
            Template: ITemplate;
            AutoPopup: boolean;
            private dataSource;
            IsChanged: boolean;
            DataSource: collection.List<any>;
            constructor(input?: HTMLInputElement);
            initialize(): void;
            Value: any;
            Blur(): void;
        }
        type AutoCompleteCallback<T> = (box: IAutoCompleteBox, oldValue: T, newValue: T) => void;
        class ProxyAutoCompleteBox<T> implements IAutoCompleteBox {
            Box: Input;
            Template: ITemplate;
            PrintSelection?: boolean;
            Blur(): void;
            AutoPopup: boolean;
            private callback;
            private _value;
            DataSource: collection.List<any>;
            OnValueChanged(owner: any, invoke: AutoCompleteCallback<T>): void;
            readonly View: HTMLElement;
            Value: T;
            IsChanged: boolean;
            constructor(Box: Input, source: collection.List<T>);
            initialize(): this;
        }
    }
    export module UI {
        class Paginator<T> extends JControl {
            countPerPage: number;
            private full?;
            static InputScop: bind.Scop;
            private content;
            private paginator;
            private paginationFilter;
            readonly Filter: filters.list.SubListFilter<T>;
            constructor(countPerPage: number, dom?: HTMLElement, full?: boolean);
            initialize(): void;
            Refresh(): void;
            private _cnt;
            Content: JControl;
            private whenIndexChanged;
            OnIndexChanged(ev: (b: bind.PropBinding, e: bind.EventArgs<number, BiPagination>) => void): bind.PropBinding;
            OffIndexChanged(b: bind.PropBinding): boolean;
            Max: number;
            BindMaxToSourceCount(x: collection.List<any>): void;
            UnbindMaxFromSourceCount(x: collection.List<T>): void;
            private bm2sc;
            Next(): void;
            Previous(): void;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): any;
            static DPInput: bind.DProperty<collection.List<any>, Paginator<any>>;
            Input: collection.List<T>;
            static DPOutput: bind.DProperty<collection.ExList<any, filters.list.SubListPatent>, Paginator<any>>;
            readonly Output: collection.ExList<T, filters.list.SubListPatent>;
            private bindInputToMax;
            private OnInputChanged;
            private bindScopToInput;
            InputScop: bind.Scop;
            static __fields__(): bind.DProperty<collection.List<any>, Paginator<any>>[];
            static createPaginator<T, P>(adapter: ListAdapter<T, P>, dataSource: collection.List<T>, max?: number): Paginator<T>;
        }
    }
    export module UI {
        class Grid extends UI.JControl {
            initialize(): void;
            private createRule;
        }
    }
    export module UI {
        interface IStrechyButtonItemData {
            Title: string;
            Icon?: string;
        }
        class StrechyButtonItemData extends bind.DObject {
            Title: string;
            static DPTitle: bind.DProperty<string, StrechyButtonItemData>;
            static DPIcon: bind.DProperty<string, StrechyButtonItemData>;
            Icon: string;
            static __fields__(): bind.DProperty<string, StrechyButtonItemData>[];
            constructor(Title: string);
        }
        class StrechyButton extends UI.ListAdapter<IStrechyButtonItemData, collection.List<IStrechyButtonItemData>> {
            private __data?;
            private triggerButton;
            private listDom;
            private itemTemplate;
            private IsOpen;
            constructor(__data?: collection.List<IStrechyButtonItemData>);
            initialize(): void;
            private static EventCloseIsRegistered;
            private static OpenedStrechyButtons;
            private static RegisterEvents;
            static CloseAll(enableEvent: boolean): void;
            Open(): void;
            Close(): void;
            private simpleClose;
            private simpleOpen;
            static handleEvent(event: any): void;
            handleEvent(event: Event): void;
        }
        class UISearch extends UI.JControl {
            inputEl: HTMLInputElement;
            constructor(el: HTMLElement);
            OnSearch: (data: string) => void;
            initialize(): void;
            handleEvent(e: KeyboardEvent): void;
            private validate;
            IsOpen: boolean;
            open(): void;
            close(): void;
        }
        function showSPTooltips(v: boolean): void;
    }
    export module UI.Modals {
        function CreateGlyph(dom: any, icon: any, title: any, type: any, attri: any): any;
        type EModalAction<T extends bind.DObject> = (sender: EModalEditer<T>, e?: ModalEditorEventArgs<T>) => void;
        type EModalEditorHandler<T extends bind.DObject> = basic.ITBindable<EModalAction<T>>;
        type ModalAction<T> = (product: T, isNew: boolean, err?: basic.DataStat, e?: MessageEventArgs) => boolean;
        type ModalEditorResult<T> = basic.ITBindable<ModalAction<T>>;
        type ModalListAction<T> = (s: ModalList<T>, selected: T, result: MessageResult, e: MessageEventArgs) => void;
        class ModalEditorEventArgs<T extends bind.DObject> {
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
        type EModalEditorCallback<T extends bind.DObject> = reflection.Method<void, (s: EModalEditer<T>, e: ModalEditorEventArgs<T>) => void>;
        abstract class BasicModalEditor<T extends bind.DObject> extends UI.Modal {
            static __fields__(): bind.DProperty<boolean, BasicModalEditor<any>>[];
            static DPIsEditable: bind.DProperty<boolean, BasicModalEditor<any>>;
            protected scop: bind.Scop;
            ChangedStatControled: boolean;
            IsEditable: boolean;
            Data: T;
            OnKeyDown(e: KeyboardEvent): any;
        }
        class EModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
            private templateName;
            allowEditNullVaue: boolean;
            action: reflection.Method<void, (s: this, e: ModalEditorEventArgs<T>) => void>;
            constructor(templateName: string, allowEditNullVaue: boolean);
            initialize(): void;
            private IsNew;
            private backupData;
            private _isOpen;
            edit(data: T, isNew: boolean, action: EModalEditorCallback<T>, editable?: boolean): void;
            Open(): void;
            Close(msg: MessageResult): void;
            NativeClose(msg: MessageResult, commit: boolean): void;
            silentClose(): void;
        }
        class ModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
            private templateName;
            constructor(templateName: string);
            initialize(): void;
            private IsNew;
            private backupData;
            edit(product: T, isNew: boolean, action: IEditorAction<T>, editable?: boolean): void;
            Open(): void;
            private Action;
        }
        interface IEditorAction<T> {
            OnSuccess?: ModalEditorResult<T>;
            OnError?: ModalEditorResult<T>;
        }
        interface IEEditorAction<T extends bind.DObject> {
            OnSuccess?: EModalEditorHandler<T>;
            OnError?: EModalEditorHandler<T>;
        }
        class EditorAction<T> implements IEditorAction<T> {
            private proxyAction;
            private callback;
            private invoke;
            OnSuccess: ModalEditorResult<T>;
            OnError: ModalEditorResult<T>;
            constructor(proxyAction: IEditorAction<T>, callback: DBCallback<T>);
            onSuccess(p: T, isNew: boolean): boolean;
            onError(p: T, isNew: boolean): boolean;
            Clone(callback: DBCallback<T>): EditorAction<T>;
            static Create<T>(_this: any, onSuccess: ModalAction<T>, onError: ModalAction<T>, defaltCallback?: DBCallback<T>): EditorAction<T>;
        }
        type DBCallback<T> = (data: T, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => void | boolean;
    }
    export module UI.Modals {
        class ModalList<T> extends UI.Modal {
            private source;
            private tableTmplate;
            private itemTemplate;
            private datas?;
            private asScopic?;
            isMatch?: (p: utils.IPatent<T>, item: T) => boolean;
            private paginator;
            private Datacontext;
            constructor(source: collection.List<T>, tableTmplate: string, itemTemplate: string, datas?: any, asScopic?: boolean, isMatch?: (p: utils.IPatent<T>, item: T) => boolean);
            static IsMatch<T>(p: utils.IPatent<T>, item: T): boolean;
            IsMatch: (p: utils.IPatent<T>, item: T) => boolean;
            initialize(): void;
            private static createPaginator;
            SelectedItem: T;
            show(onc: UI.Modals.ModalListAction<T>, list?: collection.List<T>): void;
            Source: collection.List<T>;
            Open(): void;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): any;
            Close(msg: any): void;
            private onc;
            _exList: collection.ExList<T, any>;
            private createFilter;
        }
    }
    export module UI {
        interface ITabControlData<OwnerClassType, ContentType> {
            Title: string;
            Content: ContentType;
            OnSelected?(sender: OwnerClassType, item: this): any;
        }
        interface ITabControlItem extends ITabControlData<TabControl, JControl> {
            Title: string;
            Content: JControl;
            OnSelected?(sender: TabControl, item: this): any;
        }
        class TabControl extends UI.NavPanel {
            static DPItems: bind.DProperty<collection.List<ITabControlItem>, TabControl>;
            Items: collection.List<ITabControlItem>;
            private static DPTabNav;
            private TabNav;
            private static DPTabContent;
            private TabContent;
            static DPSelectedItem: bind.DProperty<ITabControlItem, TabControl>;
            SelectedItem: ITabControlItem;
            static __fields__(): any;
            initialize(): void;
            OnBringIntoFront(): void;
            constructor(name: string, caption: string, items: ITabControlItem[]);
            private onSelectedTabChanged;
            private Reslect;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): any;
            CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events): void;
        }
        class UniTabControl<T> extends UI.NavPanel {
            private content;
            private onSelectedItemChanged;
            static DPItems: bind.DProperty<collection.List<ITabControlData<UniTabControl<any>, any>>, UniTabControl<any>>;
            Items: collection.List<ITabControlData<this, T>>;
            private static DPTabNav;
            private TabNav;
            private static DPTabContent;
            private TabContent;
            static DPSelectedItem: bind.DProperty<ITabControlData<UniTabControl<any>, any>, UniTabControl<any>>;
            SelectedItem: ITabControlData<this, T>;
            static __fields__(): any;
            initialize(): void;
            constructor(name: string, caption: string, items: collection.List<ITabControlData<UniTabControl<T>, T>>, content: JControl, onSelectedItemChanged: (s: UniTabControl<T>, cnt: JControl, selected: ITabControlData<UniTabControl<T>, T>) => string);
            private onSelectedTabChanged;
            OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
            OnKeyDown(e: KeyboardEvent): any;
            CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events): void;
            OnTabSelected: bind.EventListener<(e: ITabControlEventArgs<T>) => void>;
            OnTabClosed: bind.EventListener<(e: ITabControlEventArgs<T>) => void>;
            GetLeftBar(): any;
            GetRightBar(): any;
            OnPrint(): any;
            Update(): void;
            OnSearche(oldPatent: string, newPatent: string): void;
            OnDeepSearch(): void;
            readonly HasSearch: SearchActionMode;
        }
        interface ITabControlEventArgs<T> {
            Sender: UniTabControl<T>;
            Cancel: boolean;
            Target: ITabControlData<ITabControlData<UniTabControl<T>, T>, T>;
            Stat: 'opened' | 'closing' | 'closed';
        }
        class TabControlItem<OwnerType, ContentType> extends bind.DObject implements ITabControlData<OwnerType, ContentType> {
            Title: string;
            Content: ContentType;
            static DPTitle: bind.DProperty<string, TabControlItem<any, any>>;
            static DPContent: bind.DProperty<any, TabControlItem<any, any>>;
            static __fields__(): bind.DProperty<any, TabControlItem<any, any>>[];
            constructor(Title: string, Content: ContentType);
        }
    }
    export var LoadDefaultCSS: (callback?: any, onerror?: any) => void;
}
declare module "sys/QModel" {
    import { sdata, Controller } from "sys/System";
    import { bind, net, collection } from "sys/Corelib";
    export namespace models {
        enum MessageType {
            Info = 0,
            Error = 1,
            Command = 2,
            Confirm = 3
        }
        class CallBackMessage {
            ProxyCallback: Controller.ProxyCallback<any>;
            Request: net.Request;
            QueeDownloader: net.QueeDownloader;
        }
        class Message extends sdata.QShopRow {
            static DPData: bind.DProperty<string, Message>;
            Data: string;
            static DPContent: bind.DProperty<string, Message>;
            Content: string;
            static DPTitle: bind.DProperty<string, Message>;
            Title: string;
            static DPOkText: bind.DProperty<string, Message>;
            OKText: string;
            Callback: CallBackMessage;
            static DPType: bind.DProperty<MessageType, Message>;
            Type: MessageType;
            static DPAction: bind.DProperty<string, Message>;
            Action: string;
            static DPCancelText: bind.DProperty<string, Message>;
            static DPAbortText: bind.DProperty<string, Message>;
            AbortText: string;
            CancelText: string;
            privateDecompress: boolean;
            static __fields__(): (bind.DProperty<string, Message> | bind.DProperty<MessageType, Message>)[];
            constructor(id: number, message?: string);
            static getById(id: number, type: Function): Message;
            getStore(): collection.Dictionary<number, any>;
            private static pstore;
        }
    }
}
declare module "sys/Corelib" {
    import { UI } from "sys/UI";
    import { models } from "sys/QModel";
    import { Parser } from "sys/Syntaxer";
    export type GFunction = Function | reflection.GenericType | reflection.DelayedType;
    export namespace Common {
        var Message: models.Message;
        var Math: any;
        class RichMenu {
        }
    }
    export namespace TemplateTypes {
        function RichMenu(): void;
    }
    export namespace css {
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
    export namespace math {
        function round1(_n: any, x: any): string;
        function round(_n: any, x: any): string;
    }
    export namespace string {
        function IsPrintable(keyCode: number, charCode: number): boolean;
    }
    export namespace helper {
        function TryCatch<T>(owner: any, Try: (...args: any[]) => T, Catch?: (e: Error, ...args: any[]) => T, params?: any[]): T;
    }
    export namespace basic {
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
    export namespace query {
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
    export function $$(dom: Node | Node[]): query.__ | query._;
    export namespace reflection {
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
    export namespace attributes {
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
    export namespace bind {
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
    export namespace thread {
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
    export namespace bind {
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
    export namespace utils {
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
    export namespace collection {
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
    export namespace mvc {
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
    export namespace bind {
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
            constructor(rslt: Parser.parsers.FunctionResult, _parent: bind.Scop, controller?: Controller, mode?: bind.BindingMode);
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
    export namespace Processor {
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
    export namespace ScopicControl {
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
    export namespace ScopicCommand {
        function Register<T>(callback: basic.ITBindable<(n: string, dom: HTMLElement, scop: bind.Scop, param: T) => void>, param?: T, name?: string): string;
        function Call(n: string, dom: Node, scop: bind.Scop): any;
        function Delete(n: string): void;
        function contains(n: string): boolean;
    }
    export namespace Api {
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
    export namespace encoding {
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
    export class xNode<T> {
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
    export namespace UIDispatcher {
        function OnIdle(f: () => void): void;
    }
    export namespace net {
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
    export namespace net {
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
    export namespace basic {
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
    export namespace crypto {
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
    export namespace crypto {
        class SecureRandom {
            nextBytes(a: any): void;
            rng_get_byte(): any;
        }
    }
    export module crypto1 {
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
    export module crypto1 {
        class SecureRandom {
            nextBytes(a: any): void;
            rng_get_byte(): any;
        }
    }
    export interface BuckupList<T> {
        values: any[];
        OnUndo?: (self: T, bl: BuckupList<T>) => void;
    }
    export namespace Ids {
        class t1 {
        }
        class t2 {
        }
        class t3 {
        }
    }
    export namespace injecter {
        function observe(obj: any, prop: string, callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): bind.PropBinding;
        function observePath(obj: any, props: string[], callback: (s: bind.PropBinding, e: bind.EventArgs<any, any>) => void, owner?: any): void;
        function unobserve(obj: any, prop: string, stat: bind.PropBinding | ((s: bind.PropBinding, e: bind.EventArgs<any, any>) => void), owner?: any): boolean | bind.PropBinding[];
    }
    export namespace Notification {
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
    export namespace Attributes {
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
    export namespace PaintThread {
        interface task2 {
            owner: any;
            method: Function;
            args: any[];
        }
        function Push(ins: bind.JobInstance, e: bind.EventArgs<any, any>, scop?: bind.Scop): void;
        function OnPaint(task: task2): void;
    }
}
declare module "sys/defs" {
    import { bind } from "sys/Corelib";
    import { UI } from "sys/UI";
    export module defs {
        namespace $UI {
            interface IPage extends UI.JControl, UI.IService {
                Name: string;
                HasSearch: UI.SearchActionMode;
                OnSearche(o?: string, n?: string): any;
                OnDeepSearche(): any;
                OnContextMenu(e: MouseEvent): any;
                OnPrint(): any;
                OnSelected: bind.EventListener<(p: this) => void>;
                Update(): any;
                OnKeyDown(e: KeyboardEvent): any;
                ContextMenu?: UI.ContextMenu;
            }
            interface IApp extends UI.JControl {
                Name: string;
                SearchBox: UI.ActionText;
                Foot: UI.ServiceNavBar<UI.IItem>;
                Update(): any;
                OnContextMenu(e: MouseEvent): any;
                OnKeyDown(e: KeyboardEvent): any | void;
                OnPrint(): any;
                OnDeepSearche(): any;
                OpenPage(pageNme: string): any;
                Logout(): any;
                Open(page: IPage): any;
                AddPage(child: IPage): any;
                Show(): any;
                SelectedPage: IPage;
                SelectNaxtPage(): any;
                SelectPrevPage(): any;
                CloseModal(m: UI.Modal): any;
                OpenModal(m: UI.Modal): any;
                CurrentModal: UI.Modal;
                IsAuthentication: boolean;
                OpenContextMenu<T>(cm: UI.IContextMenu<T>, e: UI.IContextMenuEventArgs<T>): boolean;
                CloseContextMenu<T>(r?: T): any;
            }
            interface IAuthApp extends IApp {
                IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
                RedirectApp: IApp;
                OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
            }
        }
    }
}
declare module "sys/Consts" {
    export namespace Consts {
        var IDENT: string;
        var NUMBER: string;
        var SQUOTE_STRING: string;
        var DQUOTE_STRING: string;
        var STRING: string;
        var ARGUMENT: string;
        var ARGUMENTS: string;
        var ARGUMENT_LIST: string;
        var BINDING: string;
        var OPEN_BRACKET: string;
        var CLOSE_BRACKET: string;
        var NEGATE: string;
        var EXPRESSION: string;
        var IS_TOUCH_ONLY: RegExpMatchArray;
        var css: {
            comments: RegExp;
            port: RegExp;
            customProp: RegExp;
            mixinProp: RegExp;
            mixinApply: RegExp;
            varApply: RegExp;
            keyframesRule: RegExp;
            multipleSpaces: RegExp;
        };
        enum ModuleStat {
            New = 0,
            Downloading = 1,
            Downloaded = 2,
            Defining = 3,
            Defined = 4,
            Executing = 5,
            Executed = 6,
            Failed = 7
        }
    }
}
declare module "sys/db" {
    import { basic, bind, collection } from "sys/Corelib";
    import { sdata } from "sys/System";
    export module db {
        type callback<T> = (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<T>) => void;
        interface IExecCmd {
            cmd: string;
            callback: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void;
        }
        interface IDatabase {
            transaction(callback: (db: any) => void, onerror: (db: any, b: any) => void): any;
        }
        interface Command {
            async: boolean;
            result?: any;
            executed?: boolean;
        }
        interface ScalCommand extends Command {
            cmd: string;
            callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
        }
        interface VectorCommand extends Command {
            cmd: string[];
            callback?: (index: number, iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
        }
        class Database {
            databaseName: string;
            databaseDesc: string;
            sqlLiteDBVersion: string;
            FIVE_MB: number;
            tableName: string;
            database: IDatabase;
            private _tables__;
            shemas: DatabaseTable<_Table__>;
            initialize(): this;
            IsLoaded: boolean;
            OnLoad: bind.FEventListener<(sb: this) => void>;
            private isExecuting;
            private queue;
            Push(cmd: ScalCommand | VectorCommand): void;
            execute(async: boolean, command: string, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
            _exeScalSQL(db: any, cmd: ScalCommand): void;
            _exeVectorSQL(db: any, cmd: VectorCommand): void;
            executes(async: boolean, commands: string[], callback?: (index: number, iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
            syncExecute(command: any, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: any) => void): void;
            private _commands;
            private _current;
            private _IsExecuting;
            private _Push;
            private _job;
            private _runCmd;
            private _transaction;
            private _OnSuccess;
            private _OnError;
            private _next;
            CreateTable(name: string, rowType: Function): this;
            Get(tableName: string): IDBTableInfo;
            private _store;
            MakeUpdate(tableName: string, date: Date | number): void;
            __info__: DatabaseTable<__ExeInfo__>;
        }
        class SQLInstructureBuilder {
            tableName: any;
            type: Function;
            private _key;
            private _map;
            cretaeCmd: basic.StringCompile;
            insertCmd: basic.StringCompile;
            updateCmd: basic.StringCompile;
            selectCmd: basic.StringCompile;
            deleteCmd: basic.StringCompile;
            readonly Key: bind.DProperty<any, bind.DObject>;
            constructor(tableName: any, type: Function);
            init(): void;
            private getSB;
            getCreateCmd(): basic.StringCompile;
            getInsertCmd(): basic.StringCompile;
            getUpdateCmd(): basic.StringCompile;
            getSelectCmd(): basic.StringCompile;
            getDeleteCmd(): basic.StringCompile;
            private getTypeName;
            private getDbValue;
            getNumber(v: any): string;
            static emptyDate: Date;
            private static parseBool;
            private getJsValue;
            getAvaibleCmd(extCols: string | string[]): string;
            jointCols(cols: string[]): string;
        }
        class DatabaseTable<T extends sdata.DataRow> {
            database: Database;
            builder: SQLInstructureBuilder;
            constructor(database: Database, tableName: string, type: Function);
            Insert(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Delete(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Update(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Select(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            Create(callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
            ExecuteOperation(cm: IOperation, callback?: db.callback<T>): void;
            getAvaible(exCols?: string | string[], callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void): void;
            ExecuteOperations(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
            static __count: number;
            ExecuteOperations1(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
            UpdateTableToDB(tbl: sdata.DataTable<T> | T[], callback: (succ: boolean, nfail: number) => void, full?: boolean): void;
            LoadTableFromDB(tbl: sdata.DataTable<T>, callback?: (succ: boolean) => void): void;
            getCmd(op: IOperation): string;
            MakeUpdate(date: Date | number): void;
            IsExist(callback: (isExist: boolean) => void): void;
            CreateIfNotExist(callback?: (isExist: boolean, sender: this) => void): void;
            Created: boolean;
        }
        class _Table__ extends sdata.QShopRow {
            table: DatabaseTable<any>;
            private static store;
            protected getStore(): collection.Dictionary<number, this>;
            static DPTableName: bind.DProperty<string, _Table__>;
            TableName: string;
            static DPType: bind.DProperty<string, _Table__>;
            Type: string;
            static DPLastUpdate: bind.DProperty<number, _Table__>;
            LastUpdate: number;
            static __fields__(): (bind.DProperty<string, _Table__> | bind.DProperty<number, _Table__>)[];
            onPropertyChanged(ev: bind.EventArgs<any, any>): void;
            constructor(table: DatabaseTable<any>);
        }
        class _Tables__ extends sdata.DataTable<_Table__> {
            database: Database;
            constructor(database: Database);
            gettableByName(name: string, type?: Function): _Table__;
        }
        class __ExeInfo__ extends sdata.DataRow {
            static DPCount: bind.DProperty<number, __ExeInfo__>;
            Count: number;
            static __fields__(): bind.DProperty<number, __ExeInfo__>[];
            protected getStore(): collection.Dictionary<number, this>;
            Update(): void;
            Upload(): void;
        }
        interface IDBTableInfo {
            table: db.DatabaseTable<any>;
            info: _Table__;
            _dbInfo_: db.DatabaseTable<_Table__>;
        }
        interface IOperation {
            op: Operation;
            row: sdata.DataRow;
        }
        enum Operation {
            None = 0,
            Update = 1,
            Insert = 2,
            Delete = 3,
            UpdateOnly = 4,
            InsertOnly = 5
        }
        interface SQLResultSet<T> {
            rows: T[];
            rowsAffected: number;
            insertId: number;
        }
    }
}
declare module "sys/Decorators" {
    import { Api } from "sys/Corelib";
    export function AsAPI(apiName: string, __prototype__?: (trigger: Api.IApiTrigger, callback: Api.IApiCallback, params: Api.IApiParam) => void): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
}
declare module "sys/Dom" {
    export module Dom {
        function offset(f: Element): ClientRect | {
            top: number;
            left: number;
        };
        function elementInViewport(el: HTMLElement): boolean;
        function elementEntirelyInViewport(el: HTMLElement): boolean;
    }
}
declare module "sys/Encoding" {
    export namespace __encoddings__ {
        function init(): void;
        class Color {
            _rgba: any;
            _originalText: any;
            _originalTextIsValid: any;
            _format: any;
            constructor(rgba: any, format: any, originalText: any);
            Format: {
                Original: string;
                Nickname: string;
                HEX: string;
                ShortHEX: string;
                RGB: string;
                RGBA: string;
                HSL: string;
                HSLA: string;
            };
            parse(text: any): any;
            fromRGBA(rgba: any): any;
            fromHSVA(hsva: any): any;
            prototype: {
                format: () => any;
                hsla: () => any;
                canonicalHSLA: () => any[];
                hsva: () => any[];
                hasAlpha: () => boolean;
                canBeShortHex: () => boolean;
                asString: (format: any) => any;
                rgba: () => any;
                canonicalRGBA: () => any[];
                nickname: () => any;
                toProtocolRGBA: () => {
                    r: any;
                    g: any;
                    b: any;
                    a: any;
                };
                invert: () => any;
                setAlpha: (alpha: any) => any;
            };
            _parseRgbNumeric(value: any): number;
            _parseHueNumeric(value: any): number;
            _parseSatLightNumeric(value: any): number;
            _parseAlphaNumeric(value: any): number;
            _hsva2hsla(hsva: any, out_hsla: any): void;
            hsl2rgb(hsl: any, out_rgb: any): void;
            hsva2rgba(hsva: any, out_rgba: any): void;
            _tmpHSLA: number[];
            luminance(rgba: any): number;
            blendColors(fgRGBA: any, bgRGBA: any, out_blended: any): void;
            calculateContrastRatio(fgRGBA: any, bgRGBA: any): number;
            _blendedFg: number[];
            desiredLuminance(luminance: any, contrast: any, lighter: any): number;
        }
        namespace Base64 {
            function byteLength(b64: any): number;
            function toByteArray(b64: any): any[] | Uint8Array;
            function fromByteArray(uint8: any): string;
        }
        namespace IEEE754 {
            function read(buffer: any, offset: any, isLE: any, mLen: any, nBytes: any): number;
            function write(buffer: any, value: any, offset: any, isLE: any, mLen: any, nBytes: any): void;
        }
        namespace RGBA {
            class Color {
                toHex(t: any, e: any): string;
                hexToDec(t: any): number;
                toRgb(t: any): any[];
                hsvToRgb(t: any, e: any, i: any): any[];
                rgbToHsv(t: any, e: any, i: any): any[];
            }
        }
    }
}
declare module "sys/Jobs" {
    import { basic, bind } from "sys/Corelib";
    export function parseTarget(dom: Element): {
        depth: number;
        href: string;
    };
    export function getTarget(dom: Element, depth: number, id: any): Element;
    export function getTargetFrom(dom: Element): Element;
    export module Jobs {
        function InputChecks(name: string, check: (value: string) => boolean): void;
        function Load(): void;
        class interpolation implements basic.IJob {
            Name: string;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
        class CheckBox implements basic.IJob {
            Name: string;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            Handle(ji: bind.JobInstance, e: Event): void;
        }
        class FloatJob implements basic.IJob {
            private checks;
            Name: string;
            reg: (str: any) => boolean;
            Todo(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            handleEvent(ji: bind.JobInstance, e: Event): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
        class AccordionSelectJob implements basic.IJob {
            private checks;
            Name: string;
            Todo(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnError(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            OnInitialize(ji: bind.JobInstance, e: bind.EventArgs<any, any>): void;
            callback(e: Event): void;
            OnScopDisposing(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
        }
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var textboxJob: basic.IJob;
        var LabelJob: basic.IJob;
        var ratingJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var LabelJob: basic.IJob;
        var TextJob: basic.IJob;
        var TextJob: basic.IJob;
        var TextJob: basic.IJob;
        var CheckJob: basic.IJob;
    }
}
declare module "sys/Thread" {
    export namespace Workers {
        interface IWorker {
            addEventListener(k: 'error', handler: (e: ErrorEvent) => any, options?: boolean | AddEventListenerOptions): any;
            addEventListener(k: 'message', handler: (e: MessageEvent) => any, options?: boolean | AddEventListenerOptions): any;
            postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
        }
        namespace WebWorker {
            interface IMessageAction<T> {
                Id: number;
                Handler: string;
                Data: T;
            }
            interface IMessageResult<T> {
                Id: number;
                IsError?: boolean;
                Data?: T;
                keepAlive: boolean;
            }
            interface MessageEventArgs<T> {
                e: MessageEvent;
                Msg: IMessageAction<T>;
                Handled: boolean;
                Result: any;
                Error?: boolean;
                Thread: Server;
                keepAlive?: boolean;
            }
            interface ThreadPacket {
                handler: string;
                data: any;
                callback(owner: ThreadPacket, data: IMessageResult<any>): void;
                Id: number;
            }
            function registerHandler<T>(name: string, handler: (e: MessageEventArgs<T>) => any): boolean;
            function getHandler(name: string): false | ((e: MessageEventArgs<any>) => any);
            function unregisterHandler(name: string): boolean;
            class Server {
                private _worker;
                constructor();
                Start(): void;
                private _onerror;
                private _onmessage;
                private _onHandlerError;
                postMessage<T>(data: IMessageResult<T>, targetOrigin?: string, transfers?: any[], ports?: MessagePort[]): void;
                private onPostMessageError;
                static Default: Server;
                static Start(): void;
            }
            class Client {
                private _url;
                private _worker;
                private _quee;
                private static counter;
                constructor(_url: string);
                Start(): void;
                Send(packet: ThreadPacket): void;
                private _onmessage;
                private _onerror;
            }
        }
        class ServiceWorker {
            static Start(url: string, scope: string): Promise<void>;
            static postMessageToSW<T>(data: Workers.WebWorker.IMessageAction<T>): Promise<{
                Action: Workers.WebWorker.IMessageAction<T>;
                Result: Workers.WebWorker.IMessageResult<T>;
            }>;
        }
    }
}
declare module "sys/Facebook" {
    export module Social.Facebook {
        enum Scops {
            email = 0,
            public_profile = 1,
            read_custom_friendlists = 2,
            user_about_me = 3,
            user_birthday = 4,
            user_education_history = 5,
            user_friends = 6,
            user_hometown = 7,
            user_location = 8,
            user_relationship_details = 9,
            user_relationships = 10,
            user_religion_politics = 11,
            user_work_history = 12,
            publish_actions = 13,
            invitable_friends = 14,
            manage_pages = 15,
            read_page_mailboxes = 16
        }
        class Facebook {
            private AppID;
            private scops;
            status: "connected" | "not_authorized" | "unknown";
            accessToken: string;
            expiresIn: number;
            grantedScopes: string;
            signedRequest: string;
            userID: string;
            readonly IsConnected: boolean;
            private _parseResponse;
            AsyncIsConnected(callback?: (sender: this, v: boolean) => void): void;
            AllScops(): void;
            Connect(callback?: (sender: this) => void): void;
            fbAsyncInit(): void;
            constructor(AppID?: string, debug?: boolean);
            init(): void;
            Login(callback: (r: any) => void): void;
            getFriendsList(callback: (sender: this, r: IFriendLists) => void): void;
            readonly Scops: string[];
            private _processedArrays;
            RegisterScop(args: Scops | Scops[] | string | string[]): void;
            someApi(): void;
            static Default(appId?: string, debug?: boolean): Facebook;
        }
        interface IFriendLists {
            data: {
                id: string;
            }[];
            paging: {
                next: string;
            };
        }
        interface LocationFields {
            city: string;
            city_id: number;
            country: string;
            country_code: number;
            latitude: number;
            located_in: string;
            longitude: number;
            name: string;
            region: string;
            region_id: number;
            state: string;
            street: string;
            zip: string;
        }
        interface list<T> {
        }
        interface PageAdminNote {
        }
        interface AgeRange {
        }
        interface Interface {
        }
        interface UserContext {
        }
        interface CoverPhoto {
        }
        interface Currency {
        }
        interface UserDevice {
        }
        interface EducationExperience {
        }
        interface Experience {
        }
        interface Page {
        }
        interface PageLabel {
        }
        interface Enum {
        }
        interface MessengerPlatformReferral {
        }
        interface PaymentPricepoints {
        }
        interface SecuritySettings {
        }
        interface User {
        }
        interface VideoUploadLimits {
        }
        interface WorkExperience {
        }
        interface Fields {
            about: string;
            id: number | string;
            address: Location;
            admin_notes: list<PageAdminNote>;
            age_range: AgeRange;
            birthday: string;
            can_review_measurement_request: boolean;
            context: UserContext;
            cover: CoverPhoto;
            currency: Currency;
            devices: list<UserDevice>;
            education: list<EducationExperience>;
            email: string;
            employee_number: string;
            favorite_athletes: list<Experience>;
            favorite_teams: list<Experience>;
            first_name: string;
            gender: string;
            hometown: Page;
            inspirational_people: list<Experience>;
            install_type: Enum;
            installed: boolean;
            interested_in: list<string>;
            is_payment_enabled: boolean;
            is_shared_login: boolean;
            is_verified: boolean;
            labels: list<PageLabel>;
            languages: list<Experience>;
            last_ad_referral: MessengerPlatformReferral;
            last_name: string;
            link: string;
            local_news_megaphone_dismiss_status: boolean;
            local_news_subscription_status: boolean;
            locale: string;
            location: Page;
            meeting_for: list<string>;
            middle_name: string;
            name: string;
            name_format: string;
            payment_pricepoints: PaymentPricepoints;
            political: string;
            profile_pic: string;
            public_key: string;
            quotes: string;
            relationship_status: string;
            religion: string;
            security_settings: SecuritySettings;
            shared_login_upgrade_required_by: Date;
            short_name: string;
            significant_other: User;
            sports: list<Experience>;
            test_group: number;
            third_party_id: string;
            timezone: number;
            token_for_business: string;
            updated_time: Date;
            verified: boolean;
            video_upload_limits: VideoUploadLimits;
            viewer_can_send_gift: boolean;
            website: string;
            work: list<WorkExperience>;
        }
        var Fields_Names: string[];
        enum EFields {
            about = "about",
            id = "id",
            address = "address",
            admin_notes = "admin_notes",
            age_range = "age_range",
            birthday = "birthday",
            can_review_measurement_request = "can_review_measurement_request",
            context = "context",
            cover = "cover",
            currency = "currency",
            devices = "devices",
            education = "education",
            email = "email",
            employee_number = "employee_number",
            favorite_athletes = "favorite_athletes",
            favorite_teams = "favorite_teams",
            first_name = "first_name",
            gender = "gender",
            hometown = "hometown",
            inspirational_people = "inspirational_people",
            install_type = "install_type",
            installed = "installed",
            interested_in = "interested_in",
            is_payment_enabled = "is_payment_enabled",
            is_shared_login = "is_shared_login",
            is_verified = "is_verified",
            labels = "labels",
            languages = "languages",
            last_ad_referral = "last_ad_referral",
            last_name = "last_name",
            link = "link",
            local_news_megaphone_dismiss_status = "local_news_megaphone_dismiss_status",
            local_news_subscription_status = "local_news_subscription_status",
            locale = "locale",
            location = "location",
            meeting_for = "meeting_for",
            middle_name = "middle_name",
            name = "name",
            name_format = "name_format",
            payment_pricepoints = "payment_pricepoints",
            political = "political",
            profile_pic = "profile_pic",
            public_key = "public_key",
            quotes = "quotes",
            relationship_status = "relationship_status",
            religion = "religion",
            security_settings = "security_settings",
            shared_login_upgrade_required_by = "shared_login_upgrade_required_by",
            short_name = "short_name",
            significant_other = "significant_other",
            sports = "sports",
            test_group = "test_group",
            third_party_id = "third_party_id",
            timezone = "timezone",
            token_for_business = "token_for_business",
            updated_time = "updated_time",
            verified = "verified",
            video_upload_limits = "video_upload_limits",
            viewer_can_send_gift = "viewer_can_send_gift",
            website = "website",
            work = "work"
        }
        interface Edges {
            accounts: any;
            achievements: any;
            ad_studies: any;
            adaccounts: any;
            adcontracts: any;
            adnetworkanalytics: any;
            albums: any;
            apprequestformerrecipients: any;
            apprequests: any;
            asset3ds: any;
            assigned_ad_accounts: any;
            assigned_monetization_properties: any;
            assigned_pages: any;
            assigned_product_catalogs: any;
            books: any;
            business_activities: any;
            business_users: any;
            businesses: any;
            conversations: any;
            curated_collections: any;
            custom_labels: any;
            domains: any;
            events: any;
            family: any;
            favorite_requests: any;
            friendlists: any;
            friends: any;
            games: any;
            groups: any;
            ids_for_apps: any;
            ids_for_business: any;
            ids_for_pages: any;
            invitable_friends: any;
            leadgen_forms: any;
            likes: any;
            live_encoders: any;
            live_videos: any;
            movies: any;
            music: any;
            objects: any;
            permissions: any;
            personal_ad_accounts: any;
            photos: any;
            picture: any;
            promotable_domains: any;
            promotable_events: any;
            request_history: any;
            rich_media_documents: any;
            session_keys: any;
            stream_filters: any;
            taggable_friends: any;
            tagged_places: any;
            television: any;
            threads: any;
            video_broadcasts: any;
            videos: any;
            checkins: any;
            feed: any;
            friendrequests: any;
            home: any;
            inbox: any;
            locations: any;
            mutualfriends: any;
            notifications: any;
            outbox: any;
            questions: any;
            scores: any;
            subscribers: any;
            subscribedto: any;
        }
        var Edges_fields: string[];
    }
}
declare module "sys/Initializer" {
    export module bom {
        function load(): void;
    }
}
declare module "sys/Services" {
    import { Controller } from "sys/System";
    export namespace services {
        function LoadServices(_requester: Controller.ProxyData): void;
    }
}
declare module "sys/Critere" {
    import { bind, reflection, utils } from "sys/Corelib";
    import { UI } from "sys/UI";
    export namespace Critere {
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
}
declare module "sys/AI" {
    export namespace AI {
        namespace tools {
            function isFlattenable(value: any): boolean;
            function baseFlatten<T>(array: any, depth: any, predicate?: typeof isFlattenable, isStrict?: boolean, result?: Array<T>): T[];
            function flattenDeep<T>(array: any[]): T[];
            class SegmentRunner {
                Disposed: Segment[];
                Last: Segment;
                Reader: Segment;
                Writer: Segment;
                Cursor: any;
                Next(): number;
                constructor(start: number, end: number);
            }
            class Iterator {
                private runner;
                Read(): number;
                Write(): void;
            }
            class Segment {
                Start: number;
                End: number;
                Cursor: any;
                NextSegment: Segment;
                constructor(parent: Segment, Start?: number, End?: number);
            }
        }
        namespace StringSimiarity {
            interface IRating {
                target: string;
                rating: number;
            }
            interface IRatings {
                ratings: IRating[];
                bestMatch: IRating;
            }
            function compareTwoStrings(str1: string, str2: string): number;
            function findBestMatch(mainString: string, targetStrings: string[]): IRatings;
            function bestMatch(ratings: IRating[]): any;
            function Sort(rattings: IRatings): IRating[];
        }
        namespace Math {
            class GCDExtended {
                GCD: number;
                FactorA: number;
                FactorB: number;
                constructor(gcd: number, factorA: number, factorB: number);
                SetValues(gcd: number, factorA: number, factorB: number): this;
            }
            function mul_mod(a: number, b: number, m: number): number;
            function PowMod(base: number, exp: number, modulus: number): number;
            function getRandomPrime(cond: (p: any) => boolean, maxIndex?: number): number;
            function get_common_denom(e: number, PHI: number): number;
            function GCD(a1: number, b1: number): number;
            function ExGCD(a1: number, b1: number, rem?: number): {
                result: number;
                factor: number;
                rem: number;
                x: number;
            };
            function gcd_extended(p: number, q: number): GCDExtended;
            function SolveCongurentEqu(factor: number, rem: number, modulus: number): number[];
        }
        namespace Encryption {
            interface ITransform {
                transform(byte: number): number;
                isValideByte(byte: number): boolean;
            }
            interface RSAKey {
                n: number;
                e: number;
            }
            interface RSACrypter {
                Encrypter: RSA;
                Decripter: RSA;
            }
            class RSA implements ITransform {
                private key;
                constructor(key: RSAKey);
                transform(byte: number): number;
                isValideByte(byte: number): boolean;
            }
            class FastRSA implements ITransform {
                private key;
                private array;
                constructor(key: RSAKey);
                transform(byte: number): any;
                isValideByte(byte: number): boolean;
            }
            function GenerateRSAKey(sourceMaxByte: number, transformedMaxByte: number): RSACrypter;
            function test(f: Function, iter: number, args: any[]): number;
        }
    }
}
declare module "sys/resources" {
    export module Resources {
        var result: {
            heavyTable: ITemplateExport;
            uiTemplate: ITemplateExport;
            components: ITemplateExport;
            strechyButton: ITemplateExport;
        };
        function OnInitalized(callback: (success: boolean) => void): number | void;
        function Initialize(): void;
    }
}
declare module "Core" {
    export * from 'context';
    export * from "sys/defs";
    export * from "sys/Syntaxer";
    export * from "sys/System";
    export * from "sys/Filters";
    export * from "sys/QModel";
    export * from "sys/Corelib";
    export * from "sys/Consts";
    export * from "sys/db";
    export * from "sys/Decorators";
    export * from "sys/Dom";
    export * from "sys/Encoding";
    export * from "sys/Jobs";
    export * from "sys/Thread";
    export * from "sys/Facebook";
    export * from "sys/Initializer";
    export * from "sys/Services";
    export * from "sys/Critere";
    export * from "sys/UI";
    export * from "sys/AI";
}
declare module "sys/Components" {
    import { UI } from "sys/UI";
    import { bind, basic, collection } from "sys/Corelib";
    export namespace Components {
        class MdTextbox<T> extends UI.JControl {
            Label: string;
            Value: T;
            private _input;
            private _label;
            private _isChanging;
            _hasValue_(): boolean;
            _OnValueChanged(e: bind.EventArgs<any, this>): void;
            OnLabelChanged(e: bind.EventArgs<string, this>): void;
            constructor(_view?: HTMLElement);
            private createElemnt;
            initialize(): void;
            handleEvent(e: Event): void;
            private onInputChanged;
            Type: string;
            private _auto;
            InputBox: UI.Input;
            readonly AutoCompleteBox: UI.ProxyAutoCompleteBox<T>;
            Suggestions: collection.List<T>;
            OnSuggesionsChanged(e: bind.EventArgs<collection.List<T>, this>): void;
        }
        interface MenuItem {
            type: string;
            nonSelectable: boolean;
        }
        interface MdMenuItem extends MenuItem {
            type: 'menu-item';
            iconName: string;
            label: string;
            commandName: string;
            control?: UI.JControl;
        }
        interface Separator extends MenuItem {
            type: 'separator';
            nonSelectable: false;
        }
        interface Label extends MenuItem {
            type: 'label';
            value: string;
            nonSelectable: false;
        }
        interface MdIconGroupItem {
            iconName: string;
            commandName: string;
        }
        interface IconGroup extends MenuItem {
            type: 'icongroup';
            value: MdIconGroupItem[];
        }
        class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow {
            private _data;
            setDataContext(data: IconGroup): void;
            getDataContext(): IconGroup;
            constructor();
            initialize(): void;
        }
        class ContextMenuTemplate extends UI.Template {
            private static _labelTemplate;
            private static _menuItemTemplate;
            private static store;
            private garbage;
            private static readonly EmptyArray;
            static ctor(): void;
            CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): UI.TemplateShadow;
            CacheTemplateShadow(item: MenuItem, child: UI.TemplateShadow): void;
            constructor();
        }
        class MdContextMenu extends UI.ListAdapter<MenuItem, any> implements UI.IContextMenu<MenuItem> {
            OnClosed(result: MenuItem, e: UI.IContextMenuEventArgs<MenuItem>): boolean;
            getView(): UI.JControl;
            ItemsSource: collection.List<MdMenuItem | Separator | Label>;
            static ctor(): void;
            constructor(items?: MenuItem[]);
            protected getItemShadow(item: MenuItem, i: number): any;
            private OnIconGroupItemCliced;
            protected disposeItemShadow(item: MenuItem, child: UI.TemplateShadow, i: number): UI.TemplateShadow;
            protected disposeItemsShadow(items: MenuItem[], childs: UI.TemplateShadow[]): void;
            initialize(): void;
            getTarget(): UI.JControl;
            private _revalidate;
            OnAttached(e: UI.IContextMenuEventArgs<MenuItem>): void;
            OnItemClicked(s: UI.TemplateShadow, e: Event, t: UI.ListAdapter<MenuItem, MenuItem>): void;
        }
    }
    export namespace Components {
        function getTemplates(): {
            heavyTable: ITemplateExport;
            uiTemplate: ITemplateExport;
            components: ITemplateExport;
            strechyButton: ITemplateExport;
        };
        interface OrderMap {
            factorHandled?: boolean;
            factor: number;
            lastStat: any;
        }
        interface OrderByEventArgs<This> {
            sender: This;
            orderBy: string;
            col: UI.help.IColumnCellHeaderDef;
            view: HTMLTableHeaderCellElement;
            state: OrderMap;
            previous?: OrderByEventArgs<This>;
        }
        class HeavyTable<T> extends UI.ListAdapter<T, any> {
            private cols;
            Rebound: boolean;
            visibleCols: number[];
            private Controller;
            constructor(cols: UI.help.IColumnTableDef[]);
            initialize(): void;
            protected OnCompileEnd(cnt: bind.Controller): void;
            setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
            OnOrderBy(sender: this, orderBy: string, col: UI.help.IColumnCellHeaderDef, view: HTMLTableHeaderCellElement): void;
            currentOrderMap: OrderByEventArgs<this>;
            private _orderHandler;
            private orderMap;
            setOrderHandler<Owner>(handler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>): void;
            private endEdit;
            private beginEdit;
            edit(currentElement: HTMLTableDataCellElement): boolean;
            readonly EOF: boolean;
            OnKeyDown(e: KeyboardEvent): boolean;
            _x: number;
            _y: number;
            oldInnerText: any;
            private x;
            private ColCount;
            private y;
            private stat;
            private _selectedCell;
            setXY(x: number, y: number): boolean;
            private isfocussed;
            private getStat;
            getCurrentCell(): HTMLTableDataCellElement;
            selectCell(): HTMLTableDataCellElement;
            deselectCell(): void;
            private editCell;
            static ctor(): void;
        }
    }
    export namespace Components {
        class ActionButton<T> extends UI.JControl {
            static __fields__(): bind.DProperty<any, ActionButton<any>>[];
            static DPSource: bind.DProperty<collection.List<any>, ActionButton<any>>;
            static DPValue: bind.DProperty<any, ActionButton<any>>;
            Value: T;
            Source: collection.List<T>;
            Caption: UI.Label;
            Box: UI.Input;
            AutocompleteBox: UI.ProxyAutoCompleteBox<T>;
            constructor();
            initialize(): void;
            OnSourceChanged(e: bind.EventArgs<collection.List<T>, this>): void;
            OnValueChanged(box: UI.IAutoCompleteBox, oldValue: T, newValue: T): void;
        }
    }
    export namespace Components {
        class StrechyButton extends UI.TControl<StrechyButton> {
            private _Title;
            private _Items;
            private _Trigger;
            constructor();
            setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
            initialize(): void;
            OnCompileEnd(): void;
            handleEvent(event: Event): void;
            static ctor(): void;
        }
    }
}
