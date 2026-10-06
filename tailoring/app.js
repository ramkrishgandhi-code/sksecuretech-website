(()=>{
'use strict';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const STORE='skTailoringOrdersV19';
const draftKey='skTailoringDraftV19';
const today=()=>new Date().toISOString().slice(0,10);
const money=n=>'RM '+Number(n||0).toFixed(2);
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let orders=loadOrders();
const EXP_STORE='skTailoringExpensesV25';
let expenses=loadExpenses();
let page='dashboard', step=1, cat='women', activeMeasure='Bust / மார்பு', measureTab='Body', orderView='all', editingOrderId=null, showAllGarments=false, sideCollapsed=localStorage.getItem('skTailoringSideCollapsed')==='1';
let draft=loadDraft();
if(!draft) draft=freshDraft();
function freshDraft(){return{customer:'',phone:'',garment:null,category:'women',designNotes:'',photos:[],voiceNote:'',style:{sleeve:'Short',neck:'Round',opening:'Back hooks',lining:'No lining',padding:'No pad',aari:'None',fit:'Regular',notes:''},measurements:{},customMeasurements:[],stitching:'',aariCharge:'',advance:'',delivery:'',status:'New',created:today()}}
function loadOrders(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
function saveOrders(){localStorage.setItem(STORE,JSON.stringify(orders))}
function loadExpenses(){try{return JSON.parse(localStorage.getItem(EXP_STORE)||'[]')}catch(e){return[]}}
function saveExpenses(){localStorage.setItem(EXP_STORE,JSON.stringify(expenses))}
function loadDraft(){try{return JSON.parse(sessionStorage.getItem(draftKey)||'null')}catch(e){return null}}
function saveDraft(){sessionStorage.setItem(draftKey,JSON.stringify(draft))}
const cats={
 women:[
  ['blouse','Blouse','பிளவுஸ்'],['designer-blouse','Designer blouse','டிசைனர் பிளவுஸ்'],['saree','Ready-made saree','ரெடிமேட் சேலை'],['fall-pico','Saree fall & pico','சேலை ஃபால் / பிகோ'],['lehenga-skirt','Lehenga skirt','லெஹங்கா பாவாடை'],['lehenga-set','Lehenga set','லெஹங்கா செட்'],['kurti','Kurti / tunic','குர்தி'],['salwar','Salwar kameez set','சல்வார் கமீஸ்'],['churidar','Churidar set','சுடிதார் செட்'],['anarkali','Anarkali','அனார்கலி'],['gown','Gown / maxi dress','கவுன் / மேக்சி'],['western','Western dress','வெஸ்டர்ன் டிரஸ்'],['petticoat','Skirt / petticoat','பாவாடை / உள்ளாடை'],['palazzo','Palazzo / trousers','பலாசோ / பேன்ட்'],['ladies-shirt','Ladies shirt / top','பெண்கள் சட்டை / டாப்'],['nightwear-w','Nightwear','நைட்டி'],['alter-w','Alteration','திருத்தம்']],
 men:[['shirt','Shirt','சட்டை'],['trousers','Trousers / pants','பேன்ட்'],['veshti','Veshti / dhoti','வேட்டி'],['kurta','Kurta / jippa','குர்தா / ஜிப்பா'],['kurta-set','Kurta pajama set','குர்தா பைஜாமா'],['shorts','Shorts','ஷார்ட்ஸ்'],['waistcoat','Waistcoat','வெஸ்ட்கோட்'],['sherwani','Sherwani','ஷெர்வானி'],['nightwear-m','Men nightwear set','ஆண்கள் இரவு உடை'],['alter-m','Men alteration','ஆண்கள் திருத்தம்']],
 girls:[['frock','Girls frock','சிறுமிகள் ஃப்ராக்'],['girl-gown','Girls gown','சிறுமிகள் கவுன்'],['pattu-pavadai','Pattu pavadai set','பட்டு பாவாடை சட்டை'],['girl-lehenga','Girls lehenga set','சிறுமிகள் லெஹங்கா'],['girl-salwar','Girls salwar set','சிறுமிகள் சல்வார்'],['skirt-top','Girls skirt & top','சிறுமிகள் பாவாடை டாப்'],['girl-school','Girls school uniform','சிறுமிகள் பள்ளி சீருடை'],['girl-night','Girls nightwear','சிறுமிகள் இரவு உடை'],['girl-alter','Girls alteration','சிறுமிகள் திருத்தம்']],
 boys:[['boy-shirt','Boys shirt','சிறுவர்கள் சட்டை'],['boy-trousers','Boys trousers','சிறுவர்கள் பேன்ட்'],['boy-shorts','Boys shorts','சிறுவர்கள் ஷார்ட்ஸ்'],['boy-kurta','Boys kurta / jippa','சிறுவர்கள் குர்தா / ஜிப்பா'],['boy-veshti','Boys veshti','சிறுவர்கள் வேட்டி'],['boy-kurta-set','Boys kurta set','சிறுவர்கள் குர்தா செட்'],['boy-school','Boys school uniform','சிறுவர்கள் பள்ளி சீருடை'],['boy-suit','Boys suit / waistcoat','சிறுவர்கள் சூட்'],['boy-night','Boys nightwear','சிறுவர்கள் இரவு உடை'],['boy-alter','Boys alteration','சிறுவர்கள் திருத்தம்']]
};
const catLabels={women:'Women / பெண்கள்',men:'Men / ஆண்கள்',girls:'Girls / சிறுமிகள்',boys:'Boys / சிறுவர்கள்'};
const measureSets={
 blouse:['Bust / மார்பு','Under bust','Waist / இடுப்பு','Shoulder / தோள்','Blouse length / நீளம்','Front length','Back length','Bust point distance','Shoulder to bust point','Armhole','Sleeve length','Sleeve round','Front neck depth','Back neck depth','Waist round'],
 shirt:['Chest / மார்பு','Waist / இடுப்பு','Shoulder / தோள்','Shirt length','Sleeve length','Bicep round','Cuff round','Neck / கழுத்து','Armhole'],
 trousers:['Waist / இடுப்பு','Hip / இடுப்பு சுற்று','Thigh','Knee','Bottom','Rise','Inseam','Outseam / length'],
 dress:['Chest / மார்பு','Waist / இடுப்பு','Hip','Shoulder','Dress length','Sleeve length','Armhole','Neck depth','Waist to floor'],
 kurta:['Chest / மார்பு','Waist / இடுப்பு','Hip','Shoulder','Kurta length','Sleeve length','Armhole','Neck','Side slit'],
 skirt:['Waist / இடுப்பு','Hip','Skirt length','Bottom round'],
 alteration:['Area / பகுதி','Current size','Required size','Length change','Notes']
};
function garmentGroup(k){if(!k)return'blouse';if(/blouse/.test(k))return'blouse';if(/shirt|school/.test(k))return'shirt';if(/trouser|palazzo|short/.test(k))return'trousers';if(/kurta|sherwani/.test(k))return'kurta';if(/skirt|petticoat|veshti|saree|fall-pico/.test(k))return'skirt';if(/alter/.test(k))return'alteration';return'dress'}
function root(){return $('#app')}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function shell(content){return '<div class="app '+(sideCollapsed?'sideCollapsed':'')+'"><aside class="side" id="side"><div class="sideHead"><div><div class="brand">✂ <span>SK Tailoring</span></div><small>SHOP WORKSPACE</small></div><button class="sideCollapseBtn" id="sideCollapseBtn" title="Minimize sidebar">'+(sideCollapsed?'›':'‹')+'</button></div><nav class="nav">'+navBtn('dashboard','▦ Dashboard')+navBtn('new','＋ New Order')+navBtn('orders','▤ Work Orders')+navBtn('backup','⚙ Backup')+'</nav><div class="made">Made for your daily craft.</div></aside><main class="main page-'+page+'"><div class="mobileTop"><button class="pill" id="menuBtn">☰ Menu</button><b>✂ SK Tailoring</b></div><div class="topline"><div class="eyebrow">SK SECURE TECH / TAILORING</div><div class="status">● Online · Saved on this device</div></div>'+content+'<div class="copyright">Device version v35 · orders save in this browser. Export a backup before clearing browser data.</div></main></div>'}
function navBtn(p,label){return '<button data-nav="'+p+'" class="'+(page===p?'active':'')+'">'+label+'</button>'}
function bindShell(){
 $$('[data-nav]').forEach(b=>b.onclick=()=>{page=b.dataset.nav;if(page==='new'){editingOrderId=null;showAllGarments=false;step=1;draft=freshDraft();saveDraft()}const s=$('#side');if(s)s.classList.remove('open');render()});
 const m=$('#menuBtn');if(m)m.onclick=()=>$('#side').classList.toggle('open');
 const c=$('#sideCollapseBtn');if(c)c.onclick=()=>{sideCollapsed=!sideCollapsed;localStorage.setItem('skTailoringSideCollapsed',sideCollapsed?'1':'0');render()}
}
function dashSVG(type){
 const common='viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"';
 if(type==='new')return '<svg '+common+'><defs><linearGradient id="n1" x1="0" x2="1"><stop stop-color="#0d8b8c"/><stop offset="1" stop-color="#075d63"/></linearGradient></defs><rect width="420" height="220" fill="url(#n1)"/><circle cx="335" cy="62" r="82" fill="#ffffff14"/><circle cx="385" cy="190" r="110" fill="#ffffff0c"/><path d="M265 42c18 0 33 15 33 33s-15 33-33 33-33-15-33-33 15-33 33-33Zm93 0c18 0 33 15 33 33s-15 33-33 33-33-15-33-33 15-33 33-33Z" fill="none" stroke="#fff" stroke-width="10"/><path d="m289 91 101 101M334 92 238 188" stroke="#fff" stroke-width="11" stroke-linecap="round"/><path d="M228 178c45-34 92-43 146-28l23 70H201Z" fill="#e9d9b9" opacity=".78"/></svg>';
 if(type==='open')return '<svg '+common+'><rect width="420" height="220" fill="#eaf4ff"/><rect x="224" y="24" width="150" height="166" rx="18" fill="#fff" transform="rotate(7 299 107)"/><rect x="196" y="34" width="150" height="166" rx="18" fill="#fff"/><path d="M225 72h92M225 103h70M225 134h82" stroke="#8ba8c5" stroke-width="10" stroke-linecap="round"/><path d="m222 164 26 20 57-65" fill="none" stroke="#72a77f" stroke-width="11" stroke-linecap="round"/><circle cx="360" cy="46" r="70" fill="#b7d7f244"/></svg>';
 if(type==='queue')return '<svg '+common+'><rect width="420" height="220" fill="#fff2cc"/><circle cx="330" cy="112" r="84" fill="#fff8e2"/><circle cx="330" cy="112" r="52" fill="none" stroke="#d79b4c" stroke-width="20"/><circle cx="330" cy="112" r="16" fill="#d79b4c"/><path d="M214 192 404 20" stroke="#706254" stroke-width="9" stroke-linecap="round"/><path d="M218 194c-32-2-57 7-77 28" fill="none" stroke="#706254" stroke-width="5"/><path d="M120 160c48-26 88-18 116 24" fill="none" stroke="#c77f3e" stroke-width="6" stroke-dasharray="9 7"/></svg>';
 if(type==='ready')return '<svg '+common+'><rect width="420" height="220" fill="#e5f6e8"/><path d="M230 192h165l-22-117-43-24-42 24-43-24Z" fill="#2f8b74"/><path d="M280 70c15 16 31 16 48 0" fill="none" stroke="#fff" stroke-width="9"/><path d="m271 139 30 25 57-67" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="372" cy="51" r="67" fill="#ffffff55"/></svg>';
 if(type==='due')return '<svg '+common+'><rect width="420" height="220" fill="#e6f6f4"/><rect x="224" y="34" width="166" height="160" rx="20" fill="#fff"/><path d="M224 79h166" stroke="#5b938f" stroke-width="15"/><circle cx="264" cy="123" r="10" fill="#5b938f"/><circle cx="307" cy="123" r="10" fill="#5b938f"/><circle cx="350" cy="123" r="10" fill="#5b938f"/><path d="m273 165 22 18 51-54" fill="none" stroke="#d09b40" stroke-width="11" stroke-linecap="round"/></svg>';
 if(type==='over')return '<svg '+common+'><rect width="420" height="220" fill="#ffe5e2"/><path d="m309 24 105 184H204Z" fill="#fff"/><path d="M309 86v58" stroke="#d26058" stroke-width="17" stroke-linecap="round"/><circle cx="309" cy="173" r="11" fill="#d26058"/><circle cx="380" cy="38" r="68" fill="#ffffff55"/></svg>';
 return '<svg '+common+'><rect width="420" height="220" fill="#e7eefc"/><path d="M190 149h54l28-68h75l30 68h37v49H190Z" fill="#6686b9"/><path d="M244 149h134" stroke="#fff" stroke-width="8"/><circle cx="257" cy="198" r="24" fill="#394a62"/><circle cx="371" cy="198" r="24" fill="#394a62"/><path d="M271 81h76v68h-96Z" fill="#fff"/><path d="M288 102h42M288 121h31" stroke="#6686b9" stroke-width="7" stroke-linecap="round"/><path d="M207 132h34l18-43h-28Z" fill="#8ea9d0"/><circle cx="374" cy="54" r="75" fill="#ffffff66"/></svg>'
}

function visualFamily(k){
 if(!k)return'blouse';
 if(/alter/.test(k))return'alteration';
 if(k==='fall-pico')return'fallpico';
 if(k==='saree')return'saree';
 if(/veshti/.test(k))return'veshti';
 if(/waistcoat|boy-suit/.test(k))return'waistcoat';
 if(/trouser|palazzo/.test(k))return'trousers';
 if(/short/.test(k))return'shorts';
 if(/petticoat|lehenga-skirt/.test(k))return'skirt';
 if(/lehenga-set|girl-lehenga|pattu-pavadai/.test(k))return'lehenga';
 if(/blouse/.test(k))return'blouse';
 if(/shirt|school/.test(k))return'shirt';
 if(/kurta-set|boy-kurta-set/.test(k))return'kurta-set';
 if(/kurta|sherwani/.test(k))return'kurta';
 if(/salwar|churidar/.test(k))return'salwar';
 if(/frock/.test(k))return'frock';
 if(/anarkali/.test(k))return'anarkali';
 if(/gown/.test(k))return'gown';
 if(/western/.test(k))return'western';
 if(/skirt-top/.test(k))return'skirt-top';
 if(/night/.test(k))return'nightwear';
 return'dress'
}
const garmentPalettes=[
 ['#008B8C','#E7B246','#F7E9C6'],['#315F87','#E7A93B','#E9F2FA'],['#7A4E85','#D8A943','#F1E7F5'],
 ['#3F7D58','#D9A33D','#EAF4EA'],['#A34E49','#E6B24A','#FAE9E7'],['#165D78','#D59A32','#E4F2F7'],
 ['#7A6037','#2F878A','#F4EBDC'],['#8A3F63','#D7A640','#F7E8EF'],['#2F6A95','#E2A33D','#E7F0FA'],
 ['#558052','#D4A043','#EDF5E9'],['#9B5E3C','#2B8A86','#F8EADD'],['#594E8B','#D9A43E','#EFEAFA'],
 ['#0E777A','#C97F46','#E8F6F4'],['#814A45','#CFA242','#F8E8E5']
];
function paletteFor(k){
 const keys=Object.values(cats).flat().map(x=>x[0]);
 let idx=keys.indexOf(k);
 if(idx<0){idx=0;for(let i=0;i<String(k).length;i++)idx=(idx*33+String(k).charCodeAt(i))>>>0}
 const p=garmentPalettes[idx%garmentPalettes.length];
 return{main:p[0],accent:p[1],soft:p[2],skin:'#8E6D4A',paper:'#FCF6EA'}
}
function parseMeasureValue(v){
 if(v==null||v==='')return null;
 let s=String(v).trim().replace(/¼/g,'.25').replace(/½/g,'.5').replace(/¾/g,'.75');
 if(s.includes('+')){const nums=s.split('+').map(x=>parseFloat(x)).filter(Number.isFinite);return nums.length?nums.reduce((a,b)=>a+b,0):null}
 const m=s.match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):null
}
function findMeasure(map,re,fallback){
 for(const [k,v] of Object.entries(map||{})){if(re.test(String(k).toLowerCase())){const n=parseMeasureValue(v);if(Number.isFinite(n))return n}}
 return fallback
}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function garmentMetrics(map={}){
 const shoulder=findMeasure(map,/shoulder|தோள்/,15), bust=findMeasure(map,/bust|chest|மார்பு/,36), waist=findMeasure(map,/waist|இடுப்பு/,32),
 hip=findMeasure(map,/hip/,40), length=findMeasure(map,/length|outseam|நீளம்/,26), sleeve=findMeasure(map,/sleeve length/,9),
 bottom=findMeasure(map,/bottom|flare/,20), thigh=findMeasure(map,/thigh/,22), neck=findMeasure(map,/neck|கழுத்து/,15);
 return{
  shoulder:clamp(.50+(shoulder/15)*.50,.65,1.65),
  bust:clamp(.50+(bust/36)*.50,.65,1.65),
  waist:clamp(.50+(waist/32)*.50,.65,1.70),
  hip:clamp(.50+(hip/40)*.50,.65,1.70),
  length:clamp(.48+(length/26)*.52,.65,1.75),
  sleeve:clamp(.40+(sleeve/9)*.60,.30,1.90),
  bottom:clamp(.48+(bottom/20)*.52,.65,1.85),
  thigh:clamp(.50+(thigh/22)*.50,.65,1.70),
  neck:clamp(.55+(neck/15)*.45,.70,1.55)
 }
}
function styleValue(style,key,fallback=''){return (style&&style[key])||fallback}
function neckPath(style,cx=120,y=56){
 const n=String(styleValue(style,'neck',styleValue(style,'collar','Round'))).toLowerCase();
 if(n.includes('v neck')||n.includes('v-neck'))return'M '+(cx-16)+' '+y+' L '+cx+' '+(y+22)+' L '+(cx+16)+' '+y;
 if(n.includes('square'))return'M '+(cx-16)+' '+y+' V '+(y+18)+' H '+(cx+16)+' V '+y;
 if(n.includes('boat'))return'M '+(cx-22)+' '+(y+3)+' Q '+cx+' '+(y+12)+' '+(cx+22)+' '+(y+3);
 if(n.includes('high')||n.includes('mandarin'))return'M '+(cx-13)+' '+(y-3)+' H '+(cx+13)+' V '+(y+13)+' H '+(cx-13)+' Z';
 if(n.includes('band'))return'M '+(cx-18)+' '+y+' H '+(cx+18)+' V '+(y+9)+' H '+(cx-18)+' Z';
 if(n.includes('collarless'))return'M '+(cx-15)+' '+y+' Q '+cx+' '+(y+11)+' '+(cx+15)+' '+y;
 if(n.includes('low'))return'M '+(cx-19)+' '+y+' Q '+cx+' '+(y+28)+' '+(cx+19)+' '+y;
 return'M '+(cx-18)+' '+y+' Q '+cx+' '+(y+18)+' '+(cx+18)+' '+y
}
function sleeveDepth(style,metrics,base=32){
 const s=String(styleValue(style,'sleeve','Short')).toLowerCase();
 if(s.includes('sleeveless'))return 4;
 if(s.includes('long'))return Math.round(base*2.2*metrics.sleeve);
 if(s.includes('elbow'))return Math.round(base*1.45*metrics.sleeve);
 return Math.round(base*metrics.sleeve)
}
function garmentShape(k,style={},measurements={},mode='catalog'){
 const p=paletteFor(k), fam=visualFamily(k), m=garmentMetrics(measurements), cx=120;
 const main=p.main,accent=p.accent,soft=p.soft,paper=p.paper,skin=p.skin;
 const isLive=mode==='measure'||mode==='style';
 let body='',extras='';
 const sh=38*m.shoulder, chest=34*m.bust, waist=28*m.waist, hip=34*m.hip, len=92*m.length, sl=sleeveDepth(style,m,30);
 const yTop=62, yWaist=yTop+Math.min(58,len*.5), yBottom=Math.min(198,yTop+len);
 if(fam==='alteration'){
  body='<circle cx="78" cy="92" r="27" fill="none" stroke="'+main+'" stroke-width="9"/><circle cx="158" cy="92" r="27" fill="none" stroke="'+accent+'" stroke-width="9"/><path d="M98 111 188 195M99 111 187 28" stroke="#5B534A" stroke-width="9" stroke-linecap="round"/><path d="M43 184c36-25 70-25 104 0" fill="none" stroke="'+main+'" stroke-width="5" stroke-dasharray="8 6"/>';
 }else if(fam==='fallpico'){
  body='<path d="M48 64H184V153H48Z" rx="12" fill="'+main+'"/><path d="M48 128H184" stroke="'+accent+'" stroke-width="10"/><circle cx="178" cy="183" r="25" fill="none" stroke="'+accent+'" stroke-width="9"/><path d="M154 188 68 34" stroke="#61584F" stroke-width="6" stroke-linecap="round"/>';
 }else if(fam==='saree'){
  const w=42*m.waist,h=125*m.length;
  body='<path d="M'+(cx-w)+' 51 H '+(cx+w*.55)+' L '+(cx+w*.8)+' 91 L '+(cx+w*.35)+' 112 L '+(cx+w)+' '+Math.min(200,50+h)+' H '+(cx-w*.95)+' L '+(cx-w*.15)+' 111 L '+(cx-w*.75)+' 84 Z" fill="'+main+'"/><path d="M'+(cx-w*.55)+' 54 Q '+(cx+w*.75)+' 97 '+(cx+w*.45)+' '+Math.min(196,48+h)+'" fill="none" stroke="'+accent+'" stroke-width="9"/><path d="M'+(cx-w*.85)+' '+Math.min(180,45+h)+' H '+(cx+w*.8)+'" stroke="'+soft+'" stroke-width="6"/>';
 }else if(fam==='veshti'){
  const w=38*m.waist,h=128*m.length;
  body='<path d="M'+(cx-w)+' 50 H '+(cx+w)+' L '+(cx+w*.86)+' '+Math.min(205,50+h)+' H '+(cx-w*.86)+' Z" fill="#F5EFE2" stroke="'+main+'" stroke-width="3"/><path d="M'+(cx-w*.65)+' 50 V '+Math.min(205,50+h)+' M '+(cx+w*.55)+' 50 V '+Math.min(205,50+h)+'" stroke="'+accent+'" stroke-width="6"/><path d="M'+(cx-w*.82)+' '+Math.min(187,45+h)+' H '+(cx+w*.82)+'" stroke="'+accent+'" stroke-width="8"/>';
 }else if(fam==='trousers'||fam==='shorts'){
  const h=(fam==='shorts'?73:134)*m.length, w=35*m.waist, hw=42*m.hip, thigh=27*m.thigh, bw=(fam==='shorts'?25:19)*m.bottom;
  const bottomY=Math.min(205,58+h), splitY=112;
  body='<path d="M'+(cx-w)+' 53 H '+(cx+w)+' L '+(cx+hw)+' 89 L '+(cx+thigh)+' '+splitY+' L '+(cx+bw)+' '+bottomY+' H '+(cx-4)+' L '+cx+' 129 L '+(cx+4)+' '+bottomY+' H '+(cx-bw)+' L '+(cx-thigh)+' '+splitY+' L '+(cx-hw)+' 89 Z" fill="'+main+'"/><path d="M'+(cx-w)+' 65 H '+(cx+w)+'" stroke="'+accent+'" stroke-width="7"/>';
  if(String(styleValue(style,'pleat','')).toLowerCase().includes('double'))extras+='<path d="M108 71v35M132 71v35" stroke="'+soft+'" stroke-width="3"/>';
  else if(String(styleValue(style,'pleat','')).toLowerCase().includes('single'))extras+='<path d="M120 70v38" stroke="'+soft+'" stroke-width="3"/>';
 }else if(fam==='skirt'){
  const w=32*m.waist, hw=40*m.hip, bw=57*m.bottom, bottomY=Math.min(205,58+126*m.length);
  body='<path d="M'+(cx-w)+' 54 H '+(cx+w)+' L '+(cx+hw)+' 97 L '+(cx+bw)+' '+bottomY+' H '+(cx-bw)+' L '+(cx-hw)+' 97 Z" fill="'+main+'"/><path d="M'+(cx-w)+' 67 H '+(cx+w)+'" stroke="'+accent+'" stroke-width="7"/>';
  if(k==='lehenga-skirt')extras+='<path d="M'+(cx-bw*.85)+' '+(bottomY-20)+' H '+(cx+bw*.85)+'" stroke="'+accent+'" stroke-width="7"/><circle cx="'+(cx-18)+'" cy="120" r="4" fill="'+soft+'"/><circle cx="'+(cx+23)+'" cy="140" r="4" fill="'+soft+'"/>';
 }else if(fam==='lehenga'||fam==='skirt-top'){
  const sw=sh, topBottom=112, skirtW=58*m.bottom, bottomY=Math.min(207,114+88*m.length);
  body='<path d="M'+(cx-sw)+' 65 L '+(cx-25)+' 49 H '+(cx+25)+' L '+(cx+sw)+' 65 L '+(cx+sh*.8)+' 95 L '+(cx+25)+' 82 L '+(cx+20)+' '+topBottom+' H '+(cx-20)+' L '+(cx-25)+' 82 L '+(cx-sh*.8)+' 95 Z" fill="'+main+'"/><path d="M'+(cx-28)+' 113 H '+(cx+28)+' L '+(cx+skirtW)+' '+bottomY+' H '+(cx-skirtW)+' Z" fill="'+accent+'"/><path d="M'+(cx-skirtW*.8)+' '+(bottomY-17)+' H '+(cx+skirtW*.8)+'" stroke="'+soft+'" stroke-width="6"/>';
 }else if(fam==='waistcoat'){
  const w=chest,bottomY=Math.min(190,yTop+100*m.length);
  body='<path d="M'+(cx-w)+' 65 L '+(cx-18)+' 48 L '+cx+' 80 L '+(cx+18)+' 48 L '+(cx+w)+' 65 L '+(cx+w*.82)+' '+bottomY+' H '+cx+' L '+(cx-8)+' 97 L '+(cx-18)+' '+bottomY+' H '+(cx-w*.82)+' Z" fill="'+main+'"/><circle cx="'+cx+'" cy="112" r="4" fill="'+accent+'"/><circle cx="'+cx+'" cy="133" r="4" fill="'+accent+'"/>';
 }else{
  const isDress=['frock','anarkali','gown','western','dress','nightwear','salwar','kurta-set'].includes(fam);
  const isLong=['kurta','kurta-set','salwar','anarkali','gown','nightwear'].includes(fam);
  const torsoBottom=isDress?116:Math.min(184,yBottom);
  const leftShoulder=cx-sh,rightShoulder=cx+sh;
  const sleeveY=84+sl;
  const sleeveW=16*m.bust;
  let torso='<path d="M'+leftShoulder+' 67 L '+(cx-25)+' 49 H '+(cx+25)+' L '+rightShoulder+' 67 L '+(rightShoulder+sleeveW)+' '+Math.min(160,sleeveY)+' L '+(rightShoulder-5)+' '+Math.min(148,sleeveY-5)+' L '+(cx+chest)+' 92 L '+(cx+waist)+' '+torsoBottom+' H '+(cx-waist)+' L '+(cx-chest)+' 92 L '+(leftShoulder+5)+' '+Math.min(148,sleeveY-5)+' L '+(leftShoulder-sleeveW)+' '+Math.min(160,sleeveY)+' Z" fill="'+main+'"/>';
  if(fam==='blouse')torso=torso.replace('fill="'+main+'"','fill="'+main+'"');
  body=torso;
  extras+='<path d="'+neckPath(style,cx,49)+'" fill="'+(String(styleValue(style,'neck','')).toLowerCase().includes('high')?soft:'none')+'" stroke="'+paper+'" stroke-width="6" stroke-linejoin="round"/>';
  if(fam==='shirt')extras+='<path d="M'+cx+' 63 V '+torsoBottom+'" stroke="'+soft+'" stroke-width="3"/><path d="M'+(cx-16)+' 52 L '+cx+' 68 L '+(cx+16)+' 52" fill="none" stroke="'+paper+'" stroke-width="5"/><rect x="'+(cx-30)+'" y="96" width="18" height="16" rx="2" fill="'+accent+'"/>';
  if(fam==='blouse'&&k==='designer-blouse')extras+='<path d="M'+(cx-28)+' 104 Q '+cx+' 87 '+(cx+28)+' 104M'+(cx-26)+' 125 Q '+cx+' 108 '+(cx+26)+' 125" fill="none" stroke="'+accent+'" stroke-width="5"/>';
  if(isDress){
    const skirtW=(fam==='western'?48:60)*m.hip*(String(styleValue(style,'flare','')).toLowerCase().includes('full')?1.25:1);
    const bottomY=Math.min(208,112+(isLong?96:78)*m.length);
    extras+='<path d="M'+(cx-waist)+' 112 H '+(cx+waist)+' L '+(cx+skirtW)+' '+bottomY+' H '+(cx-skirtW)+' Z" fill="'+(fam==='salwar'?main:accent)+'"/>';
    if(fam==='salwar'||fam==='kurta-set')extras+='<path d="M'+(cx-28)+' 150 H '+(cx-5)+' L '+(cx-12)+' 205 H '+(cx-42)+' Z M '+(cx+5)+' 150 H '+(cx+28)+' L '+(cx+42)+' 205 H '+(cx+12)+' Z" fill="'+(fam==='salwar'?accent:main)+'"/>';
    if(fam==='frock')extras+='<circle cx="'+(cx-28)+'" cy="84" r="15" fill="'+accent+'" opacity=".45"/><circle cx="'+(cx+28)+'" cy="84" r="15" fill="'+accent+'" opacity=".45"/>';
    if(fam==='anarkali')extras+='<path d="M'+(cx-50)+' 174 H '+(cx+50)+' M '+(cx-57)+' 191 H '+(cx+57)+'" stroke="'+soft+'" stroke-width="5"/>';
  }else if(isLong){
    extras+='<path d="M'+(cx-waist)+' '+torsoBottom+' H '+(cx+waist)+' L '+(cx+waist*.9)+' '+Math.min(207,torsoBottom+58*m.length)+' H '+(cx-waist*.9)+' Z" fill="'+main+'"/>';
  }
 }
 return{body,extras,paper,p,metrics:m,fam}
}
function garmentSVG(k,style={},measurements={},mode='catalog'){
 const s=garmentShape(k,style,measurements,mode), p=s.p, id=('g'+String(k).replace(/[^a-z0-9]/gi,'')+Math.abs((String(style.sleeve||'')+String(style.neck||'')+String(style.flare||'')).split('').reduce((a,ch)=>a+ch.charCodeAt(0),0))) ;
 const light='#ffffff', dark='#183f43';
 let art=(s.body+s.extras)
   .split('fill="'+p.main+'"').join('fill="url(#'+id+'Main)"')
   .split('fill="'+p.accent+'"').join('fill="url(#'+id+'Accent)"')
   .split('fill="'+p.soft+'"').join('fill="url(#'+id+'Soft)"');
 return '<svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(titleFor(k))+'">'+
  '<defs>'+
   '<linearGradient id="'+id+'Main" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+p.main+'"/><stop offset=".42" stop-color="'+p.main+'"/><stop offset="1" stop-color="'+dark+'" stop-opacity=".48"/></linearGradient>'+
   '<linearGradient id="'+id+'Accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+p.accent+'"/><stop offset="1" stop-color="#9b6422"/></linearGradient>'+
   '<linearGradient id="'+id+'Soft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+light+'"/><stop offset="1" stop-color="'+p.soft+'"/></linearGradient>'+
   '<filter id="'+id+'Shadow" x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#153f43" flood-opacity=".18"/></filter>'+
  '</defs>'+
  '<rect width="240" height="220" rx="18" fill="#fffaf1"/>'+
  '<ellipse cx="120" cy="204" rx="62" ry="8" fill="#1b4d50" opacity=".08"/>'+
  '<g opacity=".96"><circle cx="120" cy="29" r="11" fill="'+p.skin+'"/><path d="M120 40V57" stroke="'+p.skin+'" stroke-width="5" stroke-linecap="round"/></g>'+
  '<g filter="url(#'+id+'Shadow)">'+art+'</g>'+
  '<path d="M68 63 Q120 49 172 63" fill="none" stroke="#fff" stroke-width="1.2" opacity=".22"/>'+
 '</svg>'
}
function styleSchemaFor(k){
 const fam=visualFamily(k);
 const commonFit={key:'fit',label:'Fit',type:'select',options:['Regular','Slim','Comfort','Custom']};
 if(fam==='blouse')return[
  {key:'sleeve',label:'Sleeve',type:'visual',options:['Short','Elbow','Long','Sleeveless','Custom']},
  {key:'neck',label:'Neck',type:'visual',options:['Round','V neck','Square','Boat','High neck','Low neck','Custom']},
  {key:'opening',label:'Opening',type:'select',options:['Back hooks','Front hooks','Zip','No opening','Custom']},
  {key:'lining',label:'Lining / உள்ளணி',type:'select',options:['No lining','Cotton lining','Full lining','Custom']},
  {key:'padding',label:'Padding / பேட்',type:'select',options:['No pad','Pad','Custom']},
  {key:'aari',label:'Aari / embroidery',type:'select',options:['None','Light','Medium','Heavy','Custom']},commonFit];
 if(fam==='shirt')return[
  {key:'sleeve',label:'Sleeve',type:'visual',options:['Short','Elbow','Long','Custom']},
  {key:'neck',label:'Collar / Neck',type:'visual',options:['Regular collar','Mandarin collar','Band collar','Collarless','Custom']},
  {key:'cuff',label:'Cuff',type:'select',options:['Plain','Button cuff','Double cuff','Custom']},
  {key:'pocket',label:'Pocket',type:'select',options:['No pocket','One pocket','Two pockets','Custom']},
  {key:'placket',label:'Front / Placket',type:'select',options:['Standard','Hidden','Half placket','Custom']},commonFit];
 if(fam==='trousers'||fam==='shorts')return[
  {key:'waistStyle',label:'Waist',type:'visual',options:['Regular waist','High waist','Elastic waist','Custom']},
  {key:'bottomStyle',label:'Bottom',type:'visual',options:['Straight','Tapered','Wide','Cuff','Custom']},
  {key:'pleat',label:'Pleat',type:'select',options:['No pleat','Single pleat','Double pleat','Custom']},
  {key:'pocket',label:'Pocket',type:'select',options:['Side pockets','Cross pockets','Back pocket','No pocket','Custom']},commonFit];
 if(fam==='skirt'||fam==='lehenga'||fam==='skirt-top')return[
  {key:'waistStyle',label:'Waist',type:'visual',options:['Band waist','Elastic waist','Drawstring','Custom']},
  {key:'flare',label:'Flare / Shape',type:'visual',options:['Straight','Medium flare','Full flare','Custom']},
  {key:'border',label:'Border',type:'select',options:['No border','Simple border','Heavy border','Custom']},
  {key:'lining',label:'Lining',type:'select',options:['No lining','Cotton lining','Full lining','Custom']},commonFit];
 if(fam==='saree')return[
  {key:'drape',label:'Drape',type:'visual',options:['Classic','Front pleat','Ready pleat','Custom']},
  {key:'pallu',label:'Pallu',type:'visual',options:['Regular','Long pallu','Pinned','Custom']},
  {key:'finish',label:'Finish',type:'select',options:['Plain','Border','Decorative','Custom']},
  {key:'fit',label:'Waist fit',type:'select',options:['Regular','Snug','Comfort','Custom']}];
 if(fam==='fallpico')return[
  {key:'finish',label:'Edge finish',type:'visual',options:['Pico','Rolled pico','Wide pico','Custom']},
  {key:'fall',label:'Fall',type:'select',options:['No fall','Cotton fall','Premium fall','Custom']}];
 if(fam==='veshti')return[
  {key:'border',label:'Border',type:'visual',options:['Plain','Single border','Double border','Custom']},
  {key:'pleat',label:'Pleat',type:'select',options:['Standard','Ready pleat','Custom']},
  {key:'fit',label:'Waist fit',type:'select',options:['Regular','Snug','Comfort','Custom']}];
 if(fam==='waistcoat')return[
  {key:'neck',label:'Front / Neck',type:'visual',options:['V neck','Round','High neck','Custom']},
  {key:'pocket',label:'Pocket',type:'select',options:['No pocket','Two pockets','Three pockets','Custom']},commonFit];
 if(fam==='alteration')return[
  {key:'area',label:'Alteration area',type:'visual',options:['Length','Waist','Sleeve','Shoulder','Neck','Custom']},
  {key:'change',label:'Change',type:'select',options:['Reduce','Increase','Repair','Replace','Custom']}];
 return[
  {key:'sleeve',label:'Sleeve',type:'visual',options:['Short','Elbow','Long','Sleeveless','Custom']},
  {key:'neck',label:'Neck',type:'visual',options:['Round','V neck','Square','Boat','High neck','Low neck','Custom']},
  {key:'flare',label:'Shape / Flare',type:'visual',options:['Straight','Medium flare','Full flare','Custom']},
  {key:'opening',label:'Opening',type:'select',options:['Back','Front','Zip','No opening','Custom']},
  {key:'lining',label:'Lining',type:'select',options:['No lining','Cotton lining','Full lining','Custom']},
  {key:'aari',label:'Embroidery',type:'select',options:['None','Light','Medium','Heavy','Custom']},commonFit]
}
function ensureStyleDefaults(k){
 const schema=styleSchemaFor(k);draft.style=draft.style||{};
 schema.forEach(g=>{if(!draft.style[g.key])draft.style[g.key]=g.options[0]});
 if(draft.style.notes==null)draft.style.notes=''
}
function optionIconSVG(kind,val){
 const p='#0B8587',a='#E1A83E',bg='#FCF6EA',ink='#31565A',v=String(val).toLowerCase();
 let d='';
 if(kind==='sleeve'){
  const end=v.includes('long')?168:v.includes('elbow')?144:v.includes('sleeveless')?112:v.includes('custom')?150:130;
  d='<path d="M44 45 Q73 27 101 42 L '+end+' 68 Q '+(end-5)+' 84 '+(end-18)+' 88 L96 68 Q70 78 48 72Z" fill="'+p+'"/><path d="M96 43v50" stroke="'+a+'" stroke-width="4" stroke-dasharray="5 5"/>';
  if(v.includes('custom'))d+='<path d="M34 114h122" stroke="'+ink+'" stroke-width="3" stroke-dasharray="7 5"/>';
 }else if(kind==='neck'){
  let n='M48 42 Q95 93 142 42';if(v.includes('v neck'))n='M48 42 L95 100 L142 42';if(v.includes('square'))n='M52 42V90H138V42';if(v.includes('boat'))n='M40 55 Q95 81 150 55';if(v.includes('high')||v.includes('mandarin'))n='M69 35H121V82H69Z';if(v.includes('low'))n='M43 40 Q95 120 147 40';if(v.includes('band'))n='M62 38H128V68H62Z';if(v.includes('collarless'))n='M55 45 Q95 75 135 45';if(v.includes('custom'))n='M45 45 Q70 90 95 60 Q120 92 145 45';
  d='<path d="M28 32H162V125H28Z" rx="18" fill="'+p+'" opacity=".95"/><path d="'+n+'" fill="'+bg+'" stroke="'+a+'" stroke-width="8" stroke-linejoin="round"/>';
 }else if(kind==='flare'||kind==='bottomStyle'){
  const w=v.includes('full')||v.includes('wide')?72:v.includes('medium')?56:v.includes('taper')?32:v.includes('cuff')?38:44;
  d='<path d="M73 28h44L'+(95+w)+' 127H'+(95-w)+'Z" fill="'+p+'"/><path d="M'+(95-w+8)+' 112H'+(95+w-8)+'" stroke="'+a+'" stroke-width="'+(v.includes('cuff')?12:6)+'"/>';
 }else if(kind==='waistStyle'){
  const band=v.includes('high')?18:v.includes('elastic')?12:8;
  d='<path d="M46 47h98l12 78H34Z" fill="'+p+'"/><rect x="46" y="42" width="98" height="'+band+'" rx="5" fill="'+a+'"/>';
  if(v.includes('elastic'))d+='<path d="M50 48q8 8 16 0t16 0t16 0t16 0t16 0" fill="none" stroke="'+bg+'" stroke-width="3"/>';
 }else if(kind==='border'){
  d='<path d="M47 27h96l13 103H34Z" fill="#F5EFE1"/><path d="M38 104h114" stroke="'+a+'" stroke-width="8"/>'+(v.includes('double')?'<path d="M40 118h110" stroke="'+p+'" stroke-width="6"/>':'');
 }else if(kind==='drape'||kind==='pallu'){
  d='<path d="M65 26h53l17 39-18 18 34 50H40l31-50-18-18Z" fill="'+p+'"/><path d="M75 29q63 34 50 100" fill="none" stroke="'+a+'" stroke-width="'+(v.includes('long')?12:8)+'"/>';
 }else if(kind==='finish'){
  d='<path d="M30 75H160" stroke="'+p+'" stroke-width="32"/><path d="M30 76H160" stroke="'+a+'" stroke-width="'+(v.includes('wide')?10:5)+'"/>';
 }else if(kind==='area'){
  d='<circle cx="61" cy="63" r="25" fill="none" stroke="'+p+'" stroke-width="8"/><circle cx="129" cy="63" r="25" fill="none" stroke="'+a+'" stroke-width="8"/><path d="m80 82 69 64M80 82l69-69" stroke="#5C544C" stroke-width="8"/>';
 }else{
  d='<rect x="34" y="28" width="122" height="94" rx="22" fill="'+p+'"/><path d="M54 76h82" stroke="'+a+'" stroke-width="9"/>';
 }
 return '<svg viewBox="0 0 190 150" xmlns="http://www.w3.org/2000/svg"><rect width="190" height="150" rx="14" fill="'+bg+'"/>'+d+'</svg>'
}
function styleCard(kind,val,on,garment){
 const g=garment||draft.garment||'blouse', next={...(draft.style||{})};next[kind]=val;
 return '<button type="button" class="styleCard visualOption '+(on?'active':'')+'" data-style="'+kind+'" data-value="'+esc(val)+'"><div class="styleGarmentThumb">'+garmentSVG(g,next,{},'style')+'</div><div>'+esc(val)+'</div>'+(on?'<i>✓</i>':'')+'</button>'
}
function measurementSchemaFor(k){
 const fam=visualFamily(k);
 if(fam==='blouse')return{Body:['Bust / மார்பு','Under bust','Waist / இடுப்பு','Shoulder / தோள்','Blouse length / நீளம்','Front length','Back length','Bust point distance','Shoulder to bust point','Waist round'],Sleeve:['Armhole','Sleeve length','Sleeve round'],Neck:['Front neck depth','Back neck depth']};
 if(fam==='shirt')return{Body:['Chest / மார்பு','Waist / இடுப்பு','Shoulder / தோள்','Shirt length','Front length','Back length'],Sleeve:['Armhole','Sleeve length','Bicep round','Cuff round'],Neck:['Neck / கழுத்து','Collar height']};
 if(fam==='trousers'||fam==='shorts')return{Lower:['Waist / இடுப்பு','Hip','Thigh','Knee','Bottom','Rise','Inseam','Outseam / length']};
 if(fam==='skirt')return{Body:['Waist / இடுப்பு','Hip','Skirt length','Bottom / flare']};
 if(fam==='lehenga'||fam==='skirt-top')return{Body:['Waist / இடுப்பு','Hip','Waist to floor','Skirt length','Bottom / flare'],Top:['Chest / மார்பு','Shoulder / தோள்','Top length']};
 if(fam==='saree')return{Body:['Waist / இடுப்பு','Hip','Full length','Pallu length','Pleat depth']};
 if(fam==='fallpico')return{Body:['Saree length','Fall length','Fall width','Pico allowance']};
 if(fam==='veshti')return{Body:['Waist / இடுப்பு','Hip','Veshti length','Bottom']};
 if(fam==='alteration')return{Alteration:['Area / பகுதி','Current size','Required size','Length change','Waist change','Sleeve change','Notes']};
 if(fam==='waistcoat')return{Body:['Chest / மார்பு','Waist / இடுப்பு','Shoulder / தோள்','Waistcoat length','Front length','Back length'],Neck:['Neck / கழுத்து']};
 if(fam==='kurta'||fam==='kurta-set')return{Body:['Chest / மார்பு','Waist / இடுப்பு','Hip','Shoulder / தோள்','Kurta length','Side slit'],Sleeve:['Armhole','Sleeve length','Sleeve round'],Neck:['Neck / கழுத்து','Front neck depth','Back neck depth']};
 return{Body:['Chest / மார்பு','Bust','Waist / இடுப்பு','Hip','Shoulder / தோள்','Dress length','Front length','Back length','Waist to floor'],Sleeve:['Armhole','Sleeve length','Sleeve round'],Neck:['Neck / கழுத்து','Front neck depth','Back neck depth']}
}
function liveMeasureSVG(k,measurements={},activeField=''){
 const p=paletteFor(k), fam=visualFamily(k), base=garmentSVG(k,draft.style,measurements,'measure');
 const active=String(activeField||''), val=measurements[active]||'—';
 const label=esc(active||'Measurement'), value=esc(String(val));
 let guide='';
 const low=active.toLowerCase();
 if(/shoulder/.test(low))guide='<path d="M74 69H166" class="dim"/><path d="m74 69 8-5v10Zm92 0-8-5v10Z" class="arrow"/>';
 else if(/bust|chest|மார்பு/.test(low))guide='<path d="M67 101H173" class="dim"/><path d="m67 101 8-5v10Zm106 0-8-5v10Z" class="arrow"/>';
 else if(/waist|இடுப்பு/.test(low))guide='<path d="M76 128H164" class="dim"/><path d="m76 128 8-5v10Zm88 0-8-5v10Z" class="arrow"/>';
 else if(/hip|thigh|bottom|flare/.test(low))guide='<path d="M63 157H177" class="dim"/><path d="m63 157 8-5v10Zm114 0-8-5v10Z" class="arrow"/>';
 else if(/length|outseam|inseam|நீளம்/.test(low))guide='<path d="M190 56V194" class="dim"/><path d="m190 56-5 8h10Zm0 138-5-8h10Z" class="arrow"/>';
 else if(/sleeve|armhole|bicep|cuff/.test(low))guide='<path d="M44 82 73 131" class="dim"/><path d="m44 82 1 10 8-5Zm29 49-1-10-8 5Z" class="arrow"/>';
 else if(/neck/.test(low))guide='<path d="M103 55H137" class="dim"/><path d="m103 55 8-5v10Zm34 0-8-5v10Z" class="arrow"/>';
 return '<div class="liveMeasureSvg"><div class="liveGarmentCanvas">'+base.replace('<svg ','<svg class="garmentBase" ')+'<svg class="measureOverlay" viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg"><style>.dim{stroke:#E05A4F;stroke-width:4;fill:none;stroke-linecap:round}.arrow{fill:#E05A4F}</style>'+guide+'</svg></div><div class="measureLiveLabel"><span>'+label+'</span><b>'+value+'</b></div><small>Visual preview only — final cutting follows tailor measurements.</small></div>'
}

function installGlobalRouter(){
 if(window.__skTailoringRouterInstalled)return;
 window.__skTailoringRouterInstalled=true;
 document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-nav]');
  if(nav){e.preventDefault();page=nav.dataset.nav;if(page==='new'){editingOrderId=null;showAllGarments=false;step=1;draft=freshDraft();saveDraft()}const s=$('#side');if(s)s.classList.remove('open');render();return}
  const dash=e.target.closest('[data-dash]');
  if(dash){e.preventDefault();const t=dash.dataset.dash;if(t==='new'){editingOrderId=null;page='new';step=1;draft=freshDraft();saveDraft()}else{orderView=t;page='orders'}render();return}
  const ov=e.target.closest('[data-order-view]');
  if(ov){e.preventDefault();orderView=ov.dataset.orderView;page='orders';render();return}
  const op=e.target.closest('[data-open]');
  if(op){e.preventDefault();openOrder(op.dataset.open);return}
 },true)
}
installGlobalRouter();
function render(){let c=page==='dashboard'?dashboard():page==='new'?newOrder():page==='orders'?workOrders():page==='customers'?customersPage():page==='accounts'?accountsPage():page==='payments'?paymentsPage():page==='expenses'?expensesPage():page==='reports'?reportsPage():backup();root().innerHTML=shell(c);bindShell();bindPage()}
function dashboard(){
 const open=orders.filter(o=>o.status!=='Delivered').length, queue=orders.filter(o=>o.status==='In Progress').length, ready=orders.filter(o=>o.status==='Ready').length, due=orders.filter(o=>o.delivery===today()&&o.status!=='Delivered').length, over=orders.filter(o=>o.delivery&&o.delivery<today()&&o.status!=='Delivered').length,del=orders.filter(o=>o.status==='Delivered').length;
 const cards=[
  ['new','New order','＋','Create order','c1'],
  ['open','Open orders',open,'Awaiting collection','c2'],
  ['queue','Work queue',queue,'In production','c3'],
  ['ready','Ready',ready,'Completed','c4'],
  ['due','Due today',due,'Collect today','c5'],
  ['over','Overdue',over,'Past collection','c6'],
  ['delivered','Delivered',del,'Collected','c7']
 ];
 const modules=[
  ['customers','👤','Customers','Live'],
  ['accounts','RM','Accounts','Live'],
  ['payments','✓','Payments','Live'],
  ['expenses','↗','Expenses','Live'],
  ['reports','▥','Reports','Live'],
  ['backup','⚙','Backup','Live']
 ];
 return '<div class="dashHeader"><div><h1 class="h1">Your shop at a glance</h1><p class="sub">Daily tailoring workspace · '+today()+'</p></div><div class="dashLegend">One-screen dashboard</div></div>'+
 '<div class="dashWorkspace">'+
  '<section class="statusTiles">'+cards.map(x=>'<button class="statusTile '+x[4]+'" data-dash="'+x[0]+'"><div class="tileText"><span class="tileLabel">'+x[1]+'</span><strong>'+x[2]+'</strong><small>'+x[3]+'</small></div><div class="tileArt">'+dashSVG(x[0])+'</div></button>').join('')+'</section>'+
  '<section class="moduleSection"><div class="moduleTitle"><b>Business modules</b><span>Tap any tile to open the module</span></div><div class="moduleGrid">'+modules.map(m=>'<button class="moduleTile" data-nav="'+m[0]+'"><span class="moduleIcon">'+m[1]+'</span><b>'+m[2]+'</b><small>'+m[3]+'</small></button>').join('')+'</div></section>'+
  '<section class="nextBar"><div><span class="miniLabel">NEXT COLLECTIONS</span><b>Upcoming customer handovers</b></div><div class="nextBarOrders">'+nextCollectionsCompact()+'</div><button class="miniAction" data-nav="orders">View all →</button></section>'+
 '</div>'
}
function nextCollectionsCompact(){
 const list=orders.filter(o=>o.status!=='Delivered'&&o.delivery).sort((a,b)=>a.delivery.localeCompare(b.delivery)).slice(0,2);
 if(!list.length)return'<span class="nextEmpty">No upcoming collections</span>';
 return list.map(o=>'<button class="nextChip" data-open="'+o.id+'"><b>'+esc(o.customer)+'</b><span>'+esc(titleFor(o.garment))+' · '+esc(o.delivery)+'</span></button>').join('')
}
function nextCollections(){const list=orders.filter(o=>o.status!=='Delivered'&&o.delivery).sort((a,b)=>a.delivery.localeCompare(b.delivery)).slice(0,5);if(!list.length)return'<div class="empty"><div><div style="font-size:30px">✂</div><h3>No orders yet</h3><p>Create your first customer order to get started.</p></div></div>';return'<div class="orders">'+list.map(orderCard).join('')+'</div>'}
function newOrder(){
 const steps=['1. Customer','2. Dress + Design','3. Style','4. Measurements','5. Charges + Dates','6. Review'];
 return '<div class="orderFlowHead"><div><h1 class="h1">'+(editingOrderId?'Edit tailoring order':'New tailoring order')+'</h1><p class="sub">Design first · டிசைன் தேர்வு செய்து பிறகு அளவுகள்</p></div>'+(editingOrderId?'<span class="editBadge">Editing existing order</span>':'')+'</div><div class="steps">'+steps.map((s,i)=>'<div class="step '+(step===i+1?'active':'')+'">'+s+'</div>').join('')+'</div><section class="panel orderStep orderStep'+step+'">'+stepContent()+'</section><div class="actions orderActions"><button class="btn secondary" id="backBtn">← Back</button><button class="btn primary" id="nextBtn">'+(step===6?(editingOrderId?'Update Order':'Confirm & Save'):'Continue →')+'</button></div>'
}
function stepContent(){if(step===1)return customerStep();if(step===2)return dressStep();if(step===3)return styleStep();if(step===4)return measureStep();if(step===5)return chargesStep();return reviewStep()}
function normText(v){return String(v||'').trim().toLowerCase()}
function customerDirectory(){
 const map=new Map();
 orders.forEach(o=>{
  const name=String(o.customer||'').trim();if(!name)return;
  const phone=String(o.phone||'').trim();
  const key=normText(name)+'|'+phone.replace(/\D/g,'');
  if(!map.has(key))map.set(key,{key,name,phone,orders:[],last:''});
  const c=map.get(key);c.orders.push(o);
  const d=o.delivery||o.created||'';if(d>c.last)c.last=d
 });
 return [...map.values()].sort((a,b)=>(b.last||'').localeCompare(a.last||'')||a.name.localeCompare(b.name))
}
function customerMatches(q){
 const s=normText(q), digits=String(q||'').replace(/\D/g,'');
 const all=customerDirectory();
 if(!s&&!digits)return all.slice(0,6);
 return all.filter(c=>normText(c.name).includes(s)||(digits&&c.phone.replace(/\D/g,'').includes(digits))).slice(0,8)
}
function matchingCustomerHistory(name,phone){
 const n=normText(name),p=String(phone||'').replace(/\D/g,'');
 if(!n)return[];
 return orders.filter(o=>normText(o.customer)===n&&(!p||String(o.phone||'').replace(/\D/g,'')===p))
  .sort((a,b)=>String(b.delivery||b.created||'').localeCompare(String(a.delivery||a.created||'')))
}
function customerSuggestionHTML(list){
 if(!list.length)return '<div class="customerNoMatch">No previous customer found</div>';
 return list.map((c,i)=>{
  const last=c.orders.slice().sort((a,b)=>String(b.delivery||b.created||'').localeCompare(String(a.delivery||a.created||'')))[0];
  return '<button type="button" class="customerSuggestion" data-customer-key="'+esc(c.key)+'"><span class="customerInitial">'+esc(c.name.charAt(0).toUpperCase())+'</span><span class="customerSuggestionMain"><b>'+esc(c.name)+'</b><small>'+esc(c.phone||'No phone')+'</small></span><span class="customerSuggestionMeta"><b>'+c.orders.length+' order'+(c.orders.length===1?'':'s')+'</b><small>'+esc(last?titleFor(last.garment):'')+'</small></span></button>'
 }).join('')
}
function customerHistoryHTML(name,phone){
 const list=matchingCustomerHistory(name,phone).slice(0,4);
 if(!list.length)return '<div class="customerHistoryEmpty">No previous orders for this customer.</div>';
 return '<div class="customerHistoryList">'+list.map(o=>'<div class="customerHistoryRow"><div><b>'+esc(titleFor(o.garment))+'</b><small>'+esc(o.delivery||o.created||'No date')+'</small></div><span class="badge">'+esc(o.status||'New')+'</span><div><span>Paid</span><b>'+money(o.advance||0)+'</b></div></div>').join('')+'</div>'
}
function customerStep(){
 const hist=customerHistoryHTML(draft.customer,draft.phone);
 return '<div class="customerStepV31"><div class="customerEntry"><h2 class="sectionTitle">Customer / வாடிக்கையாளர்</h2><p class="sub">Type a previous customer name or phone to search saved order history.</p><div class="form2"><div class="field customerLookup"><label>Customer name *</label><input id="customer" autocomplete="off" value="'+esc(draft.customer)+'" placeholder="Start typing name" /><div id="customerSuggestions" class="customerSuggestions" hidden></div></div><div class="field"><label>Phone</label><input id="phone" inputmode="tel" autocomplete="off" value="'+esc(draft.phone)+'" placeholder="Phone number" /></div></div></div><aside class="previousCustomerPanel"><div class="previousCustomerHead"><div><span class="miniLabel">PREVIOUS CUSTOMER</span><h3>Order history</h3></div><span id="historyCount" class="historyCount">'+matchingCustomerHistory(draft.customer,draft.phone).length+' saved</span></div><div id="customerHistory">'+hist+'</div></aside></div>'
}

