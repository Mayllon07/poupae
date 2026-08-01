/* ============================================================
   POUPAÊ AURORA — lógica, render e motor de animação
   Dados compatíveis com a versão anterior (mesmas chaves).
   ============================================================ */

const ACCOUNTS_KEY = "poupae:accounts:v1";
const USER_KEY = "poupae:user:v1";
const SESSION_KEY = "poupae:session:v1";
const THEME_KEY = "poupae:theme";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const dateLong = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
const dateShort = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const AWARDS = [
  { key: "start", icon: "01", label: "Primeiro passo", target: 1, type: "deposits", text: "Conclua seu primeiro depósito." },
  { key: "ten", icon: "10", label: "Ritmo criado", target: 10, type: "deposits", text: "Complete 10 depósitos." },
  { key: "p25", icon: "25", label: "Um quarto", target: 25, type: "percent", text: "Chegue a 25% da meta." },
  { key: "p50", icon: "50", label: "Metade feita", target: 50, type: "percent", text: "Alcance 50% da sua meta." },
  { key: "p75", icon: "75", label: "Reta final", target: 75, type: "percent", text: "Passe de 75% concluído." },
  { key: "p100", icon: "100", label: "Meta conquistada", target: 100, type: "percent", text: "Complete toda a jornada." },
];

const REASONS = {
  reserva: "segurança financeira",
  viagem: "sua próxima viagem",
  compra: "uma compra importante",
  divida: "quitar uma dívida",
  investimento: "investir melhor",
  sonho: "tirar um sonho do papel",
};

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
  themeBtn: $("#themeBtn"),
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
  recalcBtn: $("#recalcBtn"),
  chartCaption: $("#chartCaption"),
  planHealth: $("#planHealth"),
  planChart: $("#planChart"),
  chartTip: $("#chartTip"),
  planTable: $("#planTable"),
  planDetails: $("#planDetails"),

  depositSearch: $("#depositSearch"),
  depositFilter: $("#depositFilter"),
  depositList: $("#depositList"),
  awardsPill: $("#awardsPill"),
  awardsList: $("#awardsList"),

  accountForm: $("#accountForm"),
  accountName: $("#accountName"),
  accountEmail: $("#accountEmail"),
  accountCurrentPassword: $("#accountCurrentPassword"),
  accountNewPassword: $("#accountNewPassword"),
  deleteAccountBtn: $("#deleteAccountBtn"),

  cmdPalette: $("#cmdPalette"),
  cmdInput: $("#cmdInput"),
  cmdList: $("#cmdList"),
  cmdOpen: $("#cmdOpen"),

  toast: $("#toast"),
  confetti: $("#confetti"),
  field: $("#fieldCanvas"),
  spotlight: $("#spotlight"),
};

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
  theme: localStorage.getItem(THEME_KEY) || "dark",
};

/* ── utilidades de domínio ───────────────────────────────── */
const money = (v) => Math.round((Number(v) + Number.EPSILON) * 100) / 100;
const parseMoney = (v) => (!v ? 0 : Number(String(v).replace(/\./g, "").replace(",", ".")) || 0);
const toISO = (d) => d.toISOString().slice(0, 10);
const todayISO = () => toISO(new Date());
const createId = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate = (v) => (v ? dateLong.format(new Date(`${String(v).slice(0, 10)}T12:00:00`)) : "—");

function addPeriod(start, freq, i) {
  const d = new Date(start);
  if (freq === "daily") d.setDate(d.getDate() + i);
  if (freq === "weekly") d.setDate(d.getDate() + i * 7);
  if (freq === "monthly") d.setMonth(d.getMonth() + i);
  return d;
}

function countPeriods(startISO, deadlineISO, freq) {
  const start = new Date(`${startISO}T12:00:00`);
  const end = new Date(`${deadlineISO}T12:00:00`);
  if (!deadlineISO || end < start) return 1;
  let n = 0;
  while (addPeriod(start, freq, n) <= end && n < 730) n += 1;
  return Math.max(1, n);
}

