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
