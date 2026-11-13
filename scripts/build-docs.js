// Writes README.md and docs/DOC-0X-*.md from js/pages.js (one source of truth).
// Run: node scripts/build-docs.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const sb = { console }; sb.window = sb; vm.createContext(sb);
["config.js", "data.js", "pages.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), sb));
const { Docs, renderBlocksMD } = sb.LC;
fs.mkdirSync(path.join(root, "docs"), { recursive: true });

Docs.forEach((d) => {
  const md = `# ${d.id} · ${d.title}\n\n` + renderBlocksMD(d.blocks).replace(/\]\(proof\//g, "](../proof/") + "\n";
  fs.writeFileSync(path.join(root, "docs", `${d.id}-${d.slug}.md`), md);
});

const d1 = Docs[0];
const index = Docs.map((d) => `- [${d.id} · ${d.title}](docs/${d.id}-${d.slug}.md)`).join("\n");
const twistGuide = fs.readFileSync(path.join(root, "scripts", "twist-guide.md"), "utf8");
fs.writeFileSync(path.join(root, "README.md"),
  `# Leftover Chef\n\n> ${d1.id} · ${d1.title}. All six documentation cards are also inside the app (footer → Documentation).\n\n` +
  renderBlocksMD(d1.blocks) + `\n\n## All documentation cards\n\n${index}\n\n${twistGuide}\n`);
console.log("Wrote README.md and " + Docs.length + " docs");
