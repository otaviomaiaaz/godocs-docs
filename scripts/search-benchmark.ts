import { createSearchBaseline } from "../lib/docs/search-baseline";
import { getAllDocs } from "../lib/docs/source";

async function main() {
  const docs = await getAllDocs();
  console.log(JSON.stringify(createSearchBaseline(docs), null, 2));
}

void main();
