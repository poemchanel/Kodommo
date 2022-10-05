const { HubungkanDatabase, TarikProdukKode, CekDatabaseState, TarikProdukKonveksi, TarikPengguna, UpdateProdukKode } = require("./db"); // Import Fungsi yang ada di db.js
const { BuatGambarKonveksi } = require("./MembuatPNG"); // Import Fungsi untuk Merender Gambar
const { ScrapDataProduk } = require("./scraping"); // Import Fungsi untuk Scraping Web

const SuperAdmin = "Duyy - 082246378074"; // Kontak Admin

async function VerifikasiKontak(req, res) {
  console.log(`Jenis Kontak : ${req.from.slice(-5)}`);
  switch (true) {
    case req.from.slice(-5) == "@c.us": // Dari Pengguna
      const kontak = await TarikPengguna(req.from);
      if (kontak.length == 0) {
        res = "Kosong";
      } // Pengguna Tidak terdaftar DB
      else {
        res = kontak.pangkat;
      } // Pengguna Terdaftar di DB
      break;
    case req.from.slice(-5) == "@g.us": // Dari Group
      const group = await TarikPengguna(req.author);
      if (group.length == 0) {
        res = "Kosong";
      } // Kontak Tidak Terdaftar
      else {
        res = group.pangkat;
      } // Kontak Terdaftar
      break;
    default:
      res = "Gagal";
      break;
  } // Cek pesan yang diterima apakah dari grup / pengguna
  console.log(`Status kontak : ${res}`);
  return res;
} //Release // Mengambil data Pangkat Pengirim Pesan
async function TidakadaPerintah(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req); // Mengambil data Pangkat Pengirim Pesan
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal": // Terjadi Kesalahan Saat Mengambil Pangkat
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin": // Kontak Berpangkat superadmin
    case pengguna == "admin": // Kontak Berpangkat admin
    case pengguna == "member": // Kontak Berpangkat member
      res = `Maaf Perintah ini tidak terdaftar, coba
!help untuk melihat perintah yang terdaftar
    `;
      break;
    default: // Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini ${pengguna}`,
      };
      break;
  }
  return res;
} //Release //Perintah Default
async function ping(req, res) {
  res = { caption: "Pong" };
  console.log(`Ke ${req.from} : ${res.caption}`);
  console.log(req); // Print Objek Pesan yang Diterima
  return res;
} //Release //Membalas Pesan Ping
async function help(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req); // Mengambil data Pangkat Pengirim Pesan
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal": // Terjadi Kesalahan Saat Mengambil Pangkat
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong": // Kontak Tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin": // Kontak Berpangkat superadmin
    case pengguna == "admin": // Kontak Berpangkat admin
      res = {
        caption: `Daftar Perintah yang tersedia untuk ${pengguna}:
*!P*_~Kode Produk~ Cek informasi produk dengan kode tersebut
*!K*_~Konveksi~ Cek semua produk di konveksi tersebut
*!L*_~Konveksi~ Cek list konveksi yang terdaftar di DB
*!UP*_~Kode Produk~ Update harga produk dengan kode tersebut`,
      };
      break;
    case pengguna == "member": // Kontak Berpangkat member
      res = {
        caption: `Daftar Perintah yang tersedia :
*!P*_~Kode Produk~ Cek informasi produk dengan kode tersebut
*!K*_~Konveksi~ Cek semua produk di konveksi tersebut
*!L*_~Konveksi~ Cek list konveksi yang terdaftar di DB`,
      };
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini ${pengguna}`,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
} //Release //Menampilkan Daftar Perintah
async function CekProduk(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req); // Mengambil data Pangkat Pengirim Pesan
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal": // Terjadi Kesalahan Saat Mengambil Pangkat
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin": // Kontak Berpangkat superadmin
    case pengguna == "admin": // Kontak Berpangkat admin
    case pengguna == "member": // Kontak Berpangkat member
      const data = await TarikProdukKode(req.body.replace("!p_", "").replace("!P_", "")); //Menambil data produk di DB
      if (data.length == 0) {
        res = { caption: `Data dengan kode produk : ${req.body.replace("!P_", "").replace("!p_", "")} tidak ditemukan` };
      } // Jika Produk tidak Ditemukan
      else {
        res = {
          caption: `informasi Produk ${data[0].kodebarang}
