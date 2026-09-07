window.__ModuleLoader__.load({
  id: "@dangosys/dsh-open-source-collaboration/collaboration-panel",
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
const { useEffect, useState } = React
const h = React.createElement
const API = '/integrations/collaboration-panel/items'
const REPOS = '/integrations/role/repos'
const LOGIN = '/integrations/role/login'
const STYLE_ID = 'dsh-collaboration-panel-style'
const PANEL_ID = 'dsh-collaboration-panel'

const CSS = `
.dsh-collaboration-view{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.dsh-collaboration-panel{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column;overflow:hidden;font:13px/1.35 system-ui,-apple-system,sans-serif;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-tabs{display:flex;align-items:flex-end;gap:4px;padding:10px 12px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
.dsh-collaboration-panel-tab{height:32px;padding:0 12px;border:1px solid transparent;border-bottom:0;border-radius:8px 8px 0 0;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;font:500 12px/32px inherit}.dsh-collaboration-panel-tab.on{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 2px 0 #3b82f6}.dsh-collaboration-panel-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.dsh-collaboration-panel-toolbar{display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2)}.dsh-collaboration-panel-views{display:flex;gap:2px;padding:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px}.dsh-collaboration-panel-view{height:24px;padding:0 9px;border:0;border-radius:6px;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;font:500 11px/24px inherit}.dsh-collaboration-panel-view.on{color:#3b82f6;background:#eff6ff;box-shadow:inset 0 0 0 1px rgb(59 130 246 / 28%)}
.dsh-collaboration-panel-filters{display:flex;align-items:center;gap:6px;min-width:0;margin-left:auto;overflow:auto;scrollbar-width:none}.dsh-collaboration-panel-filters::-webkit-scrollbar{display:none}.dsh-collaboration-panel-filter{height:26px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;font:500 11px/24px inherit;white-space:nowrap}.dsh-collaboration-panel-filter.on{border-color:#3b82f6;color:#3b82f6;background:#eff6ff}.dsh-collaboration-panel-filter.static{cursor:default}.dsh-collaboration-panel-toolbar-action{display:grid;width:28px;height:28px;padding:0;place-items:center;border:0;border-radius:8px;color:var(--dsw-alias-label-secondary);background:transparent;cursor:pointer}.dsh-collaboration-panel-toolbar-action:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-watchlist{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2)}.dsh-collaboration-panel-watchlist-label{flex:none;color:var(--dsw-alias-label-tertiary);font:500 10px/24px ui-monospace,monospace;letter-spacing:.06em}.dsh-collaboration-panel-repos{display:flex;flex:1;gap:6px;min-width:0;overflow:auto}.dsh-collaboration-panel-repo-chip{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 7px 0 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);font:500 10px/22px ui-monospace,monospace;white-space:nowrap}.dsh-collaboration-panel-repo-chip button{display:grid;width:18px;height:18px;padding:0;place-items:center;border:0;border-radius:50%;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;font-size:15px}.dsh-collaboration-panel-repo-form{display:flex;gap:6px}.dsh-collaboration-panel-repo-form input{width:150px;height:26px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;outline:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);font:11px inherit}.dsh-collaboration-panel-add{height:26px;padding:0 9px;border:0;border-radius:7px;color:#fff;background:#3b82f6;cursor:pointer;font:600 11px/26px inherit}.dsh-collaboration-panel-add:disabled,.dsh-collaboration-panel-repo-chip button:disabled{opacity:.5;cursor:default}
.dsh-collaboration-panel-body{display:flex;flex:1;min-height:0;overflow:auto;padding:12px;background:var(--dsw-alias-bg-layer-2)}.dsh-collaboration-panel-workspace{display:flex;flex:1;min-width:0;min-height:0;gap:10px}.dsh-collaboration-panel-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));flex:1;min-width:0;min-height:0;gap:10px}.dsh-collaboration-panel-column{display:flex;flex-direction:column;min-width:0;min-height:180px;padding:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}.dsh-collaboration-panel-column-head{display:flex;justify-content:space-between;padding:4px 4px 7px;color:var(--dsw-alias-label-tertiary);font:500 10px/14px ui-monospace,monospace;letter-spacing:.07em}.dsh-collaboration-panel-column-items{display:flex;flex-direction:column;gap:6px;overflow:auto}.dsh-collaboration-panel-card{display:flex;flex-direction:column;gap:6px;width:100%;padding:9px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);cursor:pointer;font:inherit;text-align:left}.dsh-collaboration-panel-card.on{border-color:#3b82f6;background:#eff6ff;box-shadow:0 0 0 3px rgb(59 130 246 / 28%)}.dsh-collaboration-panel-card-title{display:-webkit-box;overflow:hidden;font-size:12px;font-weight:600;line-height:16px;-webkit-box-orient:vertical;-webkit-line-clamp:3}.dsh-collaboration-panel-card-meta{display:flex;flex-wrap:wrap;gap:5px}.dsh-collaboration-panel-tag{height:18px;padding:0 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-tertiary);font:500 9px/16px ui-monospace,monospace}.dsh-collaboration-panel-tag.success{border-color:#86efac;color:#047857;background:#ecfdf5}.dsh-collaboration-panel-tag.agent{border-color:#ddd6fe;color:#6d28d9;background:#f5f3ff}.dsh-collaboration-panel-card-sub{overflow:hidden;color:var(--dsw-alias-label-tertiary);font-size:10px;text-overflow:ellipsis;white-space:nowrap}
.dsh-collaboration-panel-activity{display:flex;flex:0 0 220px;flex-direction:column;gap:8px;min-width:180px;padding:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}.dsh-collaboration-panel-activity-head{padding:4px;color:var(--dsw-alias-label-tertiary);font:500 10px/14px ui-monospace,monospace;letter-spacing:.07em}.dsh-collaboration-panel-activity-list{display:flex;flex-direction:column;gap:6px;overflow:auto}.dsh-collaboration-panel-activity-row{display:flex;gap:7px;padding:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px}.dsh-collaboration-panel-activity-dot{width:7px;height:7px;margin-top:4px;border-radius:50%;flex:none}.dsh-collaboration-panel-activity-dot.success{background:#10b981}.dsh-collaboration-panel-activity-dot.warning{background:#f59e0b}.dsh-collaboration-panel-activity-dot.ghost{border:1px solid #7c3aed;background:transparent;box-shadow:inset 0 0 0 1px #7c3aed;opacity:.55}.dsh-collaboration-panel-activity-copy{min-width:0;font-size:11px;line-height:14px}.dsh-collaboration-panel-activity-copy em{display:block;margin-top:3px;overflow:hidden;color:var(--dsw-alias-label-tertiary);font:10px/13px ui-monospace,monospace;font-style:normal;text-overflow:ellipsis;white-space:nowrap}.dsh-collaboration-panel-activity-empty{padding:8px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dsh-collaboration-panel-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);font-size:11px}.dsh-collaboration-panel-table th{padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font:500 10px/14px ui-monospace,monospace;text-align:left}.dsh-collaboration-panel-table td{padding:9px 10px;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);vertical-align:top}.dsh-collaboration-panel-table tbody tr{cursor:pointer}.dsh-collaboration-panel-table tbody tr:hover,.dsh-collaboration-panel-table tbody tr.on{background:#eff6ff}.dsh-collaboration-panel-table-title{color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-collaboration-panel-detail{flex:none;max-width:100%;margin-top:10px;padding:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}.dsh-collaboration-panel-detail-head{display:flex;justify-content:space-between;gap:10px}.dsh-collaboration-panel-detail-title{min-width:0;margin:0;font-size:13px}.dsh-collaboration-panel-state{height:20px;padding:0 7px;border-radius:999px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);font-size:10px;line-height:20px}.dsh-collaboration-panel-detail-body{max-height:180px;margin:10px 0;padding:9px;overflow:auto;border-radius:8px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);font:11px/16px inherit;white-space:pre-wrap}.dsh-collaboration-panel-detail a{color:#3b82f6;font-size:11px}.dsh-collaboration-panel-fields{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;color:var(--dsw-alias-label-tertiary);font-size:10px}.dsh-collaboration-panel-field{display:inline-flex;align-items:center;gap:5px}.dsh-collaboration-panel-dot{width:7px;height:7px;border-radius:50%}.dsh-collaboration-panel-dot[data-tone=green]{background:#10b981}.dsh-collaboration-panel-dot[data-tone=yellow]{background:#f59e0b}.dsh-collaboration-panel-dot[data-tone=red]{background:#ef4444}
.dsh-collaboration-panel-status,.dsh-collaboration-panel-empty{display:flex;flex:1;min-height:180px;flex-direction:column;align-items:center;justify-content:center;padding:24px;color:var(--dsw-alias-label-tertiary);text-align:center}.dsh-collaboration-panel-status-title,.dsh-collaboration-panel-empty-title{margin:10px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}.dsh-collaboration-panel-status-desc,.dsh-collaboration-panel-empty-desc{max-width:320px;margin:4px auto 0;font-size:11px}.dsh-collaboration-panel-spinner{width:18px;height:18px;border:2px solid var(--dsw-alias-border-l2);border-top-color:#3b82f6;border-radius:50%;animation:dsh-collaboration-panel-spin .75s linear infinite}@keyframes dsh-collaboration-panel-spin{to{transform:rotate(360deg)}}
.dsh-collaboration-panel-login,.dsh-collaboration-panel-error{margin:12px;padding:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}.dsh-collaboration-panel-error{border-color:#ef4444;color:#ef4444;white-space:pre-wrap;font-size:11px}.dsh-collaboration-panel-login-title{margin:0;font-weight:600;font-size:12px}.dsh-collaboration-panel-login a{color:#3b82f6;font-size:11px;word-break:break-all}.dsh-collaboration-panel-code{margin:8px 0;font-size:20px;font-weight:650;letter-spacing:.12em}
@media(prefers-color-scheme:dark){.dsh-collaboration-panel-view.on,.dsh-collaboration-panel-filter.on,.dsh-collaboration-panel-card.on,.dsh-collaboration-panel-table tbody tr.on{background:#1a2740}.dsh-collaboration-panel-tag.success{border-color:#065f46;color:#6ee7b7;background:#052e1c}.dsh-collaboration-panel-tag.agent{border-color:#4c1d95;color:#c4b5fd;background:#1e1b4b}.dsh-collaboration-panel-card.on{box-shadow:0 0 0 3px rgb(96 165 250 / 35%)}}
@media(max-width:760px){.dsh-collaboration-panel-activity{flex-basis:180px}.dsh-collaboration-panel-board{grid-template-columns:1fr}.dsh-collaboration-panel-filters{display:none}}@media(max-width:560px){.dsh-collaboration-panel-activity{display:none}.dsh-collaboration-panel-watchlist-label{display:none}}@media(prefers-reduced-motion:reduce){.dsh-collaboration-panel-spinner{animation:none}}
.dsh-collaboration-panel-body-column{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column}.dsh-collaboration-panel-activity-only{flex:1;min-width:0}
`

function IconList() {
  return h('svg', { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M3.5 4.5h1.2l.8.9 1.7-2M8 4.5h6.5M3.5 9h1.2l.8.9 1.7-2M8 9h6.5M3.5 13.5h1.2l.8.9 1.7-2M8 13.5h6.5', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round', strokeLinejoin: 'round' }))
}

function IconRefresh() {
  return h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M13.2 8a5.2 5.2 0 1 1-1.3-3.4M13.2 3.2v3.2H10', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }))
}

function IconClose() {
  return h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M4 4l8 8M12 4l-8 8', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }))
}

function fmtTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString()
}

