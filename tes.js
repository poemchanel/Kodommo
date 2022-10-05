const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const useProxy = require("puppeteer-page-proxy");

const { setTimeout } = require("timers/promises");
const { exec } = require("node:child_process");

function StartTor() {
  exec("sc start tor", (e, o) => {
    if (e) {
      console.log(e);
      return;
    }
    console.log(o);
  });
}
function StopTor() {
  exec("sc stop tor", (e, o) => {
    if (e) {
      console.log(e);
      return;
    }
    console.log(o);
  });
}
let Shopee = [
  {
    nama: "DOMMO",
    link: "https://shopee.co.id/-LOKAL--D1085-Backpack-TAS-LOVE-LOVE-Backpack-Micro-Tas-Ransel-Fashion-Morymony-i.135900627.4508614344?sp_atk=7620c383-c084-4383-b88f-ac24048f6e5e",
    status: "New",
    harga: 0,
    kategori: "",
    stocks: true,
    stock: 0,
    api: "https://shopee.co.id/api/v4/item/get?itemid=4508614344&shopid=135900627",
  },
  {
    nama: "DOMMO",
    link: "https://shopee.co.id/MORYMONY-TAS-LOVE-LOVE-Backpack-Micro-Tas-Ransel-Fashion-i.20287667.1901492824?sp_atk=829d212b-5237-4dda-937a-ec86ba28266a",
    status: "New",
    harga: 0,
    kategori: "",
    stocks: true,
    stock: 0,
    api: "https://shopee.co.id/api/v4/item/get?itemid=1901492824&shopid=20287667",
  },
];

(async () => {
  let proxy = "--proxy-server=socks://127.0.0.2:9052";

  const Browser = await puppeteer.launch({ headless: false });
  const Page = await Browser.newPage();
  await Page.goto("https://api.ipify.org/", { waituntul: "networkidle0" });
  await setTimeout(10000);
  const Page2 = await Browser.newPage();
  await useProxy(Page2, "socks5://127.0.0.2:9052");
  await Page2.goto("https://api.ipify.org/", { waituntul: "networkidle0" });
  await setTimeout(10000);
  Browser.close();
})();

// let Log = [];
// (async () => {
//   for (let i = 0; i < Shopee.length; i++) {
//     e = Shopee[i];
//     let json;
//     const Browser = await puppeteer.launch({ headless: true, args: ["--proxy-server=socks5://127.0.0.2:9052"] });
//     const Page = await Browser.newPage();
//     await Page.goto("https://api.ipify.org/");
//     await setTimeout(10000);
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
//             let samestocks = json.data.normal_stock;
//             let models = json.data.models;
//             if (e.status === "New") {
//               let sameprice = models.every((m, i, f) => m.price === f[0].price);
//               if (sameprice === true) {
//                 e.harga = parseInt(models[0].price.toString().slice(0, -5));
//                 e.kategori = models[0].name;
//                 e.stocks = true;
//                 e.stock = samestocks;
//                 samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
//               } else {
//                 e.status = "Option";
//                 e.stocks = false;
//               }
//               e.status === "Active"
//                 ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
//                 : Log.push(`│->Produk ${e.nama} link ${e.status}`);
//             } else {
//               if (e.kategori !== "") {
//                 let index = models.findIndex((f) => f.name === e.kategori);
//                 e.harga = parseInt(models[index].price.toString().slice(0, -5));
//                 if (e.stocks !== true) {
//                   e.stock = models[index].normal_stock;
//                   models[index].normal_stock === 0 ? (e.status = "Active") : (e.status = "Habis");
//                 } else {
//                   e.stock = samestocks;
//                   samestocks === 0 ? (e.status = "Active") : (e.status = "Habis");
//                 }
//               }
//               e.status === "Active"
//                 ? Log.push(`│->Produk ${e.nama} link Active\n│   ╰ Harga : Rp.${e.harga}`)
//                 : Log.push(`│->Produk ${e.nama} link ${e.status}`);
//             }
//           }
//         } catch (error) {
//           e.status = "Skip";
//           console.log(error);
//         }
//       });
//       try {
//         await Page.goto(e.link);
//       } catch (error) {}
//       await Page.waitForSelector("[class='_2Shl1j']", { timeout: 60000 });
//       await Browser.close();
//       StopTor();
//       await setTimeout(1000);
//     } catch (error) {
//       console.log(error);
//       await Browser.close();
//       StopTor();
//       await setTimeout(1000);
//       e.status = "Skip";
//     }
//     await Browser.close();
//     console.log(e);
//   }
// })();

