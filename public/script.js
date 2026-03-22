/*******************************
 * PRECISIONAI - JAVASCRIPT
 * Main application logic
 *******************************/

// ===== GLOBAL VARIABLES =====
let currentLang = localStorage.getItem('precisionai_lang') || 'pt';
let currentUser = null;
let pixState = {
  txid: null,
  pollTimer: null,
  countTimer: null,
  segundos: 1800,
  planoAtual: null,
};

// ===== SUPABASE CLIENT =====
const { createClient } = supabase;
const sb = createClient(
  'https://ofgqabsomvgisejhuhli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZ3FhYnNvbXZnaXNlamh1aGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODMwMjMsImV4cCI6MjA4Njg1OTAyM30.wVMLD4gWLKYxQCQl2uD14rjeOHSzC1UCXcNk9c4Y8HU'
);

// ===== BOT URL CONFIGURATION =====
// Para testes locais, use: "http://localhost:8080"
// Para produção/túnel, use a URL do ngrok/cloudflare ex: "https://seu-tunnel.com"
const BOT_URL = "https://frank-preceding-salem-stat.trycloudflare.com";

// ===== TRANSLATIONS =====
const TR = {
  pt: {
    nav_features:'Recursos', nav_pricing:'Planos', nav_support:'Suporte', nav_login:'Login com Google', nav_dashboard:'Dashboard', nav_logout:'Sair', nav_back:'Voltar',
    hero_badge:'v2.0 Disponível com YOLOv8',
    hero_h1a:'Domine cada partida com', hero_h1b:'IA Precision',
    hero_sub:'Domine o leaderboard com o assistente de visão computacional mais avançado do mundo. Indetectável, ultra-baixa latência, projetado para profissionais.',
    hero_trial_btn:'Teste Grátis 1h', hero_plans_btn:'Ver Planos',
    stat1:'Velocidade de Detecção', stat2:'Usuários Ativos', stat3:'Taxa de Ban', stat4:'Jogos Suportados',
    feat_title:'Projetado para Performance', feat_sub:'Arquitetura YOLOv8 para precisão incomparável.',
    feat1_h:'Detecção em Tempo Real', feat1_p:'Detecção avançada rodando a 144+ FPS. Identifica alvos instantaneamente sem impactar a performance.',
    feat2_h:'0ms de Latência', feat2_p:'Acesso direto à memória garante zero input lag. Suas ações são registradas no momento em que você pensa.',
    feat3_h:'Movimentos Humanizados', feat3_p:'Algoritmos de randomização imitam o movimento humano para contornar sistemas anti-cheat.',
    price_title:'Escolha seu Arsenal', price_sub:'Planos flexíveis para cada tipo de jogador.',
    p1_name:'Starter', p1_period:'30 dias', p1_btn:'Escolher Starter',
    p2_name:'Pro',     p2_period:'60 dias', p2_btn:'Escolher Pro',
    p3_name:'Elite',   p3_period:'90 dias', p3_btn:'Escolher Elite',
    popular_badge:'Mais Popular',
    p1_features:['Acesso completo','Todos os modelos','Suporte Discord','HWID Lock'],
    p2_features:['Tudo do Starter','Suporte prioritário','Modelos exclusivos','Auto-update','Stream Proof'],
    p3_features:['Tudo do Pro','Suporte VIP','Acesso beta','Build privado','Setup 1-para-1'],
    cta_title:'Pronto para dominar?', cta_sub:'Junte-se a milhares de jogadores elite. Teste por 1 hora completamente grátis. Sem cartão de crédito.', cta_btn:'Obter 1 Hora Grátis',
    footer_desc:'A próxima geração de assistência para jogos. Feito por gamers, para gamers.',
    footer_product:'Produto', footer_support_lbl:'Suporte',
    dash_nav1:'Dashboard', dash_nav2:'Assinatura', dash_nav3:'Downloads', dash_logout:'Sair',
    dash_subtitle:'Gerencie suas licenças', dash_status:'Sistema Online',
    dash_welcome:'Bem-vindo,', dash_welcome_sub:'Gerencie suas licenças e planos.',
    dash_my_licenses:'Minhas Licenças', dash_refresh:'Atualizar',
    dash_help_title:'Precisa de Ajuda?', dash_help_sub:'Entre no nosso Discord para suporte 24/7.',
    discord_btn:'Entrar no Discord',
    sub_title:'Adquirir novo plano', sub_sub:'Escolha o plano ideal para você.', sub_buy:'Comprar',
    login_title:'Área do Cliente', login_sub:'Entre com Google para acessar suas licenças.', login_privacy:'Seus dados são protegidos e nunca compartilhados.',
    trial_title:'Teste Grátis', trial_sub:'Entre no Discord e abra um ticket. Ativamos em minutos.', trial_note:'1 hora grátis. Sem cartão de crédito.',
    key_lbl:'Chave de Licença', key_waiting:'— Aguardando aprovação —', key_plan:'Plano', key_exp:'Expira',
    key_active:'ATIVO', key_pending:'AGUARDANDO', key_expired:'EXPIRADO', key_renew:'Renovar',
    no_key:'Nenhuma licença ativa', no_key_sub:'Adquira um plano para começar.', see_plans:'Ver Planos',
    toast_login:'Faça login primeiro!', toast_redirect:'Redirecionando para pagamento...', toast_copied:'Chave copiada!',
    dash_title_overview:'Dashboard', dash_title_subscription:'Assinatura', dash_title_downloads:'Downloads',
    down_title:'Download do Arquivo', down_sub:'Baixe a versão mais recente e atualize seu cliente quando quiser.',
    down_btn_download:'Baixar Arquivo', down_btn_update:'Atualizar Agora',
    down_info_title:'Informações da Versão', down_current_ver:'Versão instalada', down_latest_ver:'Versão mais recente', down_updated_at:'Última atualização',
    pix_expires:'Expira em', pix_copy:'Copiar', pix_copied:'Copiado!',
    pix_paid_toast:'Pagamento confirmado!',
    pix_paid_title:'Pagamento confirmado!', pix_paid_sub:'Sua licença foi ativada. Acesse o Dashboard.', pix_paid_btn:'Ver Minha Licença',
    pix_exp_title:'QR Code expirado', pix_exp_sub:'Gere uma nova cobrança para continuar.', pix_exp_btn:'Fechar',
  },
  en: {
    nav_features:'Features', nav_pricing:'Pricing', nav_support:'Support', nav_login:'Login with Google', nav_dashboard:'Dashboard', nav_logout:'Sign Out', nav_back:'Back',
    hero_badge:'v2.0 Now Available with YOLOv8',
    hero_h1a:'Master Every Match with', hero_h1b:'AI Precision',
    hero_sub:"Dominate the leaderboard with the world's most advanced computer vision assistant. Undetectable, ultra-low latency, designed for professionals.",
    hero_trial_btn:'Free Trial 1h', hero_plans_btn:'View Plans',
    stat1:'Detection Speed', stat2:'Active Users', stat3:'Ban Rate', stat4:'Supported Games',
    feat_title:'Engineered for Performance', feat_sub:'Powered by the latest YOLOv8 architecture for unmatched accuracy.',
    feat1_h:'Real-time Detection', feat1_p:'Advanced object detection running at 144+ FPS. Identifies targets instantly without impacting game performance.',
    feat2_h:'0ms Latency', feat2_p:'Direct memory access ensures zero input lag. Your actions are registered the moment you think them.',
    feat3_h:'Human-like Smoothing', feat3_p:'Configurable randomization algorithms mimic human mouse movement to bypass behavioral anti-cheat systems.',
    price_title:'Choose Your Arsenal', price_sub:'Flexible plans for every type of player.',
    p1_name:'Starter', p1_period:'30 days', p1_btn:'Choose Starter',
    p2_name:'Pro',     p2_period:'60 days', p2_btn:'Choose Pro',
    p3_name:'Elite',   p3_period:'90 days', p3_btn:'Choose Elite',
    popular_badge:'Most Popular',
    p1_features:['Full access','All models','Discord support','HWID Lock'],
    p2_features:['Everything in Starter','Priority support','Exclusive models','Auto-update','Stream Proof'],
    p3_features:['Everything in Pro','VIP support','Beta access','Private build','1-on-1 Setup'],
    cta_title:'Ready to dominate?', cta_sub:'Join thousands of elite players. Try the full experience for 1 hour, completely free. No credit card required.', cta_btn:'Get 1-Hour Free Access',
    footer_desc:'The next generation of gaming assistance. Built by gamers, for gamers.',
    footer_product:'Product', footer_support_lbl:'Support',
    dash_nav1:'Dashboard', dash_nav2:'Subscription', dash_nav3:'Downloads', dash_logout:'Sign Out',
    dash_subtitle:'Manage your licenses', dash_status:'System Online',
    dash_welcome:'Welcome back,', dash_welcome_sub:'Manage your licenses and plans.',
    dash_my_licenses:'My Licenses', dash_refresh:'Refresh',
    dash_help_title:'Need Help?', dash_help_sub:'Join our Discord community for 24/7 support.',
    discord_btn:'Join Discord',
    sub_title:'Get a new plan', sub_sub:'Choose the ideal plan for you.', sub_buy:'Buy',
    login_title:'Client Area', login_sub:'Sign in with Google to access your licenses.', login_privacy:'Your data is protected and never shared.',
    trial_title:'Free Trial', trial_sub:'Join Discord and open a ticket. We activate in minutes.', trial_note:'1 hour free. No credit card.',
    key_lbl:'License Key', key_waiting:'— Awaiting approval —', key_plan:'Plan', key_exp:'Expires',
    key_active:'ACTIVE', key_pending:'PENDING', key_expired:'EXPIRED', key_renew:'Renew',
    no_key:'No active license', no_key_sub:'Get a plan to get started.', see_plans:'View Plans',
    toast_login:'Please log in first!', toast_redirect:'Redirecting to payment...', toast_copied:'Key copied!',
    dash_title_overview:'Dashboard', dash_title_subscription:'Subscription', dash_title_downloads:'Downloads',
    down_title:'Client Download', down_sub:'Download the latest build and update your client whenever needed.',
    down_btn_download:'Download File', down_btn_update:'Update Now',
    down_info_title:'Version Information', down_current_ver:'Installed version', down_latest_ver:'Latest version', down_updated_at:'Last update',
    pix_expires:'Expires in', pix_copy:'Copy', pix_copied:'Copied!',
    pix_paid_toast:'Payment confirmed!',
    pix_paid_title:'Payment confirmed!', pix_paid_sub:'Your license has been activated. Go to Dashboard.', pix_paid_btn:'View My License',
    pix_exp_title:'QR Code expired', pix_exp_sub:'Generate a new charge to continue.', pix_exp_btn:'Close',
  },
  zh: {
    nav_features:'功能', nav_pricing:'定价', nav_support:'支持', nav_login:'使用Google登录', nav_dashboard:'控制台', nav_logout:'退出登录', nav_back:'返回',
    hero_badge:'v2.0 现已支持 YOLOv8',
    hero_h1a:'用', hero_h1b:'AI精准度 征服每场比赛',
    hero_sub:'使用世界上最先进的计算机视觉助手主导排行榜。无法检测，超低延迟，专为专业人士设计。',
    hero_trial_btn:'免费试用1小时', hero_plans_btn:'查看方案',
    stat1:'检测速度', stat2:'活跃用户', stat3:'封号率', stat4:'支持游戏',
    feat_title:'专为性能而生', feat_sub:'采用最新YOLOv8架构，精度无与伦比。',
    feat1_h:'实时检测', feat1_p:'先进的目标检测以144+ FPS运行，即时识别目标，不影响游戏性能。',
    feat2_h:'0毫秒延迟', feat2_p:'直接内存访问确保零输入延迟，您的动作在您思考的瞬间就被注册。',
    feat3_h:'人性化移动', feat3_p:'可配置的随机化算法模拟人类鼠标移动，绕过行为反作弊系统。',
    price_title:'选择您的方案', price_sub:'适合每种类型玩家的灵活计划。',
    p1_name:'入门版', p1_period:'30天', p1_btn:'选择入门版',
    p2_name:'专业版', p2_period:'60天', p2_btn:'选择专业版',
    p3_name:'精英版', p3_period:'90天', p3_btn:'选择精英版',
    popular_badge:'最受欢迎',
    p1_features:['完全访问','所有模型','Discord支持','HWID锁定'],
    p2_features:['入门版所有功能','优先支持','独家模型','自动更新','直播防录制'],
    p3_features:['专业版所有功能','VIP支持','测试版访问','私人构建','一对一设置'],
    cta_title:'准备好称霸了吗？', cta_sub:'加入数千名精英玩家。免费体验完整功能1小时，无需信用卡。', cta_btn:'获取1小时免费使用',
    footer_desc:'下一代游戏辅助工具，由玩家为玩家打造。',
    footer_product:'产品', footer_support_lbl:'支持',
    dash_nav1:'控制台', dash_nav2:'订阅', dash_nav3:'下载', dash_logout:'退出登录',
    dash_subtitle:'管理您的许可证', dash_status:'系统在线',
    dash_welcome:'欢迎回来，', dash_welcome_sub:'管理您的许可证和计划。',
    dash_my_licenses:'我的许可证', dash_refresh:'刷新',
    dash_help_title:'需要帮助？', dash_help_sub:'加入我们的Discord获取24/7支持。',
    discord_btn:'加入Discord',
    sub_title:'获取新计划', sub_sub:'选择适合您的方案。', sub_buy:'购买',
    login_title:'客户区域', login_sub:'使用Google登录以访问您的许可证。', login_privacy:'您的数据受到保护，绝不共享。',
    trial_title:'免费试用', trial_sub:'加入Discord并开启票单，几分钟内激活。', trial_note:'1小时免费，无需信用卡。',
    key_lbl:'许可证密钥', key_waiting:'— 等待审批 —', key_plan:'计划', key_exp:'到期',
    key_active:'活跃', key_pending:'等待中', key_expired:'已过期', key_renew:'续费',
    no_key:'没有活跃许可证', no_key_sub:'购买一个计划开始使用。', see_plans:'查看方案',
    toast_login:'请先登录！', toast_redirect:'正在跳转到支付页面...', toast_copied:'密钥已复制！',
    dash_title_overview:'控制台', dash_title_subscription:'订阅', dash_title_downloads:'下载',
    down_title:'客户端下载', down_sub:'下载最新文件并随时更新您的客户端。',
    down_btn_download:'下载文件', down_btn_update:'立即更新',
    down_info_title:'版本信息', down_current_ver:'已安装版本', down_latest_ver:'最新版本', down_updated_at:'最后更新',
    pix_expires:'到期时间', pix_copy:'复制', pix_copied:'已复制！',
    pix_paid_toast:'付款已确认！',
    pix_paid_title:'付款已确认！', pix_paid_sub:'您的许可证已激活，请访问控制台。', pix_paid_btn:'查看我的许可证',
    pix_exp_title:'二维码已过期', pix_exp_sub:'重新生成订单以继续。', pix_exp_btn:'关闭',
  }
};

