const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB

async function DBState(Res) {
  Res = mongoose.connection.readyState; //Ambil status koneksi
  // 0 : Status jika Disconected
  // 1 : Status jika Connected
  // 2 : Status Connecting
  // 3 : Status jika Disconnecting

  return Res;
} // Cek Status Hubungan Database

module.exports = DBState; // Export Fungsi
