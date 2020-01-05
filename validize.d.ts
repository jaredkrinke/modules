export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function createStringValidator(pattern: RegExp): (x: unknown) => string;
export declare function createFloatValidator(min: number, max: number, coerce?: boolean): (x: unknown) => number;
export declare function createIntegerValidator(min: number, max: number, coerce?: boolean): (x: unknown) => number;
export declare type ValidatorMap<T> = {
    [P in keyof T]: (input: unknown) => T[P];
};
export declare function createValidator<T>(validator: ValidatorMap<T>): (input: unknown) => T;
