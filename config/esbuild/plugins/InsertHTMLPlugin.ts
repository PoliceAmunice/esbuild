import { Plugin } from "esbuild";
import { readFile, writeFile } from "fs/promises";
import path, { sep as OSSeparator } from "path";
import { parse, HTMLElement } from 'node-html-parser';


interface InsertHTMLPluginOptions {
  template: string; // Absolute path or DOM string
  filename?: string; // For output
  title?: string;
  jsPaths?: string[];
  cssPaths?: string[];
}

function InsertHTMLPlugin(options: InsertHTMLPluginOptions): Plugin {
  return {
    name: 'InsertHTMLPlugin',
    setup(build) {
      const outdir = build.initialOptions.outdir;

      if (!outdir) {
        console.error('InsertHTMLPlugin: no outdir was provided: ' + JSON.stringify(build.initialOptions));
        process.exit(1);
      }

      let htmlString: string;

      build.onStart(async () => {
        try {
          htmlString = options.template.endsWith('.html') // Rude, I know..
            ? await readFile(options.template!, "utf-8")
            : options.template
          ;
        } catch (error) {
          console.error('InsertHTMLPlugin: failed to read file: ' + error);
          process.exit(1);
        }
      })

      build.onEnd(async (result) => {
        if (!result.metafile) {
          console.error('InsertHTMLPlugin: no metafile was provided: ' + JSON.stringify(build.initialOptions));
          process.exit(1);
        }

        const html = parse(htmlString);

        const allPaths: string[] = Object.keys(result.metafile.outputs);
        const [jsPaths, cssPaths] = filterSourcePaths(allPaths);

        const finalHTMLString = getFinalHTMLString(html, {jsPaths, cssPaths, ...options});

        await writeFile(path.resolve(outdir, options.filename || 'index.html'), finalHTMLString);
      })
    },
  };
}

function filterSourcePaths(allPaths: string[]) {
  return allPaths.reduce<Array<string[]>>((acc, path) => {
    const [js, css] = acc;

    const fileName = path.split(OSSeparator).pop();

    if (fileName?.endsWith('.js')) {
      js.unshift(fileName);
    } else if (fileName?.endsWith('.css')) {
      css.unshift(fileName);
    }

    return acc;
  }, [[], []]);
}

function getFinalHTMLString(
  html: HTMLElement,
  options: InsertHTMLPluginOptions,
): string {
  const links = options.cssPaths?.map(path => {
    return `<link rel="stylesheet" href="${path}">`
  }).join('\n');

  const scripts = options.jsPaths?.map(path => {
    return `<script src="${path}"></script>`
  }).join('\n');

  const title = html.querySelector('title');
  title && (title.textContent = options.title || '');

  if (links) {
    const head = html.querySelector('head');
    head && head.insertAdjacentHTML('beforeend', `\t${links}\n`);
  }

  if (scripts) {
    const body = html.querySelector('body');
    body && body.insertAdjacentHTML('beforeend', `\t${scripts}\n`);
  }

  return html.toString();
}

export default InsertHTMLPlugin;
