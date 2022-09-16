const DBState = require("../../Routes/DBState");
const Verify = require("./Verify");
const FindContact = require("../../Routes/Contacts/Find");
const UpdateContact = require("../../Routes/Contacts/Update");

async function Accept(From, Mentioned, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
        Res = await RankAdmin(Mentioned);
        break;
      case "Kosong":
        Res = RankKosong();
        break;
      default:
        Res = RankDefault(Rank);
        break;
    }
  } else {
    Res = DBDisconected();
  }
  return Res;
}

async function RankAdmin(Mentioned, Res) {
  const Form = await FindContact(Mentioned);
  if (Form.length === 0) {
    Res = NotRegistered(Mentioned);
  } else {
    if (Form[0].pangkat === "baru") {
      Res = await Registered(Form[0]);
    } else {
      Res = AlreadyAccepted(Form[0]);
    }
  }
  return Res;
}
function NotRegistered(Mentioned, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kontak @${Mentioned} 
│Belum melakukan pendaftaran 
╰───────────────`;
  return Res;
}
async function Registered(Form, Res) {
  Form.pangkat = "member";
  const Patch = await UpdateContact(Form);
  Res = `╭──「 *Perintah Berhasil* 」
│Berhasil menerima
│Kontak @${Form.notelepon} 
│dengan pangkat : member
╰───────────────`;
  return Res;
}
function AlreadyAccepted(Form, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kontak @${Form.notelepon} 
│Telah terdaftar dengan 
│Pangkat : ${Form.pangkat}
╰───────────────`;
  return Res;
}
function RankKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`;
  return Res;
}
function RankDefault(Rank, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│───────────────
│Status anda saat ini : ${Rank}
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

module.exports = Accept;
