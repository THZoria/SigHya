/**
 * NSP Forwarder Generator
 * 
 * Based on the work by TooTallNate (Nathan Rajlich)
 * Original project: https://github.com/TooTallNate/switch-tools/tree/main/apps/nsp-forwarder
 * 
 * This utility generates NSP forwarder files for Nintendo Switch homebrews using hacbrewpack.wasm
 * All processing is done client-side in the browser
 */

import { NACP, VideoCapture } from './nacp';
import { processImageForNSP, processLogoForNSP, processAnimationForNSP } from './imageProcessor';

interface NSPGeneratorOptionsBase {
  publisher: string;
  imageFile: File | null;
  prodKeysFile: File;
  titleId?: string;
  version?: string;
  logoFile?: File | null;
  animationFile?: File | null;
  logoType?: number;
  enableScreenshots?: boolean;
  enableVideoCapture?: boolean;
  enableProfileSelector?: boolean;
  enableSvcDebug?: boolean;
}

interface NROForwarderOptions extends NSPGeneratorOptionsBase {
  mode: 'nro';
  appTitle: string;
  nroPath: string;
  nroFile: File | null;
}

interface RetroArchForwarderOptions extends NSPGeneratorOptionsBase {
  mode: 'retroarch';
  gameTitle: string;
  corePath: string;
  romPath: string;
}

type NSPGeneratorOptions = NROForwarderOptions | RetroArchForwarderOptions;

interface WorkerMessage {
	argv: string[];
	keys: Uint8Array;
	controlNacp: Uint8Array;
	main: Uint8Array;
	mainNpdm: Uint8Array;
	image: Uint8Array;
	logo: Uint8Array;
	startupMovie: Uint8Array;
	nextArgv: string;
	nextNroPath: string;
}

export interface LogChunk {
	type: 'stdout' | 'stderr';
	data: string;
}

interface WorkerResult {
	exitCode: number;
	logs: LogChunk[];
	nsp?: File;
}

/**
 * Generate a random Title ID
 */
export function generateRandomTitleId(): string {
	let titleId = '01';
	for (let i = 0; i < 10; i++) {
		titleId += Math.floor(Math.random() * 16).toString(16);
	}
	titleId += '0000';
	return titleId;
}

/**
 * Fetch a binary file
 */
async function fetchBinary(url: string): Promise<Uint8Array> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch "${url}": ${await res.text()}`);
	}
	const buf = await res.arrayBuffer();
	return new Uint8Array(buf);
}

/**
 * Main function to generate NSP file using hacbrewpack
 */
export async function generateNSP(options: NSPGeneratorOptions): Promise<Blob> {
  try {
    const id = options.titleId || generateRandomTitleId();
    const title = options.mode === 'nro' ? options.appTitle : options.gameTitle;
    const nroPath = options.mode === 'nro' ? options.nroPath : options.corePath;
    
    const worker = new Worker('/nsp-forwarder/generate-worker.js');
    const workerResultPromise = new Promise<WorkerResult>((resolve) => {
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
    });
    
    const nacp = new NACP();
    nacp.id = id;
    nacp.title = title;
    nacp.author = options.publisher;
    nacp.version = options.version || '1.0.0';
    nacp.startupUserAccount = options.enableProfileSelector ? 1 : 0;
    nacp.screenshot = options.enableScreenshots !== false ? 0 : 1;
    nacp.videoCapture = options.enableVideoCapture ? VideoCapture.Automatic : VideoCapture.Disabled;
    nacp.logoType = options.logoType !== undefined ? options.logoType : 2;
    nacp.logoHandling = 0;
    
    // Normalize paths: Switch expects absolute paths starting with '/'
    // Prefix with 'sdmc:' to indicate SD card filesystem
    let normalizedPath = nroPath;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }
    const nextNroPath = `sdmc:${normalizedPath}`;
    let nextArgv = nextNroPath;
    
    // RetroArch forwarders need ROM path as second argument
    // Format: "sdmc:/path/to/core.nro" "sdmc:/path/to/rom.smc"
    if (options.mode === 'retroarch') {
      let normalizedRomPath = options.romPath;
      if (!normalizedRomPath.startsWith('/')) {
        normalizedRomPath = `/${normalizedRomPath}`;
      }
      nextArgv += ` "sdmc:${normalizedRomPath}"`;
    }
    const imageBlob = options.imageFile 
      ? await processImageForNSP(options.imageFile)
      : null;
    
    if (!imageBlob) {
      throw new Error('Image file is required');
    }
    
    const logoBlob = options.logoFile 
      ? await processLogoForNSP(options.logoFile)
      : null;
    
    const animationBlob = options.animationFile
      ? await processAnimationForNSP(options.animationFile)
      : null;
    
    const [keysData, imageData, logoData, startupMovieData, main, mainNpdm] = await Promise.all([
      options.prodKeysFile.arrayBuffer().then((b) => new Uint8Array(b)),
      imageBlob.arrayBuffer().then((b) => new Uint8Array(b)),
      logoBlob?.arrayBuffer().then((b) => new Uint8Array(b)) ||
        fetchBinary('/nsp-forwarder/template/logo/NintendoLogo.png'),
      animationBlob?.arrayBuffer().then((b) => new Uint8Array(b)) ||
        fetchBinary('/nsp-forwarder/template/logo/StartupMovie.gif'),
      fetchBinary('/nsp-forwarder/template/exefs/main'),
      fetchBinary('/nsp-forwarder/template/exefs/main.npdm'),
    ]);
    
    if (options.enableSvcDebug) {
      // Enable svcDebug flag for Atmosphère 1.8.0+ (offsets 0x332 and 0x3f2)
      // Reference: https://github.com/TooTallNate/switch-tools/pull/15
      mainNpdm[0x332] = mainNpdm[0x3f2] = 0x08;
    }
    
    // Worker message structure for hacbrewpack.wasm:
    // - argv: hacbrewpack CLI arguments (--nopatchnacplogo prevents logo patching, --plaintext disables encryption)
    // - nextArgv/nextNroPath: Forwarder arguments written to RomFS, read by forwarder executable at runtime
    const message: WorkerMessage = {
      argv: ['--nopatchnacplogo', '--titleid', id, '--plaintext'],
      keys: keysData,
      controlNacp: new Uint8Array(nacp.buffer),
      main,
      mainNpdm,
      image: imageData,
      logo: logoData,
      startupMovie: startupMovieData,
      nextArgv,
      nextNroPath,
    };
    
    worker.postMessage(message);
    const result = await workerResultPromise;
    
    if (result.exitCode === 0 && result.nsp) {
      return result.nsp;
    }
    
    console.error('NSP generation failed:', result.logs);
    throw new NSPGenerationError(result.exitCode, result.logs);
  } catch (error) {
    throw new Error(`NSP generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

class NSPGenerationError extends Error {
	exitCode: number;
	logs: LogChunk[];

	constructor(exitCode: number, logs: LogChunk[]) {
		super('Failed to generate NSP file');
		this.exitCode = exitCode;
		this.logs = logs;
	}
}
