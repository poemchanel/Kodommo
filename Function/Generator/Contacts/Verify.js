const FindContact = require("../../Routes/Contacts/Find");

async function Verify(Number, Res) {
  const Contact = await FindContact(Number);
  if (Contact.length == 0) {
    Res = "Kosong";
  } else {
    Res = Contact[0].pangkat;
  }
  return Res;
} //Release // Mengambil data Pangkat Pengirim Pesan

module.exports = Verify;
