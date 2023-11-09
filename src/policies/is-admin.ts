/**
 * Helper function for Policies
 */
// import { validateRole } from "../../functions/utils";
// import { ROLES } from "../constants/user";

// export default async (policyContext, config, { strapi }) => {
//   try {
//     const user = policyContext?.state?.user;
//     if (!user) {
//       return false;
//     }

//     const roles = [ROLES.PROGRAM_ADMIN, ROLES.ADMIN];

//     const response = await Promise.all(
//       roles.map((role) => validateRole(strapi, role, user?.id))
//     );

//     const isAdmin = response.find((value) => value === true);

//     if (isAdmin) {
//       return true;
//     }

//     return false;
//   } catch (error) {
//     return false;
//   }
// };
