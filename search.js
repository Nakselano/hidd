import { chromium } from 'playwright';

export async function runPlaywrightSearch(keyword, STATE_FILE, IS_LOGGED_IN) {
    console.log(`Szukamy: "${keyword}"`);
    const browser = await chromium.launch({
        headless: IS_LOGGED_IN, 
        args: ['--disable-blink-features=AutomationControlled']
    });
    const contextOptions = {
        locale: 'pl-PL',
        viewport: { width: 1280, height: 720 },
    };
    if (IS_LOGGED_IN) {
        contextOptions.storageState = STATE_FILE;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
        await page.goto('https://www.google.pl');

// PIERWSZE LOGOWANIE
        if (!IS_LOGGED_IN) {
            console.log("Logowanie - 60 sekund");        
            await page.waitForTimeout(60000); 
            
            await context.storageState({ path: STATE_FILE });   
            await page.goto('https://www.google.pl', { waitUntil: 'networkidle' });
        }

// Przeklikanie RODO 
        const cookieButton = page.getByRole('button', { name: /Zaakceptuj wszystko|Zgadzam się/i });
        if (await cookieButton.count() > 0) {
            await cookieButton.first().click();
            await page.waitForTimeout(1000);
        }

//szukanie
        const searchBox = page.locator('textarea[name="q"], input[name="q"]').first();
        await searchBox.fill(''); 
        await searchBox.pressSequentially(keyword, { delay: 120 }); 

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            searchBox.press('Enter')
        ]);
//Symulowanie scrollowania
        await page.mouse.wheel(0, 400 + Math.random() * 300); 
        await page.waitForTimeout(2000 + Math.random() * 2000); 
        await page.mouse.wheel(0, 400 + Math.random() * 300); 
        await page.waitForTimeout(1000 + Math.random() * 2000); 

    } catch (error) {
        console.error("Error", error.message);
    } finally {
        await browser.close();
    }
}