
import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { eightyPercent } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")

contract('EtherDerby', accounts => {
  it("should have initial values of 0", async () => {

    var etherDerby = await EtherDerby.deployed()

    // All values should be 0 in the beginning (except for round end time)
    var roundStats = await etherDerby.getRoundStats()

    assertEq(roundStats[0], 0)
    assertNotEq(roundStats[1], 0)
    assertEq(roundStats[2], 0)
    assertEq(roundStats[3][0], 0)
    assertEq(roundStats[3][1], 0)
    assertEq(roundStats[3][2], 0)
    assertEq(roundStats[3][3], 0)
    assertEq(roundStats[4][0], 0)
    assertEq(roundStats[4][1], 0)
    assertEq(roundStats[4][2], 0)
    assertEq(roundStats[4][3], 0)
    assertEq(roundStats[5][0], 0)
    assertEq(roundStats[5][1], 0)
    assertEq(roundStats[5][2], 0)
    assertEq(roundStats[5][3], 0)
    assertEq(roundStats[6][0], 0)
    assertEq(roundStats[6][1], 0)
    assertEq(roundStats[6][2], 0)
    assertEq(roundStats[6][3], 0)

    var playerStats = await etherDerby.getPlayerStats()
    assertEq(playerStats[0], 0)
    assertEq(playerStats[1], 0)
    assertEq(playerStats[2], 0)
    assertEq(playerStats[3], 0)
    assertEq(playerStats[4], 0)

    var stats = await etherDerby.getStats()
    assertEq(stats[0][0], 0)
    assertEq(stats[0][1], 0)
    assertEq(stats[0][2], 0)
    assertEq(stats[0][3], 0)
    assertEq(stats[1][0], 0)
    assertEq(stats[1][1], 0)
    assertEq(stats[1][2], 0)
    assertEq(stats[1][3], 0)
    assertEq(stats[2][0], 0)
    assertEq(stats[2][1], 0)
    assertEq(stats[2][2], 0)
    assertEq(stats[2][3], 0)
    assertEq(stats[3][0], 0)
    assertEq(stats[3][1], 0)
    assertEq(stats[3][2], 0)
    assertEq(stats[3][3], 0)
  })
})

contract('EtherDerby', accounts => {
  it("should have correct initial carrot prices", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Price of ONE carrot at the start (for each horse)
    var result = await etherDerby.getPriceOfXCarrots(K.H1, 1)
    assertEq(result, K.initialPrice)
    result = await etherDerby.getPriceOfXCarrots(K.H2, 1)
    assertEq(result, K.initialPrice)
    result = await etherDerby.getPriceOfXCarrots(K.H3, 1)
    assertEq(result, K.initialPrice)
    result = await etherDerby.getPriceOfXCarrots(K.H4, 1)
    assertEq(result, K.initialPrice)

    // Price of TWO carrots at the start
    result = await etherDerby.getPriceOfXCarrots(K.H1, 2)
    assertEq(result, K.priceOfTwoCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H2, 2)
    assertEq(result, K.priceOfTwoCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H3, 2)
    assertEq(result, K.priceOfTwoCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H4, 2)
    assertEq(result, K.priceOfTwoCarrots)

    // Price of THREE carrots at the start
    result = await etherDerby.getPriceOfXCarrots(K.H1, 3)
    assertEq(result, K.priceOfThreeCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H2, 3)
    assertEq(result, K.priceOfThreeCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H3, 3)
    assertEq(result, K.priceOfThreeCarrots)
    result = await etherDerby.getPriceOfXCarrots(K.H4, 3)
    assertEq(result, K.priceOfThreeCarrots)
  })
})

