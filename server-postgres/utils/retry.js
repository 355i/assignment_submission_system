// utils/retry.js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function retry(fn, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying database connection (${i + 1}/${retries})...`);
      await sleep(delay);
    }
  }
}
