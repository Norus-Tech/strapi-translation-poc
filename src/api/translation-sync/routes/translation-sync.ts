export default {
  routes: [
    {
      method: "GET",
      path: "/translation-sync/track",
      handler: "translation-sync.seedSync",
    },
  ],
};
