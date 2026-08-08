/* ============================================================
   POUPAÊ — núcleo de cálculo

   Só lógica pura: nada aqui toca no DOM, no localStorage ou em
   qualquer API do navegador. Fica separado para que a suíte de
   testes possa carregar apenas este arquivo, sem precisar montar
   a interface inteira — e para que a regra de negócio dê para ler
   sem atravessar o código de render.

   Carregado antes do app.js; ambos compartilham o escopo global.
   ============================================================ */

/* ── formatação ──────────────────────────────────────────── */
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const dateLong = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
const dateShort = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const dateTime = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/* ── catálogos ───────────────────────────────────────────── */
const AWARDS = [
  { key: "start", icon: "01", label: "Primeiro passo", target: 1, type: "deposits", text: "Conclua seu primeiro depósito." },
  { key: "ten", icon: "10", label: "Ritmo criado", target: 10, type: "deposits", text: "Complete 10 depósitos." },
  { key: "p25", icon: "25", label: "Um quarto", target: 25, type: "percent", text: "Chegue a 25% da meta." },
  { key: "p50", icon: "50", label: "Metade feita", target: 50, type: "percent", text: "Alcance 50% da sua meta." },
  { key: "p75", icon: "75", label: "Reta final", target: 75, type: "percent", text: "Passe de 75% concluído." },
  { key: "p100", icon: "100", label: "Meta conquistada", target: 100, type: "percent", text: "Complete toda a jornada." },
  { key: "s5", icon: "5×", label: "Cinco em dia", target: 5, type: "streak", text: "Pague 5 depósitos seguidos no prazo." },
  { key: "s12", icon: "12×", label: "Disciplina firme", target: 12, type: "streak", text: "Chegue a 12 seguidos sem atrasar." },
];

const REASONS = {
  reserva: "segurança financeira",
  viagem: "sua próxima viagem",
  compra: "uma compra importante",
  divida: "quitar uma dívida",
  investimento: "investir melhor",
  sonho: "tirar um sonho do papel",
};

/* ── utilidades ──────────────────────────────────────────── */
const money = (v) => Math.round((Number(v) + Number.EPSILON) * 100) / 100;

/* Três formatos chegam aqui e o ponto significa coisas diferentes:
   - "1.234,56" (máscara pt-BR): vírgula presente, ponto é milhar
   - "18.000" (máscara sem centavos): grupos exatos de 3, ponto é milhar
   - "1500.50" (legado do input number): ponto é decimal
   Tratar todo ponto como milhar fazia 1500.50 virar 150050 — cem vezes
   o valor pedido. A regra dos grupos de 3 separa os dois casos: "999.90"
   não casa (grupo de 2) e segue decimal. */
const parseMoney = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const s = String(v).trim();
  if (s.includes(",")) return Number(s.replace(/\./g, "").replace(",", ".")) || 0;
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, "")) || 0;
  return Number(s) || 0;
};

/* Texto cru -> texto do campo: só dígitos e uma vírgula, no máximo duas
   casas, milhar com ponto. Pura: não sabe de DOM nem de evento, e por
   isso nunca reinterpreta um ponto de milhar como decimal. */
const maskMoneyText = (raw) => {
  let s = String(raw ?? "").replace(/[^\d,]/g, "");
  const firstComma = s.indexOf(",");
  if (firstComma !== -1) {
    s = s.slice(0, firstComma + 1) + s.slice(firstComma + 1).replace(/,/g, "").slice(0, 2);
  }
  let [int, dec] = s.split(",");
  int = int.replace(/^0+(?=\d)/, "").slice(0, 12);
  if (dec !== undefined && int === "") int = "0";
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec === undefined ? intFmt : `${intFmt},${dec}`;
};

/* Valor -> texto do campo com máscara: "18.000" ou "1.628,50".
   Sem casas quando é inteiro, para não poluir a digitação. */
const fmtMoneyBR = (n) => {
  if (!Number.isFinite(n) || n === 0) return "";
  const hasCents = Math.round(money(n) * 100) % 100 !== 0;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n);
};

