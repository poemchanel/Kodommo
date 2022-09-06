const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

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

const Penggunas = mongoose.model("Penggunas", penggunaSchema);

module.exports = Penggunas;
