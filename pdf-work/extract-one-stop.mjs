import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

console.log("PDFParse type:", typeof PDFParse);

const file = "D:\\Interview_APP\\files\\one stop solution java, springboot, sql, testing, get.pdf";
const outDir = "D:\\Interview_APP\\pdf-work\\extracted";

async function main() {
  const dataBuffer = fs.readFileSync(file);
  const result = await PDFParse(dataBuffer);
  const safeName = "one_stop_solution";
  const outFile = path.join(outDir, `${safeName}.txt`);
  fs.writeFileSync(outFile, result.text, "utf8");
  console.log(`Extracted ${file} -> ${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
