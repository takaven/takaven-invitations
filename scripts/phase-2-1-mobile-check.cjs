const { chromium } = require('@playwright/test')
const fs = require('fs')

const baseUrl = 'http://localhost:3000/i/football-demo'
const evidenceDir = 'outputs/phase2-1-evidence'

async function run() {
  fs.mkdirSync(evidenceDir, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[aria-label="Football opening experience"]', { timeout: 10000 })
  await page.screenshot({ path: `${evidenceDir}/football-opening-mobile.png` })
  await page.waitForTimeout(2200)
  await page.screenshot({ path: `${evidenceDir}/football-build-up-mobile.png` })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${evidenceDir}/football-impact-mobile.png` })

  const skip = page.getByRole('button', { name: 'Skip opening' })
  const skipVisible = await skip.isVisible()
  await skip.click()
  await page.waitForSelector('h1', { state: 'visible' })
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `${evidenceDir}/football-invitation-mobile.png` })

  const metrics = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    heading: document.querySelector('h1')?.textContent,
    rsvpVisible: document.body.innerText.includes('Confirm my place'),
  }))

  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const reducedPage = await reducedContext.newPage()
  await reducedPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await reducedPage.waitForTimeout(4000)
  const reducedMetrics = await reducedPage.evaluate(() => ({
    openingVisible: (() => {
      const opening = document.querySelector('[aria-label="Football opening experience"]')
      return Boolean(opening && getComputedStyle(opening).display !== 'none' && getComputedStyle(opening).visibility !== 'hidden')
    })(),
    heading: document.querySelector('h1')?.textContent,
  }))
  await reducedPage.screenshot({ path: `${evidenceDir}/football-reduced-motion-mobile.png` })
  await reducedContext.close()

  const failureContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const failurePage = await failureContext.newPage()
  await failurePage.route('**/takaven/football/player.webp', (route) => route.abort())
  await failurePage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await failurePage.waitForTimeout(4000)
  const failureMetrics = await failurePage.evaluate(() => ({
    openingVisible: (() => {
      const opening = document.querySelector('[aria-label="Football opening experience"]')
      return Boolean(opening && getComputedStyle(opening).display !== 'none' && getComputedStyle(opening).visibility !== 'hidden')
    })(),
    heading: document.querySelector('h1')?.textContent,
  }))
  await failurePage.screenshot({ path: `${evidenceDir}/football-asset-failure-mobile.png` })
  await failureContext.close()

  await context.close()
  await browser.close()
  console.log(JSON.stringify({ skipVisible, metrics, reducedMetrics, failureMetrics }))
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