function itemLabel(item) {
  return item.kind === 'pr' ? 'Review request' : 'Assigned issue'
}

function ActivityPane({ items, full, onOpen }) {
  const activity = items ? items.slice(0, 6) : []
  return h('aside', { className: `dsh-collaboration-panel-activity${full ? ' dsh-collaboration-panel-activity-only' : ''}` },
    h('div', { className: 'dsh-collaboration-panel-activity-head' }, 'ACTIVITY'),
    h('div', { className: 'dsh-collaboration-panel-activity-list' },
      activity.length > 0
        ? activity.map((item) => h('button', { key: `${item.repo}#${item.number}`, type: 'button', className: 'dsh-collaboration-panel-activity-row', onClick: () => onOpen(item) },
            h('span', { className: `dsh-collaboration-panel-activity-dot ${item.kind === 'pr' ? 'success' : 'warning'}`, 'aria-hidden': true }),
            h('span', { className: 'dsh-collaboration-panel-activity-copy' }, itemLabel(item), h('em', null, `${item.repo}#${item.number} · ${fmtTime(item.updatedAt)}`)),
          ))
        : h('div', { className: 'dsh-collaboration-panel-activity-row' },
            h('span', { className: 'dsh-collaboration-panel-activity-dot ghost', 'aria-hidden': true }),
            h('span', { className: 'dsh-collaboration-panel-activity-empty' }, items ? 'No live activity yet.' : 'Waiting for live activity…'),
          ),
    ),
  )
}

