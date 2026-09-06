window.__ModuleLoader__.load({
  id: "@dangosys/dsh-open-source-collaboration/collaboration-panel",
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
const { useEffect, useState } = React
const h = React.createElement
const API = '/integrations/collaboration-panel/items'
const LOGIN = '/integrations/role/login'
const STYLE_ID = 'dsh-collaboration-panel-style'
const PANEL_ID = 'dsh-collaboration-panel'

const CSS = `
.dsh-collaboration-panel-trigger{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:calc(100% + 8px);height:34px;margin:4px -4px;padding:6px 2px 6px 10px;border:0;border-radius:12px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;overflow:hidden;transition:color .15s ease,background .15s ease}
.dsh-collaboration-panel-trigger:hover,.dsh-collaboration-panel-trigger[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-trigger.rail{justify-content:center;width:36px;height:36px;margin:8px 0 10px;padding:0;border-radius:50%}
.dsh-collaboration-panel-backdrop{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;background:rgb(0 0 0 / 16%)}
.dsh-collaboration-panel{position:relative;z-index:2147482001;width:min(720px,calc(100vw - 32px));height:min(760px,calc(100vh - 40px));display:flex;flex-direction:column;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;box-shadow:var(--dsw-shadow-lv3)}
.dsh-collaboration-panel-header{height:60px;flex:none;padding:0 14px 0 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-collaboration-panel-brand{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;flex:none;color:var(--dsw-alias-label-primary-inverted);background:var(--dsw-alias-brand-primary)}
.dsh-collaboration-panel-brand svg{width:17px;height:17px}
.dsh-collaboration-panel-heading{min-width:0;flex:1}
.dsh-collaboration-panel-title{margin:0;font-size:15px;line-height:20px;font-weight:600;letter-spacing:.01em}
.dsh-collaboration-panel-subtitle{margin-top:2px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-collaboration-panel-actions{display:flex;align-items:center;gap:2px}
.dsh-collaboration-panel-icon-btn{width:30px;height:30px;padding:0;border:0;border-radius:7px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:color .15s ease,background .15s ease}
.dsh-collaboration-panel-icon-btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-icon-btn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dsh-collaboration-panel-body{min-height:0;flex:1;overflow:auto;overscroll-behavior:contain;padding:12px;background:var(--dsw-alias-bg-layer-2);scrollbar-color:var(--dsw-alias-scrollbar-bg-l1) transparent}
.dsh-collaboration-panel-body::-webkit-scrollbar{width:10px}
.dsh-collaboration-panel-body::-webkit-scrollbar-thumb{border:3px solid transparent;border-radius:8px;background:var(--dsw-alias-scrollbar-bg-l1);background-clip:content-box}
.dsh-collaboration-panel-empty,.dsh-collaboration-panel-status{padding:28px 16px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:18px}
.dsh-collaboration-panel-err{margin:0 0 10px;padding:10px 12px;border-radius:10px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-state-error-primary, #c44);white-space:pre-wrap;font-size:12px}
.dsh-collaboration-panel-login{padding:16px;border-radius:12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-login-title{font-size:13px;font-weight:600;margin:0 0 6px}
.dsh-collaboration-panel-login a{color:var(--dsw-alias-brand-primary);font-size:12px;word-break:break-all}
.dsh-collaboration-panel-code{font-size:22px;letter-spacing:.12em;margin:10px 0;font-weight:600}
.dsh-collaboration-panel-list{display:flex;flex-direction:column;gap:8px}
.dsh-collaboration-panel-row{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);color:inherit;cursor:pointer;padding:12px 14px;font:inherit;margin:0;transition:border-color .15s ease,box-shadow .15s ease,background .15s ease}
.dsh-collaboration-panel-row:hover{border-color:var(--dsw-alias-border-l4);box-shadow:var(--dsw-shadow-lv1)}
.dsh-collaboration-panel-row.on{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary)}
.dsh-collaboration-panel-row:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.dsh-collaboration-panel-kind{flex:none;height:22px;padding:0 8px;border-radius:7px;display:inline-grid;place-items:center;font-size:11px;font-weight:600;letter-spacing:.02em;line-height:1;text-transform:uppercase}
.dsh-collaboration-panel-kind[data-kind="pr"]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary)}
.dsh-collaboration-panel-kind[data-kind="issue"]{color:var(--dsw-alias-state-success-primary, #1a7f37);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-collaboration-panel-row-main{min-width:0;flex:1}
.dsh-collaboration-panel-row-title{font-size:13px;line-height:18px;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.dsh-collaboration-panel-meta{margin-top:4px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-collaboration-panel-fields{margin-top:8px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dsh-collaboration-panel-field{display:inline-flex;align-items:center;gap:6px;min-width:0}
.dsh-collaboration-panel-dot{width:8px;height:8px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 12%)}
.dsh-collaboration-panel-dot[data-tone="red"]{background:#ff5f57}
.dsh-collaboration-panel-dot[data-tone="yellow"]{background:#febc2e}
.dsh-collaboration-panel-dot[data-tone="green"]{background:#28c840}
.dsh-collaboration-panel-field-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-collaboration-panel-detail{margin-top:12px;padding:14px;border-radius:12px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dsh-collaboration-panel-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.dsh-collaboration-panel-detail-title{margin:0;font-size:14px;line-height:20px;font-weight:600}
.dsh-collaboration-panel-state{flex:none;height:22px;padding:0 8px;border-radius:7px;display:inline-grid;place-items:center;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);text-transform:capitalize}
.dsh-collaboration-panel-detail-body{margin:12px 0 0;padding:12px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);white-space:pre-wrap;font:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);max-height:280px;overflow:auto}
.dsh-collaboration-panel-detail a{color:var(--dsw-alias-brand-primary);font-size:12px}
.dsh-collaboration-panel-footer{min-height:40px;flex:none;padding:0 18px;border-top:1px solid var(--dsw-alias-border-l1);display:flex;align-items:center;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
@media (max-width:680px){.dsh-collaboration-panel{width:calc(100vw - 24px);height:calc(100vh - 32px)}}
@media (prefers-reduced-motion:reduce){.dsh-collaboration-panel-trigger,.dsh-collaboration-panel-icon-btn,.dsh-collaboration-panel-row{transition:none}}
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
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [detail, setDetail] = useState(null)
  const [sel, setSel] = useState(null)

  async function refresh() {
    setError(null); setDetail(null); setSel(null)
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
  }

  useEffect(() => { void refresh() }, [])

  async function openRow(item) {
    setSel(`${item.repo}#${item.number}`)
    const response = await fetch(`${API}/${encodeURIComponent(item.repo)}/${item.number}`)
    const text = await response.text()
    if (!response.ok) { setError(text); setDetail(null); return }
    setError(null); setDetail(JSON.parse(text))
  }

  const count = items ? items.length : 0
  const subtitle = loggingIn ? 'Signing in with GitHub…' : items ? `${count} assigned · live from GitHub` : 'Loading…'
  return h('div', { className: 'dsh-collaboration-panel-backdrop', onPointerDown: (event) => { if (event.currentTarget === event.target) onClose() } },
    h('section', { id: PANEL_ID, className: 'dsh-collaboration-panel', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'dsh-collaboration-panel-title' },
      h('header', { className: 'dsh-collaboration-panel-header' },
        h('span', { className: 'dsh-collaboration-panel-brand' }, h(IconList)),
        h('div', { className: 'dsh-collaboration-panel-heading' }, h('h2', { className: 'dsh-collaboration-panel-title', id: 'dsh-collaboration-panel-title' }, '协作面板'), h('div', { className: 'dsh-collaboration-panel-subtitle' }, subtitle)),
        h('div', { className: 'dsh-collaboration-panel-actions' },
          h('button', { type: 'button', className: 'dsh-collaboration-panel-icon-btn', title: 'Refresh', 'aria-label': 'Refresh', onClick: () => void refresh() }, h(IconRefresh)),
          h('button', { type: 'button', className: 'dsh-collaboration-panel-icon-btn', title: 'Close', 'aria-label': 'Close', onClick: onClose }, h(IconClose)))),
      h('div', { className: 'dsh-collaboration-panel-body' },
        error && h('div', { className: 'dsh-collaboration-panel-err' }, error),
        loggingIn && h('div', { className: 'dsh-collaboration-panel-login' }, h('p', { className: 'dsh-collaboration-panel-login-title' }, notice?.message || 'Starting GitHub sign-in…'), notice?.code && h('div', { className: 'dsh-collaboration-panel-code' }, notice.code), notice?.url && h('a', { href: notice.url, target: '_blank', rel: 'noreferrer' }, notice.url)),
        !error && !loggingIn && !items && h('div', { className: 'dsh-collaboration-panel-status' }, 'Loading…'),
        !error && !loggingIn && items && items.length === 0 && h('div', { className: 'dsh-collaboration-panel-empty' }, 'No assigned issues or review requests'),
        !error && !loggingIn && items && items.length > 0 && h('div', { className: 'dsh-collaboration-panel-list' }, items.map((item) => h('button', { key: `${item.repo}#${item.number}`, type: 'button', className: `dsh-collaboration-panel-row${sel === `${item.repo}#${item.number}` ? ' on' : ''}`, onClick: () => void openRow(item) }, h('span', { className: 'dsh-collaboration-panel-kind', 'data-kind': item.kind }, item.kind), h('div', { className: 'dsh-collaboration-panel-row-main' }, h('div', { className: 'dsh-collaboration-panel-row-title' }, item.title), h('div', { className: 'dsh-collaboration-panel-meta' }, `${item.repo}#${item.number} · ${item.author} · ${fmtTime(item.updatedAt)}`))))),
        detail && h('div', { className: 'dsh-collaboration-panel-detail' }, h('div', { className: 'dsh-collaboration-panel-detail-head' }, h('h3', { className: 'dsh-collaboration-panel-detail-title' }, detail.title), h('span', { className: 'dsh-collaboration-panel-state' }, detail.state)), h('div', { className: 'dsh-collaboration-panel-fields' }, h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'red', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `labels: ${detail.labels.join(', ') || '—'}`)), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'yellow', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `assignees: ${detail.assignees.join(', ') || '—'}`)), h('span', { className: 'dsh-collaboration-panel-field' }, h('span', { className: 'dsh-collaboration-panel-dot', 'data-tone': 'green', 'aria-hidden': true }), h('span', { className: 'dsh-collaboration-panel-field-text' }, `reviewers: ${detail.requestedReviewers.join(', ') || '—'}`))), h('pre', { className: 'dsh-collaboration-panel-detail-body' }, detail.body || '(no body)'), h('a', { href: detail.url, target: '_blank', rel: 'noreferrer' }, 'Open on GitHub'))),
      h('footer', { className: 'dsh-collaboration-panel-footer' }, 'Select a row to inspect · Open on GitHub for the full thread')))
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
