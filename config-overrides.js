// config-overrides.js
module.exports = function override(config, env) {
    // Do stuff with the webpack config...
    if (env === 'production') {
      config.output.publicPath = '../';
    }
    return config;
  };  