const greetings = ["GM", "Good Morning", "𝐆𝐌", "🅶🅼"];

export const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};
