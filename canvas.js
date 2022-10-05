const mongoose = require("mongoose");
const { Produk, Konveksi } = require("./produk");
const { createCanvas } = require("canvas");
const fs = require("fs");

const DB = "mongodb://localhost:27017/produk";

mongoose.connect(
  DB,
  () => {
    console.log("Terhubung ke Database");
  },
  (e) => console.error(e)
);

const req = "!K_KBOGOR";
async function CekProdukdiDB(req, res) {
  switch (true) {
    case req.includes("!k_"):
    case req.includes("!K_"):
      try {
        res = await Produk.find({
          konveksi: req.replace("!k_", "").replace("!K_", ""),
        });
        return res;
      } catch (error) {
        console.log(error.message);
      }
      break;
    default:
      break;
  }
}

async function TableKonveksi() {
  const produk = await CekProdukdiDB(req);
  
  let csize = {
    w: 720,
    l: 180,
  };
  produk.forEach((element) => {
    csize.l = csize.l + 30;
  });
  const canvas = createCanvas(csize.w, csize.l); //resolusi PNG
  const context = canvas.getContext("2d"); // Background
  context.fillStyle = "#090b10";
  context.fillRect(0, 0, csize.w, csize.l);

  const post = {
    title: "Daftar Produk di Konveksi : ",
    kolom0: "Kode",
    kolom1: "Nama Barang",
    kolom2: "Modal",
    kolom3: "Jual",
    kolom4: "Pesaing 1",
    kolom5: "Pesaing 2",
    footer: "Gunakan Perintah !P_<Kode Produk> untuk detail per produk",
  };
  context.textAlign = "center";
  context.fillStyle = "#fff";
  context.font = "20pt 'Tahoma'";
  context.fillText(post.title, 360, 50);
  context.strokeStyle = "#fff";
  context.font = "12pt 'Tahoma'";
  let pt = { x: 50, y: 75 };
  // Kepala tabel
  context.strokeRect(50, 75, 65, 30); // Kolom Kode
  context.strokeRect(114, 75, 195, 30); // Kolom Nama Barang
  context.strokeRect(310, 75, 90, 30); // Kolom Modal
  context.strokeRect(400, 75, 90, 30); // Kolom Jual
  context.strokeRect(490, 75, 90, 30); // Kolom Pesaing 1
  context.strokeRect(580, 75, 90, 30); // Kolom Pesaing 2
  context.fillText(post.kolom0, 82, 95); //  Kode
  context.fillText(post.kolom1, 215, 95); // Nama Barang
  context.fillText(post.kolom2, 355, 95); // Modal
  context.fillText(post.kolom3, 445, 95); // Jual
  context.fillText(post.kolom4, 535, 95); // Pesaing 1
  context.fillText(post.kolom5, 625, 95); // Pesaing 2
  // isi tabel
  produk.forEach((element) => {
    pt.y = pt.y + 30;
    if (element.pesaing[0].hargapesaing != "-") {
      if (element.pesaing[0].hargapesaing < element.hargaproduk) {
        context.fillStyle = "#FF0000";
      }
    }
    if (element.pesaing[1].hargapesaing != "-") {
      if (element.pesaing[1].hargapesaing < element.hargaproduk) {
        context.fillStyle = "#FF0000";
      }
      // console.log(parseInt(element.pesaing[1].hargapesaing) + parseInt(element.hargaproduk));/
    }
    context.strokeRect(50, pt.y, 65, 30); // Kolom  Kode
    context.strokeRect(114, pt.y, 195, 30); // Kolom Nama Barang
    context.strokeRect(310, pt.y, 90, 30); // Kolom Modal
    context.strokeRect(400, pt.y, 90, 30); // Kolom Jual
    context.strokeRect(490, pt.y, 90, 30); // Kolom Pesaing 1
    context.strokeRect(580, pt.y, 90, 30); // Kolom Pesaing 2
    context.fillText(element.kodebarang, 82, pt.y + 20);
    context.fillText(element.namabarang.substring(0, 20), 215, pt.y + 20);
    context.fillText(element.hargamodal, 355, pt.y + 20);
    context.fillText(element.hargaproduk, 445, pt.y + 20);
    context.fillText(element.pesaing[0].hargapesaing, 535, pt.y + 20);
    context.fillText(element.pesaing[1].hargapesaing, 625, pt.y + 20);
    context.fillStyle = "#fff";
  });
  //footer
  context.fillStyle = "#fff";
  context.font = "italic 13pt 'Tahoma'";
  context.fillText(post.footer, 360, csize.l - 25);
  // Save PNG
  fs.writeFileSync("./Konveksi.png", canvas.toBuffer("image/png"));
}

TableKonveksi();
