const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions
    .region("europe-west1")
    .firestore.document("notifications/{user_id}/logs/{log_id}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const title = data.title;
      const body = data.message;
      const image = data.image;
      const isRead = data.is_read;
      const timestamp = data.timestamp;

      // Get the device token from the parent document
      const parentRef = snap.ref.parent.parent;
      return parentRef.get().then((parentDoc) => {
        const deviceToken = parentDoc.data().device_token;

        // Create the notification payload
        const message = {
          notification: {
            title: title,
            body: body,
            image: image,
          },
          data: {
            is_read: isRead.toString(),
            timestamp: timestamp.toString(),
          },
          token: deviceToken,
        };

        // Send the notification
        return admin.messaging().send(message);
      });
    });

