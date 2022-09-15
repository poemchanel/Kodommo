const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB

async function DBState(Req, Res) {
  const State = mongoose.connection.readyState; //Ambil status koneksi
  switch (true) {
    case State == 0: // Status jika Disconected
      Res = { state: 0, caption: "Terjadi Kesalahan, DB Tidak Dapat Terhubung" };
      break;
    case State == 1: // Status jika Connected
      Res = { state: 1, caption: "DB Berhasil Terhubung" };
      break;
    case State == 2: // Status Connecting
      Res = { state: 2, caption: "Sedang Menghubungkan ke DB..." };
      break;
    case State == 3: // Status jika Disconnecting
      Res = { state: 3, caption: "Koneksi ke DB Terputus" };
      break;
    default:
      break;
  }
  return Res;
} // Cek Status Hubungan Database

module.exports = DBState; // Export Fungsi
