export const numberFormatter = (options: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", options);
};
