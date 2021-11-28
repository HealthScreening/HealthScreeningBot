import {resolve} from 'path';
import {access, mkdir, readdir} from "fs/promises";
import {exec} from "child_process";

/**
 * Recursively read all files in a directory.
 *
 * Taken from https://stackoverflow.com/a/45130990/12248328
 * @param {string} dir The directory to read.
 * @returns {AsyncGenerator<string>} An async generator of all files in all directories.
 */
async function* walk(dir: string): AsyncGenerator<string> {
    const dirents = await readdir(dir, {withFileTypes: true});
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* walk(res);
        } else {
            yield res;
        }
    }
}

/**
 * Main function. Gets all files from the `src` directory in the parent directory and jsdoc-2-md's them.
 */
async function main() {
    const api_path = resolve(__dirname, "src", "dev", "api.md");
    const src_path = resolve(__dirname, '..', 'src')
    const jsdoc2md_executable = resolve(__dirname, 'node_modules', '.bin', 'jsdoc2md'); // Set the path to the jsodc2md executable
    const jsodc2md_config = resolve(__dirname, 'jsdoc2md.json'); // Set the path to the jsodc2md config file
    const items: string[] = [];
    for await (const file of walk(src_path)) {
        if (file.endsWith(".ts")) {
            items.push(file);
        }
    }
    const command = `${jsdoc2md_executable} --configure ${jsodc2md_config} --files ${items.join(" ")} > ${api_path}`;
    await exec(command);
}

main().then(() => {
    console.log("Done!");
}).catch(e => {
    console.error(e);
});