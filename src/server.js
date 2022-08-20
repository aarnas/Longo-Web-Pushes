import express from 'express';
import bodyparser from 'body-parser';
import path from "path"
const __dirname = path.resolve();

import { notifyMe, notifyAll } from './web-pushes.js';
import { addSubscription, removeSubscription } from './db.js';
import { longoIntervalChecks } from './longoIntervalChecks.js';

const app = express();
app.use(bodyparser.json());
app.use(express.static('public'));

app.post('/add-subscription', (request, response) => {
  addSubscription(request, response);
});

app.post('/remove-subscription', (request, response) => {
  removeSubscription(request, response);
});

app.post('/notify-me', (request, response) => {
  notifyMe(request, response, "Notifier", "This is notification to you");
});

app.post('/notify-all', (request, response) => {
  notifyAll(request, response, "Notifier", "This is notification to all");
});

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/src/views/index.html');
});

const listener = app.listen(3654, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

longoIntervalChecks();