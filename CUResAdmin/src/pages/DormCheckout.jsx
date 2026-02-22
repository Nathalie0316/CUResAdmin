import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import seal from "../assets/bearlogo.png";
import "./RAForms.css";
// Still need to import Firebase functions and context to handle form submission and user data, but this is the basic structure of the DormCheckout page with form state management and navigation.

function DormCheckout() {
  const navigate = useNavigate();

  // State to hold all form data in a single object for easier management and submission.
  const [formData, setFormData] = useState({
    date: "",
    checkoutType: "",
    building: "",
    floor: null, 
    roomNumber: "",
    residentName: "",
    allCriteriaMet: null, // true for pass, false for fail, null for not selected.
    roomKey: "",
    closetKey: "",
    repairs: ""
  });

  // State to manage loading status during form submission to prevent multiple submissions.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Checkout:", formData); // Log form data to console for debugging purposes (I will replace with actual submission logic later).
    alert("Checkout Submitted!");
    navigate("/ra-dashboard"); // Redirect back to RA Dashboard after submission.
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card">
        
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Dorm Checkouts</h1>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Main Grid for Inputs */}
          <div className="form-grid">
            
            {/* Left Column */}
            <div className="form-column">
              <label className="fluid-label">Date</label>
              <input 
                type="date" 
                className="fluid-input" 
                required
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />

              <label className="fluid-label">Type of Checkout</label>
              <div className="fluid-selection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {["Official", "Winter Break", "Moving"].map(type => (
                  <button 
                    key={type}
                    type="button"
                    className={`fluid-btn ${formData.checkoutType === type ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, checkoutType: type})}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <label className="fluid-label">Building</label>
              <div className="fluid-selection-grid">
                {["Griffith", "Stevens", "Lee", "Patterson"].map(b => (
                  <button 
                    key={b}
                    type="button"
                    className={`fluid-btn ${formData.building === b ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, building: b})}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <label className="fluid-label">Floor Number</label>
              <div className="fluid-row" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
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

              <label className="fluid-label">Room Number</label>
              <input 
                type="text" 
                className="fluid-input" 
                placeholder="Room #" 
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} 
              />

              <label className="fluid-label">Resident Name</label>
              <input 
                type="text" 
                className="fluid-input" 
                placeholder="Full Name" 
                onChange={(e) => setFormData({...formData, residentName: e.target.value})} 
              />
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="upload-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="upload-box">
                  <p><strong>Room Photo</strong></p>
                  <button type="button" className="icon-btn">📷</button>
                </div>
                <div className="upload-box">
                  <p><strong>Bathroom Photo</strong></p>
                  <button type="button" className="icon-btn">📷</button>
                </div>
              </div>

              <label className="fluid-label">All Criteria Met?</label>
              <div className="fluid-status-group" style={{ marginBottom: '1.5rem' }}>
                <div className="status-item">
                  PASS
                  <div 
                    className={`fluid-dot ${formData.allCriteriaMet === true ? 'active-pass' : ''}`} 
                    onClick={() => setFormData({...formData, allCriteriaMet: true})}
                  ></div>
                </div>
                <div className="status-item">
                  FAIL
                  <div 
                    className={`fluid-dot ${formData.allCriteriaMet === false ? 'active-fail' : ''}`} 
                    onClick={() => setFormData({...formData, allCriteriaMet: false})}
                  ></div>
                </div>
              </div>

              <div className="fluid-row" style={{ gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Room Key #</label>
                  <input type="text" className="fluid-input" placeholder="####" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Closet Key #</label>
                  <input type="text" className="fluid-input" placeholder="####" />
                </div>
              </div>

              <label className="fluid-label">Other Repairs Needed:</label>
              <textarea 
                className="fluid-textarea" 
                placeholder="Type here..." 
                onChange={(e) => setFormData({...formData, repairs: e.target.value})}
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="fluid-submit-btn">
            Submit Checkout
          </button>

        </form>
      </div>
    </div>
  );
}

export default DormCheckout;