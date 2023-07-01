export function randomizeLetter(inputString: string) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < inputString.length; i++) {
    const letter = inputString[i];

    if (letter === " ") {
      result += " ";
      continue;
    }

    const isUpperCase = letter === letter.toUpperCase();
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    let randomLetter = alphabet[randomIndex];

    if (isUpperCase) {
      randomLetter = randomLetter.toUpperCase();
    }

    result += randomLetter;
  }

  return result;
}
