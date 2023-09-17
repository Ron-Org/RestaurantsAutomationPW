import { test, expect } from '@playwright/test'
import { BrowseWrapper } from '../infra/browser/browser'
import restaurantsAPI from '../logic/api/restaurantsAPI'
import { generateRandomString, getRandomInt } from '../infra/utils'

test.describe('Base API test', () => {
  let browser: BrowseWrapper

  test.beforeAll(async () => {
    browser = new BrowseWrapper()
  })

  test.afterEach(async () => {
    await browser.closeContext()
  })

  test.afterAll(async () => {
    await browser.close()
  })

  test('Create restaurants via api', async () => {
    //Arrange
    const myNewRest = { address: generateRandomString(10), id: getRandomInt(999, 100), name: generateRandomString(5), score: getRandomInt(99, 1) }
    await restaurantsAPI.createRestaurant(myNewRest)

    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)

    //Assert
    expect(getByIdResponse.status()).toEqual(200)
    expect(getByIdResponse.ok()).toBeTruthy
  })
})
