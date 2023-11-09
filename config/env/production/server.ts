export default ({ env }) => ({
  proxy: true,
  url: env("MY_HEROKU_URL"),
  host: env("HOST"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  postmark: {
    key: env("POSTMARK_API_KEY"),
    email: env("POSTMARK_EMAIL"),
    ttl: env("POSTMARK_INVITE_USER_TOKEN_TTL"),
    inviteTemplate: env("POSTMARK_INVITE_TEMPLATE"),
    helpUrl: env("POSTMARK_HELP_URL"),
  },
});
