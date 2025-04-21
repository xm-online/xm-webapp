// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');

self.firebase.initializeApp({
    apiKey: 'AIzaSyBbnr9fXZj7nS5KHsX1PcJnkBwR3M_ZHJ8',
    authDomain: 'itsf-dpc-tst.firebaseapp.com',
    projectId: 'itsf-dpc-tst',
    storageBucket: 'itsf-dpc-tst.appspot.com',
    messagingSenderId: '1032653110529',
    appId: '1:1032653110529:web:c604864d1ae118ba6eaf00',
});

const isSupported = self.firebase.messaging.isSupported();
if (isSupported) {
    const messaging = self.firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        setTimeout(() => {
            const notificationTitle = payload.data.title || '';
            const notificationOptions = {
                body: payload.data.body || '',
                title: payload.data.title,
                image: payload.data.image,
                icon: payload.data.icon,
                data: payload.data,
                tag: 'custom-notification',
            };
            self.registration.showNotification(notificationTitle, notificationOptions);
        }, 0);

        return new Promise(function (resolve) {
            resolve();
            setTimeout(function () {
                self.registration.getNotifications().then((notifications) => {
                    notifications.forEach((notification) => {
                        if (notification.tag !== 'custom-notification') {
                            notification.close();
                        }
                    });
                });
            }, 0);
        });
    });
}

self.addEventListener('notificationclick', function (event) {
    const redirect_url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(
        self.clients
            .matchAll({
                type: 'window',
            })
            .then((clientList) => {
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (self.clients.openWindow) {
                    return self.clients.openWindow(redirect_url);
                }
                return null;
            }),
    );
});

