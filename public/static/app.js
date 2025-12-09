// Translations
const translations = {
  ko: {
    subtitle: '프로젝트가 자본을 만나는 곳',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: '개발자, 전략적 투자자 조달 허브',
    type_investment: '투자',
    type_revenue: '수익분배',
    type_startup: '창업희망',
    loading: '프로젝트를 불러오는 중...',
    no_projects: '등록된 프로젝트가 없습니다',
    footer_title: '프로젝트가 자본을 만나는 곳',
    video_label: '영상 보기',
    detail_title: '프로젝트 상세 정보',
    admin_title: '관리자 페이지',
    admin_home: '메인',
    new_project: '새 프로젝트',
    registered_projects: '등록된 프로젝트',
    project_name: '프로젝트명',
    description: '한줄 소개',
    category: '카테고리',
    funding_type: '자금 방식',
    amount: '희망 금액 (USD $)',
    youtube_links: '유튜브 링크 (최대 5개)',
    youtube_link: '유튜브 링크',
    text_info: '텍스트 정보',
    cancel: '취소',
    save: '저장',
    edit: '수정',
    delete: '삭제',
    confirm_delete: '삭제하시겠습니까?',
    success_added: '✅ 추가되었습니다',
    success_updated: '✅ 수정되었습니다',
    success_deleted: '삭제되었습니다',
    error_save: '❌ 저장 오류: ',
    error_delete: '삭제 중 오류가 발생했습니다',
    select: '선택',
    category_app: '앱',
    category_web: '웹플랫폼',
    category_o2o: 'O2O',
    category_game: '게임',
    category_etc: '기타',
    click_to_play: '클릭하여 재생'
  },
  en: {
    subtitle: 'Where Projects Meet Capital',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: 'Developer & Strategic Investor Hub',
    type_investment: 'Investment',
    type_revenue: 'Revenue Share',
    type_startup: 'Startup',
    loading: 'Loading projects...',
    no_projects: 'No projects registered',
    footer_title: 'Where Projects Meet Capital',
    video_label: 'Watch Video',
    detail_title: 'Project Details',
    admin_title: 'Admin Panel',
    admin_home: 'Home',
    new_project: 'New Project',
    registered_projects: 'Registered Projects',
    project_name: 'Project Name',
    description: 'Description',
    category: 'Category',
    funding_type: 'Funding Type',
    amount: 'Target Amount (USD $)',
    youtube_links: 'YouTube Links (Max 5)',
    youtube_link: 'YouTube Link',
    text_info: 'Detailed Info',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm_delete: 'Are you sure you want to delete?',
    success_added: '✅ Added successfully',
    success_updated: '✅ Updated successfully',
    success_deleted: 'Deleted successfully',
    error_save: '❌ Save error: ',
    error_delete: 'Error occurred while deleting',
    select: 'Select',
    category_app: 'App',
    category_web: 'Web Platform',
    category_o2o: 'O2O',
    category_game: 'Game',
    category_etc: 'Other',
    click_to_play: 'Click to Play'
  },
  zh: {
    subtitle: '项目与资本相遇之地',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: '开发者与战略投资者枢纽',
    type_investment: '投资',
    type_revenue: '收益分配',
    type_startup: '创业希望',
    loading: '正在加载项目...',
    no_projects: '没有注册的项目',
    footer_title: '项目与资本相遇之地',
    video_label: '观看视频',
    detail_title: '项目详情',
    admin_title: '管理员页面',
    admin_home: '主页',
    new_project: '新项目',
    registered_projects: '已注册项目',
    project_name: '项目名称',
    description: '简介',
    category: '类别',
    funding_type: '资金方式',
    amount: '目标金额（美元 $）',
    youtube_links: 'YouTube链接（最多5个）',
    youtube_link: 'YouTube链接',
    text_info: '详细信息',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    confirm_delete: '确定要删除吗？',
    success_added: '✅ 添加成功',
    success_updated: '✅ 修改成功',
    success_deleted: '删除成功',
    error_save: '❌ 保存错误：',
    error_delete: '删除时发生错误',
    select: '选择',
    category_app: '应用',
    category_web: '网络平台',
    category_o2o: 'O2O',
    category_game: '游戏',
    category_etc: '其他',
    click_to_play: '点击播放'
  }
};

