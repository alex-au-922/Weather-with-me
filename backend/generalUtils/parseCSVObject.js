//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

exports.csvToObject = function csvToObject(
  str,
  headers = null,
  delimiter = ","
) {
  const headerProvided = headers !== null;
  if (!headerProvided) {
    headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  }
  const rows = str
    .slice(str.indexOf("\n") + 1, str.lastIndexOf("\n"))
    .split("\n");

  let arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  return arr;
};
