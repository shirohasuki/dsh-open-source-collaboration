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
.dsh-collaboration-panel-repos{padding:14px 14px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1)}
.dsh-collaboration-panel-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}.dsh-collaboration-panel-kicker{color:var(--dsw-alias-state-business-primary);font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px}.dsh-collaboration-panel-section-head h3{margin:1px 0 0;font-size:16px;line-height:22px;letter-spacing:-.02em}.dsh-collaboration-panel-count{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.dsh-collaboration-panel-repo-form{display:flex;gap:8px;margin-top:12px}.dsh-collaboration-panel-repo-form input{min-width:0;flex:1;height:36px;padding:0 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:12px ui-monospace,SFMono-Regular,Menlo,monospace;outline:none}.dsh-collaboration-panel-repo-form input:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px var(--dsw-alias-state-business-tertiary)}.dsh-collaboration-panel-add{height:36px;padding:0 13px;border:0;border-radius:8px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);font:600 12px sans-serif;cursor:pointer}.dsh-collaboration-panel-add:disabled{opacity:.55;cursor:wait}
.dsh-collaboration-panel-repo-list{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.dsh-collaboration-panel-repo-chip{display:inline-flex;align-items:center;gap:7px;max-width:100%;padding:5px 6px 5px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}.dsh-collaboration-panel-repo-chip code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:11px ui-monospace,SFMono-Regular,Menlo,monospace}.dsh-collaboration-panel-repo-chip button{width:19px;height:19px;padding:0;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-tertiary);font-size:16px;line-height:16px;cursor:pointer}.dsh-collaboration-panel-repo-chip button:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dsh-collaboration-panel-repo-empty{margin:12px 0 0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dsh-collaboration-panel-empty{margin-top:12px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px}
`