function BoardCard({ item, selected, onOpen }) {
  return h('button', { type: 'button', className: `dsh-collaboration-panel-card${selected ? ' on' : ''}`, onClick: () => onOpen(item) },
    h('span', { className: 'dsh-collaboration-panel-card-title' }, item.title),
    h('span', { className: 'dsh-collaboration-panel-card-meta' },
      h('span', { className: `dsh-collaboration-panel-tag ${item.kind === 'pr' ? 'success' : 'agent'}` }, item.kind === 'pr' ? 'live' : 'issue'),
      h('span', { className: 'dsh-collaboration-panel-tag' }, `#${item.number}`),
    ),
    h('span', { className: 'dsh-collaboration-panel-card-sub' }, `${item.repo} · ${item.author} · ${fmtTime(item.updatedAt)}`),
  )
}

function BoardView({ items, selected, onOpen }) {
  const columns = [
    { key: 'issue', label: 'ISSUES', items: items.filter(item => item.kind === 'issue') },
    { key: 'pr', label: 'REVIEWS', items: items.filter(item => item.kind === 'pr') },
  ]
  return h('div', { className: 'dsh-collaboration-panel-board' }, columns.map(column => h('section', { className: 'dsh-collaboration-panel-column', key: column.key },
    h('div', { className: 'dsh-collaboration-panel-column-head' }, h('span', null, column.label), h('span', null, String(column.items.length))),
    h('div', { className: 'dsh-collaboration-panel-column-items' }, column.items.length > 0
      ? column.items.map(item => h(BoardCard, { key: `${item.repo}#${item.number}`, item, selected: selected === `${item.repo}#${item.number}`, onOpen }))
      : h('div', { className: 'dsh-collaboration-panel-activity-empty' }, 'No open items.'),
    ),
  )))
}

