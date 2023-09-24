/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.userNotification = functions
    .region("europe-west1")
    .firestore.document("users/{user_id}/logs/{log_id}")
    .onCreate(async (snap, context) => {
      try {
        const data = snap.data();
        const title = replaceFields(data.title, data.doc.name, data.receiver.name, data.sender.name);
        const body = replaceFields(data.message, data.doc.name, data.receiver.name, data.sender.name);
        const image = data.image ? data.image : "";
        const messageType = data.message_type;
        const payload = {
          id: data.id,
          sender: data.sender,
          action: data.action,
          is_read: data.is_read,
          timestamp: data.timestamp,
          doc: data.doc,
          message_type: messageType,
        };
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
              data: JSON.stringify(payload),
            },
            token: deviceToken,
          };
          console.log(message);
          // Send the notification
          return admin.messaging().send(message);
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        throw error;// or handle the error as you see fit
      }
    });

/**
 * Replaces placeholders in a string with provided values.
 *
 * @param {string} str - The string with placeholders.
 * @param {string} docName - The name to replace '[combo]' placeholder.
 * @param {string} receiverName - The name to replace '[receiver]' placeholder.
 * @param {string} senderName - The name to replace '[sender]' placeholder.
 * @return {string} The string with placeholders replaced by provided values.
 */
function replaceFields(str, docName, receiverName, senderName) {
  return str.replace("[doc]", docName).replace("[receiver]", receiverName).replace("[sender]", senderName);
}
