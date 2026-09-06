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
.dsh-collaboration-panel-trigger{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:calc(100% + 8px);height:34px;margin:4px -4px;padding:6px 2px 6px 10px;border:0;border-radius:12px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;overflow:hidden;transition:color .15s ease,background .15s ease}
.dsh-collaboration-panel-trigger:hover,.dsh-collaboration-panel-trigger[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-trigger.rail{justify-content:center;width:36px;height:36px;margin:8px 0 10px;padding:0;border-radius:50%}

.dsh-collaboration-panel-backdrop{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;padding:20px;background:rgb(15 18 25 / 28%);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:dsh-cp-fade .18s ease}
.dsh-collaboration-panel{position:relative;z-index:2147482001;width:min(680px,calc(100vw - 40px));height:min(720px,calc(100vh - 48px));display:flex;flex-direction:column;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:18px;box-shadow:0 24px 64px rgb(0 0 0 / 14%),0 2px 8px rgb(0 0 0 / 6%);animation:dsh-cp-rise .22s cubic-bezier(.2,.8,.2,1)}

.dsh-collaboration-panel-header{height:64px;flex:none;padding:0 12px 0 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--dsw-alias-border-l1);background:linear-gradient(180deg,var(--dsw-alias-bg-layer-1),color-mix(in srgb,var(--dsw-alias-bg-layer-1) 88%,var(--dsw-alias-bg-layer-2)))}
.dsh-collaboration-panel-brand{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;color:var(--dsw-alias-label-primary-inverted);background:var(--dsw-alias-brand-primary);box-shadow:inset 0 1px 0 rgb(255 255 255 / 18%)}
.dsh-collaboration-panel-brand svg{width:17px;height:17px}
.dsh-collaboration-panel-heading{min-width:0;flex:1}
.dsh-collaboration-panel-title{margin:0;font-size:15px;line-height:20px;font-weight:650;letter-spacing:-.01em}
.dsh-collaboration-panel-subtitle{margin-top:2px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-collaboration-panel-actions{display:flex;align-items:center;gap:2px}
.dsh-collaboration-panel-icon-btn{width:32px;height:32px;padding:0;border:0;border-radius:9px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:color .15s ease,background .15s ease,transform .12s ease}
.dsh-collaboration-panel-icon-btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-icon-btn:active{transform:scale(.96)}
.dsh-collaboration-panel-icon-btn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}

.dsh-collaboration-panel-body{min-height:0;flex:1;overflow:auto;overscroll-behavior:contain;padding:16px;display:flex;flex-direction:column;gap:12px;background:var(--dsw-alias-bg-layer-2);scrollbar-color:var(--dsw-alias-scrollbar-bg-l1) transparent}
.dsh-collaboration-panel-body::-webkit-scrollbar{width:10px}
.dsh-collaboration-panel-body::-webkit-scrollbar-thumb{border:3px solid transparent;border-radius:8px;background:var(--dsw-alias-scrollbar-bg-l1);background-clip:content-box}

.dsh-collaboration-panel-repos{padding:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 1px 0 rgb(255 255 255 / 55%) inset}
.dsh-collaboration-panel-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.dsh-collaboration-panel-kicker{color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:700;letter-spacing:.16em;line-height:14px;text-transform:uppercase}
.dsh-collaboration-panel-section-head h3{margin:2px 0 0;font-size:15px;line-height:20px;font-weight:650;letter-spacing:-.02em}
.dsh-collaboration-panel-count{min-width:28px;height:22px;padding:0 8px;border-radius:999px;display:inline-grid;place-items:center;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;font-variant-numeric:tabular-nums}

