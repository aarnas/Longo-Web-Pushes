import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';

const adapter = new FileSync('.data/db.json');
export const db = low(adapter);

db.defaults({
  subscriptions: []
}).write()

export function addSubscription(request, response) {
  console.log(`Subscribing ${request.body.endpoint}`);
  db.get('subscriptions')
    .push(request.body)
    .write();
  response.sendStatus(200);
}

export function removeSubscription(request, response) {
  console.log(`Unsubscribing ${request.body.endpoint}`);
  db.get('subscriptions')
    .remove({ endpoint: request.body.endpoint })
    .write();
  response.sendStatus(200);
}