const state = { projects: [], filtered: [], term: '', category: 'All' };
const el = (s) => document.querySelector(s);
const esc = (s) => s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const renderChips = (list, container) => {
  container.innerHTML = list.map((t) => `<span class="chip">${esc(t)}</span>`).join('');
};
const renderTimeline = (items, container) => {
  container.innerHTML = items.map((i) => `<div class="timeline-item"><div><strong>${esc(i.title)}</strong> · ${esc(i.period)}<div class="subtitle">${esc(i.detail)}</div></div></div>`).join('');
};
const renderProjects = () => {
  const wrap = el('#projects');
  const data = state.filtered;
  wrap.innerHTML = data.map((p) => `
    <div class="card project fade-in">
      <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
      <div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <div>${p.techStack.map((t)=>`<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div style="margin-top:8px">
          <a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">查看项目</a>
        </div>
      </div>
    </div>
  `).join('');
};
const applyFilter = () => {
  const term = state.term.trim().toLowerCase();
  const category = state.category;
  state.filtered = state.projects.filter((p) => {
    const matchTerm = term === '' || [p.name, p.description, ...(p.techStack||[])].join(' ').toLowerCase().includes(term);
    const matchCat = category === 'All' || p.category === category;
    return matchTerm && matchCat;
  });
  renderProjects();
};
const initFilters = () => {
  const cats = Array.from(new Set(['All', ...state.projects.map((p)=>p.category||'Other')]));
  const select = el('#filter-category');
  select.innerHTML = cats.map((c)=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  select.value = 'All';
  select.addEventListener('change', (e)=>{ state.category = e.target.value; applyFilter(); });
  const search = el('#search');
  let h;
  search.addEventListener('input', (e)=>{ clearTimeout(h); h = setTimeout(()=>{ state.term = e.target.value; applyFilter(); }, 150); });
};
const init = async () => {
  const res = await fetch('/data/projects.json', { cache: 'no-cache' });
  const projects = await res.json();
  state.projects = projects;
  state.filtered = projects.slice();
  initFilters();
  renderProjects();
  renderChips(['JavaScript','Vue','React','Node.js','Hexo','CSS'], el('#skills'));
  renderTimeline([
    { title: '前端开发工程师 · 某科技公司', period: '2022 - 至今', detail: '负责前端架构与性能优化' },
    { title: '前端实习生 · 某互联网企业', period: '2020 - 2022', detail: '参与业务组件开发' }
  ], el('#experience'));
  renderTimeline([
    { title: '计算机科学学士 · 某大学', period: '2016 - 2020', detail: '主修软件工程与数据结构' }
  ], el('#education'));
};
document.addEventListener('DOMContentLoaded', init);
