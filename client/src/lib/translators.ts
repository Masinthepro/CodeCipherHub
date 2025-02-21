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

      const codeMap: Record<string, { simplified: string; xMethod: string; unsimplified: string }> = {
        'A': { simplified: '1', xMethod: 'X1', unsimplified: '1' },
        'B': { simplified: '2', xMethod: 'X2', unsimplified: '2' },
        'C': { simplified: '3', xMethod: 'X3', unsimplified: '3' },
        'D': { simplified: '4', xMethod: 'X4', unsimplified: '4' },
        'E': { simplified: '5', xMethod: 'X5', unsimplified: '5' },
        'F': { simplified: '6', xMethod: 'X6', unsimplified: '6' },
        'G': { simplified: '7', xMethod: 'X7', unsimplified: '7' },
        'H': { simplified: '8', xMethod: 'X8', unsimplified: '8' },
        'I': { simplified: '9', xMethod: 'X9', unsimplified: '9' },
        'J': { simplified: '1X', xMethod: '1X', unsimplified: '11' },
        'K': { simplified: '2X', xMethod: '2X', unsimplified: '22' },
        'L': { simplified: '3X', xMethod: '3X', unsimplified: '33' },
        'M': { simplified: '4X', xMethod: '4X', unsimplified: '44' },
        'N': { simplified: '5X', xMethod: '5X', unsimplified: '55' },
        'O': { simplified: '6X', xMethod: '6X', unsimplified: '66' },
        'P': { simplified: '7X', xMethod: '7X', unsimplified: '77' },
        'Q': { simplified: '8X', xMethod: '8X', unsimplified: '88' },
        'R': { simplified: '9X', xMethod: '9X', unsimplified: '99' },
        'S': { simplified: '1Z', xMethod: '1XX', unsimplified: '111' },
        'T': { simplified: '2Z', xMethod: '2XX', unsimplified: '222' },
        'U': { simplified: '3Z', xMethod: '3XX', unsimplified: '333' },
        'V': { simplified: '4Z', xMethod: '4XX', unsimplified: '444' },
        'W': { simplified: '5Z', xMethod: '5XX', unsimplified: '555' },
        'X': { simplified: '6Z', xMethod: '6XX', unsimplified: '666' },
        'Y': { simplified: '7Z', xMethod: '7XX', unsimplified: '777' },
        'Z': { simplified: '8Z', xMethod: '8XX', unsimplified: '888' }
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

      // Create a mapping of codes to letters for the selected method
      const reverseMap = new Map<string, string>();
      const allCodes: Array<[string, string]> = [];

      for (const [letter, codes] of Object.entries({
        'A': { simplified: '1', xMethod: 'X1', unsimplified: '1' },
        'B': { simplified: '2', xMethod: 'X2', unsimplified: '2' },
        'C': { simplified: '3', xMethod: 'X3', unsimplified: '3' },
        'D': { simplified: '4', xMethod: 'X4', unsimplified: '4' },
        'E': { simplified: '5', xMethod: 'X5', unsimplified: '5' },
        'F': { simplified: '6', xMethod: 'X6', unsimplified: '6' },
        'G': { simplified: '7', xMethod: 'X7', unsimplified: '7' },
        'H': { simplified: '8', xMethod: 'X8', unsimplified: '8' },
        'I': { simplified: '9', xMethod: 'X9', unsimplified: '9' },
        'J': { simplified: '1X', xMethod: '1X', unsimplified: '11' },
        'K': { simplified: '2X', xMethod: '2X', unsimplified: '22' },
        'L': { simplified: '3X', xMethod: '3X', unsimplified: '33' },
        'M': { simplified: '4X', xMethod: '4X', unsimplified: '44' },
        'N': { simplified: '5X', xMethod: '5X', unsimplified: '55' },
        'O': { simplified: '6X', xMethod: '6X', unsimplified: '66' },
        'P': { simplified: '7X', xMethod: '7X', unsimplified: '77' },
        'Q': { simplified: '8X', xMethod: '8X', unsimplified: '88' },
        'R': { simplified: '9X', xMethod: '9X', unsimplified: '99' },
        'S': { simplified: '1Z', xMethod: '1XX', unsimplified: '111' },
        'T': { simplified: '2Z', xMethod: '2XX', unsimplified: '222' },
        'U': { simplified: '3Z', xMethod: '3XX', unsimplified: '333' },
        'V': { simplified: '4Z', xMethod: '4XX', unsimplified: '444' },
        'W': { simplified: '5Z', xMethod: '5XX', unsimplified: '555' },
        'X': { simplified: '6Z', xMethod: '6XX', unsimplified: '666' },
        'Y': { simplified: '7Z', xMethod: '7XX', unsimplified: '777' },
        'Z': { simplified: '8Z', xMethod: '8XX', unsimplified: '888' }
      })) {
        const code = codes[normalizedMethod as keyof typeof codes];
        reverseMap.set(code, letter);
        allCodes.push([code, letter]);
      }

      // Sort codes by length (longest first) to ensure proper matching
      allCodes.sort((a, b) => b[0].length - a[0].length);

      let result = '';
      let currentPosition = 0;

      while (currentPosition < encoded.length) {
        if (encoded[currentPosition] === ' ') {
          result += ' ';
          currentPosition++;
          continue;
        }

        let found = false;
        for (const [code, letter] of allCodes) {
          if (encoded.startsWith(code, currentPosition)) {
            result += letter;
            currentPosition += code.length;
            found = true;
            break;
          }
        }

        if (!found) {
          result += encoded[currentPosition];
          currentPosition++;
        }
      }

      return result;
    }
  },
};