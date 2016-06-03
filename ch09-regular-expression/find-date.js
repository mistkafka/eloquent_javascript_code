function findDate(str) {
  let dateReg = /(\d{1,2})-(\d{1,2})-(\d{4})/;
  let match = dateReg.exec(str);

  console.log(match[1]);

  return new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]) + 1
  );
}

console.log(findDate('30-5-2017'));
console.log(new Date());
