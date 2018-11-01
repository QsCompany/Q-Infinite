import { value } from 'json|../assets/Data/Primes.json';
import { collection, bind } from './corelib';
import { sdata } from './System';
import { UI } from './UI';

var $math = Math;
export namespace AI {
    export namespace tools {
        var INFINITY = 1 / 0;
        var argsTag = '[object Arguments]';
        export function isFlattenable(value): boolean {
            return value instanceof Array || String(value) === argsTag;
        }
        export function baseFlatten<T>(array, depth, predicate?: typeof isFlattenable, isStrict?: boolean, result?: Array<T>) {
            var index = -1,
                length = array.length;

            predicate || (predicate = isFlattenable);
            result || (result = []);

            while (++index < length) {
                var value = array[index];
                if (depth > 0 && predicate(value)) {
                    if (depth > 1) {
                        baseFlatten(value, depth - 1, predicate, isStrict, result);
                    } else {
                        result.push(value);
                    }
                } else if (!isStrict) {
                    result[result.length] = value;
                }
            }
            return result;
        }
        export function flattenDeep<T>(array: any[]) {
            var length = array == null ? 0 : array.length;
            return length ? baseFlatten<T>(array, INFINITY) : [];
        }

        export class SegmentRunner {
            public Disposed: Segment[] = [];
            public Last: Segment;
            public Reader: Segment;
            public Writer: Segment;
            public Cursor;
            public Next() {
                var s = this.Reader;
                while (s)
                    if (this.Cursor <= s.End) {
                        return this.Cursor++;
                    }
                    else {
                        this.Disposed.push(s);
                        this.Reader = s = this.Reader.NextSegment;
                    }
                return undefined;
            }
            constructor(start: number, end: number) {
                this.Last = this.Writer = new Segment(null, start, end);
            }

        }
        export class Iterator {
            private runner: SegmentRunner = new SegmentRunner(0, 1999);
            private array = new Array(2000);
            public Read(): number {
                return this.runner.Next();
            }
            public Write() {

            }
        }
        export class Segment {
            public Cursor
            public NextSegment: Segment;
            public constructor(parent: Segment, public Start = 0, public End = 0) {
                if (parent)
                    parent.NextSegment = this;
            }


        }

    }
    export namespace StringSimiarity {

        export interface IRating {
            target: string,
            rating: number
        }

        export interface IRatings {
            ratings: IRating[],
            bestMatch: IRating
        }

        export function compareTwoStrings(str1: string, str2: string): number {
            var result = null;
            result = calculateResultIfIdentical(str1, str2);
            if (result != null) {
                return result;
            }
            result = calculateResultIfEitherIsEmpty(str1, str2);
            if (result != null) {
                return result;
            }
            result = calculateResultIfBothAreSingleCharacter(str1, str2);
            if (result != null) {
                return result;
            }

            var pairs1 = wordLetterPairs<string>(str1.toUpperCase());
            var pairs2 = wordLetterPairs<string>(str2.toUpperCase());
            var intersection = 0;
            var union = pairs1.length + pairs2.length;
            pairs1.forEach(function (pair1) {
                for (var i = 0; i < pairs2.length; i++) {
                    var pair2 = pairs2[i];
                    if (pair1 === pair2) {
                        intersection++;
                        pairs2.splice(i, 1);
                        break;
                    }
                }
            });
            return (2.0 * intersection) / union;

            // private functions ---------------------------
        }

        export function findBestMatch(mainString: string, targetStrings: string[]): IRatings {
            var ratings = targetStrings.map(function (targetString) {
                return <IRating>{
                    target: targetString,
                    rating: compareTwoStrings(mainString, targetString)
                };
            });

            return {
                ratings: ratings,
                bestMatch: bestMatch(ratings)
            };

        }

        export function bestMatch(ratings: IRating[]) {
            var t = undefined;
            var cm = Number.NEGATIVE_INFINITY;
            for (var i = 0; i < ratings.length; i++) {
                var c = ratings[i];
                if (cm < c.rating) {
                    cm = c.rating;
                    t = c;
                }
            }
            return t;
        }

        function letterPairs(str) {
            var numPairs = str.length - 1;
            var pairs = [];
            for (var i = 0; i < numPairs; i++) {
                pairs[i] = str.substring(i, i + 2);
            }
            return pairs;
        }

        function wordLetterPairs<T>(str: string) {
            return tools.flattenDeep<T>(str.split(' ').map(letterPairs));
        }