function buildAmounts(total, periods, strategy) {
  if (periods <= 1) return [money(total)];
  let w = Array.from({ length: periods }, () => 1);
  if (strategy === "progressive") w = w.map((_, i) => i + 1);
  if (strategy === "flexible") w = w.map((_, i) => 0.72 + (i / (periods - 1)) * 0.56);
  const sum = w.reduce((a, b) => a + b, 0);
  const out = w.map((x) => money((total * x) / sum));
  const diff = money(total - out.reduce((a, b) => a + b, 0));
  out[out.length - 1] = money(out.at(-1) + diff);
  return out;
}

function createPlan(data) {
  const startISO = todayISO();
  const need = Math.max(0, data.targetAmount - data.currentAmount);
  const periods = countPeriods(startISO, data.deadline, data.frequency);
  const amounts = buildAmounts(need, periods, data.strategy);
  const start = new Date(`${startISO}T12:00:00`);
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...data,
    deposits: amounts.map((amount, i) => ({
      id: `${i + 1}-${createId()}`,
      number: i + 1,
      date: toISO(addPeriod(start, data.frequency, i)),
      amount,
      paid: false,
      paidAt: "",
      paidAmount: 0,
    })),
  };
}

function statsOf(goal) {
  if (!goal) return { saved: 0, remaining: 0, percent: 0, paid: [], next: null, days: 0 };
  const paid = goal.deposits.filter((d) => d.paid);
  const paidTotal = paid.reduce((s, d) => s + (d.paidAmount || d.amount), 0);
  const saved = money(goal.currentAmount + paidTotal);
  const remaining = Math.max(0, money(goal.targetAmount - saved));
  const percent = Math.min(100, (saved / goal.targetAmount) * 100 || 0);
  const next = goal.deposits.find((d) => !d.paid) || null;
  const days = Math.max(0, Math.ceil((new Date(`${goal.deadline}T12:00:00`) - new Date()) / 86400000));
  return { saved, remaining, percent, paid, next, days };
}

const freqLabel = (f) => ({ daily: "diária", weekly: "semanal", monthly: "mensal" }[f] || "semanal");
const freqPlural = (f) => ({ daily: "diários", weekly: "semanais", monthly: "mensais" }[f] || "semanais");
const stratLabel = (s) => ({ fixed: "valor fixo", progressive: "progressiva", flexible: "flexível" }[s] || "valor fixo");
const stratText = (s) =>
  s === "progressive" ? "Os depósitos começam menores e crescem aos poucos."
  : s === "flexible" ? "Os valores variam de leve para dar respiro ao orçamento."
  : "Todos os depósitos seguem o mesmo valor.";

function monthlyRequired(goal) {
  if (!goal || !goal.deposits.length) return 0;
  const avg = goal.deposits.reduce((s, d) => s + d.amount, 0) / goal.deposits.length;
  if (goal.frequency === "daily") return money(avg * 30);
  if (goal.frequency === "weekly") return money(avg * 4.33);
  return money(avg);
}

function healthOf(goal) {
  if (!goal) return { label: "Sem meta", tone: "neutral", title: "Crie sua primeira meta", text: "O Poupaê monta o plano assim que você informar o destino." };
  const need = monthlyRequired(goal);
  const cap = goal.monthlyCapacity;
  if (!cap) return { label: "Plano criado", tone: "neutral", title: "Você já tem uma rota clara", text: `A média é de ${currency.format(need)} por mês. Ajuste a frequência se quiser mais folga.` };
  if (need <= cap) return { label: "Confortável", tone: "good", title: "Seu plano cabe no perfil informado", text: `Você informou ${currency.format(cap)} por mês e o plano pede cerca de ${currency.format(need)}.` };
  return { label: "Apertado", tone: "warn", title: "Seu prazo exige atenção", text: `O plano pede cerca de ${currency.format(need)} por mês, acima dos ${currency.format(cap)} informados. Ampliar o prazo ajuda.` };
}

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

