/* eslint-disable @typescript-eslint/no-explicit-any */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { en as mockEnContent } from "./locales/en";

type tOptions = { count?: number; [key: string]: any };

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    const resolvePath = (path: string | string[], obj: any, separator = "."): string => {
      const properties = Array.isArray(path) ? path : path.split(separator);
      return properties.reduce((prev, curr) => prev && prev[curr], obj);
    };

    const replaceBetween = (
      startIndex: number,
      endIndex: number,
      original: string,
      insertion: string
    ): string => {
      const result = original.substring(0, startIndex) + insertion + original.substring(endIndex);
      return result;
    };

    return {
      t: (keyString: string, options: tOptions | undefined) => {
        if (options != null && options.count != null) {
          keyString = options.count === 1 ? `${keyString}_one` : `${keyString}_other`;
        }

        let resolvedValue = resolvePath(keyString, mockEnContent);
        while (resolvedValue != null && resolvedValue.includes("{{") && options != null) {
          const startIndex = resolvedValue.indexOf("{{");
          const endIndex = resolvedValue.indexOf("}}");

          const currentArg = resolvedValue.substring(startIndex + 2, endIndex);
          const value = options[currentArg];

          resolvedValue = replaceBetween(startIndex, endIndex + 2, resolvedValue, value);
        }

        return resolvedValue;
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  Trans: ({ children }: { children: any }) => children,
}));
