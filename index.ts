import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import * as fs from 'fs';

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

const responseBuilder = (similarity:number,guessedWord:string) => {
	if (similarity == 1) {
		return `Ouiii ! ${guessedWord} était bien le mot`;
	}
	if (similarity>.7) {
		return `Tu es proche avec ${guessedWord}`;
	}
	if (similarity < .3) {
		return `Tu es bien loiiiin avec ${guessedWord}`;
	}
	return `Courage, ça progresse avec ${guessedWord}`;
}

const generateWordToGuess = () => {
	let dateTime = new Date()
	let month = dateTime.getUTCMonth() + 1; //months from 1-12
	let day = dateTime.getUTCDate();
	let year = dateTime.getUTCFullYear();
	const List = fs.readFileSync('List.txt','utf8');
	const wordsList = List.split('\r\n');
	const index = (day+month+year)% wordsList.length;
	return wordsList[index];
}

async function handler(_req: Request): Promise<Response> {
	try {
		const guess = await extractGuess(_req);
		const wordToGuess = generateWordToGuess();
		const new_similarity = await similarity(wordToGuess,guess);
		const response = responseBuilder(new_similarity,guess);
		return new Response(response);
	} catch(e) {
		console.error(e);
		return new Response("Error : ",e);
	}
	
}

serve(handler);