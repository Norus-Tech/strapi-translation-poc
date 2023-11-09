import { getService } from "@strapi/plugin-users-permissions/server/utils";
import _ from "lodash";
import utils from "@strapi/utils";
import { validateCallbackBody } from "@strapi/plugin-users-permissions/server/controllers/validation/auth";
import validator from "validator";
const { ApplicationError, ValidationError } = utils.errors;
const { sanitize } = utils;

/**
 * Please change the jwt token expiry field based on project requirements
 */


const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;
  return sanitize.contentAPI.output(user, schema, { auth });
};

const removeSensitiveData = async (user, ctx) => {
  const { role } = user;
  const sanitizedUser = await sanitizeOutput(user, ctx);
  return { ...sanitizedUser, role };
};

const generateJWT = (ctx) => {
  const newJwt = strapi.plugins["users-permissions"].services.jwt.issue(
    {
      id: ctx.state.user.id,
    },
    { expiresIn: "30d" }
  );
  return { jwt: newJwt };
};

export default (plugin) => {
  plugin.controllers.auth.refreshToken = (ctx) => {
    return generateJWT(ctx);
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/refresh",
    handler: "auth.refreshToken",
    config: {
      prefix: "",
    },
  });

  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });

    if (provider === "local") {
      if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
        throw new ApplicationError("This provider is disabled");
      }

      await validateCallbackBody(params);

      const query: any = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = validator.isEmail(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: query, populate: true });

      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        throw new ApplicationError("Your account email is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        throw new ApplicationError(
          "This user never set a local password, please login with the provider used during account creation"
        );
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      } else {
        ctx.send({
          jwt: getService("jwt").issue(
            {
              id: user.id,
            },
            { expiresIn: "30d" }
          ),
          user: await removeSensitiveData(user, ctx),
        });
      }
    } else {
      if (!_.get(await store.get({ key: "grant" }), [provider, "enabled"])) {
        throw new ApplicationError("This provider is disabled");
      }
    }
  };

  return plugin;
};
