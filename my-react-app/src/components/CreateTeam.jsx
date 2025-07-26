import React, { useState } from 'react';
import './CreateTeam.css';

const CreateTeam = ({ onNavigate, onAddTeam, user }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    sport: '',
    location: '',
    description: '',
    maxMembers: 10
  });

  const [errors, setErrors] = useState({});

  const sports = [
    'Football', 'Basketball', 'Tennis', 'Volleyball', 'Cricket', 
    'Baseball', 'Hockey', 'Rugby', 'Badminton', 'Table Tennis',
    'Swimming', 'Athletics', 'Golf', 'Soccer', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    if (!formData.sport) {
      newErrors.sport = 'Please select a sport';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const creatorName = user?.displayName || user?.email || 'Unknown';
      onAddTeam({ ...formData, creator: creatorName });
      onNavigate('teams');
    }
  };

  return (
    <div className="create-team">
      <div className="container">
        <div className="header">
          <h1>Create Your Team</h1>
          <p>Start a new team and invite others to join your sports community</p>
        </div>
        <form className="team-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamName">Team Name *</label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              value={formData.teamName}
              onChange={handleChange}
              className={errors.teamName ? 'error' : ''}
              placeholder="Enter team name"
            />
            {errors.teamName && <span className="error-message">{errors.teamName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="sport">Sport *</label>
            <select
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              className={errors.sport ? 'error' : ''}
              placeholder="Select a sport"
            >
              <option value="">Select a sport</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
            {errors.sport && <span className="error-message">{errors.sport}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="Enter location"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Team Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
              placeholder="Enter team description"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="maxMembers">Maximum Team Members</label>
            <input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="2"
              max="100"
              value={formData.maxMembers}
              onChange={handleChange}
              placeholder="Enter maximum team members"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Create Team</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam; 