import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const bgSyncPlugin = new BackgroundSyncPlugin('apiRequests', {
    maxRetentionTime: 15  // retry for up to 15 minutes
});


// retry failed POST requests to /api/**.json
registerRoute(
    /\/api\/.*\/.*\.json/,
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

/** Preact CLI setup */
setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);

navigator
    .serviceWorker
    .getRegistration()
    .then(swRegistration => {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
          .then(function(subscription) {
            console.log('User is subscribed:', subscription);
        
            updateSubscriptionOnServer(subscription);
        
            isSubscribed = true;
        
            updateBtn();
          })
          .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
          });
        
    })