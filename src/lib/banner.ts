export function generateBannerUrl(seed: string) {
  return `https://api.dicebear.com/10.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8ECAE6,023047,4682B4&backgroundType=gradientLinear&size=800&shapeColor=f0f8ff`
}
