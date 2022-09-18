const DBState = require("../../Routes/DBState");
const Verify = require("./Verify");
const FindContact = require("../../Routes/Contacts/Find");
const UpdateContact = require("../../Routes/Contacts/Update");
const DeleteContact = require("../../Routes/Contacts/Delete");

async function Rank(Action, From, Mentioned, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
        Res = await RankSuperAdmin(Action.toLowerCase(), Mentioned);
        break;
      case "Kosong":
        Res = RankKosong();
        break;
      default: //Kontak Tidak Memiliki Pangkat
        Res = RankDefault(Rank);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    Res = DBDisconected();
  }
  return Res;
}
async function RankSuperAdmin(Action, Mentioned, Res) {
  const Form = await FindContact(Mentioned);
  if (Form.length === 0) {
    Res = NotRegistered(Mentioned);
  } else {
    switch (true) {
      case Action.includes("promote"):
      case Action.includes("admin"):
        Res = await ActionPromote(Form[0]);
        break;
      case Action.includes("demote"):
      case Action.includes("member"):
        Res = await ActionDemote(Form[0]);
        break;
      case Action.includes("kick"):
      case Action.includes("hapus"):
      case Action.includes("ban"):
        Res = await ActionDelete(Form[0]);
        break;
      default:
        Res = ActionDefault();
        break;
    }
  }
  return Res;
}
function NotRegistered(Mentioned, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kontak @${Mentioned}
│Belum melakukan pendaftaran
│──「 *i* 」──────────
│Daftarkan kontak dengan
│!Daftar @${Mentioned}
╰───────────────`;
  return Res;
}
async function ActionPromote(Form, Res) {
  Form.pangkat = "admin";
  const Patch = await UpdateContact(Form);
  Res = `╭──「 *Perintah Berhasil* 」
│Berhasil Promote
│Kontak @${Form.notelepon} 
│ke pangkat : Admin
╰───────────────`;
  return Res;
}
async function ActionDemote(Form, Res) {
  Form.pangkat = "member";
  const Patch = await UpdateContact(Form);
  Res = `╭──「 *Perintah Berhasil* 」
│Berhasil Demote
│Kontak @${Form.notelepon} 
│ke pangkat : member
╰───────────────`;
  return Res;
}
async function ActionDelete(Form, Res) {
  const Delete = await DeleteContact(Form);
  Res = `╭──「 *Perintah Berhasil* 」
│Berhasil menghapus
│Kontak @${Form.notelepon} 
╰───────────────`;
  return Res;
}
function ActionDefault(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Action yang dimasukan
│tidak terdaftar
│──「 *i* 」──────────
│Masukan Action setelah
│perintah !Pangkat 
│──「 *Action List* 」──────
│•Promote / admin
│•Demote / member 
│•Ban / Kick / Hapus
╰───────────────`;
  return Res;
}
function RankKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Kontak Anda belum Terdaftar
│──「 *i* 」──────────
│Silahkan mendaftar dengan
│perintah !daftar
╰───────────────`;
  return Res;
}
function RankDefault(Rank, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat diakses
│oleh kontak berpangkat :
│• *Admin*
│• *Member*
│──「 *i* 」──────────
│Status anda saat ini : ${Rank}
╰───────────────`;
  return Res;
}
function DBDisconected(Res) {
  Res = `╭──「 *Maintenence* 」
│Mohon Maaf :)
│Saat ini Bot sedang
│dalam Maintenence...
╰───────────────`;
  return Res;
}

module.exports = Rank;