function TableView({ items, selected, onOpen }) {
  return h('table', { className: 'dsh-collaboration-panel-table' },
    h('thead', null, h('tr', null, h('th', null, 'TYPE'), h('th', null, 'ITEM'), h('th', null, 'UPDATED'))),
    h('tbody', null, items.map(item => h('tr', { key: `${item.repo}#${item.number}`, className: selected === `${item.repo}#${item.number}` ? 'on' : '', onClick: () => onOpen(item) },
      h('td', null, h('span', { className: 'dsh-collaboration-panel-table-kind' }, item.kind)),
      h('td', null, h('div', { className: 'dsh-collaboration-panel-table-title' }, item.title), h('div', null, `${item.repo}#${item.number} · ${item.author}`)),
      h('td', null, fmtTime(item.updatedAt)),
    ))),
  )
}

async function runLogin(onNotice) {
  const response = await fetch(LOGIN, { method: 'POST' })
  if (!response.ok || !response.body) throw new Error(await response.text())
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    for (;;) {
      const end = buffer.indexOf('\n\n')
      if (end < 0) break
      const chunk = buffer.slice(0, end)
      buffer = buffer.slice(end + 2)
      let event = 'message'
      let data = ''
      for (const line of chunk.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (line.startsWith('data:')) data += line.slice(5).trim()
      }
      const payload = data ? JSON.parse(data) : null
      if (event === 'notice') onNotice(payload)
      if (event === 'done') return payload
      if (event === 'error') throw new Error(payload.message)
    }
  }
  throw new Error('role: login stream ended')
}
function requireRepos(repos) {
  if (!repos) throw new Error('collaboration-panel: repositories missing')
  return repos
}

