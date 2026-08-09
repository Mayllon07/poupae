/* ============================================================
   POUPAÊ — interface, render e motor de animação

   O cálculo do plano fica em core.js, carregado antes deste
   arquivo. Aqui só entra o que depende de DOM, armazenamento
   ou API do navegador.
   ============================================================ */

const ACCOUNTS_KEY = "poupae:accounts:v1";
const USER_KEY = "poupae:user:v1";
const SESSION_KEY = "poupae:session:v1";

const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ── elementos ───────────────────────────────────────────── */
const els = {
  authView: $("#authView"),
  tabs: $(".tabs"),
  tabLogin: $("#tabLogin"),
  tabRegister: $("#tabRegister"),
  authForm: $("#authForm"),
  fieldName: $("#fieldName"),
  authName: $("#authName"),
  authEmail: $("#authEmail"),
  authPassword: $("#authPassword"),
  togglePass: $("#togglePass"),
  remember: $("#remember"),
  helpBtn: $("#helpBtn"),
  authSubmit: $("#authSubmit"),

  shell: $("#appShell"),
  topbar: $("#topbar"),
  newGoalBtn: $("#newGoalBtn"),
  newGoalBtn2: $("#newGoalBtn2"),
  editGoalBtn: $("#editGoalBtn"),
  logoutBtn: $("#logoutBtn"),
  avatarBtn: $("#avatarBtn"),
  avatarInitials: $("#avatarInitials"),
  avatarMenu: $("#avatarMenu"),
  menuName: $("#menuName"),
  menuEmail: $("#menuEmail"),

  railPercent: $("#railPercent"),
  railBar: $("#railBar"),
  railHint: $("#railHint"),
  railGlider: $(".rail-glider"),
  dockGlider: $(".dock-glider"),

  setupView: $("#setupView"),
  setupEyebrow: $("#setupEyebrow"),
  setupTitle: $("#setupTitle"),
  exampleBtn: $("#exampleBtn"),
  cancelEditBtn: $("#cancelEditBtn"),
  stepsBar: $("#stepsBar"),
  goalForm: $("#goalForm"),
  goalName: $("#goalName"),
  goalAmount: $("#goalAmount"),
  currentAmount: $("#currentAmount"),
  goalReason: $("#goalReason"),
  deadline: $("#deadline"),
  frequency: $("#frequency"),
  freqHint: $("#freqHint"),
  reasonField: $("#reasonField"),
  reasonBtn: $("#reasonBtn"),
  reasonIc: $("#reasonIc"),
  reasonTxt: $("#reasonTxt"),
  reasonPanel: $("#reasonPanel"),
  deadlineField: $("#deadlineField"),
  deadlineBtn: $("#deadlineBtn"),
  deadlineTxt: $("#deadlineTxt"),
  deadlineSub: $("#deadlineSub"),
  deadlinePanel: $("#deadlinePanel"),
  freqGrid: $("#freqGrid"),
  monthlyCapacity: $("#monthlyCapacity"),
  stepBack: $("#stepBack"),
  stepNext: $("#stepNext"),
  submitGoal: $("#submitGoal"),
  previewAmount: $("#previewAmount"),
  previewCaption: $("#previewCaption"),
  previewBars: $("#previewBars"),
  previewText: $("#previewText"),

  screens: $("#screens"),
  greeting: $("#greeting"),
  goalTitle: $("#goalTitle"),
  goalSubtitle: $("#goalSubtitle"),
  heroChips: $("#heroChips"),
  ringValue: $("#ringValue"),
  ringPercent: $("#ringPercent"),

  kpiSaved: $("#kpiSaved"),
  kpiSavedBar: $("#kpiSavedBar"),
  kpiRemaining: $("#kpiRemaining"),
  kpiRemainingHint: $("#kpiRemainingHint"),
  kpiNext: $("#kpiNext"),
  kpiNextHint: $("#kpiNextHint"),
  kpiDays: $("#kpiDays"),
  kpiDaysHint: $("#kpiDaysHint"),

  routePill: $("#routePill"),
  routeSvg: $("#routeSvg"),

  actionTitle: $("#actionTitle"),
  actionText: $("#actionText"),
  customAmount: $("#customAmount"),
  payBtn: $("#payBtn"),
  insightBadge: $("#insightBadge"),
  insightTitle: $("#insightTitle"),
  insightText: $("#insightText"),

  goalsList: $("#goalsList"),
  compareCard: $("#compareCard"),
  comparePill: $("#comparePill"),
  compareList: $("#compareList"),
  recalcBtn: $("#recalcBtn"),
  chartCaption: $("#chartCaption"),
  planHealth: $("#planHealth"),
  planChart: $("#planChart"),
  chartTip: $("#chartTip"),
  planTable: $("#planTable"),
  planDetails: $("#planDetails"),
  streakPill: $("#streakPill"),
  analyticsBody: $("#analyticsBody"),
  historyList: $("#historyList"),

  depositSearch: $("#depositSearch"),
  depositFilter: $("#depositFilter"),
  depositList: $("#depositList"),
  awardsPill: $("#awardsPill"),
  awardsList: $("#awardsList"),
  shareBtn: $("#shareBtn"),

  accountForm: $("#accountForm"),
  accountName: $("#accountName"),
  accountEmail: $("#accountEmail"),
  accountCurrentPassword: $("#accountCurrentPassword"),
  accountNewPassword: $("#accountNewPassword"),
  deleteAccountBtn: $("#deleteAccountBtn"),
  exportBtn: $("#exportBtn"),
  importBtn: $("#importBtn"),
  importFile: $("#importFile"),
  importAuthBtn: $("#importAuthBtn"),
  notifBtn: $("#notifBtn"),
  notifStatus: $("#notifStatus"),

  cmdPalette: $("#cmdPalette"),
  cmdInput: $("#cmdInput"),
  cmdList: $("#cmdList"),
  cmdOpen: $("#cmdOpen"),

  depEdit: $("#depEdit"),
  depEditSub: $("#depEditSub"),
  depEditAmount: $("#depEditAmount"),
  depEditDate: $("#depEditDate"),
  depEditSave: $("#depEditSave"),
  depEditCancel: $("#depEditCancel"),

  scroller: $("#scroller"),
  toast: $("#toast"),
  toastText: $("#toastText"),
  toastAction: $("#toastAction"),
  confirmBox: $("#confirmBox"),
  confirmTitle: $("#confirmTitle"),
  confirmText: $("#confirmText"),
  confirmNote: $("#confirmNote"),
  confirmOk: $("#confirmOk"),
  confirmCancel: $("#confirmCancel"),
  confetti: $("#confetti"),
};

/* rede de segurança: se a inicialização falhar, o esqueleto não pode
   ficar cobrindo o app para sempre */
setTimeout(() => document.body.classList.remove("is-booting"), 4000);

/* ── armazenamento ───────────────────────────────────────── */
function loadAccounts() {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem(USER_KEY);
    if (!legacy) return {};
    const user = JSON.parse(legacy);
    const accounts = { [user.email]: user };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return accounts;
  } catch {
    return {};
  }
}
const saveAccounts = () => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(state.accounts));

const goalsKey = (email = state.user?.email) => (email ? `poupae:goals:${email}` : "poupae:goals");
const activeKey = (email = state.user?.email) => (email ? `poupae:active-goal:${email}` : "poupae:active-goal");
const legacyGoalKey = (email) => (email ? `poupae:goal:${email}` : "poupae:goal:v1");

function loadGoals(email) {
  if (!email) return [];
  try {
    const saved = localStorage.getItem(goalsKey(email));
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem(legacyGoalKey(email));
    if (!legacy) return [];
    const goal = JSON.parse(legacy);
    const goals = [{ ...goal, id: goal.id || createId() }];
    localStorage.setItem(goalsKey(email), JSON.stringify(goals));
    return goals;
  } catch {
    return [];
  }
}
function saveGoals() {
  if (!state.user) return;
  localStorage.setItem(goalsKey(), JSON.stringify(state.goals));
  if (state.goal) localStorage.setItem(activeKey(), state.goal.id);
}
function pickActiveGoal(goals, email) {
  if (!goals.length) return null;
  const id = localStorage.getItem(activeKey(email));
  return goals.find((g) => g.id === id) || goals[0];
}
function getSessionUser() {
  const email = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return loadAccounts()[email] || null;
}

/* ── estado ──────────────────────────────────────────────── */
const sessionUser = getSessionUser();
const startGoals = sessionUser ? loadGoals(sessionUser.email) : [];

const state = {
  accounts: loadAccounts(),
  user: sessionUser,
  goals: startGoals,
  goal: pickActiveGoal(startGoals, sessionUser?.email),
  authed: Boolean(sessionUser),
  authMode: "login",
  screen: "dashboard",
  filter: "all",
  search: "",
  editing: false,
  step: 1,
};

/* ── máscara de dinheiro (campos [data-money]) ───────────────
   Formata enquanto digita: "10000" vira "10.000", "1628,5" vira
   "1.628,5". O cursor é reposicionado contando quantos dígitos
   existiam antes dele — inserir um ponto de milhar não o desloca. */
function maskMoney(event) {
  const el = event.target;
  const caret = el.selectionStart ?? el.value.length;
  const inputType = event.inputType || "";
  let raw = el.value;

  /* O ponto só vale como decimal quando o usuário ACABOU de digitá-lo,
     ou quando colou um valor com ponto decimal. Fora disso ele é milhar.
     Antes eu decidia isso pelo formato do texto inteiro, e apagar um
     dígito de "1.234" caía no padrão "1.23": o milhar virava vírgula e o
     limite de duas casas travava o campo. */
  if (event.data === "." && caret > 0 && raw[caret - 1] === ".") {
    raw = `${raw.slice(0, caret - 1)},${raw.slice(caret)}`;
  } else if (inputType === "insertFromPaste" && /^\s*\d+\.\d{1,2}\s*$/.test(raw)) {
    raw = raw.trim().replace(".", ",");
  }

  let digitsBefore = 0;
  for (let i = 0; i < caret && i < raw.length; i++) {
    if (/[\d,]/.test(raw[i])) digitsBefore += 1;
  }

  const next = maskMoneyText(raw);
  el.value = next;

  let pos = 0;
  let seen = 0;
  while (pos < next.length && seen < digitsBefore) {
    if (/[\d,]/.test(next[pos])) seen += 1;
    pos += 1;
  }
  el.setSelectionRange(pos, pos);
}

$$("input[data-money]").forEach((el) => el.addEventListener("input", maskMoney));

/* ── motor de animação ───────────────────────────────────── */
function countTo(el, value, fmt = (v) => currency.format(v)) {
  const from = Number(el.dataset.v || 0);
  el.dataset.v = String(value);
  // aba oculta congela o rAF: escreve o valor final direto
  if (motionOff || document.hidden || Math.abs(from - value) < 0.01) { el.textContent = fmt(value); return; }
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / 900);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (value - from) * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const revealer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12 }
);
const observeReveals = () => $$(".reveal").forEach((el) => revealer.observe(el));

