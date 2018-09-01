
import BigNumber from 'bignumber.js'
import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { eightyPercent } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")



contract('EtherDerby', accounts => {
  it("should allow reinvesting", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H1, 1, '', { value: K.priceOfTwoCarrots, from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.startNextRound({ from: accounts[0] })
    await etherDerby.reinvestInCarrots(K.H1, 2, K.initialPrice, '', { from: accounts[0], gasPrice: 1, gas: 400000 })
    var result = await etherDerby.getPlayerStats({ from: accounts[0] })
    assertEq(result[3], K.initialPrice)// reinvested
  })
})
