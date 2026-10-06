const { chromium } = require('@playwright/test')
const fs = require('fs')

const baseUrl = `${process.env.TAKAVEN_BASE_URL || 'http://localhost:3001'}/i/football-demo`
const evidenceDir = 'outputs/phase2-2-evidence'

async function isOpeningVisible(page) {
  return page.evaluate(() => {
    const opening = document.querySelector('[aria-label="Football opening experience"]')
    return Boolean(opening && getComputedStyle(opening).display !== 'none' && getComputedStyle(opening).visibility !== 'hidden')
  })
}

async function run() {
  fs.mkdirSync(evidenceDir, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[aria-label="Football opening experience"]', { timeout: 10000 })
  await page.screenshot({ path: `${evidenceDir}/01-opening-tunnel-mobile.png`, fullPage: false })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${evidenceDir}/02-child-runner-mobile.png`, fullPage: false })
  await page.waitForTimeout(1900)
  await page.screenshot({ path: `${evidenceDir}/03-kick-flight-mobile.png`, fullPage: false })
  await page.waitForTimeout(1700)
  await page.screenshot({ path: `${evidenceDir}/04-impact-mobile.png`, fullPage: false })

  const skip = page.getByRole('button', { name: 'Skip opening' })
  const skipVisible = await skip.isVisible()
  await skip.click()
  await page.waitForSelector('#matchday-title', { state: 'visible' })
  await page.waitForTimeout(1700)
  await page.screenshot({ path: `${evidenceDir}/05-matchday-hero-mobile.png`, fullPage: false })
  await page.locator('#kickoff').scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${evidenceDir}/06-countdown-mobile.png`, fullPage: false })
  await page.locator('#rsvp').scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${evidenceDir}/07-rsvp-mobile.png`, fullPage: false })

  const metrics = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    heading: document.querySelector('h1')?.textContent,
    hasMatchday: document.body.innerText.includes('MATCHDAY'),
    hasVenue: document.body.innerText.includes('THE VENUE'),
    hasSquadCta: Boolean(document.querySelector('#rsvp button[type="submit"]')),
    jerseyNumber: document.querySelector('.takaven-football-master__jersey-number')?.textContent,
  }))

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const reducedPage = await reducedContext.newPage()
  await reducedPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await reducedPage.waitForTimeout(900)
  const reducedMetrics = {
    openingVisible: await isOpeningVisible(reducedPage),
    heading: await reducedPage.locator('#matchday-title').textContent(),
  }
  await reducedPage.screenshot({ path: `${evidenceDir}/08-reduced-motion-mobile.png`, fullPage: false })
  await reducedContext.close()

  const failureContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const failurePage = await failureContext.newPage()
  await failurePage.route('**/takaven/football/child-player.webp', (route) => route.abort())
  await failurePage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await failurePage.waitForTimeout(900)
  const failureMetrics = {
    openingVisible: await isOpeningVisible(failurePage),
    heading: await failurePage.locator('#matchday-title').textContent(),
  }
  await failurePage.screenshot({ path: `${evidenceDir}/09-asset-failure-mobile.png`, fullPage: false })
  await failureContext.close()

  await context.close()
  await browser.close()
  console.log(JSON.stringify({ skipVisible, metrics, reducedMetrics, failureMetrics }))
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