const toISO = (d) => d.toISOString().slice(0, 10);
const todayISO = () => toISO(new Date());
const createId = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate = (v) => (v ? dateLong.format(new Date(`${String(v).slice(0, 10)}T12:00:00`)) : "—");

const freqLabel = (f) => ({ daily: "diária", weekly: "semanal", monthly: "mensal" }[f] || "semanal");
const freqPlural = (f) => ({ daily: "diários", weekly: "semanais", monthly: "mensais" }[f] || "semanais");
const stratLabel = (s) => ({ fixed: "valor fixo", progressive: "progressiva", flexible: "flexível" }[s] || "valor fixo");
const stratText = (s) =>
  s === "progressive" ? "Os depósitos começam menores e crescem aos poucos."
  : s === "flexible" ? "Os valores variam de leve para dar respiro ao orçamento."
  : "Todos os depósitos seguem o mesmo valor.";

/* ── calendário do plano ─────────────────────────────────── */
function addPeriod(start, freq, i) {
  const d = new Date(start);
  if (freq === "daily") d.setDate(d.getDate() + i);
  if (freq === "weekly") d.setDate(d.getDate() + i * 7);
  if (freq === "monthly") d.setMonth(d.getMonth() + i);
  return d;
}

/* Inclusivo nas duas pontas: o primeiro depósito cai no próprio dia de
   início. É por isso que um plano semanal de um ano dá 53 depósitos. */
function countPeriods(startISO, deadlineISO, freq) {
  const start = new Date(`${startISO}T12:00:00`);
  const end = new Date(`${deadlineISO}T12:00:00`);
  if (!deadlineISO || end < start) return 1;
  let n = 0;
  while (addPeriod(start, freq, n) <= end && n < 730) n += 1;
  return Math.max(1, n);
}

/* Distribui o total entre os períodos. O resto do arredondamento vai
   para o último, senão a soma não fecha com o valor pedido. */
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
    history: [{
      at: new Date().toISOString(),
      type: "created",
      text: `Meta criada: ${currency.format(data.targetAmount)} até ${fmtDate(data.deadline)}, em ${periods} depósitos ${freqPlural(data.frequency)}.`,
    }],
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

/* ── progresso ───────────────────────────────────────────── */
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

/* Reparte os depósitos em quatro situações, no espírito da
   "discriminação" de um app de contas: o que já entrou, o que vence
   agora, o que passou do prazo e o que ainda está longe.
   `hoje` entra por parâmetro para os testes não dependerem do relógio. */
function depositBuckets(goal, hoje = new Date()) {
  const vazio = { count: 0, total: 0, percent: 0 };
  if (!goal || !goal.deposits.length) {
    return { concluidos: { ...vazio }, vencidos: { ...vazio }, proximos: { ...vazio }, futuros: { ...vazio }, total: 0 };
  }

  const limite = new Date(hoje.getTime() + 7 * 86400000);
  const b = {
    concluidos: { count: 0, total: 0, percent: 0 },
    vencidos: { count: 0, total: 0, percent: 0 },
    proximos: { count: 0, total: 0, percent: 0 },
    futuros: { count: 0, total: 0, percent: 0 },
  };

  for (const d of goal.deposits) {
    const venc = endOfDay(d.date);
    const alvo = d.paid ? b.concluidos : venc < hoje ? b.vencidos : venc <= limite ? b.proximos : b.futuros;
    alvo.count += 1;
    alvo.total = money(alvo.total + (d.paid ? d.paidAmount || d.amount : d.amount));
  }

  const total = money(Object.values(b).reduce((s, x) => s + x.total, 0));

  /* Arredondar cada fatia por conta própria faz a soma dar 99 ou 101 —
     visível num painel que mostra as quatro lado a lado. Método do maior
     resíduo: distribui o que sobrou para quem tem a maior fração. */
  const chaves = Object.keys(b);
  if (!total) {
    chaves.forEach((k) => { b[k].percent = 0; });
  } else {
    const exatos = chaves.map((k) => (b[k].total / total) * 100);
    const base = exatos.map(Math.floor);
    let resto = 100 - base.reduce((s, n) => s + n, 0);
    const ordem = chaves
      .map((k, i) => ({ i, frac: exatos[i] - base[i] }))
      .sort((x, y) => y.frac - x.frac);
    for (let n = 0; n < ordem.length && resto > 0; n += 1, resto -= 1) base[ordem[n].i] += 1;
    chaves.forEach((k, i) => { b[k].percent = base[i]; });
  }

  return { ...b, total };
}

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

