// ATELIER — Personal Styling Studio · app logic
/* =======================================================
   STATE
   ======================================================= */
const state = {
  step: 1,
  imageDataUrl: null,
  imageIsDemo: false,
  itemType: '',
  itemColor: '',
  itemColorName: '',
  vibe: null,
  customVibe: '',
  gender: null,
  bodyType: null,
  reshuffleSeed: 0,
};

// Map item types to outfit categories
const itemTypeCategory = {
  't-shirt':'Top','shirt':'Top','polo':'Top','sweater':'Top','hoodie':'Top','tank':'Top',
  'jacket':'Outer','blazer':'Outer','coat':'Outer','overshirt':'Outer',
  'jeans':'Bottom','trousers':'Bottom','shorts':'Bottom','skirt':'Bottom','cargos':'Bottom',
  'dress':'Onepiece','jumpsuit':'Onepiece',
  'sneakers':'Shoe','boots':'Shoe','loafers':'Shoe','heels':'Shoe','sandals':'Shoe',
  'bag':'Bag','hat':'Acc','sunglasses':'Acc','watch':'Acc','jewelry':'Acc','belt':'Acc','scarf':'Acc'
};

// Friendly label for item types
const itemTypeLabel = {
  't-shirt':'t-shirt','shirt':'button-down shirt','polo':'polo','sweater':'knit','hoodie':'hoodie','tank':'tank',
  'jacket':'jacket','blazer':'blazer','coat':'coat','overshirt':'overshirt',
  'jeans':'pair of jeans','trousers':'pair of trousers','shorts':'pair of shorts','skirt':'skirt','cargos':'pair of cargos',
  'dress':'dress','jumpsuit':'jumpsuit',
  'sneakers':'pair of sneakers','boots':'pair of boots','loafers':'pair of loafers','heels':'pair of heels','sandals':'pair of sandals',
  'bag':'bag','hat':'hat','sunglasses':'pair of sunglasses','watch':'watch','jewelry':'piece of jewelry','belt':'belt','scarf':'scarf'
};

/* =======================================================
   STEPPER
   ======================================================= */
function goTo(step) {
  state.step = step;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (step <= 3) {
    document.getElementById('screen-' + step).classList.add('active');
  } else if (step === 4) {
    document.getElementById('screen-loading').classList.add('active');
  } else if (step === 5) {
    document.getElementById('screen-results').classList.add('active');
  }
  updateStepper(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(step) {
  const stepMap = step === 4 ? 3 : (step === 5 ? 4 : step);
  document.querySelectorAll('#stepper .step').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (n < stepMap) el.classList.add('done');
    else if (n === stepMap) el.classList.add('active');
  });
}

/* =======================================================
   STEP 1: UPLOAD
   ======================================================= */
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const goto2 = document.getElementById('goto-2');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});
fileInput.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    state.imageDataUrl = ev.target.result;
    state.imageIsDemo = false;
    showPreview(state.imageDataUrl);
    document.getElementById('item-details').classList.add('show');
    validateStep1();
    if (AI.enabled()) analyzeSeedImage();
  };
  reader.readAsDataURL(file);
}

function validateStep1() {
  goto2.disabled = !(state.imageDataUrl && state.itemType && state.itemColor);
}

function showPreview(src) {
  // The file input lives OUTSIDE the dropzone, so replacing innerHTML never
  // destroys it — the single click listener on the dropzone keeps working.
  dropzone.classList.add('has-image');
  dropzone.innerHTML = `
    <div class="preview-wrap">
      <img src="${src}" alt="Uploaded item">
      <button class="replace-btn" onclick="event.stopPropagation();resetUpload()">Replace</button>
    </div>
  `;
}

function resetUpload() {
  state.imageDataUrl = null;
  state.imageIsDemo = false;
  state.itemType = '';
  state.itemColor = '';
  state.itemColorName = '';
  goto2.disabled = true;
  document.getElementById('item-details').classList.remove('show');
  document.querySelectorAll('#color-swatches .swatch').forEach(x => x.classList.remove('selected'));
  const itemTypeEl = document.getElementById('item-type');
  if (itemTypeEl) itemTypeEl.value = '';
  const banner = document.getElementById('detect-banner');
  if (banner) banner.style.display = 'none';
  fileInput.value = '';
  dropzone.classList.remove('has-image');
  dropzone.innerHTML = `
    <div class="dropzone-content">
      <div class="dropzone-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
      </div>
      <p><strong>Click to upload</strong> or drag and drop</p>
      <small>PNG, JPG up to 10MB · Best with plain background</small>
    </div>
  `;
}

function useDemo() {
  // Inline SVG of a stylized sneaker — works without external assets
  const demoSneaker = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280">
      <rect width="400" height="280" fill="#f5f3ee"/>
      <g transform="translate(40,80)">
        <path d="M10 140 Q 8 90 60 80 L 130 70 Q 170 60 200 80 L 280 100 Q 320 110 320 140 L 320 150 Q 320 165 305 165 L 25 165 Q 10 165 10 150 Z" fill="#1a1a1a"/>
        <path d="M30 145 L 310 145 L 310 158 L 30 158 Z" fill="#ffffff" stroke="#1a1a1a" stroke-width="1"/>
        <circle cx="55" cy="151" r="2" fill="#1a1a1a"/>
        <circle cx="85" cy="151" r="2" fill="#1a1a1a"/>
        <circle cx="115" cy="151" r="2" fill="#1a1a1a"/>
        <circle cx="145" cy="151" r="2" fill="#1a1a1a"/>
        <path d="M60 80 Q 80 50 140 55 L 210 65" stroke="#c4632d" stroke-width="3" fill="none"/>
        <path d="M80 100 L 90 75 M105 95 L 115 70 M130 92 L 140 67 M155 93 L 165 68 M180 95 L 190 70" stroke="#ffffff" stroke-width="2"/>
        <ellipse cx="270" cy="100" rx="35" ry="20" fill="#c4632d" opacity="0.85"/>
      </g>
      <text x="200" y="250" font-family="Inter" font-size="11" fill="#9a9a9a" text-anchor="middle" letter-spacing="2">SAMPLE · BLACK LEATHER LOW-TOP</text>
    </svg>
  `)}`;
  state.imageDataUrl = demoSneaker;
  state.imageIsDemo = true;
  state.itemType = 'sneakers';
  state.itemColor = '#0a0a0a';
  state.itemColorName = 'Black';
  showPreview(demoSneaker);
  document.getElementById('item-details').classList.add('show');
  document.getElementById('item-type').value = 'sneakers';
  document.querySelector('.swatch[data-color="#0a0a0a"]').classList.add('selected');
  validateStep1();
  showToast("Loaded a sample item");
}

// Wire item type
document.getElementById('item-type').addEventListener('change', e => {
  state.itemType = e.target.value;
  validateStep1();
});

// Wire color swatches
document.querySelectorAll('#color-swatches .swatch').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('#color-swatches .swatch').forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');
    state.itemColor = s.dataset.color;
    state.itemColorName = s.dataset.name;
    validateStep1();
  });
});

goto2.addEventListener('click', () => goTo(2));

/* =======================================================
   STEP 2: VIBE
   ======================================================= */
const vibeGrid = document.getElementById('vibe-grid');
const goto3 = document.getElementById('goto-3');
const customVibeInput = document.getElementById('custom-vibe');

vibeGrid.querySelectorAll('.vibe-card').forEach(card => {
  card.addEventListener('click', () => {
    vibeGrid.querySelectorAll('.vibe-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.vibe = card.dataset.vibe;
    state.customVibe = '';
    customVibeInput.value = '';
    goto3.disabled = false;
  });
});

customVibeInput.addEventListener('input', e => {
  state.customVibe = e.target.value.trim();
  if (state.customVibe.length > 2) {
    vibeGrid.querySelectorAll('.vibe-card').forEach(c => c.classList.remove('selected'));
    state.vibe = state.customVibe;
    goto3.disabled = false;
  } else if (!vibeGrid.querySelector('.selected')) {
    goto3.disabled = true;
  }
});

goto3.addEventListener('click', () => goTo(3));

/* =======================================================
   STEP 3: GENDER + BODY TYPE
   ======================================================= */
const bodyTypesByGender = {
  'Men': [
    { type: 'Athletic',    desc: 'Broad shoulders, V-shape' },
    { type: 'Slim',        desc: 'Narrow, lean build' },
    { type: 'Rectangular', desc: 'Straight, balanced' },
    { type: 'Stocky',      desc: 'Compact, muscular' },
    { type: 'Tall & Lean', desc: 'Long-limbed' },
    { type: 'Round',       desc: 'Fuller midsection' }
  ],
  'Women': [
    { type: 'Hourglass',         desc: 'Defined waist, balanced' },
    { type: 'Pear',              desc: 'Narrower shoulders, fuller hips' },
    { type: 'Apple',             desc: 'Fuller midsection' },
    { type: 'Rectangle',         desc: 'Straight, balanced' },
    { type: 'Inverted Triangle', desc: 'Broader shoulders, narrower hips' },
    { type: 'Tall & Lean',       desc: 'Long-limbed' }
  ],
  'Non-binary': [
    { type: 'Athletic',    desc: 'Broader shoulders, V-shape' },
    { type: 'Slim',        desc: 'Narrow, lean build' },
    { type: 'Rectangular', desc: 'Straight, balanced' },
    { type: 'Curvy',       desc: 'Defined waist' },
    { type: 'Stocky',      desc: 'Compact, muscular' },
    { type: 'Tall & Lean', desc: 'Long-limbed' }
  ]
};

function renderBodyTypes(gender) {
  const container = document.getElementById('body-types');
  container.innerHTML = '';
  const list = bodyTypesByGender[gender] || bodyTypesByGender['Non-binary'];
  list.forEach(bt => {
    const el = document.createElement('div');
    el.className = 'body-type';
    el.dataset.type = bt.type;
    el.innerHTML = `<div class="bt-name">${bt.type}</div><div class="bt-desc">${bt.desc}</div>`;
    el.addEventListener('click', () => {
      container.querySelectorAll('.body-type').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      state.bodyType = bt.type;
    });
    container.appendChild(el);
  });
  state.bodyType = null;
}

document.querySelectorAll('.gender-opt').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.gender-opt').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
    state.gender = b.dataset.gender;
    renderBodyTypes(state.gender);
  });
});

// Default: render Men options + pre-select gender
document.querySelector('.gender-opt[data-gender="Men"]').classList.add('selected');
state.gender = 'Men';
renderBodyTypes('Men');
// Pre-select first body type
setTimeout(() => {
  const first = document.querySelector('#body-types .body-type');
  if (first) { first.classList.add('selected'); state.bodyType = first.dataset.type; }
}, 0);

/* =======================================================
   STEP 4: RUN STYLIST (mocked AI)
   ======================================================= */
const loaderStatus = document.getElementById('loader-status');
const loaderMessages = [
  "Analyzing color palette and texture...",
  "Identifying garment type and silhouette...",
  "Matching aesthetic across 180+ retailers...",
  "Composing complementary pieces...",
  "Calibrating sizing across brands...",
  "Curating your final look..."
];

function fadeLoaderStatus(msg) {
  loaderStatus.style.opacity = 0;
  setTimeout(() => {
    loaderStatus.textContent = msg;
    loaderStatus.style.opacity = 1;
  }, 200);
}

function runStylist() {
  // Fresh seed for this composition so the result feels new
  state.reshuffleSeed = Math.floor(Math.random() * 1000000) + Date.now() % 100000;
  goTo(4);
  let i = 0;
  loaderStatus.textContent = loaderMessages[0];

  if (AI.enabled()) {
    // Real AI: cycle loader messages until Claude responds
    AI.history = [];
    clearChatLog();
    const interval = setInterval(() => {
      i = (i + 1) % loaderMessages.length;
      fadeLoaderStatus(loaderMessages[i]);
    }, 2200);
    aiStyle(null).then(data => {
      clearInterval(interval);
      renderResults(aiProductsFrom(data), esc(data.summary || `A real-product look composed around your ${state.itemColorName} ${itemTypeLabel[state.itemType] || 'piece'}.`), { ai: true });
      if (data.reply) appendChat('stylist', data.reply);
    }).catch(err => {
      clearInterval(interval);
      showToast(`AI styling failed (${err.message}) — using built-in engine`);
      showResults();
    });
    return;
  }

  // Built-in engine: timed mock loader
  const interval = setInterval(() => {
    i++;
    if (i < loaderMessages.length) {
      fadeLoaderStatus(loaderMessages[i]);
    } else {
      clearInterval(interval);
      setTimeout(showResults, 500);
    }
  }, 750);
}

