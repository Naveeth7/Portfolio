# Naveeth Poojari · Portfolio

A desktop portfolio built with Wails, Go, React and TypeScript. It covers backend engineering, distributed systems, platform work and selected projects. The same React interface runs in a standalone browser preview.

## Desktop

Install Go 1.23 or later, Node.js 22.12 or later, and the native prerequisites for [Wails v2](https://wails.io/docs/gettingstarted/installation).

```sh
go install github.com/wailsapp/wails/v2/cmd/wails@v2.12.0
wails doctor
wails dev
wails build
```

On Linux with WebKitGTK 4.1, pass `-tags webkit2_41` to `wails dev` and `wails build`. Release builds are written to `build/bin`.

## Browser

```sh
cd frontend
npm ci
npm run dev
```

From the `frontend` directory, run `npm run build` to type-check and generate the static files in `dist`. Run `npm run preview` to serve that build locally.

Edit `frontend/src/portfolio.json` to update the content. The desktop loads the same data through the Go bindings and opens external links in the system browser.
