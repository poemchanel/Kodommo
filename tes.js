let updatedAt = new Date(`2022-09-14T10:17:38.116+00:00`);
let DateNow = new Date();
let TimeDifference = Math.abs(DateNow - updatedAt);
TimeDifference = Math.ceil(TimeDifference / (1000 * 60 * 60));

console.log(DateNow);
