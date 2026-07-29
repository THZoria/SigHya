# NSP Forwarder Generator

**Path**: `/nsp-forwarder`

## Overview

Create NSP forwarder files for Nintendo Switch homebrews and RetroArch games. This tool enables you to launch homebrew applications directly from the HOME menu without using the Homebrew Launcher.

**Based on the original work by [TooTallNate](https://github.com/TooTallNate/switch-tools/tree/main/apps/nsp-forwarder)**

## Modes

### 1. NRO Forwarder Mode

Create forwarders for any `.nro` homebrew application:

- **Input**: Upload a `.nro` file or an image
- **Auto-extraction**: If a `.nro` file is uploaded, metadata (title, author, version, icon) is automatically extracted
- **Configuration**: 
  - App Title
  - Publisher
  - NRO Path (e.g., `/switch/appstore/appstore.nro`)
  - Prod Keys file (required)

### 2. RetroArch Forwarder Mode

Create forwarders that launch ROMs directly with RetroArch cores:

- **Input**: Upload box art image
- **Configuration**:
  - Game Title
  - Publisher
  - Core Path (e.g., `/retroarch/cores/snes9x_libretro_libnx.nro`)
  - ROM Path (e.g., `/ROMs/SNES/Super Mario World.smc`)
  - Prod Keys file (required)

### 3. Advanced Mode (Optional)

Additional options when enabled:

- **Version**: Custom version string
- **Title ID**: Custom or randomly generated Title ID
- **Logo Type**: 
  - "Licensed by" (0)
  - "Distributed by" (1)
  - No text (2)
- **Custom Logo**: Upload custom logo (160x40 PNG)
- **Startup Animation**: Upload custom animation (256x80 GIF)
- **Options**:
  - Enable screenshots
  - Enable video capture
  - Enable profile selector
  - Enable `svcDebug` flag

## Architecture

The NSP Forwarder uses **hacbrewpack** (compiled to WebAssembly) to generate valid NSP files:

```
User Input → NSPForwarder.tsx
     ↓
generateNSP() → Prepare data (NACP, images, etc.)
     ↓
Web Worker (generate-worker.js)
     ↓
hacbrewpack.wasm → Generate NSP file
     ↓
Download NSP file
```

## Required Files

The following files must be present in the `public/` directory:

- `hacbrewpack.wasm` - The packaging tool (WebAssembly)
- `hacbrewpack.js` - Emscripten loader
- `generate-worker.js` - Web Worker for generation
- `template/exefs/main` - Forwarder executable
- `template/exefs/main.npdm` - Program metadata
- `template/logo/NintendoLogo.png` - Default Nintendo logo
- `template/logo/StartupMovie.gif` - Default startup animation

## Image Processing

- **Main Icon**: Resized to 256x256, converted to JPEG (quality 0.95)
- **Custom Logo**: Resized to 160x40, converted to PNG
- **Startup Animation**: 256x80, GIF format

## Usage Steps

1. Select your mode (NRO Forwarder or RetroArch Forwarder)
2. Upload an image (or `.nro` file for NRO mode)
3. Fill in the required fields (Title, Publisher, Path, etc.)
4. Upload your `prod.keys` file (required for encryption)
5. Optionally enable Advanced Mode for additional options
6. Click "Generate NSP" to download your forwarder

## Technical Details

### Implementation Files

- `src/pages/NSPForwarder.tsx` - User interface with form handling
- `src/utils/nspGenerator.ts` - Main NSP generation logic
- `src/utils/nacp.ts` - NACP (Nintendo Application Control Property) class
- `src/utils/nro.ts` - NRO file parsing utilities
- `src/utils/imageProcessor.ts` - Image resizing and format conversion
- `public/generate-worker.js` - Web Worker for hacbrewpack execution
- `public/hacbrewpack.wasm` - hacbrewpack compiled to WebAssembly

### NACP Structure

The NACP class (`src/utils/nacp.ts`) manages all Nintendo metadata fields:

**Key Properties:**
- **Title**: UTF-8 string, max 0x200 bytes, stored for 12 languages (offset 0x0, 0x300 per language)
- **Author/Publisher**: UTF-8 string, max 0x100 bytes (offset 0x200 per language)
- **Title ID**: 64-bit bigint, stored at multiple offsets:
  - PresenceGroupId (0x3038)
  - SaveDataOwnerId (0x3078)
  - AddOnContentBaseId (0x3070) = Title ID + 0x1000
  - LocalCommunicationId (0x30B0, 8 entries)
- **Version**: UTF-8 string, max 0x10 bytes (offset 0x3060)
- **Flags**:
  - `startupUserAccount` (0x3025): 0=None, 1=Required, 2=Optional
  - `screenshot` (0x3034): 0=Enabled, 1=Disabled
  - `videoCapture` (0x3035): 0=Disabled, 1=Manual, 2=Automatic
  - `logoType` (0x30F0): 0="Licensed by", 1="Distributed by", 2=No text

**Buffer Size**: 0x4000 bytes (16 KB)

### NRO File Parsing

The NRO utilities (`src/utils/nro.ts`) extract metadata from Nintendo Switch homebrew files:

**NRO Structure:**
```
[0x0-0x10]: NRO Header
[0x10-0x14]: Magic "NRO0"
[0x18-0x1C]: NRO Size
[NRO Size]: ASET Asset Header
  - Icon Section (offset 0x8)
  - NACP Section (offset 0x18)
  - RomFS Section (offset 0x28)
```

**Functions:**
- `isNRO(blob)`: Checks magic bytes at offset 0x10
- `extractNACP(blob)`: Extracts NACP metadata from NRO
- `extractIcon(blob)`: Extracts icon image from NRO

### Image Processing Pipeline

**Main Icon** (`processImageForNSP`):
1. Load image into HTMLImageElement
2. Create 256x256 canvas
3. Fill with black background
4. Scale and center image maintaining aspect ratio
5. Convert to JPEG blob (quality 0.95)

**Custom Logo** (`processLogoForNSP`):
1. Load image into HTMLImageElement
2. Create 160x40 canvas
3. Clear background (transparent)
4. Scale and center image
5. Convert to PNG blob (quality 1.0)

**Startup Animation** (`processAnimationForNSP`):
- Currently returns file as-is
- Future: Could use gifsicle-wasm-browser for optimization

### Web Worker Architecture

**Worker Communication:**
```typescript
interface WorkerMessage {
  argv: string[];           // hacbrewpack command arguments
  keys: Uint8Array;         // prod.keys file content
  controlNacp: Uint8Array;  // NACP metadata
  main: Uint8Array;         // Forwarder executable
  mainNpdm: Uint8Array;     // Program metadata
  image: Uint8Array;        // Icon image (256x256 JPEG)
  logo: Uint8Array;         // Logo (160x40 PNG)
  startupMovie: Uint8Array; // Animation (256x80 GIF)
  nextArgv: string;         // NRO path with arguments
  nextNroPath: string;      // NRO path for RomFS
}
```

**Worker Process:**
1. Load hacbrewpack.wasm module
2. Create virtual filesystem (Emscripten FS)
3. Write all files to virtual FS:
   - `/keys.dat` - Production keys
   - `/control/control.nacp` - Metadata
   - `/control/icon_AmericanEnglish.dat` - Icon
   - `/exefs/main` - Executable
   - `/exefs/main.npdm` - Program metadata
   - `/logo/NintendoLogo.png` - Logo
   - `/logo/StartupMovie.gif` - Animation
   - `/romfs/nextArgv` - Forwarder arguments
   - `/romfs/nextNroPath` - Target NRO path
4. Execute hacbrewpack with arguments: `--nopatchnacplogo --titleid <id> --plaintext`
5. Read generated NSP from `/hacbrewpack_nsp/`
6. Return File object to main thread

### NSP File Structure

The generated NSP is a PFS0 (Partition FileSystem) archive containing:

```
NSP (PFS0)
├── <titleid>.nca (NCA - Nintendo Content Archive)
    ├── Control Partition (PFS0)
    │   ├── control.nacp (16 KB metadata)
    │   └── icon_AmericanEnglish.dat (256x256 JPEG)
    ├── ExeFS Partition
    │   ├── main (Forwarder executable, 53 KB)
    │   └── main.npdm (Program metadata, 1 KB)
    └── RomFS Partition
        ├── nextArgv (Forwarder arguments)
        └── nextNroPath (Target NRO path)
```

### File Structure

```
src/
├── pages/NSPForwarder.tsx       # User interface
├── utils/
│   ├── nspGenerator.ts          # Main generator
│   ├── nacp.ts                  # NACP class
│   ├── nro.ts                   # NRO utilities
│   └── imageProcessor.ts        # Image processing

public/
├── hacbrewpack.wasm             # Packaging tool (WebAssembly)
├── hacbrewpack.js               # Emscripten loader
├── generate-worker.js            # Web Worker
└── template/
    ├── exefs/
    │   ├── main                 # Forwarder executable
    │   └── main.npdm            # Program metadata
    └── logo/
        ├── NintendoLogo.png     # Default logo
        └── StartupMovie.gif     # Default animation
```

### Error Handling

**Worker Errors:**
- Exit code 0: Success, NSP file generated
- Exit code ≠ 0: Generation failed, logs returned
- Logs captured from `stdout` and `stderr` for debugging

**Validation:**
- Title ID format: 16 hex characters, must start with "01"
- Required fields: Title, Publisher, Path, Prod Keys
- Image format: PNG, JPG, WebP accepted
- File size limits: Images max 2MB

## Credits

- **TooTallNate (Nathan Rajlich)** - Original author
- **hacBrewPack** - The-4n
- **RetroArchROMForwarder** - cristianmiranda
- **NSP-Forwarder** - martinpham

## Important Notes

⚠️ **Warning**: Installing unsigned NSP files can result in console bans. It is recommended to:
- Use these forwarders only on emuMMC
- Block all Nintendo servers via DNS.mitm
- Do NOT install on sysMMC (system eMMC/NAND)

## Security & Privacy

- 100% Client-Side: All processing happens locally in your browser

