const core = require("@actions/core");
const fetch = require("node-fetch");
const unzip = require("unzipper");
const fs = require("fs");

main().then(() => info("Complete!"));

async function main() {
  try {
    const code = core.getInput("sira-server-code");
    const manifestPath = core.getInput("manifest");
    const extractPath = core.getInput("path");

    let manifestStringData = fs.readFileSync(manifestPath, "utf8");
    if (manifestStringData.startsWith("\uFEFF")) {
      core.warning(
        "BOM character detected at the beginning of the manifest JSON file. Please remove the BOM from the file as it does not conform to the JSON spec (https://datatracker.ietf.org/doc/html/rfc7159#section-8.1) and may cause issues regarding interoperability."
      );
      manifestStringData = manifestStringData.slice(1);
    }

    const manifest = JSON.parse(manifestStringData);
    core.info(
      "Retrieved manifest of '" +
        manifest.id +
        "' version '" +
        manifest.version +
        "' game version '" +
        manifest.gameVersion
    );

    const response = await fetch(
      "https://cdn.project-sira.tech/gate?code=" +
        code +
        "&id=" +
        manifest.gameVersion
    );

    if (!response) {
      if (response.status === 400) {
        throw new Error("Invalid code.");
      } else if (response.status === 404) {
        throw new Error("Could not find game version.");
      } else {
        throw new Error(
          "An unknown error has occured. '" + response.status + "'."
        );
      }
    }

    await response.body.pipe(unzip.Extract({ path: extractPath }));
  } catch (error) {
    core.setFailed(error.message);
  }
}
