const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const produkSchema = new mongoose.Schema(
  {
    konveksi: String,
    kodebarang: String,
    namabarang: String,
    hargamodal: Number,
    dailyprice: Number,
    linkproduk: String,
    linkstatus: String,
    hargaproduk: String,
    hargaprodukmin: Boolean,
    pesaing: [
      {
        namapesaing: String,
        linkpesaing: String,
        linkpesaingstatus: String,
        hargapesaing: String,
        hargapesaingmin: Boolean,
      },
    ],
    deskripsi: String,
  },
  { timestamps: true }
); // Format Dokumen Produk

const Produk = mongoose.model("Produk", produkSchema);

module.exports = Produk;
