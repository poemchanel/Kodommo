const Penggunas = require("../Database/Models/Penggunas");

async function UpdatePengguna(req) {
  res = await Penggunas.findOneAndUpdate({ notelepon: req.notelepon }, req); // Mencari data Produk dengan key kodebarang lalu update
}

module.exports = UpdatePengguna;
