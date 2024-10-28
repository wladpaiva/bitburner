export const PRICE_PRECISION = 1e8;
export const SPREAD_FACTOR = 0.01;

/**
 * Converts a fiat amount to satoshis.
 * @param amount - The amount in cents.
 * @param currencyCode - The currency code.
 * @returns The amount in satoshis.
 */
export async function fiatToSats(
  amount: number,
  currencyCode: string
): Promise<number> {
  const price = await getPrice(currencyCode);
  const amountNumber = amount / 100;
  return Math.round((amountNumber / price) * PRICE_PRECISION);
}

/**
 * Retrieves the price of Bitcoin for the specified code.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin in float (eg 123.45)
 */

export async function getPrice(code: string) {
  const prices = await Promise.all([
    getBinancePrice(code),
    getBitfinexPrice(code),
    getCoingeckoPrice(code),
    getKrakenPrice(code),
    getOKXPrice(code),
  ]);

  const validPrices = prices.filter((price) => price !== null) as number[];
  if (validPrices.length === 0) {
    throw new Error("Unsupported currency");
  }

  return median(validPrices);
}
/**
 * Calculates the median value of an array of numbers.
 * @param numbers - The array of numbers.
 * @returns The median value.
 */
function median(numbers: number[]): number {
  const sorted = numbers.sort();
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1]! + sorted[middle]!) / 2;
  }

  return sorted[middle]!;
}
/**
 * Retrieves the price of Bitcoin from the Binance API.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin from Binance.
 */

async function getBinancePrice(code: string) {
  const symbol = `BTC${code.toUpperCase()}`;
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
  );
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { price: string };
  return Number(data.price);
}
/**
 * Retrieves the price of Bitcoin from the Bitfinex API.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin from Bitfinex.
 */

async function getBitfinexPrice(code: string) {
  const symbol = `BTC${code.toUpperCase()}`;
  const response = await fetch(
    `https://api.bitfinex.com/v1/pubticker/${symbol}`
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as { last_price: string };
  return Number(data.last_price);
}
/**
 * Retrieves the price of Bitcoin from the Coingecko API.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin from Coingecko.
 */

async function getCoingeckoPrice(code: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${code}`
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    bitcoin: { [key: string]: string };
  };
  const price = data.bitcoin[code.toLowerCase()];
  if (!price) {
    return null;
  }
  return Number(price);
}
/**
 * Retrieves the price of Bitcoin from the Kraken API.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin from Kraken.
 */

async function getKrakenPrice(code: string) {
  const symbol = `XXBTZ${code.toUpperCase()}`;
  const response = await fetch(
    `https://api.kraken.com/0/public/Ticker?pair=${symbol}`
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    result?: { [key: string]: { a: string[]; b: string[] } };
  };
  if (!data.result || !data.result[symbol]) {
    return null;
  }
  const tickerData = data.result[symbol]!;
  const sellPrice = tickerData.a[0];
  const buyPrice = tickerData.b[0];
  if (!sellPrice || !buyPrice) {
    return null;
  }

  return Math.min(Number(sellPrice), Number(buyPrice));
}
/**
 * Retrieves the price of Bitcoin from the OKX API.
 * @param code - The code representing the currency.
 * @returns The price of Bitcoin from OKX.
 */

async function getOKXPrice(code: string) {
  const symbol = `BTC-${code.toUpperCase()}-SWAP`;
  const response = await fetch(
    `https://www.okx.com/api/v5/public/price-limit?instId=${symbol}`
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    code: string;
    data: [{ buyLmt: string; sellLmt: string }];
  };
  if (!data.data || !data.data[0] || code !== "0") {
    return null;
  }
  const buyPrice = data.data[0].buyLmt;
  const sellPrice = data.data[0].sellLmt;
  if (!buyPrice || !sellPrice) {
    return null;
  }
  return Math.min(Number(buyPrice), Number(sellPrice));
}
