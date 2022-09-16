const DBState = require("../../../Routes/DBState");
const Verify = require("../../Contacts/Verify");
const FindProduct = require("../../../Routes/Products/FindKodeBarang");
const UpdateProduct = require("../../../Routes/Products/Update");

async function Click(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
        Res = RankMember(
          Pesan.replace(/!cick/i, "")
            .split(" ")
            .filter((e) => e !== "")
        );
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

async function RankMember(Pesan, Res) {
  if (Pesan.length === 4) {
    if (Pesan[0].includes("_") === true) {
      Res = await ProductNumber(Pesan[0]).toUpperCase().split("_");
    } else {
      Res = await ProductNotNumber(Pesan[0].toUpperCase());
    }
  } else {
    Res = FormatWrong();
  }
  return Res;
}

async function Product(Pesan, Res) {
  let Produks;
  if (Pesan[1].includes("_") === true) {
    let tmp = Pesan[1].split("_");
    Produks = await TarikProduk(tmp[0].toUpperCase());
    if (Produks.length === 0) {
      Res = Produk0(Pesan[1]);
    } else {
      Res = CekShopee(Pesan, Produks[tmp[1] - 1]);
    }
  } else {
    Produks = await TarikProduk(Pesan[1].toUpperCase());
    if (Produks.length === 0) {
      Res = Produk0(Pesan[1]);
    } else if (Produks.length > 1) {
      Res = ProdukBanyak(Pesan[1], Produks);
    } else {
      Res = CekShopee(Pesan, Produks[0]);
    }
  }
  return Res;
}
function Produk0(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}  
│tidak ditemukan
│──「 *i* 」────────
│Gunakan !konveksi untuk
│cek list kode produk
╰───────────────`;
  return Res;
}
function ProdukBanyak(KodeProduk, Produk, Res) {
  let j = 1;
  Res = `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${KodeProduk.toUpperCase()}
│──「 *i* 」────────
│gunakan perintah 
│!Click ${KodeProduk.toUpperCase()}_<Noproduk>
│contoh  : !Click ${KodeProduk.toUpperCase()}_2
│──「 *List Nomor Produk ${KodeProduk.toUpperCase()}* 」─${Produk.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
function CekShopee(Pesan, Produk) {
  let Posisi;
  if (Produk.shopee !== undefined) {
    if (Produk.shopee !== 0) {
      Posisi = Produk.shopee.findIndex((e) => e.nama === Pesan[2].toUpperCase());
      if (Posisi !== -1) {
        Res = Action(Pesan, Produk, Posisi);
      } else {
        Res = ShopeeNamaKosong(Pesan[1], Pesan[2]);
      }
    } else {
      Res = ShopeeKosong(Pesan[1]);
    }
  } else {
    Res = ShopeeKosong(Pesan[1]);
  }
  return Res;
}
function ShopeeKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}  
│tidak memiliki link Shopee
│──「 *i* 」────────
│Gunakan !Produk ${KodeProduk}
│untuk cek list link shopee
╰───────────────`;
  return Res;
}
function ShopeeNamaKosong(KodeProduk, NamaShopee, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Produk dengan kode ${KodeProduk}   
│tidak memiliki Link    
│shopee dengan nama  ${NamaShopee.toUpperCase()}  
│──「 *i* 」────────
│Gunakan !Produk ${KodeProduk}
│untuk cek list link shopee
╰───────────────`;
  return Res;
}
function Action(Pesan, Produk, Posisi, Res) {
  switch (Pesan[3].toUpperCase()) {
    case "ADD":
    case "TAMBAH":
      Res = ActionTambah(Pesan[4], Produk, Posisi);
      break;
    case "DELETE":
    case "HAPUS":
      Res = ActionHapus(Produk, Posisi);
      break;
    default:
      Res = ActionTidakTerdaftar(Pesan[3]);
      break;
  }
  return Res;
}
async function ActionTambah(AriaLabel, Produk, Posisi, Res) {
  let ProdukUpdated = Produk;
  ProdukUpdated.shopee[Posisi].click = [];
  ProdukUpdated.shopee[Posisi].click.push(AriaLabel);
  const UpdateStatus = await UpdateProduk(ProdukUpdated);
  Res = UpdateStatus;
  return Res;
}
async function ActionHapus(Produk, Posisi, Res) {
  let ProdukUpdated = Produk;
  delete ProdukUpdated[Posisi].click;
  const UpdateStatus = await UpdateProduk(ProdukUpdated);
  Res = UpdateStatus;
  return Res;
}
function ActionTidakTerdaftar(Action, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Action ${Action}
│tidak terdaftar
│──「 *Action List* 」─────
│• *Tambah*
│• *Hapus*
│──「 *i* 」────────
│Format perintah !Click
│!Click <KP> <S> <A> <AL>
│Contoh: 
│!Click D0001 DOMMO Tambah 80gr
│──「 *Index* 」───────
*│•<KP>* : Kode Produk 
*│•<S>* : Dommo/NamaPesaing 
*│•<A>* : Action 
*│•<AL>* : Aria-Label 
╰───────────────`;
  return Res;
}
function FormatWrong(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Format perintah yang anda  
│masukan salah/tidak lengkap
│──「 *i* 」────────
│Format perintah !Click
│!Click <KP> <S> <A> <AL>
│Contoh: 
│!Click D0001 DOMMO Tambah 80gr
│──「 *Index* 」───────
*│•<KP>* : Kode Produk 
*│•<S>* : Dommo/NamaPesaing 
*│•<A>* : Action 
*│•<AL>* : Aria-Label 
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
module.exports = Click;
