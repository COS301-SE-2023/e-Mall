/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
/**
 * Creates a Firestore trigger that handles new documents created at the specified path.
 *
 * @param {string} path - The path to the Firestore documents to watch. This should be in the format 'collection/{docId}'.
 * @return {functions.CloudFunction} A Cloud Function that will be triggered when a new document is created at the specified path. The function will get the 'receiver' field from the new document, which should be an array of user IDs. It will then create a copy of the new document in the 'logs' subcollection of each user specified in the 'receiver' array.
 *
 * @example
 * const handleLogs = require('./handle-logs');
 * exports.myFunction = handleLogs('myCollection/{docId}');
 */
function handleLogs(path) {
  return functions.region("europe-west1").firestore.document(path).onCreate(async (snap, context) => {
    // Get the receivers array from the document data

    // Get the current document data and ID
    const docData = snap.data();
    const receivers = docData.targets;
    const docId = snap.id;

    // Initialize a batch
    const batch = admin.firestore().batch();

    // Loop through the receivers array
    for (const receiver of receivers) {
      console.log("receiver : ", receiver);
      try {
        // Create a reference to the user"s logs collection
        const userLogRef = admin.firestore().collection("users").doc(receiver.id).collection("logs").doc(docId);
        const parentRef = userLogRef.parent.parent;
        const parentDoc = await parentRef.get();
        const settings = parentDoc.data().settings? parentDoc.data().settings: {"all": true};
        if (checkSettings(settings, docData.message_type)) {
          const docDataCopy = {...docData};
          // Replace [combo], [receiver], and [sender] in title and message using the helper function
          docDataCopy.title = replaceFields(docData.title, docData.doc.name, receiver.name, docData.sender.name);
          docDataCopy.message = replaceFields(docData.message, docData.doc.name, receiver.name, docData.sender.name);
          // Add the document data to the user"s logs collection in the batch
          console.log(docDataCopy);
          batch.set(userLogRef, docDataCopy);
        }
      } catch (error) {
        console.error(`Error processing receiver ${receiver}: ${error}`);
      }
    }

    // Commit the batch
    await batch.commit();
  });
}
/**
 * Replaces placeholders in a string with provided values.
 *
 * @param {string} str - The string with placeholders.
 * @param {string} comboName - The name to replace '[combo]' placeholder.
 * @param {string} receiverName - The name to replace '[receiver]' placeholder.
 * @param {string} senderName - The name to replace '[sender]' placeholder.
 * @return {string} The string with placeholders replaced by provided values.
 */
function replaceFields(str, comboName, receiverName, senderName) {
  return str.replace("[combo]", comboName).replace("[receiver]", receiverName).replace("[sender]", senderName);
}
/**
* Checks the provided settings to determine if a certain type of message is enabled.
*
* @param {Object} settings - An object containing the user's settings.
*                            This object should have properties 'all', 'general', 'following', and 'wishlist'.
* @param {string} messageType - The type of the message. This should be one of 'combo', 'user', 'follower', or 'wishlist'.
*
* @return {boolean} Returns false if 'all' property in settings is false.
*                    If message_type is 'combo' or 'user', returns the value of the 'general' property in settings.
*                    If message_type is 'follower', returns the value of the 'following' property in settings.
*                    If message_type is 'wishlist', returns the value of the 'wishlist' property in settings.
*                    For all other cases, returns true.
*/
function checkSettings(settings, messageType) {
  if (settings["all"]) return true;
  if (messageType === "combo"||messageType === "user") return settings["general"];
  else if (messageType === "follower") return settings["following"];
  else if (messageType === "wishlist") return settings["wishlist"];
  else return true;
}
module.exports = handleLogs;
