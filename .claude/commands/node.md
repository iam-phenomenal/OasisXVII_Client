# Using Node in This Project

Node is managed via **nvm** and is not on the system PATH. Always invoke it with the full path.

## Node binary

```
/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node
```

## Running scripts

```bash
/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node <script.js>
```

## Running local bin tools (tsc, next, eslint, etc.)

```bash
/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/<tool> [args]
```

### Common examples

| Task | Command |
|------|---------|
| Type-check | `/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/tsc --noEmit` |
| Dev server | `/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/next dev` |
| Build | `/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/next build` |
| Lint | `/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin/node node_modules/.bin/next lint` |

## Why `npx` / bare `node` won't work

The shell Claude Code runs in does not source `~/.bashrc` or `~/.nvm/nvm.sh`, so nvm's shims are never loaded. `npx` and `node` are not on PATH. Always use the absolute path above.
