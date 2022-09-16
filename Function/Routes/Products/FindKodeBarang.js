const ProductsModels = require("../../Database/Models/Products");

async function GetProduct(KodeBarang, Res) {
  Res = await ProductsModels.find({
    kodebarang: KodeBarang,
  }); // Mengambil data Produk berdasarkan key kodebarang
  return Res;
} // Mengambil data Produk
module.exports = GetProduct;
