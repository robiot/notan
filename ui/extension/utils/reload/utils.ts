export function debounce<A extends unknown[]>(callback: (...arguments_: A) => void, delay: number) {
  let timer: NodeJS.Timeout;

  return function (...arguments_: A) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...arguments_), delay);
  };
}
