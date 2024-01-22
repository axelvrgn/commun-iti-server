import { AxiosError, AxiosPromise } from "axios";
import { AnyResult, Bad, BadResult, Ok } from "./Result";

export function isAxiosError(e: Error): e is AxiosError {
    return (e as AxiosError).isAxiosError;
}

export type AxiosCallback<T> = () => AxiosPromise<T>;

/**
 * Converts the response from Axios to a "Ok" result or "HttpBad" result.
 */
export class AxiosResult {
    /**
     * Takes the response from the given callback, and converts it to a result.
     * @param callback A call to Axios returning a response
     */
    static async from<TResult extends AnyResult>(callback: AxiosCallback<TResult>): Promise<TResult> {
        try {
            const { data } = await callback();
            return Ok(data) as TResult;
        }
        catch (e) {
            const { request, response } = (e as AxiosError<any>);

            // We got the server response
            if (response) {
                // Client error
                if (response.status >= 400 && response.status < 500) return Bad(response.data?.reason, response.data?.value) as TResult;

                // Server error
                throw e;
            }
            // We never got the server response, possibly a network error
            else if (request) throw e;

            // Configuration problem
            throw e;
        }
    }
}
