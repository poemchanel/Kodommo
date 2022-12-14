const mongoose = require("mongoose"); // Export Module Manipulasi Database MongoDB

const ProductSchema = new mongoose.Schema(
  {
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
          status: { type: String, default: "Baru" },
          harga: { type: Number, default: 0 },
          click: { type: [String], default: undefined },
        },
      ],
    },
    deskripsi: String,
  },
  { timestamps: { createdAt: false, updatedAt: true } }
); // Format Dokumen Produk

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products;
