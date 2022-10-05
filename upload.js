const mongoose = require("mongoose");
const { Produk, Pengguna, Konveksi } = require("./produk");

mongoose.connect(
  "mongodb://localhost/produk",
  () => {
    console.log("Terhubung ke database");
  },
  (e) => console.error(e)
);

const pengguna = new Pengguna({
  namapengguna: "Wahyudi",
  nama: "Duyy",
  notelepon: "6282246378074",
  nomor: "6282246378074@c.us",
  pangkat: "superadmin",
  updatedAt: new Date(),
});
pengguna.save();

console.log("Berhasil");
