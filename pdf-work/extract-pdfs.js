const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const files = [
  "C:\\Users\\ASUS\\Downloads\\Java BE Master Guide.pdf",
  "C:\\Users\\ASUS\\Downloads\\Java8_coding.pdf",
  "C:\\Users\\ASUS\\Downloads\\API performance OPTIMIZATIONS.pdf",
  "C:\\Users\\ASUS\\Downloads\\Java 8 Guide.pdf",
  "C:\\Users\\ASUS\\Downloads\\All about microservices.pdf",
  "C:\\Users\\ASUS\\Downloads\\Capgemini_Java_Interview_Flashcards.pdf",
  "C:\\Users\\ASUS\\Downloads\\Spring_Boot_MVC_Decoded.pdf",
  "C:\\Users\\ASUS\\Downloads\\Spring_MVC_Blueprint.pdf",
  "C:\\Users\\ASUS\\Downloads\\Microservices Architecture .pdf",
  "C:\\Users\\ASUS\\Downloads\\Master Design pattern .pdf",
  "C:\\Users\\ASUS\\Downloads\\Java,Spring Boot,Microservices and Angular.pdf",
  "C:\\Users\\ASUS\\Downloads\\Kafka.pdf",
  "C:\\Users\\ASUS\\Downloads\\Java Microservices.pdf",
  "C:\\Users\\ASUS\\Downloads\\Top 50 Java SpringBoot Interview Question.pdf",
  "D:\\Interview_APP\\files\\one stop solution java, springboot, sql, testing, get.pdf"
];

const outDir = path.join("D:\\Interview_APP\\pdf-work", "extracted");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  for (const file of files) {
    const dataBuffer = fs.readFileSync(file);
    const result = await pdf(dataBuffer);
    const safeName = path.basename(file, ".pdf").replace(/[<>:\"/\\\\|?*]+/g, "_");
    const outFile = path.join(outDir, `${safeName}.txt`);
    fs.writeFileSync(outFile, result.text, "utf8");
    console.log(`Extracted ${file} -> ${outFile}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
