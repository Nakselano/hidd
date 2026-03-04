import { chromium } from 'playwright';

export async function fetchTrendsFromGoogle() {  
    const browser = await chromium.launch({ headless: true }); 
    const context = await browser.newContext({ locale: 'pl-PL' });
    const page = await context.newPage();
    try {
        await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=PL', {
            waitUntil: 'networkidle' 
        });

        await page.waitForTimeout(2000); 
        const okButton = page.getByRole('button', { name: 'OK', exact: true });
        if (await okButton.count() > 0) {
            await okButton.first().click();
        }

        await page.waitForFunction(() => {
            const cells = document.querySelectorAll('table tbody tr td:nth-child(2)');
            return cells.length > 0 && cells[0].innerText.trim().length > 0;
        }, { timeout: 10000 });

        const rawTrends = await page.locator('table tbody tr td:nth-child(2)').allTextContents();

        const cleanTrends = [...new Set(
            rawTrends
                .map(text => text.split('Wyszukiwania')[0].replace(/\n/g, '').trim())
                .filter(text => text.length > 0)
        )];

        console.log(`Hasła: ${cleanTrends.length}`);
        return cleanTrends;

    } catch (error) {
        console.error("Error:", error.message);
        return []; 
    } finally {
        await browser.close();
    }
}