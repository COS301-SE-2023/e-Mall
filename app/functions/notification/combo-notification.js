/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.ComboActiveUserNotification = functions
    .region("europe-west1")
    .firestore.document("combos/{combo_id}/combo_logs/{log_id}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const title = data.title;
      const body = data.message;
      const image = data.image;
      const isRead = data.is_read;
      const timestamp = data.timestamp;
      const unixTimestamp = timestamp.toMillis();
      const sender = data.sender;
      const target = data.target;
      // Get the list of following users from the parent document
      const parentRef = snap.ref.parent.parent;
      console.log((title,body,isRead,timestamp,sender,target))
      return parentRef.get().then((parentDoc) => {
        const activeUsers = parentDoc.data().active_users;

        if (activeUsers && activeUsers.length > 0) {
          // Get the device tokens of all following users with a single query
          return admin.firestore().collection("users")
              .where(admin.firestore.FieldPath.documentId(), "in", activeUsers)
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
                    type: data.message_type,
                    sender: sender,
                    target: target,
                  },
                  tokens: deviceTokens,
                };
                console.log(message);

                // Send the notification to all device tokens
                return admin.messaging().sendEachForMulticast(message);
              });
        } else {
          return null;
        }
      });
    });
