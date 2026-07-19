# Video Hub App SIN

This is an unsupported personal fork of [Video Hub App 3](http://www.videohubapp.com/), maintained at [sebiimaks/Video-Hub-App-SIN](https://github.com/sebiimaks/Video-Hub-App-SIN).

**All changes in this fork were made utilising LLMs. Use this software at your own risk.** This fork is not supported or endorsed by the original developer.

- Current fork version: `v3.3.0-sin.4`
- Change summary updated: 19/07/2026

## Changes from the Upstream App

| Change Location | Change | Justification |
| --- | --- | --- |
| Core Functionality<br>↳ Catalogue Editor | Added an in-app catalogue JSON editor. | Provides a practical way to inspect and repair hub catalogue metadata when an individual data problem is easier to correct directly than to reproduce and fix in the application logic. |
| Core Functionality<br>↳ Media Extraction | Increased thumbnail and filmstrip extraction time allowances to four times their upstream values. | Reduces failed thumbnail generation for slow files, high-resolution videos, and media stored on network drives. |
| Core Functionality<br>↳ Playback Statistics | Added a 'Reset Times Played' option and made the times-played filter handle missing values safely. | Allows playback statistics to be cleared without recreating a hub and prevents absent legacy values from producing invalid filter ranges. |
| File Management<br>↳ Deletion | Added confirmation dialogs to both normal and permanent deletion from the context menu. | Reduces accidental file loss and makes the irreversible permanent-delete path explicit before it runs. |
| Development<br>↳ Code Quality | Repaired the lint workflow to use the repository's declared ESLint tooling instead of the removed, undeclared TSLint command. | Restores a working static-analysis check for contributors without changing application behaviour at runtime. |
| Build and Packaging | Replaced broad Electron packaging rules with an explicit runtime-file allowlist. | Prevents build caches, source files, and other development-only content from being bundled, avoiding packages that can grow to approximately 1 GB. |
| Build and Packaging<br>↳ Application Identity | Renamed packaged applications to 'Video Hub App SIN' and assigned fork-specific macOS and Debian identifiers. | Clearly distinguishes this unsupported personal fork from installations of the original supported application. |
| Build and Packaging<br>↳ Debian AMD64 | Added a production Debian package target and a manually triggered GitHub Actions workflow for repeatable AMD64 builds. | Provides a native Debian installation and upgrade path. |
| Build and Packaging<br>↳ macOS ARM64 | Added a manually triggered GitHub Actions workflow for repeatable unsigned Apple Silicon DMG builds. | Keeps macOS release packaging aligned with the Debian workflow and verifies that architecture-specific FFmpeg binaries are selected correctly. |
| Licensing and Attribution<br>↳ Binary Packages | Added the upstream MIT licence to packaged application resources and corrected the displayed upstream copyright year to 2022. | Ensures redistributed binaries carry the copyright and permission notice required by the original licence. |
| User Interface<br>↳ Top Toolbar | Increased the top toolbar to 40 px and enlarged its controls and icons by approximately 20% at every app zoom level. | Improves usability and target visibility on high-resolution displays while preserving the existing app-wide zoom feature. |
| User Interface<br>↳ Dark Mode | Improved dark-mode colours and contrast across the Tags tray, Settings tabs, Settings buttons, folder controls, and related text. | Makes labels and controls readable against dark backgrounds and resolves low-contrast active, inactive, and disabled states. |
| User Interface<br>↳ Settings | Standardised English Settings wording: tabs, headings, and subsection headings use title case. Options and buttons use title case. Ampersands were replaced and small copy errors were corrected. | Gives the Settings interface a clearer and more consistent visual hierarchy. |
| User Interface<br>↳ Current Hub | Improved spacing in 'Current Hub', particularly around 'Videos Located Here', source folders, 'Edit Folders', and 'Server', and removed the trailing punctuation from the source heading. | Separates related controls into clearer groups and improves scanability. |
| User Interface<br>↳ Main Settings | Reduced the 'Reset Zoom' label size and made the plus and minus icons light in dark mode. | Keeps the zoom controls visually balanced with their heading and ensures the icon shapes remain visible. |
| Fork Maintenance<br>↳ Version and Updates | Removed the upstream 'Check for New Version' function, displayed the fork version, linked the unsupported-build warning to this repository, and added a separate link to the original supported app. | Prevents a personal fork from presenting upstream releases as compatible fork updates while preserving clear attribution and a route to the supported project. |

## Installation and Updates

### Debian 13 AMD64

Install the Debian package with:

```bash
sudo apt install ./video-hub-app-sin_3.3.0-sin.4_amd64.deb
```

For future releases, download the newer `.deb` and install it over the existing fork package with `apt install`. Application settings are stored separately from the installed package and should remain available after an upgrade.

### macOS ARM64

Open the DMG and copy 'Video Hub App SIN' into Applications. For future releases, close the application and replace the existing copy with the newer version.

Neither package checks for updates automatically. New versions must be downloaded manually from this fork's GitHub Releases page.

## Original and Supported App

This fork exists because the original application is useful and well designed. For the supported Video Hub App, documentation, and official releases, visit [videohubapp.com](http://www.videohubapp.com/) or the [whyboris/Video-Hub-App repository](https://github.com/whyboris/Video-Hub-App).

Please support the original developer, [whyboris](https://github.com/whyboris).
