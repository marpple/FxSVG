const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const babelParser = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");
const { default: generate } = require("@babel/generator");

// Make directory "<project_root>/dist/esm"
fs.mkdirSync(path.resolve(__dirname, "../dist/esm"), {
  recursive: true,
});

// Remove all files in "<project_root>/dist/esm"
fs.readdirSync(path.resolve(__dirname, "../dist/esm"), {
  encoding: "utf8",
  withFileTypes: true,
})
  .filter((dirent) => dirent.isFile())
  .map(({ name }) => name)
  .forEach((name) =>
    fs.unlinkSync(path.resolve(__dirname, `../dist/esm/${name}`))
  );

// Get file names
const names = fs
  .readdirSync(path.resolve(__dirname, "../src"), {
    encoding: "utf8",
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory())
  .map(({ name }) => name);

// Copy files to "<project_root>/dist/esm"
names
  .map((name) => ({
    src: path.resolve(__dirname, `../src/${name}/${name}.index.js`),
    dest: path.resolve(__dirname, `../dist/esm/${name}.js`),
  }))
  .forEach(({ src, dest }) =>
    fs.copyFileSync(src, dest, fs.constants.COPYFILE_EXCL)
  );

// Change import path
names
  .map((name) => path.resolve(__dirname, `../dist/esm/${name}.js`))
  .map((path) => [path, fs.readFileSync(path, { encoding: "utf8" }).toString()])
  .map(([path, code]) => {
    const ast = babelParser.parse(code, { sourceType: "module" });
    traverse(ast, {
      ImportDeclaration(path) {
        const l = path.node.source.value.split("/");
        const reverseI = l
          .slice()
          .reverse()
          .findIndex((s) => s.includes(".index.js"));
        const i = l.length - reverseI - 1;
        const n = l[i - 1];
        path.node.source.value = `./${n}.js`;
      },
    });
    const { code: code2 } = generate(
      ast,
      { retainFunctionParens: true, retainLines: true },
      code
    );
    return [path, code2];
  })
  .forEach(([path, code]) =>
    Readable.from([code]).pipe(fs.createWriteStream(path, { flags: "w" }))
  );

// Make fxsvg.js
const fxsvgjs = `
import { $$getSVG, $$setSVG } from "./getSetSVG.js";
${names
  .filter((name) => name !== "getSetSVG")
  .map((name) => `import { $$${name} } from "./${name}.js";`)
  .join("\n")}

const FxSVG = {
  getSVG: $$getSVG,
  setSVG: $$setSVG,
${names
  .filter((name) => name !== "getSetSVG")
  .map((name) => `  ${name}: $$${name}`)
  .join(",\n")}
};

export default FxSVG;
`.trimStart();
Readable.from([fxsvgjs]).pipe(
  fs.createWriteStream(path.resolve(__dirname, "../dist/esm/fxsvg.js"), {
    flags: "w",
  })
);

// Make index.js
const indexjs = `
${names
  .filter((name) => name !== "getSetSVG")
  .map((name) => `export { $$${name} } from "./${name}.js";`)
  .join("\n")}
export { default } from "./fxsvg.js";
`.trimStart();
Readable.from([indexjs]).pipe(
  fs.createWriteStream(path.resolve(__dirname, "../dist/esm/index.js"), {
    flags: "w",
  })
);
