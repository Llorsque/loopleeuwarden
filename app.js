/* Regie — applicatielogica */
/* ═══ STATE ═══ */
let S={event:{name:'Loop Leeuwarden 2026',date:'10 mei 2026'},items:[],labels:[],persons:[],todos:{global:[],items:{}},entertainment:[],huldigingen:[],vrijwilligers:[],nextId:1};
let editId=null,editSepId=null,tmpCL={},tmpTodos=[],expanded=[];

/* ═══ BOOT ═══ */
async function init(){
  // Stap 1: probeer data.json uit dezelfde folder te laden (gepubliceerde versie uit GitHub)
  let loadedFromRepo = false;
  try {
    const resp = await fetch('./data.json?_=' + Date.now(), { cache: 'no-store' });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.items && data.event) {
        // Verwijder _meta voor het in S beland
        const { _meta, ...stateData } = data;
        S = { ...S, ...stateData };
        loadedFromRepo = true;
        // Schrijf ook naar localStorage zodat offline werken werkt
        try { localStorage.setItem('regie2', JSON.stringify(S)); } catch(e) {}
      }
    }
  } catch(e) {
    // data.json bestaat niet of fetch mislukt — geen probleem, val terug op localStorage
  }

  // Stap 2: als geen data.json gevonden — gebruik localStorage
  if (!loadedFromRepo) {
    try { const r = localStorage.getItem('regie2'); if(r) S = {...S, ...JSON.parse(r)}; } catch(e) {}
  }

  // Stap 3: defaults vullen voor ontbrekende velden
  if(!S.labels.length)seedLabels();
  if(!S.items.length)seedItems();
  if(!S.entertainment||!S.entertainment.length)seedEntertainment();
  if(!S.huldigingen||!S.huldigingen.length)seedHuldigingen();
  if(!S.vrijwilligers)S.vrijwilligers=[];
  if(!S.eventInfo)S.eventInfo={naam:'',datum:'',locatie:'',editie:'',inleiding:'',noemen:'',startInfo:'',deelnemers:[]};
  if(!S.sponsoren)S.sponsoren=[];
  if(!S.parcoursen)S.parcoursen=[];
  if(!S.contacten)S.contacten=[];
  if(!S.locaties)seedLocaties();
  renderRightPanel();
  renderBoList();
  updateBadges();
  // Col resize init runs after first RP render

  // Toon bron in sidebar zodat je weet of je read-only via repo werkt of in eigen lokale modus
  const sub = document.getElementById('sb-en');
  if (sub && loadedFromRepo) {
    sub.title = 'Geladen uit data.json (repo). Wijzigingen blijven lokaal totdat je exporteert.';
  }
}

