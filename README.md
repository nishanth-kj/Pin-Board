# ConvertHub

## 1. Project Overview
ConvertHub is a high-performance, professional-grade file conversion platform designed to run entirely on the client-side for maximum privacy and speed. It leverages modern web technologies (Next.js) for the UI and Rust (via WebAssembly) for compute-intensive tasks, wrapped in a Tauri container for native desktop capabilities.

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4.
- **UI Library**: Shadcn UI (Radix Primitives).
- **Desktop Engine**: Tauri v2 (Rust).
- **Performance Engine**: Rust -> WebAssembly (WASM) for file processing.
- **State Management**: React Hooks + LocalStorage (Persistence).

## 2. Architecture
The application follows a "Serverless Client" architecture. 
- **No Uploads**: Files are processed in the user's browser memory or local machine.
- **WASM Bridge**: Heavy computations (like file parsing) are offloaded to compiled Rust modules via `converter-wasm`.
- **Responsive Design**: Mobile-first approach with a responsive Sidebar/Navbar layout.

## 3. Installation & Setup

### Prerequisites
- Node.js (v18+)
- Rust (Cargo & rustc)
- `wasm-pack` (for building the WASM modules)

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd ConvertHub
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Build WASM Module**:
   ```bash
   cd converter-wasm
   wasm-pack build --target web
   cd ..
   npm install ./converter-wasm/pkg
   ```

4. **Run Development Server**:
   - **Web**: `npm run dev`
   - **Desktop**: `npm run tauri dev`

## 4. Test Cases & Validation Plan

### A. QR Code Tools (`/tools/qr`)
| ID | Test Scenario | Expected Result | Priority |
|----|---------------|-----------------|----------|
| QR-01 | Scan valid QR via Camera | Decoded text appears instantly in green box. | High |
| QR-02 | Upload QR Image (PNG/JPG) | Valid text extracted from image file. | High |
| QR-03 | Upload Non-QR Image | Error message "QR Code not detected". | Medium |
| QR-04 | Generate QR (Manual Entry) | (If implemented) QR code renders matches input. | Medium |

### B. Image Converter (`/tools/image`)
| ID | Test Scenario | Expected Result | Priority |
|----|---------------|-----------------|----------|
| IMG-01 | Upload PNG, convert to JPG | Downloadable JPG file created. | High |
| IMG-02 | Quality Slider Adjustment | File size decreases as quality is lowered. | Medium |
| IMG-03 | Drag & Drop Upload | File is accepted and preview shown. | Low |
| IMG-04 | Convert Large File (>5MB) | Processing spinner shows, app remains responsive. | High |

### C. PDF Tools (`/tools/pdf`)
| ID | Test Scenario | Expected Result | Priority |
|----|---------------|-----------------|----------|
| PDF-01 | Merge 2 Valid PDFs | Single merged PDF downloaded correctly in order. | High |
| PDF-02 | Reorder Files | Files can be moved up/down in the list. | Medium |
| PDF-03 | Remove File | File removed from merge list. | Low |
| PDF-04 | Merge 0 or 1 File | "Merge" button disabled. | Low |

### D. Markdown Converter (WASM) (`/tools/markdown`)
| ID | Test Scenario | Expected Result | Priority |
|----|---------------|-----------------|----------|
| WASM-01 | Basic Markdown Input | HTML preview updates in real-time. | High |
| WASM-02 | Complex Markdown (Tables) | Tables rendered correctly (WASM parser check). | High |
| WASM-03 | Performance Check | Large markdown text converts <100ms. | Medium |

### E. Admin Dashboard (`/admin`)
| ID | Test Scenario | Expected Result | Priority |
|----|---------------|-----------------|----------|
| ADM-01 | Toggle Ads | States persist after page reload (LocalStorage). | High |
| ADM-02 | Navigation | Sidebar links route to correct sections. | Medium |

## 5. Deployment
- **Web**: Run `npm run build` -> Output in `out/` (Static Export).
- **Desktop**: Run `npm run tauri build` -> Installer in `src-tauri/target/release/bundle`.