// const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
// puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// let URL = `https://shopee.co.id/api/v4/item/get?itemid=1919899204&shopid=20287667`;
// async function Tes() {
//   const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
//   const page = await browser.newPage();

//   await page.goto(URL);
//   const raw = await page.$eval("*", (el) => el.innerText);
//   const json = JSON.parse(raw);
//   const models = json.data.models;
//   let IndexFirst = models.findIndex((f) => f.name === "KUNING");

//   await browser.close();
//   console.log(models[IndexFirst].price);
// }
// 5000000000
// 1250000000
// Tes();
// let models = [
//   { price: 2, name: "A" },
//   { price: 2, name: "B" },
//   { price: 3, name: "C" },
//   { price: 2, name: "D" },
// ];
// // let sameprice = true;
// // let price = models[0].price;
// // for (let l = 1; l < models.length; l++) {
// //   if (models[l].price !== price) {
// //     sameprice = false;
// //   }
// // }

// let sameprice = models.some((m, i, arr) => m.price === arr[0].price);

// console.log(sameprice);

// const fetch = require("node-fetch");
// async function Tes() {
//   let headersList = {
//     Host: "shopee.co.id",
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
//     Accept: "application/json",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Accept-Encoding": "gzip, deflate, br",
//     Referer:
//       "https://shopee.co.id/DOMMO-D8053-Acnes-Natural-Care-Acne-Treatment-ALL-Series-Facial-Wash-Face-Wash-Lotion-Cleanser-i.135900627.9675925503?sp_atk=18be32e2-cbcc-4b94-9127-12b11a14e085",
//     "X-Shopee-Language": "id",
//     "X-Requested-With": "XMLHttpRequest",
//     "X-CSRFToken": "MtUCi8OkOgzeOpfB9MDgQrE6lqf5syFf",
//     "X-API-SOURCE": "pc",
//     "Content-Type": "application/json",
//     "af-ac-enc-dat":
//       "AAcyLjMuMi0yAAABg1uVOB8AAAo4AfcAAAAAAAAAAH5naiDULHabsm7S0O72T8g+pIzrshHG7hzyFe0QQ4WYf4804Nz956kuPWVa1se83J3DO85rxlK1ZuS5Wx9TU0mwM1aB5bkPPnGUflC1tlyT0QIti5mh1tARuheV1+dVAVoxYhHRTcPGAm528NkQZ+fLpOLtXGcqujUkG+TmAlEzOTcxrhSM+GaXpTzdzhhHvj++dmPVVG4qKK+Es+IDb4NmdJe/HPOE0zO5KKTEvOEX09AcuF2NJHt+XyRmI0WnXV3XYmojgZOpwgBM+3Sthj+WDgZmH6K5j9CqC/wl6vSyzjbtA8smBlG6lfpaRJCDWpNxQwIZsaxRGtZ6bt24ZUJQGagXrCrceLLT4d9VyibkSKtacY809GsdOAL82ajQFBFytqSRY7OMsPKRljZ2EI7Zp6aWI9TV7dAaspLYmB/onKPzNh3LJHOW+a0pKRcBlNwZcEom9Xngi5uB1Lt2BtlJs3HdlHCQSkCJE6R8gseOS3Dya6YINYV8eL61AA1PX4Q91QzvzlGluIpLvE42KI6Lv2bEruOapZZuvoxvu1S2cxD/Mtpojv4G64FJLQITAqyzU1x6lOF8qOBHQpsxMbpyZDeBjYHI6P6Zqr7hlaWgcj2Ir5RXttRokWJcs3YhWstHGR2ilG5usyf9UsBlpv2cf9TyE3cvrxUPGfwqNEe6TE8xOg==",
//     "sz-token":
//       "2BuoYMTEQk4q0CvbswVlkw==|+JQ0VDjp0iRP//g+pgMbW+N/l21YQaPVi/JnJMzZl8OIP9JYoohvNiVBg5HKLEIXCFKrncwlVHZhOPXIizAsvfgVudl70Nh4a8M=|C/Ent+NkAwzutEDl|06|3",
//     "x-sz-sdk-version": "2.3.2-2",
//     Connection: "keep-alive",
//     Cookie:
//       "SPC_F=V6QhP0ouzaA9tsmxj33VOg3Rk2O04N45; REC_T_ID=36692f39-2323-11ed-b26b-2cea7fac85d8; SPC_R_T_ID=fhODc6THLjhtoVya2bmIwzNlg8rcPjt4CTcyHKxEYVYmHvCyobp5jMuwxlQ+YtNOZF5THFgMlPMENtGMjxicfBMhYZkANcLpO3qinULSzywvBE7Gsilz9NAOV/T7FEOcWOYnrhlmpNL2xbnLwGYLlJVcM4oNDCjNPBvtOEJ/8Og=; SPC_R_T_IV=VXJicHkxY2FzTmhzZXN2YQ==; SPC_T_ID=fhODc6THLjhtoVya2bmIwzNlg8rcPjt4CTcyHKxEYVYmHvCyobp5jMuwxlQ+YtNOZF5THFgMlPMENtGMjxicfBMhYZkANcLpO3qinULSzywvBE7Gsilz9NAOV/T7FEOcWOYnrhlmpNL2xbnLwGYLlJVcM4oNDCjNPBvtOEJ/8Og=; SPC_T_IV=VXJicHkxY2FzTmhzZXN2YQ==; SPC_IA=-1; SPC_EC=-; SPC_T_ID='fhODc6THLjhtoVya2bmIwzNlg8rcPjt4CTcyHKxEYVYmHvCyobp5jMuwxlQ+YtNOZF5THFgMlPMENtGMjxicfBMhYZkANcLpO3qinULSzywvBE7Gsilz9NAOV/T7FEOcWOYnrhlmpNL2xbnLwGYLlJVcM4oNDCjNPBvtOEJ/8Og='; SPC_U=-; SPC_T_IV=`VXJicHkxY2FzTmhzZXN2YQ==`; SPWC_SI=213t8dpo5m86a6rkrww17s7sa6k5xtnb; __LOCALE__null=ID; csrftoken=MtUCi8OkOgzeOpfB9MDgQrE6lqf5syFf; _QPWSDCXHZQA=909b2397-d92e-4398-eb37-f25ac4590aef; django_language=id; SPC_SI=Y5whYwAAAABkSWNiZEdtcrw/mgAAAAAAWmZBQTJ0Vnc=; shopee_webUnique_ccd=2BuoYMTEQk4q0CvbswVlkw%3D%3D%7C%2BJQ0VDjp0iRP%2F%2Fg%2BpgMbW%2BN%2Fl21YQaPVi%2FJnJMzZl8OIP9JYoohvNiVBg5HKLEIXCFKrncwlVHZhOPXIizAsvfgVudl70Nh4a8M%3D%7CC%2FEnt%2BNkAwzutEDl%7C06%7C3; ds=c1d40c02f9bb645330baf5883fa27d20",
//     "Sec-Fetch-Dest": "empty",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Site": "same-origin",
//     TE: "trailers",
//   };

//   let response = await fetch("https://shopee.co.id/api/v4/item/get?itemid=9675925503&shopid=135900627", {
//     method: "GET",
//     headers: headersList,
//   });

//   let data = await response.text();
//   console.log(data);
// }
// Tes();
