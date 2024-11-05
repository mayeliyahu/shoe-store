const fs = require('fs');
const path = require('path');
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.AlphaKey;
const BASE_URL = 'https://www.alphavantage.co/query';
const SNEAKER_NEWS_USER_ID = '16180874';

const symbols = ['ADDYY', 'NKE', 'PUMSY', 'SKX', 'UAA', 'FL', 'JDSPY'];

// Cache paths and expiration durations
const STOCK_CACHE_PATH = path.join(__dirname, 'cache', 'stockData.json');
const TWEET_CACHE_PATH = path.join(__dirname, 'cache', 'tweets.json');
const STOCK_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const TWEET_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Read cache from file if valid
function readCache(filePath, maxAge) {
    try {
        const stats = fs.statSync(filePath);
        const now = Date.now();
        if (now - stats.mtimeMs < maxAge) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        // If file doesn't exist or is expired, return null
        return null;
    }
    return null;
}

// Write data to cache file
function writeCache(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data));
}

// Function to fetch stock data and cache it
exports.getStockPrices = async (req, res) => {
    // Check cache
    const cachedData = readCache(STOCK_CACHE_PATH, STOCK_CACHE_DURATION);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const stockData = [];
        for (const symbol of symbols) {
            const data = await fetchStockData(symbol);
            stockData.push(data);
            await new Promise(resolve => setTimeout(resolve, 12000)); // 12-second delay to avoid rate limits
        }

        // Cache new stock data
        writeCache(STOCK_CACHE_PATH, stockData);
        res.json(stockData);
    } catch (error) {
        console.error("Error fetching stock prices:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
};

// Helper function to fetch individual stock data
function fetchStockData(symbol) {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    const quote = parsedData['Global Quote'];

                    if (quote && quote['05. price']) {
                        const latestPrice = parseFloat(quote['05. price']);
                        const percentChange = parseFloat(quote['10. change percent'].replace('%', ''));
                        const direction = percentChange > 0 ? 'up' : 'down';

                        resolve({
                            symbol,
                            latestPrice: latestPrice.toFixed(2),
                            percentChange: percentChange.toFixed(2),
                            direction
                        });
                    } else {
                        resolve({ symbol, latestPrice: 'Data unavailable', percentChange: 'N/A', direction: 'none' });
                    }
                } catch (error) {
                    console.error(`Failed to parse stock data for ${symbol}:`, error);
                    reject(new Error("Failed to parse stock data"));
                }
            });

            response.on('error', (error) => {
                console.error(`Error on request for ${symbol}:`, error);
                reject(error);
            });
        });
    });
}

// Function to fetch recent tweets with caching
exports.getRecentTweets = (req, res) => {
    // Check cache
    const cachedData = readCache(TWEET_CACHE_PATH, TWEET_CACHE_DURATION);
    if (cachedData) {
        return res.json(cachedData);
    }

    const optionsTweets = {
        hostname: 'api.twitter.com',
        path: `/2/users/${SNEAKER_NEWS_USER_ID}/tweets?max_results=5`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    https.get(optionsTweets, (tweetResponse) => {
        let tweetData = '';
        tweetResponse.on('data', (chunk) => (tweetData += chunk));
        tweetResponse.on('end', () => {
            if (tweetResponse.statusCode === 200) {
                const tweets = JSON.parse(tweetData);
                const recentTweets = (tweets.data || []).map(tweet => tweet.text);

                // Cache the new tweet data
                const cacheData = { userId: SNEAKER_NEWS_USER_ID, recentTweets };
                writeCache(TWEET_CACHE_PATH, cacheData);

                res.json(cacheData);
            } else {
                console.error("Twitter API Error:", tweetData);
                res.status(tweetResponse.statusCode).json({ error: "Failed to fetch tweets" });
            }
        });
    }).on('error', (error) => {
        console.error("Request Error:", error);
        res.status(500).json({ error: "Failed to fetch tweets" });
    });
};
