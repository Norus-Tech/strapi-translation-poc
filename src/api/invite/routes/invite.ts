export default {
  routes: [
    {
      method: "POST",
      path: "/invite/admin",
      handler: "invite.inviteAdmin",
      config: {
        description: "Invite admin to join the platform",
        policies: [],
        middlewares: [],
      },
    },
  ],
};
