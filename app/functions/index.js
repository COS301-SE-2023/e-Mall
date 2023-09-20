/* eslint-disable max-len */
const admin = require("firebase-admin");
admin.initializeApp();

const userNotificationFunction = require("./notification/user-notification");
// const followerNotificationFunction = require("./notification/follower-notification");
// const productNotificationFunction = require("./notification/product-notification");
// const comboNotificationFunction = require("./notification/combo-notification");

const createHandleLog= require("./notification/handle-logs");
exports.sendUserNotification = userNotificationFunction.userNotification;
// exports.sendFollowerNotification = followerNotificationFunction.followerNotification;
// exports.sendProductNotification = productNotificationFunction.productNotification;
// exports.sendActiveUserNotification = comboNotificationFunction.ComboActiveUserNotification;


exports.logCombo = createHandleLog("combos/{docId}/logs/{logId}");
// exports.fooA = createHandleLog("fooA/{docId}/logs/{logId}");
// exports.fooB = createHandleLog("fooB/{docId}/logs/{logId}");
