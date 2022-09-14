const arr = [{ nama: "DOMMO" }, { nama: "MORYMONY" }, { nama: "BELIA" }];
let Pesan = "!Click D0001 MORYMONY Tambah 80gr";
Pesan = Pesan.split(" ");
const index = arr.findIndex((e) => e.nama === Pesan[2]);

delete arr[index].click;
console.log(Pesan);
console.log(index); // 👉️ 1
console.log(arr[index]); // 👉️ 1
