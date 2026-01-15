# 🏗 Building Pin-Board

## Prerequisites
- **Rust Toolchain**: Install via [rustup](https://rustup.rs).

## Local Build (Linux/Mac/Windows)
To build a release binary for your current OS:
```bash
cargo build --release
```
The binary will be in `target/release/Pin-Board` (or `.exe`).

## Cross-Platform Build (Using GitHub Actions)
The easiest way to build for all platforms is to **Fork this repository** and push a tag:
1. Push a tag like `v1.0.0`:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Go to the **Actions** tab in your GitHub repo.
3. The **Release** workflow will run and upload binaries for Windows, macOS, and Linux to the Releases page.

## Manual Cross-Compilation
If you need to cross-compile locally (e.g., build for Windows on Linux):
1. Install `cross`:
   ```bash
   cargo install cross
   ```
2. Build:
   ```bash
   cross build --target x86_64-pc-windows-gnu --release
   ```
