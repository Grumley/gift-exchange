import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Shuffle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GenerateMatchesButtonProps {
  hasExistingMatches: boolean;
  onGenerate: () => Promise<void>;
}

export function GenerateMatchesButton({
  hasExistingMatches,
  onGenerate,
}: GenerateMatchesButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = () => {
    setDialogOpen(true);
    setSuccess(false);
    setError(null);
  };

  const handleConfirm = async () => {
    setGenerating(true);
    setError(null);

    try {
      await onGenerate();
      setSuccess(true);
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate matches');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerateClick} className="gap-2">
        <Shuffle className="h-4 w-4" />
        {hasExistingMatches ? 'Regenerate Matches' : 'Generate Matches'}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasExistingMatches ? 'Regenerate Matches?' : 'Generate Matches?'}
            </DialogTitle>
            <DialogDescription>
              {hasExistingMatches
                ? 'This will create a new set of Secret Santa assignments for the current year.'
                : 'Generate Secret Santa assignments for all users using a circular assignment algorithm.'}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Matches have been generated successfully. All users have been assigned their
                Secret Santa recipients.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {hasExistingMatches && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning: This will overwrite existing matches</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>All current match assignments will be deleted</li>
                      <li>All users will have their reveal status reset</li>
                      <li>Users will see the reveal animation again when they log in</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Users are randomly shuffled</li>
                  <li>Each person gives to the next person in the list</li>
                  <li>The last person gives to the first (circular assignment)</li>
                  <li>Requires at least 2 users to generate matches</li>
                </ul>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={generating || success}
              className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={generating || success}
              variant={hasExistingMatches ? 'destructive' : 'default'}
            >
              {generating
                ? 'Generating...'
                : hasExistingMatches
                  ? 'Regenerate'
                  : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