const LANG_META = {
  pt:{ flag:'🇧🇷', label:'PT' },
  en:{ flag:'🇺🇸', label:'EN' },
  zh:{ flag:'🇨🇳', label:'中文' }
};

const CHECK_GRAY   = `<svg class="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
const CHECK_PURPLE = `<svg class="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;

// ===== UTILITY FUNCTIONS =====
function t(key) { 
  return TR[currentLang]?.[key] ?? TR['en'][key] ?? key; 
}

// Simple HTML sanitizer to prevent XSS
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(msg, type='ok') {
  const el = document.getElementById('toast');
  const inner = document.getElementById('toast-inner');
  const colors = { 
    ok: 'border-purple-500/50 text-purple-300', 
    success: 'border-green-500/50 text-green-300', 
    error: 'border-red-500/50 text-red-300' 
  };
  
  inner.className = `bg-[#1a1a1a] border rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${colors[type]||colors.ok}`;
  inner.textContent = msg;
  el.className = 'fixed bottom-6 right-6 z-[9999] transform translate-y-0 opacity-100 transition-all duration-300';
  
  setTimeout(() => { 
    el.className = 'fixed bottom-6 right-6 z-[9999] transform translate-y-20 opacity-0 transition-all duration-300'; 
  }, 3000);
}

