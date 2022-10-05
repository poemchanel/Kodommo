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

async function RenderProduksKonveksiPDF(req, konveksi, res) {
  const produk = req;

  let csize = CanvasSize(req); // Canvas Size

  let Shopee = csize.Shopee;

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
  context.fillText(`Di KONVEKSI ${konveksi} :`, csize.w / 2, 85); // Letak Tulisan Judul

  //Table Header
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.strokeStyle = "#FFFFFF"; // Warna Kotak
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
  let piy = 0;
  for (let j = 0; j < produk.length; j++) {
    let DefaultColor = "#FFFFFF";
    let DateNow = new Date();
    let TimeDifference = Math.abs(DateNow - produk[j].updatedAt);
    TimeDifference = Math.ceil(TimeDifference / (1000 * 60 * 60));
    if (TimeDifference > 3) {
      DefaultColor = "#C4B5FD";
    }
    context.fillStyle = DefaultColor;
    piy = piy + 30;
    context.strokeRect(50, piy + 120, 65, 30); // Col Kode
    context.fillText(produk[j].kodebarang, 82.5, piy + 140);
    context.strokeRect(115, piy + 120, 195, 30); // Col Nama Barang
    context.fillText(produk[j].namabarang.substring(0, 20), 212.5, piy + 140);
    context.strokeRect(310, piy + 120, 90, 30); // Col Modal
    context.fillText(produk[j].hargamodal, 355, piy + 140);

    let hargafirst = 0;
    if (produk[j].shopee !== undefined) {
      produk[j].shopee.forEach((f) =>
        f.nama === first && f.status === "Aktif" ? (hargafirst = f.harga) : (tes = f.harga)
      );
    }

    if (Shopee !== undefined) {
      for (let f = 0; f < Shopee.length; f++) {
        context.strokeRect(ph[f].x, piy + ph[f].y, 90, 30); // Col
        if (produk[j].shopee !== undefined) {
          let Kosong = true;
          produk[j].shopee.forEach((e) => {
            if (e.nama === Shopee[f]) {
              if (e.harga < hargafirst && e.status === "Aktif") {
                context.fillStyle = "#FACC15";
              }
              if (e.status === "Aktif") {
                context.fillText(e.harga, ph[f].tx, piy + ph[f].ty);
              } else {
                if (e.status === "Range" || e.status === "Bermasalah") {
                  context.fillStyle = "#EF4444";
                }
                context.fillText(e.status, ph[f].tx, piy + ph[f].ty);
              }
              context.fillStyle = DefaultColor;
              Kosong = false;
            }
          });
          if (Kosong === true) {
            context.fillText("-", ph[f].tx, piy + ph[f].ty);
          }
        } else {
          context.fillText("-", ph[f].tx, piy + ph[f].ty);
        }
      }
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
    csize.w / 2 - 200,
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
