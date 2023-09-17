import { Locator, Page, BrowserContext } from '@playwright/test'
import { BasePage } from './base-page'

const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]"

export class RestaurantPage extends BasePage {
  private createNewResturantButton: Locator
  private popupTitle: Locator
  private deleteButton: Locator
  private okStatusButton: Locator
  private idTextBox: Locator
  private nameTextBox: Locator
  private addressTextBox: Locator
  private scoreTextBox: Locator
  private submitNewRestaurantButton: Locator

  constructor(page: Page) {
    super(page)
    this.createNewResturantButton = this.page.locator("//button[contains(text(),'Create new')]")
    this.popupTitle = this.page.locator("//h2[contains(text(),'Create new restaurant')]")

    // at first we reset the server list so we have 3 rows, then add new restaurant
    //this is row number 4, this button point to row number 4 and will delete the restaurant
    this.deleteButton = this.page.locator("(//button[contains(text(),'X')])[4]")
    this.okStatusButton = this.page.locator("//button[contains(text(),'OK')]")

    this.idTextBox = this.page.locator('css=#id')
    this.nameTextBox = this.page.locator('css=#name')
    this.addressTextBox = this.page.locator('css=#address')
    this.scoreTextBox = this.page.locator('css=#score')
    this.submitNewRestaurantButton = this.page.locator('css=.btn.btn-primary')
  }

  clickreateNewRestaurantButtone = async () => {
    await this.createNewResturantButton.click()
  }
  returnPopupTitle = async () => {
    return this.popupTitle.isVisible()
  }

  deleteRestaurant = async () => {
    await this.deleteButton.click()
    await this.okStatusButton.click()
  }

  createNewRestaurant = async (id: number, name: string, address: string, score: number) => {
    await this.createNewResturantButton.click()

    await this.idTextBox.clear()
    await this.idTextBox.type(id.toString())
    await this.nameTextBox.clear()
    await this.nameTextBox.type(name)
    await this.addressTextBox.clear()
    await this.addressTextBox.type(address)
    await this.scoreTextBox.clear()
    await this.scoreTextBox.type(score.toString())
    await this.submitNewRestaurantButton.click()
    await this.okStatusButton.click()
  }

  getNumberOfRestaurantsInUI = async () => {
    const numberOfRows = await this.page.$$('tbody tr')
    return numberOfRows.length
  }

  isRestaurantRowExists = async (id: number, score: number) => {
    try {
      let idExists: boolean = await this.page.locator('//td[(text()=' + id.toString() + ')]').isVisible()
      let scoreExists: boolean = await this.page.locator('//td[(text()=' + score.toString() + ')]').isVisible()
      return idExists && scoreExists
    } catch (err) {
      console.log(`Error IN isRestaurantRowExists: ${err}`)
    }
  }
}
