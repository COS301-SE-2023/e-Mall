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
    console.log(docData);
    const receivers = docData.targets;
    const docId = snap.id;

    // Initialize a batch
    const batch = admin.firestore().batch();

    // Loop through the receivers array
    receivers.forEach((receiver) => {
      console.log("recevier : ", receiver);
      try {
        // Create a reference to the user"s logs collection
        const userLogRef = admin.firestore().collection("users").doc(receiver.id).collection("logs").doc(docId);
        const docDataCopy = {...docData};
        // Replace [combo], [receiver], and [sender] in title and message using the helper function
        docDataCopy.title = replaceFields(docData.title, docData.doc.name, receiver.name, docData.sender.name);
        docDataCopy.message = replaceFields(docData.message, docData.doc.name, receiver.name, docData.sender.name);

        // Add the document data to the user"s logs collection in the batch
        batch.set(userLogRef, docDataCopy);
      } catch (error) {
        console.error(`Error processing receiver ${receiver}: ${error}`);
      }
    });

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

module.exports = handleLogs;
