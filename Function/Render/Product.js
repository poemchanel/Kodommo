function RenderProduk(Product, Res) {
  let produk = Product;

  // Header
  let header = `╭──「 *Detail Produk ${produk.kodebarang}* 」
*│Konveksi* : ${produk.konveksi}
*│Produk* : ${produk.namabarang}
*│Harga Modal* : Rp.${produk.hargamodal}`;

  // Body
  let DpJual = produk.dailyprice;
  let DpSelisih = produk.dailyprice - produk.hargamodal;
  let DpPersen = Math.abs((DpSelisih / produk.dailyprice) * 100).toFixed(1);
  let FsJual = Math.round(produk.dailyprice - (produk.dailyprice * 0.5) / 100);
  let FsSelisih = FsJual - produk.hargamodal;
  let FsPersen = Math.abs(
    ((produk.dailyprice - (produk.dailyprice * 0.5) / 100 - produk.hargamodal) /
      (produk.dailyprice - (produk.dailyprice * 0.5) / 100)) *
      100
  ).toFixed(1);
  let PeJual = Math.round(produk.hargamodal + (produk.hargamodal * 8.5) / 100);
  let PeSelisih = PeJual - produk.hargamodal;
  let PePersen = Math.abs(
    ((produk.hargamodal + (produk.hargamodal * 8.5) / 100 - produk.hargamodal) /
      (produk.hargamodal + (produk.hargamodal * 8.5) / 100)) *
      100
  ).toFixed(1);
  let body = `
│────「    *Jual*  | *Selisih* |  *%* 」
*│Daily Price*  : ${DpJual} | ${DpSelisih} | ${DpPersen}
*│Flash Sale*   : ${FsJual} | ${FsSelisih} | ${FsPersen}
*│Pday/Event* : ${PeJual} | ${PeSelisih} | ${PePersen}`;

  // Shopee
  let shopee;
  if (produk.shopee !== undefined) {
    shopee = `\n│──「 *Harga Shopee* 」─────${produk.shopee.map((e) => {
      let Updated = Math.ceil(Math.abs(new Date() - e.diupdate) / (1000 * 60 * 60));
      if (e.status === "Active") {
        return `\n*│•${e.nama}* : Rp.${e.harga} 🆙${Updated}j`;
      } else {
        return `\n*│•${e.nama}* : ${e.status} 🆙${Updated}j`;
      }
    })}`;
  } else {
    shopee = `\n│──「 *Harga Shopee* 」─────\n│Link Kosong`;
  }

  Res = `${header}${body}${shopee}`;
  return Res;
}

module.exports = RenderProduk;
