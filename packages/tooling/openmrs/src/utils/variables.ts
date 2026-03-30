export function setEnvVariables(envVariables: Record<string, unknown>) {
  Object.keys(envVariables).forEach((key) => {
    process.env[key] = String(envVariables[key]);
  });
}
