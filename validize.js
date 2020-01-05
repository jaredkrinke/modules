"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
function createStringValidator(pattern) {
    return function (x) {
        if (typeof (x) === "string" && pattern.test(x)) {
            return x;
        }
        else {
            throw new ValidationError("Invalid string");
        }
    };
}
exports.createStringValidator = createStringValidator;
function createFloatValidator(min, max, coerce) {
    return function (x) {
        let number = undefined;
        if (typeof (x) === "number") {
            number = x;
        }
        else if ((coerce === true) && typeof (x) === "string") {
            number = parseFloat(x);
        }
        if (number !== undefined && !isNaN(number) && number >= min && number <= max) {
            return number;
        }
        else {
            throw new ValidationError("Invalid number");
        }
    };
}
exports.createFloatValidator = createFloatValidator;
function createIntegerValidator(min, max, coerce) {
    const validateFloat = createFloatValidator(min, max, coerce);
    return function (x) {
        const float = validateFloat(x);
        if (float === Math.floor(float)) {
            return float;
        }
        else {
            throw new ValidationError("Invalid integer");
        }
    };
}
exports.createIntegerValidator = createIntegerValidator;
function createValidator(validator) {
    return function (input) {
        if (typeof (input) === "object") {
            let result = {};
            for (let key in input) {
                if (typeof (key) !== "string") {
                    throw new ValidationError("Invalid field");
                }
                const fieldName = key;
                const fieldValidator = validator[fieldName];
                if (!fieldValidator) {
                    throw new ValidationError("Extraneous field");
                }
                result[fieldName] = fieldValidator(input[fieldName]);
            }
            for (let key in validator) {
                if (typeof (key) === "string") {
                    const fieldName = key;
                    if (input[fieldName] === undefined || input[fieldName] === null) {
                        throw new ValidationError("Missing field");
                    }
                }
            }
            return result;
        }
        else {
            throw new ValidationError("Not an object");
        }
    };
}
exports.createValidator = createValidator;