contract('EtherDerby', accounts => {
  it("should reflect buying carrots in stats", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })

    var result = await etherDerby.getRoundStats({ from: accounts[0]})
    assertEq(result[0], 1)
    assertEq(result[2], K.H1)
    // Only K.H1 should have the eth from above purchase
    assertEq(result[3][0], K.initialPrice)
    assertEq(result[3][1], 0)
    assertEq(result[3][2], 0)
    assertEq(result[3][3], 0)
    // Only K.H1 should have the carrots from above
    assertEq(result[4][0], K.oneCarrot)
    assertEq(result[4][1], 0)
    assertEq(result[4][2], 0)
    assertEq(result[4][3], 0)
    assertEq(result[5][0], K.initialPrice)
    assertEq(result[5][1], 0)
    assertEq(result[5][2], 0)
    assertEq(result[5][3], 0)
    assertEq(result[6][0], K.oneCarrot)
    assertEq(result[6][1], 0)
    assertEq(result[6][2], 0)
    assertEq(result[6][3], 0)

    result = await etherDerby.getRoundStats({ from: accounts[1]})
    // Repeat checks from above except player data should be empty since accounts[1]
    // has not yet played
    assertEq(result[0], 1)
    assertEq(result[3][0], K.initialPrice)
    assertEq(result[3][1], 0)
    assertEq(result[3][2], 0)
    assertEq(result[3][3], 0)
    assertEq(result[4][0], K.oneCarrot)
    assertEq(result[4][1], 0)
    assertEq(result[4][2], 0)
    assertEq(result[4][3], 0)
    assertEq(result[5][0], 0)
    assertEq(result[5][1], 0)
    assertEq(result[5][2], 0)
    assertEq(result[5][3], 0)
    assertEq(result[6][0], 0)
    assertEq(result[6][1], 0)
    assertEq(result[6][2], 0)
    assertEq(result[6][3], 0)
      
    // Test player stats after purchase, before round ends
    result = await etherDerby.getPlayerStats({ from: accounts[0] })
    // All values zero since round hasn't ended
    assertEq(result[0], 0)// winnings
    assertEq(result[1], 0)// dividends
    assertEq(result[2], 0)// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

      // Test stats after purchase, before round ends
    result = await etherDerby.getStats({ from: accounts[0] })
    // Total eth for each horse
    assertEq(result[0][0], K.initialPrice)
    assertEq(result[0][1], 0)
    assertEq(result[0][2], 0)
    assertEq(result[0][3], 0)
    // Total carrots for each horse
    assertEq(result[1][0], K.oneCarrot)
    assertEq(result[1][1], 0)
    assertEq(result[1][2], 0)
    assertEq(result[1][3], 0)
    // Player totals
    assertEq(result[2][0], K.initialPrice)
    assertEq(result[2][1], 0)
    assertEq(result[2][2], 0)
    assertEq(result[2][3], 0)
    assertEq(result[3][0], K.oneCarrot)
    assertEq(result[3][1], 0)
    assertEq(result[3][2], 0)
    assertEq(result[3][3], 0)

    await etherDerby.startNextRound({ from: accounts[0] })
    
    // Test player stats now that round has ended
    result = await etherDerby.getPlayerStats({ from: accounts[0] })
    assertEq(result[0], K.initialPrice)// winnings
    assertEq(result[1], 0)// dividends
    assertEq(result[2], 0)// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

    // Test stats now that round has ended
    result = await etherDerby.getStats({ from: accounts[0] })
    // Same as above since totals don't depend on round ending
    assertEq(result[0][0], K.initialPrice)
    assertEq(result[0][1], 0)
    assertEq(result[0][2], 0)
    assertEq(result[0][3], 0)
    assertEq(result[1][0], K.oneCarrot)
    assertEq(result[1][1], 0)
    assertEq(result[1][2], 0)
    assertEq(result[1][3], 0)
    assertEq(result[2][0], K.initialPrice)
    assertEq(result[2][1], 0)
    assertEq(result[2][2], 0)
    assertEq(result[2][3], 0)
    assertEq(result[3][0], K.oneCarrot)
    assertEq(result[3][1], 0)
    assertEq(result[3][2], 0)
    assertEq(result[3][3], 0)
  })
})

contract('EtherDerby', accounts => {
  it("should increase price after carrots are purchased", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })    

    var result = await etherDerby.getPriceOfXCarrots(K.H1, 1)
    assertEq(result, K.priceOfSecondCarrot)

    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.priceOfSecondCarrot, from: accounts[0], gasPrice: 1, gas: 400000 })    

    result = await etherDerby.getPriceOfXCarrots(K.H1, 1)
    assertEq(result, K.priceOfThirdCarrot)
  })
})

