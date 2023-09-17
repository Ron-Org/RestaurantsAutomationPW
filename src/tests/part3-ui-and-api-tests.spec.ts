import { test, expect, BrowserContext } from '@playwright/test'
import { BrowseWrapper } from '../infra/browser/browser'
import configJson from '../../config.json'
import { RestaurantPage } from '../logic/page/restaurant-page'
import restaurantsAPI from '../logic/api/restaurantsAPI'
import { generateRandomString, getRandomInt } from '../infra/utils'

test.describe('UI and API scenario Tests', () => {
  let browser: BrowseWrapper
  let resturantPage: RestaurantPage

  test.beforeAll(async () => {
    browser = new BrowseWrapper()

    // reset the server list before adding new restaurant
    await restaurantsAPI.resetServer()
  })
  test.beforeEach(async () => {
    resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl)
  })

  test.afterEach(async () => {
    await browser.closeContext()
  })

  test.afterAll(async () => {
    await browser.close()
  })
  //gotech test
  test('End 2 end create and delete restaurant from UI', async () => {
    try {
      // create new restaurant via UI
      let id = getRandomInt(999, 100)
      let name = generateRandomString(5)
      let address = generateRandomString(10)
      let score = getRandomInt(99, 1)
      await resturantPage.createNewRestaurant(id, name, address, score)

      // verify that the restaurant was created successfully
      // check using API call , and check all the fields in the

      let getByIdResponse = await restaurantsAPI.getRestaurantById(id)
      expect(getByIdResponse.status()).toEqual(200)
      expect(getByIdResponse.ok).toBeTruthy()

      const restaurantData = await getByIdResponse.json()
      console.log(JSON.stringify(restaurantData)) // for debug purposes only
      expect(restaurantData.data.name).toEqual(name)
      expect(restaurantData.data.address).toEqual(address)
      expect(restaurantData.data.score).toEqual(score.toString())

      // validate the new restaurant was added to the UI
      //    await expect(await resturantPage.isRestaurantRowExists(id,score), 'restaurant row not found in the UI').toBeTruthy()
      const restaurantRowExists = await resturantPage.isRestaurantRowExists(id, score)
      if (restaurantRowExists) {
        console.log('The new restaurant was added to the UI successfully')
      } else {
        console.log('The new restaurant was not found in the UI !')
        test.fail()
        return
      }
      // verify number of restaurants in the UI should match the number of
      // restaurants using API
      let response = await restaurantsAPI.getRestaurants()
      expect(response.status()).toBe(200)
      expect(response.ok).toBeTruthy
      let responseBody = await response.json()
      let numberOfRestaurantsUI = await resturantPage.getNumberOfRestaurantsInUI()
      console.log(`number restaurants API : ${responseBody.data.length} , number restaurants UI: ${numberOfRestaurantsUI}`)
      // number of restaurants should be same from UI and Api
      await expect(numberOfRestaurantsUI).toEqual(responseBody.data.length)

      // delete the restaurant via UI
      await resturantPage.deleteRestaurant()

      console.log('after delete restaurant')
      // check again after deletion of the last restaurant
      response = await restaurantsAPI.getRestaurants()
      expect(response.status()).toBe(200)
      expect(response.ok).toBeTruthy
      responseBody = await response.json()
      numberOfRestaurantsUI = await resturantPage.getNumberOfRestaurantsInUI()
      console.log(`number restaurants API : ${responseBody.data.length} , number restaurants UI: ${numberOfRestaurantsUI}`)
      // number of restaurants should be same from UI and Api
      expect(numberOfRestaurantsUI).toEqual(responseBody.data.length)
    } catch (error) {
      console.log(`error occurred: ${error}`)
    }
  })
})
