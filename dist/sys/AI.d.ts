export declare namespace AI {
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
