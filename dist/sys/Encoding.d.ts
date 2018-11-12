export declare namespace __encoddings__ {
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
