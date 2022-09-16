const DBState = require("../../Routes/DBState");
const Verify = require("./Verify");
const NewContact = require("../../Routes/Contacts/New");

async function Register(Mentioned, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(Mentioned.number);
    switch (Rank) {
      case "Kosong":
        Res = RankKosong(Mentioned);
        break;
      case "baru":
        Res = RankBaru(Mentioned.number);
        break;
      default: //Kontak Tidak Memiliki Pangkat
        Res = RankDefault(Mentioned.number, Rank);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    Res = DBDisconected();
  }
  return Res;
}

async function RankKosong(Mentioned, Res) {
  const Form = await NewContact(Mentioned);
  Res = `╭──「 *Perintah Berhasil* 」 
│Berhasil Mendaftarkan @${Mentioned.number}
│• *Nama* : ${Mentioned.pushname}
│• *Nomor* : ${Mentioned.number}
│───────────────
│Silahkan hubungi Admin untuk
│proses penerimaan
╰───────────────`;
  return Res;
}

function RankBaru(Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kontak @${Number} 
│Telah terdaftar, Harap hubungi 
│admin untuk proses penerimaan
╰───────────────`;
  return Res;
}
function RankDefault(Number, Rank, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kontak @${Number} 
│Telah terdaftar dengan 
│Pangkat : ${Rank}
╰───────────────`;
  return Res;
}
function DBDisconected(Res) {
  Res = `╭──「 *Maintenence* 」
│Mohon Maaf :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`;
  return Res;
}

module.exports = Register;