/* confete */
function burstConfetti() {
  if (motionOff) return;
  const cvs = els.confetti;
  const ctx = cvs.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = innerWidth * dpr;
  cvs.height = innerHeight * dpr;
  cvs.style.width = `${innerWidth}px`;
  cvs.style.height = `${innerHeight}px`;

  const colors = ["#34d399", "#6ee7b7", "#a78bfa", "#e2c178", "#ffffff"];
  const pieces = Array.from({ length: 110 }, () => ({
    x: innerWidth / 2 * dpr,
    y: innerHeight * 0.42 * dpr,
    vx: (Math.random() - 0.5) * 17 * dpr,
    vy: (Math.random() * -13 - 5) * dpr,
    w: (Math.random() * 7 + 4) * dpr,
    h: (Math.random() * 5 + 3) * dpr,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.28,
    c: colors[(Math.random() * colors.length) | 0],
    life: 1,
  }));

  let frame = 0;
  const tick = () => {
    frame += 1;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let alive = false;
    for (const p of pieces) {
      p.vy += 0.42 * dpr;
      p.vx *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (frame > 60) p.life -= 0.016;
      if (p.life > 0 && p.y < cvs.height + 40) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    if (alive) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
  };
  requestAnimationFrame(tick);
}

/* toast — com ação opcional de desfazer */
let toastTimer;
let pendingUndo = null;

function hideToast() {
  els.toast.classList.remove("is-on");
  pendingUndo = null;
}

function toast(message, undo = null) {
  clearTimeout(toastTimer);
  els.toastText.textContent = message;
  pendingUndo = undo;

  els.toastAction.classList.toggle("is-hidden", !undo);
  if (undo) els.toastAction.textContent = undo.label || "Desfazer";

  // com ação, o aviso precisa durar o suficiente para ser clicado
  const vida = undo ? 7000 : 2900;
  const bar = els.toast.querySelector("i");
  bar.style.animation = "none";
  void bar.offsetWidth;
  bar.style.animation = "";
  bar.style.animationDuration = `${vida}ms`;

  els.toast.classList.add("is-on");
  toastTimer = setTimeout(hideToast, vida);
}

/* diálogo de confirmação próprio: o confirm() nativo trava a thread,
   ignora o visual do app e não dá para estilizar */
let confirmAction = null;

function askConfirm({ title, text, note = "", okLabel = "Confirmar", onOk }) {
  els.confirmTitle.textContent = title;
  els.confirmText.textContent = text;
  els.confirmNote.innerHTML = note;
  els.confirmOk.textContent = okLabel;
  confirmAction = onOk;
  els.confirmBox.classList.remove("is-hidden");
}

function closeConfirm() {
  els.confirmBox.classList.add("is-hidden");
  confirmAction = null;
}

/* ── render ──────────────────────────────────────────────── */
function render() {
  renderAuth();
  if (!state.authed) return;
  renderChrome();
  renderNav();
  renderAccount();
  renderGoals();
  renderCompare();
  if (!state.goal) return;
  renderDashboard();
  renderRoute();
  renderPlan();
  renderDeposits();
  renderAwards();
  observeReveals();
}

function renderAuth() {
  const logged = Boolean(state.authed && state.user);
  els.authView.classList.toggle("is-hidden", logged);
  els.shell.classList.toggle("is-hidden", !logged);
  els.tabs.dataset.active = state.authMode;
  els.tabLogin.classList.toggle("is-active", state.authMode === "login");
  els.tabRegister.classList.toggle("is-active", state.authMode === "register");
  els.fieldName.classList.toggle("is-hidden", state.authMode !== "register");
  els.authName.required = state.authMode === "register";
  els.authSubmit.querySelector("span").textContent = state.authMode === "register" ? "Criar conta" : "Entrar";
  els.authPassword.autocomplete = state.authMode === "register" ? "new-password" : "current-password";
  if (!logged) observeReveals();
}

function renderChrome() {
  const showAccount = state.screen === "account";
  const showGoals = state.screen === "goals";
  const setup = (!state.goal || state.editing) && !showAccount && !showGoals;

  els.setupView.classList.toggle("is-hidden", !setup);
  els.screens.classList.toggle("is-hidden", setup);
  els.newGoalBtn.classList.toggle("is-hidden", !state.goal || state.editing);
  els.editGoalBtn.classList.toggle("is-hidden", !state.goal || state.editing);

  els.setupEyebrow.textContent = state.editing ? "Editar meta" : "Nova meta";
  els.setupTitle.textContent = state.editing ? "Ajuste sua rota" : "Vamos desenhar sua rota";
  els.exampleBtn.classList.toggle("is-hidden", state.editing);
  els.cancelEditBtn.classList.toggle("is-hidden", !state.editing);

  const name = state.user?.name || "";
  els.avatarInitials.textContent = name.trim().charAt(0).toUpperCase() || "P";
  els.menuName.textContent = name;
  els.menuEmail.textContent = state.user?.email || "";

  const st = statsOf(state.goal);
  els.railPercent.textContent = `${st.percent.toFixed(0)}%`;
  els.railBar.style.width = `${st.percent}%`;
  els.railHint.textContent = state.goal
    ? `${st.paid.length} de ${state.goal.deposits.length} depósitos`
    : "Crie sua primeira meta";

  if (setup) renderPreview();
}

function renderNav() {
  $$("[data-screen]").forEach((b) => b.classList.toggle("is-active", b.dataset.screen === state.screen));
  $$(".screen").forEach((s) => s.classList.toggle("is-active", s.id === `screen-${state.screen}`));
  moveGlider();
}

function moveGlider() {
  const active = $(`.rail-item.is-active`);
  if (active && els.railGlider) {
    els.railGlider.style.opacity = "1";
    els.railGlider.style.transform = `translateY(${active.offsetTop}px)`;
  }
  const dockActive = $(".dock-item.is-active");
  if (dockActive && els.dockGlider) {
    els.dockGlider.style.width = `${dockActive.offsetWidth}px`;
    els.dockGlider.style.transform = `translateX(${dockActive.offsetLeft - 7}px)`;
  }
}

function renderDashboard() {
  const goal = state.goal;
  const st = statsOf(goal);
  const hour = new Date().getHours();
  const part = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  els.greeting.textContent = `${part}, ${(state.user?.name || "").split(" ")[0]}`;
  els.goalTitle.textContent = goal.name;
  els.goalSubtitle.textContent = `Plano ${stratLabel(goal.strategy)} com frequência ${freqLabel(goal.frequency)} para ${REASONS[goal.reason] || "sua meta"}.`;

  const streak = streakOf(goal);
  const chips = [
    `Meta ${currency.format(goal.targetAmount)}`,
    `${goal.deposits.length} depósitos`,
    `Até ${fmtDate(goal.deadline)}`,
  ].map((t) => `<span class="pill">${t}</span>`);
  if (streak.current >= 2) {
    chips.unshift(`<span class="pill pill-streak">${streak.current} seguidos no prazo</span>`);
  }
  els.heroChips.innerHTML = chips.join("");

  const circ = 2 * Math.PI * 84;
  els.ringValue.style.strokeDashoffset = String(circ * (1 - st.percent / 100));
  countTo(els.ringPercent, st.percent, (v) => `${v.toFixed(0)}%`);

  countTo(els.kpiSaved, st.saved);
  els.kpiSavedBar.style.width = `${st.percent}%`;
  countTo(els.kpiRemaining, st.remaining);
  els.kpiRemainingHint.textContent = `${(100 - st.percent).toFixed(0)}% do caminho`;

  countTo(els.kpiNext, st.next ? st.next.amount : 0);
  els.kpiNextHint.textContent = st.next ? fmtDate(st.next.date) : "Tudo concluído";
  els.kpiDays.textContent = st.days === 1 ? "1 dia" : `${st.days} dias`;
  els.kpiDaysHint.textContent = `Até ${fmtDate(goal.deadline)}`;

  if (st.next) {
    els.actionTitle.textContent = `Depósito ${st.next.number} de ${goal.deposits.length}`;
    els.actionText.textContent = `Guarde ${currency.format(st.next.amount)} até ${fmtDate(st.next.date)} para manter sua rota.`;
    els.customAmount.placeholder = " ";
    els.payBtn.disabled = false;
    els.payBtn.querySelector("span").textContent = "Concluir";
  } else {
    els.actionTitle.textContent = "Meta concluída";
    els.actionText.textContent = "Você completou todos os depósitos planejados. Isso é raro — comemore.";
    els.payBtn.disabled = true;
    els.payBtn.querySelector("span").textContent = "Concluído";
  }

  const h = healthOf(goal);
  els.insightBadge.textContent = h.label;
  els.insightBadge.className = `insight-badge ${h.tone}`;
  els.insightTitle.textContent = h.title;
  els.insightText.textContent = h.text;
}

/* rota com marcos */
function renderRoute() {
  const goal = state.goal;
  const deps = goal.deposits;
  const st = statsOf(goal);
  els.routePill.textContent = `${st.paid.length} de ${deps.length}`;

  const maxNodes = 13;
  const idx = deps.length <= maxNodes
    ? deps.map((_, i) => i)
    : Array.from({ length: maxNodes }, (_, i) => Math.round((i * (deps.length - 1)) / (maxNodes - 1)));

  const W = 900, H = 190, padX = 42;
  const pts = idx.map((di, i) => {
    const t = idx.length === 1 ? 0.5 : i / (idx.length - 1);
    return {
      x: padX + t * (W - padX * 2),
      y: 104 - Math.sin(t * Math.PI * 1.6) * 42,
      dep: deps[di],
      i,
    };
  });

  const smooth = (points) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  let lastDone = -1;
  pts.forEach((p, i) => { if (p.dep.paid) lastDone = i; });
  const donePath = lastDone > 0 ? smooth(pts.slice(0, lastDone + 1)) : "";

  const nodes = pts.map((p) => {
    const done = p.dep.paid;
    const isNext = !done && p.dep.id === st.next?.id;
    const cls = done ? "route-node done" : isNext ? "route-node next" : "route-node";
    const r = isNext ? 9 : done ? 7.5 : 6;
    const label = dateShort.format(new Date(`${p.dep.date}T12:00:00`));
    return `
      <g class="route-group">
        <circle class="${cls}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}"
          style="animation: cardIn 500ms var(--ease) ${p.i * 45}ms backwards">
          <title>Depósito ${p.dep.number} — ${currency.format(p.dep.amount)} — ${done ? "concluído" : "pendente"}</title>
        </circle>
        <text class="route-label" x="${p.x.toFixed(1)}" y="${(p.y + 26).toFixed(1)}">${label}</text>
        ${isNext ? `<circle class="route-pin" cx="${p.x.toFixed(1)}" cy="${(p.y - 20).toFixed(1)}" r="3.5"><animate attributeName="cy" values="${(p.y - 20).toFixed(1)};${(p.y - 26).toFixed(1)};${(p.y - 20).toFixed(1)}" dur="1.8s" repeatCount="indefinite"/></circle>` : ""}
      </g>`;
  }).join("");

  const end = pts.at(-1);
  els.routeSvg.innerHTML = `
    <path class="route-line" d="${smooth(pts)}" />
    ${donePath ? `<path class="route-done" d="${donePath}" />` : ""}
    ${nodes}
    <g transform="translate(${(end.x + 14).toFixed(1)}, ${(end.y - 34).toFixed(1)})">
      <path class="route-flag" d="M0 26V0l14 5.4L0 11z" />
    </g>
    <text class="route-label" x="${padX}" y="18" style="text-anchor:start">Início</text>
    <text class="route-label" x="${W - padX}" y="18" style="text-anchor:end">Meta</text>
  `;
}

/* plano + gráfico */
function renderPlan() {
  const goal = state.goal;
  const st = statsOf(goal);
  const h = healthOf(goal);
  els.planHealth.textContent = h.label;
  els.chartCaption.textContent = `${goal.deposits.length} depósitos ${freqPlural(goal.frequency)} até ${fmtDate(goal.deadline)}.`;

  renderChart();

  const first = goal.deposits[0]?.amount || 0;
  const last = goal.deposits.at(-1)?.amount || 0;
  const pending = goal.deposits.filter((d) => !d.paid).length;

  const items = [
    { label: "Estratégia", value: capitalize(stratLabel(goal.strategy)), text: stratText(goal.strategy) },
    { label: "Frequência", value: capitalize(freqLabel(goal.frequency)), text: `${goal.deposits.length} depósitos programados.` },
    { label: "Média mensal", value: currency.format(monthlyRequired(goal)), text: "Estimativa para manter o ritmo." },
    { label: "Primeiro depósito", value: currency.format(first), text: "Valor sugerido para começar." },
    { label: "Último depósito", value: currency.format(last), text: "Valor final previsto pelo plano." },
    { label: "Restantes", value: String(pending), text: `${currency.format(st.remaining)} ainda faltam.` },
  ];

  els.planDetails.innerHTML = items
    .map((it, i) => `
      <article class="plan-item" style="animation-delay:${i * 60}ms">
        <span>${it.label}</span>
        <strong>${it.value}</strong>
        <p>${it.text}</p>
      </article>`)
    .join("");

  renderAnalytics();
  renderHistory();
}

const HISTORY_LABEL = { created: "Criada", edited: "Editada", recalculated: "Recalculada", deposit: "Depósito" };

function renderAnalytics() {
  const a = analyticsOf(state.goal);
  els.streakPill.textContent = a && a.current ? `${a.current} seguidos no prazo` : "Sem sequência";

  if (!a) {
    els.analyticsBody.innerHTML = `<p class="muted">Conclua o primeiro depósito para o Poupaê começar a ler seu ritmo.</p>`;
    return;
  }

  const dias = Math.round(Math.abs(a.antecedencia));
  const ritmo = Math.abs(a.antecedencia) < 0.5
    ? "Em cima do prazo"
    : `${dias} dia${dias === 1 ? "" : "s"} ${a.antecedencia > 0 ? "adiantado" : "atrasado"}`;
  const dif = money(a.realizado - a.planejado);

  const items = [
    { label: "Depósitos feitos", value: String(a.total), text: `${a.onTime} no prazo, ${a.late} com atraso.` },
    { label: "Ritmo médio", value: ritmo, text: "Distância entre a data prevista e o pagamento." },
    { label: "Melhor sequência", value: String(a.best), text: a.current ? `Sequência atual: ${a.current}.` : "Um atraso zera a sequência." },
    {
      label: "Valor médio pago",
      value: currency.format(a.realizado),
      text: dif === 0 ? "Igual ao planejado."
        : dif > 0 ? `${currency.format(dif)} acima do planejado.`
        : `${currency.format(-dif)} abaixo do planejado.`,
    },
  ];

  els.analyticsBody.innerHTML = items.map((it) => `
    <div class="analytics-item">
      <span>${it.label}</span>
      <strong>${it.value}</strong>
      <p>${it.text}</p>
    </div>`).join("");
}

function renderHistory() {
  const h = Array.isArray(state.goal?.history) ? state.goal.history : [];
  if (!h.length) {
    els.historyList.innerHTML = `<li class="history-empty muted">Nenhuma alteração registrada ainda.</li>`;
    return;
  }
  els.historyList.innerHTML = h.map((e) => `
    <li>
      <span class="history-tag ${e.type}">${HISTORY_LABEL[e.type] || "Mudança"}</span>
      <div>
        <p>${e.text}</p>
        <small>${dateTime.format(new Date(e.at))}</small>
      </div>
    </li>`).join("");
}

let chartPoints = [];
let chartW = 0;

function renderChart() {
  const goal = state.goal;
  const svg = els.planChart;
  // a tela pode estar oculta (largura 0): reaproveita a última medida válida
  const measured = Math.round(svg.parentElement.getBoundingClientRect().width);
  const W = Math.max(280, measured || chartW || 720);
  chartW = W;
  const H = 280;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const padL = 58, padR = 26, padT = 18, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const max = goal.targetAmount || 1;
  const n = goal.deposits.length;

  const xAt = (i) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yAt = (v) => padT + plotH - (Math.min(v, max) / max) * plotH;

  let planned = goal.currentAmount;
  let real = goal.currentAmount;
  let lastPaidIndex = -1;
  const planPts = [];
  const realPts = [];

  goal.deposits.forEach((d, i) => {
    planned += d.amount;
    if (d.paid) { real += d.paidAmount || d.amount; lastPaidIndex = i; }
    planPts.push([xAt(i), yAt(planned), planned]);
    if (i <= lastPaidIndex) realPts.push([xAt(i), yAt(real), real]);
  });

  chartPoints = goal.deposits.map((d, i) => ({
    x: xAt(i),
    date: d.date,
    number: d.number,
    planned: planPts[i][2],
    real: i <= lastPaidIndex ? realPts[i][2] : null,
  }));

  const line = (pts) => pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = realPts.length > 1
    ? `${line(realPts)} L ${realPts.at(-1)[0].toFixed(1)} ${(padT + plotH).toFixed(1)} L ${realPts[0][0].toFixed(1)} ${(padT + plotH).toFixed(1)} Z`
    : "";

  const gridY = [0, 0.25, 0.5, 0.75, 1];
  const grid = gridY.map((g) => {
    const y = padT + plotH - g * plotH;
    return `<line class="grid-line" x1="${padL}" y1="${y.toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${y.toFixed(1)}" />
            <text class="axis-text" x="${padL - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${compact.format(max * g)}</text>`;
  }).join("");

  const tickIdx = n <= 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];
  const xTicks = tickIdx.map((i) => {
    const d = goal.deposits[i];
    return `<text class="axis-text" x="${xAt(i).toFixed(1)}" y="${(H - 10).toFixed(1)}" text-anchor="middle">${dateShort.format(new Date(`${d.date}T12:00:00`))}</text>`;
  }).join("");

  const endReal = realPts.at(-1);
  const endPlan = planPts.at(-1);

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--viz-1)" stop-opacity="0.34" />
        <stop offset="100%" stop-color="var(--viz-1)" stop-opacity="0" />
      </linearGradient>
    </defs>
    ${grid}
    <line class="axis-line" x1="${padL}" y1="${(padT + plotH).toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${(padT + plotH).toFixed(1)}" />
    ${xTicks}
    ${area ? `<path class="s1-area" d="${area}" />` : ""}
    <path class="s2-line draw" d="${line(planPts)}" style="--len:${(plotW * 1.9).toFixed(0)}" />
    ${realPts.length > 1 ? `<path class="s1-line draw" d="${line(realPts)}" style="--len:${(plotW * 1.9).toFixed(0)}" />` : ""}
    ${endPlan ? `<circle class="chart-dot" cx="${endPlan[0].toFixed(1)}" cy="${endPlan[1].toFixed(1)}" r="4.5" fill="var(--viz-2)" />` : ""}
    ${endReal ? `<circle class="chart-dot" cx="${endReal[0].toFixed(1)}" cy="${endReal[1].toFixed(1)}" r="5" fill="var(--viz-1)" />` : ""}
    <g id="chartHover" style="display:none">
      <line class="crosshair" y1="${padT}" y2="${(padT + plotH).toFixed(1)}" />
      <circle r="5" fill="var(--viz-2)" stroke="var(--surface-1)" stroke-width="2" id="hoverPlan" />
      <circle r="5" fill="var(--viz-1)" stroke="var(--surface-1)" stroke-width="2" id="hoverReal" />
    </g>
  `;

  svg.dataset.geom = JSON.stringify({ padL, padR, padT, plotH, W, max });

  els.planTable.innerHTML = `
    <thead><tr><th>#</th><th>Data</th><th>Planejado</th><th>Realizado</th></tr></thead>
    <tbody>${chartPoints.map((p) => `
      <tr><td>${p.number}</td><td>${fmtDate(p.date)}</td><td>${currency.format(p.planned)}</td><td>${p.real == null ? "—" : currency.format(p.real)}</td></tr>`).join("")}
    </tbody>`;
}

function chartHover(event) {
  if (!chartPoints.length) return;
  const svg = els.planChart;
  const rect = svg.getBoundingClientRect();
  const geom = JSON.parse(svg.dataset.geom || "{}");
  const scale = geom.W / rect.width;
  const x = (event.clientX - rect.left) * scale;

  let best = chartPoints[0];
  for (const p of chartPoints) if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p;

  const group = svg.querySelector("#chartHover");
  const cross = group.querySelector(".crosshair");
  const dotPlan = svg.querySelector("#hoverPlan");
  const dotReal = svg.querySelector("#hoverReal");
  const yOf = (v) => geom.padT + geom.plotH - (Math.min(v, geom.max) / geom.max) * geom.plotH;

  group.style.display = "";
  cross.setAttribute("x1", best.x);
  cross.setAttribute("x2", best.x);
  dotPlan.setAttribute("cx", best.x);
  dotPlan.setAttribute("cy", yOf(best.planned));
  if (best.real == null) dotReal.style.display = "none";
  else {
    dotReal.style.display = "";
    dotReal.setAttribute("cx", best.x);
    dotReal.setAttribute("cy", yOf(best.real));
  }

  els.chartTip.hidden = false;
  els.chartTip.style.left = `${best.x / scale}px`;
  els.chartTip.style.top = `${yOf(best.planned) / scale}px`;
  els.chartTip.innerHTML = `
    <b>Depósito ${best.number} · ${fmtDate(best.date)}</b>
    <u><i class="swatch s1"></i> Realizado ${best.real == null ? "—" : currency.format(best.real)}</u>
    <u><i class="swatch s2"></i> Planejado ${currency.format(best.planned)}</u>`;
}

function chartLeave() {
  els.chartTip.hidden = true;
  const group = els.planChart.querySelector("#chartHover");
  if (group) group.style.display = "none";
}

/* depósitos */
function renderDeposits() {
  const q = state.search.trim().toLowerCase();
  const list = state.goal.deposits.filter((d) => {
    const okFilter = state.filter === "all" || (state.filter === "paid" && d.paid) || (state.filter === "pending" && !d.paid);
    const okSearch = !q || String(d.number).includes(q) || currency.format(d.amount).toLowerCase().includes(q) || fmtDate(d.date).toLowerCase().includes(q);
    return okFilter && okSearch;
  });

  if (!list.length) {
    els.depositList.innerHTML = `<div class="dep"><div class="dep-num">—</div><div><h3>Nada por aqui</h3><p>Tente outro filtro ou busca.</p></div></div>`;
    return;
  }

  els.depositList.innerHTML = list.slice(0, 120).map((d, i) => `
    <article class="dep ${d.paid ? "is-paid" : ""}" style="animation-delay:${Math.min(i, 16) * 34}ms">
      <div class="dep-num">${d.number}</div>
      <div>
        <h3>${currency.format(d.paidAmount || d.amount)}</h3>
        <p>${fmtDate(d.date)}${d.paid ? ` · pago em ${fmtDate(d.paidAt)}` : ""}</p>
      </div>
      <div class="dep-side">
        <span class="status ${d.paid ? "paid" : "pending"}">${d.paid ? "Concluído" : "Pendente"}</span>
        <button class="mini-btn" data-dep-edit="${d.id}" type="button">Editar</button>
        <button class="mini-btn" data-dep="${d.id}" type="button">${d.paid ? "Desfazer" : "Pagar"}</button>
      </div>
    </article>`).join("");
}

/* conquistas */
function renderAwards() {
  const st = statsOf(state.goal);
  const streak = streakOf(state.goal);
  let done = 0;
  els.awardsList.innerHTML = AWARDS.map((a, i) => {
    const ok = a.type === "percent" ? st.percent >= a.target
      : a.type === "streak" ? streak.best >= a.target
      : st.paid.length >= a.target;
    if (ok) done += 1;
    return `
      <article class="award ${ok ? "is-done" : ""}" style="animation-delay:${i * 70}ms">
        <div class="award-badge">${a.icon}</div>
        <div>
          <h3>${a.label}</h3>
          <p>${ok ? "Conquista liberada" : a.text}</p>
        </div>
      </article>`;
  }).join("");
  els.awardsPill.textContent = `${done} / ${AWARDS.length}`;
}

/* comparação entre metas — só faz sentido com mais de uma */
function renderCompare() {
  const metas = state.goals;
  els.compareCard.classList.toggle("is-hidden", metas.length < 2);
  if (metas.length < 2) return;

  const dados = metas.map((g) => ({ goal: g, st: statsOf(g) }));
  const maiorAlvo = Math.max(...dados.map((d) => d.goal.targetAmount));
  const totalGuardado = dados.reduce((s, d) => s + d.st.saved, 0);
  const totalAlvo = dados.reduce((s, d) => s + d.goal.targetAmount, 0);

  els.comparePill.textContent = `${currency.format(totalGuardado)} de ${currency.format(totalAlvo)}`;

  els.compareList.innerHTML = dados
    .slice()
    .sort((a, b) => b.st.percent - a.st.percent)
    .map(({ goal, st }) => {
      // a barra é proporcional ao maior alvo, para o tamanho das metas
      // ficar visível na comparação, não só a porcentagem
      const largura = (goal.targetAmount / maiorAlvo) * 100;
      const preenchido = st.percent;
      const ativa = state.goal?.id === goal.id;
      return `
        <button class="compare-row ${ativa ? "is-active" : ""}" data-open="${goal.id}" type="button">
          <span class="compare-name">${goal.name}${ativa ? " <i>ativa</i>" : ""}</span>
          <span class="compare-track" style="width:${largura.toFixed(1)}%">
            <i style="width:${preenchido.toFixed(1)}%"></i>
          </span>
          <span class="compare-value">${st.percent.toFixed(0)}%<small>${currency.format(st.saved)} / ${currency.format(goal.targetAmount)}</small></span>
        </button>`;
    })
    .join("");
}

/* metas */
function renderGoals() {
  if (!state.goals.length) {
    els.goalsList.innerHTML = `
      <div class="goal-card goal-empty">
        <h3>Nenhuma meta ainda</h3>
        <p class="muted">Crie sua primeira meta para o Poupaê montar o plano.</p>
        <button class="btn btn-primary" data-new-goal type="button" style="justify-self:center"><span>Criar meta</span></button>
      </div>`;
    return;
  }

  els.goalsList.innerHTML = state.goals.map((goal, i) => {
    const st = statsOf(goal);
    const active = state.goal?.id === goal.id;
    const circ = 2 * Math.PI * 24;
    return `
      <article class="goal-card ${active ? "is-active" : ""}" style="animation-delay:${i * 70}ms">
        <div class="goal-top">
          <div>
            <p class="eyebrow">${active ? "Meta ativa" : "Meta salva"}</p>
            <h3>${goal.name}</h3>
            <p class="amount">${currency.format(st.saved)} de ${currency.format(goal.targetAmount)}</p>
          </div>
          <div class="goal-ring">
            <svg viewBox="0 0 54 54">
              <circle class="t" cx="27" cy="27" r="24" />
              <circle class="v" cx="27" cy="27" r="24" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ * (1 - st.percent / 100)).toFixed(1)}" />
            </svg>
            <b>${st.percent.toFixed(0)}%</b>
          </div>
        </div>
        <div class="meter"><i style="width:${st.percent}%"></i></div>
        <div class="goal-actions">
          <button class="btn btn-ghost" data-open="${goal.id}" type="button">${active ? "Aberta" : "Abrir"}</button>
          <button class="btn btn-danger" data-del="${goal.id}" type="button">Excluir</button>
        </div>
      </article>`;
  }).join("");
}

function renderAccount() {
  renderNotifStatus();
  if (!state.user) return;
  els.accountName.value = state.user.name;
  els.accountEmail.value = state.user.email;
  els.accountCurrentPassword.value = "";
  els.accountNewPassword.value = "";
}

/* ── assistente ──────────────────────────────────────────── */
function readForm() {
  return {
    name: els.goalName.value.trim() || "Minha meta",
    targetAmount: parseMoney(els.goalAmount.value),
    currentAmount: parseMoney(els.currentAmount.value),
    deadline: els.deadline.value,
    frequency: els.frequency.value,
    strategy: $('input[name="strategy"]:checked')?.value || "fixed",
    monthlyCapacity: parseMoney(els.monthlyCapacity.value),
    reason: els.goalReason.value,
  };
}

function renderPreview() {
  const data = readForm();
  const need = Math.max(0, data.targetAmount - data.currentAmount);
  const periods = countPeriods(todayISO(), data.deadline, data.frequency);
  const amounts = buildAmounts(need, periods, data.strategy);
  const avg = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;

  els.previewAmount.textContent = currency.format(need ? avg : 0);
  els.previewCaption.textContent = `média por depósito ${freqLabel(data.frequency)}`;

  const sample = amounts.length <= 16 ? amounts : Array.from({ length: 16 }, (_, i) => amounts[Math.round((i * (amounts.length - 1)) / 15)]);
  const peak = Math.max(...sample, 1);
  els.previewBars.innerHTML = sample.map((a, i) => `<i style="height:${Math.max(8, (a / peak) * 100)}%;animation-delay:${i * 40}ms"></i>`).join("");

  els.previewText.textContent = need
    ? `${periods} depósitos ${freqPlural(data.frequency)} até ${fmtDate(data.deadline)}. Total a juntar: ${currency.format(need)}.`
    : "Preencha os valores para ver a simulação em tempo real.";

  els.freqHint.textContent = data.deadline
    ? `Esse prazo gera ${periods} depósitos ${freqPlural(data.frequency)}.`
    : "Escolha a data e veja quantos depósitos o plano terá.";

  sincronizarSeletores();
}

/* ── seletores próprios ────────────────────────────────────
   A lista que o <select> abre e o calendário do <input type="date">
   são desenhados pelo sistema: nenhum CSS os alcança, e no celular
   destoavam completamente do app. Aqui o controle nativo deixa de
   aparecer e passa a ser só o guardador do valor — quem desenha é
   este módulo.

   Toda escrita passa por escreverNativo(), que dispara "change" no
   campo original. Como o formulário já escutava "change" para chamar
   renderPreview, e renderPreview termina chamando sincronizarSeletores,
   qualquer caminho que mude o valor (inclusive reset() e "usar
   exemplo", que nem sabem que este módulo existe) repinta sozinho. */

const svgIc = (miolo) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${miolo}</svg>`;