        function isEdgeCaseWithOneOrZeroChars(str1, str2) {
            if (str1.length == str2.length && str1.length == 1) {
                return true;
            }
            return false;
        }

        function calculateResultIfIdentical(str1, str2) {
            if (str1.toUpperCase() == str2.toUpperCase()) {
                return 1;
            }
            return null;
        }

        function calculateResultIfBothAreSingleCharacter(str1, str2) {
            if (str1.length == 1 && str2.length == 1) {
                return 0;
            }
        }

        function calculateResultIfEitherIsEmpty(str1, str2) {
            // if both are empty strings
            if (str1.length == 0 && str2.length == 0) {
                return 1;
            }

            // if only one is empty string
            if ((str1.length + str2.length) > 0 && (str1.length * str2.length) == 0) {
                return 0;
            }
            return null;
        }

        export function Sort(rattings: IRatings) {
            return rattings.ratings.sort(com);
        }
        function com(a: IRating, b: IRating) {
            return b.rating - a.rating;
        }
    }
    export namespace Math {
        export class GCDExtended {
            public GCD:number;
            public FactorA: number;
            public FactorB: number;
            public constructor(gcd: number, factorA: number, factorB: number) {
                this.SetValues(gcd, factorA, factorB);
            }
            public SetValues(gcd: number, factorA: number, factorB: number): this {
                this.GCD = gcd;
                this.FactorA = factorA;
                this.FactorB = factorB;
                return this;
            }
        }

        /**
         * Calcuate (a*b) mod m 
         * @param a
         * @param b
         * @param m
         */
        export function mul_mod(a: number, b: number, m: number) {
            if (a >= m) a %= m;
            if (b >= m) b %= m;
            return (a + b) % m;
        }
        /**
         * Calcuate (base^exp) mod modulus
         * @param base
         * @param exp
         * @param modulus
         */
        export function PowMod(base: number, exp: number, modulus: number): number {

            base %= modulus;
            var result = 1;
            while (exp > 0) {
                if (exp & 1) result = (result * base) % modulus;
                base = (base * base) % modulus;
                exp >>= 1;
            }
            return result;
        }
        var primes = value as number[];
        export function getRandomPrime(cond: (p) => boolean, maxIndex?: number) {
            var time = performance.now();
            maxIndex || (maxIndex = primes.length - 1);
            do {

                if (performance.now() - time > 5000) throw null;
                var p = primes[$math.floor($math.random() * maxIndex)];
            }
            while (!cond(p))
            return p;
        }
        export function get_common_denom(e: number, PHI: number) {
            var great: number, temp: number, a: number;

            if (e > PHI) {
                while (e % PHI != 0) {
                    temp = e % PHI;
                    e = PHI;
                    PHI = temp;
                }
                great = PHI;
            }
            else {
                while (PHI % e != 0) {
                    a = PHI % e;
                    PHI = e;
                    e = a;
                }
                great = e;
            }
            return great;
        }
        export function GCD(a1: number, b1: number) {
            var a = a1, b = b1;
            while (b) {
                var c = a;
                a = b;
                b = c % b;
            };
            return a;
        };
        export function ExGCD(a1: number, b1: number, rem = 0) {
            var a = a1, b = b1;
            while (b != rem && b) {
                var a1 = a;
                var b1 = b;
                a = b;
                b = a1 % b1;
            };
            return { result: a1, factor: b1, rem: b, x: (a1 - rem) / b1 };
        }

        /*  return array [d, a, b] such that d = gcd(p, q), ap + bq = d */
        export function gcd_extended(p: number, q: number): GCDExtended {
            if (q == 0) return new GCDExtended(p, 1, 0);
            var vals = gcd_extended(q, (p as any).mod(q));
            var b = vals.FactorA - vals.FactorB * $math.floor(p / q);
            return vals.SetValues(vals.GCD, vals.FactorB, b);
        }

        /* Returns true if numerator evenly divides denominator. */
        function divides(numerator: number, denominator: number) {
            if ((numerator as any).mod(denominator) > 0)
                return false;
            return true;
        }

        /** Returns array of solutions to congruence equation
           factor*x = rem (mod modulus). Solutions are sorted */
        export function SolveCongurentEqu(factor: number, rem: number, modulus: number) {
            var m = $math.abs(modulus);
            var a = (factor as any).mod(m);
            var b = (rem as any).mod(m);
            var result_extended = gcd_extended(a, m);
            var solutions = new Array<number>();

            if (!divides(b, result_extended.GCD))
                return solutions;

            var firstSolution = (result_extended.FactorA * (b / result_extended.GCD) as any).mod(m);
            for (var i = 0; i < result_extended.GCD; i++) {
                var otherSolution = (firstSolution + i * (m / result_extended.GCD)).mod(m);
                solutions.push(otherSolution);
            }
            return solutions.sort(function (a, b) { return b - a });
        }
        (Number.prototype as any).mod = function (n) {
            return ((this % n) + n) % n;
        }
    }
    export namespace Encryption {

