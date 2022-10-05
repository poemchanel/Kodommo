const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

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
}); // Format Dokumen Produk

const konveksiSchema = new mongoose.Schema({
  kodekonveksi: String,
  namakonveksi: String,
  pesaing: [String],
}); // Format Dokumen Konveksi

const penggunaSchema = new mongoose.Schema({
  namapengguna: String,
  nama: String,
  notelepon: String,
  nomor: String,
  pangkat: String,
  updatedAt: {
    type: Date,
    default: new Date(),
  },
}); // Format Dokumen Pengguna

const Produk = mongoose.model("Produk", produkSchema);
const Konveksi = mongoose.model("Konveksi", konveksiSchema);
const Pengguna = mongoose.model("Pengguna", penggunaSchema);

module.exports = {
  Produk,
  Konveksi,
  Pengguna,
}; // Export Format Dokumen
