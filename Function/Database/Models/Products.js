const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const ProductSchema = new mongoose.Schema({
  konveksi: String,
  kodebarang: String,
  namabarang: String,
  hargamodal: { type: Number, default: 0 },
  dailyprice: { type: Number, default: 0 },
  shopee: {
    default: undefined,
    type: [
      {
        _id: false,
        nama: String,
        link: String,
        harga: { type: Number, default: 0 },
        status: { type: String, default: "New" },
        kategori: { type: String, default: undefined },
        diupdate: Date,
      },
    ],
  },
  deskripsi: String,
}); // Format Dokumen Produk

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products;
