import React, { useState, useEffect } from 'react';
import './TeamDetails.css';
import { doc, updateDoc, arrayRemove, arrayUnion, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const sportIcons = {
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

const TeamDetails = ({ team, onNavigate, user }) => {
  const [actionMsg, setActionMsg] = useState('');
  const [memberNames, setMemberNames] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(team);

  // Helper to fetch latest team data
  const fetchLatestTeam = async (teamId) => {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      if (teamDoc.exists()) {
        setCurrentTeam({ id: teamId, ...teamDoc.data() });
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    const fetchMemberNames = async () => {
      if (!currentTeam || !currentTeam.members) return;
      const names = await Promise.all(
        currentTeam.members.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              return userDoc.data().displayName || uid;
            }
          } catch {}
          return uid;
        })
      );
      setMemberNames(names);
    };
    fetchMemberNames();
  }, [currentTeam]);

  useEffect(() => {
    setCurrentTeam(team);
  }, [team]);

  if (!currentTeam) {
    return (
      <div className="team-details-page">
        <div className="team-details-card">
          <h2>Team Not Found</h2>
          <button className="back-btn" onClick={() => onNavigate('teams')}>Back to Teams</button>
        </div>
      </div>
    );
  }

  const isMember = user && currentTeam.members && currentTeam.members.includes(user.uid);
  const isCreator = user && currentTeam.creatorId === user.uid;
  const isFull = currentTeam.members.length >= currentTeam.maxMembers;

  const handleJoin = async () => {
    if (!user || isMember || isFull || isCreator) return;
    try {
      const teamRef = doc(db, 'teams', currentTeam.id);
      await updateDoc(teamRef, {
        members: arrayUnion(user.uid)
      });
      setActionMsg('You have joined the team!');
      await fetchLatestTeam(currentTeam.id);
    } catch (err) {
      setActionMsg('Error joining team: ' + err.message);
    }
  };

  const handleQuit = async () => {
    if (!user || !isMember || isCreator) return;
    try {
      const teamRef = doc(db, 'teams', currentTeam.id);
      await updateDoc(teamRef, {
        members: arrayRemove(user.uid)
      });
      setActionMsg('You have quit the team.');
      await fetchLatestTeam(currentTeam.id);
    } catch (err) {
      setActionMsg('Error quitting team: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!user || !isCreator || isMember) return;
    try {
      const teamRef = doc(db, 'teams', currentTeam.id);
      await deleteDoc(teamRef);
      setActionMsg('Team deleted.');
      onNavigate('teams');
    } catch (err) {
      setActionMsg('Error deleting team: ' + err.message);
    }
  };

  return (
    <div className="team-details-page">
      <div className="team-details-card">
        <button
          className="back-btn"
          onClick={() => onNavigate('teams')}
          style={{ marginBottom: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
        >
          &larr; Back to Teams List
        </button>
        <div className="team-header-details">
          <div className="team-sport-icon-large">{sportIcons[currentTeam.sport] || sportIcons['Other']}</div>
          <div>
            <h2>{currentTeam.teamName}</h2>
            <span className="team-sport-label">{currentTeam.sport}</span>
          </div>
        </div>
        <div className="team-info-section">
          <p><strong>Location:</strong> {currentTeam.location}</p>
          <p><strong>Description:</strong> {currentTeam.description}</p>
          <div className="team-members-section">
            <strong>Members ({currentTeam.members.length} / {currentTeam.maxMembers}):</strong>
            <div className="team-members-list">
              {memberNames.map((name, idx) => (
                <span className="team-member-pill" key={idx}>{name}</span>
              ))}
            </div>
          </div>
          <p className="team-creator"><strong>Created by:</strong> {currentTeam.creatorName}</p>
        </div>
        {!isMember && !isFull && !isCreator && (
          <button type="button" className="join-btn" onClick={handleJoin} style={{marginTop: 12, background: '#11998e', color: '#fff', border: 'none', borderRadius: 25, padding: '10px 32px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer'}}>
            Join Team
          </button>
        )}
        {isMember && !isCreator && (
          <button type="button" className="quit-btn" onClick={handleQuit} style={{marginTop: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 25, padding: '10px 32px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer'}}>
            Quit Team
          </button>
        )}
        {isCreator && (
          <button type="button" className="delete-btn" onClick={handleDelete} style={{marginTop: 12, background: '#b71c1c', color: '#fff', border: 'none', borderRadius: 25, padding: '10px 32px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer'}}>
            Delete Team
          </button>
        )}
        {actionMsg && <div className="join-success" style={{marginTop: 10}}>{actionMsg}</div>}
      </div>
    </div>
  );
};

export default TeamDetails; 