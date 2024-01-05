/**
 * localazy service
 */
import axios from "axios";
import translate from "translate-google";
import { delay, getLocalazyApi } from "../functions/functions";

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
  async customUpload(files, config = {}, plugin) {
    let ret: any = {
      success: false,
      message: "No data was uploaded",
    };

    try {
      const user = await strapi
        .plugin("localazy")
        .service("localazyUserService")
        .getUser();

      const { data: localazyProjects } = await axios.get(
        `https://api.localazy.com/projects?languages=true`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const project = localazyProjects.find(
        (localazyProject) => localazyProject.id == user.project.id
      );

      for (let file of files) {
        const LocalazyApi = await getLocalazyApi(
          user,
          plugin.config.LOCALAZY_PUBLIC_API_URL
        );

        // replace .en | "en" with the default language!
        for (const key of Object.keys(file[0].content.en)) {
          for (const language of project.languages) {
            //translate ${key} to ${language.code}
            if (language.code == "en") continue;
            let translatedText = "UNSUPPORTED_TRANS";
            try {
              translatedText = await translate(file[0].content.en[key], {
                from: "en",
                to: language.code,
              });
            } catch (err) {}

            if (file[0]?.content[language?.code]) {
              file[0].content[language.code][key] = translatedText;
            } else {
              file[0].content[language.code] = {
                [key]: translatedText,
              };
            }
          }
        }

        const result = await LocalazyApi.import({
          projectId: user.project.id,
          files: file,
          ...config,
        });
        await delay();
        ret = {
          success: true,
          result: result.result,
        };
      }
      return ret;
    } catch (e) {
      strapi.log.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  },
});
