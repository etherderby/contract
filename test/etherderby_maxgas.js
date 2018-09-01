
import BigNumber from 'bignumber.js'

import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { eightyPercent } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")

contract('EtherDerby', accounts => {
  it("should provide enough gas for worst case", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Account[0] will start round 2 for the highest possible gas price
    // All horses should have pending eth and carrots at end of round 1
    // Account[0] should have pending eth and carrots at end of round 1
    // Account[0] should have pending referrals for all horses at end of round 1
    // DevAddr should have pending referrals for all horses at end of round 1
    
    // Register name for account 0
    await etherDerby.registerName("account0", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1, gas: 200000 })

    // Purchase for each horse with no referrer (for dev referrals) and from account[0]
    var result = await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })
    console.log("First buy H1 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H2, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("First buy H2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H3, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("First buy H3 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H4, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("First buy H4 gas used: ", result.receipt.gasUsed)
    // Purchase for each horse with account 0 as referrer
    result = await etherDerby.buyCarrots(K.H1, 1, "account0", { value: K.priceOfSecondCarrot, from: accounts[1], gasPrice: 1, gas: 400000 })
    console.log("Second buy H1 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H2, 1, "account0", { value: K.priceOfSecondCarrot, from: accounts[1], gasPrice: 1, gas: 400000 })
    console.log("Second buy H2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H3, 1, "account0", { value: K.priceOfSecondCarrot, from: accounts[1], gasPrice: 1, gas: 400000 })
    console.log("Second buy H3 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H4, 1, "account0", { value: K.priceOfSecondCarrot, from: accounts[1], gasPrice: 1, gas: 400000 })
    console.log("Second buy H4 gas used: ", result.receipt.gasUsed)

    await etherDerby.startNextRound({ from: accounts[1] })

    // Now start round 2 with a purchase
    result = await etherDerby.buyCarrots(K.H1, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("First buy H1 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H2, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H2 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H3, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H3 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H4, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H4 Round 2 gas used: ", result.receipt.gasUsed)

    result = await etherDerby.buyCarrots(K.H1, 2, "", { value: K.priceOfSecondCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H1 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H2, 2, "", { value: K.priceOfSecondCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H2 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H3, 2, "", { value: K.priceOfSecondCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H3 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H4, 2, "", { value: K.priceOfSecondCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H4 Round 2 gas used: ", result.receipt.gasUsed)

    result = await etherDerby.buyCarrots(K.H1, 2, "", { value: K.priceOfThirdCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H1 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H2, 2, "", { value: K.priceOfThirdCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H2 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H3, 2, "", { value: K.priceOfThirdCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H3 Round 2 gas used: ", result.receipt.gasUsed)
    result = await etherDerby.buyCarrots(K.H4, 2, "", { value: K.priceOfThirdCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })
    console.log("Buy H4 Round 2 gas used: ", result.receipt.gasUsed)

    //assertEq(new BigNumber(1), new BigNumber(2))
  })
})