/* =======================================================
   STEP 5: RESULTS (curated mock recommendations)
   ======================================================= */
const vibeData = {
  'Street Casual':  { palette: ['#1a1a1a','#e8e2d4','#6b5b4a'], silhouette: 'oversized', tone: 'relaxed and rooted in skate / hip-hop lineage' },
  'Business Casual':{ palette: ['#2a2f3a','#d8cfc1','#5d4d3a'], silhouette: 'tailored',  tone: 'polished without being stiff' },
  'Y2K':            { palette: ['#c5e3f0','#e8a4c4','#d4d4d4'], silhouette: 'cropped+baggy', tone: 'playful, glossy, nostalgic' },
  'Techwear':       { palette: ['#0a0a0a','#1f1f1f','#4a4a4a'], silhouette: 'tapered',  tone: 'functional and futuristic' },
  'Date Night':     { palette: ['#3a1f1f','#1a1a1a','#8b6f47'], silhouette: 'fitted',   tone: 'considered, with a hint of sharpness' },
  'Old Money':      { palette: ['#e8dcc4','#5d4d3a','#2a2520'], silhouette: 'classic',  tone: 'restrained, heritage-driven' },
  'Minimalist':     { palette: ['#1a1a1a','#ffffff','#d4d4d4'], silhouette: 'clean',    tone: 'one color story, nothing extra' },
  'Vintage Americana':{ palette: ['#3a4a6b','#8b5a3c','#d4c4a8'], silhouette: 'workwear', tone: 'denim-rooted, broken-in, warm' }
};

function getVibeProfile() {
  if (vibeData[state.vibe]) return { name: state.vibe, ...vibeData[state.vibe] };
  return { name: state.vibe, palette: ['#1a1a1a','#c4632d','#e8e2d4'], silhouette: 'balanced', tone: 'a custom-curated mood: ' + state.vibe };
}

