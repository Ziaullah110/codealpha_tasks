(function(){
const gallery = document.getElementById('gallery');
const cards = Array.from(gallery.querySelectorAll('.card'));
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbTitle = document.getElementById('lbTitle');
const lbMeta = document.getElementById('lbMeta');
const lbClose = document.getElementById('lbClose');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const downloadBtn = document.getElementById('download');
const toggleFilterBtn = document.getElementById('toggleFilter');
const presetFilter = document.getElementById('presetFilter');
const shuffleBtn = document.getElementById('shuffle');


let currentIndex = 0;
let activeCSSFilter = 'none';
let filterToggled = false;


function openLightbox(index){
const card = cards[index];
const img = card.querySelector('img');
lbImage.src = img.src;
lbImage.alt = img.alt || '';
lbTitle.textContent = card.querySelector('.meta').textContent || 'Image';
lbMeta.textContent = (card.dataset.category || 'uncategorized').toUpperCase();
currentIndex = index;
lightbox.classList.add('open');
lightbox.setAttribute('aria-hidden','false');
}


function closeLightbox(){
lightbox.classList.remove('open');
lightbox.setAttribute('aria-hidden','true');
}
function showNext(){
currentIndex = (currentIndex + 1) % cards.length;
openLightbox(currentIndex);
}
function showPrev(){
currentIndex = (currentIndex - 1 + cards.length) % cards.length;
openLightbox(currentIndex);
}


// Attach click to each card
cards.forEach((card, idx)=>{
card.addEventListener('click',()=>openLightbox(idx));
card.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx)} });
});


lbClose.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);
// keyboard nav
document.addEventListener('keydown',(e)=>{
if(lightbox.classList.contains('open')){
if(e.key === 'ArrowRight') showNext();
if(e.key === 'ArrowLeft') showPrev();
if(e.key === 'Escape') closeLightbox();
}
});


downloadBtn.addEventListener('click', ()=>{
const a = document.createElement('a');
a.href = lbImage.src; a.download = (lbTitle.textContent || 'image') + '.jpg';
document.body.appendChild(a); a.click(); a.remove();
});


toggleFilterBtn.addEventListener('click', ()=>{
filterToggled = !filterToggled;
if(filterToggled) lbImage.style.filter = cssFilterValue(activeCSSFilter);
else lbImage.style.filter = '';
});


presetFilter.addEventListener('change', (e)=>{
const val = e.target.value;
const galleryEl = document.getElementById('gallery');
galleryEl.classList.remove('filter-grayscale','filter-sepia','filter-blur');
activeCSSFilter = 'none';
if(val === 'grayscale'){ galleryEl.classList.add('filter-grayscale'); activeCSSFilter = 'grayscale' }
if(val === 'sepia'){ galleryEl.classList.add('filter-sepia'); activeCSSFilter = 'sepia' }
if(val === 'blur'){ galleryEl.classList.add('filter-blur'); activeCSSFilter = 'blur' }
});
function cssFilterValue(name){
if(name === 'grayscale') return 'grayscale(100%) contrast(95%)';
if(name === 'sepia') return 'sepia(60%) saturate(130%)';
if(name === 'blur') return 'blur(1px) saturate(120%)';
return '';
}


// Category filtering
const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(btn=> btn.addEventListener('click',(e)=>{
const cat = btn.dataset.filter;
// toggle active class
filterButtons.forEach(b=>b.classList.remove('toggle','active'));
btn.classList.add('toggle','active');


cards.forEach(c=>{
if(cat === 'all') c.classList.remove('hidden');
else c.classList.toggle('hidden', c.dataset.category !== cat);
});
}));
// Shuffle simple algorithm
shuffleBtn.addEventListener('click', ()=>{
// Fisher-Yates on the DOM nodes
for(let i = cards.length -1; i>0; i--){
const j = Math.floor(Math.random() * (i + 1));
// swap positions
gallery.insertBefore(cards[j], cards[i]);
[cards[i], cards[j]] = [cards[j], cards[i]];
}
});


// Clicking outside image closes
lightbox.addEventListener('click',(e)=>{
if(e.target === lightbox) closeLightbox();
});


// Accessibility: focus trap minimal
lightbox.addEventListener('keydown',(e)=>{
if(e.key === 'Tab'){
// keep things simple: if tab on last, go to first
const focusables = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
if(focusables.length === 0) return;
const first = focusables[0]; const last = focusables[focusables.length-1];
if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}
});


// Expose for debugging
window._gallery = {openLightbox, closeLightbox, showNext, showPrev};


})();