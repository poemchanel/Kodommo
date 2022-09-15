const VerifikasiKontak = require("../../VerifikasiKontak");
const CekStatusDB = require("../Routes/CekStatusDB");
const TarikProduk = require("../../Routes/TarikProduk");

async function Link(pesan, kontak, res) {
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
            let produk;
            if (tmp[i].toLowerCase() !== "!link") {
              if (tmp[i].includes("_") === true) {
                let tmp1 = tmp[i].split("_");
                produk = await TarikProduk(tmp1[0].toUpperCase());
                if (produk.length !== 0) {
                  if (produk[tmp1[1] - 1] !== undefined) {
                    let shopee = produk[tmp1[1] - 1].shopee;
                    if (shopee.length !== undefined || 0) {
                      let cap = [];
                      for (let s = 0; s < shopee.length; s++) {
                        cap.push(`│${shopee[s].nama}\n│${shopee[s].link}`);
                      }
                      res.push({
                        caption: `╭──「 *Link Produk* 」
│Produk ${tmp1[0]} No ${tmp1[1]}
${cap.join(`\n\r`)}
╰───────────────`,
                      });
                    } else {
                      res.push({
                        caption: `╭──「 *Link Produk* 」
│Produk ${tmp1[0]} No ${tmp[1]}
│Tidak Memiliki Link
╰───────────────`,
                      });
                    }
                  } else {
                    res.push({
                      caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│nomor ${tmp1[1]} di kode : ${tmp1[0]}
╰───────────────`,
                    });
                  }
                } else {
                  res.push({
                    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│nomor${tmp1[1]} dengan kode : ${tmp1[0]}
╰───────────────`,
                  });
                }
              } else {
                produk = await TarikProduk(tmp[i].toUpperCase());
                if (produk.length !== 0) {
                  if (produk.length > 1) {
                    let j = 1;
                    res.push({
                      caption: `╭──「 *Perintah Berhasil* 」
│Ditemukan lebih dari 1 produk
│dengan kode ${tmp[i].toUpperCase()}
│gunakan perintah 
│!produk ${tmp[i].toUpperCase()}_<Noproduk>
│untuk melihat detail produk
│contoh  : !produk ${tmp[i].toUpperCase()}_2
│──「 *List Nomor Produk ${tmp[i].toUpperCase()}* 」─${produk.map(
                        (e) => `\n│ ${j++}: ${e.konveksi}-${e.namabarang.substring(0, 12)}...`
                      )}
╰───────────────`,
                    });
                  } else {
                    let shopee = produk[0].shopee;
                    if (shopee.length !== undefined || 0) {
                      let cap = [];
                      for (let s = 0; s < shopee.length; s++) {
                        cap.push(`│${shopee[s].nama}\n${shopee[s].link}`);
                      }
                      res.push({
                        caption: `╭──「 *Link Produk* 」
│Produk ${tmp[i].toUpperCase()}
${cap.join(`\n\r`)}
╰───────────────`,
                      });
                    } else {
                      res.push({
                        caption: `╭──「 *Link Produk* 」
│Produk ${tmp[i].toUpperCase()}
│Tidak Memiliki Link
╰───────────────`,
                      });
                    }
                  }
                } else {
                  res.push({
                    caption: `╭──「 *Perintah Gagal* 」
│Tidak dapat menemukan produk
│dengan kode : ${tmp[i].toUpperCase()}
╰───────────────`,
                  });
                }
              }
            }
          }
        } else {
          res.push({
            caption: `╭──「 *Perintah Gagal* 」
│Harap masukan kode produk
│setelah perintah !link
│Contoh: 
│!link D1008 D1200 ...
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

module.exports = Link;
