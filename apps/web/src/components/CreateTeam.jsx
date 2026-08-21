import React, { useState } from 'react';
import './CreateTeam.css';

const SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Volleyball', 'Cricket',
  'Baseball', 'Hockey', 'Rugby', 'Badminton', 'Table Tennis',
  'Swimming', 'Athletics', 'Golf', 'Soccer', 'Other',
];

const CreateTeam = ({ onNavigate, onAddTeam, user }) => {
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const creatorName = user?.displayName || user?.email || 'Unknown';
      await onAddTeam({
        ...formData,
        maxMembers: Number(formData.maxMembers) || 10,
        creator: creatorName,
      });
      onNavigate('teams');
    } catch (err) {
      setSubmitError(err.message || 'Could not create team.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-team page">
      <div className="page-container create-team__container">
        <button className="back-link" onClick={() => onNavigate('home')}>
          ← Back to home
        </button>

        <header className="page-header">
          <h1>Create Your Team</h1>
          <p>Set up your team and start inviting players to join.</p>
        </header>

        <form className="create-form card" onSubmit={handleSubmit}>
          <div className="create-form__grid">
            <div className="form-field">
              <label htmlFor="teamName">Team name *</label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                className={`input ${errors.teamName ? 'input--error' : ''}`}
                value={formData.teamName}
                onChange={handleChange}
                placeholder="e.g. Sunday Soccer Crew"
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

            <div className="form-field create-form__full">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                className={`input ${errors.location ? 'input--error' : ''}`}
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Central Park, New York"
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            <div className="form-field create-form__full">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className={`textarea ${errors.description ? 'textarea--error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Tell players about your team, skill level, and schedule…"
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="maxMembers">Max members</label>
              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                className="input"
                min="2"
                max="100"
                value={formData.maxMembers}
                onChange={handleChange}
              />
            </div>
          </div>

          {submitError && <div className="alert alert--error">{submitError}</div>}

          <div className="create-form__actions">
            <button type="button" className="btn btn--secondary" onClick={() => onNavigate('teams')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
