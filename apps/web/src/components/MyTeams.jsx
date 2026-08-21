import React, { useEffect, useState } from 'react';
import './MyTeams.css';
import './TeamsList.css'; // Reuse team grid and card styles
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
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

const MyTeams = ({ onNavigate, user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const navigate = useNavigate();

  // Edit drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    sport: '',
    location: '',
    description: '',
    maxMembers: 10,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyTeams = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const allTeams = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const uid = auth.currentUser?.uid || user?.id;
      const myTeamsList = allTeams.filter((team) => team.creatorId === uid);
      setTeams(myTeamsList);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, [user]);

  const filteredTeams = teams.filter((team) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      team.teamName?.toLowerCase().includes(term) ||
      team.location?.toLowerCase().includes(term);
    const matchesSport = !filterSport || team.sport === filterSport;
    return matchesSearch && matchesSport;
  });

  const getMemberFill = (team) => {
    const pct = Math.round((team.members.length / team.maxMembers) * 100);
    return Math.min(pct, 100);
  };

  const handleEditClick = (team) => {
    setSelectedTeam(team);
    setFormData({
      teamName: team.teamName || '',
      sport: team.sport || '',
      location: team.location || '',
      description: team.description || '',
      maxMembers: team.maxMembers || 10,
    });
    setErrors({});
    setSubmitError('');
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTeam(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.sport) newErrors.sport = 'Please select a sport';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    const minMembersAllowed = selectedTeam?.members?.length || 1;
    if (Number(formData.maxMembers) < minMembersAllowed) {
      newErrors.maxMembers = `Cannot be less than current member count (${minMembersAllowed})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const teamDocRef = doc(db, 'teams', selectedTeam.id);
      await updateDoc(teamDocRef, {
        teamName: formData.teamName.trim(),
        sport: formData.sport,
        location: formData.location.trim(),
        description: formData.description.trim(),
        maxMembers: Number(formData.maxMembers),
      });
      setDrawerOpen(false);
      fetchMyTeams(); // reload the list
    } catch (err) {
      setSubmitError(err.message || 'Could not update team.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="teams-list page">
      <div className="page-container">
        <button className="back-link" onClick={() => onNavigate('home')}>
          ← Back to home
        </button>

        <header className="page-header">
          <h1>My Teams</h1>
          <p>Manage and edit the teams you have created.</p>
        </header>

        <div className="teams-filters">
          <div className="teams-filters__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className="input"
              placeholder="Search your teams…"
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
            <h2>Loading your teams…</h2>
          </div>
        ) : teams.length === 0 ? (
          <div className="teams-empty card">
            <span className="teams-empty__icon">👥</span>
            <h2>No teams created yet</h2>
            <p>You haven't created any teams. Create one now to get started!</p>
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

                  <div className="my-teams__card-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => navigate(`/teams/${team.id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={() => handleEditClick(team)}
                    >
                      Edit Team
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-out Edit Drawer */}
      <div 
        className={`edit-drawer-overlay ${drawerOpen ? 'open' : ''}`} 
        onClick={handleCloseDrawer}
      />
      
      <div className={`edit-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="edit-drawer__header">
          <h2>Edit Team</h2>
          <button className="edit-drawer__close" onClick={handleCloseDrawer}>&times;</button>
        </div>
        
        <form className="edit-drawer__form" onSubmit={handleSave}>
          <div className="edit-drawer__body">
            <div className="form-field">
              <label htmlFor="teamName">Team name *</label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                className={`input ${errors.teamName ? 'input--error' : ''}`}
                value={formData.teamName}
                onChange={handleChange}
              />
              {errors.teamName && <span className="form-error">{errors.teamName}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="sport">Sport *</label>
              <select
                id="sport"
                name="sport"
                className={`select ${errors.sport ? 'select--error' : ''}`}
                value={formData.sport}
                onChange={handleChange}
              >
                <option value="">Select a sport</option>
                {SPORTS.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
              {errors.sport && <span className="form-error">{errors.sport}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                className={`input ${errors.location ? 'input--error' : ''}`}
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className={`textarea ${errors.description ? 'textarea--error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="maxMembers">Max members *</label>
              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                className={`input ${errors.maxMembers ? 'input--error' : ''}`}
                min="2"
                max="100"
                value={formData.maxMembers}
                onChange={handleChange}
              />
              {errors.maxMembers && <span className="form-error">{errors.maxMembers}</span>}
            </div>

            {submitError && <div className="alert alert--error">{submitError}</div>}
          </div>

          <div className="edit-drawer__footer">
            <button 
              type="button" 
              className="btn btn--secondary" 
              onClick={handleCloseDrawer}
              disabled={submitting}
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="btn btn--primary" 
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyTeams;
