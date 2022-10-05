const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

const C = {
  Dark: "#221F33",
  Yellow: "#EDC18D",
  Red: "#C76662",
  Brown: "#7D808E",
}; // Pallete
const CS = {
  Backgrond: C.Dark,
  Default: C.Yellow,
  Undercuted: C.Red,
  Outdated: C.Brown,
}; // Color Theme

async function RenderUndercutPDF(Products, Res) {
  let ProduksUndecut = [];
  let First = "DOMMO";
  let ShopeeLength = 0;

  //Filter Produks that are Undercuted
  Products.forEach((e) => {
    let Undercuted = false;
    let IndexFirst;
    if (e.shopee !== undefined) {
      IndexFirst = e.shopee.findIndex((f) => f.nama === First);
      e.shopee.forEach((g) => {
        if (
          IndexFirst !== -1 &&
          e.shopee[IndexFirst].status === "Active" &&
          e.shopee[IndexFirst].harga > g.harga &&
          g.status === "Active"
        )
          Undercuted = true;
      });
    }
    if (Undercuted === true) {
      e.shopee.sort((x, y) => (x.nama == First ? -1 : y.nama == First ? 1 : 0));
      ProduksUndecut.push(e);
      if (e.shopee.length > ShopeeLength) ShopeeLength = e.shopee.length;
    }
  });

  // Canvas Size
  let Csize = { w: 555, l: 310 };
  Csize.w = Csize.w + 90 * ShopeeLength;
  Csize.l = Csize.l + ProduksUndecut.length * 30;

  // Create kanvas
  const canvas = createCanvas(Csize.w, Csize.l, "pdf");
  const context = canvas.getContext("2d");
  context.fillStyle = CS.Backgrond;
  context.fillRect(0, 0, Csize.w, Csize.l);

  // Title
  context.fillStyle = CS.Default;
  context.textAlign = "left";
  context.font = "bold 28pt 'Tahoma'";
  context.fillText(`DAFTAR PRODUK`, 30, 60);
  context.font = "16pt 'Tahoma'";
  context.fillText(`「 UNDERCUTED 」`, 50, 110);

  // Table Header
  context.textAlign = "center";
  context.strokeStyle = CS.Default;
  context.font = "12pt 'Tahoma'";
  context.strokeRect(50, 120, 105, 30);
  context.fillText("Konveksi", 102.5, 140);
  context.strokeRect(155, 120, 65, 30);
  context.fillText("Kode", 187.5, 140);
  context.strokeRect(220, 120, 195, 30);
  context.fillText("Nama Barang", 317.5, 140);
  context.strokeRect(415, 120, 90, 30);
  context.fillText("Modal", 460, 140);
  let ph = [
    { x: 505, y: 120, tx: 550, ty: 140 },
    { x: 595, y: 120, tx: 640, ty: 140 },
    { x: 685, y: 120, tx: 730, ty: 140 },
    { x: 775, y: 120, tx: 820, ty: 140 },
    { x: 865, y: 120, tx: 910, ty: 140 },
    { x: 955, y: 120, tx: 1000, ty: 140 },
    { x: 1045, y: 120, tx: 1090, ty: 140 },
  ];
  context.strokeRect(ph[0].x, ph[0].y, 90, 30);
  context.fillText(First, ph[0].tx, ph[0].ty);
  for (let i = 1; i < ShopeeLength; i++) {
    context.strokeRect(ph[i].x, ph[i].y, 90, 30);
    context.fillText(`Pesaing ${[i]}`, ph[i].tx, ph[i].ty);
  }

  // Tabel Body
  let ProductColor = CS.Default;
  let piy = 0;
  for (let j = 0; j < ProduksUndecut.length; j++) {
    piy = piy + 30;
    let Shopee = ProduksUndecut[j].shopee;

    // Shopee
    let d = Shopee.findIndex((f) => f.nama === First);
    context.fillStyle =
      Math.ceil(Math.abs(new Date() - Shopee[d].diupdate) / (1000 * 60 * 60)) > 3 ? CS.Outdated : CS.Default;
    context.fillText(Shopee[d].harga, ph[0].tx, piy + ph[0].ty);
    let pt = 0;
    for (let l = 0; l < ShopeeLength; l++) {
      context.strokeRect(ph[l].x, piy + ph[l].y, 90, 30);
      if (Shopee[l] !== undefined) {
        if (Shopee[l].nama !== First) {
          pt++;
          context.fillStyle =
            Math.ceil(Math.abs(new Date() - Shopee[l].diupdate) / (1000 * 60 * 60)) > 3 ? CS.Outdated : CS.Default;
          context.fillText(
            Shopee[l].status === "Active" ? Shopee[l].harga : Shopee[l].status,
            ph[pt].tx,
            piy + ph[pt].ty
          );
        }
      } else {
        context.fillStyle = CS.Default;
        context.fillText("-", ph[l].tx, piy + ph[l].ty);
      }
      context.fillStyle = CS.Default;
    }

    // Product
    context.fillStyle = ProductColor;
    context.strokeRect(50, piy + 120, 105, 30);
    context.fillText(ProduksUndecut[j].konveksi, 102.5, piy + 140);
    context.strokeRect(155, piy + 120, 65, 30);
    context.fillText(ProduksUndecut[j].kodebarang, 187.5, piy + 140);
    context.strokeRect(220, piy + 120, 195, 30);
    context.fillText(ProduksUndecut[j].namabarang.substring(0, 20), 317.5, piy + 140);
    context.strokeRect(415, piy + 120, 90, 30);
    context.fillText(ProduksUndecut[j].hargamodal, 460, piy + 140);
    ProductColor = CS.Default;
  }

  //footer
  context.textAlign = "left";
  // Index
  context.fillStyle = CS.Default;
  context.font = "bold 9pt 'Tahoma'";
  context.fillText("「 Index 」", 50, Csize.l - 140);
  context.font = "9pt 'Tahoma'";
  context.fillText(`New`, 60, Csize.l - 125);
  context.fillText(`: Data Baru di Upload`, 120, Csize.l - 125);
  context.fillText(`\nDiarsipkan`, 60, Csize.l - 125);
  context.fillText(`\n: Prdouk Diarsipkan`, 120, Csize.l - 125);
  context.fillText(`\n\nHabis`, 60, Csize.l - 125);
  context.fillText(`\n\n: Produk Habis`, 120, Csize.l - 125);
  context.fillText(`\n\n\nOption`, 60, Csize.l - 125);
  context.fillText(`\n\n\n: Kategori Kosong`, 120, Csize.l - 125);
  context.fillText(`\n\n\n\n-`, 60, Csize.l - 125);
  context.fillText(`\n\n\n\n: Link Kosong`, 120, Csize.l - 125);

  context.fillText(`Error0`, 260, Csize.l - 125);
  context.fillText(`: Link Bermasalah`, 300, Csize.l - 125);
  context.fillText(`\nError1`, 260, Csize.l - 125);
  context.fillText(`\n: Scraping Bermasalah`, 300, Csize.l - 125);
  context.fillStyle = CS.Outdated;
  context.fillText(`\n\nText`, 260, Csize.l - 125);
  context.fillText(`\n\n: Diupdate > 3 jam lalu`, 300, Csize.l - 125);

  //Tips
  context.fillStyle = CS.Default;
  context.font = "bold 9pt 'Tahoma'";
  context.fillText("「 Tips 」", 50, Csize.l - 40);
  context.font = "italic 9pt 'Tahoma'";
  context.fillText("Gunakan perintah !Produk <Kode Produk>\nUntuk melihat detail individual produk", 60, Csize.l - 25); //Letak Text

  // Save PNG
  fs.writeFileSync(
    `./Function/Render/Docs/Undercut.pdf`,
    canvas.toBuffer("application/pdf", {
      title: `Undercut`,
      keywords: `node.js Undercut`,
      creationDate: new Date(),
    })
  );

  Res = `./Function/Render/Docs/Undercut.pdf`;
  return Res;
} // Membuat Gambar Undercut PNG

module.exports = RenderUndercutPDF;
