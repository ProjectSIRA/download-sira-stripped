import { info, getInput, warning, setFailed } from "@actions/core";
import fetch from "node-fetch";
import { Extract } from "unzipper";

main().then(() => info("Complete!"));

async function main() {
  try {
    const code = getInput("sira-server-code");
    const manifestPath = getInput("manifest");
    const extractPath = getInput("path");

    let manifestStringData = fs.readFileSync(manifestPath, "utf8");
    if (manifestStringData.startsWith("\uFEFF")) {
      warning(
        "BOM character detected at the beginning of the manifest JSON file. Please remove the BOM from the file as it does not conform to the JSON spec (https://datatracker.ietf.org/doc/html/rfc7159#section-8.1) and may cause issues regarding interoperability."
      );
      manifestStringData = manifestStringData.slice(1);
    }

    const manifest = JSON.parse(manifestStringData);
    info(
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

    await response.body.pipe(Extract({ path: extractPath }));
  } catch (error) {
    setFailed(error.message);
  }
}
