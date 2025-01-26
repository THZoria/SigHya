export const extractInfoFromBin = async (file: File): Promise<{
    fileSize: number;
    startIndex: number;
    endIndex: number;
    rawData: string;
    deviceId: string;
  }> => {
    // Start and end markers in hexadecimal
    const startMarker = new Uint8Array([
      0x4E, 0x69, 0x6E, 0x74, 0x65, 0x6E, 0x64, 0x6F,
      0x4E, 0x58, 0x43, 0x41, 0x31, 0x50, 0x72, 0x6F,
      0x64, 0x31
    ]);
    const endMarker = new Uint8Array([0x30, 0x00, 0x00, 0x00]);
  
    try {
      // Read file as ArrayBuffer
      const content = await file.arrayBuffer();
      const contentArray = new Uint8Array(content);
      const fileSize = contentArray.length;
  
      // Find marker indices
      const startIndex = findSequence(contentArray, startMarker);
      if (startIndex === -1) {
        throw new Error("Start marker not found in file.");
      }
  
      const endIndex = findSequence(contentArray, endMarker, startIndex);
      if (endIndex === -1) {
        throw new Error("End marker not found in file.");
      }
  
      // Extract data between markers
      const extractedData = contentArray.slice(startIndex + startMarker.length, endIndex);
  
      // Convert extracted data to ASCII text
      const decoder = new TextDecoder('ascii');
      let text = decoder.decode(extractedData);
  
      // Clean up text
      text = text.replace(/-/g, '').trim();
      // Remove all non-alphanumeric characters at the beginning
      text = text.replace(/^[^a-zA-Z0-9]+/, '');
      // Explicitly remove NX prefix if still present
      text = text.replace(/^NX/i, '');
      
      // Convert extracted data to hexadecimal format
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
    } catch (error) {
      throw error;
    }
  };
  
  // Utility function to find a sequence in a Uint8Array
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