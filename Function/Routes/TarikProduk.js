const Produks = require("../Database/Models/Produks");

async function TarikProduk(req, res) {
  res = await Produks.find({
    kodebarang: req,
  }); // Mengambil data Produk berdasarkan key kodebarang
  return res;
} // Mengambil data Produk
module.exports = TarikProduk;
