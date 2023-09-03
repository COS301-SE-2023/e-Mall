import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getMessaging, onBackgroundMessage, isSupported } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

const firebaseConfig = {
  apiKey: "AIzaSyCfiKD_kAHbYNm3Twi5IkTsJWQxnN-Q4eA",
  authDomain: "e-mall-e0fd3.firebaseapp.com",
  projectId: "e-mall-e0fd3",
  storageBucket: "e-mall-e0fd3.appspot.com",
  messagingSenderId: "1099444262939",
  appId: "1:1099444262939:web:8fac5d03b6a711c42780be",
  measurementId: "G-SX7XBRK9SC"
};

const app = initializeApp(firebaseConfig);

isSupported().then(isSupported => {

  if (isSupported) {
    console.log("in is supported");
    const messaging = getMessaging(app);

    // onBackgroundMessage(messaging, ({ notification: { title, body, image } }) => {
    //   self.registration.showNotification(title, {
    //     body, icon: image || '/assets/icons/icon-72x72.png'
        
    //   });
    //   console.log("in onBackgroundMessage")
    // });

  }

});
