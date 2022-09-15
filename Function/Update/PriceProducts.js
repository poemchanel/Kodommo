const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const UpdateProduk = require("../Routes/Products/Patch");
const TarikProduks = require("../Routes/Products/GetAll");

let ScrapUpdate = false;
let log = [];
let updated = 0;
let produklength = 0;
let finish = false;
let stop = 0;
let i = 0;
let Produks;
let failed = [];
let interfered = false;

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

function AutoSelesai(res) {
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

async function AutoMulai(res) {
  ScrapUpdate = true;
  log = [];
  failed = [];
  updated = 0;
  Produks = await TarikProduks();
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

async function Ulang() {
  i++;
  if (i < produklength) {
    if (ScrapUpdate === true) {
      ProduksLoop();
    }
  } else {
    finish = true;
    i = 0;
    await setTimeout(1800000);
    AutoMulai();
  }
}

async function ProduksLoop() {
  stop = 0;
  if (log.length > 30) {
    log.splice(0, 5);
  }
  let data = Produks[i];
  if (ScrapUpdate === true) {
    let browser = await puppeteer.launch({ headless: true }); // Membuka Browser
    let page = await browser.newPage();
    log.push(`│Memulai Update ${i}: ${data.konveksi}-${data.kodebarang}`);
    shopee = data.shopee;
    if (shopee !== undefined) {
      for (let j = 0; j < shopee.length; j++) {
        if (interfered === true) {
          browser = await puppeteer.launch({ headless: true }); // Membuka Browser
          page = await browser.newPage();
          interfered = false;
        }
        if (ScrapUpdate === true) {
          if (shopee[j].link !== "-") {
            try {
              await page.goto(shopee[j].link);
              try {
                await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
                let statusclass = await page.$("[class='_1WIqzi']");
                let statusvalue = await page.evaluate((el) => el.textContent, statusclass);
                shopee[j].status = statusvalue;
                log.push(`│->Produk ${shopee[j].nama} link ${statusvalue}`);
              } catch (error) {
                try {
                  let disable = [];
                  for (let k = 0; k < shopee[j].click.length; k++) {
                    let element = await page.waitForSelector(`button[aria-label="${shopee[j].click[k]}"]`);
                    let button = await page.evaluate((el) => el.getAttribute("aria-disabled"), element);
                    if (button === false) {
                      await page.click(`button[aria-label="${shopee[j].click[k]}"]`);
                    }
                    disable.push(button);
                  }
                  console.log(disable);
                  if (disable.includes("true") === true) {
                    shopee[j].status = "Disable";
                    log.push(`│->Produk ${shopee[j].nama} link Disable`);
                  } else {
                    await setTimeout(500);
                    try {
                      await page.waitForSelector("[class='_2Shl1j']", { timeout: 3000 });
                      let element = await page.$("[class='_2Shl1j']");
                      let value = await page.evaluate((el) => el.textContent, element);
                      value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                      if (value.includes("-") === true) {
                        shopee[j].harga = value;
                        shopee[j].status = "Range";
                        log.push(`│->Produk ${shopee[j].nama} link Range\n│   ╰ Harga : Rp.${value}`);
                      } else {
                        shopee[j].harga = value;
                        shopee[j].status = "Aktif";
                        log.push(`│->Produk ${shopee[j].nama} link Aktif\n│   ╰ Harga : Rp.${value}`);
                      }
                    } catch (error) {
                      console.log(error);
                      log.push(`│Proses scraping terhenti!\n│melanjutkan ulang proses\n│setelah 90 detik...`);
                      failed.push(`\n│${i}: ${data.konveksi}-${data.kodebarang}`);
                      interfered = true;
                      await browser.close();
                      await setTimeout(90000);
                    }
                  }
                } catch (error) {
                  try {
                    await page.waitForSelector("[class='_2Shl1j']", { timeout: 3000 });
                    let element = await page.$("[class='_2Shl1j']");
                    let value = await page.evaluate((el) => el.textContent, element);
                    value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                    if (value.includes("-") === true) {
                      shopee[j].harga = value;
                      shopee[j].status = "Range";
                      log.push(`│->Produk ${shopee[j].nama} link Range\n│   ╰ Harga : Rp.${value}`);
                    } else {
                      shopee[j].harga = value;
                      shopee[j].status = "Aktif";
                      log.push(`│->Produk ${shopee[j].nama} link Aktif\n│   ╰ Harga : Rp.${value}`);
                    }
                  } catch (error) {
                    console.log(error);
                    log.push(`│Proses scraping terhenti!\n│melanjutkan ulang proses\n│setelah 90 detik...`);
                    failed.push(`\n│${i}: ${data.konveksi}-${data.kodebarang}`);
                    interfered = true;
                    await browser.close();
                    await setTimeout(90000);
                  }
                }
              }
            } catch (error) {
              shopee[j].status = "Bermasalah";
              log.push(`│->Produk ${shopee[j].nama} link Bermasalah`);
            }
          } else {
            shopee[j].link = "Kosong";
            log.push(`│->Produk ${shopee[j].nama} link Kosong`);
          }
        } else {
          stop = stop + 1;
        }
      }
    } else {
      log.push(`│Produk ${data.konveksi}-${data.kodebarang} Link Kosong`);
    }
    if (interfered === false) {
      await browser.close();
    } else {
      interfered = false;
    }
    if (ScrapUpdate === true) {
      const UpdateStatus = await UpdateProduk(data);
      updated = updated + 1;
      log.push(`│${UpdateStatus}`);
    } else {
      stop = stop + 1;
    }
  } else {
    stop = stop + 1;
  }
  if (stop > 0) {
    i = i - 1;
  }
  Ulang();
}

module.exports = { AutoMulai, AutoOff, AutoOn, AutoCek, AutoSelesai };
