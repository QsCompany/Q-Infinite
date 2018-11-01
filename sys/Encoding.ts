import {basic, encoding} from './Corelib';
;
encoding.SerializationContext.GlobalContext.Register<number>(Number, {
    FromJson: (a, c) => {
        if (a == null) return 0;
        if (typeof a === 'number') return a;
        if (typeof a === 'string') return parseInt(a);
        throw "basic.Guid.FromNumber(parseInt(a));";
    },
    ToJson: (a, c) => a == null ? 0 : a.toString()
});

encoding.SerializationContext.GlobalContext.Register<Date>(Date, {
    FromJson: (a, c) => {
        if (a == null) return null;
        if (typeof a === 'number') return new Date(a as number);
        if (typeof a === 'string') return new Date(a);
        else return undefined;
    },
    ToJson: (a, c) => a.toJSON()
});

export function init() { }

var sprintf = function (format, ...var_arg) {
    return vsprintf(format, Array.prototype.slice.call(arguments, 1));
}
var tokenizeFormatString = function (format, formatters) {
    var tokens = [];
    var substitutionIndex = 0;
    function addStringToken(str) {
        if (tokens.length && tokens[tokens.length - 1].type === "string")
            tokens[tokens.length - 1].value += str;
        else
            tokens.push({
                type: "string",
                value: str
            });
    }
    function addSpecifierToken(specifier, precision, substitutionIndex) {
        tokens.push({
            type: "specifier",
            specifier: specifier,
            precision: precision,
            substitutionIndex: substitutionIndex
        });
    }
    var index = 0;
    for (var precentIndex = format.indexOf("%", index); precentIndex !== -1; precentIndex = format.indexOf("%", index)) {
        if (format.length === index)
            break;
        addStringToken(format.substring(index, precentIndex));
        index = precentIndex + 1;
        if (format[index] === "%") {
            addStringToken("%");
            ++index;
            continue;
        }
        if (isDigitAt(format, index)) {
            var number = parseInt(format.substring(index), 10);
            while (isDigitAt(format, index))
                ++index;
            if (number > 0 && format[index] === "$") {
                substitutionIndex = (number - 1);
                ++index;
            }
        }
        var precision = -1;
        if (format[index] === ".") {
            ++index;
            precision = parseInt(format.substring(index), 10);
            if (isNaN(precision))
                precision = 0;
            while (isDigitAt(format, index))
                ++index;
        }
        if (!(format[index] in formatters)) {
            addStringToken(format.substring(precentIndex, index + 1));
            ++index;
            continue;
        }
        addSpecifierToken(format[index], precision, substitutionIndex);
        ++substitutionIndex;
        ++index;
    }
    addStringToken(format.substring(index));
    return tokens;
}
var standardFormatters = {
    d: function (substitution) {
        return !isNaN(substitution) ? substitution : 0;
    },
    f: function (substitution, token) {
        if (substitution && token.precision > -1)
            substitution = substitution.toFixed(token.precision);
        return !isNaN(substitution) ? substitution : (token.precision > -1 ? Number(0).toFixed(token.precision) : 0);
    },
    s: function (substitution) {
        return substitution;
    }
}
var vsprintf = function (format, substitutions) {
    return format(format, substitutions, standardFormatters, "", function (a, b) {
        return a + b;
    }).formattedResult;
}
var format = function (format, substitutions, formatters, initialValue, append, tokenizedFormat) {
    if (!format || !substitutions || !substitutions.length)
        return {
            formattedResult: append(initialValue, format),
            unusedSubstitutions: substitutions
        };
    function prettyFunctionName() {
        return "String.format(\"" + format + "\", \"" + Array.prototype.join.call(substitutions, "\", \"") + "\")";
    }
    function warn(msg) {
        console.warn(prettyFunctionName() + ": " + msg);
    }
    function error(msg) {
        console.error(prettyFunctionName() + ": " + msg);
    }
    var result = initialValue;
    var tokens = tokenizedFormat || tokenizeFormatString(format, formatters);
    var usedSubstitutionIndexes = {};
    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        if (token.type === "string") {
            result = append(result, token.value);
            continue;
        }
        if (token.type !== "specifier") {
            error("Unknown token type \"" + token.type + "\" found.");
            continue;
        }
        if (token.substitutionIndex >= substitutions.length) {
            error("not enough substitution arguments. Had " + substitutions.length + " but needed " + (token.substitutionIndex + 1) + ", so substitution was skipped.");
            result = append(result, "%" + (token.precision > -1 ? token.precision : "") + token.specifier);
            continue;
        }
        usedSubstitutionIndexes[token.substitutionIndex] = true;
        if (!(token.specifier in formatters)) {
            warn("unsupported format character \u201C" + token.specifier + "\u201D. Treating as a string.");
            result = append(result, substitutions[token.substitutionIndex]);
            continue;
        }
        result = append(result, formatters[token.specifier](substitutions[token.substitutionIndex], token));
    }
    var unusedSubstitutions = [];
    for (var i = 0; i < substitutions.length; ++i) {
        if (i in usedSubstitutionIndexes)
            continue; unusedSubstitutions.push(substitutions[i]);
    }
    return {
        formattedResult: result,
        unusedSubstitutions: unusedSubstitutions
    };
}
;(String.prototype as any).unescapeHTML = function () {
    return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#58;/g, ":").replace(/&quot;/g, "\"").replace(/&#60;/g, "<").replace(/&#62;/g, ">").replace(/&amp;/g, "&");
}
;(String.prototype as any).collapseWhitespace = function () {
    return this.replace(/[\s\xA0]+/g, " ");
}
;(String.prototype as any).trimMiddle = function (maxLength) {
    if (this.length <= maxLength)
        return String(this);
    var leftHalf = maxLength >> 1;
    var rightHalf = maxLength - leftHalf - 1;
    return this.substr(0, leftHalf) + "\u2026" + this.substr(this.length - rightHalf, rightHalf);
}
;(String.prototype as any).trimEnd = function (maxLength) {
    if (this.length <= maxLength)
        return String(this);
    return this.substr(0, maxLength - 1) + "\u2026";
}
;(String.prototype as any).trimURL = function (baseURLDomain) {
    var result = this.replace(/^(https|http|file):\/\//i, "");
    if (baseURLDomain) {
        if (result.toLowerCase().startsWith(baseURLDomain.toLowerCase()))
            result = result.substr(baseURLDomain.length);
    }
    return result;
}
;(String.prototype as any).toTitleCase = function () {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
}
;(String.prototype as any).compareTo = function (other) {
    if (this > other)
        return 1;
    if (this < other)
        return -1;
    return 0;
}
function sanitizeHref(href) {
    return href && href.trim().toLowerCase().startsWith("javascript:") ? null : href;
}
;(String.prototype as any).removeURLFragment = function () {
    var fragmentIndex = this.indexOf("#");
    if (fragmentIndex == -1)
        fragmentIndex = this.length;
    return this.substring(0, fragmentIndex);
}
var hashCode = function (string) {
    if (!string)
        return 0;
    var result = 0;
    for (var i = 0; i < string.length; ++i)
        result = (result * 31 + string.charCodeAt(i)) | 0;
    return Math.abs(result);
}
var isDigitAt = function (string, index) {
    var c = string.charCodeAt(index);
    return 48 <= c && c <= 57;
};
(String.prototype as any).toBase64 = function () {
    function encodeBits(b) {
        return b < 26 ? b + 65 : b < 52 ? b + 71 : b < 62 ? b - 4 : b === 62 ? 43 : b === 63 ? 47 : 65;
    }
    var encoder = new ((window as any).TextEncoder)();
    var data = encoder.encode(this);
    var n = data.length;
    var encoded = "";
    if (n === 0)
        return encoded;
    var shift;
    var v = 0;
    for (var i = 0; i < n; i++) {
        shift = i % 3;
        v |= data[i] << (16 >>> shift & 24);
        if (shift === 2) {
            encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), encodeBits(v >>> 6 & 63), encodeBits(v & 63));
            v = 0;
        }
    }
    if (shift === 0)
        encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), 61, 61);
    else if (shift === 1)
        encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), encodeBits(v >>> 6 & 63), 61);
    return encoded;
}
var WebInspector = { Color: null };
class Color {
    _rgba;
    _originalText;
    _originalTextIsValid;
    _format;
    constructor (rgba, format, originalText) {
        this._rgba = rgba;
        this._originalText = originalText || null;
        this._originalTextIsValid = !!this._originalText;
        this._format = format;
        if (typeof this._rgba[3] === "undefined")
            this._rgba[3] = 1;
        for (var i = 0; i < 4; ++i) {
            if (this._rgba[i] < 0) {
                this._rgba[i] = 0;
                this._originalTextIsValid = false;
            }
            if (this._rgba[i] > 1) {
                this._rgba[i] = 1;
                this._originalTextIsValid = false;
            }
        }
    }
    Format = {
        Original: "original",
        Nickname: "nickname",
        HEX: "hex",
        ShortHEX: "shorthex",
        RGB: "rgb",
        RGBA: "rgba",
        HSL: "hsl",
        HSLA: "hsla"
    }
    parse(text) {
        var value = text.toLowerCase().replace(/\s+/g, "");
        var simple = /^(?:#([0-9a-f]{3}|[0-9a-f]{6})|rgb\(((?:-?\d+%?,){2}-?\d+%?)\)|(\w+)|hsl\((-?\d+\.?\d*(?:,-?\d+\.?\d*%){2})\))$/i;
        var match = value.match(simple);
        if (match) {
            if (match[1]) {
                var hex = match[1].toUpperCase();
                var format;
                if (hex.length === 3) {
                    format = WebInspector.Color.Format.ShortHEX;
                    hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
                } else
                    format = WebInspector.Color.Format.HEX;
                var r = parseInt(hex.substring(0, 2), 16);
                var g = parseInt(hex.substring(2, 4), 16);
                var b = parseInt(hex.substring(4, 6), 16);
                return new WebInspector.Color([r / 255, g / 255, b / 255, 1], format, text);
            }
            if (match[2]) {
                var rgbString = match[2].split(/\s*,\s*/);
                var rgba: any = [WebInspector.Color._parseRgbNumeric(rgbString[0]), WebInspector.Color._parseRgbNumeric(rgbString[1]), WebInspector.Color._parseRgbNumeric(rgbString[2]), 1];
                return new WebInspector.Color(rgba, WebInspector.Color.Format.RGB, text);
            }
            if (match[3]) {
                var nickname = match[3].toLowerCase();
                if (nickname in WebInspector.Color.Nicknames) {
                    var rgba:any = WebInspector.Color.Nicknames[nickname];
                    var color = WebInspector.Color.fromRGBA(rgba);
                    color._format = WebInspector.Color.Format.Nickname;
                    color._originalText = text;
                    return color;
                }
                return null;
            }
            if (match[4]) {
                var hslString = match[4].replace(/%/g, "").split(/\s*,\s*/);
                var hsla = [WebInspector.Color._parseHueNumeric(hslString[0]), WebInspector.Color._parseSatLightNumeric(hslString[1]), WebInspector.Color._parseSatLightNumeric(hslString[2]), 1];
                var rgba: any = [];
                WebInspector.Color.hsl2rgb(hsla, rgba);
                return new WebInspector.Color(rgba, WebInspector.Color.Format.HSL, text);
            }
            return null;
        }
        var advanced = /^(?:rgba\(((?:-?\d+%?,){3}-?(?:\d+|\d*\.\d+))\)|hsla\((-?(?:\d+|\d*\.\d+)(?:,-?(?:\d+|\d*\.\d+)*%){2},-?(?:\d+|\d*\.\d+))\))$/;
        match = value.match(advanced);
        if (match) {
            if (match[1]) {
                var rgbaString = match[1].split(/\s*,\s*/);
                var rgba:any = [WebInspector.Color._parseRgbNumeric(rgbaString[0]), WebInspector.Color._parseRgbNumeric(rgbaString[1]), WebInspector.Color._parseRgbNumeric(rgbaString[2]), WebInspector.Color._parseAlphaNumeric(rgbaString[3])];
                return new WebInspector.Color(rgba, WebInspector.Color.Format.RGBA, text);
            }
            if (match[2]) {
                var hslaString = match[2].replace(/%/g, "").split(/\s*,\s*/);
                var hsla = [WebInspector.Color._parseHueNumeric(hslaString[0]), WebInspector.Color._parseSatLightNumeric(hslaString[1]), WebInspector.Color._parseSatLightNumeric(hslaString[2]), WebInspector.Color._parseAlphaNumeric(hslaString[3])];
                var rgba:any = [];
                WebInspector.Color.hsl2rgb(hsla, rgba);
                return new WebInspector.Color(rgba, WebInspector.Color.Format.HSLA, text);
            }
        }
        return null;
    }
    fromRGBA(rgba) {
        return new WebInspector.Color([rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]], WebInspector.Color.Format.RGBA);
    }
    fromHSVA(hsva) {
        var rgba = [];
        WebInspector.Color.hsva2rgba(hsva, rgba);
        return new WebInspector.Color(rgba, WebInspector.Color.Format.HSLA);
    }
    prototype = {
        format: function () {
            return this._format;
        },
        hsla: function () {
            if (this._hsla)
                return this._hsla;
            var r = this._rgba[0];
            var g = this._rgba[1];
            var b = this._rgba[2];
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var diff = max - min;
            var add = max + min;
            if (min === max)
                var h = 0;
            else if (r === max)
                var h = ((1 / 6 * (g - b) / diff) + 1) % 1;
            else if (g === max)
                var h = (1 / 6 * (b - r) / diff) + 1 / 3;
            else
                var h = (1 / 6 * (r - g) / diff) + 2 / 3;
            var l = 0.5 * add;
            if (l === 0)
                var s = 0;
            else if (l === 1)
                var s = 0;
            else if (l <= 0.5)
                var s = diff / add;
            else
                var s = diff / (2 - add);
            this._hsla = [h, s, l, this._rgba[3]];
            return this._hsla;
        },
        canonicalHSLA: function () {
            var hsla = this.hsla();
            return [Math.round(hsla[0] * 360), Math.round(hsla[1] * 100), Math.round(hsla[2] * 100), hsla[3]];
        },
        hsva: function () {
            var hsla = this.hsla();
            var h = hsla[0];
            var s = hsla[1];
            var l = hsla[2];
            s *= l < 0.5 ? l : 1 - l;
            return [h, s !== 0 ? 2 * s / (l + s) : 0, (l + s), hsla[3]];
        },
        hasAlpha: function () {
            return this._rgba[3] !== 1;
        },
        canBeShortHex: function () {
            if (this.hasAlpha())
                return false;
            for (var i = 0; i < 3; ++i) {
                var c = Math.round(this._rgba[i] * 255);
                if (c % 17)
                    return false;
            }
            return true;
        },
        asString: function (format) {
            if (format === this._format && this._originalTextIsValid)
                return this._originalText;
            if (!format)
                format = this._format;
            function toRgbValue(value) {
                return Math.round(value * 255);
            }
            function toHexValue(value) {
                var hex = Math.round(value * 255).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }
            function toShortHexValue(value) {
                return (Math.round(value * 255) / 17).toString(16);
            }
            switch (format) {
                case WebInspector.Color.Format.Original:
                    return this._originalText;
                case WebInspector.Color.Format.RGB:
                    if (this.hasAlpha())
                        return null;
                    return sprintf("rgb(%d, %d, %d)", toRgbValue(this._rgba[0]), toRgbValue(this._rgba[1]), toRgbValue(this._rgba[2]));
                case WebInspector.Color.Format.RGBA:
                    return sprintf("rgba(%d, %d, %d, %f)", toRgbValue(this._rgba[0]), toRgbValue(this._rgba[1]), toRgbValue(this._rgba[2]), this._rgba[3]);
                case WebInspector.Color.Format.HSL:
                    if (this.hasAlpha())
                        return null;
                    var hsl = this.hsla();
                    return sprintf("hsl(%d, %d%, %d%)", Math.round(hsl[0] * 360), Math.round(hsl[1] * 100), Math.round(hsl[2] * 100));
                case WebInspector.Color.Format.HSLA:
                    var hsla = this.hsla();
                    return sprintf("hsla(%d, %d%, %d%, %f)", Math.round(hsla[0] * 360), Math.round(hsla[1] * 100), Math.round(hsla[2] * 100), hsla[3]);
                case WebInspector.Color.Format.HEX:
                    if (this.hasAlpha())
                        return null;
                    return sprintf("#%s%s%s", toHexValue(this._rgba[0]), toHexValue(this._rgba[1]), toHexValue(this._rgba[2])).toUpperCase();
                case WebInspector.Color.Format.ShortHEX:
                    if (!this.canBeShortHex())
                        return null;
                    return sprintf("#%s%s%s", toShortHexValue(this._rgba[0]), toShortHexValue(this._rgba[1]), toShortHexValue(this._rgba[2])).toUpperCase();
                case WebInspector.Color.Format.Nickname:
                    return this.nickname();
            }
            return this._originalText;
        },
        rgba: function () {
            return this._rgba.slice();
        },
        canonicalRGBA: function () {
            var rgba = new Array(4);
            for (var i = 0; i < 3; ++i)
                rgba[i] = Math.round(this._rgba[i] * 255);
            rgba[3] = this._rgba[3];
            return rgba;
        },
        nickname: function () {
            if (!WebInspector.Color._rgbaToNickname) {
                WebInspector.Color._rgbaToNickname = {};
                for (var nickname in WebInspector.Color.Nicknames) {
                    var rgba = WebInspector.Color.Nicknames[nickname];
                    if (rgba.length !== 4)
                        rgba = rgba.concat(1);
                    WebInspector.Color._rgbaToNickname[rgba] = nickname;
                }
            }
            return WebInspector.Color._rgbaToNickname[this.canonicalRGBA()] || null;
        },
        toProtocolRGBA: function () {
            var rgba = this.canonicalRGBA();
            return {
                r: rgba[0],
                g: rgba[1],
                b: rgba[2], a: rgba[3] != 1 ? rgba[3] : undefined
            };
        },
        invert: function () {
            var rgba = [];
            rgba[0] = 1 - this._rgba[0];
            rgba[1] = 1 - this._rgba[1];
            rgba[2] = 1 - this._rgba[2];
            rgba[3] = this._rgba[3];
            return new WebInspector.Color(rgba, WebInspector.Color.Format.RGBA);
        },
        setAlpha: function (alpha) {
            var rgba = this._rgba.slice();
            rgba[3] = alpha;
            return new WebInspector.Color(rgba, WebInspector.Color.Format.RGBA);
        }
    }
    _parseRgbNumeric(value) {
        var parsed = parseInt(value, 10);
        if (value.indexOf("%") !== -1)
            parsed /= 100;
        else
            parsed /= 255;
        return parsed;
    }
    _parseHueNumeric(value) {
        return isNaN(value) ? 0 : (parseFloat(value) / 360) % 1;
    }
    _parseSatLightNumeric(value) {
        return Math.min(1, parseFloat(value) / 100);
    }
    _parseAlphaNumeric(value) {
        return isNaN(value) ? 0 : parseFloat(value);
    }
    _hsva2hsla(hsva, out_hsla) {
        var h = hsva[0];
        var s = hsva[1];
        var v = hsva[2];
        var t = (2 - s) * v;
        if (v === 0 || s === 0)
            s = 0;
        else
            s *= v / (t < 1 ? t : 2 - t);
        out_hsla[0] = h;
        out_hsla[1] = s;
        out_hsla[2] = t / 2;
        out_hsla[3] = hsva[3];
    }
    hsl2rgb(hsl, out_rgb) {
        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];
        function hue2rgb(p, q, h) {
            if (h < 0)
                h += 1;
            else if (h > 1)
                h -= 1;
            if ((h * 6) < 1)
                return p + (q - p) * h * 6;
            else if ((h * 2) < 1)
                return q;
            else if ((h * 3) < 2)
                return p + (q - p) * ((2 / 3) - h) * 6;
            else
                return p;
        }
        if (s < 0)
            s = 0;
        if (l <= 0.5)
            var q = l * (1 + s);
        else
            var q = l + s - (l * s);
        var p = 2 * l - q;
        var tr = h + (1 / 3);
        var tg = h;
        var tb = h - (1 / 3);
        out_rgb[0] = hue2rgb(p, q, tr);
        out_rgb[1] = hue2rgb(p, q, tg);
        out_rgb[2] = hue2rgb(p, q, tb);
        out_rgb[3] = hsl[3];
    }
    hsva2rgba(hsva, out_rgba) {
        WebInspector.Color._hsva2hsla(hsva, WebInspector.Color.hsva2rgba._tmpHSLA);
        WebInspector.Color.hsl2rgb(WebInspector.Color.hsva2rgba._tmpHSLA, out_rgba);
        for (var i = 0; i < WebInspector.Color.hsva2rgba._tmpHSLA.length; i++)
            this._tmpHSLA[i] = 0;
    }
    ;
    _tmpHSLA = [0, 0, 0, 0];
    luminance(rgba) {
        var rSRGB = rgba[0];
        var gSRGB = rgba[1];
        var bSRGB = rgba[2];
        var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055) / 1.055), 2.4);
        var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055) / 1.055), 2.4);
        var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055) / 1.055), 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    blendColors(fgRGBA, bgRGBA, out_blended) {
        var alpha = fgRGBA[3];
        out_blended[0] = ((1 - alpha) * bgRGBA[0]) + (alpha * fgRGBA[0]);
        out_blended[1] = ((1 - alpha) * bgRGBA[1]) + (alpha * fgRGBA[1]);
        out_blended[2] = ((1 - alpha) * bgRGBA[2]) + (alpha * fgRGBA[2]);
        out_blended[3] = alpha + (bgRGBA[3] * (1 - alpha));
    }
    calculateContrastRatio(fgRGBA, bgRGBA) {
        WebInspector.Color.blendColors(fgRGBA, bgRGBA, WebInspector.Color.calculateContrastRatio._blendedFg);
        var fgLuminance = WebInspector.Color.luminance(WebInspector.Color.calculateContrastRatio._blendedFg);
        var bgLuminance = WebInspector.Color.luminance(bgRGBA);
        var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
        for (var i = 0; i < WebInspector.Color.calculateContrastRatio._blendedFg.length; i++)
            WebInspector.Color.calculateContrastRatio._blendedFg[i] = 0;
        return contrastRatio;
    }
    _blendedFg = [0, 0, 0, 0];
    desiredLuminance(luminance, contrast, lighter) {
        function computeLuminance() {
            if (lighter)
                return (luminance + 0.05) * contrast - 0.05;
            else
                return (luminance + 0.05) / contrast - 0.05;
        }
        var desiredLuminance = computeLuminance();
        if (desiredLuminance < 0 || desiredLuminance > 1) {
            lighter = !lighter;
            desiredLuminance = computeLuminance();
        }
        return desiredLuminance;
    }
}

