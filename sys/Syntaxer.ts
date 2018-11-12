import { bind } from "./Corelib";

declare var ui_tmplates;
declare var comp_templates;
declare var value;
declare var plg_template;
declare var plg_json;
export namespace Parser {

    interface IJSTokenResult {
        token: JSToken;
        value: any;
    }
    export enum JSToken {
        None = 0,
        EndOfFile,

        // main statement switch
        Semicolon,                      // ;
        RightCurly,                     // }
        LeftCurly,                      // {
        Debugger,
        Var,
        If,
        For,
        Do,
        While,
        Continue,
        Break,
        Return,
        With,
        Switch,
        Throw,
        Try,
        Function,
        Else,
        ConditionalCommentStart,        // /*@ or //@
        ConditionalCommentEnd,          // @*/ or EOL
        ConditionalCompilationOn,       // @cc_on
        ConditionalCompilationSet,      // @set
        ConditionalCompilationIf,       // @if
        ConditionalCompilationElseIf,   // @elif
        ConditionalCompilationElse,     // @else
        ConditionalCompilationEnd,      // @end
        ConditionalCompilationVariable,           // entity defined defined during preprocessing

        // used by both statement and expression switches

        // main expression switch
        Identifier,
        Null,
        True,
        False,
        This,
        StringLiteral,
        IntegerLiteral,
        NumericLiteral,
        TemplateLiteral,                // (may be complete, head, middle or tail)

        LeftParenthesis,                // (
        LeftBracket,                    // [
        AccessField,                    // .
        ArrowFunction,                  // =>
        RestSpread,                     // ...

        // operators
        FirstOperator,
        // unary ops
        Delete = FirstOperator,
        Increment,                      // ++
        Decrement,                      // --
        Void,
        TypeOf,
        LogicalNot,                     // !
        BitwiseNot,                     // ~

        FirstBinaryOperator,
        // binary ops
        Plus = FirstBinaryOperator,     // +
        Minus,                          // -
        Multiply,                       // *
        Divide,                         // /
        Modulo,                         // %
        BitwiseAnd,                     // &
        BitwiseOr,                      // |
        BitwiseXor,                     // ^
        LeftShift,                      // <<
        RightShift,                     // >>
        UnsignedRightShift,             // >>>

        Equal,                          // ==
        NotEqual,                       // !=
        StrictEqual,                    // ===
        StrictNotEqual,                 // !==
        LessThan,                       // <
        LessThanEqual,                  // <=
        GreaterThan,                    // >
        GreaterThanEqual,               // >=

        LogicalAnd,                     // &&
        LogicalOr,                      // ||

        InstanceOf,
        In,
        Comma,                          // ,

        Assign,                         // =
        PlusAssign,                     // +=
        MinusAssign,                    // -=
        MultiplyAssign,                 // *=
        DivideAssign,                   // /=
        ModuloAssign,                   // %=
        BitwiseAndAssign,               // &=
        BitwiseOrAssign,                // |=
        BitwiseXorAssign,               // ^=
        LeftShiftAssign,                // <<=
        RightShiftAssign,               // >>=
        UnsignedRightShiftAssign,       // >>>=
        LastAssign = UnsignedRightShiftAssign,

        ConditionalIf,                  // ? // MUST FOLLOW LastBinaryOp
        Colon,                          // :
        LastOperator = Colon,

        // context specific keywords
        Case,
        Catch,
        Default,
        Finally,
        New,
        RightParenthesis,               // )
        RightBracket,                   // ]
        SingleLineComment,              // for authoring
        MultipleLineComment,            // for authoring
        UnterminatedComment,            // for authoring
        PreprocessorDirective,

        // reserved words
        Enum,
        Extends,
        Super,
        Class,
        Const,
        Export,
        Import,

        // ECMAScript 6
        Module,

        // ECMA strict reserved words
        Let,
        Implements,
        Interface,
        Package,
        Private,
        Protected,
        Public,
        Static,
        Yield,

        // browser-specific don't uses
        Native, // Chrome

        // always okay for identifiers
        Get,
        Set,

        AspNetBlock,
        ReplacementToken,               // %name(.name)*%

        EndOfLine, // only returned if the RawTokens flag is set on the scanner, but also used in error-recovery
        WhiteSpace, // only returned if the RawTokens flag is set on the scanner
        Error, // only returned if the RawTokens flag is set on the scanner
        RegularExpression, // only returned if the RawTokens flag is set on the scanner

        // Do not use this one
        Limit
    }
    export interface ref<T> {
        value?: T;
    }
    export enum TokenType {
        uknown = 0,
        alpha = 1,
        num = 2,
        prnt = 4,
        brkt = 8,
        dot = 16,
        prefix = 32,//"$@*~+-<>=?&^:"
        filter = 64,
        whites = 128,//' \t\r\n\n\0'
        alphanum = alpha | num,
    }

    export interface stat {
        index: number;
    }

    export interface Token {
        index: number;
        char: string;
        code: number;
        type: TokenType;
    }

    export declare type parser = (strm: syntaxer, result: ParserResult) => boolean;

    export enum CToken {
        whitespace,
        undefined,
        boolean,
        number,
        string,
        word,
        keyword,
        path,
        functionCall,
        arrayCall,

    }
    export interface ParserResult {
        start?: Token;
        end?: Token;
        success: boolean;
        resut?: any;
        msg?: string;
        tokon?: CToken | string;
        parent: ParserResult;
        children: ParserResult[]
    }


    export function ands(parsers: parser[]) {
        return (b: syntaxer, rslt: ParserResult) => {
            for (var i = 0; i < parsers.length; i++) {
                var p = parsers[i];
                if (!b.exec(p).success) return false;
            }
            return true;
        }
    }
    export function ors(parsers: parser[]) {
        return <parse>(b: syntaxer, result: ParserResult) => {
            for (var i = 0; i < parsers.length; i++)
                if (b.exec(parsers[i]).success) return true;
            return false;
        }
    }