function seedLabels(){
  S.labels=[{id:'l1',name:'WEDSTRIJD',color:'#d63256'},{id:'l2',name:'HULDIGING',color:'#cc9900'},{id:'l3',name:'ENTERTAINMENT',color:'#7c3aed'},{id:'l4',name:'ACTIVATIE',color:'#d97000'},{id:'l5',name:'FINISH',color:'#1a9f5a'},{id:'l6',name:'OVERIGE',color:'#3b82f6'}];
  S.persons=['Justin','Jan','Race Commentaar','Daniel','SHOW TEAM','Jan Dupon','Paul'];
}
function seedItems(){
  const a=o=>S.items.push({id:S.nextId++,type:'item',...o});
  const bl={persoon:false,script:false,slide:false,techniek:false};
  const nf={bedrag:'',korting:''};
  S.items.push({id:S.nextId++,type:'sep',name:'VOORBEREIDING'});
  a({omschrijving:'Aanwezig team',start:'08:30',eind:'09:00',wie:'SHOW TEAM',locatie:'Podium',label:'l6',fixed:false,bijzonderheden:'',script:'',techniek:'',dj:'',checklist:{...bl},fin:{...nf}});
  S.items.push({id:S.nextId++,type:'sep',name:'OCHTENDPROGRAMMA'});
  a({omschrijving:'Start 21km',start:'09:30',eind:'09:40',wie:'Race Commentaar',locatie:'Groeneweg',label:'l1',fixed:true,bijzonderheden:'',script:'Toepraten naar de start.',techniek:'SLIDE STARTVAK op LED',dj:'Background muziek faden',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Start Kids Run 1km & 2,5km',start:'09:45',eind:'10:15',wie:'Race Commentaar',locatie:'Groeneweg',label:'l1',fixed:true,bijzonderheden:'Paul bij Finish Kids Run',script:'',techniek:'SLIDE KIDSRUN',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Omroepen nieuwe winnaars #1',start:'10:00',eind:'10:05',wie:'Justin',locatie:'Plein',label:'l2',fixed:false,bijzonderheden:'Background muziek',script:'',techniek:'',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Finish 21km',start:'10:40',eind:'10:55',wie:'Race Commentaar',locatie:'Groeneweg',label:'l1',fixed:true,bijzonderheden:'Finish Mannen en Vrouwen',script:'',techniek:'SLIDE 21KM',dj:'',checklist:{...bl},fin:{...nf}});
  S.items.push({id:S.nextId++,type:'sep',name:'MIDDAGPROGRAMMA'});
  a({omschrijving:'Huldiging 21km Mannen & Vrouwen',start:'11:15',eind:'11:30',wie:'Justin | Jan',locatie:'Podium',label:'l2',fixed:false,bijzonderheden:'Check procedure',script:'Aankondiging winnaars 21km.',techniek:'CEREMONIE SLIDES',dj:'Winnaarsmuziek bij binnenkomst',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Omroepen nieuwe winnaars #2',start:'11:00',eind:'11:05',wie:'Justin',locatie:'Plein',label:'l2',fixed:false,bijzonderheden:'',script:'',techniek:'VIDEOLOOP',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Huldiging 21km Student & Business',start:'11:50',eind:'12:00',wie:'Justin | Jan',locatie:'Podium',label:'l2',fixed:false,bijzonderheden:'Check procedure',script:'',techniek:'CEREMONIE SLIDES',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Start 5km',start:'12:15',eind:'12:25',wie:'Race Commentaar',locatie:'Groeneweg',label:'l1',fixed:true,bijzonderheden:'',script:'',techniek:'SLIDE 5KM',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Uitreiking Cheque JFSC',start:'12:45',eind:'12:50',wie:'Justin | Jan',locatie:'Podium',label:'l4',fixed:false,bijzonderheden:'',script:'',techniek:'SLIDE JFSC',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Huldiging 5km Mannen & Vrouwen',start:'12:50',eind:'13:05',wie:'Justin | Jan',locatie:'Podium',label:'l2',fixed:false,bijzonderheden:'Check procedure',script:'',techniek:'CEREMONIE SLIDES',dj:'',checklist:{...bl},fin:{...nf}});
  a({omschrijving:'Start 10km',start:'13:05',eind:'13:15',wie:'Race Commentaar',locatie:'Groeneweg',label:'l1',fixed:true,bijzonderheden:'',script:'',techniek:'SLIDE 10KM',dj:'',checklist:{...bl},fin:{...nf}});
  S.items.push({id:S.nextId++,type:'sep',name:'NAMIDDAG'});
  a({omschrijving:'Dweilorkest Jan Dupon',start:'13:00',eind:'15:00',wie:'Jan Dupon',locatie:'Plein',label:'l3',fixed:false,bijzonderheden:'',script:'',techniek:'',dj:'',checklist:{...bl},fin:{bedrag:'1200',korting:'10'}});
  a({omschrijving:'Huldiging 10km Mannen & Vrouwen',start:'14:00',eind:'14:20',wie:'Justin | Jan',locatie:'Podium',label:'l2',fixed:false,bijzonderheden:'Check procedure',script:'',techniek:'CEREMONIE SLIDES',dj:'',checklist:{...bl},fin:{...nf}});
  S.items.push({id:S.nextId++,type:'sep',name:'AFSLUITING'});
  a({omschrijving:'Einde dag / Afbouw',start:'15:30',eind:null,wie:'SHOW TEAM',locatie:'Podium',label:'l6',fixed:true,bijzonderheden:'',script:'',techniek:'',dj:'',checklist:{...bl},fin:{...nf}});
  S.todos.global=[{id:1,text:'Procedure huldigingen bevestigen',done:false},{id:2,text:'Cheque JFSC: bedrag bevestigen',done:false},{id:3,text:'Briefing sturen naar Justin en Jan',done:false},{id:4,text:'Ceremonie slides aanleveren bij LED operator',done:false},{id:5,text:'Geluidscheck plannen met ForLive',done:false},{id:6,text:'Runsheet delen met Paul',done:false}];
  save();
}
function save(){try{localStorage.setItem('regie2',JSON.stringify(S));}catch(e){}}
const lbl=id=>S.labels.find(l=>l.id===id);
const t2m=t=>{if(!t)return 0;const[h,m]=t.split(':').map(Number);return h*60+m;};
function durStr(s,e){if(!s||!e)return'—';const d=t2m(e)-t2m(s);if(d<=0)return'—';if(d<60)return d+'m';const h=Math.floor(d/60),m=d%60;return m?`${h}u${m}m`:`${h}u`;}
const euro=v=>'€\u202f'+v.toLocaleString('nl-NL',{minimumFractionDigits:2,maximumFractionDigits:2});
function calcFin(fin){
  const b=parseFloat((fin?.bedrag||'').replace(',','.'))||0;
  const k=parseFloat((fin?.korting||'').replace(',','.'))||0;
  const disc=b*(k/100);
  return{bedrag:b,korting:k,disc,netto:b-disc};
}

/* conflicts() now defined inside rpStats area */
/* initColResize called after table render */
function readiness(){const it=S.items.filter(i=>i.type==='item');if(!it.length)return 0;let t=0,d=0;it.forEach(i=>{const c=i.checklist||{};t+=4;d+=(c.persoon?1:0)+(c.script?1:0)+(c.slide?1:0)+(c.techniek?1:0);});return Math.round(d/t*100);}

/* ═══ NAV ═══ */
function gv(id,el){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nv').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+id).classList.add('active');
  if(el)el.classList.add('active');
  if(id==='rp'){if(rpView==='timeline')renderRPTimeline();else{renderRPTable();setTimeout(()=>{initColResize();},50);}}
  if(id==='td')renderTDV();
  if(id==='fin')renderFin();
  if(id==='bo')renderBoList();
  if(id==='ent')renderLib('ent');
  if(id==='hul')renderLib('hul');
  if(id==='prix')renderPrix();
  if(id==='vrij')renderVrij();
  if(id==='info')renderEventInfo();
  if(id==='spon')renderSpon();
  if(id==='parc')renderParc();
  if(id==='cont')renderCont();
  if(id==='loc')renderLoc();
}
function updateBadges(){
  const cf=conflicts();
  const nc=document.getElementById('nb-cf');nc.textContent=cf.length;nc.style.display=cf.length?'inline':'none';
  const all=[...(S.todos.global||[]),...Object.values(S.todos.items||{}).flat()];
  const p=all.filter(t=>!t.done).length;
  const nt=document.getElementById('nb-td');nt.textContent=p;nt.style.display=p?'inline':'none';
  const finItems=(S.entertainment||[]).filter(i=>parseFloat((i.bedrag||'').replace(',','.'))||0);
  const nf=document.getElementById('nb-fin');nf.textContent=finItems.length;nf.style.display=finItems.length?'inline':'none';
  document.getElementById('sb-en').textContent=S.event.name;
  const neEl=document.getElementById('nb-ent');if(neEl){neEl.textContent=(S.entertainment||[]).length;neEl.style.display=(S.entertainment||[]).length?'inline':'none';}
  const nhEl=document.getElementById('nb-hul');if(nhEl){nhEl.textContent=(S.huldigingen||[]).length;nhEl.style.display=(S.huldigingen||[]).length?'inline':'none';}
  const nvEl=document.getElementById('nb-vrij');if(nvEl){nvEl.textContent=(S.vrijwilligers||[]).length;nvEl.style.display=(S.vrijwilligers||[]).length?'inline':'none';}
  const nsEl=document.getElementById('nb-spon');if(nsEl){nsEl.textContent=(S.sponsoren||[]).length;nsEl.style.display=(S.sponsoren||[]).length?'inline':'none';}
  const npEl=document.getElementById('nb-parc');if(npEl){npEl.textContent=(S.parcoursen||[]).length;npEl.style.display=(S.parcoursen||[]).length?'inline':'none';}
  const ncEl=document.getElementById('nb-cont');if(ncEl){ncEl.textContent=(S.contacten||[]).length;ncEl.style.display=(S.contacten||[]).length?'inline':'none';}
  const nlocEl=document.getElementById('nb-loc');if(nlocEl){nlocEl.textContent=(S.locaties||[]).length;nlocEl.style.display=(S.locaties||[]).length?'inline':'none';}
}

/* ═══ BO LIST ═══ */
function renderBoList(){
  const cf=conflicts(),cfIds=new Set(cf.flatMap(c=>c.ids));
  const el=document.getElementById('bo-list-wrap');el.innerHTML='';
  let num=1;
  S.items.forEach(item=>{
    if(item.type==='sep'){
      const d=document.createElement('div');d.className='bo-sep-row';
      d.innerHTML=`<div class="bo-sep-lbl">${item.name}</div><div class="bo-sep-line"></div>
        <button class="ib" onclick="openRenameSep(${item.id})">✏</button>
        <button class="ib del" onclick="delItem(${item.id})">✕</button>`;
      el.appendChild(d);return;
    }
    if(item.type==='cue'){
      const d=document.createElement('div');
      d.className='bo-item bo-cue';
      d.onclick=()=>openEditCue(item.id);
      d.innerHTML=`
        <div class="bo-num" style="color:#a78bfa">⚡</div>
        <div class="bo-cell">
          <div class="bo-title" style="font-size:12px;color:var(--t2)">${item.omschrijving||'—'}</div>
          <div class="bo-meta">${item.wie?`<span>👤 ${item.wie}</span>`:''}</div>
        </div>
        <div class="bo-time" style="font-size:11px;color:var(--t3)">${item.start||'—'}</div>
        <button class="ib del" onclick="event.stopPropagation();S.items=S.items.filter(i=>i.id!==${item.id});save();renderBoList()">✕</button>`;
      el.appendChild(d);return;
    }
    const L=lbl(item.label),c=item.checklist||{};
    const done=[c.persoon,c.script,c.slide,c.techniek].filter(Boolean).length;
    const hasFin=parseFloat((item.fin?.bedrag||'').replace(',','.'))||0;
    const d=document.createElement('div');
    d.className='bo-item'+(editId===item.id?' sel':'');
    d.onclick=e=>{if(!e.target.closest('button'))openEdit(item.id);};
    d.innerHTML=`
      <div class="bo-num">${num++}</div>
      <div class="bo-cell">
        <div class="bo-title">
          ${cfIds.has(item.id)?'<span class="warn-dot" title="Conflict"></span>':''}
          ${item.omschrijving||'—'}
          ${item.fixed?'<span class="fixed-tag">FIXED</span>':''}
          ${hasFin?`<span style="font-size:10px;color:var(--green);font-family:var(--ui);font-weight:600">€</span>`:''}
        </div>
        <div class="bo-meta">
          ${L?`<span class="lpill" style="background:${L.color}18;color:${L.color}">${L.name}</span>`:''}
          ${item.wie?`<span>👤 ${item.wie}</span>`:''}
          ${item.locatie?`<span>📍 ${item.locatie}</span>`:''}
          <span style="color:${done===4?'var(--green)':'var(--t3)'}">✓ ${done}/4</span>
        </div>
      </div>
      <div class="bo-time">${item.start||'—'}${item.eind?' – '+item.eind:''}</div>
      <button class="ib del" onclick="delItem(${item.id})">✕</button>`;
    el.appendChild(d);
  });
  updateBadges();
}

/* ═══ RIGHT PANEL ═══ */
function settingsHTML(){return `
  <div class="fp-divider">
    <h4>Labels</h4>
    <div id="lbl-list"></div>
    <div class="mini-add">
      <input type="color" id="nl-c" value="#ffd000" style="width:30px;height:30px;border:none;background:none;cursor:pointer;padding:0;border-radius:5px;flex-shrink:0">
      <input type="text" id="nl-n" placeholder="Naam..." onkeydown="if(event.key==='Enter')addLabel()">
      <button class="btn btn-out btn-xs" onclick="addLabel()">+</button>
    </div>
  </div>
  <div class="fp-divider" style="padding-top:16px">
    <h4>Personen</h4>
    <div id="pers-list"></div>
    <div class="mini-add">
      <input type="text" id="np-n" placeholder="Naam of rol..." onkeydown="if(event.key==='Enter')addPerson()">
      <button class="btn btn-out btn-xs" onclick="addPerson()">+</button>
    </div>
  </div>
  <div class="fp-divider" style="padding-top:16px">
    <h4>Event</h4>
    <div style="display:flex;flex-direction:column;gap:9px">
      <div class="fg"><label>Naam</label><input type="text" id="ev-n" oninput="updEv()"></div>
      <div class="fg"><label>Datum</label><input type="text" id="ev-d" oninput="updEv()"></div>
    </div>
    <button class="btn btn-del btn-sm" style="width:100%;margin-top:14px" onclick="if(confirm('Alles resetten?')){localStorage.removeItem('regie2');location.reload();}">🗑 Reset alle data</button>
  </div>`;}

function wireSettings(){
  renderLblList();renderPersList();
  const en=document.getElementById('ev-n');if(en)en.value=S.event.name||'';
  const ed=document.getElementById('ev-d');if(ed)ed.value=S.event.date||'';
}
function renderLblList(){const el=document.getElementById('lbl-list');if(!el)return;el.innerHTML=S.labels.map((l,i)=>`<div class="pill-row"><div class="cswatch" style="background:${l.color}"></div><span>${l.name}</span><button class="ib del" onclick="rmLabel(${i})">✕</button></div>`).join('');}
function renderPersList(){const el=document.getElementById('pers-list');if(!el)return;el.innerHTML=S.persons.map((p,i)=>`<div class="pill-row"><span>${p}</span><button class="ib del" onclick="rmPerson(${i})">✕</button></div>`).join('');}
function addLabel(){const n=document.getElementById('nl-n').value.trim().toUpperCase(),c=document.getElementById('nl-c').value;if(!n)return;S.labels.push({id:'l'+Date.now(),name:n,color:c});document.getElementById('nl-n').value='';save();renderLblList();fillLS();}
function rmLabel(i){S.labels.splice(i,1);save();renderLblList();fillLS();}
function addPerson(){const n=document.getElementById('np-n').value.trim();if(!n)return;S.persons.push(n);document.getElementById('np-n').value='';save();renderPersList();fillPDL();}
function rmPerson(i){S.persons.splice(i,1);save();renderPersList();fillPDL();}
function updEv(){S.event.name=document.getElementById('ev-n').value;S.event.date=document.getElementById('ev-d').value;save();updateBadges();}

function formHTML(title){return `
  <div class="fp-hd">
    <h3>${title}</h3>
    <div class="fp-tabs">
      <button class="fp-tab active" onclick="fpT('basis',this)">Basis</button>
      <button class="fp-tab" onclick="fpT('draai',this)">Draaiboek</button>
      <button class="fp-tab" onclick="fpT('check',this)">Checklist</button>
      <button class="fp-tab" onclick="fpT('fin',this)">Financieel</button>
      <button class="fp-tab" onclick="fpT('todos',this)">To-do's</button>
    </div>
  </div>
  <div class="fp-body">
    <div class="fp-pane active" id="fpp-basis">
      <div class="fg"><label>Omschrijving *</label><input type="text" id="f-o" placeholder="Wat is dit onderdeel?"></div>
      <div class="fg2">
        <div class="fg"><label>Start</label><input type="time" id="f-s"></div>
        <div class="fg"><label>Eind</label><input type="time" id="f-e"></div>
      </div>
      <div class="fg"><label>Wie</label><input type="text" id="f-w" list="fp-pdl" placeholder="Naam of rol"><datalist id="fp-pdl"></datalist></div>
      <div class="fg"><label>Locatie</label><input type="text" id="f-l" placeholder="Podium, Plein, Regie…"></div>
      <div class="fg"><label>Label</label><select id="f-lb"></select></div>
      <div class="fg"><label>Fixed tijdstip</label>
        <div class="tog-row"><div class="tog" id="f-ft" onclick="togFix()"></div><span class="tog-lbl" id="f-ftl">Nee — mag verschuiven</span><input type="hidden" id="f-fv" value="false"></div>
      </div>
      <div class="fg"><label>Bijzonderheden</label><textarea id="f-biz" placeholder="Aandachtspunten…"></textarea></div>
    </div>
    <div class="fp-pane" id="fpp-draai">
      <div class="fg"><label>📝 Script / spreektekst</label><textarea id="f-sc" style="min-height:86px" placeholder="Spreektekst, aankondiging…"></textarea></div>
      <div class="fg"><label>🔊 Technische instructies</label><textarea id="f-tc" placeholder="Geluid, LED, licht, mic, slides…"></textarea></div>
      <div class="fg"><label>🎵 DJ instructies</label><textarea id="f-dj" placeholder="Nummers, cues, fade in/out…"></textarea></div>
    </div>
    <div class="fp-pane" id="fpp-check">
      <div class="cl-row" onclick="tCL('persoon')"><div class="chk" id="ck-p"></div><div><div class="cl-title">Persoon gebrieft</div><div class="cl-sub">Iedereen is op de hoogte en bevestigd</div></div></div>
      <div class="cl-row" onclick="tCL('script')"><div class="chk" id="ck-s"></div><div><div class="cl-title">Script / tekst klaar</div><div class="cl-sub">Uitgewerkt en gecontroleerd</div></div></div>
      <div class="cl-row" onclick="tCL('slide')"><div class="chk" id="ck-sl"></div><div><div class="cl-title">Slide / video gereed</div><div class="cl-sub">LED content aangeleverd bij operator</div></div></div>
      <div class="cl-row" onclick="tCL('techniek')"><div class="chk" id="ck-t"></div><div><div class="cl-title">Techniek getest</div><div class="cl-sub">Geluid, LED en licht zijn getest</div></div></div>
    </div>
    <div class="fp-pane" id="fpp-fin">
      <div class="fg2">
        <div class="fg"><label>Bedrag (excl. btw) €</label><input type="number" id="f-bed" placeholder="0.00" step="0.01" min="0" oninput="updFinCalc()"></div>
        <div class="fg"><label>Korting %</label><input type="number" id="f-kor" placeholder="0" step="0.1" min="0" max="100" oninput="updFinCalc()"></div>
      </div>
      <div class="fin-box" id="fin-calc-box" style="display:none">
        <div class="fin-box-lbl">Berekening</div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2);margin-bottom:4px"><span>Bedrag</span><span id="fc-bed">€ 0,00</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--red);margin-bottom:4px"><span id="fc-disc-lbl">Korting (0%)</span><span id="fc-disc">– € 0,00</span></div>
        <div class="fin-result"><span class="fin-result-lbl">Te betalen (excl. btw)</span><span class="fin-result-val" id="fc-net">€ 0,00</span></div>
      </div>
    </div>
    <div class="fp-pane" id="fpp-todos">
      <div id="ftd-l"></div>
      <div style="display:flex;gap:7px;margin-top:4px">
        <input type="text" id="ftd-i" placeholder="To-do voor dit onderdeel…" onkeydown="if(event.key==='Enter')addFTodo()">
        <button class="btn btn-out btn-sm" onclick="addFTodo()">+</button>
      </div>
    </div>
  </div>
  <div class="fp-foot">
    <button class="btn btn-out btn-sm" onclick="cancelEdit()">Annuleren</button>
    <button class="btn btn-y   btn-sm" onclick="saveItem()">Opslaan</button>
  </div>`;}

function updFinCalc(){
  const b=parseFloat(document.getElementById('f-bed').value)||0;
  const k=parseFloat(document.getElementById('f-kor').value)||0;
  const box=document.getElementById('fin-calc-box');
  if(!b){box.style.display='none';return;}
  box.style.display='block';
  const disc=b*(k/100),net=b-disc;
  document.getElementById('fc-bed').textContent=euro(b);
  document.getElementById('fc-disc-lbl').textContent=`Korting (${k}%)`;
  document.getElementById('fc-disc').textContent='– '+euro(disc);
  document.getElementById('fc-net').textContent=euro(net);
}

function renderRightPanel(){
  const panel=document.getElementById('bo-right-panel');
  if(editId===null){
    panel.innerHTML=`<div class="fp-hint"><div class="fp-hint-icon">✏️</div><p>Klik een onderdeel<br>om te bewerken</p></div>${settingsHTML()}`;
    wireSettings();return;
  }
  const item=S.items.find(i=>i.id===editId);
  if(!item){renderRightPanel();return;}
  panel.innerHTML=formHTML('Bewerken')+settingsHTML();
  fillLS();fillPDL();updateCLUI();renderFTD();wireSettings();
  document.getElementById('f-o').value=item.omschrijving||'';
  document.getElementById('f-s').value=item.start||'';
  document.getElementById('f-e').value=item.eind||'';
  document.getElementById('f-w').value=item.wie||'';
  document.getElementById('f-l').value=item.locatie||'';
  document.getElementById('f-lb').value=item.label||'';
  document.getElementById('f-biz').value=item.bijzonderheden||'';
  document.getElementById('f-sc').value=item.script||'';
  document.getElementById('f-tc').value=item.techniek||'';
  document.getElementById('f-dj').value=item.dj||'';
  document.getElementById('f-bed').value=item.fin?.bedrag||'';
  document.getElementById('f-kor').value=item.fin?.korting||'';
  updFinCalc();
  const fx=item.fixed||false;
  document.getElementById('f-fv').value=fx?'true':'false';
  document.getElementById('f-ft').classList.toggle('on',fx);
  document.getElementById('f-ftl').textContent=fx?'Ja — vast tijdstip':'Nee — mag verschuiven';
}
function renderNewForm(){
  const panel=document.getElementById('bo-right-panel');
  panel.innerHTML=formHTML('Nieuw onderdeel')+settingsHTML();
  fillLS();fillPDL();updateCLUI();renderFTD();wireSettings();
}

function fpT(id,btn){document.querySelectorAll('.fp-pane').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.fp-tab').forEach(b=>b.classList.remove('active'));document.getElementById('fpp-'+id).classList.add('active');if(btn)btn.classList.add('active');}
function fillLS(){const el=document.getElementById('f-lb');if(!el)return;const v=el.value;el.innerHTML='<option value="">— Geen —</option>'+S.labels.map(l=>`<option value="${l.id}">${l.name}</option>`).join('');el.value=v;}
function fillPDL(){const el=document.getElementById('fp-pdl');if(!el)return;el.innerHTML=S.persons.map(p=>`<option value="${p}">`).join('');}
function togFix(){const c=document.getElementById('f-fv').value==='true',n=!c;document.getElementById('f-fv').value=n?'true':'false';document.getElementById('f-ft').classList.toggle('on',n);document.getElementById('f-ftl').textContent=n?'Ja — vast tijdstip':'Nee — mag verschuiven';}
function tCL(k){tmpCL[k]=!tmpCL[k];updateCLUI();}
function updateCLUI(){[['persoon','ck-p'],['script','ck-s'],['slide','ck-sl'],['techniek','ck-t']].forEach(([k,id])=>{const el=document.getElementById(id);if(el)el.className='chk'+(tmpCL[k]?' on':'');});}
function renderFTD(){const el=document.getElementById('ftd-l');if(!el)return;el.innerHTML=tmpTodos.length?tmpTodos.map((t,i)=>`<div class="td-mini"><div class="chk ${t.done?'on':''}" onclick="tFT(${i})"></div><span class="${t.done?'done-t':''}">${t.text}</span><button class="ib del" onclick="rmFT(${i})">✕</button></div>`).join(''):'<p style="font-size:11px;color:var(--t3);margin-bottom:6px">Nog geen to-do\'s.</p>';}
function addFTodo(){const i=document.getElementById('ftd-i'),t=i.value.trim();if(!t)return;tmpTodos.push({id:Date.now(),text:t,done:false});i.value='';renderFTD();}
function tFT(i){tmpTodos[i].done=!tmpTodos[i].done;renderFTD();}
function rmFT(i){tmpTodos.splice(i,1);renderFTD();}

/* ═══ CRUD ═══ */
function openNew(){editId=null;tmpCL={persoon:false,script:false,slide:false,techniek:false};tmpTodos=[];renderNewForm();renderBoList();}
function openEdit(id){const item=S.items.find(i=>i.id===id);if(!item||item.type==='sep')return;editId=id;tmpCL={...(item.checklist||{})};tmpTodos=[...(S.todos.items[id]||[])];renderRightPanel();renderBoList();}
function cancelEdit(){editId=null;renderRightPanel();renderBoList();}
function saveItem(){
  const o=document.getElementById('f-o').value.trim();if(!o){alert('Vul een omschrijving in.');return;}
  const data={type:'item',omschrijving:o,start:document.getElementById('f-s').value,eind:document.getElementById('f-e').value,wie:document.getElementById('f-w').value,locatie:document.getElementById('f-l').value,label:document.getElementById('f-lb').value,bijzonderheden:document.getElementById('f-biz').value,script:document.getElementById('f-sc').value,techniek:document.getElementById('f-tc').value,dj:document.getElementById('f-dj').value,fixed:document.getElementById('f-fv').value==='true',checklist:{...tmpCL},fin:{bedrag:document.getElementById('f-bed').value,korting:document.getElementById('f-kor').value}};
  if(editId!==null){const i=S.items.findIndex(x=>x.id===editId);if(i!==-1)S.items[i]={...S.items[i],...data};S.todos.items[editId]=tmpTodos;}
  else{const id=S.nextId++;S.items.push({id,...data});S.todos.items[id]=tmpTodos;}
  editId=null;save();renderRightPanel();renderBoList();
}
function delItem(id){if(!confirm('Verwijder dit onderdeel?'))return;S.items=S.items.filter(i=>i.id!==id);if(editId===id)editId=null;save();renderRightPanel();renderBoList();}
function openSepModal(){editSepId=null;document.getElementById('sep-i').value='';document.getElementById('sep-ovl').classList.add('open');setTimeout(()=>document.getElementById('sep-i').focus(),80);}
function openRenameSep(id){editSepId=id;const it=S.items.find(i=>i.id===id);document.getElementById('sep-i').value=it?it.name:'';document.getElementById('sep-ovl').classList.add('open');}
function closeSepOvl(){document.getElementById('sep-ovl').classList.remove('open');}
function saveSep(){const n=document.getElementById('sep-i').value.trim().toUpperCase();if(!n)return;if(editSepId!==null){const i=S.items.findIndex(x=>x.id===editSepId);if(i!==-1)S.items[i].name=n;}else S.items.push({id:S.nextId++,type:'sep',name:n});save();closeSepOvl();renderBoList();}

/* ═══ TO-DO ═══ */
function renderTDV(){
  const gl=document.getElementById('gtd-list');
  gl.innerHTML=(S.todos.global||[]).map((t,i)=>`<div class="td-item"><div class="chk ${t.done?'on':''}" onclick="tGTD(${i})"></div><span class="${t.done?'done-t':''}">${t.text}</span><button class="ib del" onclick="rmGTD(${i})">✕</button></div>`).join('')||'<p style="font-size:12px;color:var(--t3);padding:9px 0">Geen items.</p>';
  let html='';
  S.items.filter(i=>i.type==='item').forEach(item=>{
    const td=S.todos.items[item.id]||[];if(!td.length)return;
    const L=lbl(item.label);
    html+=`<div class="td-card"><div class="td-card-hd">${item.omschrijving}${L?` <span class="lpill" style="background:${L.color}18;color:${L.color}">${L.name}</span>`:''}</div><div class="td-card-items">${td.map((t,i)=>`<div class="td-item"><div class="chk ${t.done?'on':''}" onclick="tITD(${item.id},${i})"></div><span class="${t.done?'done-t':''}">${t.text}</span><button class="ib del" onclick="rmITD(${item.id},${i})">✕</button></div>`).join('')}</div></div>`;
  });
  document.getElementById('itd-out').innerHTML=html;
  updateBadges();
}
function addGTodo(){const i=document.getElementById('gtd-i'),t=i.value.trim();if(!t)return;S.todos.global.push({id:Date.now(),text:t,done:false});i.value='';save();renderTDV();}
function tGTD(i){S.todos.global[i].done=!S.todos.global[i].done;save();renderTDV();}
function rmGTD(i){S.todos.global.splice(i,1);save();renderTDV();}
function tITD(id,i){S.todos.items[id][i].done=!S.todos.items[id][i].done;save();renderTDV();}
function rmITD(id,i){S.todos.items[id].splice(i,1);save();renderTDV();}

/* ═══ FINANCIEEL VIEW ═══ */
function renderFin(){
  const tb=document.getElementById('fin-tb');tb.innerHTML='';
  let totB=0,totD=0,totN=0,count=0;

  // Financieel overzicht haalt data ALLEEN uit S.entertainment
  const ents=(S.entertainment||[]);
  const withCosts=ents.filter(item=>parseFloat((item.bedrag||'').replace(',','.'))||0);

  if(!withCosts.length){
    tb.innerHTML=`<tr><td colspan="6"><div class="fin-empty"><p>Nog geen kosten ingevoerd.<br>Voeg bedragen toe via <b>Entertainment → ✏ Bewerk → Financieel</b>.</p></div></td></tr>`;
    document.getElementById('fin-tot').textContent=euro(0);
    document.getElementById('fin-disc-tot').textContent=euro(0);
    document.getElementById('fin-net').textContent=euro(0);
    document.getElementById('fin-count').textContent='0 acts met kosten';
    return;
  }

  // header row
  const hdr=document.createElement('tr');hdr.className='fin-sep';
  hdr.innerHTML=`<td colspan="6"><span class="fin-sep-lbl">🎭 Entertainment</span></td>`;
  tb.appendChild(hdr);

  withCosts.forEach(item=>{
    const f=calcFin({bedrag:item.bedrag,korting:item.korting});
    count++;totB+=f.bedrag;totD+=f.disc;totN+=f.netto;
    const statusCls='status-'+(item.status||'aangevraagd');
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>
        <div style="font-size:13px;font-weight:500">${item.naam}</div>
        <div style="display:flex;align-items:center;gap:7px;margin-top:3px">
          ${item.type?`<span style="font-size:10px;color:var(--t3)">${item.type}</span>`:''}
          <span class="status-pill ${statusCls}">${item.status||'aangevraagd'}</span>
        </div>
        ${item.contactpersoon?`<div style="font-size:11px;color:var(--t3);margin-top:2px">👤 ${item.contactpersoon}</div>`:''}
      </td>
      <td><span style="font-size:11px;color:var(--t2)">${item.locatie||'—'}</span></td>
      <td class="r fin-amount">${euro(f.bedrag)}</td>
      <td class="r">${f.korting?`<span style="font-size:12px;color:var(--t2)">${f.korting}%</span>`:'<span style="color:var(--t3)">—</span>'}</td>
      <td class="r fin-disc">${f.disc?`<span style="color:var(--red)">– ${euro(f.disc)}</span>`:'<span style="color:var(--t3)">—</span>'}</td>
      <td class="r fin-final">${euro(f.netto)}</td>`;
    tb.appendChild(tr);
  });

  const tr=document.createElement('tr');tr.className='fin-total-row';
  tr.innerHTML=`
    <td colspan="2" style="font-family:var(--ui);font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--t2)">Totaal (${count} act${count!==1?'s':''})</td>
    <td class="r fin-amount">${euro(totB)}</td>
    <td class="r"></td>
    <td class="r fin-disc"><span style="color:var(--red)">– ${euro(totD)}</span></td>
    <td class="r fin-final" style="font-size:16px;color:var(--green)">${euro(totN)}</td>`;
  tb.appendChild(tr);

  document.getElementById('fin-tot').textContent=euro(totB);
  document.getElementById('fin-disc-tot').textContent=euro(totD);
  document.getElementById('fin-net').textContent=euro(totN);
  document.getElementById('fin-count').textContent=`${count} act${count!==1?'s':''} met kosten`;
}

/* ═══ REGIEPAD — NAVIGATIE, AUTO, TABEL, TIJDLIJN ═══ */
let rpView='table',rpIdx=-1,rpItemIds=[],rpAutoOn=false,rpAutoTimer=null;
let rpSort='time',rpSortDir=1,rpFilters=new Set(),rpAcked=new Set(),cfPanelOpen=true;

function getAmsTime(){
  try{return new Date().toLocaleString('nl-NL',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',','').trim();}
  catch(e){const n=new Date();return String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');}
}
function findNowIdx(items){
  const now=t2m(getAmsTime());let best=-1;
  for(let i=0;i<items.length;i++){const it=items[i];if(!it.start)continue;const s=t2m(it.start),e=it.eind?t2m(it.eind):s+1;if(now>=s&&now<e)return i;if(now>=s)best=i;}
  return best;
}
function toggleAuto(){
  rpAutoOn=!rpAutoOn;
  const btn=document.getElementById('auto-btn'),lbl=document.getElementById('auto-lbl'),t=document.getElementById('live-time');
  if(rpAutoOn){btn.classList.add('on');lbl.textContent='Auto aan';doAutoFollow();rpAutoTimer=setInterval(doAutoFollow,20000);}
  else{btn.classList.remove('on');lbl.textContent='Auto';t.textContent='';clearInterval(rpAutoTimer);if(rpView==='timeline')renderRPTimeline();else renderRPTable();}
}
function doAutoFollow(){
  const t=getAmsTime();document.getElementById('live-time').textContent=t;
  const items=S.items.filter(i=>i.type==='item');
  const idx=findNowIdx(items);
  const nowId=idx!==-1?items[idx].id:null;
  // Set rpIdx to position in the rendered (sorted) list
  if(nowId!==null){
    const pos=rpItemIds.indexOf(nowId);
    if(pos!==-1)rpIdx=pos;
  }
  if(rpView==='table'){
    renderRPTable();
    if(nowId!==null)scrollToRpId(nowId);
  }else renderRPTimeline();
}
function setRpView(v){
  rpView=v;
  document.getElementById('rvt-table').classList.toggle('active',v==='table');
  document.getElementById('rvt-timeline').classList.toggle('active',v==='timeline');
  document.getElementById('rp-table-div').style.display=v==='table'?'block':'none';
  document.getElementById('rp-tl-div').style.display=v==='timeline'?'flex':'none';
  if(v==='table')renderRPTable();else renderRPTimeline();
}
document.addEventListener('keydown',e=>{
  if(!document.getElementById('view-rp').classList.contains('active'))return;
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if(e.key==='ArrowDown'){e.preventDefault();moveRpIdx(1);}
  else if(e.key==='ArrowUp'){e.preventDefault();moveRpIdx(-1);}
  else if(e.key==='Enter'||e.key===' '){
    e.preventDefault();
    if(rpIdx>=0&&rpIdx<rpItemIds.length){
      const id=rpItemIds[rpIdx],item=S.items.find(i=>i.id===id);
      if(item){const ix=expanded.indexOf(id);if(ix===-1)expanded.push(id);else expanded.splice(ix,1);if(rpView==='table')renderRPTable();}
    }
  }
});
function moveRpIdx(dir){
  rpItemIds=S.items.filter(i=>i.type==='item').map(i=>i.id);if(!rpItemIds.length)return;
  if(rpIdx<0)rpIdx=0;else rpIdx=Math.max(0,Math.min(rpItemIds.length-1,rpIdx+dir));
  if(rpView==='table'){renderRPTable();scrollToRpId(rpItemIds[rpIdx]);}else renderRPTimeline();
}
function scrollToRpId(id){setTimeout(()=>{const r=document.querySelector(`tr[data-rpid="${id}"]`);if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'});},40);}

function rpStats(){
  const cf=conflicts();
  document.getElementById('rp-t').textContent=S.event.name;document.getElementById('rp-st').textContent=S.event.date;
  const ri=S.items.filter(i=>i.type==='item');document.getElementById('rs-i').textContent=ri.length;
  const pct=readiness();document.getElementById('rs-r').textContent=pct+'%';document.getElementById('rs-rb').style.width=pct+'%';
  const open=cf.filter(c=>!c.ids.every(id=>rpAcked.has(id+'_'+c.key)));
  // Conflict count goes to sidebar badge
  const nbCf=document.getElementById('nb-cf');if(nbCf){nbCf.textContent=open.length;nbCf.style.display=open.length?'inline':'none';}
  let tot=0;ri.forEach(i=>{if(i.start&&i.eind){const d=t2m(i.eind)-t2m(i.start);if(d>0)tot+=d;}});
  const h=Math.floor(tot/60),m=tot%60;document.getElementById('rs-d').textContent=m?`${h}u ${m}m`:`${h}u`;
  renderCfPanel(cf);
}
function conflicts(){
  const it=S.items.filter(i=>i.type==='item'&&i.start&&i.eind),res=[];
  for(let i=0;i<it.length;i++)for(let j=i+1;j<it.length;j++){
    const a=it[i],b=it[j];
    if(t2m(a.start)<t2m(b.eind)&&t2m(b.start)<t2m(a.eind)){
      const key=[a.id,b.id].sort().join('_');
      if(a.wie&&b.wie&&a.wie===b.wie)res.push({key,msg:`"${a.wie}" tegelijk ingepland: "${a.omschrijving}" en "${b.omschrijving}"`,type:'persoon',ids:[a.id,b.id],times:`${a.start}–${a.eind} ↔ ${b.start}–${b.eind}`});
      else res.push({key,msg:`Tijdoverlap: "${a.omschrijving}" en "${b.omschrijving}"`,type:'tijd',ids:[a.id,b.id],times:`${a.start}–${a.eind} ↔ ${b.start}–${b.eind}`});
    }
  }return res;
}
function renderCfPanel(cf){
  const wrap=document.getElementById('cf-panel-wrap');
  if(!cf||!cf.length){wrap.innerHTML='';return;}
  const openCf=cf.filter(c=>!rpAcked.has(c.ids.join('_')+'_'+c.key));
  if(!openCf.length){wrap.innerHTML='';return;}
  const ackKey=c=>c.ids.join('_')+'_'+c.key;
  const isAcked=c=>rpAcked.has(ackKey(c));
  const open=cf.filter(c=>!isAcked(c));
  wrap.innerHTML=`
    <div class="cf-panel" style="margin-bottom:0">
      <div class="cf-panel-hd" onclick="cfPanelOpen=!cfPanelOpen;renderRPTable()">
        <div class="cf-panel-icon">⚠</div>
        <div class="cf-panel-title" style="color:${open.length?'var(--orange)':'var(--green)'}">
          ${open.length?`${open.length} conflict${open.length>1?'en':''} gevonden`:'Alle conflicten afgehandeld'}
        </div>

        <span style="font-size:12px;color:var(--t3);margin-left:8px">${cfPanelOpen?'▲':'▼'}</span>
      </div>
      ${cfPanelOpen&&open.length?`<div>${open.map(c=>{
        const ids=c.ids;
        return `<div class="cf-row">
          <div class="cf-row-dot"></div>
          <div>
            <div class="cf-row-msg">${c.msg}</div>
            <div class="cf-row-time">${c.times}</div>
          </div>
          <div class="cf-row-acts">
            <button class="cf-resolve-btn" onclick="cfResolve(${ids[0]},${ids[1]})" title="Ga naar eerste onderdeel om aan te passen">✏ Oplossen</button>
            <button class="cf-ack-btn" onclick="cfAck('${ackKey(c)}')">Accordeer</button>
          </div>
        </div>`;
      }).join('')}</div>`:''}
    </div>`;
}
function cfAck(key){
  if(rpAcked.has(key))rpAcked.delete(key);else rpAcked.add(key);
  renderRPTable();
}
function cfResolve(id1,id2){
  gv('bo',document.getElementById('ni-bo'));
  setTimeout(()=>openEdit(id1),100);
}


/* ─── SORT & FILTER ─── */
function setSort(key){
  if(rpSort===key)rpSortDir*=-1;else{rpSort=key;rpSortDir=1;}
  document.querySelectorAll('.sort-chip').forEach(c=>c.classList.remove('active'));
  const chip=document.getElementById('sc-'+key);if(chip)chip.classList.add('active');
  const arrows={time:'sa-time'};
  if(arrows[key]){const a=document.getElementById(arrows[key]);if(a)a.textContent=rpSortDir===1?'↑':'↓';}
  renderRPTable();
}
function toggleFilter(key){
  if(rpFilters.has(key))rpFilters.delete(key);else rpFilters.add(key);
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  rpFilters.forEach(k=>{const el=document.getElementById('fc-'+k);if(el)el.classList.add('active');});
  renderRPTable();
}
function getSortedItems(){
  const cf=conflicts();
  const cfIdSet=new Set(cf.flatMap(c=>c.ids));
  const ackedKeys=new Set([...rpAcked]);
  // Build flat list of items (no seps) for sorting
  let items=S.items.filter(i=>i.type==='item'||i.type==='cue');
  // Apply filters
  if(rpFilters.has('fixed'))    items=items.filter(i=>i.fixed);
  if(rpFilters.has('conflict')) items=items.filter(i=>cfIdSet.has(i.id)&&!cf.filter(c=>c.ids.includes(i.id)).every(c=>rpAcked.has(c.ids.join('_')+'_'+c.key)));
  if(rpFilters.has('todo')){
    items=items.filter(i=>{
      const c=i.checklist||{};
      const done=[c.persoon,c.script,c.slide,c.techniek].filter(Boolean).length;
      const td=(S.todos.items[i.id]||[]).filter(t=>!t.done).length;
      return done<4||td>0;
    });
  }
  // Sort
  items=items.slice().sort((a,b)=>{
    let va,vb;
    if(rpSort==='time'){va=t2m(a.start||'99:99');vb=t2m(b.start||'99:99');}
    else if(rpSort==='label'){va=a.label||'';vb=b.label||'';}
    else if(rpSort==='wie'){va=(a.wie||'').toLowerCase();vb=(b.wie||'').toLowerCase();}
    if(va<vb)return-rpSortDir;if(va>vb)return rpSortDir;return 0;
  });
  return{items,cfIdSet};
}

function renderRPTable(){
  rpStats();
  const {items:sortedItems,cfIdSet}=getSortedItems();
  rpItemIds=sortedItems.map(i=>i.id);
  const nowItems=S.items.filter(i=>i.type==='item');
  const nowIdx=rpAutoOn?findNowIdx(nowItems):-1;
  const nowId=nowIdx!==-1?nowItems[nowIdx].id:null;
  const cf=conflicts();
  const ackKey=c=>c.ids.join('_')+'_'+c.key;
  // Build cfId -> conflict map for quick lookup
  const cfByItemId={};
  cf.forEach(c=>c.ids.forEach(id=>{if(!cfByItemId[id])cfByItemId[id]=[];cfByItemId[id].push(c);}));
  const tb=document.getElementById('rp-tb');tb.innerHTML='';let num=1,ic=0;
  // If sorted/filtered, render flat list without section headers
  const useFlat=rpSort!=='time'||rpFilters.size>0;
  const renderItems=useFlat?sortedItems:null;
  // flat render
  if(useFlat){
    if(!sortedItems.length){
      tb.innerHTML=`<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--t3);font-size:13px">Geen resultaten met huidige filter</td></tr>`;
    }
    sortedItems.forEach(item=>{
      renderRpRow(item,num++,ic,nowId,cfByItemId,cfIdSet,tb);
      ic++;
    });
  } else {
    // Sorted by time: show section headers + items sorted by time within group
    // Collect items per section
    let currentSepId=null;
    const itemsBySep={_nosep:[]};
    const sepOrder=[];
    S.items.forEach(item=>{
      if(item.type==='sep'){currentSepId=item.id;if(!itemsBySep[item.id])itemsBySep[item.id]=[];sepOrder.push(item);}
      else{const k=currentSepId||'_nosep';if(!itemsBySep[k])itemsBySep[k]=[];itemsBySep[k].push(item);}
    });
    // Sort each group's items by time
    const sortGroup=arr=>arr.slice().sort((a,b)=>{return t2m(a.start||'99:99')-t2m(b.start||'99:99');});
    // Render nosep items first if any
    if(itemsBySep['_nosep']&&itemsBySep['_nosep'].length){
      sortGroup(itemsBySep['_nosep']).forEach(item=>{renderRpRow(item,num++,ic,nowId,cfByItemId,cfIdSet,tb);ic++;});
    }
    sepOrder.forEach(sep=>{
      const grp=sortGroup(itemsBySep[sep.id]||[]);
      if(!grp.length)return;
      const tr=document.createElement('tr');tr.className='rp-sep';
      tr.innerHTML=`<td colspan="9"><span class="rp-sep-lbl">▸ ${sep.name}</span></td>`;tb.appendChild(tr);
      grp.forEach(item=>{renderRpRow(item,num++,ic,nowId,cfByItemId,cfIdSet,tb);ic++;});
    });
  }
}

function renderRpRow(item,num,ic,nowId,cfByItemId,cfIdSet,tb){
  // ── CUE ROW ──
  if(item.type==='cue'){
    const isKbd=rpItemIds[rpIdx]===item.id;
    const tr=document.createElement('tr');
    tr.className='rp-cue-row'+(isKbd?' kbd-sel':'');
    tr.dataset.rpid=item.id;
    tr.onclick=()=>{
      const pos=rpItemIds.indexOf(item.id);if(pos!==-1)rpIdx=pos;
      openEditCue(item.id);
    };
    tr.innerHTML=`
      <td></td>
      <td><span class="cue-time">${item.start||''}</span></td>
      <td colspan="2"></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cue-badge">⚡ cue</span>
          <span class="cue-label">${item.omschrijving||''}</span>
          ${item.bijzonderheden?`<span style="font-size:11px;color:var(--t3)">· ${item.bijzonderheden}</span>`:''}
        </div>
      </td>
      <td><span class="cue-wie">${item.wie||''}</span></td>
      <td colspan="3"></td>`;
    tb.appendChild(tr);
    return;
  }
  const c=item.checklist||{},L=lbl(item.label),exp=expanded.includes(item.id);
  const isNow=rpAutoOn&&nowId!==null&&nowId===item.id;
  const isKbd=rpItemIds[rpIdx]===item.id;
  const ckDone=[c.persoon,c.script,c.slide,c.techniek].filter(Boolean).length;
  const itemCfs=cfByItemId[item.id]||[];
  const hasOpenCf=itemCfs.some(cf=>!rpAcked.has(cf.ids.join('_')+'_'+cf.key));
  const isAckedCf=itemCfs.length>0&&!hasOpenCf;
  const tr=document.createElement('tr');
  let cls='rp-row';
  if(isKbd)cls+=' kbd-sel';
  if(isNow)cls+=' now-active';
  if(hasOpenCf)cls+=' has-conflict';
  if(L)cls+=' has-color';
  tr.className=cls;
  if(L)tr.style.setProperty('--row-color',L.color);
  tr.dataset.rpid=item.id;
  const iid=item.id;
  tr.onclick=()=>{
    const jx=expanded.indexOf(iid);if(jx===-1)expanded.push(iid);else expanded.splice(jx,1);
    renderRPTable();
  };
  const tStart=item.start?`<span class="rp-ts">${item.start}</span>`:'<span style="color:var(--t3)">—</span>';
  const tEind=item.eind?`<span class="rp-te">${item.eind}</span>`:'';
  const tDur=item.start&&item.eind?`<span class="rp-dur">${durStr(item.start,item.eind)}</span>`:'';
  const fixedIcon=item.fixed?'<span class="fixed-icon" title="Vast tijdstip">📌</span>':'';
  const cfIcon=hasOpenCf?'<span style="color:var(--orange);font-size:12px" title="Conflict">⚠</span>':'';
  const nowBadge=isNow?'<span class="now-badge">▶ nu</span>':'';
  const labelPill=L?`<span class="lpill" style="background:${L.color}20;color:${L.color};border:1px solid ${L.color}44">${L.name}</span>`:'—';
  tr.innerHTML=`
    <td><span class="rp-num">${num}</span></td>
    <td>${tStart}</td>
    <td>${tEind}</td>
    <td>${tDur}</td>
    <td>
      <div style="display:flex;align-items:center;gap:6px">
        ${cfIcon}
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;display:flex;align-items:center;gap:4px;flex-wrap:wrap">
            ${item.omschrijving||'—'}${fixedIcon}${nowBadge}
          </div>
          ${item.bijzonderheden?`<div style="font-size:11px;color:var(--t3);margin-top:2px">${item.bijzonderheden}</div>`:''}
        </div>
        <span style="font-size:10px;color:var(--t3);flex-shrink:0">${exp?'▲':'▼'}</span>
      </div>
    </td>
    <td><span style="font-size:12px">${item.wie||'—'}</span></td>
    <td><span style="font-size:12px;color:var(--t3)">${item.locatie||'—'}</span></td>
    <td>${labelPill}</td>
    <td><div class="ckd">
      <div class="ckd-dot ${c.persoon?'on':''}"></div>
      <div class="ckd-dot ${c.script?'on':''}"></div>
      <div class="ckd-dot ${c.slide?'on':''}"></div>
      <div class="ckd-dot ${c.techniek?'on':''}"></div>
    </div></td>`;
  tb.appendChild(tr);
  if(exp){
    const todos=(S.todos.items[item.id]||[]);
    const dr=document.createElement('tr');dr.className='rp-det-row open';
    const ackBtns=itemCfs.length?`<button class="cf-ack-btn" style="margin-left:auto" onclick="event.stopPropagation();${itemCfs.map(cf=>`cfAck('${cf.ids.join('_')+'_'+cf.key}')`).join(';')};renderRPTable()">${hasOpenCf?'Accordeer conflict':'✓ Geaccordeerd'}</button>`:'';
    dr.innerHTML=`<td colspan="9"><div class="det-panel">
      <div class="det-col">
        <div class="det-col-lbl">✓ Checklist</div>
        <div>
          <div class="det-ck-item"><div class="det-ck-dot ${c.persoon?'on':''}">${c.persoon?'✓':''}</div><span class="det-ck-lbl ${c.persoon?'done':''}">Persoon gebrieft</span></div>
          <div class="det-ck-item"><div class="det-ck-dot ${c.script?'on':''}">${c.script?'✓':''}</div><span class="det-ck-lbl ${c.script?'done':''}">Script / tekst klaar</span></div>
          <div class="det-ck-item"><div class="det-ck-dot ${c.slide?'on':''}">${c.slide?'✓':''}</div><span class="det-ck-lbl ${c.slide?'done':''}">Slide / video gereed</span></div>
          <div class="det-ck-item"><div class="det-ck-dot ${c.techniek?'on':''}">${c.techniek?'✓':''}</div><span class="det-ck-lbl ${c.techniek?'done':''}">Techniek getest</span></div>
        </div>
        ${todos.length?`<div style="margin-top:14px"><div class="det-col-lbl">To-do's</div>${todos.map(t=>`<div class="det-td-item"><div class="det-td-bullet ${t.done?'done':''}"></div><span class="det-td-txt ${t.done?'done':''}">${t.text}</span></div>`).join('')}</div>`:''}
      </div>
      <div class="det-col">
        <div class="det-col-lbl">📝 Script / spreektekst</div>
        ${item.script?`<div class="det-text">${item.script.split('\n').join('<br>')}</div>`:'<div class="det-empty">Geen script ingevuld</div>'}
        ${item.techniek?`<div style="margin-top:16px"><div class="det-col-lbl">🔊 Technische instructies</div><div class="det-text">${item.techniek.split('\n').join('<br>')}</div></div>`:''}
      </div>
      <div class="det-col">
        <div class="det-col-lbl">🎵 DJ instructies</div>
        ${item.dj?`<div class="det-text">${item.dj.split('\n').join('<br>')}</div>`:'<div class="det-empty">Geen DJ instructies</div>'}
        ${itemCfs.length?`<div style="margin-top:16px"><div class="det-col-lbl" style="color:var(--orange)">⚠ Conflicten</div>${itemCfs.map(cf=>`<div style="font-size:12px;color:var(--t2);margin-bottom:5px;padding:6px 8px;background:var(--o-bg);border-radius:6px">${cf.msg}<br><span style="font-family:var(--fm);font-size:10px;color:var(--t3)">${cf.times}</span></div>`).join('')}</div>`:''}
      </div>
      <div class="det-actions">
        <button class="btn btn-out btn-sm" style="font-size:10px;padding:5px 12px" onclick="event.stopPropagation();gv('bo',document.getElementById('ni-bo'));setTimeout(()=>openEdit(${item.id}),80)">✏ Bewerken</button>
        <span style="font-size:11px;color:var(--t3)">${ckDone}/4 checks</span>
        ${ackBtns}
      </div>
    </div></td>`;
    tb.appendChild(dr);
  }
}

function renderRPTimeline(){
  rpStats();
  const allItems=S.items.filter(i=>i.type==='item'&&i.start);
  rpItemIds=allItems.map(i=>i.id);
  if(!allItems.length){document.getElementById('tl-rows').innerHTML='<div style="padding:32px;color:var(--t3);font-family:var(--ui);font-size:11px;letter-spacing:1px;text-transform:uppercase">Geen onderdelen met tijden</div>';renderTlLibPanel();return;}
  const starts=allItems.map(i=>t2m(i.start));
  const ends=allItems.filter(i=>i.eind).map(i=>t2m(i.eind));
  const minT=Math.floor((Math.min(...starts)-15)/60)*60;
  const maxT=Math.ceil((Math.max(...ends,...starts)+30)/60)*60;
  const span=maxT-minT;
  const toP=m=>((m-minT)/span*100).toFixed(3)+'%';
  const marks=document.getElementById('tl-marks');marks.innerHTML='';
  for(let t=minT;t<=maxT;t+=60){const mk=document.createElement('div');mk.className='tl-h-mark';mk.style.left=toP(t);mk.innerHTML=`<div class="tl-h-lbl">${String(Math.floor(t/60)).padStart(2,'0')}:00</div><div class="tl-h-tick"></div>`;marks.appendChild(mk);}
  for(let t=minT+30;t<maxT;t+=60){const tk=document.createElement('div');tk.className='tl-half';tk.style.left=toP(t);marks.appendChild(tk);}
  const nowMin=t2m(getAmsTime()),showNow=rpAutoOn&&nowMin>=minT&&nowMin<=maxT;
  const ns=document.getElementById('tl-now-sticky');ns.style.display=showNow?'block':'none';
  if(showNow){document.getElementById('tl-now-line').style.cssText=`left:${toP(nowMin)};height:${S.items.length*34+80}px`;document.getElementById('tl-now-pill').style.left=toP(nowMin);document.getElementById('tl-now-pill').textContent=getAmsTime();}
  const nowIdx=rpAutoOn?findNowIdx(allItems):-1;
  const rowsEl=document.getElementById('tl-rows');rowsEl.innerHTML='';let ic=0;
  S.items.forEach(item=>{
    const row=document.createElement('div');
    if(item.type==='sep'){row.className='tl-row-tl tl-sep-row';row.innerHTML=`<div class="tl-lbl-col"><span class="tl-sep-lbl">▸ ${item.name}</span></div><div style="flex:1"></div>`;rowsEl.appendChild(row);return;}
    if(!item.start){ic++;return;}
    const isKbd=rpIdx===ic,isNow=rpAutoOn&&nowIdx===ic;
    row.className='tl-row-tl'+(isNow?' tl-now-row':'')+(isKbd?' tl-kbd':'');
    const ic2=ic;row.onclick=()=>{rpIdx=ic2;renderRPTimeline();};
    const L=lbl(item.label),col=L?L.color:'#b0aec5';
    const sM=t2m(item.start),eM=item.eind?t2m(item.eind):sM+20;
    row.innerHTML=`<div class="tl-lbl-col"><div class="tl-name">${isNow?'▶ ':''}<b style="font-weight:500">${item.omschrijving||'—'}</b></div><div class="tl-timelbl">${item.start}${item.eind?' – '+item.eind:''}</div></div>
      <div class="tl-bars-col"><div class="tl-bar${item.fixed?' tl-bar-fixed':''}" style="left:${toP(sM)};width:${((eM-sM)/span*100).toFixed(3)}%;background:${col}22;border:1.5px solid ${col}99" title="${item.omschrijving}${item.wie?' — '+item.wie:''}"><span class="tl-bar-txt" style="color:${col}dd">${item.wie||''}</span></div></div>`;
    rowsEl.appendChild(row);ic++;
  });
  renderTlLibPanel();
  setupTlDrop();
}

/* ─── ENTERTAINMENT & HULDIGINGEN ─── */
/* ═══════════════════════════════
   ENTERTAINMENT & HULDIGINGEN
═══════════════════════════════ */

function seedEntertainment(){
  S.entertainment=[
    {id:S.nextId++,naam:"Dweilorkest Jan Dupon",type:"Muziek",aantalPersonen:12,locatie:"Plein",contactpersoon:"Jan Dupon",telefoon:"06-12345678",rider:"Eigen versterking, 2x stroom 16A",bijzonderheden:"",bedrag:"1200",korting:"10",status:"bevestigd"},
  ];
}
function seedHuldigingen(){
  S.huldigingen=[
    {id:S.nextId++,naam:"21km Mannen & Vrouwen",wieReiktUit:"Justin | Jan",locatie:"Podium",items:"Medailles, bloemen, trofee winnaar",sponsor:"",bijzonderheden:"Check procedure van tevoren"},
    {id:S.nextId++,naam:"21km Student & Business",wieReiktUit:"Justin | Jan",locatie:"Podium",items:"Medailles, bloemen",sponsor:"",bijzonderheden:""},
    {id:S.nextId++,naam:"5km Mannen & Vrouwen",wieReiktUit:"Justin | Jan",locatie:"Podium",items:"Medailles, bloemen",sponsor:"",bijzonderheden:""},
    {id:S.nextId++,naam:"10km Mannen & Vrouwen",wieReiktUit:"Justin | Jan",locatie:"Podium",items:"Medailles, bloemen",sponsor:"",bijzonderheden:""},
  ];
}

function seedLocaties(){
  S.locaties = [
    {id:S.nextId++, naam:"Start Wilhelminaplein", adres:"Wilhelminaplein, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/4MtQZ8PZPfKdpTFaA"},
    {id:S.nextId++, naam:"Garmin Cheerzone Noorderbrug", adres:"Noorderbrug, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/FTDac32MfDU8vKQN9"},
    {id:S.nextId++, naam:"VP2 Havankpark", adres:"Havankpark, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/mBArfmTBPNpNCf2T6"},
    {id:S.nextId++, naam:"VP3 Rengerspark", adres:"Rengerspark, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/ZJs4fGdbbQaC8RXQ8"},
    {id:S.nextId++, naam:"Finish Hardlopen Groeneweg", adres:"Groeneweg, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/T71BcDoeHvzLWMxt6"},
    {id:S.nextId++, naam:"Finish Wandelen Oldehoofsterkerkhof", adres:"Oldehoofsterkerkhof, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/T71BcDoeHvzLWMxt6"},
    {id:S.nextId++, naam:"Huldigingspodium Oldehoofsterkerkhof", adres:"Oldehoofsterkerkhof, Leeuwarden", mapsUrl:"https://maps.app.goo.gl/ZvsSxdUHspnoVyKt7"},
    {id:S.nextId++, naam:"Event Office, Gemeentehuis Leeuwarden", adres:"Gemeentehuis Leeuwarden", mapsUrl:"https://maps.app.goo.gl/Tp2WTCW42Fk6hEDv6"},
  ];
}

/* INITIALS helper */
function initials(name){
  if(!name)return'?';
  return name.trim().split(/\s+/).slice(0,2).map(w=>w[0].toUpperCase()).join('');
}

/* RENDER LIBRARY */
function renderLib(type){
  updateBadges();
  const list=type==="ent"?S.entertainment:S.huldigingen;
  const grid=document.getElementById(type==="ent"?"ent-grid":"hul-grid");
  if(!grid)return;
  if(!list.length){
    grid.innerHTML='<div class="lib-empty"><div class="lib-empty-icon">'+(type==="ent"?"🎭":"🏆")+'</div><p>Nog geen '+(type==="ent"?"acts":"huldigingen")+' toegevoegd.</p></div>';
    return;
  }
  grid.innerHTML="";
  list.forEach(function(item){
    const card=document.createElement("div");
    card.className="lib-card";
    card.draggable=true;
    card.dataset.libtype=type;
    card.dataset.libid=item.id;
    card.addEventListener("dragstart",onLibDragStart);
    card.addEventListener("dragend",onLibDragEnd);
    if(type==="ent"){
      const f=calcFin({bedrag:item.bedrag,korting:item.korting});
      const statusCls="status-"+(item.status||"aangevraagd");
      card.innerHTML=
        '<div class="lib-card-head">'+
          '<div class="lib-card-icon" style="background:#7c3aed">'+initials(item.naam)+'</div>'+
          '<div>'+
            '<div class="lib-card-title">'+item.naam+'</div>'+
            '<div class="lib-card-sub">'+(item.type||"")+'</div>'+
          '</div>'+
          '<span class="status-pill '+statusCls+'">'+(item.status||"aangevraagd")+'</span>'+
        '</div>'+
        '<div class="lib-card-body">'+
          (item.aantalPersonen?'<div class="lib-row"><span class="lib-row-lbl">Personen</span>'+item.aantalPersonen+"</div>":"")+
          (item.locatie?'<div class="lib-row"><span class="lib-row-lbl">Locatie</span>'+item.locatie+"</div>":"")+
          (item.contactpersoon?'<div class="lib-row"><span class="lib-row-lbl">Contact</span>'+item.contactpersoon+(item.telefoon?" · "+item.telefoon:"")+"</div>":"")+
          (item.rider?'<div class="lib-row"><span class="lib-row-lbl">Rider</span><span style="color:var(--t3)">'+item.rider+"</span></div>":"")+
          (f.bedrag?'<div class="lib-row"><span class="lib-row-lbl">Financieel</span><b style="font-family:var(--ui);font-weight:600">'+euro(f.netto)+'</b><span style="color:var(--t3);font-size:10px"> excl. btw'+(f.korting?" ("+f.korting+"% korting)":"")+"</span></div>":"")+
        '</div>'+
        '<div class="lib-card-foot" style="display:flex;gap:6px;align-items:center">'+
          '<button class="lib-add-btn lib-add-ent" onclick="openAts(\'ent\','+item.id+')">+ Inplannen</button>'+
          '<div style="flex:1"></div>'+
          '<button class="btn btn-out btn-xs" onclick="openCallsheetModal('+item.id+')" title="Genereer callsheet voor deze act">📄 Callsheet</button>'+
          '<button class="btn btn-out btn-xs" onclick="openLibModal(\'ent\','+item.id+')">✏ Bewerk</button>'+
        '</div>';
    } else {
      card.innerHTML=
        '<div class="lib-card-head">'+
          '<div class="lib-card-icon" style="background:#cc9900">'+initials(item.naam)+'</div>'+
          '<div>'+
            '<div class="lib-card-title">'+item.naam+'</div>'+
            '<div class="lib-card-sub">'+(item.wieReiktUit||"")+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="lib-card-body">'+
          (item.locatie?'<div class="lib-row"><span class="lib-row-lbl">Locatie</span>'+item.locatie+"</div>":"")+
          (item.items?'<div class="lib-row"><span class="lib-row-lbl">Benodigdheden</span><span style="color:var(--t3)">'+item.items+"</span></div>":"")+
          (item.sponsor?'<div class="lib-row"><span class="lib-row-lbl">Sponsor</span>'+item.sponsor+"</div>":"")+
          (item.bijzonderheden?'<div class="lib-row"><span class="lib-row-lbl">Bijzonderheden</span><span style="color:var(--t3)">'+item.bijzonderheden+"</span></div>":"")+
        '</div>'+
        '<div class="lib-card-foot">'+
          '<button class="lib-add-btn lib-add-hul" onclick="openAts(\'hul\','+item.id+')">+ Inplannen</button>'+
          '<button class="btn btn-out btn-xs" style="margin-left:auto" onclick="openLibModal(\'hul\','+item.id+')">✏ Bewerk</button>'+
        '</div>';
    }
    grid.appendChild(card);
  });
}

/* LIB FORM MODAL */
var _libType=null,_libEditId=null,_atsPending=null;

function openLibModal(type,editId){
  _libType=type; _libEditId=editId||null;
  const list=type==="ent"?S.entertainment:S.huldigingen;
  const item=editId?list.find(function(i){return i.id===editId;}):null;
  const isEnt=type==="ent";
  document.getElementById("lib-modal-title").textContent=editId?(isEnt?"Act bewerken":"Huldiging bewerken"):(isEnt?"Act toevoegen":"Huldiging toevoegen");
  document.getElementById("lib-del-btn").style.display=editId?"inline-flex":"none";
  const tabs=document.getElementById("lib-modal-tabs");
  const body=document.getElementById("lib-modal-body");
  if(isEnt){
    tabs.innerHTML=
      '<button class="lib-modal-tab active" onclick="lmT(\'basis\',this)">Basis</button>'+
      '<button class="lib-modal-tab" onclick="lmT(\'rider\',this)">Techniek / Rider</button>'+
      '<button class="lib-modal-tab" onclick="lmT(\'fin\',this)">Financieel</button>';
    body.innerHTML=
      '<div class="lib-modal-pane active" id="lmp-basis">'+
        '<div class="fg"><label>Naam act / artiest *</label><input type="text" id="lm-naam" placeholder="bijv. Dweilorkest Jan Dupon"></div>'+
        '<div class="fg2">'+
          '<div class="fg"><label>Type</label><select id="lm-type"><option>Muziek</option><option>DJ</option><option>Spreker</option><option>Theater</option><option>Dans</option><option>Overige</option></select></div>'+
          '<div class="fg"><label>Aantal personen</label><input type="number" id="lm-pers" min="1" placeholder="1"></div>'+
        '</div>'+
        '<div class="fg"><label>Locatie (standaard)</label><select id="lm-loc-sel" onchange="lmLocChange()"><option value="">— Geen / vrije invoer —</option></select><input type="text" id="lm-loc" placeholder="Of typ vrije locatie…" style="margin-top:6px"></div>'+
        '<div class="fg2">'+
          '<div class="fg"><label>Contactpersoon</label><input type="text" id="lm-contact" placeholder="Naam"></div>'+
          '<div class="fg"><label>Telefoon</label><input type="text" id="lm-tel" placeholder="06-…"></div>'+
        '</div>'+
        '<div class="fg"><label>Status</label><select id="lm-status"><option value="aangevraagd">Aangevraagd</option><option value="optie">Optie</option><option value="bevestigd">Bevestigd</option></select></div>'+
        '<div class="fg"><label>Bijzonderheden</label><textarea id="lm-biz" placeholder="Extra info…"></textarea></div>'+
      '</div>'+
      '<div class="lib-modal-pane" id="lmp-rider">'+
        '<div class="fg"><label>Technische rider / instructies</label><textarea id="lm-rider" style="min-height:100px" placeholder="Geluidswensen, stroomvereisten, licht, mic…"></textarea></div>'+
      '</div>'+
      '<div class="lib-modal-pane" id="lmp-fin">'+
        '<div class="fg2">'+
          '<div class="fg"><label>Bedrag excl. btw (€)</label><input type="number" id="lm-bed" placeholder="0.00" step="0.01" min="0" oninput="updLmFin()"></div>'+
          '<div class="fg"><label>Korting %</label><input type="number" id="lm-kor" placeholder="0" step="0.1" min="0" max="100" oninput="updLmFin()"></div>'+
        '</div>'+
        '<div class="fin-box" id="lm-fin-box" style="display:none">'+
          '<div class="fin-box-lbl">Berekening (excl. btw)</div>'+
          '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2);margin-bottom:4px"><span>Bedrag</span><span id="lm-fc-bed"></span></div>'+
          '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--red);margin-bottom:4px"><span id="lm-fc-dl">Korting</span><span id="lm-fc-disc"></span></div>'+
          '<div class="fin-result"><span class="fin-result-lbl">Te betalen</span><span class="fin-result-val" id="lm-fc-net"></span></div>'+
        '</div>'+
      '</div>';
    if(item){
      document.getElementById("lm-naam").value=item.naam||"";
      document.getElementById("lm-type").value=item.type||"Muziek";
      document.getElementById("lm-pers").value=item.aantalPersonen||"";
      // Locatie: vul dropdown, match bestaande waarde
      const locSel = document.getElementById("lm-loc-sel");
      locSel.innerHTML = locDropdownOptions(item.locatie || "");
      document.getElementById("lm-loc").value = (locSel.value === "" && item.locatie) ? item.locatie : "";
      document.getElementById("lm-loc").style.display = (locSel.value === "") ? "block" : "none";
      document.getElementById("lm-contact").value=item.contactpersoon||"";
      document.getElementById("lm-tel").value=item.telefoon||"";
      document.getElementById("lm-status").value=item.status||"aangevraagd";
      document.getElementById("lm-biz").value=item.bijzonderheden||"";
      document.getElementById("lm-rider").value=item.rider||"";
      document.getElementById("lm-bed").value=item.bedrag||"";
      document.getElementById("lm-kor").value=item.korting||"";
      updLmFin();
    } else {
      // Nieuw item: vul dropdown leeg
      const locSel = document.getElementById("lm-loc-sel");
      locSel.innerHTML = locDropdownOptions("");
      document.getElementById("lm-loc").style.display = "block";
    }
  } else {
    tabs.innerHTML="";
    body.innerHTML=
      '<div class="fg"><label>Naam / categorie *</label><input type="text" id="lm-naam" placeholder="bijv. 21km Mannen & Vrouwen"></div>'+
      '<div class="fg2">'+
        '<div class="fg"><label>Wie reikt uit</label><input type="text" id="lm-wie" list="lm-pdl" placeholder="Naam of rol"><datalist id="lm-pdl">'+
          S.persons.map(function(p){return '<option value="'+p+'">';}).join("")+
        '</datalist></div>'+
        '<div class="fg"><label>Locatie</label><input type="text" id="lm-loc" placeholder="Podium, Plein…"></div>'+
      '</div>'+
      '<div class="fg"><label>Benodigde items (trofee, medaille, bloemen…)</label><input type="text" id="lm-items" placeholder="bijv. Medaille, bloemen, cheque"></div>'+
      '<div class="fg"><label>Sponsor gekoppeld</label><input type="text" id="lm-sponsor" placeholder="bijv. Rabobank"></div>'+
      '<div class="fg"><label>Bijzonderheden</label><textarea id="lm-biz" placeholder="Procedure, aandachtspunten…"></textarea></div>';
    if(item){
      document.getElementById("lm-naam").value=item.naam||"";
      document.getElementById("lm-wie").value=item.wieReiktUit||"";
      document.getElementById("lm-loc").value=item.locatie||"";
      document.getElementById("lm-items").value=item.items||"";
      document.getElementById("lm-sponsor").value=item.sponsor||"";
      document.getElementById("lm-biz").value=item.bijzonderheden||"";
    }
  }
  document.getElementById("lib-ovl").classList.add("open");
}
function closeLibModal(){document.getElementById("lib-ovl").classList.remove("open");}
function lmT(id,btn){
  document.querySelectorAll(".lib-modal-pane").forEach(function(p){p.classList.remove("active");});
  document.querySelectorAll(".lib-modal-tab").forEach(function(b){b.classList.remove("active");});
  const p=document.getElementById("lmp-"+id);if(p)p.classList.add("active");
  if(btn)btn.classList.add("active");
}
function updLmFin(){
  const b=parseFloat((document.getElementById("lm-bed")||{}).value)||0;
  const k=parseFloat((document.getElementById("lm-kor")||{}).value)||0;
  const box=document.getElementById("lm-fin-box");if(!box)return;
  if(!b){box.style.display="none";return;}
  box.style.display="block";
  const d=b*(k/100);
  document.getElementById("lm-fc-bed").textContent=euro(b);
  document.getElementById("lm-fc-dl").textContent="Korting ("+k+"%)";
  document.getElementById("lm-fc-disc").textContent="– "+euro(d);
  document.getElementById("lm-fc-net").textContent=euro(b-d);
}
function saveLibItem(){
  const naam=((document.getElementById("lm-naam")||{}).value||"").trim();
  if(!naam){alert("Vul een naam in.");return;}
  const list=_libType==="ent"?S.entertainment:S.huldigingen;
  // Locatie: pak waarde uit dropdown (als gekozen) of uit vrij veld
  const locSel = document.getElementById("lm-loc-sel");
  const locTxt = document.getElementById("lm-loc");
  const locatie = (locSel && locSel.value) ? locSel.value : ((locTxt && locTxt.value) || "");
  if(_libType==="ent"){
    const data={naam:naam,type:(document.getElementById("lm-type")||{}).value||"Muziek",aantalPersonen:parseInt((document.getElementById("lm-pers")||{}).value)||0,locatie:locatie,contactpersoon:(document.getElementById("lm-contact")||{}).value||"",telefoon:(document.getElementById("lm-tel")||{}).value||"",status:(document.getElementById("lm-status")||{}).value||"aangevraagd",bijzonderheden:(document.getElementById("lm-biz")||{}).value||"",rider:(document.getElementById("lm-rider")||{}).value||"",bedrag:(document.getElementById("lm-bed")||{}).value||"",korting:(document.getElementById("lm-kor")||{}).value||""};
    if(_libEditId){const i=list.findIndex(function(x){return x.id===_libEditId;});if(i!==-1)list[i]=Object.assign({},list[i],data);}
    else list.push(Object.assign({id:S.nextId++},data));
  } else {
    const data={naam:naam,wieReiktUit:(document.getElementById("lm-wie")||{}).value||"",locatie:(document.getElementById("lm-loc")||{}).value||"",items:(document.getElementById("lm-items")||{}).value||"",sponsor:(document.getElementById("lm-sponsor")||{}).value||"",bijzonderheden:(document.getElementById("lm-biz")||{}).value||""};
    if(_libEditId){const i=list.findIndex(function(x){return x.id===_libEditId;});if(i!==-1)list[i]=Object.assign({},list[i],data);}
    else list.push(Object.assign({id:S.nextId++},data));
  }
  save();closeLibModal();renderLib(_libType);updateBadges();
}
function delLibItem(){
  if(!confirm("Verwijder dit item?"))return;
  if(_libType==="ent")S.entertainment=S.entertainment.filter(function(i){return i.id!==_libEditId;});
  else S.huldigingen=S.huldigingen.filter(function(i){return i.id!==_libEditId;});
  save();closeLibModal();renderLib(_libType);updateBadges();
}

/* ADD TO SCHEDULE MODAL */
function openAts(type,libId,suggestedTime){
  const list=type==="ent"?S.entertainment:S.huldigingen;
  const item=list.find(function(i){return i.id===libId;});if(!item)return;
  _atsPending={type:type,libId:libId,item:item};
  document.getElementById("ats-title").textContent=type==="ent"?"Act inplannen":"Huldiging inplannen";
  document.getElementById("ats-sub").textContent=item.naam;
  const startEl=document.getElementById("ats-start");
  const endEl=document.getElementById("ats-end");
  startEl.value=suggestedTime||"";
  if(suggestedTime){
    const sm=t2m(suggestedTime)+(type==="ent"?60:20);
    endEl.value=String(Math.floor(sm/60)).padStart(2,"0")+":"+String(sm%60).padStart(2,"0");
  } else endEl.value="";
  document.getElementById("ats-loc").value=item.locatie||"";
  document.getElementById("ats-biz").value="";
  const sec=document.getElementById("ats-sec");
  sec.innerHTML='<option value="">— Geen sectie —</option>'+
    S.items.filter(function(i){return i.type==="sep";}).map(function(s){return '<option value="'+s.id+'">'+s.name+"</option>";}).join("");
  document.getElementById("ats-ovl").classList.add("open");
}
function closeAtsModal(){document.getElementById("ats-ovl").classList.remove("open");_atsPending=null;}
function confirmAts(){
  if(!_atsPending)return;
  const type=_atsPending.type,item=_atsPending.item;
  const start=document.getElementById("ats-start").value;
  const eind=document.getElementById("ats-end").value;
  const loc=document.getElementById("ats-loc").value;
  const biz=document.getElementById("ats-biz").value;
  const secId=parseInt(document.getElementById("ats-sec").value)||null;
  const labelId=type==="ent"?"l3":"l2";
  const newItem={id:S.nextId++,type:"item",
    omschrijving:item.naam,
    start:start,eind:eind,
    wie:type==="ent"?(item.contactpersoon||""):(item.wieReiktUit||""),
    locatie:loc,label:labelId,fixed:false,
    bijzonderheden:biz||(type==="hul"?item.items||"":""),
    script:"",techniek:type==="ent"?item.rider||"":"",dj:"",
    checklist:{persoon:false,script:false,slide:false,techniek:false},
    fin:type==="ent"?{bedrag:item.bedrag||"",korting:item.korting||""}:{bedrag:"",korting:""}
  };
  if(secId){
    const idx=S.items.findIndex(function(i){return i.id===secId;});
    if(idx!==-1)S.items.splice(idx+1,0,newItem);else S.items.push(newItem);
  } else S.items.push(newItem);
  save();closeAtsModal();
  gv("rp",document.getElementById("ni-rp"));
  setTimeout(function(){
    const row=document.querySelector('tr[data-rpid="'+newItem.id+'"]');
    if(row){row.scrollIntoView({block:"center",behavior:"smooth"});row.style.transition="background .3s";row.style.background="rgba(255,208,0,.2)";setTimeout(function(){row.style.background="";},1400);}
  },150);
}

/* DRAG FROM LIBRARY CARDS */
var _dragLibType=null,_dragLibId=null;
function onLibDragStart(e){
  _dragLibType=e.currentTarget.dataset.libtype;
  _dragLibId=parseInt(e.currentTarget.dataset.libid);
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed="copy";
}
function onLibDragEnd(e){e.currentTarget.classList.remove("dragging");}

/* TIMELINE LIBRARY PANEL */
function renderTlLibPanel(){
  const el=document.getElementById("tl-lib-content");if(!el)return;
  var html="";
  if(S.entertainment&&S.entertainment.length){
    html+='<div class="tl-lib-sect">🎭 Entertainment</div>';
    S.entertainment.forEach(function(item){
      html+='<div class="tl-lib-item" draggable="true" data-libtype="ent" data-libid="'+item.id+'" ondragstart="tlLibDragStart(event)" ondragend="tlLibDragEnd(event)">'+
        '<div class="tl-lib-dot" style="background:#7c3aed"></div>'+
        '<div><div class="tl-lib-name">'+item.naam+'</div><div class="tl-lib-sub">'+(item.type||"")+(item.locatie?" · "+item.locatie:"")+"</div></div>"+
      "</div>";
    });
  }
  if(S.huldigingen&&S.huldigingen.length){
    html+='<div class="tl-lib-sect" style="margin-top:8px">🏆 Huldigingen</div>';
    S.huldigingen.forEach(function(item){
      html+='<div class="tl-lib-item" draggable="true" data-libtype="hul" data-libid="'+item.id+'" ondragstart="tlLibDragStart(event)" ondragend="tlLibDragEnd(event)">'+
        '<div class="tl-lib-dot" style="background:#cc9900"></div>'+
        '<div><div class="tl-lib-name">'+item.naam+'</div><div class="tl-lib-sub">'+(item.wieReiktUit||"")+(item.locatie?" · "+item.locatie:"")+"</div></div>"+
      "</div>";
    });
  }
  if(!html)html='<div style="padding:20px 14px;font-size:11px;color:var(--t3)">Voeg eerst acts of huldigingen toe via de Bibliotheek-modules.</div>';
  el.innerHTML=html;
}
function tlLibDragStart(e){
  _dragLibType=e.currentTarget.dataset.libtype;
  _dragLibId=parseInt(e.currentTarget.dataset.libid);
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed="copy";
}
function tlLibDragEnd(e){e.currentTarget.classList.remove("dragging");}

/* DROP ON TIMELINE */
var _tlDropSetup=false;
function setupTlDrop(){
  if(_tlDropSetup)return;_tlDropSetup=true;
  const outer=document.getElementById("tl-outer-scroll");if(!outer)return;
  outer.addEventListener("dragover",function(e){
    if(_dragLibType===null)return;
    e.preventDefault();e.dataTransfer.dropEffect="copy";
  });
  outer.addEventListener("drop",function(e){
    if(_dragLibType===null)return;
    e.preventDefault();
    const marks=document.getElementById("tl-marks");
    if(!marks){openAts(_dragLibType,_dragLibId);_dragLibType=null;return;}
    const marksRect=marks.getBoundingClientRect();
    const relX=e.clientX-marksRect.left;
    const ratio=Math.max(0,Math.min(1,relX/marksRect.width));
    const allItems=S.items.filter(function(i){return i.type==="item"&&i.start;});
    if(!allItems.length){openAts(_dragLibType,_dragLibId);_dragLibType=null;return;}
    const starts=allItems.map(function(i){return t2m(i.start);});
    const ends=allItems.filter(function(i){return i.eind;}).map(function(i){return t2m(i.eind);});
    const minT=Math.floor((Math.min.apply(null,starts)-15)/60)*60;
    const maxT=Math.ceil((Math.max.apply(null,ends.concat(starts))+30)/60)*60;
    const dropMin=Math.round(minT+ratio*(maxT-minT));
    const hh=String(Math.floor(dropMin/60)).padStart(2,"0");
    const mm=String(Math.round(dropMin%60/5)*5).padStart(2,"0");
    openAts(_dragLibType,_dragLibId,hh+":"+mm);
    _dragLibType=null;_dragLibId=null;
  });
}


/* ══════════════════════════════
   CSV IMPORT
══════════════════════════════ */

const CSV_COLS = [
  { key:'omschrijving', label:'Omschrijving',   required:true,  hint:'Naam van het onderdeel'        },
  { key:'start',        label:'Start',          required:false, hint:'HH:MM  bijv. 09:30'            },
  { key:'eind',         label:'Eind',           required:false, hint:'HH:MM  bijv. 10:00'            },
  { key:'wie',          label:'Wie',            required:false, hint:'Naam of rol'                   },
  { key:'locatie',      label:'Locatie',        required:false, hint:'Podium, Plein…'                },
  { key:'label',        label:'Label',          required:false, hint:'WEDSTRIJD / HULDIGING / ENTERTAINMENT / ACTIVATIE / FINISH / OVERIGE' },
  { key:'fixed',        label:'Fixed',          required:false, hint:'ja / nee'                      },
  { key:'bijzonderheden',label:'Bijzonderheden',required:false, hint:'Vrije tekst'                   },
];

// Generate and download the CSV template
function downloadCsvTemplate() {
  const header = CSV_COLS.map(c => c.label).join(';');
  const hints  = CSV_COLS.map(c => c.hint).join(';');
  // one example row
  const ex = [
    'Start 21km',       // Omschrijving
    '09:30',            // Start
    '09:40',            // Eind
    'Race Commentaar',  // Wie
    'Groeneweg',        // Locatie
    'WEDSTRIJD',        // Label
    'ja',               // Fixed
    'Let op startsein', // Bijzonderheden
  ].join(';');
  // Add BOM for Excel UTF-8 compat
  const bom = '\uFEFF';
  const csv = bom + '# Regie CSV Import — vul in en sla op als .csv\n# Hints: ' + hints + '\n' + header + '\n' + ex + '\n';
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'regie-import-sjabloon.csv'; a.click();
  URL.revokeObjectURL(url);
}

// Holds parsed rows waiting for confirmation
let _csvParsed = [];

function handleCsvUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  // Reset input so same file can be re-uploaded
  e.target.value = '';
  const reader = new FileReader();
  reader.onload = ev => parseCsv(ev.target.result, file.name);
  reader.readAsText(file, 'UTF-8');
}

function parseCsv(raw, fileName) {
  // Strip BOM, split lines
  const text  = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) { alert('Leeg bestand of geen regels gevonden.'); return; }

  // Detect separator: ; or ,
  const sep = lines[0].includes(';') ? ';' : ',';

  // Parse header
  const rawHeader = lines[0].split(sep).map(h => h.trim().toLowerCase()
    .replace(/[^a-z]/g, '').replace('bijzonderheden','bijzonderheden'));
  // Map header columns to our keys
  const colMap = {}; // index -> key
  CSV_COLS.forEach(col => {
    const normalKey = col.label.toLowerCase().replace(/[^a-z]/g,'');
    rawHeader.forEach((h, i) => {
      const hn = h.replace(/[^a-z]/g,'');
      if (hn === normalKey || hn.startsWith(normalKey.slice(0,5))) colMap[i] = col.key;
    });
  });

  const dataLines = lines.slice(1);
  _csvParsed = dataLines.map((line, idx) => {
    const cells = splitCsvLine(line, sep);
    const row   = {};
    Object.entries(colMap).forEach(([i, key]) => { row[key] = (cells[i] || '').trim(); });

    // Validate
    const errors = [];
    if (!row.omschrijving) errors.push('Omschrijving ontbreekt');
    if (row.start && !/^\d{1,2}:\d{2}$/.test(row.start)) errors.push('Start: ongeldig tijdformaat (gebruik HH:MM)');
    if (row.eind  && !/^\d{1,2}:\d{2}$/.test(row.eind))  errors.push('Eind: ongeldig tijdformaat (gebruik HH:MM)');

    // Normalise fixed
    row.fixed = /^(ja|yes|1|true|j)$/i.test(row.fixed || '');
    // Normalise label -> label id
    row.labelId = '';
    if (row.label) {
      const match = S.labels.find(l => l.name.toLowerCase() === row.label.trim().toLowerCase());
      if (match) row.labelId = match.id;
      else if (row.label.trim()) errors.push(`Label "${row.label}" onbekend — wordt leeg`);
    }

    return { idx: idx+2, raw: row, errors, ok: errors.length === 0 };
  }).filter(r => r.raw.omschrijving || r.errors.length); // skip completely empty rows

  if (!_csvParsed.length) { alert('Geen te importeren rijen gevonden.'); return; }
  showCsvModal(fileName);
}

function splitCsvLine(line, sep) {
  // Handle quoted fields
  const result = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === sep && !inQ) { result.push(cur); cur = ''; }
    else cur += ch;
  }
  result.push(cur);
  return result;
}

function showCsvModal(fileName) {
  document.getElementById('csv-file-name').textContent = '📄 ' + fileName;

  const okRows  = _csvParsed.filter(r => r.ok);
  const errRows = _csvParsed.filter(r => !r.ok);

  // Summary pills
  document.getElementById('csv-summary').innerHTML =
    `<div class="csv-sum-pill"><span class="csv-sum-n" style="color:var(--green)">${okRows.length}</span> rijen klaar om te importeren</div>` +
    (errRows.length ? `<div class="csv-sum-pill"><span class="csv-sum-n" style="color:var(--red)">${errRows.length}</span> rijen overgeslagen</div>` : '') +
    `<div class="csv-sum-pill"><span class="csv-sum-n">${_csvParsed.length}</span> rijen totaal</div>`;

  // Error list
  const errEl = document.getElementById('csv-errors');
  if (errRows.length) {
    errEl.style.display = 'block';
    errEl.innerHTML = '<strong>Waarschuwingen:</strong><br>' +
      errRows.map(r => `Rij ${r.idx}: ${r.errors.join(', ')}`).join('<br>');
  } else errEl.style.display = 'none';

  // Preview table header
  document.getElementById('csv-preview-head').innerHTML =
    `<tr class="csv-ph">
      <th>Status</th><th>Omschrijving</th><th>Start</th><th>Eind</th>
      <th>Wie</th><th>Locatie</th><th>Label</th><th>Fixed</th><th>Bijzonderheden</th>
    </tr>`;

  // Preview rows
  const tbody = document.getElementById('csv-preview-body');
  tbody.innerHTML = '';
  _csvParsed.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'csv-pb ' + (r.ok ? 'row-ok' : 'row-err');
    const L = r.raw.labelId ? S.labels.find(l => l.id === r.raw.labelId) : null;
    tr.innerHTML = `
      <td>${r.ok ? '<span class="csv-ok">✓</span>' : '<span class="csv-err">✗</span>'}</td>
      <td style="font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.raw.omschrijving||'—'}</td>
      <td style="font-family:var(--fm);font-size:11px">${r.raw.start||'—'}</td>
      <td style="font-family:var(--fm);font-size:11px">${r.raw.eind||'—'}</td>
      <td>${r.raw.wie||'—'}</td>
      <td>${r.raw.locatie||'—'}</td>
      <td>${L ? `<span class="lpill" style="background:${L.color}18;color:${L.color}">${L.name}</span>` : (r.raw.label||'—')}</td>
      <td>${r.raw.fixed ? '<span class="csv-fixed-y">FIXED</span>' : '<span style="color:var(--t3)">nee</span>'}</td>
      <td style="color:var(--t3);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.raw.bijzonderheden||''}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('csv-import-count').textContent =
    okRows.length ? `${okRows.length} onderdeel${okRows.length !== 1 ? 'en' : ''} worden toegevoegd aan het einde van het regiepad` : 'Niets te importeren';
  document.getElementById('csv-confirm-btn').disabled = okRows.length === 0;

  document.getElementById('csv-ovl').classList.add('open');
}

function closeCsvModal() {
  document.getElementById('csv-ovl').classList.remove('open');
  _csvParsed = [];
}

function confirmCsvImport() {
  const toImport = _csvParsed.filter(r => r.ok);
  if (!toImport.length) return;

  let added = 0;
  toImport.forEach(r => {
    const item = {
      id: S.nextId++,
      type: 'item',
      omschrijving: r.raw.omschrijving,
      start:         r.raw.start    || '',
      eind:          r.raw.eind     || '',
      wie:           r.raw.wie      || '',
      locatie:       r.raw.locatie  || '',
      label:         r.raw.labelId  || '',
      fixed:         r.raw.fixed,
      bijzonderheden:r.raw.bijzonderheden || '',
      script: '', techniek: '', dj: '',
      checklist: { persoon:false, script:false, slide:false, techniek:false },
      fin: { bedrag: '', korting: '' },
    };
    S.items.push(item);
    S.todos.items[item.id] = [];
    added++;
  });

  save();
  closeCsvModal();
  renderBoList();
  updateBadges();

  // Flash a success message
  const notice = document.createElement('div');
  notice.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--green);color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:500;box-shadow:0 4px 16px rgba(0,0,0,.14);transition:opacity .4s';
  notice.textContent = `✓ ${added} onderdeel${added !== 1 ? 'en' : ''} geïmporteerd`;
  document.body.appendChild(notice);
  setTimeout(() => { notice.style.opacity = '0'; setTimeout(() => notice.remove(), 500); }, 2400);
}


/* ══════════════════════════════
   PRIJSUITREIKINGEN
══════════════════════════════ */
function renderPrix() {
  const body = document.getElementById('prix-body');
  const huls = S.huldigingen || [];
  if (!huls.length) {
    body.innerHTML = '<div style="text-align:center;padding:60px;color:var(--t3);font-size:13px">Nog geen huldigingen aangemaakt.<br>Ga naar <b>Huldigingen</b> om ze toe te voegen.</div>';
    return;
  }
  // Try to find linked time from regiepad
  function getTime(naam) {
    const match = S.items.find(i => i.type === 'item' && i.omschrijving && i.omschrijving.toLowerCase().includes(naam.toLowerCase().slice(0, 8)));
    return match ? match.start : null;
  }

  let html = '<div class="prix-grid">';
  huls.forEach((h, idx) => {
    const tijd = getTime(h.naam);
    // Split items into array for checklist
    const items = (h.items || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
    html += `
      <div class="prix-card">
        <div class="prix-card-hd">
          <div class="prix-card-num">${idx + 1}</div>
          <div style="flex:1">
            <div class="prix-card-title">${h.naam}</div>
            ${h.sponsor ? `<div style="font-size:11px;color:var(--t3);margin-top:2px">Sponsor: ${h.sponsor}</div>` : ''}
          </div>
          ${tijd ? `<div class="prix-card-time">${tijd}</div>` : ''}
        </div>
        <div class="prix-card-body">
          ${h.wieReiktUit ? `<div class="prix-row"><span class="prix-row-lbl">Uitreiker</span><span class="prix-row-val">${h.wieReiktUit}</span></div>` : ''}
          ${h.locatie     ? `<div class="prix-row"><span class="prix-row-lbl">Locatie</span><span class="prix-row-val">${h.locatie}</span></div>` : ''}
          ${h.bijzonderheden ? `<div class="prix-row"><span class="prix-row-lbl">Protocol</span><span class="prix-row-val">${h.bijzonderheden}</span></div>` : ''}
          ${items.length ? `
            <div>
              <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--t3);margin-bottom:7px">Benodigdheden</div>
              <div class="prix-checklist">
                ${items.map(it => `<div class="prix-check-item"><div class="prix-check-box"></div>${it}</div>`).join('')}
              </div>
            </div>` : ''}
        </div>
      </div>`;
  });
  html += '</div>';
  body.innerHTML = html;
}

function buildPrixHtmlContent() {
  const huls = S.huldigingen || [];
  function getTime(naam) {
    const match = S.items.find(i => i.type === 'item' && i.omschrijving && i.omschrijving.toLowerCase().includes(naam.toLowerCase().slice(0, 8)));
    return match ? match.start : null;
  }
  let cards = huls.map((h, idx) => {
    const tijd = getTime(h.naam);
    const items = (h.items || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
    return `<div style="background:#fff;border:1px solid #e0e0db;border-radius:10px;overflow:hidden;break-inside:avoid;margin-bottom:16px">
      <div style="background:#f4f4f2;padding:14px 18px;border-bottom:1px solid #e0e0db;display:flex;align-items:center;gap:12px">
        <div style="width:30px;height:30px;background:#161618;color:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${idx+1}</div>
        <div style="flex:1"><div style="font-size:15px;font-weight:700">${h.naam}</div>${h.sponsor?`<div style="font-size:11px;color:#888;margin-top:1px">Sponsor: ${h.sponsor}</div>`:''}</div>
        ${tijd?`<div style="font-family:monospace;font-size:13px;font-weight:600;color:#444">${tijd}</div>`:''}
      </div>
      <div style="padding:14px 18px">
        ${h.wieReiktUit?`<div style="display:flex;gap:10px;margin-bottom:8px;font-size:13px"><span style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;width:100px;flex-shrink:0;padding-top:2px">Uitreiker</span><span style="color:#555">${h.wieReiktUit}</span></div>`:''}
        ${h.locatie?`<div style="display:flex;gap:10px;margin-bottom:8px;font-size:13px"><span style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;width:100px;flex-shrink:0;padding-top:2px">Locatie</span><span style="color:#555">${h.locatie}</span></div>`:''}
        ${h.bijzonderheden?`<div style="display:flex;gap:10px;margin-bottom:10px;font-size:13px"><span style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;width:100px;flex-shrink:0;padding-top:2px">Protocol</span><span style="color:#555">${h.bijzonderheden}</span></div>`:''}
        ${items.length?`<div style="margin-top:4px"><div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;margin-bottom:7px">Benodigdheden</div>${items.map(it=>`<div style="display:flex;align-items:center;gap:9px;padding:7px 10px;background:#f8f8f6;border-radius:6px;border:1px solid #e0e0db;margin-bottom:5px;font-size:13px"><div style="width:17px;height:17px;border:2px solid #ccc;border-radius:4px;flex-shrink:0"></div>${it}</div>`).join('')}</div>`:''}
      </div>
    </div>`;
  }).join('');
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Prijsuitreikingen — ${S.event.name}</title>
  <style>body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f2;padding:32px;max-width:900px;margin:0 auto;color:#111}h1{font-size:22px;font-weight:700;margin-bottom:4px}p.sub{color:#888;font-size:13px;margin-bottom:24px}@media print{body{background:#fff;padding:16px}.no-print{display:none}}</style>
  </head><body>
  <div class="no-print" style="margin-bottom:24px"><button onclick="window.print()" style="background:#161618;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">🖨 Print / Opslaan als PDF</button></div>
  <h1>Prijsuitreikingen</h1><p class="sub">${S.event.name}${S.event.date?' — '+S.event.date:''} &nbsp;·&nbsp; ${huls.length} categorie${huls.length!==1?'ën':''}</p>
  ${cards}
  </body></html>`;
}

function downloadPrixHtml() {
  const content = buildPrixHtmlContent();
  const blob = new Blob([content], {type:'text/html;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'prijsuitreikingen.html'; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════
   VRIJWILLIGERS
══════════════════════════════ */
function renderVrij() {
  updateBadges();
  const wrap = document.getElementById('vrij-table-wrap');
  const vrs = S.vrijwilligers || [];
  if (!vrs.length) {
    wrap.innerHTML = '<div class="vrij-empty"><p>Nog geen vrijwilligers toegevoegd.<br>Klik <b>+ Vrijwilliger</b> om te beginnen.</p></div>';
    return;
  }
  // Group by functie
  const byFunc = {};
  vrs.forEach(v => {
    const k = v.functie || 'Overige';
    if (!byFunc[k]) byFunc[k] = [];
    byFunc[k].push(v);
  });

  let html = '';
  Object.entries(byFunc).forEach(([func, group]) => {
    html += `<div style="margin-bottom:22px">
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--t3);padding:0 0 8px;border-bottom:1px solid var(--border);margin-bottom:0">${func}</div>
      <div class="vrij-tcard" style="border-radius:0 0 var(--r2) var(--r2)">
        <table class="vrij-t">
          <thead><tr>
            <th>Naam</th><th>Functie / rol</th><th>Locatie / post</th><th>Bijzonderheden</th><th style="width:32px"></th>
          </tr></thead>
          <tbody>
            ${group.map(v => `<tr onclick="openVrijModal(${v.id})">
              <td><div class="vrij-name">${v.naam}</div></td>
              <td><div class="vrij-func">${v.functie||'—'}</div></td>
              <td><div class="vrij-loc">${v.locatie||'—'}</div></td>
              <td style="color:var(--t3);font-size:12px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v.bijzonderheden||''}</td>
              <td><button class="ib del" onclick="event.stopPropagation();delVrijById(${v.id})" title="Verwijder">✕</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  });
  wrap.innerHTML = html;
}

let _vrijEditId = null;
function openVrijModal(editId) {
  _vrijEditId = editId || null;
  const v = editId ? (S.vrijwilligers||[]).find(x => x.id === editId) : null;
  document.getElementById('vrij-modal-title').textContent = editId ? 'Vrijwilliger bewerken' : 'Vrijwilliger toevoegen';
  document.getElementById('vrij-del-btn').style.display = editId ? 'inline-flex' : 'none';
  document.getElementById('vrij-naam').value     = v ? v.naam     || '' : '';
  document.getElementById('vrij-functie').value  = v ? v.functie  || '' : '';
  document.getElementById('vrij-locatie').value  = v ? v.locatie  || '' : '';
  document.getElementById('vrij-biz').value      = v ? v.bijzonderheden || '' : '';
  document.getElementById('vrij-ovl').classList.add('open');
}
function closeVrijModal() { document.getElementById('vrij-ovl').classList.remove('open'); }
function saveVrij() {
  const naam = (document.getElementById('vrij-naam').value || '').trim();
  if (!naam) { alert('Vul een naam in.'); return; }
  const data = {
    naam,
    functie:       document.getElementById('vrij-functie').value.trim(),
    locatie:       document.getElementById('vrij-locatie').value.trim(),
    bijzonderheden:document.getElementById('vrij-biz').value.trim(),
  };
  if (!S.vrijwilligers) S.vrijwilligers = [];
  if (_vrijEditId) {
    const i = S.vrijwilligers.findIndex(x => x.id === _vrijEditId);
    if (i !== -1) S.vrijwilligers[i] = { ...S.vrijwilligers[i], ...data };
  } else {
    S.vrijwilligers.push({ id: S.nextId++, ...data });
  }
  save(); closeVrijModal(); renderVrij(); updateBadges();
}
function delVrij() {
  if (!confirm('Vrijwilliger verwijderen?')) return;
  S.vrijwilligers = (S.vrijwilligers||[]).filter(x => x.id !== _vrijEditId);
  save(); closeVrijModal(); renderVrij(); updateBadges();
}
function delVrijById(id) {
  if (!confirm('Vrijwilliger verwijderen?')) return;
  S.vrijwilligers = (S.vrijwilligers||[]).filter(x => x.id !== id);
  save(); renderVrij(); updateBadges();
}

function buildVrijHtmlContent() {
  const vrs = S.vrijwilligers || [];
  const byFunc = {};
  vrs.forEach(v => { const k = v.functie||'Overige'; if(!byFunc[k])byFunc[k]=[]; byFunc[k].push(v); });
  const tables = Object.entries(byFunc).map(([func, group]) => `
    <h3 style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin:20px 0 6px">${func}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px">
      <thead><tr style="background:#f4f4f2">
        <th style="padding:9px 12px;text-align:left;border:1px solid #e0e0db;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa">Naam</th>
        <th style="padding:9px 12px;text-align:left;border:1px solid #e0e0db;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa">Functie / rol</th>
        <th style="padding:9px 12px;text-align:left;border:1px solid #e0e0db;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa">Locatie / post</th>
        <th style="padding:9px 12px;text-align:left;border:1px solid #e0e0db;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa">Bijzonderheden</th>
      </tr></thead>
      <tbody>${group.map((v,i)=>`<tr style="background:${i%2?'#f9f9f7':'#fff'}">
        <td style="padding:9px 12px;border:1px solid #e0e0db;font-weight:600">${v.naam}</td>
        <td style="padding:9px 12px;border:1px solid #e0e0db;color:#555">${v.functie||'—'}</td>
        <td style="padding:9px 12px;border:1px solid #e0e0db;color:#555">${v.locatie||'—'}</td>
        <td style="padding:9px 12px;border:1px solid #e0e0db;color:#888">${v.bijzonderheden||''}</td>
      </tr>`).join('')}</tbody>
    </table>`).join('');
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Vrijwilligers — ${S.event.name}</title>
  <style>body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f2;padding:32px;max-width:960px;margin:0 auto;color:#111}h1{font-size:22px;font-weight:700;margin-bottom:4px}p.sub{color:#888;font-size:13px;margin-bottom:8px}@media print{body{background:#fff;padding:16px}.no-print{display:none}}</style>
  </head><body>
  <div class="no-print" style="margin-bottom:24px"><button onclick="window.print()" style="background:#161618;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">🖨 Print / Opslaan als PDF</button></div>
  <h1>Vrijwilligers</h1><p class="sub">${S.event.name}${S.event.date?' — '+S.event.date:''} &nbsp;·&nbsp; ${vrs.length} vrijwilliger${vrs.length!==1?'s':''}</p>
  ${tables}
  </body></html>`;
}

function downloadVrijHtml() {
  const content = buildVrijHtmlContent();
  const blob = new Blob([content], {type:'text/html;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'vrijwilligers.html'; a.click();
  URL.revokeObjectURL(url);
}

function printView(id) {
  // Temporarily make only that view visible and print
  const allViews = document.querySelectorAll('.view');
  const target = document.getElementById('view-' + id);
  allViews.forEach(v => v.style.display = 'none');
  target.style.display = 'flex';
  window.print();
  allViews.forEach(v => v.style.display = '');
  document.querySelectorAll('.view.active').forEach(v => v.style.display = 'flex');
}


/* ══════════════════════════════
   HULDIGINGEN CSV
══════════════════════════════ */
const HUL_COLS = [
  { key:'naam',          label:'Naam',          required:true,  hint:'bijv. 21km Mannen & Vrouwen'        },
  { key:'wieReiktUit',   label:'Wie reikt uit',  required:false, hint:'Naam of rol'                        },
  { key:'locatie',       label:'Locatie',        required:false, hint:'Podium, Plein…'                     },
  { key:'items',         label:'Benodigdheden',  required:false, hint:'Medaille, bloemen, trofee (komma-gescheiden)' },
  { key:'sponsor',       label:'Sponsor',        required:false, hint:'bijv. Rabobank'                     },
  { key:'bijzonderheden',label:'Bijzonderheden', required:false, hint:'Protocol, aandachtspunten'          },
];

function downloadHulCsv() {
  const header = HUL_COLS.map(c => c.label).join(';');
  const hints  = HUL_COLS.map(c => c.hint).join(';');
  const ex = ['21km Mannen & Vrouwen','Justin | Jan','Podium','Medaille, bloemen, trofee winnaar','Rabobank','Check procedure van tevoren'].join(';');
  const bom = '\uFEFF';
  const csv = bom + '# Regie — Huldigingen Import\n# Hints: ' + hints + '\n' + header + '\n' + ex + '\n';
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href=url; a.download='huldigingen-sjabloon.csv'; a.click();
  URL.revokeObjectURL(url);
}

let _hulCsvParsed = [];

function handleHulCsv(e) {
  const file = e.target.files[0]; if (!file) return;
  e.target.value = '';
  const reader = new FileReader();
  reader.onload = ev => parseHulCsv(ev.target.result, file.name);
  reader.readAsText(file, 'UTF-8');
}

function parseHulCsv(raw, fileName) {
  const text  = raw.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
  const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) { alert('Leeg bestand of geen regels gevonden.'); return; }
  const sep = lines[0].includes(';') ? ';' : ',';
  const rawHeader = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/[^a-z]/g,''));
  const colMap = {};
  HUL_COLS.forEach(col => {
    const nk = col.label.toLowerCase().replace(/[^a-z]/g,'');
    rawHeader.forEach((h,i) => { if (h === nk || h.startsWith(nk.slice(0,5))) colMap[i] = col.key; });
  });
  _hulCsvParsed = lines.slice(1).map((line, idx) => {
    const cells = splitCsvLine(line, sep);
    const row = {};
    Object.entries(colMap).forEach(([i,key]) => { row[key] = (cells[i]||'').trim(); });
    const errors = [];
    if (!row.naam) errors.push('Naam ontbreekt');
    return { idx: idx+2, row, errors, ok: errors.length === 0 };
  }).filter(r => r.row.naam || r.errors.length);
  if (!_hulCsvParsed.length) { alert('Geen rijen gevonden.'); return; }
  showHulCsvModal(fileName);
}

function showHulCsvModal(fileName) {
  document.getElementById('hul-csv-filename').textContent = '📄 ' + fileName;
  const ok  = _hulCsvParsed.filter(r => r.ok);
  const err = _hulCsvParsed.filter(r => !r.ok);
  document.getElementById('hul-csv-summary').innerHTML =
    `<div class="csv-sum-pill"><span class="csv-sum-n" style="color:var(--green)">${ok.length}</span> klaar</div>` +
    (err.length ? `<div class="csv-sum-pill"><span class="csv-sum-n" style="color:var(--red)">${err.length}</span> overgeslagen</div>` : '') +
    `<div class="csv-sum-pill"><span class="csv-sum-n">${_hulCsvParsed.length}</span> totaal</div>`;
  const errEl = document.getElementById('hul-csv-errors');
  if (err.length) {
    errEl.style.display = 'block';
    errEl.innerHTML = '<strong>Waarschuwingen:</strong><br>' + err.map(r => `Rij ${r.idx}: ${r.errors.join(', ')}`).join('<br>');
  } else errEl.style.display = 'none';
  document.getElementById('hul-csv-head').innerHTML =
    `<tr class="csv-ph"><th>Status</th><th>Naam / categorie</th><th>Wie reikt uit</th><th>Locatie</th><th>Benodigdheden</th><th>Sponsor</th><th>Bijzonderheden</th></tr>`;
  const tbody = document.getElementById('hul-csv-body');
  tbody.innerHTML = '';
  _hulCsvParsed.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'csv-pb ' + (r.ok ? 'row-ok' : 'row-err');
    tr.innerHTML = `
      <td>${r.ok ? '<span class="csv-ok">✓</span>' : '<span class="csv-err">✗</span>'}</td>
      <td style="font-weight:500">${r.row.naam||'—'}</td>
      <td>${r.row.wieReiktUit||'—'}</td>
      <td>${r.row.locatie||'—'}</td>
      <td style="color:var(--t3)">${r.row.items||'—'}</td>
      <td>${r.row.sponsor||'—'}</td>
      <td style="color:var(--t3);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.row.bijzonderheden||''}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('hul-csv-count').textContent =
    ok.length ? `${ok.length} huldiging${ok.length!==1?'en':''} worden toegevoegd` : 'Niets te importeren';
  document.getElementById('hul-csv-confirm').disabled = ok.length === 0;
  document.getElementById('hul-csv-ovl').classList.add('open');
}

function closeHulCsvModal() {
  document.getElementById('hul-csv-ovl').classList.remove('open');
  _hulCsvParsed = [];
}

function confirmHulCsv() {
  const toImport = _hulCsvParsed.filter(r => r.ok);
  if (!toImport.length) return;
  if (!S.huldigingen) S.huldigingen = [];
  let added = 0;
  toImport.forEach(r => {
    S.huldigingen.push({
      id:            S.nextId++,
      naam:          r.row.naam,
      wieReiktUit:   r.row.wieReiktUit   || '',
      locatie:       r.row.locatie        || '',
      items:         r.row.items          || '',
      sponsor:       r.row.sponsor        || '',
      bijzonderheden:r.row.bijzonderheden || '',
    });
    added++;
  });
  save(); closeHulCsvModal(); renderLib('hul'); updateBadges();
  const notice = document.createElement('div');
  notice.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--green);color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:500;box-shadow:0 4px 16px rgba(0,0,0,.14);transition:opacity .4s';
  notice.textContent = `✓ ${added} huldiging${added!==1?'en':''} geïmporteerd`;
  document.body.appendChild(notice);
  setTimeout(() => { notice.style.opacity='0'; setTimeout(()=>notice.remove(),500); }, 2400);
}


/* ── LIVE CLOCK ── */
function tickClock(){
  const el=document.getElementById('rs-clock');
  const de=document.getElementById('rs-clock-date');
  if(!el)return;
  try{
    const now=new Date();
    const ams=now.toLocaleString('nl-NL',{timeZone:'Europe/Amsterdam',
      hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    el.textContent=ams.replace(/,/,'').trim();
    const d=now.toLocaleString('nl-NL',{timeZone:'Europe/Amsterdam',
      weekday:'short',day:'numeric',month:'short'});
    if(de)de.textContent=d;
  }catch(e){
    const n=new Date();
    el.textContent=String(n.getHours()).padStart(2,'0')+':'+
                   String(n.getMinutes()).padStart(2,'0')+':'+
                   String(n.getSeconds()).padStart(2,'0');
  }
}
setInterval(tickClock,1000);
tickClock();


/* ═══════════════════════════════
   COLUMN RESIZE
═══════════════════════════════ */
const COL_STORAGE_KEY = 'regie_col_widths';
const COL_MIN = 30;   // px minimum
const COL_DEFAULTS = {
  num:26, start:80, eind:68, duur:58, ond:300, wie:120, loc:96, lbl:120, ger:60
};

function loadColWidths(){
  try{
    const saved=JSON.parse(localStorage.getItem(COL_STORAGE_KEY)||'{}');
    return Object.assign({},COL_DEFAULTS,saved);
  }catch(e){return {...COL_DEFAULTS};}
}
function saveColWidths(widths){
  try{localStorage.setItem(COL_STORAGE_KEY,JSON.stringify(widths));}catch(e){}
}
function applyColWidths(widths){
  Object.entries(widths).forEach(([col,w])=>{
    const th=document.getElementById('rph-'+col);
    if(th)th.style.width=w+'px';
  });
}
function resetColWidths(){
  saveColWidths(COL_DEFAULTS);
  applyColWidths(COL_DEFAULTS);
}

function initColResize(){
  const widths=loadColWidths();
  applyColWidths(widths);

  document.querySelectorAll('.col-resizer').forEach(handle=>{
    handle.addEventListener('mousedown', onResizeStart);
    // Prevent click from bubbling to sort
    handle.addEventListener('click', e=>e.stopPropagation());
  });
}

let _resizeState=null;

function onResizeStart(e){
  e.preventDefault();
  e.stopPropagation();
  const col=e.currentTarget.dataset.col;
  const th=document.getElementById('rph-'+col);
  if(!th)return;
  th.classList.add('resizing');
  document.body.classList.add('col-resizing');
  _resizeState={col, th, startX:e.clientX, startW:th.offsetWidth};
  document.addEventListener('mousemove',onResizeMove);
  document.addEventListener('mouseup',onResizeEnd);
}
function onResizeMove(e){
  if(!_resizeState)return;
  const dx=e.clientX-_resizeState.startX;
  const newW=Math.max(COL_MIN,_resizeState.startW+dx);
  _resizeState.th.style.width=newW+'px';
}
function onResizeEnd(e){
  if(!_resizeState)return;
  const col=_resizeState.col;
  const newW=Math.max(COL_MIN,_resizeState.th.offsetWidth);
  _resizeState.th.classList.remove('resizing');
  document.body.classList.remove('col-resizing');
  document.removeEventListener('mousemove',onResizeMove);
  document.removeEventListener('mouseup',onResizeEnd);
  // Save
  const widths=loadColWidths();
  widths[col]=newW;
  saveColWidths(widths);
  _resizeState=null;
}


/* ═══════════════════════════════
   CUE — VOORBEREIDINGSACTIES
═══════════════════════════════ */
let _cueEditId = null;

function openNewCue() {
  _cueEditId = null;
  document.getElementById('cue-modal-title').textContent = 'Cue toevoegen';
  document.getElementById('cue-del-btn').style.display = 'none';
  document.getElementById('cue-tekst').value = '';
  document.getElementById('cue-tijd').value = '';
  document.getElementById('cue-wie').value = '';
  document.getElementById('cue-opmerking').value = '';
  // fill persons datalist
  const dl = document.getElementById('cue-pdl');
  dl.innerHTML = S.persons.map(p => `<option value="${p}">`).join('');
  // fill section select
  const sec = document.getElementById('cue-sec');
  sec.innerHTML = '<option value="">— Onderaan toevoegen —</option>' +
    S.items.filter(i => i.type === 'sep').map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('cue-ovl').classList.add('open');
  setTimeout(() => document.getElementById('cue-tekst').focus(), 80);
}

function openEditCue(id) {
  const item = S.items.find(i => i.id === id);
  if (!item || item.type !== 'cue') return;
  _cueEditId = id;
  document.getElementById('cue-modal-title').textContent = 'Cue bewerken';
  document.getElementById('cue-del-btn').style.display = 'inline-flex';
  document.getElementById('cue-tekst').value = item.omschrijving || '';
  document.getElementById('cue-tijd').value = item.start || '';
  document.getElementById('cue-wie').value = item.wie || '';
  document.getElementById('cue-opmerking').value = item.bijzonderheden || '';
  const dl = document.getElementById('cue-pdl');
  dl.innerHTML = S.persons.map(p => `<option value="${p}">`).join('');
  const sec = document.getElementById('cue-sec');
  sec.innerHTML = '<option value="">— Onderaan toevoegen —</option>' +
    S.items.filter(i => i.type === 'sep').map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('cue-ovl').classList.add('open');
}

function closeCueModal() {
  document.getElementById('cue-ovl').classList.remove('open');
}

function saveCue() {
  const tekst = (document.getElementById('cue-tekst').value || '').trim();
  if (!tekst) { alert('Vul een actie in.'); return; }
  const data = {
    type: 'cue',
    omschrijving: tekst,
    start: document.getElementById('cue-tijd').value,
    wie: document.getElementById('cue-wie').value.trim(),
    bijzonderheden: document.getElementById('cue-opmerking').value.trim(),
  };
  if (_cueEditId !== null) {
    const i = S.items.findIndex(x => x.id === _cueEditId);
    if (i !== -1) S.items[i] = { ...S.items[i], ...data };
  } else {
    const secId = parseInt(document.getElementById('cue-sec').value) || null;
    const newItem = { id: S.nextId++, ...data };
    if (secId) {
      // Insert after last item of that section
      let lastIdx = S.items.findIndex(i => i.id === secId);
      let j = lastIdx + 1;
      while (j < S.items.length && S.items[j].type !== 'sep') j++;
      S.items.splice(j, 0, newItem);
    } else {
      S.items.push(newItem);
    }
  }
  save(); closeCueModal(); renderBoList();
}

function delCueItem() {
  if (!confirm('Cue verwijderen?')) return;
  S.items = S.items.filter(i => i.id !== _cueEditId);
  save(); closeCueModal(); renderBoList();
}

/* ═══════════════════════════════
   DATA BACKUP — EXPORT & IMPORT
═══════════════════════════════ */

function exportData() {
  // Collect full state + metadata
  const backup = {
    _meta: {
      versie: '1.0',
      app: 'Regie',
      exportDatum: new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' }),
      event: S.event.name || 'Onbekend event',
    },
    ...S,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');

  // Bestandsnaam: data.json (1-op-1 voor upload naar repo-root)
  a.href     = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);

  // Flash bevestiging met instructie
  showToast('✓ data.json gedownload — upload naar je GitHub-repo om team te updaten');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = ''; // reset zodat hetzelfde bestand opnieuw geladen kan worden

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);

      // Validatie: moet in ieder geval items en event hebben
      if (!data.items || !data.event) {
        alert('Dit lijkt geen geldig Regie-backup bestand.\n\nControleer of je het juiste bestand hebt geselecteerd.');
        return;
      }

      const eventNaam = data.event?.name || 'Onbekend';
      const aantalItems = (data.items || []).filter(i => i.type === 'item').length;
      const exportDatum = data._meta?.exportDatum || 'onbekend';

      const bevestiging = confirm(
        `Backup terugzetten?\n\n` +
        `📅 Geëxporteerd op: ${exportDatum}\n` +
        `🎪 Event: ${eventNaam}\n` +
        `📋 Onderdelen: ${aantalItems}\n\n` +
        `⚠ Je huidige data wordt vervangen. Dit kan niet ongedaan worden gemaakt.`
      );

      if (!bevestiging) return;

      // Verwijder _meta zodat het niet in S belandt
      const { _meta, ...stateData } = data;

      // Zet state terug
      Object.assign(S, stateData);

      // Sla op in localStorage
      save();

      // Herlaad de UI volledig
      renderBoList();
      renderRightPanel();
      updateBadges();
      gv('bo', document.getElementById('ni-bo'));

      showToast(`✓ Backup van "${eventNaam}" teruggezet (${aantalItems} onderdelen)`);

    } catch (err) {
      alert('Kon het bestand niet inladen.\n\nFoutmelding: ' + err.message);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

function showToast(msg) {
  // Remove existing toast if any
  const existing = document.getElementById('regie-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'regie-toast';
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'right:24px',
    'background:var(--green)', 'color:#fff',
    'padding:12px 20px', 'border-radius:10px',
    'font-size:13px', 'font-weight:600',
    'z-index:9999', 'box-shadow:0 4px 16px rgba(0,0,0,.14)',
    'transition:opacity .4s', 'max-width:360px', 'line-height:1.4',
  ].join(';');
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

init();

/* ── EVENT-INFO ── */
function renderEventInfo() {
  if (!S.eventInfo) S.eventInfo = {};
  const ei = S.eventInfo;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('ei-naam', ei.naam || S.event.name);
  set('ei-datum', ei.datum || S.event.date);
  set('ei-locatie', ei.locatie);
  set('ei-editie', ei.editie);
  set('ei-inleiding', ei.inleiding);
  set('ei-noemen', ei.noemen);
  set('ei-start', ei.startInfo);
  renderDeelnRijen();
}
function renderDeelnRijen() {
  const el = document.getElementById('ei-deeln-list'); if (!el) return;
  const rows = (S.eventInfo.deelnemers || []);
  el.innerHTML = rows.map((r, i) =>
    `<div class="deeln-rij">
      <input type="text" value="${r.cat||''}" placeholder="Categorie (bijv. 21km Mannen)" oninput="updDeeln(${i},'cat',this.value)">
      <input type="number" value="${r.aantal||''}" placeholder="Aantal" style="width:100px" min="0" oninput="updDeeln(${i},'aantal',this.value)">
      <button class="ib del" onclick="rmDeeln(${i})">✕</button>
    </div>`
  ).join('');
}
function addDeelnRij() {
  if (!S.eventInfo.deelnemers) S.eventInfo.deelnemers = [];
  S.eventInfo.deelnemers.push({ cat:'', aantal:'' });
  renderDeelnRijen();
}
function rmDeeln(i) { S.eventInfo.deelnemers.splice(i,1); save(); renderDeelnRijen(); }
function updDeeln(i, key, val) { S.eventInfo.deelnemers[i][key] = val; }
function saveEventInfo() {
  const g = id => (document.getElementById(id)||{}).value || '';
  S.eventInfo = {
    naam:      g('ei-naam'),
    datum:     g('ei-datum'),
    locatie:   g('ei-locatie'),
    editie:    g('ei-editie'),
    inleiding: g('ei-inleiding'),
    noemen:    g('ei-noemen'),
    startInfo: g('ei-start'),
    deelnemers: S.eventInfo.deelnemers || [],
  };
  // Also sync to S.event
  if (S.eventInfo.naam)  S.event.name = S.eventInfo.naam;
  if (S.eventInfo.datum) S.event.date = S.eventInfo.datum;
  save(); updateBadges();
  showToast('✓ Event-info opgeslagen');
}

/* ── SPONSOREN ── */
let _sponEditId = null;
function renderSpon() {
  const grid = document.getElementById('spon-grid');
  const list = S.sponsoren || [];
  if (!list.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--t3);font-size:13px">Nog geen sponsoren toegevoegd.</div>';
    return;
  }
  grid.innerHTML = list.map(s => `
    <div class="spon-card" onclick="openSponModal(${s.id})">
      <div class="spon-cat-pill">${s.categorie||'Sponsor'}</div>
      <div class="spon-naam">${s.naam}</div>
      ${s.vermelding ? `<div class="spon-detail" style="margin-top:4px;font-style:italic">"${s.vermelding}"</div>` : ''}
      ${s.contact ? `<div class="spon-detail" style="margin-top:6px">👤 ${s.contact}</div>` : ''}
      ${s.bijdrage ? `<div class="spon-detail">💶 ${s.bijdrage}</div>` : ''}
    </div>`).join('');
}
function openSponModal(editId) {
  _sponEditId = editId || null;
  const s = editId ? (S.sponsoren||[]).find(x=>x.id===editId) : null;
  document.getElementById('spon-modal-title').textContent = editId ? 'Sponsor bewerken' : 'Sponsor toevoegen';
  document.getElementById('spon-del-btn').style.display = editId ? 'inline-flex' : 'none';
  const set = (id, val) => { const el=document.getElementById(id); if(el) el.value=val||''; };
  set('spon-naam', s?.naam); set('spon-bijdrage', s?.bijdrage);
  set('spon-vermelding', s?.vermelding); set('spon-contact', s?.contact); set('spon-biz', s?.bijzonderheden);
  if (s?.categorie) document.getElementById('spon-cat').value = s.categorie;
  document.getElementById('spon-ovl').classList.add('open');
}
function closeSponModal() { document.getElementById('spon-ovl').classList.remove('open'); }
function saveSpon() {
  const naam = (document.getElementById('spon-naam').value||'').trim();
  if (!naam) { alert('Vul een naam in.'); return; }
  const data = { naam, categorie: document.getElementById('spon-cat').value, bijdrage: document.getElementById('spon-bijdrage').value.trim(), vermelding: document.getElementById('spon-vermelding').value.trim(), contact: document.getElementById('spon-contact').value.trim(), bijzonderheden: document.getElementById('spon-biz').value.trim() };
  if (!S.sponsoren) S.sponsoren = [];
  if (_sponEditId) { const i=S.sponsoren.findIndex(x=>x.id===_sponEditId); if(i!==-1)S.sponsoren[i]={...S.sponsoren[i],...data}; }
  else S.sponsoren.push({ id:S.nextId++, ...data });
  save(); closeSponModal(); renderSpon(); updateBadges();
}
function delSpon() { if(!confirm('Sponsor verwijderen?'))return; S.sponsoren=S.sponsoren.filter(x=>x.id!==_sponEditId); save(); closeSponModal(); renderSpon(); updateBadges(); }

/* ── PARCOURSEN ── */
let _parcEditId = null;
function renderParc() {
  const el = document.getElementById('parc-list');
  const list = S.parcoursen || [];
  if (!list.length) {
    el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--t3);font-size:13px">Nog geen parcoursen toegevoegd.</div>';
    return;
  }
  el.innerHTML = list.map(p => `
    <div class="parc-card" onclick="openParcModal(${p.id})">
      <div class="parc-dist">${p.afstand||'?'}</div>
      <div class="parc-info">
        <div class="parc-naam">${p.naam||p.afstand}</div>
        ${p.route ? `<div class="parc-route">${p.route}</div>` : ''}
        <div class="parc-meta">
          ${p.startLoc  ? `<span>📍 Start: ${p.startLoc}</span>` : ''}
          ${p.finishLoc ? `<span>🏁 Finish: ${p.finishLoc}</span>` : ''}
          ${p.deelnemers ? `<span>👥 ${p.deelnemers} deelnemers</span>` : ''}
          ${p.winnaarstijd ? `<span>⏱ Winnaarstijd: ${p.winnaarstijd}</span>` : ''}
        </div>
      </div>
    </div>`).join('');
}
function openParcModal(editId) {
  _parcEditId = editId || null;
  const p = editId ? (S.parcoursen||[]).find(x=>x.id===editId) : null;
  document.getElementById('parc-modal-title').textContent = editId ? 'Parcours bewerken' : 'Parcours toevoegen';
  document.getElementById('parc-del-btn').style.display = editId ? 'inline-flex' : 'none';
  const set = (id,val) => { const el=document.getElementById(id); if(el) el.value=val||''; };
  set('parc-afstand',p?.afstand); set('parc-naam',p?.naam); set('parc-start',p?.startLoc);
  set('parc-finish',p?.finishLoc); set('parc-route',p?.route); set('parc-tijd',p?.winnaarstijd);
  set('parc-deeln',p?.deelnemers); set('parc-biz',p?.bijzonderheden);
  document.getElementById('parc-ovl').classList.add('open');
}
function closeParcModal() { document.getElementById('parc-ovl').classList.remove('open'); }
function saveParc() {
  const afstand = (document.getElementById('parc-afstand').value||'').trim();
  if (!afstand) { alert('Vul een afstand in.'); return; }
  const data = { afstand, naam:document.getElementById('parc-naam').value.trim(), startLoc:document.getElementById('parc-start').value.trim(), finishLoc:document.getElementById('parc-finish').value.trim(), route:document.getElementById('parc-route').value.trim(), winnaarstijd:document.getElementById('parc-tijd').value.trim(), deelnemers:document.getElementById('parc-deeln').value, bijzonderheden:document.getElementById('parc-biz').value.trim() };
  if (!S.parcoursen) S.parcoursen = [];
  if (_parcEditId) { const i=S.parcoursen.findIndex(x=>x.id===_parcEditId); if(i!==-1)S.parcoursen[i]={...S.parcoursen[i],...data}; }
  else S.parcoursen.push({ id:S.nextId++, ...data });
  save(); closeParcModal(); renderParc(); updateBadges();
}
function delParc() { if(!confirm('Parcours verwijderen?'))return; S.parcoursen=S.parcoursen.filter(x=>x.id!==_parcEditId); save(); closeParcModal(); renderParc(); updateBadges(); }

/* ── CONTACTEN ── */
let _contEditId = null;
function renderCont() {
  const tb = document.getElementById('cont-tb');
  const list = S.contacten || [];
  if (!list.length) { tb.innerHTML = '<tr><td colspan="5"><div style="padding:24px;text-align:center;color:var(--t3);font-size:13px">Nog geen contacten toegevoegd.</div></td></tr>'; return; }
  tb.innerHTML = list.map(c => `<tr onclick="openContModal(${c.id})" style="cursor:pointer">
    <td><div class="vrij-name">${c.naam}</div></td>
    <td><div class="vrij-func">${c.functie||''}${c.organisatie?' · '+c.organisatie:''}</div></td>
    <td><div class="vrij-tel" style="font-family:var(--fm)">${c.telefoon||'—'}</div></td>
    <td style="font-size:12px;color:var(--t3)">${c.bijzonderheden||''}</td>
    <td><button class="ib del" onclick="event.stopPropagation();S.contacten=S.contacten.filter(x=>x.id!==${c.id});save();renderCont()">✕</button></td>
  </tr>`).join('');
}
function openContModal(editId) {
  _contEditId = editId || null;
  const c = editId ? (S.contacten||[]).find(x=>x.id===editId) : null;
  document.getElementById('cont-modal-title').textContent = editId ? 'Contact bewerken' : 'Contact toevoegen';
  document.getElementById('cont-del-btn').style.display = editId ? 'inline-flex' : 'none';
  const set = (id,val) => { const el=document.getElementById(id); if(el) el.value=val||''; };
  set('cont-naam',c?.naam); set('cont-functie',c?.functie); set('cont-org',c?.organisatie);
  set('cont-tel',c?.telefoon); set('cont-email',c?.email); set('cont-biz',c?.bijzonderheden);
  document.getElementById('cont-ovl').classList.add('open');
}
function closeContModal() { document.getElementById('cont-ovl').classList.remove('open'); }
function saveCont() {
  const naam = (document.getElementById('cont-naam').value||'').trim();
  if (!naam) { alert('Vul een naam in.'); return; }
  const data = { naam, functie:document.getElementById('cont-functie').value.trim(), organisatie:document.getElementById('cont-org').value.trim(), telefoon:document.getElementById('cont-tel').value.trim(), email:document.getElementById('cont-email').value.trim(), bijzonderheden:document.getElementById('cont-biz').value.trim() };
  if (!S.contacten) S.contacten = [];
  if (_contEditId) { const i=S.contacten.findIndex(x=>x.id===_contEditId); if(i!==-1)S.contacten[i]={...S.contacten[i],...data}; }
  else S.contacten.push({ id:S.nextId++, ...data });
  save(); closeContModal(); renderCont(); updateBadges();
}
function delCont() { if(!confirm('Contact verwijderen?'))return; S.contacten=S.contacten.filter(x=>x.id!==_contEditId); save(); closeContModal(); renderCont(); updateBadges(); }


/* ═══════════════════════════════════════════════════════════════
   DRAAIBOEK-EXPORT (Word/.docx)
   Genereert een compleet draaiboek uit alle data in S
   ═══════════════════════════════════════════════════════════════ */

async function genereerDraaiboek() {
  showToast('📄 Draaiboek wordt voorbereid…');

  // Lazy-load docx library bij eerste klik
  try {
    await window.loadDocxLibrary();
  } catch (e) {
    alert('Kon Word-library niet laden:\n\n' + e.message + '\n\nCheck je internet of probeer opnieuw.');
    return;
  }

  if (typeof docx === 'undefined') {
    alert('Word-library niet beschikbaar. Probeer de pagina te verversen (Cmd+Shift+R) en opnieuw.');
    return;
  }

  showToast('📄 Draaiboek wordt gegenereerd…');

  try {
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
      Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak,
      Header, Footer, PageNumber, LevelFormat
    } = docx;

    // ── helpers ──────────────────────────────────────────────────
    const ev = S.event || {};
    const evi = S.eventInfo || {};
    const datumStr = ev.date || evi.datum || '';
    const naamStr = ev.name || evi.naam || 'Draaiboek';

    const T = (text, opts={}) => new TextRun({ text: String(text||''), ...opts });
    const P = (children, opts={}) => new Paragraph({ children: Array.isArray(children) ? children : [children], ...opts });
    const empty = () => new Paragraph({ children: [new TextRun('')] });
    const brk = () => new Paragraph({ children: [new PageBreak()] });

    const H1 = (text) => new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: String(text||''), bold: true, size: 36 })],
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true
    });
    const H2 = (text) => new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: String(text||''), bold: true, size: 28 })],
      spacing: { before: 300, after: 150 }
    });
    const H3 = (text) => new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: String(text||''), bold: true, size: 22 })],
      spacing: { before: 200, after: 100 }
    });

    const labelValue = (label, value) => new Paragraph({
      children: [
        new TextRun({ text: label + ': ', bold: true }),
        new TextRun({ text: String(value || '—') })
      ],
      spacing: { after: 60 }
    });

    const tableCell = (content, opts={}) => new TableCell({
      width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
      shading: opts.shading ? { fill: opts.shading } : undefined,
      children: [new Paragraph({
        children: [new TextRun({ text: String(content||''), bold: !!opts.bold, size: opts.size || 18 })],
        alignment: opts.align || AlignmentType.LEFT
      })]
    });

    // ── secties opbouwen ─────────────────────────────────────────
    const sections = [];

    // ── 1. VOORPAGINA ────────────────────────────────────────────
    const voorpagina = [
      new Paragraph({ children: [new TextRun('')], spacing: { before: 2000 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'DRAAIBOEK', bold: true, size: 56, color: '666666' })],
        spacing: { after: 400 }
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: naamStr, bold: true, size: 72 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: datumStr, size: 32 })],
        spacing: { after: 1200 }
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Status: concept', size: 20, color: '888888' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Gegenereerd op ' + new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' }), size: 18, color: '888888' })],
      })
    ];

    // ── 2. EVENT-INFO ────────────────────────────────────────────
    const eventInfo = [H1('1. Event-info')];
    if (evi.editie) eventInfo.push(labelValue('Editie', evi.editie));
    if (evi.datum) eventInfo.push(labelValue('Datum', evi.datum));
    if (evi.locatie) eventInfo.push(labelValue('Locatie', evi.locatie));
    if (evi.startInfo) {
      eventInfo.push(empty());
      eventInfo.push(H3('Start-info'));
      eventInfo.push(P(T(evi.startInfo)));
    }
    if (evi.inleiding) {
      eventInfo.push(empty());
      eventInfo.push(H3('Inleiding'));
      evi.inleiding.split(/\n+/).filter(Boolean).forEach(p => eventInfo.push(P(T(p))));
    }
    if (evi.noemen) {
      eventInfo.push(empty());
      eventInfo.push(H3('Noemenswaardig'));
      evi.noemen.split(/\n+/).filter(Boolean).forEach(p => eventInfo.push(P(T(p))));
    }
    if (evi.deelnemers && evi.deelnemers.length) {
      eventInfo.push(empty());
      eventInfo.push(H3('Deelnemers / aantallen'));
      evi.deelnemers.forEach(d => {
        if (typeof d === 'object') {
          eventInfo.push(labelValue(d.label || d.afstand || '', d.aantal || ''));
        } else {
          eventInfo.push(P(T('• ' + d)));
        }
      });
    }

    // ── 3. PARCOURSEN ────────────────────────────────────────────
    const parcoursen = [];
    if (S.parcoursen && S.parcoursen.length) {
      parcoursen.push(H1('2. Parcoursen'));
      S.parcoursen.forEach(p => {
        parcoursen.push(H2(p.naam || p.afstand || 'Parcours'));
        if (p.afstand) parcoursen.push(labelValue('Afstand', p.afstand));
        if (p.startLoc) parcoursen.push(labelValue('Start', p.startLoc));
        if (p.finishLoc) parcoursen.push(labelValue('Finish', p.finishLoc));
        if (p.deelnemers) parcoursen.push(labelValue('Deelnemers', p.deelnemers));
        if (p.winnaarstijd) parcoursen.push(labelValue('Winnaarstijd', p.winnaarstijd));
        if (p.route) {
          parcoursen.push(empty());
          parcoursen.push(P([new TextRun({ text: 'Route: ', bold: true }), T(p.route)]));
        }
      });
    }

    // ── 4. SPONSOREN ─────────────────────────────────────────────
    const sponsoren = [];
    if (S.sponsoren && S.sponsoren.length) {
      sponsoren.push(H1('3. Sponsoren'));
      // Groepeer op categorie
      const cats = {};
      S.sponsoren.forEach(s => {
        const c = s.categorie || 'Sponsor';
        if (!cats[c]) cats[c] = [];
        cats[c].push(s);
      });
      const catOrder = ['Hoofdsponsor', 'Sponsor', 'Mediapartner', 'Overige'];
      const catKeys = catOrder.filter(c => cats[c]).concat(Object.keys(cats).filter(c => !catOrder.includes(c)));

      catKeys.forEach(cat => {
        sponsoren.push(H2(cat + 'en'));
        cats[cat].forEach(s => {
          sponsoren.push(H3(s.naam || 'Sponsor'));
          if (s.bijdrage) sponsoren.push(labelValue('Bijdrage', s.bijdrage));
          if (s.vermelding) sponsoren.push(labelValue('Vermelding', s.vermelding));
          if (s.contact) sponsoren.push(labelValue('Contact', s.contact));
        });
      });
    }

    // ── 5. CONTACTEN ─────────────────────────────────────────────
    const contacten = [];
    if (S.contacten && S.contacten.length) {
      contacten.push(H1('4. Contacten'));
      const headerRow = new TableRow({
        tableHeader: true,
        children: [
          tableCell('Naam', { bold: true, shading: 'EEEEEE', width: 25 }),
          tableCell('Functie', { bold: true, shading: 'EEEEEE', width: 25 }),
          tableCell('Telefoon', { bold: true, shading: 'EEEEEE', width: 20 }),
          tableCell('Email', { bold: true, shading: 'EEEEEE', width: 30 })
        ]
      });
      const rows = [headerRow];
      S.contacten.forEach(c => {
        rows.push(new TableRow({
          children: [
            tableCell(c.naam || ''),
            tableCell((c.functie || '') + (c.organisatie ? ' — ' + c.organisatie : '')),
            tableCell(c.telefoon || ''),
            tableCell(c.email || '')
          ]
        }));
      });
      contacten.push(new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      }));
    }

    // ── 6. VRIJWILLIGERS ─────────────────────────────────────────
    const vrijwilligers = [];
    if (S.vrijwilligers && S.vrijwilligers.length) {
      vrijwilligers.push(H1('5. Vrijwilligers'));
      const headerRow = new TableRow({
        tableHeader: true,
        children: [
          tableCell('Naam', { bold: true, shading: 'EEEEEE', width: 30 }),
          tableCell('Functie', { bold: true, shading: 'EEEEEE', width: 30 }),
          tableCell('Locatie', { bold: true, shading: 'EEEEEE', width: 25 }),
          tableCell('Bijz.', { bold: true, shading: 'EEEEEE', width: 15 })
        ]
      });
      const rows = [headerRow];
      S.vrijwilligers.forEach(v => {
        rows.push(new TableRow({
          children: [
            tableCell(v.naam || ''),
            tableCell(v.functie || ''),
            tableCell(v.locatie || ''),
            tableCell(v.bijzonderheden || '')
          ]
        }));
      });
      vrijwilligers.push(new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      }));
    }

    // ── 7. ENTERTAINMENT ────────────────────────────────────────
    const entertainment = [];
    if (S.entertainment && S.entertainment.length) {
      entertainment.push(H1('6. Entertainment'));
      S.entertainment.forEach(e => {
        entertainment.push(H3(e.naam || e.title || 'Entertainment'));
        if (e.duur) entertainment.push(labelValue('Duur', e.duur));
        if (e.beschrijving) entertainment.push(P(T(e.beschrijving)));
        if (e.techniek) entertainment.push(labelValue('Techniek', e.techniek));
      });
    }

    // ── 8. HULDIGINGEN / PRIJSUITREIKINGEN ──────────────────────
    const huldigingen = [];
    if (S.huldigingen && S.huldigingen.length) {
      huldigingen.push(H1('7. Huldigingen'));
      S.huldigingen.forEach(h => {
        huldigingen.push(H3(h.naam || 'Huldiging'));
        if (h.wieReiktUit) huldigingen.push(labelValue('Wie reikt uit', h.wieReiktUit));
        if (h.locatie) huldigingen.push(labelValue('Locatie', h.locatie));
        if (h.sponsor) huldigingen.push(labelValue('Sponsor', h.sponsor));
        if (h.items) huldigingen.push(labelValue('Benodigdheden', h.items));
        if (h.bijzonderheden) huldigingen.push(labelValue('Bijzonderheden', h.bijzonderheden));
      });
    }

    // ── 9. REGIEPAD (TIJDSCHEMA) ────────────────────────────────
    const regiepad = [H1('8. Regiepad — tijdschema')];
    regiepad.push(P(T('Het complete regiepad in chronologische volgorde, gegroepeerd per sectie.', { italics: true })));
    regiepad.push(empty());

    // Bouw items per sectie op (dezelfde groepering als de tool)
    let currentSepName = null;
    const itemsBySep = { _nosep: { name: '', items: [] } };
    const sepOrder = ['_nosep'];
    let lastSepKey = '_nosep';
    S.items.forEach(item => {
      if (item.type === 'sep') {
        const k = 'sep_' + item.id;
        itemsBySep[k] = { name: item.name || 'Sectie', items: [] };
        sepOrder.push(k);
        lastSepKey = k;
      } else if (item.type === 'item' || item.type === 'cue') {
        itemsBySep[lastSepKey].items.push(item);
      }
    });

    // Sorteer items binnen elke sectie op tijd
    const t2m = (t) => { if(!t) return 9999; const [h,m] = t.split(':').map(Number); return (h||0)*60+(m||0); };

    sepOrder.forEach(k => {
      const grp = itemsBySep[k];
      if (!grp.items.length) return;
      const sorted = grp.items.slice().sort((a,b) => t2m(a.start) - t2m(b.start));

      if (grp.name) regiepad.push(H2(grp.name));

      const headerRow = new TableRow({
        tableHeader: true,
        children: [
          tableCell('Tijd', { bold: true, shading: 'D0D0D0', width: 12 }),
          tableCell('Onderdeel', { bold: true, shading: 'D0D0D0', width: 35 }),
          tableCell('Wie', { bold: true, shading: 'D0D0D0', width: 18 }),
          tableCell('Locatie', { bold: true, shading: 'D0D0D0', width: 20 }),
          tableCell('Type', { bold: true, shading: 'D0D0D0', width: 15 })
        ]
      });
      const rows = [headerRow];
      sorted.forEach(item => {
        const tijd = item.start + (item.eind ? '\n→ ' + item.eind : '');
        const type = item.type === 'cue' ? 'CUE' : (item.label || '');
        const omschrijving = (item.omschrijving || '') + (item.fixed ? ' [vast]' : '');
        rows.push(new TableRow({
          children: [
            tableCell(tijd, { size: 16 }),
            tableCell(omschrijving, { bold: item.type === 'cue', size: 18 }),
            tableCell(item.wie || '', { size: 16 }),
            tableCell(item.locatie || '', { size: 16 }),
            tableCell(type, { size: 14, shading: item.type === 'cue' ? 'F3E8FF' : undefined })
          ]
        }));
      });
      regiepad.push(new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      }));
      regiepad.push(empty());
    });

    // ── 10. ONDERDELEN — DETAILS ────────────────────────────────
    const details = [H1('9. Onderdelen — details')];
    details.push(P(T('Per onderdeel: script, technische instructies, DJ-info, bijzonderheden.', { italics: true })));
    details.push(empty());

    const allItems = S.items.filter(i => i.type === 'item' || i.type === 'cue');
    const sortedAll = allItems.slice().sort((a,b) => t2m(a.start) - t2m(b.start));

    sortedAll.forEach(item => {
      const titel = (item.start || '?:??') + ' — ' + (item.omschrijving || 'Onderdeel');
      details.push(H3(titel));
      if (item.type === 'cue') details.push(P(T('TYPE: CUE', { bold: true, color: '7C3AED' })));
      if (item.wie) details.push(labelValue('Wie', item.wie));
      if (item.locatie) details.push(labelValue('Locatie', item.locatie));
      if (item.label) details.push(labelValue('Label', item.label));
      if (item.eind) details.push(labelValue('Eindtijd', item.eind));
      if (item.bijzonderheden) {
        details.push(empty());
        details.push(P([new TextRun({ text: 'Bijzonderheden: ', bold: true })]));
        item.bijzonderheden.split(/\n+/).filter(Boolean).forEach(p => details.push(P(T(p))));
      }
      if (item.script) {
        details.push(empty());
        details.push(P([new TextRun({ text: 'Script: ', bold: true })]));
        item.script.split(/\n+/).filter(Boolean).forEach(p => details.push(P(T(p))));
      }
      if (item.techniek) {
        details.push(empty());
        details.push(P([new TextRun({ text: 'Technische instructies: ', bold: true })]));
        item.techniek.split(/\n+/).filter(Boolean).forEach(p => details.push(P(T(p))));
      }
      if (item.dj) {
        details.push(empty());
        details.push(P([new TextRun({ text: 'DJ / Muziek: ', bold: true })]));
        item.dj.split(/\n+/).filter(Boolean).forEach(p => details.push(P(T(p))));
      }
      details.push(empty());
    });

    // ── ALLE SECTIES SAMENVOEGEN ────────────────────────────────
    const allChildren = [
      ...voorpagina,
      ...eventInfo,
      ...parcoursen,
      ...sponsoren,
      ...contacten,
      ...vrijwilligers,
      ...entertainment,
      ...huldigingen,
      ...regiepad,
      ...details
    ];

    // ── DOCUMENT MAKEN ──────────────────────────────────────────
    const doc = new Document({
      creator: 'Regie',
      title: naamStr + ' — Draaiboek',
      description: 'Gegenereerd draaiboek',
      styles: {
        default: {
          document: {
            run: { font: 'Calibri', size: 20 }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 }
          }
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: naamStr + ' — Draaiboek', size: 16, color: '888888' })]
            })]
          })
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'pagina ', size: 16, color: '888888' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888' }),
                new TextRun({ text: ' van ', size: 16, color: '888888' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '888888' })
              ]
            })]
          })
        },
        children: allChildren
      }]
    });

    // ── PACKER → BLOB → DOWNLOAD ────────────────────────────────
    const blob = await Packer.toBlob(doc);
    const eventSlug = (naamStr || 'draaiboek').toLowerCase()
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30);
    const datumSlug = new Date().toISOString().slice(0, 10);
    const filename = `draaiboek-${eventSlug}-${datumSlug}.docx`;

    if (typeof saveAs !== 'undefined') {
      saveAs(blob, filename);
    } else {
      // Fallback zonder file-saver
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    showToast('✓ Draaiboek gedownload: ' + filename);

  } catch (err) {
    console.error('Draaiboek-fout:', err);
    alert('Fout bij genereren draaiboek:\n\n' + err.message + '\n\nCheck de browser-console (Cmd+Opt+I) voor details.');
  }
}


