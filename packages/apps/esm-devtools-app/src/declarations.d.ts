declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

declare global {
  var importMapOverrides: import('./devtools/import-map-overrides.types').ImportMapOverridesApi;
}

export {};
