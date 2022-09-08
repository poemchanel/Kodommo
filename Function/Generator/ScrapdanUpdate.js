const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const { ScrapUpdateOn, ScrapUpdateOff, ScrapUpdateCek } = require("../Update/HargaProduks");

async function ScrapdanUpdate(pesan, kontak, nomor, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        let statusscrapupdate = "";
        let tmp = pesan.body
          .replace(/!update/i, "")
          .replace(/!scrap/i, "")
          .replace(/ /g, "");
        switch (tmp) {
          case "on":
            statusscrapupdate = await ScrapUpdateOn();
            res = { caption: statusscrapupdate };
            break;
          case "off":
            statusscrapupdate = await ScrapUpdateOff();
            res = { caption: statusscrapupdate };
            break;
          case "cek":
            statusscrapupdate = await ScrapUpdateCek();
            res = { caption: statusscrapupdate };
            break;
          case "":
            res = { caption: `Harap perintah setelah !update/!scrap. contoh !update cek` };
            break;
          default:
            res = { caption: `Perintah tidak ditemukan, list perintah !update/!scrap : on , off, cek` };
            break;
        }
        break;
      case "member": // Kontak Berpangkat member
      case "baru":
      case "Kosong":
        res = {
          caption: `╭─「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses :
│• *Admin*
│────────────────
│Status anda saat ini : ${pengguna.pangkat}
╰────────────────`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = { caption: `Terjadi kesalahan terhadap kontak anda, Segera hubungi Admin` };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { caption: "Maaf Bot sedang dalam Maintenence.." };
  }
  return res;
}

module.exports = ScrapdanUpdate;
