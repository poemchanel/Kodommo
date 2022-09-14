const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");

async function List(kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        res = {
          caption: `╭──「 *List Konveksi* 」
*│•BOGOR* : Konveksi BOGOR
*│•DONI* : Konveksi DONI
*│•SONY* : Konveksi SONY
*│•APEN* : Konveksi APEN
*│•MAULSANDAL* : Konveksi MAUL SANDAL
*│•SANDI* : Konveksi SANDI
*│•TATA* : Konveksi TATA
*│•AZARINE* : Konveksi AZARINE
*│•SCARLETT* : Konveksi SCARLETT
*│•IMPORTOSM* : Konveksi IMPORT OSM
*│•ACNES* : Konveksi ACNES
*│•BIOAQUA* : Konveksi BIOAQUA
*│•CARASUN* : Konveksi CARASUN
*│•EMINA* : Konveksi EMINA
*│•EVERWHITE* : Konveksi EVERWHITE
*│•FOCALLURE* : Konveksi FOCALLURE
*│•GRACEGLOW* : Konveksi GRACE & GLOW
*│•HANASUI* : Konveksi HANASUI
*│•HADALABO* : Konveksi HADALABO
*│•IMPLORA* : Konveksi IMPLORA
*│•LULULUN* : Konveksi LULULUN
*│•LEAGLORIA* : Konveksi LEA GLORIA
*│•SELSUN* : Konveksi SELSUN
*│•MADAMGIE* : Konveksi MADAM GIE
*│•SYB* : Konveksi SYB
*│•MEDIHEAL* : Konveksi MEDIHEAL
*│•PINKFLASH* : Konveksi PINKFLASH
*│•ROJUKISS* : Konveksi ROJUKISS
*│•SOMETHINC* : Konveksi SOMETHINC
*│•SKINAQUA* : Konveksi SKIN AQUA
*│•VIVA* : Konveksi VIVA
*│•WARDAH* : Konveksi WARDAH
*│•WHITELAB* : Konveksi WHITELAB
╰───────────────`,
        };
        break;
      case "Kosong":
        res = {
          caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = {
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│• *Member*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
╰───────────────`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = {
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    };
  }
  return res;
}

module.exports = List;