export namespace Base64 {    
    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63

    function getLens(b64) {
        var len = b64.length

        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        var validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len

        var placeHoldersLen = validLen === len
            ? 0
            : 4 - (validLen % 4)

        return [validLen, placeHoldersLen]
    }

    // base64 is 4/3 + up to two characters of the original data
    export function byteLength(b64) {
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    function _byteLength(b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    export function toByteArray(b64) {
        var tmp
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]

        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

        var curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        var len = placeHoldersLen > 0
            ? validLen - 4
            : validLen

        for (var i = 0; i < len; i += 4) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 18) |
                (revLookup[b64.charCodeAt(i + 1)] << 12) |
                (revLookup[b64.charCodeAt(i + 2)] << 6) |
                revLookup[b64.charCodeAt(i + 3)]
            arr[curByte++] = (tmp >> 16) & 0xFF
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 2) |
                (revLookup[b64.charCodeAt(i + 1)] >> 4)
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 10) |
                (revLookup[b64.charCodeAt(i + 1)] << 4) |
                (revLookup[b64.charCodeAt(i + 2)] >> 2)
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        return arr
    }

    function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] +
            lookup[num >> 12 & 0x3F] +
            lookup[num >> 6 & 0x3F] +
            lookup[num & 0x3F]
    }

    function encodeChunk(uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
            tmp =
                ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF)
            output.push(tripletToBase64(tmp))
        }
        return output.join('')
    }

    export function fromByteArray(uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(encodeChunk(
                uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
            ))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1]
            parts.push(
                lookup[tmp >> 2] +
                lookup[(tmp << 4) & 0x3F] +
                '=='
            )
        } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + uint8[len - 1]
            parts.push(
                lookup[tmp >> 10] +
                lookup[(tmp >> 4) & 0x3F] +
                lookup[(tmp << 2) & 0x3F] +
                '='
            )
        }

        return parts.join('')
    }

}

