/**
 * A set of functions called "actions" for `localazy`
 */

export default {
  checkTranslationStatus: async (ctx, next) => {
    try {
      ctx.body = await strapi
        .service("api::localazy.localazy")
        .isTranslationsNeeded();
    } catch (err) {
      ctx.body = err;
      ctx.status = 500;
    }
  },
};
