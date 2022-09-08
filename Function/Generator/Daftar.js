const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const TambahPengguna = require("../Routes/TambahPengguna");

async function Daftar(kontak, res) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        res = { caption: `@${kontak.number} telah terdaftar dengan Pangkat : ${pengguna.pangkat}` };
        break;
      case "baru":
        res = { caption: `Form pendaftaran @${kontak.number} telah diterima, Harap tunggu konfirmasi dari Admin` };
        break;
      case "Kosong":
        const daftar = await TambahPengguna(kontak);
        res = {
          caption: `╭─「 *Berhasil Mendaftarkan* 」  : 
│• *Nama* : ${kontak.pushname}
│• *Nomor* : ${kontak.number}
│────────────────
│Silahkan hubungi Admin untuk konfirmasi 
╰────────────────`,
        };
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res = { caption: `Terjadi kesalahan terhadap kontak ${kontak.number}, Segera hubungi Admin` };
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res = { caption: `Maaf ${kontak.number}, Bot sedang dalam Maintenence..` };
  }

  return res;
}

module.exports = Daftar;
