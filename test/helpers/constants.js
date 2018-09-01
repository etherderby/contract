
// Constants

import BigNumber from 'bignumber.js'

// Horse Identifiers
var H1 = 1
var H2 = 2
var H3 = 3
var H4 = 4

// Carrot Prices
var oneCarrot = new BigNumber(1000000000000000000)
var initialPrice = new BigNumber(100000000000000)
var priceIncrement = new BigNumber(31415926536)

var priceOfSecondCarrot = initialPrice.plus(priceIncrement)
var priceOfThirdCarrot = initialPrice.plus(priceIncrement.times(2))
var priceOfTwoCarrots = (initialPrice.times(2)).plus(priceIncrement)
var priceOfThreeCarrots = (initialPrice.times(3)).plus(priceIncrement.times(2)).plus(priceIncrement)

var nameRegistrationPrice = 20000000000000000

module.exports = {
  H1,
  H2,
  H3,
  H4,
  oneCarrot,
  initialPrice,
  priceIncrement,
  priceOfSecondCarrot,
  priceOfThirdCarrot,
  priceOfTwoCarrots,
  priceOfThreeCarrots,
  nameRegistrationPrice
}
