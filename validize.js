"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Arrays
const badRequest = 400;
const trace = (((_b = (_a = process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.VALIDIZE_TRACE) === "1");
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
function createOptionalValidator(validateExistingValue) {
    return function (x) {
        if (x === undefined) {
            return undefined;
        }
        else {
            return validateExistingValue(x);
        }
    };
}
exports.createOptionalValidator = createOptionalValidator;
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
function createBooleanValidator(coerce) {
    return function (x) {
        if (typeof (x) === "boolean") {
            return x;
        }
        else if (coerce === true && typeof (x) === "string") {
            if (x === "true") {
                return true;
            }
            else if (x === "false") {
                return false;
            }
        }
        throw new ValidationError("Invalid Boolean");
    };
}
exports.createBooleanValidator = createBooleanValidator;
function createValidator(validator) {
    return function (input) {
        if (typeof (input) === "object") {
            let result = {};
            for (let key in validator) {
                const fieldName = key;
                const validatedValue = validator[fieldName](input[fieldName]);
                if (validatedValue !== undefined) {
                    result[fieldName] = validatedValue;
                }
            }
            for (let key in input) {
                if (typeof (key) !== "string") {
                    throw new ValidationError("Invalid field");
                }
                const fieldName = key;
                if (validator[fieldName] === undefined) {
                    throw new ValidationError("Extraneous field");
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
function validate(validateInput) {
    return async function (context, next) {
        try {
            validateInput(context);
        }
        catch (err) {
            if (trace) {
                console.error(err);
            }
            context.status = badRequest;
            context.body = "";
            return;
        }
        return await next();
    };
}
exports.validate = validate;