    export function _ors(parsers: parser[]) {
        return <parse>(b: syntaxer, result: ParserResult) => {
            for (var i = 0; i < parsers.length; i++) {
                var p = parsers[i];
                var x = b.exec(p, true);
                if (x.success)
                    return clone(x, result);
            }
            return false;
        }
    }
    export enum oper {
        or,
        and,
        xor,
        eq,
        neq,
        dot
    }
    export interface Term { oper: oper, parser: parser, neq: boolean }
    export class parserBuilder {
        private _parser: parser;
        private terms: Term[] = [];
        parent: parserBuilder;
        constructor(public token: CToken | string) {

        }
        public and(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.and, parser: p, neq: neq });
            return this;
        }
        public set(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.dot, parser: p, neq: neq });
            return this;
        }
        public $open(token: CToken | string, oper: oper, neq?: boolean) {
            var t = new parserBuilder(token);
            t.parent = this;
            this.terms.push({ oper: oper, neq: neq, parser: t.Parser });
            return t;
        }
        public $close() {
            return this.parent;
        }
        public or(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.or, parser: p, neq: neq });
            return this;
        }

        public xor(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.xor, parser: p, neq: neq });
            return this;
        }
        public eq(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.eq, parser: p, neq: neq });
            return this;
        }
        public neq(p: parser, neq?: boolean) {
            this.terms.push({ oper: oper.neq, parser: p, neq: neq });
            return this;
        }
        public get Parser(): parser {
            if (this._parser) return this._parser;
            return (b, rslt: ParserResult) => {
                rslt.tokon = this.token;
                if (this.terms.length == 0) return true;
                var r = this.exect(this.terms[0], b);
                for (var i = 1; i < this.terms.length; i++) {
                    var term = this.terms[i];
                    switch (term.oper) {
                        case oper.and:
                            r = r && this.exect(term, b);
                            break;
                        case oper.or:
                            r = r || this.exect(term, b);
                            break;
                        case oper.eq:
                            r = r == this.exect(term, b);
                            break;
                        case oper.neq:
                        case oper.xor:
                            r = r != this.exect(term, b);
                            break;
                        case oper.dot:
                            r = this.exect(term, b);
                            break;
                        default: throw "";
                    }
                }
                return true;
            }
        }
        private exect(term: Term, b: syntaxer) {
            var r = b.exec(term.parser).success;
            if (term.neq) r = !r;
            return r;
        }
    }

    export class syntaxer {
        get CurrentString() {
            return this.src.substring(this.currentNode.start.index, this.index);
        }
        get ShiftIndex() { return this.index - this.currentNode.start.index; }
        static opers = [36, 38, 42, 43, 45, 58, 60, 61, 62, 63, 64, 94, 126];
        static whites = [0, 9, 10, 10, 13, 32];
        private stack: stat[] = [];
        public Tokens: Token[];
        private index = -1;
        public validate(s?: stat): true {
            if (!s) return this.stack.pop(), true;
            var i = this.stack.indexOf(s);
            if (i == -1) return;
            this.stack.splice(i, this.stack.length - i);
            return true;
        }
        public save() {
            var t: stat = { index: this.index };
            this.stack.push(t);
            return t;
        }
        public restore(s?: stat): false {
            var i = s ? this.stack.indexOf(s) : this.stack.length - 1;
            if (i == -1) return;
            this.stack.splice(i, this.stack.length - i);
            this.index = s.index;
            return false;
        }
        public get current() {
            return this.Tokens[this.index];
        }
        public get previous() {
            return this.Tokens[this.index - 1];
        }
        public next() {
            var i = this.index;
            if (this.index < this.Tokens.length) this.index++;
            else return null;
            return this.Tokens[this.index];
        }

        public back() {
            var i = this.index;
            if (this.index > 0) this.index--;
            else return null;
            return this.Tokens[this.index];
        }
        public shift(): true {
            this.index++;
            return true;
        }
        public unshift(): true {
            this.index--;
            return true;
        }
        public JumpBy(length: number) {
            this.index += length;
            this.index = this.index < -1 ? -1 : this.index > this.src.length ? this.src.length : this.index;
        }
        public JumpTo(index: number) {
            this.index = index;
        }

        private static getToken(c: string) {
            var code = c.charCodeAt(0);
            if (code > 64 && code < 91 || code === 95 || code > 96 && code < 123) return TokenType.alpha;
            if (code > 47 && code < 58) return TokenType.num;
            if (syntaxer.opers.indexOf(code) != -1) return TokenType.prefix;
            if (code == 91 || code == 93) return TokenType.brkt;
            if (code == 124) return TokenType.filter;
            if (code === 46) return TokenType.dot;
            if (syntaxer.whites.indexOf(code) != -1) return TokenType.whites;
            if (code === 40 || code === 41) return TokenType.prnt;
            return TokenType.uknown;
        }

        constructor(public src: string) {
            var tokens: Token[] = new Array<Token>(src.length);
            for (var i = 0; i < src.length; i++) {
                var c = src[i];
                tokens[i] = {
                    index: i,
                    char: c, code: c.charCodeAt(0), type: syntaxer.getToken(c)
                };
            }
            this.Tokens = tokens;
            this.currentNode = { success: null, children: [], start: tokens[0], end: tokens[tokens.length - 1], tokon: 'prg', parent: null };
            this.index = 0;

        }

        public currentNode: ParserResult;
        exec(p: parser, nonstrorable?: boolean): ParserResult {
            var s = this.save();
            var prnt = this.currentNode;
            var t: ParserResult = { success: false, start: this.current, parent: this.currentNode, children: [] };
            try {
                if (!this.current) return t;
                this.currentNode = t;
                t.success = p(this, t);
                t.end = this.previous;
                if (t.success) {
                    this.validate(s);
                    if (!nonstrorable)
                        prnt.children.push(t);
                }
                else this.restore(s);
            } catch (e) {
                this.restore(s);
            }
            this.currentNode = prnt;
            return t;
        }
        fastExec(p: (...args: any[]) => boolean, ths?: any, args?: any[]): boolean {
            var s = this.save();
            var prnt = this.currentNode;
            try {
                if (!this.current) return false;
                var t = p.apply(ths || this, args) as boolean;
                if (t)
                    return true;
                else this.restore(s);
            } catch (e) {
                this.restore(s);
            }
            return false;
        }
        getChar() {
            var c = this.Tokens[this.index];
            return c && c.char || '';
        }
        testChar(chr: string) {
            var c = this.Tokens[this.index];
            var x = c ? c.char == chr : false;
            if (x) this.index++;
            return x;
        }
        getNextChar(inc) {
            var i = this.index;
            if (inc)
                this.index++;
            var c = this.Tokens[i + 1];
            return c ? c.char : '';
        }

        get(shift: number) {
            var c = this.Tokens[this.index + shift];
            return c && c.char;
        }
        private static IsHexDigit(c) {
            return ('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f');
        }
        public static IsDigit(character) {
            return '0' <= character && character <= '9';
        }
        private ScanNumber(leadChar: string, val: ref<string>): JSToken {
            var ci = this.index - 1;
            var noMoreDot: boolean = '.' == leadChar;
            var token = noMoreDot ? JSToken.NumericLiteral : JSToken.IntegerLiteral;
            var exponent = false;
            var c: string;
            var m_literalIssues = false;

            if ('0' == leadChar) {
                // c is now the character AFTER the leading zero
                c = this.getChar();
                if (c == '0') this.shift();
                if ('x' == c || 'X' == c) {
                    if (syntaxer.IsHexDigit(this.getNextChar(false))) {
                        this.shift();
                        while (syntaxer.IsHexDigit(this.getNextChar(false)))
                            this.shift();
                    }
                    val.value = this.src.substr(ci, this.index - ci);
                    return token;
                }
                else if ('b' == c || 'B' == c) {
                    c = this.getNextChar(true);
                    if (c == '1' || c == '0') {
                        while ('0' == (c = this.getNextChar(false)) || c == '1') {
                            this.next();
                        }
                    }
                    val.value = this.src.substr(ci, this.index - ci);
                    return token;
                }
                else if ('o' == c || 'O' == c) {
                    // ES6 octal literal?
                    c = this.getNextChar(true);
                    if ('0' <= c && c <= '7') {
                        while ('0' <= (c = this.getNextChar(false)) && c <= '7')
                            this.shift();
                    }
                    val.value = this.src.substr(ci, this.index - ci);
                    return token;
                }
                else if ('0' <= c && c <= '7') {
                    // this is a zero followed by a digit between 0 and 7.
                    // This could be interpreted as an octal literal, which isn't strictly supported.
                    while ('0' <= c && c <= '7') {
                        c = this.getNextChar(true);
                    }
                    // bad octal?
                    if (syntaxer.IsDigit(c) && '7' < c) {
                        // bad octal. Skip any other digits, throw an error, mark it has having issues
                        m_literalIssues = true;
                        while ('0' <= c && c <= '9')
                            c = this.getNextChar(true);
                    }

                    // return the integer token with issues, which should cause it to be output
                    // as-is and not combined with other literals or anything.
                    val.value = this.src.substr(ci, this.index - ci);
                    return token;
                }
                else if (c != 'e' && c != 'E') {
                    this.index = ci + 1;
                    return JSToken.Error;
                }
            }

            do {
                c = this.getChar();
                if (!syntaxer.IsDigit(c)) {
                    if ('.' == c) {
                        if (noMoreDot) {
                            break;
                        }

                        noMoreDot = true;
                        token = JSToken.NumericLiteral;
                    }
                    else if ('e' == c || 'E' == c) {
                        if (exponent) {
                            break;
                        }

                        exponent = noMoreDot = true;
                        token = JSToken.NumericLiteral;
                    }
                    else if ('+' == c || '-' == c) {
                        var e = this.previous.char;
                        if ('e' != e && 'E' != e) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            } while (this.shift());

            // get the last character of the number
            c = this.previous.char;
            if ('+' == c || '-' == c) {
                // if it's a + or -, then it's not part of the number; back it up one
                this.index--;
                c = this.getChar();
            }

            if ('e' == c || 'E' == c) {
                // if it's an e, it's not part of the number; back it up one
                this.index--;
                c = this.getChar();
            }
            if (token == JSToken.NumericLiteral && c == '.') {
                token = JSToken.IntegerLiteral;
            }

            val.value = this.src.substr(ci, this.index - ci);
            return token;
        }
        ScanString(o: string) {
            var ci = this.index - 1;
            var t: Token = this.current;
            if (!t) return false;
            do {
                if (t.char == o) {
                    this.shift();
                    return this.src.substr(ci, this.index - ci);
                }
                if (t.char == '\\') this.shift();
            } while (t = this.next());
            this.index = ci + 1;
            return null;
        }
        private IsUnicode() {
            var t = this.get(0);
            if (t == '\\') {
                this.shift();
                if (this.get(0) == 'u') {
                    var c: ref<string> = {};
                    if (this.ScanNumber('0', c) == JSToken.Error) {
                        this.JumpBy(-2);
                        return false;
                    }
                    return true;
                } else {
                    this.unshift();
                    return false;
                }
            }
        }
        private ScanIdentifier() {
            var i = this.index - 1;
            var t: Token = this.current;
            while ((t = this.next()) && (this.isChar(t) || this.fastExec(this.IsUnicode)));
            return this.src.substr(i, this.index - i);
        }

        isChar(t: Token) {
            return !t.type ? false : ((t.type & TokenType.alphanum) == t.type) || (t.code == 36 || t.code == 95);
        }

        private SkipToEndOfLine() {
            var c = this.get(0);
            while (c != null && c != '\0'
                && c != '\n'
                && c != '\r'
                && c != '\x2028'
                && c != '\x2029') {
                c = this.getNextChar(true);
            }
        }
        private IsLineTerminator(c: string, increment: number) {
            switch (c) {
                case '\u000d':
                    // treat 0x0D0x0A as a single character
                    if (0x0A == (this.get(increment) || '').charCodeAt(0))
                        this.shift();
                    return true;

                case '\u000a':
                    return true;

                case '\u2028':
                    return true;

                case '\u2029':
                    return true;

                default:
                    return false;
            }
        }

        private SkipMultilineComment() {
            for (; ;) {
                var c = this.get(0);
                while ('*' == c) {
                    c = this.getNextChar(true);
                    if ('/' == c) {
                        this.shift();
                        return;
                    }
                    if ('\0' == c) {
                        break;
                    }

                    if (this.IsLineTerminator(c, 1))
                        c = this.getNextChar(true);
                }

                if ('\0' == c && !c)
                    break;
                if (this.IsLineTerminator(c, 1))
                    this.shift();
                this.shift();
            }
        }
        private static spaceSeparators = [0x0020, 0x00A0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000];
        private static spaceSeparatorsChars = "\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000";
        private static IsBlankSpace(c) {
            switch (c) {
                case '\u0009':
                case '\u000b':
                case '\u000c':
                case '\u0020':
                case '\u00a0':
                case '\ufeff': // BOM - byte order mark
                    return true;
                default:
                    return (c < 128) ? false : this.spaceSeparatorsChars.indexOf(c) !== -1;
            }
        }
        protected _getNextToken(val?: ref<any>) {
            if (!val) val = {} as any;
            else val.value = void 0;
            var ch = '';
            while (ch = this.get(0)) {
                this.shift();
                switch (ch) {
                    case '\n':
                    case '\r':
                    case '\u2028': case '\u2029':
                        continue;
                    case '\t':
                    case '\v':
                    case '\f':
                    case ' ':
                        continue;
                    case '!':
                        if (this.testChar('=')) {
                            if (this.testChar('='))
                                return JSToken.StrictNotEqual;
                            else JSToken.NotEqual;
                        }
                        return JSToken.LogicalNot;

                    case '"':
                    case '\'':
                        val.value = this.ScanString(ch);
                        return JSToken.StringLiteral;
                    case '$':
                    case '_':
                        val.value = this.ScanIdentifier();
                        return JSToken.Identifier;

                    case '%':
                        if (this.testChar('=')) {
                            return JSToken.ModuloAssign;
                        } else return JSToken.Modulo;

                    case '&':
                        var token = JSToken.BitwiseAnd;
                        if (this.testChar('&'))
                            return JSToken.LogicalAnd;
                        else if (this.testChar('='))
                            return JSToken.BitwiseAndAssign;
                        return JSToken.BitwiseAnd;
                    case '(':
                        return JSToken.LeftParenthesis;
                    case ')':
                        return JSToken.RightParenthesis;
                    case '*':
                        if (this.testChar('='))
                            return JSToken.MultiplyAssign;
                        return JSToken.Multiply;

                    case '+':
                        if (this.testChar('+'))
                            return JSToken.Increment;
                        else if (this.testChar('='))
                            return JSToken.PlusAssign;
                        return JSToken.Plus;
                    case ',':
                        return JSToken.Comma;
                    case '-':
                        if (this.testChar('-'))
                            return JSToken.Decrement;
                        else if (this.testChar('='))
                            return JSToken.MinusAssign;
                        return JSToken.Minus;
                    case '.':
                        var ch = this.getChar();
                        if (ch == '.' && this.get(1) == '.')
                            return this.JumpBy(2), JSToken.RestSpread;
                        else if (syntaxer.IsDigit(ch)) {
                            var c = {};
                            val.value = this.ScanNumber('.', c);
                        }
                        return JSToken.AccessField;
                    case '/':
                        switch (this.getChar()) {
                            case '/':
                                this.SkipToEndOfLine();
                                continue;
                            case '*':
                                this.SkipMultilineComment();
                                continue;
                            case '=':
                                this.shift();
                                return JSToken.DivideAssign;
                        }
                        return JSToken.Divide;

                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        return this.ScanNumber(ch, val);
                    case ':':
                        return JSToken.Colon;
                    case ';':
                        return JSToken.Semicolon;
                    case '<':
                        token = JSToken.LessThan;
                        if (this.testChar('<'))
                            token = JSToken.LeftShift;
                        if (this.testChar('='))
                            return token == JSToken.LessThan
                                ? JSToken.LessThanEqual
                                : JSToken.LeftShiftAssign;
                        return token;
                    case '=':
                        if (this.testChar('='))
                            if (this.testChar('='))
                                return JSToken.StrictEqual;
                            else JSToken.Equal;
                        else if (this.testChar('>'))
                            return JSToken.ArrowFunction;
                        return JSToken.Assign;
                    case '>':
                        if (this.testChar('>'))
                            token = this.testChar('>') ? JSToken.UnsignedRightShift : JSToken.RightShift;
                        else token = JSToken.GreaterThan;
                        if (this.testChar('=')) {
                            return token == JSToken.GreaterThan ? JSToken.GreaterThanEqual
                                : token == JSToken.RightShift ? JSToken.RightShiftAssign
                                    : token == JSToken.UnsignedRightShift ? JSToken.UnsignedRightShiftAssign
                                        : JSToken.Error;
                        }
                        return token;

                    case '?':
                        return JSToken.ConditionalIf;
                    case 'A':
                    case 'B':
                    case 'C':
                    case 'D':
                    case 'E':
                    case 'F':
                    case 'G':
                    case 'H':
                    case 'I':
                    case 'J':
                    case 'K':
                    case 'L':
                    case 'M':
                    case 'N':
                    case 'O':
                    case 'P':
                    case 'Q':
                    case 'R':
                    case 'S':
                    case 'T':
                    case 'U':
                    case 'V':
                    case 'W':
                    case 'X':
                    case 'Y':
                    case 'Z':
                        val.value = this.ScanIdentifier();
                        return JSToken.Identifier;
                    case '[':
                        return JSToken.LeftBracket;
                    case '\\':
                        val.value = this.ScanIdentifier();
                        if (val.value == null)
                            return JSToken.Error;
                        return JSToken.Identifier;
                    case ']':
                        return JSToken.RightBracket;

                    case '^':
                        if (this.testChar('='))
                            return JSToken.BitwiseXorAssign;
                        return JSToken.BitwiseXor;
                    case '#':
                        return JSToken.Error;

                    case '`':
                        val.value = this.ScanString(ch);
                        return JSToken.StringLiteral;

                    case 'a':
                    case 'b':
                    case 'c':
                    case 'd':
                    case 'e':
                    case 'f':
                    case 'g':
                    case 'h':
                    case 'i':
                    case 'j':
                    case 'k':
                    case 'l':
                    case 'm':
                    case 'n':
                    case 'o':
                    case 'p':
                    case 'q':
                    case 'r':
                    case 's':
                    case 't':
                    case 'u':
                    case 'v':
                    case 'w':
                    case 'x':
                    case 'y':
                    case 'z':


                        val.value = this.ScanIdentifier();
                        var e = Parser.JSKeyword.get(val.value as string);
                        if (e) {
                            val.value = e;
                            return e.token;
                        }
                        return JSToken.Identifier;
                    case '{':
                        return JSToken.LeftCurly;
                    case '|':
                        if (this.testChar('|'))
                            return JSToken.LogicalOr;
                        else if (this.testChar('='))
                            return JSToken.BitwiseOrAssign;
                        return JSToken.BitwiseOr;
                    case '}':
                        return JSToken.RightCurly;
                    case '~':
                        return JSToken.BitwiseNot;
                    default:
                        if (ch == '\0') {
                            if (this.index >= this.src.length - 1)
                                return JSToken.EndOfFile;
                            this.shift();
                            continue;
                        }    // high-surrogate
                        var lowSurrogate = this.getNextChar(false).charCodeAt(0);

                        // use the surrogate pair
                        val.value = this.ScanIdentifier();
                        if (val.value != null)
                            return JSToken.StringLiteral;

                        while (syntaxer.IsBlankSpace(ch = this.getChar())) {
                            this.shift();
                        }
                        continue;
                }
            }

        }
    }

    function clone(from: ParserResult, to: ParserResult): true {
        to.tokon = from.tokon;
        to.resut = from.resut;
        to.msg = from.msg;
        to.children = from.children;
        return true;
    }

    export namespace parsers {

        export namespace expr {

            interface ITerm {
                Prefix: '++' | '--';
                Expression: any;
                Suffix: '--' | '++';
            }

            var preffix_oprs = '-+';
            var suffix_inc = '+-';
            function suffix(s: syntaxer, rslt: ParserResult) {
                var p = s.current.char;
                if (suffix_inc.indexOf(p) != -1 && s.next() && s.current.char == p) {
                    s.next();
                    rslt.resut = p + p;
                    rslt.tokon = 'suffix_inc';
                    return true;
                }
                return false;
            }
            function preffix(s: syntaxer, rslt: ParserResult) {
                var p = s.current.char;
                rslt.tokon = 'suffix_inc';
                if (suffix_inc.indexOf(p) != -1) {
                    if (p !== '!') {
                        if (s.next() && s.current.char == p)
                            rslt.resut = p + p;
                        else return false;
                    } else rslt.resut = p;
                    return true;
                }
                return false;
            }
            export function Term(s: syntaxer, rslt: ParserResult) {
                var pre = s.exec(preffix, false);
                var exp;
                if (!exp.success) return false;
                var suff = s.exec(suffix, false);
                rslt.tokon = 'term';
                rslt.resut = {
                    pre: pre,
                    exp: exp,
                    suff: suff
                }
                return true;
            }
            export function parent(s: syntaxer, rslt: ParserResult) {
                if (s.current.char != '(') return false;
                s.exec(expression)
            }
            export function Expre() {

            }
            function BiExpression(strm: syntaxer, rslt: ParserResult) {

            }
            function expression(strm: syntaxer, rslt: ParserResult) {
                return false;
            }
            export function chain(s: parser) {

            }
        }
        function isChar(t: Token) {
            return !t.type ? false : ((t.type & TokenType.alphanum) == t.type) || (t.code == 36 || t.code == 95);
        }

        export function _keyword(strm: syntaxer, word: string, rslt: ParserResult, token?: string | CToken) {
            var t: Token = strm.current;
            rslt.tokon = token === void 0 ? 'keyword' : token;
            var i = 0;
            for (var i = 0; i < word.length && t; i++) {
                if (t.char !== word[i]) return false;
                t = strm.next();
                if (!t) return i === word.length - 1;
            }
            rslt.resut = word;
            return true;
        }
        export function whitespace(strm: syntaxer, rslt: ParserResult) {
            rslt.tokon = CToken.whitespace;
            var t: Token = strm.current;
            do {
                if (t.type != TokenType.whites) break;
            } while (t = strm.next());
            return true;
        }
        var _str = {};
        export function keyword(word: string): parser {
            if (_str[word]) return _str[word];
            return _str[word] = function (b: syntaxer, rslt: ParserResult) {
                return _keyword(b, word, rslt);
            };
        }
        export function undefined(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.undefined;
            var b;
            if (strm.exec(keyword('null'), true).success) b = null;
            else if (strm.exec(keyword('undefined'), true).success) b = void 0;
            else return false;
            rslt.resut = b;
            return true;
        }
        export function boolean(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.boolean;
            var b = null;
            if (strm.exec(keyword('true'), true).success) b = true;
            else if (strm.exec(keyword('false'), true).success) b = false;
            else return false;
            rslt.resut = b;
            return true;
        }
        export function string(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.string;
            var o = t.char;
            if (o === '\'' || o === '"')
                while (t = strm.next())
                    if (t.char == o) {
                        strm.shift();
                        rslt.resut = strm.CurrentString;
                        return true;
                    }
                    else if (t.char == '\\') strm.shift();

            return false;
        }
        export function number(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.number;
            if (!strm.exec(digit).success) return false;
            strm.exec(ands([keyword('e'), digit]), true);
            rslt.resut = parseFloat(strm.CurrentString);
            return true;
        }
        export function constant(strm: syntaxer, rslt: ParserResult) {
            var str = strm.exec(string, true);
            if (str.success
                || (str = strm.exec(number, true)).success
                || (str = strm.exec(boolean, true)).success
                || (str = strm.exec(undefined, true)).success)
                return clone(str, rslt);
            return false;
        }
        export function digit(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.number;
            var dot = 0;
            var hdig = false;
            while (t.char === '-' || t.char === '+') t = strm.next();
            while (t) {
                if (t.char === '.') {
                    if (dot) {
                        if (dot === strm.ShiftIndex + 1) {
                            strm.unshift();
                            return hdig;
                        }
                        rslt.resut = parseFloat(strm.CurrentString);
                        return true;
                    } else
                        dot = strm.ShiftIndex;
                }
                else if (t.char < '0' || t.char > '9') {
                    if (!hdig) return false;
                    rslt.resut = parseFloat(strm.CurrentString);
                    return true;
                }
                else if (hdig === false) hdig = true;
                t = strm.next();
            }
            return false;
        }
        function wstring(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            var o = t.char;
            while (t = strm.next()) {
                if (t.char == o) {
                    strm.shift();
                    rslt.resut = strm.CurrentString;
                    return true;
                }
                if (t.char == '\\') strm.shift();
            }
            return false;
        }
        export function word(strm: syntaxer, rslt: ParserResult) {
            var t: Token = strm.current;
            rslt.tokon = CToken.word;
            if (t.char == '\'' || t.char == '"') return wstring(strm, rslt);
            if (t.type === TokenType.num || !isChar(t)) return false;
            while ((t = strm.next()) && isChar(t));
            rslt.resut = strm.CurrentString;
            return true;
        }
        export function pint(b: syntaxer, rslt: ParserResult) {
            var t: Token = b.current;
            rslt.tokon = 'pint';
            var s = t.char;
            var p = 1;
            if (s == '+' || s == '-') { if (s == '-') p = -1; b.shift(); }
            if (t.type != TokenType.num) return false;
            while (t = b.next())
                if (t.type != TokenType.num) break;
            rslt.resut = parseInt(b.CurrentString);
            return true;
        }
        export function anonymouseScop(s: syntaxer, rslt: ParserResult) {
            var t = s.current;
            rslt.tokon = 'anonymousscop';
            if (t.char == '~' && !!s.next()) {
                var x = s.exec(pint, true);
                rslt.resut = x.resut;
                return x.success;
            }
            return false;
        }
        export function namedScop(s: syntaxer, rslt: ParserResult) {
            var t = s.current;
            rslt.tokon = 'namedscop';
            if (t.char == '$' && !!s.next()) {
                var x = s.exec(word, true);
                rslt.resut = x.resut;
                return x.success;
            }
            return false;
        }
        export function subScop(s: syntaxer, rslt: ParserResult) {
            var t = s.current;
            rslt.tokon = 'subscop';
            if (t.char == '*' && !!s.next()) {
                var x = s.exec(word, true);
                rslt.resut = x.resut;
                return x.success;
            }
            return false;
        }
        export function typedScop(s: syntaxer, rslt: ParserResult) {
            var t = s.current;
            rslt.tokon = 'typedscope';
            var ist: string;
            var path: ParserResult;
            if (t.char !== '[') return false;
            if (!(t = s.next())) return false;
            if (t.char == ':') ist = t.char, s.next();
            else if (t.char == '=') ist = t.char, s.next();
            var r = (path = s.exec(stringChainedScop)).success && s.current && s.current.char == "]" && s.shift();
            if (r)
                rslt.resut = { type: ist, path: path.resut };
            return r;
        }
        var c_word = _ors([word, expression]);
        export function bindscope(b: syntaxer, rslt: ParserResult) {
            rslt.tokon = 'bindscope';
            b.exec(whitespace, true);
            var r = b.exec(word, true);
            if (!r.success) return false;
            rslt.resut = [r.resut];
            while (b.current && b.current.type == TokenType.dot) {
                b.next();
                var r = b.exec(word, true);
                if (!r.success) return b.unshift();
                rslt.resut.push(r.resut);
            }
            return true;
        }
        export function stringChainedScop(b: syntaxer, rslt: ParserResult) {
            b.exec(whitespace, true);
            var r = b.exec(word, true);
            if (!r.success) return false;
            while (b.current && b.current.type == TokenType.dot) {
                b.next();
                if (!b.exec(word, true)) return b.unshift();
            }
            rslt.resut = b.CurrentString;
            return true;
        }
        function parents(b: syntaxer, rslt: ParserResult) {
            var t = b.current;
            rslt.tokon = 'parentscop';
            rslt.resut = 0;
            do {
                if (t.char != '^') break;
                rslt.resut++;
            } while (t = b.next());
            return !!rslt.resut;
        }
        function prefixPath(b: syntaxer, result?: ParserResult) {
            return b.exec(ors([keyword('this'), keyword('data'), anonymouseScop, namedScop, parents]));
        }

        var PreffixcomposePathItem = _ors([keyword('this'), keyword('data'), keyword('window'), anonymouseScop, namedScop, parents]);
        var SuffixcomposePathItem = _ors([parent, subScop, typedScop, bindscope]);
        export function composedPath(b: syntaxer, rslt: ParserResult) {
            b.exec(whitespace, true);
            var path: ParserResult[] = [];
            var s = true;
            var p = b.exec(PreffixcomposePathItem, true);
            var s = !p.success;
            !s && path.push(p);
            while ((s ? (s = false, true) : b.exec(keyword('.'), true).success) && (p = b.exec(SuffixcomposePathItem, true)).success)
                path.push(p);
            if (path.length == 1)
                return clone(path[0], rslt);
            rslt.tokon = CToken.path;
            rslt.resut = path;
            return !!path.length;
        }
        export function parent(b: syntaxer, rslt: ParserResult) {
            var pr: ParserResult;
            if (b.exec(keyword('('), true).success && (pr = b.exec(expression, true)).success && b.exec(keyword(')'), true).success)
                return clone(pr, rslt);
            return false;
        }
        export function expression(b: syntaxer, rslt: ParserResult) {
            var pr: ParserResult;
            if ((pr = b.exec(_ors([parent, functionCall, arrayCall, constant, composedPath]), true)).success)
                return clone(pr, rslt);

            return false;
        }

        export interface FunctionResult {
            caller: ParserResult;
            args: ParserResult[];
        }
        export interface ArrayResult {
            caller: ParserResult;
            index: ParserResult;
        }

        export function functionCall(b: syntaxer, rslt: ParserResult) {
            b.exec(whitespace, true);
            var s = true;
            rslt.tokon = CToken.functionCall;
            var result: FunctionResult = { args: [], caller: void 0 };
            var child: ParserResult; rslt.resut
            if ((child = b.exec(composedPath, true)).success && b.exec(keyword('('), true).success) {
                result.caller = child;
                child = b.exec(expression, true);
                if (child.success) {
                    result.args.push(child);
                    while (b.exec(keyword(','), true).success && (child = b.exec(expression, true)).success)
                        result.args.push(child);
                }
                if (b.exec(keyword(')'), false).success) {
                    rslt.resut = result;
                    return true;
                }
            }
            return false;
        }
        export function arrayCall(b: syntaxer, rslt: ParserResult) {
            b.exec(whitespace, true);
            rslt.tokon = CToken.arrayCall;
            var s = true;
            var arg = expression;
            var child: ParserResult;
            if ((child = b.exec(composedPath, true)).success && b.exec(keyword('['), true).success) {
                var result: ArrayResult = { index: void 0, caller: child };
                if ((child = b.exec(arg, true)).success && b.exec(keyword(']')).success) {
                    result.index = child;
                    rslt.resut = result;
                    return true;
                }
            }
            return false;
        }

        export enum coPathType {
            bindscope,
            typedscope,
            subscop,
            parentscop,
            namedscop,
            anonymousscop,
            thisscope,
            keyword,
        }





    }
    export interface IComposePath {
        t: parsers.coPathType;
        v: string | string[] | ISubsScop | ITypedScop | INamedScop | IParentScop | IKeywordScop | IBindScope;
    }
    export interface ITypedScop {
        type: undefined | ':' | '=';
        path: string;
    }
    export declare type INamedScop = string;
    export declare type IParentScop = number;
    export declare type ISubsScop = string[];
    export declare type IBindScope = string[];
    export declare type IKeywordScop = string;


    export function parseComposePath(str: string) {
        var s = new Parser.syntaxer(str/*"$achour.brahim.[:app.coude].test.bind.kjh"*/);
        return s.exec(Parser.parsers.composedPath);
    }
    export function parseExpression(str: string) {
        var s = new Parser.syntaxer(str/*"$achour.brahim.[:app.coude].test.bind.kjh"*/);
        return s.exec(Parser.parsers.expression);
    }
    export function Execute(code: string, parser: Parser.parser) {
        var s = new Parser.syntaxer(code);
        return s.exec(parser);
    }

}

export namespace Parser {

    export class JSKeyword<T extends string> {
        private static keywors: { [s: string]: JSKeyword<any> };
        public static get<T extends string>(s: T): JSKeyword<T> {
            if (!this.keywors) this.InitKeywords();
            return this.keywors[s] as JSKeyword<T>;
        }
        constructor(public readonly token: JSToken, public readonly name: T, next?: JSKeyword<any>) {
            if (!JSKeyword.keywors) JSKeyword.InitKeywords();
            JSKeyword.keywors[name] = this;
        }
        static InitKeywords() {
            this.keywors = {};
            new JSKeyword(JSToken.Break, "break");
            // c
            new JSKeyword(JSToken.Case, "case");
            new JSKeyword(JSToken.Catch, "catch");
            new JSKeyword(JSToken.Class, "class");
            new JSKeyword(JSToken.Const, "const");
            new JSKeyword(JSToken.Continue, "continue");
            // d
            new JSKeyword(JSToken.Do, "do");
            new JSKeyword(JSToken.Delete, "delete");
            new JSKeyword(JSToken.Default, "default");
            new JSKeyword(JSToken.Debugger, "debugger");
            // e
            new JSKeyword(JSToken.Else, "else");
            new JSKeyword(JSToken.Enum, "enum");
            new JSKeyword(JSToken.Export, "export");
            new JSKeyword(JSToken.Extends, "extends");
            // f
            new JSKeyword(JSToken.For, "for");
            new JSKeyword(JSToken.False, "false");
            new JSKeyword(JSToken.Finally, "finally");
            new JSKeyword(JSToken.Function, "function");
            // g
            new JSKeyword(JSToken.Get, "get");
            // i
            new JSKeyword(JSToken.If, "if");
            new JSKeyword(JSToken.In, "in");
            new JSKeyword(JSToken.Import, "import");
            new JSKeyword(JSToken.Interface, "interface");
            new JSKeyword(JSToken.Implements, "implements");
            new JSKeyword(JSToken.InstanceOf, "instanceof");
            // l
            new JSKeyword(JSToken.Let, "let");
            // m
            //keywords['m' - 'a'] = new JSKeyword(JSToken.Module, "module");
            // n
            new JSKeyword(JSToken.New, "new");
            new JSKeyword(JSToken.Null, "null");
            new JSKeyword(JSToken.Native, "native");
            // p
            new JSKeyword(JSToken.Public, "public");
            new JSKeyword(JSToken.Package, "package");
            new JSKeyword(JSToken.Private, "private");
            new JSKeyword(JSToken.Protected, "protected");
            // r
            new JSKeyword(JSToken.Return, "return");
            // s
            new JSKeyword(JSToken.Set, "set");
            new JSKeyword(JSToken.Super, "super");
            new JSKeyword(JSToken.Static, "static");
            new JSKeyword(JSToken.Switch, "switch");
            // t
            new JSKeyword(JSToken.Try, "try");
            new JSKeyword(JSToken.This, "this");
            new JSKeyword(JSToken.True, "true");
            new JSKeyword(JSToken.Throw, "throw");
            new JSKeyword(JSToken.TypeOf, "typeof");
            // u
            // v
            new JSKeyword(JSToken.Var, "var");
            new JSKeyword(JSToken.Void, "void");
            // w
            new JSKeyword(JSToken.With, "with");
            new JSKeyword(JSToken.While, "while");
            // y
            new JSKeyword(JSToken.Yield, "yield");


        }
    }


    class Context {
        public Token: JSToken;
        public Value: string;
        Is(token: JSToken) {
            return this.Token == token;
        }

        public IsEither(token1: JSToken, token2: JSToken): boolean {
            var target = this.Token;
            return (target == token1) || (target == token2);
        }
        public IsOne(...tokens: JSToken[]): boolean {
            // if any one of the tokens match what we have, we're good
            if (tokens != null) {
                var target = this.Token;
                for (var ndx = tokens.length - 1; ndx >= 0; --ndx) {
                    if (tokens[ndx] == target) {
                        return true;
                    }
                }
            }
            // otherwise we're not
            return false;
        }
    }

    export class AST extends Parser.syntaxer {
        private currentContext: Context = new Context();
        getNextToken() {
            var v = <ref<string>>{};
            this.currentContext.Token = this._getNextToken(v);
            this.currentContext.Value = v.value;
            return this.currentContext.Token;
        }

        private ParseStatement(fSourceElement: boolean, skipImportantComment = false) {
            var statement = null;
            var tkn = this.currentContext.Token;
            while (true)
                switch (tkn) {
                    case JSToken.EndOfFile:
                        //ReportError(JSError.ErrorEndOfFile);
                        return null; // abort parsing, get back to the main parse routine

                    case JSToken.Semicolon:
                        // make an empty statement
                        //statement = new EmptyStatement(m_currentToken.Clone());
                        this.getNextToken();
                        return null;

                    case JSToken.RightCurly:
                        //ReportError(JSError.SyntaxError);
                        this.getNextToken();
                        break;

                    case JSToken.LeftCurly:
                    //return ParseBlock();

                    case JSToken.Debugger:
                        this.getNextToken();
                        if (this.currentContext.Token == JSToken.Semicolon) this.getNextToken();
                        return null;
                    case JSToken.Var:
                    case JSToken.Const:
                    case JSToken.Let:

                    //return ParseVariableStatement();

                    case JSToken.If:
                    //return ParseIfStatement();

                    case JSToken.For:
                    //return ParseForStatement();

                    case JSToken.Do:
                    //return ParseDoStatement();

                    case JSToken.While:
                    //return ParseWhileStatement();

                    case JSToken.Continue:
                    //return ParseContinueStatement();

                    case JSToken.Break:
                    //return ParseBreakStatement();

                    case JSToken.Return:
                    //return ParseReturnStatement();

                    case JSToken.With:
                    //return ParseWithStatement();

                    case JSToken.Switch:
                    //return ParseSwitchStatement();

                    case JSToken.Throw:
                    //return ParseThrowStatement();

                    case JSToken.Try:
                    //return ParseTryStatement();

                    case JSToken.Function:
                    // parse a function declaration
                    //var function = ParseFunction(FunctionType.Declaration, m_currentToken.Clone());
                    //function.IsSourceElement = fSourceElement;
                    //return function;

                    case JSToken.Class:
                    //return ParseClassNode(ClassType.Declaration);

                    case JSToken.Else:
                        //ReportError(JSError.InvalidElse);
                        this.getNextToken();
                        break;

                    case JSToken.ConditionalCommentStart:
                    //return ParseStatementLevelConditionalComment(fSourceElement);

                    case JSToken.ConditionalCompilationOn:
                        //var ccOn = new ConditionalCompilationOn(m_currentToken.Clone());
                        this.getNextToken();
                    //return ccOn;

                    case JSToken.ConditionalCompilationSet:
                    //return ParseConditionalCompilationSet();

                    case JSToken.ConditionalCompilationIf:
                    //return ParseConditionalCompilationIf(false);

                    case JSToken.ConditionalCompilationElseIf:
                    //return ParseConditionalCompilationIf(true);

                    case JSToken.ConditionalCompilationElse:
                        //var elseStatement = new ConditionalCompilationElse(m_currentToken.Clone());
                        this.getNextToken();
                    //return elseStatement;

                    case JSToken.ConditionalCompilationEnd:
                        //var endStatement = new ConditionalCompilationEnd(m_currentToken.Clone());
                        this.getNextToken();
                    ///return endStatement;

                    case JSToken.Import:
                    // import can't be an identifier name, so it must be an import statement
                    //return ParseImport();

                    case JSToken.Export:
                    // export can't be an identifier name, so it must be an export statement
                    //return ParseExport();

                    case JSToken.Identifier:
                        //if (m_currentToken.Is("module")) {
                        //  goto case JSToken.Module;
                        tkn = 'default' as any;
                        continue;

                    case JSToken.Module:
                        //if (PeekCanBeModule())
                        //  return ParseModule();
                        tkn = 'default' as any;
                        continue;
                    default:
                        //statement = ParseExpressionStatement(fSourceElement);
                        break;
                }
        }
    }
}

export namespace Parser {
    export interface ICode {
        Code: string;
        scop?: bind.Scop;
        result?: any;
        pb?: bind.PropBinding;
    }
    export class StringTemplate {
        private code: string
        private curs: number;
        private len: number;
        private stack: (string | ICode)[] = [];
        private pcurs: number = 0;
        private isCode: boolean = false;
        private get currentChar() {
            return this.code[this.curs];
        }
        private get nextChar() {
            return this.code[this.curs + 1];
        }

        private get MoveNext() {
            this.curs++;
            return this.curs < this.len;
        }
        private init(code: string) {
            this.code = code;
            this.curs = -1;
            this.len = code.length;
            this.stack = [];
            this.pcurs = 0;
            this.isCode = false;
        }
        private getString() {
            var end: string = this.currentChar;
            var s = this.curs + 1;
            var pc = '\0';
            while (this.MoveNext) {
                {
                    if (pc === '\\') continue;
                    pc = this.currentChar;
                    if (pc === end)
                        return this.code.substr(s, this.curs - s);
                }
            }
            throw "Error";
        }
        private _toStack() {
            var len = this.curs - this.pcurs;
            if (len != 0) {
                var str = this.code.substr(this.pcurs, len);
                this.stack.push(this.isCode ? <ICode>{ Code: str } : str);
            }
            if (this.curs < this.len) {
                this.curs += 1;
                this.pcurs = this.curs + 1;
                this.isCode = !this.isCode;
            } else this.isCode = false;
            return this.stack;
        }
        public Compile(code: string) {
            if (code[0] !== "=")
                this.init(code);
            else
                this.init(code.substr(1));
            while (this.MoveNext) {
                var c = this.currentChar;
                if (this.isCode) {
                    if (c === '"') this.getString();
                    else if (c === "'") this.getString();
                    else if (c === '}' && this.nextChar === "}") this._toStack();
                }
                else if (c === '{' && this.nextChar === '{') this._toStack();
            }
            return this._toStack();
        }
        static default = new StringTemplate();
        public static Compile(code: string) {
            return this.default.Compile(code);
        }


        private static toRegString(s: string) {
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                var cc = s[i];
                if (cc === '"' || cc === '\'') {
                    rs += "\\" + cc;
                }
                else rs += cc;
            }
            return rs;
        }
        public static GenearteString(stack: (string | ICode)[]) {
            var strs: string[] = new Array<string>(stack.length);
            for (var i = 0; i < stack.length; i++) {
                var s = stack[i];
                if (typeof s === 'string')
                    strs[i] = '"' + this.toRegString(s) + '"';
                else {
                    strs[i] = s.result;
                }
            }
            return strs.join('');
        }

    }
}