import { useState } from "react";

const greetingList = ["GM", "gm", "𝐆𝐌", "🅶🅼"];
const emojiList = [
  "🚀",
  "🌞",
  "🎉",
  "🌟",
  "☕",
  "🌇",
  ":coffeevibrate:",
  ":LC_coffee:",
  ":coffeepal:",
  ":shinji_coffee:",
  ":blobmorning:",
  ":milomorning:",
  ":wavemorning:",
];

const getRandomGreeting = (): Greeting => {
  const greeting =
    greetingList[Math.floor(Math.random() * greetingList.length)];
  const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  return {
    greeting,
    emoji,
    message: `${greeting} ${emoji}`,
  };
};

type Greeting = {
  greeting: string;
  emoji: string;
  message: string;
};

export const useGreeting = () => {
  const [greeting, setGreeting] = useState<Greeting>(getRandomGreeting());

  const rerollGreeting = () => {
    let newRandomGreeting = getRandomGreeting();

    while (JSON.stringify(newRandomGreeting) === JSON.stringify(greeting)) {
      newRandomGreeting = getRandomGreeting();
    }

    setGreeting(newRandomGreeting);
  };

  return { greeting, rerollGreeting };
};
