export default {
  routes: [
    {
     method: 'GET',
     path: '/push-notification/:id',
     handler: 'push-notification.exampleAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
