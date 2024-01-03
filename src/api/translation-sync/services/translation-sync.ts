/**
 * translation-sync service
 */

import { factories } from "@strapi/strapi";
import axios from "axios";

export default factories.createCoreService(
  "api::translation-sync.translation-sync",
  ({ strapi }) => ({
    async seedSyncStatus() {
      try {
        const localazyUser = await strapi
          .plugin("localazy")
          .service("localazyUserService")
          .getUser();

        const [{ data: localazyProjects }, { data: localazyFiles }] =
          await Promise.all([
            axios.get(`https://api.localazy.com/projects?languages=true`, {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${localazyUser.accessToken}`,
              },
            }),
            axios.get(
              `https://api.localazy.com/projects/${localazyUser.project.id}/files`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${localazyUser.accessToken}`,
                },
              }
            ),
          ]);

        const project = localazyProjects.find(
          (localazyProject) => localazyProject.id == localazyUser.project.id
        );

        const strapiFileId = localazyFiles.find(
          (file) => file.name == "strapi.json"
        ).id;

        await Promise.all(
          project.languages.map(async (language) => {
            const { data: localazyFileContent } = await axios.get(
              `https://api.localazy.com/projects/${localazyUser.project.id}/files/${strapiFileId}/keys/${language.code}?extra_info=true`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${localazyUser.accessToken}`,
                },
              }
            );

            for (const key of localazyFileContent.keys) {
              const translationSync = await strapi.db
                .query("api::translation-sync.translation-sync")
                .findMany({
                  where: {
                    $and: [
                      {
                        keyId: key.id,
                      },
                      {
                        locale: language.code,
                      },
                    ],
                  },
                });

              if (translationSync.length == 0) {
                await strapi.db
                  .query("api::translation-sync.translation-sync")
                  .create({
                    data: {
                      keyId: key.id,
                      locale: language.code,
                      vid: key.vid.toString(),
                    },
                  });
              } else {
                await strapi.db
                  .query("api::translation-sync.translation-sync")
                  .update({
                    where: {
                      id: translationSync[0].id,
                    },
                    data: {
                      vid: key.vid.toString(),
                    },
                  });
              }
            }
          })
        );
        return true;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  })
);
