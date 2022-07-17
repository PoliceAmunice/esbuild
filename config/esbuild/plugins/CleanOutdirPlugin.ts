import { Plugin, PluginBuild } from "esbuild";
import { rm } from "fs/promises";

const CleanOutdirPlugin: Plugin = {
  name: 'CleanOutdirPlugin',
  setup(build) {
    build.onStart(async () => {
      await cleanOutdir(build);
    })
  },
}

async function cleanOutdir (build: PluginBuild): Promise<void> {
  try {
    const outdir = build.initialOptions.outdir;

    if (!outdir) {
      console.error('CleanOutdirPlugin: no outdir was provided: ' + JSON.stringify(build.initialOptions));
      process.exit(1);
    }

    // ! AWARE – operation over file system !
    await rm(outdir, { recursive: true });
  } catch (error) {
    console.error('CleanOutdirPlugin: failed to clean up outdir: ' + error);
  }
}

export default CleanOutdirPlugin;
