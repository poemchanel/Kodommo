const DBState = require("../../../Routes/DBState");
const Verify = require("../../Contacts/Verify");
const FindProduct = require("../../../Routes/Products/FindKodeBarang");
const UpdateProduct = require("../../../Routes/Products/Update");

async function ApiName(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
        let Split = Pesan.replace(/!api/i, "")
          .split(" ")
          .filter((e) => e !== "");
        if (Split.length === 4) {
          Res = await CekProduk(Split);
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
async function CekProduk(Pesan, Res) {
  let Produks;
  if (Pesan[0].includes("_") === true) {
    let KodeProduk = Pesan[0].toUpperCase().split("_");
    Produks = await FindProduct(KodeProduk[0]);
    if (Produks.length === 0) {
      Res = ProductKosong(KodeProduk[0], `Nomor ${KodeProduk[0]}`);
    } else {
      Res = CekShopee(Pesan, Produks[KodeProduk[1] - 1]);
    }
  } else {
    Produks = await FindProduct(Pesan[0].toUpperCase());
    if (Produks.length === 0) {
      Res = ProductKosong(Pesan[0], "");
    } else if (Produks.length > 1) {
      Res = ProdukBanyak(Pesan[0].toUpperCase(), Produks);
    } else {
      Res = CekShopee(Pesan, Produks[0]);
    }
  }
  return Res;
}
function ProductKosong(KodeProduk, Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak ditemukan produk dengan
│kode ${KodeProduk} ${Number}
│──「 *i* 」────────
│Gunakan perintah !konveksi
│untuk cek list kode produk
╰───────────────`;
  return Res;
}
function ProdukBanyak(KodeProduk, Produk, Res) {
  let j = 1;
  Res = `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${KodeProduk}
│──「 *i* 」────────
│Gunakan perintah 
│!Api ${KodeProduk}_<Noproduk>
│──「 *List Nomor ${KodeProduk}* 」─${Produk.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
function CekShopee(Pesan, Produk) {
  let Posisi;
  if (Produk.shopee !== undefined) {
    if (Produk.shopee !== 0) {
      Posisi = Produk.shopee.findIndex((e) => e.nama === Pesan[1].toUpperCase());
      if (Posisi !== -1) {
        Res = Action(Pesan, Produk, Posisi);
      } else {
        Res = ShopeeNamaKosong(Pesan[0], Pesan[1]);
      }
    } else {
      Res = ShopeeKosong(Pesan[0]);
    }
  } else {
    Res = ShopeeKosong(Pesan[0]);
  }
  return Res;
}
function ShopeeKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}  
│tidak memiliki link Shopee
│──「 *i* 」────────
│Gunakan !Link ${KodeProduk} untuk 
│cek list link shopee
╰───────────────`;
  return Res;
}
function ShopeeNamaKosong(KodeProduk, NamaShopee, Res) {
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
function Action(Pesan, Produk, Posisi, Res) {
  switch (Pesan[2].toUpperCase()) {
    case "ADD":
    case "TAMBAH":
      Res = ActionTambah(Pesan, Produk, Posisi);
      break;
    case "DELETE":
    case "HAPUS":
      Res = ActionHapus(Pesan, Produk, Posisi);
      break;
    default:
      Res = ActionTidakTerdaftar(Pesan[2]);
      break;
  }
  return Res;
}
async function ActionTambah(Pesan, Produk, Posisi, Res) {
  let ProdukUpdated = Produk;
  if (ProdukUpdated.shopee[Posisi].api !== undefined) {
    ProdukUpdated.shopee[Posisi].api.name = Pesan[3];
    const UpdateStatus = await UpdateProduct(ProdukUpdated);
    Res = UpdateStatus;
  } else {
    Res = ApiKosong(Pesan);
  }
  return Res;
}
function ApiKosong(Pesan, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Link ${Pesan[1]} pada produk
│kode ${Pesan[0]} 
│Tidak memiliki API
╰───────────────`;
  return Res;
}
async function ActionHapus(Produk, Posisi, Res) {
  let ProdukUpdated = Produk;
  if (ProdukUpdated.shopee[Posisi].api !== undefined) {
    ProdukUpdated.shopee[Posisi].api.name = "";
    const UpdateStatus = await UpdateProduct(ProdukUpdated);
    Res = UpdateStatus;
  } else {
    Res = ApiKosong(Pesan);
  }
  return Res;
}
function ActionTidakTerdaftar(Action, Res) {
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
│Format perintah !Api
│!Api <KP> <S> <A> <AL>
*│•<KP>* : Kode Produk 
*│•<S>* : Dommo/NamaPesaing 
*│•<A>* : Action 
*│•<AL>* : Aria-Label 
│──「 *Contoh* 」───────
│!Api D0001 DOMMO Tambah 80gr
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
module.exports = ApiName;
