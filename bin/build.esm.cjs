const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const babelParser = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");
const { default: generate } = require("@babel/generator");

const GET_SET_SVG_MODULE_NAME = "getSetSVG";

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

// Get module names
const names = fs
  .readdirSync(path.resolve(__dirname, "../src"), {
    encoding: "utf8",
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory())
  .map(({ name }) => name);

// Copy modules to "<project_root>/dist/esm"
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
        const r = l.slice().reverse();

        const n = r[1];

        if (r[0] !== `${n}.index.js`) {
          return;
        }

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
import { $$getSVG, $$setSVG } from "./${GET_SET_SVG_MODULE_NAME}.js";
${names
  .filter((name) => name !== GET_SET_SVG_MODULE_NAME)
  .map((name) => `import { $$${name} } from "./${name}.js";`)
  .join("\n")}

const FxSVG = {
  getSVG: $$getSVG,
  setSVG: $$setSVG,
${names
  .filter((name) => name !== GET_SET_SVG_MODULE_NAME)
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
export { $$getSVG, $$setSVG } from "./${GET_SET_SVG_MODULE_NAME}.js";
${names
  .filter((name) => name !== GET_SET_SVG_MODULE_NAME)
  .map((name) => `export { $$${name} } from "./${name}.js";`)
  .join("\n")}
export { default } from "./fxsvg.js";
`.trimStart();
Readable.from([indexjs]).pipe(
  fs.createWriteStream(path.resolve(__dirname, "../dist/esm/index.js"), {
    flags: "w",
  })
);
