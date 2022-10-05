const TarikProduks = require("../Routes/Products/FindAll");
const UpdateProduk = require("../Routes/Products/Update");
const Scraping = require("./Scraping");

const { setTimeout } = require("timers/promises");

// Setting
let Set = {
  // NotifNumber: "120363043606962064@g.us", // Number to notify when finish
  NotifNumber: "6282246378074@c.us", // Number to notify when finish
  LogLength: 30, // Maximum Log Length
  StatusSKip: 24, // in Hours -> Skip scraping shopee status = Habis || Diarsipkan
  FinishPause: 10, // in Minute -> Delay before Continue scraping after finish
  Error1Pause: 90, // in Second -> Pause scraping when Error1 hapend
  First: "DOMMO", // Our Warehouse Name
};

let AutoState = true; // Auto Update On
let Products = [];
let i = 0;
let f = 0;
let Log = [];
let ProductsUpdated = 0;
let Skiped = [];
let Finish = false;
let ProductsUndercuted = [];

var startTime;
var endTime;

function AutoStatus(Res) {
  Res = {
    status: AutoState === true ? "Aktif" : "NonAktif",
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    gagal: Skiped.length,
    antrian: i,
    log: Log,
    state: AutoState,
  };
  return Res;
}
function AutoOn(Res) {
  let Status;
  if (AutoState === true) {
    Status = `Auto update telah aktif`;
  } else {
    Status = `Auto update diaktifkan kembali`;
    AutoState = true;
    Loop();
  }
  Res = {
    status: Status,
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    skip: Skiped.length,
    antrian: i,
  };
  return Res;
}
function AutoOff(Res) {
  AutoState = false;
  Res = {
    status: `Update Konveksi Dihentikan`,
    diupdate: ProductsUpdated,
    totalproduk: Products.length,
    gagal: Skiped.length,
    antrian: i,
  };
  return Res;
}
function AutoFinish(Res) {
  Res = {
    selesai: Finish,
    nomor: Set.NotifNumber,
    caption: `╭──「 *Informasi Update* 」
│Auto Update Selesai
│Berhasil Mengupdate ${ProductsUpdated}/${Products.length} produk
╰───────────────`,
  };
  if (Finish === true) Finish = false;
  return Res;
}
function AutoUndercut(Res) {
  if (ProductsUndercuted.length !== 0) {
    let Caption = [];
    for (let u = 0; u < ProductsUndercuted.length; u++) {
      Caption.push(
        `╭──「 *Informasi Undercut* 」
│Produk ${ProductsUndercuted.kodebarang} konveksi ${ProductsUndercuted.konveksi}
│telah diundercut oleh ${ProductsUndercuted.NamaUndercut}
│──「 *Harga Shopee* 」─────
│Harga ${ProductsUndercuted.NamaFirst}: Rp.${ProductsUndercuted.HargaFirst}
│Harga ${ProductsUndercuted.NamaUndercut}:
│          ╰ Lama : Rp.${ProductsUndercuted.HargaUndercutOld}
│          ╰ Baru : Rp.${ProductsUndercuted.HargaUndercutNew}
╰───────────────`
      );
    }
    Res = {
      selesai: true,
      nomor: Set.NotifNumber,
      caption: Caption,
    };
    ProductsUndercuted = [];
  } else {
    Res = { selesai: false };
  }
  return Res;
}

async function AutoStart(Res) {
  Products = await TarikProduks();
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
    status: `Memulai Auto Update`,
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
            Math.ceil(AutoState === true && Math.abs(new Date() - Shopee[s].diupdate) / (1000 * 60 * 60)) >
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
          if (AutoState === true) {
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
      if (AutoState === true) {
        let IdO = Products[i].shopee.findIndex((e) => e.nama === Set.First); // Index Old
        let IdN = Shopee.findIndex((f) => f.nama === Set.First); // Index New
        Shopee.forEach((g) => {
          if (g.nama !== Set.First) {
            if (IdN !== -1 && Shopee[IdN].harga > g.harga && Shopee[IdN].status === "Active" && g.status === "Active") {
              let IdT = Products[i].shopee.findIndex((h) => h.nama === g.nama); // Index Temporary
              if (Products[i].shopee[IdO].harga !== Shopee[IdN].harga || Products[i].shopee[IdT].harga !== g.harga) {
                ProductsUndercuted.push({
                  Konveksi: Products[i].konveksi,
                  KodeProduk: Products[i].kodebarang,
                  NamaFirst: Shopee[IdN].nama,
                  HargaFirst: Shopee[IdN].harga,
                  NamaUndercut: g.nama,
                  HargaUndercutNew: g.harga,
                  HargaUndercutOld: Products[i].shopee[IdT].harga,
                });
              }
            }
          }
        });

        Products[i].shopee = Shopee;
        if (Skip === true) Skiped.push(Products[i]);
        const UpdateStatus = await UpdateProduk(Products[i]);
        Log.push(`│->${UpdateStatus}`);
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
          if (AutoState === true) {
            let ScrapResult = await Scraping(Shopee[s]);
            Shopee[s] = ScrapResult.shopee;
            Log.push(ScrapResult.log);
            console.log(ScrapResult.log);
            if (ScrapResult.shopee.status === "Error1" && ScrapResult.tor === false)
              await setTimeout(Set.Error1Pause * 1000);
          }
        }
      }
      if (AutoState === true) {
        let IdO = Products[i].shopee.findIndex((e) => e.nama === Set.First); // Index Old
        let IdN = Shopee.findIndex((f) => f.nama === Set.First); // Index New
        Shopee.forEach((g) => {
          if (g.nama !== Set.First) {
            if (IdN !== -1 && Shopee[IdN].harga > g.harga && Shopee[IdN].status === "Active" && g.status === "Active") {
              let IdT = Products[i].shopee.findIndex((h) => h.nama === g.nama); // Index Temporary
              if (Products[i].shopee[IdO].harga !== Shopee[IdN].harga || Products[i].shopee[IdT].harga !== g.harga) {
                ProductsUndercuted.push({
                  Konveksi: Products[i].konveksi,
                  KodeProduk: Products[i].kodebarang,
                  NamaFirst: Shopee[IdN].nama,
                  HargaFirst: Shopee[IdN].harga,
                  NamaUndercut: g.nama,
                  HargaUndercutNew: g.harga,
                  HargaUndercutOld: Products[i].shopee[IdT].harga,
                });
              }
            }
          }
        });

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
      await setTimeout(Set.FinishPause * 60000);
      AutoStart();
    }
  }
}

module.exports = { AutoStart, AutoOff, AutoOn, AutoStatus, AutoFinish, AutoUndercut };
