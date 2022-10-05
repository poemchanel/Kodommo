const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

function CanvasSize(Produk, Res) {
  let Shopee = [];
  Res = { w: 450, l: 310 };
  Produk.forEach((e) => {
    Res.l = Res.l + 30;
    try {
      e.shopee.forEach((f) => {
        if (!Shopee.includes(f.nama)) {
          Shopee.push(f.nama);
        }
      });
    } catch (error) {}
  });
  Res.w = Res.w + 90 * Shopee.length;
  Res.Shopee = Shopee;
  return Res;
}

async function RenderProduksKonveksiPDF(Products, Konveksi, Res) {
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

  const produk = Products;
  let csize = CanvasSize(Products); // Canvas Size

  let Shopee = csize.Shopee;

  // Membuat kanvas
  const canvas = createCanvas(csize.w, csize.l, "pdf"); // Ukuran Gambar
  const context = canvas.getContext("2d");
  context.fillStyle = CS.Backgrond; // Warna Background
  context.fillRect(0, 0, csize.w, csize.l); // Memberi Warna Background

  //Title
  context.fillStyle = CS.Default; // Warna Text Warna = Putih
  context.textAlign = "left"; // Posisi Text Rata = Tengah
  context.font = "bold 28pt 'Tahoma'"; // Text Ukuran, Font = Tahoma
  context.fillText(`DAFTAR PRODUK`, 30, 60); // Letak Tulisan Judul
  context.font = "16pt 'Tahoma'"; // Text Ukuran, Font = Tahoma
  context.fillText(`「 KONVEKSI ${Konveksi} 」`, 50, 110); // Letak Tulisan Judul

  //Table Header
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.strokeStyle = CS.Default; // Warna Kotak
  context.font = "12pt 'Tahoma'"; // Text Ukuran = 12pt, Font= Tamoha
  context.strokeRect(50, 120, 65, 30); // Col Kode
  context.fillText("Kode", 82.5, 140);
  context.strokeRect(115, 120, 195, 30); // Col Nama Barang
  context.fillText("Nama Barang", 212.5, 140);
  context.strokeRect(310, 120, 90, 30); // Col Modal
  context.fillText("Modal", 355, 140);
  let ph = [
    { x: 400, y: 120, tx: 445, ty: 140 },
    { x: 490, y: 120, tx: 535, ty: 140 },
    { x: 580, y: 120, tx: 625, ty: 140 },
    { x: 670, y: 120, tx: 715, ty: 140 },
  ];
  var first = "DOMMO";
  Shopee.sort((x, y) => (x == first ? -1 : y == first ? 1 : 0));
  for (let i = 0; i < Shopee.length; i++) {
    context.strokeRect(ph[i].x, ph[i].y, 90, 30);
    context.fillText(Shopee[i], ph[i].tx, ph[i].ty);
  }

  //Isi Tabel
  let ProductColor = CS.Default;
  let piy = 0;
  for (let j = 0; j < produk.length; j++) {
    piy = piy + 30;
    let hargafirst = 0;
    if (produk[j].shopee !== undefined) {
      produk[j].shopee.forEach((f) =>
        f.nama === first && f.status === "Active" ? (hargafirst = f.harga) : (tes = f.harga)
      );
    }
    //Shopee
    if (Shopee !== undefined) {
      for (let f = 0; f < Shopee.length; f++) {
        context.strokeRect(ph[f].x, piy + ph[f].y, 90, 30); // Col
        if (produk[j].shopee !== undefined) {
          let Kosong = true;
          produk[j].shopee.forEach((e) => {
            let TimeDifference = Math.ceil(Math.abs(new Date() - e.diupdate) / (1000 * 60 * 60));
            context.fillStyle = TimeDifference > 3 ? CS.Outdated : CS.Default;
            if (e.nama === Shopee[f]) {
              if (e.harga < hargafirst && e.status === "Active") ProductColor = CS.Undercuted;
              context.fillText(e.status === "Active" ? e.harga : e.status, ph[f].tx, piy + ph[f].ty);
              Kosong = false;
            }
          });
          context.fillStyle = CS.Default;
          if (Kosong === true) context.fillText("-", ph[f].tx, piy + ph[f].ty);
        } else {
          context.fillStyle = CS.Default;
          context.fillText("-", ph[f].tx, piy + ph[f].ty);
        }
      }
    }
    // Product
    context.fillStyle = ProductColor;
    context.strokeRect(50, piy + 120, 65, 30); // Col Kode
    context.fillText(produk[j].kodebarang, 82.5, piy + 140);
    context.strokeRect(115, piy + 120, 195, 30); // Col Nama Barang
    context.fillText(produk[j].namabarang.substring(0, 20), 212.5, piy + 140);
    context.strokeRect(310, piy + 120, 90, 30); // Col Modal
    context.fillText(produk[j].hargamodal, 355, piy + 140);
    ProductColor = CS.Default;
  }

  //footer
  context.textAlign = "left"; // Posisi Text Rata = Kiri
  // Index
  context.fillStyle = CS.Default;
  context.font = "bold 9pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText("「 Index 」", 50, csize.l - 140); //Letak Text
  context.font = "9pt 'Tahoma'";
  context.fillText(`New`, 60, csize.l - 125);
  context.fillText(`: Data Baru di Upload`, 120, csize.l - 125);
  context.fillText(`\nDiarsipkan`, 60, csize.l - 125);
  context.fillText(`\n: Prdouk Diarsipkan`, 120, csize.l - 125);
  context.fillText(`\n\nHabis`, 60, csize.l - 125);
  context.fillText(`\n\n: Produk Habis`, 120, csize.l - 125);
  context.fillText(`\n\n\nOption`, 60, csize.l - 125);
  context.fillText(`\n\n\n: Kategori Kosong`, 120, csize.l - 125);
  context.fillText(`\n\n\n\n-`, 60, csize.l - 125);
  context.fillText(`\n\n\n\n: Link Kosong`, 120, csize.l - 125);

  context.fillText(`Error0`, 260, csize.l - 125); //Letak Text
  context.fillText(`: Link Bermasalah`, 300, csize.l - 125); //Letak Text
  context.fillText(`\nError1`, 260, csize.l - 125); //Letak Text
  context.fillText(`\n: Scraping Bermasalah`, 300, csize.l - 125); //Letak Text
  context.fillStyle = CS.Undercuted;
  context.fillText(`\n\nText`, 260, csize.l - 125); //Letak Text
  context.fillText(`\n\n: Produk Undercuted`, 300, csize.l - 125); //Letak Text
  context.fillStyle = CS.Outdated;
  context.fillText(`\n\n\nText`, 260, csize.l - 125); //Letak Text
  context.fillText(`\n\n\n: Diupdate > 3 jam lalu`, 300, csize.l - 125); //Letak Text
  //Tips
  context.fillStyle = CS.Default;
  context.font = "bold 9pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText("「 Tips 」", 50, csize.l - 40); //Letak Text
  context.font = "italic 9pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText("Gunakan perintah !Produk <Kode Produk>\nUntuk melihat detail individual produk", 60, csize.l - 25); //Letak Text

  // Save PNG
  fs.writeFileSync(
    `./Function/Render/Docs/ProduksKonveksi${Konveksi.toUpperCase()}.pdf`,
    canvas.toBuffer("application/pdf", {
      title: `Konvkesi ${Konveksi}`,
      keywords: `node.js Konvkesi ${Konveksi}`,
      creationDate: new Date(),
    })
  ); // Simpan Gambar dengan nama Gambar.png
  Res = `./Function/Render/Docs/ProduksKonveksi${Konveksi.toUpperCase()}.pdf`;
  return Res;
} // Membuat Gambar Konveksi PNG

module.exports = RenderProduksKonveksiPDF;
