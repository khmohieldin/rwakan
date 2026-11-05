import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".apk": "application/vnd.android.package-archive",
};

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  const file = normalize(join(root, url === "/" ? "index.html" : url));
  if (!file.startsWith(root)) { res.writeHead(403).end("no"); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found");
  }
}).listen(0, "127.0.0.1", function () {
  console.log("preview http://127.0.0.1:" + this.address().port);
});
