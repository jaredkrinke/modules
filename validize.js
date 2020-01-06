"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Arrays
const ok = 200;
const badRequest = 400;
const notFound = 404;
const internalServerError = 500;
const trace = (((_b = (_a = process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.VALIDIZE_TRACE) === "1");
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
function createOptionalValidator(validateExistingValue) {
    return function (x) {
        if (x === undefined || x === null) {
            return undefined;
        }
        else if (validateExistingValue !== undefined) {
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
const validateEmpty = createValidator({});
function handle(options) {
    // Note: Assuming no next middleware
    const validateRouteParameters = options.validateParameters || validateEmpty;
    const validateRequestQuery = options.validateQuery || validateEmpty;
    const validateRequestBody = options.validateBody || validateEmpty;
    return async function (context) {
        var _a, _b;
        // Validate input
        try {
            const validatedInput = {
                parameters: validateRouteParameters(context.params),
                query: validateRequestQuery(context.query),
                body: validateRequestBody(((_b = (_a = context) === null || _a === void 0 ? void 0 : _a.request) === null || _b === void 0 ? void 0 : _b.body) || {})
            };
            // Process the validated input
            try {
                const response = await options.process(validatedInput, context);
                if (response === undefined) {
                    context.body = "";
                }
                else {
                    context.body = JSON.stringify(response);
                }
                context.status = ok;
            }
            catch (e) {
                // Report errors
                context.body = "";
                if (e instanceof NotFoundError) {
                    context.status = notFound;
                }
                else if (e instanceof ValidationError) {
                    context.status = badRequest;
                }
                else {
                    context.status = internalServerError;
                }
                if (trace) {
                    console.error(`Failed (${context.stats}): ${e.message}`);
                }
            }
        }
        catch (e) {
            if (trace) {
                console.error(`Validation failed: ${e.message}`);
            }
            context.status = badRequest;
            context.body = "";
        }
    };
}
exports.handle = handle;
