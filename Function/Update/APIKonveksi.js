const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const UpdateProduk = require("../Routes/Products/Update");

let ScrapUpdate = false;
let log = [];
let updated = 0;
let produklength = 0;
let finish = false;
let i = 0;
let Produks;
let failed = [];

function HargaKonveksiCek(res) {
  let tmp = "";
  if (ScrapUpdate == true) {
    tmp = "Aktif";
  } else {
    tmp = "NonAktif";
  }
  res = {
    status: tmp,
    diupdate: updated,
    totalproduk: produklength,
    gagal: failed,
    antrian: i,
    log: log,
    state: ScrapUpdate,
  };
  return res;
}

function HargaKonveksiOn(res) {
  if (i < produklength) {
    ScrapUpdate = true;
    ProduksLoop();
    res = {
      status: `Update Konveksi diaktifkan kembali`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: i,
    };
  } else {
    res = {
      status: `Update Konveksi selesai`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: i,
    };
  }
  return res;
}

function HargaKonveksiOff(res) {
  ScrapUpdate = false;
  res = {
    status: `Update Konveksi Dihentikan`,
    diupdate: updated,
    totalproduk: produklength,
    gagal: failed,
    antrian: i,
  };
  return res;
}

function KonveksiSelesai(res) {
  res = {
    nomor: "120363043606962064@g.us",
    status: `Auto Update Selesai`,
    log: log,
    diupdate: updated,
    totalproduk: produklength,
    antrian: i,
    gagal: failed,
    selesai: finish,
  };
  if (finish === true) {
    finish = false;
  }
  return res;
}

function HargaKonveksiMulai(req, res) {
  ScrapUpdate = true;
  log = [];
  failed = [];
  updated = 0;
  Produks = req;
  produklength = Produks.length;
  i = 0;
  finish = false;
  ProduksLoop();
  res = {
    status: `Memulai update konveksi`,
    totalproduk: produklength,
  };
  return res;
}

function Ulang() {
  i++;
  if (i < produklength) {
    if (ScrapUpdate === true) {
      ProduksLoop();
    }
  } else {
    finish = true;
    ScrapUpdate = false;
    i = 0;
  }
}

async function ProduksLoop() {
  stop = 0;
  if (log.length > 30) {
    log.splice(0, 5);
  }
  let data = Produks[i];
  if (ScrapUpdate === true) {
    log.push(`│Memulai Update ${i}: ${data.konveksi}-${data.kodebarang}`);
    shopee = data.shopee;
    if (shopee !== undefined) {
      for (let j = 0; j < shopee.length; j++) {
        if (ScrapUpdate === true) {
          if (shopee[j].link !== "-" && shopee[j].link !== "") {
            interfered = false;
            const browser = await puppeteer.launch({ headless: true }); // Membuka Browser
            const page = await browser.newPage();
            try {
              for (let k = 0; k < 1; k++) {
                if (shopee[j].api === undefined) {
                  // Jika API URL Kosong
                  page.on("request", (request) => {
                    if (request.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
                      shopee[j].api = {};
                      shopee[j].api.url = request.url();
                    }
                    request.continue();
                  });
                  await page.goto(shopee[j].link);
                  await setTimeout(5000);
                  k = k - 1;
                } else {
                  // Jika API url Tersedia
                  await page.goto(shopee[j].api.url);
                  let raw = await page.$eval("*", (el) => el.innerText);
                  let json = JSON.parse(raw);
                  let samestocks = json.data.normal_stock;
                  let models = json.data.models;
                  if (shopee[j].status === "New") {
                    let sameprice = models.every((m, i, f) => m.price === f[0].price);
                    if (sameprice === true) {
                      shopee[j].harga = parseInt(models[0].price.toString().slice(0, -5));
                      shopee[j].api.stockcombine = true;
                      shopee[j].api.name = models[0].name;
                      shopee[j].api.stock = samestocks;
                      samestocks === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                    } else {
                      shopee[j].status = "Option";
                      shopee[j].api.stockcombine = false;
                    }
                    shopee[j].status === "Active"
                      ? log.push(`│->Produk ${shopee[j].nama} link Active\n│   ╰ Harga : Rp.${shopee[j].harga}`)
                      : log.push(`│->Produk ${shopee[j].nama} link ${shopee[j].status}`);
                  } else {
                    if (shopee[j].api.name !== "") {
                      let index = models.findIndex((f) => f.name === shopee[j].api.name);
                      shopee[j].harga = parseInt(models[index].price.toString().slice(0, -5));
                      if (shopee[j].api.stockcombine !== true) {
                        shopee[j].api.stock = models[index].normal_stock;
                        models[index].normal_stock === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                      } else {
                        shopee[j].api.stock = samestocks;
                        samestocks === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                      }
                    }
                    shopee[j].status === "Active"
                      ? log.push(`│->Produk ${shopee[j].nama} link Active\n│   ╰ Harga : Rp.${shopee[j].harga}`)
                      : log.push(`│->Produk ${shopee[j].nama} link ${shopee[j].status}`);
                  }
                }
              }
            } catch (error) {
              console.log(error);
              shopee[j].status = "Skip";
              log.push(`│->Produk ${shopee[j].nama} Skip`);
              failed.push(`│${data.konveksi}-${data.kodebarang}-${shopee[j].nama}`);
              await setTimeout(60000);
            }
            await browser.close();
          } else {
            shopee[j].status = "NoLink";
            log.push(`│->Produk ${shopee[j].nama} NoLink`);
          }
        }
      }
    } else {
      log.push(`│Produk ${data.konveksi}-${data.kodebarang} NoLink`);
    }
    const UpdateStatus = await UpdateProduk(data);
    updated = updated + 1;
    log.push(`│${UpdateStatus}`);
  }
  Ulang();
}

module.exports = { HargaKonveksiMulai, HargaKonveksiOff, HargaKonveksiOn, HargaKonveksiCek, KonveksiSelesai };
