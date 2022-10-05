const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const ContactSchema = new mongoose.Schema({
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

const Contacts = mongoose.model("Contacts", ContactSchema);

module.exports = Contacts;
