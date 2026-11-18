(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const short = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ---------------- Product data (public pricing, Nov 2026) ---------------- */
  const FINISHES = [
    { id: 'silver',  name: 'Silver',         price: 399, sw: '#cfd2d6', stops: ['#f4f5f7', '#b6bac0', '#e7e9ec', '#8a8e95', '#d7dade'], inner: ['#8a8e95', '#3d4046'] },
    { id: 'black',   name: 'Black',          price: 399, sw: '#26262a', stops: ['#5d5d63', '#1c1c20', '#48484e', '#0e0e11', '#303035'], inner: ['#2a2a2e', '#0a0a0c'] },
    { id: 'brushed', name: 'Brushed Silver', price: 499, sw: '#b9bbbf', stops: ['#dcdde0', '#a6a9ae', '#cdd0d4', '#878a90', '#c0c3c7'], inner: ['#7f8288', '#3b3d42'], brushed: true },
    { id: 'stealth', name: 'Stealth',        price: 499, sw: '#46464b', stops: ['#5a5a5f', '#3a3a3e', '#4c4c51', '#2a2a2e', '#424247'], inner: ['#2e2e32', '#151517'] },
    { id: 'gold',    name: 'Gold',           price: 499, sw: '#d8b46a', stops: ['#fbe8b8', '#c99f57', '#f1d596', '#9a7133', '#e3c07a'], inner: ['#9a7133', '#4d3818'] },
    { id: 'rose',    name: 'Deep Rose',      price: 499, sw: '#c08878', stops: ['#efc6b9', '#b37563', '#e2ab9b', '#8a4f41', '#cf9585'], inner: ['#8a4f41', '#45261f'] },
  ];
  const PLAN = { monthly: 5.99, yearly: 69.99 };
  const SIZES = Array.from({ length: 12 }, (_, i) => i + 4); // 4–15, to confirm with Oura for Ring 5
  const byId = (id) => FINISHES.find((f) => f.id === id);

  /* ---------------- Ring illustration (SVG, generated per finish) ---------------- */
  let uid = 0;
  // A ring drawn as a short cylinder in 3/4 view: front band, top rim,
  // inner wall (with the sensor domes) and a see-through opening.
  function ringSVG(f) {
    const k = 'r' + (++uid);
    const [l1, m1, l2, d1, m2] = f.stops;
    const side = [d1, m1, l1, m2, l2, m1, d1]
      .map((c, i, a) => `<stop offset="${(i / (a.length - 1)).toFixed(3)}" stop-color="${c}"/>`).join('');
    const CX = 200, TOP = 168, H = 64, RX = 150, RY = 58, T = 13; // T = wall thickness
    const BOT = TOP + H;
    const brushed = f.brushed
      ? `<pattern id="${k}p" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="1" fill="rgba(255,255,255,.16)"/></pattern>`
      : '';
    const sidePath = `M${CX - RX},${TOP} A${RX},${RY} 0 0,0 ${CX + RX},${TOP} L${CX + RX},${BOT} A${RX},${RY} 0 0,1 ${CX - RX},${BOT} Z`;
    return `<svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${k}g" x1="0" y1="0" x2="1" y2="0">${side}</linearGradient>
        <linearGradient id="${k}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l1}"/><stop offset=".5" stop-color="${m2}"/><stop offset="1" stop-color="${l2}"/></linearGradient>
        <linearGradient id="${k}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.inner[1]}"/><stop offset="1" stop-color="${f.inner[0]}"/></linearGradient>
        <radialGradient id="${k}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(22,21,26,.3)"/><stop offset="1" stop-color="rgba(22,21,26,0)"/></radialGradient>
        <clipPath id="${k}c"><ellipse cx="${CX}" cy="${TOP}" rx="${RX - T}" ry="${RY - T * 0.4}"/></clipPath>
        <mask id="${k}m">
          <rect width="400" height="400" fill="#fff"/>
          <ellipse cx="${CX}" cy="${BOT}" rx="${RX - T}" ry="${RY - T * 0.4}" fill="#000" clip-path="url(#${k}c)"/>
        </mask>
        ${brushed}
      </defs>
      <ellipse cx="${CX}" cy="${BOT + 72}" rx="${RX * 0.95}" ry="18" fill="url(#${k}s)"/>
      <g transform="rotate(-10 ${CX} ${TOP + H / 2})">
        <path d="${sidePath}" fill="url(#${k}g)"/>
        ${f.brushed ? `<path d="${sidePath}" fill="url(#${k}p)"/>` : ''}
        <path d="${sidePath}" fill="none" stroke="rgba(0,0,0,.15)"/>
        <g mask="url(#${k}m)">
          <ellipse cx="${CX}" cy="${TOP}" rx="${RX}" ry="${RY}" fill="url(#${k}t)"/>
          <ellipse cx="${CX}" cy="${TOP}" rx="${RX - T}" ry="${RY - T * 0.4}" fill="url(#${k}i)"/>
          <ellipse cx="${CX - 34}" cy="${TOP - 18}" rx="7" ry="4" fill="${f.inner[0]}" opacity=".9"/>
          <ellipse cx="${CX + 6}" cy="${TOP - 26}" rx="7" ry="4" fill="${f.inner[0]}" opacity=".9"/>
          <ellipse cx="${CX + 44}" cy="${TOP - 18}" rx="7" ry="4" fill="${f.inner[0]}" opacity=".9"/>
        </g>
        <ellipse cx="${CX}" cy="${TOP}" rx="${RX - 1}" ry="${RY - 1}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.5" stroke-dasharray="120 900" stroke-dashoffset="-330"/>
        <path d="M${CX - RX + 18},${BOT + 20} A${RX},${RY} 0 0,0 ${CX - 30},${BOT + RY - 2}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      </g>
    </svg>`;
  }
  function paintRing(el, id) {
    const f = byId(id);
    el.innerHTML = ringSVG(f);
    el.dataset.ring = id;
    if (el.getAttribute('role') === 'img') el.setAttribute('aria-label', `Oura Ring 5 in ${f.name}`);
  }
  document.querySelectorAll('[data-ring]').forEach((el) => paintRing(el, el.dataset.ring));

  /* ---------------- Configurator ---------------- */
  const form = $('#config-form');
  $('#finish-options').innerHTML = FINISHES.map((f, i) => `
    <label class="opt"><input type="radio" name="finish" value="${f.id}" ${i === 0 ? 'checked' : ''} />
      <span class="opt-body"><span class="sw" style="background:${f.sw}" aria-hidden="true"></span>
      <span class="opt-text"><b>${f.name}</b></span>
      <span class="opt-meta">${short(f.price)}</span><span class="check" aria-hidden="true"></span></span></label>`).join('');
  const sizeSelect = $('#size-select');
  SIZES.forEach((s) => sizeSelect.add(new Option('Size ' + s, s)));

  const state = { finish: 'silver', sizing: 'kit', size: '', plan: 'monthly' };

  function readForm() {
    const fd = new FormData(form);
    state.finish = fd.get('finish');
    state.sizing = fd.get('sizing');
    state.size = fd.get('size') || '';
    state.plan = fd.get('plan');
  }

  function renderConfig(changed) {
    const f = byId(state.finish);
    if (changed === 'finish') paintRing($('#config-ring'), f.id);
    $('#config-name').textContent = f.name;
    $('#config-price').textContent = short(f.price);
    $('#size-field').hidden = state.sizing !== 'known';
    $('#kit-note').hidden = state.sizing !== 'kit';
    $('#sum-ring-label').textContent = `Oura Ring 5 · ${f.name}`;
    $('#sum-ring').textContent = money(f.price);
    $('#sum-size').textContent = state.sizing === 'kit' ? 'Sizing kit first' : state.size ? 'Size ' + state.size : 'Not selected';
    $('#sum-total').textContent = money(f.price);
    $('#sum-then').textContent = state.plan === 'monthly'
      ? 'Then $5.99/month for membership, starting after your free month.'
      : 'Then $69.99/year for membership, starting after your free month.';
    renderCalc();
  }

  form.addEventListener('change', (e) => {
    readForm();
    if (e.target.name === 'size' || e.target.name === 'sizing') { sizeSelect.removeAttribute('aria-invalid'); $('#size-error').hidden = true; }
    renderConfig(e.target.name);
    // keep the calculator's plan in step with the order
    if (e.target.name === 'plan') { const r = document.querySelector(`input[name="cplan"][value="${state.plan}"]`); if (r) r.checked = true; renderCalc(); }
  });

  /* ---------------- Cost calculator ---------------- */
  const calcForm = $('#calc-form');
  function renderCalc() {
    const fd = new FormData(calcForm);
    const years = +fd.get('years');
    const plan = fd.get('cplan');
    const ring = byId(state.finish).price;
    const mem = plan === 'monthly' ? (years * 12 - 1) * PLAN.monthly : years * PLAN.yearly;
    const total = ring + mem;
    $('#calc-total').textContent = money(total);
    $('#calc-per').textContent = `total over ${years} year${years > 1 ? 's' : ''} · about ${money(total / (years * 12))} a month`;
    $('#calc-ring').textContent = money(ring);
    $('#calc-mem').textContent = money(mem);
    $('#bar-ring').style.flexGrow = ring;
    $('#bar-mem').style.flexGrow = mem;
  }
  calcForm.addEventListener('change', renderCalc);

  /* ---------------- Bag ---------------- */
  let bag = [];
  try { bag = JSON.parse(sessionStorage.getItem('oura-concept-bag') || '[]'); } catch (e) { bag = []; }
  const save = () => { try { sessionStorage.setItem('oura-concept-bag', JSON.stringify(bag)); } catch (e) { /* storage unavailable */ } };
  const dlg = $('#bag');
  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function renderBag() {
    const count = $('#bag-count');
    count.textContent = bag.length;
    count.dataset.n = bag.length;
    const body = $('#bag-body');
    if (!bag.length) { body.innerHTML = '<p class="empty">Your bag is empty.</p>'; return; }
    body.innerHTML = bag.map((it, i) => {
      const f = byId(it.finish);
      return `<div class="bag-item">
        <div class="thumb" data-thumb="${f.id}"></div>
        <div><b>Oura Ring 5 · ${f.name}</b>
          <span>${it.sizing === 'kit' ? 'Sizing kit ships first' : 'Size ' + it.size}</span>
          <span>Membership: ${it.plan === 'monthly' ? '$5.99/month' : '$69.99/year'}, first month free</span>
          <button type="button" data-remove="${i}">Remove<span class="sr-only"> Oura Ring 5 ${f.name}</span></button></div>
        <b>${money(f.price)}</b>
      </div>`;
    }).join('') + `<p style="display:flex;justify-content:space-between;font-weight:700"><span>Due today</span><span>${money(bag.reduce((s, it) => s + byId(it.finish).price, 0))}</span></p>`;
    body.querySelectorAll('[data-thumb]').forEach((el) => { el.innerHTML = ringSVG(byId(el.dataset.thumb)); });
  }
  $('#bag-body').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    bag.splice(+b.dataset.remove, 1);
    save(); renderBag();
    $('#bag-close').focus();
    showToast('Removed from bag');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    readForm();
    if (state.sizing === 'known' && !state.size) {
      sizeSelect.setAttribute('aria-invalid', 'true');
      $('#size-error').hidden = false;
      sizeSelect.focus();
      return;
    }
    bag.push({ ...state });
    save(); renderBag();
    showToast(`Added Oura Ring 5 · ${byId(state.finish).name}`);
  });

  $('#bag-open').addEventListener('click', () => { renderBag(); dlg.showModal(); });
  $('#bag-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => $('#bag-open').focus());

  document.querySelectorAll('a[href="#size-step"]').forEach((a) => a.addEventListener('click', () => {
    setTimeout(() => form.querySelector('input[name="sizing"]:checked').focus({ preventScroll: true }), 500);
  }));

  readForm();
  renderConfig('init');
  renderBag();
})();
