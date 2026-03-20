import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toBeInTheDocument(): T;
      toBeDisabled(): T;
      toBeEnabled(): T;
      toBeEmpty(): T;
      toBeEmptyDOMElement(): T;
      toBeInvalid(): T;
      toBeRequired(): T;
      toBeValid(): T;
      toBeVisible(): T;
      toContainElement(element: Element | null): T;
      toContainHTML(html: string): T;
      toHaveAccessibleDescription(description?: string | RegExp): T;
      toHaveAccessibleName(name?: string | RegExp): T;
      toHaveAttribute(attr: string, value?: string | RegExp): T;
      toHaveClass(...classNames: string[]): T;
      toHaveFocus(): T;
      toHaveFormValues(values: Record<string, any>): T;
      toHaveStyle(css: Record<string, any>): T;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): T;
      toHaveValue(value?: string | string[] | number): T;
      toHaveDisplayValue(value?: string | string[]): T;
      toBeChecked(): T;
      toBePartiallyChecked(): T;
      toHaveErrorMessage(message?: string | RegExp): T;
    }
  }
}