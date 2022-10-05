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
                for (let i = 0; i < produk.length; i++) {
                  res.push({
                    caption: `╭──「 *Detail Produk ${produk[i].kodebarang}* 」
*│Konveksi* : ${produk[i].konveksi}
*│Produk* : ${produk[i].namabarang}
*│Harga Modal* : Rp.${produk[i].hargamodal}
│─────      *Jual*   |  *Selisih*  |  *%* 
*│Daily Price*: Rp.${produk[i].dailyprice} | Rp.${produk[i].dailyprice - produk[i].hargamodal} | ${Math.abs(
                      ((produk[i].dailyprice - produk[i].hargamodal) / produk[i].dailyprice) * 100
                    ).toFixed(1)}%
*│Flash Sale* : Rp.${Math.round(produk[i].dailyprice - (produk[i].dailyprice * 0.5) / 100)} | Rp.${
                      Math.round(produk[i].dailyprice - (produk[i].dailyprice * 0.5) / 100) - produk[i].hargamodal
                    } | ${Math.abs(
                      ((produk[i].dailyprice - (produk[i].dailyprice * 0.5) / 100 - produk[i].hargamodal) /
                        (produk[i].dailyprice - (produk[i].dailyprice * 0.5) / 100)) *
                        100
                    ).toFixed(1)}%
*│Pday/Evn* : Rp.${Math.round(produk[i].hargamodal + (produk[i].hargamodal * 8.5) / 100)} | Rp.${Math.round(
                      produk[i].hargamodal + (produk[i].hargamodal * 8.5) / 100 - produk[i].hargamodal
                    )} | ${Math.abs(
                      ((parseInt(produk[i].hargamodal) + (produk[i].hargamodal * 8.5) / 100 - produk[i].hargamodal) /
                        (parseInt(produk[i].hargamodal) + (produk[i].hargamodal * 8.5) / 100)) *
                        100
                    ).toFixed(1)}%
*│Harga Produk*  : ${(() => {
                      if (produk[i].linkstatus === "aktif") {
                        return `Rp.${produk[i].hargaproduk}`;
                      } else {
                        return `~Rp.${produk[i].hargaproduk}~ *${produk[i].linkstatus}*`;
                      }
                    })()}
│──「 *Pesaing* 」───────
*│${produk[i].pesaing[0].namapesaing}* : ${(() => {
                      if (produk[i].pesaing[0].linkpesaingstatus === "aktif") {
                        return `Rp.${produk[i].pesaing[0].hargapesaing}`;
                      } else {
                        return `~Rp.${produk[i].pesaing[0].hargapesaing}~ *${produk[i].pesaing[0].linkpesaingstatus}*`;
                      }
                    })()}
*│${produk[i].pesaing[1].namapesaing}* : ${(() => {
                      if (produk[i].pesaing[1].linkpesaingstatus === "aktif") {
                        return `Rp.${produk[i].pesaing[1].hargapesaing}`;
                      } else {
                        return `~Rp.${produk[i].pesaing[1].hargapesaing}~ *${produk[i].pesaing[1].linkpesaingstatus}*`;
                      }
                    })()}
│───────────────
*│UpdatedAt* : ${produk[i].updatedAt.getHours()}:${produk[i].updatedAt.getMinutes()} - ${produk[
                      i
                    ].updatedAt.getDate()}/${produk[i].updatedAt.getMonth()}/${produk[i].updatedAt.getFullYear()}
╰───────────────`,
                  });
                }
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
