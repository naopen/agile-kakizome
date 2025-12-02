import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface KakizomeAppProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (kanji: string, meaningJp: string, meaningEn: string) => void;
}

interface ApiResponse {
  kanji?: string;
  meaning_jp?: string;
  meaning_en?: string;
  error?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

export function KakizomeApp({ isOpen, onClose, onSuccess }: KakizomeAppProps) {
  const [step, setStep] = useState<'auth' | 'form'>('auth');
  const [password, setPassword] = useState('');
  const [review, setReview] = useState('');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: 'エラー',
        description: 'パスワードを入力してください',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok || !data.success) {
        toast({
          title: '認証エラー',
          description: 'パスワードが正しくありません',
          variant: 'destructive',
        });
        setPassword('');
        return;
      }

      // Authentication successful
      setStep('form');
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'エラー',
        description: '認証に失敗しました。もう一度お試しください。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!review.trim() || !goal.trim()) {
      toast({
        title: 'エラー',
        description: '振り返りと目標の両方を入力してください',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Debug log
    console.log('Submitting with password length:', password?.length || 0);
    console.log('Password exists:', !!password);

    try {
      const payload = {
        review,
        goal,
        password,
      };
      console.log('Payload:', { ...payload, password: password ? '***' : 'EMPTY' });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as ApiResponse;

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: '認証エラー',
            description: 'パスワードが正しくありません',
            variant: 'destructive',
          });
          setStep('auth');
          setPassword('');
        } else {
          throw new Error(data.error || 'Failed to generate kanji');
        }
        return;
      }

      // Success
      if (data.kanji && data.meaning_jp && data.meaning_en) {
        onSuccess(data.kanji, data.meaning_jp, data.meaning_en);
      }
      handleReset();
      onClose();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'エラー',
        description: '漢字の生成に失敗しました。もう一度お試しください。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('auth');
    setPassword('');
    setReview('');
    setGoal('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'auth' ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-yuji text-2xl">認証</DialogTitle>
              <DialogDescription className="font-zen">
                デモ用のパスワードを入力してください
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAuth} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-zen">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  className="font-zen"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full font-zen" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    認証中...
                  </>
                ) : (
                  '次へ'
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-yuji text-2xl">
                書き初め
              </DialogTitle>
              <DialogDescription className="font-zen">
                2025年の振り返りと2026年の目標を入力してください
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="review" className="font-zen text-base">
                  2025年の振り返り
                </Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="例：今年はアジャイル開発の原則を深く学び、チームの生産性が向上しました..."
                  className="min-h-[120px] font-zen"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="font-zen text-base">
                  2026年の目標
                </Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="例：さらにチーム全体のコラボレーションを強化し、新しい挑戦に取り組みたいです..."
                  className="min-h-[120px] font-zen"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-zen"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    今年の漢字を生成
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
