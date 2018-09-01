
// Assert methods designed for use with BigNumber objects

var assertEq = (res, exp) => assert.equal(res.valueOf(), exp.valueOf())

var assertNotEq = (res, exp) => assert.notEqual(res.valueOf(), exp.valueOf())

// Verifies that res is not further than 0.000000001% away from exp
var assertAlmostEq = (res, exp) => {
  var diff = res.minus(exp)
  if (diff.isNegative()) {
    diff = diff.times(-1)
  }
  assert.isBelow(parseInt(diff.valueOf()), parseInt(res.dividedBy(100000000000).valueOf()))
}

module.exports = {
  assertEq,
  assertNotEq,
  assertAlmostEq
}
