import * as fs from "fs";
import csv from "csv-parser";
import { format as csvFormat } from "fast-csv";
import { parseTable } from "./rotate-table";

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error("Usage: node cli.js <input.csv>");
    process.exit(1);
  }

  const inputFile = args[0];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" does not exist.`);
    process.exit(1);
  }

  const readStream = fs.createReadStream(inputFile);
  const csvReadStream = csv({
    headers: true,
  });

  const csvWriteStream = csvFormat({
    headers: ["id", "json", "is_valid"],
    writeHeaders: true,
    quoteColumns: true,
    writeBOM: false,
  });
  csvWriteStream.pipe(process.stdout);

  readStream
    .pipe(csvReadStream)
    .on("data", (row: any) => {
      if (row._0 === "id" && row._1 === "json") {
        return;
      }

      const tableResult = parseTable(row._1);
      const outputJson = tableResult.isValid
        ? JSON.stringify(tableResult.rotatedData)
        : "[]";

      csvWriteStream.write({
        id: row._0,
        json: outputJson,
        is_valid: tableResult.isValid,
      });
    })
    .on("end", () => {
      csvWriteStream.end();
    })
    .on("error", (err: any) => {
      console.error("Error reading input CSV:", err);
      process.exit(1);
    });
}

if (require.main === module) {
  main();
}
