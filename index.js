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
const List = require("./Function/Generator/List");
const Konveksi = require("./Function/Generator/Konveksi");
const Produk = require("./Function/Generator/Produk");
const Link = require("./Function/Generator/Link");
const Undercut = require("./Function/Generator/Undercut");
const Update = require("./Function/Generator/Update");
const Auto = require("./Function/Generator/Auto");
const Click = require("./Function/Generator/Click");

// Notifikasi
const { AutoSelesai, AutoMulai } = require("./Function/Update/HargaProduks");
const { KonveksiSelesai } = require("./Function/Update/HargaKonveksi");
const { generate } = require("qrcode-terminal");

PreLaunch();
async function PreLaunch() {
  console.log("Menghubungkan DB");
  DBConnect();
  await setTimeout(3000);

  console.log("Menyalakan Bot");
  Kodommo();
  await setTimeout(5000);

  console.log("Memulai Auto");
  AutoMulai();
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
          Generate = await Ping(msg, await msg.getContact());
          msg.reply("Pong");
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
              `╭──「 *Perintah Gagal* 」\n│Harap tag kontak yang\n│ingin diterima.\n│contoh: !daftar @kontak\n╰───────────────`
            );
          }
          break;
        case msg.body.toLowerCase().startsWith("!Pangkat"): // Untuk apakah bot membalas
          if (msg.mentionedIds.length !== 0) {
            for (let i = 0; i < msg.mentionedIds.length; i++) {
              let mentionid = await WaBot.getNumberId(msg.mentionedIds[i]);
              let contact = await WaBot.getContactById(mentionid._serialized);
              Generate = await Rank(msg.body, (await msg.getContact()).number, contact.number);
              msg.reply(Generate, undefined, { mentions: [contact] });
            }
          } else {
            msg.reply(
              `╭──「 *Perintah Gagal* 」\n│Harap tag kontak yang\n│ingin Diubah Pangkat.\n│contoh: !Pangkat @kontak\n╰───────────────`
            );
          }
          break;
        case msg.body.toLowerCase().startsWith("!help"): // Cek Perintah yang Tersedia
          Generate = await Help((await msg.getContact()).number);
          msg.reply(Generate);
          break;
        case msg.body.toLowerCase().startsWith("!list"): // Cek Perintah yang Tersedia
          balas = await List(await msg.getContact());
          msg.reply(balas.caption);
          break;
        case msg.body.toLowerCase().startsWith("!produk"): // Cek Produk
          balas = await Produk(msg, await msg.getContact());
          for (let i = 0; i < balas.length; i++) {
            msg.reply(balas[i].caption);
          }
          break;
        case msg.body.toLowerCase().startsWith("!link"): // Cek Produk
          balas = await Link(msg, await msg.getContact());
          for (let i = 0; i < balas.length; i++) {
            msg.reply(balas[i].caption);
          }
          break;
        case msg.body.toLowerCase().startsWith("!click"): // Cek Produk
          balas = await Click(msg, await msg.getContact());
          msg.reply(balas.caption);
          break;
        case msg.body.toLowerCase().startsWith("!konveksi"): // Cek Produk
          balas = await Konveksi(msg, await msg.getContact());
          for (let i = 0; i < balas.length; i++) {
            if (balas[i].status !== "gagal") {
              let konveksipdf = MessageMedia.fromFilePath(`${balas[i].status}`);
              msg.reply(konveksipdf, undefined, { caption: `${balas[i].caption}` });
            } else {
              msg.reply(balas[i].caption);
            }
          }
          break;
        case msg.body.toLowerCase().startsWith("!undercut"):
          balas = await Undercut(msg, await msg.getContact());
          for (let i = 0; i < balas.length; i++) {
            if (balas[i].status !== "gagal") {
              let undercut = MessageMedia.fromFilePath(`${balas[i].status}`);
              msg.reply(undercut, undefined, { caption: balas[i].caption });
            } else {
              msg.reply(balas[i].caption);
            }
          }
          break;
        case msg.body.toLowerCase().startsWith("!update"):
        case msg.body.toLowerCase().startsWith("!scrap"):
          balas = await Update(msg, await msg.getContact());
          for (let i = 0; i < balas.length; i++) {
            msg.reply(balas[i].caption);
          }
          break;
        case msg.body.toLowerCase().startsWith("!auto"):
          balas = await Auto(msg, await msg.getContact());
          msg.reply(balas.caption);
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
  setInterval(CekAutoSelesai, 35000);
  async function CekAutoSelesai() {
    let selesai = await AutoSelesai();
    // console.log(`Auto Selesai : ${selesai.selesai}`);
    if (selesai.selesai === true) {
      WaBot.sendMessage(
        selesai.nomor,
        `╭──「 *Informasi Update* 」
│${selesai.status}
│Berhasil Mengupdate ${selesai.diupdate}/${selesai.totalproduk} produk
╰───────────────`
      );
    }
    setTimeout(5000);
    selesai = await KonveksiSelesai();
    // console.log(`Konveksi Selesai : ${selesai.selesai}`);
    if (selesai.selesai === true) {
      WaBot.sendMessage(
        selesai.nomor,
        `╭──「 *Informasi Update* 」
│${selesai.status}
│Total Produk ${selesai.totalproduk}
│Berhasil Mengupdate ${selesai.diupdate} produk
│Gagal Mengupdate ${selesai.gagal.length} produk
╰───────────────`
      );
    }
  }
} // Bot KODOMMO