        export interface ITransform {
            transform(byte: number): number;
            isValideByte(byte: number): boolean;
        }

        export interface RSAKey {
            n: number;
            e: number;
        }
        export interface RSACrypter {
            Encrypter: RSA;
            Decripter: RSA;
        }

        export class RSA implements ITransform {
            constructor(private key: RSAKey) { }
            public transform(byte: number) {
                return Math.PowMod(byte, this.key.e, this.key.n);
            }
            public isValideByte(byte: number) { return byte >= 0 && byte < this.key.n; }
        }
        export class FastRSA implements ITransform {
            private array = [];
            constructor(private key: RSAKey) { }
            public transform(byte: number) {
                return this.array[byte] || (this.array[byte] = Math.PowMod(byte, this.key.e, this.key.n));
            }
            public isValideByte(byte: number) { return byte >= 0 && byte < this.key.n; }
        }
        export function GenerateRSAKey(sourceMaxByte: number, transformedMaxByte: number): RSACrypter {
            var p = Math.getRandomPrime((p) => p > 100, 100);
            var q = Math.getRandomPrime((t) => {
                if (t == p) return false;
                var n1 = t * p;
                if (n1 < sourceMaxByte) return false;
                if (n1 > transformedMaxByte) return false;
                return true;
            }, 100);
            var n = p * q;
            var h = (p - 1) * (q - 1);
            var d;
            var time = performance.now();
            do {
                if (performance.now() - time > 5000) throw null;
                var e = Math.getRandomPrime((p) => p < h && p > 3);
                var sols = Math.SolveCongurentEqu(e, 1, h);
                if (sols.length == 0) continue;
                d = sols[0];
                break;
            } while (true);
            return {
                Decripter: new RSA({ n: n, e: d }),
                Encrypter: new RSA({ n: n, e: e })
            };
        }
        
        export function test(f: Function, iter = 1e4, args: any[]) {
            var deb = performance.now();
            var i = iter;
            while (--i)
                f.apply(null, args);
            return performance.now() - deb;
        }
    }
}

export namespace DataBindingQuee {

    interface IQueeElment {
        owner?: any;
        invoke();
    }

    var quee: IQueeElment[];
    var isexec: boolean = false;

    export function Exec(owner) {
        bind.DObject
    }
}


