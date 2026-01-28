import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(
	__dirname,
	"../public/projects/spaceduck/showcase/"
);

async function optimizeImages() {
	console.log(`Scanning directory: ${TARGET_DIR}`);

	try {
		const files = await fs.readdir(TARGET_DIR);

		for (const file of files) {
			if (!file.toLowerCase().endsWith(".png")) {
				continue;
			}

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
				.png({ quality: 80, compressionLevel: 9 })
				.toBuffer();

			await fs.writeFile(filePath, buffer);

			const newPngStats = await fs.stat(filePath);
			console.log(
				`  -> Optimized PNG: ${(newPngStats.size / 1024).toFixed(2)} KB (${Math.round((1 - newPngStats.size / originalStats.size) * 100)}% saved)`
			);
		}

		console.log("Done!");
	} catch (err) {
		console.error("Error optimizing images:", err);
	}
}

optimizeImages();
