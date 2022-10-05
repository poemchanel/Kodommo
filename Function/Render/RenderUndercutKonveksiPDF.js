const { createCanvas } = require("canvas"); // import Module untuk Membuat file image
const fs = require("fs"); // Import Modul membaca directory

function RenderUndercutKonveksiPDF(req, konveksi, res) {
  const produk = req;
  let csize = {
    w: 720, //Lebar
    l: 200, //Panjang
  }; //Ukuran Gambar Awal
  let tambahukuran = 0;
  produk.forEach((element) => {
    if (element.pesaing[0].linkpesaingstatus === "Aktif") {
      if (element.pesaing[0].hargapesaing !== 0) {
        if (element.pesaing[0].hargapesaing < element.hargaproduk) {
          tambahukuran = 1;
        }
      }
    }
    if (element.pesaing[1].linkpesaingstatus === "Aktif") {
      if (element.pesaing[1].hargapesaing !== 0) {
        if (element.pesaing[1].hargapesaing < element.hargaproduk) {
          tambahukuran = 1;
        }
      }
    }
    if (tambahukuran == 1) {
      csize.l = csize.l + 30;
    }
    tambahukuran = 0;
  }); //Update Ukuran Gambar Berdasarkan Banyaknya Produk yang ada d Konveksi
  const canvas = createCanvas(csize.w, csize.l, "pdf"); // Ukuran Gambar
  const context = canvas.getContext("2d");
  context.fillStyle = "#090b10"; // Warna Background
  context.fillRect(0, 0, csize.w, csize.l); // Memberi Warna Background
  const post = {
    title: `  Daftar Produk di Konveksi ${produk[0].konveksi}\nDengan Harga Pesaing Lebih Rendah :`, // Text Header
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
  let pt = { x: 50, y: 100 }; // Letak Awal Tabel
  //Header
  context.strokeRect(50, pt.y, 65, 30); // Kotak Kode
  context.strokeRect(114, pt.y, 195, 30); // Kotak Nama Barang
  context.strokeRect(310, pt.y, 90, 30); // Kotak Modal
  context.strokeRect(400, pt.y, 90, 30); // Kotak Jual
  context.strokeRect(490, pt.y, 90, 30); // Kotak Pesaing 1
  context.strokeRect(580, pt.y, 90, 30); // Kotak Pesaing 2
  context.fillText(post.kolom0, 82, 120); //  Kode
  context.fillText(post.kolom1, 215, 120); // Nama Barang
  context.fillText(post.kolom2, 355, 120); // Modal
  context.fillText(post.kolom3, 445, 120); // Jual
  context.fillText(post.kolom4, 535, 120); // Pesaing 1
  context.fillText(post.kolom5, 625, 120); // Pesaing 2
  // isi tabel
  pt.y = pt.y;
  let tambahtable = 0;
  produk.forEach((element) => {
    context.fillStyle = "#FFFFFF"; // Warna Text Menajdi Putih
    //Setiap Produk Baru Letak Awal + 30
    if (element.pesaing[0].linkpesaingstatus === "Aktif") {
      if (element.pesaing[0].hargapesaing !== 0) {
        if (element.pesaing[0].hargapesaing < element.hargaproduk) {
          tambahtable = 1;
        } // Jika Harga Pesaing 1 Lebih Rendah maka Warna Tulisan akan menjadi Merah
      } // Cek Jika ada data Pesaing 1
    }
    if (element.pesaing[1].linkpesaingstatus === "Aktif") {
      if (element.pesaing[1].hargapesaing !== 0) {
        if (element.pesaing[1].hargapesaing < element.hargaproduk) {
          tambahtable = tambahtable + 2;
        } // Jika Harga Pesaing 2 Lebih Rendah maka Warna Tulisan akan menjadi Merah
      } // cek Jika ada data Pesaing 2
    }
    if (tambahtable > 0) {
      pt.y = pt.y + 30;
      context.strokeRect(50, pt.y, 65, 30); // Kotak  Kode
      context.strokeRect(114, pt.y, 195, 30); // Kotak Nama Barang
      context.strokeRect(310, pt.y, 90, 30); // Kotak Modal
      context.strokeRect(400, pt.y, 90, 30); // Kotak Jual
      context.strokeRect(490, pt.y, 90, 30); // Kotak Pesaing 1
      context.strokeRect(580, pt.y, 90, 30); // Kotak Pesaing 2
      context.fillText(element.kodebarang, 82, pt.y + 20); // Kode Barang
      context.fillText(element.namabarang.substring(0, 20), 215, pt.y + 20); // Nama Barang
      context.fillText(element.hargamodal, 355, pt.y + 20); // Harga Modal
      if (element.linkstatus === "Aktif") {
        context.fillText(element.hargaproduk, 445, pt.y + 20); // Harga Produk
      } else {
        context.fillText(element.linkstatus, 445, pt.y + 20); // Harga Produk
      }
      if (element.pesaing[0].linkpesaingstatus === "Aktif") {
        if (tambahtable != 2) {
          context.fillStyle = "#FF0000";
        }
        context.fillText(element.pesaing[0].hargapesaing, 535, pt.y + 20); // Harga Pesaing 1
        context.fillStyle = "#FFFFFF";
      } else {
        context.fillText(element.pesaing[0].linkpesaingstatus, 535, pt.y + 20); // Harga Pesaing 1
      }

      if (element.pesaing[1].linkpesaingstatus === "Aktif") {
        if (tambahtable > 1) {
          context.fillStyle = "#FF0000";
        }
        context.fillText(element.pesaing[1].hargapesaing, 625, pt.y + 20); // Harga Pesaing 2
        context.fillStyle = "#FFFFFF";
      } else {
        context.fillText(element.pesaing[1].linkpesaingstatus, 625, pt.y + 20); // Harga Pesaing 2
      }
    }
    context.fillStyle = "#FFFFFF";
    tambahtable = 0;
  }); // Ulangi Untuk setiap Produk yang ada
  //footer
  context.fillStyle = "#FFFFFF"; // Warna Text Menajdi Putih
  context.font = "italic 13pt 'Tahoma'"; // Text fornat = Italic , Ukuran = 13pt , Font = Tahoma
  context.fillText(post.footer, 360, csize.l - 25); //Letak Text
  // Save PNG
  fs.writeFileSync(
    `./Function/Render/Docs/UndercutKonveksi${konveksi.toUpperCase()}.pdf`,
    canvas.toBuffer("application/pdf", {
      title: "my picture",
      keywords: "node.js demo cairo",
      creationDate: new Date(),
    })
  ); // Simpan Gambar dengan nama Gambar.png
  res = `./Function/Render/Docs/UndercutKonveksi${konveksi.toUpperCase()}.pdf`;
  return res;
} // Membuat Gambar Konveksi PNG

module.exports = RenderUndercutKonveksiPDF;
