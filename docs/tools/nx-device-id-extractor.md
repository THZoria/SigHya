# NX Device ID Extractor

**Path**: `/nxdevice`

## Overview

Extract your Device ID from a PRODINFO.bin file. This is useful for various Nintendo Switch homebrew applications and services.

## How It Works

1. **Upload**: Drag and drop or select your `PRODINFO.bin` file
2. **Analysis**: The tool parses the binary file to locate the Device ID
3. **Extraction**: Displays the Device ID along with file metadata

## File Requirements

- **Format**: `.bin` file
- **Source**: Extracted from your Nintendo Switch console
- **Size**: Typically around 0x4000 bytes

## Security

⚠️ **Important**: 
- All processing happens **locally in your browser**
- **No data is sent to any server**
- Never share your complete PRODINFO.bin file publicly

## Technical Details

### Implementation Files

- `src/utils/binParser.ts` - Binary file parser
- `src/pages/NXDevice.tsx` - User interface

### Binary Parsing Algorithm

1. **File Reading**: Reads file as `ArrayBuffer` for binary processing
2. **Marker Detection**: Searches for specific byte sequences:
   - **Start Marker**: `4E 69 6E 74 65 6E 64 6F` (Nintendo) + `4E 58 43 41 31 50 72 6F 64 31` (NXCA1Prod1)
   - **End Marker**: `30 00 00 00` (null-terminated sequence)
3. **Data Extraction**: Extracts bytes between start and end markers
4. **Text Decoding**: Converts binary data to ASCII using `TextDecoder`
5. **Cleaning**: 
   - Removes hyphens
   - Strips non-alphanumeric prefixes
   - Removes "NX" prefix if present
6. **Output**: Returns Device ID as clean alphanumeric string

### Binary Structure

```
[File Header]
[NintendoNXCA1Prod1] ← Start Marker
[Device ID Data]
[0x30 0x00 0x00 0x00] ← End Marker
[Remaining File Data]
```

### Pattern Matching

- Uses linear search algorithm (`findSequence` function)
- Searches byte-by-byte for exact sequence match
- Returns first occurrence index or -1 if not found

### Output Format

- Device ID: Clean alphanumeric string (e.g., `CA1Prod1XXXXXXXX`)
- Raw Data: Hexadecimal representation for debugging
- File Metadata: Size, start index, end index

### Security

- All processing happens in-memory
- No file upload to servers
- Binary data never leaves the browser

