export declare namespace Consts {
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
