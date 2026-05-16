/// <reference types="vitest" />

declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare const require: {
  (moduleName: string): any;
  context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string) => any;
};

declare var spaBase: string;
declare function getOpenmrsSpaBase(): string;