const MOTIVO_INFO = {
  reserva: {
    desc: "Um colchão para imprevistos",
    ic: '<path d="M12 3l7.5 3.6v5c0 4.4-3.1 8.3-7.5 9.4-4.4-1.1-7.5-5-7.5-9.4v-5z"/>',
  },
  viagem: {
    desc: "Passagem, hospedagem e passeios",
    ic: '<path d="M2 16l20-7-7 20-3-8z"/>',
  },
  compra: {
    desc: "Aquele item que vale planejar",
    ic: '<path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 2H2"/>',
  },
  divida: {
    desc: "Sair do vermelho com data marcada",
    ic: '<path d="M20 7H4m0 0l4-4M20 17H4m16 0l-4 4"/>',
  },
  investimento: {
    desc: "Dinheiro que trabalha por você",
    ic: '<polyline points="3 17 9.5 10.5 13.5 14.5 21 6"/><polyline points="14.5 6 21 6 21 12.5"/>',
  },
  sonho: {
    desc: "Aquilo que você adia há tempo",
    ic: '<path d="M12 3.4l2.6 5.4 5.9.8-4.2 4.2 1 5.9L12 17l-5.3 2.7 1-5.9-4.2-4.2 5.9-.8z"/>',
  },
};

/* ordem de exibição — a do <select> é outra, e tudo bem */
const FREQ_INFO = [
  { valor: "daily", rotulo: "Diária", ic: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>' },
  { valor: "weekly", rotulo: "Semanal", ic: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M3.5 9.5h17M8 3v3M16 3v3"/>' },
  { valor: "monthly", rotulo: "Mensal", ic: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M3.5 9.5h17"/>' },
];

const MESES_LONGOS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const INICIAIS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const ATALHOS_PRAZO = [
  { meses: 3, rotulo: "3 meses" },
  { meses: 6, rotulo: "6 meses" },
  { meses: 12, rotulo: "1 ano" },
  { meses: 24, rotulo: "2 anos" },
];

/* monta o ISO a partir das partes locais: toISO() passa por UTC e
   pode devolver o dia anterior dependendo do fuso */
const isoDe = (ano, mes, dia) => `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
const dataDeISO = (iso) => new Date(`${iso}T12:00:00`);
const diasEntre = (isoA, isoB) => Math.round((dataDeISO(isoB) - dataDeISO(isoA)) / 86400000);

function isoDaquiA(meses) {
  const d = new Date();
  d.setMonth(d.getMonth() + meses);
  return isoDe(d.getFullYear(), d.getMonth(), d.getDate());
}

function textoPrazo(dias) {
  if (dias < 45) return `em ${dias} ${dias === 1 ? "dia" : "dias"}`;
  const meses = Math.round(dias / 30.44);
  if (meses >= 12 && meses % 12 === 0) {
    const anos = meses / 12;
    return `em ${anos} ${anos === 1 ? "ano" : "anos"}`;
  }
  return `em ${meses} meses`;
}

function escreverNativo(campo, valor) {
  if (campo.value === valor) return;
  campo.value = valor;
  campo.dispatchEvent(new Event("change", { bubbles: true }));
}

/* ── painel flutuante (um de cada vez) ── */
let painelAberto = null;

function fecharPainel(devolverFoco) {
  if (!painelAberto) return;
  const { campo, painel, botao } = painelAberto;
  painel.hidden = true;
  campo.classList.remove("is-open");
  botao.setAttribute("aria-expanded", "false");
  painelAberto = null;
  if (devolverFoco) botao.focus({ preventScroll: true });
}

/* Escolhe entre abrir para baixo ou para cima e limita a altura ao
   espaço que existe de verdade: no celular o campo fica no pé da tela
   e o painel inteiro caía fora dela. */
function posicionarPainel(painel, botao) {
  painel.classList.remove("abre-acima");
  painel.style.maxHeight = "";

  const folga = 16;
  const caixa = botao.getBoundingClientRect();
  const alturaCheia = painel.offsetHeight;
  const dock = $(".dock");
  const alturaDock = dock && getComputedStyle(dock).display !== "none" ? dock.offsetHeight + 14 : 0;

  const abaixo = innerHeight - caixa.bottom - folga - alturaDock;
  const acima = caixa.top - folga;

  /* nada de altura mínima: se o espaço é pouco, o painel rola por
     dentro — melhor do que vazar para fora da tela */
  const paraCima = alturaCheia > abaixo && acima > abaixo;
  painel.classList.toggle("abre-acima", paraCima);
  painel.style.maxHeight = `${Math.max(0, Math.floor(paraCima ? acima : abaixo))}px`;
}

function abrirPainel(campo, painel, botao, montar) {
  const jaEstava = painelAberto?.painel === painel;
  fecharPainel();
  if (jaEstava) return;
  montar();
  painel.hidden = false;
  campo.classList.add("is-open");
  botao.setAttribute("aria-expanded", "true");
  painelAberto = { campo, painel, botao };
  posicionarPainel(painel, botao);
  /* preventScroll é essencial: sem ele o navegador rola a página para
     revelar o item focado e desloca o painel que acabamos de posicionar */
  (painel.querySelector('[aria-selected="true"], .is-sel') || painel.querySelector("button:not(:disabled)"))
    ?.focus({ preventScroll: true });
}

addEventListener("pointerdown", (event) => {
  if (painelAberto && !painelAberto.campo.contains(event.target)) fecharPainel();
});
/* rolar a página levaria o painel junto com o campo, para fora da tela:
   fecha. A rolagem de dentro do painel não chega aqui — ela fica contida
   pelo overscroll-behavior e não borbulha. */
$("#scroller")?.addEventListener("scroll", () => fecharPainel(), { passive: true });
/* na captura: com um painel aberto, Esc fecha ele antes de qualquer
   outra coisa que também escute Esc */
addEventListener("keydown", (event) => {
  if (event.key === "Escape" && painelAberto) {
    event.stopPropagation();
    fecharPainel(true);
  }
}, true);

/* ── motivo ── */
function pintarMotivo() {
  const escolhida = els.goalReason.selectedOptions[0];
  els.reasonTxt.textContent = escolhida ? escolhida.textContent : "Escolher";
  els.reasonIc.innerHTML = svgIc(MOTIVO_INFO[els.goalReason.value]?.ic || "");
}

function montarMotivoPainel() {
  const atual = els.goalReason.value;
  els.reasonPanel.innerHTML = Array.from(els.goalReason.options)
    .map((op) => {
      const escolhido = op.value === atual;
      const info = MOTIVO_INFO[op.value] || {};
      return `
        <button class="picker-opt" type="button" role="option" data-valor="${op.value}" aria-selected="${escolhido}">
          <span class="ic">${svgIc(info.ic || "")}</span>
          <span class="txt">${op.textContent}<small>${info.desc || ""}</small></span>
          ${escolhido ? '<span class="tick" aria-hidden="true">✓</span>' : ""}
        </button>`;
    })
    .join("");
}

els.reasonBtn.addEventListener("click", () =>
  abrirPainel(els.reasonField, els.reasonPanel, els.reasonBtn, montarMotivoPainel)
);
els.reasonPanel.addEventListener("click", (event) => {
  const opcao = event.target.closest(".picker-opt");
  if (!opcao) return;
  escreverNativo(els.goalReason, opcao.dataset.valor);
  fecharPainel(true);
});

/* ── data limite ── */
let mesDoCalendario = null;

function pintarPrazo() {
  const iso = els.deadline.value;
  if (!iso) {
    els.deadlineTxt.textContent = "Escolher data";
    els.deadlineSub.textContent = "";
    return;
  }
  els.deadlineTxt.textContent = fmtDate(iso);
  const dias = diasEntre(todayISO(), iso);
  els.deadlineSub.textContent = dias > 0 ? `· ${textoPrazo(dias)}` : "· prazo vencido";
}

function montarCalendario() {
  const ano = mesDoCalendario.getFullYear();
  const mes = mesDoCalendario.getMonth();
  const escolhido = els.deadline.value;
  const hoje = todayISO();

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoAnterior = new Date(ano, mes, 0).getDate();
  const desloc = new Date(ano, mes, 1).getDay(); // 0 = domingo

  const celulas = [];
  for (let i = desloc; i > 0; i--) celulas.push({ dia: diasNoAnterior - i + 1, mes: mes - 1, fora: true });
  for (let d = 1; d <= diasNoMes; d++) celulas.push({ dia: d, mes, fora: false });
  for (let d = 1; celulas.length % 7; d++) celulas.push({ dia: d, mes: mes + 1, fora: true });

  /* deixa o Date resolver a virada de ano dos dias vizinhos */
  const isoDaCelula = (c) => {
    const x = new Date(ano, c.mes, c.dia);
    return isoDe(x.getFullYear(), x.getMonth(), x.getDate());
  };

  const atalhos = ATALHOS_PRAZO.map((a) => {
    const iso = isoDaquiA(a.meses);
    return `<button type="button" class="cal-atalho${iso === escolhido ? " is-active" : ""}" data-iso="${iso}">${a.rotulo}</button>`;
  }).join("");

  const grade =
    INICIAIS_SEMANA.map((s) => `<span>${s}</span>`).join("") +
    celulas
      .map((c) => {
        const iso = isoDaCelula(c);
        const classes = [c.fora ? "is-fora" : "", iso === escolhido ? "is-sel" : "", iso === hoje ? "is-hoje" : ""]
          .filter(Boolean)
          .join(" ");
        /* o prazo precisa ser no futuro: hoje e o passado ficam à vista, mas travados */
        const travado = iso <= hoje ? " disabled" : "";
        return `<button type="button" class="${classes}" data-iso="${iso}"${travado}>${c.dia}</button>`;
      })
      .join("");

  let pe = "Escolha uma data para ver o efeito no plano.";
  if (escolhido) {
    const dias = Math.max(0, diasEntre(hoje, escolhido));
    const n = countPeriods(hoje, escolhido, els.frequency.value);
    pe = `Faltam <b>${dias} dias</b> · gera <b>${n} depósitos ${freqPlural(els.frequency.value)}</b>`;
  }

  els.deadlinePanel.innerHTML = `
    <div class="cal-atalhos">${atalhos}</div>
    <div class="cal-top">
      <b>${MESES_LONGOS[mes]} de ${ano}</b>
      <span class="cal-nav">
        <button type="button" data-mes="-1" aria-label="Mês anterior">‹</button>
        <button type="button" data-mes="1" aria-label="Próximo mês">›</button>
      </span>
    </div>
    <div class="cal-grade">${grade}</div>
    <div class="cal-pe">${pe}</div>`;
}

els.deadlineBtn.addEventListener("click", () => {
  const base = els.deadline.value ? dataDeISO(els.deadline.value) : new Date();
  mesDoCalendario = new Date(base.getFullYear(), base.getMonth(), 1);
  abrirPainel(els.deadlineField, els.deadlinePanel, els.deadlineBtn, montarCalendario);
});

els.deadlinePanel.addEventListener("click", (event) => {
  const navegar = event.target.closest("[data-mes]");
  if (navegar) {
    mesDoCalendario.setMonth(mesDoCalendario.getMonth() + Number(navegar.dataset.mes));
    montarCalendario();
    /* meses com 6 semanas são mais altos que os de 5: reposiciona */
    posicionarPainel(els.deadlinePanel, els.deadlineBtn);
    els.deadlinePanel.querySelector(`[data-mes="${navegar.dataset.mes}"]`)?.focus({ preventScroll: true });
    return;
  }
  const dia = event.target.closest("[data-iso]");
  if (!dia || dia.disabled) return;
  escreverNativo(els.deadline, dia.dataset.iso);
  fecharPainel(true);
});

/* ── frequência ── */
function pintarFrequencia() {
  const atual = els.frequency.value;
  const prazo = els.deadline.value;
  const tinhaFoco = els.freqGrid.contains(document.activeElement);

  els.freqGrid.innerHTML = FREQ_INFO.map((f) => {
    const marcado = f.valor === atual;
    const n = prazo ? countPeriods(todayISO(), prazo, f.valor) : 0;
    const legenda = prazo ? `${n} ${n === 1 ? "depósito" : "depósitos"}` : "escolha a data";
    return `
      <button class="freq-opt" type="button" role="radio" data-valor="${f.valor}"
              aria-checked="${marcado}" tabindex="${marcado ? 0 : -1}">
        <span class="ic">${svgIc(f.ic)}</span>
        <b>${f.rotulo}</b>
        <small>${legenda}</small>
      </button>`;
  }).join("");

  /* innerHTML descarta o elemento focado: devolve o foco ao escolhido */
  if (tinhaFoco) els.freqGrid.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true });
}

els.freqGrid.addEventListener("click", (event) => {
  const opcao = event.target.closest(".freq-opt");
  if (opcao) escreverNativo(els.frequency, opcao.dataset.valor);
});

els.freqGrid.addEventListener("keydown", (event) => {
  const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
  if (!passo) return;
  event.preventDefault();
  const i = FREQ_INFO.findIndex((f) => f.valor === els.frequency.value);
  const proximo = FREQ_INFO[(i + passo + FREQ_INFO.length) % FREQ_INFO.length];
  escreverNativo(els.frequency, proximo.valor);
  els.freqGrid.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true });
});

function sincronizarSeletores() {
  pintarMotivo();
  pintarPrazo();
  pintarFrequencia();
}

function goToStep(step) {
  state.step = Math.min(3, Math.max(1, step));
  $$(".panel").forEach((p) => p.classList.toggle("is-active", Number(p.dataset.panel) === state.step));
  $$(".step").forEach((s) => {
    const n = Number(s.dataset.step);
    s.classList.toggle("is-active", n === state.step);
    s.classList.toggle("is-done", n < state.step);
  });
  els.stepsBar.style.width = `${(state.step / 3) * 100}%`;
  els.stepBack.style.visibility = state.step === 1 ? "hidden" : "visible";
  els.stepNext.classList.toggle("is-hidden", state.step === 3);
  els.submitGoal.classList.toggle("is-hidden", state.step !== 3);
  renderPreview();
}

function setDefaultDeadline() {
  const d = new Date();
  d.setMonth(d.getMonth() + 12);
  els.deadline.value = toISO(d);
}

function startNewGoal() {
  state.goal = null;
  state.editing = false;
  state.screen = "dashboard";
  els.goalForm.reset();
  setDefaultDeadline();
  goToStep(1);
  render();
}

function startEditGoal() {
  if (!state.goal) return;
  const st = statsOf(state.goal);
  els.goalName.value = state.goal.name;
  els.goalAmount.value = fmtMoneyBR(state.goal.targetAmount);
  els.currentAmount.value = fmtMoneyBR(st.saved);
  els.deadline.value = state.goal.deadline;
  els.frequency.value = state.goal.frequency;
  els.monthlyCapacity.value = fmtMoneyBR(state.goal.monthlyCapacity);
  els.goalReason.value = state.goal.reason;
  const radio = $(`input[name="strategy"][value="${state.goal.strategy}"]`);
  if (radio) radio.checked = true;
  state.editing = true;
  state.screen = "dashboard";
  goToStep(1);
  render();
  toast("Ajuste os campos e salve para recalcular.");
}

/* ── ações ───────────────────────────────────────────────── */
function saveCurrentGoal() {
  const i = state.goals.findIndex((g) => g.id === state.goal.id);
  if (i >= 0) state.goals[i] = state.goal;
  else state.goals.unshift(state.goal);
  saveGoals();
}

function toggleDeposit(id, custom = null) {
  const d = state.goal.deposits.find((x) => x.id === id);
  if (!d) return;
  if (d.paid) {
    d.paid = false; d.paidAt = ""; d.paidAmount = 0;
    toast("Depósito voltou para pendente.");
  } else {
    d.paid = true;
    d.paidAt = new Date().toISOString();
    d.paidAmount = custom && custom > 0 ? money(custom) : d.amount;
    burstConfetti();
    const st = statsOf(state.goal);
    toast(st.percent >= 100 ? "Meta conquistada! Que jornada." : "Depósito concluído. Seu futuro agradece.");
  }
  saveCurrentGoal();
  render();
}

/* edição de um depósito, sem mexer no resto do plano */
let editingDepositId = null;

function openDepositEditor(id) {
  const d = state.goal?.deposits.find((x) => x.id === id);
  if (!d) return;
  editingDepositId = id;
  els.depEditSub.textContent = `Depósito ${d.number} de ${state.goal.deposits.length}${d.paid ? " · já concluído" : ""}`;
  els.depEditAmount.value = fmtMoneyBR(d.paid ? d.paidAmount || d.amount : d.amount);
  els.depEditDate.value = String(d.date).slice(0, 10);
  els.depEdit.classList.remove("is-hidden");
  els.depEditAmount.focus();
}

const closeDepositEditor = () => {
  els.depEdit.classList.add("is-hidden");
  editingDepositId = null;
};

function saveDepositEdit() {
  const d = state.goal?.deposits.find((x) => x.id === editingDepositId);
  if (!d) return closeDepositEditor();

  const valor = parseMoney(els.depEditAmount.value);
  const data = els.depEditDate.value;
  if (!valor || valor <= 0) return toast("Informe um valor maior que zero.");
  if (!data) return toast("Informe a data do depósito.");

  const antes = { amount: d.paid ? d.paidAmount || d.amount : d.amount, date: d.date };
  d.amount = money(valor);
  if (d.paid) d.paidAmount = money(valor);
  d.date = data;

  const mudou = [];
  if (antes.amount !== money(valor)) mudou.push(`valor ${currency.format(antes.amount)} → ${currency.format(valor)}`);
  if (antes.date !== data) mudou.push(`data ${fmtDate(antes.date)} → ${fmtDate(data)}`);
  if (mudou.length) logHistory(state.goal, "deposit", `Depósito ${d.number}: ${mudou.join(", ")}.`);

  // reordena: mudar a data pode tirar o depósito de sequência
  state.goal.deposits.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  state.goal.deposits.forEach((x, i) => { x.number = i + 1; });

  saveCurrentGoal();
  closeDepositEditor();
  render();
  toast(mudou.length ? "Depósito atualizado." : "Nada mudou nesse depósito.");
}

function payNext() {
  const next = state.goal?.deposits.find((d) => !d.paid);
  if (!next) return;
  toggleDeposit(next.id, parseMoney(els.customAmount.value));
  els.customAmount.value = "";
}

function recalculate() {
  const st = statsOf(state.goal);
  const pending = state.goal.deposits.filter((d) => !d.paid);
  if (!pending.length) { toast("Sua meta já está completa."); return; }
  const amounts = buildAmounts(st.remaining, pending.length, state.goal.strategy);
  pending.forEach((d, i) => { d.amount = amounts[i]; });
  logHistory(state.goal, "recalculated", `Plano recalculado: ${currency.format(st.remaining)} redistribuídos em ${pending.length} depósitos restantes.`);
  saveCurrentGoal();
  render();
  toast("Plano recalculado com base no progresso atual.");
}

function openGoal(id) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return;
  state.goal = goal;
  localStorage.setItem(activeKey(), goal.id);
  state.editing = false;
  state.screen = "dashboard";
  render();
}

/* exclusão otimista: apaga na hora e oferece desfazer, em vez de
   interromper com um confirm() antes de qualquer coisa acontecer */
function deleteGoal(id) {
  const posicao = state.goals.findIndex((g) => g.id === id);
  if (posicao < 0) return;

  const removida = state.goals[posicao];
  const eraAtiva = state.goal?.id === id;

  state.goals.splice(posicao, 1);
  if (eraAtiva) state.goal = state.goals[0] || null;
  saveGoals();
  if (!state.goal) localStorage.removeItem(activeKey());
  render();

  toast(`"${removida.name}" excluída.`, {
    label: "Desfazer",
    run: () => {
      state.goals.splice(posicao, 0, removida); // volta na mesma posição
      if (eraAtiva) state.goal = removida;
      saveGoals();
      render();
      toast("Meta restaurada.");
    },
  });
}

function showScreen(screen) {
  state.screen = screen;
  if (!["account", "goals"].includes(screen) && !state.goal) state.screen = "dashboard";
  if (screen !== "dashboard") state.editing = false;
  els.avatarMenu.classList.remove("is-open");
  render();
  els.scroller.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" });
}

/* ── autenticação ────────────────────────────────────────── */
/* A senha era só Base64, que qualquer um reverte no console. Agora é
   PBKDF2-SHA256 com salt próprio por conta. Contas antigas continuam
   entrando pelo esquema velho e são migradas no primeiro login — sem
   isso, quem já tinha conta ficaria trancado para fora. */
const PBKDF2_ITERATIONS = 150000;
// file:// não é contexto seguro e não tem subtle: ali o esquema antigo segue
const subtle = window.crypto && window.crypto.subtle ? window.crypto.subtle : null;

const bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const b64ToBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const legacyEncode = (v) => {
  try {
    return btoa(Array.from(new TextEncoder().encode(v), (b) => String.fromCharCode(b)).join(""));
  } catch { return v; }
};

async function derive(password, salt) {
  const key = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return bytesToB64(new Uint8Array(bits));
}

async function hashPassword(password) {
  if (!subtle) return { passwordHash: legacyEncode(password), passwordSalt: "" };
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { passwordHash: await derive(password, salt), passwordSalt: bytesToB64(salt) };
}

async function verifyPassword(password, account) {
  if (account.passwordSalt && subtle) {
    try {
      return (await derive(password, b64ToBytes(account.passwordSalt))) === account.passwordHash;
    } catch {
      return false;
    }
  }
  return legacyEncode(password) === account.passwordHash;
}

/* migra a conta para o esquema novo assim que a senha certa é digitada */
async function upgradeHashIfLegacy(account, password) {
  if (account.passwordSalt || !subtle) return;
  Object.assign(account, await hashPassword(password));
  state.accounts[account.email] = account;
  saveAccounts();
}

function setAuthMode(mode) {
  state.authMode = mode;
  els.authForm.reset();
  els.remember.checked = true;
  els.authPassword.type = "password";
  els.togglePass.textContent = "Mostrar";
  renderAuth();
}

async function handleAuth(event) {
  event.preventDefault();
  const email = els.authEmail.value.trim().toLowerCase();
  const password = els.authPassword.value;

  if (state.authMode === "register") {
    const name = els.authName.value.trim();
    if (!name) return toast("Informe seu nome para criar a conta.");
    if (state.accounts[email]) { setAuthMode("login"); els.authEmail.value = email; return toast("Já existe uma conta com este e-mail."); }
    if (password.length < 6) return toast("Use uma senha com pelo menos 6 caracteres.");

    const account = { name, email, ...(await hashPassword(password)), createdAt: new Date().toISOString() };
    state.accounts[email] = account;
    saveAccounts();
    signIn(account, "Conta criada. Bem-vindo ao Poupaê.");
    return;
  }

  const account = state.accounts[email];
  if (!account) { setAuthMode("register"); els.authEmail.value = email; return toast("Conta não encontrada. Crie uma neste dispositivo."); }
  if (!(await verifyPassword(password, account))) return toast("E-mail ou senha incorretos.");
  await upgradeHashIfLegacy(account, password);
  signIn(account, `Bom te ver de novo, ${account.name.split(" ")[0]}.`);
}

function signIn(account, message) {
  state.user = account;
  state.goals = loadGoals(account.email);
  state.goal = pickActiveGoal(state.goals, account.email);
  state.authed = true;
  state.screen = "dashboard";
  sessionStorage.setItem(SESSION_KEY, account.email);
  if (els.remember.checked) localStorage.setItem(SESSION_KEY, account.email);
  else localStorage.removeItem(SESSION_KEY);
  if (!state.goal) { els.goalForm.reset(); setDefaultDeadline(); goToStep(1); }
  render();
  toast(message);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  Object.assign(state, { authed: false, user: null, goals: [], goal: null, editing: false, authMode: "login", screen: "dashboard" });
  els.authForm.reset();
  els.avatarMenu.classList.remove("is-open");
  render();
  toast("Você saiu da conta.");
}

async function updateAccount(event) {
  event.preventDefault();
  const name = els.accountName.value.trim();
  const cur = els.accountCurrentPassword.value;
  const next = els.accountNewPassword.value;
  if (!name) return toast("Informe um nome para a conta.");

  const account = state.accounts[state.user.email];
  if (!account) { logout(); return toast("Conta não encontrada neste navegador."); }

  if (next) {
    if (!(await verifyPassword(cur, account))) return toast("Digite a senha atual para trocar a senha.");
    if (next.length < 6) return toast("A nova senha precisa ter ao menos 6 caracteres.");
    Object.assign(account, await hashPassword(next));
  }
  account.name = name;
  state.accounts[state.user.email] = account;
  state.user = account;
  saveAccounts();
  render();
  toast(next ? "Conta e senha atualizadas." : "Conta atualizada.");
}

function deleteAccount() {
  const total = state.goals.length;
  askConfirm({
    title: "Excluir esta conta?",
    text: `Isso apaga a conta e ${total} meta${total === 1 ? "" : "s"} deste navegador.`,
    note: "Isso <b>não tem como desfazer</b>. Exporte um backup antes se quiser guardar seus dados.",
    okLabel: "Excluir tudo",
    onOk: () => {
      const email = state.user.email;
      delete state.accounts[email];
      saveAccounts();
      localStorage.removeItem(goalsKey(email));
      localStorage.removeItem(activeKey(email));
      logout();
      toast("Conta excluída deste dispositivo.");
    },
  });
}

/* ── lembretes de depósito ───────────────────────────────── */
/* Sem servidor não existe agendamento garantido na web: um site não
   acorda sozinho. O que dá para fazer com honestidade é avisar quando
   o app é aberto ou volta ao primeiro plano, e registrar periodicSync
   onde o navegador oferecer. A interface diz isso em vez de prometer
   um alarme que não vai tocar. */
const NOTIF_KEY = "poupae:notif";
const NOTIF_LAST = "poupae:notif:last";
const notifSupported = "Notification" in window;

function notifEnabled() {
  return notifSupported && Notification.permission === "granted" && localStorage.getItem(NOTIF_KEY) === "on";
}

function renderNotifStatus() {
  if (!els.notifStatus) return;
  if (!notifSupported) {
    els.notifStatus.textContent = "Este navegador não oferece notificações.";
    els.notifBtn.classList.add("is-hidden");
    return;
  }
  if (Notification.permission === "denied") {
    els.notifStatus.textContent = "As notificações estão bloqueadas nas configurações do navegador para este site.";
    els.notifBtn.classList.add("is-hidden");
    return;
  }
  els.notifBtn.classList.remove("is-hidden");
  if (notifEnabled()) {
    els.notifStatus.textContent = "Lembretes ligados. O aviso aparece quando você abre o app e há depósito vencendo ou vencido — a web não permite alarme com o app fechado.";
    els.notifBtn.textContent = "Desligar lembretes";
  } else {
    els.notifStatus.textContent = "Receba um aviso quando houver depósito vencendo, ao abrir o app.";
    els.notifBtn.textContent = "Ativar lembretes de depósito";
  }
}

async function toggleReminders() {
  if (!notifSupported) return toast("Este navegador não oferece notificações.");
  if (notifEnabled()) {
    localStorage.setItem(NOTIF_KEY, "off");
    renderNotifStatus();
    return toast("Lembretes desligados.");
  }
  const permissao = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permissao !== "granted") {
    renderNotifStatus();
    return toast("Permissão de notificação negada.");
  }
  localStorage.setItem(NOTIF_KEY, "on");
  renderNotifStatus();
  toast("Lembretes ligados.");
  checkReminders(true);

  // onde existir, deixa o navegador reavaliar em segundo plano
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg && "periodicSync" in reg) {
      await reg.periodicSync.register("poupae-lembrete", { minInterval: 24 * 60 * 60 * 1000 });
    }
  } catch { /* sem periodicSync: segue só com o aviso na abertura */ }
}

function dueDeposits(goal) {
  if (!goal) return [];
  const limite = endOfDay(todayISO()).getTime();
  return goal.deposits.filter((d) => !d.paid && endOfDay(d.date).getTime() <= limite);
}

function checkReminders(forcar = false) {
  if (!notifEnabled() || !state.goal) return;
  // no máximo um aviso por dia, senão vira incômodo
  if (!forcar && localStorage.getItem(NOTIF_LAST) === todayISO()) return;

  const vencidos = dueDeposits(state.goal);
  if (!vencidos.length) return;

  const total = vencidos.reduce((s, d) => s + d.amount, 0);
  const corpo = vencidos.length === 1
    ? `Depósito ${vencidos[0].number} de ${currency.format(vencidos[0].amount)} venceu em ${fmtDate(vencidos[0].date)}.`
    : `${vencidos.length} depósitos em aberto, somando ${currency.format(total)}.`;

  try {
    new Notification(state.goal.name, {
      body: corpo,
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      tag: "poupae-lembrete",
    });
    localStorage.setItem(NOTIF_LAST, todayISO());
  } catch { /* alguns navegadores só permitem via service worker */ }
}

/* ── compartilhar progresso como imagem ──────────────────── */
function drawShareCard(goal, st) {
  const S = 1080;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d");

  const fundo = x.createLinearGradient(0, 0, S, S);
  fundo.addColorStop(0, "#0d2019");
  fundo.addColorStop(1, "#04100c");
  x.fillStyle = fundo;
  x.fillRect(0, 0, S, S);

  const brilho = x.createRadialGradient(S * 0.75, S * 0.2, 0, S * 0.75, S * 0.2, S * 0.7);
  brilho.addColorStop(0, "rgba(52,211,153,0.28)");
  brilho.addColorStop(1, "rgba(52,211,153,0)");
  x.fillStyle = brilho;
  x.fillRect(0, 0, S, S);

  // anel de progresso
  const cx = S / 2, cy = S * 0.44, r = 190;
  x.lineWidth = 30;
  x.lineCap = "round";
  x.strokeStyle = "rgba(255,255,255,0.10)";
  x.beginPath();
  x.arc(cx, cy, r, 0, Math.PI * 2);
  x.stroke();

  const arco = x.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  arco.addColorStop(0, "#34d399");
  arco.addColorStop(1, "#a78bfa");
  x.strokeStyle = arco;
  x.beginPath();
  x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * st.percent) / 100);
  x.stroke();

  x.textAlign = "center";
  x.fillStyle = "#ffffff";
  x.font = "700 130px Sora, Inter, system-ui, sans-serif";
  x.fillText(`${st.percent.toFixed(0)}%`, cx, cy + 40);

  x.fillStyle = "rgba(255,255,255,0.55)";
  x.font = "600 30px Inter, system-ui, sans-serif";
  x.fillText("CONCLUÍDO", cx, cy + 92);

  x.fillStyle = "#ffffff";
  x.font = "700 62px Sora, Inter, system-ui, sans-serif";
  const nome = goal.name.length > 24 ? `${goal.name.slice(0, 23)}…` : goal.name;
  x.fillText(nome, cx, S * 0.755);

  x.fillStyle = "#6ee7b7";
  x.font = "600 42px Inter, system-ui, sans-serif";
  x.fillText(`${currency.format(st.saved)} de ${currency.format(goal.targetAmount)}`, cx, S * 0.815);

  const streak = streakOf(goal);
  if (streak.current >= 2) {
    x.fillStyle = "#e2c178";
    x.font = "600 34px Inter, system-ui, sans-serif";
    x.fillText(`${streak.current} depósitos seguidos no prazo`, cx, S * 0.868);
  }

  x.fillStyle = "rgba(255,255,255,0.4)";
  x.font = "600 30px Inter, system-ui, sans-serif";
  x.fillText("Poupaê", cx, S * 0.945);

  return c;
}

async function shareProgress() {
  if (!state.goal) return toast("Crie uma meta antes de compartilhar.");
  const st = statsOf(state.goal);
  const canvas = drawShareCard(state.goal, st);

  const blob = await new Promise((ok) => canvas.toBlob(ok, "image/png"));
  if (!blob) return toast("Não foi possível gerar a imagem.");

  const arquivo = new File([blob], `poupae-${todayISO()}.png`, { type: "image/png" });
  const texto = `${state.goal.name}: ${st.percent.toFixed(0)}% concluído.`;

  // canShare com files é o único jeito confiável de saber se o
  // compartilhamento aceita imagem — navigator.share sozinho não basta
  if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], title: "Meu progresso no Poupaê", text: texto });
      return;
    } catch (e) {
      if (e.name === "AbortError") return; // usuário fechou, não é erro
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo.name;
  a.click();
  URL.revokeObjectURL(url);
  toast("Imagem baixada. Compartilhe de onde quiser.");
}

/* ── backup: exportar e importar ─────────────────────────── */
/* O arquivo leva a conta (com o hash, nunca a senha em claro) e as
   metas. Assim, restaurar num aparelho novo devolve o login e os dados
   de uma vez — sem isso, os dados morrem presos a um navegador. */
const BACKUP_MARKER = "poupae";

/* Backups exportados quando o app se chamava "Poupaê Aurora" trazem o
   marcador antigo. Aceitar os dois evita recusar um arquivo que a pessoa
   já tem guardado — os novos saem só com "poupae". */
const BACKUP_MARKERS_ACEITOS = [BACKUP_MARKER, "poupae-aurora"];

function exportData() {
  const payload = {
    app: BACKUP_MARKER,
    version: 1,
    exportedAt: new Date().toISOString(),
    account: { ...state.accounts[state.user.email] },
    goals: state.goals,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `poupae-backup-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Backup exportado. Guarde o arquivo em lugar seguro.");
}

function importPayload(payload) {
  if (!payload || !BACKUP_MARKERS_ACEITOS.includes(payload.app) || !payload.account?.email || !Array.isArray(payload.goals)) {
    throw new Error("Esse arquivo não parece um backup do Poupaê.");
  }
  const email = String(payload.account.email).toLowerCase();
  const goals = payload.goals.map(sanitizeGoal).filter(Boolean);

  // conta: só cria se não existir — nunca sobrescreve a senha local
  if (!state.accounts[email]) {
    state.accounts[email] = {
      name: String(payload.account.name || email),
      email,
      passwordHash: String(payload.account.passwordHash || ""),
      passwordSalt: String(payload.account.passwordSalt || ""),
      createdAt: payload.account.createdAt || new Date().toISOString(),
    };
    saveAccounts();
  }

  // metas: mescla por id — as do arquivo prevalecem
  const existing = loadGoals(email);
  const byId = new Map(existing.map((g) => [g.id, g]));
  goals.forEach((g) => byId.set(g.id, g));
  localStorage.setItem(goalsKey(email), JSON.stringify([...byId.values()]));

  return { email, count: goals.length };
}

function handleImportFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const res = importPayload(JSON.parse(reader.result));
      if (state.authed && state.user.email === res.email) {
        state.goals = loadGoals(res.email);
        state.goal = pickActiveGoal(state.goals, res.email);
        render();
      }
      toast(state.authed
        ? `Backup importado: ${res.count} meta${res.count === 1 ? "" : "s"}.`
        : "Backup restaurado. Entre com seu e-mail e senha.");
    } catch (e) {
      toast(e.message || "Não foi possível ler esse arquivo.");
    }
  };
  reader.readAsText(file);
}

