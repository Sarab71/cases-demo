type LoadingCallback = (loading: boolean, progress: number) => void;

let listener: LoadingCallback | null = null;

let requestCount = 0;
let completedCount = 0;

export const loadingRef = {
  set: (val: boolean) => {
    if (listener) listener(val, loadingRef.getProgress());
  },

  setProgress: () => {
    if (listener) listener(true, loadingRef.getProgress());
  },

  subscribe: (cb: LoadingCallback) => {
    listener = cb;
  },

  startRequest: () => {
    requestCount++;
    loadingRef.set(true);
  },

  endRequest: () => {
    completedCount++;
    loadingRef.setProgress();
    if (completedCount >= requestCount) {
      // Reset counters after small delay to show 100%
      setTimeout(() => {
        requestCount = 0;
        completedCount = 0;
        loadingRef.set(false);
      }, 300);
    }
  },

  getProgress: () => {
    if (requestCount === 0) return 0;
    return Math.min(100, Math.floor((completedCount / requestCount) * 100));
  },
};
