const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

async function RenderProduksKonveksiPDF(req, konveksi, res) {
  const produk = req;
  let csize = {
    w: 720, //Lebar
    l: 180, //Panjang
  }; //Ukuran Gambar Awal
  produk.forEach((element) => {
    csize.l = csize.l + 30;
  }); //Update Ukuran Gambar Berdasarkan Banyaknya Produk yang ada d Konveksi
  const canvas = createCanvas(csize.w, csize.l, "pdf"); // Ukuran Gambar
  const context = canvas.getContext("2d");
  context.fillStyle = "#090b10"; // Warna Background
  context.fillRect(0, 0, csize.w, csize.l); // Memberi Warna Background
  const post = {
    title: `Daftar Produk di Konveksi ${produk[0].konveksi} : `, // Text Header
    kolom0: "Kode",
    kolom1: "Nama Barang",
    kolom2: "Modal",
    kolom3: "Jual",
    kolom4: "Pesaing 1",
    kolom5: "Pesaing 2",
    footer: "Gunakan Perintah !P_<Kode Produk> untuk detail per produk", // Text Footer
  }; // Daftar Header
  //Title
  context.textAlign = "center"; // Posisi Text Rata = Tengah
  context.fillStyle = "#FFFFFF"; // Warna Text Warna = Putih
  context.font = "20pt 'Tahoma'"; // Text Ukuran, Font = Tahoma
  context.fillText(post.title, 360, 50); // Letak Tulisan Judul
  context.strokeStyle = "#FFFFFF"; // Warna Kotak
  context.font = "12pt 'Tahoma'"; // Text Selanjutnya Ukuran = 12pt, Font= Tamoha
  let pt = { x: 50, y: 75 }; // Letak Awal Tabel
  //Header
  context.strokeRect(50, 75, 65, 30); // Kotak Kode
  context.strokeRect(114, 75, 195, 30); // Kotak Nama Barang
  context.strokeRect(310, 75, 90, 30); // Kotak Modal
  context.strokeRect(400, 75, 90, 30); // Kotak Jual
  context.strokeRect(490, 75, 90, 30); // Kotak Pesaing 1
  context.strokeRect(580, 75, 90, 30); // Kotak Pesaing 2
  context.fillText(post.kolom0, 82, 95); //  Kode
  context.fillText(post.kolom1, 215, 95); // Nama Barang
  context.fillText(post.kolom2, 355, 95); // Modal
  context.fillText(post.kolom3, 445, 95); // Jual
  context.fillText(post.kolom4, 535, 95); // Pesaing 1
  context.fillText(post.kolom5, 625, 95); // Pesaing 2
  // isi tabel
  produk.forEach((element) => {
    pt.y = pt.y + 30; //Setiap Produk Baru Letak Awal + 30
    if (element.pesaing[0].linkpesaingstatus === "aktif") {
      if (element.pesaing[0].hargapesaing !== 0) {
        if (element.pesaing[0].hargapesaing < element.hargaproduk) {
          context.fillStyle = "#FF0000"; // Warna Tulisan Merah
        } // Jika Harga Pesaing 1 Lebih Rendah maka Warna Tulisan akan menjadi Merah
      } // Cek Jika ada data Pesaing 1
    }
    if (element.pesaing[1].linkpesaingstatus === "aktif") {
      if (element.pesaing[1].hargapesaing !== 0) {
        if (element.pesaing[1].hargapesaing < element.hargaproduk) {
          context.fillStyle = "#FF0000"; // Warna tulisan Merah
        } // Jika Harga Pesaing 2 Lebih Rendah maka Warna Tulisan akan menjadi Merah
      } // cek Jika ada data Pesaing 2
    }
    context.strokeRect(50, pt.y, 65, 30); // Kotak  Kode
    context.strokeRect(114, pt.y, 195, 30); // Kotak Nama Barang
    context.strokeRect(310, pt.y, 90, 30); // Kotak Modal
    context.strokeRect(400, pt.y, 90, 30); // Kotak Jual
    context.strokeRect(490, pt.y, 90, 30); // Kotak Pesaing 1
    context.strokeRect(580, pt.y, 90, 30); // Kotak Pesaing 2
    context.fillText(element.kodebarang, 82, pt.y + 20); // Kode Barang
    context.fillText(element.namabarang.substring(0, 20), 215, pt.y + 20); // Nama Barang
    context.fillText(element.hargamodal, 355, pt.y + 20); // Harga Modal
    if (element.linkstatus === "aktif") {
      context.fillText(element.hargaproduk, 445, pt.y + 20); // Harga Produk
    } else {
      context.fillText(element.linkstatus, 445, pt.y + 20); // Harga Produk
    }
    if (element.pesaing[0].linkpesaingstatus === "aktif") {
      context.fillText(element.pesaing[0].hargapesaing, 535, pt.y + 20); // Harga Pesaing 1
    } else {
      context.fillText(element.pesaing[0].linkpesaingstatus, 535, pt.y + 20); // Harga Pesaing 1
    }
    if (element.pesaing[1].linkpesaingstatus === "aktif") {
      context.fillText(element.pesaing[1].hargapesaing, 625, pt.y + 20); // Harga Pesaing 2
    } else {
      context.fillText(element.pesaing[1].linkpesaingstatus, 625, pt.y + 20); // Harga Pesaing 2
    }
    context.fillStyle = "#FFFFFF"; // Kembalikan Warna Tulisan ke Putih
  }); // Ulangi Untuk setiap Produk yang ada
  //footer
  context.fillStyle = "#FFFFFF"; // Warna Text Menajdi Putih
  context.font = "italic 13pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText(post.footer, 360, csize.l - 25); //Letak Text
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
