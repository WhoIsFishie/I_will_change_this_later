const fs = require("fs")
const path = require("path")
const glob = require("glob")

const contentDir = path.join(__dirname, "content")
const files = glob.sync("**/*.md", { cwd: contentDir })

let modified = 0
let skipped = 0

for (const file of files) {
  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, "utf-8")

  // match inline tags like #Resort, #ResortCompany etc at start of a line
  const tagRegex = /^#([A-Za-z][\w]*)\s*$/gm
  const foundTags = []
  let cleaned = content

  // find all inline tags
  let match
  while ((match = tagRegex.exec(content)) !== null) {
    foundTags.push(match[1])
  }

  if (foundTags.length === 0) {
    skipped++
    continue
  }

  // remove the inline tag lines
  cleaned = cleaned
    .split("\n")
    .filter((line) => !line.match(/^#([A-Za-z][\w]*)\s*$/))
    .join("\n")

  // check if file already has frontmatter
  const fmRegex = /^---\n([\s\S]*?)\n---/
  const fmMatch = cleaned.match(fmRegex)

  if (fmMatch) {
    // has existing frontmatter — add tags to it
    let fm = fmMatch[1]
    // check if tags already exist in frontmatter
    if (fm.includes("tags:")) {
      // append to existing tags
      for (const tag of foundTags) {
        fm += `\n  - "${tag}"`
      }
    } else {
      fm += "\ntags:\n" + foundTags.map((t) => `  - "${t}"`).join("\n")
    }
    cleaned = cleaned.replace(fmRegex, `---\n${fm}\n---`)
  } else {
    // no frontmatter — create one
    const tagsYaml = foundTags.map((t) => `  - "${t}"`).join("\n")
    cleaned = `---\ntags:\n${tagsYaml}\n---\n${cleaned}`
  }

  // clean up extra blank lines at the start after frontmatter
  cleaned = cleaned.replace(/^(---\n[\s\S]*?\n---)\n{3,}/, "$1\n\n")

  fs.writeFileSync(filePath, cleaned, "utf-8")
  modified++
  console.log(`${file}: moved ${foundTags.join(", ")} to frontmatter`)
}

console.log(`\nDone. Modified: ${modified}, Skipped: ${skipped}`)
