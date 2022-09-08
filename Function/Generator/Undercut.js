const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduksKonveksi = require("../Routes/TarikProduksKonveksi");
const RenderUndercutKonveksiPDF = require("../Render/RenderUndercutKonveksiPDF");

async function Undercut(pesan, kontak, res) {
  res = [];
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        let tmp = pesan.body.split(" ").filter((e) => e !== "");
        if (tmp.length !== 1) {
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].toLowerCase() !== "!undercut") {
              if (tmp[i].toLowerCase() !== "semua") {
                let produks = await TarikProduksKonveksi(tmp[i].toUpperCase());
                if (produks.length !== 0) {
                  const render = await RenderUndercutKonveksiPDF(produks, tmp[i]);
                  res.push({ status: render, caption: `Undercut Konveksi ${tmp[i].toUpperCase()}` });
                } else {
                  res.push({ status: "gagal", caption: `Tidak dapat menemukan konvkesi dengan kode : ${tmp[i]}` });
                }
              } else {
                res.push({ status: "gagal", caption: `Fitur Ini Belum tersedia` });
              }
            }
          }
        } else {
          res.push({
            status: "gagal",
            caption: `Harap masukan kode konveksi setelah !konveksi. cth: !konveksi SONY APEN...`,
          });
        }
        break;
      case "Kosong":
        res.push({ status: "gagal", caption: `Anda belum Terdaftar, Silahkan mendaftar dengan !daftar` });
        break;
      case "baru":
      default: //Kontak Tidak Memiliki Pangkat
        res.push({
          status: "gagal",
          caption: `╭─「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses :
│• *Admin*
│• *Member*
│────────────────
│Status anda saat ini : ${pengguna.pangkat}
╰────────────────`,
        });
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res.push({ status: "gagal", caption: "Maaf Bot sedang dalam Maintenence.." });
  }
  return res;
}

module.exports = Undercut;
