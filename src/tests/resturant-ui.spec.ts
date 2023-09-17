import { test, expect } from '@playwright/test'
import { BrowseWrapper } from '../infra/browser/browser'
import configJson from '../../config.json'
import { RestaurantPage } from '../logic/page/restaurant-page'

test.describe('Base UI Test', () => {
  let browser: BrowseWrapper
  let resturantPage: RestaurantPage

  test.beforeAll(async () => {
    browser = new BrowseWrapper()
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
  test('Validate "Create new Restaurant Popup" opened', async () => {
    await resturantPage.clickreateNewRestaurantButtone()
    await expect(resturantPage.returnPopupTitle).toBeTruthy
  })
})
