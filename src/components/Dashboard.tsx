import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ProfileForm } from './ProfileForm';
import { ProjectManagement } from './ProjectManagement';
import { Modal } from './ui/Modal';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData {
  displayName: string;
  bio: string;
  education: string;
  hobbies: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    displayName: user?.displayName || '',
    bio: '',
    education: '',
    hobbies: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as ProfileData);
          } else {
            // If the document doesn't exist, create it with default values
            await setDoc(docRef, profile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile. Please try again later.');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || ''} alt={profile.displayName || 'User'} />
              <AvatarFallback>{profile.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile.displayName || 'Name not set'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm"><strong>Bio:</strong> {profile.bio}</p>
            <p className="text-sm"><strong>Education:</strong> {profile.education}</p>
            <p className="text-sm"><strong>Hobbies:</strong> {profile.hobbies}</p>
          </div>
          <Button onClick={() => setIsEditProfileModalOpen(true)} className="mt-4">
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit Profile"
      >
        <ProfileForm 
          initialProfile={profile} 
          onProfileUpdate={(updatedProfile) => {
            handleProfileUpdate(updatedProfile);
            setIsEditProfileModalOpen(false);
          }}
          onCancel={() => setIsEditProfileModalOpen(false)}
        />
      </Modal>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectManagement />
        </CardContent>
      </Card>

      {currentUser && (
        <div>
          <p>Your shareable portfolio link:</p>
          <a href={`/portfolio/${currentUser.uid}`}>
            {`${window.location.origin}/portfolio/${currentUser.uid}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;