function dressStep(){
 const garments=cats[cat], limit=8, shown=showAllGarments?garments:garments.slice(0,limit);
 return '<div class="dressV33"><div class="dressTop"><div><h2 class="sectionTitle">Choose dress / உடை தேர்வு</h2><p class="sub">Picture first — choose the garment by looking at the design.</p></div><div class="categoryVisualTabs">'+Object.keys(cats).map(k=>'<button type="button" class="'+(cat===k?'active':'')+'" data-cat="'+k+'"><span>'+({women:'👗',men:'👔',girls:'🎀',boys:'🧒'}[k])+'</span><b>'+catLabels[k].split(' / ')[0]+'</b><small>'+catLabels[k].split(' / ')[1]+'</small></button>').join('')+'</div></div>'+
 '<div class="dressMainV34"><section><div class="garmentVisualGrid">'+shown.map(([k,en,ta])=>'<button type="button" class="garmentVisualCard '+(draft.garment===k?'active':'')+'" data-garment="'+k+'"><div class="garmentVisualArt">'+garmentSVG(k,draft.garment===k?draft.style:{})+'</div><div class="garmentVisualLabel"><b>'+en+'</b><span>'+ta+'</span></div>'+(draft.garment===k?'<i>✓</i>':'')+'</button>').join('')+'</div>'+(garments.length>limit?'<button type="button" class="moreGarments" data-more-garments="1">'+(showAllGarments?'Show less ↑':'More designs ('+(garments.length-limit)+') ↓')+'</button>':'')+'</section></div>'+
 '<details class="designRefPanel designRefCompact referenceDetails"><summary><span>📷 Customer design reference</span><small>Optional · photo / instructions / voice</small></summary><div class="referenceDetailsBody"><div class="designRefTop"><div><span class="miniLabel">CUSTOMER DESIGN</span><h3>Reference & instructions</h3></div>'+(draft.garment?'<span class="selectedGarmentPill">'+esc(titleFor(draft.garment))+'</span>':'')+'</div><div class="field"><label>Design photo (up to 3)</label><input id="photoInput" type="file" accept="image/*" multiple /></div><div class="photos compactPhotos">'+(draft.photos||[]).map((p,i)=>'<div class="photoWrap"><img src="'+p+'" alt="design" /><button type="button" data-photo-remove="'+i+'">×</button></div>').join('')+'</div><div class="field"><label>Requested design / alteration instructions</label><textarea id="designNotes" rows="3">'+esc(draft.designNotes)+'</textarea></div><div class="voiceBox compactVoice"><b>🎙 Voice instructions</b><div class="quick"><button class="pill" id="voiceBtn">Voice → text</button><button class="pill" id="recordBtn">Record audio</button></div><small id="voiceState">'+esc(draft.voiceNote||'')+'</small></div></div></details></div>'
}
function selectedDesignVisual(g){
 if(draft.photos&&draft.photos[0])return '<img class="selectedPhoto" src="'+draft.photos[0]+'" alt="Customer selected design" />';
 return garmentSVG(g||'blouse')
}

