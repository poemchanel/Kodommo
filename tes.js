const Shopee = [{ nama: "MORYMONY" }, { nama: "BELIA" }, { nama: "DOMMO" }];

first = "DOMMO";
Shopee.sort((x, y) => (x.nama == first ? -1 : y.nama == first ? 1 : 0));

console.log(Shopee);
