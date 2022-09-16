const DBState = require("../../Routes/DBState");
const Verify = require("../Contacts/Verify");
const FindProducts = require("../../Routes/Products/FindAll");
const RenderUndercutPDF = require("../../Render/UndercutPDF");

async function Undercut(From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        Res = await RankMember();
        break;
      case "Kosong":
        Res = RankKosong();
        break;
      default: //Kontak Tidak Memiliki Pangkat
        Res = RankDefault(Rank);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    Res = DBDisconected();
  }
  return Res;
}
async function RankMember(Res) {
  const Products = await FindProducts();
  if (Products.length !== 0) {
    Res = await RenderUndercut(Products);
  } else {
    Res = ProductKosong();
  }
  return Res;
}
async function RenderUndercut(Products, Res) {
  const Render = await RenderUndercutPDF(Products);
  Res = {
    status: Render,
    caption: `╭──「 *Perintah Berhasil* 」
│Undercut Produks
│Berhasil di Render
╰───────────────`,
  };
  return Res;
}
function ProductKosong(Res) {
  Res = {
    status: "gagal",
    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat 
│menemukan produks
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
module.exports = Undercut;
