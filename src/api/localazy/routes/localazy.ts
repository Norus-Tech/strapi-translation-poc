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
  ],
};
