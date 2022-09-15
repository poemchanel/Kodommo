const DBState = require("../Routes/DBState");
const ContactVerification = require("../../ContactVerification");
const TarikPengguna = require("../../Routes/Contacts/Get");
const UpdatePengguna = require("../../Routes/Contacts/Patch");
const HapusPengguna = require("../../Routes/Contacts/Delete");

async function Pangkat(pesan, kontak, nomor, res) {
  res = [];
  let updatepangkat;
  const StatusDB = await DBState();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
        const form = await TarikPengguna(nomor);
        if (form.length === 0) {
          res = {
            caption: `╭──「 *Perintah Gagal* 」
│Kontak @${nomor} 
│Belum Terdaftar                   
╰───────────────`,
          };
        } else {
          switch (true) {
            case pesan.body.toLowerCase().includes("promote"):
            case pesan.body.toLowerCase().includes("admin"):
              updatepangkat = await UpdatePengguna({
                notelepon: nomor,
                pangkat: "admin",
              });
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Berhasil Promote
│Kontak @${nomor} 
│ke pangkat : admin
╰───────────────`,
              };
              break;
            case pesan.body.toLowerCase().includes("demote"):
            case pesan.body.toLowerCase().includes("member"):
              updatepangkat = await UpdatePengguna({
                notelepon: nomor,
                pangkat: "member",
              });
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Berhasil Demote
│Kontak @${nomor} 
│ke pangkat : member
╰───────────────`,
              };
              break;
            case pesan.body.toLowerCase().includes("kick"):
            case pesan.body.toLowerCase().includes("hapus"):
            case pesan.body.toLowerCase().includes("ban"):
              updatepangkat = await HapusPengguna(form[0]);
              res = {
                caption: `╭──「 *Perintah Berhasil* 」
│Berhasil menghapus
│Kontak @${nomor} 
╰───────────────`,
              };
              break;
            default:
              res = {
                caption: `╭──「 *Perintah Gagal* 」
│Masukan Perintah setelah !Pangkat
│lalu tag kontak
│contoh :
│!Pangkat promote @kontak 
╰───────────────`,
              };
              break;
          }
        }
        break;
      case "admin":
      case "member": // Kontak Berpangkat member
      case "baru":
      case "Kosong":
        res = {
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *SuperAdmin*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
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
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    };
  }
  return res;
}

module.exports = Pangkat;
