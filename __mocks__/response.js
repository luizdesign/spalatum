/**
 * Returns a mocked object with the properties below
 * @param  {Number} status [http stauts code]
 * @param  {String} text   [response content]
 * @param  {String} type   [response content-type]
 * @return {Object}
 */
module.exports = (status, text, type) => ({
  status,
  text,
  type,
  ok: () => {},
});
