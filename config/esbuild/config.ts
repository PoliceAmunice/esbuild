import { BuildOptions } from "esbuild";
import { resolveRoot } from "./helpers";
import CleanOutdirPlugin from "./plugins/CleanOutdirPlugin";
import InsertHTMLPlugin from "./plugins/InsertHTMLPlugin";


function getConfig(MODE: string): BuildOptions {
   const isDev = MODE === 'development';
   const isProd = MODE === 'production';

   return {
      outdir: resolveRoot('public'), // Critical for InsertHTMLPlugin, CleanOutdirPlugin
      entryPoints: [
         resolveRoot('src', 'index.tsx'),
      ],
      entryNames: '[dir]/assets/bundle.[name]-[hash]',
      assetNames: '[dir]/assets/[name]-[hash]',
      bundle: true,
      tsconfig: resolveRoot('tsconfig.json'),
      loader: {
         '.png': 'file',
         '.jpg': 'file',
         '.svg': 'file',
      },
      plugins: [
         CleanOutdirPlugin,
         InsertHTMLPlugin({
            template: resolveRoot('src', 'index.html'),
            title: 'esbuild tests',
         }),
      ],
      metafile: true, // Critical for InsertHTMLPlugin

      // Dev
      sourcemap: isDev,
      watch: isDev && {
         onRebuild(error, result ) {
            if (error) {
               console.error(error);
            } else {
               console.log('rebuild...');
            }
         }
      },

      // Prod
      minify: isProd,
   };
}

export default getConfig;
