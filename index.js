const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js"); // import Module WhatsappBot
const qrcode = require("qrcode-terminal"); // import Modul Konversi kode otentikasi ke Qr Code
const { HubungkanDatabase } = require("./db"); // import Fungsi untuk Koneksi ke DataBase
const { ping, Daftar, Terima, help, CekProduk, CekKonveksi, UpdateHargaProduk, UpdateHargaKonveksi, TidakadaPerintah } = require("./reply"); // import Fungsi untuk membuat pesan yg akan dibalas

PreLaunch();
async function PreLaunch() {
  const StatusDB = await HubungkanDatabase();
  console.log(StatusDB);
  Kodommo();
} // Mempersiapkan Database Sebelum Menyalakan Bot

async function Kodommo() {
  const WaBot = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  }); //Membuat Bot Baru
  WaBot.initialize(); //Menyalakan Bot
  WaBot.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message);
  });
  WaBot.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr);
  }); // Konversi kode authentikasi Ke bentuk VR CODE
  WaBot.on("authenticated", () => {
    console.log("Login Berhasil");
  }); // Eksekusi jika Login Berhasil
  WaBot.on("auth_failure", (msg) => {
    console.error("Login Gagal", msg);
  }); // Eksekusi Jika Gagal Login
  WaBot.on("ready", () => {
    console.log("Bot Aktif");
  }); // Eksekusi Jika Bot Siap Digunakan

  WaBot.on("message", async (msg) => {
    console.log(`-> ${msg.from} : ${msg.body}`);
    if (msg.body.startsWith("!")) {
      switch (true) {
        case msg.body.toLowerCase() === "!ping": // Untuk apakah bot membalas
          balas = await ping(msg.getContact());
          msg.reply(balas.caption); // Membalas Pesan
          break;
        case msg.body.toLowerCase() === "!help": // Cek Perintah yang Tersedia
          balas = await help(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
        case msg.body.toLowerCase().startsWith("!daftar"): // Untuk apakah bot membalas
          balas = await Daftar(msg, await msg.getContact());
          msg.reply(balas.caption); // Membalas Pesan
          break;
        case msg.body.toLowerCase().startsWith("!terima"): // Untuk apakah bot membalas
          balas = await Terima(msg, await msg.getContact());
          msg.reply(balas.caption); // Membalas Pesan
          break;
        case msg.body.toLowerCase().startsWith("!p_"): // Cek Produk
          balas = await CekProduk(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
        case msg.body.toLowerCase().startsWith("!k_"): // Cek Produk
          konveksipng = MessageMedia.fromFilePath("./Gambar.PNG"); // Posisi gambar di Directory
          balas = await CekKonveksi(msg, await msg.getContact());
          if (balas.status === "Gagal") {
            msg.reply(balas.caption);
          } else {
            msg.reply(konveksipng, undefined, { caption: balas.caption }); // Mengirim Gambar
          }
          break;
        default: // Jika Perintah tidak Terdaftar
          balas = await TidakadaPerintah(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
      } // Verifikasi Perintah yang di Terima
    } // Verifikasi jika Pesan Merupakan Perintah
    else {
      console.log("Pesan ini Bukan Perintah");
    } // Skip Jika Pesan bukan Merupakan Perintah
  }); // Mengecek Pesan Diterima lalu Membalas Pesan tersebut

  WaBot.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
  }); // Eksekusi Jika Bot LogOut
} // Bot KODOMMO