function scrollToId(id) { 
  document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); 
}

// ===== LANGUAGE FUNCTIONS =====
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('precisionai_lang', lang);
  const t = TR[lang];

  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update all flag/label indicators
  const m = LANG_META[lang];
  [['flag-main','lbl-main'],['flag-mob','lbl-mob'],['flag-dash','lbl-dash']].forEach(([f,l]) => {
    const fe = document.getElementById(f), le = document.getElementById(l);
    if(fe) fe.textContent = m.flag;
    if(le) le.textContent = m.label;
  });

  // Active state on desktop dropdown
  ['pt','en','zh'].forEach(l => {
    const b = document.getElementById('opt-main-'+l);
    if(b) b.className = l === lang ? 'lang-active' : '';
  });

  // Pricing feature lists
  const lists = [
    { id:'p1-features', items: t.p1_features, check: CHECK_GRAY },
    { id:'p2-features', items: t.p2_features, check: CHECK_PURPLE },
    { id:'p3-features', items: t.p3_features, check: CHECK_GRAY },
  ];
  
  lists.forEach(({id, items, check}) => {
    const ul = document.getElementById(id);
    if(ul) ul.innerHTML = items.map(f => `<li class="flex items-start gap-3 text-sm text-gray-300">${check}${f}</li>`).join('');
  });

  // Close all dropdowns
  closeAllDrops();

  // Re-render keys with new language if dashboard is visible
  if (!document.getElementById('page-dashboard').classList.contains('hidden') && currentUser) {
    loadKeys();
  }
}

