/**
 * A set of functions called "actions" for `invite`
 */

import { ROLES } from "../../../constants/user";
export default {
  inviteAdmin: async (ctx, next) => {
    try {
      const { email, firstName, lastName, redirectUrl } = ctx.request.body;
      if (!email || !firstName || !lastName) {
        return ctx.badRequest(
          "Invalid information provided. email, firstName, lastName are all required"
        );
      }
      const user = await strapi
        .service("api::invite.invite")
        //@ts-ignore
        .invite({
          email,
          role: ROLES.ADMIN,
          firstName,
          lastName,
          ctx,
          redirectUrl,
        });

      ctx.body = user;
      return ctx.response;
    } catch (err) {
      ctx.badRequest(err?.message, err?.data);
    }
  },
};