contract('EtherDerby', accounts => {
  it("should reward winnings and dividends correctly", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.registerName("hunter2", { from: accounts[1], value: K.nameRegistrationPrice, gasPrice: 1, gas: 500000 })

    await etherDerby.buyCarrots(K.H1, 1, "hunter2", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })
    
    await etherDerby.buyCarrots(K.H2, 1, "hunter2", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    
    var result = await etherDerby.getRoundStats({ from: accounts[0] })
    assertEq(result[0], 1)
    assertEq(result[2], K.H1)
    assertEq(result[3][0], K.initialPrice)
    assertEq(result[3][1], K.initialPrice)
    assertEq(result[3][2], 0)
    assertEq(result[3][3], 0)
    assertEq(result[4][0], K.oneCarrot)
    assertEq(result[4][1], K.oneCarrot)
    assertEq(result[4][2], 0)
    assertEq(result[4][3], 0)
    assertEq(result[5][0], K.initialPrice)
    assertEq(result[5][1], K.initialPrice)
    assertEq(result[5][2], 0)
    assertEq(result[5][3], 0)
    assertEq(result[6][0], K.oneCarrot)
    assertEq(result[6][1], K.oneCarrot)
    assertEq(result[6][2], 0)
    assertEq(result[6][3], 0)

    await etherDerby.startNextRound({ from: accounts[0] })

    // Now player stats should reflect their purchase since
    // the round is "over".
    result = await etherDerby.getPlayerStats({ from: accounts[0] })
    // Winnings are full amount towards K.H1 and 80% of amount towards K.H2
    var winnings = K.initialPrice.add(eightyPercent(K.initialPrice))
    assertEq(result[0], winnings)// winnings
    // Dividends should be 10%
    assertAlmostEq(result[1], K.initialPrice.div(10))// dividends
    assertEq(result[2], 0)// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

    // Account[1] was referrer (9%)
    result = await etherDerby.getPlayerStats({ from: accounts[1] })
    assertEq(result[0], 0)// winnings
    assertEq(result[1], 0)// dividends
    assertEq(result[2], K.initialPrice.times(9).div(100))// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

    // dev address
    result = await etherDerby.getPlayerStats({ from: '0xC17A40cB38598520bd7C0D5BFF97D441A810a008' })
    assertEq(result[0], 0)// winnings
    assertEq(result[1], 0)// dividends
    // 1 percent to devs plus registration fee
    assertEq(result[2], K.initialPrice.div(100).add(K.nameRegistrationPrice))// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn
  })
})

contract('EtherDerby', accounts => {
  it("should handle dividends and winnings correctly with multiple carrots purchased", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H3, 1, "", { value: K.priceOfTwoCarrots, from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.buyCarrots(K.H4, 1, "", { value: K.priceOfTwoCarrots, from: accounts[1], gasPrice: 1, gas: 400000 })

    var result = await etherDerby.getRoundStats({ from: accounts[1]})
    assertEq(result[0], 1)
    assertEq(result[2], K.H3)
    assertEq(result[3][0], 0)
    assertEq(result[3][1], 0)
    assertEq(result[3][2], K.priceOfTwoCarrots)
    assertEq(result[3][3], K.priceOfTwoCarrots)
    assertEq(result[4][0], 0)
    assertEq(result[4][1], 0)
    assertEq(result[4][2], (K.oneCarrot.times(2)))
    assertEq(result[4][3], (K.oneCarrot.times(2)))
    assertEq(result[5][0], 0)
    assertEq(result[5][1], 0)
    assertEq(result[5][2], 0)
    assertEq(result[5][3], K.priceOfTwoCarrots)
    assertEq(result[6][0], 0)
    assertEq(result[6][1], 0)
    assertEq(result[6][2], 0)
    assertEq(result[6][3], (K.oneCarrot.times(2)))

    await etherDerby.startNextRound({ from: accounts[0] })

    // Now player stats should reflect their purchase since
    // the round is "over".
    result = await etherDerby.getPlayerStats({ from: accounts[0] })
    // Winnings are full amount towards K.H1 and 80% of amount towards K.H2
    var winnings = K.priceOfTwoCarrots.add(eightyPercent(K.priceOfTwoCarrots))
    assertAlmostEq(result[0], winnings)// winnings
    // Dividends should be 10% by both accounts
    assertAlmostEq(result[1], K.priceOfTwoCarrots.div(10).div(2))// dividends
    assertEq(result[2], 0)// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

    // Winnings for second account will be zero
    result = await etherDerby.getPlayerStats({ from: accounts[1] })
    assertEq(result[0], 0)// winnings
    // Dividends should be 10% split by both accounts
    assertAlmostEq(result[1], K.priceOfTwoCarrots.div(10).div(2))// dividends
    assertEq(result[2], 0)// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn

    // dev address
    result = await etherDerby.getPlayerStats({ from: '0xC17A40cB38598520bd7C0D5BFF97D441A810a008' })
    assertEq(result[0], 0)// winnings
    assertEq(result[1], 0)// dividends
    // 10 percent to devs since no referral accounts were used
    assertAlmostEq(result[2], K.priceOfTwoCarrots.div(10))// referrals
    assertEq(result[3], 0)// reinvested
    assertEq(result[4], 0)// withdrawn
  })
})

