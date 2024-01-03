export default {
  routes: [
    {
      method: "GET",
      path: "/localazy/translation-status",
      handler: "localazy.checkTranslationStatus",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/localazy/sync-status",
      handler: "localazy.checkSyncStatus",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
