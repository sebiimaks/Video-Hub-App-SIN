# Video Hub App SIN

This is an unsupported personal fork of [Video Hub App 3](http://www.videohubapp.com/), maintained at [sebiimaks/Video-Hub-App-SIN](https://github.com/sebiimaks/Video-Hub-App-SIN).

**All changes in this fork were made utilising LLMs. Use this software at your own risk.** This fork is not supported or endorsed by the original developer.

- Current fork version: `v3.3.0-sin.3`
- Change summary updated: 19/07/2026

## Changes from the Upstream App

| Change Location | Change | Justification |
| --- | --- | --- |
| <small>Core Functionality<br>↳ Catalogue Editor</small> | <small>Added an in-app catalogue JSON editor.</small> | <small>Provides a practical way to inspect and repair hub catalogue metadata when an individual data problem is easier to correct directly than to reproduce and fix in the application logic.</small> |
| <small>Core Functionality<br>↳ Media Extraction</small> | <small>Increased thumbnail and filmstrip extraction time allowances to four times their upstream values.</small> | <small>Reduces failed thumbnail generation for slow files, high-resolution videos, and media stored on network drives.</small> |
| <small>Core Functionality<br>↳ Playback Statistics</small> | <small>Added a 'Reset Times Played' option and made the times-played filter handle missing values safely.</small> | <small>Allows playback statistics to be cleared without recreating a hub and prevents absent legacy values from producing invalid filter ranges.</small> |
| <small>File Management<br>↳ Deletion</small> | <small>Added confirmation dialogs to both normal and permanent deletion from the context menu.</small> | <small>Reduces accidental file loss and makes the irreversible permanent-delete path explicit before it runs.</small> |
| <small>Development<br>↳ Code Quality</small> | <small>Repaired the lint workflow to use the repository's declared ESLint tooling instead of the removed, undeclared TSLint command.</small> | <small>Restores a working static-analysis check for contributors without changing application behaviour at runtime.</small> |
| <small>Build and Packaging</small> | <small>Replaced broad Electron packaging rules with an explicit runtime-file allowlist.</small> | <small>Prevents build caches, source files, and other development-only content from being bundled, avoiding packages that can grow to approximately 1 GB.</small> |
| <small>User Interface<br>↳ Top Toolbar</small> | <small>Increased the top toolbar to 40 px and enlarged its controls and icons by approximately 20% at every app zoom level.</small> | <small>Improves usability and target visibility on high-resolution displays while preserving the existing app-wide zoom feature.</small> |
| <small>User Interface<br>↳ Dark Mode</small> | <small>Improved dark-mode colours and contrast across the Tags tray, Settings tabs, Settings buttons, folder controls, and related text.</small> | <small>Makes labels and controls readable against dark backgrounds and resolves low-contrast active, inactive, and disabled states.</small> |
| <small>User Interface<br>↳ Settings</small> | <small>Standardised English Settings wording: tabs, headings, and subsection headings use title case; options use sentence case; buttons use title case; ampersands were replaced with 'and'; and small copy errors were corrected.</small> | <small>Gives the Settings interface a clearer and more consistent visual hierarchy.</small> |
| <small>User Interface<br>↳ Current Hub</small> | <small>Improved spacing in 'Current Hub', particularly around 'Videos Located Here', source folders, 'Edit Folders', and 'Server', and removed the trailing punctuation from the source heading.</small> | <small>Separates related controls into clearer groups and improves scanability.</small> |
| <small>User Interface<br>↳ Main Settings</small> | <small>Reduced the 'Reset Zoom' label size and made the plus and minus icons light in dark mode.</small> | <small>Keeps the zoom controls visually balanced with their heading and ensures the icon shapes remain visible.</small> |
| <small>Fork Maintenance<br>↳ Version and Updates</small> | <small>Removed the upstream 'Check for New Version' function, displayed the fork version, linked the unsupported-build warning to this repository, and added a separate link to the original supported app.</small> | <small>Prevents a personal fork from presenting upstream releases as compatible fork updates while preserving clear attribution and a route to the supported project.</small> |

## Original and Supported App

This fork exists because the original application is useful and well designed. For the supported Video Hub App, documentation, and official releases, visit [videohubapp.com](http://www.videohubapp.com/) or the [whyboris/Video-Hub-App repository](https://github.com/whyboris/Video-Hub-App).

Please support the original developer, [whyboris](https://github.com/whyboris).
