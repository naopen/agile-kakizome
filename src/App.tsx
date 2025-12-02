import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { KakizomeApp } from '@/components/KakizomeApp';
import { ResultView } from '@/components/ResultView';
import { Toaster } from '@/components/ui/toaster';

type AppState = 'hero' | 'result';

interface KanjiResult {
  kanji: string;
  meaningJp: string;
  meaningEn: string;
}

function App() {
  const [state, setState] = useState<AppState>('hero');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [result, setResult] = useState<KanjiResult | null>(null);

  const handleStart = () => {
    setIsDialogOpen(true);
  };

  const handleSuccess = (kanji: string, meaningJp: string, meaningEn: string) => {
    setResult({ kanji, meaningJp, meaningEn });
    setState('result');
  };

  const handleReset = () => {
    setState('hero');
    setResult(null);
  };

  return (
    <>
      {state === 'hero' && <Hero onStart={handleStart} />}

      {state === 'result' && result && (
        <ResultView
          kanji={result.kanji}
          meaningJp={result.meaningJp}
          meaningEn={result.meaningEn}
          onReset={handleReset}
        />
      )}

      <KakizomeApp
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />

      <Toaster />
    </>
  );
}

export default App;