/* Helpers */
function seededRand(seed) {
  // Mulberry32 — small deterministic PRNG so reshuffle uses state.reshuffleSeed
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// Budget bands -> [min, max]
const budgetBand = {
  'Under $50': [0, 50],
  '$50 – $150': [40, 200],
  '$150 – $400': [120, 500],
  '$400+': [350, 100000],
  'No budget': [0, 100000]
};

// Color harmony — given a seed color, return complementary palette colors that work for this vibe
const colorFamilies = {
  '#0a0a0a': 'black', '#ffffff': 'white', '#ebe0ca': 'cream',
  '#8b8b8b': 'grey', '#1f2a44': 'navy', '#c4a574': 'tan',
  '#5d3a1f': 'brown', '#4a5240': 'olive', '#a83a2c': 'red',
  '#5a1f2a': 'burgundy', '#e8a4c4': 'pink', '#e8c84a': 'yellow',
  '#3a6ba8': 'blue', '#2a5a3a': 'green', '#c4632d': 'orange', '#7a4ea8': 'purple'
};
// Which item-colors play nicely with a given seed-color (curated)
const colorHarmony = {
  black:   ['black','white','cream','grey','tan','brown','olive','burgundy'],
  white:   ['white','cream','black','navy','tan','olive','blue','burgundy','green'],
  cream:   ['cream','tan','brown','olive','black','burgundy','navy'],
  grey:    ['grey','black','white','navy','cream','burgundy'],
  navy:    ['navy','cream','white','tan','brown','grey','burgundy'],
  tan:     ['tan','cream','brown','olive','white','navy','black'],
  brown:   ['brown','cream','tan','olive','navy','white'],
  olive:   ['olive','cream','tan','brown','black','white','burgundy'],
  red:     ['red','black','white','cream','navy','grey'],
  burgundy:['burgundy','cream','navy','tan','grey','black','olive'],
  pink:    ['pink','white','cream','black','grey','navy'],
  yellow:  ['yellow','white','black','navy','grey','cream'],
  blue:    ['blue','white','cream','tan','grey','navy'],
  green:   ['green','cream','tan','brown','white','navy'],
  orange:  ['orange','cream','navy','black','white','brown','olive'],
  purple:  ['purple','black','grey','cream','white','navy']
};

// Each item: { cat (outfit category), g (M/W/U), name, brand, price$, hex, family (color name), p (price num), src }
// cat values: Top, Outer, Bottom, Shoe, Bag, Acc, Onepiece
const C = {
  'Street Casual': [
    // Tops
    { cat:'Top', g:'M', brand:'Stüssy', name:'Pigment-dyed boxy tee, washed black', p:95, src:'stussy.com', hex:'#1a1a1a', family:'black' },
    { cat:'Top', g:'M', brand:'Aimé Leon Dore', name:'Logo crew tee, cream', p:90, src:'aimeleondore.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'U', brand:'Carhartt WIP', name:'Chase sweatshirt, dark navy', p:110, src:'carhartt-wip.com', hex:'#1f2a44', family:'navy' },
    { cat:'Top', g:'U', brand:'Supreme', name:'Box logo hooded sweatshirt, ash grey', p:168, src:'supremenewyork.com', hex:'#8b8b8b', family:'grey' },
    { cat:'Top', g:'W', brand:'Brain Dead', name:'Logo tee, off-white', p:65, src:'wearebraindead.com', hex:'#f5f3ee', family:'white' },
    { cat:'Top', g:'W', brand:'Sporty & Rich', name:'Logo crewneck, ivory', p:140, src:'sportyandrich.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'M', brand:'Palace', name:'Tri-ferg longsleeve, olive', p:75, src:'palaceskateboards.com', hex:'#4a5240', family:'olive' },
    { cat:'Top', g:'U', brand:'Uniqlo', name:'Heavyweight crew tee, sand', p:25, src:'uniqlo.com', hex:'#c4a574', family:'tan' },
    // Bottoms
    { cat:'Bottom', g:'M', brand:'Carhartt WIP', name:'Single Knee pant, hamilton brown', p:148, src:'carhartt-wip.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Bottom', g:'U', brand:'Stussy', name:'Big OL\' jean, washed indigo', p:160, src:'stussy.com', hex:'#3a6ba8', family:'blue' },
    { cat:'Bottom', g:'M', brand:'Dickies', name:'Original 874 work pant, black', p:42, src:'dickies.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bottom', g:'W', brand:'Levi\'s', name:'Baggy dad jean, light wash', p:98, src:'levi.com', hex:'#8ba0c4', family:'blue' },
    { cat:'Bottom', g:'U', brand:'Polar Skate', name:'\'93 work pant, khaki', p:130, src:'polarskateco.com', hex:'#c4a574', family:'tan' },
    { cat:'Bottom', g:'W', brand:'Brandy Melville', name:'Cargo skirt, olive', p:48, src:'brandymelville.com', hex:'#4a5240', family:'olive' },
    // Outerwear
    { cat:'Outer', g:'U', brand:'Patta', name:'Cropped harrington jacket, bone', p:280, src:'patta.nl', hex:'#ebe0ca', family:'cream' },
    { cat:'Outer', g:'M', brand:'Stüssy', name:'8-ball fleece jacket, brown', p:240, src:'stussy.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Outer', g:'U', brand:'The North Face', name:'Mountain Light jacket, summit gold', p:330, src:'thenorthface.com', hex:'#e8c84a', family:'yellow' },
    { cat:'Outer', g:'W', brand:'Carhartt WIP', name:'Detroit jacket, hamilton brown', p:298, src:'carhartt-wip.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Outer', g:'U', brand:'Champion', name:'Reverse weave zip hoodie, black', p:80, src:'champion.com', hex:'#0a0a0a', family:'black' },
    // Shoes
    { cat:'Shoe', g:'U', brand:'New Balance', name:'990v6, grey/silver', p:200, src:'newbalance.com', hex:'#8b8b8b', family:'grey' },
    { cat:'Shoe', g:'U', brand:'Nike', name:'Dunk Low, panda', p:115, src:'nike.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Adidas', name:'Samba OG, cloud white', p:100, src:'adidas.com', hex:'#ffffff', family:'white' },
    { cat:'Shoe', g:'U', brand:'Vans', name:'Old Skool, black/white', p:75, src:'vans.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Salomon', name:'XT-6, magnet/black', p:200, src:'salomon.com', hex:'#8b8b8b', family:'grey' },
    // Bags
    { cat:'Bag', g:'U', brand:'Eastpak', name:'Padded Pak\'r backpack, black', p:70, src:'eastpak.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'U', brand:'Carhartt WIP', name:'Essentials sling bag, hamilton brown', p:55, src:'carhartt-wip.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Bag', g:'U', brand:'Bagjack', name:'NXL Daypack, black', p:240, src:'bagjack.com', hex:'#0a0a0a', family:'black' },
    // Accessories
    { cat:'Acc', g:'U', brand:'New Era', name:'59FIFTY low-profile cap, black', p:45, src:'neweracap.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'Nike', name:'Everyday crew sock 3-pack, off-white', p:22, src:'nike.com', hex:'#f5f0e6', family:'white' },
    { cat:'Acc', g:'U', brand:'Yumes', name:'Wire-frame sunglasses, black', p:95, src:'yumesonline.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'Stüssy', name:'Stock low-pro cap, washed olive', p:45, src:'stussy.com', hex:'#4a5240', family:'olive' }
  ],

  'Business Casual': [
    { cat:'Top', g:'M', brand:'Uniqlo +J', name:'Supima cotton oxford, white', p:60, src:'uniqlo.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'M', brand:'COS', name:'Merino crew, navy', p:120, src:'cos.com', hex:'#1f2a44', family:'navy' },
    { cat:'Top', g:'M', brand:'Brooks Brothers', name:'Slim-fit pinpoint oxford, blue', p:140, src:'brooksbrothers.com', hex:'#8ba0c4', family:'blue' },
    { cat:'Top', g:'W', brand:'Theory', name:'Silk crepe blouse, ivory', p:295, src:'theory.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'W', brand:'COS', name:'Wool fine-knit, camel', p:135, src:'cos.com', hex:'#c4a574', family:'tan' },
    { cat:'Top', g:'M', brand:'J.Crew', name:'Secret Wash oxford, charcoal stripe', p:98, src:'jcrew.com', hex:'#5a5a5a', family:'grey' },
    { cat:'Top', g:'W', brand:'Everlane', name:'Silk relaxed shirt, bone', p:128, src:'everlane.com', hex:'#ebe0ca', family:'cream' },
    // Bottoms
    { cat:'Bottom', g:'M', brand:'A.P.C.', name:'Sandro chino, stone', p:235, src:'apc-us.com', hex:'#c4a574', family:'tan' },
    { cat:'Bottom', g:'M', brand:'Drake\'s', name:'Flat-front trouser, navy fresco', p:340, src:'drakes.com', hex:'#1f2a44', family:'navy' },
    { cat:'Bottom', g:'W', brand:'Theory', name:'Treeca cropped trouser, black', p:295, src:'theory.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bottom', g:'W', brand:'Toteme', name:'Tailored wide-leg, taupe', p:480, src:'toteme-studio.com', hex:'#c4a574', family:'tan' },
    { cat:'Bottom', g:'M', brand:'Banana Republic', name:'Italian wool trouser, charcoal', p:165, src:'bananarepublic.com', hex:'#5a5a5a', family:'grey' },
    // Outer
    { cat:'Outer', g:'M', brand:'Suitsupply', name:'Havana unstructured blazer, navy', p:499, src:'suitsupply.com', hex:'#1f2a44', family:'navy' },
    { cat:'Outer', g:'M', brand:'A.P.C.', name:'Mac coat, beige', p:680, src:'apc-us.com', hex:'#c4a574', family:'tan' },
    { cat:'Outer', g:'W', brand:'Max Mara', name:'Teddy bear coat, camel', p:3490, src:'maxmara.com', hex:'#c4a574', family:'tan' },
    { cat:'Outer', g:'W', brand:'COS', name:'Wool blazer, oat', p:290, src:'cos.com', hex:'#ebe0ca', family:'cream' },
    // Shoes
    { cat:'Shoe', g:'M', brand:'GH Bass', name:'Larson Weejun loafer, oxblood', p:175, src:'ghbass.com', hex:'#5a1f2a', family:'burgundy' },
    { cat:'Shoe', g:'M', brand:'Allen Edmonds', name:'Park Avenue oxford, black', p:435, src:'allenedmonds.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'W', brand:'Aeyde', name:'Mara mule, ivory leather', p:425, src:'aeyde.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Shoe', g:'W', brand:'Sarah Flint', name:'Perfect pump, black calf', p:425, src:'sarahflint.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Common Projects', name:'Achilles low, white', p:450, src:'commonprojects.com', hex:'#ffffff', family:'white' },
    // Bags
    { cat:'Bag', g:'M', brand:'Bellroy', name:'Slim work folio, black', p:179, src:'bellroy.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'W', brand:'Cuyana', name:'Classic structured tote, caramel', p:298, src:'cuyana.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Bag', g:'U', brand:'Mansur Gavriel', name:'Soft tote, cream', p:495, src:'mansurgavriel.com', hex:'#ebe0ca', family:'cream' },
    // Acc
    { cat:'Acc', g:'M', brand:'Anderson\'s', name:'Woven leather belt, brown', p:165, src:'mrporter.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Acc', g:'M', brand:'Timex', name:'Marlin 34mm hand-wound', p:259, src:'timex.com', hex:'#c4a574', family:'tan' },
    { cat:'Acc', g:'U', brand:'Warby Parker', name:'Haskell glasses, crystal', p:195, src:'warbyparker.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Acc', g:'W', brand:'Mejuri', name:'Bold hoops, gold vermeil', p:75, src:'mejuri.com', hex:'#c4a574', family:'tan' }
  ],

  'Y2K': [
    { cat:'Top', g:'W', brand:'Diesel', name:'Cropped baby tee, baby blue', p:95, src:'diesel.com', hex:'#a4c4e0', family:'blue' },
    { cat:'Top', g:'W', brand:'Heaven by MM', name:'Mesh baby tee, pink', p:140, src:'mmparis.com', hex:'#e8a4c4', family:'pink' },
    { cat:'Top', g:'W', brand:'Juicy Couture', name:'Velour zip-up hoodie, pink', p:128, src:'juicycouture.com', hex:'#e8a4c4', family:'pink' },
    { cat:'Top', g:'U', brand:'Ed Hardy', name:'Tiger graphic tee, white', p:80, src:'edhardy.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'M', brand:'Acne Studios', name:'Distressed tee, washed', p:180, src:'acnestudios.com', hex:'#e0d8d4', family:'cream' },
    { cat:'Top', g:'W', brand:'Miaou', name:'Ribbed tank, baby blue', p:115, src:'miaou.com', hex:'#a4c4e0', family:'blue' },
    // Bottoms
    { cat:'Bottom', g:'W', brand:'Levi\'s SilverTab', name:'Low-rise loose carpenter jean', p:98, src:'levi.com', hex:'#7a8da6', family:'blue' },
    { cat:'Bottom', g:'W', brand:'Diesel', name:'Low-rise bootcut jean, vintage wash', p:248, src:'diesel.com', hex:'#7a8da6', family:'blue' },
    { cat:'Bottom', g:'W', brand:'Miaou', name:'Lex denim micro-mini', p:225, src:'miaou.com', hex:'#3a6ba8', family:'blue' },
    { cat:'Bottom', g:'M', brand:'Evisu', name:'Daicock cargo, dark wash', p:265, src:'evisu.com', hex:'#3a4a6b', family:'navy' },
    { cat:'Bottom', g:'U', brand:'JNCO', name:'Reissue baggy jean, distressed', p:120, src:'jnco.com', hex:'#7a8da6', family:'blue' },
    // Outer
    { cat:'Outer', g:'W', brand:'Von Dutch', name:'Logo trucker jacket, white', p:195, src:'vondutch.com', hex:'#ffffff', family:'white' },
    { cat:'Outer', g:'W', brand:'Heaven by MM', name:'Faux-fur cropped jacket, baby pink', p:340, src:'mmparis.com', hex:'#e8a4c4', family:'pink' },
    { cat:'Outer', g:'U', brand:'Adidas Originals', name:'Track jacket, chrome silver', p:90, src:'adidas.com', hex:'#c4c4c4', family:'grey' },
    // Shoes
    { cat:'Shoe', g:'U', brand:'Asics', name:'Gel-Kayano 14, glacier grey', p:160, src:'asics.com', hex:'#c4d4e0', family:'grey' },
    { cat:'Shoe', g:'W', brand:'MSCHF', name:'Big Red Boot, red', p:350, src:'mschf.com', hex:'#a83a2c', family:'red' },
    { cat:'Shoe', g:'W', brand:'Sketchers', name:'Mary Jane platform, white', p:90, src:'skechers.com', hex:'#ffffff', family:'white' },
    { cat:'Shoe', g:'U', brand:'Puma', name:'Mostro low, silver', p:120, src:'puma.com', hex:'#c4c4c4', family:'grey' },
    // Bag
    { cat:'Bag', g:'W', brand:'Coach', name:'Tabby shoulder, signature C', p:295, src:'coach.com', hex:'#c4a574', family:'tan' },
    { cat:'Bag', g:'W', brand:'Vivienne Westwood', name:'Yasmine bag, baby blue', p:340, src:'viviennewestwood.com', hex:'#a4c4e0', family:'blue' },
    { cat:'Bag', g:'W', brand:'Marc Jacobs', name:'The Tote, pink', p:295, src:'marcjacobs.com', hex:'#e8a4c4', family:'pink' },
    // Acc
    { cat:'Acc', g:'U', brand:'Gentle Monster', name:'Tinted oval shades, pink', p:340, src:'gentlemonster.com', hex:'#e8a4c4', family:'pink' },
    { cat:'Acc', g:'U', brand:'Y/Project', name:'Pearl chain necklace', p:220, src:'y-project.com', hex:'#ebe5d4', family:'cream' },
    { cat:'Acc', g:'W', brand:'Mejuri', name:'Pearl drop earrings, gold', p:175, src:'mejuri.com', hex:'#c4a574', family:'tan' },
    { cat:'Acc', g:'M', brand:'Tom Ford', name:'Chrome buckle belt', p:420, src:'tomford.com', hex:'#c4c4c4', family:'grey' }
  ],

  'Techwear': [
    { cat:'Top', g:'U', brand:'Snow Peak', name:'Wool merino long-sleeve, black', p:135, src:'snowpeak.com', hex:'#0a0a0a', family:'black' },
    { cat:'Top', g:'U', brand:'Veilance', name:'Frame merino crew, graphite', p:280, src:'veilance.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Top', g:'U', brand:'Y-3', name:'Logo crewneck, black', p:280, src:'adidas.com', hex:'#0a0a0a', family:'black' },
    { cat:'Top', g:'U', brand:'Nike ACG', name:'Therma-FIT ADV crew, anthracite', p:90, src:'nike.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Top', g:'U', brand:'Goldwin', name:'Pertex midlayer, black', p:380, src:'goldwin.co.jp', hex:'#0a0a0a', family:'black' },
    // Bottom
    { cat:'Bottom', g:'U', brand:'Stone Island Shadow', name:'Tapered cargo, jet black', p:520, src:'stoneisland.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bottom', g:'U', brand:'Veilance', name:'Align MX pant, graphite', p:450, src:'veilance.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Bottom', g:'U', brand:'Nike ACG', name:'Smith Summit cargo pant, black', p:160, src:'nike.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bottom', g:'U', brand:'And Wander', name:'Nylon climbing pant, black', p:340, src:'andwander.com', hex:'#0a0a0a', family:'black' },
    // Outer
    { cat:'Outer', g:'U', brand:'Acronym', name:'GORE-TEX 3L hooded shell, black', p:1200, src:'acrnm.com', hex:'#0a0a0a', family:'black' },
    { cat:'Outer', g:'U', brand:'Arc\'teryx', name:'Beta LT jacket, black', p:450, src:'arcteryx.com', hex:'#0a0a0a', family:'black' },
    { cat:'Outer', g:'U', brand:'Veilance', name:'Spere LT shell, graphite', p:1100, src:'veilance.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Outer', g:'U', brand:'The North Face', name:'Summit FUTURELIGHT, black', p:450, src:'thenorthface.com', hex:'#0a0a0a', family:'black' },
    // Shoe
    { cat:'Shoe', g:'U', brand:'Salomon', name:'XT-6 GTX, black/phantom', p:220, src:'salomon.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Hoka', name:'Tor Ultra Hi, black', p:240, src:'hoka.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Adidas Y-3', name:'Qasa high, black', p:380, src:'adidas.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'U', brand:'Norda', name:'001 trail runner, stealth', p:285, src:'norda.com', hex:'#3a3a3a', family:'grey' },
    // Bag
    { cat:'Bag', g:'U', brand:'Aer', name:'Day Pack 3, black', p:169, src:'aersf.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'U', brand:'Goldwin', name:'Sling bag, black', p:155, src:'goldwin.co.jp', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'U', brand:'Mystery Ranch', name:'2-Day Assault pack, black', p:280, src:'mysteryranch.com', hex:'#0a0a0a', family:'black' },
    // Acc
    { cat:'Acc', g:'U', brand:'Veilance', name:'Stealth cap, graphite', p:95, src:'veilance.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Acc', g:'U', brand:'Alyx', name:'Rollercoaster buckle belt', p:210, src:'alyxstudio.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'District Vision', name:'Keiichi sunglasses, black', p:225, src:'districtvision.com', hex:'#0a0a0a', family:'black' }
  ],

  'Date Night': [
    { cat:'Top', g:'M', brand:'Saturdays NYC', name:'Camp-collar silk shirt, oxblood', p:195, src:'saturdaysnyc.com', hex:'#5a1f2a', family:'burgundy' },
    { cat:'Top', g:'M', brand:'Sandro', name:'Open-knit polo, black', p:215, src:'sandro-paris.com', hex:'#0a0a0a', family:'black' },
    { cat:'Top', g:'W', brand:'Reformation', name:'Cropped silk camisole, cream', p:148, src:'thereformation.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'W', brand:'Khaite', name:'Ribbed cashmere shell, black', p:680, src:'khaite.com', hex:'#0a0a0a', family:'black' },
    { cat:'Top', g:'M', brand:'COS', name:'Fine-gauge knit polo, charcoal', p:135, src:'cos.com', hex:'#3a3a3a', family:'grey' },
    // Bottom
    { cat:'Bottom', g:'M', brand:'Officine Générale', name:'Pleated wool trouser, charcoal', p:345, src:'officinegenerale.com', hex:'#3a3a3a', family:'grey' },
    { cat:'Bottom', g:'M', brand:'Drake\'s', name:'Pleated tobacco linen, brown', p:380, src:'drakes.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Bottom', g:'W', brand:'Reformation', name:'Cynthia high-rise jean, black wash', p:148, src:'thereformation.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bottom', g:'W', brand:'House of CB', name:'Satin slip skirt, oxblood', p:138, src:'houseofcb.com', hex:'#5a1f2a', family:'burgundy' },
    { cat:'Bottom', g:'M', brand:'Acne Studios', name:'Loose-fit jean, washed black', p:300, src:'acnestudios.com', hex:'#1a1a1a', family:'black' },
    // Onepiece
    { cat:'Onepiece', g:'W', brand:'Reformation', name:'Tagliatelle silk midi, black', p:248, src:'thereformation.com', hex:'#0a0a0a', family:'black' },
    { cat:'Onepiece', g:'W', brand:'Saint Laurent', name:'Slip dress, midnight', p:1990, src:'ysl.com', hex:'#1f2a44', family:'navy' },
    // Outer
    { cat:'Outer', g:'M', brand:'Schott NYC', name:'Perfecto leather jacket, black', p:850, src:'schottnyc.com', hex:'#0a0a0a', family:'black' },
    { cat:'Outer', g:'W', brand:'Saks Potts', name:'Fur-collar coat, camel', p:1290, src:'sakspotts.com', hex:'#c4a574', family:'tan' },
    // Shoe
    { cat:'Shoe', g:'M', brand:'R.M. Williams', name:'Comfort Craftsman boot, chestnut', p:595, src:'rmwilliams.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Shoe', g:'M', brand:'Crockett & Jones', name:'Cavendish loafer, black', p:625, src:'crockettandjones.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'W', brand:'Manolo Blahnik', name:'Hangisi pump, black satin', p:1095, src:'manoloblahnik.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'W', brand:'Aquazzura', name:'Love Affair pump, burgundy', p:850, src:'aquazzura.com', hex:'#5a1f2a', family:'burgundy' },
    // Bag
    { cat:'Bag', g:'W', brand:'Bottega Veneta', name:'Mini Jodie, black intrecciato', p:2900, src:'bottegaveneta.com', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'W', brand:'YSL', name:'Le 5 à 7 hobo, smooth leather', p:2350, src:'ysl.com', hex:'#0a0a0a', family:'black' },
    // Acc
    { cat:'Acc', g:'M', brand:'Cartier', name:'Tank Must, small', p:2920, src:'cartier.com', hex:'#c4a574', family:'tan' },
    { cat:'Acc', g:'M', brand:'Maison Margiela', name:'Slim leather belt, black', p:280, src:'maisonmargiela.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'Le Labo', name:'Santal 33, 50ml', p:210, src:'lelabofragrances.com', hex:'#c4a574', family:'tan' },
    { cat:'Acc', g:'W', brand:'Jennifer Fisher', name:'Lilly hoop, gold', p:495, src:'jenniferfisherjewelry.com', hex:'#c4a574', family:'tan' }
  ],

  'Old Money': [
    { cat:'Top', g:'M', brand:'Drake\'s', name:'Linen button-down, white', p:245, src:'drakes.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'M', brand:'Loro Piana', name:'Cashmere quarter-zip, ivory', p:1850, src:'loropiana.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'M', brand:'Polo Ralph Lauren', name:'Custom-fit polo, white', p:110, src:'ralphlauren.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'W', brand:'The Row', name:'Sabrina cashmere crew, cream', p:1190, src:'therow.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'W', brand:'Loro Piana', name:'Roma cashmere polo, ivory', p:1325, src:'loropiana.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'M', brand:'Sunspel', name:'Riviera polo, navy', p:185, src:'sunspel.com', hex:'#1f2a44', family:'navy' },
    // Bottom
    { cat:'Bottom', g:'M', brand:'Brunello Cucinelli', name:'Pleated linen trouser, sand', p:895, src:'brunellocucinelli.com', hex:'#c4a574', family:'tan' },
    { cat:'Bottom', g:'M', brand:'Drake\'s', name:'Game trouser, oatmeal flannel', p:495, src:'drakes.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Bottom', g:'W', brand:'The Row', name:'Marlon wide-leg trouser, cream', p:990, src:'therow.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Bottom', g:'W', brand:'Khaite', name:'Magdalena jean, vintage', p:480, src:'khaite.com', hex:'#7a8da6', family:'blue' },
    { cat:'Bottom', g:'M', brand:'Polo Ralph Lauren', name:'Stretch chino, khaki', p:148, src:'ralphlauren.com', hex:'#c4a574', family:'tan' },
    // Onepiece
    { cat:'Onepiece', g:'W', brand:'Ralph Lauren Collection', name:'Cashmere midi dress, ivory', p:2790, src:'ralphlauren.com', hex:'#ebe0ca', family:'cream' },
    // Outer
    { cat:'Outer', g:'M', brand:'Polo Ralph Lauren', name:'Polo Coat, camel', p:2495, src:'ralphlauren.com', hex:'#c4a574', family:'tan' },
    { cat:'Outer', g:'M', brand:'Drake\'s', name:'Games blazer, navy hopsack', p:1295, src:'drakes.com', hex:'#1f2a44', family:'navy' },
    { cat:'Outer', g:'W', brand:'Toteme', name:'Signature coat, camel', p:1190, src:'toteme-studio.com', hex:'#c4a574', family:'tan' },
    // Shoe
    { cat:'Shoe', g:'M', brand:'Belgian Shoes', name:'Mr. Casual loafer, navy', p:540, src:'belgianshoes.com', hex:'#1f2a44', family:'navy' },
    { cat:'Shoe', g:'M', brand:'Edward Green', name:'Piccadilly loafer, antique chestnut', p:1495, src:'edwardgreen.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Shoe', g:'W', brand:'The Row', name:'Canal loafer, black calf', p:1090, src:'therow.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'W', brand:'Tory Burch', name:'Ines mule, cream', p:298, src:'toryburch.com', hex:'#ebe0ca', family:'cream' },
    // Bag
    { cat:'Bag', g:'W', brand:'Hermès', name:'Garden Party 36, beige', p:3450, src:'hermes.com', hex:'#c4a574', family:'tan' },
    { cat:'Bag', g:'M', brand:'Smythson', name:'Panama briefcase, navy', p:1995, src:'smythson.com', hex:'#1f2a44', family:'navy' },
    // Acc
    { cat:'Acc', g:'U', brand:'Persol', name:'649 Original, havana', p:295, src:'persol.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Acc', g:'M', brand:'Hermès', name:'Constance belt, gold buckle', p:1100, src:'hermes.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Acc', g:'M', brand:'Rolex', name:'Datejust 36, oyster steel', p:8500, src:'rolex.com', hex:'#c4c4c4', family:'grey' },
    { cat:'Acc', g:'W', brand:'Cartier', name:'Love bracelet, yellow gold', p:7350, src:'cartier.com', hex:'#c4a574', family:'tan' }
  ],

  'Minimalist': [
    { cat:'Top', g:'M', brand:'Jil Sander', name:'Heavyweight cotton tee, white', p:240, src:'jilsander.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'U', brand:'COS', name:'Heavyweight crew tee, black', p:39, src:'cos.com', hex:'#0a0a0a', family:'black' },
    { cat:'Top', g:'W', brand:'Toteme', name:'Curved-sleeve top, off-white', p:280, src:'toteme-studio.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'M', brand:'Lemaire', name:'Cotton-silk shirt, light grey', p:530, src:'lemaire.fr', hex:'#c4c4c4', family:'grey' },
    { cat:'Top', g:'W', brand:'The Row', name:'Wesler cotton tee, white', p:340, src:'therow.com', hex:'#ffffff', family:'white' },
    { cat:'Top', g:'U', brand:'Uniqlo U', name:'Crewneck sweatshirt, dark grey', p:50, src:'uniqlo.com', hex:'#5a5a5a', family:'grey' },
    // Bottom
    { cat:'Bottom', g:'M', brand:'Lemaire', name:'Easy pants, off-black', p:485, src:'lemaire.fr', hex:'#1a1a1a', family:'black' },
    { cat:'Bottom', g:'W', brand:'Toteme', name:'Straight-leg jean, washed black', p:380, src:'toteme-studio.com', hex:'#1a1a1a', family:'black' },
    { cat:'Bottom', g:'W', brand:'Studio Nicholson', name:'Volume pant, cream', p:480, src:'studionicholson.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Bottom', g:'M', brand:'Studio Nicholson', name:'Sorte trouser, black', p:495, src:'studionicholson.com', hex:'#0a0a0a', family:'black' },
    // Outer
    { cat:'Outer', g:'W', brand:'The Row', name:'Egan wool coat, ivory', p:2890, src:'therow.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Outer', g:'M', brand:'Auralee', name:'Cashmere overcoat, charcoal', p:1850, src:'auralee.jp', hex:'#3a3a3a', family:'grey' },
    { cat:'Outer', g:'U', brand:'COS', name:'Boxy double-breasted blazer, black', p:290, src:'cos.com', hex:'#0a0a0a', family:'black' },
    // Shoe
    { cat:'Shoe', g:'U', brand:'Common Projects', name:'Achilles low, white', p:450, src:'commonprojects.com', hex:'#ffffff', family:'white' },
    { cat:'Shoe', g:'U', brand:'Adidas', name:'Samba OG, black', p:100, src:'adidas.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'W', brand:'The Row', name:'Roma sneaker, black', p:790, src:'therow.com', hex:'#0a0a0a', family:'black' },
    { cat:'Shoe', g:'M', brand:'Margiela', name:'Tabi sneaker, white', p:790, src:'maisonmargiela.com', hex:'#ffffff', family:'white' },
    // Bag
    { cat:'Bag', g:'W', brand:'Toteme', name:'Suede tote, sand', p:890, src:'toteme-studio.com', hex:'#c4a574', family:'tan' },
    { cat:'Bag', g:'U', brand:'Lemaire', name:'Croissant bag, black', p:780, src:'lemaire.fr', hex:'#0a0a0a', family:'black' },
    { cat:'Bag', g:'W', brand:'The Row', name:'Margaux 17, cream calfskin', p:5300, src:'therow.com', hex:'#ebe0ca', family:'cream' },
    // Acc
    { cat:'Acc', g:'U', brand:'Studio Nicholson', name:'Calf belt, black', p:185, src:'studionicholson.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'Mykita', name:'Lite sunglasses, black', p:395, src:'mykita.com', hex:'#0a0a0a', family:'black' },
    { cat:'Acc', g:'U', brand:'Junghans', name:'Max Bill 38mm, white dial', p:790, src:'junghans.de', hex:'#ffffff', family:'white' }
  ],

  'Vintage Americana': [
    { cat:'Top', g:'M', brand:'RRL', name:'Flannel work shirt, faded red', p:295, src:'ralphlauren.com', hex:'#a83a2c', family:'red' },
    { cat:'Top', g:'M', brand:'Buck Mason', name:'Slub crew tee, washed white', p:36, src:'buckmason.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Top', g:'U', brand:'Pendleton', name:'Board shirt, dark navy plaid', p:165, src:'pendleton.com', hex:'#1f2a44', family:'navy' },
    { cat:'Top', g:'U', brand:'Carhartt', name:'Heavyweight pocket tee, brown', p:32, src:'carhartt.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Top', g:'W', brand:'Madewell', name:'Whisper cotton tee, faded red', p:32, src:'madewell.com', hex:'#a83a2c', family:'red' },
    { cat:'Top', g:'W', brand:'RRL', name:'Striped boatneck tee, ivory/navy', p:165, src:'ralphlauren.com', hex:'#1f2a44', family:'navy' },
    // Bottom
    { cat:'Bottom', g:'M', brand:'Levi\'s Vintage', name:'501 1947, rigid raw', p:285, src:'levi.com', hex:'#3a4a6b', family:'blue' },
    { cat:'Bottom', g:'M', brand:'Wrangler', name:'Cowboy cut bootcut jean, prewash', p:48, src:'wrangler.com', hex:'#7a8da6', family:'blue' },
    { cat:'Bottom', g:'W', brand:'Levi\'s', name:'Ribcage straight jean, vintage', p:108, src:'levi.com', hex:'#3a4a6b', family:'blue' },
    { cat:'Bottom', g:'M', brand:'Dickies', name:'Carpenter pant, khaki', p:55, src:'dickies.com', hex:'#c4a574', family:'tan' },
    // Outer
    { cat:'Outer', g:'M', brand:'Filson', name:'Tin cloth cruiser jacket, otter green', p:425, src:'filson.com', hex:'#4a5240', family:'olive' },
    { cat:'Outer', g:'U', brand:'Schott NYC', name:'Waxed Perfecto, brown', p:895, src:'schottnyc.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Outer', g:'M', brand:'RRL', name:'Denim chore coat, faded indigo', p:495, src:'ralphlauren.com', hex:'#3a4a6b', family:'blue' },
    { cat:'Outer', g:'W', brand:'Madewell', name:'Sherpa-lined denim, light wash', p:148, src:'madewell.com', hex:'#7a8da6', family:'blue' },
    // Shoe
    { cat:'Shoe', g:'M', brand:'Red Wing', name:'Iron Ranger, copper rough', p:370, src:'redwingheritage.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Shoe', g:'U', brand:'Converse', name:'Chuck 70, parchment', p:90, src:'converse.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Shoe', g:'M', brand:'Wolverine', name:'1000 Mile boot, chocolate', p:425, src:'wolverine.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Shoe', g:'W', brand:'Frye', name:'Veronica slouch boot, cognac', p:430, src:'thefryecompany.com', hex:'#5d3a1f', family:'brown' },
    // Bag
    { cat:'Bag', g:'U', brand:'Filson', name:'Original briefcase, tan twill', p:295, src:'filson.com', hex:'#c4a574', family:'tan' },
    { cat:'Bag', g:'U', brand:'Tanner Goods', name:'Workman bag, natural', p:485, src:'tannergoods.com', hex:'#c4a574', family:'tan' },
    // Acc
    { cat:'Acc', g:'U', brand:'Stetson', name:'Open Road hat, silverbelly', p:200, src:'stetson.com', hex:'#ebe0ca', family:'cream' },
    { cat:'Acc', g:'U', brand:'Tanner Goods', name:'Standard belt, natural', p:165, src:'tannergoods.com', hex:'#c4a574', family:'tan' },
    { cat:'Acc', g:'U', brand:'Ray-Ban', name:'Wayfarer, tortoise', p:163, src:'ray-ban.com', hex:'#5d3a1f', family:'brown' },
    { cat:'Acc', g:'M', brand:'Hamilton', name:'Khaki Field mechanical, 38mm', p:595, src:'hamiltonwatch.com', hex:'#4a5240', family:'olive' }
  ]
};

// Fallback catalog for custom vibes — the full combined inventory so every
// category (shoes, bags, accessories included) is always available.
const C_DEFAULT = Object.values(C).flat();

// Accessory subtypes — lets an accessory seed (e.g. a hat) still get OTHER accessories
const accSubtypeRe = {
  hat: /cap|hat/i, sunglasses: /sunglass|shades|glasses/i, watch: /watch|datejust|tank must/i,
  jewelry: /necklace|bracelet|hoop|earring|pearl/i, belt: /belt/i, scarf: /scarf/i
};

/* =======================================================
   OUTFIT COMPOSITION ENGINE
   Filters by gender + budget, excludes seed category,
   harmonizes colors with the seed, randomizes selection.
   ======================================================= */
function composeOutfit() {
  const pool = C[state.vibe] || C_DEFAULT;
  const seedCategory = itemTypeCategory[state.itemType] || null;
  const seedColorFamily = colorFamilies[state.itemColor] || 'black';
  const harmony = colorHarmony[seedColorFamily] || [];
  const [minP, maxP] = budgetBand['No budget'];
  const genderFilter = state.gender === 'Women' ? ['W','U'] : (state.gender === 'Men' ? ['M','U'] : ['M','W','U']);

  // Decide which categories make up the outfit
  // If seed is a dress/jumpsuit, skip Bottom + Top
  let needed;
  if (seedCategory === 'Onepiece') {
    needed = ['Outer', 'Shoe', 'Bag', 'Acc'];
  } else if (seedCategory === 'Top') {
    needed = ['Bottom', 'Outer', 'Shoe', 'Bag', 'Acc'];
  } else if (seedCategory === 'Bottom') {
    needed = ['Top', 'Outer', 'Shoe', 'Bag', 'Acc'];
  } else if (seedCategory === 'Outer') {
    needed = ['Top', 'Bottom', 'Shoe', 'Bag', 'Acc'];
  } else if (seedCategory === 'Shoe') {
    needed = ['Top', 'Bottom', 'Outer', 'Bag', 'Acc'];
  } else if (seedCategory === 'Bag') {
    needed = ['Top', 'Bottom', 'Outer', 'Shoe', 'Acc'];
  } else if (seedCategory === 'Acc') {
    needed = ['Top', 'Bottom', 'Outer', 'Shoe', 'Bag', 'Acc'];
  } else {
    needed = ['Top', 'Bottom', 'Outer', 'Shoe', 'Bag', 'Acc'];
  }

  // Occasionally build the look around a one-piece for women when both
  // top and bottom are needed (dresses/jumpsuits were previously unreachable)
  if (state.gender === 'Women' && needed.includes('Top') && needed.includes('Bottom')
      && pool.some(p => p.cat === 'Onepiece' && genderFilter.includes(p.g))
      && seededRand(state.reshuffleSeed + 991) < 0.35) {
    needed = ['Onepiece', ...needed.filter(c => c !== 'Top' && c !== 'Bottom')];
  }

  // Get all candidates per category that pass gender + budget filters
  const candidatesByCat = {};
  needed.forEach(cat => {
    let cands = pool.filter(p =>
      p.cat === cat &&
      genderFilter.includes(p.g) &&
      p.p >= minP && p.p <= maxP
    );
    // If the seed itself is an accessory, don't recommend the same subtype
    if (cat === 'Acc' && seedCategory === 'Acc' && accSubtypeRe[state.itemType]) {
      cands = cands.filter(p => !accSubtypeRe[state.itemType].test(p.name));
    }
    // Prefer color-harmonious items, but fall back to all if none match
    const harmCands = cands.filter(p => harmony.includes(p.family));
    if (harmCands.length >= 1) cands = harmCands;
    // If budget killed all options, ignore budget for this cat
    if (cands.length === 0) {
      cands = pool.filter(p => p.cat === cat && genderFilter.includes(p.g));
    }
    candidatesByCat[cat] = cands;
  });

  // For each category, pick one item using the seed
  const seed = state.reshuffleSeed * 9301 + 49297;
  const result = [];
  let offset = 0;
  needed.forEach((cat, i) => {
    const cands = candidatesByCat[cat];
    if (cands && cands.length) {
      const pickIdx = Math.floor(seededRand(seed + i * 7 + offset) * cands.length);
      result.push({ ...cands[pickIdx], _cat: cat });
      offset += 11;
    }
  });
  return result;
}

function showResults() {
  const profile = getVibeProfile();
  const products = composeOutfit();

  const fitMap = {
    'Athletic': 'a slightly tapered cut through the leg with room across the shoulders',
    'Slim': 'narrow silhouettes that hold their line',
    'Rectangular': 'gentle waist definition and balanced proportions',
    'Rectangle': 'gentle waist definition and balanced proportions',
    'Curvy': 'pieces that follow the waist without compressing the hip',
    'Hourglass': 'pieces that honor the waist while skimming the hip',
    'Pear': 'fuller cuts at the hip, structure at the shoulder',
    'Apple': 'A-line shapes that float past the midsection',
    'Inverted Triangle': 'softer shoulders, definition at the waist and hip',
    'Stocky': 'structured shoulders and a clean break at the trouser',
    'Round': 'open, draped layers that don\'t cling at the midsection',
    'Tall & Lean': 'longer rises and full inseams to honor the frame'
  };
  const seedLabel = (itemTypeLabel[state.itemType] || 'piece');
  const colorLabel = (state.itemColorName || '').toLowerCase();
  const summary = `
    Built around your ${colorLabel} <strong>${seedLabel}</strong> in a ${esc(profile.tone)} mood —
    ${fitMap[state.bodyType] || 'a balanced cut'}, anchored by
    ${esc(profile.silhouette)} silhouettes and colors that harmonize with your piece.
  `;
  renderResults(products, summary, { ai: false });
}

/* Shared renderer for both the built-in engine and real AI results */
/* Real photos via Pexels. Each card starts with its icon; if a Pexels key
   is set we fetch a matching photograph and swap it in. */
const CAT_WORD = { Top:'shirt', Bottom:'pants', Outer:'jacket', Shoe:'shoes', Bag:'bag', Acc:'accessory', Onepiece:'dress' };
function photoQuery(p) {
  let q = (p.query || '').trim();
  if (!q) q = `${(p.name || '').trim()} ${CAT_WORD[p._cat] || 'clothing'}`.trim();
  return q || 'clothing';
}
const pexelsCache = {};
async function fetchPexelsPhoto(query) {
  if (!PHOTOS.key) return null;
  if (pexelsCache[query] !== undefined) return pexelsCache[query];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
  let out = null;
  try {
    const res = await fetch(url, { headers: { Authorization: PHOTOS.key } });
    if (res.status === 401) { showToast('Pexels key was rejected — re-check it in settings'); pexelsCache[query] = null; return null; }
    if (res.ok) {
      const data = await res.json();
      const photo = data.photos && data.photos[0];
      out = photo ? (photo.src.large || photo.src.medium || photo.src.original) : null;
    }
  } catch (e) { out = null; }
  pexelsCache[query] = out;
  return out;
}
let pexelsHintShown = false;
async function hydratePhotos(container) {
  const imgs = [...container.querySelectorAll('img.product-photo[data-q]')];
  if (!PHOTOS.key) {
    if (!pexelsHintShown && imgs.length) { pexelsHintShown = true; showToast('Add a free Pexels key (AI settings) to see real photos'); }
    return;
  }
  await Promise.all(imgs.map(async img => {
    const url = await fetchPexelsPhoto(img.getAttribute('data-q'));
    if (!url) return;
    img.onload = () => { img.style.display = 'block'; const fb = img.nextElementSibling; if (fb) fb.style.display = 'none'; };
    img.onerror = () => {};
    img.src = url;
  }));
}

function renderResults(products, summaryHTML, opts = {}) {
  if (!opts.stay) goTo(5);

  document.getElementById('result-vibe').textContent = state.vibe;
  document.getElementById('result-summary').innerHTML = summaryHTML;

  // Seed item card
  const seedLabel = (itemTypeLabel[state.itemType] || 'piece');
  document.getElementById('seed-img').src = state.imageDataUrl;
  document.getElementById('seed-name').textContent = `${state.itemColorName || ''} ${seedLabel}`.trim();
  const attrs = document.getElementById('seed-attrs');
  attrs.innerHTML = '';
  const seedAttrs = [
    `<span class="seed-color" style="background:${state.itemColor}"></span>${esc(state.itemColorName)}`,
    esc(state.itemType),
    esc((state.vibe || '').toLowerCase()),
    state.gender ? esc(state.gender.toLowerCase()) : 'unisex'
  ];
  seedAttrs.forEach(a => {
    const el = document.createElement('span');
    el.innerHTML = a;
    attrs.appendChild(el);
  });

  // Recommendations
  const recs = document.getElementById('recommendations');
  recs.innerHTML = '';
  products.forEach((p, idx) => {
    const size = p.size || calculateSize(p);
    const matchLine = opts.ai
      ? `<span class="dot"></span> ${esc(p.why || 'chosen by your stylist')}`
      : `<span class="dot"></span> ${matchScore(state.reshuffleSeed + idx)}% match · ${esc(whyItWorks(p))}`;
    const imgHtml = `<img class="product-photo" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer"
            data-q="${esc(photoQuery(p))}" style="display:none">
         <div class="product-icon-fallback" style="display:flex">${productSvg(p)}</div>`;
    const hasStore = !!(p.url || p.p || p.src);
    const footHtml = hasStore
      ? `<div class="product-foot">
          <span class="product-price">${p.p ? '$' + p.p.toLocaleString() : ''}</span>
          <span class="product-source">${p.url ? 'Shop at ' : ''}${esc(p.src)}</span>
        </div>`
      : '';
    const card = document.createElement('div');
    card.className = 'product-card';
    if (hasStore) card.classList.add('has-store');
    card.innerHTML = `
      <div class="product-img">
        ${imgHtml}
        <span class="product-category">${categoryLabel(p._cat)}</span>
        <span class="product-size-badge">${esc(size)}</span>
      </div>
      <div class="product-info">
        <div class="product-brand">${esc(p.brand)}</div>
        <div class="product-name">${esc(p.name)}</div>
        ${footHtml}
        <div class="product-match">${matchLine}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      if (p.url) window.open(p.url, '_blank', 'noopener');
    });
    recs.appendChild(card);
  });
  hydratePhotos(recs);

  // Sizing table
  const sizingRows = document.getElementById('sizing-rows');
  sizingRows.innerHTML = '';
  products.forEach(p => {
    const row = document.createElement('tr');
    const size = p.size || calculateSize(p);
    row.innerHTML = `
      <td class="item-cell">${categoryLabel(p._cat)} · ${esc((p.name || '').split(',')[0])}</td>
      <td>${esc(p.brand)}</td>
      <td><span class="size-pill">${esc(size)}</span></td>
      <td><span class="fit-note">${esc(p.fitNote) || fitNote(p)}</span></td>
    `;
    sizingRows.appendChild(row);
  });
}

function categoryLabel(cat) {
  return { Top:'Top', Outer:'Outer', Bottom:'Bottom', Shoe:'Shoe', Bag:'Bag', Acc:'Accessory', Onepiece:'One-piece' }[cat] || cat;
}

function whyItWorks(p) {
  const seedFam = colorFamilies[state.itemColor] || 'black';
  const itemFam = p.family;
  if (seedFam === itemFam) return `tonal match with your ${seedFam}`;
  return `pairs with ${seedFam}`;
}

function productSvg(p) {
  // Map item to icon based on name keywords + category
  const c = p.hex || p.color || '#1a1a1a';
  const n = (p.name || '').toLowerCase();
  let key;
  if (p._cat === 'Onepiece' || /dress|jumpsuit/.test(n)) key = 'Onepiece';
  else if (p._cat === 'Bag' || /bag|tote|backpack|briefcase|pack|sling|folio/.test(n)) {
    if (/pack|sling/.test(n)) key = 'Pack';
    else if (/tote/.test(n)) key = 'Tote';
    else key = 'Bag';
  }
  else if (p._cat === 'Acc') {
    if (/cap|hat/.test(n)) key = /hat/.test(n) ? 'Hat' : 'Cap';
    else if (/belt/.test(n)) key = 'Belt';
    else if (/sunglass|shades|glasses/.test(n)) key = 'Sunnies';
    else if (/watch|datejust|tank/.test(n)) key = 'Watch';
    else if (/sock/.test(n)) key = 'Socks';
    else if (/necklace|bracelet|hoop|earring|pearl/.test(n)) key = 'Charm';
    else if (/santal|scent|perfume|fragrance/.test(n)) key = 'Scent';
    else key = 'Charm';
  }
  else if (p._cat === 'Shoe') {
    if (/boot/.test(n)) key = 'Boot';
    else if (/loafer|mule|pump|oxford|heel/.test(n)) key = 'Loafer';
    else key = 'Shoe';
  }
  else if (p._cat === 'Bottom') {
    if (/jean|denim/.test(n)) key = 'Jean';
    else if (/trouser/.test(n)) key = 'Trouser';
    else key = 'Pant';
  }
  else if (p._cat === 'Outer') {
    if (/coat|teddy|polo coat|mac/.test(n)) key = 'Coat';
    else if (/shell|gore|beta|summit/.test(n)) key = 'Shell';
    else key = 'Outer';
  }
  else { // Top
    if (/oxford|button|polo|camp/.test(n)) key = 'Shirt';
    else if (/knit|cashmere|merino|sweater|crew\b|fine-knit|fine-gauge/.test(n)) key = 'Knit';
    else if (/hoodie|hooded|sweatshirt/.test(n)) key = 'Knit';
    else key = 'Tee';
  }

  const icons = {
    Tee: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M60 50 L80 35 L120 35 L140 50 L165 65 L150 85 L135 80 L135 165 Q135 170 130 170 L70 170 Q65 170 65 165 L65 80 L50 85 L35 65 Z" fill="${c}" stroke="#00000020" stroke-width="1"/><path d="M85 35 Q100 50 115 35" fill="none" stroke="#00000040" stroke-width="1.5"/></svg>`,
    Top: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M60 50 L80 35 L120 35 L140 50 L165 65 L150 85 L135 80 L135 165 Q135 170 130 170 L70 170 Q65 170 65 165 L65 80 L50 85 L35 65 Z" fill="${c}" stroke="#00000020" stroke-width="1"/></svg>`,
    Shirt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M60 50 L80 35 L100 50 L120 35 L140 50 L165 70 L150 90 L140 85 L140 170 L60 170 L60 85 L50 90 L35 70 Z" fill="${c}" stroke="#00000030" stroke-width="1"/><line x1="100" y1="55" x2="100" y2="170" stroke="#00000020"/><circle cx="100" cy="75" r="1.5" fill="#00000040"/><circle cx="100" cy="100" r="1.5" fill="#00000040"/><circle cx="100" cy="125" r="1.5" fill="#00000040"/><circle cx="100" cy="150" r="1.5" fill="#00000040"/></svg>`,
    Knit: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M55 55 L80 40 L120 40 L145 55 L170 70 L155 95 L145 90 L145 170 L55 170 L55 90 L45 95 L30 70 Z" fill="${c}"/><path d="M70 80 L70 165 M85 80 L85 165 M115 80 L115 165 M130 80 L130 165" stroke="#00000020" stroke-width="1"/></svg>`,
    Outer: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M50 50 L80 35 L100 55 L120 35 L150 50 L175 75 L160 100 L150 95 L150 180 L50 180 L50 95 L40 100 L25 75 Z" fill="${c}"/><line x1="100" y1="60" x2="100" y2="180" stroke="#00000040"/><rect x="65" y="120" width="20" height="25" fill="none" stroke="#00000030" stroke-width="1"/><rect x="115" y="120" width="20" height="25" fill="none" stroke="#00000030" stroke-width="1"/></svg>`,
    Coat: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M50 45 L80 30 L100 50 L120 30 L150 45 L180 75 L165 100 L150 95 L150 185 L50 185 L50 95 L35 100 L20 75 Z" fill="${c}"/></svg>`,
    Shell: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M50 60 L75 40 L100 30 L125 40 L150 60 L165 80 L155 100 L150 95 L150 180 L50 180 L50 95 L45 100 L35 80 Z" fill="${c}"/><path d="M75 40 Q 100 25 125 40 L 100 55 Z" fill="${c}" opacity="0.7"/></svg>`,
    Base: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 55 L85 40 L115 40 L135 55 L160 65 L150 90 L140 85 L140 180 L60 180 L60 85 L50 90 L40 65 Z" fill="${c}"/></svg>`,
    Pants: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 40 L135 40 L138 100 L130 180 L108 180 L100 110 L92 180 L70 180 L62 100 Z" fill="${c}"/></svg>`,
    Pant: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 40 L135 40 L138 100 L130 180 L108 180 L100 110 L92 180 L70 180 L62 100 Z" fill="${c}"/></svg>`,
    Trouser: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 35 L135 35 L140 95 L130 180 L108 180 L100 105 L92 180 L70 180 L60 95 Z" fill="${c}"/><line x1="100" y1="40" x2="100" y2="100" stroke="#00000020"/></svg>`,
    Jean: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 40 L135 40 L138 105 L130 180 L108 180 L100 110 L92 180 L70 180 L62 105 Z" fill="${c}"/><line x1="100" y1="45" x2="100" y2="105" stroke="#ffffff20" stroke-dasharray="3 3"/><rect x="72" y="55" width="14" height="14" fill="none" stroke="#ffffff30"/></svg>`,
    Denim: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M65 40 L135 40 L138 105 L130 180 L108 180 L100 110 L92 180 L70 180 L62 105 Z" fill="${c}"/></svg>`,
    Cap:  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M40 110 Q 40 60 100 60 Q 160 60 160 110 L 160 120 L 40 120 Z" fill="${c}"/><path d="M30 122 L 170 122 L 175 135 L 25 135 Z" fill="${c}"/></svg>`,
    Hat:  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><ellipse cx="100" cy="120" rx="90" ry="20" fill="${c}"/><path d="M50 120 Q 60 50 100 50 Q 140 50 150 120 Z" fill="${c}"/></svg>`,
    Belt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="20" y="90" width="160" height="20" fill="${c}"/><rect x="85" y="82" width="30" height="36" fill="#c4b07a" stroke="#00000040"/></svg>`,
    Strap:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="20" y="90" width="160" height="20" fill="${c}"/><rect x="85" y="82" width="30" height="36" fill="#c4c4c4" stroke="#00000040"/></svg>`,
    Bag:  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="55" y="75" width="90" height="95" rx="6" fill="${c}"/><path d="M75 75 Q 75 50 100 50 Q 125 50 125 75" stroke="${c}" stroke-width="6" fill="none"/></svg>`,
    Tote: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="55" y="75" width="90" height="100" fill="${c}"/><path d="M75 75 L 75 50 M 125 75 L 125 50" stroke="${c}" stroke-width="5"/></svg>`,
    Pack: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="55" y="60" width="90" height="120" rx="14" fill="${c}"/><rect x="80" y="100" width="40" height="50" fill="none" stroke="#ffffff30"/></svg>`,
    Loafer:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M30 130 Q 30 100 60 100 L 150 100 Q 175 100 175 125 L 175 140 Q 175 150 165 150 L 40 150 Q 30 150 30 140 Z" fill="${c}"/><ellipse cx="80" cy="120" rx="20" ry="6" fill="#c4a574"/></svg>`,
    Boot: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M70 50 L120 50 L125 130 L165 135 Q 175 135 175 145 L 175 160 Q 175 168 165 168 L 50 168 Q 40 168 40 160 L 40 145 Q 40 135 50 135 L 65 135 Z" fill="${c}"/></svg>`,
    Shoe: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M25 130 Q 25 100 60 95 L 130 90 Q 160 90 170 110 L 175 130 Q 175 145 160 145 L 35 145 Q 25 145 25 135 Z" fill="${c}"/><rect x="30" y="135" width="145" height="10" fill="#ffffff" stroke="#00000020"/></svg>`,
    Socks:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M80 30 L 120 30 L 120 110 L 150 130 L 150 160 L 100 160 L 80 130 Z" fill="${c}"/></svg>`,
    Sunnies:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><ellipse cx="65" cy="100" rx="32" ry="22" fill="${c}"/><ellipse cx="135" cy="100" rx="32" ry="22" fill="${c}"/><line x1="97" y1="100" x2="103" y2="100" stroke="#1a1a1a" stroke-width="3"/></svg>`,
    Watch:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="80" y="30" width="40" height="20" fill="#5d4d3a"/><rect x="80" y="150" width="40" height="20" fill="#5d4d3a"/><circle cx="100" cy="100" r="42" fill="${c}" stroke="#00000040" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="75" stroke="#ffffff" stroke-width="2"/><line x1="100" y1="100" x2="118" y2="100" stroke="#ffffff" stroke-width="2"/></svg>`,
    Charm:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M40 80 Q 100 60 160 80 Q 100 100 40 80 Z" fill="${c}"/><circle cx="100" cy="120" r="14" fill="#ebe5d4"/></svg>`,
    Scent:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><rect x="80" y="50" width="40" height="20" fill="#5d4d3a"/><rect x="70" y="70" width="60" height="100" fill="${c}" opacity="0.85"/><rect x="78" y="120" width="44" height="22" fill="#ffffff" stroke="#00000020"/></svg>`,
    Onepiece:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5f3ee"/><path d="M70 40 L85 30 L115 30 L130 40 L155 65 L140 85 L130 80 L130 180 L70 180 L70 80 L60 85 L45 65 Z" fill="${c}"/><path d="M85 30 Q 100 45 115 30" fill="none" stroke="#00000030" stroke-width="1"/></svg>`
  };
  return icons[key] || icons.Tee;
}

function getProfile() {
  const ft = parseInt(document.getElementById('height-ft').value) || 5;
  const inch = parseInt(document.getElementById('height-in').value) || 10;
  const heightInches = ft * 12 + inch;
  const weightLb = parseInt(document.getElementById('weight').value) || 160;
  return { heightInches, weightLb, gender: state.gender || 'Men', bodyType: state.bodyType || 'Athletic' };
}

function calculateSize(p) {
  // Smart sizing: derived from height + weight + gender + body type + vibe + fit pref + brand quirks
  const fitPref = document.getElementById('fit-pref').value;
  const { heightInches, weightLb, gender, bodyType } = getProfile();

  // BMI-ish baseline. Anchor to typical brand size charts.
  const heightM = heightInches * 0.0254;
  const weightKg = weightLb * 0.453592;
  const bmi = weightKg / (heightM * heightM);

  // Base top-size index per gender.
  // Men: XS=0, S=1, M=2, L=3, XL=4, XXL=5
  // Women: XS=0, S=1, M=2, L=3, XL=4, XXL=5
  const sizesMen   = ['XS','S','M','L','XL','XXL'];
  const sizesWomen = ['XS','S','M','L','XL','XXL'];

  let idx;
  if (gender === 'Women') {
    if (bmi < 18) idx = 0;
    else if (bmi < 20) idx = 1;
    else if (bmi < 23) idx = 2;
    else if (bmi < 26) idx = 3;
    else if (bmi < 30) idx = 4;
    else idx = 5;
  } else {
    if (bmi < 19) idx = 0;
    else if (bmi < 22) idx = 1;
    else if (bmi < 26) idx = 2;
    else if (bmi < 29) idx = 3;
    else if (bmi < 33) idx = 4;
    else idx = 5;
  }

  // Body-type modifier: broader shoulders / fuller midsections size up
  const bodyBoost = {
    'Athletic': 0, 'Slim': -1, 'Rectangular': 0, 'Rectangle': 0,
    'Curvy': 0, 'Hourglass': 0, 'Pear': -1, 'Apple': 1,
    'Stocky': 1, 'Round': 1, 'Inverted Triangle': 1, 'Tall & Lean': 0
  };
  idx += (bodyBoost[bodyType] || 0);

  // Vibe modifier
  const vibeBoost = {
    'Street Casual': 1, 'Y2K': 1, 'Vintage Americana': 1,
    'Old Money': 0, 'Business Casual': 0, 'Date Night': 0,
    'Techwear': 0, 'Minimalist': 0
  };
  if (state.vibe in vibeBoost) idx += vibeBoost[state.vibe];

  // Fit preference modifier
  if (fitPref === 'Slightly oversized') idx += 1;
  if (fitPref === 'Oversized') idx += 2;
  if (fitPref === 'Slim / Fitted') idx -= 1;

  // Brand quirks
  if (p.brand.includes('Uniqlo')) idx += 1;
  if (p.brand.includes('A.P.C.') || p.brand.includes('APC')) idx += 1;
  if (p.brand.includes('Acronym') || p.brand.includes('Stone Island')) idx -= 1;
  if (p.brand.includes('The Row') || p.brand.includes('Lemaire')) idx += 1;

  // Pants -> waist in inches, derived from weight + body type
  const cat = p._cat || p.cat;
  const nameLower = (p.name || '').toLowerCase();
  if (cat === 'Bottom' || ['Pants','Pant','Trouser','Jean','Denim'].includes(p.cat)) {
    // Waist scales with BMI, not raw weight (BMI 23 ≈ 31" men / 29" women)
    let waistIn = Math.round(bmi * (gender === 'Women' ? 1.25 : 1.35));

    // Body-type adjustment
    if (bodyType === 'Apple' || bodyType === 'Round') waistIn += 2;
    if (bodyType === 'Pear') waistIn -= 1;
    if (bodyType === 'Slim') waistIn -= 1;
    if (bodyType === 'Stocky') waistIn += 1;

    // Vibe + fit modifier
    if (state.vibe === 'Street Casual' || state.vibe === 'Y2K') waistIn += 1;
    if (fitPref === 'Slightly oversized') waistIn += 1;
    if (fitPref === 'Oversized') waistIn += 2;
    if (fitPref === 'Slim / Fitted') waistIn -= 1;

    // Inseam from height (men ≈ height*0.45, women ≈ height*0.44)
    const inseamIn = Math.round(heightInches * (gender === 'Women' ? 0.44 : 0.45));
    return `${waistIn} × ${inseamIn}`;
  }

  // Shoes
  if (cat === 'Shoe' || ['Shoe','Loafer','Boot'].includes(p.cat)) {
    return `US ${document.getElementById('shoe').value || '10.5'}`;
  }

  // Belts — pant waist plus 2"
  if (/belt/.test(nameLower)) {
    const waistIn = Math.round(bmi * (gender === 'Women' ? 1.25 : 1.35));
    return `${waistIn + 2}"`;
  }

  // Universal accessories
  if (cat === 'Acc' || ['Watch','Sunnies','Scent','Charm','Cap','Hat'].includes(p.cat)) return 'OS';
  if (cat === 'Bag') return 'OS';

  const sizes = gender === 'Women' ? sizesWomen : sizesMen;
  idx = Math.max(0, Math.min(sizes.length - 1, idx));
  return sizes[idx];
}

function fitNote(p) {
  const fitPref = document.getElementById('fit-pref').value;
  const n = (p.name || '').toLowerCase();
  const cat = p._cat || p.cat;
  // Derive a granular note key from item name
  let noteKey;
  if (cat === 'Onepiece') noteKey = 'Onepiece';
  else if (cat === 'Bag') noteKey = 'Bag';
  else if (cat === 'Acc') {
    if (/belt/.test(n)) noteKey = 'Belt';
    else if (/watch/.test(n)) noteKey = 'Watch';
    else if (/cap|hat/.test(n)) noteKey = 'Cap';
    else if (/sunglass|shades|glasses/.test(n)) noteKey = 'Sunnies';
    else if (/sock/.test(n)) noteKey = 'Socks';
    else if (/santal|scent|perfume|fragrance/.test(n)) noteKey = 'Scent';
    else noteKey = 'Charm';
  }
  else if (cat === 'Shoe') {
    if (/boot/.test(n)) noteKey = 'Boot';
    else if (/loafer|mule|pump|oxford|heel/.test(n)) noteKey = 'Loafer';
    else noteKey = 'Shoe';
  }
  else if (cat === 'Bottom') {
    if (/jean|denim/.test(n)) noteKey = 'Jean';
    else if (/trouser/.test(n)) noteKey = 'Trouser';
    else noteKey = 'Pant';
  }
  else if (cat === 'Outer') {
    if (/coat/.test(n)) noteKey = 'Coat';
    else if (/shell|gore|beta|summit/.test(n)) noteKey = 'Shell';
    else noteKey = 'Outer';
  }
  else { // Top
    if (/oxford|button|polo|camp/.test(n)) noteKey = 'Shirt';
    else if (/knit|cashmere|merino|sweater|crew\b|fine-knit|fine-gauge/.test(n)) noteKey = 'Knit';
    else if (/hoodie|hooded|sweatshirt/.test(n)) noteKey = 'Knit';
    else noteKey = 'Tee';
  }
  const notes = {
    'Tee': 'Boxy through the body; sit just past the waistband.',
    'Top': 'Drapes generously without losing the shoulder line.',
    'Shirt': 'Slight ease through chest; clean line down the placket.',
    'Knit': 'Holds shape across the shoulder, soft at the cuff.',
    'Outer': 'Layers over a knit or tee without bunching.',
    'Coat': 'Falls below the hip; sleeves break at the wrist.',
    'Shell': 'Articulated; pairs with a base layer underneath.',
    'Base': 'Skin-adjacent without compression.',
    'Pant': 'Sits at the waist; clean break at the shoe.',
    'Pants': 'Full leg, no stack at the ankle.',
    'Trouser': 'Pleated drape with a half break.',
    'Jean': 'Vintage rise; relaxed through the thigh.',
    'Denim': 'Raw, sized to stretch one full size over wear.',
    'Cap': 'One-size adjustable, structured crown.',
    'Hat': 'Brim sits steady; pre-stretched on first wear.',
    'Belt': 'Buckles on the middle hole — room to move.',
    'Strap': 'Trim if longer than 3 inches past the buckle.',
    'Bag': 'Shoulder strap rests just above the hip.',
    'Pack': 'Sits flat against the back, no bounce.',
    'Tote': 'Top handles clear the shoulder of a coat.',
    'Loafer': 'Half size down from sneakers; molds to foot.',
    'Boot': 'True to sneaker size with a thin sock.',
    'Shoe': 'True to size; eyelet pulls clean.',
    'Socks': 'Crew rises just above the ankle bone.',
    'Sunnies': 'Sits flat on the bridge, no pinch at the temple.',
    'Watch': 'Strap sized to the wrist bone, not under it.',
    'Charm': 'Lays flat across the collarbone.',
    'Scent': '50ml — top-note bright, base of sandalwood.',
    'Onepiece': 'Skims the body without cling; hem hits mid-calf.'
  };
  let note = notes[noteKey] || 'Cut to honor your silhouette.';
  if (fitPref === 'Oversized') note += ' Sized one up for an intentional drape.';
  return note;
}

function matchScore(seed) {
  // Deterministic per-item match score (so reshuffles produce coherent numbers)
  return 86 + Math.floor(seededRand(seed * 31 + 7) * 13);
}

function reshuffleOutfit() {
  if (AI.enabled() && AI.history.length) {
    sendChatMessage('Show me a different take — swap out most of the pieces.');
    return;
  }
  state.reshuffleSeed = (state.reshuffleSeed + 1) * 17 + Math.floor(Math.random() * 1000);
  showToast('Curating a new combination…');
  setTimeout(showResults, 400);
}

function restart() {
  state.imageDataUrl = null;
  state.imageIsDemo = false;
  state.vibe = null;
  AI.history = [];
  clearChatLog();
  resetUpload();
  document.querySelectorAll('.vibe-card').forEach(c => c.classList.remove('selected'));
  customVibeInput.value = '';
  goto2.disabled = true;
  goto3.disabled = true;
  goTo(1);
}

/* =======================================================
   REAL AI MODE — Claude API (photo analysis, live product
   recommendations via web search, conversational refinement)
   ======================================================= */
const PROVIDERS = {
  claude: {
    label: 'Claude',
    model: 'claude-sonnet-4-6',
    keyPlaceholder: 'sk-ant-...',
    help: 'Get a key at <a href="https://console.anthropic.com/" target="_blank" rel="noopener">console.anthropic.com</a>. Sent only to <code>api.anthropic.com</code>.'
  },
  gemini: {
    label: 'Gemini',
    model: 'gemini-2.5-flash',
    keyPlaceholder: 'AIza...',
    help: 'Get a key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. Sent only to <code>generativelanguage.googleapis.com</code>.'
  }
};

const AI = {
  provider: 'claude',
  keys: { claude: null, gemini: null },
  history: [],          // running stylist conversation (Anthropic-style messages)
  enabled() { return !!this.keys[this.provider]; }
};
try {
  AI.provider = localStorage.getItem('atelier_ai_provider') || 'claude';
  if (!PROVIDERS[AI.provider]) AI.provider = 'claude';
  // (migrates the old single-key storage from earlier versions)
  AI.keys.claude = localStorage.getItem('atelier_api_key_claude') || localStorage.getItem('atelier_api_key') || null;
  AI.keys.gemini = localStorage.getItem('atelier_api_key_gemini') || null;
} catch (e) {}

/* Pexels — real product photos for the results page */
const PHOTOS = { key: null };
try { PHOTOS.key = localStorage.getItem('atelier_pexels_key') || null; } catch (e) {}
function persistPhotos() {
  try {
    if (PHOTOS.key) localStorage.setItem('atelier_pexels_key', PHOTOS.key);
    else localStorage.removeItem('atelier_pexels_key');
  } catch (e) {}
}

const aiToggle = document.getElementById('ai-toggle');
const aiModal = document.getElementById('ai-modal');
let modalProvider = AI.provider;   // provider currently shown in the modal

function refreshAiToggle() {
  aiToggle.classList.toggle('active', AI.enabled());
  document.getElementById('ai-toggle-label').textContent =
    AI.enabled() ? `Live · ${PROVIDERS[AI.provider].label}` : 'Live styling';
}
aiToggle.addEventListener('click', openAiModal);

function setAiProvider(p) {
  modalProvider = p;
  document.getElementById('provider-claude').classList.toggle('selected', p === 'claude');
  document.getElementById('provider-gemini').classList.toggle('selected', p === 'gemini');
  document.getElementById('key-help').innerHTML = PROVIDERS[p].help;
  const input = document.getElementById('api-key-input');
  input.placeholder = PROVIDERS[p].keyPlaceholder;
  input.value = AI.keys[p] || '';
  document.getElementById('ai-disconnect').style.display = AI.keys[p] ? 'inline-flex' : 'none';
}
function openAiModal() {
  setAiProvider(AI.provider);
  document.getElementById('pexels-key-input').value = PHOTOS.key || '';
  aiModal.classList.add('open');
  setTimeout(() => document.getElementById('api-key-input').focus(), 100);
}
function closeAiModal() { aiModal.classList.remove('open'); }
aiModal.addEventListener('click', e => { if (e.target === aiModal) closeAiModal(); });
document.getElementById('api-key-input').addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });
document.getElementById('pexels-key-input').addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

function persistAi() {
  try {
    localStorage.setItem('atelier_ai_provider', AI.provider);
    if (AI.keys.claude) localStorage.setItem('atelier_api_key_claude', AI.keys.claude);
    else localStorage.removeItem('atelier_api_key_claude');
    if (AI.keys.gemini) localStorage.setItem('atelier_api_key_gemini', AI.keys.gemini);
    else localStorage.removeItem('atelier_api_key_gemini');
    localStorage.removeItem('atelier_api_key'); // old format
  } catch (e) {}
}

function saveApiKey() {
  const v = document.getElementById('api-key-input').value.trim();
  const px = document.getElementById('pexels-key-input').value.trim();
  PHOTOS.key = px || null;
  persistPhotos();
  if (v) {
    AI.keys[modalProvider] = v;
    AI.provider = modalProvider;
    AI.history = [];   // provider switch starts a fresh stylist conversation
    persistAi();
  }
  closeAiModal();
  refreshAiToggle();
  if (v) showToast(`Connected — Atelier now styles with ${PROVIDERS[AI.provider].label}`);
  else if (px) showToast('Pexels connected — real photos are on');
  else showToast('Saved');
  if (v && state.imageDataUrl && !state.imageIsDemo) analyzeSeedImage();
}

function disconnectAi() {
  AI.keys[modalProvider] = null;
  if (AI.provider === modalProvider) AI.history = [];
  persistAi();
  setAiProvider(modalProvider);
  refreshAiToggle();
  showToast(`${PROVIDERS[modalProvider].label} disconnected`);
}
refreshAiToggle();

/* ---- Provider backends. History is stored Anthropic-style and
       converted for Gemini on the fly. ---- */
function aiCall(messages, system, useSearch) {
  return AI.provider === 'gemini'
    ? geminiCall(messages, system, useSearch)
    : claudeCall(messages, system, useSearch);
}

async function claudeCall(messages, system, useSearch) {
  const body = { model: PROVIDERS.claude.model, max_tokens: 4000, system, messages };
  if (useSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }];
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': AI.keys.claude,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
}

async function geminiCall(messages, system, useSearch) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: typeof m.content === 'string'
      ? [{ text: m.content }]
      : m.content.map(b => b.type === 'image'
          ? { inline_data: { mime_type: b.source.media_type, data: b.source.data } }
          : { text: b.text })
  }));
  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { maxOutputTokens: 8192 }
  };
  if (useSearch) body.tools = [{ google_search: {} }];
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${PROVIDERS.gemini.model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': AI.keys.gemini },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  const parts = (data.candidates?.[0]?.content?.parts || []).filter(p => !p.thought);
  const text = parts.map(p => p.text || '').join('\n');
  if (!text.trim()) throw new Error('empty response from Gemini');
  return text;
}

function extractJSON(text) {
  const fences = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)];
  const candidates = fences.length
    ? [fences[fences.length - 1][1]]
    : [text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)];
  for (const c of candidates) {
    try { return JSON.parse(c); } catch (e) {}
  }
  return null;
}

/* ---- Photo analysis: auto-detect item type + color ---- */
const SWATCH_BY_NAME = {};
document.querySelectorAll('#color-swatches .swatch').forEach(s => {
  SWATCH_BY_NAME[s.dataset.name.toLowerCase()] = s;
});

async function analyzeSeedImage() {
  const m = (state.imageDataUrl || '').match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/);
  if (!m) return; // demo SVG or unsupported format — manual entry still works
  const banner = document.getElementById('detect-banner');
  const bannerText = document.getElementById('detect-banner-text');
  banner.style.display = 'flex';
  bannerText.textContent = `${PROVIDERS[AI.provider].label} is looking at your piece…`;
  try {
    const types = Object.keys(itemTypeCategory).join(', ');
    const colors = Object.keys(SWATCH_BY_NAME).join(', ');
    const text = await aiCall([{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } },
        { type: 'text', text: `Identify the fashion item in this photo. Reply with ONLY a JSON object, no other text:\n{"itemType": "<one of: ${types}>", "colorName": "<one of: ${colors}>", "description": "<short product-style name, e.g. 'Black leather low-top sneaker'>"}` }
      ]
    }], 'You identify clothing and fashion items precisely. Reply with only JSON.', false);
    const d = extractJSON(text);
    if (!d || !itemTypeCategory[d.itemType]) throw new Error('could not identify the item');
    state.itemType = d.itemType;
    document.getElementById('item-type').value = d.itemType;
    const sw = SWATCH_BY_NAME[(d.colorName || '').toLowerCase()];
    if (sw) {
      document.querySelectorAll('#color-swatches .swatch').forEach(x => x.classList.remove('selected'));
      sw.classList.add('selected');
      state.itemColor = sw.dataset.color;
      state.itemColorName = sw.dataset.name;
    }
    bannerText.textContent = `Detected: ${d.description || d.itemType} — adjust below if it got it wrong.`;
    validateStep1();
  } catch (err) {
    bannerText.textContent = `Photo analysis didn't work (${err.message}) — pick the details below.`;
  }
}

/* ---- Live outfit styling ---- */
function stylistSystem() {
  return `You are Atelier, an expert personal stylist. You COLLABORATE with the client to build an outfit around one "seed" item they already own. You work in two phases and never skip ahead.

PHASE 1 — BUILD THE LOOK (always start here):
- Recommend specific pieces that complete the outfit. You do NOT provide image URLs — the app shows a real photo of each piece automatically. Your job is to describe each piece precisely.
- For EVERY piece, fill in "query": a short, vivid VISUAL search phrase of 3–6 words that an image search would use to find a photo of exactly that piece. Lead with the dominant color, then material/pattern, then the garment, then one defining detail. Examples: "olive green utility jacket", "cream chunky knit sweater", "white leather low-top sneakers", "tan suede chelsea boots". No brand names, no prices — just what it looks like.
- Do NOT discuss budget or where to buy yet. Leave "price" 0 and "url"/"src" empty.
- Be collaborative and warm: briefly say why each piece works and invite the client to swap or tweak anything.
- END your Phase 1 reply by asking the client TWO things: (a) what their budget per item is, and (b) whether they'd like you to show where to find the pieces online.

PHASE 2 — SHOP THE LOOK (ONLY after the client gives a budget and asks you to find the pieces):
- For each piece, web-search real, currently purchasable products WITHIN their budget from real retailers. Fill in "brand", "name", "price" (current price), "src" (retailer domain) and "url" (product page). Keep "query" accurate so the photo still matches.
- Respect the stated budget per item.

ALWAYS:
- Never recommend an item in the same category as the seed item (the client already has it).
- Respect gender presentation, measurements, body type, fit preference and chosen vibe.
- Recommend a specific size for every item based on the client's measurements and the brand's known fit (e.g. "M", "32 × 32", "US 10.5").
- When the client asks for changes, keep the pieces they liked and change only what they asked about.
- Be warm and brief.

ALWAYS end your reply with exactly one JSON code block in this schema:
\`\`\`json
{"summary": "<one sentence describing the look>", "reply": "<short conversational message; in Phase 1, end by asking budget + whether to show where to buy>", "items": [{"cat": "<Top|Bottom|Outer|Shoe|Bag|Acc|Onepiece>", "query": "<3-6 word visual search phrase for a photo of this exact piece>", "name": "<descriptive name of the piece>", "brand": "", "price": 0, "src": "", "url": "", "colorHex": "#rrggbb", "size": "", "fitNote": "<one short sentence>", "why": "<why it pairs with the seed item, max 8 words>"}]}
\`\`\`
Include 4–6 items covering different categories. Always fill in "query". Keep price 0 and src/url empty until Phase 2.`;
}

function buildStyleBrief() {
  const ft = document.getElementById('height-ft').value || '5';
  const inch = document.getElementById('height-in').value || '10';
  const weight = document.getElementById('weight').value || '160';
  const shoe = document.getElementById('shoe').value || '10.5';
  const fitPref = document.getElementById('fit-pref').value;
  return `Build an outfit around my seed item: a ${state.itemColorName.toLowerCase()} ${itemTypeLabel[state.itemType] || state.itemType}.${state.imageIsDemo ? '' : ' A photo of it is attached.'}

Vibe: ${state.vibe}
Profile: ${state.gender}, ${ft}'${inch}", ${weight} lb, shoe US ${shoe}, body type ${state.bodyType}
Fit preference: ${fitPref}

This is Phase 1 — build the look with inspiration images and ask me about budget and shopping at the end.`;
}

async function aiStyle(refinementText) {
  if (!AI.history.length) {
    const content = [];
    const m = (state.imageDataUrl || '').match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/);
    if (m) content.push({ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } });
    content.push({ type: 'text', text: buildStyleBrief() });
    AI.history.push({ role: 'user', content });
  } else {
    AI.history.push({ role: 'user', content: refinementText });
  }
  let text;
  try {
    text = await aiCall(AI.history, stylistSystem(), true);
  } catch (err) {
    AI.history.pop(); // keep history consistent on failure
    throw err;
  }
  AI.history.push({ role: 'assistant', content: text });
  const data = extractJSON(text);
  if (!data || !Array.isArray(data.items) || !data.items.length) {
    throw new Error('could not parse the stylist response');
  }
  return data;
}

function aiProductsFrom(data) {
  const cats = ['Top', 'Bottom', 'Outer', 'Shoe', 'Bag', 'Acc', 'Onepiece'];
  return data.items.map(it => ({
    cat: it.cat,
    _cat: cats.includes(it.cat) ? it.cat : 'Acc',
    brand: it.brand || '',
    name: it.name || '',
    p: Math.round(Number(it.price)) || 0,
    src: it.src || '',
    url: /^https?:\/\//.test(it.url || '') ? it.url : null,
    query: (it.query || '').trim(),
    hex: /^#[0-9a-fA-F]{3,8}$/.test(it.colorHex || '') ? it.colorHex : '#1a1a1a',
    family: '',
    size: it.size || '',
    fitNote: it.fitNote || '',
    why: it.why || ''
  }));
}

/* ---- Stylist chat ---- */
const chatLogEl = document.getElementById('chat-log');
function clearChatLog() { chatLogEl.innerHTML = ''; }
function appendChat(who, text) {
  const el = document.createElement('div');
  el.className = 'chat-msg ' + who;
  el.textContent = text;
  chatLogEl.appendChild(el);
  chatLogEl.scrollTop = chatLogEl.scrollHeight;
  return el;
}

let chatBusy = false;
async function sendChatMessage(text) {
  if (!AI.enabled()) { openAiModal(); return; }
  if (!AI.history.length) { showToast('Style an outfit first, then refine it here'); return; }
  if (chatBusy) return;
  chatBusy = true;
  appendChat('you', text);
  const typing = appendChat('stylist', 'Rethinking the look…');
  try {
    const data = await aiStyle(text);
    typing.textContent = data.reply || 'Done — I updated your look.';
    renderResults(aiProductsFrom(data), esc(data.summary || ''), { ai: true, stay: true });
  } catch (err) {
    typing.textContent = `Sorry — ${err.message}. Try again?`;
  } finally {
    chatBusy = false;
  }
}

document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const t = input.value.trim();
  if (!t) return;
  input.value = '';
  sendChatMessage(t);
});

/* =======================================================
   Toast
   ======================================================= */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}
