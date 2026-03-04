import fs from 'fs';
import { fetchTrendsFromGoogle } from './trends.js';
import { runPlaywrightSearch } from './search.js';

const STATE_FILE = './state.json';
let keywordsPool = [];

async function refillPool() {
    const fetchedTrends = await fetchTrendsFromGoogle(); 
    if (fetchedTrends.length > 0) {
        keywordsPool = fetchedTrends;
    } else {
        console.log("Nie udało się pobrać. Używamy backupu");
        keywordsPool = ["Pogoda długoterminowa", "Wiadomości ze świata", "Kurs walut NBP", "Przepis na obiad", "Kino premiery"]; 
    }
}

function getNextKeyword() {
    const randomIndex = Math.floor(Math.random() * keywordsPool.length);
    const [keyword] = keywordsPool.splice(randomIndex, 1);
    return keyword;
}

async function generateInformationNoise() {
    const isLoggedIn = fs.existsSync(STATE_FILE);
    try {
        if (keywordsPool.length === 0) {
            await refillPool();
        }
        const keywordToSearch = getNextKeyword();
        console.log(`Pulla: ${keywordsPool.length}`);
        
        // Poprawiono przekazywanie argumentów, aby bot widział sesję
        await runPlaywrightSearch(keywordToSearch, STATE_FILE, isLoggedIn);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        const minMs = 2 * 60 * 1000; 
        const maxMs = 5 * 60 * 1000; 
        const nextDelayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        
        const nextTime = new Date(Date.now() + nextDelayMs).toLocaleTimeString();
        console.log(`Next: ${nextTime} (${Math.round(nextDelayMs / 1000)}s)...`);
        
        setTimeout(generateInformationNoise, nextDelayMs);
    }
}
console.log("Uruchomiono :like:");
generateInformationNoise();