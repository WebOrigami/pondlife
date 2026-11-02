import { Tree } from "@weborigami/async-tree";
import { symbols, systemCache, SystemCacheMap } from "@weborigami/language";
import { Origami } from "@weborigami/origami";

export default async function savePost(data) {
  // Turn the data (minus the key) into a document object
  const key = data.key;
  delete data.key;
  const doc = await Origami.document(data);

  // Serialize the document as text with front matter
  const text = await doc.pack();

  // Save the text as a file in the markdown folder
  const markdown = await Tree.scope(this).get("markdown");
  await markdown.set(key, text);

  // HACK: clear the markdown file from the Origami cache
  const cachePath = SystemCacheMap.joinPath(markdown.path, key);
  await systemCache.delete(cachePath);

  // Redirect back to the edit page
  const response = new Response(null, {
    status: 303,
    headers: {
      Location: `/edit/${key}`,
    },
  });
  response[symbols.volatileSymbol] = true;
  return response;
}
