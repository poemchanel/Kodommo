const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../../VerifikasiKontak");
const TambahPengguna = require("../../Routes/TambahPengguna");

async function Daftar(kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        res = {
          caption: `╭──「 *Perintah Gagal* 」
│Kontak @${kontak.number} 
│Telah terdaftar dengan 
│Pangkat : ${pengguna.pangkat}
╰───────────────`,
        };
        break;
      case "baru":
        res = {
          caption: `╭──「 *Perintah Gagal* 」
│Kontak @${kontak.number} 
│Telah terdaftar, Harap hubungi 
│admin untuk proses penerimaan
╰───────────────`,
        };
        break;
      case "Kosong":
        const daftar = await TambahPengguna(kontak);
        res = {
          caption: `╭──「 *Perintah Berhasil* 」 
│Berhasil Mendaftarkan @${kontak.number}
│• *Nama* : ${kontak.pushname}
│• *Nomor* : ${kontak.number}
│───────────────
│Silahkan hubungi Admin untuk
│proses penerimaan
╰───────────────`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = {
          caption: `╭──「 *Perintah Gagal* 」
│Terjadi kesalahan terhadap 
│kontak @${kontak.number}, Segera 
│hubungi Admin
╰───────────────`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = {
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf ${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    };
  }

  return res;
}

module.exports = Daftar;
