const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
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
const Click = require("./Function/Generator/Products/Updates/Click");

// Notifikasi
const { AutoSelesai, AutoMulai } = require("./Function/Update/PriceProducts");
const { KonveksiSelesai } = require("./Function/Update/PriceKonveksi");
const { generate } = require("qrcode-terminal");

let pesan = {
  body: "!help",
  from: "6282246378074@c.us",
};
let PesanDiterima = {
  id: {
    fromMe: false,
    remote: "6282246378074@c.us",
    id: "9AE42407C2891B953419E205DA3F1D2A",
    _serialized: "false_6282246378074@c.us_9AE42407C2891B953419E205DA3F1D2A",
  },
  body: pesan.body,
  type: "chat",
  t: 1661348908,
  notifyName: "Duyy",
  from: pesan.from,
  to: "62895625865900@c.us",
  self: "in",
  ack: 1,
  isNewMsg: true,
  star: false,
  kicNotified: false,
  recvFresh: true,
  isFromTemplate: false,
  pollInvalidated: false,
  broadcast: false,
  mentionedJidList: ["62895625865900@c.us", "6282282170805@c.us"],
  isVcardOverMmsDocument: false,
  isForwarded: false,
  hasReaction: false,
  ephemeralOutOfSync: false,
  productHeaderImageRejected: false,
  lastPlaybackProgress: 0,
  isDynamicReplyButtonsMsg: false,
  isMdHistoryMsg: false,
  requiresDirectConnection: false,
  pttForwardedFeaturesEnabled: true,
  isEphemeral: false,
  isStatusV3: false,
  links: [],
  getContact: function (res) {
    res = {
      id: {
        server: "c.us",
        user: pesan.from.replace("@c.us", ""),
        _serialized: "6282246378074@c.us",
      },
      number: pesan.from.replace("@c.us", ""),
      isBusiness: false,
      name: "Saya A",
      pushname: "Duyy",
      sectionHeader: undefined,
      shortName: "Saya",
      statusMute: undefined,
      type: "in",
      verifiedLevel: undefined,
      verifiedName: undefined,
      isMe: false,
      isUser: true,
      isGroup: false,
      isWAContact: true,
      isMyContact: true,
      isBlocked: false,
    };
    return res;
  },
  reply: function (req) {
    console.log(`
    
--------Bentuk Pesan Di WA----------
${req}
------------------------------------
    `);
    AmbilPerintah();
  },
};
const group = {
  _data: {
    id: {
      fromMe: false,
      remote: "120363043606962064@g.us",
      id: "E64B9108C21CBDBAEEFBB51DC3129610",
      participant: "6282246378074@c.us",
      _serialized: "false_120363043606962064@g.us_E64B9108C21CBDBAEEFBB51DC3129610_6282246378074@c.us",
    },
    body: pesan.body,
    type: "chat",
    t: 1661450389,
    notifyName: "Duyy",
    from: "120363043606962064@g.us",
    to: "62895625865900@c.us",
    author: "6282246378074@c.us",
    self: "in",
    ack: 1,
    isNewMsg: true,
    star: false,
    kicNotified: false,
    recvFresh: true,
    isFromTemplate: false,
    pollInvalidated: false,
    broadcast: false,
    mentionedJidList: ["62895625865900@c.us"],
    isVcardOverMmsDocument: false,
    isForwarded: false,
    hasReaction: false,
    productHeaderImageRejected: false,
    lastPlaybackProgress: 0,
    isDynamicReplyButtonsMsg: false,
    isMdHistoryMsg: false,
    requiresDirectConnection: false,
    pttForwardedFeaturesEnabled: true,
    isEphemeral: false,
    isStatusV3: false,
    links: [],
  },
  mediaKey: undefined,
  id: {
    fromMe: false,
    remote: "120363043606962064@g.us",
    id: "E64B9108C21CBDBAEEFBB51DC3129610",
    participant: "6282246378074@c.us",
    _serialized: "false_120363043606962064@g.us_E64B9108C21CBDBAEEFBB51DC3129610_6282246378074@c.us",
  },
  ack: 1,
  hasMedia: false,
  body: "!ping",
  type: "chat",
  timestamp: 1661450389,
  from: "120363043606962064@g.us",
  to: "62895625865900@c.us",
  author: "6282246378074@c.us",
  deviceType: "android",
  isForwarded: false,
  forwardingScore: 0,
  isStatus: false,
  isStarred: false,
  broadcast: false,
  fromMe: false,
  hasQuotedMsg: false,
  duration: undefined,
  location: undefined,
  vCards: [],
  inviteV4: undefined,
  mentionedIds: [],
  orderId: undefined,
  token: undefined,
  isGif: false,
  isEphemeral: false,
  links: [],
};

function AmbilPerintah() {
  readline.question("Perintah : ", (perintah) => {
    PesanDiterima.body = perintah;

    Kodommo(PesanDiterima);
  });
}

PreLaunch();
function PreLaunch() {
  DBConnect();
  AmbilPerintah();
}

async function Kodommo(msg) {
  let Generate;
  console.log(`-> ${msg.from} : ${msg.body}`);
  if (msg.body.startsWith("!")) {
    switch (true) {
      case msg.body.toLowerCase().startsWith("!ping"):
        msg.reply("Pong");
        Generate = await Ping(msg, await msg.getContact());
        break;
      case msg.body.toLowerCase() === "!help": // Cek Perintah yang Tersedia
        balas = await Help(msg, await msg.getContact());
        msg.reply(balas.caption);
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
      case msg.body.toLowerCase().startsWith("!click"): // Cek Produk
        balas = await Click(msg.body, msg.getContact().number);
        msg.reply(balas.caption);
        break;
      case msg.body.toLowerCase().startsWith("!link"): // Cek Produk
        balas = await Link(msg, await msg.getContact());
        for (let i = 0; i < balas.length; i++) {
          msg.reply(balas[i].caption);
        }
        break;
      case msg.body.toLowerCase().startsWith("!link"): // Cek Produk
        balas = await Produk(msg, await msg.getContact());
        for (let i = 0; i < balas.length; i++) {
          msg.reply(balas[i].caption);
        }
        break;
      case msg.body.toLowerCase().startsWith("!konveksi"): // Cek Produk
        balas = await Konveksi(msg, await msg.getContact());
        for (let i = 0; i < balas.length; i++) {
          if (balas[i].status !== "gagal") {
            msg.reply(balas[i].caption);
          } else {
            msg.reply(balas[i].caption);
          }
        }
      case msg.body.toLowerCase().startsWith("!undercut"): // Cek Produk
        balas = await Undercut(msg, await msg.getContact());
        for (let i = 0; i < balas.length; i++) {
          if (balas[i].status !== "gagal") {
            msg.reply(balas[i].caption);
          } else {
            msg.reply(balas[i].caption);
          }
        }
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
  }
  setInterval(CekAutoSelesai, 30000);
  async function CekAutoSelesai() {
    let selesai = await AutoSelesai();
    console.log(`Auto Selesai : ${selesai.selesai}`);
    if (selesai.selesai === true) {
      msg.reply(
        `╭──「 *Informasi Update* 」
│${selesai.status}
│Berhasil Mengupdate ${selesai.diupdate}/${selesai.totalproduk} produk
╰───────────────`
      );
    }
  }
}
