/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.ComboActiveUserNotification = functions
    .region("europe-west1")
    .firestore.document("combos/{combo_id}/combo_logs/{log_id}")
    .onCreate(async (snap, context) => {
      const data = snap.data();
      const users = await getTargetUsers(snap, data);
      // Get the list of following users from the parent document
      return sendNotification(users, data);
    });
/**
 * Retrieves the target users from the parent document and the data.
 * @param {Object} snap - The snapshot of the document that triggered the function.
 * @param {Object} data - The data for the notification.
 * @return {Promise<Array>} A promise that resolves with the list of target users.
 */
async function getTargetUsers(snap, data) {
  let users = [];
  // Get the list of following users from the parent document
  const parentRef = snap.ref.parent.parent;
  const parentDoc = await parentRef.get();
  const activeUsers = parentDoc.data().active_users;
  const pendingUsers = parentDoc.data().pending_users;
  // If "active_users" is in targets, add the active users from the parent document
  if (data.targets.includes("active_users")) {
    users = [...users, ...activeUsers];
  }
  // If "pending_users" is in targets, add the pending users from the parent document
  if (data.targets.includes("pending_users")) {
    users = [...users, ...pendingUsers];
  }
  // Add the rest of the target users to the users array
  const otherUsers = data.targets.filter((user) => user !== "active_users" && user !== "pending_users");
  users = [...users, ...otherUsers];
  return users;
}
/**
 * Builds the notification message payload.
 * @param {Object} data - The data for the notification.
 * @param {Array} deviceTokens - The device tokens to send the notification to.
 * @return {Object} The notification payload.
 */
function buildMessage(data, deviceTokens) {
  const id = data.id;
  const isRead = data.is_read;
  const timestamp = data.timestamp;
  const unixTimestamp = timestamp.toMillis();
  const sender = data.sender;
  const action = data.action;
  const title = data.title;
  const body = data.message;
  const image = data.image;

  const payload = {
    notification: {
      title: title,
      body: body,
      image: image,
    },
    data: {
      id: id,
      is_read: isRead.toString(),
      timestamp: unixTimestamp.toString(),
      type: "combo",
      action: action,
      sender: sender,
    },
    tokens: deviceTokens,
  };
  return payload;
}

/**
 * Retrieves the device tokens for a list of users.
 * @param {Array} users - The users to retrieve device tokens for.
 * @return {Promise<Array>} A promise that resolves with the list of device tokens.
 */
function getDeviceTokens(users) {
  return admin.firestore().collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", users)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data().device_token);
      });
}

/**
 * Sends a notification to a list of users.
 * @param {Array} users - The users to send the notification to.
 * @param {Object} data - The data for the notification.
 * @return {Promise} A promise that resolves when the notification has been sent.
 */
function sendNotification(users, data) {
  if (users && users.length > 0) {
    return getDeviceTokens(users).then((deviceTokens) => {
      // Create the notification payload
      const message = buildMessage(data, deviceTokens);
      console.log(message);
      return admin.messaging().sendEachForMulticast(message);
    });
  } else {
    return null;
  }
}
