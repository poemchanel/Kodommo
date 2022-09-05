const mongoose = require("mongoose");
const { Produk, Pengguna, Konveksi } = require("./produks");
const fs = require("fs");
const csv = require("csv-parser");
const { Console } = require("console");

mongoose.connect(
  "mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/kodommo?retryWrites=true&w=majority",
  () => {
    console.log("Terhubung ke database");
  },
  (e) => console.error(e)
);

const konveksi = [];

fs.createReadStream("APEN.csv")
  .pipe(csv({}))
  .on("data", (data) => konveksi.push(data))
  .on("end", () => {
    uploadKonveksi();
  });

async function uploadKonveksi() {
  konveksi.forEach((element) => {
    const produk = new Produk({
      konveksi: element.konveksi,
      kodebarang: element.kodebarang,
      namabarang: element.namabarang,
      hargamodal: element.hargamodal,
      dailyprice: element.dailyprice,
      linkproduk: element.linkproduk,
      linkstatus: element.linkstatus,
      hargaproduk: element.hargaproduk,
      hargaprodukmin: element.hargaprodukmin,
      pesaing: [
        {
          namapesaing: element.anamapesaing,
          linkpesaing: element.alinkpesaing,
          linkpesaingstatus: element.astatuslinkpesaing,
          hargapesaing: element.ahargapesaing,
          hargapesaingmin: element.ahargapesaingmin,
        },
        {
          namapesaing: element.bnamapesaing,
          linkpesaing: element.blinkpesaing,
          linkpesaingstatus: element.bstatuslinkpesaing,
          hargapesaing: element.bhargapesaing,
          hargapesaingmin: element.bhargapesaingmin,
        },
      ],
      updatedAt: new Date(),
      deskripsi: element.deskripsi,
    });
    produk.save();
    console.log(`${element.kodebarang} Saved`);
  });
}
