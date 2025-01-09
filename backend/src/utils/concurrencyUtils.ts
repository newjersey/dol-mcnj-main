/**
 * Processes a list of items in batches with limited concurrency and exponential backoff for retries.
 *
 * @param items - The list of items to process.
 * @param processFn - A function that processes a single item.
 * @param concurrencyLimit - Maximum number of concurrent executions.
 * @param retries - Maximum number of retries for each item.
 * @param initialDelay - Initial delay in milliseconds for backoff.
 * @returns A promise resolving to the results of all processed items.
 */
export const processInBatches = async <T>(
    items: string[],
    processFn: (item: string) => Promise<T>,
    concurrencyLimit = 3,
    retries = 3,
    initialDelay = 1000
): Promise<T[]> => {
    // Dynamically import p-limit
    const { default: pLimit } = await import("p-limit");
    const limit = pLimit(concurrencyLimit);

    const results = await Promise.allSettled(
        items.map((item) =>
            limit(async () => {
                let attempt = 0;
                let delay = initialDelay;

                while (attempt <= retries) {
                    try {
                        return await processFn(item);
                    } catch (error) {
                        attempt++;
                        if (attempt > retries) {
                            throw error;
                        }
                        console.warn(
                            `Error processing item "${item}" (Attempt ${attempt}/${retries}). Retrying in ${delay}ms...`
                        );
                        await new Promise((resolve) => setTimeout(resolve, delay));
                        delay *= 2;
                    }
                }
            })
        )
    );

    return results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<T>).value);
};
