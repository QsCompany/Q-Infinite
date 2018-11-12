
export namespace AI {
    var $math = Math;
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
            public GCD: number;
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

        var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863, 3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001];
        export function getRandomPrime(cond: (p) => boolean, maxIndex?: number) {
            var time = performance.now();
            maxIndex || (maxIndex = primes.length - 1);
            do {

                if (performance.now() - time > 5000) throw null;
                var p = primes[($math as any).floor(($math as any).random() * maxIndex)];
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
            var b = vals.FactorA - vals.FactorB * ($math as any).floor(p / q);
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
            var m = ($math as any).abs(modulus);
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
