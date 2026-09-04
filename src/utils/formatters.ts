/**
 * CyberOptix Financial Formatters
 * Consistent INR formatting across the platform.
 */

export function formatCrore(valueInr: number): string {
  const crore = valueInr / 10000000;
  if (crore >= 100) return `₹${Math.round(crore)} Cr`;
  if (crore >= 10) return `₹${crore.toFixed(1)} Cr`;
  return `₹${crore.toFixed(2)} Cr`;
}

export function formatLakh(valueInr: number): string {
  const lakh = valueInr / 100000;
  if (lakh >= 100) return formatCrore(valueInr);
  if (lakh >= 10) return `₹${Math.round(lakh)} L`;
  return `₹${lakh.toFixed(1)} L`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatRupees(valueInr: number): string {
  if (valueInr >= 10000000) return formatCrore(valueInr);
  if (valueInr >= 100000) return formatLakh(valueInr);
  return `₹${Math.round(valueInr).toLocaleString('en-IN')}`;
}
