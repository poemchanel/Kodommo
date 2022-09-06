const VerifikasiKontak = require("../VerifikasiKontak");

async function Help(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak);
  switch (pengguna.pangkat) {
    case "Kosong":
      res = {
        caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`,
        nama: kontak.number,
      };
      break;
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
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
}

module.exports = Help;
