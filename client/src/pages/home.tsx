import { MatrixRain } from "@/components/matrix-rain";
import { TranslatorCard } from "@/components/translator-card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <MatrixRain />
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-2">
            Digital Translator
          </h1>
          <p className="text-green-400">
            Encrypt and decrypt your messages using various ciphers
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TranslatorCard
            title="Binary Translator"
            type="binary"
            description="Convert text to binary (0s and 1s) and back"
          />
          <TranslatorCard
            title="Hexadecimal Translator"
            type="hexadecimal"
            description="Convert text to hexadecimal values and back"
          />
          <TranslatorCard
            title="Base64 Translator"
            type="base64"
            description="Encode and decode text using Base64"
          />
          <TranslatorCard
            title="Morse Code Translator"
            type="morse"
            description="Convert text to Morse code using dots and dashes"
          />
          <TranslatorCard
            title="Pig Latin Translator"
            type="piglatin"
            description="Convert text to Pig Latin and back"
          />
          <TranslatorCard
            title="Leetspeak Translator"
            type="leetspeak"
            description="Convert text to 1337 5p34k style"
          />
          <TranslatorCard
            title="Atbash Cipher"
            type="atbash"
            description="Simple substitution cipher (A→Z, B→Y, etc)"
          />
          <TranslatorCard
            title="Bacon Cipher"
            type="bacon"
            description="Convert text to sequences of A's and B's"
          />
          <TranslatorCard
            title="Caesar Cipher"
            type="caesar"
            description="Shift each letter in the text by a fixed number of positions (default shift: 3)"
            requiresKey
            keyPlaceholder="Enter shift number (default: 3)"
          />
          <TranslatorCard
            title="Vigenère Cipher"
            type="vigenere"
            description="Polyalphabetic substitution using a keyword (default: 'KEY')"
            requiresKey
            keyPlaceholder="Enter keyword (default: KEY)"
          />
        </div>
      </div>
    </div>
  );
}