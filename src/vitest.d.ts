import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp): T;
    toHaveValue(value: string | number): T;
    toHaveClass(...classNames: string[]): T;
  }
}