function setLang(lang) { 
  applyLang(lang); 
}

// ===== DROPDOWN FUNCTIONS =====
function toggleDrop(id) {
  const el = document.getElementById(id);
  if(!el) return;
  const wasHidden = el.classList.contains('hidden');
  closeAllDrops();
  if(wasHidden) el.classList.remove('hidden');
}

function closeAllDrops() {
  ['drop-main','drop-mob','drop-dash','drop-user-main','drop-user-mob'].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
}

// ===== PAGE NAVIGATION =====
function showPage(page) {
  ['landing','dashboard'].forEach(p => document.getElementById('page-'+p).classList.add('hidden'));
  document.getElementById('page-'+page).classList.remove('hidden');
}

function showView(view) {
  ['overview','subscription','downloads'].forEach(v => {
    document.getElementById('view-'+v).classList.add('hidden');
    const btn = document.getElementById('nav-'+v);
    if(btn) btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-white/5 hover:text-white';
  });
  
  document.getElementById('view-'+view).classList.remove('hidden');
  const active = document.getElementById('nav-'+view);
  if(active) active.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-purple-600 text-white';
  document.getElementById('view-title').textContent = t('dash_title_'+view);
}

function goToDashboard() {
  showPage('dashboard');
  showView('overview');
  closeAllDrops();
}

