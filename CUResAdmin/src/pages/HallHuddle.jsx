import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./RAForms.css";

function HallHuddle() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    building: "",
    floor: "",
    allPresent: null,
    absentList: "",
    engagementNotes: "",
    responses: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.building || !formData.floor || formData.allPresent === null) {
      return alert("Please select Building, Floor, and Attendance status.");
    }

    setUploading(true);

    try {
      // Submit to lowercase 'hallhuddles' to match your Firestore Rules
      const docRef = await addDoc(collection(db, "hallhuddles"), {
        ...formData,
        floor: Number(formData.floor),
        submittedBy: auth.currentUser?.email || "Unknown RA",
        createdAt: serverTimestamp(),
      });

      if (docRef.id) {
        alert("Hall Huddle Report Submitted!");
        navigate("/ra-dashboard");
      }
    } catch (error) {
      console.error("Huddle Submission Error:", error);
      alert(`Submission Failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
                value={formData.date}
                required
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />

              {/* DROPDOWN STYLE - SIDE BY SIDE */}
              <label className="fluid-label">Location</label>
              <div className="fluid-row" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                <select 
                  className="fluid-input" 
                  style={{ flex: 2 }}
                  value={formData.building}
                  onChange={(e) => setFormData({...formData, building: e.target.value})}
                  required
                >
                  <option value="">Select Building</option>
                  <option value="Griffith">Griffith</option>
                  <option value="Stevens">Stevens</option>
                  <option value="Lee">Lee</option>
                  <option value="Patterson">Patterson</option>
                </select>

                <select 
                  className="fluid-input" 
                  style={{ flex: 1 }}
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  required
                >
                  <option value="">Floor</option>
                  {[1, 2, 3, 4].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <label className="fluid-label">How did you promote engagement?</label>
              <textarea 
                className="fluid-textarea" 
                placeholder="e.g. Door-to-door, GroupMe, Snacks..." 
                value={formData.engagementNotes}
                onChange={(e) => setFormData({...formData, engagementNotes: e.target.value})} 
                required
              />
            </div>

            {/* Right Column: Attendance & Feedback */}
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
                <div className="fail-reason-box" style={{ marginBottom: '1.5rem' }}>
                  <label className="fluid-label">Absent Residents:</label>
                  <textarea 
                    className="fluid-textarea" 
                    placeholder="List names..." 
                    value={formData.absentList}
                    onChange={(e) => setFormData({...formData, absentList: e.target.value})} 
                  />
                </div>
              )}

              <label className="fluid-label">What were 3 responses/feedback items?</label>
              <textarea 
                className="fluid-textarea" 
                placeholder="1. They want more events... 2. Quiet hours issues... 3. AC concerns..." 
                value={formData.responses}
                onChange={(e) => setFormData({...formData, responses: e.target.value})} 
                required
              />
            </div>
          </div>

          <button type="submit" className="fluid-submit-btn" disabled={uploading}>
            {uploading ? "Submitting..." : "Submit Huddle Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HallHuddle;