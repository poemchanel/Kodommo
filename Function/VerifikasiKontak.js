const TarikPengguna = require("./Routes/TarikPengguna");

async function VerifikasiKontak(req, res) {
  const kontak = await TarikPengguna(req.number);
  if (kontak.length == 0) {
    res = { pangkat: "Kosong", nama: req.number };
  } else {
    res = { pangkat: kontak[0].pangkat, nama: kontak[0].nama };
  }
  return res;
} //Release // Mengambil data Pangkat Pengirim Pesan

module.exports = VerifikasiKontak;
