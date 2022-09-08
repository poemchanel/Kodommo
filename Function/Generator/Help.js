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
          caption: `╭─「 *Daftar Perintah ${pengguna.pangkat}* 」
│• *!Ping* : Cek status Bot
│• *!Help* : Menampilkan list perintah
│• *!Daftar* <Tag> : Daftarkan pengguna
│• *!Terima* <Tag> : Terima form pendaftaran
│• *!Produk* <KodeProduk> : Detail produk
│• *!Konveksi* <KodeKonveksi> : List harga produk
│• *!Undercut* <KodeKonveksi> : List harga produk Undercuted
│• *!Scrap* <Perintah> : Scraping dan Update harga
│• *!Update* <Perintah> : Scraping dan Update harga
╰────────────────`,
        };
        break;
      case "member": // Kontak Berpangkat member
        res = {
          caption: `╭─「 *Daftar Perintah ${pengguna.pangkat}* 」
│• *!Ping* : Cek status Bot
│• *!Help* : Menampilkan list perintah
│• *!Daftar* <Tag> : Daftarkan pengguna
│• *!Produk* <KodeProduk> : Detail produk
│• *!Konveksi* <KodeKonveksi> : List harga produk
│• *!Undercut* <KodeKonveksi> : List harga produk Undercuted
╰────────────────`,
        };
        break;
      case "Kosong":
        res = {
          caption: `Anda belum Terdaftar, Silahkan mendaftar dengan !daftar`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = {
          caption: `╭─「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses :
│• *Admin*
│• *Member*
│────────────────
│Status anda saat ini : ${pengguna.pangkat}
╰────────────────`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { caption: "Maaf Bot sedang dalam Maintenence.." };
  }
  return res;
}

module.exports = Help;
