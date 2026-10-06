(()=>{
'use strict';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const STORE='skTailoringOrdersV19';
const draftKey='skTailoringDraftV19';
const today=()=>new Date().toISOString().slice(0,10);
const money=n=>'RM '+Number(n||0).toFixed(2);
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let orders=loadOrders();
let page='dashboard', step=1, cat='women', activeMeasure='Bust / மார்பு';
let draft=loadDraft();
if(!draft) draft=freshDraft();
function freshDraft(){return{customer:'',phone:'',garment:null,category:'women',designNotes:'',photos:[],voiceNote:'',style:{sleeve:'Short',neck:'Round',opening:'Back hooks',lining:'No lining',padding:'No pad',aari:'None',fit:'Regular',notes:''},measurements:{},stitching:'',aariCharge:'',advance:'',delivery:'',status:'New',created:today()}}
function loadOrders(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
function saveOrders(){localStorage.setItem(STORE,JSON.stringify(orders))}
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
function shell(content){return '<div class="app"><aside class="side" id="side"><div><div class="brand">✂ SK Tailoring</div><small>SHOP WORKSPACE</small></div><nav class="nav">'+navBtn('dashboard','▦ Dashboard')+navBtn('new','＋ New Order')+navBtn('orders','▤ Work Orders')+navBtn('backup','⚙ Backup')+'</nav><div class="made">Made for your daily craft.</div></aside><main class="main"><div class="mobileTop"><button class="pill" id="menuBtn">☰ Menu</button><b>✂ SK Tailoring</b></div><div class="topline"><div class="eyebrow">SK SECURE TECH / TAILORING</div><div class="status">● Online · Saved on this device</div></div>'+content+'<div class="copyright">Device version v21 · orders save in this browser. Export a backup before clearing browser data.</div></main></div>'}
function navBtn(p,label){return '<button data-nav="'+p+'" class="'+(page===p?'active':'')+'">'+label+'</button>'}
function bindShell(){ $('[data-nav]').forEach(b=>b.onclick=()=>{page=b.dataset.nav;if(page==='new'){step=1;draft=freshDraft();saveDraft()}const s=$('#side');if(s)s.classList.remove('open');render()}); const m=$('#menuBtn');if(m)m.onclick=()=>$('#side').classList.toggle('open') }
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
function garmentSVG(k){
 const palettes=[['#0d7f83','#d8a43a'],['#315f87','#d6a24a'],['#8a4f7d','#c99a43'],['#4f7f5b','#d0a042'],['#8b5b42','#3f8790']];
 let hash=0;for(let i=0;i<k.length;i++)hash=(hash*31+k.charCodeAt(i))>>>0;
 const pal=palettes[hash%palettes.length],c1=pal[0],c2=pal[1],bg='#fbf5ea';
 let body='';
 if(/alter/.test(k)){
  body='<circle cx="91" cy="82" r="27" fill="none" stroke="'+c1+'" stroke-width="9"/><circle cx="162" cy="82" r="27" fill="none" stroke="'+c2+'" stroke-width="9"/><path d="m111 102 77 75m-77-74 77-76" stroke="#5d554d" stroke-width="9" stroke-linecap="round"/><path d="M50 177c31-21 62-21 93 0" fill="none" stroke="'+c1+'" stroke-width="5" stroke-dasharray="7 6"/>';
 }else if(k==='designer-blouse'){
  body='<path d="M70 75 101 49h55l31 26 12 31-29 12-11-24v67H96V94l-11 24-29-12Z" fill="'+c1+'"/><path d="M108 49 129 76 150 49" fill="'+bg+'" stroke="'+c2+'" stroke-width="5"/><path d="M101 115c18-13 39-13 57 0M101 139c18-13 39-13 57 0" fill="none" stroke="'+c2+'" stroke-width="5"/>';
 }else if(/blouse/.test(k)){
  body='<path d="M78 72 103 50h50l25 22 14 33-26 11-10-20v63H99V96l-10 20-26-11Z" fill="'+c1+'"/><path d="M112 50c4 18 26 23 33 0" fill="'+bg+'"/><path d="M99 145h57" stroke="'+c2+'" stroke-width="7"/>';
 }else if(k==='saree'){
  body='<path d="M98 45h51l16 38-16 19 37 84H72l31-83-17-22Z" fill="'+c1+'"/><path d="M105 47c54 33 63 79 51 139" fill="none" stroke="'+c2+'" stroke-width="10"/><path d="M80 170h98" stroke="#f4e2ad" stroke-width="7"/>';
 }else if(k==='fall-pico'){
  body='<path d="M55 70h132v88H55Z" rx="12" fill="'+c1+'"/><path d="M55 130h132" stroke="'+c2+'" stroke-width="10"/><circle cx="176" cy="177" r="24" fill="none" stroke="'+c2+'" stroke-width="9"/><path d="M152 183 66 40" stroke="#665c52" stroke-width="6" stroke-linecap="round"/>';
 }else if(/veshti/.test(k)){
  body='<path d="M88 48h80l13 139H73Z" fill="#f4eee3" stroke="#d9d1c6" stroke-width="2"/><path d="M95 48v139M156 48v139" stroke="'+c2+'" stroke-width="7"/><path d="M76 169h102" stroke="'+c2+'" stroke-width="8"/>';
 }else if(k==='petticoat'){
  body='<path d="M92 50h69l28 136H63Z" fill="#eee4d7" stroke="'+c1+'" stroke-width="3"/><path d="M90 63h73M70 169h112" stroke="'+c2+'" stroke-width="6"/>';
 }else if(k==='palazzo'){
  body='<path d="M85 50h82l9 136h-49l-4-80-6 80H68Z" fill="'+c1+'"/><path d="M86 61h80" stroke="'+c2+'" stroke-width="7"/>';
 }else if(/trouser/.test(k)){
  body='<path d="M94 44h72l-4 54-12 88h-38l-9-75-8 75H62l18-88Z" fill="'+c1+'"/><path d="M96 59h68" stroke="'+c2+'" stroke-width="5"/>';
 }else if(/short/.test(k)){
  body='<path d="M82 58h96l-6 95-40-4-6-48-7 48-42 4Z" fill="'+c1+'"/><path d="M84 72h91" stroke="'+c2+'" stroke-width="6"/>';
 }else if(k==='lehenga-skirt'){
  body='<path d="M100 48h58l37 138H63Z" fill="'+c1+'"/><path d="M82 162h94M91 126h76" stroke="'+c2+'" stroke-width="7"/><circle cx="107" cy="95" r="5" fill="#f8e9bc"/><circle cx="151" cy="111" r="5" fill="#f8e9bc"/>';
 }else if(/lehenga/.test(k)||k==='pattu-pavadai'){
  body='<path d="M95 48h65l11 49-20 8-7-24-5 31h-25l-4-31-8 24-20-8Z" fill="'+c1+'"/><path d="M103 112h48l41 74H64Z" fill="'+c2+'"/><path d="M75 169h105" stroke="#f5e3af" stroke-width="7"/><circle cx="126" cy="139" r="5" fill="#fff4cd"/>';
 }else if(/waistcoat|suit/.test(k)){
  body='<path d="M84 58 110 42l18 30 18-30 28 16 6 116h-50l-4-60-4 60H74Z" fill="'+c1+'"/><path d="m111 43 17 37 18-37" fill="#f6f2e8"/><circle cx="129" cy="102" r="4" fill="'+c2+'"/><circle cx="129" cy="122" r="4" fill="'+c2+'"/>';
 }else if(/school/.test(k)){
  body='<path d="M75 61 105 43h46l31 18 8 31-25 9-9-20v76H99V81l-9 20-25-9Z" fill="#d8eef3"/><path d="M101 115h55" stroke="#315f87" stroke-width="7"/><path d="M98 158h60l23 28H75Z" fill="#315f87"/><path d="M118 45h20v25h-20Z" fill="#fff"/>';
 }else if(/night/.test(k)){
  body='<path d="M70 62 103 43h50l35 19-18 32-14-9v49H100V85l-13 9Z" fill="'+c1+'"/><path d="M98 140h58l12 46h-30l-10-31-10 31H88Z" fill="'+c2+'"/><path d="M110 64h37" stroke="#f1e8cc" stroke-width="5"/>';
 }else if(k==='kurta-set'||k==='boy-kurta-set'){
  body='<path d="M76 55 105 42h45l29 13 11 35-25 9-10-23 3 78H96l3-78-10 23-25-9Z" fill="#eee9dd" stroke="'+c1+'" stroke-width="3"/><path d="M126 44v89" stroke="'+c2+'" stroke-width="5"/><path d="M103 157h22l-7 30H89Zm29 0h22l17 30h-30Z" fill="'+c1+'"/>';
 }else if(/kurta|sherwani/.test(k)){
  body='<path d="M78 54 106 42h44l28 12 10 36-25 8-2 89H94l-2-89-25-8Z" fill="'+(k.includes('sherwani')?'#eee3c4':'#eee9dd')+'" stroke="'+c1+'" stroke-width="3"/><path d="M128 42v92" stroke="'+c2+'" stroke-width="5"/><circle cx="137" cy="70" r="4" fill="'+c2+'"/><circle cx="137" cy="90" r="4" fill="'+c2+'"/>';
 }else if(/shirt/.test(k)){
  body='<path d="M74 62 104 43l24 16 24-16 34 19-17 35-15-11v95H101V86L87 98Z" fill="'+c1+'"/><path d="M128 59v119M111 54l17 17 17-17" stroke="#e7f5f1" stroke-width="4"/><path d="M105 101h18v17h-18Z" fill="'+c2+'"/>';
 }else if(/salwar|churidar/.test(k)){
  body='<path d="M80 50 108 39h40l28 11 13 37-24 9-10-23 5 72H95l5-72-10 23-24-9Z" fill="'+c1+'"/><path d="M103 148h24l-8 39H89Zm30 0h25l17 39h-30Z" fill="'+(k.includes('churidar')?c2:'#315f87')+'"/><path d="M106 91h48" stroke="'+c2+'" stroke-width="5"/>';
 }else if(/frock/.test(k)){
  body='<path d="M91 54 108 39h41l18 15 23 31-25 15-14-21-5 33 34 65H76l35-65-6-33-13 21-25-15Z" fill="'+c1+'"/><circle cx="95" cy="70" r="17" fill="'+c2+'" opacity=".55"/><circle cx="166" cy="70" r="17" fill="'+c2+'" opacity=".55"/><path d="M85 158h82" stroke="'+c2+'" stroke-width="7"/>';
 }else if(/girl-gown|gown/.test(k)){
  body='<path d="M97 43h61l11 52-18 8-9-29-4 38 53 75H64l54-75-5-38-9 29-18-8Z" fill="'+c1+'"/><path d="M79 170h98" stroke="'+c2+'" stroke-width="8"/><path d="M112 48c8 14 25 14 33 0" fill="'+bg+'"/>';
 }else if(k==='anarkali'){
  body='<path d="M97 43h61l13 55-20 8-9-29-5 40 59 70H59l59-70-5-40-9 29-20-8Z" fill="'+c1+'"/><path d="M80 151h96M73 169h110" stroke="'+c2+'" stroke-width="6"/>';
 }else if(k==='western'){
  body='<path d="M96 48h62l15 43-20 9-10-24-4 33 38 61H77l40-61-5-33-10 24-20-9Z" fill="'+c1+'"/><path d="M91 154h73" stroke="'+c2+'" stroke-width="8"/>';
 }else if(k==='skirt-top'){
  body='<path d="M94 47h68l12 55-18 6-9-27-4 37H112l-4-37-9 27-18-6Z" fill="'+c1+'"/><path d="M102 119h52l28 67H74Z" fill="'+c2+'"/>';
 }else{
  body='<path d="M78 58 106 42h44l28 16 9 34-23 8-8-18v86H99V82l-8 18-23-8Z" fill="'+c1+'"/><path d="M100 137h56" stroke="'+c2+'" stroke-width="6"/>';
 }
 return '<svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="220" rx="18" fill="'+bg+'"/><circle cx="128" cy="29" r="12" fill="#8f704f"/><path d="M128 40v18" stroke="#8f704f" stroke-width="5"/>'+body+'</svg>'
}

function styleSVG(kind,val){
 let neck='M105 46c10 16 34 16 44 0', sleeveL=30, sleeveR=30;
 if(/V neck/i.test(val))neck='M105 46l22 28 22-28';
 if(/Square/i.test(val))neck='M106 46v22h42V46';
 if(/Boat/i.test(val))neck='M103 48c16 7 34 7 50 0';
 if(/High/i.test(val))neck='M113 42h30v22h-30Z';
 if(/Low/i.test(val))neck='M102 45c8 35 45 35 54 0';
 if(/Mandarin/i.test(val))neck='M114 42h28v15h-28Z';
 if(/Band collar/i.test(val))neck='M109 44h38v11h-38Z';
 if(/Collarless/i.test(val))neck='M108 48c10 12 28 12 38 0';
 if(/Elbow/i.test(val)){sleeveL=52;sleeveR=52} if(/Long/i.test(val)){sleeveL=82;sleeveR=82} if(/Sleeveless/i.test(val)){sleeveL=3;sleeveR=3}
 return '<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="150" rx="14" fill="#faf6ee"/><path d="M74 48 106 32h48l32 16 20 28-28 16-'+sleeveR+' 5-10-22v64H91V75L81 97l-'+sleeveL+'-5-28-16Z" fill="#0d7f83"/><path d="'+neck+'" fill="none" stroke="#faf6ee" stroke-width="7" stroke-linejoin="round"/><path d="M128 50v84" stroke="#e6c377" stroke-width="3" stroke-dasharray="6 5"/></svg>'
}
function measureSVG(group,field){
 const hit=(name)=>field&&field.toLowerCase().includes(name)?'#d6554d':'#4d9a9a';
 let g='<path d="M125 40c15 0 27 12 27 27s-12 27-27 27-27-12-27-27 12-27 27-27Zm-45 71 22-18h46l23 18 15 42-26 9-10-29v124H99V113l-10 29-26-9Z" fill="#d8eeeb" stroke="#2d7779" stroke-width="3"/>';
 if(group==='trousers')g='<path d="M86 55h78l-8 84-10 116h-39l-6-91-7 91H57l18-116Z" fill="#d8eeeb" stroke="#2d7779" stroke-width="3"/>';
 if(group==='skirt')g='<path d="M91 54h69l31 201H58Z" fill="#d8eeeb" stroke="#2d7779" stroke-width="3"/>';
 let lines='';
 lines+='<path d="M79 130h93" stroke="'+hit('bust')+'" stroke-width="5"/><text x="177" y="134" font-size="12" fill="'+hit('bust')+'">Bust</text>';
 lines+='<path d="M86 170h78" stroke="'+hit('waist')+'" stroke-width="5"/><text x="169" y="174" font-size="12" fill="'+hit('waist')+'">Waist</text>';
 lines+='<path d="M101 102h49" stroke="'+hit('shoulder')+'" stroke-width="5"/><text x="154" y="105" font-size="12" fill="'+hit('shoulder')+'">Shoulder</text>';
 lines+='<path d="M188 111v119" stroke="'+hit('length')+'" stroke-width="5"/><text x="194" y="174" font-size="12" fill="'+hit('length')+'">Length</text>';
 lines+='<path d="M70 113 44 205" stroke="'+hit('sleeve')+'" stroke-width="5"/><text x="10" y="212" font-size="12" fill="'+hit('sleeve')+'">Sleeve</text>';
 lines+='<path d="M109 89c6 11 27 11 33 0" fill="none" stroke="'+hit('neck')+'" stroke-width="5"/><text x="145" y="90" font-size="12" fill="'+hit('neck')+'">Neck</text>';
 return '<svg viewBox="0 0 260 290" xmlns="http://www.w3.org/2000/svg">'+g+lines+'</svg>'
}
function render(){let c=page==='dashboard'?dashboard():page==='new'?newOrder():page==='orders'?workOrders():backup();root().innerHTML=shell(c);bindShell();bindPage()}
function dashboard(){
 const open=orders.filter(o=>o.status!=='Delivered').length, queue=orders.filter(o=>o.status==='In Progress').length, ready=orders.filter(o=>o.status==='Ready').length, due=orders.filter(o=>o.delivery===today()&&o.status!=='Delivered').length, over=orders.filter(o=>o.delivery&&o.delivery<today()&&o.status!=='Delivered').length,del=orders.filter(o=>o.status==='Delivered').length;
 const cards=[['new','New order','＋','புதிய ஆர்டர் →','c1'],['open','Open orders',open,'All orders awaiting collection →','c2'],['queue','Work queue',queue,'Production still unfinished →','c3'],['ready','Completed / ready',ready,'Stitching and Aari completed →','c4'],['due','Due today',due,'Collection date is today →','c5'],['over', 'Overdue',over,'Collection date has passed →','c6'],['delivered','Delivered',del,'Orders already collected →','c7']];
 return '<h1 class="h1">Your shop at a glance</h1><p class="sub">வேலை நிலையைத் தொட்டு ஆர்டர்களைப் பாருங்கள் · '+today()+'</p><div class="heroGrid">'+cards.map(x=>'<div class="dashCard '+x[4]+'" data-dash="'+x[0]+'"><h3>'+x[1]+'</h3><div class="count">'+x[2]+'</div><p>'+x[3]+'</p><div class="art">'+dashSVG(x[0])+'</div></div>').join('')+'</div><div class="quick"><button class="pill" data-filter="all">All work orders →</button><button class="pill" data-filter="pending">Pending work →</button><button class="pill" data-filter="progress">Work in progress →</button></div><section class="panel"><h2 class="sectionTitle">Next collections</h2>'+nextCollections()+'</section>'
}
function nextCollections(){const list=orders.filter(o=>o.status!=='Delivered'&&o.delivery).sort((a,b)=>a.delivery.localeCompare(b.delivery)).slice(0,5);if(!list.length)return'<div class="empty"><div><div style="font-size:30px">✂</div><h3>No orders yet</h3><p>Create your first customer order to get started.</p></div></div>';return'<div class="orders">'+list.map(orderCard).join('')+'</div>'}
function newOrder(){
 const steps=['1. Customer','2. Dress + Design','3. Style','4. Measurements','5. Charges + Dates','6. Review'];
 return '<h1 class="h1">New tailoring order</h1><p class="sub">Design first · டிசைன் தேர்வு செய்து பிறகு அளவுகள்</p><div class="steps">'+steps.map((s,i)=>'<div class="step '+(step===i+1?'active':'')+'">'+s+'</div>').join('')+'</div><section class="panel">'+stepContent()+'</section><div class="actions"><button class="btn secondary" id="backBtn">← Back</button><button class="btn primary" id="nextBtn">'+(step===6?'Confirm & Save':'Continue →')+'</button></div>'
}
function stepContent(){if(step===1)return customerStep();if(step===2)return dressStep();if(step===3)return styleStep();if(step===4)return measureStep();if(step===5)return chargesStep();return reviewStep()}
function customerStep(){return '<h2 class="sectionTitle">Customer / வாடிக்கையாளர்</h2><div class="form2"><div class="field"><label>Customer name *</label><input id="customer" value="'+esc(draft.customer)+'" placeholder="Name" /></div><div class="field"><label>Phone</label><input id="phone" inputmode="tel" value="'+esc(draft.phone)+'" placeholder="Phone number" /></div></div><p class="sub" style="margin-top:15px">Previous customer can be selected later from saved orders; this device keeps local order history.</p>'}
function dressStep(){
 return '<h2 class="sectionTitle">Choose dress / உடை தேர்வு</h2><div class="tabs">'+Object.keys(cats).map(k=>'<button class="tab '+(cat===k?'active':'')+'" data-cat="'+k+'">'+catLabels[k]+'</button>').join('')+'</div><p class="sub">Each garment now has its own visual. Changing category keeps this draft safe until you select another garment.</p><div class="grid">'+cats[cat].map(([k,en,ta])=>'<button class="garment '+(draft.garment===k?'active':'')+'" data-garment="'+k+'"><div class="pic">'+garmentSVG(k)+'</div><b>'+en+'</b><span>'+ta+'</span></button>').join('')+'</div><div style="margin-top:20px"><h3>Customer’s design reference</h3><div class="field"><label>Design photo (up to 3)</label><input id="photoInput" type="file" accept="image/*" multiple /></div><div class="photos" id="photoPreview">'+(draft.photos||[]).map(p=>'<img src="'+p+'" alt="design" />').join('')+'</div><div class="field" style="margin-top:12px"><label>Requested design / alteration instructions</label><textarea id="designNotes">'+esc(draft.designNotes)+'</textarea></div><div class="voiceBox"><b>🎙 Speak your design instructions</b><div class="quick"><button class="pill" id="voiceBtn">🎙 Voice → text</button><button class="pill" id="recordBtn">● Record audio</button></div><small id="voiceState">'+esc(draft.voiceNote||'')+'</small></div></div>'
}
function styleStep(){
 const g=draft.garment||'blouse';const shirt=/shirt|school/.test(g);const sleeves=['Short','Elbow','Long','Sleeveless','Custom'];const necks=shirt?['Regular collar','Mandarin collar','Band collar','Collarless','Custom']:['Round','V neck','Square','Boat','High neck','Low neck','Custom'];
 return '<h2 class="sectionTitle">'+titleFor(g)+' · Style details</h2><div class="styleGroup"><h3>Sleeves</h3><div class="styleGrid">'+sleeves.map(v=>styleCard('sleeve',v,draft.style.sleeve===v)).join('')+'</div></div><div class="styleGroup"><h3>'+ (shirt?'Collar / Neck':'Neck') +'</h3><div class="styleGrid">'+necks.map(v=>styleCard('neck',v,draft.style.neck===v)).join('')+'</div></div><div class="form2"><div class="field"><label>Opening</label>'+sel('opening',['Back hooks','Front hooks','Zip','No opening'])+'</div><div class="field"><label>Lining / உள்ளணி</label>'+sel('lining',['No lining','Cotton lining','Full lining'])+'</div><div class="field"><label>Padding / பேட்</label>'+sel('padding',['No pad','Pad'])+'</div><div class="field"><label>Aari / embroidery work</label>'+sel('aari',['None','Light','Medium','Heavy'])+'</div><div class="field"><label>Fit</label>'+sel('fit',['Regular','Slim','Comfort'])+'</div><div class="field"><label>Style / fabric / colour notes</label><textarea id="styleNotes">'+esc(draft.style.notes)+'</textarea></div></div>'
}
function styleCard(kind,val,on){return '<button class="styleCard '+(on?'active':'')+'" data-style="'+kind+'" data-value="'+val+'">'+styleSVG(kind,val)+'<div>'+val+'</div></button>'}
function sel(k,arr){return '<select id="'+k+'">'+arr.map(v=>'<option '+(draft.style[k]===v?'selected':'')+'>'+v+'</option>').join('')+'</select>'}
function titleFor(k){for(const group of Object.values(cats)){const f=group.find(x=>x[0]===k);if(f)return f[1]}return 'Garment'}
function measureStep(){
 const group=garmentGroup(draft.garment);const fields=measureSets[group];if(!fields.includes(activeMeasure))activeMeasure=fields[0];
 return '<h2 class="sectionTitle">'+titleFor(draft.garment)+' measurements</h2><div class="measureTabs"><button class="active">▣ Body</button><button>◩ Sleeve</button><button>⌁ Neck</button></div><div class="measureLayout"><div><div class="measureList">'+fields.map(f=>'<div class="field"><label>'+f+'</label><input class="measureInput" data-measure="'+f+'" inputmode="decimal" value="'+esc(draft.measurements[f]||'')+'" /></div>').join('')+'</div><button class="pill" id="extraMeasure" style="margin-top:12px">＋ Add extra measurement</button></div><aside class="diagram"><div class="garmentRef">'+garmentSVG(draft.garment||'blouse')+'</div><b>'+activeMeasure+'</b><div id="measureDiagram">'+measureSVG(group,activeMeasure)+'</div><div class="hint">Technical guide only · measurements remain the values you enter. Selecting a field highlights the matching area.</div><div class="numPad" id="numPad">'+['7','8','9','4','5','6','1','2','3','.','0','⌫','¼','½','¾'].map(n=>'<button data-num="'+n+'">'+n+'</button>').join('')+'</div></aside></div>'
}
function chargesStep(){const total=Number(draft.stitching||0)+Number(draft.aariCharge||0), paid=Number(draft.advance||0), bal=Math.max(0,total-paid);return '<h2 class="sectionTitle">Charges + Dates / கட்டணம் + தேதி</h2><div class="form2"><div class="field"><label>Stitching charge (RM)</label><input id="stitching" inputmode="decimal" value="'+esc(draft.stitching)+'" /></div><div class="field"><label>Aari / extra charge (RM)</label><input id="aariCharge" inputmode="decimal" value="'+esc(draft.aariCharge)+'" /></div><div class="field"><label>Advance / paid (RM)</label><input id="advance" inputmode="decimal" value="'+esc(draft.advance)+'" /></div><div class="field"><label>Delivery date *</label><input id="delivery" type="date" value="'+esc(draft.delivery)+'" /></div></div><div class="panel" style="margin-top:16px;background:#edf8f6"><div class="row"><span>Total</span><b>'+money(total)+'</b></div><div class="row"><span>Paid</span><b>'+money(paid)+'</b></div><div class="row"><span>Balance</span><b class="money">'+money(bal)+'</b></div></div>'}
function reviewStep(){const total=Number(draft.stitching||0)+Number(draft.aariCharge||0), paid=Number(draft.advance||0);return '<h2 class="sectionTitle">Review order / சரிபார்ப்பு</h2><div class="summary"><div class="row"><span>Customer</span><b>'+esc(draft.customer)+'</b></div><div class="row"><span>Phone</span><b>'+esc(draft.phone||'—')+'</b></div><div class="row"><span>Dress</span><b>'+esc(titleFor(draft.garment))+'</b></div><div class="row"><span>Style</span><b>'+esc(draft.style.sleeve)+' · '+esc(draft.style.neck)+'</b></div><div class="row"><span>Measurements</span><b>'+Object.keys(draft.measurements).filter(k=>draft.measurements[k]).length+' saved</b></div><div class="row"><span>Delivery</span><b>'+esc(draft.delivery)+'</b></div><div class="row"><span>Total</span><b>'+money(total)+'</b></div><div class="row"><span>Paid</span><b>'+money(paid)+'</b></div><div class="row"><span>Balance</span><b class="money">'+money(total-paid)+'</b></div></div>'}
function workOrders(){return '<h1 class="h1">Work Orders</h1><p class="sub">Orders, production status, collection and opened-order payment.</p><div class="quick"><button class="pill" data-ordfilter="all">All</button><button class="pill" data-ordfilter="New">New</button><button class="pill" data-ordfilter="In Progress">In Progress</button><button class="pill" data-ordfilter="Ready">Ready</button><button class="pill" data-ordfilter="Delivered">Delivered</button></div><section class="panel"><div class="orders" id="orderList">'+(orders.length?orders.map(orderCard).join(''):'<div class="empty"><div><h3>No saved orders</h3><p>Create your first order from New Order.</p></div></div>')+'</div></section>'}
function orderCard(o){const total=Number(o.stitching||0)+Number(o.aariCharge||0),paid=Number(o.advance||0);return '<div class="order" data-order="'+o.id+'"><div><b>'+esc(o.customer)+' · '+esc(titleFor(o.garment))+'</b><div style="margin-top:7px"><span class="badge">'+esc(o.status)+'</span> <small>Delivery: '+esc(o.delivery||'—')+'</small></div><small>Opened order: Total '+money(total)+' · Paid '+money(paid)+' · Balance '+money(total-paid)+'</small></div><button class="btn secondary" data-open="'+o.id+'">Open</button></div>'}
function backup(){return '<h1 class="h1">Backup</h1><p class="sub">Keep a copy before clearing browser data.</p><section class="panel"><div class="quick"><button class="btn primary" id="exportBtn">Export backup JSON</button><button class="btn secondary" id="restoreBtn">Restore backup</button></div><p>'+orders.length+' order(s) currently saved on this device.</p></section>'}
function bindPage(){
 if(page==='dashboard'){
  $$('[data-dash]').forEach(b=>b.onclick=()=>{const t=b.dataset.dash;if(t==='new'){page='new';step=1;draft=freshDraft()}else{page='orders'}render()});
  $$('[data-filter]').forEach(b=>b.onclick=()=>{page='orders';render();setTimeout(()=>{const val=b.dataset.filter;filterOrders(val==='progress'?'In Progress':val==='pending'?'New':'all')},0)})
 }
 if(page==='new')bindNew();
 if(page==='orders'){
   $$('[data-ordfilter]').forEach(b=>b.onclick=()=>filterOrders(b.dataset.ordfilter));
   $$('[data-open]').forEach(b=>b.onclick=()=>openOrder(b.dataset.open));
 }
 if(page==='backup'){
   $('#exportBtn').onclick=exportBackup;$('#restoreBtn').onclick=()=>$('#restoreInput').click();
 }
}
function bindNew(){
 const back=$('#backBtn'),next=$('#nextBtn');back.onclick=()=>{if(step>1){captureStep();step--;render()}else{page='dashboard';render()}};next.onclick=()=>{captureStep();if(!validateStep())return;if(step<6){step++;render()}else saveOrder()};
 if(step===2){$$('[data-cat]').forEach(b=>b.onclick=()=>{captureStep();cat=b.dataset.cat;draft.category=cat;render()});$$('[data-garment]').forEach(b=>b.onclick=()=>{draft.garment=b.dataset.garment;saveDraft();render()});$('#photoInput').onchange=handlePhotos;$('#voiceBtn').onclick=voiceToText;$('#recordBtn').onclick=recordAudio}
 if(step===3)$$('[data-style]').forEach(b=>b.onclick=()=>{draft.style[b.dataset.style]=b.dataset.value;saveDraft();render()});
 if(step===4){$$('.measureInput').forEach(i=>{i.onfocus=()=>{activeMeasure=i.dataset.measure;$('#measureDiagram').innerHTML=measureSVG(garmentGroup(draft.garment),activeMeasure)};i.oninput=()=>{draft.measurements[i.dataset.measure]=i.value;saveDraft()}});let focus=null;$$('.measureInput').forEach(i=>i.addEventListener('focus',()=>focus=i));$$('[data-num]').forEach(b=>b.onclick=()=>{if(!focus){focus=$('.measureInput');focus.focus()}let v=focus.value,n=b.dataset.num;if(n==='⌫')v=v.slice(0,-1);else if(['¼','½','¾'].includes(n))v+=n;else v+=n;focus.value=v;draft.measurements[focus.dataset.measure]=v;saveDraft()});$('#extraMeasure').onclick=()=>{const name=prompt('Extra measurement name');if(name){measureSets[garmentGroup(draft.garment)].push(name);render()}}}
}
function captureStep(){
 if(step===1){draft.customer=$('#customer')?.value.trim()||draft.customer;draft.phone=$('#phone')?.value.trim()||draft.phone}
 if(step===2){draft.designNotes=$('#designNotes')?.value||draft.designNotes}
 if(step===3){['opening','lining','padding','aari','fit'].forEach(k=>{const e=$('#'+k);if(e)draft.style[k]=e.value});draft.style.notes=$('#styleNotes')?.value||draft.style.notes}
 if(step===5){['stitching','aariCharge','advance','delivery'].forEach(k=>{const e=$('#'+k);if(e)draft[k]=e.value})}
 saveDraft()
}
function validateStep(){if(step===1&&!draft.customer){toast('Customer name is required');return false}if(step===2&&!draft.garment){toast('Select a dress / garment');return false}if(step===5){let s=Number(draft.stitching||0),a=Number(draft.aariCharge||0),p=Number(draft.advance||0);if([s,a,p].some(n=>n<0||!Number.isFinite(n))){toast('Enter valid non-negative amounts');return false}if(p>s+a){toast('Advance cannot be more than total');return false}if(!draft.delivery){toast('Delivery date is required');return false}}return true}
function saveOrder(){const total=Number(draft.stitching||0)+Number(draft.aariCharge||0);if(Number(draft.advance||0)>total){toast('Overpayment blocked');return}const o={...draft,id:Date.now().toString(36),measurements:{...draft.measurements},style:{...draft.style},photos:[...(draft.photos||[])],status:'New'};orders.unshift(o);saveOrders();sessionStorage.removeItem(draftKey);toast('Order saved');page='orders';render()}
function filterOrders(f){$$('[data-order]').forEach(el=>{const o=orders.find(x=>x.id===el.dataset.order);el.style.display=(f==='all'||o.status===f)?'grid':'none'})}
function openOrder(id){const o=orders.find(x=>x.id===id);if(!o)return;const total=Number(o.stitching||0)+Number(o.aariCharge||0),paid=Number(o.advance||0),bal=total-paid;const box=document.createElement('div');box.className='toast';box.style.cssText='right:20px;left:20px;top:80px;bottom:auto;max-width:620px;margin:auto;background:white;color:#17383f;border:1px solid #dfe7e2;padding:18px';box.innerHTML='<h3>'+esc(o.customer)+' · '+esc(titleFor(o.garment))+'</h3><div class="row"><span>Total</span><b>'+money(total)+'</b></div><div class="row"><span>Paid</span><b>'+money(paid)+'</b></div><div class="row"><span>Balance</span><b>'+money(bal)+'</b></div><div class="field"><label>Status</label><select id="modalStatus"><option>New</option><option>In Progress</option><option>Ready</option><option>Delivered</option></select></div><div class="field" style="margin-top:8px"><label>Record payment on this order</label><input id="modalPay" inputmode="decimal" placeholder="Amount" /></div><div class="actions"><button class="btn secondary" id="modalClose">Close</button><button class="btn primary" id="modalSave">Save update</button></div>';document.body.appendChild(box);$('#modalStatus',box).value=o.status;$('#modalClose',box).onclick=()=>box.remove();$('#modalSave',box).onclick=()=>{const add=Number($('#modalPay',box).value||0);if(add<0||add>bal){toast('Invalid payment / overpayment blocked');return}o.advance=Number(o.advance||0)+add;o.status=$('#modalStatus',box).value;saveOrders();box.remove();render();toast('Order updated')}
}
async function handlePhotos(e){const fs=[...e.target.files].slice(0,3-(draft.photos?.length||0));for(const f of fs){const data=await compressImage(f);draft.photos.push(data)}saveDraft();render()}
function compressImage(file){return new Promise(res=>{const rd=new FileReader();rd.onload=()=>{const img=new Image();img.onload=()=>{const s=Math.min(1,800/img.width);const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};img.src=rd.result};rd.readAsDataURL(file)})}
function voiceToText(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){toast('Voice-to-text not supported in this browser');return}const r=new R();r.lang='ta-IN';r.interimResults=false;r.onresult=e=>{draft.designNotes=(draft.designNotes?draft.designNotes+' ':'')+e.results[0][0].transcript;saveDraft();render()};r.onerror=()=>toast('Voice recognition failed');r.start();toast('Listening…')}
let recorder=null,chunks=[];async function recordAudio(){if(recorder&&recorder.state==='recording'){recorder.stop();return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{draft.voiceNote='Audio note recorded ('+Math.round(chunks.reduce((a,b)=>a+b.size,0)/1024)+' KB)';stream.getTracks().forEach(t=>t.stop());saveDraft();render()};recorder.start();$('#voiceState').textContent='Recording… tap Record audio again to stop'}catch(e){toast('Microphone permission is required')}}
function exportBackup(){const blob=new Blob([JSON.stringify({version:21,exported:new Date().toISOString(),orders},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='SK-Tailoring-backup-'+today()+'.json';a.click();URL.revokeObjectURL(a.href)}
$('#restoreInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!Array.isArray(j.orders))throw 0;orders=j.orders;saveOrders();toast('Backup restored');page='dashboard';render()}catch(err){toast('Invalid backup file')}};r.readAsText(f)});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
})();