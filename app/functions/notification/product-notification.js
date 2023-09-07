/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.productNotification = functions
    .region("europe-west1")
    .firestore.document("products/{product_id}/logs/{log_id}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const title = data.title;
      const body = data.message;
      const image = data.image;
      const isRead = data.is_read;
      const timestamp = data.timestamp;
      const unixTimestamp = timestamp.toMillis();
      // Get the list of following users from the parent document
      const parentRef = snap.ref.parent.parent;
      return parentRef.get().then((parentDoc) => {
        const followingUsers = parentDoc.data().wishlisted_users;

        if (followingUsers && followingUsers.length > 0) {
          // Get the device tokens of all following users with a single query
          return admin.firestore().collection("users")
              .where(admin.firestore.FieldPath.documentId(), "in", followingUsers)
              .get()
              .then((querySnapshot) => {
                const deviceTokens = querySnapshot.docs.map((doc) => doc.data().device_token);

                // Create the notification payload
                const message = {
                  notification: {
                    title: title,
                    body: body,
                    image: image,
                  },
                  data: {
                    id: data.id,
                    is_read: isRead.toString(),
                    timestamp: unixTimestamp.toString(),
                  },
                  tokens: deviceTokens,
                };

                // Send the notification to all device tokens
                return admin.messaging().sendEachForMulticast(message);
              });
        } else {
          return null;
        }
      });
    });
