
import { expectThrow } from './helpers/expectThrow'
import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { toAscii } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")

contract('EtherDerby', accounts => {
  it("should let players name horse", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Name should be horse1 initially
    var result = await etherDerby.getStats({ from: accounts[0], gasPrice: 1 })
    assert.equal(toAscii(result[4][0]), "horse1")

    // Naming horse should require any amount of carrots in the beginning
    await etherDerby.nameHorse(K.H1, "vitalik", "", { value: K.initialPrice, from: accounts[0], gasPrice: 1 })
    
    var result = await etherDerby.getStats({ from: accounts[0], gasPrice: 1 })
    assert.equal(toAscii(result[4][0]), "vitalik")

  })
})


contract('EtherDerby', accounts => {
  it("should restrict naming horse to person with most carrots", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Start a new round for every purchase
    // Account[0] sends 10x
    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice.times(10), from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.startNextRound()
    // Account[0] sends 10x
    await etherDerby.buyCarrots(K.H1, 2, "", { value: K.initialPrice.times(10), from: accounts[0], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound()
    // Account[1] sends 10x
    await etherDerby.buyCarrots(K.H1, 3, "", { value: K.initialPrice.times(10), from: accounts[1], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound()
    // Account[1] sends 8x (still has slightly less than account[0])
    await etherDerby.buyCarrots(K.H1, 4, "", { value: K.initialPrice.times(8), from: accounts[1], gasPrice: 1, gas: 400000 })
    
    // Naming should fail if account[2] only sends 1x
    etherDerby.nameHorse(K.H1, "bowser", "", { value: K.initialPrice, from: accounts[1], gasPrice: 1, gas: 400000 })
    var result = await etherDerby.getStats({ from: accounts[0], gasPrice: 1 })
    assert.equal(toAscii(result[4][0]), "horse1")

    // Sending 3x should succeed in naming the horse
    await etherDerby.nameHorse(K.H1, "bowser", "", { value: K.initialPrice.times(3), from: accounts[1], gasPrice: 1, gas: 400000 })
    result = await etherDerby.getStats({ from: accounts[0], gasPrice: 1 })
    assert.equal(toAscii(result[4][0]), "bowser")
  })
})
