const mongoose = require("mongoose");
const { Produk, Konveksi } = require("./produk");
const puppeteer = require("puppeteer");

//const DB ="mongodb+srv://poem:Coba1234@cluster0.qmdwcrb.mongodb.net/?retryWrites=true&w=majority";
const DB = "mongodb://localhost:27017/produk";

//Konek Ke Database
mongoose.connect(
  DB,
  () => {
    console.log("Terhubung ke Database");
    Bot();
  },
  (e) => console.error(e)
);

async function CekProdukdiDB(req, res) {
  switch (true) {
    case req.includes("!P_"):
    case req.includes("!p_"):
      try {
        res = await Produk.find({
          kodebarang: req.replace("!P_", "").replace("!p_", ""),
        });

        return res;
      } catch (error) {
        console.log(error.message);
      }
      break;
    case req.includes("!U_"):
    case req.includes("!u_"):
      try {
        res = await Produk.find({
          kodebarang: req.replace("!U_", "").replace("!u_", ""),
        });

        return res;
      } catch (error) {
        console.log(error.message);
      }
      break;
    case req.includes("!k_"):
    case req.includes("!K_"):
      try {
        res = await Produk.find({
          konveksi: req.replace("!k_", "").replace("!K_", ""),
        });
        return res;
      } catch (error) {
        console.log(error.message);
      }
      break;
    default:
      console.log("Terjadi Kesalahan saat mencari data Produk");
      break;
  }
}

async function UpdatedHarga(req, res) {
  let data = await CekProdukdiDB(req);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(data[0].linkproduk);
  await page.waitForSelector("[class='_2Shl1j']");
  let element0 = await page.$("[class='_2Shl1j']");
  let value0 = await page.evaluate((el) => el.textContent, element0);
  data[0].hargaproduk = value0.replace("Rp", "").replace(".", "");

  if (data[0].pesaing[0].hargapesaing != "-") {
    await page.goto(data[0].pesaing[0].linkpesaing);
    await page.waitForSelector("[class='_2Shl1j']");
    let element1 = await page.$("[class='_2Shl1j']");
    let value1 = await page.evaluate((el) => el.textContent, element1);
    data[0].pesaing[0].hargapesaing = value1.replace("Rp", "").replace(".", "");
  }
  if (data[0].pesaing[1].hargapesaing != "-") {
    await page.goto(data[0].pesaing[0].linkpesaing);
    await page.waitForSelector("[class='_2Shl1j']");
    let element2 = await page.$("[class='_2Shl1j']");
    let value2 = await page.evaluate((el) => el.textContent, element2);
    data[0].pesaing[1].hargapesaing = value2.replace("Rp", "").replace(".", "");
  }

  console.log(data);
  data[0].updatedAt = new Date();
  res = await Produk.findOneAndUpdate(data[0].kodebarang, data[0]);

  await browser.close();
  return res;
}

