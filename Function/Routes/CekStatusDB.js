const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB

async function CekStatusDB(req, res) {
  const StatusDB = mongoose.connection.readyState; //Ambil status koneksi
  switch (true) {
    case StatusDB == 0: // Status jika Disconected
      res = 0;
      break;
    case StatusDB == 1: // Status jika Connected
      res = 1;
      break;
    case StatusDB == 2: // Status Connecting
      res = 2;
      break;
    case StatusDB == 3: // Status jika Disconnecting
      res = 3;
      break;
    default:
      break;
  }
  return res;
} // Cek Status Hubungan Database

module.exports = CekStatusDB; // Export Fungsi
