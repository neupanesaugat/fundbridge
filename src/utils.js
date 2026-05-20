export function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function getFundingPercent(campaign) {
  if (!campaign.goal) return 0;
  return Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
}
