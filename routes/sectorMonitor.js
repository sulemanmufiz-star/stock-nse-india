const express = require("express");
const router = express.Router();
const { NSE } = require("stock-nse-india");
const watchlist = require("../config/watchlist");

const nse = new NSE();

let cachedData = null;
let lastUpdated = 0;

// 5 minutes cache
const CACHE_TIME = 5 * 60 * 1000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchStockData(symbol, sector) {
  try {
    const data = await nse.getEquityDetails(symbol);

    return {
      symbol,
      sector,
      open: data.priceInfo.open || 0,
      ltp: data.priceInfo.lastPrice || 0,
      close: data.priceInfo.close || 0,
      high: data.priceInfo.intraDayHighLow?.max || 0,
      low: data.priceInfo.intraDayHighLow?.min || 0,
      prevClose: data.priceInfo.previousClose || 0,
      changePercent: data.priceInfo.pChange || 0
    };
  } catch (error) {
    console.log(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

async function refreshCache() {
  console.log("Refreshing NSE cache...");

  let allStocks = [];

  for (const sector in watchlist.sectors) {
    const symbols = watchlist.sectors[sector];

    for (const symbol of symbols) {
      const stock = await fetchStockData(symbol, sector);

      if (stock) {
        allStocks.push(stock);
      }

      // delay to avoid NSE blocking
      await sleep(800);
    }
  }

  // sector ranking
  let sectorMap = {};

  allStocks.forEach(stock => {
    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = [];
    }
    sectorMap[stock.sector].push(stock.changePercent);
  });

  let topSectors = Object.keys(sectorMap)
    .map(sector => {
      const avg =
        sectorMap[sector].reduce((a, b) => a + b, 0) /
        sectorMap[sector].length;

      return {
        sector,
        avgChange: Number(avg.toFixed(2))
      };
    })
    .sort((a, b) => b.avgChange - a.avgChange)
    .slice(0, 2);

  const topSectorNames = topSectors.map(x => x.sector);

  const topStocks = allStocks
    .filter(stock => topSectorNames.includes(stock.sector))
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4);

  cachedData = {
    lastUpdated: new Date(),
    topSectors,
    topStocks,
    allStocks
  };

  lastUpdated = Date.now();

  console.log("Cache updated successfully");
}

router.get("/", async (req, res) => {
  try {
    if (
      !cachedData ||
      Date.now() - lastUpdated > CACHE_TIME
    ) {
      await refreshCache();
    }

    res.json(cachedData);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data"
    });
  }
});

module.exports = router;
