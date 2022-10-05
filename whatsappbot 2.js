const mongoose = require("mongoose"); // module koneksi ke DB
const { Produk, Konveksi, Pengguna } = require("./produk"); // Format Database
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js"); // Module WhatsappBot
const qrcode = require("qrcode-terminal"); // Coversi otentikasi ke Qr Code
const { createCanvas } = require("canvas");
const fs = require("fs");

// Alamat Database
const DB = "mongodb://localhost:27017/produk";
//const DB ="mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/?retryWrites=true&w=majority";
//Konek Ke Database
mongoose.connect(
  DB,
  () => {
    console.log("Terhubung ke Database");
    Bot();
  },
  (e) => console.error(e)
);

async function CekProdukdiDB(req, res) {
  switch (true) {
    case req.includes("!P_"):
    case req.includes("!p_"):
      try {
        res = await Produk.find({
          kodebarang: req.replace("!P_", "").replace("!p_", ""),
        });
        console.log(res.lengh);
        return res;
      } catch (error) {
        console.log(error.message);
      }
      break;
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
      console.log("Terjadi Kesalahan saat mencari data Produk");
      break;
  }
}
// Membuat Table PNG
async function TableKonveksi(req) {
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

async function Bot() {
  //Membuat Bot Baru
  const WaBot = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });
  //Menyalakan Bot
  WaBot.initialize();
  WaBot.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message);
  });
  WaBot.on("authenticated", () => {
    console.log("Login Berhasil");
  });
  WaBot.on("auth_failure", (msg) => {
    console.error("Login Gagal", msg);
  });
  WaBot.on("ready", () => {
    console.log("Bot Aktif");
  });
  //Balas Pesan yang Diterima
  WaBot.on("message", async (msg) => {
    console.log("Pesan yang Diterima : ", msg.body);
    if (msg.body.startsWith("!")) {
      switch (true) {
        case msg.body.toLowerCase() === "!ping":
          msg.reply("Pong");
          break;
        case msg.body.toLowerCase() === "!help":
          msg.reply(
            `Fitur Perintah yang terdaftar :
!P_<Kode Produk> Cek informasi produk dengan kode tersebut
!K_<Konveksi> Cek semua produk di konveksi tersebut
!L_Konveksi Cek list konveksi yang terdaftar di DB
!Update Update daftar harga semua produk
              `
          );
          break;
        case msg.body.toLowerCase().startsWith("!p_"):
          data = await CekProdukdiDB(msg.body);
          if (data.length == 0) {
            msg.reply(
              `Data dengan kode produk : ${msg.body
                .replace("!P_", "")
                .replace("!p_", "")} tidak ditemukan`
            );
          } else {
            msg.reply(
              `informasi Produk ${data[0].kodebarang}
Konveksi : ${data[0].konveksi}
Produk : ${data[0].kodebarang} ${data[0].namabarang}
Harga Modal : Rp.${data[0].hargamodal}
Daily Price : Rp.${data[0].dailyprice} | Rp.${
                data[0].dailyprice - data[0].hargamodal
              } | ${Math.abs(
                ((data[0].dailyprice - data[0].hargamodal) /
                  data[0].dailyprice) *
                  100
              ).toFixed(2)}%
Flash Sale : Rp.${Math.round(
                data[0].dailyprice - (data[0].dailyprice * 0.5) / 100
              )} | Rp.${
                Math.round(
                  data[0].dailyprice - (data[0].dailyprice * 0.5) / 100
                ) - data[0].hargamodal
              } | ${Math.abs(
                ((data[0].dailyprice -
                  (data[0].dailyprice * 0.5) / 100 -
                  data[0].hargamodal) /
                  (data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)) *
                  100
              ).toFixed(2)}%
Payday/Event : Rp.${
                parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100
              } | Rp.${
                parseInt(data[0].hargamodal) +
                (data[0].hargamodal * 8.5) / 100 -
                data[0].hargamodal
              } | ${Math.abs(
                ((parseInt(data[0].hargamodal) +
                  (data[0].hargamodal * 8.5) / 100 -
                  data[0].hargamodal) /
                  (parseInt(data[0].hargamodal) +
                    (data[0].hargamodal * 8.5) / 100)) *
                  100
              ).toFixed(2)}%
Harga Produk : Rp.${data[0].hargaproduk}
Pesaing :${data[0].pesaing.map(
                (a) =>
                  " \n\t " + a.namapesaing + " = Rp." + a.hargapesaing + " "
              )}
Data di Update pada : ${data[0].updatedAt.getHours()}:${data[0].updatedAt.getMinutes()} ${data[0].updatedAt.getDate()}/${data[0].updatedAt.getMonth()}/${data[0].updatedAt.getFullYear()}
              `
            );
          }
          break;
        case msg.body.toLowerCase().startsWith("!k_"):
          data = await TableKonveksi(msg.body);
          konveksipng = MessageMedia.fromFilePath("./Konveksi.PNG");
          msg.reply(konveksipng);
          console.log("Gambar terkirim");
          break;
        case msg.body.toLowerCase() === "!gambar":
          msg.reply(konveksipng);
          break;
        default:
          msg.reply("Perintah Tidak Ditemukan");
          break;
      }
    } else {
      console.log("Pesan ini Bukan Perintah");
    }
  });

  //Jika WaBot Log out
  WaBot.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  });
}
