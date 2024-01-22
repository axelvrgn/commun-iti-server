import { BadResult, Ok, OkVal } from "./Result";

export type HttpOk<TValue = undefined> = TValue;
export type HttpBad<T extends BadResult> = T;

/**
 * A HttpResult represents the result returned from a REST api.
 */
export class HttpResult {
    private constructor() {}

    /**
     * Converts a "Ok" result to its HTTP representation.
     * @param result The result object.
     */
    static fromOk(result: Ok): HttpOk;
    static fromOk<TValue>(result: OkVal<TValue>): HttpOk<TValue>;
    static fromOk<TValue>(result: Ok | OkVal<TValue>): HttpOk<TValue | undefined> {
        if (result.hasValue) return result.value;
        else return undefined;
    }

    /**
     * Converts a "Bad" result to its HTTP representation.
     * @param result The result object.
     */
    static fromBad<T extends BadResult>(result: T): HttpBad<T> {
        return result;
    }
}
