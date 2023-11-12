export const debounce = (func: (arg: any) => void, delay: number = 1000) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay);
  };
};