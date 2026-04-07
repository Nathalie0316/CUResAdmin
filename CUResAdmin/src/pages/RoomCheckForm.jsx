import { useNavigate } from "react-router-dom";
import "./RAForms.css"; 
import { useState, useRef } from "react";
import { db, storage, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PageTransition from "../components/PageTransition";

function RoomCheckForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [uploading, setUploading] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");

  const areaData = {
    Griffith: [1, 2, 3],
    Stevens: [1, 2, 3, 4],
    Lee: [1, 2, 3],
    Patterson: [1, 2, 3, 4]
  };

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
    if (!roomPhoto || !bathPhoto) return alert("Please upload both room and bathroom photos.");
    if (!roomNumber) return alert("Please enter the room number.");
    if (residents.some(r => r.name && !r.status)) return alert("Please set Pass/Fail status for all entered residents.");
    
    setUploading(true);

    try {
      // 1. Upload Photos first
      // Use a timestamp to ensure unique filenames in storage bucket
      const roomUrl = await uploadImage(roomPhoto, `roomchecks/room_${Date.now()}.jpg`);
      const bathUrl = await uploadImage(bathPhoto, `roomchecks/bath_${Date.now()}.jpg`);

      // 2. Submit to Firestore
      const docRef = await addDoc(collection(db, "roomchecks"), {
        date,
        building,
        floor: Number(floor),
        roomNumber,
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
      // This is where the previous popup was triggered
      console.error("Detailed Submission Error:", error);
      alert(`Submission Error: ${error.message}`); 
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
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

            <h1 className="fluid-title">
              Roomchecks
            </h1>

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

                  <div className="fluid-row" style={{ gap: '10px', marginBottom: '1.2rem' }}>

                    {/* BUILDING */}
                    <div className="select-wrapper" style={{ flex: 2 }}>
                      <select 
                        className="fluid-input"
                        value={building}
                        onChange={(e) => { setBuilding(e.target.value); setFloor(""); }}
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
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        required
                        disabled={!building}
                      >
                        <option value="">Floor</option>
                        {building &&
                          areaData[building].map(f => (
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

                {/* Added Room Number Input */}
                <label className="fluid-label">Room Number</label>
                <input
                  type="text"
                  className="fluid-input"
                  placeholder="e.g. GH204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
                {/* Photo Uploads */}
                <div className="upload-grid" style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                  {/* Room Photo Upload */}
                  <div className="upload-box" onClick={() => !roomPhoto && roomPhotoRef.current.click()}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={roomPhotoRef} 
                      style={{ display: 'none' }} 
                      onChange={(e) => setRoomPhoto(e.target.files[0])} 
                    />

                    <div className="upload-content">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 16V4"></path>
                        <path d="M8 8l4-4 4 4"></path>
                        <rect x="4" y="16" width="16" height="4" rx="2"></rect>
                      </svg>

                      <p className="upload-title">
                        {roomPhoto ? "Dorm Room Photo Selected" : "Upload Dorm Room Photo"}
                      </p>

                      {roomPhoto && (
                        <>
                          <span className="upload-filename">{roomPhoto.name}</span>

                          <button
                            type="button"
                            className="upload-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();                // Prevents triggering upload click
                              setRoomPhoto(null);                 // Clear state
                              roomPhotoRef.current.value = null;  // Clear actual file input
                            }}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Bathroom Photo Upload */}
                <div className="upload-box" onClick={() => !bathPhoto && bathPhotoRef.current.click()}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={bathPhotoRef} 
                    style={{ display: 'none' }} 
                    onChange={(e) => setBathPhoto(e.target.files[0])} 
                  />

                  <div className="upload-content">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 16V4"></path>
                      <path d="M8 8l4-4 4 4"></path>
                      <rect x="4" y="16" width="16" height="4" rx="2"></rect>
                    </svg>

                    <p className="upload-title">
                      {bathPhoto ? "Bathroom Photo Selected" : "Upload Bathroom Photo"}
                    </p>

                    {bathPhoto && (
                      <>
                        <span className="upload-filename">{bathPhoto.name}</span>

                        <button
                          type="button"
                          className="upload-remove-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // prevents triggering upload click
                            setBathPhoto(null);
                            bathPhotoRef.current.value = null; // reset input
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

              {/* Right Column: Residents */}
              <div className="form-column">
                {residents.map((res, i) => (
                  <div key={i} className="resident-container" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgb(238, 238, 238)', paddingBottom: '1rem' }}>
                    <div className="fluid-resident-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="input-wrap" style={{ flex: 1, marginRight: '15px' }}>
                        <label className="fluid-label">Resident {i + 1}</label>
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
                          <span className="status-label">Pass</span>
                          <div className={res.status === 'Pass' ? 'fluid-dot active-pass' : 'fluid-dot'} onClick={() => updateStatus(i, 'Pass')} />
                        </div>
                        <div className="status-item">
                          <span className="status-label">Fail</span>
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
              style={{ marginTop: '20px' }}
            >
              {uploading ? "Uploading Data..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

export default RoomCheckForm;