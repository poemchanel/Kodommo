const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduk = require("../Routes/TarikProduk");
const UpdateProduk = require("../Routes/UpdateProduk");

async function Click(pesan, kontak, res = {}) {
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
        let tmp = pesan.body.split(" ").filter((e) => e !== "");
        if (tmp.length === 5) {
          res.caption = await CekProduk(tmp);
        } else {
          res.caption = FormatPerintahSalah();
        }
        break;
      case "Kosong":
        res.caption = PangkatKosong();
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res.caption = PangkatDefault(pengguna);
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res.caption = Maintenence(kontak);
  }
  return res;
}
// Respon
async function CekProduk(Pesan, Res) {
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
function FormatPerintahSalah(Res) {
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
function PangkatKosong(Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`;
  return Res;
}
function PangkatDefault(Pengguna, Res) {
  Res = `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│───────────────
│Status anda saat ini : ${Pengguna.pangkat}
╰───────────────`;
  return Res;
}
function Maintenence(Kontak, Res) {
  Res = `╭──「 *Maintenence* 」
│Mohon Maaf @${Kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`;
  return Res;
}
module.exports = Click;
