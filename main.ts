// Write the one-line excuse to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22+ runs this file as CommonJS; standard library only, no network.
const fs = require("node:fs");
const path = require("node:path");

const LINE =
  "Your deadline's nearest neighbor in my memory is 'take your time', so I took your time.";

const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 160) {
  throw new Error("entry must be 1-160 code points, got " + codePoints);
}
if (LINE.trim() === "") {
  throw new Error("entry must not be only white space");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry must be a single line");
}

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, "entry.txt");
fs.writeFileSync(file, LINE, { encoding: "utf8" });

const expected = Buffer.from(LINE, "utf8");
const written = fs.readFileSync(file);
if (!written.equals(expected)) {
  throw new Error("entry.txt did not read back byte for byte");
}
const last = written.length ? written[written.length - 1] : 0;
if (last === 10 || last === 13) {
  throw new Error("entry.txt must not end with a newline");
}

console.log("wrote " + file + " (" + codePoints + " code points, " + written.length + " bytes)");