/* ── paleta de comandos ──────────────────────────────────── */
let cmdIndex = 0;

function cmdActions() {
  const base = [
    { label: "Ir para Início", hint: "Tela", run: () => showScreen("dashboard") },
    { label: "Ir para Metas", hint: "Tela", run: () => showScreen("goals") },
    { label: "Ir para Plano", hint: "Tela", run: () => showScreen("plan") },
    { label: "Ir para Depósitos", hint: "Tela", run: () => showScreen("deposits") },
    { label: "Ir para Conquistas", hint: "Tela", run: () => showScreen("awards") },
    { label: "Ir para Conta", hint: "Tela", run: () => showScreen("account") },
    { label: "Criar nova meta", hint: "Ação", run: startNewGoal },
    { label: "Concluir próximo depósito", hint: "Ação", run: payNext },
    { label: "Recalcular plano", hint: "Ação", run: recalculate },
    { label: "Instalar aplicativo", hint: "Ação", run: promptInstall },
    { label: "Sair da conta", hint: "Ação", run: logout },
  ];
  const goals = state.goals.map((g) => ({ label: `Abrir meta: ${g.name}`, hint: "Meta", run: () => openGoal(g.id) }));
  return [...base, ...goals];
}

function renderCmd() {
  const q = els.cmdInput.value.trim().toLowerCase();
  const list = cmdActions().filter((a) => a.label.toLowerCase().includes(q));
  cmdIndex = Math.min(cmdIndex, Math.max(0, list.length - 1));
  els.cmdList.innerHTML = list.length
    ? list.map((a, i) => `<li class="${i === cmdIndex ? "is-sel" : ""}" data-i="${i}">${a.label}<small>${a.hint}</small></li>`).join("")
    : `<li>Nada encontrado</li>`;
  els.cmdList._items = list;
}

