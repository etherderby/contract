
// Random helper methods used for testing

var eightyPercent = num => {
  return num.minus(num.div(10)).minus(num.div(10))
}

var toAscii = hex => {
  return web3.toAscii(hex).replace(/\u0000/g, '')
}

module.exports = {
  eightyPercent,
  toAscii
}
