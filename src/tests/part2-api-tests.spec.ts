import { test, expect, APIResponse } from '@playwright/test'
import { BrowseWrapper } from '../infra/browser/browser'
import restaurantsAPI from '../logic/api/restaurantsAPI'
import { generateRandomString, getRandomInt } from '../infra/utils'
import { RestaurantPage } from '../logic/page/restaurant-page'
import { Restaurant } from './API-Request/get-restaurants-request'

test('Get restaurant that not exists', async () => {
  try {
    await restaurantsAPI.resetServer()

    // trying to find reastaurant that not exists in the system
    let restaurantId = 5555
    let getByIdResponse = await restaurantsAPI.getRestaurantById(restaurantId)
    console.log(`status code: ${getByIdResponse.status()} not found as expected.`)
    expect(getByIdResponse.status()).toEqual(404)
    expect(getByIdResponse.ok()).toBeFalsy()
  } catch (err) {
    console.log(`error occurred: ${err}`)
  }
})

// validate amount of restaurants to be 3 after reset server
test('Validate amount of restaurants', async () => {
  try {
    await restaurantsAPI.resetServer()

    const response = await restaurantsAPI.getRestaurants()
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

    // check for 3 restaurant size
    const responseBody = await response.json()
    console.log(responseBody) // for debuf purpose
    expect(responseBody.data.length).toEqual(3)
  } catch (error) {
    console.log('Error while calling get restaurants from the server: ', error)
  }
})
