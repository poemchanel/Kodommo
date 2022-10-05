const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const UpdateProduk = require("../Routes/UpdateProduk");

let ScrapUpdate = false;
let ProdukTmp = [];
let log = [];
let updated = 0;
let failed = [];
let produklength = 0;
let queue = 0;
let finish = false;
let berhenti = true;

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
    antrian: queue,
    log: log,
    state: ScrapUpdate,
  };
  return res;
}

function HargaKonveksiOn(res) {
  if (queue < produklength) {
    ScrapUpdate = true;
    HargaKonveksiMulai(ProdukTmp, queue);
    res = {
      status: `Update Konveksi diaktifkan kembali`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: queue,
    };
  } else {
    res = {
      status: `Update Konveksi selesai`,
      diupdate: updated,
      totalproduk: produklength,
      gagal: failed,
      antrian: queue,
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
    antrian: queue,
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
    antrian: queue,
    gagal: failed,
    selesai: finish,
  };
  if (finish === true) {
    finish = false;
  }
  return res;
}

async function HargaKonveksiMulai(Produks, Que, res) {
  berhenti = false;
  ScrapUpdate = true;
  finish = false;
  produklength = Produks.length;
  ProdukTmp = Produks;
  let i = Que;
  ProduksLoop();
  async function ProduksLoop() {
    if (log.length > 11) log.splice(0, 5);
    queue = i;
    let Berhasil = 0;
    let data = Produks[i];
    if (ScrapUpdate === true) {
      const browser = await puppeteer.launch({ headless: true }); // Membuka Browser
      try {
        const page = await browser.newPage(); // Membuka Tab Baru di Browser
        log.push(`│Memulai Update ${i}: ${data.konveksi}-${data.kodebarang}`);
        if (ScrapUpdate === true) {
          if (data.linkproduk !== "-") {
            await page.goto(data.linkproduk);
            try {
              await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
              let statusclass = await page.$("[class='_1WIqzi']");
              let statusvalue = await page.evaluate((el) => el.textContent, statusclass);
              data.linkstatus = statusvalue;
              log.push(`│->Produk ${data.kodebarang} link ${statusvalue}`);
            } catch (error) {
              try {
                await page.waitForSelector("[class='_2Shl1j']");
                let element = await page.$("[class='_2Shl1j']");
                let value = await page.evaluate((el) => el.textContent, element);
                value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                if (value.includes("-") === true) {
                  value = value.split("-");
                  if (data.hargaprodukmin == false) {
                    value = value[1];
                  } else {
                    value = value[0];
                  }
                  data.hargaproduk = value;
                } else {
                  data.hargaproduk = value;
                }
                data.linkstatus = "Aktif";
                log.push(`│->Produk ${data.kodebarang} link Aktif\n│   ╰ Harga : Rp.${value}`);
              } catch (error) {
                data.linkstatus = "Bermasalah";
                log.push(`│->Produk ${data.kodebarang} link Bermasalah`);
              }
            }
          } else {
            data.linkstatus = "Kosong";
            log.push(`│->Produk ${data.kodebarang} link Kosong`);
          }
        } else {
          berhenti = true;
        }
        if (ScrapUpdate === true) {
          if (data.pesaing[0].linkpesaing != "-") {
            await page.goto(data.pesaing[0].linkpesaing);
            try {
              await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
              let statusclass0 = await page.$("[class='_1WIqzi']");
              let statusvalue0 = await page.evaluate((el) => el.textContent, statusclass0);
              data.pesaing[0].linkpesaingstatus = statusvalue0;
              log.push(`│->Pesaing ${data.pesaing[0].namapesaing} link ${statusvalue0}`);
            } catch (error) {
              try {
                await page.waitForSelector("[class='_2Shl1j']");
                let element0 = await page.$("[class='_2Shl1j']");
                let value0 = await page.evaluate((el) => el.textContent, element0);
                value0 = value0.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                if (value0.includes("-") === true) {
                  value0 = value0.split("-");
                  if (data.pesaing[0].hargapesaingmin == false) {
                    value0 = value0[1];
                  } else {
                    value0 = value0[0];
                  }
                  data.pesaing[0].hargapesaing = value0;
                } else {
                  data.pesaing[0].hargapesaing = value0;
                }
                data.pesaing[0].linkpesaingstatus = "Aktif";
                log.push(`│->Pesaing ${data.pesaing[0].namapesaing} link Aktif\n│   ╰ Harga : Rp.${value0}`);
              } catch (error) {
                data.pesaing[0].linkpesaingstatus = "Bermasalah";
                log.push(`│->Pesaing ${data.pesaing[0].namapesaing} link Bermasalah`);
              }
            }
          } else {
            data.pesaing[0].linkpesaingstatus = "Kosong";
            log.push(`│->Pesaing ${data.pesaing[0].namapesaing} link Kosong`);
          }
        } else {
          berhenti = true;
        }
        if (ScrapUpdate === true) {
          if (data.pesaing[1].linkpesaing != "-") {
            await page.goto(data.pesaing[1].linkpesaing);
            try {
              await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
              let statusclass1 = await page.$("[class='_1WIqzi']");
              let statusvalue1 = await page.evaluate((el) => el.textContent, statusclass1);
              data.pesaing[1].linkpesaingstatus = statusvalue1;
              log.push(`│->Pesaing ${data.pesaing[1].namapesaing} link ${statusvalue1}`);
            } catch (error) {
              try {
                await page.waitForSelector("[class='_2Shl1j']");
                let element1 = await page.$("[class='_2Shl1j']");
                let value1 = await page.evaluate((el) => el.textContent, element1);
                value1 = value1.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                if (value1.includes("-") === true) {
                  value1 = value1.split("-");
                  if (data.pesaing[1].hargapesaingmin == false) {
                    value1 = value1[1];
                  } else {
                    value1 = value1[0];
                  }
                  data.pesaing[1].hargapesaing = value1;
                } else {
                  data.pesaing[1].hargapesaing = value1;
                }
                data.pesaing[1].linkpesaingstatus = "Aktif";
                log.push(`│->Pesaing ${data.pesaing[1].namapesaing} link Aktif\n│   ╰ Harga : Rp.${value1}`);
              } catch (error) {
                data.pesaing[1].linkpesaingstatus = "Bermasalah";
                log.push(`│->Pesaing ${data.pesaing[1].namapesaing} link Bermasalah`);
              }
            }
          } else {
            data.pesaing[1].linkpesaingstatus = "Kosong";
            log.push(`│->Pesaing ${data.pesaing[1].namapesaing} link Kosong`);
          }
        } else {
          berhenti = true;
        }
        if (ScrapUpdate === true) {
          const UpdateStatus = await UpdateProduk(data);
          log.push(`│${UpdateStatus}`);
          Berhasil = 1;
        } else {
          berhenti = true;
        }
      } catch (error) {
        console.log(error);
        log.push(`│Proses scraping terhenti!\n│melanjutkan ulang proses\n│setelah 90 detik...`);
        failed.push(`${i}: ${data.konveksi}-${data.kodebarang}`);
        Berhasil = 0;
      }
      await browser.close();
    } else {
      berhenti = true;
    }
    if (berhenti === true) {
      i = i - 1;
    }
    if (Berhasil === 1) {
      updated = updated + 1;
      i++;
      if (i < Produks.length) {
        if (ScrapUpdate === true) {
          ProduksLoop();
        }
      } else {
        ScrapUpdate = false;
        finish = true;
      }
    } else {
      i++;
      if (i < Produks.length) {
        if (ScrapUpdate === true) {
          setTimeout(ProduksLoop, 60000);
        }
      } else {
        ScrapUpdate = false;
        finish = true;
      }
    }
  }
  res = {
    status: `Memulai update konveksi`,
    totalproduk: produklength,
  };
  return res;
}

module.exports = { HargaKonveksiMulai, HargaKonveksiOff, HargaKonveksiOn, HargaKonveksiCek, KonveksiSelesai };
