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
    const results: Array<T | Error> = []; // Explicitly type results to include Error
    const activePromises: Promise<void>[] = [];
    let currentIndex = 0;

    const executeWithRetries = async (item: string): Promise<T> => {
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
                delay *= 2; // Exponential backoff
            }
        }
        throw new Error(`Failed to process item "${item}" after ${retries} retries.`);
    };

    const worker = async (): Promise<void> => {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            try {
                results[index] = await executeWithRetries(items[index]);
            } catch (error) {
                results[index] = error as Error; // Explicitly type error
            }
        }
    };

    // Initialize workers
    for (let i = 0; i < concurrencyLimit; i++) {
        activePromises.push(worker());
    }

    await Promise.all(activePromises);

    // Filter out errors and return successful results
    return results.filter((result): result is T => !(result instanceof Error));
};

