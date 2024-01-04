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

  plugin.controllers.localazyTransferController["downloadAsync"] = async (
    ctx
  ) => {
    try {
      await strapi
        .plugin("localazy")
        .service("localazyTransferDownloadService")
        .downloadAsync(ctx);

      ctx.body = "Translations successfully downloaded";
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.body = err;
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/getUser",
    handler: "localazyUserController.getUserPublic",
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/download",
    handler: "localazyTransferController.downloadAsync",
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/upload",
    handler: "localazyTransferController.upload",
  });

  return plugin;
};