/* campo de partículas */
(function particleField() {
  if (motionOff) return;
  const cvs = els.field;
  const ctx = cvs.getContext("2d");
  let w, h, dots = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cvs.width = innerWidth * dpr;
    h = cvs.height = innerHeight * dpr;
    cvs.style.width = `${innerWidth}px`;
    cvs.style.height = `${innerHeight}px`;
    const count = Math.round((innerWidth * innerHeight) / 26000);
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.7 + 0.4) * dpr,
      s: (Math.random() * 0.24 + 0.06) * dpr,
      a: Math.random() * Math.PI * 2,
      o: Math.random() * 0.45 + 0.12,
    }));
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    const light = document.documentElement.dataset.theme === "light";
    for (const d of dots) {
      d.y -= d.s;
      d.a += 0.008;
      d.x += Math.sin(d.a) * 0.22;
      if (d.y < -6) { d.y = h + 6; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = light ? `rgba(15,157,110,${d.o * 0.5})` : `rgba(150,255,214,${d.o})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(tick);
})();

/* luz que segue o cursor */
(function spotlight() {
  if (motionOff) return;
  let tx = innerWidth / 2, ty = innerHeight * 0.3, cx = tx, cy = ty;
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const loop = () => {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    els.spotlight.style.setProperty("--mx", `${cx}px`);
    els.spotlight.style.setProperty("--my", `${cy}px`);
    requestAnimationFrame(loop);
  };
  loop();
})();

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

/* toast */
let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  els.toast.querySelector("b").textContent = message;
  const bar = els.toast.querySelector("i");
  bar.style.animation = "none";
  void bar.offsetWidth;
  bar.style.animation = "";
  els.toast.classList.add("is-on");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-on"), 2900);
}

/* ── render ──────────────────────────────────────────────── */
function render() {
  applyTheme();
  renderAuth();
  if (!state.authed) return;
  renderChrome();
  renderNav();
  renderAccount();
  renderGoals();
  if (!state.goal) return;
  renderDashboard();
  renderRoute();
  renderPlan();
  renderDeposits();
  renderAwards();
  observeReveals();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.body.dataset.mode = state.theme;
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

  els.heroChips.innerHTML = [
    `Meta ${currency.format(goal.targetAmount)}`,
    `${goal.deposits.length} depósitos`,
    `Até ${fmtDate(goal.deadline)}`,
  ].map((t) => `<span class="pill">${t}</span>`).join("");

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
        <button class="mini-btn" data-dep="${d.id}" type="button">${d.paid ? "Desfazer" : "Pagar"}</button>
      </div>
    </article>`).join("");
}

