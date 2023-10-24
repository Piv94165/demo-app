import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

function similarity(word1:string,word2:string) : string {
	return word1+word2;
}

async function handler(_req: Request): Promise<Response> {
	const result : string = similarity("toto","chat");
  return new Response("Hello World");
}

serve(handler);