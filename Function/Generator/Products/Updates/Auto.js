const DBState = require("../../../Routes/DBState");
const Verify = require("../Contacts/Verify");
const { AutoOn, AutoOff, AutoCek } = require("../../../Update/PriceProducts");
const { HargaKonveksiOff } = require("../../../Update/PriceKonveksi");
const { setTimeout } = require("timers/promises");

async function Auto(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
        Res = await RankAdmin(Pesan.replace(/!Auto/i, "").replace(/ /g, "").toUpperCase());
        break;
      case "Kosong":
        Res = RankKosong();
        break;
      default:
        Res = RankDefault(Rank);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    Res = DBDisconected();
  }
  return Res;
}
async function RankAdmin(Pesan, Res) {
  switch (Pesan) {
    case "ON":
      Res = await ActionOn();
      break;
    case "OFF":
      Res = await ActionOff();
      break;
    case "CEK":
      Res = await ActionCek();
      break;
    case "LOG":
      Res = await ActionLog();
      break;
    case "GAGAL":
      Res = await ActionFailed();
      break;
    default:
      Res = ActionDefault();
      break;
  }
  return Res;
}
async function ActionOn(Action, Res) {
  Action = await HargaKonveksiOff();
  await setTimeout(5000);
  Action = await AutoOn();
  Res = `╭──「 *Perintah Berhasil* 」
${Action.status}
╰───────────────`;
  return Res;
}
async function ActionOff(Action, Res) {
  Action = await AutoOff();
  Res = `╭──「 *Perintah Berhasil* 」
${Action.status}
│Total Produk ${Action.totalproduk}
│Berhasil Mengupdate ${Action.diupdate}
│Terhenti di Antrian ke ${Action.antrian + 1}
╰───────────────`;
  return Res;
}
async function ActionCek(Action, Res) {
  Action = await AutoCek();
  Res = `╭──「 *Perintah Berhasil* 」
${Action.status}
│Total Produk ${Action.totalproduk}
│Berhasil Mengupdate ${Action.diupdate}
│Sedang dalam Antrian ke ${Action.antrian + 1}
╰───────────────`;
  return Res;
}
async function ActionLog(Action, Res) {
  Action = await AutoCek();
  Res = `╭──「 *Perintah Berhasil* 」
│Auto Update
│──「 *Log* 」────────
${Action.log.join(`\n\r`)}
╰───────────────`;
  return Res;
}
async function ActionFailed(Action, Res) {
  Action = await AutoCek();
  Res = `╭──「 *Perintah Berhasil* 」
│Produk yang 
│gagal diupdate :
│──「 *List* 」────────
${Action.gagal.join(`\n\r`)}
╰───────────────`;
  return Res;
}
function ActionDefault(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Action tidak terdaftar
│──「 *i* 」────────
│list action !Auto : 
│•!Auto on
│•!Auto off
│•!Auto cek
│•!Auto log
╰───────────────`;
  return Res;
}
function RankKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar
│──「 *i* 」────────
│Silahkan mendaftar
│dengan !daftar
╰───────────────`;
  return Res;
}
function RankDefault(Rank, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya 
│dapat diakses oleh :
│• *Admin*
│──「 *i* 」────────
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
module.exports = Auto;
