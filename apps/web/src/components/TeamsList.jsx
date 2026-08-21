import React, { useEffect, useState } from 'react';
import './TeamsList.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

const SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Volleyball', 'Cricket',
  'Baseball', 'Hockey', 'Rugby', 'Badminton', 'Table Tennis',
  'Swimming', 'Athletics', 'Golf', 'Soccer', 'Other',
];

const SPORT_ICONS = {
  Football: '⚽', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐',
  Cricket: '🏏', Baseball: '⚾', Hockey: '🏒', Rugby: '🏉',
  Badminton: '🏸', 'Table Tennis': '🏓', Swimming: '🏊', Athletics: '🏃',
  Golf: '⛳', Soccer: '⚽', Other: '🏆',
};

const TeamsList = ({ onNavigate, user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setTeams(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchTeams();
  }, [user]);

  const filteredTeams = teams.filter((team) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      team.teamName?.toLowerCase().includes(term) ||
      team.location?.toLowerCase().includes(term);
    const matchesSport = !filterSport || team.sport === filterSport;
    return matchesSearch && matchesSport;
  });

  const handleViewTeam = (teamId) => {
    if (!user) {
      navigate('/login', { state: { from: `/teams/${teamId}` } });
    } else {
      navigate(`/teams/${teamId}`);
    }
  };

  const getMemberFill = (team) => {
    const pct = Math.round((team.members.length / team.maxMembers) * 100);
    return Math.min(pct, 100);
  };

  return (
    <div className="teams-list page">
      <div className="page-container">
        <button className="back-link" onClick={() => onNavigate('home')}>
          ← Back to home
        </button>

        <header className="page-header">
          <h1>Browse Teams</h1>
          <p>Find a team that matches your sport, location, and schedule.</p>
        </header>

        <div className="teams-filters">
          <div className="teams-filters__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className="input"
              placeholder="Search by name or location…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="select teams-filters__sport"
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
          >
            <option value="">All sports</option>
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="teams-empty">
            <div className="teams-empty__spinner" />
            <h2>Loading teams…</h2>
            <p>Fetching the latest teams near you.</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="teams-empty card">
            <span className="teams-empty__icon">🏆</span>
            <h2>No teams yet</h2>
            <p>Be the first to create a team and start building your community.</p>
            <button className="btn btn--primary" onClick={() => onNavigate('create')}>
              Create a Team
            </button>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="teams-empty card">
            <span className="teams-empty__icon">🔍</span>
            <h2>No matches found</h2>
            <p>Try adjusting your search or sport filter.</p>
          </div>
        ) : (
          <div className="teams-grid">
            {filteredTeams.map((team) => {
              const isFull = team.members.length >= team.maxMembers;
              const uid = auth.currentUser?.uid || user?.id;
              const isYours = uid && team.creatorId === uid;
              const isMember = uid && team.members?.includes(uid);

              return (
                <article key={team.id} className="team-card card">
                  <div className="team-card__header">
                    <span className="team-card__sport-icon">
                      {SPORT_ICONS[team.sport] || SPORT_ICONS.Other}
                    </span>
                    <div className="team-card__title">
                      <h3>{team.teamName}</h3>
                      <span className="badge">{team.sport}</span>
                    </div>
                    {isYours && <span className="badge badge--warning">Your team</span>}
                    {isMember && !isYours && <span className="badge">Member</span>}
                  </div>

                  <p className="team-card__location">📍 {team.location}</p>

                  <div className="team-card__capacity">
                    <div className="team-card__capacity-label">
                      <span>{team.members.length} / {team.maxMembers} members</span>
                      {isFull && <span className="team-card__full">Full</span>}
                    </div>
                    <div className="team-card__progress">
                      <div
                        className="team-card__progress-bar"
                        style={{ width: `${getMemberFill(team)}%` }}
                      />
                    </div>
                  </div>

                  <p className="team-card__creator">
                    Created by {team.creatorName || 'Unknown'}
                  </p>

                  <button
                    className="btn btn--primary btn--block"
                    onClick={() => handleViewTeam(team.id)}
                  >
                    View Details
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {!loading && teams.length > 0 && (
          <div className="teams-cta card">
            <p>Don't see a team that fits?</p>
            <button className="btn btn--accent" onClick={() => onNavigate('create')}>
              Create Your Own Team
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
