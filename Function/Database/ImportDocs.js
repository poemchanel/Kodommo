const fs = require("fs");
const csv = require("csv-parser");

const DBConnect = require("../Routes/DBConnect");
const ProductModels = require("./Models/Products");

DBConnect();
ReadCSV();

const tmp = [];
let konveksi = [];

function ReadCSV() {
  fs.createReadStream("./Docs/CARASUN.csv")
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
    produk.konveksi = e.konveksi;
    produk.kodebarang = e.kodebarang;
    produk.namabarang = e.namabarang;
    produk.deskripsi = e.deskripsi;
    produk.hargamodal = e.hargamodal;
    produk.dailyprice = e.dailyprice;
    if (e.alink !== "") {
      pesaing = {
        nama: e.anama,
        link: e.alink,
        diupdate: new Date(),
      };
      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.blink !== "") {
      pesaing = {
        nama: e.bnama,
        link: e.blink,
        diupdate: new Date(),
      };
      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.clink !== "") {
      pesaing = {
        nama: e.cnama,
        link: e.clink,
        diupdate: new Date(),
      };
      if (produk.shopee === undefined) {
        produk.shopee = [pesaing];
      } else {
        produk.shopee.push(pesaing);
      }
    }
    if (e.dlink !== "") {
      pesaing = {
        nama: e.dnama,
        link: e.dlink,
        diupdate: new Date(),
      };
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
    let produk = new ProductModels(e);
    produk.save();
    i++;
    console.log(`${i} ${e.kodebarang} Saved`);
  });
  console.log("Document Seleasi Import");
}
