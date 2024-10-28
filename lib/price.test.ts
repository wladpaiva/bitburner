import { describe, it, expect, vi, beforeEach } from "vitest";
import { fiatToSats, getPrice } from "./price";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("price conversion functions", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("fiatToSats", () => {
    it("should correctly convert fiat to sats", async () => {
      // Mock getPrice to return a fixed BTC price of $50,000
      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes("binance")) {
          return {
            ok: true,
            json: async () => ({ price: "50000" }),
          };
        }
        return { ok: false };
      });

      // Test with $100 USD (10000 cents)
      const sats = await fiatToSats(10000, "USD");
      // $100 at $50,000 per BTC should be 200.000 sats (0.002 BTC)
      expect(sats).toBe(200000);
    });

    it("should handle decimal precision correctly", async () => {
      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes("binance")) {
          return {
            ok: true,
            json: async () => ({ price: "50000.50" }),
          };
        }
        return { ok: false };
      });

      const sats = await fiatToSats(9999, "USD"); // $99.99
      expect(sats).toBe(199978); // Rounded to nearest sat
    });
  });

  describe("getPrice", () => {
    it("should return median price when multiple exchanges respond", async () => {
      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes("binance")) {
          return {
            ok: true,
            json: async () => ({ price: "50000" }),
          };
        }
        if (url.includes("bitfinex")) {
          return {
            ok: true,
            json: async () => ({ last_price: "51000" }),
          };
        }
        if (url.includes("kraken")) {
          return {
            ok: true,
            json: async () => ({
              result: {
                XXBTZUSD: { a: ["52000"], b: ["51900"] },
              },
            }),
          };
        }
        return { ok: false };
      });

      const price = await getPrice("USD");
      expect(price).toBe(51000); // Median of 50000, 51000, 51900
    });

    it("should throw error when no exchanges respond", async () => {
      mockFetch.mockImplementation(async () => ({
        ok: false,
        json: async () => ({}),
      }));

      await expect(getPrice("USD")).rejects.toThrow("Unsupported currency");
    });
  });
});
