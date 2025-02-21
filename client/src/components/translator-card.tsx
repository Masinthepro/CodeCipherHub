import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { translators } from '@/lib/translators';
import { useAudio } from '@/lib/audio';
import { Play } from 'lucide-react';

interface TranslatorCardProps {
  title: string;
  type: keyof typeof translators;
  description: string;
  requiresKey?: boolean;
  keyPlaceholder?: string;
}

export function TranslatorCard({ 
  title, 
  type, 
  description,
  requiresKey,
  keyPlaceholder = "Enter key..."
}: TranslatorCardProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const { toast } = useToast();
  const { playMorseCode } = useAudio();

  const handleEncode = useCallback(() => {
    try {
      const result = requiresKey 
        ? translators[type].encode(input, key || undefined)
        : translators[type].encode(input);
      setOutput(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid input format',
        variant: 'destructive',
      });
    }
  }, [input, type, key, requiresKey, toast]);

  const handleDecode = useCallback(() => {
    try {
      const result = requiresKey
        ? translators[type].decode(input, key || undefined)
        : translators[type].decode(input);
      setOutput(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid input format',
        variant: 'destructive',
      });
    }
  }, [input, type, key, requiresKey, toast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast({
      title: 'Copied',
      description: 'Output copied to clipboard',
    });
  }, [output, toast]);

  const handlePlayMorse = useCallback(async () => {
    if (type === 'morse' && output) {
      try {
        await playMorseCode(output);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to play Morse code audio',
          variant: 'destructive',
        });
      }
    }
  }, [output, type, playMorseCode, toast]);

  return (
    <Card className="w-full bg-black/50 border-green-500 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-green-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-green-400">{description}</p>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-black/30 border-green-500 text-green-400 placeholder:text-green-700"
            placeholder="Enter text to translate..."
          />
          {requiresKey && (
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-black/30 border-green-500 text-green-400 placeholder:text-green-700 mt-2"
              placeholder={keyPlaceholder}
            />
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleEncode}
            className="flex-1 bg-green-500 hover:bg-green-600 text-black"
          >
            Encode →
          </Button>
          <Button
            onClick={handleDecode}
            className="flex-1 bg-green-500 hover:bg-green-600 text-black"
          >
            ← Decode
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-400">Output:</p>
            <div className="flex gap-2">
              {type === 'morse' && output && (
                <Button
                  onClick={handlePlayMorse}
                  variant="ghost"
                  className="text-green-500 hover:text-green-400"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play
                </Button>
              )}
              <Button
                onClick={handleCopy}
                variant="ghost"
                className="text-green-500 hover:text-green-400"
                size="sm"
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="p-2 min-h-[2.5rem] bg-black/30 border border-green-500 rounded-md">
            <p className="text-green-400 break-all">{output}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}