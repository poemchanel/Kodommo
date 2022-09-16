const DBState = require("../Routes/DBState");
const Verify = require("./Contacts/Verify");

async function Help(From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "dev":
      case "superadmin":
        Res = RankSuperAdmin();
      case "admin":
        Res = RankAdmin();
        break;
      case "member":
        Res = RankMember();
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
//Caption
function RankSuperAdmin(Res) {
  Res = `╭──「 *Daftar Perintah Dev* 」
│ *!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak pengguna
│ *!Terima* <TagKontak>
│    ╰ Menerima kontak pengguna
│ *!Produk* <Produk>
│    ╰ Detail informasi produk
│ *!Konveksi* <Konveksi>
│    ╰ List harga produk
│ *!Undercut* <Konveksi> :
│    ╰ List harga produk Undercuted
│ *!Update* <Produk/Konveksi/Perintah>
│    ╰ Scraping dan Update harga
│ *!Auto* <Perintah>
│    ╰ Auto Scraping dan Update
│       Semua Produk
╰───────────────`;
  return Res;
}
function RankAdmin(Res) {
  Res = `╭──「 *Daftar Perintah Admin* 」
│ *!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak pengguna
│ *!Terima* <TagKontak>
│    ╰ Menerima kontak pengguna
│ *!Produk* <Produk>
│    ╰ Detail informasi produk
│ *!Konveksi* <Konveksi>
│    ╰ List harga produk
│ *!Undercut* <Konveksi> :
│    ╰ List harga produk Undercuted
│ *!Update* <Produk/Konveksi/Perintah>
│    ╰ Scraping dan Update harga
│ *!Auto* <Perintah>
│    ╰ Auto Scraping dan Update
│       Semua Produk
╰───────────────`;
  return Res;
}
function RankMember(Res) {
  Res = `╭──「 *Daftar Perintah Member* 」
│ *!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak pengguna
│ *!Produk* <Produk>
│    ╰ Detail informasi produk
│ *!Konveksi* <Konveksi>
│    ╰ List harga produk
│ *!Undercut* <Konveksi> :
│    ╰ List harga produk Undercuted
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
│• *Member*
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

module.exports = Help;
