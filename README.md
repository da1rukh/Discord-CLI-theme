# MS-DOS Amber System24 TUI

Discord theme inspired by the supplied `system24` TUI theme and the black/orange Spotify layout.

## Files

- `themes/msdos-tui.css` — main theme. It imports the system24 layout engine and overrides its tokens with the Spotify-compatible `#ff8c42` palette.
- `themes/msdos-tui-context.css` — optional route/icon layer using `data-tui-view`.
- `themes/msdos-tui-runtime.js` — optional JavaScript runtime for route detection and guild icon recovery.

## Install

1. Install the supplied `msdos-tui.css` through Vencord's Themes/local theme loader.
2. If your loader accepts multiple CSS files, also load `msdos-tui-context.css` after the main theme.
3. The main theme imports system24 from:
   `https://refact0r.github.io/system24/build/system24.css`
   Keep internet access available or vendor that dependency locally if you want fully offline operation.
4. JavaScript is **not executed by a CSS theme loader**. Load `msdos-tui-runtime.js` only through a trusted Vencord CustomJS/userscript setup or package it as a local Vencord plugin.
5. Reload Discord after changing the CSS or JS.

## Runtime behavior

The JS bridge adds attributes to `#app-mount`:

- `data-tui-view="home"` for `/channels/@me`, Friends, DMs, Nitro, Shop and Quests;
- `data-tui-view="server"` for `/channels/<guild-id>/<channel-id>`;
- `data-tui-view="neutral"` for other screens.

The Home mode uses Discord-like neutral tokens so the Friends page is not recolored as a server chat. Server mode restores visibility for Discord's guild rail and icon/mask nodes without replacing React-owned DOM.

## Design

- Primary accent: `#ff8c42`.
- Normal text: light grey/white, matching the supplied Spotify screenshot.
- Black background, compact spacing, thin borders, square terminal geometry.
- System24 provides the panel layout, labels, ASCII titles, unrounding and Spotify progress-bar behavior.
- Profile pictures remain round via `--round-pfp: on`; terminal geometry is applied to panels rather than media.

## Troubleshooting

- If Friends/Home looks broken, make sure `msdos-tui-runtime.js` is loaded and inspect `#app-mount.dataset.tuiView` in DevTools. It should show `home` on Friends.
- If server icons are absent, inspect the guild rail and verify that its `img`, `svg`, `blobContainer` or `avatar` nodes are not hidden by another theme/plugin. The runtime only changes visibility and presentation; it does not fabricate icons.
- If external system24 import is unavailable, download/vendor the imported build and change the `@import` URL.
- Disable the old CSS theme before testing this rewrite to avoid competing selectors.
