const Penggunas = require("../Database/Models/Penggunas");

async function TambahPengguna(req, res) {
  const pengguna = new Penggunas({
    namapengguna: "-",
    nama: req.pushname,
    notelepon: req.number,
    nomor: req.id._serialized,
    pangkat: "baru",
    updatedAt: new Date(),
  });
  pengguna.save();
  res = "Berhasil";
  return res;
} // Mengambil data Pengguna

module.exports = TambahPengguna;
