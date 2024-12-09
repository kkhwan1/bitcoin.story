export const formatNumber = (number) => {
  return new Intl.NumberFormat('ko-KR').format(number);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}; 