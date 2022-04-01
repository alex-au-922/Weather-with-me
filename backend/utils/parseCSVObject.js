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
