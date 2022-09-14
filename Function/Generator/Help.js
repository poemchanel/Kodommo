const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");

async function Help(kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        res = {
          caption: `╭──「 *Daftar Perintah ${pengguna.pangkat}* 」
│ *!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak pengguna
│ *!Terima* <TagKontak>
│    ╰ Menerima kontak pengguna
│ *!Produk* <Produk>
│    ╰ Detail informasi produk
│ *!Konveksi* <Konveksi>
│    ╰ List harga produk
│ *!Undercut* <Konveksi> :
│    ╰ List harga produk Undercuted
│ *!Update* <Produk/Konveksi/Perintah>
│    ╰ Scraping dan Update harga
│ *!Auto* <Perintah>
│    ╰ Auto Scraping dan Update
│       Semua Produk
╰───────────────`,
        };
        break;
      case "member": // Kontak Berpangkat member
        res = {
          caption: `╭──「 *Daftar Perintah ${pengguna.pangkat}* 」
│ *!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak pengguna
│ *!Produk* <Produk>
│    ╰ Detail informasi produk
│ *!Konveksi* <Konveksi>
│    ╰ List harga produk
│ *!Undercut* <Konveksi> :
│    ╰ List harga produk Undercuted
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

module.exports = Help;
