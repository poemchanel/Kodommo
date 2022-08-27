const { HubungkanDatabase, TarikProdukKode, CekDatabaseState, TarikProdukKonveksi, TarikPengguna, UpdatePengguna, UpdateProdukKode, TambahPengguna } = require("./db"); // Import Fungsi yang ada di db.js
const { BuatGambarKonveksi } = require("./MembuatPNG"); // Import Fungsi untuk Merender Gambar
const { ScrapDataProduk } = require("./scraping"); // Import Fungsi untuk Scraping Web

const SuperAdmin = "Duyy - 082246378074"; // Kontak Admin

async function VerifikasiKontak(req, res) {
  const kontak = await TarikPengguna(req.number);
  if (kontak.length == 0) {
    res = { pangkat: "Kosong", nama: req.number };
  } else {
    res = { pangkat: kontak[0].pangkat, nama: kontak[0].nama };
  }
  return res;
} //Release // Mengambil data Pangkat Pengirim Pesan

async function ping(pesan, kontak, res) {
  res = { caption: "Pong" };
  console.log(pesan);
  console.log("-----------------");
  console.log(kontak);
  return res;
} //Release //Membalas Pesan Ping
async function help(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak); // Mengambil data Pangkat Pengirim Pesan
  switch (true) {
    case pengguna.pangkat == "Kosong": // Kontak Tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin": // Kontak Berpangkat superadmin
    case pengguna.pangkat == "admin": // Kontak Berpangkat admin
      res = {
        caption: `Daftar Perintah yang tersedia untuk ${pengguna.pangkat}:
*!P*_~Kode Produk~ Cek informasi produk dengan kode tersebut
*!K*_~Konveksi~ Cek semua produk di konveksi tersebut
*!L*_~Konveksi~ Cek list konveksi yang terdaftar di DB
*!UP*_~Kode Produk~ Update harga produk dengan kode tersebut`,
        nama: pengguna.nama,
      };
      break;
    case pengguna.pangkat == "member": // Kontak Berpangkat member
      res = {
        caption: `Daftar Perintah yang tersedia :
*!P*_~Kode Produk~ Cek informasi produk dengan kode tersebut
*!K*_~Konveksi~ Cek semua produk di konveksi tersebut
*!L*_~Konveksi~ Cek list konveksi yang terdaftar di DB`,
        nama: pengguna.nama,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
}
async function Daftar(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak);
  switch (true) {
    case pengguna.pangkat == "Kosong":
      const tambahkontak = await TambahPengguna(kontak);
      res = {
        caption: `Berhasil membuat Form Pendaftaran dengan : 
nama : ${kontak.pushname}
Nomor : ${kontak.number}
Silahkan hubungi Admin untuk konfirmasi `,
      };
      break;
    case pengguna.pangkat == "superadmin":
    case pengguna.pangkat == "admin":
    case pengguna.pangkat == "member":
      res = { caption: `Anda telah terdaftar dengan Pangkat : ${pengguna.pangkat}` };
      break;
    case pengguna.pangkat == "baru":
      res = {
        caption: `Form pendaftaran anda telah diterima, Harap tunggu konfirmasi dari Admin`,
      };
      break;
    default:
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  }
  return res;
}
async function Terima(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak);
  switch (true) {
    case pengguna.pangkat == "Kosong":
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin":
      const SAtmp1 = pesan.body
        .replace(/!terima/i, "")
        .replace(/ /g, "")
        .split("@");
      const SAtmp2 = { pangkat: SAtmp1[0], nomor: SAtmp1[1] };
      let SAdata = await TarikPengguna(SAtmp2.nomor);
      console.log(SAdata);
      if (SAdata.length == 0) {
        res = { caption: `Data pengguna dengan nomor : ${SAtmp2.nomor} tidak ditemukan, pastikan pengguna tersebut telah !daftar` };
      } else {
        SAdata[0].pangkat = SAtmp2.pangkat;
        const update = await UpdatePengguna(SAdata[0]);
        res = { caption: update };
      }
      break;
    case pengguna.pangkat == "admin":
      const Atmp1 = pesan.body
        .replace(/!terima/i, "")
        .replace(/ /g, "")
        .split("@");
      const Atmp2 = { pangkat: "member", nomor: Atmp1[1] };
      let Adata = await TarikPengguna(Atmp2.nomor);
      console.log(Adata);
      if (Adata.length == 0) {
        res = { caption: `Data pengguna dengan nomor : ${Atmp2.nomor} tidak ditemukan, pastikan pengguna tersebut telah !daftar` };
      } else {
        Adata[0].pangkat = Atmp2.pangkat;
        const update = await UpdatePengguna(Adata[0]);
        res = { caption: update };
      }
      break;
    case pengguna.pangkat == "member":
    case pengguna.pangkat == "baru":
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
    default:
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  }
  return res;
}
async function CekProduk(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak);
  switch (true) {
    case pengguna.pangkat == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin": // Kontak Berpangkat superadmin
    case pengguna.pangkat == "admin": // Kontak Berpangkat admin
    case pengguna.pangkat == "member": // Kontak Berpangkat member
      const tmp1 = pesan.body.replace(/!p_/i, "").replace(/ /g, "");
      const data = await TarikProdukKode(tmp1); //Menambil data produk di DB
      if (data.length == 0) {
        res = { caption: `Data dengan kode produk : ${tmp1} tidak ditemukan` };
      } // Jika Produk tidak Ditemukan
      else {
        res = {
          caption: `informasi Produk ${data[0].kodebarang}
Konveksi : ${data[0].konveksi}
Produk : ${data[0].kodebarang} ${data[0].namabarang}
Harga Modal : Rp.${data[0].hargamodal}
                Jual   |Selisih | %
Daily Price  : Rp.${data[0].dailyprice} | Rp.${data[0].dailyprice - data[0].hargamodal} | ${Math.abs(((data[0].dailyprice - data[0].hargamodal) / data[0].dailyprice) * 100).toFixed(2)}%
Flash Sale   : Rp.${Math.round(data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)} | Rp.${Math.round(data[0].dailyprice - (data[0].dailyprice * 0.5) / 100) - data[0].hargamodal} | ${Math.abs(((data[0].dailyprice - (data[0].dailyprice * 0.5) / 100 - data[0].hargamodal) / (data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)) * 100).toFixed(2)}%
Payday/Event : Rp.${parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100} | Rp.${parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100 - data[0].hargamodal} | ${Math.abs(((parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100 - data[0].hargamodal) / (parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100)) * 100).toFixed(2)}%
Harga Produk : Rp.${data[0].hargaproduk}
Pesaing :${data[0].pesaing.map((a) => " \n\t " + a.namapesaing + " = Rp." + a.hargapesaing + " ")}
Data di Update pada : ${data[0].updatedAt.getHours()}:${data[0].updatedAt.getMinutes()} ${data[0].updatedAt.getDate()}/${data[0].updatedAt.getMonth()}/${data[0].updatedAt.getFullYear()}`,
        };
      } // Jika Produk Ditemukan
      break;
    case pengguna.pangkat == "baru":
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
} //Release //Menampilkan Produk
async function CekKonveksi(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak); // Mengambil data Pangkat Pengirim Pesan

  switch (true) {
    case pengguna.pangkat == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin": // Kontak Berpangkat superadmin
    case pengguna.pangkat == "admin": // Kontak Berpangkat admin
    case pengguna.pangkat == "member": // Kontak Berpangkat member
      const tmp1 = pesan.body.replace(/!k_/i, "").replace(/ /g, "");
      const data = await TarikProdukKonveksi(tmp1); // Mengambil data semua produk berkonveksi
      if (data.length == 0) {
        res = { status: "Gagal", caption: `Data dengan konveksi : ${tmp1} tidak ditemukan` };
      } // Jika data tidak ditemukan
      else {
        const render = await BuatGambarKonveksi(data); // Membuat file Gambar yang Berisi data semua Produk Berkonveksi
        res = { status: "Berhasil", caption: `Daftar Produk di konveksi ${tmp1}` };
      } // Jika data ditemukan
      break;
    case pengguna.pangkat == "baru":
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  } //Cek Pangkat Pengirim Pesan
  return res;
} //Release //Menampilkan Produk berdasarkan Konveksi
async function TidakadaPerintah(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak); // Mengambil data Pangkat Pengirim Pesan
  switch (true) {
    case pengguna.pangkat == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin": // Kontak Berpangkat superadmin
    case pengguna.pangkat == "admin": // Kontak Berpangkat admin
    case pengguna.pangkat == "member": // Kontak Berpangkat member
      res = { caption: `Maaf Perintah ini tidak terdaftar, coba !help untuk melihat perintah yang terdaftar` };
      break;
    case pengguna.pangkat == "baru":
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  }
  return res;
} //Release //Perintah Default

