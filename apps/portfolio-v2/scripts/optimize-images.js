import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(
	__dirname,
	"../public/projects/spaceduck/showcase/"
);

async function optimizeImage(file) {
	const filePath = path.join(TARGET_DIR, file);
	const fileNameWithoutExt = path.parse(file).name;
	const webpPath = path.join(TARGET_DIR, `${fileNameWithoutExt}.webp`);

	const originalStats = await fs.stat(filePath);
	console.log(
		`Processing ${file} (${(originalStats.size / 1024).toFixed(2)} KB)`
	);

	const image = sharp(filePath);

	await image.webp({ quality: 80 }).toFile(webpPath);

	const webpStats = await fs.stat(webpPath);
	console.log(
		`  -> Created WebP: ${(webpStats.size / 1024).toFixed(2)} KB (${Math.round((1 - webpStats.size / originalStats.size) * 100)}% saved)`
	);

	const buffer = await image
		.png({ compressionLevel: 9, quality: 80 })
		.toBuffer();

	await fs.writeFile(filePath, buffer);

	const newPngStats = await fs.stat(filePath);
	console.log(
		`  -> Optimized PNG: ${(newPngStats.size / 1024).toFixed(2)} KB (${Math.round((1 - newPngStats.size / originalStats.size) * 100)}% saved)`
	);
}

async function optimizeImages() {
	console.log(`Scanning directory: ${TARGET_DIR}`);

	try {
		const files = await fs.readdir(TARGET_DIR);

		for (const file of files) {
			if (!file.toLowerCase().endsWith(".png")) {
				continue;
			}

			// biome-ignore lint/performance/noAwaitInLoops: Finish each image before starting the next to preserve processing and log order.
			await optimizeImage(file);
		}

		console.log("Done!");
	} catch (err) {
		console.error("Error optimizing images:", err);
	}
}

optimizeImages();
