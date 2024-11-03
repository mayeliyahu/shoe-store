require('dotenv').config();
const https = require('https');

const API_KEY = process.env.AlphaKey;
const BASE_URL = 'https://www.alphavantage.co/query';

const symbols = ['ADDYY', 'NKE', 'PUMSY', 'SKX', 'UAA', 'FL', 'JDSPY'];

exports.getStockPrices = async (req, res) => {
    try {
        const stockData = [];
        for (const symbol of symbols) {
            const data = await fetchStockData(symbol);
            stockData.push(data);
            await new Promise(resolve => setTimeout(resolve, 12000)); // 12-second delay between requests to avoid rate limits
        }
        res.json(stockData);
    } catch (error) {
        console.error("Error fetching stock prices:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
};

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