const mongoose = require("mongoose");
const Produk = require("./produk");

//Konek Ke Database
//const DB ="mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/?retryWrites=true&w=majority";
const DB = "mongodb://localhost:27017/produk";

//Konek Ke Database
mongoose.connect(
  DB,
  () => {
    console.log("Terhubung ke Database");
  },
  (e) => console.error(e)
);

// App();
// async function App() {
//   try {
//     const produk = await Produk.find({ kelasproduk: "KBOGOR" });
//     produk.forEach((data) => {
//       console.log(data.namabarang);
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// }

//WhatsApp Bot
const {
  Client,
  Location,
  List,
  Buttons,
  LocalAuth,
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message", async (msg) => {
  console.log("Pesan Diterima", msg);
  switch (true) {
    case msg.body.includes("!C_"):
    case msg.body.includes("!c_"):
      CekProduk();
      async function CekProduk() {
        try {
          const produk = await Produk.find({
            kodebarang: msg.body.replace("!C_", "").replace("!c_", ""),
          });

          if (produk == 0) {
            client.sendMessage("Data Tidak Ditemukan");
          } else {
            client.sendMessage(
              msg.from,
              `
Konveksi :  ${produk[0].konveksi}
Nama Produk : ${produk[0].kodebarang} ${produk[0].namabarang}
Harga Modal : ${produk[0].hargamodal}
Harga Jual : ${produk[0].hargaproduk}
Pesaing : ${pesaing}
`
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      break;

    default:
      client.sendMessage("Perintah Tidak Ditemukan");
      break;
  }
});

client.on("change_state", (state) => {
  console.log("CHANGE STATE", state);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
