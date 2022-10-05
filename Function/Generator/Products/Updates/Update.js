const DBState = require("../../../Routes/DBState");
const Verify = require("../../Contacts/Verify");
const FindProduct = require("../../../Routes/Products/FindKodeBarang");
const FindKonveksi = require("../../../Routes/Products/FindKonveksi");
const PriceProduct = require("../../../Update/PriceProduct");
const { KonveksiStatus, KonvkesiOn, KonveksiOff, KonveksiStart } = require("../../../Update/PriceKonveksi");
const { AutoOff, AutoOn, AutoStatus } = require("../../../Update/PriceProducts");
const { setTimeout } = require("timers/promises");

async function Update(Pesan, From, Res) {
  const State = await DBState();
  if (State === 1) {
    const Rank = await Verify(From);
    switch (Rank) {
      case "superadmin":
      case "admin":
        Res = await RankAdmin(
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
  }
  return Res;
}
async function RankAdmin(Pesan, Res) {
  if (Pesan !== "") {
    switch (Pesan) {
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
        Res = await ActionDefault(Pesan);
        break;
    }
  } else {
    Res = PesanKosong();
  }
  return Res;
}
function ActionCek(Update, Res) {
  Update = KonveksiStatus();
  Res = `╭──「 *Perintah Berhasil* 」
│Status Update Konveksi : ${Update.status}
│Berhasil mengupdate ${Update.diupdate}/${Update.totalproduk}
│Gagal mengupdate ${Update.gagal.length} produk
│Antrian update saat ini ${Update.antrian}/${Update.totalproduk}
╰───────────────`;
  return Res;
}
function ActionLog(Update, Res) {
  Update = KonveksiStatus();
  Res = `╭──「 *Perintah Berhasil* 」
│Update Konveksi
│──「 *Log* 」────────
${Update.log.join(`\n\r`)}
╰───────────────`;
  return Res;
}
function ActionFailed(Update, Res) {
  Update = KonveksiStatus();
  Res = `╭──「 *Perintah Berhasil* 」
│Produk gagal diupdate
│──「 *List* 」────────${Update.gagal.join(`\r`)}
╰───────────────`;
  return Res;
}
async function ActionOn(Update, Res) {
  Update = KonveksiOff();
  Update = AutoOff();
  await setTimeout(5000);
  Update = KonvkesiOn();
  Res = `╭──「 *Perintah Berhasil* 」
│${Update.status}
│Berhasil mengupdate ${Update.diupdate}/${Update.totalproduk}
│Gagal mengupdate ${Update.gagal.length} produk
│Antrian update saat ini ${Update.antrian}/${Update.totalproduk}
╰───────────────`;
  return Res;
}
function ActionOff(Update, Res) {
  Update = KonveksiOff();
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
    Res = await ProductNumber(Pesan.split("_"));
  } else {
    Res = await ProductNotNumber(Pesan);
  }
  return Res;
}
async function ProductNumber(KodeProduk, Res) {
  const Product = await FindProduct(KodeProduk[0]);
  if (Product.length !== 0) {
    if (Product[KodeProduk[1] - 1] !== undefined) {
      Res = await UpdateProduct(Product[KodeProduk[1] - 1], KodeProduk[1]);
    } else {
      Res = ProductNumberKosong(KodeProduk[0], KodeProduk[1]);
    }
  } else {
    Res = ProductNumberKosong(KodeProduk[0], KodeProduk[1]);
  }
  return Res;
}
async function UpdateProduct(Product, Number, Res) {
  let on, cek, update;
  cek = KonveksiStatus();
  if (cek.state === true) {
    cek = KonveksiOff();
    on = "konveksi";
  }
  cek = AutoStatus();
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
    cek = KonvkesiOn();
  } else if (on === "auto") {
    cek = AutoOn();
  }
  return Res;
}
function ProductNumberKosong(KodeProduk, Number, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│dengan kode ${KodeProduk} nomor ${Number}
│──「 *i* 」──────────
│Gunakan Perintah !Produk ${KodeProduk}
│untuk melihat list produk
│dengan kode ${KodeProduk}
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
│──「 *i* 」──────────
│Gunakan perintah 
│!Produk ${KodeProduk}_<Noproduk>
│──「 *List Nomor Produk ${KodeProduk.toUpperCase()}* 」─${Product.map(
    (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
  )}
╰───────────────`;
  return Res;
}
async function Konveksi(KodeProduk, Res) {
  const Konveksi = await FindKonveksi(KodeProduk);
  if (Konveksi.length !== 0) {
    Res = await UpdateKonveksi(Konveksi, KodeProduk);
  } else {
    Res = KonveksiKosong(KodeProduk);
  }
  return Res;
}
async function UpdateKonveksi(Konveksi, KodeKonveksi, Action, Res) {
  Action = AutoOff();
  Action = KonveksiOff();
  await setTimeout(5000);
  const Update = KonveksiStart(Konveksi, 0);
  Res = `╭──「 *Perintah Berhasil* 」
│${Update.status} ${KodeKonveksi}
│Total Porduk ${Update.totalproduk}
╰───────────────`;
  return Res;
}
function KonveksiKosong(KodeProduk, Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan 
│produk atau konveksi dengan 
│kode : ${KodeProduk}
│──「 *i* 」──────────
│Gunakan perintah !list untuk
│melihat kode konveksi dan 
│perintah !konveksi untuk 
│melihat kode produk
╰───────────────`;
  return Res;
}
function PesanKosong(Res) {
  Res = `╭──「 *Perintah Gagal* 」
│Kode Produk/Konveksi Kosong
│──「 *i* 」──────────
│Masukan kode konveksi atau
│kode Produk setelah perintah
│──「 *Contoh* 」───────
│!Update D1008
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

module.exports = Update;
