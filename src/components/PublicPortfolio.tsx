import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PublicPortfolio: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!userId) return;

      // Fetch user data
      const userDoc = await getDocs(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserData(userData);
        
        // Fetch user's projects
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(projectsRef, where('userId', '==', userId));
        const projectsSnapshot = await getDocs(projectsQuery);
        
        const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      }
    };

    fetchPortfolioData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="public-portfolio">
      <h1>{userData.displayName}'s Portfolio</h1>
      <section>
        <h2>About Me</h2>
        <p>{userData.bio}</p>
      </section>
      <section>
        <h2>Projects</h2>
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {/* Add more project details as needed */}
          </div>
        ))}
      </section>
    </div>
  );
};

export default PublicPortfolio;