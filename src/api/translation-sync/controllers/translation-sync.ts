/**
 * translation-sync controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::translation-sync.translation-sync",
  ({ strapi }) => ({
    async seedSync(ctx) {
      try {
        await strapi
          .service("api::translation-sync.translation-sync")
          .seedSyncStatus();

        ctx.body = "Successfully seeded sync data";
      } catch (err) {
        ctx.status = 500;
        ctx.body = err;
      }
    },
  })
);