.dsh-collaboration-panel-repo-form{display:flex;gap:8px;margin-top:14px}
.dsh-collaboration-panel-repo-form input{min-width:0;flex:1;height:38px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:11px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:12.5px ui-monospace,SFMono-Regular,Menlo,monospace;outline:none;transition:border-color .15s ease,box-shadow .15s ease,background .15s ease}
.dsh-collaboration-panel-repo-form input::placeholder{color:var(--dsw-alias-label-tertiary)}
.dsh-collaboration-panel-repo-form input:focus{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-bg-layer-1);box-shadow:0 0 0 3px var(--dsw-alias-state-business-tertiary)}
.dsh-collaboration-panel-add{height:38px;padding:0 14px;border:0;border-radius:11px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);font:650 12.5px/1 system-ui,-apple-system,sans-serif;cursor:pointer;transition:opacity .15s ease,transform .12s ease}
.dsh-collaboration-panel-add:hover{opacity:.92}
.dsh-collaboration-panel-add:active{transform:scale(.98)}
.dsh-collaboration-panel-add:disabled{opacity:.5;cursor:wait}

.dsh-collaboration-panel-repo-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.dsh-collaboration-panel-repo-chip{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:6px 6px 6px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2) 70%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-label-secondary);transition:border-color .15s ease,background .15s ease}
.dsh-collaboration-panel-repo-chip:hover{border-color:var(--dsw-alias-border-l4);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-repo-chip code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--dsw-alias-label-primary)}
.dsh-collaboration-panel-repo-chip button{width:22px;height:22px;padding:0;border:0;border-radius:999px;background:transparent;color:var(--dsw-alias-label-tertiary);font-size:15px;line-height:1;cursor:pointer}
.dsh-collaboration-panel-repo-chip button:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-collaboration-panel-repo-empty{margin:14px 0 0;padding:14px 12px;border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:18px;text-align:center}

.dsh-collaboration-panel-board{display:flex;flex-direction:column;gap:10px;min-height:0}
.dsh-collaboration-panel-board-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:0 2px}
.dsh-collaboration-panel-board-head h3{margin:0;font-size:13px;font-weight:650;letter-spacing:-.01em}
.dsh-collaboration-panel-board-head span{color:var(--dsw-alias-label-tertiary);font-size:11px}

.dsh-collaboration-panel-empty,.dsh-collaboration-panel-status{margin:0;padding:36px 18px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);text-align:center;color:var(--dsw-alias-label-tertiary)}
.dsh-collaboration-panel-empty-title,.dsh-collaboration-panel-status-title{margin:0 0 6px;color:var(--dsw-alias-label-secondary);font-size:13.5px;font-weight:650;letter-spacing:-.01em}
.dsh-collaboration-panel-empty-desc,.dsh-collaboration-panel-status-desc{margin:0;font-size:12.5px;line-height:18px}
.dsh-collaboration-panel-spinner{width:18px;height:18px;margin:0 auto 12px;border:2px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-brand-primary);border-radius:50%;animation:dsh-cp-spin .7s linear infinite}

.dsh-collaboration-panel-err{margin:0;padding:12px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#c44) 28%,var(--dsw-alias-border-l2));background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#c44) 8%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-error-primary,#c44);white-space:pre-wrap;font-size:12.5px;line-height:18px}

.dsh-collaboration-panel-login{padding:18px;border-radius:16px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);box-shadow:0 1px 0 rgb(255 255 255 / 55%) inset}
.dsh-collaboration-panel-login-title{font-size:13.5px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}
.dsh-collaboration-panel-login a{color:var(--dsw-alias-brand-primary);font-size:12px;word-break:break-all}
.dsh-collaboration-panel-code{display:inline-flex;align-items:center;justify-content:center;min-width:160px;margin:12px 0;padding:10px 16px;border-radius:12px;background:var(--dsw-alias-bg-layer-2);border:1px dashed var(--dsw-alias-border-l2);font-size:22px;letter-spacing:.18em;font-weight:700;font-variant-numeric:tabular-nums}

