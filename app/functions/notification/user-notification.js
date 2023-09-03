const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.userNotification = functions
    .region("europe-west1")
    .firestore.document("users/{user_id}/logs/{log_id}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const title = data.title;
      const body = data.message;
      const image = data.image;
      const isRead = data.is_read;
      const timestamp = data.timestamp;
      const unixTimestamp = timestamp.toMillis();
      // Get the device token from the parent document
      const parentRef = snap.ref.parent.parent;
      return parentRef.get().then((parentDoc) => {
        const deviceToken = parentDoc.data().device_token;

        if (deviceToken && deviceToken !== "") {
        // Create the notification payload
          const message = {
            notification: {
              title: title,
              body: body,
              image: image,
            },
            data: {
              is_read: isRead.toString(),
              timestamp: unixTimestamp.toString(),
            },
            token: deviceToken,
          };

          // Send the notification
          return admin.messaging().send(message);
        } else {
          return null;
        }
      });
    });
