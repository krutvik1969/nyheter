// Nyhetsappen service worker: skallet (ikoner/manifest) cache-først; sider og arkiv-JSON nettverk-først (alltid ferske nyheter, cache som reserve offline).
const V='nyh-v4';const SKALL=['./','./manifest.json','./ikoner/ikon-192.png','./ikoner/ikon-512.png','./ikoner/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SKALL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function nettForst(req){const c=await caches.open(V);try{const r=await fetch(req,{cache:'no-store'});if(r.ok)c.put(req,r.clone());return r;}catch(_){const m=await c.match(req,{ignoreSearch:true});if(m)return m;if(req.mode==='navigate'){const s=await c.match('./');if(s)return s;}throw _;}}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.includes('/arkiv/')){e.respondWith(nettForst(r));return;}
e.respondWith(caches.match(r).then(m=>m||fetch(r)));});
