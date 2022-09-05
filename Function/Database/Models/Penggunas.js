const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const penggunaSchema = new mongoose.Schema({
  namapengguna: String,
  nama: String,
  notelepon: Number,
  nomor: String,
  pangkat: String,
  updatedAt: {
    type: Date,
    default: new Date(),
  },
}); // Format Dokumen Pengguna

const Pengguna = mongoose.model("Pengguna", penggunaSchema);

module.exports = Pengguna;