let currentLang = localStorage.getItem('lang') || 'ko';
let projects = [];
let editing = null;

function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    }
  });
  
  // Update all translated elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  
  // Reload projects with new language
  loadProjects();
}

function t(key) {
  return translations[currentLang][key] || translations['ko'][key] || key;
}

function translateFundingType(type) {
  const fundingMap = {
    'investment': {
      'ko': '투자',
      'en': 'Investment',
      'zh': '投资'
    },
    'donation': {
      'ko': '수익분배',
      'en': 'Revenue Share',
      'zh': '收益分配'
    },
    'startup': {
      'ko': '창업희망',
      'en': 'Startup',
      'zh': '创业希望'
    }
  };
  
  // If type is one of the key values (investment, donation, startup)
  if (fundingMap[type]) {
    return fundingMap[type][currentLang];
  }
  
  // If type is already translated, find the key and translate again
  for (const key of Object.keys(fundingMap)) {
    const values = Object.values(fundingMap[key]);
    if (values.includes(type)) {
      return fundingMap[key][currentLang];
    }
  }
  
  return type;
}

function translateCategory(category) {
  const categoryMap = {
    'ko': { '앱': '앱', '웹플랫폼': '웹플랫폼', 'O2O': 'O2O', '게임': '게임', '기타': '기타' },
    'en': { '앱': 'App', '웹플랫폼': 'Web Platform', 'O2O': 'O2O', '게임': 'Game', '기타': 'Other' },
    'zh': { '앱': '应用', '웹플랫폼': '网络平台', 'O2O': 'O2O', '게임': '游戏', '기타': '其他' }
  };
  
  for (const ko of Object.keys(categoryMap['ko'])) {
    if (category === ko || category === categoryMap['en'][ko] || category === categoryMap['zh'][ko]) {
      return categoryMap[currentLang][ko];
    }
  }
  
  return category;
}

function getTranslatedField(project, field) {
  const langField = `${field}_${currentLang}`;
  if (project[langField]) {
    return project[langField];
  }
  
  const baseValue = project[field] || '';
  if (baseValue.includes('|||')) {
    const parts = baseValue.split('|||').map(s => s.trim());
    if (currentLang === 'ko') return parts[0] || baseValue;
    if (currentLang === 'en') return parts[1] || parts[0] || baseValue;
    if (currentLang === 'zh') return parts[2] || parts[0] || baseValue;
  }
  
  return baseValue;
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
  changeLang(currentLang);
});

