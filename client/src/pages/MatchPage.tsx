import { useState, useCallback, useMemo } from 'react';
import { Gift, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useMatch } from '@/hooks/useMatch';
import { RevealAnimation } from '@/components/match/RevealAnimation';
import { MatchCard } from '@/components/match/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type PageState = 'loading' | 'reveal' | 'card' | 'error' | 'no-match';

export function MatchPage() {
  const { match, loading, error, refetch } = useMatch();
  const [revealCompleted, setRevealCompleted] = useState(false);

  // Derive page state from data instead of using effect
  const pageState = useMemo((): PageState => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!match || !match.recipient) return 'no-match';
    if (match.firstTime && !revealCompleted) return 'reveal';
    return 'card';
  }, [loading, error, match, revealCompleted]);

  const showAnimation = match?.firstTime && !revealCompleted;

  const handleRevealComplete = useCallback(() => {
    setRevealCompleted(true);
  }, []);

  return (
    <PageContainer>
      <div className="min-h-[60vh] flex items-center justify-center">
        {pageState === 'loading' && (
          <LoadingSpinner message="Loading your match..." className="py-20" />
        )}

        {pageState === 'error' && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load your match</AlertTitle>
            <AlertDescription className="mt-2">
              {error || 'An unexpected error occurred'}
            </AlertDescription>
            <Button
              variant="outline"
              onClick={refetch}
              className="mt-4"
            >
              Try Again
            </Button>
          </Alert>
        )}

        {pageState === 'no-match' && (
          <EmptyState
            icon={Gift}
            title="No Match Yet"
            description="You haven't been assigned a Secret Santa match yet. Check back soon!"
            className="max-w-md bg-card/80 backdrop-blur-sm"
          />
        )}

        {pageState === 'reveal' && match?.recipient && (
          <div className="w-full max-w-lg">
            <RevealAnimation
              recipientName={match.recipient.name}
              onComplete={handleRevealComplete}
            />
          </div>
        )}

        {pageState === 'card' && match?.recipient && (
          <MatchCard
            recipient={match.recipient}
            animated={showAnimation}
          />
        )}
      </div>
    </PageContainer>
  );
}
