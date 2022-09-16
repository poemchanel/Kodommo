const ProductsModels = require("../../Database/Models/Products");

function GetProducts(Res) {
  Res = ProductsModels.find(); // Mengambil data Produk berdasarkan key konveksi
  return Res;
}

module.exports = GetProducts;
