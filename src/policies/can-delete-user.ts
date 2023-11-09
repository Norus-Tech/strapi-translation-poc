/**
 * Code sample of a custom policy. Please read doc for updated changes.
 */
// import { validateRole } from "../../functions/utils";
// import { ROLES } from "../constants/user";

// export default async (policyContext, config, { strapi }) => {
//   try {
//     const user = policyContext?.state?.user;

//     const userID = policyContext?.params?.userID;

//     if (!user) {
//       return false;
//     }

//     const queriedUser = await strapi.db
//       .query("plugin::users-permissions.user")
//       .findOne({
//         where: {
//           id: userID,
//         },
//         populate: {
//           role: true,
//         },
//       });

//     const isAdmin = await validateRole(strapi, ROLES.ADMIN, user?.id);
//     const isProgramAdmin = await validateRole(
//       strapi,
//       ROLES.PROGRAM_ADMIN,
//       user?.id
//     );

//     if (isAdmin) {
//       const canDeleteRoles = [ROLES.PROGRAM_ADMIN, ROLES.ADMIN];
//       if (canDeleteRoles.includes(queriedUser?.role?.type)) {
//         return true;
//       }
//     } else if (isProgramAdmin) {
//       const canDeleteRoles = [ROLES.PROGRAM_ADMIN];
//       if (canDeleteRoles.includes(queriedUser?.role?.type)) {
//         return true;
//       }
//     } else {
//       return false;
//     }

//     return false;
//   } catch (error) {
//     return false;
//   }
// };
