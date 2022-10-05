const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const UpdateProduk = require("../Routes/Products/Update");
const TarikProduks = require("../Routes/Products/FindAll");

const { Login, Scraping } = require("./Scraping");

let ScrapUpdate = false;
let log = [];
let updated = 0;
let produklength = 0;
let finish = false;
let i = 0;
let Produks;
let failed = [];
let OldProduct;
let Undercuted = [];

function AutoCek(res) {
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
function AutoOn(res) {
  if (ScrapUpdate === true) {
    res = {
      status: `Auto update telah aktif`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: i,
    };
  } else {
    ScrapUpdate = true;
    Ulang();
    res = {
      status: `Auto update diaktifkan kembali`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: i,
    };
  }
  return res;
}
function AutoOff(res) {
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
function CheckUndercut(shopee, pesaing) {
  let IndexDOMMO = shopee.findIndex((d) => d.nama === "DOMMO");
  let Indexpesaing = shopee.findIndex((p) => p.nama === pesaing);

  if (shopee[IndexDOMMO].status === "Active" && shopee[Indexpesaing].status === "Active") {
    if (Produks[i].shopee[Indexpesaing].harga !== shopee[Indexpesaing].harga) {
      if (shopee[IndexDOMMO].harga < shopee[Indexpesaing].harga) {
        Undercuted.push({
          kodebarang: Produks[i].kodebarang,
          hargadommo: shopee[IndexDOMMO].harga,
          namapesaing: pesaing,
          hargalama: Produks[i].shopee[Indexpesaing].harga,
          hargabaru: shopee[Indexpesaing].harga,
        });
      }
    }
  }
}
function AutoUndercut(Res = []) {
  for (let i = 0; i < Undercuted.length; i++) {
    Res.push({
      nomor: "6282246378074@c.us",
      caption: `╭──「 *Pemberitahuan* 」
│Pesaing ${Undercuted[i].namapesaing} telah 
│mengubah harga produk dibawah 
│Harga DOMMO : ${Undercuted[i].hargadommo}
│Harga ${Undercuted[i].namapesaing}
│ ╰ ${Undercuted[i].hargalama} -> ${Undercuted[i].hargabaru}
│──「 *i* 」──────────
│Gunakan perintah !Produk ${Undercuted[i].kodebarang}
│untuk info detail atau
│Gunakan perintah !link ${Undercuted[i].kodebarang}
│untuk cek link produk
╰───────────────`,
    });
  }
  Undercuted = [];
  return Res;
}
function AutoSelesai(res) {
  res = {
    // nomor: "120363043606962064@g.us",
    nomor: "6282246378074@c.us",
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
var startTime;
async function AutoMulai(res) {
  ScrapUpdate = true;
  log = [];
  failed = [];
  updated = 0;
  Produks = await TarikProduks();
  produklength = Produks.length;
  i = 0;
  finish = false;

  startTime = performance.now();
  console.log(startTime);
  Ulang();
  res = {
    status: `Memulai update konveksi`,
    totalproduk: produklength,
  };
  return res;
}

async function Ulang() {
  console.log(i);
  let Data;
  if (i < produklength) {
    if (ScrapUpdate === true) {
      if (log.length > 30) {
        log.splice(0, 5);
      }
      if (Produks[i].shopee !== undefined) {
        await Login();
        Data = await Scraping(Produks[i]);
        const UpdateStatus = await UpdateProduk(Data.produks);
        updated = updated + 1;
        log.push(`│->${UpdateStatus}`);
      }
    }
  } else {
    var endTime = performance.now();
    console.log(`Selesai Dalam ${endTime - startTime} milliseconds`);
    finish = true;
    i = 0;
    await setTimeout(1800000);
    // AutoMulai();
  }
  i++;
  Ulang();
}

async function ProduksLoop() {
  let data = Produks[i];
  if (ScrapUpdate === true) {
    log.push(`│Memulai Update ${i}: ${data.konveksi}-${data.kodebarang}`);
    shopee = data.shopee;
    if (shopee !== undefined) {
      for (let j = 0; j < shopee.length; j++) {
        if (ScrapUpdate === true) {
          if (shopee[j].link !== "-" && shopee[j].link !== "") {
            interfered = false;
            const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
            const page = await browser.newPage();
            try {
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
            } catch (error) {
              console.log(error);
              shopee[j].status = "Skip";
              log.push(`│->Produk ${shopee[j].nama} Skip`);
              failed.push(`│${data.konveksi}-${data.kodebarang}-${shopee[j].nama}`);
              await setTimeout(90000);
            }
            await browser.close();
            CheckUndercut(shopee, shopee[j].nama);
          } else {
            shopee[j].status = "NoLink";
            log.push(`│->Produk ${shopee[j].nama} NoLink`);
          }
        }
      }
    } else {
      log.push(`│Produk ${data.konveksi}-${data.kodebarang} NoLink`);
    }
  }
  Ulang();
}

module.exports = { AutoMulai, AutoOff, AutoOn, AutoCek, AutoSelesai, AutoUndercut };
