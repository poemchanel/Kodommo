const ProductsModels = require("../../Database/Models/Products");

async function GetKonveksi(Konveksi, Res) {
  Res = await ProductsModels.find({
    konveksi: Konveksi,
  }); // Mengambil data Produk berdasarkan key konveksi
  return Res;
} // Mengambil data Produk dengan konveksi

module.exports = GetKonveksi;
