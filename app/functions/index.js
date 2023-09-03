const admin = require("firebase-admin");
const userNotificationFunction = require("./notification/user-notification");

admin.initializeApp();

exports.sendUserNotification = userNotificationFunction.userNotification;