function openCmd() {
  if (!state.authed) return;
  els.cmdPalette.classList.remove("is-hidden");
  els.cmdInput.value = "";
  cmdIndex = 0;
  renderCmd();
  els.cmdInput.focus();
}
const closeCmd = () => els.cmdPalette.classList.add("is-hidden");

function runCmd() {
  const item = els.cmdList._items?.[cmdIndex];
  closeCmd();
  if (item) item.run();
}

/* ── eventos ─────────────────────────────────────────────── */
els.authForm.addEventListener("submit", handleAuth);
els.tabLogin.addEventListener("click", () => setAuthMode("login"));
els.tabRegister.addEventListener("click", () => setAuthMode("register"));
els.togglePass.addEventListener("click", () => {
  const showing = els.authPassword.type === "text";
  els.authPassword.type = showing ? "password" : "text";
  els.togglePass.textContent = showing ? "Mostrar" : "Ocultar";
});
els.helpBtn.addEventListener("click", () => toast("O acesso é local. Sem senha salva, crie outra conta neste navegador."));

els.goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const wasEditing = state.editing;
  const data = readForm();
  if (!data.targetAmount || data.targetAmount <= data.currentAmount) {
    goToStep(1);
    return toast("Informe uma meta maior que o valor já guardado.");
  }
  if (!data.deadline) { goToStep(2); return toast("Escolha a data limite da meta."); }

  const previous = wasEditing ? state.goal : null;
  state.goal = createPlan(data);
  if (previous) {
    // editar recalcula o plano, mas a identidade e o rastro continuam
    state.goal.id = previous.id;
    state.goal.createdAt = previous.createdAt;
    state.goal.history = Array.isArray(previous.history) ? previous.history : [];
    logHistory(state.goal, "edited", `Meta ajustada para ${currency.format(data.targetAmount)} até ${fmtDate(data.deadline)}. Plano recalculado em ${state.goal.deposits.length} depósitos.`);
  }
  state.editing = false;
  state.screen = "dashboard";
  saveCurrentGoal();
  render();
  burstConfetti();
  toast(wasEditing ? "Meta atualizada e rota recalculada." : "Plano criado. Agora é seguir a rota.");
});

