import { test, expect } from '@playwright/test';
import { BrowseWrapper } from '../infra/browser/browser';
import restaurantsAPI from '../logic/api/restaurantsAPI';

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
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 }
        await restaurantsAPI.createRestaurant(myNewRest);

        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.status()).toEqual(201)
        expect(getByIdResponse.ok).toBeTruthy
    })
})