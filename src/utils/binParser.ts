/**
 * Extracts device information from Nintendo Switch binary files
 * Parses specific markers in the binary data to identify device IDs
 * 
 * @param file - The binary file to parse
 * @returns Promise containing extracted file information and device ID
 */
export const extractInfoFromBin = async (file: File): Promise<{
    fileSize: number;
    startIndex: number;
    endIndex: number;
    rawData: string;
    deviceId: string;
  }> => {
    // PRODINFO.bin structure: Device ID is located between specific byte sequences
    // Start marker: "Nintendo" (ASCII) + "NXCA1Prod1" (ASCII) - identifies Device ID section
    // End marker: 0x30 0x00 0x00 0x00 - null-terminated sequence marking end of Device ID
    const startMarker = new Uint8Array([
      0x4E, 0x69, 0x6E, 0x74, 0x65, 0x6E, 0x64, 0x6F, // "Nintendo"
      0x4E, 0x58, 0x43, 0x41, 0x31, 0x50, 0x72, 0x6F, // "NXCA1Pro"
      0x64, 0x31 // "d1"
    ]);
    const endMarker = new Uint8Array([0x30, 0x00, 0x00, 0x00]);
  
    const content = await file.arrayBuffer();
    const contentArray = new Uint8Array(content);
    const fileSize = contentArray.length;

    const startIndex = findSequence(contentArray, startMarker);
    if (startIndex === -1) {
      throw new Error("Start marker not found in file.");
    }

    const endIndex = findSequence(contentArray, endMarker, startIndex);
    if (endIndex === -1) {
      throw new Error("End marker not found in file.");
    }

    const extractedData = contentArray.slice(startIndex + startMarker.length, endIndex);
    const decoder = new TextDecoder('ascii');
    let text = decoder.decode(extractedData);

    text = text.replace(/-/g, '').trim();
    text = text.replace(/^[^a-zA-Z0-9]+/, '');
    text = text.replace(/^NX/i, '');
    
    const rawDataHex = Array.from(extractedData)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');

    return {
      fileSize,
      startIndex,
      endIndex,
      rawData: rawDataHex,
      deviceId: text
    };
  };
  
  /**
   * Utility function to find a byte sequence within a Uint8Array
   * Implements a simple pattern matching algorithm for binary data
   * 
   * @param array - The array to search in
   * @param sequence - The byte sequence to find
   * @param startFrom - Starting index for the search (default: 0)
   * @returns Index of the first occurrence or -1 if not found
   */
  const findSequence = (array: Uint8Array, sequence: Uint8Array, startFrom = 0): number => {
    for (let i = startFrom; i <= array.length - sequence.length; i++) {
      let found = true;
      for (let j = 0; j < sequence.length; j++) {
        if (array[i + j] !== sequence[j]) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
    return -1;
  };