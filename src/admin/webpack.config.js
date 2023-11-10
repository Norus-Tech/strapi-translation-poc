'use strict';

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config
  //config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: false,
        http: false,
        fs: false,
        zlib: false,
        https: false,
        stream: false,
        path: false,
        timers: false,
        tls: false,
        net: false,
        url: false,
        querystring: false
      },
    }
  };
};
