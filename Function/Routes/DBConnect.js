const mongoose = require("mongoose"); // Import Module untuk manipulasi DataBase MongoDB

function DBConnect() {
  const DB_URI = "mongodb://localhost:27017/kodommo"; // Alamat Database lokal
  // const DB_URI = "mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/kodommo?retryWrites=true&w=majority"; // Alamat Cloud Database

  mongoose.connect(DB_URI, { useNewUrlParser: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
module.exports = DBConnect; // Export Fungsi
