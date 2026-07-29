/**
 * NRO utilities
 * Based on: https://github.com/TooTallNate/switch-tools/tree/main/packages/nro
 * Reference: https://switchbrew.org/wiki/NRO
 */

import { NACP } from './nacp';

const decoder = new TextDecoder();

export async function isNRO(blob: Blob): Promise<boolean> {
	const magicSlice = blob.slice(0x10, 0x10 + 0x4);
	const magicBuf = await magicSlice.arrayBuffer();
	const magicStr = decoder.decode(magicBuf);
	return magicStr === 'NRO0';
}

// NRO file structure (Nintendo Relocatable Object):
// - 0x0-0x10: NRO header
// - 0x10-0x14: Magic "NRO0"
// - 0x18-0x1C: NRO size (4 bytes, little-endian)
// - After NRO size: ASET asset header (0x38 bytes)
//   - Asset header contains offsets to icon (0x8), NACP (0x18), RomFS (0x28)
async function getNroSize(blob: Blob): Promise<number> {
	const nroSizeBuf = await blob.slice(0x18, 0x18 + 0x4).arrayBuffer();
	return new DataView(nroSizeBuf).getUint32(0, true);
}

async function extractAssetHeader(blob: Blob, start: number): Promise<ArrayBuffer> {
	const end = start + 0x38;
	const assetHeaderBuf = await blob.slice(start, end).arrayBuffer();
	const magicStr = decoder.decode(assetHeaderBuf.slice(0, 0x4));
	if (magicStr !== 'ASET') {
		throw new Error('Failed to find asset header of NRO');
	}
	return assetHeaderBuf;
}

export async function extractAsset(blob: Blob, offset: number): Promise<Blob | null> {
	const nroSize = await getNroSize(blob);
	const assetHeaderBuf = await extractAssetHeader(blob, nroSize);
	const assetHeaderView = new DataView(assetHeaderBuf);
	const assetOffset = assetHeaderView.getUint32(offset, true);
	const length = assetHeaderView.getUint32(offset + 0x8, true);
	if (length === 0) return null;
	const start = nroSize + assetOffset;
	const end = start + length;
	return blob.slice(start, end);
}

export function extractIcon(blob: Blob): Promise<Blob | null> {
	return extractAsset(blob, 0x8);
}

export async function extractNACP(blob: Blob): Promise<NACP> {
	const nacp = await extractAsset(blob, 0x18);
	if (!nacp) throw new Error('NACP asset section has size 0');
	const buf = await nacp.arrayBuffer();
	return new NACP(buf);
}