/* ── consistência e leitura de comportamento ─────────────── */
/* "no prazo" é até o fim do dia previsto, não o instante da data */
const endOfDay = (iso) => new Date(`${String(iso).slice(0, 10)}T23:59:59`);
const paidOnTime = (d) => Boolean(d.paid && d.paidAt && new Date(d.paidAt) <= endOfDay(d.date));

function streakOf(goal) {
  if (!goal) return { current: 0, best: 0, onTime: 0, late: 0 };
  let run = 0, best = 0, onTime = 0, late = 0;
  for (const d of goal.deposits) {
    if (!d.paid) break; // a sequência para no primeiro pendente
    if (paidOnTime(d)) {
      run += 1;
      onTime += 1;
      if (run > best) best = run;
    } else {
      run = 0;
      late += 1;
    }
  }
  return { current: run, best, onTime, late };
}

function analyticsOf(goal) {
  const paid = goal ? goal.deposits.filter((d) => d.paid && d.paidAt) : [];
  if (!paid.length) return null;
  const dias = paid.map((d) => (endOfDay(d.date) - new Date(d.paidAt)) / 86400000);
  const media = dias.reduce((a, b) => a + b, 0) / dias.length;
  const planejado = paid.reduce((s, d) => s + d.amount, 0) / paid.length;
  const realizado = paid.reduce((s, d) => s + (d.paidAmount || d.amount), 0) / paid.length;
  return {
    total: paid.length,
    antecedencia: media, // positivo = adiantado
    planejado: money(planejado),
    realizado: money(realizado),
    ...streakOf(goal),
  };
}

/* ── histórico ───────────────────────────────────────────── */
function logHistory(goal, type, text) {
  if (!goal) return;
  if (!Array.isArray(goal.history)) goal.history = [];
  goal.history.unshift({ at: new Date().toISOString(), type, text });
  goal.history = goal.history.slice(0, 40);
}

/* ── defesa na importação ────────────────────────────────── */
/* Arquivo de backup é entrada não confiável: pode estar corrompido,
   editado à mão ou vir de uma versão antiga. Tudo é normalizado e o
   que não dá para salvar é descartado, em vez de quebrar o app. */
function sanitizeDeposit(d, i) {
  return {
    id: String(d?.id || `${i + 1}-${createId()}`),
    number: Number(d?.number) || i + 1,
    date: String(d?.date || todayISO()).slice(0, 10),
    amount: money(d?.amount) || 0,
    paid: Boolean(d?.paid),
    paidAt: d?.paid ? String(d?.paidAt || "") : "",
    paidAmount: d?.paid ? money(d?.paidAmount) || 0 : 0,
  };
}

function sanitizeGoal(g) {
  if (!g || typeof g !== "object" || !Array.isArray(g.deposits)) return null;
  const target = money(g.targetAmount);
  if (!target || target <= 0) return null;
  return {
    id: String(g.id || createId()),
    createdAt: String(g.createdAt || new Date().toISOString()),
    name: String(g.name || "Meta importada"),
    targetAmount: target,
    currentAmount: Math.max(0, money(g.currentAmount) || 0),
    deadline: String(g.deadline || todayISO()).slice(0, 10),
    frequency: ["daily", "weekly", "monthly"].includes(g.frequency) ? g.frequency : "weekly",
    strategy: ["fixed", "progressive", "flexible"].includes(g.strategy) ? g.strategy : "fixed",
    monthlyCapacity: Math.max(0, money(g.monthlyCapacity) || 0),
    reason: REASONS[g.reason] ? g.reason : "reserva",
    history: Array.isArray(g.history) ? g.history : [],
    deposits: g.deposits.map(sanitizeDeposit),
  };
}
