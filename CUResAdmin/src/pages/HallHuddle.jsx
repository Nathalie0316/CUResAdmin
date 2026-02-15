import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png";
import "./RAForms.css";

function HallHuddle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    building: "",
    floor: null,
    allPresent: null,
    absentList: "",
    engagementNotes: "",
    responses: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Huddle Submitted:", formData);
    alert("Hall Huddle Report Submitted!");
    navigate("/ra-dashboard");
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card">
        
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Hall Huddle Reporting</h1>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-grid">
            
            {/* Left Column: Logistics */}
            <div className="form-column">
              <label className="fluid-label">Date</label>
              <input 
                type="date" 
                className="fluid-input" 
                required
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />

              <label className="fluid-label">Building</label>
              <div className="fluid-selection-grid">
                {["Griffith", "Stevens", "Lee", "Patterson"].map(b => (
                  <button 
                    key={b}
                    type="button"
                    className={`fluid-btn ${formData.building === b ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, building: b})}
                  >
                    {b} Hall
                  </button>
                ))}
              </div>

              <label className="fluid-label">Floor Number</label>
              <div className="fluid-row" style={{ justifyContent: 'flex-start' }}>
                {[1, 2, 3, 4].map(f => (
                  <button 
                    key={f}
                    type="button"
                    className={`fluid-floor-btn ${formData.floor === f ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, floor: f})}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Attendance & Engagement */}
            <div className="form-column">
              <label className="fluid-label">All residents present?</label>
              <div className="fluid-status-group" style={{ marginBottom: '1.5rem' }}>
                <div className="status-item">
                  YES
                  <div 
                    className={`fluid-dot ${formData.allPresent === true ? 'active-pass' : ''}`} 
                    onClick={() => setFormData({...formData, allPresent: true})}
                  ></div>
                </div>
                <div className="status-item">
                  NO
                  <div 
                    className={`fluid-dot ${formData.allPresent === false ? 'active-fail' : ''}`} 
                    onClick={() => setFormData({...formData, allPresent: false})}
                  ></div>
                </div>
              </div>

              {formData.allPresent === false && (
                <div className="fail-reason-box">
                  <label className="fluid-label">List residents who were absent:</label>
                  <textarea 
                    className="fluid-textarea" 
                    placeholder="Type names here..." 
                    onChange={(e) => setFormData({...formData, absentList: e.target.value})} 
                  />
                </div>
              )}

              <label className="fluid-label">How did you promote engagement?</label>
              <textarea 
                className="fluid-textarea" 
                placeholder="Type here..." 
                onChange={(e) => setFormData({...formData, engagementNotes: e.target.value})} 
              />

              <label className="fluid-label">What were 3 responses you received?</label>
              <textarea 
                className="fluid-textarea" 
                placeholder="Type here..." 
                onChange={(e) => setFormData({...formData, responses: e.target.value})} 
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="fluid-submit-btn">
            Submit Report
          </button>

        </form>
      </div>
    </div>
  );
}

export default HallHuddle;