export const calculateTrend = (current, previous) => {
  if (!previous && current > 0) {
    return { direction: 'up', percentage: 100 };
  }

  if (!previous && current === 0) {
    return { direction: 'neutral', percentage: 0 };
  }

  const diff = current - previous;
  const percentage = ((diff / previous) * 100).toFixed(2);

  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    percentage: Math.abs(Number(percentage))
  };
};