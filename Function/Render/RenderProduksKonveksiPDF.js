const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

async function RenderProduksKonveksiPDF(req, konveksi, res) {
  const produk = req;

  // Ukuran Canvas
  let csize = { w: 450, l: 310 }; // Ukuran Default
  let shopee = [];
  produk.forEach((e) => {
    csize.l = csize.l + 30;
    try {
      e.shopee.forEach((f) => {
        if (!shopee.includes(f.nama)) {
          shopee.push(f.nama);
        }
      });
    } catch (error) {}
  }); // Sesuaikain panjang dengan total produk
  csize.w = csize.w + 90 * shopee.length; // Sesuaikan Lebar dengan total Shopee

  // Membuat kanvas
  const canvas = createCanvas(csize.w, csize.l, "pdf"); // Ukuran Gambar
  const context = canvas.getContext("2d");
  context.fillStyle = "#090b10"; // Warna Background
  context.fillRect(0, 0, csize.w, csize.l); // Memberi Warna Background

  //Title
  context.fillStyle = "#FFFFFF"; // Warna Text Warna = Putih
  context.font = "20pt 'Tahoma'"; // Text Ukuran, Font = Tahoma
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.fillText(`DAFTAR PRODUK`, csize.w / 2, 50); // Letak Tulisan Judul
  context.fillText(`Di KONVEKSI ${produk[0].konveksi} :`, csize.w / 2, 85); // Letak Tulisan Judul

  //Table Header
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.strokeStyle = "#FFFFFF"; // Warna Kotak
  context.font = "12pt 'Tahoma'"; // Text Selanjutnya Ukuran = 12pt, Font= Tamoha

  context.strokeRect(50, 120, 65, 30); // Col Kode
  context.fillText("Kode", 82.5, 140);
  context.strokeRect(115, 120, 195, 30); // Col Nama Barang
  context.fillText("Nama Barang", 212.5, 140);
  context.strokeRect(310, 120, 90, 30); // Col Modal
  context.fillText("Modal", 355, 140); //

  let ph = [
    { x: 400, y: 120, tx: 445, ty: 140 },
    { x: 490, y: 120, tx: 535, ty: 140 },
    { x: 580, y: 120, tx: 625, ty: 140 },
    { x: 670, y: 120, tx: 715, ty: 140 },
  ];
  var first = "DOMMO";
  shopee.sort((x, y) => {
    return x == first ? -1 : y == first ? 1 : 0;
  });
  for (let i = 0; i < shopee.length; i++) {
    context.strokeRect(ph[i].x, ph[i].y, 90, 30);
    context.fillText(shopee[i], ph[i].tx, ph[i].ty);
  }
  //Isi Tabel
  let piy = 0;
  for (let j = 0; j < produk.length; j++) {
    piy = piy + 30;
    context.strokeRect(50, piy + 120, 65, 30); // Col Kode
    context.fillText(produk[j].kodebarang, 82.5, piy + 140);
    context.strokeRect(115, piy + 120, 195, 30); // Col Nama Barang
    context.fillText(produk[j].namabarang.substring(0, 23), 212.5, piy + 140);
    context.strokeRect(310, piy + 120, 90, 30); // Col Modal
    context.fillText(produk[j].hargamodal, 355, piy + 140);

    let hargafirst;
    try {
      for (let f = 0; f < shopee.length; f++) {
        context.strokeRect(ph[f].x, piy + ph[f].y, 90, 30);
      }
      produk[j].shopee.forEach((f) => {
        if (f.nama === first && f.status === "Aktif") {
          hargafirst = f.harga;
        }
      });
      produk[j].shopee.forEach((f) => {
        for (let g = 0; g < shopee.length; g++) {
          if (f.harga < hargafirst && f.harga !== 0 && f.status === "Aktif") {
            context.fillStyle = "#FF0000"; // Warna tulisan Merah
          }
          if (f.nama === shopee[g]) {
            if (f.status === "Aktif") {
              context.fillText(f.harga, ph[g].tx, piy + ph[g].ty);
            } else {
              context.fillText(f.status, ph[g].tx, piy + ph[g].ty);
            }
          }
          context.fillStyle = "#FFFFFF";
        }
      });
    } catch (error) {}
  }

  // //footer
  context.fillStyle = "#FFFFFF"; // Warna Text Menajdi Putih
  context.font = "9pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.textAlign = "left"; // Posisi Text Rata = Tengah
  context.fillText(
    `Baru: Belum diupdate                     Kosong: Link Kosong
Diarsipkan: Prdouk Diarsipkan          Bermasalah: Link Salah
Habis: Produk Habis                       Disable: Tombol Gagal
Range: Harga Range`,
    csize.w / 2 - 165,
    csize.l - 130
  ); //Letak Text

  //Letak Text
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.font = "italic 13pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText("Gunakan Perintah !Produk_<Kode Produk>", csize.w / 2, csize.l - 50); //Letak Text
  context.fillText("Untuk detail per produk", csize.w / 2, csize.l - 25); //Letak Text

  // Save PNG
  fs.writeFileSync(
    `./Function/Render/Docs/ProduksKonveksi${konveksi.toUpperCase()}.pdf`,
    canvas.toBuffer("application/pdf", {
      title: `Konvkesi ${konveksi}`,
      keywords: `node.js Konvkesi ${konveksi}`,
      creationDate: new Date(),
    })
  ); // Simpan Gambar dengan nama Gambar.png
  res = `./Function/Render/Docs/ProduksKonveksi${konveksi.toUpperCase()}.pdf`;
  return res;
} // Membuat Gambar Konveksi PNG

module.exports = RenderProduksKonveksiPDF;
