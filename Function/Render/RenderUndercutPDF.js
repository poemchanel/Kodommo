const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

async function RenderUndercutPDF(req, konveksi, res) {
  let ProduksUndecut = [];
  let First = "DOMMO";
  let ShopeeLength = 0;

  //Filter Produks that being Undercuted
  req.forEach((e) => {
    let Undercuted = false;
    let IndexFirst;
    if (e.shopee !== undefined) {
      IndexFirst = e.shopee.findIndex((f) => f.nama === First);
      e.shopee.forEach((g) => {
        if (IndexFirst !== -1) {
          if (e.shopee[IndexFirst].harga > g.harga && g.status === "Aktif") {
            Undercuted = true;
          }
        }
      });
    }
    if (Undercuted === true) {
      e.shopee.sort((x, y) => (x.nama == First ? -1 : y.nama == First ? 1 : 0));
      ProduksUndecut.push(e);
      if (e.shopee.length > ShopeeLength) {
        ShopeeLength = e.shopee.length;
      }
    }
  });

  //Canvas Size
  let Csize = { w: 555, l: 310 };
  Csize.w = Csize.w + 90 * ShopeeLength;
  Csize.l = Csize.l + ProduksUndecut.length * 30;

  // Membuat kanvas
  const canvas = createCanvas(Csize.w, Csize.l, "pdf"); // Ukuran Gambar
  const context = canvas.getContext("2d");
  context.fillStyle = "#090b10"; // Warna Background
  context.fillRect(0, 0, Csize.w, Csize.l); // Memberi Warna Background

  //Title
  context.fillStyle = "#FFFFFF"; // Warna Text Warna = Putih
  context.font = "20pt 'Tahoma'"; // Text Ukuran, Font = Tahoma
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.fillText(`DAFTAR PRODUK`, Csize.w / 2, 50); // Letak Tulisan Judul
  context.fillText(`Di Undercut oleh pesaing :`, Csize.w / 2, 85); // Letak Tulisan Judul

  //Table Header
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.strokeStyle = "#FFFFFF"; // Warna Kotak
  context.font = "12pt 'Tahoma'"; // Text Ukuran = 12pt, Font= Tamoha
  context.strokeRect(50, 120, 105, 30); // Col Kode
  context.fillText("Konveksi", 102.5, 140);
  context.strokeRect(155, 120, 65, 30); // Col Kode
  context.fillText("Kode", 187.5, 140);
  context.strokeRect(220, 120, 195, 30); // Col Nama Barang
  context.fillText("Nama Barang", 317.5, 140);
  context.strokeRect(415, 120, 90, 30); // Col Modal
  context.fillText("Modal", 460, 140);
  let ph = [
    { x: 505, y: 120, tx: 550, ty: 140 },
    { x: 595, y: 120, tx: 640, ty: 140 },
    { x: 685, y: 120, tx: 730, ty: 140 },
    { x: 775, y: 120, tx: 820, ty: 140 },
  ];

  context.strokeRect(ph[0].x, ph[0].y, 90, 30);
  context.fillText(First, ph[0].tx, ph[0].ty);
  for (let i = 1; i < ShopeeLength; i++) {
    context.strokeRect(ph[i].x, ph[i].y, 90, 30);
    context.fillText(`Pesaing ${i}`, ph[i].tx, ph[i].ty);
  }

  //Isi Tabel
  let piy = 0;
  for (let j = 0; j < ProduksUndecut.length; j++) {
    let DefaultColor = "#FFFFFF";
    let DateNow = new Date();
    let TimeDifference = Math.abs(DateNow - ProduksUndecut[j].updatedAt);
    TimeDifference = Math.ceil(TimeDifference / (1000 * 60 * 60));
    if (TimeDifference > 3) {
      DefaultColor = "#C4B5FD";
    }
    context.fillStyle = DefaultColor;
    piy = piy + 30;
    context.strokeRect(50, piy + 120, 105, 30); // Col Kode
    context.fillText(ProduksUndecut[j].konveksi, 102.5, piy + 140);
    context.strokeRect(155, piy + 120, 65, 30); // Col Kode
    context.fillText(ProduksUndecut[j].kodebarang, 187.5, piy + 140);
    context.strokeRect(220, piy + 120, 195, 30); // Col Nama Barang
    context.fillText(ProduksUndecut[j].namabarang.substring(0, 20), 317.5, piy + 140);
    context.strokeRect(415, piy + 120, 90, 30); // Col Modal
    context.fillText(ProduksUndecut[j].hargamodal, 460, piy + 140);

    IndexFirst = ProduksUndecut[j].shopee.findIndex((f) => f.nama === First);
    context.fillText(ProduksUndecut[j].shopee[IndexFirst].harga, ph[0].tx, piy + ph[0].ty);

    let pt = 0;
    for (let l = 0; l < ShopeeLength; l++) {
      context.strokeRect(ph[l].x, piy + ph[l].y, 90, 30);
      if (ProduksUndecut[j].shopee[l] !== undefined) {
        if (ProduksUndecut[j].shopee[l].nama !== First) {
          pt++;
          if (ProduksUndecut[j].shopee[l].status !== "Aktif") {
            context.fillText(ProduksUndecut[j].shopee[l].status, ph[pt].tx, piy + ph[pt].ty);
          } else {
            if (ProduksUndecut[j].shopee[l].harga < ProduksUndecut[j].shopee[IndexFirst].harga) {
              context.fillStyle = "#FACC15";
            }
            context.fillText(ProduksUndecut[j].shopee[l].harga, ph[pt].tx, piy + ph[pt].ty);
          }
        }
      } else {
        context.fillText("-", ph[l].tx, piy + ph[l].ty);
      }
      context.fillStyle = DefaultColor;
    }
  }

  // //footer
  context.fillStyle = "#FFFFFF"; // Warna Text Menajdi Putih
  context.font = "9pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.textAlign = "left"; // Posisi Text Rata = Tengah
  context.fillText(
    `Baru: Belum diupdate                     - : Link Kosong
Diarsipkan: Prdouk Diarsipkan          Bermasalah: Link Salah
Habis: Produk Habis                       Disable: Tombol Gagal
Range: Harga Range                       Text Ungu : Updated >3jam`,
    Csize.w / 2 - 200,
    Csize.l - 130
  ); //Letak Text

  //Letak Text
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.font = "italic 13pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText("Gunakan Perintah !Produk_<Kode Produk>", Csize.w / 2, Csize.l - 50); //Letak Text
  context.fillText("Untuk detail per produk", Csize.w / 2, Csize.l - 25); //Letak Text

  // Save PNG
  fs.writeFileSync(
    `./Function/Render/Docs/Undercut.pdf`,
    canvas.toBuffer("application/pdf", {
      title: `Konvkesi ${konveksi}`,
      keywords: `node.js Konvkesi ${konveksi}`,
      creationDate: new Date(),
    })
  ); // Simpan Gambar dengan nama Gambar.png
  res = `./Function/Render/Docs/Undercut.pdf`;
  return res;
} // Membuat Gambar Konveksi PNG

module.exports = RenderUndercutPDF;
