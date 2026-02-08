using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;

class MigrateTags
{
    static void Main(string[] args)
    {
        string contentDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "content");
        if (args.Length > 0)
            contentDir = args[0];

        contentDir = Path.GetFullPath(contentDir);
        Console.WriteLine($"Scanning: {contentDir}");

        if (!Directory.Exists(contentDir))
        {
            Console.WriteLine("Content directory not found!");
            return;
        }

        var files = Directory.GetFiles(contentDir, "*.md", SearchOption.AllDirectories);
        int modified = 0, skipped = 0;
        var tagLineRegex = new Regex(@"^#([A-Za-z]\w*)\s*$");

        foreach (var filePath in files)
        {
            var lines = File.ReadAllLines(filePath).ToList();
            var foundTags = new List<string>();
            var linesToRemove = new List<int>();

            for (int i = 0; i < lines.Count; i++)
            {
                var match = tagLineRegex.Match(lines[i]);
                if (match.Success)
                {
                    foundTags.Add(match.Groups[1].Value);
                    linesToRemove.Add(i);
                }
            }

            if (foundTags.Count == 0)
            {
                skipped++;
                continue;
            }

            // remove tag lines (reverse order to preserve indices)
            for (int i = linesToRemove.Count - 1; i >= 0; i--)
                lines.RemoveAt(linesToRemove[i]);

            // check if file has frontmatter
            bool hasFrontmatter = lines.Count > 0 && lines[0].Trim() == "---";
            int closingIndex = -1;

            if (hasFrontmatter)
            {
                for (int i = 1; i < lines.Count; i++)
                {
                    if (lines[i].Trim() == "---")
                    {
                        closingIndex = i;
                        break;
                    }
                }
            }

            if (hasFrontmatter && closingIndex > 0)
            {
                // check if tags: already exists in frontmatter
                int tagsLineIndex = -1;
                for (int i = 1; i < closingIndex; i++)
                {
                    if (lines[i].TrimStart().StartsWith("tags:"))
                    {
                        tagsLineIndex = i;
                        break;
                    }
                }

                var tagYamlLines = foundTags.Select(t => $"  - \"{t}\"").ToList();

                if (tagsLineIndex >= 0)
                {
                    // insert after existing tags: line
                    lines.InsertRange(tagsLineIndex + 1, tagYamlLines);
                }
                else
                {
                    // insert tags before closing ---
                    var toInsert = new List<string> { "tags:" };
                    toInsert.AddRange(tagYamlLines);
                    lines.InsertRange(closingIndex, toInsert);
                }
            }
            else
            {
                // no frontmatter — create one
                var fm = new List<string> { "---", "tags:" };
                fm.AddRange(foundTags.Select(t => $"  - \"{t}\""));
                fm.Add("---");
                lines.InsertRange(0, fm);
            }

            File.WriteAllLines(filePath, lines);
            modified++;
            string rel = Path.GetRelativePath(contentDir, filePath);
            Console.WriteLine($"{rel}: moved {string.Join(", ", foundTags)} to frontmatter");
        }

        Console.WriteLine($"\nDone. Modified: {modified}, Skipped: {skipped}");
    }
}
