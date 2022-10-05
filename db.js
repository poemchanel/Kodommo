const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB
const { Produk, Konveksi, Pengguna } = require("./produk"); // Import Format Dokumen

async function HubungkanDatabase(req, res) {
  const DB = "mongodb://localhost:27017/produk"; // Alamat Database lokal
  //const DB ="mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/?retryWrites=true&w=majority"; // Alamat Cloud Database
  mongoose.connect(DB, { useNewUrlParser: true }); //Hubungkan ke Ke Database
  res = await CekDatabaseState(); // Memamanggil funsi untuk cek status Database
  return res;
} // Mengubungkan ke Database
async function CekDatabaseState(req, res) {
  const StatusDB = mongoose.connection.readyState; //Ambil status koneksi
  switch (true) {
    case StatusDB == 0: // Status jika Disconected
      res = "Tidak Terhubung Ke DataBase";
      break;
    case StatusDB == 1: // Status jika Connected
      res = "Terhubung ke DataBase";
      break;
    case StatusDB == 2: // Statis Connecting
      res = "Menghubungkan ke DataBase";
      break;
    case StatusDB == 3: // Status jika Disconnecting
      res = "Terputus Ke DataBase";
      break;
    default:
      break;
  }
  return res;
} // Cek Status Hubungan Database
async function TarikPengguna(req, res) {
  res = await Pengguna.find({
    nomor: req,
  }); // Mengambil data pengguna berdasarkan key nomor
  return res[0];
} // Mengambil data Pengguna
async function TarikProdukKode(req, res) {
  res = await Produk.find({
    kodebarang: req,
  }); // Mengambil data Produk berdasarkan key kodebarang
  return res;
} // Mengambil data Produk
async function TarikProdukKonveksi(req, res) {
  res = await Produk.find({
    konveksi: req,
  }); // Mengambil data Produk berdasarkan key konveksi
  return res;
} // Mengambil data Produk dengan konveksi
async function UpdateProdukKode(req, res) {
  console.log(`Mengupdate Data Produk Ke database`);
  res = await Produk.findOneAndUpdate({ kodebarang: req.kodebarang }, req); // Mencari data Produk dengan key kodebarang lalu update
  res = "Berhasil Diupdate";
  return res;
} // Mengupdate data Produk

module.exports = {
  HubungkanDatabase,
  CekDatabaseState,
  TarikPengguna,
  TarikProdukKode,
  TarikProdukKonveksi,
  UpdateProdukKode,
}; // Export Fungsi
