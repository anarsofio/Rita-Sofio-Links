export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fff; color: #1a1a1a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #6b6b6b; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1.25rem; border-radius: 9999px; font: inherit; font-weight: 500; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: opacity 0.15s; }
      a:hover, button:hover { opacity: 0.85; }
      .primary { background: #83273c; color: #fff; }
      .secondary { background: #fff; color: #1a1a1a; border-color: #d9d9d9; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/home">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
