const VerifikasiKontak = require("../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduk = require("../Routes/TarikProduk");

async function Produk(pesan, kontak, res) {
  res = [];
  const StatusDB = await CekStatusDB();
  if (StatusDB.state === 1) {
    const pengguna = await VerifikasiKontak(kontak);
    switch (pengguna.pangkat) {
      case "superadmin":
      case "admin":
      case "member": // Kontak Berpangkat member
        let tmp = pesan.body.split(" ").filter((e) => e !== "");
        if (tmp.length !== 1) {
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].toLowerCase() !== "!produk") {
              let produk = await TarikProduk(tmp[i].toUpperCase());
              if (produk.length !== 0) {
                res.push({
                  caption: `╭──「 *Detail Produk ${produk[0].kodebarang}* 」
*│Konveksi* : ${produk[0].konveksi}
*│Produk* : ${produk[0].namabarang}
*│Harga Modal* : Rp.${produk[0].hargamodal}
│─────      *Jual*   |  *Selisih*  |  *%* 
*│Daily Price*: Rp.${produk[0].dailyprice} | Rp.${produk[0].dailyprice - produk[0].hargamodal} | ${Math.abs(
                    ((produk[0].dailyprice - produk[0].hargamodal) / produk[0].dailyprice) * 100
                  ).toFixed(1)}%
*│Flash Sale* : Rp.${Math.round(produk[0].dailyprice - (produk[0].dailyprice * 0.5) / 100)} | Rp.${
                    Math.round(produk[0].dailyprice - (produk[0].dailyprice * 0.5) / 100) - produk[0].hargamodal
                  } | ${Math.abs(
                    ((produk[0].dailyprice - (produk[0].dailyprice * 0.5) / 100 - produk[0].hargamodal) /
                      (produk[0].dailyprice - (produk[0].dailyprice * 0.5) / 100)) *
                      100
                  ).toFixed(1)}%
*│Pday/Evn* : Rp.${Math.round(produk[0].hargamodal + (produk[0].hargamodal * 8.5) / 100)} | Rp.${Math.round(
                    produk[0].hargamodal + (produk[0].hargamodal * 8.5) / 100 - produk[0].hargamodal
                  )} | ${Math.abs(
                    ((parseInt(produk[0].hargamodal) + (produk[0].hargamodal * 8.5) / 100 - produk[0].hargamodal) /
                      (parseInt(produk[0].hargamodal) + (produk[0].hargamodal * 8.5) / 100)) *
                      100
                  ).toFixed(1)}%
*│Harga Produk*  : ${(() => {
                    if (produk[0].linkstatus === "aktif") {
                      return `Rp.${produk[0].hargaproduk}`;
                    } else {
                      return `~Rp.${produk[0].hargaproduk}~ *${produk[0].linkstatus}*`;
                    }
                  })()}
│──「 *Pesaing* 」───────
*│${produk[0].pesaing[0].namapesaing}* : ${(() => {
                    if (produk[0].pesaing[0].linkpesaingstatus === "aktif") {
                      return `Rp.${produk[0].pesaing[0].hargapesaing}`;
                    } else {
                      return `~Rp.${produk[0].pesaing[0].hargapesaing}~ *${produk[0].pesaing[0].linkpesaingstatus}*`;
                    }
                  })()}
*│${produk[0].pesaing[1].namapesaing}* : ${(() => {
                    if (produk[0].pesaing[1].linkpesaingstatus === "aktif") {
                      return `Rp.${produk[0].pesaing[1].hargapesaing}`;
                    } else {
                      return `~Rp.${produk[0].pesaing[1].hargapesaing}~ *${produk[0].pesaing[1].linkpesaingstatus}*`;
                    }
                  })()}
│───────────────
*│UpdatedAt* : ${produk[0].updatedAt.getHours()}:${produk[0].updatedAt.getMinutes()} - ${produk[0].updatedAt.getDate()}/${produk[0].updatedAt.getMonth()}/${produk[0].updatedAt.getFullYear()}
╰───────────────`,
                });
              } else {
                res.push({
                  caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│dengan kode : ${tmp[i]}
╰───────────────`,
                });
              }
            }
          }
        } else {
          res.push({
            caption: `╭──「 *Perintah Gagal* 」
│Harap masukan kode produk
│setelah perintah !produk
│Contoh: 
│!Produk D1008 D1200 ...
╰───────────────`,
          });
        }
        break;
      case "Kosong":
        res.push({
          caption: `╭──「 *Perintah Ditolak* 」
│Anda belum Terdaftar, Silahkan
│mendaftar dengan !daftar
╰───────────────`,
        });
        break;
      default: //Kontak Tidak Memiliki Pangkat
        res.push({
          caption: `╭──「 *Perintah Ditolak* 」
│Perintah ini hanya dapat 
│diakses oleh :
│• *Admin*
│• *Member*
│───────────────
│Status anda saat ini : ${pengguna.pangkat}
╰───────────────`,
        });
        break;
    } // Cek Pangkat Pengirim Pesan
  } else {
    res.push({
      caption: `╭──「 *Maintenence* 」
│Mohon Maaf @${kontak.number}, :)
│Saat ini Bot sedang dalam
│Maintenence...
╰───────────────`,
    });
  }
  return res;
}

module.exports = Produk;
