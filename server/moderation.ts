const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'cunt', 'bastard', 'damn',
  'piss', 'cock', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'fag',
  'retard', 'kill yourself', 'kys', 'die', 'rape',
  'scam', 'phishing', 'send money', 'wire transfer', 'bitcoin',
  'crypto wallet', 'click here', 'free iphone', 'you won',
  'hate', 'threat', 'bomb', 'attack',
];

const REPLACEMENT_CHAR = '*';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface ModerationResult {
  allowed: boolean;
  filteredText: string;
  flagged: boolean;
  reasons: string[];
}

export function moderateContent(text: string): ModerationResult {
  const reasons: string[] = [];
  let filteredText = text;
  let flagged = false;

  const lowerText = text.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(escapeRegex(word), 'gi');
    if (regex.test(lowerText)) {
      flagged = true;
      reasons.push(`Contains inappropriate language`);
      filteredText = filteredText.replace(regex, REPLACEMENT_CHAR.repeat(word.length));
    }
  }

  const leetMap: Record<string, string> = {
    '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's',
  };
  const deLeet = lowerText.replace(/[013457@$]/g, (c) => leetMap[c] || c);
  if (deLeet !== lowerText) {
    for (const word of BLOCKED_WORDS) {
      if (deLeet.includes(word)) {
        flagged = true;
        reasons.push('Contains disguised inappropriate language');
        break;
      }
    }
  }

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  if (urlRegex.test(text)) {
    flagged = true;
    reasons.push('Contains external links');
    filteredText = filteredText.replace(urlRegex, '[link removed]');
  }

  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  const allCaps = text.replace(/[^a-zA-Z]/g, '');
  if (allCaps.length > 10 && allCaps === allCaps.toUpperCase()) {
    reasons.push('Excessive use of capitals');
  }

  const repeatedChars = /(.)\1{5,}/;
  if (repeatedChars.test(text)) {
    reasons.push('Repeated characters detected');
  }

  const uniqueReasons = [...new Set(reasons)];

  return {
    allowed: true,
    filteredText,
    flagged,
    reasons: uniqueReasons,
  };
}
