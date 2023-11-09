import { sanitize } from "@strapi/utils";

export async function validateRole(strapi, roleType, userID) {
  try {
    const localUser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $and: [
            {
              id: userID,
            },
            {
              role: {
                type: roleType,
              },
            },
          ],
        },
        populate: {
          role: true,
        },
      });

    if (!localUser) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
export async function removeSensitiveData(responseData, responseModel, ctx) {
  const { auth } = ctx.state;
  const sanitizeData = await sanitize.contentAPI.output(
    responseData,
    strapi.getModel(responseModel),
    { auth }
  );

  return sanitizeData;
}