/* ═══════════════════════════════════════════════════════════════
   CALLSHEET (voor entertainment-acts)
   Slaat callsheet-specifieke velden op binnen het entertainment-item
   onder de key `callsheet`. Org-contact/noodcontact zijn event-breed
   en zitten onder S.eventInfo.callsheetDefaults.
   ═══════════════════════════════════════════════════════════════ */

let _csEditEntId = null;

function openCallsheetModal(entId) {
  const ent = (S.entertainment || []).find(x => x.id === entId);
  if (!ent) { alert('Act niet gevonden.'); return; }
  _csEditEntId = entId;

  // Bestaande callsheet-data van deze act
  const cs = ent.callsheet || {};

  // Event-brede defaults voor org-contact en noodcontact
  if (!S.eventInfo) S.eventInfo = {};
  if (!S.eventInfo.callsheetDefaults) S.eventInfo.callsheetDefaults = {};
  const defs = S.eventInfo.callsheetDefaults;

  document.getElementById('cs-modal-title').textContent = 'Callsheet — ' + ent.naam;
  document.getElementById('cs-actname').textContent = ent.naam + (ent.type ? ' · ' + ent.type : '');

  // Locatie-dropdown vullen — match op cs.locNaam (gekoppelde locatie) of ent.locatie als fallback
  const csLocSel = document.getElementById('cs-loc-sel');
  let gekoppeldeLoc = null;
  if (csLocSel) {
    const huidigeLocNaam = cs.locNaam || ent.locatie || '';
    csLocSel.innerHTML = locDropdownOptions(huidigeLocNaam);
    if (huidigeLocNaam) gekoppeldeLoc = findLocByNaam(huidigeLocNaam);
  }

  const v = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

  // Adres + Maps: gebruik bestaande callsheet-data, val terug op gekoppelde locatie
  v('cs-loc-adres', cs.locAdres || (gekoppeldeLoc ? gekoppeldeLoc.adres : ''));
  v('cs-loc-maps',  cs.locMaps  || (gekoppeldeLoc ? gekoppeldeLoc.mapsUrl : ''));
  v('cs-melden',      cs.meldenBij);
  v('cs-t-aanwezig',  cs.tijdAanwezig);
  v('cs-t-start',     cs.tijdStart);
  v('cs-t-einde',     cs.tijdEinde);
  v('cs-opdracht',    cs.opdracht);
  v('cs-catering',    cs.catering);
  v('cs-stroom',      cs.stroom || ent.rider);  // val terug op rider als stroom leeg
  v('cs-notities',    cs.notities);
  v('cs-org-naam',    defs.orgNaam);
  v('cs-org-tel',     defs.orgTel);
  v('cs-org-email',   defs.orgEmail);
  v('cs-nood-naam',   defs.noodNaam);
  v('cs-nood-tel',    defs.noodTel);

  // Slim: tijden suggereren uit regiepad als deze act is ingepland
  const planned = (S.items || []).find(it => it.type === 'item' && it.libRef && it.libRef.type === 'ent' && it.libRef.id === entId);
  const hint = document.getElementById('cs-tijden-hint');
  if (planned && (!cs.tijdStart || !cs.tijdEinde)) {
    hint.style.display = 'block';
    hint.innerHTML = `💡 Deze act staat ingepland in het regiepad: <b>${planned.start || '?'} – ${planned.eind || '?'}</b>${planned.locatie ? ' · ' + planned.locatie : ''}. <a href="#" onclick="vulTijdenUitRegiepad(${planned.id});return false" style="color:var(--y);font-weight:600">Vul tijden in vanuit regiepad</a>`;
  } else if (planned) {
    hint.style.display = 'block';
    hint.style.color = 'var(--t3)';
    hint.innerHTML = `Ingepland in regiepad: ${planned.start || '?'} – ${planned.eind || '?'}${planned.locatie ? ' · ' + planned.locatie : ''}`;
  } else {
    hint.style.display = 'none';
  }

  document.getElementById('cs-ovl').classList.add('open');
}

