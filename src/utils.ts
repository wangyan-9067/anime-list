let debounceTimer: NodeJS.Timeout;

export function debounce(func: Function, timeout = 500){
    return (...args: any) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(null, args);
        }, timeout);
    };
}