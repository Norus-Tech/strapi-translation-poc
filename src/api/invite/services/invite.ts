/**
 * invite service.
 */
import _ from "lodash";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import crypto from "crypto";
import { ROLES, ROLE_INVITE_MESSAGE } from "../../../constants/user";
import utils from "@strapi/utils";

const { sanitize } = utils;
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

type InviteProps = {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  ctx: any;
  redirectUrl: string;
  rest: {};
};

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default ({ strapi: Strapi }) => ({
  async invite({
    email,
    role,
    firstName,
    lastName,
    ctx,
    redirectUrl,
    rest,
  }: InviteProps) {
    try {
      const pluginStore = await strapi.store({
        type: "plugin",
        name: "users-permissions",
      });

      const inviteeDetails = {
        role: role,
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: email,
        ...rest,
      };

      const params = {
        ..._.omit(inviteeDetails, [
          "confirmed",
          "confirmationToken",
          "resetPasswordToken",
        ]),
        provider: "local",
      };

      const userRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: role } });
      if (!userRole) {
        throw Error("Impossible to find the default role");
      }

      // Check if the provided email is valid or not.
      const isEmail = emailRegExp.test(params.email);

      if (isEmail) {
        params.email = params.email.toLowerCase();
      } else {
        throw new Error("Please provide a valid email address");
      }

      params.role = userRole.id;

      let user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email: params.email },
      });

      if (user?.confirmed) {
        throw new Error("User already exists and is verified");
      } else if (!user) {
        user = await getService("user").add(params);
      } else {
        user = await getService("user").edit(user?.id, params);
      }

      try {
        const sanitizedUser = await sanitizeUser(user, ctx);

        const confirmationToken = crypto.randomBytes(20).toString("hex");

        await strapi.entityService.update(
          "plugin::users-permissions.user",
          user.id,
          {
            data: {
              confirmationToken: confirmationToken,
            },
            populate: ["role"],
          }
        );

        const url = `${redirectUrl}/auth/confirmEmail?confirmation=${confirmationToken}&email=${user.email}`;

        // Send user invitation (change password ticket)
        await strapi
          .service("api::postmark.postmark")
          //@ts-ignore
          .sendUserInviteEmail(
            url,
            sanitizedUser,
            "invitation",
            "An error occurred while sending user invitation, but user was successfully created",
            ROLE_INVITE_MESSAGE[role],
            ROLES[userRole?.type]
          );

        return { user: sanitizedUser };
      } catch (err) {
        if (_.includes(err.message, "username")) {
          strapi.log.error(err);
          throw new Error("Username already taken");
        } else if (_.includes(err.message, "email")) {
          throw new Error("Email already taken");
        } else {
          strapi.log.error(err);
          throw new Error("An error occurred during account creation");
        }
      }
    } catch (error) {
      if (
        error.message.includes("validation") ||
        error.message.includes("Validation") ||
        error.message.includes("VALIDATION")
      ) {
        throw new Error(
          `An error occurred while trying to invite user using email: ${email}`
        );
      } else {
        throw new Error(error?.message);
      }
    }
  },
});
