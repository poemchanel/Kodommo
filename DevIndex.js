const { HubungkanDatabase } = require("./db"); // import Fungsi untuk Koneksi ke DataBase
const { ping, Daftar, Terima, help, CekProduk, CekKonveksi, CekKonveksiUndercut, UpdateHargaProduk, UpdateHargaKonveksi, TidakadaPerintah } = require("./reply"); // import Fungsi untuk membuat pesan yg akan dibalas

PreLaunch();
async function PreLaunch() {
  try {
    const StatusDB = await HubungkanDatabase();
  } catch (error) {
    console.log(error);
  }
  Kodommo(PesanDiterima);
}
const pesan = {
  body: "!ku_KBOGOR",
  from: "6282246378074@c.us",
};

async function Kodommo(msg) {
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
        balas = await CekKonveksi(msg, await msg.getContact());
        msg.reply(balas.caption);
        break;
      case msg.body.toLowerCase().startsWith("!ku_"): // Cek Produk
        balas = await CekKonveksiUndercut(msg, await msg.getContact());
        msg.reply(balas.caption);
        break;
      case msg.body.toLowerCase().startsWith("!up_"): // Cek Produk
        balas = await UpdateHargaProduk(msg, await msg.getContact());
        msg.reply(balas.caption);
        break;
      default: // Jika Perintah tidak Terdaftar
        balas = await TidakadaPerintah(msg, await msg.getContact());
        msg.reply(balas);
        break;
    } // Verifikasi Perintah yang di Terima
  } // Verifikasi jika Pesan Merupakan Perintah
  else {
    console.log("Pesan ini Bukan Perintah");
  }
}

const PesanDiterima = {
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
  mentionedJidList: ["62895625865900@c.us"],
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
        user: "6282246378074",
        _serialized: "6282246378074@c.us",
      },
      number: "6282246378074",
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
