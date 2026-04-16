import { generateCarouselImages, splitTextToSlides } from './src/lib/carousel-engine';

console.log("🔍 DIAGNOSTIC EXPORT CHECK:");
console.log("- generateCarouselImages:", typeof generateCarouselImages);
console.log("- splitTextToSlides:", typeof splitTextToSlides);

if (typeof splitTextToSlides === 'function') {
  console.log("✅ SUCCESS: splitTextToSlides is exported correctly.");
} else {
  console.log("❌ FAILURE: splitTextToSlides is NOT exported.");
}
