const config = require('openmrs/default-webpack-config');

module.exports = (env, argv) => {
  const result = typeof config === 'function' ? config(env, argv) : config;

  if (result.plugins) {
    for (let i = 0; i < result.plugins.length; i++) {
      const p = result.plugins[i];
      if (p && p.constructor && p.constructor.name === 'ForkTsCheckerWebpackPlugin') {
        const ForkTsCheckerWebpackPlugin = p.constructor;
        result.plugins[i] = new ForkTsCheckerWebpackPlugin({
          issue: {
            exclude: [
              { severity: 'error', code: 'TS2305' },
              { severity: 'error', code: 'TS2322' },
              { severity: 'error', code: 'TS2339' },
              { severity: 'error', code: 'TS2709' },
              { severity: 'error', code: 'TS2786' },
            ],
          },
        });
        break;
      }
    }
  }

  return result;
};
