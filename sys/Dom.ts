var j = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regexp",
    "[object Object]": "object",
    "[object Error]": "error",
    "[object Symbol]": "symbol"
};
var k = j.toString;
export module Dom {
    function isWindow(a) {
        return null != a && a === a.window
    }
    function Sb(a: Window | Document): Window {
        return isWindow(a) ? a : 9 === (a as any).nodeType && (a as any).defaultView;
    }
    function type(a) {
        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? j[k.call(a)] || "object" : typeof a
    }
    function isFunction(a) {
        return "function" === type(a)
    }
    export function offset(f: Element) {        
        if (f) {
            if (f.getClientRects().length) {
                var d = f.getBoundingClientRect();
                if (d.width || d.height) {
                    var e = f.ownerDocument;
                    var c = Sb(e as any);
                    var b = e.documentElement;
                    return {
                        top: d.top + c.pageYOffset - b.clientTop,
                        left: d.left + c.pageXOffset - b.clientLeft
                    }
                }
                return d;
            }
            return { top: 0, left: 0 };
        }
    }
    export function elementInViewport(el: HTMLElement) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent as HTMLElement;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }
    export function elementEntirelyInViewport (el:HTMLElement) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent as HTMLElement;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top >= window.pageYOffset &&
            left >= window.pageXOffset &&
            (top + height) <= (window.pageYOffset + window.innerHeight) &&
            (left + width) <= (window.pageXOffset + window.innerWidth)
        );
    }
}