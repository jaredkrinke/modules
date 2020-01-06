import * as Koa from "koa";
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function createOptionalValidator<T>(validateExistingValue: (x: unknown) => T): (x: unknown) => T;
export declare function createStringValidator(pattern: RegExp): (x: unknown) => string;
export declare function createFloatValidator(min: number, max: number, coerce?: boolean): (x: unknown) => number;
export declare function createIntegerValidator(min: number, max: number, coerce?: boolean): (x: unknown) => number;
export declare function createBooleanValidator(coerce?: boolean): (x: unknown) => boolean;
export declare type ValidatorMap<T> = {
    [P in keyof T]: (input: unknown) => T[P];
};
export declare function createValidator<T>(validator: ValidatorMap<T>): (input: unknown) => T;
export declare function validate(validateInput: (context: Koa.Context) => void): Koa.Middleware;
