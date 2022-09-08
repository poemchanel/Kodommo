const Penggunas = require("../Database/Models/Penggunas");

async function TarikPengguna(req, res) {
  res = await Penggunas.find({
    notelepon: req,
  });
  return res;
} // Mengambil data Pengguna

module.exports = TarikPengguna;
