module.exports = (plugin) => {
  console.dir(plugin.controllers.localazyTransferController.download);

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
