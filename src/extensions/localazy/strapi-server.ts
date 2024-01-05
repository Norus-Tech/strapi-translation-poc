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

  plugin.services.localazyUploadService = ({ strapi }) => ({
    async upload(files, config = {}) {
      return await strapi
        .service("api::localazy.localazy")
        .customUpload(files, config, plugin);
    },

    CHUNK_LIMIT: plugin.config.LOCALAZY_PUBLIC_API_LIFTED_LIMITS ? 99900 : 9990,

    splitToChunks(data, CHUNK_LIMIT = null) {
      const chunks = [];
      const keys = Object.keys(data);
      const keysCount = keys.length;
      const localChunkLimit = CHUNK_LIMIT || this.CHUNK_LIMIT;
      const chunksCount = Math.ceil(keysCount / localChunkLimit);
      for (let i = 0; i < chunksCount; i += 1) {
        const chunkStrings = {};
        const from = localChunkLimit * i;
        const to = localChunkLimit * (i + 1);

        const currentKeys = keys.slice(from, to);
        currentKeys.forEach((key) => {
          chunkStrings[key] = data[key];
        });
        chunks.push(chunkStrings);
      }

      return chunks;
    },

    createImportFileRepresentation(
      filename,
      path,
      type,
      sourceLang,
      stringsChunks
    ) {
      const files = [];

      for (const strings of stringsChunks) {
        const file = [
          {
            name: filename,
            path,
            content: {
              type,
              [sourceLang]: {
                ...strings,
              },
            },
          },
        ];
        files.push(file);
      }

      return files;
    },
  });

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
