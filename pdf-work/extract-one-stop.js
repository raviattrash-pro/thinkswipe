const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const file = "D:\\Interview_APP\\files\\one stop solution java, springboot, sql, testing, get.pdf";
const outDir = "D:\\Interview_APP\\pdf-work\\extracted";

async function main() {
  console.log("PDF-parse type:", typeof pdf);
  console.log("PDF-parse keys:", Object.keys(pdf));
  
  // Try to find a function in the exported object
  let pdfFunc = null;
  if (typeof pdf === 'function') {
      pdfFunc = pdf;
  } else {
      // Sometimes it's exported as a property
      for (const key of Object.keys(pdf)) {
          if (typeof pdf[key] === 'function') {
              console.log(`Found function at key: ${key}`);
              pdfFunc = pdf[key];
              // break; // Don't break yet, just logging
          }
      }
  }

  if (!pdfFunc) throw new Error("No pdf function found!");

  const dataBuffer = fs.readFileSync(file);
  const result = await pdfFunc(dataBuffer);
  const safeName = "one_stop_solution";
  const outFile = path.join(outDir, `${safeName}.txt`);
  fs.writeFileSync(outFile, result.text, "utf8");
  console.log(`Extracted ${file} -> ${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