// Load projects from API
async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  const loading = document.getElementById('loadingIndicator');
  const empty = document.getElementById('emptyState');

  try {
    const response = await axios.get('/api/projects');
    projects = response.data.data || [];
    
    loading.style.display = 'none';
    
    if (projects.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    container.innerHTML = projects.map(project => {
      // Count YouTube videos
      const youtubeUrls = [
        project.youtube_url_1,
        project.youtube_url_2,
        project.youtube_url_3,
        project.youtube_url_4,
        project.youtube_url_5
      ].filter(url => url && url.trim());
      
      const videoCount = youtubeUrls.length;
      const title = getTranslatedField(project, 'title');
      const description = getTranslatedField(project, 'description');
      const categoryRaw = project.category || '기타';
      const category = translateCategory(categoryRaw);
      const fundingType = translateFundingType(project.funding_type);
      
      // Determine badge class based on funding type
      let badgeClass = 'badge-investment';
      if (project.funding_type === 'investment') {
        badgeClass = 'badge-investment';
      } else if (project.funding_type === 'donation') {
        badgeClass = 'badge-revenue';
      } else if (project.funding_type === 'startup') {
        badgeClass = 'badge-startup';
      }
      
      return `
      <div class="bg-white rounded-lg shadow card-hover overflow-hidden cursor-pointer" onclick="showProjectDetail('${project.id}')">
        <div class="p-3">
          <div class="mb-2 text-center">
            <span class="category-label category-${categoryRaw}">${category}</span>
          </div>
          <h3 class="text-sm font-bold text-gray-900 mb-2 line-clamp-1 text-center">${title}</h3>
          <p class="text-xs text-gray-600 mb-2 line-clamp-2 text-center">${description || ''}</p>
          <div class="flex flex-wrap gap-1.5 justify-center">
            <span class="badge ${badgeClass}" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">
              ${fundingType}
            </span>
            <span class="amount-badge" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">
              $${(project.amount || 0).toLocaleString()}
            </span>
            ${videoCount > 0 ? `<span class="badge" style="background:#3B82F6; color:white; font-size: 0.75rem; padding: 0.4rem 0.8rem;"><i class="fab fa-youtube mr-1"></i>${videoCount}개 ${t('video_label')}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    loading.style.display = 'none';
    empty.classList.remove('hidden');
  }
}

function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/,
    /youtube\.com\/embed\/([^&\s?]+)/,
    /youtube\.com\/v\/([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1].substring(0, 11);
  }
  return null;
}

function showProjectDetail(id) {
  const project = projects.find(p => p.id == id);
  if (!project) return;
  
  // Get all YouTube URLs
  const youtubeUrls = [
    project.youtube_url_1,
    project.youtube_url_2,
    project.youtube_url_3,
    project.youtube_url_4,
    project.youtube_url_5
  ].filter(url => url && url.trim()).map(url => getYouTubeVideoId(url)).filter(id => id);
  
  const title = getTranslatedField(project, 'title');
  const description = getTranslatedField(project, 'description');
  const textInfo = getTranslatedField(project, 'text_info');
  const fundingType = translateFundingType(project.funding_type);
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  
  // Videos section HTML - vertical layout for 2-5 videos
  let videosHTML = '';
  if (youtubeUrls.length > 0) {
    videosHTML = `
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-bold mb-3 text-center">
          <i class="fab fa-youtube text-red-600 mr-2"></i>${t('video_label')} (${youtubeUrls.length}개)
        </h3>
        <div class="space-y-4 max-w-3xl mx-auto">
          ${youtubeUrls.map((videoId, index) => `
            <div class="youtube-thumbnail" id="video-${index}" onclick="playVideo('video-${index}', '${videoId}')">
              <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video ${index + 1}">
              <div class="play-button"></div>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                ${t('click_to_play')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  modal.innerHTML = `
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
          <p class="text-sm text-gray-500 mt-1">${description || ''}</p>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 ml-4">
          <i class="fas fa-times text-2xl"></i>
        </button>
      </div>
      <div class="p-6 space-y-6">
        <div class="flex flex-wrap gap-2 justify-center">
          <span class="badge badge-${(project.funding_type || '').includes('투자') || (project.funding_type || '').includes('Investment') || (project.funding_type || '').includes('投资') ? 'investment' : (project.funding_type || '').includes('수익') || (project.funding_type || '').includes('Revenue') || (project.funding_type || '').includes('收益') ? 'revenue' : 'loan'}">
            <i class="fas fa-tag mr-1"></i>${fundingType}
          </span>
          <span class="amount-tag">
            <i class="fas fa-dollar-sign mr-1"></i>$${(project.amount || 0).toLocaleString()}
          </span>
        </div>
        
        ${videosHTML}
        
        ${textInfo ? `
          <div class="bg-white border-2 border-purple-200 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4 text-purple-700 text-center">
              <i class="fas fa-file-alt mr-2"></i>${t('detail_title')}
            </h3>
            <div class="text-gray-700 whitespace-pre-wrap leading-relaxed text-center">
              ${textInfo.split('\n').map(line => 
                line.trim() ? `<p class="mb-3">${line}</p>` : '<br>'
              ).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function playVideo(containerId, videoId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="relative pb-[56.25%] h-0">
      <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        class="absolute top-0 left-0 w-full h-full rounded-lg"
        frameborder="0" allowfullscreen allow="autoplay"></iframe>
    </div>
  `;
}

// ADMIN FUNCTIONS
async function loadProjectsForAdmin() {
  try {
    const response = await axios.get('/api/projects');
    projects = response.data.data || [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    projects = [];
  }
}

async function renderAdminPanel() {
  await loadProjectsForAdmin();
  
  document.getElementById('adminContent').innerHTML = `
    <header class="bg-white shadow p-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-3">
          <h1 class="text-2xl font-bold"><i class="fas fa-cog text-purple-600 mr-2"></i>${t('admin_title')}</h1>
          <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            <i class="fas fa-home mr-2"></i>${t('admin_home')}
          </a>
        </div>
      </div>
    </header>
    
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex gap-2 mb-3">
        <button onclick="showForm()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          <i class="fas fa-plus mr-2"></i>${t('new_project')}
        </button>
      </div>
      <div class="bg-white rounded-xl shadow">
        <div class="p-6 border-b"><h3 class="text-xl font-bold">${t('registered_projects')} (${projects.length}개)</h3></div>
        <div>${projects.length ? projects.map(p => `
          <div class="p-6 border-b hover:bg-gray-50">
            <div class="flex justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-bold mb-2">${p.title}</h4>
                <p class="text-gray-600 text-sm mb-3">${p.description || ''}</p>
                <div class="flex gap-2 text-sm flex-wrap">
                  <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">${p.funding_type}</span>
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold">$${(p.amount||0).toLocaleString()}</span>
                  ${[p.youtube_url_1, p.youtube_url_2, p.youtube_url_3, p.youtube_url_4, p.youtube_url_5].filter(u => u).length > 0 ? 
                    `<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full"><i class="fab fa-youtube mr-1"></i>${[p.youtube_url_1, p.youtube_url_2, p.youtube_url_3, p.youtube_url_4, p.youtube_url_5].filter(u => u).length}개</span>` 
                    : ''}
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button onclick="edit('${p.id}')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><i class="fas fa-edit"></i></button>
                <button onclick="del('${p.id}')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        `).join('') : '<div class="p-12 text-center text-gray-500"><i class="fas fa-inbox text-6xl mb-4"></i><p>' + t('no_projects') + '</p></div>'}</div>
      </div>
    </div>

    <div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50" onclick="if(event.target===this) closeForm()">
      <div class="min-h-screen px-4 py-8 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b flex justify-between items-center">
            <h2 class="text-2xl font-bold" id="formTitle">${t('new_project')}</h2>
            <button onclick="closeForm()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <form id="form" class="p-6 space-y-4" onsubmit="save(event)">
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-blue-800 font-medium mb-2"><i class="fas fa-info-circle mr-1"></i> 다국어 입력 안내</p>
              <p class="text-xs text-blue-600">한국어, 영어, 중국어 순서로 입력하세요. 구분자: <strong>|||</strong></p>
              <p class="text-xs text-blue-600 mt-1">예: 한국어제목|||English Title|||中文标题</p>
            </div>
            
            <div><label class="block text-sm font-medium mb-2">${t('project_name')} * (한국어|||English|||中文)</label>
            <input name="title" required class="w-full border rounded px-4 py-2" placeholder="예: 앱 개발 프로젝트|||App Development Project|||应用开发项目"></div>
            <div><label class="block text-sm font-medium mb-2">${t('description')} (한국어|||English|||中文)</label>
            <textarea name="description" rows="2" class="w-full border rounded px-4 py-2" placeholder="예: 혁신적인 모바일 앱|||Innovative mobile app|||创新移动应用"></textarea></div>
            
            <div class="grid grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium mb-2">${t('category')} *</label>
              <select name="category" required class="w-full border rounded px-4 py-2">
                <option value="">선택</option>
                <option value="앱">앱</option>
                <option value="웹플랫폼">웹플랫폼</option>
                <option value="O2O">O2O</option>
                <option value="게임">게임</option>
                <option value="기타">기타</option>
              </select></div>
              <div><label class="block text-sm font-medium mb-2">${t('funding_type')} *</label>
              <select name="funding_type" required class="w-full border rounded px-4 py-2">
                <option value="">선택</option>
                <option value="investment">투자</option>
                <option value="donation">수익분배</option>
                <option value="startup">창업희망</option>
              </select></div>
              <div class="col-span-2"><label class="block text-sm font-medium mb-2">${t('amount')} *</label>
              <input type="number" name="amount" required min="0" step="100" class="w-full border rounded px-4 py-2"></div>
            </div>
            
            <div class="border-t pt-4 mt-4">
              <label class="block text-sm font-medium mb-3">
                <i class="fab fa-youtube text-red-600 mr-1"></i>${t('youtube_links')}
              </label>
              <div class="space-y-2">
                <input type="url" name="youtube_url_1" placeholder="YouTube 링크 #1" class="w-full border rounded px-4 py-2 text-sm">
                <input type="url" name="youtube_url_2" placeholder="YouTube 링크 #2" class="w-full border rounded px-4 py-2 text-sm">
                <input type="url" name="youtube_url_3" placeholder="YouTube 링크 #3" class="w-full border rounded px-4 py-2 text-sm">
                <input type="url" name="youtube_url_4" placeholder="YouTube 링크 #4" class="w-full border rounded px-4 py-2 text-sm">
                <input type="url" name="youtube_url_5" placeholder="YouTube 링크 #5" class="w-full border rounded px-4 py-2 text-sm">
              </div>
            </div>
            
            <div><label class="block text-sm font-medium mb-2">${t('text_info')} (한국어|||English|||中文)</label>
            <textarea name="text_info" rows="5" class="w-full border rounded px-4 py-2" placeholder="예: 프로젝트 설명|||Project description|||项目说明"></textarea></div>
            
            <div class="flex gap-3 justify-end pt-4 border-t">
              <button type="button" onclick="closeForm()" class="px-6 py-2 border rounded">${t('cancel')}</button>
              <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                <i class="fas fa-save mr-2"></i>${t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function showForm() {
  editing = null;
  document.getElementById('formTitle').textContent = t('new_project');
  document.getElementById('form').reset();
  document.getElementById('modal').classList.remove('hidden');
}

function closeForm() {
  document.getElementById('modal').classList.add('hidden');
  editing = null;
}

async function save(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  
  // Process multilingual fields
  for (const [key, value] of formData.entries()) {
    if (key === 'title' || key === 'description' || key === 'text_info') {
      const parts = value.split('|||').map(s => s.trim());
      data[key] = parts[0] || value;
      data[`${key}_ko`] = parts[0] || value;
      data[`${key}_en`] = parts[1] || parts[0] || value;
      data[`${key}_zh`] = parts[2] || parts[0] || value;
    } else {
      data[key] = value || null;
    }
  }
  
  try {
    if (editing) {
      await axios.put(`/api/projects/${editing}`, data);
      alert(t('success_updated'));
    } else {
      await axios.post('/api/projects', data);
      alert(t('success_added'));
    }
    
    closeForm();
    await renderAdminPanel();
  } catch (error) {
    console.error('저장 오류:', error);
    alert(t('error_save') + error.message);
  }
}

async function edit(id) {
  editing = id;
  const project = projects.find(p => p.id == id);
  document.getElementById('formTitle').textContent = t('edit');
  const form = document.getElementById('form');
  
  // Restore multilingual fields
  Object.keys(project).forEach(k => {
    if (k === 'title' || k === 'description' || k === 'text_info') {
      const ko = project[`${k}_ko`] || project[k] || '';
      const en = project[`${k}_en`] || project[k] || '';
      const zh = project[`${k}_zh`] || project[k] || '';
      if (form.elements[k]) {
        form.elements[k].value = `${ko}|||${en}|||${zh}`;
      }
    } else if (!k.endsWith('_ko') && !k.endsWith('_en') && !k.endsWith('_zh') && !k.includes('created_at')) {
      if (form.elements[k]) form.elements[k].value = project[k] || '';
    }
  });
  
  document.getElementById('modal').classList.remove('hidden');
}

async function del(id) {
  if (!confirm(t('confirm_delete'))) return;
  
  try {
    await axios.delete(`/api/projects/${id}`);
    alert(t('success_deleted'));
    await renderAdminPanel();
  } catch (error) {
    console.error('삭제 오류:', error);
    alert(t('error_delete'));
  }
}

function loadPage() {
  const hash = window.location.hash;
  if (hash === '#/admin' || hash === '#admin') {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    renderAdminPanel();
  } else {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
    loadProjects();
  }
}

window.addEventListener('hashchange', loadPage);
window.addEventListener('load', loadPage);