// ===== MODAL FUNCTIONS =====
function openModal(id)  { 
  document.getElementById('modal-'+id).classList.remove('hidden'); 
}

function closeModal(id) { 
  document.getElementById('modal-'+id).classList.add('hidden'); 
}

// ===== AUTH FUNCTIONS =====
sb.auth.onAuthStateChange((event, session) => {
  if (session?.user) { 
    currentUser = session.user; 
    showDash(session.user); 
  } else { 
    currentUser = null; 
    showPage('landing'); 
    clearLandingUserUI();
  }
});

async function loginGoogle() {
  const {error} = await sb.auth.signInWithOAuth({ 
    provider:'google', 
    options:{ redirectTo: window.location.href } 
  });
  
  if(error) showToast('Erro: '+error.message, 'error');
}

async function logout() { 
  await sb.auth.signOut(); 
  showPage('landing');
  clearLandingUserUI();
}

function showDash(user) {
  closeModal('login');
  showPage('dashboard');
  showView('downloads');
  const name = user.user_metadata?.full_name || user.email.split('@')[0];
  document.getElementById('welcome-name').textContent = name;
  document.getElementById('dash-name').textContent = name;
  document.getElementById('dash-email').textContent = user.email;
  
  const av = document.getElementById('dash-avatar');
  if(user.user_metadata?.avatar_url) { 
    av.src = user.user_metadata.avatar_url; 
    av.classList.remove('hidden'); 
  }
  
  updateLandingUserUI(user);
  loadKeys();
}

