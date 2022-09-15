const Produks = require("../Database/Models/Produks");

async function UpdateProduk(req, res) {
  res = await Produks.findOneAndUpdate({ _id: req._id }, req); // Mencari data Produk dengan key kodebarang lalu update
  return (res = `Produk ${req.kodebarang} Diupdate`);
} // Mengupdate data Produk

module.exports = UpdateProduk;
