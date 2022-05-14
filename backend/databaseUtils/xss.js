const xss = require("xss");
const objectXss = (object) => {
  return Object.keys(object).reduce(
    (obj, key) => ((obj[key] = xss(object[key])), obj),
    {}
  );
};

module.exports = objectXss;