/* conquistas */
function renderAwards() {
  const st = statsOf(state.goal);
  let done = 0;
  els.awardsList.innerHTML = AWARDS.map((a, i) => {
    const ok = a.type === "percent" ? st.percent >= a.target : st.paid.length >= a.target;
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
  els.goalAmount.value = state.goal.targetAmount;
  els.currentAmount.value = st.saved;
  els.deadline.value = state.goal.deadline;
  els.frequency.value = state.goal.frequency;
  els.monthlyCapacity.value = state.goal.monthlyCapacity || "";
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

function deleteGoal(id) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal || !confirm(`Excluir a meta "${goal.name}"?`)) return;
  state.goals = state.goals.filter((g) => g.id !== id);
  if (state.goal?.id === id) state.goal = state.goals[0] || null;
  saveGoals();
  if (!state.goal) localStorage.removeItem(activeKey());
  render();
  toast("Meta excluída.");
}

function showScreen(screen) {
  state.screen = screen;
  if (!["account", "goals"].includes(screen) && !state.goal) state.screen = "dashboard";
  if (screen !== "dashboard") state.editing = false;
  els.avatarMenu.classList.remove("is-open");
  render();
  window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" });
}

/* ── autenticação ────────────────────────────────────────── */
const encode = (v) => {
  try {
    return btoa(Array.from(new TextEncoder().encode(v), (b) => String.fromCharCode(b)).join(""));
  } catch { return v; }
};

function setAuthMode(mode) {
  state.authMode = mode;
  els.authForm.reset();
  els.remember.checked = true;
  els.authPassword.type = "password";
  els.togglePass.textContent = "Mostrar";
  renderAuth();
}

function handleAuth(event) {
  event.preventDefault();
  const email = els.authEmail.value.trim().toLowerCase();
  const password = els.authPassword.value;

  if (state.authMode === "register") {
    const name = els.authName.value.trim();
    if (!name) return toast("Informe seu nome para criar a conta.");
    if (state.accounts[email]) { setAuthMode("login"); els.authEmail.value = email; return toast("Já existe uma conta com este e-mail."); }
    if (password.length < 6) return toast("Use uma senha com pelo menos 6 caracteres.");

    const account = { name, email, passwordHash: encode(password), createdAt: new Date().toISOString() };
    state.accounts[email] = account;
    saveAccounts();
    signIn(account, "Conta criada. Bem-vindo ao Poupaê.");
    return;
  }

  const account = state.accounts[email];
  if (!account) { setAuthMode("register"); els.authEmail.value = email; return toast("Conta não encontrada. Crie uma neste dispositivo."); }
  if (encode(password) !== account.passwordHash) return toast("E-mail ou senha incorretos.");
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

function updateAccount(event) {
  event.preventDefault();
  const name = els.accountName.value.trim();
  const cur = els.accountCurrentPassword.value;
  const next = els.accountNewPassword.value;
  if (!name) return toast("Informe um nome para a conta.");

  const account = state.accounts[state.user.email];
  if (!account) { logout(); return toast("Conta não encontrada neste navegador."); }

  if (next) {
    if (encode(cur) !== account.passwordHash) return toast("Digite a senha atual para trocar a senha.");
    if (next.length < 6) return toast("A nova senha precisa ter ao menos 6 caracteres.");
    account.passwordHash = encode(next);
  }
  account.name = name;
  state.accounts[state.user.email] = account;
  state.user = account;
  saveAccounts();
  render();
  toast(next ? "Conta e senha atualizadas." : "Conta atualizada.");
}

function deleteAccount() {
  if (!confirm("Excluir sua conta local? Isso apaga suas metas neste navegador.")) return;
  const email = state.user.email;
  delete state.accounts[email];
  saveAccounts();
  localStorage.removeItem(goalsKey(email));
  localStorage.removeItem(activeKey(email));
  logout();
  toast("Conta excluída deste dispositivo.");
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
    { label: `Mudar para tema ${state.theme === "dark" ? "claro" : "escuro"}`, hint: "Ação", run: toggleTheme },
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

/* ── tema ────────────────────────────────────────────────── */
function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, state.theme);
  render();
  if (state.goal) renderChart();
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

  const previousId = wasEditing ? state.goal?.id : null;
  state.goal = createPlan(data);
  if (previousId) state.goal.id = previousId;
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
  els.goalAmount.value = "18000";
  els.currentAmount.value = "1200";
  els.frequency.value = "weekly";
  els.monthlyCapacity.value = "1400";
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
els.themeBtn.addEventListener("click", toggleTheme);
els.payBtn.addEventListener("click", payNext);
els.recalcBtn.addEventListener("click", recalculate);
els.accountForm.addEventListener("submit", updateAccount);
els.deleteAccountBtn.addEventListener("click", deleteAccount);

els.avatarBtn.addEventListener("click", (e) => { e.stopPropagation(); els.avatarMenu.classList.toggle("is-open"); });
document.addEventListener("click", () => els.avatarMenu.classList.remove("is-open"));
els.avatarMenu.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-screen]");
  if (nav) return showScreen(nav.dataset.screen);
  const open = event.target.closest("[data-open]");
  if (open) return openGoal(open.dataset.open);
  const del = event.target.closest("[data-del]");
  if (del) return deleteGoal(del.dataset.del);
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
  if (els.cmdPalette.classList.contains("is-hidden")) return;
  if (event.key === "Escape") closeCmd();
  if (event.key === "ArrowDown") { event.preventDefault(); cmdIndex += 1; renderCmd(); }
  if (event.key === "ArrowUp") { event.preventDefault(); cmdIndex = Math.max(0, cmdIndex - 1); renderCmd(); }
  if (event.key === "Enter") { event.preventDefault(); runCmd(); }
});

/* topo que recolhe ao rolar */
let lastY = window.scrollY;
addEventListener("scroll", () => {
  const y = window.scrollY;
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

function openInstallHelp() {
  const { intro, steps, note } = installSteps();
  $("#installHelpIntro").innerHTML = intro;
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
requestAnimationFrame(() => { moveGlider(); observeReveals(); });