async function Bot() {
  const msg = {
    body: "!U_D1000",
    reply: function (req) {
      console.log(req);
    },
  };

  //const media = MessageMedia.fromFilePath('./Konveksi.PNG')

  console.log("Pesan yang Diterima : ", msg.body);
  if (msg.body.startsWith("!")) {
    switch (true) {
      case msg.body.toLowerCase() === "!help":
        msg.reply(
          `Fitur Perintah yang terdaftar :
!C_<Kode Produk> Cek informasi produk dengan kode tersebut
!P_<Konveksi> Cek semua produk di konveksi tersebut
!L_Konveksi Cek list konveksi yang terdaftar di DB
!Update Update daftar harga semua produk
          `
        );
        break;
      case msg.body.toLowerCase() === "!ping":
        msg.reply("Ping");
        break;
      case msg.body.toLowerCase().startsWith("!u_"):
        data = await UpdatedHarga(msg.body);
        msg.reply("Data Diupdate");
        break;
      case msg.body.toLowerCase().startsWith("!p_"):
        data = await CekProdukdiDB(msg.body);
        if (data.length == 0) {
          msg.reply(
            `Data dengan kode produk : ${msg.body
              .replace("!P_", "")
              .replace("!p_", "")} tidak ditemukan`
          );
        } else {
          msg.reply(
            `informasi Produk ${data[0].kodebarang}
        Konveksi : ${data[0].konveksi}
        Produk : ${data[0].kodebarang} ${data[0].namabarang}
        Harga Modal : Rp.${data[0].hargamodal}
        Daily Price : Rp.${data[0].dailyprice} | Rp.${
              data[0].dailyprice - data[0].hargamodal
            } | ${Math.abs(
              ((data[0].dailyprice - data[0].hargamodal) / data[0].dailyprice) *
                100
            ).toFixed(2)}%
        Flash Sale : Rp.${Math.round(
          data[0].dailyprice - (data[0].dailyprice * 0.5) / 100
        )} | Rp.${
              Math.round(
                data[0].dailyprice - (data[0].dailyprice * 0.5) / 100
              ) - data[0].hargamodal
            } | ${Math.abs(
              ((data[0].dailyprice -
                (data[0].dailyprice * 0.5) / 100 -
                data[0].hargamodal) /
                (data[0].dailyprice - (data[0].dailyprice * 0.5) / 100)) *
                100
            ).toFixed(2)}%
        Payday/Event : Rp.${
          parseInt(data[0].hargamodal) + (data[0].hargamodal * 8.5) / 100
        } | Rp.${
              parseInt(data[0].hargamodal) +
              (data[0].hargamodal * 8.5) / 100 -
              data[0].hargamodal
            } | ${Math.abs(
              ((parseInt(data[0].hargamodal) +
                (data[0].hargamodal * 8.5) / 100 -
                data[0].hargamodal) /
                (parseInt(data[0].hargamodal) +
                  (data[0].hargamodal * 8.5) / 100)) *
                100
            ).toFixed(2)}%
        Harga Produk : Rp.${data[0].hargaproduk}
        Pesaing :${data[0].pesaing.map(
          (a) => " \n\t " + a.namapesaing + " = Rp." + a.hargapesaing + " "
        )}
        Data di Update pada : ${data[0].updatedAt.getHours()}:${data[0].updatedAt.getMinutes()} ${data[0].updatedAt.getDate()}/${data[0].updatedAt.getMonth()}/${data[0].updatedAt.getFullYear()}
                  `
          );
        }
        break;
      case msg.body.toLowerCase() === "!gambar":
        msg.reply(media);
        break;
      default:
        msg.reply("Perintah Tidak Ditemukan");
        break;
    }
  } else {
    console.log("Pesan ini Bukan Perintah");
  }
}

// switch (true) {
//   // Cek Produk berdasarkan Kode Barang
//   case msg.body.includes("!C_"):
//   case msg.body.includes("c_"):
//     CekProduk();
//     async function CekProduk() {
//       try {
//         const produk = await Produk.find({
//           kodebarang: msg.body.replace("!C_", "").replace("!c_", ""),
//         });
//         if (produk == 0) {
//           console.log("Data Tidak Ditemukan");
//         } else {
//           console.log(produk[0].namabarang);
//           produk[0].pesaing.forEach((a) =>
//             console.log(a.namapesaing, a.hargapesaing)
//           );
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     }
//     break;

//   default:
//     console.log("Perintah Tidak Ditemukan");
//     break;
// }

// app();
// async function app() {
//   const produk = await Produk.find({
//     kodebarang: msg.body.replace("!C_", "").replace("!c_", ""),
//   });
//   console.log(produk);
// }

// app();
// async function app() {
//   const produk = new Produk({
//     konveksi: "KBOGOR",
//     kodebarang: "D1000",
//     namabarang: "TOTEBAG ALICE",
//     hargamodal: "4000",
//     dailyprice: "4465",
//     linkproduk:
//       "https://shopee.co.id/-LOKAL-DOMMO-D1000-Totebag-ALICE-BISA-COD-FYG-TAS-TOTE-BAG-TAS-WANITA-DARI-JAKARTA-i.135900627.2053489534?sp_atk=3466b1f5-6e9a-4ceb-984c-f4c2ec64c1d0",
//     hargaproduk: "4599",
//     pesaing: [
//       {
//         namapesaing: "MORY MONY",
//         linkpesaing:
//           "https://shopee.co.id/RR-TOTE-BAG-ALICE-MINI-i.154549401.7301389994?sp_atk=9fcd86ec-c897-4023-9e1c-c2588ad9cf06&xptdk=9fcd86ec-c897-4023-9e1c-c2588ad9cf06",
//         hargapesaing: "4700",
//       },
//       {
//         namapesaing: "REYRESHY",
//         linkpesaing:
//           "https://shopee.co.id/RR-TOTE-BAG-ALICE-MINI-i.154549401.7301389994?sp_atk=6770af19-466e-4abb-ae2c-ae6bbbf16bcb&xptdk=6770af19-466e-4abb-ae2c-ae6bbbf16bcb",
//         hargapesaing: "4700",
//       },
//     ],
//   });
//   produk.save().then(() => console.log("Berhasil"));
// }
