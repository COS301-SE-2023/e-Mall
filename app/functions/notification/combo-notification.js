/* eslint-disable max-len */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.comboActiveUserNotification = functions
  .region('europe-west1')
  .firestore.document('combos/{combo_id}/active_users{user_id}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const title = data.title;
    const body = data.message;
    const image = data.image;
    const isRead = data.is_read;
    const timestamp = data.timestamp;
    const unixTimestamp = timestamp.toMillis();

    // Get the list of users who should receive the combo notification
    const comboRef = snap.ref.parent.parent;
    return comboRef.get().then(comboDoc => {
      const targetUsers = comboDoc.data().active_users;
      if (targetUsers && targetUsers.length > 0) {
        // Get the device tokens of all target users with a single query
        return admin
          .firestore()
          .collection('users')
          .where(admin.firestore.FieldPath.documentId(), 'in', targetUsers)
          .get()
          .then(querySnapshot => {
            const deviceTokens = querySnapshot.docs.map(
              doc => doc.data().device_token
            );

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
              tokens: deviceTokens,
            };

            // Send the notification to all device tokens
            return admin.messaging().sendMulticast(message);
          });
      } else {
        return null;
      }
    });
  });

exports.comboPendingUserNotification = functions
  .region('europe-west1')
  .firestore.document('combos/{combo_id}/active_users{user_id}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const title = data.title;
    const body = data.message;
    const image = data.image;
    const isRead = data.is_read;
    const timestamp = data.timestamp;
    const unixTimestamp = timestamp.toMillis();

    // Get the list of users who should receive the combo notification
    const comboRef = snap.ref.parent.parent;
    return comboRef.get().then(comboDoc => {
      const targetUsers = comboDoc.data().active_users;
      if (targetUsers && targetUsers.length > 0) {
        // Get the device tokens of all target users with a single query
        return admin
          .firestore()
          .collection('users')
          .where(admin.firestore.FieldPath.documentId(), 'in', targetUsers)
          .get()
          .then(querySnapshot => {
            const deviceTokens = querySnapshot.docs.map(
              doc => doc.data().device_token
            );

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
              tokens: deviceTokens,
            };

            // Send the notification to all device tokens
            return admin.messaging().sendMulticast(message);
          });
      } else {
        return null;
      }
    });
  });
