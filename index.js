const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js"); // import Module WhatsappBot
const { setTimeout } = require("timers/promises");

// DB
const DBConnect = require("./Function/Routes/DBConnect"); // import Fungsi untuk Koneksi ke DataBase

// Reply Generator
const Ping = require("./Function/Generator/Ping");
const Register = require("./Function/Generator/Contacts/Register");
const Accept = require("./Function/Generator/Contacts/Accept");
const Rank = require("./Function/Generator/Contacts/Rank");
const Help = require("./Function/Generator/Help");
const List = require("./Function/Generator/Products/List");
const Konveksi = require("./Function/Generator/Products/Konveksi");
const Product = require("./Function/Generator/Products/Product");
const Link = require("./Function/Generator/Products/Link");
const Undercut = require("./Function/Generator/Products/Undercut");
const Update = require("./Function/Generator/Products/Updates/Update");
const Auto = require("./Function/Generator/Products/Updates/Auto");
const Option = require("./Function/Generator/Products/Updates/Option");

// Notifikasi
const { AutoFinish, AutoStart, AutoUndercut } = require("./Function/Update/PriceProducts");
const { KonveksiFinish } = require("./Function/Update/PriceKonveksi");
const { generate } = require("qrcode-terminal");

PreLaunch();
async function PreLaunch() {
  console.log("Menghubungkan DB");
  DBConnect();
  console.log("Menyalakan Bot");
  Kodommo();
  await setTimeout(5000);
  console.log("Memulai Auto");
  AutoStart();
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

  let Generate;
  WaBot.on("message", async (msg) => {
    console.log(`-> ${msg.from} : ${msg.body}`);
    if (msg.body.startsWith("!")) {
      switch (true) {
        case msg.body.toLowerCase().startsWith("!ping"):
          msg.reply("Pong");
          Generate = await Ping(msg, await msg.getContact());
          break;
        case msg.body.toLowerCase().startsWith("!daftar"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              Generate = await Register(contact);
              msg.reply(Generate, undefined, { mentions: [contact] });
            }
          } else {
            Generate = await Register(await msg.getContact());
            msg.reply(Generate, undefined, { mentions: [await msg.getContact()] }); // Membalas Pesan
          }
          break;
        case msg.body.toLowerCase().startsWith("!terima"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              Generate = await Accept((await msg.getContact()).number, contact.number);
              msg.reply(Generate, undefined, { mentions: [contact] });
            }
          } else {
            msg.reply(
              `╭──「 *Perintah Gagal* 」\n│Harap tag kontak yang\n│ingin diterima.\n│contoh: !Terima @kontak\n╰───────────────`
            );
          }
          break;
        case msg.body.toLowerCase().startsWith("!pangkat"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              Generate = await Rank(msg.body, (await msg.getContact()).number, contact.number);
              msg.reply(Generate, undefined, { mentions: [contact] });
            }
          } else {
            msg.reply(
              `╭──「 *Perintah Gagal* 」\n│Harap tag kontak yang\n│ingin Diubah Pangkat.\n│contoh: !Pangkat admin @kontak\n╰───────────────`
            );
          }
          break;
        case msg.body.toLowerCase().startsWith("!help"): // Cek Perintah yang Tersedia
          Generate = await Help((await msg.getContact()).number);
          msg.reply(Generate);
          break;
        case msg.body.toLowerCase().startsWith("!list"): // Cek Perintah yang Tersedia
          Generate = await List((await msg.getContact()).number);
          msg.reply(Generate);
          break;
        case msg.body.toLowerCase().startsWith("!konveksi"): // Cek Produk
          Generate = await Konveksi(msg.body, (await msg.getContact()).number);
          if (Generate.status !== "gagal") {
            let konveksipdf = MessageMedia.fromFilePath(`${Generate.status}`);
            msg.reply(konveksipdf, undefined, { caption: `${Generate.caption}` });
          } else {
            msg.reply(Generate.caption);
          }
          break;
        case msg.body.toLowerCase().startsWith("!produk"): // Cek Produk
          Generate = await Product(msg.body, (await msg.getContact()).number);
          for (let i = 0; i < Generate.length; i++) {
            msg.reply(Generate[i]);
          }
          break;
        case msg.body.toLowerCase().startsWith("!link"): // Cek Produk
          Generate = await Link(msg.body, (await msg.getContact()).number);
          for (let i = 0; i < Generate.length; i++) {
            msg.reply(Generate[i]);
          }
          break;
        case msg.body.toLowerCase().startsWith("!kategori"): // Cek Produk
          Generate = await Option(msg.body, (await msg.getContact()).number);
          msg.reply(Generate);
          break;
        case msg.body.toLowerCase().startsWith("!undercut"):
          Generate = await Undercut((await msg.getContact()).number);
          if (Generate.status !== "gagal") {
            let Directory = MessageMedia.fromFilePath(`${Generate.status}`);
            msg.reply(Directory, undefined, { caption: Generate.caption });
          } else {
            msg.reply(Generate.caption);
          }
          break;
        case msg.body.toLowerCase().startsWith("!update"):
          msg.reply(
            `╭──「 *Informasi* 」\n│Proses update akan\n│memakan waktu, Harap\n│menunggu informasi selanjutnya\n╰───────────────`
          );
          Generate = await Update(msg.body, (await msg.getContact()).number);
          msg.reply(Generate);
          break;
        case msg.body.toLowerCase().startsWith("!auto"):
          Generate = await Auto(msg.body, (await msg.getContact()).number);
          msg.reply(Generate);
          break;
        default: // Jika Perintah tidak Terdaftar
          msg.reply("Perintah tidak Terdaftar");
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

  // Notifikasi
  setInterval(Notifkasi, 35000);
  async function Notifkasi() {
    let Check;
    Check = await KonveksiFinish();
    if (Check.selesai === true) await WaBot.sendMessage(Check.nomor, Check.caption);
    Check = await AutoFinish();
    if (Check.selesai === true) await WaBot.sendMessage(Check.nomor, Check.caption);
    Check = await AutoUndercut();
    if (Check.selesai === true) {
      for (let u = 0; u < Check.caption; u++) {
        await WaBot.sendMessage(Check.nomor, Check.caption[u]);
      }
    }
  }
} // Bot KODOMMO
