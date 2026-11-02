/** Read-only URL inspection for a Search Console export (one URL per line).
 * Run after deployment: npm run audit:urls -- --file=urls.txt
 */
import { readFileSync } from "node:fs";
import { SITE_URL } from "../src/lib/constants";
const file = process.argv.find((a) => a.startsWith("--file="))?.slice(7);
if (!file) throw new Error("Pass --file=urls.txt (one absolute/relative URL per line)");
const urls = readFileSync(file, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean).filter((s) => !s.toLowerCase().startsWith("url,"));
const permitted = new URL(SITE_URL).host;
async function run() {
  let errors = 0;
  for (const value of urls) {
    try {
      const url = new URL(value, `${SITE_URL}/`);
      if (url.host !== permitted) throw new Error(`Host mismatch; expected ${permitted}`);
      const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Decor-Line-SEO-Audit/1.0" } });
      const location = response.headers.get("location");
      const destination = location ? new URL(location, url).toString() : "";
      const ok = response.status === 200 || ((response.status === 301 || response.status === 308) && destination.includes("/al-ahsa-interior-design"));
      if (!ok) errors += 1;
      console.log(`${ok ? "OK" : "CHECK"}\t${response.status}\t${url.pathname}\t${destination}`);
    } catch (error) {
      errors += 1;
      console.log(`ERROR\t${value}\t${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`Total: ${urls.length}; review required: ${errors}. 200/301 alone does not guarantee SEO equivalence or indexing.`);
  if (errors) process.exitCode = 2;
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