// ===== USER UI FUNCTIONS =====
function updateLandingUserUI(user) {
  const name = user.user_metadata?.full_name || user.email.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url || '';
  
  // Atualizar desktop
  document.getElementById('user-name-main').textContent = name;
  if (avatarUrl) {
    document.getElementById('user-avatar-main').src = avatarUrl;
  } else {
    document.getElementById('user-avatar-main').src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMTQiIGZpbGw9IiM4NTU4ZjciLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
  }
  
  // Atualizar mobile
  if (avatarUrl) {
    document.getElementById('user-avatar-mobile').src = avatarUrl;
  } else {
    document.getElementById('user-avatar-mobile').src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM4NTU4ZjciLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
  }
  
  // Mostrar menus de usuário e esconder botão de login
  document.getElementById('user-menu-desktop').classList.remove('hidden');
  document.getElementById('user-menu-mobile').classList.remove('hidden');
  document.getElementById('login-btn-desktop').classList.add('hidden');
  document.getElementById('login-btn-mobile').classList.add('hidden');
}

function clearLandingUserUI() {
  // Esconder menus de usuário e mostrar botão de login
  document.getElementById('user-menu-desktop').classList.add('hidden');
  document.getElementById('user-menu-mobile').classList.add('hidden');
  document.getElementById('login-btn-desktop').classList.remove('hidden');
  document.getElementById('login-btn-mobile').classList.remove('hidden');
}

