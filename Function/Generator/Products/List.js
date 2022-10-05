const DBState = require("../../Routes/DBState");
const Verify = require("../Contacts/Verify");

async function List(From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        Res = RankMember();
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
function RankMember(Res) {
  Res = `╭──「 *List Konveksi* 」
│• *BOGOR*
│• ~*DONI*~
│• ~*SONY*~
│• ~*APEN*~
│• ~*MAULSANDAL*~
│• ~*SANDI*~
│• ~*TATA*~
│• ~*AZARINE*~
│• ~*SCARLETT*~
│• ~*IMPORTOSM*~
│• ~*ACNES*~
│• ~*BIOAQUA*~
│• ~*CARASUN*~
│• ~*EMINA*~
│• ~*EVERWHITE*~
│• ~*FOCALLURE*~
│• ~*GRACEGLOW*~
│• ~*HANASUI*~
│• ~*HADALABO*~
│• ~*IMPLORA*~
│• ~*LULULUN*~
│• ~*LEAGLORIA*~
│• ~*SELSUN*~
│• ~*MADAMGIE*~
│• ~*SYB*~
│• ~*MEDIHEAL*~
│• ~*PINKFLASH*~
│• ~*ROJUKISS*~
│• ~*SOMETHINC*~
│• ~*SKINAQUA*~
│• ~*VIVA*~
│• ~*WARDAH*~
│• ~*WHITELAB*~
╰───────────────`;
  return Res;
}
function RankKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Kontak Anda belum Terdaftar
│──「 *i* 」──────────
│Silahkan mendaftar dengan
│perintah !daftar
╰───────────────`;
  return Res;
}
function RankDefault(Rank, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses
│oleh kontak berpangkat :
│• *Admin*
│• *Member*
│──「 *i* 」──────────
│Status anda saat ini : ${Rank}
╰───────────────`;
  return Res;
}
function DBDisconected(Res) {
  Res = `╭──「 *Maintenence* 」
│Mohon Maaf :)
│Saat ini Bot sedang
│dalam Maintenence...
╰───────────────`;
  return Res;
}
module.exports = List;
