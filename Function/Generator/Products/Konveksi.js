const DBState = require("../../Routes/DBState");
const Verify = require("../Contacts/Verify");
const FindKonveksi = require("../../Routes/Products/FindKonveksi");
const RenderKonveksiPDF = require("../../Render/KonveksiPDF");

async function Konveksi(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        Res = RankMember(Pesan.replace(/!konveksi/i, "").replace(" ", ""));
        break;
      case "Kosong":
        Res = RankKosong();
        break;
      default:
        Res = RankDefault(Rank);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    Res = DBDisconected();
  }
  return Res;
}

async function RankMember(Konveksi, Res) {
  if (Konveksi !== "") {
    let Produks = await FindKonveksi(Konveksi);
    if (Produks.length !== 0) {
      const Render = await RenderKonveksiPDF(Produks, Konveksi);
      Res = { status: Render, caption: `Konveksi ${Konveksi}` };
    } else {
      Res = KonveksiKosong(Konveksi);
    }
  } else {
    Res = PesanKosong();
  }
  return Res;
}
function KonveksiKosong(Konveksi, Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan 
│konveksi dengan 
│kode : ${Konveksi}
│──「 *i* 」────────
│Gunakan perintah !list
│untuk melihat list
│kode konveksi
╰───────────────`,
  };
  return Res;
}
function PesanKosong(Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Perintah Gagal* 」
│Kode konveksi kosong
│──「 *i* 」────────
│Harap masukan kode 
│konveksi setelah 
│perintah !konveksi
│──「 *Contoh* 」──────── 
│!Konveksi SONY
╰───────────────`,
  };
  return Res;
}
function RankKosong(Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar
│──「 *i* 」────────
│Silahkan mendaftar
│dengan !daftar
╰───────────────`,
  };
  return Res;
}
function RankDefault(Rank, Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya 
│dapat diakses oleh :
│• *Admin*
│• *Member*
│──「 *i* 」────────
│Status anda saat ini : ${Rank}
╰───────────────`,
  };
  return Res;
}
function DBDisconected(Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Maintenence* 」
│Mohon Maaf :)
│Saat ini Bot sedang
│dalam Maintenence...
╰───────────────`,
  };
  return Res;
}
module.exports = Konveksi;
