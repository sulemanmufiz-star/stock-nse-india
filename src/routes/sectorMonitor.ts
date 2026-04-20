// src/routes/sectorMonitor.ts

import express from "express";
import { NSE } from "stock-nse-india";
import watchlist from "../config/watchlist";

const router = express.Router();
const nse = new NSE();

/*
5 MIN CACHE
*/
let cachedData: any = null;
let lastUpdated = 0;
const CACHE_TIME = 5 * 60 * 1000;

/*
Sleep to avoid NSE block
*/
async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Fetch single stock
*/
async function fetchStockData(symbol: string, sector: string) {
  try {
    const data: any = await nse.getEquityDetails(symbol);

    return {
      symbol,
      sector,
      open: data?.priceInfo?.open || 0,
      ltp: data?.priceInfo?.lastPrice || 0,
      close: data?.priceInfo?.close || 0,
      high: data?.priceInfo?.intraDayHighLow?.max || 0,
      low: data?.priceInfo?.intraDayHighLow?.min || 0,
      prevClose: data?.priceInfo?.previousClose || 0,
      changePercent: data?.priceInfo?.pChange || 0
    };
  } catch (error: any) {
    console.log(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

/*
Refresh full cache
*/
async function refreshCache() {
  console.log("Refreshing sector monitor cache...");

  let allStocks: any[] = [];

  for (const sector in watchlist.sectors) {
    const symbols = watchlist.sectors[sector];

    for (const symbol of symbols) {
      const stock = await fetchStockData(symbol, sector);

      if (stock) {
        allStocks.push(stock);
      }

      // anti-block delay
      await sleep(800);
    }
  }

  /*
  Sector Ranking
  */
  let sectorMap: any = {};

  allStocks.forEach(stock => {
    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = [];
    }

    sectorMap[stock.sector].push(stock.changePercent);
  });

  let topSectors = Object.keys(sectorMap)
    .map(sector => {
      const avg =
        sectorMap[sector].reduce((a: number, b: number) => a + b, 0) /
        sectorMap[sector].length;

      return {
        sector,
        avgChange: Number(avg.toFixed(2))
      };
    })
    .sort((a, b) => b.avgChange - a.avgChange)
    .slice(0, 2);

  /*
  Top Stocks from Top Sectors
  */
  const topSectorNames = topSectors.map(x => x.sector);

  const topStocks = allStocks
    .filter(stock => topSectorNames.includes(stock.sector))
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);

  cachedData = {
    lastUpdated: new Date(),
    topSectors,
    topStocks,
    allStocks
  };

  lastUpdated = Date.now();

  console.log("Sector monitor cache updated successfully");
}

/*
API Route
*/
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
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch sector monitor data"
    });
  }
});

/*
IMPORTANT
Correct export for TypeScript
*/
export default router;