els.stepNext.addEventListener("click", () => goToStep(state.step + 1));
els.stepBack.addEventListener("click", () => goToStep(state.step - 1));
els.goalForm.addEventListener("input", renderPreview);
els.goalForm.addEventListener("change", renderPreview);

els.exampleBtn.addEventListener("click", () => {
  els.goalName.value = "Reserva de emergência";
  els.goalAmount.value = fmtMoneyBR(18000);
  els.currentAmount.value = fmtMoneyBR(1200);
  els.frequency.value = "weekly";
  els.monthlyCapacity.value = fmtMoneyBR(1400);
  els.goalReason.value = "reserva";
  $('input[name="strategy"][value="progressive"]').checked = true;
  setDefaultDeadline();
  renderPreview();
  toast("Exemplo preenchido. Avance para ver o plano.");
});

els.cancelEditBtn.addEventListener("click", () => { state.editing = false; render(); });
els.newGoalBtn.addEventListener("click", startNewGoal);
els.newGoalBtn2.addEventListener("click", startNewGoal);
els.editGoalBtn.addEventListener("click", startEditGoal);
els.logoutBtn.addEventListener("click", logout);
els.payBtn.addEventListener("click", payNext);
els.recalcBtn.addEventListener("click", recalculate);
els.accountForm.addEventListener("submit", updateAccount);
els.deleteAccountBtn.addEventListener("click", deleteAccount);

