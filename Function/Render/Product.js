function RenderProduk(req, res) {
  let produk = req;
  let header = `╭──「 *Detail Produk ${produk.kodebarang}* 」
*│Konveksi* : ${produk.konveksi}
*│Produk* : ${produk.namabarang}
*│Harga Modal* : Rp.${produk.hargamodal}`;

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

  let shopee;
  if (produk.shopee !== undefined) {
    shopee = `\n│──「 *Harga Shopee* 」─────${produk.shopee.map((e) => {
      if (e.status === "Aktif") {
        return `\n*│•${e.nama}* : Rp.${e.harga}`;
      } else {
        return `\n*│•${e.nama}* : ~Rp.${e.harga}~ _${e.status}_`;
      }
    })}`;
  } else {
    shopee = `\n│──「 *Harga Shopee* 」─────\n│Link Kosong`;
  }
  let DateNow = new Date();
  let TimeDifference = Math.abs(DateNow - produk.updatedAt);
  TimeDifference = Math.ceil(TimeDifference / (1000 * 60 * 60));
  let footer = `
│───────────────
*│Diupdate* : ${TimeDifference} Jam lalu
╰───────────────`;
  res = `${header}${body}${shopee}${footer}`;
  return res;
}

module.exports = RenderProduk;
