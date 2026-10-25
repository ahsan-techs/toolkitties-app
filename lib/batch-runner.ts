// Phase 2: High-performance client-side batch processing.
// Runs many async jobs with a concurrency cap and yields back to the
// browser between each one, so dropping 50+ files never freezes the UI
// thread or spikes RAM by doing everything at once (Guardrail 1 & 2).

export async function runBatchJobs<T, R>(
  items: T[],
  concurrency: number,
  job: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await job(items[index], index);
      // Yield to the browser so the UI (and progress updates) can repaint
      // between items instead of the whole batch running in one tick.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  };

  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  const workers = Array.from({ length: workerCount }, worker);
  await Promise.all(workers);
  return results;
}
