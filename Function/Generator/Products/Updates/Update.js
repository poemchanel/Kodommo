const DBState = require("../../../Routes/DBState");
const Verify = require("../../Contacts/Verify");
const FindProduct = require("../../../Routes/Products/FindKodeBarang");
const FindKonveksi = require("../../../Routes/Products/FindKonveksi");
const PriceProduct = require("../../../Update/PriceProduct");
const {
  HargaKonveksiMulai,
  HargaKonveksiOff,
  HargaKonveksiOn,
  HargaKonveksiCek,
} = require("../../../Update/PriceKonveksi");
const { AutoOff, AutoOn, AutoCek } = require("../../../Update/PriceProducts");
const { setTimeout } = require("timers/promises");

async function Update(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
        Res = RankAdmin(
          Pesan.replace(/!update/i, "")
            .replace(/ /g, "")
            .toUpperCase()
        );
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
    return Res;
  }
}
async function RankAdmin(Pesan, Res) {
  if (Pesan !== "") {
    switch (tmp) {
      case "CEK":
        Res = ActionCek();
        break;
      case "LOG":
        Res = ActionLog();
        break;
      case "GAGAL":
        Res = ActionFailed();
        break;
      case "ON":
        Res = await ActionOn();
        break;
      case "OFF":
        Res = ActionOff();
        break;
      default:
        Res = await ActionDefault();
        break;
    }
  } else {
    Res = PesanKosong();
  }
  return Res;
}
function ActionCek(Update, Res) {
  Update = HargaKonveksiCek();
  Res = `╭──「 *Perintah Berhasil* 」
│Status Update Konveksi : ${Update.status}
│Berhasil mengupdate ${Update.diupdate}/${Update.totalproduk}
│Gagal mengupdate ${Update.gagal.length} produk
│Antrian update saat ini ${Update.antrian}/${Update.totalproduk}
╰───────────────`;
  return Res;
}
function ActionLog(Update, Res) {
  Update = HargaKonveksiCek();
  Res = `╭──「 *Perintah Berhasil* 」
│Update Konveksi
│──「 *Log* 」────────
${Update.log.join(`\n\r`)}
╰───────────────`;
  return Res;
}
function ActionFailed(Update, Res) {
  Update = HargaKonveksiCek();
  Res = `╭──「 *Perintah Berhasil* 」
│Produk gagal diupdate
│──「 *List* 」────────${Update.gagal.join(`\r`)}
╰───────────────`;
  return Res;
}
async function ActionOn(Update, Res) {
  Update = HargaKonveksiOff();
  Update = AutoOff();
  await setTimeout(5000);
  Update = HargaKonveksiOn();
  Res = `╭──「 *Perintah Berhasil* 」
│${Update.status}
│Berhasil mengupdate ${Update.diupdate}/${Update.totalproduk}
│Gagal mengupdate ${Update.gagal.length} produk
│Antrian update saat ini ${Update.antrian}/${Update.totalproduk}
╰───────────────`;
  return Res;
}
function ActionOff(Update, Res) {
  Update = HargaKonveksiOff();
  Res = `╭──「 *Perintah Berhasil* 」
│${Update.status}
│Berhasil mengupdate ${Update.diupdate}/${Update.totalproduk}
│Gagal mengupdate ${Update.gagal.length} produk
│Antrian update saat ini ${Update.antrian}/${Update.totalproduk}
╰───────────────`;
  return Res;
}
async function ActionDefault(Pesan, Res) {
  if (Pesan.includes("_") === true) {
    Pesan.split("_");
    Res = await ProductNumber(Pesan[0], Pesan[1]);
  } else {
    Res = await ProductNotNumber(Pesan);
  }
  return Res;
}
async function ProductNumber(KodeProduk, Number, Res) {
  const Product = await FindProduct(KodeProduk);
  if (Product.length !== 0) {
    if (Product[Number - 1] !== undefined) {
      Res = await UpdateProduct(Product[Number - 1]);
    } else {
      Res = ProductNumberKosong(KodeProduk, `_${Number}`);
    }
  } else {
    Res = ProductKosong(KodeProduk);
  }
  return Res;
}
async function UpdateProduct(Product, Number, Res) {
  let on, cek, update;
  cek = HargaKonveksiCek();
  if (cek.state === true) {
    cek = HargaKonveksiOff();
    on = "konveksi";
  }
  cek = AutoCek();
  if (cek.state === true) {
    cek = AutoOff();
    on = "auto";
  }
  await setTimeout(5000);
  update = await PriceProduct(Product);
  Res = `╭──「 *Perintah Berhasil* 」
│Berhasil Mengupdate 
│Produk ${Product.kodebarang}${Number}
│──「 *Log* 」────────
${update.log.join(`\n\r`)}
╰───────────────`;
  if (on === "konveksi") {
    cek = HargaKonveksiOn();
  } else if (on === "auto") {
    cek = AutoOn();
  }
  return Res;
}
function ProductNumberKosong(KodeProduk, Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan
│produk dengan
│kode ${KodeProduk} nomor ${Number}
│──「 *i* 」────────
│Gunakan Perintah
│!Produk ${KodeProduk}
│untuk melihat 
│list produk
│di kode ${KodeProduk}
╰───────────────`;
  return Res;
}
function ProductKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan 
│produk dengan 
│kode : ${KodeProduk}
│──「 *i* 」────────
│Gunakan perintah
│!konveksi untuk 
│melihat list
│kode produk
╰───────────────`;
  return Res;
}
async function ProductNotNumber(KodeProduk, Res) {
  const Product = await FindProduct(KodeProduk);
  if (Product.length !== 0) {
    if (Product.length > 1) {
      Res = Products(Product, KodeProduk);
    } else {
      Res = await UpdateProduct(Product[0], "");
    }
  } else {
    Res = await Konveksi(KodeProduk);
  }
  return Res;
}
function Products(Product, KodeProduk, Res) {
  let j = 1;
  Res = `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${KodeProduk}
│──「 *i* 」────────
│Gunakan perintah 
│!Produk ${KodeProduk}_<Noproduk>
│──「 *Contoh* 」────────
│!Produk ${KodeProduk}_2
│──「 *List Nomor Produk ${tmp[i].toUpperCase()}* 」─${Product.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
async function Konveksi(KodeProduk, Res) {
  const Konveksi = await FindKonveksi(KodeProduk);
  if (Konveksi.length !== 0) {
    Res = await UpdateKonveksi(Konveksi, KodeKonveksi);
  } else {
    Res = KonveksiKosong(KodeProduk);
  }
  return Res;
}
async function UpdateKonveksi(Konveksi, KodeKonveksi, Action, Res) {
  Action = AutoOff();
  Action = HargaKonveksiOff();
  await setTimeout(5000);
  const Update = HargaKonveksiMulai(Konveksi, 0);
  Res = `╭──「 *Perintah Berhasil* 」
│${Update.status} ${KodeKonveksi}
│Total Porduk ${Update.totalproduk}
╰───────────────`;
  return Res;
}
function KonveksiKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan 
│produk atau konveksi 
│dengan kode : ${KodeProduk}
│──「 *i* 」────────
│Gunakan perintah !list
│untuk melihat kode 
│konveksi dan !konveksi
│untuk melihat kode produk
╰───────────────`;
  return Res;
}
function PesanKosong(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Pesan Kosong
│──「 *i* 」────────
│Masukan kode konveksi
│atau kode Produk 
│setelah perintah !Update
│──「 *Contoh* 」────────
│!Update D1008
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
│• *Member*
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

module.exports = Update;
