const CDN = 'https://ddragon.leagueoflegends.com';

export function skinSplashUrl(championId: string, num: number) {
  return `${CDN}/cdn/img/champion/splash/${championId}_${num}.jpg`;
}

export function displaySkinName(champName: string, skinName: string) {
  return skinName?.toLowerCase() === 'default' ? champName : skinName;
}