function vulTijdenUitRegiepad(itemId) {
  const it = (S.items || []).find(x => x.id === itemId);
  if (!it) return;
  // Aanwezig: 30 min vóór start (suggestie)
  const startEl = document.getElementById('cs-t-start');
  const eindeEl = document.getElementById('cs-t-einde');
  const aanwezigEl = document.getElementById('cs-t-aanwezig');
  if (it.start && !startEl.value) startEl.value = it.start;
  if (it.eind && !eindeEl.value) eindeEl.value = it.eind;
  if (it.start && !aanwezigEl.value) {
    // 30 min voor start
    const [h, m] = it.start.split(':').map(Number);
    const total = h * 60 + m - 30;
    if (total >= 0) {
      const nh = Math.floor(total / 60);
      const nm = total % 60;
      aanwezigEl.value = String(nh).padStart(2, '0') + ':' + String(nm).padStart(2, '0');
    }
  }
}

function closeCsModal() { document.getElementById('cs-ovl').classList.remove('open'); }


// ── Callsheet-data opslaan zonder genereren ──
function _csCollectFormData() {
  const g = (id) => (document.getElementById(id).value || '').trim();
  const locSel = document.getElementById('cs-loc-sel');
  return {
    cs: {
      locNaam:      locSel ? locSel.value : '',
      locAdres:     g('cs-loc-adres'),
      locMaps:      g('cs-loc-maps'),
      meldenBij:    g('cs-melden'),
      tijdAanwezig: g('cs-t-aanwezig'),
      tijdStart:    g('cs-t-start'),
      tijdEinde:    g('cs-t-einde'),
      opdracht:     g('cs-opdracht'),
      catering:     g('cs-catering'),
      stroom:       g('cs-stroom'),
      notities:     g('cs-notities'),
    },
    defs: {
      orgNaam:   g('cs-org-naam'),
      orgTel:    g('cs-org-tel'),
      orgEmail:  g('cs-org-email'),
      noodNaam:  g('cs-nood-naam'),
      noodTel:   g('cs-nood-tel'),
    }
  };
}

