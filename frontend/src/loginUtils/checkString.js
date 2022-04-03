export default function checkString(string) {
  return Boolean(String(string).match(/(?=.{4,20})/));
}
