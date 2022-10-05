const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const konveksiSchema = new mongoose.Schema({
  kodekonveksi: String,
  namakonveksi: String,
  pesaing: { String },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
}); // Format Dokumen Konveksi

const Konveksi = mongoose.model("Konveksi", konveksiSchema);

module.exports = Konveksi;
