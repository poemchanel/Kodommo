const DBState = require("../../Routes/DBState");
const Verify = require("../Contacts/Verify");
const FindProduct = require("../../Routes/Products/FindKodeBarang");
const RenderProduct = require("../../Render/Product");

async function Product(Pesan, From, Res = []) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
      case "member":
        Res = await RankMember(
          Pesan.replace(/!produk/i, "")
            .split(" ")
            .filter((e) => e !== "")
        );
        break;
      case "Kosong":
        Res.push(RankKosong());
        break;
      default:
        Res.push(RankDefault(Rank));
        break;
    }
  } else {
    Res.push(DBDisconected());
  }
  return Res;
}

async function RankMember(KodeProduk, Res = []) {
  if (KodeProduk.length !== 0) {
    for (let i = 0; i < KodeProduk.length; i++) {
      if (KodeProduk[i].includes("_") === true) {
        Res.push(await ProductNumber(KodeProduk[i].toUpperCase().split("_")));
      } else {
        Res.push(await ProductNotNumber(KodeProduk[i].toUpperCase()));
      }
    }
  } else {
    Res.push(PesanKosong());
  }
  return Res;
}
async function ProductNotNumber(KodeProduk, Res) {
  const Product = await FindProduct(KodeProduk);
  if (Product.length !== 0) {
    if (Product.length > 1) {
      Res = Products(Product, KodeProduk);
    } else {
      Res = await RenderProduct(Product[0]);
    }
  } else {
    Res = ProductKosong(KodeProduk);
  }
  return Res;
}
function Products(Product, KodeProduk, Res) {
  let j = 1;
  Res = `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${KodeProduk}
│──「 *i* 」──────────
│Gunakan perintah 
│!Produk ${KodeProduk}_<Noproduk>
│──「 *List Nomor Produk ${KodeProduk.toUpperCase()}* 」─${Product.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
async function ProductNumber(KodeProduk, Res) {
  const Product = await FindProduct(KodeProduk[0]);
  if (Product.length !== 0) {
    if (Product[KodeProduk[1] - 1] !== undefined) {
      Res = await RenderProduct(Product[KodeProduk[1] - 1]);
    } else {
      Res = ProductNumberKosong(KodeProduk[0], KodeProduk[1]);
    }
  } else {
    Res = ProductKosong(KodeProduk[0]);
  }
  return Res;
}
function ProductNumberKosong(KodeProduk, Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk 
│dengan kode ${KodeProduk} nomor ${Number}
│──「 *i* 」──────────
│Gunakan Perintah !Produk ${KodeProduk}
│untuk melihat list produk yang
│ada di kode ${KodeProduk}
╰───────────────`;
  return Res;
}
function ProductKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak ditemukan produk
│dengan kode : ${KodeProduk}
│──「 *i* 」──────────
│Gunakan perintah !konveksi untuk 
│melihat list kode produk
╰───────────────`;
  return Res;
}
function PesanKosong(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Harap masukan kode Produk
│setelah perintah !Produk
│──「 *Contoh* 」─────── 
│!Produk D1008, D1008 ...
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
module.exports = Product;
