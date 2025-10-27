export function cdnImage(image: string) {
  const webpImage = image.replace(/\.(png|PNG|jpg|JPG)$/, ".webp");
  return `https://images.asyncti4.com${webpImage}?v=2`;
}