/*
 * 
 * 
 *
interface colReader {
    v: string;
    i: number;
    e: boolean;
}

interface colReader1 {
    value: string;//value
    cursor: charReader;//charCursor
    EOF: boolean;//EOF
}

interface charReader {
    cursor: number;//index;
    value: string;//char;
    len?: number;//charLength;
    newLine?: boolean;//newLine;
    eof?: boolean;//eof
}
 export class CSV {
    static separator = ';';
    static emptyArray: string[] = Object.freeze([] as string[]) as any;
    private lines: string[];
    public Columns = new collection.Dictionary<string, number>("");

    public static ReadAllLines(s: string): string[] {
        var t: string[] = [];
        var pi = 0;
        var inq = false;
        for (var i = 0; i < s.length; i++) {
            var c = s[i];
            if (c == '\\') { i++; continue; }
            if (c == '"' && s[i - 1] !== '\\') inq = !inq;
            if (inq) continue;
            if (c == '\r') {
                t.push(s.substr(pi, i - pi));
                if (s[i + 1] == '\n')
                    i++;
                pi = i + 1;
            }
        }
        return t;
    }

    private parse(pind: number, s: string) {

    }
    private static nextChar(s: string, pchar: charReader): charReader {
        if (!pchar) pchar = { cursor: 0, value: void 0 };
        else if (pchar.eof) return pchar;
        var start: number = pchar.cursor;
        var i = start;
        var lc: string;
        while (i < s.length) {
            lc = c;
            var c = s[i++];
            if (c === this.separator)
                return { value: c, cursor: i };
            if (c === '"') {
                if (lc !== '\\')
                    return { value: '"', cursor: i - 1 };
            }
            else if (c === '\r') {
                var hasn = s[i] === '\n';
                if (hasn) i++;
                return { value: hasn ? '\r\n' : c, cursor: i, newLine: true, len: hasn ? 2 : 1 };
            }
        }
        return { value: void 0, cursor: s.length, eof: true };
    }
    private static readString1(s: string, stat: charReader):charReader {
        var start = stat.cursor;
        var i = start;
        var lc = s[i];
        if (lc !== '"') return null;

        while (++i < s.length) {
            if (s[i] == '"' && lc !== '\\')
                return { value: s.substring(stat.cursor, i + 1), cursor: i + 1, eof: i == s.length - 1 };
            else
                lc = s[i];
        }
        return { value: s.substring(start), cursor: s.length, eof: true };
    }

    private static readColumn1(s: string, stat: colReader1): colReader1 {
        if (!stat) stat = { EOF: false, cursor: { cursor: 0, value: void 0 }, value: void 0 };
        else if (stat.EOF) return void 0;
        var i = stat.cursor;
        while (true) {
            var nchar = this.nextChar(s, i);
            if (nchar.value === this.separator)
                return { value: s.substring(stat.cursor.cursor, nchar.cursor - 1), EOF: false, cursor: nchar };
            else if (nchar.eof) {
                return { value: s.substr(stat.cursor.cursor), EOF: true, cursor: nchar };
            }
            else if (nchar.newLine)
                return { value: s.substring(stat.cursor.cursor, nchar.cursor - nchar.len), EOF: false, cursor: nchar };
            else if (nchar.value === '"') {
                var t = this.readString1(s, nchar);
                i = t;
            }
        }
        return { value: s.substr(stat.cursor.cursor), cursor: nchar, EOF: true };
    }

    private static readString(s: string, start: number) {
        var i = start;
        var lc = s[i];
        if (lc !== '"') return null;

        while (++i < s.length) {
            if (s[i] == '"' && lc !== '\\')
                return { str: s.substring(start, i + 1), i: i, eof: i == s.length - 1 };
            else
                lc = s[i];
        }
        return { str: s.substring(start), i: s.length - 1, eof: true };
    }

    private static readColumn(s: string, stat: colReader): colReader {
        if (!stat) stat = { e: false, i: 0, v: void 0 };
        if (stat.e) return void 0;
        var i = stat.i;
        while (i < s.length) {
            var is = s.indexOf(this.separator, i);
            var ia = s.indexOf('"', i);
            if (is == -1 && ia == -1) break;
            if (is === -1) is = s.length;
            if (ia === -1) ia = s.length;
            if (is < ia) return { v: s.substring(stat.i, is), i: is + 1, e: false };
            var t = this.readString(s, ia);
            i = t.i + 1;
        }
        return { v: s.substr(stat.i), i: s.length, e: true };
    }

    private static split1(s: string): string[] {
        var cls: string[] = [];
        var p: colReader;
        while (p = this.readColumn(s, p))
            cls.push(p.v);
        return cls;
    }

    static split(s: string, l?: number): string[] {
        if (typeof l !== 'number') return this.split1(s);
        var cls: string[] = new Array<string>(l);
        var p: colReader;
        var i = 0;
        while (p = this.readColumn(s, p))
            cls[i++] = p.v;
        return cls;
    }

    public constructor(file: string, private async: boolean) {
        this.lines = CSV.ReadAllLines(file);
        var cols = CSV.split(this.lines[0]);
        var l = cols.length;
        this.Columns.Clear();
        for (var i = 0; i < l; i++)
            this.Columns.Set(cols[i], i);
        this.Columns.Freeze();
        this.lines.splice(0, 1);
    }
    public get Count() { return this.lines.length; }
    GetRow(row: number): string[] {
        return CSV.split(this.lines[row], this.Columns.Count);
    }
    public Get(row: number, col: string | number) {
        return CSV.split(this.lines[row], this.Columns.Count)[typeof col === 'string' ? this.Columns.Get(col) : col];
    }
    public ColumnName(index: number): string {
        return this.Columns.GetKeyOf(index) || "";
    }
    public ColumnIndex( name:string) { return this.Columns.Get(name); }
    private _index = -1;
    private _current: string[] = void 0;
    public get Index() { return this._index; }
    public Reset() { this._index = -1; return this; }
    public Next() {
        ++this._index;
        var b = this.Index < this.lines.length;
        this._current = b ? CSV.split(this.lines[this._index]) : CSV.emptyArray;
        return b;
    }
    public get Current(): string[] { return this._current; }
    public Field(name_index: string | number) {
        var c = this.Current;
        return c ? this.Current[typeof name_index === 'string' ? this.Columns.Get(name_index) : name_index] : null;
    }
}
  
 */