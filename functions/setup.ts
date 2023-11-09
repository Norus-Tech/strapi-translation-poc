import strapi from "@strapi/strapi";
let instance;
export async function setupStrapi() {
  if (!instance) {
    instance = await strapi({ distDir: "./dist" }).load();
    await instance.server.mount();
  }
  return instance;
}
