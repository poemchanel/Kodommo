const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB

async function CekStatusDB(req, res) {
  const StatusDB = mongoose.connection.readyState; //Ambil status koneksi
  switch (true) {
    case StatusDB == 0: // Status jika Disconected
      res = { state: 0, caption: "Terjadi Kesalahan, DB Tidak Dapat Terhubung" };
      break;
    case StatusDB == 1: // Status jika Connected
      res = { state: 1, caption: "DB Berhasil Terhubung" };
      break;
    case StatusDB == 2: // Status Connecting
      res = { state: 2, caption: "Sedang Menghubungkan ke DB..." };
      break;
    case StatusDB == 3: // Status jika Disconnecting
      res = { state: 3, caption: "Koneksi ke DB Terputus" };
      break;
    default:
      break;
  }
  return res;
} // Cek Status Hubungan Database

module.exports = CekStatusDB; // Export Fungsi
