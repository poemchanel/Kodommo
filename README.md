**#BOT KODOMMO**
adalah whatsapp bot

##ChangeLog

###2.3.1 - 10/6 Testing + Minor Fix

- Import Docs ✓
- Ping ✓
- !Daftar ✓
- !Terima ✓
- !Pangkat ✓
- !Help ✓
- !List ✓
- !Konveksi ✓
- !Produk ✓
- !Link ✓
- !Kategori✓
- !Undercut✓
- !Update ✓
- !Auto ✓

###2.3.0 - 10/5

- Function / Database / Models / Product
  - +field diupdate : Date Updated
  - !field click to kategori : Product Kategori
- Function / Database / ImportDoc
  - fix import to follow new Product Models
- Function / Generator / Updates / Auto
  - Change imported file name and function name
- Function / Generator / Updates / Click
  - Change Filename to Option
  - Change Updated Field from Click to Kategori
- Function / Generator / Updates / Update
  - Change imported file name and function name
  - Change Function Name
- Function / Render / KonveksiPDF
  - Change theme color and text view
  - Fix render to follow new Product Models
- Function / Render / Product
  - Fix render to follow new Product Models
- Function / Render / UndercutPDF
  - Change theme color and text view
  - Fix render to follow new Product Models
- Function / Update / PriceKonveksi
  - Change Function Name
  - Split scraping function
- Function / Update / PriceProduct
  - Change Function Name
  - Split scraping function
- Function / Update / PriceProducts
  - Change Function Name
  - Split scraping function
- Function / Update / Scraping
  - Using new scraping method
- Index.js
  - Change imported and function name
  - Add notify when updated product was undercuted

###1.0.0 Release Pog :)

###0.3.4 - 20/9 Testing

- Testing
  - !ping ✓
  - !Daftar ✓
  - !Terima✓
  - !Pangkat ✓
  - !Help ✓
  - !List ✓
  - !Konveksi ✓
  - !Produk ✓
  - !Link ✓
  - !Undercut ✓
  - !Update
  - !Auto
  - !Click
- Fix
  - CLI text

###0.3.3 - 20/9 Refactor

- Fix
  - CLI text
- Refactor Folder and file directory
  - Index
  - Function / Generator / Products / Update
    - Click

###0.3.2 - 19/9 Refactor

- Fix
  - CLI text
- Refactor Folder and file directory
  - Index
  - Function / Generator / Products /
    - Link
    - Product
    - List
    - Undercut
    - /Update/
      - !Auto
      - !Update

###0.3.1 - 18/9 Refactor

- Refactor Folder and file directory
  - Index
  - Function / Database
  - Function / Routes
  - Function / Generator /
    - Contact
    - Help
    - Ping
    - Products / Konveksi

###0.3.0 - 17/9 Refactor

- Refactor Folder and file directory

###0.2.3 - 16/9 Stable Release

- Fix
  - !Undercut Render

###0.2.2 - 15/9

- Fix
  - !Update konveksi looping berhenti
  - !Auto Update

###0.2.1 - 14/9

- Add
  - !List Menampilkan daftar konveksi
  - !Click Menambahkan Click label untuk pupeteer
    - !click Tambah
    - !click Hapus
  - !Link Menampilkan Link Produk
  - !Pangkat Mengubah pangkat pengguna
    - !pangkat promote/admin ubah pangkat ke admin
    - !pangkat demote/me mber ubah pangkat ke member
    - !pangkat hapus/ban/kick hapus pengguna
- Fix
  - !Undercut untuk support schema db baru
  - !Update produk kode lebih dari 1

###0.2.0 - 13/9

- Refactor Bot & DB agar support kode barang yang sama
- DB Schema baru agar suport puppetter button click
- !Auto telah support klik varian/akuran/warna etc..
- Fix
  - !Produk untuk support schema db baru
  - !Konveksi untuk support schema db baru

###0.1.3 - 12/9

- Last Commit before Rescaling 0.2.x
- Fix
  - Double Produk Kode

###0.1.2 - 11/9

- Fix
  - Tampilan Text reply
  - Double instance puppeteer
  - Log view format
- Menambahkan Fungsi Bot
  - Kirim informsi saat Auto update selesai
  - Kirim informasi saat Update Konveksi selesai

###0.1.1 - 10/9

- Fix
  - Warna Text di table !konveksi dan !undercut
- Menambahkan/Mengoptimalisasi Fungsi Bot
  - Perintah !Auto on, cek, off, log
  - Perintah !Update !Scrap `<KodeProduk>`
  - Perintah !Update !Scrap `<Konveksi>`

###0.1.0 - 9/9

- Pre-release Bot :)
- Menambahkan/Mengoptimalisasi Fungsi Bot
  - Perintah !Produk
  - Perintah !Konveksi
  - Perintah !Undercut
  - Perintah !Scrap & !Update

###0.0.9 - 8/9

- Menambahkan/Mengoptimalisasi Fungsi Bot
  - Perintah !Daftar
  - Perintah !Terima

###0.0.8 - 7/9

- Refactor Web Scraping Memudahkan Mengembangkan Fungsi Bot
  - Perintah !Ping Ditambahkan
  - Perintah !Help Ditambahkan
- Menambahkan Fungsi ImportDocument ke DataBase
- Optimalisasi Objeck di DB
- Menambahkan Fungsi WebScraping&UpdateHarga Semua Produk

###0.0.7 - 28/8

- Optimalisasi Cek Konveksi , media .png -> pdf karena file terkompress
- Menambahkan fitur Cek Konveksi Undercut

###0.0.6 - 27/8

- Menambahkan Fitur Mendaftarkan Pengguna
- Menambahkan Fitur Update Pangkat Pengguna
- Optimalisasi Fitur Verifikasi Kontak

###0.0.5

- Refactor Bot Agar Memudahkan Mengembangkan Fungsi Bot
- Menambahkan Fitur Verifikasi Kontak

###0.0.4

- Menambahkan Fitur Web Scraping

###0.0.3

- Menambahkan Fitur membuat gambar
- Menambahkan Fitur Cek Konveksi
- Menambahkan Fitur Help

###0.0.2

- Menghubungkan ke DB
- Menambahkan Fitur Cek Produk di DB
- Menambahkan Fitur Update Produk di DB

###0.0.1

- Membuat WhatsApp Bot
- Menambahkan Fitur !ping reply
- Menambahkan Fitur !ping
