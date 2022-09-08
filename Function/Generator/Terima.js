const CekStatusDB = require("../Routes/CekStatusDB");
const VerifikasiKontak = require("../VerifikasiKontak");
const TarikPengguna = require("../Routes/TarikPengguna");
const UpdatePengguna = require("../Routes/UpdatePengguna");

async function Terima(pesan, kontak, nomor, res) {
  res = [];
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        const form = await TarikPengguna(nomor);
        if (form.length === 0) {
          res = { caption: `Nomor @${nomor} belum melakukan pendaftaran` };
        } else {
          switch (form[0].pangkat) {
            case "admin":
            case "superadmin":
            case "member":
              res = {
                caption: `Nomor @${form[0].notelepon} telah terdaftar dengan pangkat : ${form[0].pangkat}`,
              };
              break;
            default:
              const updatepangkat = await UpdatePengguna({
                notelepon: nomor,
                pangkat: "member",
              });
              res = {
                caption: `Berhasil mengupdate @${form[0].notelepon} dengan pangkat : member`,
              };
              break;
          }
        }
        break;
      case "member": // Kontak Berpangkat member
      case "baru":
      case "Kosong":
        res = {
          nama: pengguna.nama,
          caption: `Maaf anda tidak dapat mengakses perintah ini`,
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

module.exports = Terima;
