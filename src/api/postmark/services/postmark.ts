// import { ServerClient } from "postmark";
// import utils from "@strapi/utils";

// const postmarkClient = new ServerClient(
//   strapi.config.get("server.postmark.key")
// );
// const postmarkEmail = strapi.config.get("server.postmark.email");
// const { ApplicationError, ValidationError } = utils.errors;

// export default () => ({
//   message(recipientEmail: string, templateAlias: string, templateModel) {
//     return {
//       From: postmarkEmail,
//       To: recipientEmail,
//       TemplateAlias: templateAlias,
//       TemplateModel: templateModel,
//     };
//   },
//   async sendEmail(emailData, template) {
//     let messageSent: boolean = false;
//     try {
//       const notificationTemplate = this.message(emailData.email, template, {
//         ...emailData,
//         helpUrl: strapi.config.get("server.postmark.helpUrl"),
//       });

//       await postmarkClient.sendEmailWithTemplate(notificationTemplate);
//       messageSent = true;
//     } catch (error) {
//       console.log(
//         `An error occurred when sending user invite: ${JSON.stringify(
//           emailData
//         )}\nError: ${error}`
//       );
//       throw new Error(error);
//     }

//     return messageSent;
//   },
//   async sendUserInviteEmail(
//     redirectUrl,
//     user,
//     requestType,
//     appErrorMessage,
//     roleBasedMessage,
//     userRoleType
//   ) {
//     // Send user invitation (change password ticket)
//     const notificationInvite = {
//       firstName: user?.firstName,
//       lastName: user?.lastName,
//       email: user?.email,
//       redirectUrl: redirectUrl,
//       inviteIntroEndingLine: roleBasedMessage,
//     };

//     try {
//       await this.sendEmail(
//         notificationInvite,
//         strapi.config.get("server.postmark.inviteTemplate")
//       );
//     } catch (error) {
//       throw new ApplicationError(appErrorMessage);
//     }
//   },
//   async sendPasswordResetEmail(
//     redirectUrl,
//     user,
//     requestType,
//     appErrorMessage
//   ) {
//     // Send user invitation (change password ticket)
//     const notificationResetPassword = {
//       firstName: user?.firstName,
//       lastName: user?.lastName,
//       email: user?.email,
//       action_url: redirectUrl,
//     };

//     try {
//       await this.sendEmail(notificationResetPassword, "password-reset");
//     } catch (error) {
//       throw new ApplicationError(appErrorMessage);
//     }
//   },
// });
