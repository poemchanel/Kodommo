const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");

async function Help(pesan, kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        res = {
          nama: pengguna.nama,
          caption: `Daftar Perintah yang tersedia untuk ${pengguna.pangkat}:
*!ping* Cek Status Bot
*!help* Menampilkan list perintah
*!Daftar* Membuat forn pendaftaran Pengguna
*!Terima* Terima Form Pendaftaran Pengguna
*!P*_<Kode Produk> *Cek Produk* , informasi produk dengan kode tersebut
*!K*_<Konveksi> *Cek Konveksi* , list informasi semua produk di konveksi tersebut
*!KU*_<Konveksi> *Cek Konveksi Undercut* list informasi semua produk yang di undercut
*!UP*_<Kode Poroduk> *Update Data Prdouk*, Update data harga Produk di Shoppe`,
        };
        break;
      case "member": // Kontak Berpangkat member
        res = {
          nama: pengguna.nama,
          caption: `Daftar Perintah yang tersedia untuk ${pengguna.pangkat}:
*!ping* Cek Status Bot
*!help* Menampilkan list perintah
*!P*_<Kode Produk> *Cek Produk* , informasi produk dengan kode tersebut
*!K*_<Konveksi> *Cek Konveksi* , list informasi semua produk di konveksi tersebut
*!KU*_<Konveksi> *Cek Konveksi Undercut* list informasi semua produk yang di undercut`,
        };
        break;
      case "baru":
        res = {
          caption: `Anda telah mendaftar, Harap tunggu konfirmasi dari Admin`,
        };
        break;
      case "Kosong":
        res = {
          nama: kontak.number,
          caption: `Anda belum Terdaftar, Silahkan mendaftar dengan !daftar`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = {
          nama: pengguna.nama,
          caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { nama: kontak.number, caption: "Maaf Bot sedang dalam Maintenence.." };
  }

  return res;
}

module.exports = Help;
