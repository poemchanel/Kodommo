const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js"); // import Module WhatsappBot
const HubungkanDatabase = require("./Function/Routes/HubungkanDatabase"); // import Fungsi untuk Koneksi ke DataBase

// Reply Generator
const Ping = require("./Function/Generator/Ping");
const Help = require("./Function/Generator/Help");
const Daftar = require("./Function/Generator/Daftar");
const Terima = require("./Function/Generator/Terima");

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
        case msg.body.toLowerCase().startsWith("!ping"):
          generator = await Ping(msg, await msg.getContact());
          msg.reply("pong");
          break;
        case msg.body.toLowerCase() === "!help": // Cek Perintah yang Tersedia
          balas = await Help(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
        case msg.body.toLowerCase().startsWith("!daftar"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              balas = await Daftar(msg, contact);
              msg.reply(balas.caption, undefined, { mentions: [contact] });
            }
          } else {
            balas = await Daftar(msg, await msg.getContact());
            msg.reply(balas.caption, undefined, { mentions: [await msg.getContact()] }); // Membalas Pesan
          }
          break;
        case msg.body.toLowerCase().startsWith("!terima"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              balas = await Terima(msg, await msg.getContact(), contact.number);
              msg.reply(balas.caption, undefined, { mentions: [contact] });
            }
          } else {
            msg.reply(`Harap tag kontak yang ingin diterima. cth: !daftar @kontak`);
          }
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