els.shareBtn.addEventListener("click", shareProgress);
els.notifBtn.addEventListener("click", toggleReminders);

// avisa ao voltar para o app, não só na carga inicial
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) checkReminders();
});
els.exportBtn.addEventListener("click", exportData);
els.importBtn.addEventListener("click", () => els.importFile.click());
els.importAuthBtn.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", () => {
  const file = els.importFile.files[0];
  if (file) handleImportFile(file);
  els.importFile.value = "";
});

els.avatarBtn.addEventListener("click", () => els.avatarMenu.classList.toggle("is-open"));

// fecha ao clicar fora. Não usar stopPropagation aqui dentro: isso impediria
// o clique de chegar ao delegador de [data-screen] e "Minha conta" não abriria.
document.addEventListener("click", (event) => {
  if (!event.target.closest(".avatar-wrap")) els.avatarMenu.classList.remove("is-open");
});

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-screen]");
  if (nav) return showScreen(nav.dataset.screen);
  const open = event.target.closest("[data-open]");
  if (open) return openGoal(open.dataset.open);
  const del = event.target.closest("[data-del]");
  if (del) return deleteGoal(del.dataset.del);
  const depEdit = event.target.closest("[data-dep-edit]");
  if (depEdit) return openDepositEditor(depEdit.dataset.depEdit);
  const dep = event.target.closest("[data-dep]");
  if (dep) return toggleDeposit(dep.dataset.dep);
  if (event.target.closest("[data-new-goal]")) return startNewGoal();
});

