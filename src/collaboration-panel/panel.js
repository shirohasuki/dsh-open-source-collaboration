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
