export const translators = {
  binary: {
    encode: (text: string): string => {
      return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    },
    decode: (binary: string): string => {
      return binary
        .split(' ')
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('');
    }
  },

  hexadecimal: {
    encode: (text: string): string => {
      return text
        .split('')
        .map(char => char.charCodeAt(0).toString(16).toUpperCase())
        .join(' ');
    },
    decode: (hex: string): string => {
      return hex
        .split(' ')
        .map(h => String.fromCharCode(parseInt(h, 16)))
        .join('');
    }
  },

  base64: {
    encode: (text: string): string => {
      return btoa(text);
    },
    decode: (base64: string): string => {
      return atob(base64);
    }
  },

  morse: {
    encode: (text: string): string => {
      const morseCode: Record<string, string> = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', ' ': '/'
      };
      return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
    },
    decode: (morse: string): string => {
      const morseCode: Record<string, string> = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '/': ' '
      };
      return morse.split(' ').map(code => morseCode[code] || code).join('');
    }
  },

  piglatin: {
    encode: (text: string): string => {
      return text.split(' ').map(word => {
        if (!word) return word;
        const vowelIndex = word.toLowerCase().search(/[aeiou]/);
        if (vowelIndex === 0) return word + 'way';
        if (vowelIndex === -1) return word + 'ay';
        return word.slice(vowelIndex) + word.slice(0, vowelIndex) + 'ay';
      }).join(' ');
    },
    decode: (pigLatin: string): string => {
      return pigLatin.split(' ').map(word => {
        if (!word) return word;
        if (word.endsWith('way')) return word.slice(0, -3);
        if (word.endsWith('ay')) {
          const base = word.slice(0, -2);
          let i = base.length - 1;
          while (i >= 0 && !/[aeiou]/.test(base[i])) i--;
          return base.slice(i + 1) + base.slice(0, i + 1);
        }
        return word;
      }).join(' ');
    }
  },

  leetspeak: {
    encode: (text: string): string => {
      const leetMap: Record<string, string> = {
        'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1'
      };
      return text.toLowerCase().split('').map(char => leetMap[char] || char).join('');
    },
    decode: (leet: string): string => {
      const reverseLeetMap: Record<string, string> = {
        '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't'
      };
      return leet.split('').map(char => reverseLeetMap[char] || char).join('');
    }
  },

  atbash: {
    encode: (text: string): string => {
      return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCharCode(155 - code);
        if (code >= 97 && code <= 122) return String.fromCharCode(219 - code);
        return char;
      }).join('');
    },
    decode: (atbash: string): string => {
      return translators.atbash.encode(atbash); // Atbash is its own inverse
    }
  },

  caesar: {
    encode: (text: string, shift: number = 3): string => {
      return text.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
        }
        return char;
      }).join('');
    },
    decode: (text: string, shift: number = 3): string => {
      return translators.caesar.encode(text, 26 - shift);
    }
  },

  vigenere: {
    encode: (text: string, key: string = 'KEY'): string => {
      const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
      if (!normalizedKey) return text;

      let result = '';
      let keyIndex = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-zA-Z]/)) {
          const isUpperCase = char === char.toUpperCase();
          const baseChar = char.toUpperCase();
          const shift = normalizedKey[keyIndex % normalizedKey.length].charCodeAt(0) - 65;
          const shifted = String.fromCharCode(((baseChar.charCodeAt(0) - 65 + shift) % 26) + 65);
          result += isUpperCase ? shifted : shifted.toLowerCase();
          keyIndex++;
        } else {
          result += char;
        }
      }
      return result;
    },
    decode: (text: string, key: string = 'KEY'): string => {
      const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
      if (!normalizedKey) return text;

      let result = '';
      let keyIndex = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-zA-Z]/)) {
          const isUpperCase = char === char.toUpperCase();
          const baseChar = char.toUpperCase();
          const shift = normalizedKey[keyIndex % normalizedKey.length].charCodeAt(0) - 65;
          const shifted = String.fromCharCode(((baseChar.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
          result += isUpperCase ? shifted : shifted.toLowerCase();
          keyIndex++;
        } else {
          result += char;
        }
      }
      return result;
    }
  },

  oneZeroOne: {
    encode: (text: string, method: string = 'simplified'): string => {
      const normalizedMethod = method?.toLowerCase() || 'simplified';
      if (!['simplified', 'xmethod', 'unsimplified'].includes(normalizedMethod)) {
        throw new Error('Invalid method. Use: simplified, xMethod, or unsimplified');
      }

      const codeMap: Record<string, { simplified: string; xmethod: string; unsimplified: string }> = {
        'A': { simplified: '1', xmethod: 'X1', unsimplified: '1' },
        'B': { simplified: '2', xmethod: 'X2', unsimplified: '2' },
        'C': { simplified: '3', xmethod: 'X3', unsimplified: '3' },
        'D': { simplified: '4', xmethod: 'X4', unsimplified: '4' },
        'E': { simplified: '5', xmethod: 'X5', unsimplified: '5' },
        'F': { simplified: '6', xmethod: 'X6', unsimplified: '6' },
        'G': { simplified: '7', xmethod: 'X7', unsimplified: '7' },
        'H': { simplified: '8', xmethod: 'X8', unsimplified: '8' },
        'I': { simplified: '9', xmethod: 'X9', unsimplified: '9' },
        'J': { simplified: '1X', xmethod: '1X', unsimplified: '11' },
        'K': { simplified: '2X', xmethod: '2X', unsimplified: '22' },
        'L': { simplified: '3X', xmethod: '3X', unsimplified: '33' },
        'M': { simplified: '4X', xmethod: '4X', unsimplified: '44' },
        'N': { simplified: '5X', xmethod: '5X', unsimplified: '55' },
        'O': { simplified: '6X', xmethod: '6X', unsimplified: '66' },
        'P': { simplified: '7X', xmethod: '7X', unsimplified: '77' },
        'Q': { simplified: '8X', xmethod: '8X', unsimplified: '88' },
        'R': { simplified: '9X', xmethod: '9X', unsimplified: '99' },
        'S': { simplified: '1Z', xmethod: '1XX', unsimplified: '111' },
        'T': { simplified: '2Z', xmethod: '2XX', unsimplified: '222' },
        'U': { simplified: '3Z', xmethod: '3XX', unsimplified: '333' },
        'V': { simplified: '4Z', xmethod: '4XX', unsimplified: '444' },
        'W': { simplified: '5Z', xmethod: '5XX', unsimplified: '555' },
        'X': { simplified: '6Z', xmethod: '6XX', unsimplified: '666' },
        'Y': { simplified: '7Z', xmethod: '7XX', unsimplified: '777' },
        'Z': { simplified: '8Z', xmethod: '8XX', unsimplified: '888' }
      };

      return text.toUpperCase().split('').map(char => {
        if (char === ' ') return ' ';
        const codes = codeMap[char];
        return codes ? codes[normalizedMethod] : char;
      }).join('');
    },
    decode: (encoded: string, method: string = 'simplified'): string => {
      const normalizedMethod = method?.toLowerCase() || 'simplified';
      if (!['simplified', 'xmethod', 'unsimplified'].includes(normalizedMethod)) {
        throw new Error('Invalid method. Use: simplified, xMethod, or unsimplified');
      }

      const codeMap: Record<string, { simplified: string; xmethod: string; unsimplified: string }> = {
        'A': { simplified: '1', xmethod: 'X1', unsimplified: '1' },
        'B': { simplified: '2', xmethod: 'X2', unsimplified: '2' },
        'C': { simplified: '3', xmethod: 'X3', unsimplified: '3' },
        'D': { simplified: '4', xmethod: 'X4', unsimplified: '4' },
        'E': { simplified: '5', xmethod: 'X5', unsimplified: '5' },
        'F': { simplified: '6', xmethod: 'X6', unsimplified: '6' },
        'G': { simplified: '7', xmethod: 'X7', unsimplified: '7' },
        'H': { simplified: '8', xmethod: 'X8', unsimplified: '8' },
        'I': { simplified: '9', xmethod: 'X9', unsimplified: '9' },
        'J': { simplified: '1X', xmethod: '1X', unsimplified: '11' },
        'K': { simplified: '2X', xmethod: '2X', unsimplified: '22' },
        'L': { simplified: '3X', xmethod: '3X', unsimplified: '33' },
        'M': { simplified: '4X', xmethod: '4X', unsimplified: '44' },
        'N': { simplified: '5X', xmethod: '5X', unsimplified: '55' },
        'O': { simplified: '6X', xmethod: '6X', unsimplified: '66' },
        'P': { simplified: '7X', xmethod: '7X', unsimplified: '77' },
        'Q': { simplified: '8X', xmethod: '8X', unsimplified: '88' },
        'R': { simplified: '9X', xmethod: '9X', unsimplified: '99' },
        'S': { simplified: '1Z', xmethod: '1XX', unsimplified: '111' },
        'T': { simplified: '2Z', xmethod: '2XX', unsimplified: '222' },
        'U': { simplified: '3Z', xmethod: '3XX', unsimplified: '333' },
        'V': { simplified: '4Z', xmethod: '4XX', unsimplified: '444' },
        'W': { simplified: '5Z', xmethod: '5XX', unsimplified: '555' },
        'X': { simplified: '6Z', xmethod: '6XX', unsimplified: '666' },
        'Y': { simplified: '7Z', xmethod: '7XX', unsimplified: '777' },
        'Z': { simplified: '8Z', xmethod: '8XX', unsimplified: '888' }
      };

      // Create reverse mapping for the selected method
      const reverseMap: Record<string, string> = {};
      for (const [letter, codes] of Object.entries(codeMap)) {
        reverseMap[codes[normalizedMethod]] = letter;
      }

      // For unsimplified method, we need to process numbers in groups of 3, 2, or 1
      if (normalizedMethod === 'unsimplified') {
        return encoded.split(' ').map(word => {
          let result = '';
          let i = 0;
          const tryMatch = (digit: string, length: number) => {
            if (i + length - 1 < word.length) {
              const allSame = Array.from({ length }, (_, idx) => word[i + idx] === digit).every(Boolean);
              if (allSame) {
                const code = digit.repeat(length);
                const found = Object.entries(codeMap).find(([_, v]) => v.unsimplified === code);
                if (found) {
                  result += found[0];
                  i += length;
                  return true;
                }
              }
            }
            return false;
          };

          while (i < word.length) {
            const digit = word[i];
            // Try 3 digits first
            if (tryMatch(digit, 3)) continue;
            // Then try 2 digits
            if (tryMatch(digit, 2)) continue;
            // Finally try single digit
            const found = Object.entries(codeMap).find(([_, v]) => v.unsimplified === digit);
            result += found ? found[0] : digit;
            i++;
          }
          return result;
        }).join(' ');
      }

      // For simplified and xmethod
      return encoded.split(' ').map(word => {
        let result = '';
        let i = 0;
        while (i < word.length) {
          // Try to match 2 characters first (for codes like '1X', '2X', etc)
          if (i + 1 < word.length) {
            const twoChar = word.slice(i, i + 2);
            if (reverseMap[twoChar]) {
              result += reverseMap[twoChar];
              i += 2;
              continue;
            }
          }
          // Then try single character
          const oneChar = word[i];
          result += reverseMap[oneChar] || oneChar;
          i++;
        }
        return result;
      }).join(' ');
    }
  },
};