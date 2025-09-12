
/**
 * PanelModels UI Enhancer (minimal, fast)
 * Wires: model cards, swatches, camera tools, reset/share buttons.
 * Emits CustomEvents you can hook into from your viewer code:
 *  - pm:loadModel  -> { id }
 *  - pm:applyMaterial -> { id }
 *  - pm:setCamera -> { preset }
 *  - pm:reset -> {}
 *  - pm:share -> {}
 *
 * Example hook:
 * window.addEventListener('pm:loadModel', (e)=> {
 *   const id = e.detail.id; // e.g., "vega"
 *   // load GLB here...
 * });
 */
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const emit = (name, detail={}) => window.dispatchEvent(new CustomEvent(name, { detail }));

  // --- Model cards
  $$(".pm-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.model;
      if(!id) return;
      // active state
      $$(".pm-card.is-active").forEach(c=>c.classList.remove("is-active"));
      card.classList.add("is-active");
      emit("pm:loadModel", { id });
    });
  });

  // --- Palette swatches
  $$(".pm-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const id = swatch.dataset.mat;
      if(!id) return;
      // active state
      $$(".pm-swatch.is-active").forEach(s=>s.classList.remove("is-active"));
      swatch.classList.add("is-active");
      emit("pm:applyMaterial", { id });
    });
  });

  // --- Camera tools
  $$(".pm-tool").forEach(tool => {
    tool.addEventListener("click", () => {
      const preset = tool.dataset.cam;
      if(!preset) return;
      emit("pm:setCamera", { preset });
    });
  });

  // --- Overlay buttons (optional)
  const btnReset = $("#btnReset");
  if(btnReset){
    btnReset.addEventListener("click", () => emit("pm:reset"));
  }
  const btnShare = $("#btnShare");
  if(btnShare){
    btnShare.addEventListener("click", () => emit("pm:share"));
  }

  // --- Example default selection (keeps UX snappy on first load)
  const firstCard = $(".pm-card");
  if(firstCard && !$(".pm-card.is-active")){
    firstCard.classList.add("is-active");
  }
  const firstSwatch = $(".pm-swatch");
  if(firstSwatch && !$(".pm-swatch.is-active")){
    firstSwatch.classList.add("is-active");
  }

  // --- Prevent palette/right overlap on resize (safety)
  // Using CSS Grid already solves it, but we keep a no-op to document intent.
  window.addEventListener("resize", () => {/* layout managed by CSS */});
})();

// --- Kamera bar aç/kapa
const camToggle = document.getElementById('camToggle');
const camBar    = document.getElementById('camBar');

camToggle?.addEventListener('click', ()=>{
  const expanded = camToggle.getAttribute('aria-expanded') === 'true';
  const next = !expanded;
  camToggle.setAttribute('aria-expanded', String(next));
  if (next) camBar?.removeAttribute('hidden');
  else camBar?.setAttribute('hidden','');
});

// --- Kamera butonları (yeni)
document.querySelectorAll('.pm-tool').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const preset = btn.dataset.cam;
    if (!preset) return;

    if (preset === 'zoom-in') {
      mv?.zoom?.(0.22);
      return;
    }
    if (preset === 'zoom-out') {
      mv?.zoom?.(-0.22);
      return;
    }
    // ön/arka/izo gibi preset'ler
    setCameraPreset(preset);
  });
});


