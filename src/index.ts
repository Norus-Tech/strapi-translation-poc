import { Strapi } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Strapi }) {
    strapi.sanitizers;
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await loadUserRoles(strapi);
  },
};

const loadUserRoles = async (strapi) => {
  const data = [
    {
      name: "Admin",
      description: "admin",
      type: "admin",
    },
  ];

  await Promise.all(
    data.map(async (role) => {
      const roleExists = await strapi.db
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: role.type } });

      if (!roleExists) {
        await strapi.db.query("plugin::users-permissions.role").create({
          data: role,
        });
      }
    })
  );
  console.log("---Roles Loaded---");
};
