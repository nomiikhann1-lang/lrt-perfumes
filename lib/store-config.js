// Photo is the default. Set type:'video' and src:'/your-video.mp4' for a video hero.
export const mobileHero={type:'image',src:'/hero-mobile.webp',poster:'/hero-mobile.webp',alt:'LRT Perfumes campaign bottle with citrus and rose petals'};
export const markets={AE:{currency:'AED',label:'United Arab Emirates',flag:'/flags/ae.svg',shipping:20,freeAt:250},QA:{currency:'QAR',label:'Qatar',flag:'/flags/qa.svg',shipping:0,freeAt:0}};
export const scentFamilies=['Flowery','Fresh','Gourmand','Herbal','Earthy','Warm'];
export function scentFamily(p){return p.scentFamily||({Floral:'Flowery',Woody:'Earthy',Oud:'Earthy',Amber:'Warm'})[p.family]||p.family;}