Konveksi : ${data[0].konveksi}
Produk : ${data[0].kodebarang} ${data[0].namabarang}
Harga Modal : Rp.${data[0].hargamodal}
Daily Price : Rp.${data[0].dailyprice} | Rp.${data[0].dailyprice - data[0].hargamodal} | ${Math.abs(((data[0].dailyprice - data[0].hargamodal) / data[0].dailyprice) * 100).toFixed(2)}%
Flash Sale : Rp.${Math.round(data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)} | Rp.${Math.round(data[0].dailyprice - (data[0].dailyprice * 0.5) / 100) - data[0].hargamodal} | ${Math.abs(((data[0].dailyprice - (data[0].dailyprice * 0.5) / 100 - data[0].hargamodal) / (data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)) * 100).toFixed(2)}%
Payday/Event : Rp.${parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100} | Rp.${parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100 - data[0].hargamodal} | ${Math.abs(((parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100 - data[0].hargamodal) / (parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100)) * 100).toFixed(2)}%
Harga Produk : Rp.${data[0].hargaproduk}
Pesaing :${data[0].pesaing.map((a) => " \n\t " + a.namapesaing + " = Rp." + a.hargapesaing + " ")}
Data di Update pada : ${data[0].updatedAt.getHours()}:${data[0].updatedAt.getMinutes()} ${data[0].updatedAt.getDate()}/${data[0].updatedAt.getMonth()}/${data[0].updatedAt.getFullYear()}`,
        };
      } // Jika Produk Ditemukan
      break;
    default: //Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini ${pengguna}`,
      };
      break;
  } // Cek Pangkat Pengirim Pesan
  return res;
} //Release //Menampilkan Produk
async function CekKonveksi(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req); // Mengambil data Pangkat Pengirim Pesan
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal": // Terjadi Kesalahan Saat Mengambil Pangkat
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin": // Kontak Berpangkat superadmin
    case pengguna == "admin": // Kontak Berpangkat admin
    case pengguna == "member": // Kontak Berpangkat member
      const data = await TarikProdukKonveksi(req.body.replace("!k_", "").replace("!K_", "")); // Mengambil data semua produk berkonveksi
      if (data.length == 0) {
        res = {
          status: "Gagal",
          caption: `Data dengan konveksi : ${req.body.replace("!K_", "").replace("!k_", "")} tidak ditemukan`,
        };
      } // Jika data tidak ditemukan
      else {
        const render = await BuatGambarKonveksi(data); // Membuat file Gambar yang Berisi data semua Produk Berkonveksi
        console.log(render);
        res = {
          status: "Berhasil",
          caption: `Daftar Produk di konveksi ${req.body.replace("!K_", "").replace("!k_", "")}`,
        };
      } // Jika data ditemukan
      break;
    default: // Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
- Member
status anda saat ini ${pengguna}`,
      };
      break;
  } //Cek Pangkat Pengirim Pesan
  return res;
} //Release //Menampilkan Produk berdasarkan Konveksi
async function UpdateHargaProduk(req, res) {
  console.log("Mengecek Pengguna di DataBase");
  const pengguna = await VerifikasiKontak(req); // Mengambil data Pangkat Pengirim Pesan
  console.log(`Pangkat Pengirim Pesan : ${pengguna}`);
  switch (true) {
    case pengguna == "Gagal": // Terjadi Kesalahan Saat Mengambil Pangkat
      res = { caption: `Terjadi Kesalahan, Hubungi admin ${SuperAdmin}` };
      break;
    case pengguna == "Kosong": // Kontak tidak Terdaftar di DB
      res = { caption: `Kontak anda belum Terdaftar, Silahkan daftarkan ke admin ${SuperAdmin}` };
      break;
    case pengguna == "superadmin": // Kontak Berpangkat superadmin
    case pengguna == "admin": // Kontak Berpangkat admin
      console.log("Verifikasi Produk");
      let data = await TarikProdukKode(req.body.replace("!Up_", "").replace("!UP_", "").replace("!up_", "").replace("!uP_", "")); // Mengambil data Produk
      if (data.length == 0) {
        console.log("Data Produk Tidak ditemukan");
        res = `Data dengan kode produk : ${req.body.replace("!Up_", "").replace("!UP_", "").replace("!up_", "").replace("!uP_", "")} tidak ditemukan`;
      } // Data Produk Tidak Ditemukan
      else {
        console.log(data);
        const dataterupdate = await ScrapDataProduk(data[0]); // Scraping harga Produk di Web
        const status = await UpdateProdukKode(dataterupdate); // Update Data Harga Produk ke DB
        console.log(`${status}
        Harga Produk : Rp.${data[0].hargaproduk} => Rp.${dataterupdate.hargaproduk}
        Harga Pesaing 1 : Rp.${data[0].pesaing[0].hargapesaing} => Rp.${dataterupdate.pesaing[0].hargapesaing}
        Harga Pesaing 2 : Rp.${data[0].pesaing[1].hargapesaing} => Rp.${dataterupdate.pesaing[1].hargapesaing}
        `);
        res = {
          caption: status,
        };
      } // Data Produk Ditemukan
      break;
    default: // Kontak Tidak Memiliki Pangkat
      res = {
        caption: `Maaf perintah ini hanya dapat diakses oleh pengguna dengan status :
- Admin
status anda saat ini ${pengguna}`,
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
  help,
  CekProduk,
  CekKonveksi,
  UpdateHargaProduk,
  UpdateHargaKonveksi,
}; // Export Fungsi
