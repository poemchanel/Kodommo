const ProductsModels = require("../../Database/Models/Products");

async function PatchProduct(Product, Res) {
  Res = await ProductsModels.findOneAndUpdate(
    {
      _id: Product._id,
    },
    Product
  ); // Mencari data Produk dengan key kodebarang lalu update
  Res = `Produk ${Product.kodebarang} Diupdate`;
  return Res;
} // Mengupdate data Produk

module.exports = PatchProduct;
