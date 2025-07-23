import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import CreateTeam from './components/CreateTeam';
import TeamsList from './components/TeamsList';
import TeamDetails from './components/TeamDetails';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { auth, db } from './config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

function TeamDetailsWithParams({ onNavigate, user }) {
  const { teamId } = useParams();
  const [team, setTeam] = React.useState(null);
  React.useEffect(() => {
    const fetchTeam = async () => {
      const docSnap = await getDocs(collection(db, 'teams'));
      const found = docSnap.docs.find(doc => String(doc.id) === String(teamId));
      setTeam(found ? { id: found.id, ...found.data() } : null);
    };
    fetchTeam();
  }, [teamId]);
  return <TeamDetails team={team} onNavigate={onNavigate} user={user} />;
}

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();
  // Add handleAddTeam function
  const handleAddTeam = async (teamData) => {
    try {
      const teamsCol = collection(db, 'teams');
      await addDoc(teamsCol, {
        ...teamData,
        createdAt: serverTimestamp(),
        members: [user?.uid],
        creatorId: user?.uid,
        creatorName: user?.displayName || user?.email || 'Unknown',
      });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };
  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={page => navigate(page === 'teams' ? '/teams' : page === 'create' ? '/create' : '/')} user={user} />} />
      <Route path="/login" element={<LoginPage onLogin={user => { setUser(user); }} />} />
      <Route path="/create" element={user ? <CreateTeam onNavigate={page => navigate(page === 'home' ? '/' : '/teams')} onAddTeam={handleAddTeam} user={user} /> : <LoginPage onLogin={user => { setUser(user); }} />} />
      <Route path="/teams" element={<TeamsList onNavigate={page => navigate(page === 'home' ? '/' : page === 'create' ? '/create' : '/teams')} user={user} />} />
      <Route path="/teams/:teamId" element={<TeamDetailsWithParams onNavigate={page => navigate(page === 'teams' ? '/teams' : '/')} user={user} />} />
      <Route path="*" element={<HomePage onNavigate={page => navigate(page === 'teams' ? '/teams' : page === 'create' ? '/create' : '/')} user={user} />} />
    </Routes>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Removed sample teams insertion useEffect

  return (
    <Router>
      <div className="App">
        <NavigationBar user={user} setUser={setUser} />
        <div className="main-content">
          <AppRoutes user={user} setUser={setUser} />
        </div>
      </div>
    </Router>
  );
}

export default App;
