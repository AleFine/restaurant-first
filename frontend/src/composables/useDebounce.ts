export const useDebounce = () => {
    let timeout: number | null = null;
  
    const debounce = (fn: Function, delay: number) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = window.setTimeout(() => {
        fn();
        timeout = null;
      }, delay);
    };
  
    return {
      debounce
    };
};