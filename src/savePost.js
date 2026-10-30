import { Tree } from "@weborigami/async-tree";
import { symbols, systemCache, SystemCacheMap } from "@weborigami/language";
import { Origami } from "@weborigami/origami";

export default async function savePost(data) {
  const markdown = await Tree.scope(this).get("markdown");
  const key = data.key;
  delete data.key;
  const doc = await Origami.document(data);
  const text = await doc.pack();
  await markdown.set(key, text);

  // HACK: clear markdown file from cache
  const cachePath = SystemCacheMap.joinPath(markdown.path, key);
  await systemCache.delete(cachePath);

  const response = new Response(null, {
    status: 303,
    headers: {
      Location: `/edit/${key}`,
    },
  });
  response[symbols.volatileSymbol] = true;
  return response;
}
