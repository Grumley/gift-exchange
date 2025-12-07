const SALT_ROUNDS = 12;

const ADJECTIVES = [
  'Happy', 'Sunny', 'Clever', 'Brave', 'Calm', 'Eager', 'Fancy', 'Jolly', 'Kind', 'Lively',
  'Merry', 'Nice', 'Proud', 'Silly', 'Witty', 'Lucky', 'Shiny', 'Cozy', 'Fuzzy', 'Bumpy',
  'Giant', 'Tiny', 'Swift', 'Slow', 'Loud', 'Quiet', 'Soft', 'Hard', 'Cool', 'Warm'
];

const NOUNS = [
  'Panda', 'Tiger', 'Eagle', 'Dolphin', 'Bear', 'Wolf', 'Fox', 'Lion', 'Hawk', 'Owl',
  'Shark', 'Whale', 'Seal', 'Otter', 'Penguin', 'Koala', 'Zebra', 'Camel', 'Llama', 'Moose',
  'Pizza', 'Taco', 'Burger', 'Mango', 'Lemon', 'Apple', 'Grape', 'Berry', 'Kiwi', 'Melon',
  'Rocket', 'Robot', 'Comet', 'Star', 'Moon', 'Sun', 'Cloud', 'Rain', 'Snow', 'Wind'
];

/**
 * Generate a memorable passphrase
 * Format: Word + Digit + # + Word + # + Word
 * Example: Oink9#Craving#Cost
 */
export function generatePassword(): string {
  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const word1 = getRandom([...ADJECTIVES, ...NOUNS]); // Mix them for variety or keep separate? User example "Oink", "Lettuce" are nouns. "Craving" is... gerund. "Cost" is noun.
  // User examples: Oink (noun/sound), Craving (noun), Cost (noun). Lettuce (noun), Anchor (noun), Paralyses (verb/noun).
  // Let's just use a mixed list of friendly words.

  const w1 = getRandom(NOUNS);
  const w2 = getRandom(ADJECTIVES);
  const w3 = getRandom(NOUNS);

  // Example pattern: Noun + Digit + # + Adjective + # + Noun
  // But strictly following user example "Oink9#Craving#Cost" -> Noun + Num + # + Noun + # + Noun

  const words = [
    'Apple', 'Anchor', 'Bear', 'Bird', 'Bridge', 'Cactus', 'Castle', 'Cloud', 'Comet', 'Cost',
    'Craving', 'Crown', 'Dolphin', 'Eagle', 'Echo', 'Falcon', 'Feast', 'Fire', 'Flower', 'Forest',
    'Fox', 'Garden', 'Ghost', 'Giant', 'Globe', 'Goat', 'Grape', 'Hawk', 'Hill', 'Honey',
    'Horse', 'House', 'Island', 'Jelly', 'Joy', 'King', 'Kite', 'Koala', 'Lake', 'Leaf',
    'Lemon', 'Lettuce', 'Light', 'Lime', 'Lion', 'Llama', 'Luck', 'Luna', 'Mango', 'Maple',
    'Melon', 'Mint', 'Moon', 'Moose', 'Moss', 'Mountain', 'Mouse', 'Night', 'Nova', 'Ocean',
    'Oink', 'Olive', 'Onion', 'Otter', 'Owl', 'Panda', 'Paralyses', 'Peach', 'Pearl', 'Penguin',
    'Pine', 'Pizza', 'Planet', 'Plum', 'Polar', 'Pond', 'Pool', 'Prize', 'Pug', 'Quest',
    'Rain', 'Raven', 'Reef', 'River', 'Robot', 'Rocket', 'Rose', 'Ruby', 'Sage', 'Sand',
    'Sea', 'Seal', 'Shark', 'Sheep', 'Shell', 'Ship', 'Sky', 'Snow', 'Solar', 'Spark',
    'Star', 'Stone', 'Storm', 'Sun', 'Swan', 'Swift', 'Taco', 'Tiger', 'Toast', 'Tower',
    'Tree', 'Tulip', 'Turtle', 'Valley', 'View', 'Vine', 'Wave', 'Whale', 'Wind', 'Wish',
    'Wolf', 'Wood', 'Wool', 'World', 'Worm', 'Wren', 'Yard', 'Zebra', 'Zen'
  ];

  const getWord = () => words[Math.floor(Math.random() * words.length)];

  const part1 = getWord();
  const digit = Math.floor(Math.random() * 9) + 1; // 1-9
  const part2 = getWord();
  const part3 = getWord();

  return `${part1}${digit}#${part2}#${part3}`;
}

/**
 * Hash a password using Bun.password (native bcrypt)
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: SALT_ROUNDS,
  });
}

/**
 * Verify a password against a hash using Bun.password
 * @param password - Plain text password
 * @param hash - Hashed password to compare against
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash);
}