export namespace IEEE754 {
    export function read(buffer, offset, isLE, mLen, nBytes) {
        var e, m
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var nBits = -7
        var i = isLE ? (nBytes - 1) : 0
        var d = isLE ? -1 : 1
        var s = buffer[offset + i]

        i += d

        e = s & ((1 << (-nBits)) - 1)
        s >>= (-nBits)
        nBits += eLen
        for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        m = e & ((1 << (-nBits)) - 1)
        e >>= (-nBits)
        nBits += mLen
        for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        if (e === 0) {
            e = 1 - eBias
        } else if (e === eMax) {
            return m ? NaN : ((s ? -1 : 1) * Infinity)
        } else {
            m = m + Math.pow(2, mLen)
            e = e - eBias
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    export function write(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
        var i = isLE ? 0 : (nBytes - 1)
        var d = isLE ? 1 : -1
        var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

        value = Math.abs(value)

        if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0
            e = eMax
        } else {
            e = Math.floor(Math.log(value) / Math.LN2)
            if (value * (c = Math.pow(2, -e)) < 1) {
                e--
                c *= 2
            }
            if (e + eBias >= 1) {
                value += rt / c
            } else {
                value += rt * Math.pow(2, 1 - eBias)
            }
            if (value * c >= 2) {
                e++
                c /= 2
            }

            if (e + eBias >= eMax) {
                m = 0
                e = eMax
            } else if (e + eBias >= 1) {
                m = ((value * c) - 1) * Math.pow(2, mLen)
                e = e + eBias
            } else {
                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
                e = 0
            }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

        e = (e << mLen) | m
        eLen += mLen
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

        buffer[offset + i - d] |= s * 128
    }
}