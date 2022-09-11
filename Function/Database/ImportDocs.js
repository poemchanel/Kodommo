const Produk = require("./Models/Produks");
const fs = require("fs");
const csv = require("csv-parser");

const HubungkanDatabase = require("../Routes/HubungkanDatabase");
const CekStatusDB = require("../Routes/CekStatusDB");

HubungkanDatabase();
BacaCSV();
//Cek Status Koneksi Database
// const PersiapanDB = setInterval(StatusDB, 1000);
// async function StatusDB() {
//   const Status = await CekStatusDB();
//   switch (Status) {
//     case 0:
//       console.log("Terjadi Kesalahan, Tidak Dapat Terhubung");
//       clearInterval(PersiapanDB);
//       break;
//     case 1:
//       console.log("Berhasil Terhubung");
//       clearInterval(PersiapanDB);
//       BacaCSV();
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

const konveksi = [];

function BacaCSV() {
  fs.createReadStream("./Docs/Semua.csv")
    .pipe(csv({}))
    .on("data", (data) => konveksi.push(data))
    .on("end", () => {
      uploadKonveksi();
    });
}
async function uploadKonveksi() {
  let i = 0;
  konveksi.forEach((element) => {
    const produk = new Produk({
      konveksi: element.konveksi,
      kodebarang: element.kodebarang,
      namabarang: element.namabarang,
      hargamodal: element.hargamodal,
      dailyprice: element.dailyprice,
      linkproduk: element.linkproduk,
      linkstatus: "baru",
      hargaproduk: element.dailyprice,
      hargaprodukmin: true,
      pesaing: [
        {
          namapesaing: element.anamapesaing,
          linkpesaing: element.alinkpesaing,
          linkpesaingstatus: "baru",
          hargapesaing: element.dailyprice,
          hargapesaingmin: true,
        },
        {
          namapesaing: element.bnamapesaing,
          linkpesaing: element.blinkpesaing,
          linkpesaingstatus: "baru",
          hargapesaing: element.dailyprice,
          hargapesaingmin: true,
        },
      ],
      deskripsi: element.deskripsi,
    });
    produk.save();
    i++;
    console.log(`${i} ${element.kodebarang} Saved`);
  });
  console.log("Document Seleasi Import");
}
