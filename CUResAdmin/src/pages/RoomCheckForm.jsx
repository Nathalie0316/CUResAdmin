import { useNavigate } from "react-router-dom";
import "./RAForms.css";
import { useState, useRef } from "react"; // Added useRef

function RoomCheckForm() {
  const navigate = useNavigate();
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [residents, setResidents] = useState([
    { name: "", status: "", reason: "" },
    { name: "", status: "", reason: "" },
    { name: "", status: "", reason: "" },
  ]);
  const roomPhotoRef = useRef(null);
  const bathPhotoRef = useRef(null);
  const [roomPhoto, setRoomPhoto] = useState(null);
  const [bathPhoto, setBathPhoto] = useState(null);

  const updateStatus = (index, status) => {
    const newRes = [...residents];
    const currentStatus = newRes[index].status;
    // Toggle logic
    newRes[index].status = (currentStatus === status) ? "" : status;
    // If they aren't "Fail" anymore, clear the reason
    if (newRes[index].status !== "Fail") {
      newRes[index].reason = "";
    }
    setResidents(newRes);
  };
  const updateReason = (index, text) => {
    const newRes = [...residents];
    newRes[index].reason = text;
    setResidents(newRes);
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card">
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Weekly Roomchecks</h1>
        </div>

        <div className="form-grid">
          {/* Left Column: Logistics */}
          <div className="form-column">
            <label className="fluid-label">Date</label>
            <input type="date" className="fluid-input" defaultValue="0000-00-00" />

            <label className="fluid-label">Building</label>
            <div className="fluid-selection-grid">
              {["Griffith", "Stevens", "Lee", "Patterson"].map((b) => (
                <button 
                  key={b} 
                  className={building === b ? "fluid-btn active" : "fluid-btn"}
                  onClick={() => setBuilding(building === b ? "" : b)}
                >
                  {b}
                </button>
              ))}
            </div>

            <label className="fluid-label">Floor</label>
            <div className="fluid-row">
              {["1", "2", "3", "4"].map((f) => (
                <button 
                  key={f} 
                  className={floor === f ? "fluid-floor-btn active" : "fluid-floor-btn"}
                  onClick={() => setFloor(floor === f ? "" : f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
{/* Right Column: Residents */}
<div className="form-column">
  {residents.map((res, i) => (
    /* Wrap the row and the fail box in one parent div so they stay together */
    <div key={i} className="resident-container"> 
      <div className="fluid-resident-row">
        <div className="input-wrap">
          <label className="fluid-label">Resident #{i + 1}</label>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="fluid-input" 
            value={res.name}
            onChange={(e) => {
               const newRes = [...residents];
               newRes[i].name = e.target.value;
               setResidents(newRes);
            }}
          />
        </div>
        
        <div className="fluid-status-group">
          <div className="status-item">
            <span>Pass</span>
            <div 
              className={res.status === 'Pass' ? 'fluid-dot active-pass' : 'fluid-dot'} 
              onClick={() => updateStatus(i, 'Pass')} 
            />
          </div>
          <div className="status-item">
            <span>Fail</span>
            <div 
              className={res.status === 'Fail' ? 'fluid-dot active-fail' : 'fluid-dot'} 
              onClick={() => updateStatus(i, 'Fail')} 
            />
          </div>
        </div>
      </div>

      {/* APPEARS ONLY ON FAIL */}
      {res.status === "Fail" && (
        <div className="fail-reason-box">
          <label className="fluid-label">Reason for Failure</label>
          <textarea 
            placeholder="e.g. Prohibited items, room cleanliness..." 
            className="fluid-textarea"
            value={res.reason}
            onChange={(e) => updateReason(i, e.target.value)}
          />
        </div>
      )}
    </div>
  ))}
</div>
        </div>
        <div className="fluid-footer">
        <div className="upload-grid">
          
          {/* Room Photo Upload */}
          <div className="upload-box">
            <p><strong>Room & Resident Photo</strong></p>
            {/* Hidden Input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={roomPhotoRef} 
              style={{ display: 'none' }} 
              onChange={(e) => setRoomPhoto(e.target.files[0])}
            />
            {/* Styled Button triggers the hidden input */}
            <button 
              className={`icon-btn ${roomPhoto ? 'uploaded' : ''}`} 
              onClick={() => roomPhotoRef.current.click()}
            >
              {roomPhoto ? "✅" : "📤"}
            </button>
          </div>

          {/* Bathroom Photo Upload */}
          <div className="upload-box">
            <p><strong>Bathroom Photo</strong></p>
            {/* Hidden Input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={bathPhotoRef} 
              style={{ display: 'none' }} 
              onChange={(e) => setBathPhoto(e.target.files[0])}
            />
            <button 
              className={`icon-btn ${bathPhoto ? 'uploaded' : ''}`} 
              onClick={() => bathPhotoRef.current.click()}
            >
              {bathPhoto ? "✅" : "📤"}
            </button>
          </div>

        </div>
        <button className="fluid-submit-btn">Submit Report</button>
      </div>
    </div>
    </div>
  );
}

export default RoomCheckForm;