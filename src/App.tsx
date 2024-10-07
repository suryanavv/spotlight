import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config';
import { HomePage } from './components/HomePage';
import Dashboard from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';
import { ProjectForm } from './components/ProjectForm';
import { AuthProvider } from './contexts/AuthContext';  // Add this import
import PublicPortfolio from './components/PublicPortfolio';  // Change this line

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/project/:projectId"
            element={user ? <ProjectDetails /> : <Navigate to="/" />}
          />
          <Route
            path="/add-project"
            element={user ? <ProjectForm /> : <Navigate to="/" />}
          />
          <Route
            path="/edit-project/:projectId"
            element={user ? <ProjectForm /> : <Navigate to="/" />}
          />
          <Route
            path="/portfolio/:userId"
            element={<PublicPortfolio />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
