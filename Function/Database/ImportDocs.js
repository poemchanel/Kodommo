const Products = require("./Models/Products");
const fs = require("fs");
const csv = require("csv-parser");

const DBConnect = require("../Routes/DBConnect");
const DBState = require("../Routes/DBState");

DBConnect();
ReadCSV();
//Cek Status Koneksi Database
// const PersiapanDB = setInterval(StatusDB, 1000);
// async function StatusDB() {
//   const Status = await DBState();
//   switch (Status) {
//     case 0:
//       console.log("Terjadi Kesalahan, Tidak Dapat Terhubung");
//       clearInterval(PersiapanDB);
//       break;
//     case 1:
//       console.log("Berhasil Terhubung");
//       clearInterval(PersiapanDB);
//       ReadCSV();
//       break;
//     case 2:
//       console.log("Sedang Menghubungkan...");
//       break;
//     case 3:
//       console.log("Koneksi Terputus, Mencoba Menghubungkan Kembali...");
//       HubungkanDatabase();
//       break;
//     default:
//       break;
//   }
// }

const tmp = [];
let konveksi = [];

function ReadCSV() {
  fs.createReadStream("./Docs/ACNES.csv")
    .pipe(csv({}))
    .on("data", (data) => tmp.push(data))
    .on("end", () => {
      Refactor();
    });
}
function Refactor() {
  tmp.forEach((e) => {
    let produk = {};
    let pesaing = {};
    let click = [];
    produk.konveksi = e.konveksi;
    produk.kodebarang = e.kodebarang;
    produk.namabarang = e.namabarang;
    produk.deskripsi = e.deskripsi;
    produk.hargamodal = e.hargamodal;
    produk.dailyprice = e.dailyprice;
    pesaing = {};

    if (e.alink !== "") {
      click = [];
      if (e.aclick1 !== "") {
        click.push(e.aclick1);
        if (e.aclick2 !== "") {
          click.push(e.aclick2);
          if (e.aclick3 !== "") {
            click.push(e.aclick3);
          }
        }
      }
      if (click.length !== 0) {
        pesaing = {
          nama: e.anama,
          link: e.alink,
          status: "Baru",
          harga: 0,
          click: click,
        };
      } else {
        pesaing = {
          nama: e.anama,
          link: e.alink,
          status: "Baru",
          harga: 0,
        };
      }
      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.blink !== "") {
      click = [];
      if (e.bclick1 !== "") {
        click.push(e.bclick1);
        if (e.bclick2 !== "") {
          click.push(e.bclick2);
          if (e.bclick3 !== "") {
            click.push(e.bclick3);
          }
        }
      }
      if (click.length !== 0) {
        pesaing = {
          nama: e.bnama,
          link: e.blink,
          status: "Baru",
          harga: 0,
          click: click,
        };
      } else {
        pesaing = {
          nama: e.bnama,
          link: e.blink,
          status: "Baru",
          harga: 0,
        };
      }

      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.clink !== "") {
      click = [];
      if (e.cclick1 !== "") {
        click.push(e.cclick1);
        if (e.cclick2 !== "") {
          click.push(e.cclick2);
          if (e.cclick3 !== "") {
            click.push(e.cclick3);
          }
        }
      }
      if (click.length !== 0) {
        pesaing = {
          nama: e.cnama,
          link: e.clink,
          status: "Baru",
          harga: 0,
          click: click,
        };
      } else {
        pesaing = {
          nama: e.cnama,
          link: e.clink,
          status: "Baru",
          harga: 0,
        };
      }

      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.dlink !== "") {
      click = [];
      if (e.dclick1 !== "") {
        click.push(e.dclick1);
        if (e.dclick2 !== "") {
          click.push(e.dclick2);
          if (e.dclick3 !== "") {
            click.push(e.dclick3);
          }
        }
      }
      if (click.length !== 0) {
        pesaing = {
          nama: e.dnama,
          link: e.dlink,
          status: "Baru",
          harga: 0,
          click: click,
        };
      } else {
        pesaing = {
          nama: e.dnama,
          link: e.dlink,
          status: "Baru",
          harga: 0,
        };
      }

      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    konveksi.push(produk);
  });
  UploadKonveksi();
}

async function UploadKonveksi() {
  let i = 0;
  konveksi.forEach((e) => {
    let produk = new Products(e);
    produk.save();
    i++;
    console.log(`${i} ${e.kodebarang} Saved`);
  });
  console.log("Document Seleasi Import");
}
