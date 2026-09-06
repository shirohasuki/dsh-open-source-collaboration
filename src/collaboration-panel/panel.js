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
