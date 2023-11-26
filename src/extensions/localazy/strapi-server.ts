module.exports = (plugin) => {
  plugin.controllers.localazyUserController["getUserPublic"] = async (ctx) => {
    const user = await strapi
      .plugin("localazy")
      .service("localazyUserService")
      .getUser();

    ctx.body = {
      project: user.project,
    };
  };

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/getUser",
    handler: "localazyUserController.getUserPublic",
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/download",
    handler: "localazyTransferController.download",
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/upload",
    handler: "localazyTransferController.upload",
  });

  return plugin;
};
