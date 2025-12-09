import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ 
  root: './public',
  onNotFound: (path, c) => {
    console.log(`File not found: ${path}`)
  }
}))

// API Routes for Projects
// Get all projects
app.get('/api/projects', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects ORDER BY created_at DESC'
    ).all();
    
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error('Error loading projects:', error);
    return c.json({ success: false, data: [] });
  }
})

// Create a new project
app.post('/api/projects', async (c) => {
  try {
    const data = await c.req.json();
    
    const result = await c.env.DB.prepare(`
      INSERT INTO projects (
        title, title_ko, title_en, title_zh,
        description, description_ko, description_en, description_zh,
        category, funding_type, amount,
        youtube_url_1, youtube_url_2, youtube_url_3, youtube_url_4, youtube_url_5,
        text_info, text_info_ko, text_info_en, text_info_zh
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.title, data.title_ko, data.title_en, data.title_zh,
      data.description, data.description_ko, data.description_en, data.description_zh,
      data.category, data.funding_type, data.amount,
      data.youtube_url_1, data.youtube_url_2, data.youtube_url_3, data.youtube_url_4, data.youtube_url_5,
      data.text_info, data.text_info_ko, data.text_info_en, data.text_info_zh
    ).run();
    
    return c.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    console.error('Error creating project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
})

// Update a project
app.put('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    await c.env.DB.prepare(`
      UPDATE projects SET
        title = ?, title_ko = ?, title_en = ?, title_zh = ?,
        description = ?, description_ko = ?, description_en = ?, description_zh = ?,
        category = ?, funding_type = ?, amount = ?,
        youtube_url_1 = ?, youtube_url_2 = ?, youtube_url_3 = ?, youtube_url_4 = ?, youtube_url_5 = ?,
        text_info = ?, text_info_ko = ?, text_info_en = ?, text_info_zh = ?
      WHERE id = ?
    `).bind(
      data.title, data.title_ko, data.title_en, data.title_zh,
      data.description, data.description_ko, data.description_en, data.description_zh,
      data.category, data.funding_type, data.amount,
      data.youtube_url_1, data.youtube_url_2, data.youtube_url_3, data.youtube_url_4, data.youtube_url_5,
      data.text_info, data.text_info_ko, data.text_info_en, data.text_info_zh,
      id
    ).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
})

// Delete a project
app.delete('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await c.env.DB.prepare(
      'DELETE FROM projects WHERE id = ?'
    ).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
})

// Home page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenFunding IT Hub</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
          .hero-gradient { background: linear-gradient(135deg, #a855f7 0%, #c026d3 100%); }
          .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
          .badge { display: inline-flex; align-items: center; justify-content: center; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
          .badge-investment { background-color: #EF4444; color: white; }
          .badge-revenue { background-color: #10B981; color: white; }
          .badge-startup { background-color: #EC4899; color: white; }
          .amount-tag { display: inline-flex; align-items: center; justify-content: center; background-color: #D97706 !important; color: white !important; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; }
          .amount-badge { display: inline-flex; align-items: center; justify-content: center; background-color: #D97706 !important; color: white !important; padding: 8px 15px; border-radius: 20px; font-size: 13px; font-weight: 700; white-space: nowrap; }
          .lang-btn { 
            cursor: pointer; 
            padding: 0.375rem 0.625rem; 
            border-radius: 0.375rem; 
            transition: all 0.2s; 
            font-size: 0.75rem;
            font-weight: 500;
            border: 1px solid #E5E7EB;
            background-color: white;
            color: #6B7280;
          }
          .lang-btn:hover { 
            background-color: #F9FAFB;
            border-color: #A855F7;
            color: #A855F7;
          }
          .lang-btn.active { 
            background: linear-gradient(135deg, #A855F7 0%, #C026D3 100%);
            border-color: transparent;
            color: white;
            font-weight: 600;
          }
          .youtube-thumbnail {
            position: relative;
            cursor: pointer;
            overflow: hidden;
            border-radius: 0.5rem;
            background: #000;
          }
          .youtube-thumbnail img {
            width: 100%;
            transition: opacity 0.3s;
          }
          .youtube-thumbnail:hover img {
            opacity: 0.8;
          }
          .youtube-thumbnail .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 68px;
            height: 48px;
            background: rgba(59, 130, 246, 0.9);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
          }
          .youtube-thumbnail:hover .play-button {
            background: rgba(59, 130, 246, 1);
            transform: translate(-50%, -50%) scale(1.1);
          }
          .youtube-thumbnail .play-button::after {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 10px 0 10px 16px;
            border-color: transparent transparent transparent white;
            margin-left: 3px;
          }
          @media (max-width: 640px) {
            .lang-btn { 
              padding: 0.25rem 0.5rem; 
              font-size: 0.6875rem;
            }
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <div id="mainContent">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
                <div class="flex justify-between items-center gap-3">
                    <div class="flex gap-1.5">
                        <span class="lang-btn active" data-lang="ko" onclick="changeLang('ko')">KO</span>
                        <span class="lang-btn" data-lang="en" onclick="changeLang('en')">EN</span>
                        <span class="lang-btn" data-lang="zh" onclick="changeLang('zh')">中文</span>
                    </div>
                    <div class="text-center flex-1">
                        <h1 class="text-base sm:text-lg font-bold text-gray-900">
                            <i class="fas fa-rocket text-purple-600 mr-1 text-sm"></i>
                            <span class="hidden sm:inline">OpenFunding IT Hub</span>
                            <span class="sm:hidden">IT Hub</span>
                        </h1>
                        <p class="text-xs text-gray-600 mt-0.5 hidden sm:block" data-i18n="subtitle">프로젝트가 자본을 만나는 곳</p>
                    </div>
                    <div class="flex justify-end w-20">
                        <!-- Admin button removed - Access via URL: /#/admin -->
                    </div>
                </div>
            </div>
        </header>

        <section class="hero-gradient text-white py-3 sm:py-6">
            <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
                <h2 class="text-base sm:text-xl md:text-2xl font-bold mb-1.5 leading-tight" data-i18n="hero_title">
                    Code your vision,<br>build your future
                </h2>
                <p class="text-xs sm:text-sm md:text-base mb-3 opacity-90" data-i18n="hero_desc">
                    개발자, 전략적 투자자 조달 허브
                </p>
                <div class="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-hand-holding-usd mr-0.5 text-xs"></i><span data-i18n="type_investment">투자</span>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-chart-line mr-0.5 text-xs"></i><span data-i18n="type_revenue">수익분배</span>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-coins mr-0.5 text-xs"></i><span data-i18n="type_startup">창업희망</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div id="projectsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            </div>
            <div id="loadingIndicator" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-3xl text-purple-600"></i>
                <p class="mt-3 text-gray-600 text-sm" data-i18n="loading">프로젝트를 불러오는 중...</p>
            </div>
            <div id="emptyState" class="hidden text-center py-8">
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-base text-gray-600" data-i18n="no_projects">등록된 프로젝트가 없습니다</p>
            </div>
        </section>

        <footer class="bg-gray-800 text-white py-1 mt-6">
            <div class="max-w-7xl mx-auto px-2 sm:px-4">
                <div class="flex flex-col items-center">
                    <p class="text-[9px] sm:text-xs text-gray-400">© 2024 OpenFunding IT Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
        </div>

        <div id="adminContent" style="display:none;"></div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js?v=${Date.now()}"></script>
    </body>
    </html>
  `)
})

export default app