function Panel() {
  const [items, setItems] = useState(null)
  const [repos, setRepos] = useState(null)
  const [repoInput, setRepoInput] = useState('')
  const [repoBusy, setRepoBusy] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [detail, setDetail] = useState(null)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('board')
  const [view, setView] = useState('board')
  const [filterRepo, setFilterRepo] = useState(null)
  const [manageWatchlist, setManageWatchlist] = useState(false)

  async function loadRepos() {
    const response = await fetch(REPOS)
    const text = await response.text()
    if (!response.ok) throw new Error(text)
    const liveRepos = JSON.parse(text)
    if (!Array.isArray(liveRepos)) throw new Error('collaboration-panel: repositories missing')
    setRepos(liveRepos)
    return liveRepos
  }

  async function refresh() {
    setError(null); setDetail(null); setSelected(null); setItems(null)
    try {
      const liveRepos = await loadRepos()
      if (liveRepos.length === 0) { setItems([]); setLoggingIn(false); return }
      const response = await fetch(API)
      const text = await response.text()
      if (response.status === 401 || text.includes('not logged in')) {
        setItems(null); setLoggingIn(true); setNotice(null)
        try {
          await runLogin(value => { setNotice(value); if (value.url) window.open(value.url, '_blank', 'noopener,noreferrer') })
          setLoggingIn(false); setNotice(null); await refresh()
        } catch (err) {
          setLoggingIn(false); setError(err instanceof Error ? err.message : String(err))
        }
        return
      }
      if (!response.ok) { setItems(null); setError(text); return }
      setItems(JSON.parse(text))
    } catch (err) {
      setRepos(null); setItems(null); setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => { void refresh() }, [])

  async function openRow(item) {
    const key = `${item.repo}#${item.number}`
    setSelected(key)
    const response = await fetch(`${API}/${encodeURIComponent(item.repo)}/${item.number}`)
    const text = await response.text()
    if (!response.ok) { setError(text); setDetail(null); return }
    setError(null); setDetail(JSON.parse(text))
  }

  async function addRepo(event) {
    event.preventDefault()
    setRepoBusy(true); setError(null)
    try {
      const response = await fetch(REPOS, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ repo: repoInput.trim() }) })
      const text = await response.text()
      if (!response.ok) throw new Error(text)
      setRepoInput(''); setRepos(requireRepos(JSON.parse(text))); setManageWatchlist(false); void refresh()
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    finally { setRepoBusy(false) }
  }

  async function removeRepo(repo) {
    setRepoBusy(true); setError(null)
    try {
      const response = await fetch(REPOS, { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ repo }) })
      const text = await response.text()
      if (!response.ok) throw new Error(text)
      const nextRepos = requireRepos(JSON.parse(text))
      setRepos(nextRepos)
      if (filterRepo === repo) setFilterRepo(null)
      void refresh()
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    finally { setRepoBusy(false) }
  }

  const visibleItems = items ? items.filter(item => !filterRepo || item.repo === filterRepo) : []
  const toolbarRepos = items ? requireRepos(repos) : null
  const content = tab === 'chat' ? h('div', { className: 'dsh-collaboration-panel-status' }, h('p', { className: 'dsh-collaboration-panel-status-title' }, 'Chat'), h('p', { className: 'dsh-collaboration-panel-status-desc' }, 'Chat integration is not available yet.'))
    : tab === 'activity' ? h(ActivityPane, { items: visibleItems, full: true, onOpen: openRow })
    : view === 'table'
      ? h(TableView, { items: visibleItems, selected, onOpen: openRow })
      : h('div', { className: 'dsh-collaboration-panel-workspace' }, h(BoardView, { items: visibleItems, selected, onOpen: openRow }), h(ActivityPane, { items: visibleItems, onOpen: openRow }))

  return h('div', { className: 'dsh-collaboration-panel' },
    h('nav', { className: 'dsh-collaboration-panel-tabs', 'aria-label': 'Collaboration views' },
      ['chat', 'board', 'activity'].map(name => h('button', { key: name, type: 'button', className: `dsh-collaboration-panel-tab${tab === name ? ' on' : ''}`, onClick: () => setTab(name) }, name[0].toUpperCase() + name.slice(1))),
    ),
    h('div', { className: 'dsh-collaboration-panel-toolbar' },
      tab === 'board' && h('div', { className: 'dsh-collaboration-panel-views', 'aria-label': 'Saved view' },
        ['board', 'table'].map(name => h('button', { key: name, type: 'button', className: `dsh-collaboration-panel-view${view === name ? ' on' : ''}`, onClick: () => setView(name) }, name[0].toUpperCase() + name.slice(1))),
      ),
      h('div', { className: 'dsh-collaboration-panel-filters' },
        h('button', { type: 'button', className: `dsh-collaboration-panel-filter${filterRepo === null ? ' on' : ''}`, onClick: () => setFilterRepo(null) }, 'all repos'),
        items && toolbarRepos.map(repo => h('button', { key: repo, type: 'button', className: `dsh-collaboration-panel-filter${filterRepo === repo ? ' on' : ''}`, onClick: () => setFilterRepo(repo) }, `repo: ${repo}`)),
      ),
      h('button', { type: 'button', className: 'dsh-collaboration-panel-toolbar-action', title: 'Refresh', 'aria-label': 'Refresh', onClick: () => void refresh() }, h(IconRefresh)),
    ),
    h('div', { className: 'dsh-collaboration-panel-watchlist' },
      h('span', { className: 'dsh-collaboration-panel-watchlist-label' }, 'WATCHLIST'),
      h('div', { className: 'dsh-collaboration-panel-repos' }, repos && repos.length > 0
        ? repos.map(repo => h('span', { className: 'dsh-collaboration-panel-repo-chip', key: repo }, repo, manageWatchlist && h('button', { type: 'button', disabled: repoBusy, onClick: () => void removeRepo(repo), 'aria-label': `Remove ${repo}` }, '×')))
        : h('span', { className: 'dsh-collaboration-panel-activity-empty' }, 'Add a repository to start.'),
      ),
      (manageWatchlist || !repos || repos.length === 0) && h('form', { className: 'dsh-collaboration-panel-repo-form', onSubmit: addRepo }, h('input', { value: repoInput, onInput: event => setRepoInput(event.currentTarget.value), placeholder: 'owner/name', 'aria-label': 'Repository owner/name', spellCheck: false }), h('button', { type: 'submit', disabled: repoBusy, className: 'dsh-collaboration-panel-add' }, repoBusy ? 'Saving…' : 'Add')),
      repos && repos.length > 0 && h('button', { type: 'button', className: 'dsh-collaboration-panel-toolbar-action', title: manageWatchlist ? 'Close watchlist' : 'Manage watchlist', 'aria-label': manageWatchlist ? 'Close watchlist' : 'Manage watchlist', onClick: () => setManageWatchlist(!manageWatchlist) }, manageWatchlist ? '×' : '+'),
    ),
    error && h('div', { className: 'dsh-collaboration-panel-error' }, error),
    loggingIn && h('div', { className: 'dsh-collaboration-panel-login' }, h('p', { className: 'dsh-collaboration-panel-login-title' }, notice && notice.message ? notice.message : 'Starting GitHub login…'), notice && notice.code && h('div', { className: 'dsh-collaboration-panel-code' }, notice.code), notice && notice.url && h('a', { href: notice.url, target: '_blank', rel: 'noreferrer' }, notice.url)),
    !error && !loggingIn && !items && h('div', { className: 'dsh-collaboration-panel-body' }, h('div', { className: 'dsh-collaboration-panel-status' }, h('div', { className: 'dsh-collaboration-panel-spinner', 'aria-hidden': true }), h('p', { className: 'dsh-collaboration-panel-status-title' }, 'Loading collaboration'), h('p', { className: 'dsh-collaboration-panel-status-desc' }, 'Fetching open issues and review requests from the watchlist.'))),
    !error && !loggingIn && items && h('div', { className: 'dsh-collaboration-panel-body' }, h('div', { className: 'dsh-collaboration-panel-body-column' }, content, detail && h('div', { className: 'dsh-collaboration-panel-detail' }, h('div', { className: 'dsh-collaboration-panel-detail-head' }, h('h3', { className: 'dsh-collaboration-panel-detail-title' }, detail.title), h('span', { className: 'dsh-collaboration-panel-state' }, detail.state)), h('div', { className: 'dsh-collaboration-panel-fields' }, h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'red' }), `labels: ${detail.labels.join(', ') || '—'}`), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'yellow' }), `assignees: ${detail.assignees.join(', ') || '—'}`), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'green' }), `reviewers: ${detail.requestedReviewers.join(', ') || '—'}`)), h('pre', { className: 'dsh-collaboration-panel-detail-body' }, detail.body || '(no body)'), h('a', { href: detail.url, target: '_blank', rel: 'noreferrer' }, 'Open in GitHub')))),
  )
}

function CollabView() {
  return h('div', { id: PANEL_ID, className: 'dsh-collaboration-view' }, h(Panel))
}

function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'collaboration-panel: styles')
  ctx.slots.inject('conversation.view', () => ctx.slots.register(
    { name: 'conversation.view', id: 'collaboration', order: 15, label: '协作' },
    CollabView,
  ))
}

    module.exports.apply = apply
    module.exports.inject = ['slots']
    return module.exports
  },
})
window.__ModuleLoader__.load({
  id: "@dangosys/dsh-open-source-collaboration",
  factory: (require) => {
    const module = { exports: {} }
    const panel = require("@dangosys/dsh-open-source-collaboration/collaboration-panel")
    module.exports.apply = (ctx) => panel.apply(ctx)
    module.exports.inject = ['slots']
    return module.exports
  },
})
