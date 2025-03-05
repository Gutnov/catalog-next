export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: number | undefined;

    return (...args: Parameters<T>) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
            func(...args);
        }, delay);
    };
};