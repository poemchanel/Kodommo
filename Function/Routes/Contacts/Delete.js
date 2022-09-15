const Penggunas = require("../Database/Models/Penggunas");

async function HapusPengguna(req, res) {
  res = await Penggunas.deleteOne({ _id: req._id });
  return res;
} // Mengambil data Pengguna

module.exports = HapusPengguna;
