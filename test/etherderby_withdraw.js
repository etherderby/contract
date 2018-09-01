
import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { eightyPercent } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")

contract('EtherDerby', accounts => {
  it("should support simple withdrawing", async () => {

    var etherDerby = await EtherDerby.deployed()

    var accountBalance = await web3.eth.getBalance(accounts[0])

    var result = await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1 })
    var gasUsed = result.receipt.cumulativeGasUsed
    var newAccountBalance = await web3.eth.getBalance(accounts[0])
    assertEq(accountBalance.minus(newAccountBalance), K.initialPrice.add((gasUsed)))

    accountBalance = newAccountBalance
    result = await etherDerby.withdrawEarnings({ from: accounts[0], gasPrice: 1 })
    gasUsed = result.receipt.cumulativeGasUsed

    newAccountBalance = await web3.eth.getBalance(accounts[0])
    // Round has not yet ended so withdrawing earnings should do nothing
    assertEq(accountBalance.minus(newAccountBalance), gasUsed)


    // Start next round to test withdraw
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1 })

    accountBalance = await web3.eth.getBalance(accounts[0])
    // With round over, withdraw should be successful
    result = await etherDerby.withdrawEarnings({ from: accounts[0], gasPrice: 1 })
    gasUsed = result.receipt.cumulativeGasUsed
    newAccountBalance = await web3.eth.getBalance(accounts[0])

    // Subtract initial price since thats what we get back for winning round 1
    assertEq(accountBalance.minus(newAccountBalance).plus(K.initialPrice), gasUsed)
  })
})

contract('EtherDerby', accounts => {
  it("should not allow double withdraw", async () => {

    var etherDerby = await EtherDerby.deployed()

    // First buy carrots so there will be winnings
    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1 })
    
    // Start next round so winning are withdrawable
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1 })
    
    var accountBalance = await web3.eth.getBalance(accounts[0])
    var result = await etherDerby.withdrawEarnings({ from: accounts[0], gasPrice: 1 })
    var gasUsed = result.receipt.cumulativeGasUsed

    var newAccountBalance = await web3.eth.getBalance(accounts[0])
    // With round over, withdraw should be successful
    // Subtract initial price since thats what we get back for winning round 1
    assertEq(accountBalance.minus(newAccountBalance).plus(K.initialPrice), gasUsed)

    // Try another withdraw and verify that nothing happens
    accountBalance = await web3.eth.getBalance(accounts[0])
    result = await etherDerby.withdrawEarnings({ from: accounts[0], gasPrice: 1 })
    gasUsed = result.receipt.cumulativeGasUsed
    newAccountBalance = await web3.eth.getBalance(accounts[0])
    assertEq(accountBalance.minus(newAccountBalance), gasUsed)

    // Make a purchase to actually start the next round
    await etherDerby.buyCarrots(K.H1, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1 })

    // Try another withdraw and verify that nothing happens
    accountBalance = await web3.eth.getBalance(accounts[0])
    result = await etherDerby.withdrawEarnings({ from: accounts[0], gasPrice: 1 })
    gasUsed = result.receipt.cumulativeGasUsed
    newAccountBalance = await web3.eth.getBalance(accounts[0])
    assertEq(accountBalance.minus(newAccountBalance), gasUsed)

  })
})
