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
*│ Kode   : Konveksi*
*│•BOGOR* : Konveksi BOGOR
*│•DONI* : Konveksi DONI
*│•SONY* : Konveksi SONY
*│•APEN* : Konveksi APEN
*│•MAULSANDAL* : Konveksi MAUL SANDAL
*│•SANDI* : Konveksi SANDI
*│•TATA* : Konveksi TATA
*│•AZARINE* : ~Konveksi AZARINE~
*│•SCARLETT* : ~Konveksi SCARLETT~
*│•IMPORTOSM* : Konveksi IMPORT OSM
*│•ACNES* : Konveksi ACNES
*│•BIOAQUA* : Konveksi BIOAQUA
*│•CARASUN* : Konveksi CARASUN
*│•EMINA* : Konveksi EMINA
*│•EVERWHITE* : Konveksi EVERWHITE
*│•FOCALLURE* : ~Konveksi FOCALLURE~
*│•GRACEGLOW* : ~Konveksi GRACE & GLOW~
*│•HANASUI* : ~Konveksi HANASUI~
*│•HADALABO* : ~Konveksi HADALABO~
*│•IMPLORA* : ~Konveksi IMPLORA~
*│•LULULUN* : ~Konveksi LULULUN~
*│•LEAGLORIA* : ~Konveksi LEA GLORIA~
*│•SELSUN* : ~Konveksi SELSUN~
*│•MADAMGIE* : ~Konveksi MADAM GIE~
*│•SYB* : ~Konveksi SYB~
*│•MEDIHEAL* : ~Konveksi MEDIHEAL~
*│•PINKFLASH* : ~Konveksi PINKFLASH~
*│•ROJUKISS* : ~Konveksi ROJUKISS~
*│•SOMETHINC* : ~Konveksi SOMETHINC~
*│•SKINAQUA* : ~Konveksi SKIN AQUA~
*│•VIVA* : ~Konveksi VIVA~
*│•WARDAH* : ~Konveksi WARDAH~
*│•WHITELAB* : ~Konveksi WHITELAB~
╰───────────────`;
  return Res;
}
function RankKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar
│──「 *i* 」────────
│Silahkan mendaftar
│dengan !daftar
╰───────────────`;
  return Res;
}
function RankDefault(Rank, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya 
│dapat diakses oleh :
│• *Admin*
│• *Member*
│──「 *i* 」────────
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
