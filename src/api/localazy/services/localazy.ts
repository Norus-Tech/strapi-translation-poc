/**
 * localazy service
 */
import axios from "axios";

export default () => ({
  async translationsNeeded() {
    try {
      const localazyUser = await strapi
        .plugin("localazy")
        .service("localazyUserService")
        .getUser();

      const { data: localazyProjects } = await axios.get(
        `https://api.localazy.com/projects?languages=true`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${localazyUser.accessToken}`,
          },
        }
      );
      const project = localazyProjects.find(
        (localazyProject) => localazyProject.id == localazyUser.project.id
      );
      console.dir(project);
      const missingTranslations = {};

      for (const language of project.languages) {
        if (
          language.sourceChanged > 0 ||
          project.sourceLanguage > language.active ||
          project.languages[0].active > language.active
        ) {
          missingTranslations[language.name] = Math.abs(
            language.sourceChanged ||
              project.sourceLanguage - language.active ||
              project.languages[0].active - language.active
          );
        }
      }

      return missingTranslations;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  async isSyncNeeded() {
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

      for (const language of project.languages) {
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

          if (
            translationSync.length == 0 ||
            translationSync[0].vid !== key.vid.toString()
          )
            return true;
        }
      }

      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
