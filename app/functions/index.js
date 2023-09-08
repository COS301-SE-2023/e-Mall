/* eslint-disable max-len */
const admin = require("firebase-admin");
const userNotificationFunction = require("./notification/user-notification");
const followerNotificationFunction = require("./notification/follower-notification");
const productNotificationFunction = require("./notification/product-notification");
const comboNotificationFunction = require("./notification/combo-notification");

admin.initializeApp();

exports.sendUserNotification = userNotificationFunction.userNotification;
exports.sendFollowerNotification = followerNotificationFunction.followerNotification;
exports.sendProductNotification = productNotificationFunction.productNotification;
exports.sendComboNotification = comboNotificationFunction.comboNotification;
