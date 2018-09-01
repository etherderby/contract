
import { expectThrow } from './helpers/expectThrow'
import { assertEq, assertNotEq, assertAlmostEq } from './helpers/assert'
import { toAscii } from './helpers/utils'
import * as K from './helpers/constants'

var EtherDerby = artifacts.require("./EtherDerbyTestable.sol")

contract('EtherDerby', (accounts) => {
  it("should let players register name and fail when improper names supplied", async () => {

    var etherDerby = await EtherDerby.deployed()

    // First registration should succeed
    await etherDerby.registerName("harrypotter", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 })

    // Calling getPlayerName should now return "harrypotter"
    var playerName = toAscii(await etherDerby.getPlayerName({ from: accounts[0] }))
    assert.equal(playerName, "harrypotter")

    // Duplicate name should throw error
    await expectThrow(etherDerby.registerName("harrypotter", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))

    // Empty name should throw error
    await expectThrow(etherDerby.registerName("", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))    

    // Not enough ETH should throw error
    await expectThrow(etherDerby.registerName("lastblocklabs", { from: accounts[0], value: 19000000000000000, gasPrice: 1 }))    

    // 15 character max
    await etherDerby.registerName("lastblocklabsla", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 })
    await expectThrow(etherDerby.registerName("lastblocklabslas", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))

    // Cannot start with 0x
    await expectThrow(etherDerby.registerName("0xlastblock", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))

    // Cannot contain a space
    await expectThrow(etherDerby.registerName(" cowboy", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))
    await expectThrow(etherDerby.registerName("racecar ", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))
    await expectThrow(etherDerby.registerName("race car", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))
    await expectThrow(etherDerby.registerName(" ", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))

    // Cannot be only numbers
    await expectThrow(etherDerby.registerName("31415", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))

    // Cannot have special characters
    await expectThrow(etherDerby.registerName("abc-def", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))    
    await expectThrow(etherDerby.registerName("abc.def", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 }))    
  })
})

contract('EtherDerby', (accounts) => {
  it("should return empty string when player is not registered", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Account three should not have a name registered
    var playerName = toAscii(await etherDerby.getPlayerName({ from: accounts[3] }))
    assert.equal(playerName, "");
  })
})

contract('EtherDerby', (accounts) => {
  it("should convert uppercase to lowercase", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Test that uppercase goes to lower case
    await etherDerby.registerName("rOnwEasLeY", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 })
    var playerName = toAscii(await etherDerby.getPlayerName({ from: accounts[0] }))
    assert.equal(playerName, "ronweasley");
  })
})

contract('EtherDerby', (accounts) => {
  it("should reward referrals when name registered is used", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Register divyboi from account[0]
    await etherDerby.registerName("divyboi", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 })

    // Purchase under account[1] with divyboi's referral code
    // Purchase for two horses so there is a loser and referral bonuses are handed out
    await etherDerby.buyCarrots(K.H1, 1, "divyboi", { value: K.initialPrice, from: accounts[1] })
    await etherDerby.buyCarrots(K.H2, 1, "divyboi", { value: K.initialPrice, from: accounts[1] })

    // End round
    await etherDerby.startNextRound({ from: accounts[0] })

    var result = await etherDerby.getPlayerStats({ from: accounts[0] })

    // Nine percent of initial price goes to referral
    assertEq(result[2], K.initialPrice.times(9).div(100))// referrals
  })
})

contract('EtherDerby', (accounts) => {
  it("should reward referrals when name registered is used then not used", async () => {

    var etherDerby = await EtherDerby.deployed()

    // Register divyboi from account[0]
    await etherDerby.registerName("divyboi", { from: accounts[0], value: K.nameRegistrationPrice, gasPrice: 1 })

    // Purchase under account[1] with divyboi's referral code
    // Purchase for two horses so there is a loser and referral bonuses are handed out
    await etherDerby.buyCarrots(K.H1, 1, "divyboi", { value: K.initialPrice, from: accounts[1] })
    await etherDerby.buyCarrots(K.H2, 1, "divyboi", { value: K.initialPrice, from: accounts[1] })
    await etherDerby.buyCarrots(K.H3, 1, "divyboi", { value: K.initialPrice, from: accounts[1] })

    // End round
    await etherDerby.startNextRound({ from: accounts[0] })

    var result = await etherDerby.getPlayerStats({ from: accounts[0] })

    // Nine percent of initial price goes to referral
    assertEq(result[2], K.initialPrice.times(2).times(9).div(100))// referrals
  })
})
