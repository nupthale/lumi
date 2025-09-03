<p align="center">
<img alt="Lumi logo" src="https://res.cloudinary.com/dybz0bvui/image/upload/v1756861084/icon_fh5cae.png" width="128px">
<br>
<strong>Lumi - local-first, collaborative knowledge repo</strong>
<br><br>
<a title="Build Status" target="_blank" href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square"></a>
<a title="Releases" target="_blank" href="#"><img src="https://img.shields.io/badge/release-v1.0.0-blue?style=flat-square"></a>
<a title="MIT License" target="_blank" href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square"></a>
</p>

## Download
Get the app from [landing page](https://pickergo.github.io/lumi/)

## 💯 Introduction
Lumi is a local-first personal knowledge management system that works seamlessly even when offline. It supports real-time collaboration, Markdown editing, and block-level references, providing a Notion-like flexible page structure. Lumi enables individuals and teams to efficiently organize and manage knowledge, regardless of network connectivity.
<img alt="Lumi app" src="https://res.cloudinary.com/dybz0bvui/image/upload/v1756861063/appshot_hmfglg.png" />

## 🌟 Features
* Document & Wiki knowledge base
* 📔 Multi-space management
* ⚽ Rich text blocks
    * 🌿 Text block
    * 🎅 Code block
    * ✨ Database block
        * Table view
        * Kanban view
    * 🎈 Multi-column layout block
    * 🎙️ Multi-level heading block
    * 🏮 Embedded web page block
    * 💎 Image & video block
    * 🛍️ Quote block
    * 🎹 Table block
    * List block
        * 💛 Unordered list
        * 🧡 Ordered list
        * 🩵 Task list
        * ❤️ Foldable list
* 🏀 Inline blocks
    * 👀 @Mention
    * 😀 Emoji
* 🎱 Extensive keyboard shortcuts
* 🏓 Text selection comments
* 🏐 Tag management
* 🎾 Markdown

## 🚀 Development Guide
Projects structure

* `apps/client` electron wrapper for the app.
* `apps/server-pouchdb` pouchdb server to sync between devices
* `apps/server-yjs` yjs server to implement collaboration
* `apps/web` core app front-end entry
* `packages/collection` collection component package
* `packages/editor` core editor package based on prosemirror

Develop

* For local mode
```shell
pnpm i
cd apps/web
pnpm run dev

cd apps/client
pnpm run dev
```

* For sync web mode - not ready for production
```shell
pnpm i
cd apps/web
pnpm run dev

cd apps/server-api
pnpm run dev

cd apps/server-pouchdb
pnpm run dev

cd apps/server-yjs
pnpm run start
```

## License
Lumi is licensed under the [MIT License](https://opensource.org/license/MIT).