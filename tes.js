const { HubungkanDatabase, CekDatabaseState, TarikPengguna, TarikProdukKode, TarikProdukKonveksi, UpdateProdukKode } = require("./db");
const { BuatGambarKonveksi } = require("./MembuatPNG");
const { ScrapDataProduk } = require("./scraping");

async function VerifikasiKontak(req, res) {
  console.log(req.from.slice(-5));
  switch (true) {
    case req.from.slice(-5) == "@c.us":
      const kontak = await TarikPengguna(req.from);
      if (kontak.length == 0) {
        res = "Kosong";
      } else {
        res = kontak.pangkat;
      }
      break;
    case req.from.slice(-5) == "@g.us":
      const group = await TarikPengguna(req.author);
      if (group.length == 0) {
        res = "Kosong";
      } else {
        res = group.pangkat;
      }
      break;
    default:
      res = "Gagal";
      break;
  }
  console.log(res);
  return res;
}
async function Format(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req);
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal":
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong":
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin":
      res = {
        caption: ``,
      };
      break;
    case pengguna == "admin":
      res = {
        caption: ``,
      };
      break;
    case pengguna == "member":
      res = {
        caption: ``,
      };
      break;
    default:
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini ${pengguna}`,
      };
      break;
  }
  return res;
}

const from = "!up_D1000";

const msg = {
  id: {
    fromMe: false,
    remote: "6282246378074@c.us",
    id: "9AE42407C2891B953419E205DA3F1D2A",
    _serialized: "false_6282246378074@c.us_9AE42407C2891B953419E205DA3F1D2A",
  },
  body: from,
  type: "chat",
  t: 1661348908,
  notifyName: "Duyy",
  from: "6282246378074@c.us",
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
  mentionedJidList: [],
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
    body: from,
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
    mentionedJidList: [],
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

app(msg);
async function app(req, res) {
  const StatusDB = await HubungkanDatabase();
  console.log(StatusDB);

  const tes = await ping(msg);
  console.log(tes.caption);
}
