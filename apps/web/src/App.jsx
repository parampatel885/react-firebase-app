import React from 'react';
import './App.css';
import './components/GlobalButtonStyles.css';
import HomePage from './components/HomePage';
import CreateTeam from './components/CreateTeam';
import TeamsList from './components/TeamsList';
import TeamDetails from './components/TeamDetails';
import MyTeams from './components/MyTeams';
import MemberTeams from './components/MemberTeams';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { auth, db } from './config/firebase-config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function TeamDetailsWithParams({ onNavigate }) {
  const { teamId } = useParams();
  const { user } = useAuth();
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

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPassword } = useAuth();

  if (user && !hasPassword && location.pathname !== '/account') {
    return <Navigate to="/account" replace state={{ from: location.pathname === '/login' ? '/teams' : location.pathname }} />;
  }

  const handleAddTeam = async (teamData) => {
    const uid = auth.currentUser?.uid || user?.id;
    if (!uid) {
      throw new Error('You must be signed in to create a team.');
    }

    await addDoc(collection(db, 'teams'), {
      ...teamData,
      maxMembers: Number(teamData.maxMembers) || 10,
      createdAt: serverTimestamp(),
      members: [uid],
      creatorId: uid,
      creatorName: user.displayName || user.email || 'Unknown',
    });
  };

  const onNavigate = (page) => {
    if (page === 'teams') navigate('/teams');
    else if (page === 'create') navigate('/create');
    else if (page === 'my-teams') navigate('/my-teams');
    else if (page === 'member-teams') navigate('/member-teams');
    else navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={onNavigate} user={user} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={user ? <AccountPage /> : <LoginPage />} />
      <Route
        path="/create"
        element={
          user
            ? <CreateTeam onNavigate={onNavigate} onAddTeam={handleAddTeam} user={user} />
            : <LoginPage />
        }
      />
      <Route path="/teams" element={<TeamsList onNavigate={onNavigate} user={user} />} />
      <Route path="/my-teams" element={user ? <MyTeams onNavigate={onNavigate} user={user} /> : <LoginPage />} />
      <Route path="/member-teams" element={user ? <MemberTeams onNavigate={onNavigate} user={user} /> : <LoginPage />} />
      <Route path="/teams/:teamId" element={<TeamDetailsWithParams onNavigate={onNavigate} />} />
      <Route path="*" element={<HomePage onNavigate={onNavigate} user={user} />} />
    </Routes>
  );
}

function AppShell() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="App App--loading">
        <div className="app-loader" />
      </div>
    );
  }

  return (
    <div className="App">
      <NavigationBar />
      <div className="main-content">
        <AppRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;
