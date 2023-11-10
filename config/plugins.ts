module.exports = ({ env }) => ({
  // ...
  "config-sync": {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      soft: false,
      importOnBootstrap: true,
      customTypes: [],
      excludedTypes: [],
      excludedConfig: [
        "core-store.plugin_users-permissions_grant",
        "core-store.plugin_upload_metrics",
        "core-store.strapi_content_types_schema",
        "core-store.ee_information",
      ],
    },
  },
  localazy: {
    config: {
      /**
       * both options may help guard against DoS attacks
       * if `populateMaxDepth` < 5; the Localazy Strapi Plugin may not work as expected
       */
      populateDefaultDepth: 5, // default is 5
      populateMaxDepth: 10, // default is 10
    },
  },
});