async function UpdateHargaProduk(pesan, kontak, res) {
  const pengguna = await VerifikasiKontak(kontak); // Mengambil data Pangkat Pengirim Pesan
  switch (true) {
    case pengguna.pangkat == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan dengan !daftar`, nama: kontak.number };
      break;
    case pengguna.pangkat == "superadmin": // Kontak Berpangkat superadmin
    case pengguna.pangkat == "admin": // Kontak Berpangkat admin
      const tmp1 = pesan.body.replace(/!up_/i, "").replace(/ /g, "");
      let data = await TarikProdukKode(tmp1); // Mengambil data Produk
      if (data.length == 0) {
        res = `Data dengan kode produk : ${tmp1} tidak ditemukan`;
      } // Data Produk Tidak Ditemukan
      else {
        const dataterupdate = await ScrapDataProduk(data[0]); // Scraping harga Produk di Web
        const status = await UpdateProdukKode(dataterupdate); // Update Data Harga Produk ke DB
        res = {
          caption: `Berhasil Mengupdate data ${data[0].kodebarang}
Harga Produk    : Rp.${data[0].hargaproduk} -> Rp.${dataterupdate.hargaproduk}
Harga Pesaing 1 : Rp.${data[0].pesaing[0].hargapesaing} -> Rp.${dataterupdate.pesaing[0].hargapesaing}
Harga Pesaing 2 : Rp.${data[0].pesaing[1].hargapesaing} -> Rp.${dataterupdate.pesaing[1].hargapesaing}`,
        };
      } // Data Produk Ditemukan
      break;
    case pengguna.pangkat == "member":
    case pengguna.pangkat == "baru":
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini : ${pengguna.pangkat}`,
        nama: pengguna.nama,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Terdapat kesalahan pada pangkat Anda, Segera hubungi Admin`,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
} //Release //Update data harga di DB dari scraping Web

async function UpdateHargaKonveksi(req, res) {
  const pengguna = await TarikPengguna(req.from);
  if (pengguna.length == 0) {
    res = `Maaf anda belum terdaftar,
hubungi admin untuk info lebih lanjut`;
  } else {
    let data = await TarikProdukKonveksi(req.body.replace("!Uk_", "").replace("!UK_", "").replace("!uk_", "").replace("!uK_", ""));
    const datasebelum = await TarikProdukKonveksi(req.body.replace("!Uk_", "").replace("!UK_", "").replace("!uk_", "").replace("!uK_", ""));

    if (data.length == 0) {
      res = `Data dengan kode produk : ${req.body.replace("!Uk_", "").replace("!UK_", "").replace("!uk_", "").replace("!uK_", "")} tidak ditemukan`;
    } else {
      res = {
        caption: `Fitur Ini Belum Tersedia, Silahkan Hubungi admin`,
      };
    }
    console.log(`Membalas ${req.from} dengan pesan : ${res.caption}`);
    return res;
  }
} //MT // Update data harga semua produk di konveksi

module.exports = {
  TidakadaPerintah,
  ping,
  Daftar,
  Terima,
  help,
  CekProduk,
  CekKonveksi,
  UpdateHargaProduk,
  UpdateHargaKonveksi,
}; // Export Fungsi
