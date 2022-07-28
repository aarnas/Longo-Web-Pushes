import webpush from 'web-push';
import { db } from './db.js';

const vapidDetails = {
  publicKey: "BKcCPn6t3xmQzDBS2XfBmwGVYr57oJMAb7i_RkQ2ilAt_UkzThxQX_eF1l7SMvAuH-OB1FTihxGeifWvgbrVTFI",
  privateKey: "QhDigRoa6d_DPUYvs3B3iXwj7M2iJG_Co7QmRPlt0qw",
  subject: "mailto:test@test.test"
};

function sendNotifications(subscriptions, title, body) {
  // Create the notification content.
  const notification = JSON.stringify({
    title,
    options: {
      body,
    }
  });
  // Customize how the push service should attempt to deliver the push message.
  // And provide authentication information.
  const options = {
    TTL: 10000,
    vapidDetails: vapidDetails
  };
  // Send a push message to each client specified in the subscriptions array.
  subscriptions.forEach(subscription => {
    const endpoint = subscription.endpoint;
    const id = endpoint.substr((endpoint.length - 8), endpoint.length);
    webpush.sendNotification(subscription, notification, options)
      .then(result => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Result: ${result.statusCode}`);
      })
      .catch(error => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Error: ${error} `);
      });
  });
}

export function notifyMe(request, response, title, body) {
  console.log(`Notifying ${request.body.endpoint}`);
  const subscription =
    db.get('subscriptions').find({ endpoint: request.body.endpoint }).value();
  sendNotifications([subscription], title, body);
  response.sendStatus(200);
}

export function notifyAll(request, response, title, body) {
  console.log('Notifying all subscribers');
  const subscriptions =
    db.get('subscriptions').cloneDeep().value();
  if (subscriptions.length > 0) {
    sendNotifications(subscriptions, title, body);
    response.sendStatus(200);
  } else {
    response.sendStatus(409);
  }
}