function styleStep(){
 const g=draft.garment||'blouse';ensureStyleDefaults(g);
 const schema=styleSchemaFor(g), visual=schema.filter(x=>x.type==='visual'), selects=schema.filter(x=>x.type==='select');
 const ref=(draft.photos&&draft.photos[0])?'<div class="styleCustomerRef"><span>Customer reference</span><img src="'+draft.photos[0]+'" alt="Customer reference"></div>':'';
 return '<div class="styleV34"><section class="styleHero"><div class="styleHeroArt">'+garmentSVG(g,draft.style,{},'style')+'</div><div class="styleHeroInfo"><span class="miniLabel">LIVE STYLE PREVIEW</span><h2>'+esc(titleFor(g))+'</h2><p>One garment preview. Sleeve, neck and garment-specific options update this preview.</p><div class="stylePicked">'+visual.map(x=>'<span>'+esc(x.label)+' <b>'+esc(styleValue(draft.style,x.key,x.options[0]))+'</b></span>').join('')+'</div>'+ref+'</div></section>'+
 '<div class="styleGroupsV34">'+visual.map(group=>'<section class="visualOptionGroup"><div class="groupHead"><div><span class="miniLabel">CHOOSE</span><h3>'+esc(group.label)+'</h3></div><span>'+esc(styleValue(draft.style,group.key,group.options[0]))+'</span></div><div class="visualOptionGridV34">'+group.options.map(v=>styleCard(group.key,v,styleValue(draft.style,group.key,group.options[0])===v,g)).join('')+'</div></section>').join('')+'</div>'+
 '<section class="styleSelectPanel"><div class="styleSelectGrid">'+selects.map(group=>'<div class="field"><label>'+esc(group.label)+'</label><select data-style-select="'+group.key+'" id="styleSel_'+group.key+'">'+group.options.map(v=>'<option '+(styleValue(draft.style,group.key,group.options[0])===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></div>').join('')+'<div class="field notesField"><label>Style / fabric / colour notes</label><textarea id="styleNotes" rows="2">'+esc(draft.style.notes||'')+'</textarea></div></div></section></div>'
}
function sel(k,arr){return '<select id="'+k+'">'+arr.map(v=>'<option '+(draft.style[k]===v?'selected':'')+'>'+v+'</option>').join('')+'</select>'}
function titleFor(k){for(const group of Object.values(cats)){const f=group.find(x=>x[0]===k);if(f)return f[1]}return 'Garment'}

function measureSection(field){
 const s=String(field||'').toLowerCase();
 if(/neck|கழுத்து/.test(s))return'Neck';
 if(/sleeve|bicep|cuff|armhole/.test(s))return'Sleeve';
 if(/waist change|length change|required size|current size/.test(s))return'Alteration';
 if(/thigh|knee|rise|inseam|outseam/.test(s))return'Lower';
 return'Body'
}
function fieldsForMeasureTab(garment,tab){
 const schema=measurementSchemaFor(garment), base=schema[tab]||[];
 const custom=(draft.customMeasurements||[]).filter(x=>x.tab===tab).map(x=>x.name);
 return [...base,...custom]
}
function measureStep(){
 const g=draft.garment||'blouse', schema=measurementSchemaFor(g), tabs=Object.keys(schema);
 if(!tabs.includes(measureTab))measureTab=tabs[0];
 const fields=fieldsForMeasureTab(g,measureTab);
 if(!fields.includes(activeMeasure))activeMeasure=fields[0]||'';
 return '<div class="measureV34"><div class="measureHeadV34"><div><span class="miniLabel">SELECTED GARMENT</span><h2 class="sectionTitle">'+esc(titleFor(g))+' measurements</h2><p class="sub">Tap a field, enter the size, and watch that area change in the garment preview.</p></div><div class="measureTabs">'+tabs.map(t=>'<button type="button" class="'+(measureTab===t?'active':'')+'" data-measuretab="'+t+'">'+({Body:'▣',Sleeve:'◩',Neck:'⌁',Lower:'▤',Top:'◫',Alteration:'✂'}[t]||'•')+' '+t+' · '+fieldsForMeasureTab(g,t).length+'</button>').join('')+'</div></div>'+
 '<div class="measureLayoutV34"><aside class="measurePreviewV34"><div class="dynamicPreviewHead"><div><span class="miniLabel">LIVE MEASUREMENT PREVIEW</span><b>'+esc(titleFor(g))+'</b></div><span class="activeMeasurementChip">'+esc(activeMeasure||'Select a field')+'</span></div><div id="measureDiagram">'+liveMeasureSVG(g,draft.measurements,activeMeasure)+'</div></aside>'+
 '<section class="measureEntryV34"><div class="measureListV34">'+fields.map(f=>'<label class="measureFieldCard '+(activeMeasure===f?'active':'')+'"><span>'+esc(f)+'</span><input class="measureInput" data-measure="'+esc(f)+'" inputmode="decimal" value="'+esc(draft.measurements[f]||'')+'" /></label>').join('')+'</div><div class="measureEntryBottom"><button class="pill compactAdd" id="extraMeasure">＋ Extra measurement</button><div class="keypadArea"><div class="numPad standardPad">'+['7','8','9','4','5','6','1','2','3','.','0','⌫'].map(n=>'<button type="button" data-num="'+n+'">'+n+'</button>').join('')+'</div><div class="fractionBar">'+['¼','½','¾'].map(n=>'<button type="button" data-num="'+n+'">'+n+'</button>').join('')+'</div></div></div></section></div></div>'
}
function chargesStep(){
 const total=Number(draft.stitching||0)+Number(draft.aariCharge||0),paid=Number(draft.advance||0),bal=Math.max(0,total-paid);
 return '<div class="chargesWorkspace"><div><h2 class="sectionTitle">Charges + Dates / கட்டணம் + தேதி</h2><p class="sub">Enter charges and collection date. Totals update immediately.</p><div class="chargeFields"><div class="field"><label>Stitching charge (RM)</label><input id="stitching" inputmode="decimal" value="'+esc(draft.stitching)+'" /></div><div class="field"><label>Aari / extra charge (RM)</label><input id="aariCharge" inputmode="decimal" value="'+esc(draft.aariCharge)+'" /></div><div class="field"><label>Advance / paid (RM)</label><input id="advance" inputmode="decimal" value="'+esc(draft.advance)+'" /></div><div class="field"><label>Delivery date *</label><input id="delivery" type="date" value="'+esc(draft.delivery)+'" /></div></div></div><aside class="chargeSummary"><div><span>Total</span><b id="chargeTotal">'+money(total)+'</b></div><div><span>Paid</span><b id="chargePaid">'+money(paid)+'</b></div><div class="balanceBox"><span>Balance</span><b id="chargeBalance">'+money(bal)+'</b></div><small id="chargeWarning"></small></aside></div>'
}
function reviewStep(){
 const total=Number(draft.stitching||0)+Number(draft.aariCharge||0),paid=Number(draft.advance||0),bal=Math.max(0,total-paid),measureCount=Object.keys(draft.measurements).filter(k=>draft.measurements[k]).length;
 const schema=styleSchemaFor(draft.garment||'blouse');
 const styleSummary=schema.slice(0,4).map(x=>esc(x.label)+': '+esc(styleValue(draft.style,x.key,x.options[0]))).join(' · ');
 return '<div class="reviewWorkspace"><div class="reviewMain"><div class="reviewTitle"><div><span class="miniLabel">FINAL CHECK</span><h2 class="sectionTitle">Review order / சரிபார்ப்பு</h2></div><span class="selectedGarmentPill">'+esc(titleFor(draft.garment))+'</span></div><div class="reviewRows"><div><span>Customer</span><b>'+esc(draft.customer)+'</b></div><div><span>Phone</span><b>'+esc(draft.phone||'—')+'</b></div><div><span>Style</span><b class="reviewStyleSummary">'+styleSummary+'</b></div><div><span>Measurements</span><b>'+measureCount+' saved</b></div><div><span>Delivery</span><b>'+esc(draft.delivery||'—')+'</b></div><div><span>Status</span><b>'+esc(draft.status||'New')+'</b></div></div></div><aside class="reviewMoney"><div class="reviewGarment">'+garmentSVG(draft.garment||'blouse',draft.style,draft.measurements,'style')+'</div><div><span>Total</span><b>'+money(total)+'</b></div><div><span>Paid</span><b>'+money(paid)+'</b></div><div class="reviewBalance"><span>Balance</span><b>'+money(bal)+'</b></div></aside></div>'
}
function orderMatchesView(o,v){
 if(v==='all')return true;
 if(v==='open')return o.status!=='Delivered';
 if(v==='queue')return o.status==='In Progress';
 if(v==='ready')return o.status==='Ready';
 if(v==='delivered')return o.status==='Delivered';
 if(v==='due')return o.delivery===today()&&o.status!=='Delivered';
 if(v==='over')return !!o.delivery&&o.delivery<today()&&o.status!=='Delivered';
 return o.status===v
}
function workOrders(){
 const views=[['all','All'],['open','Open'],['queue','In Progress'],['ready','Ready'],['due','Due today'],['over','Overdue'],['delivered','Delivered']];
 const counts={};
 views.forEach(v=>counts[v[0]]=orders.filter(o=>orderMatchesView(o,v[0])).length);
 const list=orders.filter(o=>orderMatchesView(o,orderView));
 const activeLabel=(views.find(v=>v[0]===orderView)||views[0])[1];
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Work Orders</h1><p class="sub">Showing <b>'+activeLabel+'</b> orders</p></div><span class="moduleCount">'+list.length+' order(s)</span></div>'+
 '<div class="orderFilters">'+views.map(v=>'<button aria-pressed="'+(orderView===v[0])+'" class="orderFilter '+(orderView===v[0]?'active':'')+'" data-order-view="'+v[0]+'"><span>'+v[1]+'</span><b>'+counts[v[0]]+'</b></button>').join('')+'</div>'+
 '<section class="panel compactPanel"><div class="orders" id="orderList">'+(list.length?list.map(orderCard).join(''):'<div class="empty"><div><h3>No '+activeLabel.toLowerCase()+' orders</h3><p>Nothing in this view yet.</p></div></div>')+'</div></section>'
}
function orderCard(o){
 const total=Number(o.stitching||0)+Number(o.aariCharge||0),paid=Number(o.advance||0),bal=Math.max(0,total-paid);
 const statusClass=(o.status||'New').toLowerCase().replace(/\s+/g,'-');
 return '<div class="order orderV27" data-order="'+o.id+'"><div class="orderMain"><div class="orderTitle"><b>'+esc(o.customer)+' · '+esc(titleFor(o.garment))+'</b><span class="badge status-'+statusClass+'">'+esc(o.status)+'</span></div><div class="orderMeta"><span>Delivery <b>'+esc(o.delivery||'—')+'</b></span><span>Total <b>'+money(total)+'</b></span><span>Paid <b>'+money(paid)+'</b></span><span>Balance <b>'+money(bal)+'</b></span></div></div><button class="btn secondary compactBtn" data-open="'+o.id+'">Open</button></div>'
}
function customersPage(){
 const map=new Map();
 orders.forEach(o=>{const key=(o.customer||'Unknown')+'|'+(o.phone||'');if(!map.has(key))map.set(key,{name:o.customer||'Unknown',phone:o.phone||'',orders:0,total:0,paid:0,last:o.delivery||o.created||''});const x=map.get(key);x.orders++;x.total+=Number(o.stitching||0)+Number(o.aariCharge||0);x.paid+=Number(o.advance||0);if((o.delivery||'')>(x.last||''))x.last=o.delivery});
 const list=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Customers</h1><p class="sub">Customer history generated from saved orders.</p></div><span class="moduleCount">'+list.length+' customer(s)</span></div>'+
 '<section class="panel compactPanel"><div class="customerGrid">'+(list.length?list.map(x=>'<article class="customerCard"><div class="customerAvatar">'+esc((x.name||'?').charAt(0).toUpperCase())+'</div><div class="customerInfo"><b>'+esc(x.name)+'</b><span>'+esc(x.phone||'No phone')+'</span></div><div class="customerStats"><div><span>Orders</span><b>'+x.orders+'</b></div><div><span>Paid</span><b>'+money(x.paid)+'</b></div><div><span>Balance</span><b>'+money(Math.max(0,x.total-x.paid))+'</b></div></div></article>').join(''):'<div class="empty"><div><h3>No customers yet</h3><p>Create an order to add your first customer.</p></div></div>')+'</div></section>'
}
function totals(){
 return orders.reduce((a,o)=>{const t=Number(o.stitching||0)+Number(o.aariCharge||0),p=Number(o.advance||0);a.sales+=t;a.paid+=p;a.balance+=Math.max(0,t-p);return a},{sales:0,paid:0,balance:0})
}
function accountsPage(){
 const t=totals(),e=expenses.reduce((s,x)=>s+Number(x.amount||0),0),net=t.paid-e;
 const receivables=orders.filter(o=>{const total=Number(o.stitching||0)+Number(o.aariCharge||0);return total-Number(o.advance||0)>0}).slice(0,5);
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Accounts</h1><p class="sub">Sales, payments, outstanding and expenses.</p></div></div>'+
 '<div class="financeGrid financeGridV27"><div class="financeCard"><span>Total sales</span><b>'+money(t.sales)+'</b><small>Order value</small></div><div class="financeCard"><span>Payments received</span><b>'+money(t.paid)+'</b><small>Cash collected</small></div><div class="financeCard warn"><span>Outstanding</span><b>'+money(t.balance)+'</b><small>Still to collect</small></div><div class="financeCard"><span>Expenses</span><b>'+money(e)+'</b><small>Recorded costs</small></div><div class="financeCard accent"><span>Cash result</span><b>'+money(net)+'</b><small>Received − expenses</small></div></div>'+
 '<section class="panel compactPanel accountLower"><div class="panelTitleRow"><b>Outstanding orders</b><span>'+receivables.length+' shown</span></div><div class="dataTable">'+(receivables.length?receivables.map(o=>{const total=Number(o.stitching||0)+Number(o.aariCharge||0),bal=Math.max(0,total-Number(o.advance||0));return'<div class="dataRow compactData"><div><b>'+esc(o.customer)+'</b><small>'+esc(titleFor(o.garment))+'</small></div><div><span>Due</span><b>'+money(bal)+'</b></div></div>'}).join(''):'<div class="empty smallEmpty"><div><h3>No outstanding balances</h3></div></div>')+'</div></section>'
}
function paymentsPage(){
 const list=orders.filter(o=>Number(o.stitching||0)+Number(o.aariCharge||0)>0);
 const totalPaid=list.reduce((s,o)=>s+Number(o.advance||0),0);
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Payments</h1><p class="sub">Payment progress for every priced order.</p></div><span class="moduleCount">'+money(totalPaid)+' received</span></div>'+
 '<section class="panel compactPanel"><div class="paymentList">'+(list.length?list.map(o=>{const t=Number(o.stitching||0)+Number(o.aariCharge||0),p=Math.min(t,Number(o.advance||0)),bal=Math.max(0,t-p),pct=t?Math.round((p/t)*100):0;return'<div class="paymentRow"><div class="paymentTop"><div><b>'+esc(o.customer)+'</b><span>'+esc(titleFor(o.garment))+'</span></div><div><b>'+money(p)+'</b><span>'+money(bal)+' due</span></div></div><div class="payBar"><i style="width:'+pct+'%"></i></div><small>'+pct+'% paid</small></div>'}).join(''):'<div class="empty"><div><h3>No payment records yet</h3></div></div>')+'</div></section>'
}
function expensesPage(){
 const total=expenses.reduce((s,x)=>s+Number(x.amount||0),0);
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Expenses</h1><p class="sub">Record and review shop expenses on this device.</p></div><span class="moduleCount">'+money(total)+'</span></div>'+
 '<section class="panel compactPanel"><div class="expenseForm expenseFormV27"><input id="expenseNote" placeholder="Expense description" /><select id="expenseCategory"><option>Materials</option><option>Transport</option><option>Utilities</option><option>Salary</option><option>Rent</option><option>Other</option></select><input id="expenseAmount" inputmode="decimal" placeholder="RM amount" /><button class="btn primary" id="addExpense">Add expense</button></div><div class="dataTable expenseList">'+(expenses.length?expenses.slice().reverse().map(x=>'<div class="dataRow expenseRow"><div><b>'+esc(x.note)+'</b><small>'+esc(x.category||'Other')+' · '+esc(x.date)+'</small></div><div><span>Amount</span><b>'+money(x.amount)+'</b></div><button class="iconBtn danger" data-expense-delete="'+x.id+'" title="Delete">×</button></div>').join(''):'<div class="empty"><div><h3>No expenses yet</h3><p>Add your first shop expense above.</p></div></div>')+'</div></section>'
}
function reportsPage(){
 const t=totals(),e=expenses.reduce((s,x)=>s+Number(x.amount||0),0);
 const counts={new:orders.filter(o=>o.status==='New').length,progress:orders.filter(o=>o.status==='In Progress').length,ready:orders.filter(o=>o.status==='Ready').length,delivered:orders.filter(o=>o.status==='Delivered').length};
 const max=Math.max(1,counts.new,counts.progress,counts.ready,counts.delivered);
 const bars=[['New',counts.new],['In Progress',counts.progress],['Ready',counts.ready],['Delivered',counts.delivered]];
 return '<div class="moduleHead"><div><button class="backDash" data-nav="dashboard">← Dashboard</button><h1 class="h1">Reports</h1><p class="sub">Operational and financial snapshot.</p></div></div>'+
 '<div class="reportGrid reportGridV27"><div><span>New</span><b>'+counts.new+'</b></div><div><span>In Progress</span><b>'+counts.progress+'</b></div><div><span>Ready</span><b>'+counts.ready+'</b></div><div><span>Delivered</span><b>'+counts.delivered+'</b></div><div><span>Sales</span><b>'+money(t.sales)+'</b></div><div><span>Outstanding</span><b>'+money(t.balance)+'</b></div></div>'+
 '<section class="panel compactPanel reportLower"><div class="statusBars">'+bars.map(x=>'<div class="statusBarRow"><span>'+x[0]+'</span><div class="statusBarTrack"><i style="width:'+Math.round((x[1]/max)*100)+'%"></i></div><b>'+x[1]+'</b></div>').join('')+'</div><div class="reportMoney"><div><span>Payments</span><b>'+money(t.paid)+'</b></div><div><span>Expenses</span><b>'+money(e)+'</b></div><div><span>Cash result</span><b>'+money(t.paid-e)+'</b></div></div></section>'
}
function backup(){return '<h1 class="h1">Backup</h1><p class="sub">Keep a copy before clearing browser data.</p><section class="panel backupCompact"><div class="quick"><button class="btn primary" id="exportBtn">Export full backup</button><button class="btn secondary" id="restoreBtn">Restore backup</button></div><div class="backupStats"><span><b>'+orders.length+'</b> orders</span><span><b>'+expenses.length+'</b> expenses</span></div><small>Backup includes orders, measurements, payments, photos stored in orders, and expenses.</small></section>'}
function bindPage(){
 if(page==='dashboard'){
  $$('[data-dash]').forEach(b=>b.onclick=()=>{const t=b.dataset.dash;if(t==='new'){editingOrderId=null;page='new';step=1;draft=freshDraft();saveDraft()}else{orderView=t;page='orders'}render()});
  $$('[data-open]').forEach(b=>b.onclick=()=>openOrder(b.dataset.open));
 }
 if(page==='new')bindNew();
 if(page==='orders'){
  $$('[data-order-view]').forEach(b=>b.onclick=()=>{orderView=b.dataset.orderView;render()});
  $$('[data-open]').forEach(b=>b.onclick=()=>openOrder(b.dataset.open));
 }
 if(page==='expenses'){
  const add=$('#addExpense');if(add)add.onclick=()=>{const note=$('#expenseNote').value.trim(),category=$('#expenseCategory').value,amount=Number($('#expenseAmount').value||0);if(!note||!Number.isFinite(amount)||amount<=0){toast('Enter a valid expense and amount');return}expenses.push({id:Date.now().toString(36),note,category,amount,date:today()});saveExpenses();render();toast('Expense added')};
  $$('[data-expense-delete]').forEach(b=>b.onclick=()=>{expenses=expenses.filter(x=>x.id!==b.dataset.expenseDelete);saveExpenses();render();toast('Expense deleted')})
 }
 if(page==='backup'){
  $('#exportBtn').onclick=exportBackup;$('#restoreBtn').onclick=()=>$('#restoreInput').click();
 }
}
function bindNew(){
 const back=$('#backBtn'),next=$('#nextBtn');
 back.onclick=()=>{if(step>1){captureStep();step--;render()}else{editingOrderId=null;page='dashboard';render()}};
 next.onclick=()=>{captureStep();if(!validateStep())return;if(step<6){step++;render()}else saveOrder()};

 const panel=$('.orderStep');
 if(panel){
  panel.onclick=e=>{
   const catBtn=e.target.closest('[data-cat]');
   if(catBtn&&step===2){e.preventDefault();captureStep();cat=catBtn.dataset.cat;draft.category=cat;showAllGarments=false;saveDraft();render();return}
   const garmentBtn=e.target.closest('[data-garment]');
   if(garmentBtn&&step===2){e.preventDefault();draft.garment=garmentBtn.dataset.garment;draft.style={...freshDraft().style};draft.measurements={};draft.customMeasurements=[];ensureStyleDefaults(draft.garment);saveDraft();render();return}
   const moreBtn=e.target.closest('[data-more-garments]');
   if(moreBtn&&step===2){e.preventDefault();showAllGarments=!showAllGarments;render();return}
   const photoRemove=e.target.closest('[data-photo-remove]');
   if(photoRemove&&step===2){e.preventDefault();draft.photos.splice(Number(photoRemove.dataset.photoRemove),1);saveDraft();render();return}
   const styleBtn=e.target.closest('[data-style]');
   if(styleBtn&&step===3){e.preventDefault();draft.style[styleBtn.dataset.style]=styleBtn.dataset.value;saveDraft();render();return}
   const tabBtn=e.target.closest('[data-measuretab]');
   if(tabBtn&&step===4){e.preventDefault();if(tabBtn.disabled)return;measureTab=tabBtn.dataset.measuretab;const fs=fieldsForMeasureTab(draft.garment,measureTab);activeMeasure=fs[0]||'';render();return}
   const numBtn=e.target.closest('[data-num]');
   if(numBtn&&step===4){e.preventDefault();let focus=document.activeElement?.classList?.contains('measureInput')?document.activeElement:$('.measureInput');if(!focus)return;focus.focus();let v=focus.value,n=numBtn.dataset.num;if(n==='⌫')v=v.slice(0,-1);else v+=n;focus.value=v;draft.measurements[focus.dataset.measure]=v;saveDraft();focus.dispatchEvent(new Event('input',{bubbles:true}));return}
  }
 }

 if(step===1){
  const customer=$('#customer'),phone=$('#phone'),box=$('#customerSuggestions'),history=$('#customerHistory'),count=$('#historyCount');
  const showSuggestions=()=>{
   const list=customerMatches(customer.value);
   box.innerHTML=customerSuggestionHTML(list);
   box.hidden=false;
   box.classList.toggle('hasMatches',list.length>0)
  };
  const refreshHistory=()=>{
   const list=matchingCustomerHistory(customer.value,phone.value);
   if(list.length){history.innerHTML=customerHistoryHTML(customer.value,phone.value);count.textContent=list.length+' saved';return}
   const matches=customerMatches(customer.value);
   if(customer.value.trim()&&matches.length){const c=matches[0];history.innerHTML='<div class="customerMatchHint"><span>Matching previous customer</span><b>'+esc(c.name)+'</b><small>'+esc(c.phone||'No phone')+' · '+c.orders.length+' order'+(c.orders.length===1?'':'s')+'</small><em>Select from the list below the name field.</em></div>';count.textContent=matches.length+' match'+(matches.length===1?'':'es')}
   else{history.innerHTML=customerHistoryHTML(customer.value,phone.value);count.textContent='0 saved'}
  };
  customer.addEventListener('focus',showSuggestions);
  customer.addEventListener('input',()=>{draft.customer=customer.value.trim();saveDraft();showSuggestions();refreshHistory()});
  phone.addEventListener('input',()=>{draft.phone=phone.value.trim();saveDraft();refreshHistory()});
  box.addEventListener('click',e=>{
   const btn=e.target.closest('[data-customer-key]');if(!btn)return;
   const c=customerDirectory().find(x=>x.key===btn.dataset.customerKey);if(!c)return;
   customer.value=c.name;phone.value=c.phone;draft.customer=c.name;draft.phone=c.phone;saveDraft();box.hidden=true;refreshHistory()
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.customerLookup'))box.hidden=true},{once:true,capture:true})
 }
 if(step===2){
  $('#photoInput').onchange=handlePhotos;
  $('#voiceBtn').onclick=voiceToText;
  $('#recordBtn').onclick=recordAudio;
 }
 if(step===3){
  $$('[data-style-select]').forEach(s=>s.onchange=()=>{draft.style[s.dataset.styleSelect]=s.value;saveDraft();render()})
 }
 if(step===4){
  $$('.measureInput').forEach(i=>{
   i.onfocus=()=>{activeMeasure=i.dataset.measure;$('.measureFieldCard').forEach(x=>x.classList.toggle('active',x.contains(i)));const d=$('#measureDiagram');if(d)d.innerHTML=liveMeasureSVG(draft.garment,draft.measurements,activeMeasure);const chip=$('.activeMeasurementChip');if(chip)chip.textContent=activeMeasure};
   i.oninput=()=>{draft.measurements[i.dataset.measure]=i.value;saveDraft();const d=$('#measureDiagram');if(d)d.innerHTML=liveMeasureSVG(draft.garment,draft.measurements,activeMeasure)}
  });
  $('#extraMeasure').onclick=()=>{const name=prompt('Extra measurement name');if(name){draft.customMeasurements=draft.customMeasurements||[];draft.customMeasurements.push({tab:measureTab,name});saveDraft();render()}}
 }
 if(step===5){
  const refresh=()=>{const s=Number($('#stitching').value||0),a=Number($('#aariCharge').value||0),p=Number($('#advance').value||0),t=s+a,b=Math.max(0,t-p);$('#chargeTotal').textContent=money(t);$('#chargePaid').textContent=money(p);$('#chargeBalance').textContent=money(b);const w=$('#chargeWarning');w.textContent=p>t?'Advance cannot be more than total':'';w.className=p>t?'warnText':''};
  ['stitching','aariCharge','advance'].forEach(id=>$('#'+id).addEventListener('input',refresh));refresh()
 }
}
function captureStep(){
 if(step===1){draft.customer=$('#customer')?.value.trim()||draft.customer;draft.phone=$('#phone')?.value.trim()||draft.phone}
 if(step===2){draft.designNotes=$('#designNotes')?.value||draft.designNotes}
 if(step===3){$('[data-style-select]').forEach(e=>draft.style[e.dataset.styleSelect]=e.value);draft.style.notes=$('#styleNotes')?.value||draft.style.notes}
 if(step===5){['stitching','aariCharge','advance','delivery'].forEach(k=>{const e=$('#'+k);if(e)draft[k]=e.value})}
 saveDraft()
}
function validateStep(){if(step===1&&!draft.customer){toast('Customer name is required');return false}if(step===2&&!draft.garment){toast('Select a dress / garment');return false}if(step===5){let s=Number(draft.stitching||0),a=Number(draft.aariCharge||0),p=Number(draft.advance||0);if([s,a,p].some(n=>n<0||!Number.isFinite(n))){toast('Enter valid non-negative amounts');return false}if(p>s+a){toast('Advance cannot be more than total');return false}if(!draft.delivery){toast('Delivery date is required');return false}}return true}
function saveOrder(){
 const total=Number(draft.stitching||0)+Number(draft.aariCharge||0);
 if(Number(draft.advance||0)>total){toast('Overpayment blocked');return}
 if(editingOrderId){
  const idx=orders.findIndex(x=>x.id===editingOrderId);
  if(idx>=0){orders[idx]={...draft,id:editingOrderId,measurements:{...draft.measurements},style:{...draft.style},photos:[...(draft.photos||[])],status:draft.status||orders[idx].status||'New'}}
  editingOrderId=null;toast('Order updated')
 }else{
  const o={...draft,id:Date.now().toString(36),measurements:{...draft.measurements},style:{...draft.style},photos:[...(draft.photos||[])],status:'New'};orders.unshift(o);toast('Order saved')
 }
 saveOrders();sessionStorage.removeItem(draftKey);page='orders';orderView='all';render()
}
function filterOrders(f){$$('[data-order]').forEach(el=>{const o=orders.find(x=>x.id===el.dataset.order);el.style.display=(f==='all'||o.status===f)?'grid':'none'})}
function openOrder(id){
 const o=orders.find(x=>x.id===id);if(!o)return;
 const total=Number(o.stitching||0)+Number(o.aariCharge||0),paid=Number(o.advance||0),bal=Math.max(0,total-paid);
 const box=document.createElement('div');box.className='orderModal';
 box.innerHTML='<div class="orderModalCard"><div class="modalHead"><div><span class="miniLabel">ORDER</span><h3>'+esc(o.customer)+' · '+esc(titleFor(o.garment))+'</h3></div><button class="iconBtn" id="modalClose">×</button></div><div class="modalStats"><div><span>Total</span><b>'+money(total)+'</b></div><div><span>Paid</span><b>'+money(paid)+'</b></div><div><span>Balance</span><b>'+money(bal)+'</b></div></div><div class="form2"><div class="field"><label>Status</label><select id="modalStatus"><option>New</option><option>In Progress</option><option>Ready</option><option>Delivered</option></select></div><div class="field"><label>Add payment</label><input id="modalPay" inputmode="decimal" placeholder="RM amount" /></div></div><div class="modalActions"><button class="btn dangerBtn" id="modalDelete">Delete</button><button class="btn secondary" id="modalEdit">Edit order</button><button class="btn primary" id="modalSave">Save update</button></div></div>';
 document.body.appendChild(box);$('#modalStatus',box).value=o.status;
 $('#modalClose',box).onclick=()=>box.remove();
 $('#modalDelete',box).onclick=()=>{if(confirm('Delete this order permanently?')){orders=orders.filter(x=>x.id!==id);saveOrders();box.remove();render();toast('Order deleted')}};
 $('#modalEdit',box).onclick=()=>{editingOrderId=id;draft=JSON.parse(JSON.stringify(o));cat=o.category||'women';step=1;page='new';saveDraft();box.remove();render()};
 $('#modalSave',box).onclick=()=>{const add=Number($('#modalPay',box).value||0);if(add<0||add>bal){toast('Invalid payment / overpayment blocked');return}o.advance=Number(o.advance||0)+add;o.status=$('#modalStatus',box).value;saveOrders();box.remove();render();toast('Order updated')}
}
async function handlePhotos(e){const fs=[...e.target.files].slice(0,3-(draft.photos?.length||0));for(const f of fs){const data=await compressImage(f);draft.photos.push(data)}saveDraft();render()}
function compressImage(file){return new Promise(res=>{const rd=new FileReader();rd.onload=()=>{const img=new Image();img.onload=()=>{const s=Math.min(1,800/img.width);const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};img.src=rd.result};rd.readAsDataURL(file)})}
function voiceToText(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){toast('Voice-to-text not supported in this browser');return}const r=new R();r.lang='ta-IN';r.interimResults=false;r.onresult=e=>{draft.designNotes=(draft.designNotes?draft.designNotes+' ':'')+e.results[0][0].transcript;saveDraft();render()};r.onerror=()=>toast('Voice recognition failed');r.start();toast('Listening…')}
let recorder=null,chunks=[];async function recordAudio(){if(recorder&&recorder.state==='recording'){recorder.stop();return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{draft.voiceNote='Audio note recorded ('+Math.round(chunks.reduce((a,b)=>a+b.size,0)/1024)+' KB)';stream.getTracks().forEach(t=>t.stop());saveDraft();render()};recorder.start();$('#voiceState').textContent='Recording… tap Record audio again to stop'}catch(e){toast('Microphone permission is required')}}
function exportBackup(){
 const blob=new Blob([JSON.stringify({version:34,exported:new Date().toISOString(),orders,expenses},null,2)],{type:'application/json'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='SK-Tailoring-backup-'+today()+'.json';a.click();URL.revokeObjectURL(a.href)
}
$('#restoreInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!Array.isArray(j.orders))throw 0;orders=j.orders;expenses=Array.isArray(j.expenses)?j.expenses:[];saveOrders();saveExpenses();toast('Backup restored');page='dashboard';render()}catch(err){toast('Invalid backup file')}};r.readAsText(f)});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
})();