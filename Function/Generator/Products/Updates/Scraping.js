const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

let Skiped = false;
let UseTor = false;
let StartTor;
let Browser;

async function Login() {
  if (StartTor - performance.now() > 90000) {
    UseTor = false;
  }
  if (UseTor === true) {
    Browser = await puppeteer.launch({ headless: true, args: ["--proxy-server=socks5://127.0.0.2:9052"] });
  } else {
    Browser = await puppeteer.launch({ headless: true });
  }
  await setTimeout(2000);

  // let [LoginPage] = await Browser.pages();
  // await LoginPage.goto("https://shopee.co.id/buyer/login", { waitUntil: "networkidle0" });
  // await LoginPage.focus("input[name=loginKey]");
  // await LoginPage.keyboard.type("0895625865900");
  // await LoginPage.focus("input[name=password]");
  // await LoginPage.keyboard.type("Coba1234");
  // await setTimeout(1000);
  // await LoginPage.click("#main > div > div.vtexOX > div > div > form > div > div.yXry6s > button");
  // await setTimeout(30000);
}
async function LogOut() {
  await Browser.close();
}

function Scraping(Data, Res) {
  let Log = [];
  let Shopee = Data.shopee;
  let Time = -4000;
  Log.push(`│Memulai Update: ${Data.konveksi}-${Data.kodebarang}`);

  var Scrap = new Promise((Rs, Rj) => {
    Shopee.forEach(async (e, i, a) => {
      Time = Time + 4000;
      await setTimeout(Time);
      let json;
      const Page = await Browser.newPage();
      try {
        await Page.setRequestInterception(true);
        Page.on("request", (request) => {
          request.continue();
        });
        Page.on("response", async (response) => {
          try {
            if (response.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
              json = await response.json();
              e.api = response.url();
              let samestocks = json.data.normal_stock;
              let models = json.data.models;
              if (e.status === "New") {
                let sameprice = models.every((m, i, f) => m.price === f[0].price);
                if (sameprice === true) {
                  e.harga = parseInt(models[0].price.toString().slice(0, -5));
                  e.kategori = models[0].name;
                  e.stocks = true;
                  e.stock = samestocks;
                  samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
                } else {
                  e.status = "Option";
                  e.stocks = false;
                }
                e.status === "Active"
                  ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
                  : Log.push(`│->Produk ${e.nama} link ${e.status}`);
              } else {
                if (e.kategori !== "") {
                  let index = models.findIndex((f) => f.name === e.kategori);
                  e.harga = parseInt(models[index].price.toString().slice(0, -5));
                  if (e.stocks !== true) {
                    e.stock = models[index].normal_stock;
                    models[index].normal_stock === 0 ? (e.status = "Active") : (e.status = "Habis");
                  } else {
                    e.stock = samestocks;
                    samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
                  }
                }
                e.status === "Active"
                  ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
                  : Log.push(`│->Produk ${e.nama} link ${e.status}`);
              }
            }
          } catch (error) {
            console.log(error);
            e.status = "Skip";
            Skiped = true;
          }
        });
        await Page.goto(e.link);
        await Page.waitForSelector("[class='_2Shl1j']", { timeout: 30000 });
        await Page.close();
      } catch (error) {
        console.log(error);
        await Page.close();
      }
      if (i === a.length - 1) Rs();
    });
  });
  return (Res = Scrap.then((res) => {
    LogOut();
    if (Skiped === true) {
      UseTor === false ? (StartTor = performance.now()) : (StartTor = 0);
      UseTor === false ? (UseTor = true) : (UseTor = false);
      Skiped = false;
    }
    Data.shopee = Shopee;
    res = {
      log: Log,
      produks: Data,
    };
    return res;
  }));
} // Do all at same time

// async function Scraping(Data, Res) {
//   let Log = [];
//   let Shopee = Data.shopee;
//   let Time = 0;
//   Log.push(`│Memulai Update: ${Data.konveksi}-${Data.kodebarang}`);
//   for (let i = 0; i < Shopee.length; i++) {
//     e = Shopee[i];
//     let json;
//     const Page = await Browser.newPage();
//     try {
//       await Page.setRequestInterception(true);
//       Page.on("request", (request) => {
//         request.continue();
//       });
//       Page.on("response", async (response) => {
//         try {
//           if (response.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
//             json = await response.json();
//             e.api = response.url();
//           }
//         } catch (error) {
//           e.status = "Skip";
//         }
//       });
//       await Page.goto(e.link);
//       await Page.waitForSelector("[class='_2Shl1j']", { timeout: 10000 });

//       let samestocks = json.data.normal_stock;
//       let models = json.data.models;
//       if (e.status === "New") {
//         let sameprice = models.every((m, i, f) => m.price === f[0].price);
//         if (sameprice === true) {
//           e.harga = parseInt(models[0].price.toString().slice(0, -5));
//           e.kategori = models[0].name;
//           e.stocks = true;
//           e.stock = samestocks;
//           samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
//         } else {
//           e.status = "Option";
//           e.stocks = false;
//         }
//         e.status === "Active"
//           ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
//           : Log.push(`│->Produk ${e.nama} link ${e.status}`);
//       } else {
//         if (e.kategori !== "") {
//           let index = models.findIndex((f) => f.name === e.kategori);
//           e.harga = parseInt(models[index].price.toString().slice(0, -5));
//           if (e.stocks !== true) {
//             e.stock = models[index].normal_stock;
//             models[index].normal_stock === 0 ? (e.status = "Active") : (e.status = "Habis");
//           } else {
//             e.stock = samestocks;
//             samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
//           }
//         }
//         e.status === "Active"
//           ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
//           : Log.push(`│->Produk ${e.nama} link ${e.status}`);
//       }
//       await Page.close();
//     } catch (error) {
//       await Page.close();
//       e.status = "Skip";
//       await setTimeout(90000);
//     }
//   }
//   Data.shopee = Shopee;
//   Res = {
//     log: Log,
//     produks: Data,
//   };
//   return Res;
// } // Do 1 after another

module.exports = { Login, Scraping };
