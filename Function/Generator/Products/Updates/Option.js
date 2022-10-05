const DBState = require("../../../Routes/DBState");
const Verify = require("../../Contacts/Verify");
const FindProduct = require("../../../Routes/Products/FindKodeBarang");
const UpdateProduct = require("../../../Routes/Products/Update");

async function Option(Msg, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
        let Split = Msg.replace(/!kategori/i, "")
          .split(" ")
          .filter((e) => e !== "");
        if (Split.length === 4) {
          Res = await CheckProduct(Split);
        } else {
          Res = FormatWrong();
        }
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
// Respon
async function CheckProduct(Msg, Res) {
  let Produks;
  if (Msg[0].includes("_") === true) {
    let KodeProduk = Msg[0].toUpperCase().split("_");
    Produks = await FindProduct(KodeProduk[0]);
    if (Produks.length === 0) {
      Res = NoProduct(KodeProduk[0], `Nomor ${KodeProduk[0]}`);
    } else {
      Res = CheckShopee(Msg, Produks[KodeProduk[1] - 1]);
    }
  } else {
    Produks = await FindProduct(Msg[0].toUpperCase());
    if (Produks.length === 0) {
      Res = NoProduct(Msg[0], "");
    } else if (Produks.length > 1) {
      Res = Products(Msg[0].toUpperCase(), Produks);
    } else {
      Res = CheckShopee(Msg, Produks[0]);
    }
  }
  return Res;
}
function NoProduct(KodeProduk, Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak ditemukan produk dengan
│kode ${KodeProduk} ${Number}
│──「 *i* 」────────
│Gunakan perintah !konveksi
│untuk cek list kode produk
╰───────────────`;
  return Res;
}
function Products(KodeProduk, Produk, Res) {
  let j = 1;
  Res = `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${KodeProduk}
│──「 *i* 」────────
│Gunakan perintah 
│!Kategori ${KodeProduk}_<Noproduk>
│──「 *List Nomor ${KodeProduk}* 」─${Produk.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
function CheckShopee(Msg, Produk) {
  if (Produk.shopee !== undefined) {
    let Posisi = Produk.shopee.findIndex((e) => e.nama === Msg[1].toUpperCase());
    if (Posisi !== -1) {
      Res = Action(Msg, Produk, Posisi);
    } else {
      Res = ShopeeNameUndefined(Msg[0], Msg[1]);
    }
  } else {
    Res = NoShopee(Msg[0]);
  }
  return Res;
}
function NoShopee(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}  
│tidak memiliki link Shopee
│──「 *i* 」────────
│Gunakan !Link ${KodeProduk} untuk 
│cek list link shopee
╰───────────────`;
  return Res;
}
function ShopeeNameUndefined(KodeProduk, NamaShopee, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}   
│tidak memiliki Link shopee
│dengan nama  ${NamaShopee.toUpperCase()}  
│──「 *i* 」────────
│Gunakan !Link ${KodeProduk} untuk 
│cek list link shopee
╰───────────────`;
  return Res;
}
function Action(Msg, Produk, Posisi, Res) {
  switch (Msg[2].toUpperCase()) {
    case "ADD":
    case "TAMBAH":
      Res = ActionAdd(Msg[3], Produk, Posisi);
      break;
    case "DELETE":
    case "HAPUS":
      Res = ActionDelete(Produk, Posisi);
      break;
    default:
      Res = ActionUnregistered(Msg[2]);
      break;
  }
  return Res;
}
async function ActionAdd(Kategori, Produk, Posisi, Res) {
  Produk.shopee[Posisi].kategori = Kategori;
  const UpdateStatus = await UpdateProduct(Produk);
  Res = UpdateStatus;
  return Res;
}
async function ActionDelete(Produk, Posisi, Res) {
  Produk.shopee[Posisi].kategori = "";
  const UpdateStatus = await UpdateProduct(Produk);
  Res = UpdateStatus;
  return Res;
}
function ActionUnregistered(Action, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Action ${Action} tidak terdaftar
│──「 *Action List* 」─────
│• *Tambah*
│• *Hapus*
╰───────────────`;
  return Res;
}
function FormatWrong(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Format perintah yang anda 
│masukan salah/tidak lengkap
│──「 *i* 」──────────
│Format perintah !Kategori
│!Kategori <KP> <S> <A> <K>
*│•<KP>* : Kode Produk 
*│•<S>* : Dommo/NamaPesaing 
*│•<A>* : Action 
*│•<K>* : Kategori 
│──「 *Contoh* 」───────
│!Kategori D0001 DOMMO Tambah 80gr
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
│• *SuperAdmin*
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
module.exports = Option;
