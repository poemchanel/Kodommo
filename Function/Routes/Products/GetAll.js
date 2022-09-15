const Produks = require("../Database/Models/Produks");

function TarikProduks(req, res) {
  res = Produks.find(); // Mengambil data Produk berdasarkan key konveksi
  return res;
}

module.exports = TarikProduks;
