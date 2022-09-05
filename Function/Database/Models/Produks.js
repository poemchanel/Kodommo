const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const produkSchema = new mongoose.Schema({
  konveksi: String,
  kodebarang: String,
  namabarang: String,
  hargamodal: Number,
  dailyprice: Number,
  linkproduk: String,
  linkstatus: String,
  hargaproduk: Number,
  hargaprodukmin: Boolean,
  pesaing: [
    {
      namapesaing: String,
      linkpesaing: String,
      linkpesaingstatus: String,
      hargapesaing: Number,
      hargapesaingmin: Boolean,
    },
  ],
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  deskripsi: String,
}); // Format Dokumen Produk

const Produk = mongoose.model("Produk", produkSchema);

module.exports = Produk;
