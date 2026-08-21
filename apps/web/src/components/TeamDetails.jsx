import React, { useState, useEffect } from 'react';
import './TeamDetails.css';
import { doc, updateDoc, arrayRemove, arrayUnion, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

const SPORT_ICONS = {
  Football: '⚽', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐',
  Cricket: '🏏', Baseball: '⚾', Hockey: '🏒', Rugby: '🏉',
  Badminton: '🏸', 'Table Tennis': '🏓', Swimming: '🏊', Athletics: '🏃',
  Golf: '⛳', Soccer: '⚽', Other: '🏆',
};

const TeamDetails = ({ team, onNavigate, user }) => {
  const [actionMsg, setActionMsg] = useState('');
  const [memberNames, setMemberNames] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(team);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLatestTeam = async (teamId) => {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      if (teamDoc.exists()) {
        setCurrentTeam({ id: teamId, ...teamDoc.data() });
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const fetchMemberNames = async () => {
      if (!currentTeam?.members) return;
      const names = await Promise.all(
        currentTeam.members.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              return userDoc.data().displayName || uid;
            }
          } catch {
            /* ignore */
          }
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
      <div className="team-details page page--centered">
        <div className="team-details__empty card">
          <span className="team-details__empty-icon">🔍</span>
          <h2>Team not found</h2>
          <p>This team may have been removed or the link is invalid.</p>
          <button className="btn btn--primary" onClick={() => onNavigate('teams')}>
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const uid = auth.currentUser?.uid || user?.id;
  const isMember = uid && currentTeam.members?.includes(uid);
  const isCreator = uid && currentTeam.creatorId === uid;
  const isFull = currentTeam.members.length >= currentTeam.maxMembers;
  const fillPct = Math.round((currentTeam.members.length / currentTeam.maxMembers) * 100);

  const handleJoin = async () => {
    if (!uid || isMember || isFull || isCreator) return;
    setActionLoading(true);
    setActionMsg('');
    try {
      await updateDoc(doc(db, 'teams', currentTeam.id), {
        members: arrayUnion(uid),
      });
      setActionMsg('You joined the team!');
      await fetchLatestTeam(currentTeam.id);
    } catch (err) {
      setActionMsg('Error joining team: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuit = async () => {
    if (!uid || !isMember || isCreator) return;
    setActionLoading(true);
    setActionMsg('');
    try {
      await updateDoc(doc(db, 'teams', currentTeam.id), {
        members: arrayRemove(uid),
      });
      setActionMsg('You left the team.');
      await fetchLatestTeam(currentTeam.id);
    } catch (err) {
      setActionMsg('Error leaving team: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!uid || !isCreator) return;
    if (!window.confirm('Delete this team? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'teams', currentTeam.id));
      onNavigate('teams');
    } catch (err) {
      setActionMsg('Error deleting team: ' + err.message);
      setActionLoading(false);
    }
  };

  return (
    <div className="team-details page">
      <div className="page-container team-details__container">
        <button className="back-link" onClick={() => onNavigate('teams')}>
          ← Back to teams
        </button>

        <article className="team-details__card card">
          <header className="team-details__hero">
            <span className="team-details__icon">
              {SPORT_ICONS[currentTeam.sport] || SPORT_ICONS.Other}
            </span>
            <div>
              <h1>{currentTeam.teamName}</h1>
              <span className="badge">{currentTeam.sport}</span>
            </div>
          </header>

          <div className="team-details__body">
            <div className="team-details__meta">
              <div className="team-details__meta-item">
                <span className="team-details__meta-label">Location</span>
                <span>{currentTeam.location}</span>
              </div>
              <div className="team-details__meta-item">
                <span className="team-details__meta-label">Created by</span>
                <span>{currentTeam.creatorName || 'Unknown'}</span>
              </div>
            </div>

            <div className="team-details__section">
              <h2>About</h2>
              <p>{currentTeam.description}</p>
            </div>

            <div className="team-details__section">
              <div className="team-details__members-header">
                <h2>Members</h2>
                <span>{currentTeam.members.length} / {currentTeam.maxMembers}</span>
              </div>
              <div className="team-details__progress">
                <div className="team-details__progress-bar" style={{ width: `${fillPct}%` }} />
              </div>
              <div className="team-details__members">
                {memberNames.map((name, idx) => (
                  <span className="team-details__member" key={idx}>
                    {name.charAt(0).toUpperCase()}
                    {name.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {actionMsg && (
              <div className={`alert ${actionMsg.includes('Error') ? 'alert--error' : 'alert--success'}`}>
                {actionMsg}
              </div>
            )}

            <div className="team-details__actions">
              {!user && (
                <p className="team-details__hint">Sign in to join this team.</p>
              )}
              {!isMember && !isFull && !isCreator && user && (
                <button
                  className="btn btn--primary btn--block"
                  onClick={handleJoin}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Joining…' : 'Join Team'}
                </button>
              )}
              {isMember && !isCreator && (
                <button
                  className="btn btn--secondary btn--block"
                  onClick={handleQuit}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Leaving…' : 'Leave Team'}
                </button>
              )}
              {isCreator && (
                <button
                  className="btn btn--danger btn--block"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  Delete Team
                </button>
              )}
              {isFull && !isMember && !isCreator && (
                <span className="badge badge--muted">Team is full</span>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TeamDetails;
