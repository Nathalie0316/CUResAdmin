import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./RAForms.css";

function HallHuddle() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const areaData = {
    Griffith: [1, 2, 3],
    Stevens: [1, 2, 3, 4],
    Lee: [1, 2, 3],
    Patterson: [1, 2, 3, 4]
  };

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

    if (!formData.building || !formData.floor || formData.allPresent === null) {
      return alert("Please select Building, Floor, and Attendance status.");
    }

    setUploading(true);

    try {
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
          <button className="back-link" onClick={() => navigate(-1)}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          <h1 className="fluid-title">Hall Huddles</h1>
        </div>

        <form 
          onSubmit={handleSubmit} 
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="form-grid" style={{ marginBottom: "1.5rem" }}>
            
            {/* LEFT COLUMN */}
            <div className="form-column form-stack">
              <label className="fluid-label">Date</label>
              <input 
                type="date" 
                className="fluid-input" 
                value={formData.date}
                required
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, date: e.target.value }))
                } 
              />

              <label className="fluid-label">Building & Floor</label>

                <div className="fluid-row" style={{ gap: '10px', marginBottom: '1.2rem' }}>

                  {/* BUILDING */}
                  <div className="select-wrapper" style={{ flex: 2 }}>
                    <select 
                      className="fluid-input"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          building: e.target.value,
                          floor: ""
                        }))
                      }
                      required
                    >
                      <option value="">Select Building</option>
                      <option value="Griffith">Griffith</option>
                      <option value="Stevens">Stevens</option>
                      <option value="Lee">Lee</option>
                      <option value="Patterson">Patterson</option>
                    </select>

                    {/* Custom Arrow */}
                    <span className="select-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>

                  {/* FLOOR */}
                  <div className="select-wrapper" style={{ flex: 1 }}>
                    <select 
                      className="fluid-input"
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, floor: e.target.value }))
                      }
                      required
                      disabled={!formData.building}
                    >
                      <option value="">Floor</option>
                      {formData.building &&
                        areaData[formData.building].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))
                      }
                    </select>

                    {/* Custom Arrow */}
                    <span className="select-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>

                </div>

              <label className="fluid-label">How did you promote engagement?</label>
              <textarea 
                className="fluid-textarea huddle-textarea" 
                placeholder="e.g. I encouraged everyone to share their thoughts by..." 
                value={formData.engagementNotes}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, engagementNotes: e.target.value }))
                } 
                required
              />
            </div>

            {/* RIGHT COLUMN FIXED */}
            <div className="form-column form-stack form-column-right">
              <div className="status-header-row section-spacing">
                <label className="fluid-label">All residents present?</label>

                <div className="fluid-status-group status-offset">
                  <div className="status-item">
                    <span className="status-label">Yes</span>
                    <div 
                      className={`fluid-dot ${formData.allPresent === true ? 'active-pass' : ''}`} 
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          allPresent: prev.allPresent === true ? null : true,
                          absentList: ""
                        }))
                      }
                    />
                  </div>

                  <div className="status-item">
                    <span className="status-label">No</span>
                    <div 
                      className={`fluid-dot ${formData.allPresent === false ? 'active-fail' : ''}`} 
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          allPresent: prev.allPresent === false ? null : false
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {formData.allPresent === false && (
                <div className="fail-reason-box" style={{ marginBottom: '1.5rem' }}>
                  <label className="fluid-label">Absent Residents:</label>
                  <textarea 
                    className="fluid-textarea huddle-textarea" 
                    placeholder="List names..." 
                    value={formData.absentList}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, absentList: e.target.value }))
                    } 
                  />
                </div>
              )}

              <label className="fluid-label">What were 3 responses/feedback items?</label>
              <textarea 
                className="fluid-textarea huddle-textarea" 
                placeholder="e.g. Students agreed with the devotional..."
                value={formData.responses}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, responses: e.target.value }))
                } 
                required
              />
            </div>
          </div>

          <button type="submit" className="fluid-submit-btn" disabled={uploading}>
            {uploading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HallHuddle;