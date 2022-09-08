const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const TambahPengguna = require("../Routes/TambahPengguna");

async function Daftar(pesan, kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        res = {
          nama: kontak.number,
          caption: `@${kontak.number} telah terdaftar dengan Pangkat : ${pengguna.pangkat}`,
        };
        break;
      case "baru":
        res = {
          nama: kontak.number,
          caption: `Form pendaftaran @${kontak.number} telah diterima, Harap tunggu konfirmasi dari Admin`,
        };
        break;
      case "Kosong":
        const daftar = await TambahPengguna(kontak);
        res = {
          nama: kontak.number,
          caption: `Berhasil membuat Form Pendaftaran dengan : 
nama : ${kontak.pushname}
Nomor : ${kontak.number}
Silahkan hubungi Admin untuk konfirmasi `,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = {
          nama: pengguna.nama,
          caption: `Terjadi kesalahan terhadap kontak anda, Segera hubungi Admin`,
        };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { nama: kontak.number, caption: "Maaf Bot sedang dalam Maintenence.." };
  }

  return res;
}

module.exports = Daftar;
