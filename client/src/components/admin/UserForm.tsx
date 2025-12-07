import { useState, useEffect } from 'react';
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from '@/types';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<{ password?: string }>;
}

export function UserForm({ open, onOpenChange, user, onSubmit }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [manualPassword, setManualPassword] = useState('');
  const [isManualPassword, setIsManualPassword] = useState(false);

  const isEditMode = !!user;

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      } else {
        setName('');
        setEmail('');
        setIsAdmin(false);
      }
      setError(null);
      setGeneratedPassword(null);
      setShowPassword(false);
      setManualPassword('');
      setIsManualPassword(false);
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditMode) {
        // Edit mode: only send changed fields
        const updateData: UpdateUserRequest = {};
        if (name !== user.name) updateData.name = name;
        if (email !== user.email) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
          setError('No changes detected');
          setSubmitting(false);
          return;
        }

        await onSubmit(updateData);
        onOpenChange(false);
      } else {
        // Create mode
        if (!name.trim() || !email.trim()) {
          setError('Name and email are required');
          setSubmitting(false);
          return;
        }

        const result = await onSubmit({
          name,
          email,
          isAdmin,
          password: isManualPassword && manualPassword ? manualPassword : undefined
        });

        // If manual password was used, just close the dialog
        if (isManualPassword) {
          onOpenChange(false);
        } else if (result.password) {
          setGeneratedPassword(result.password);
          setShowPassword(true);
        } else {
          onOpenChange(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const copyPasswordToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
    }
  };

  const handleClose = () => {
    setShowPassword(false);
    setGeneratedPassword(null);
    setManualPassword('');
    setIsManualPassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update user information. Leave fields unchanged to keep current values.'
              : 'Create a new user account. A password will be automatically generated.'}
          </DialogDescription>
        </DialogHeader>

        {showPassword && generatedPassword ? (
          <>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>User Created Successfully</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  The user account has been created. Please save this password and share it
                  with the user securely.
                </p>
                <div className="mt-2 font-mono text-lg font-bold bg-white text-gray-900 p-3 rounded border border-gray-200 select-all">
                  {generatedPassword}
                </div>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={copyPasswordToClipboard} className="bg-white">
                Copy to Clipboard
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              {!isEditMode && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manualPassword"
                      checked={isManualPassword}
                      onChange={(e) => setIsManualPassword(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="manualPassword" className="cursor-pointer">
                      Set password manually (admins only)
                    </Label>
                  </div>

                  {isManualPassword && (
                    <div className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="text"
                        value={manualPassword}
                        onChange={(e) => setManualPassword(e.target.value)}
                        placeholder="Enter manual password"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        Note: You are responsible for sharing this password with the user.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isAdmin" className="cursor-pointer">
                      Grant admin privileges
                    </Label>
                  </div>
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
                className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Update User'
                    : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
