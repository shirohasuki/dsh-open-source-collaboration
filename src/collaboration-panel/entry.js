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
