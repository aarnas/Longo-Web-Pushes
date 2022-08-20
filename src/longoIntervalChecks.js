import puppeteer from 'puppeteer';
import { sendNotifications } from './web-pushes.js';
import { db } from './db.js';

export async function longoIntervalChecks() {
  const BASE_URL = 'https://longo.lt/katalogas?transmissions=Automatic&search=&pageSize=24&currentPage=1&orderBy=PUBLISHED_AT_DESC&gridMode=GRID&multiSelect=true';

  let savedItems = []
  let newItems = []

  const intervalCheck = async () => {
    setInterval(async () => {
      newItems = await checkForNewCars(savedItems)
      // console.log(`Saved: ${savedItems.length} Online: ${newItems.length}`)
      if (newItems.length !== savedItems.length) {
        // console.log({
        //   time: new Date().toLocaleTimeString(),
        //   newItems,
        // })
        const subscriptions =
          db.get('subscriptions').cloneDeep().value();
        if (subscriptions.length > 0) {
          newItems.map(car => {
            sendNotifications(subscriptions, `${car.name}`, `${car.price} ${car.chips}`)
          })
        }
      }

      savedItems = [...newItems, ...savedItems]
    }, 10 * 1000)
  }

  const getLongoCars = async () => {
    const page = await browser.newPage();
    await page.goto(BASE_URL);
    const currentItems = await page.evaluate(() => {
      const items = [];
      const pms = document.querySelectorAll(".col-6");
      pms.forEach(async (element) => {
        const status = await element.querySelector(".v-card-item__status-label").innerText;
        const name = await element.querySelector(".v-card-item__title").innerText;
        const price = await element.querySelector(".v-card-item__full-price").innerText;
        const chips = await element.querySelector(".v-card-item__details").innerText.split("\n").join(" ");
        items.push({
          status,
          name,
          price,
          chips
        });
      });
      return items;
    });
    await page.close();
    return currentItems;
  };

  const checkForNewCars = async (savedCars) => {

    const notSaved = [];
    const newerItems = await getLongoCars();
    newerItems.forEach(item => {
      if (savedCars.find(car => car.name === item.name) === undefined && item.status !== "PARDUOTAS") {
        notSaved.push(item);
      }
    });
    return notSaved;
  }

  const browser = await puppeteer.launch({ headless: true });
  await intervalCheck()
}