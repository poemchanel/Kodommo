const VerifikasiKontak = require("../../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduks = require("../../Routes/TarikProduks");
const RenderUndercutPDF = require("../../Render/RenderUndercutPDF");

async function Undercut(pesan, kontak, res) {
  res = [];
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        let produks = await TarikProduks();
        if (produks.length !== 0) {
          const render = await RenderUndercutPDF(produks);
          res.push({
            status: render,
            caption: `╭──「 *Perintah Berhasil* 」
│Undercut Produks
│Berhasil di Render
╰───────────────`,
          });
        } else {
          res.push({
            status: "gagal",
            caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan
│produks
╰───────────────`,
          });
        }
        break;
      case "Kosong":
        res.push({
          status: "gagal",
          caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`,
        });
        break;
      case "baru":
      default: //Kontak Tidak Memiliki Pangkat
        res.push({
          status: "gagal",
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│• *Member*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
╰───────────────`,
        });
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res.push({
      status: "gagal",
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    });
  }
  return res;
}

module.exports = Undercut;
