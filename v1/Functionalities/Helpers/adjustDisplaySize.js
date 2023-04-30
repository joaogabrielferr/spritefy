export default function AdjustDisplaySize(windowSize) {
  console.log(windowSize);

  if (windowSize <= 500) return 400;
  if (windowSize <= 600) return 500;
  if (windowSize <= 700) return 600;
  if (windowSize <= 800) return 700;
  if (windowSize <= 1000) return 700;
  if (windowSize > 1000) return (windowSize - (windowSize % 100)) * 0.5 - (((windowSize - (windowSize % 100)) * 0.5) % 100);
}
