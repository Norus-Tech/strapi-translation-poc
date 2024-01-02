/**
 * localazy service
 */
import axios from "axios";

export default () => ({
  async isTranslationsNeeded() {
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
      console.dir(project.languages);
      return !project.languages.some((language) => language.sourceChanged > 0);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
