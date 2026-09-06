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
.dsh-collaboration-view{display:flex;flex:1 1 auto;min-width:0;min-height:0;flex-direction:column;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel{box-sizing:border-box;position:relative;display:flex;flex:1 1 auto;min-width:0;min-height:0;flex-direction:column;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-header{box-sizing:border-box;display:flex;flex:none;align-items:center;gap:12px;min-height:64px;padding:12px 20px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-brand{display:grid;flex:none;width:34px;height:34px;place-items:center;border-radius:10px;color:var(--dsw-alias-label-primary-inverted);background:var(--dsw-alias-brand-primary)}.dsh-collaboration-panel-brand svg{width:18px;height:18px}.dsh-collaboration-panel-heading{flex:1 1 auto;min-width:0}.dsh-collaboration-panel-title{margin:0;font-size:15px;font-weight:650;line-height:20px;letter-spacing:.01em}.dsh-collaboration-panel-subtitle{margin-top:2px;overflow:hidden;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;text-overflow:ellipsis;white-space:nowrap}
.dsh-collaboration-panel-actions{display:flex;flex:none;align-items:center;gap:2px}.dsh-collaboration-panel-icon-btn{display:grid;width:32px;height:32px;padding:0;place-items:center;border:0;border-radius:8px;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:color .15s ease,background .15s ease}.dsh-collaboration-panel-icon-btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.dsh-collaboration-panel-icon-btn:focus-visible,.dsh-collaboration-panel-add:focus-visible,.dsh-collaboration-panel-repo-chip button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dsh-collaboration-panel-body{box-sizing:border-box;flex:1 1 auto;min-height:0;overflow:auto;padding:20px;overscroll-behavior:contain;background:var(--dsw-alias-bg-layer-2);scrollbar-color:var(--dsw-alias-scrollbar-bg-l1) transparent}.dsh-collaboration-panel-body::-webkit-scrollbar{width:10px}.dsh-collaboration-panel-body::-webkit-scrollbar-thumb{border:3px solid transparent;border-radius:8px;background:var(--dsw-alias-scrollbar-bg-l1);background-clip:content-box}
.dsh-collaboration-panel-repos,.dsh-collaboration-panel-board,.dsh-collaboration-panel-detail,.dsh-collaboration-panel-login{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1)}.dsh-collaboration-panel-repos{padding:16px}.dsh-collaboration-panel-section-head,.dsh-collaboration-panel-board-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dsh-collaboration-panel-section-head h3,.dsh-collaboration-panel-board-head h3{margin:0;font-size:13px;font-weight:650;line-height:18px}.dsh-collaboration-panel-kicker{margin-bottom:3px;color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:650;letter-spacing:.08em;line-height:14px}.dsh-collaboration-panel-count,.dsh-collaboration-panel-board-head>span{flex:none;min-width:24px;padding:3px 8px;border-radius:999px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);font-size:11px;line-height:16px;text-align:center}
.dsh-collaboration-panel-repo-form{display:flex;gap:8px;margin-top:14px}.dsh-collaboration-panel-repo-form input{box-sizing:border-box;flex:1;min-width:0;height:34px;padding:7px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);font:inherit;font-size:12px;transition:border-color .15s ease,box-shadow .15s ease}.dsh-collaboration-panel-repo-form input::placeholder{color:var(--dsw-alias-label-tertiary)}.dsh-collaboration-panel-repo-form input:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px var(--dsw-alias-state-business-tertiary)}.dsh-collaboration-panel-add{flex:none;height:34px;padding:0 13px;border:0;border-radius:8px;color:var(--dsw-alias-label-primary-inverted);background:var(--dsw-alias-brand-primary);cursor:pointer;font:inherit;font-size:12px;font-weight:600;transition:filter .15s ease,opacity .15s ease}.dsh-collaboration-panel-add:hover{filter:brightness(.94)}.dsh-collaboration-panel-add:disabled,.dsh-collaboration-panel-repo-chip button:disabled{cursor:default;opacity:.55}
.dsh-collaboration-panel-repo-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsh-collaboration-panel-repo-chip{display:inline-flex;align-items:center;gap:5px;max-width:100%;min-height:26px;padding:2px 5px 2px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);font-size:11px}.dsh-collaboration-panel-repo-chip code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsh-collaboration-panel-repo-chip button{display:grid;width:20px;height:20px;padding:0;place-items:center;border:0;border-radius:50%;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;font-size:16px;line-height:1}.dsh-collaboration-panel-repo-chip button:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.dsh-collaboration-panel-repo-empty{margin:12px 0 0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dsh-collaboration-panel-err{margin:12px 0 0;padding:10px 12px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:10px;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-1);font-size:12px;line-height:18px;white-space:pre-wrap}.dsh-collaboration-panel-login{margin-top:12px;padding:16px}.dsh-collaboration-panel-login-title{margin:0;font-size:13px;font-weight:600;line-height:18px}.dsh-collaboration-panel-login a,.dsh-collaboration-panel-detail a{color:var(--dsw-alias-brand-primary);font-size:12px;word-break:break-all}.dsh-collaboration-panel-code{margin:10px 0;color:var(--dsw-alias-label-primary);font-size:22px;font-weight:650;letter-spacing:.12em;line-height:28px}
.dsh-collaboration-panel-status,.dsh-collaboration-panel-empty{padding:34px 16px;color:var(--dsw-alias-label-tertiary);text-align:center}.dsh-collaboration-panel-status-title,.dsh-collaboration-panel-empty-title{margin:12px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:600;line-height:18px}.dsh-collaboration-panel-status-desc,.dsh-collaboration-panel-empty-desc{max-width:340px;margin:5px auto 0;font-size:12px;line-height:18px}.dsh-collaboration-panel-spinner{width:20px;height:20px;margin:0 auto;border:2px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-state-business-primary);border-radius:50%;animation:dsh-collaboration-panel-spin .75s linear infinite}@keyframes dsh-collaboration-panel-spin{to{transform:rotate(360deg)}}
.dsh-collaboration-panel-board{margin-top:12px;padding:16px}.dsh-collaboration-panel-list{display:flex;flex-direction:column;gap:8px;margin-top:12px}.dsh-collaboration-panel-row{display:flex;align-items:flex-start;gap:12px;width:100%;margin:0;padding:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:11px;color:inherit;background:var(--dsw-alias-bg-layer-1);cursor:pointer;font:inherit;text-align:left;transition:border-color .15s ease,box-shadow .15s ease,background .15s ease}.dsh-collaboration-panel-row:hover{border-color:var(--dsw-alias-border-l4);background:var(--dsw-alias-bg-layer-2);box-shadow:0 2px 8px rgb(0 0 0 / 6%)}.dsh-collaboration-panel-row.on{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary)}.dsh-collaboration-panel-row:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.dsh-collaboration-panel-kind{display:inline-grid;flex:none;height:22px;padding:0 8px;place-items:center;border-radius:7px;font-size:10px;font-weight:700;letter-spacing:.04em;line-height:1;text-transform:uppercase}.dsh-collaboration-panel-kind[data-kind="pr"]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary)}.dsh-collaboration-panel-kind[data-kind="issue"]{color:var(--dsw-alias-state-success-primary);background:var(--dsw-alias-interactive-bg-hover)}.dsh-collaboration-panel-row-main{flex:1 1 auto;min-width:0}.dsh-collaboration-panel-row-title{display:-webkit-box;overflow:hidden;font-size:13px;font-weight:550;line-height:18px;-webkit-box-orient:vertical;-webkit-line-clamp:2}.dsh-collaboration-panel-meta{overflow:hidden;margin-top:4px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;text-overflow:ellipsis;white-space:nowrap}
.dsh-collaboration-panel-detail{margin-top:12px;padding:16px}.dsh-collaboration-panel-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dsh-collaboration-panel-detail-title{min-width:0;margin:0;font-size:14px;font-weight:650;line-height:20px}.dsh-collaboration-panel-state{display:inline-grid;flex:none;min-height:22px;padding:0 8px;place-items:center;border-radius:7px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);font-size:11px;line-height:22px;text-transform:capitalize}.dsh-collaboration-panel-fields{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:12px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}.dsh-collaboration-panel-field{display:inline-flex;align-items:center;gap:6px;min-width:0}.dsh-collaboration-panel-dot{flex:none;width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 .5px rgb(0 0 0 / 12%)}.dsh-collaboration-panel-dot[data-tone="red"]{background:#ff5f57}.dsh-collaboration-panel-dot[data-tone="yellow"]{background:#febc2e}.dsh-collaboration-panel-dot[data-tone="green"]{background:#28c840}.dsh-collaboration-panel-field-text{overflow:hidden;min-width:0;text-overflow:ellipsis;white-space:nowrap}.dsh-collaboration-panel-detail-body{max-height:280px;margin:12px 0;padding:12px;overflow:auto;border-radius:10px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);font:inherit;font-size:12px;line-height:18px;white-space:pre-wrap}
.dsh-collaboration-panel-footer{display:flex;flex:none;align-items:center;min-height:40px;padding:0 20px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
@media(max-width:640px){.dsh-collaboration-panel-header,.dsh-collaboration-panel-footer{padding-right:14px;padding-left:14px}.dsh-collaboration-panel-body{padding:12px}}@media(prefers-reduced-motion:reduce){.dsh-collaboration-panel-icon-btn,.dsh-collaboration-panel-add,.dsh-collaboration-panel-row{transition:none}.dsh-collaboration-panel-spinner{animation:none}}
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

function Panel() {
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

  return h('div', { className: 'dsh-collaboration-panel' },
      h('header', { className: 'dsh-collaboration-panel-header' },
        h('span', { className: 'dsh-collaboration-panel-brand' }, h(IconList)),
        h('div', { className: 'dsh-collaboration-panel-heading' }, h('h2', { className: 'dsh-collaboration-panel-title', id: 'dsh-collaboration-panel-title' }, '协作'), h('div', { className: 'dsh-collaboration-panel-subtitle' }, subtitle)),
        h('div', { className: 'dsh-collaboration-panel-actions' },
          h('button', { type: 'button', className: 'dsh-collaboration-panel-icon-btn', title: '刷新', 'aria-label': '刷新', onClick: () => void refresh() }, h(IconRefresh))),
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
      h('footer', { className: 'dsh-collaboration-panel-footer' }, '点选一行查看详情 · 底部聊天栏可继续对话')))
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
