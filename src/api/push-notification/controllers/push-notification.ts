/**
 * A set of functions called "actions" for `push-notification`
 */

const { Expo } = require("expo-server-sdk");
import axios from "axios";

export default {
  exampleAction: async (ctx, next) => {
    try {
      const id = ctx.params.id;
      const notes = await axios.get(
        `http://127.0.0.1:1337/api/notes/${id}?populate=localizations`
      );

      console.log(JSON.stringify(notes?.data?.data, null, 2));

      const users = await strapi.db
        .query("plugin::users-permissions.user")
        .findMany({});

      console.log(users);
      let expo = new Expo();

      // Create the messages that you want to send to clients
      let messages = [];

      users
        ?.filter((user) => Boolean(user?.pushToken))
        .map(async (user) => {
          // const note = await strapi.db.query("api::note.note").findOne({
          //   where: {
          //     id: 0,
          //   },
          // });
          if (user?.locale !== "en") {
            const note = notes?.data?.data?.attributes?.localizations.data.find(
              (local) => local.attributes.locale === user?.locale
            );
            // console.log("NOTES", note);
            messages.push({
              to: user?.pushToken,
              sound: "default",
              title: note?.attributes?.title,
              body: note?.attributes?.content,
            });
          } else {
            const note = notes?.data?.data?.attributes;
            messages.push({
              to: user?.pushToken,
              sound: "default",
              title: note?.title,
              body: note?.content,
            });
          }
        });

      // /// TOkens would have to be stored in the backend once a user signs on a accepts notification access
      // const somePushTokens = [
      //   // `ExponentPushToken[E5XFerBjBzprZGJ6QIP_gU]`,
      //   // `ExponentPushToken[wMz9cpGCsifpI6WEtGxFPW]`,
      //   // `ExponentPushToken[WGtruwCi8vSrvifDn3ZqOr]`,
      //   `ExponentPushToken[dId4sXJg-bCM-ODfHugt-G]`,
      // ];
      // for (let pushToken of somePushTokens) {
      //   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      //   // Check that all your push tokens appear to be valid Expo push tokens
      //   if (!Expo.isExpoPushToken(pushToken)) {
      //     console.error(
      //       `Push token ${pushToken} is not a valid Expo push token`
      //     );
      //     continue;
      //   }

      //   // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      //   messages.push({
      //     to: pushToken,
      //     sound: "default",
      //     title: "Don't be like Raheem",
      //     body: "Raheem loves shopping but Raheem is broke.",
      //     data: { withSome: "data" },
      //   });
      // }

      // // The Expo push notification service accepts batches of notifications so
      // // that you don't need to send 1000 requests to send 1000 notifications. We
      // // recommend you batch your notifications to reduce the number of requests
      // // and to compress them (notifications with similar content will get
      // // compressed).
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
};
