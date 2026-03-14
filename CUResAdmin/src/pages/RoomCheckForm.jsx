import { useNavigate } from "react-router-dom";
import "./RAForms.css"; 
import { useState, useRef } from "react";
import { db, storage, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function RoomCheckForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [uploading, setUploading] = useState(false);

  const [residents, setResidents] = useState([
    { name: "", status: "", reason: "" },
    { name: "", status: "", reason: "" },
    { name: "", status: "", reason: "" },
  ]);

  const roomPhotoRef = useRef(null);
  const bathPhotoRef = useRef(null);
  const [roomPhoto, setRoomPhoto] = useState(null);
  const [bathPhoto, setBathPhoto] = useState(null);

  // Helper to upload image and return URL - Added explicit error handling per file
  const uploadImage = async (file, path) => {
    if (!file) return "";
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.error("Image upload failed for " + path, err);
      throw new Error("Photo upload failed. Check your Storage bucket.");
    }
  };

  const updateStatus = (index, status) => {
    const newRes = [...residents];
    const currentStatus = newRes[index].status;
    newRes[index].status = (currentStatus === status) ? "" : status;
    if (newRes[index].status !== "Fail") newRes[index].reason = "";
    setResidents(newRes);
  };

  const updateReason = (index, text) => {
    const newRes = [...residents];
    newRes[index].reason = text;
    setResidents(newRes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!building || !floor) return alert("Please select a building and floor.");
    
    setUploading(true);

    try {
      // 1. Upload Photos first
      // We use a timestamp to ensure unique filenames in your storage bucket
      const roomUrl = await uploadImage(roomPhoto, `roomchecks/room_${Date.now()}.jpg`);
      const bathUrl = await uploadImage(bathPhoto, `roomchecks/bath_${Date.now()}.jpg`);

      // 2. Submit to Firestore
      const docRef = await addDoc(collection(db, "roomchecks"), {
        date,
        building,
        floor: Number(floor),
        residents: residents.filter(r => r.name !== ""), 
        roomPhotoUrl: roomUrl,
        bathPhotoUrl: bathUrl,
        submittedBy: auth.currentUser?.email || "Unknown RA",
        createdAt: serverTimestamp(),
      });

      // 3. Success Confirmation
      // If we have a docRef ID, the data is officially in the console
      if (docRef.id) {
        console.log("Document written with ID: ", docRef.id);
        alert("Roomcheck submitted successfully!");
        navigate("/ra-dashboard");
      }

    } catch (error) {
      // This is where your previous popup was triggered
      console.error("Detailed Submission Error:", error);
      alert(`Submission Error: ${error.message}`); 
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card">
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Weekly Roomchecks</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left Column: Logistics */}
            <div className="form-column">
              <label className="fluid-label">Date</label>
              <input 
                type="date" 
                className="fluid-input" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />

              <label className="fluid-label">Building & Floor</label>
              <div className="fluid-row" style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
                <select 
                  className="fluid-input" 
                  style={{ flex: 2 }} 
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
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
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  required
                >
                  <option value="">Floor</option>
                  {[1, 2, 3, 4].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="upload-grid" style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                <div className="upload-box" style={{textAlign: 'center'}}>
                  <p><strong>Room Photo</strong></p>
                  <input type="file" accept="image/*" ref={roomPhotoRef} style={{ display: 'none' }} onChange={(e) => setRoomPhoto(e.target.files[0])} />
                  <button type="button" className={`icon-btn ${roomPhoto ? 'uploaded' : ''}`} onClick={() => roomPhotoRef.current.click()}>
                    {roomPhoto ? "✅" : "📷"}
                  </button>
                </div>
                <div className="upload-box" style={{textAlign: 'center'}}>
                  <p><strong>Bathroom Photo</strong></p>
                  <input type="file" accept="image/*" ref={bathPhotoRef} style={{ display: 'none' }} onChange={(e) => setBathPhoto(e.target.files[0])} />
                  <button type="button" className={`icon-btn ${bathPhoto ? 'uploaded' : ''}`} onClick={() => bathPhotoRef.current.click()}>
                    {bathPhoto ? "✅" : "📷"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Residents */}
            <div className="form-column">
              {residents.map((res, i) => (
                <div key={i} className="resident-container" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <div className="fluid-resident-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="input-wrap" style={{ flex: 1, marginRight: '15px' }}>
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
                        <span style={{fontSize: '10px', fontWeight: 'bold'}}>Pass</span>
                        <div className={res.status === 'Pass' ? 'fluid-dot active-pass' : 'fluid-dot'} onClick={() => updateStatus(i, 'Pass')} />
                      </div>
                      <div className="status-item">
                        <span style={{fontSize: '10px', fontWeight: 'bold'}}>Fail</span>
                        <div className={res.status === 'Fail' ? 'fluid-dot active-fail' : 'fluid-dot'} onClick={() => updateStatus(i, 'Fail')} />
                      </div>
                    </div>
                  </div>
                  {res.status === "Fail" && (
                    <div className="fail-reason-box" style={{ marginTop: '10px' }}>
                      <textarea 
                        placeholder="Reason for failure..." 
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

          <button 
            type="submit" 
            className="fluid-submit-btn" 
            disabled={uploading}
            style={{ width: '100%', marginTop: '20px', backgroundColor: '#ffcc00', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {uploading ? "Uploading Data..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RoomCheckForm;