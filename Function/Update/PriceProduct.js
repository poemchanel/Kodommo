const { setTimeout } = require("timers/promises");

const Scraping = require("./Scraping");
const UpdateProduk = require("../Routes/Products/Update");

let Set = {
  Error1Pause: 90, // in Second -> Pause scraping when Error1 hapend
};

async function PriceProduct(Product, Res) {
  let Log = [];
  if (Product.shopee === undefined) {
    Log.push(`│Produk ${Product.konveksi}-${Product.kodebarang} Link Kosong`);
  } else {
    Log.push(`│Memulai Update: ${Product.konveksi}-${Product.kodebarang}`);
    let Shopee = Product.shopee;
    for (let s = 0; s < Shopee.length; s++) {
      let ScrapResult = await Scraping(Shopee[s]);
      Shopee[s] = ScrapResult.shopee;
      Log.push(ScrapResult.log);
      if (ScrapResult.shopee.status === "Error1" && ScrapResult.tor === false) {
        await setTimeout(Set.Error1Pause * 1000);
        let ScrapError = await Scraping(Shopee[s]);
        Shopee[s] = ScrapError.shopee;
        Log.push(ScrapError.log);
      } else {
        let ScrapError = await Scraping(Shopee[s]);
        Shopee[s] = ScrapError.shopee;
        Log.push(ScrapError.log);
      }
    }
    Product.shopee = Shopee;
    const UpdateStatus = await UpdateProduk(Product);
    Log.push(`│->${UpdateStatus}`);
  }
  Res = { log: Log };
  return Res;
}

module.exports = PriceProduct;
