/* eslint-disable max-len */
const admin = require("firebase-admin");
admin.initializeApp();

const userNotificationFunction = require("./notification/user-notification");
const createHandleLog = require("./notification/handle-logs");

exports.sendUserNotification = userNotificationFunction.userNotification;

exports.logCombo = createHandleLog("combos/{docId}/logs/{logId}");
exports.logUsers = createHandleLog("personal/{docId}/logs/{logId}");
