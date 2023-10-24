import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

const similarity = async (wordToFind:string,guessedWord:string) => {
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

const extractGuess = async (req: Request) => {
  const slackPayload = await req.formData();
  const guess = await slackPayload.get("text")?.toString();
  if (!guess) {
    throw Error("Guess is empty or null");
  }
  return guess;
};

async function handler(_req: Request): Promise<Response> {
	try {
		const guess = await extractGuess(_req);
		const result = await similarity("chien",guess).then((res : number) => String(res));
		return new Response(result);
	} catch(e) {
		console.error(e);
		return new Response("Error : ",e);
	}
	
}

serve(handler);