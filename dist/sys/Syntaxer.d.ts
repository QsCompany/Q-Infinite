import { bind } from "./Corelib";
export declare namespace Parser {
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
export declare namespace Parser {
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
export declare namespace Parser {
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
