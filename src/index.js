/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		switch (url.pathname) {
			case '/createImg':
				return handlePostImg(env, request);
			case '/img':
				return handleGetImg(env, request);
			/* return new Response(crypto.randomUUID()); */
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
};

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB por pedazo
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function handlePostImg(env, request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file) {
    return new Response("No enviaste archivo", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);

  const key = file.name.replace(/\s+/g, "_");
  await env.CELLS_KV.put(key, base64);

  return new Response(`Imagen subida: ${file.name}`, { status: 200 });
}

async function handleGetImg(env, request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name"); // ejemplo: /getImg?name=miImagen.png

  if (!name) {
    return new Response("No enviaste el nombre de la imagen", { status: 400 });
  }

  const base64 = await env.CELLS_KV.get(name);
  if (!base64) {
    return new Response("Imagen no encontrada", { status: 404 });
  }

  // Convertimos base64 a blob binario para enviar como imagen
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  return new Response(binary, {
    headers: { "Content-Type": "image/png" } // cambia según el tipo de imagen
  });
}

