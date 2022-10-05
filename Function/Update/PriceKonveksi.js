const { setTimeout } = require("timers/promises");

const Scraping = require("./Scraping");
const UpdateProduk = require("../Routes/Products/Update");

let Set = {
  // NotifNumber: "120363043606962064@g.us", // Number to notify when finish
  NotifNumber: "6282246378074@c.us", // Number to notify when finish
  LogLength: 30, // Maximum Log Length
  StatusSKip: 24, // in Hours -> Skip scraping shopee status = Habis || Diarsipkan
  Error1Pause: 90, // in Second -> Pause scraping when Error1 hapend
};

let KonveksiState = true; // Auto Update On
let Products = [];
let i = 0;
let f = 0;
let Log = [];
let ProductsUpdated = 0;
let Skiped = [];
let Finish = false;

var startTime;
var endTime;

function KonveksiStatus(Res) {
  Res = {
    status: KonveksiState === true ? "Aktif" : "NonAktif",
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    gagal: Skiped.length,
    antrian: i,
    log: Log,
    state: KonveksiState,
  };
  return Res;
}
function KonvkesiOn(Res) {
  let Status;
  if (i < Products.length) {
    KonveksiState = true;
    Loop();
    Status = "Update Konveksi diaktifkan kembali";
  } else {
    Status = "Update Konveksi selesai";
  }
  Res = {
    status: Status,
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    gagal: Skiped.length,
    antrian: i,
  };
  return Res;
}
function KonveksiOff(Res) {
  KonveksiState = false;
  Res = {
    status: `Update Konveksi Dihentikan`,
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    gagal: Skiped.length,
    antrian: i,
  };
  return Res;
}
function KonveksiFinish(Res) {
  Res = {
    selesai: Finish,
    nomor: Set.NotifNumber,
    caption: `╭──「 *Informasi Update* 」
│Update Konveksi Selesai
│Berhasil Mengupdate ${ProductsUpdated}/${Products.length} produk
╰───────────────`,
  };
  if (Finish === true) Finish = false;
  return Res;
}
function KonveksiStart(Req, Res) {
  KonveksiState = true;
  Products = Req;
  i = 0;
  f = 0;
  Log = [];
  ProductsUpdated = 0;
  Skiped = [];
  Finish = false;
  Loop();
  startTime = performance.now();
  console.log(startTime);
  Res = {
    status: `Memulai update konveksi`,
    totalproduk: Products.length,
  };
  return Res;
}
async function Loop() {
  if (Log.length > Set.LogLength) Log.splice(0, 5); // Cut Log
  if (i < Products.length) {
    console.log(`${i}-${Products[i].konveksi}-${Products[i].kodebarang}`);
    if (Products[i].shopee === undefined) {
      Log.push(`│Produk ${Products[i].konveksi}-${Products[i].kodebarang} Link Kosong`);
      i++;
      Loop();
    } else {
      Log.push(`│Memulai Update: ${Products[i].konveksi}-${Products[i].kodebarang}`);
      let Skip = false;
      let Shopee = Products[i].shopee;
      for (let s = 0; s < Shopee.length; s++) {
        if (Shopee[s].status === "Habis" || Shopee[s].status === "Diarsipkan") {
          if (
            Math.ceil(KonveksiState === true && Math.abs(new Date() - Shopee[s].diupdate) / (1000 * 60 * 60)) >
            Set.StatusSKip
          ) {
            let ScrapResult = await Scraping(Shopee[s]);
            Shopee[s] = ScrapResult.shopee;
            Log.push(ScrapResult.log);
            console.log(ScrapResult.log);
            if (Shopee[s].status.includes("Error")) Skip = true;
            if (ScrapResult.shopee.status === "Error1" && ScrapResult.tor === false) {
              await setTimeout(Set.Error1Pause * 1000);
            }
          } else {
            Log.push(`│->Produk ${Shopee[s].nama} link ${Shopee[s].status} 🆙< ${Set.StatusSKip}j`);
            console.log(`│->Produk ${Shopee[s].nama} link ${Shopee[s].status} 🆙< ${Set.StatusSKip}j`);
          }
        } else {
          if (KonveksiState === true) {
            let ScrapResult = await Scraping(Shopee[s]);
            Shopee[s] = ScrapResult.shopee;
            Log.push(ScrapResult.log);
            console.log(ScrapResult.log);
            if (Shopee[s].status.includes("Error")) Skip = true;
            if (ScrapResult.shopee.status === "Error1" && ScrapResult.tor === false) {
              await setTimeout(Set.Error1Pause * 1000);
            }
          }
        }
      }
      if (KonveksiState === true) {
        Products[i].shopee = Shopee;
        if (Skip === true) Skiped.push(Products[i]);
        const UpdateStatus = await UpdateProduk(Products[i]);
        Log.push(`│->${UpdateStatus}`);
        ProductsUpdated++;
        i++;
        Loop();
      }
    }
  } else {
    if (f < Skiped.length) {
      console.log(`${f}-${Skiped[f].konveksi}-${Skiped[f].kodebarang}`);
      Log.push(`│Memulai Update: ${Skiped[f].konveksi}-${Skiped[f].kodebarang}`);
      let Shopee = Skiped[f].shopee;
      for (let s = 0; s < Shopee.length; s++) {
        if (Shopee[s].status.includes("Error")) {
          if (KonveksiState === true) {
            let ScrapResult = await Scraping(Shopee[s]);
            Shopee[s] = ScrapResult.shopee;
            Log.push(ScrapResult.log);
            console.log(ScrapResult.log);
            if (ScrapResult.shopee.status === "Error1" && ScrapResult.tor === false)
              await setTimeout(Set.Error1Pause * 1000);
          }
        }
      }
      if (KonveksiState === true) {
        Skiped[f].shopee = Shopee;
        const UpdateStatus = await UpdateProduk(Skiped[f]);
        Log.push(`│->${UpdateStatus}`);
        f++;
        Loop();
      }
    } else {
      endTime = performance.now() - startTime;
      console.log(`Selesai Dalam ${endTime} milliseconds`);
      Finish = true;
    }
  }
}

module.exports = { KonveksiStatus, KonvkesiOn, KonveksiOff, KonveksiFinish, KonveksiStart };
