export const formatSats = (amount: number) => {
  return amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

export const numberFormatter = (options: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", options);
};
