const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js"); // import Module WhatsappBot
const HubungkanDatabase = require("./Function/Routes/HubungkanDatabase"); // import Fungsi untuk Koneksi ke DataBase

// Reply Generator
const Help = require("./Function/Generator/Help");

PreLaunch();
async function PreLaunch() {
  HubungkanDatabase();
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
        case msg.body.toLowerCase() === "!ping":
          msg.reply("pong");
          break;
        case msg.body.toLowerCase() === "!help": // Cek Perintah yang Tersedia
          balas = await Help(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
        default: // Jika Perintah tidak Terdaftar
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
