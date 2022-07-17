import { build } from "esbuild";
import getConfig from "./config/esbuild/config";
import serve from "./config/esbuild/server";


// Env
const MODE = process.env.MODE || 'development';
const SERVE = Boolean(process.env.SERVE) || false;

const config = getConfig(MODE);

if (SERVE) {
  config.outdir
    ? serve(config.outdir)
    : console.error('Server start failed: no outdir to serve');
  ;
}

build(config)
  .then(console.log)
  .catch(console.error)
;
