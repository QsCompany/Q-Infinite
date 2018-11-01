export namespace Consts {
    export var IDENT = '(?:' + '[a-zA-Z_$][\\w.:$\\-*]*' + ')';
    export var NUMBER = '(?:' + '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?' + ')';
    export var SQUOTE_STRING = '(?:' + '\'(?:[^\'\\\\]|\\\\.)*\'' + ')';
    export var DQUOTE_STRING = '(?:' + '"(?:[^"\\\\]|\\\\.)*"' + ')';
    export var STRING = '(?:' + SQUOTE_STRING + '|' + DQUOTE_STRING + ')';
    export var ARGUMENT = '(?:' + IDENT + '|' + NUMBER + '|' + STRING + '\\s*' + ')';
    export var ARGUMENTS = '(?:' + ARGUMENT + '(?:,\\s*' + ARGUMENT + ')*' + ')';
    export var ARGUMENT_LIST = '(?:' + '\\(\\s*' + '(?:' + ARGUMENTS + '?' + ')' + '\\)\\s*' + ')';
    export var BINDING = '(' + IDENT + '\\s*' + ARGUMENT_LIST + '?' + ')';
    export var OPEN_BRACKET = '(\\[\\[|{{)' + '\\s*';
    export var CLOSE_BRACKET = '(?:]]|}})';
    export var NEGATE = '(?:(!)\\s*)?';
    export var EXPRESSION = OPEN_BRACKET + NEGATE + BINDING + CLOSE_BRACKET;
    export var IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);
    export var css = {
        comments: /\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gim,
        port: /@import[^;]*;/gim,
        customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
        varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        keyframesRule: /^@[^\s]*keyframes/,
        multipleSpaces: /\s+/g
    }
}
export enum ModuleStat {
    New = 0,
    Downloading = 1,
    Downloaded = 2,
    Defining = 3,
    Defined = 4,
    Executing = 5,
    Executed = 6,
    Failed = 7
}

Object.freeze(Consts);