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

declare module 'tools' {
  // Upstream test tools — not used in monorepo context
}

declare module '__mocks__' {
  // Upstream test mocks — not used in monorepo context
}
