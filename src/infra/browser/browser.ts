import { Browser, Page, chromium } from '@playwright/test'
import { BasePage } from '../../logic/page/base-page'

export class BrowseWrapper {
  browser!: Browser

  closeContext = async () => {
    const context = await this.getContext()
    await context.close()
  }

  close = async () => {
    await this.browser.close()
  }

  private getContext = async () => {
    if (!this.browser || this.browser.contexts().length == 0) {
      const browser = await this.getBrowser()
      await browser.newContext()
    }
    return this.browser.contexts()[0]
  }

  private getBrowser = async () => {
    if (!this.browser) {
      const browserContextArgs = ['--ignore-certificate-errors', '--no-sandbox']
      const browser = await chromium.launch({
        args: browserContextArgs,
      })
      this.browser = browser
    }
    return this.browser
  }

  getPage = async () => {
    const context = await this.getContext()
    if (context.pages().length == 0) {
      return await context.newPage()
    } else {
      return context.pages()[0]
    }
  }

  newPage = async <T extends BasePage>(pageType: new (page: Page) => T, url?: string) => {
    const newPage = await this.getPage()
    if (url) {
      await newPage.goto(url)
    }
    const page = new pageType(newPage)
    await page.initPage()
    return page
  }
}