contract('EtherDerby', accounts => {
  it("should give out correct amount of carrots when correct prices are paid", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.priceOfSecondCarrot, from: accounts[1], gasPrice: 1, gas: 400000 })
    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.priceOfThirdCarrot, from: accounts[2], gasPrice: 1, gas: 400000 })
    var result = await etherDerby.getRoundStats({ from: accounts[0]})
    assertEq(result[3][0], K.priceOfThreeCarrots)
    assertEq(result[4][0], (K.oneCarrot.times(3)))
    assertEq(result[5][0], K.initialPrice)
    assertEq(result[6][0], K.oneCarrot)

    result = await etherDerby.getRoundStats({ from: accounts[1]})
    assertEq(result[3][0], K.priceOfThreeCarrots)
    assertEq(result[4][0], (K.oneCarrot.times(3)))
    assertEq(result[5][0], K.priceOfSecondCarrot)
    assertEq(result[6][0], K.oneCarrot)

    result = await etherDerby.getRoundStats({ from: accounts[2]})
    assertEq(result[3][0], K.priceOfThreeCarrots)
    assertEq(result[4][0], (K.oneCarrot.times(3)))
    assertEq(result[5][0], K.priceOfThirdCarrot)
    assertEq(result[6][0], K.oneCarrot)
  })
})

contract('EtherDerby', accounts => {
  it("should put horse in lead when slightly more carrots are purchased", async () => {

    var etherDerby = await EtherDerby.deployed()

    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.buyCarrots(K.H2, 1, "", { value: K.initialPrice.add(1), from: accounts[1], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1, gas: 500000 })
    var result = await etherDerby.getPlayerStats({ from: accounts[0] })
    assertEq(result[0], 0)// winnings

    result = await etherDerby.getPlayerStats({ from: accounts[1] })
    // Second player has winnings
    assertEq(result[0], K.initialPrice.add(1).add(eightyPercent(K.initialPrice)))// winnings
  })
})

contract('EtherDerby', accounts => {
  it("should let new player come in late and buy carrots", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Round 1
    await etherDerby.buyCarrots(K.H1, 1, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 500000 })
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1, gas: 500000 })

    // Round 2
    await etherDerby.buyCarrots(K.H2, 2, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1, gas: 500000 })

    // Round 3
    await etherDerby.buyCarrots(K.H3, 3, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1, gas: 500000 })

    // Round 4
    await etherDerby.buyCarrots(K.H4, 4, "", { value: K.initialPrice, from: accounts[0], gasPrice: 1, gas: 400000 })
    await etherDerby.startNextRound({ from: accounts[0], gasPrice: 1, gas: 500000 })

    // Round 5 player 2 joins
    await etherDerby.buyCarrots(K.H1, 5, "", { value: K.initialPrice, from: accounts[1], gasPrice: 1, gas: 400000 })

  })
})