function saveCallsheetData() {
  const ent = (S.entertainment || []).find(x => x.id === _csEditEntId);
  if (!ent) { alert('Act niet gevonden.'); return; }
  const { cs, defs } = _csCollectFormData();
  ent.callsheet = cs;
  if (!S.eventInfo) S.eventInfo = {};
  S.eventInfo.callsheetDefaults = defs;
  save();
  closeCsModal();
  showToast('✓ Callsheet-gegevens opgeslagen voor ' + ent.naam);
}

function saveAndPreviewCallsheet() {
  const ent = (S.entertainment || []).find(x => x.id === _csEditEntId);
  if (!ent) { alert('Act niet gevonden.'); return; }
  const { cs, defs } = _csCollectFormData();
  ent.callsheet = cs;
  if (!S.eventInfo) S.eventInfo = {};
  S.eventInfo.callsheetDefaults = defs;
  save();
  closeCsModal();
  openCallsheetPreview(_csEditEntId);
}

function openCallsheetPreview(entId) {
  const ent = (S.entertainment || []).find(x => x.id === entId);
  if (!ent) { alert('Act niet gevonden.'); return; }
  const html = buildCallsheetHTML(ent);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Pop-up geblokkeerd. Sta pop-ups toe voor deze site om de voorbeeldweergave te zien.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

function buildCallsheetHTML(ent) {
  const ev   = S.event || {};
  const evi  = S.eventInfo || {};
  const defs = (evi.callsheetDefaults || {});
  const cs   = ent.callsheet || {};

  const eventNaam  = ev.name  || evi.naam  || 'Event';
  const eventDatum = ev.date  || evi.datum || '';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  const multi = (text) => {
    if (!text) return '';
    return esc(text).replace(/\n+/g,'<br>');
  };

  // Sla terug op gekoppelde locatie als adres/maps leeg zijn
  const gekoppeldeLoc = (cs.locNaam ? findLocByNaam(cs.locNaam) : null) || (ent.locatie ? findLocByNaam(ent.locatie) : null);
  const adres = cs.locAdres || (gekoppeldeLoc ? gekoppeldeLoc.adres : '');
  const mapsUrl = cs.locMaps || (gekoppeldeLoc ? gekoppeldeLoc.mapsUrl : '');
  const locNaam = cs.locNaam || ent.locatie || (gekoppeldeLoc ? gekoppeldeLoc.naam : '');

  const mapsLink = mapsUrl
    ? '<a href="' + esc(mapsUrl) + '" target="_blank" rel="noopener" class="maps-btn">📍 Open in Google Maps</a>'
    : '';

  const logoUrl = 'https://www.loopleeuwarden.frl/wp-content/themes/hello-elementor-child/assets/LogoLoopLWD.svg';

  // CALL TIME = aanwezig vanaf — dat is het belangrijkste
  const callTime = cs.tijdAanwezig || cs.tijdStart || '';

  const generationDate = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Helper voor labelregel
  const lblRow = (label, value) => {
    if (!value) return '';
    return '<tr><td class="lbl">' + esc(label) + '</td><td class="val">' + esc(value) + '</td></tr>';
  };

  const gageStr = ent.bedrag
    ? '€' + ent.bedrag + ' excl. btw' + (ent.korting ? '  (' + ent.korting + '% korting)' : '')
    : '';

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Callsheet — ${esc(ent.naam)} — ${esc(eventNaam)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    background: #e5e5e5;
    padding: 20px 0;
  }

  /* Toolbar buiten de pagina */
  .toolbar {
    width: 210mm;
    margin: 0 auto 18px;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 0 4mm;
  }
  .toolbar h2 { margin: 0; font-size: 13px; font-weight: 600; color: #555; flex: 1; }
  .toolbar button {
    background: #1a1a1a; color: #fff; border: none;
    padding: 9px 16px; border-radius: 6px;
    font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit;
  }
  .toolbar button:hover { background: #333; }
  .toolbar .secondary { background: #fff; color: #1a1a1a; border: 1px solid #ccc; }

  /* A4 pagina exact — 210x297mm */
  .sheet {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    background: #fff;
    padding: 14mm 14mm;
    box-shadow: 0 2px 14px rgba(0,0,0,.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* HEADER — 3 koloms */
  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 14px;
    align-items: start;
    padding-bottom: 10px;
    border-bottom: 2px solid #1a1a1a;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .header-left { font-size: 10px; color: #555; line-height: 1.5; }
  .header-left .org-naam { font-weight: 700; color: #1a1a1a; font-size: 11px; margin-bottom: 3px; }
  .header-mid { text-align: center; }
  .header-mid img { max-height: 50px; max-width: 180px; }
  .header-mid .fallback-title { font-weight: 800; font-size: 18px; color: #1a1a1a; }
  .header-right { text-align: right; }
  .header-right .label { font-size: 9px; letter-spacing: 1.5px; color: #777; text-transform: uppercase; font-weight: 700; }
  .header-right .title { font-size: 18px; font-weight: 800; color: #1a1a1a; line-height: 1; margin-top: 2px; }
  .header-right .date { font-size: 10px; color: #444; margin-top: 4px; }

  /* CALL TIME — extreem prominent, naast act-naam */
  .topblock {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .topblock .act-block {
    background: #fafafa;
    border: 1px solid #d0d0d0;
    padding: 10px 14px;
  }
  .topblock .act-block .act-name {
    font-size: 17px; font-weight: 700; line-height: 1.1;
  }
  .topblock .act-block .act-type {
    font-size: 11px; color: #777; margin-top: 3px;
  }

  .calltime-box {
    background: #1a1a1a;
    color: #fff;
    padding: 8px 18px;
    text-align: center;
    min-width: 130px;
  }
  .calltime-box .label {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    font-weight: 700; opacity: .7;
  }
  .calltime-box .time {
    font-size: 32px; font-weight: 800; line-height: 1; margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .calltime-box .label-sub {
    font-size: 9px; letter-spacing: 1px; text-transform: uppercase;
    font-weight: 600; opacity: .65; margin-top: 3px;
  }

  /* Algemene panel-styles */
  .panel { border: 1px solid #d0d0d0; padding: 8px 12px; margin-bottom: 10px; }
  .panel-title {
    font-size: 9px; letter-spacing: 1.5px; color: #777;
    text-transform: uppercase; font-weight: 700;
    margin-bottom: 5px; padding-bottom: 3px;
    border-bottom: 1px solid #eee;
  }
  .panel-text { font-size: 11.5px; line-height: 1.4; color: #1a1a1a; }

  /* Schedule-tabel — tijden + locatie */
  .schedule-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border: 1px solid #d0d0d0;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .schedule-row > .col {
    padding: 8px 12px;
  }
  .schedule-row > .col + .col { border-left: 1px solid #d0d0d0; }
  .schedule-row .col-time { background: #fafafa; }
  .schedule-row .col-time .panel-title { color: #555; }
  .schedule-row .col-time .time-line {
    font-size: 13px; font-variant-numeric: tabular-nums;
    margin-top: 3px; line-height: 1.4;
  }
  .schedule-row .col-time .time-line b { color: #000; }

  /* Contact + Locatie als 2-koloms */
  .duo {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    border: 1px solid #d0d0d0; margin-bottom: 10px;
    flex-shrink: 0;
  }
  .duo > .col { padding: 8px 12px; }
  .duo > .col + .col { border-left: 1px solid #d0d0d0; }

  /* Tabel binnen panels */
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  table td { padding: 2.5px 0; vertical-align: top; }
  table td.lbl { color: #777; font-weight: 600; width: 100px; padding-right: 8px; font-size: 10px; }
  table td.val { color: #1a1a1a; line-height: 1.35; }

  /* Maps knop */
  .maps-btn {
    display: inline-block; background: #1a73e8; color: #fff;
    padding: 3px 8px; border-radius: 3px;
    font-size: 10px; text-decoration: none; font-weight: 600;
    margin-top: 3px;
  }
  .maps-btn:hover { background: #1557b0; }

  /* Noodcontact apart, opvallend */
  .nood {
    background: #fff5f5; border: 1px solid #fecaca;
    padding: 8px 12px; margin-bottom: 10px;
    flex-shrink: 0;
  }
  .nood .panel-title { color: #c0392b; }
  .nood table td.val { font-weight: 600; }

  /* Footer onderaan, blijft op pagina */
  .footer {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid #d0d0d0;
    font-size: 9px;
    color: #888;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    flex-shrink: 0;
  }
  .footer .gen-info { font-style: italic; }

  /* Auto-grow content section */
  .content-flow { flex: 1; display: flex; flex-direction: column; }

  @media print {
    body { background: #fff; padding: 0; }
    .toolbar { display: none; }
    .sheet {
      box-shadow: none;
      width: 210mm;
      height: 297mm;
      margin: 0;
    }
    .maps-btn { background: none; color: #1a73e8; padding: 0; }
    .maps-btn::after { content: " (" attr(href) ")"; font-size: 8px; word-break: break-all; }
  }
</style>
</head>
<body>

<div class="toolbar">
  <h2>Voorbeeld callsheet — ${esc(ent.naam)}</h2>
  <button class="secondary" onclick="window.close()">Sluiten</button>
  <button onclick="window.print()">🖨 Print / opslaan als PDF</button>
</div>

<div class="sheet">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <div class="org-naam">${esc(eventNaam)}</div>
      ${defs.orgNaam ? '<div>' + esc(defs.orgNaam) + '</div>' : ''}
      ${defs.orgTel  ? '<div>' + esc(defs.orgTel) + '</div>' : ''}
      ${defs.orgEmail? '<div>' + esc(defs.orgEmail) + '</div>' : ''}
    </div>
    <div class="header-mid">
      <img src="${logoUrl}" alt="LOOP Leeuwarden" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <div class="fallback-title" style="display:none">LOOP LEEUWARDEN</div>
    </div>
    <div class="header-right">
      <div class="label">Callsheet</div>
      <div class="title">${esc(eventDatum || '')}</div>
      <div class="date">Versie: ${esc(generationDate)}</div>
    </div>
  </div>

  <!-- TOP: act + CALL TIME -->
  <div class="topblock">
    <div class="act-block">
      <div class="act-name">${esc(ent.naam)}</div>
      ${ent.type ? '<div class="act-type">' + esc(ent.type) + (ent.aantalPersonen ? ' · ' + ent.aantalPersonen + ' personen' : '') + '</div>' : ''}
    </div>
    <div class="calltime-box">
      <div class="label">Call Time</div>
      <div class="time">${esc(callTime || '—')}</div>
      <div class="label-sub">aanwezig op locatie</div>
    </div>
  </div>

  <div class="content-flow">

  <!-- SCHEDULE: tijden + start + einde -->
  <div class="schedule-row">
    <div class="col col-time">
      <div class="panel-title">Aanwezig</div>
      <div class="time-line"><b>${esc(cs.tijdAanwezig || '—')}</b></div>
    </div>
    <div class="col col-time">
      <div class="panel-title">Start</div>
      <div class="time-line"><b>${esc(cs.tijdStart || '—')}</b></div>
    </div>
    <div class="col col-time">
      <div class="panel-title">Einde verwacht</div>
      <div class="time-line"><b>${esc(cs.tijdEinde || '—')}</b></div>
    </div>
  </div>

  <!-- DUO: contact + locatie -->
  <div class="duo">
    <div class="col">
      <div class="panel-title">Jouw contactgegevens</div>
      <table>
        ${lblRow('Contact', ent.contactpersoon)}
        ${lblRow('Telefoon', ent.telefoon)}
        ${lblRow('Personen', ent.aantalPersonen ? String(ent.aantalPersonen) : '')}
      </table>
    </div>
    <div class="col">
      <div class="panel-title">Locatie</div>
      <table>
        ${lblRow('Naam', locNaam)}
        ${lblRow('Adres', adres)}
        ${lblRow('Melden bij', cs.meldenBij || 'n.v.t.')}
      </table>
      ${mapsLink}
    </div>
  </div>

  ${cs.opdracht ? `
  <div class="panel">
    <div class="panel-title">Opdracht — wat ga je doen?</div>
    <div class="panel-text">${multi(cs.opdracht)}</div>
  </div>` : ''}

  ${cs.catering ? `
  <div class="panel">
    <div class="panel-title">Catering</div>
    <div class="panel-text">${multi(cs.catering)}</div>
  </div>` : ''}

  ${(cs.stroom || ent.rider) ? `
  <div class="panel">
    <div class="panel-title">Stroom & techniek</div>
    <div class="panel-text">${multi(cs.stroom || ent.rider)}</div>
  </div>` : ''}

  ${cs.notities ? `
  <div class="panel">
    <div class="panel-title">Aanrijden, parkeren & notities</div>
    <div class="panel-text">${multi(cs.notities)}</div>
  </div>` : ''}

  ${gageStr ? `
  <div class="panel">
    <div class="panel-title">Vergoeding</div>
    <div class="panel-text"><b>${esc(gageStr)}</b></div>
  </div>` : ''}

  ${(defs.noodNaam || defs.noodTel) ? `
  <div class="nood">
    <div class="panel-title">Noodcontact op de dag</div>
    <table>
      ${lblRow('Naam', defs.noodNaam)}
      ${lblRow('Telefoon', defs.noodTel)}
    </table>
  </div>` : ''}

  <!-- FOOTER -->
  <div class="footer">
    <div class="gen-info">Gegenereerd op ${esc(generationDate)}</div>
    <div style="text-align:right">${esc(eventNaam)} — ${esc(ent.naam)}</div>
  </div>

  </div><!-- content-flow -->

</div>

</body>
</html>`;
}


/* ═══════════════════════════════════════════════════════════════
   LOCATIES — centrale lijst, koppelbaar aan entertainment & callsheet
   ═══════════════════════════════════════════════════════════════ */

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escAttr(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

function renderLoc() {
  updateBadges();
  const tb = document.getElementById('loc-tb');
  if (!tb) return;
  const list = S.locaties || [];
  if (!list.length) {
    tb.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--t3);font-size:13px">Nog geen locaties. Klik <b>+ Locatie toevoegen</b>.</td></tr>';
    return;
  }
  tb.innerHTML = list.map(function(l){
    const mapsCell = l.mapsUrl
      ? '<a href="'+escAttr(l.mapsUrl)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:#1a73e8;text-decoration:none;font-size:11px">📍 Open</a>'
      : '<span style="color:var(--t3)">—</span>';
    return '<tr onclick="openLocModal('+l.id+')">'+
      '<td><b>'+escHtml(l.naam||'')+'</b></td>'+
      '<td style="color:var(--t2);font-size:12px">'+escHtml(l.adres||'')+'</td>'+
      '<td>'+mapsCell+'</td>'+
      '<td><button class="ib del" onclick="event.stopPropagation();delLocById('+l.id+')" title="Verwijder">✕</button></td>'+
    '</tr>';
  }).join('');
}

let _locEditId = null;
function openLocModal(editId) {
  _locEditId = editId || null;
  const l = editId ? (S.locaties||[]).find(function(x){return x.id===editId;}) : null;
  document.getElementById('loc-modal-title').textContent = editId ? 'Locatie bewerken' : 'Locatie toevoegen';
  document.getElementById('loc-del-btn').style.display = editId ? 'inline-flex' : 'none';
  document.getElementById('loc-naam').value  = l ? (l.naam  || '') : '';
  document.getElementById('loc-adres').value = l ? (l.adres || '') : '';
  document.getElementById('loc-maps').value  = l ? (l.mapsUrl || '') : '';
  document.getElementById('loc-ovl').classList.add('open');
}

function closeLocModal() { document.getElementById('loc-ovl').classList.remove('open'); }

function saveLoc() {
  const naam = (document.getElementById('loc-naam').value || '').trim();
  if (!naam) { alert('Vul een naam in.'); return; }
  const data = {
    naam: naam,
    adres: (document.getElementById('loc-adres').value || '').trim(),
    mapsUrl: (document.getElementById('loc-maps').value || '').trim()
  };
  if (!S.locaties) S.locaties = [];
  if (_locEditId) {
    const i = S.locaties.findIndex(function(x){return x.id===_locEditId;});
    if (i !== -1) S.locaties[i] = Object.assign({}, S.locaties[i], data);
  } else {
    S.locaties.push(Object.assign({id: S.nextId++}, data));
  }
  save(); closeLocModal(); renderLoc(); updateBadges();
}

function delLoc() {
  if (!confirm('Locatie verwijderen?\n\nLet op: acts/callsheets die naar deze locatie verwijzen blijven hun gegevens behouden, maar de koppeling gaat verloren.')) return;
  S.locaties = (S.locaties||[]).filter(function(x){return x.id !== _locEditId;});
  save(); closeLocModal(); renderLoc(); updateBadges();
}

function delLocById(id) {
  if (!confirm('Locatie verwijderen?')) return;
  S.locaties = (S.locaties||[]).filter(function(x){return x.id !== id;});
  save(); renderLoc(); updateBadges();
}

// Helper: zoek locatie op naam (gebruikt voor entertainment.locatie matching)
function findLocByNaam(naam) {
  if (!naam || !S.locaties) return null;
  return S.locaties.find(function(l){ return l.naam === naam; });
}

// Helper: render dropdown HTML voor locatie-keuze
function locDropdownOptions(selectedNaam) {
  const list = S.locaties || [];
  let html = '<option value="">— Geen / vrije invoer —</option>';
  list.forEach(function(l){
    const sel = (l.naam === selectedNaam) ? ' selected' : '';
    html += '<option value="'+escAttr(l.naam)+'"'+sel+'>'+escHtml(l.naam)+'</option>';
  });
  return html;
}

// Locatie-dropdown change handler in entertainment modal
function lmLocChange() {
  const sel = document.getElementById("lm-loc-sel");
  const txt = document.getElementById("lm-loc");
  if (sel.value) {
    // Locatie gekozen uit lijst → vrij veld wordt verborgen en geleegd
    txt.style.display = "none";
    txt.value = "";
  } else {
    // 'Geen' gekozen → vrij veld zichtbaar
    txt.style.display = "block";
  }
}

// Callsheet locatie-dropdown change handler
function csLocChange() {
  const sel = document.getElementById('cs-loc-sel');
  if (!sel || !sel.value) return;  // 'Geen' gekozen → niets autovullen
  const loc = findLocByNaam(sel.value);
  if (!loc) return;
  const adresEl = document.getElementById('cs-loc-adres');
  const mapsEl = document.getElementById('cs-loc-maps');
  // Alleen overschrijven als velden leeg zijn — anders gebruiker waarschuwen
  const adresLeeg = !adresEl.value.trim();
  const mapsLeeg = !mapsEl.value.trim();
  if (!adresLeeg || !mapsLeeg) {
    if (!confirm('Adres en/of Maps-link zijn al ingevuld. Overschrijven met gegevens van "' + loc.naam + '"?')) return;
  }
  if (loc.adres) adresEl.value = loc.adres;
  if (loc.mapsUrl) mapsEl.value = loc.mapsUrl;
}
