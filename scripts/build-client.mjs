import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const parts = await Promise.all([
  'client.js',
  'style.js',
  'icons.js',
  'panel.js',
  'entry.js',
].map(file => readFile(resolve(root, 'src/collaboration-panel', file), 'utf8')))
const rootId = '@dangosys/dsh-open-source-collaboration'
const collaborationPanelId = '@dangosys/dsh-open-source-collaboration/collaboration-panel'
const body = parts.join('\n')
const collaborationPanel = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(collaborationPanelId)},\n  factory: (require) => {\n    const module = { exports: {} }\n    ${body}\n    module.exports.apply = apply\n    module.exports.inject = ['slots']\n    return module.exports\n  },\n})\n`
const entry = `${collaborationPanel}window.__ModuleLoader__.load({\n  id: ${JSON.stringify(rootId)},\n  factory: (require) => {\n    const module = { exports: {} }\n    const panel = require(${JSON.stringify(collaborationPanelId)})\n    module.exports.apply = (ctx) => panel.apply(ctx)\n    module.exports.inject = ['slots']\n    return module.exports\n  },\n})\n`
await mkdir(resolve(root, 'lib'), { recursive: true })
await writeFile(resolve(root, 'lib/client.js'), entry)
