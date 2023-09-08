const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.userNotification = functions
    .region("europe-west1")
    .firestore.document("users/{user_id}/logs/{log_id}")
    .onCreate(async (snap, context) => {
      try {
        const data = snap.data();
        if (data.message_type !== "wishlist") {
          const title = data.title;
          const body = data.message;
          const image = data.image;
          const isRead = data.is_read;
          const timestamp = data.timestamp;
          const unixTimestamp = timestamp.toMillis();
          // Get the device token from the parent document
          const parentRef = snap.ref.parent.parent;
          const parentDoc = await parentRef.get();
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
                id: data.id,
                is_read: isRead,
                timestamp: unixTimestamp.toString(),
              },
              token: deviceToken,
            };

            // Send the notification
            return admin.messaging().send(message);
          } else {
            return null;
          }
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        throw error;// or handle the error as you see fit
      }
    });