els.depositSearch.addEventListener("input", (e) => { state.search = e.target.value; renderDeposits(); });
els.depositFilter.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-filter]");
  if (!btn) return;
  state.filter = btn.dataset.filter;
  $$("#depositFilter button").forEach((b) => b.classList.toggle("is-active", b === btn));
  const glider = $(".seg-glider");
  glider.style.width = `${btn.offsetWidth}px`;
  glider.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  renderDeposits();
});

els.planChart.addEventListener("pointermove", chartHover);
els.planChart.addEventListener("pointerleave", chartLeave);

els.toastAction.addEventListener("click", () => {
  const acao = pendingUndo;
  hideToast();
  if (acao) acao.run();
});

els.confirmCancel.addEventListener("click", closeConfirm);
els.confirmBox.addEventListener("click", (e) => { if (e.target === els.confirmBox) closeConfirm(); });
els.confirmOk.addEventListener("click", () => {
  const acao = confirmAction;
  closeConfirm();
  if (acao) acao();
});

els.depEditSave.addEventListener("click", saveDepositEdit);
els.depEditCancel.addEventListener("click", closeDepositEditor);
els.depEdit.addEventListener("click", (e) => { if (e.target === els.depEdit) closeDepositEditor(); });

els.cmdOpen.addEventListener("click", openCmd);
els.cmdInput.addEventListener("input", () => { cmdIndex = 0; renderCmd(); });
els.cmdList.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-i]");
  if (!li) return;
  cmdIndex = Number(li.dataset.i);
  runCmd();
});
els.cmdPalette.addEventListener("click", (e) => { if (e.target === els.cmdPalette) closeCmd(); });

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    els.cmdPalette.classList.contains("is-hidden") ? openCmd() : closeCmd();
    return;
  }
  if (event.key === "Escape" && !$("#installHelp").classList.contains("is-hidden")) {
    closeInstallHelp();
    return;
  }
  if (event.key === "Escape" && !els.depEdit.classList.contains("is-hidden")) {
    closeDepositEditor();
    return;
  }
  if (els.cmdPalette.classList.contains("is-hidden")) return;
  if (event.key === "Escape") closeCmd();
  if (event.key === "ArrowDown") { event.preventDefault(); cmdIndex += 1; renderCmd(); }
  if (event.key === "ArrowUp") { event.preventDefault(); cmdIndex = Math.max(0, cmdIndex - 1); renderCmd(); }
  if (event.key === "Enter") { event.preventDefault(); runCmd(); }
});

/* topo que recolhe ao rolar — quem rola agora é #scroller, não a janela */
let lastY = 0;
els.scroller.addEventListener("scroll", () => {
  const y = els.scroller.scrollTop;
  els.topbar.classList.toggle("is-tucked", y > lastY && y > 90);
  lastY = y;
}, { passive: true });

let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { moveGlider(); if (state.goal && state.authed) renderChart(); }, 180);
});

/* redesenha o gráfico quando o container ganha largura real
   (ao abrir a tela Plano, girar o celular, etc.) */
if (window.ResizeObserver) {
  const frame = document.querySelector(".chart-frame");
  if (frame) {
    new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (!w || w === chartW || !state.goal || !state.authed) return;
      renderChart();
    }).observe(frame);
  }
}

/* ── instalação (PWA) ────────────────────────────────────── */
const installBtn = $("#installBtn");
let installPrompt = null;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// sempre visível enquanto não estiver instalado: se o navegador não oferecer o
// prompt nativo, o clique abre as instruções em vez de esconder o botão
function refreshInstallButton() {
  installBtn.classList.toggle("is-hidden", isStandalone());
}

function installSteps() {
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  const isFirefox = /firefox|fxios/i.test(ua);
  const isSamsung = /samsungbrowser/i.test(ua);
  const isEdge = /edg\//i.test(ua);
  const insecure = !window.isSecureContext;

  const note = insecure
    ? `Este endereço (<code>${location.host}</code>) não é seguro, e navegadores só instalam aplicativos em <b>HTTPS</b> ou em <code>localhost</code>. Publique a pasta (veja o README) e abra o endereço <code>https://</code> para liberar a instalação.`
    : "";

  if (isIOS()) {
    return {
      intro: "No iPhone e no iPad a instalação é feita pelo Safari.",
      steps: [
        "Abra este endereço no <b>Safari</b> (não funciona pelo Chrome no iPhone).",
        "Toque no botão <b>Compartilhar</b>, o quadradinho com a seta para cima.",
        "Role a lista e toque em <b>Adicionar à Tela de Início</b>.",
        "Confirme em <b>Adicionar</b>. O ícone do Poupaê aparece junto dos outros apps.",
      ],
      note,
    };
  }

  if (isFirefox) {
    return {
      intro: "O Firefox não instala aplicativos web no computador.",
      steps: [
        "No celular, use o menu <b>⋮</b> e toque em <b>Instalar</b> ou <b>Adicionar à tela inicial</b>.",
        "No computador, abra este mesmo endereço no <b>Chrome</b> ou no <b>Edge</b> para instalar.",
      ],
      note,
    };
  }

  if (isAndroid || isSamsung) {
    return {
      intro: "No Android a instalação fica no menu do navegador.",
      steps: [
        "Toque no menu <b>⋮</b> no canto superior direito.",
        "Escolha <b>Instalar app</b> (ou <b>Adicionar à tela inicial</b>).",
        "Confirme em <b>Instalar</b>.",
      ],
      note,
    };
  }

  return {
    intro: `Para instalar no computador, use o ${isEdge ? "Edge" : "Chrome ou o Edge"}.`,
    steps: [
      "Procure o ícone de instalar na <b>barra de endereço</b>, à direita — uma telinha com uma seta para baixo.",
      `Ou abra o menu <b>${isEdge ? "…" : "⋮"}</b> e escolha <b>Instalar Poupaê</b>${isEdge ? " em Aplicativos" : ""}.`,
      "Confirme em <b>Instalar</b>. Ele passa a abrir em janela própria.",
    ],
    note,
  };
}

/* O .apk fica hospedado junto do site. Só serve para Android — no iPhone
   e no computador o arquivo não instala nada, então nem aparece. */
function apkOffer() {
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua) || /samsungbrowser/i.test(ua);
  if (!isAndroid || isIOS()) return null;
  return {
    intro: "Baixe o aplicativo e instale direto, sem passar por loja.",
    hint:
      "Ao abrir o arquivo baixado, o Android vai pedir permissão para instalar de <b>fontes desconhecidas</b> — " +
      "é o normal para qualquer app fora da Play Store. Toque em permitir e siga.",
  };
}

function openInstallHelp() {
  const { intro, steps, note } = installSteps();
  const apk = apkOffer();

  $("#installHelpIntro").innerHTML = apk ? apk.intro : intro;
  $("#apkDownload").classList.toggle("is-hidden", !apk);
  $("#apkHint").innerHTML = apk ? apk.hint : "";
  $("#apkHint").classList.toggle("is-hidden", !apk);
  $("#installOrLabel").classList.toggle("is-hidden", !apk);

  $("#installHelpSteps").innerHTML = steps.map((s) => `<li>${s}</li>`).join("");
  $("#installHelpNote").innerHTML = note;
  $("#installHelp").classList.remove("is-hidden");
}

const closeInstallHelp = () => $("#installHelp").classList.add("is-hidden");

addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();          // guarda para disparar no clique do usuário
  installPrompt = event;
  refreshInstallButton();
});

addEventListener("appinstalled", () => {
  installPrompt = null;
  refreshInstallButton();
  toast("Poupaê instalado. Abra pelo ícone do seu aparelho.");
});

async function promptInstall() {
  if (installPrompt) {
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    installPrompt = null;
    refreshInstallButton();
    if (outcome !== "accepted") toast("Instalação cancelada. O botão continua aqui.");
    return;
  }
  openInstallHelp();
}

installBtn.addEventListener("click", promptInstall);
$("#installHelpClose").addEventListener("click", closeInstallHelp);
$("#installHelp").addEventListener("click", (event) => {
  if (event.target.id === "installHelp") closeInstallHelp();
});

if ("serviceWorker" in navigator) {
  /* O service worker usa skipWaiting + clients.claim, então a versão nova
     assume o controle sozinha. Só que a página já carregada continua
     exibindo o CSS e o JS que estão na memória dela — e o app parece
     "idêntico a antes" mesmo com tudo novo publicado. Recarregar quando o
     controle troca fecha essa lacuna, sem depender de fechar o app à mão. */
  const tinhaControlador = Boolean(navigator.serviceWorker.controller);
  let recarregando = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // na primeira visita não havia controlador: trocar não é atualização
    if (!tinhaControlador || recarregando) return;
    recarregando = true;
    location.reload();
  });

  // com o app aberto por muito tempo, procura versão nova de hora em hora
  setInterval(() => {
    navigator.serviceWorker.getRegistration().then((reg) => reg && reg.update()).catch(() => {});
  }, 60 * 60 * 1000);

  addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      /* http sem TLS ou navegador sem suporte: o app segue funcionando online */
    });
  });
}

/* atalhos do manifesto: ./?tela=deposits */
function applyLaunchScreen() {
  const wanted = new URLSearchParams(location.search).get("tela");
  if (!wanted || !state.authed) return;
  if (wanted === "nova") { startNewGoal(); return; }
  if (["dashboard", "goals", "plan", "deposits", "awards", "account"].includes(wanted)) {
    showScreen(wanted);
  }
}

/* ── inicialização ───────────────────────────────────────── */
setDefaultDeadline();
goToStep(1);
render();
applyLaunchScreen();
refreshInstallButton();
/* A abertura mostra o nome com as letras saltando. Ela sai por
   setTimeout, nunca por requestAnimationFrame: em aba oculta o quadro
   não vem e o app ficaria invisível para sempre.
   6 letras a cada 95ms mais 640ms da última = ~1,2s. */
const ABERTURA_MS = motionOff ? 0 : 1180;
setTimeout(() => {
  /* solta o app primeiro e só então desvanece a abertura por cima: se o
     segundo passo falhar, o app já está à mostra do mesmo jeito */
  document.body.classList.remove("is-booting");
  if (motionOff) return;
  document.body.classList.add("is-fechando-abertura");
  setTimeout(() => document.body.classList.remove("is-fechando-abertura"), 360);
}, ABERTURA_MS);

checkReminders();
requestAnimationFrame(() => { moveGlider(); observeReveals(); });
