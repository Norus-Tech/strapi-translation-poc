// import { removeSensitiveData } from "../../../../functions/utils";
// import { ROLES } from "../../../constants/user";
// import { faker } from "@faker-js/faker";
// import { errors } from "@strapi/utils";
// import crypto from "crypto";
// const { ApplicationError, ValidationError } = errors;
export default {
  //   async findAllUsers(ctx) {
  //     try {
  //       const queries = ctx.query;
  //       const users = await strapi.db
  //         .query("plugin::users-permissions.user")
  //         .findMany({ populate: ["role"], where: queries });

  //       const sanitizeUserData = await removeSensitiveData(
  //         users,
  //         "plugin::users-permissions.user",
  //         ctx
  //       );

  //       return sanitizeUserData;
  //     } catch (err) {
  //       ctx.response.badRequest(err?.message, err?.data);
  //     }
  //   },
  async update(ctx) {
    try {
      //   const { id } = ctx.params;
      console.log("RUNNING");
      const requestBody = ctx.request.body;

      console.log(requestBody);

      const localUser = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { pushToken: requestBody?.pushToken },
        });

      if (!localUser) {
        await strapi.db.query("plugin::users-permissions.user").create({
          data: {
            ...ctx?.request.body,
          },
        });

        ctx.body = { success: true };
        return ctx.response;
      }

      await strapi.db.query("plugin::users-permissions.user").update({
        where: {
          id: localUser?.id,
        },
        data: {
          ...ctx?.request.body,
        },
      });

      ctx.body = { success: true };
      return ctx.response;
    } catch (err) {
        console.log(err);
      ctx.response.badRequest(err?.message, err?.data);
    }
  },
  //   async forgotPassword(ctx) {
  //     try {
  //       const params = ctx.request.body;

  //       // Get User based on identifier
  //       const user = await strapi.db
  //         .query("plugin::users-permissions.user")
  //         .findOne({
  //           where: { email: params?.email?.toLowerCase() },
  //         });
  //       const resetPasswordToken = faker.datatype.number({
  //         min: 10000,
  //         max: 99999,
  //         precision: 1,
  //       }); //crypto.randomBytes(64).toString("hex");
  //       if (user && !user?.blocked) {
  //         try {
  //           const redirectUrl = `${params.redirectUrl}/auth/change-password?code=${resetPasswordToken}`;

  //           // // Send user invation (change password ticket)
  //           await strapi
  //             .service("api::postmark.postmark")
  //             //@ts-ignore
  //             .sendPasswordResetEmail(
  //               redirectUrl,
  //               user,
  //               "password-reset",
  //               "An error occurred while sending reset password email"
  //             );
  //         } catch (error) {
  //           throw new ApplicationError(error?.message);
  //         }

  //         // Update the user.
  //         await strapi
  //           .query("plugin::users-permissions.user")
  //           .update({ where: { id: user.id }, data: { resetPasswordToken } });
  //       }
  //       ctx.body = { success: true, code: resetPasswordToken };
  //     } catch (err) {
  //       ctx.body = err;
  //     }
  //   },
  //   async requestResetPasswordToken(ctx) {
  //     try {
  //       const { email } = ctx?.request.body;

  //       const user = await strapi.db
  //         .query("plugin::users-permissions.user")
  //         .findOne({
  //           where: {
  //             email: email?.toLowerCase(),
  //           },
  //           //@ts-ignore
  //           populate: true,
  //         });

  //       if (!user) {
  //         throw new Error("Invalid email address");
  //       }

  //       const resetPasswordToken = crypto.randomBytes(64).toString("hex");

  //       await strapi
  //         .query("plugin::users-permissions.user")
  //         .update({ where: { id: user.id }, data: { resetPasswordToken } });

  //       ctx.send({ resetToken: resetPasswordToken, role: user.role.type });
  //     } catch (error) {
  //       ctx.response.badRequest(error?.message, error?.data);
  //     }
  //   },
  //   async delete(ctx) {
  //     try {
  //       const { userID } = ctx.params;

  //       const localUser = await strapi.db
  //         .query("plugin::users-permissions.user")
  //         .findOne({
  //           where: {
  //             id: userID,
  //           },
  //         });

  //       if (!localUser) {
  //         ctx.status = 404;
  //         throw new Error(`User with id ${userID} not found`);
  //       }

  //       await strapi.db.query("plugin::users-permissions.user").delete({
  //         where: {
  //           id: userID,
  //         },
  //       });

  //       ctx.body = { success: true };
  //       return ctx.response;
  //     } catch (err) {
  //       ctx.response.badRequest(err?.message, err?.data);
  //     }
  //   },
};
