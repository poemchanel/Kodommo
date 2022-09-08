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
          res = { caption: `Nomor @${nomor} tidak terdaftar` };
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
                caption: `Berhasil menerima @${form[0].notelepon} dengan pangkat : member`,
              };
              break;
          }
        }
        break;
      case "member": // Kontak Berpangkat member
      case "baru":
      case "Kosong":
        res = {
          caption: `╭─「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses :
│• *Admin*
│────────────────
│Status anda saat ini : ${pengguna.pangkat}
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

module.exports = Terima;
