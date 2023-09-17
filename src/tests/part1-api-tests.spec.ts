//const { test, expect } = require('@playwright/test')

import { test, expect } from '@playwright/test'
import { BrowseWrapper } from '../infra/browser/browser'
import restaurantsAPI from '../logic/api/restaurantsAPI'
import { generateRandomString, getRandomInt } from '../infra/utils'
import { RestaurantPage } from '../logic/page/restaurant-page'

test('Delete restaurant test', async () => {
  try {
    // first reset data
    await restaurantsAPI.resetServer()

    // add new restaurant
    const myNewRest = { address: generateRandomString(10), id: getRandomInt(999, 100), name: generateRandomString(5), score: getRandomInt(99, 1) }
    await restaurantsAPI.createRestaurant(myNewRest)

    console.log(`create restaurant id: ${myNewRest.id}`)

    // check the new restaurant exist
    let getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)
    expect(getByIdResponse.status()).toEqual(200)
    expect(getByIdResponse.ok).toBeTruthy

    // delete the restaurant
    const deleteResponse = await restaurantsAPI.deleteRestaurant(myNewRest.id)
    expect(deleteResponse.status()).toEqual(200)
    expect(deleteResponse.ok).toBeTruthy

    // check restaurant not exists
    getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)
    console.log(`After delete restaurant id: ${myNewRest.id} , status code: ${getByIdResponse.status()} not found as expected.`)
    expect(getByIdResponse.status()).toEqual(404)
    expect(getByIdResponse.ok).toBeFalsy
  } catch (err) {
    console.log(`error occurred : ${err}`)
  }
})

test('Delete restaurant that not exists in the system test', async () => {
  try {
    // first reset data
    await restaurantsAPI.resetServer()

    let restaurantId = 5555

    // delete the restaurant
    const deleteResponse = await restaurantsAPI.deleteRestaurant(restaurantId)
    expect(deleteResponse.status()).toEqual(404)
    expect(deleteResponse.ok).toBeFalsy
  } catch (err) {
    console.log(`error occurred : ${err}`)
  }
})

test('Edit restaurant test', async () => {
  try {
    // first reset data
    await restaurantsAPI.resetServer()

    // add new restaurant
    const myNewRest = { address: generateRandomString(10), id: getRandomInt(999, 100), name: generateRandomString(5), score: getRandomInt(99, 1) }
    await restaurantsAPI.createRestaurant(myNewRest)

    console.log(`create restaurant id: ${myNewRest.id}`)

    // check the new restaurant exist
    let getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)
    expect(getByIdResponse.status()).toEqual(200)
    expect(getByIdResponse.ok).toBeTruthy

    // edit the new restaurant to new address
    const updatePayload = { address: 'petack tickva 55' }

    // edit the new restaurant and check status
    let patchResponse = await restaurantsAPI.editRestaurant(updatePayload, myNewRest.id)
    expect(patchResponse.status()).toEqual(200)
    expect(patchResponse.ok).toBeTruthy

    // get the new restaurant after edit operation to see if address was changed
    getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)
    expect(getByIdResponse.status()).toEqual(200)
    expect(getByIdResponse.ok).toBeTruthy

    const restaurantData = await getByIdResponse.json()
    console.log(JSON.stringify(restaurantData)) // for debug purposes only
    expect(restaurantData.data.address).toEqual(updatePayload['address'])
  } catch (err) {
    console.log(`error occurred : ${err}`)
  }
})

test('Edit restaurant that not exists in the system test', async () => {
  try {
    // first reset data
    await restaurantsAPI.resetServer()

    let restaurantId = 5555

    const updatePayload = { address: 'petack tickva 55' }

    // edit restaurant that not exists in the system
    const editResponse = await restaurantsAPI.editRestaurant(updatePayload, restaurantId)
    expect(editResponse.status()).toEqual(404)
    expect(editResponse.ok).toBeFalsy
  } catch (err) {
    console.log(`error occurred : ${err}`)
  }
})
