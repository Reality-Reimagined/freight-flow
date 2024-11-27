export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return '$0.00';
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatRatePerMile = (rate: number | null | undefined, distance: number | null | undefined): string => {
  if (!rate || !distance || distance === 0) return '$0.00';
  const ratePerMile = rate / distance;
  return formatCurrency(ratePerMile);
};