.dsh-collaboration-panel-list{display:flex;flex-direction:column;gap:8px}
.dsh-collaboration-panel-row{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);color:inherit;cursor:pointer;padding:13px 14px;font:inherit;margin:0;transition:border-color .15s ease,box-shadow .15s ease,background .15s ease,transform .12s ease}
.dsh-collaboration-panel-row:hover{border-color:var(--dsw-alias-border-l4);box-shadow:0 8px 24px rgb(0 0 0 / 5%);transform:translateY(-1px)}
.dsh-collaboration-panel-row.on{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary),0 8px 24px rgb(0 0 0 / 5%)}
.dsh-collaboration-panel-row:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dsh-collaboration-panel-kind{flex:none;height:22px;padding:0 8px;border-radius:7px;display:inline-grid;place-items:center;font-size:10.5px;font-weight:700;letter-spacing:.04em;line-height:1;text-transform:uppercase}
.dsh-collaboration-panel-kind[data-kind="pr"]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary)}
.dsh-collaboration-panel-kind[data-kind="issue"]{color:var(--dsw-alias-state-success-primary,#1a7f37);background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#1a7f37) 12%,var(--dsw-alias-bg-layer-1))}
.dsh-collaboration-panel-row-main{min-width:0;flex:1}
.dsh-collaboration-panel-row-title{font-size:13.5px;line-height:19px;font-weight:550;letter-spacing:-.01em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.dsh-collaboration-panel-meta{margin-top:5px;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.dsh-collaboration-panel-fields{margin-top:10px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px}
.dsh-collaboration-panel-field{display:inline-flex;align-items:center;gap:6px;min-width:0}
.dsh-collaboration-panel-dot{width:8px;height:8px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 .5px rgb(0 0 0 / 12%)}
.dsh-collaboration-panel-dot[data-tone="red"]{background:#ff5f57}
.dsh-collaboration-panel-dot[data-tone="yellow"]{background:#febc2e}
.dsh-collaboration-panel-dot[data-tone="green"]{background:#28c840}
.dsh-collaboration-panel-field-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.dsh-collaboration-panel-detail{margin:0;padding:16px;border-radius:16px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.dsh-collaboration-panel-detail-title{margin:0;font-size:14.5px;line-height:20px;font-weight:650;letter-spacing:-.01em}
.dsh-collaboration-panel-state{flex:none;height:22px;padding:0 8px;border-radius:7px;display:inline-grid;place-items:center;font-size:11px;font-weight:650;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);text-transform:capitalize}
.dsh-collaboration-panel-detail-body{margin:12px 0 0;padding:12px 14px;border-radius:12px;background:var(--dsw-alias-bg-layer-2);white-space:pre-wrap;font:inherit;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-secondary);max-height:280px;overflow:auto}
.dsh-collaboration-panel-detail a{display:inline-flex;margin-top:12px;color:var(--dsw-alias-brand-primary);font-size:12.5px;font-weight:600;text-decoration:none}
.dsh-collaboration-panel-detail a:hover{text-decoration:underline}

.dsh-collaboration-panel-footer{min-height:42px;flex:none;padding:0 18px;border-top:1px solid var(--dsw-alias-border-l1);display:flex;align-items:center;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;background:var(--dsw-alias-bg-layer-1)}

@keyframes dsh-cp-fade{from{opacity:0}to{opacity:1}}
@keyframes dsh-cp-rise{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
@keyframes dsh-cp-spin{to{transform:rotate(360deg)}}
@media (max-width:680px){.dsh-collaboration-panel{width:calc(100vw - 24px);height:calc(100vh - 32px);border-radius:14px}}
@media (prefers-reduced-motion:reduce){.dsh-collaboration-panel-trigger,.dsh-collaboration-panel-icon-btn,.dsh-collaboration-panel-row,.dsh-collaboration-panel-backdrop,.dsh-collaboration-panel,.dsh-collaboration-panel-spinner{animation:none;transition:none}}
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

function Panel({ onClose }) {
  const [items, setItems] = useState(null)
  const [repos, setRepos] = useState(null)
  const [repoInput, setRepoInput] = useState('')
  const [repoBusy, setRepoBusy] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [detail, setDetail] = useState(null)
  const [sel, setSel] = useState(null)

  async function loadRepos() {
    const repoResponse = await fetch(REPOS)
    const repoText = await repoResponse.text()
    if (!repoResponse.ok) throw new Error(repoText)
    const liveRepos = JSON.parse(repoText)
    setRepos(liveRepos)
    return liveRepos
  }

  async function refresh() {
    setError(null); setDetail(null); setSel(null); setItems(null)
    try {
      const liveRepos = await loadRepos()
      if (liveRepos.length === 0) { setItems([]); setLoggingIn(false); return }
      const response = await fetch(API)
      const text = await response.text()
      if (response.status === 401 || text.includes('not logged in')) {
        setItems(null); setLoggingIn(true); setNotice(null)
        try {
          await runLogin((value) => { setNotice(value); if (value.url) window.open(value.url, '_blank', 'noopener,noreferrer') })
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
    setSel(`${item.repo}#${item.number}`)
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
      setRepoInput(''); setRepos(JSON.parse(text))
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    finally { setRepoBusy(false) }
  }

  async function removeRepo(repo) {
    setRepoBusy(true); setError(null)
    try {
      const response = await fetch(REPOS, { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ repo }) })
      const text = await response.text()
      if (!response.ok) throw new Error(text)
      setRepos(JSON.parse(text))
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    finally { setRepoBusy(false) }
  }

  let subtitle = '加载中…'
  if (loggingIn) subtitle = '正在通过 GitHub 登录…'
  else if (repos) {
    const repoLabel = repos.length + ' 个仓库'
    subtitle = items ? repoLabel + ' · ' + items.length + ' 条待办' : repoLabel + ' · 刷新看板中'
  }

  return h('div', { className: 'dsh-collaboration-panel-backdrop', onPointerDown: (event) => { if (event.currentTarget === event.target) onClose() } },
    h('section', { id: PANEL_ID, className: 'dsh-collaboration-panel', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'dsh-collaboration-panel-title' },
      h('header', { className: 'dsh-collaboration-panel-header' },
        h('span', { className: 'dsh-collaboration-panel-brand' }, h(IconList)),
        h('div', { className: 'dsh-collaboration-panel-heading' }, h('h2', { className: 'dsh-collaboration-panel-title', id: 'dsh-collaboration-panel-title' }, '协作面板'), h('div', { className: 'dsh-collaboration-panel-subtitle' }, subtitle)),
        h('div', { className: 'dsh-collaboration-panel-actions' },
          h('button', { type: 'button', className: 'dsh-collaboration-panel-icon-btn', title: '刷新', 'aria-label': '刷新', onClick: () => void refresh() }, h(IconRefresh)),
          h('button', { type: 'button', className: 'dsh-collaboration-panel-icon-btn', title: '关闭', 'aria-label': '关闭', onClick: onClose }, h(IconClose)))),
      h('div', { className: 'dsh-collaboration-panel-body' },
        h('section', { className: 'dsh-collaboration-panel-repos' },
          h('div', { className: 'dsh-collaboration-panel-section-head' }, h('div', null, h('div', { className: 'dsh-collaboration-panel-kicker' }, 'WATCHLIST'), h('h3', null, '仓库')), h('span', { className: 'dsh-collaboration-panel-count' }, repos ? String(repos.length) : '…')),
          h('form', { className: 'dsh-collaboration-panel-repo-form', onSubmit: addRepo }, h('input', { value: repoInput, onInput: (event) => setRepoInput(event.currentTarget.value), placeholder: 'owner/name', 'aria-label': 'Repository owner/name', spellCheck: false }), h('button', { type: 'submit', disabled: repoBusy, className: 'dsh-collaboration-panel-add' }, repoBusy ? '保存中…' : '添加')),
          repos && repos.length > 0 && h('div', { className: 'dsh-collaboration-panel-repo-list' }, repos.map((repo) => h('span', { className: 'dsh-collaboration-panel-repo-chip', key: repo }, h('code', null, repo), h('button', { type: 'button', disabled: repoBusy, onClick: () => void removeRepo(repo), 'aria-label': 'Remove ' + repo }, '×')))),
          repos && repos.length === 0 && h('p', { className: 'dsh-collaboration-panel-repo-empty' }, '先添加一个仓库，看板才会开始拉取 issue / review。')),
        error && h('div', { className: 'dsh-collaboration-panel-err' }, error),
        loggingIn && h('div', { className: 'dsh-collaboration-panel-login' }, h('p', { className: 'dsh-collaboration-panel-login-title' }, notice?.message || '正在启动 GitHub 登录…'), notice?.code && h('div', { className: 'dsh-collaboration-panel-code' }, notice.code), notice?.url && h('a', { href: notice.url, target: '_blank', rel: 'noreferrer' }, notice.url)),
        !error && !loggingIn && !items && h('div', { className: 'dsh-collaboration-panel-status' }, h('div', { className: 'dsh-collaboration-panel-spinner', 'aria-hidden': true }), h('p', { className: 'dsh-collaboration-panel-status-title' }, '正在加载看板'), h('p', { className: 'dsh-collaboration-panel-status-desc' }, '拉取当前 watchlist 上的 issue 与 review 请求')),
        !error && !loggingIn && repos && repos.length > 0 && items && h('section', { className: 'dsh-collaboration-panel-board' },
          h('div', { className: 'dsh-collaboration-panel-board-head' }, h('h3', null, '看板'), h('span', null, items.length ? items.length + ' 条' : '暂无')),
          items.length === 0
            ? h('div', { className: 'dsh-collaboration-panel-empty' }, h('p', { className: 'dsh-collaboration-panel-empty-title' }, '还没有待办'), h('p', { className: 'dsh-collaboration-panel-empty-desc' }, '当前仓库里没有指派给你的 issue，也没有等你 review 的 PR。'))
            : h('div', { className: 'dsh-collaboration-panel-list' }, items.map((item) => h('button', { key: `${item.repo}#${item.number}`, type: 'button', className: `dsh-collaboration-panel-row${sel === `${item.repo}#${item.number}` ? ' on' : ''}`, onClick: () => void openRow(item) }, h('span', { className: 'dsh-collaboration-panel-kind', 'data-kind': item.kind }, item.kind), h('div', { className: 'dsh-collaboration-panel-row-main' }, h('div', { className: 'dsh-collaboration-panel-row-title' }, item.title), h('div', { className: 'dsh-collaboration-panel-meta' }, `${item.repo}#${item.number} · ${item.author} · ${fmtTime(item.updatedAt)}`)))))),
        detail && h('div', { className: 'dsh-collaboration-panel-detail' }, h('div', { className: 'dsh-collaboration-panel-detail-head' }, h('h3', { className: 'dsh-collaboration-panel-detail-title' }, detail.title), h('span', { className: 'dsh-collaboration-panel-state' }, detail.state)), h('div', { className: 'dsh-collaboration-panel-fields' }, h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'red', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `labels: ${detail.labels.join(', ') || '—'}`)), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'yellow', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `assignees: ${detail.assignees.join(', ') || '—'}`)), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'green', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `reviewers: ${detail.requestedReviewers.join(', ') || '—'}`))), h('pre', { className: 'dsh-collaboration-panel-detail-body' }, detail.body || '(no body)'), h('a', { href: detail.url, target: '_blank', rel: 'noreferrer' }, '在 GitHub 打开'))),
      h('footer', { className: 'dsh-collaboration-panel-footer' }, '点选一行查看详情 · 完整讨论请到 GitHub')))
}

function Entry({ wide }) {
  const [open, setOpen] = useState(false)
  return h(React.Fragment, null,
    h('button', { type: 'button', className: `dsh-collaboration-panel-trigger${wide ? '' : ' rail'}`, title: '协作面板', 'aria-label': '协作面板', 'aria-expanded': open, 'aria-controls': PANEL_ID, onClick: () => setOpen((value) => !value) }, h(IconList), wide && h('span', null, '协作面板')),
    open && h(Panel, { onClose: () => setOpen(false) }))
}

function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'collaboration-panel: styles')
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'collaboration-panel', order: 0 }, Entry))
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