// ===== LICENSE FUNCTIONS =====
async function loadKeys() {
  if(!currentUser) return;
  const c = document.getElementById('keys-container');
  c.innerHTML = '<div class="flex justify-center py-8"><svg class="w-5 h-5 text-purple-400 spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg></div>';
  
  try {
    const {data, error} = await sb.from('licenses').select('*').eq('email', currentUser.email).order('created_at', {ascending:false});
    if(error) throw error;
    
    if(!data || data.length === 0) {
      c.innerHTML = `<div class="text-center py-12">
        <div class="text-4xl mb-4">🔑</div>
        <h3 class="font-bold text-lg mb-2">${t('no_key')}</h3>
        <p class="text-gray-500 text-sm mb-4">${t('no_key_sub')}</p>
        <button onclick="showView('subscription')" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-bold transition-colors">${t('see_plans')}</button>
      </div>`;
      return;
    }
    
    c.innerHTML = data.map(k => {
      const exp = k.expires_at ? new Date(k.expires_at).toLocaleDateString() : 'N/A';
      const estadoLicenca = classificarLicenca(k);
      const isActive = estadoLicenca === 'active';
      const isPending = estadoLicenca === 'pending';
      const isExpired = estadoLicenca === 'expired';
      const cls = isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : isPending ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
      const lbl = isActive ? t('key_active') : isPending ? t('key_pending') : t('key_expired');
      const safeKey = escapeHTML(k.key || '');
      const safePlano = escapeHTML(k.plano || '—');
      const planoRenovacao = mapearPlanoParaCodigo(k.plano);
      
      return `<div class="p-5 bg-black/30 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all mb-3">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">${t('key_lbl')}</div>
            <div class="mono text-purple-300 text-sm tracking-wider mb-2 truncate">${safeKey || escapeHTML(t('key_waiting'))}</div>
            <div class="text-xs text-gray-500">${t('key_plan')}: <span class="text-gray-300">${safePlano}</span> · ${t('key_exp')}: <span class="text-gray-300">${escapeHTML(exp)}</span></div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${k.key ? `<button onclick="copyKey('${safeKey.replace(/'/g, "\\'")}')" class="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>` : ''}
            <span class="px-2 py-1 rounded-full text-xs font-bold border ${cls}">${lbl}</span>
            ${isExpired && planoRenovacao ? `<button onclick="renovarLicenca('${escapeHTML(planoRenovacao)}')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 transition-colors">${t('key_renew')}</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    c.innerHTML = `<div class="text-center py-8 text-red-400 text-sm">Error: ${escapeHTML(e.message)}</div>`;
  }
}

function copyKey(key) {
  navigator.clipboard.writeText(key).then(() => showToast(t('toast_copied'), 'success'));
}

// ===== PIX PAYMENT FUNCTIONS =====
const PLANO_INFO = {
  "30": { nome_pt:"Starter · 30 dias", nome_en:"Starter · 30 days", nome_zh:"入门版 · 30天", valor:"R$ 25,00" },
  "60": { nome_pt:"Pro · 60 dias",     nome_en:"Pro · 60 days",     nome_zh:"专业版 · 60天", valor:"R$ 40,00" },
  "90": { nome_pt:"Elite · 90 dias",   nome_en:"Elite · 90 days",   nome_zh:"精英版 · 90天", valor:"R$ 55,00" },
};

function mapearPlanoParaCodigo(plano) {
  const p = String(plano || '').trim().toLowerCase();
  if (!p) return null;
  if (p === '30' || p.includes('30') || p.includes('starter') || p === 'pro') return '30';
  if (p === '60' || p.includes('60') || p.includes('pro+')) return '60';
  if (p === '90' || p.includes('90') || p.includes('max') || p.includes('elite')) return '90';
  return null;
}

function classificarLicenca(k) {
  const status = String(k.status || '').toLowerCase();
  const expDate = k.expires_at ? new Date(k.expires_at) : null;
  const expirouPorData = expDate instanceof Date && !Number.isNaN(expDate.getTime()) && expDate.getTime() <= Date.now();

  if (status === 'pending') return 'pending';
  if (status === 'active' && !expirouPorData) return 'active';
  return 'expired';
}

function renovarLicenca(plano) {
  iniciarCompra(plano);
}

function baixarCliente() {
  const url = 'https://seu-link-de-download-aqui.com/PrecisionAI.zip';
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function iniciarCompra(plano) {
  const {data:{session}} = await sb.auth.getSession();
  if(!session) { 
    showToast(t('toast_login'), 'error'); 
    openModal('login'); 
    return; 
  }

  pixState.planoAtual = plano;
  abrirModalPix();
  mostrarEstado('loading');

  try {
    const resp = await fetch(`${BOT_URL}/api/v1/payments/pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ plano })
    });
    
    if(!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.erro || `HTTP ${resp.status}`);
    }
    const data  = await resp.json();

    pixState.txid    = data.txid;
    pixState.segundos = data.expiracao || 1800;

    // Preenche UI
    const info = PLANO_INFO[plano];
    const nomeLang = currentLang === 'zh' ? info.nome_zh : (currentLang === 'en' ? info.nome_en : info.nome_pt);
    document.getElementById('pix-plan-label').textContent = nomeLang;
    document.getElementById('pix-valor').textContent      = info.valor;
    document.getElementById('pix-img').src                = data.imagemQrcode;
    document.getElementById('pix-code').value             = data.qrcode;

    mostrarEstado('qr');
    iniciarTimer();
    iniciarPolling();

  } catch(e) {
    mostrarEstado('loading');
    document.querySelector('#pix-loading p').textContent = '❌ Erro ao gerar PIX. Tente novamente.';
    console.error('[PIX]', e);
  }
}

function abrirModalPix() {
  document.getElementById('modal-pix').classList.remove('hidden');
}

function fecharPix() {
  document.getElementById('modal-pix').classList.add('hidden');
  pararTimers();
  pixState.txid = null;
}

function mostrarEstado(estado) {
  ['loading','qr','pago','expirado'].forEach(s => {
    const el = document.getElementById('pix-'+s);
    if(el) { 
      el.classList.add('hidden'); 
      el.classList.remove('flex'); 
    }
  });
  
  const alvo = document.getElementById('pix-'+estado);
  if(alvo) { 
    alvo.classList.remove('hidden'); 
    alvo.classList.add('flex'); 
    alvo.classList.add('flex-col'); 
  }
}

function iniciarTimer() {
  pararTimer();
  atualizarTimer();
  pixState.countTimer = setInterval(() => {
    pixState.segundos--;
    if(pixState.segundos <= 0) {
      pararTimers();
      mostrarEstado('expirado');
      traduzirExpirado();
    } else {
      atualizarTimer();
    }
  }, 1000);
}

function atualizarTimer() {
  const m = String(Math.floor(pixState.segundos / 60)).padStart(2,'0');
  const s = String(pixState.segundos % 60).padStart(2,'0');
  const el = document.getElementById('pix-timer');
  if(el) el.textContent = `${t('pix_expires')} ${m}:${s}`;
  
  // Piscar vermelho nos últimos 60s
  if(pixState.segundos <= 60 && el) el.classList.add('text-red-400');
}

function pararTimer()  { 
  if(pixState.countTimer) { 
    clearInterval(pixState.countTimer); 
    pixState.countTimer = null; 
  } 
}

function pararTimers() { 
  pararTimer(); 
  if(pixState.pollTimer) { 
    clearInterval(pixState.pollTimer); 
    pixState.pollTimer = null; 
  } 
}

function iniciarPolling() {
  if(pixState.pollTimer) clearInterval(pixState.pollTimer);
  pixState.pollTimer = setInterval(async () => {
    if(!pixState.txid) return;
    try {
      const res  = await fetch(`${BOT_URL}/pix/status?txid=${pixState.txid}`);
      const data = await res.json();
      if(data.status === 'CONCLUIDA') {
        pararTimers();
        mostrarEstado('pago');
        traduzirPago();
        showToast('🎉 ' + t('pix_paid_toast'), 'success');
        
        // Recarrega licenças se dashboard aberto
        if(!document.getElementById('page-dashboard').classList.contains('hidden')) {
          setTimeout(loadKeys, 1000);
        }
      }
    } catch(e) { 
      /* silencioso */ 
    }
  }, 5000);
}

function copiarPix() {
  const code = document.getElementById('pix-code').value;
  if(!code) return;
  
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('pix-copy-btn');
    btn.textContent = '✓ ' + t('pix_copied');
    setTimeout(() => { 
      btn.textContent = t('pix_copy'); 
    }, 2000);
    showToast(t('pix_copied'), 'success');
  });
}

function traduzirPago() {
  document.getElementById('pago-titulo').textContent = t('pix_paid_title');
  document.getElementById('pago-sub').textContent    = t('pix_paid_sub');
  document.getElementById('pago-btn').textContent    = t('pix_paid_btn');
}

function traduzirExpirado() {
  document.getElementById('exp-titulo').textContent = t('pix_exp_title');
  document.getElementById('exp-sub').textContent    = t('pix_exp_sub');
  document.getElementById('exp-btn').textContent    = t('pix_exp_btn');
}

// ===== EVENT LISTENERS =====
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-wrap') && !e.target.closest('.user-wrap')) closeAllDrops();
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  applyLang(currentLang);
  checkAuthState();
});

// Verificar estado de autenticação ao carregar
async function checkAuthState() {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    updateLandingUserUI(currentUser);
  } else {
    clearLandingUserUI();
  }
}
