const DBState = require("../Routes/DBState");
const Verify = require("./Contacts/Verify");

async function Help(From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
        Res = RankSuperAdmin();
        break;
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
function RankSuperAdmin(Res) {
  Res = `╭──「 *Daftar Perintah Super* 」
*│•!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak
*│•!Terima* <TagKontak>
│    ╰ Menerima kontak
*│•!Pangkat* <Action> <TagKontak>
│    ╰ Mengubah pangkat kontak
*│•!List*
│    ╰ List konveksi
*│•!Konveksi* <Konveksi>
│    ╰ List produk dikonveksi
*│•!Produk* <KodeProduk>
│    ╰ Detail produk
*│•!link* <KodeProduk>
│    ╰ Link produk
*│•!Click* <KP> <S> <A> <AL>
│    ╰ Click kategory
*│•!Undercut*
│    ╰ List produk undercuted
*│•!Update* <Produk/Konveksi/Action>
│    ╰ Scraping dan Update harga
*│•!Auto* <Action>
│    ╰ Auto Scraping dan Update
│       Semua Produk
╰───────────────`;
  return Res;
}
function RankAdmin(Res) {
  Res = `╭──「 *Daftar Perintah Admin* 」
*│•!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak
*│•!Terima* <TagKontak>
│    ╰ Menerima kontak
*│•!List*
│    ╰ List konveksi
*│•!Konveksi* <Konveksi>
│    ╰ List produk dikonveksi
*│•!Produk* <KodeProduk>
│    ╰ Detail produk
*│•!link* <KodeProduk>
│    ╰ Link produk
*│•!Undercut*
│    ╰ List produk undercuted
*│•!Update* <Produk/Konveksi/Action>
│    ╰ Scraping dan Update harga
*│•!Auto* <Action>
│    ╰ Auto Scraping dan Update
│       Semua Produk
╰───────────────`;
  return Res;
}
function RankMember(Res) {
  Res = `╭──「 *Daftar Perintah Member* 」
*│•!Daftar* <TagKontak>
│    ╰ Mendaftarkan kontak
*│•!List*
│    ╰ List konveksi
*│•!Konveksi* <Konveksi>
│    ╰ List produk dikonveksi
*│•!Produk* <KodeProduk>
│    ╰ Detail produk
*│•!link* <KodeProduk>
│    ╰ Link produk
*│•!Undercut*
│    ╰ List produk undercuted
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

module.exports = Help;
