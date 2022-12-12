const capitalize = (str) => {
  const capital = (str) => str[0].toUpperCase() + str.slice(1);
  return str
    .toLowerCase()
    .replace(/\s/g, "-")
    .split("-")
    .map(capital)
    .join(" ");
}
 module.exports = capitalize;