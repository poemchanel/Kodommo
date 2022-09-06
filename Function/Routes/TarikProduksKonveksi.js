const Produks = require("../Database/Models/Produks");

async function TarikProdukKonveksi(req, res) {
  res = await Produks.find({
    konveksi: req,
  }); // Mengambil data Produk berdasarkan key konveksi
  return res;
} // Mengambil data Produk dengan konveksi
