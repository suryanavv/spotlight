import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  displayName: string;
  bio: string;
  education: string;
  hobbies: string;
}

interface ProfileFormProps {
  initialProfile: ProfileData;
  onProfileUpdate: (profile: ProfileData) => void;
  onCancel: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onProfileUpdate, onCancel }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...profile,
          email: user.email,
          photoURL: user.photoURL,
        }, { merge: true });
        onProfileUpdate(profile);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          name="education"
          value={profile.education}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="hobbies">Hobbies</Label>
        <Input
          id="hobbies"
          name="hobbies"
          value={profile.hobbies}
          onChange={handleChange}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex justify-between">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
};