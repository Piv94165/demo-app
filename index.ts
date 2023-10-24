import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function similarity(wordToFind:string,guessedWord:string) : Promise<number> {
	const body = {
    sim1: wordToFind,
    sim2: guessedWord,
    lang: "fr",
    type: "General Word2Vec",
  };
  const similarityResponse = await fetch(
    "http://nlp.polytechnique.fr/similarityscore",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const similarityResponseJson = await similarityResponse.json();
  return Number(similarityResponseJson.simscore);
}

async function extractGuess(req: Request):Promise<string> {
	const slackPayload = await req.formData();
  const guess = await slackPayload.get("text")?.toString();
  if (!guess) {
    throw Error("Guess is empty or null");
  }
  return guess;
}

async function handler(_req: Request): Promise<Response> {
	const guess = await extractGuess(_req);
	const result = await String(similarity("chien",guess));
  return new Response(result);
}

serve(handler);