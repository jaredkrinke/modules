"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Useful definitions
const trace = (process.env.SLAMBDA_TRACE === "1");
const statusCode = {
    ok: 200,
    badRequest: 400,
    internalServerError: 500,
};
// Validation helpers
function createStringValidator(pattern) {
    return function (x) {
        if (typeof (x) === "string" && pattern.test(x)) {
            return x;
        }
        else {
            throw new Error("Invalid string");
        }
    };
}
exports.createStringValidator = createStringValidator;
function createNumberValidator(min, max) {
    return function (x) {
        let number = undefined;
        if (typeof (x) === "number") {
            number = x;
        }
        else if (typeof (x) === "string") {
            number = parseInt(x);
        }
        if (number !== undefined && !isNaN(number) && number >= min && number <= max) {
            return number;
        }
        else {
            throw new Error("Invalid number");
        }
    };
}
exports.createNumberValidator = createNumberValidator;
function createValidator(validator) {
    return function (input) {
        let result = {};
        for (let key in input) {
            if (typeof (key) !== "string") {
                throw new Error("Invalid field");
            }
            const fieldName = key;
            const fieldValidator = validator[fieldName];
            if (!fieldValidator) {
                throw new Error("Extraneous field");
            }
            result[fieldName] = fieldValidator(input[fieldName]);
        }
        for (let key in validator) {
            if (typeof (key) === "string") {
                const fieldName = key;
                if (input[fieldName] === undefined || input[fieldName] === null) {
                    throw new Error("Missing field");
                }
            }
        }
        return result;
    };
}
exports.createValidator = createValidator;
function parseTextBody(request) {
    return JSON.parse(request.body);
}
exports.parseTextBody = parseTextBody;
function parseQueryString(request) {
    return request.queryStringParameters;
}
exports.parseQueryString = parseQueryString;
function createEmptyHeaders() {
    return undefined;
}
exports.createEmptyHeaders = createEmptyHeaders;
function createCorsWildcardHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
    };
}
exports.createCorsWildcardHeaders = createCorsWildcardHeaders;
function createHandler(options) {
    const { validate, handle } = options;
    const method = options.method || "GET";
    const parse = options.parse || parseTextBody;
    const createHeaders = options.createHeaders || createEmptyHeaders;
    return async (event) => {
        try {
            if (event.httpMethod !== method) {
                throw new Error("Incorrect method");
            }
            const request = validate(parse(event));
            try {
                const response = await handle(request);
                return {
                    statusCode: statusCode.ok,
                    headers: createHeaders(),
                    body: JSON.stringify(response),
                };
            }
            catch (err) {
                if (trace) {
                    console.error(err);
                }
                return { statusCode: statusCode.internalServerError, body: "" };
            }
        }
        catch (err) {
            if (trace) {
                console.error(err);
            }
            return { statusCode: statusCode.badRequest, body: "" };
        }
    };
}
exports.createHandler = createHandler;
