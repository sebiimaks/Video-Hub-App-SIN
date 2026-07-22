# Video Hub App SIN

This is an unsupported personal fork of [Video Hub App 3](http://www.videohubapp.com/), maintained at [sebiimaks/Video-Hub-App-SIN](https://github.com/sebiimaks/Video-Hub-App-SIN).

**All changes in this fork were made utilising LLMs. Use this software at your own risk.** This fork is not supported or endorsed by the original developer.

- Current fork version: `v3.3.0-sin.7`
- Change summary updated: 22/07/2026

## Changes from the Upstream App

| Change Location | Change | Justification |
| --- | --- | --- |
| Core Functionality<br>↳ Catalogue Editor | Added an in-app catalogue JSON editor with tag autocomplete, normalized comma-separated tag fields, batch tagging for displayed search results, support for new custom tags, and automatic main-view refresh after closing the editor. | Provides a practical way to inspect and repair hub catalogue metadata, while making individual and large-scale tag maintenance faster and ensuring completed edits appear immediately in the main interface. |
| Core Functionality<br>↳ Catalogue Persistence | Replaced direct catalogue and settings writes with validated atomic saves, serialized overlapping catalogue updates, and added confirmation-based recovery from a valid `.vha2.bak` file. Invalid, empty, unreadable, or unavailable catalogues now produce controlled errors instead of crashing or being overwritten, and failed startup opens the normal hub wizard. | Protects catalogue data during editor saves, hub switching, shutdown, interrupted writes, malformed JSON, and disconnected storage while retaining a safe path back into the application. |
| Core Functionality<br>↳ Local Operation Safety | Restricted privileged application messages to the active main window, replaced shell-built player commands with discrete process arguments, limited external links to ordinary web addresses, validated absolute paths, confined rename and deletion to configured source folders, and made shutdown wait for successful settings and catalogue saves. | Reduces command-injection, path-traversal, symlink-escape, unintended file-operation, and shutdown data-loss risks without changing normal local workflows. |
| Core Functionality<br>↳ Media Extraction | Increased thumbnail and filmstrip extraction time allowances to four times their upstream values. | Reduces failed thumbnail generation for slow files, high-resolution videos, and media stored on network drives. |
| Core Functionality<br>↳ Media Toolchain | Replaced opaque downloaded FFmpeg packages with locally built FFmpeg 8.1.2 and a pinned x264 source revision. Network support is disabled in the media tools, and packaged applications resolve only their own verified copies. | Retains broad local-media compatibility while giving the fork controlled source provenance, exact checksums, a macOS 12 compatibility floor, and protection from unexpected packaged-tool overrides. |
| Core Functionality<br>↳ Playback Statistics | Added a 'Reset Times Played' option and made the times-played filter handle missing values safely. | Allows playback statistics to be cleared without recreating a hub and prevents absent legacy values from producing invalid filter ranges. |
| Core Functionality<br>↳ Tag Management | Added confirmation-protected catalogue-wide tag removal from the Tags tray, including cleanup of the associated tag count and colour metadata. | Allows obsolete tags to be removed from every video in one controlled operation while reducing accidental catalogue-wide changes. |
| File Management<br>↳ Deletion | Added confirmation dialogs to both normal and permanent deletion from the context menu. | Reduces accidental file loss and makes the irreversible permanent-delete path explicit before it runs. |
| Development<br>↳ Code Quality | Repaired the lint workflow to use the repository's declared ESLint tooling instead of the removed, undeclared TSLint command. | Restores a working static-analysis check for contributors without changing application behaviour at runtime. |
| Development<br>↳ Automated Verification | Expanded the test suite to cover catalogue persistence and recovery, privileged local operations, difficult filenames, FFmpeg and FFprobe versions, metadata probing, thumbnails, filmstrips, preview clips, packaged resources, binary architecture, deployment targets, checksums, and dynamic-library boundaries. | Detects regressions in the app's highest-risk local workflows and verifies that packaged media and licensing resources match the controlled build. |
| Build and Packaging | Replaced broad Electron packaging rules with an explicit runtime-file allowlist. | Prevents build caches, source files, and other development-only content from being bundled, avoiding packages that can grow to approximately 1 GB. |
| Build and Packaging<br>↳ Public Distribution | Changed the fork's GitHub releases to source-only distribution and removed previously attached application binaries. Local packages remain available to the maintainer but are not published. | Minimizes public distribution and licensing risk while retaining the complete fork history and source snapshots. |
| Build and Packaging<br>↳ Application Identity | Renamed packaged applications to 'Video Hub App SIN' and assigned fork-specific macOS and Debian identifiers. | Clearly distinguishes this unsupported personal fork from installations of the original supported application. |
| Build and Packaging<br>↳ Debian AMD64 | Added a production Debian package target for native local builds on Debian 13 AMD64. | Provides a native Debian installation and upgrade path without publishing application binaries from GitHub-hosted workflows. |
| Build and Packaging<br>↳ macOS ARM64 | Configured repeatable unsigned Apple Silicon DMG packaging for local builds. | Provides a consistent ARM64 macOS package with the correct architecture-specific FFmpeg binaries while keeping generated applications private to the local system. |
| Licensing and Attribution<br>↳ Binary Packages | Added the upstream MIT licence to packaged application resources and corrected the displayed upstream copyright year to 2022. | Ensures redistributed binaries carry the copyright and permission notice required by the original licence. |
| Licensing and Attribution<br>↳ Third-Party Components | Added generated notices for packaged runtime dependencies; included Electron and Chromium notices; corrected the in-app FFmpeg licence statement; and added exact FFmpeg, x264, licence, build-manifest, build-script, and corresponding-source packaging for locally produced applications. | Preserves upstream rights and provides the materials needed to satisfy the separate licences if a locally built package is ever redistributed. |
| User Interface<br>↳ Top Toolbar | Increased the top toolbar to 40 px and enlarged its controls and icons by approximately 20% at every app zoom level. | Improves usability and target visibility on high-resolution displays while preserving the existing app-wide zoom feature. |
| User Interface<br>↳ Dark Mode | Improved dark-mode colours and contrast across the Tags tray, Settings tabs, Settings buttons, folder controls, Video Details controls, tag-removal controls, and related text. | Makes labels and controls readable against dark backgrounds and resolves low-contrast active, inactive, disabled, and hover states. |
| User Interface<br>↳ Settings | Standardised English Settings wording: tabs, headings, and subsection headings use title case. Options and buttons use title case. Ampersands were replaced and small copy errors were corrected. | Gives the Settings interface a clearer and more consistent visual hierarchy. |
| User Interface<br>↳ Current Hub | Improved spacing in 'Current Hub', particularly around 'Videos Located Here', source folders, 'Edit Folders', and 'Server', and removed the trailing punctuation from the source heading. | Separates related controls into clearer groups and improves scanability. |
| User Interface<br>↳ Main Settings | Reduced the 'Reset Zoom' label size and made the plus and minus icons light in dark mode. | Keeps the zoom controls visually balanced with their heading and ensures the icon shapes remain visible. |
| User Interface<br>↳ Search Sidebar | Added automatic readable foreground colours to custom filter chips throughout the sidebar. | Keeps typed filter values legible across the different chip background colours used by video-name, tag, folder-name, and fuzzy-search filters. |
| User Interface<br>↳ Video Details | Moved video notes to the right side of the details header and restyled the zoom controls to match the Main Settings controls. | Prevents notes from overlapping the video path, improves use of horizontal space, and gives zoom controls a consistent and readable appearance. |
| Fork Maintenance<br>↳ Version and Updates | Removed the upstream 'Check for New Version' function, displayed the fork version, linked the unsupported-build warning to this repository, and added a separate link to the original supported app. | Prevents a personal fork from presenting upstream releases as compatible fork updates while preserving clear attribution and a route to the supported project. |

## Source-Only Distribution and Local Builds

This repository does not publish prebuilt application binaries. Existing release assets were removed, and new GitHub releases provide only the source snapshots that GitHub generates from each version tag.

The maintainer's tested macOS ARM64 and Debian 13 AMD64 packages remain local and continue to work normally. Local builds do not check for updates automatically.

### macOS ARM64

Build locally on Apple Silicon macOS with the repository's `electron:mac:release` script. The resulting unsigned and unnotarized DMG, matching media-source archive, checksums, and unpacked application remain in the ignored local release directory and are not uploaded to GitHub.

### Debian 13 AMD64

Build locally and natively on Debian 13 AMD64 with the repository's standard Electron packaging script. The resulting Debian package and matching media-source archive must remain local unless they are distributed together with all required licence materials.

Anyone choosing to build this unsupported personal fork is responsible for installing the documented development prerequisites and reviewing the included licence notices.

## Original and Supported App

This fork exists because the original application is useful and well designed. For the supported Video Hub App, documentation, and official releases, visit [videohubapp.com](http://www.videohubapp.com/) or the [whyboris/Video-Hub-App repository](https://github.com/whyboris/Video-Hub-App).

Please support the original developer, [whyboris](https://github.com/whyboris).
