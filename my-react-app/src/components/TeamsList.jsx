import React, { useEffect, useState } from 'react';
import './TeamsList.css';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const TeamsList = ({ onNavigate, user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [memberNamesByTeamId, setMemberNamesByTeamId] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
      setLoading(false);
    };
    fetchTeams();
  }, [user]); // refetch if user changes (optional)

  useEffect(() => {
    // Fetch member names for all teams
    const fetchAllMemberNames = async () => {
      const newMemberNamesByTeamId = {};
      for (const team of teams) {
        if (!team.members || team.members.length === 0) {
          newMemberNamesByTeamId[team.id] = [];
          continue;
        }
        const names = await Promise.all(
          team.members.map(async (uid) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', uid));
              if (userDoc.exists()) {
                return userDoc.data().displayName || uid;
              }
            } catch {}
            return uid;
          })
        );
        newMemberNamesByTeamId[team.id] = names;
      }
      setMemberNamesByTeamId(newMemberNamesByTeamId);
    };
    if (teams && teams.length > 0) {
      fetchAllMemberNames();
    }
  }, [teams]);

  const sports = ['All', 'Football', 'Basketball', 'Tennis', 'Volleyball', 'Cricket', 
    'Baseball', 'Hockey', 'Rugby', 'Badminton', 'Table Tennis',
    'Swimming', 'Athletics', 'Golf', 'Soccer', 'Other'];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'All' || filterSport === '' || team.sport === filterSport;
    
    return matchesSearch && matchesSport;
  });

  const getSportIcon = (sport) => {
    const icons = {
      'Football': '⚽',
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Cricket': '🏏',
      'Baseball': '⚾',
      'Hockey': '🏒',
      'Rugby': '🏉',
      'Badminton': '🏸',
      'Table Tennis': '🏓',
      'Swimming': '🏊‍♂️',
      'Athletics': '🏃‍♂️',
      'Golf': '⛳',
      'Soccer': '⚽',
      'Other': '🏆'
    };
    return icons[sport] || '🏆';
  };

  const handleJoinClick = (teamId) => {
    if (!user) {
      navigate('/login', { state: { from: `/teams/${teamId}` } });
    } else {
      navigate(`/teams/${teamId}`);
    }
  };

  const handleJoinTeam = async (team) => {
    if (!user) {
      setActionMsg('Please log in to join teams');
      return;
    }
    
    if (team.members.includes(user.uid)) {
      setActionMsg('You are already a member of this team');
      return;
    }
    
    if (team.members.length >= team.maxMembers) {
      setActionMsg('This team is full');
      return;
    }
    
    try {
      const teamRef = doc(db, 'teams', team.id);
      await updateDoc(teamRef, {
        members: arrayUnion(user.uid)
      });
      setActionMsg('Successfully joined the team!');
      // Refresh the teams list
      window.location.reload();
    } catch (err) {
      setActionMsg('Error joining team: ' + err.message);
    }
  };

  const handleQuitTeam = async (team) => {
    if (!user) {
      setActionMsg('Please log in to quit teams');
      return;
    }
    
    if (!team.members.includes(user.uid)) {
      setActionMsg('You are not a member of this team');
      return;
    }
    
    if (team.creatorId === user.uid) {
      setActionMsg('Team creators cannot quit their own team');
      return;
    }
    
    try {
      const teamRef = doc(db, 'teams', team.id);
      await updateDoc(teamRef, {
        members: arrayRemove(user.uid)
      });
      setActionMsg('Successfully quit the team');
      // Refresh the teams list
      window.location.reload();
    } catch (err) {
      setActionMsg('Error quitting team: ' + err.message);
    }
  };

  // Delete team handler
  const handleDeleteTeam = async (team) => {
    if (!user || team.creatorId !== user.uid) return;
    if (!window.confirm('Are you sure you want to delete this team? This cannot be undone.')) return;
    try {
      const teamRef = doc(db, 'teams', team.id);
      await deleteDoc(teamRef);
      setActionMsg('Team deleted.');
      // Refresh the teams list
      window.location.reload();
    } catch (err) {
      setActionMsg('Error deleting team: ' + err.message);
    }
  };

  return (
    <div className="teams-list">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Back to Home
          </button>
          <h1>Available Teams</h1>
          <p>Browse and join teams that match your interests</p>
        </div>

        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search teams by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sport-filter">
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="filter-select"
            >
              <option value="">All Sports</option>
              {sports.slice(1).map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">🔄</div>
            <h2>Loading Teams...</h2>
            <p>Please wait while we fetch the latest teams.</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No Teams Yet</h2>
            <p>Be the first to create a team and start building your sports community!</p>
            
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No Teams Found</h2>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="teams-grid">
            {filteredTeams.map(team => (
              <div 
                key={team.id} 
                className="team-card"
              >
                <div className="team-header">
                  <div className="sport-icon">{getSportIcon(team.sport)}</div>
                  <div className="team-info">
                    <h3>{team.teamName}</h3>
                    <span className="sport">{team.sport}</span>
                  </div>
                </div>
                
                <div className="team-details">
                  <p className="location">📍 {team.location}</p>
                </div>
                
                <div className="team-stats">
                  <div className="stat">
                    <span className="stat-label">Members</span>
                    <span className="stat-value">{team.members.length}/{team.maxMembers}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Created by</span>
                    <span className="stat-value">{team.creatorName || team.creator}</span>
                  </div>
                </div>
                
              
                
                <div className="team-actions">
                  {!user ? (
                    <button className="join-btn" onClick={() => handleJoinClick(team.id)}>
                      View Details
                    </button>
                  ) : team.creatorId === user.uid ? (
                    <div className="team-action-buttons">
                      <button className="join-btn" onClick={() => handleJoinClick(team.id)}>
                      View Details
                    </button>
                      <div className="your-team-label">Your Team</div>
                    </div>
                  ) : team.members.includes(user.uid) ? (
                    <div className="team-action-buttons">
                      <button className="view-details-btn" onClick={() => handleJoinClick(team.id)}>
                        View Details
                      </button>
                      
                    </div>
                  ) : team.members.length >= team.maxMembers ? (
                    <button className="full-btn" disabled>
                      Team Full
                    </button>
                  ) : (
                    <div className="team-action-buttons">
                      <button className="view-details-btn" onClick={() => handleJoinClick(team.id)}>
                        View Details
                      </button>
                      
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {actionMsg && (
          <div className="action-message">
            {actionMsg}
          </div>
        )}

        <div className="create-team-section">
          <p>Don't see a team that fits? Create your own!</p>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate('create')}
          >
            Create New Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsList; 