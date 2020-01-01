import * as AwsLambda from "aws-lambda";
export declare function createStringValidator(pattern: RegExp): (x: any) => string;
export declare function createNumberValidator(min: number, max: number): (x: any) => number;
export declare type ValidatorMap<T> = {
    [P in keyof T]: (input: any) => T[P];
};
export declare function createValidator<T>(validator: ValidatorMap<T>): (input: object) => T;
declare type Method = "GET" | "PUT" | "POST" | "DELETE";
export declare function parseTextBody(request: AwsLambda.APIGatewayProxyEvent): object;
export declare function parseQueryString(request: AwsLambda.APIGatewayProxyEvent): object;
export declare type Headers = {
    [header: string]: boolean | number | string;
};
export declare function createEmptyHeaders(): undefined;
export declare function createCorsWildcardHeaders(): Headers;
export interface CreateHandlerOptions<TRequest, TResponse> {
    method?: Method;
    validate: (input: object) => TRequest;
    handle: (record: TRequest) => Promise<TResponse>;
    parse?: (request: AwsLambda.APIGatewayProxyEvent) => object;
    createHeaders?: () => Headers | undefined;
}
export declare function createHandler<TRequest, TResponse>(options: CreateHandlerOptions<TRequest, TResponse>): AwsLambda.APIGatewayProxyHandler;
export {};
