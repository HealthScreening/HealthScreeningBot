import { readFile, readdir, rename, writeFile } from "fs/promises";
import { resolve } from "path";

const migrationPath = resolve(
  __dirname,
  "..",
  "src",
  "orm",
  "migrations",
  "migrations"
);

const replacementsBasePath = resolve(__dirname, "updateAutoMigration");

type ReplacementData = { old: string; new: string }[];

const replacementPaths: ReplacementData = [
  {
    old: resolve(replacementsBasePath, "1-old.txt"),
    new: resolve(replacementsBasePath, "1-new.txt"),
  },
  {
    old: resolve(replacementsBasePath, "2-old.txt"),
    new: resolve(replacementsBasePath, "2-new.txt"),
  },
];

async function getReplacements(
  paths: ReplacementData
): Promise<ReplacementData> {
  const replacements: ReplacementData = [];
  for (const path of paths) {
    const old = await readFile(path.old, "utf8");
    const newValue = await readFile(path.new, "utf8");
    replacements.push({ old, new: newValue });
  }
  return replacements;
}

async function updateAutoMigration(replacements: ReplacementData) {
  const files = (await readdir(migrationPath)).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of files) {
    let text = await readFile(resolve(migrationPath, file), "utf-8");
    const originalText = text;
    for (const replacement of replacements) {
      text = text.replace(replacement.old, replacement.new);
      if (originalText !== text) {
        await writeFile(resolve(migrationPath, file), text, "utf-8");
      }
    }
    await rename(
      resolve(migrationPath, file),
      resolve(migrationPath, file.replace(".js", ".ts"))
    );
  }
}

async function main() {
  const replacements = await getReplacements(replacementPaths);
  await updateAutoMigration(replacements);
}

main().then(() => {
  console.log("done");
});
