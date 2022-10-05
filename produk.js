const mongoose = require("mongoose");

const produkSchema = new mongoose.Schema({
  konveksi: String,
  kodebarang: String,
  namabarang: String,
  hargamodal: String,
  dailyprice: String,
  linkproduk: String,
  hargaproduk: String,
  pesaing: [
    {
      namapesaing: String,
      linkpesaing: String,
      hargapesaing: String,
    },
  ],
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const konveksiSchema = new mongoose.Schema({
  kodekonveksi: String,
  namakonveksi: String,
  pesaing: [String],
});

const penggunaSchema = new mongoose.Schema({
  pengguna: String,
  notelepon: String,
});

const Produk = mongoose.model("Produk", produkSchema);
const Konveksi = mongoose.model("Konveksi", konveksiSchema);
const Pengguna = mongoose.model("Pengguna", penggunaSchema);

module.exports = {
  Produk,
  Konveksi,
  Pengguna,
};
