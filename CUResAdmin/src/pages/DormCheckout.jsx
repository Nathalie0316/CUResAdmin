import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./RAForms.css";

function DormCheckout() {
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
    checkoutType: "",
    building: "",
    floor: "", 
    roomNumber: "",
    residentName: "",
    allCriteriaMet: null, 
    roomKey: "",
    closetKey: "",
    repairs: ""
  });

  const roomPhotoRef = useRef(null);
  const bathPhotoRef = useRef(null);
  const [roomPhoto, setRoomPhoto] = useState(null);
  const [bathPhoto, setBathPhoto] = useState(null);

  const uploadImage = async (file, path) => {
    if (!file) return "";
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.building || !formData.floor || formData.allCriteriaMet === null) {
      return alert("Please select Building, Floor, and Pass/Fail status.");
    }

    setUploading(true);
    try {
      const roomUrl = await uploadImage(roomPhoto, `checkouts/room_${Date.now()}.jpg`);
      const bathUrl = await uploadImage(bathPhoto, `checkouts/bath_${Date.now()}.jpg`);

      const docRef = await addDoc(collection(db, "checkouts"), {
        ...formData,
        floor: Number(formData.floor),
        roomPhotoUrl: roomUrl,
        bathPhotoUrl: bathUrl,
        submittedBy: auth.currentUser?.email || "Unknown RA",
        createdAt: serverTimestamp(),
      });

      if (docRef.id) {
        alert("Checkout Submitted Successfully!");
        navigate("/ra-dashboard");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fluid-container">
      <div className="fluid-card">
        <div className="fluid-header">
          <button className="back-link" onClick={() => navigate(-1)}>Back</button>
          <h1>Dorm Checkouts</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-column">
              <label className="fluid-label">Date</label>
              <input 
                type="date" 
                className="fluid-input" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />

              <label className="fluid-label">Type of Checkout</label>
              <div className="fluid-selection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.2rem' }}>
                {["Official", "Winter", "Moving"].map(type => (
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

              {/* DROPDOWN STYLE - CONSISTENT WITH ROOMCHECKS */}
              <label className="fluid-label">Location</label>
              <div className="fluid-row" style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
                <select 
                  className="fluid-input" 
                  style={{ flex: 2 }}
                  value={formData.building}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      building: e.target.value,
                      floor: "" // 🔥 reset floor
                    })
                  }
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
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                required
                disabled={!formData.building} // 🔥 disables until building selected
              >
                <option value="">Floor</option>
                {formData.building &&
                  areaData[formData.building].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))
                }
              </select>
              </div>

              <div className="fluid-row" style={{ gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Room #</label>
                  <input type="text" className="fluid-input" placeholder="GH302" onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} />
                </div>
                <div style={{ flex: 2 }}>
                  <label className="fluid-label">Resident Name</label>
                  <input type="text" className="fluid-input" placeholder="Full Name" onChange={(e) => setFormData({...formData, residentName: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="upload-grid" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="upload-box" style={{ textAlign: 'center' }}>
                  <p><strong>Room Photo</strong></p>
                  <input type="file" accept="image/*" ref={roomPhotoRef} style={{ display: 'none' }} onChange={(e) => setRoomPhoto(e.target.files[0])} />
                  <button type="button" className={`icon-btn ${roomPhoto ? 'uploaded' : ''}`} onClick={() => roomPhotoRef.current.click()}>
                    {roomPhoto ? "✅" : "📷"}
                  </button>
                </div>
                <div className="upload-box" style={{ textAlign: 'center' }}>
                  <p><strong>Bathroom Photo</strong></p>
                  <input type="file" accept="image/*" ref={bathPhotoRef} style={{ display: 'none' }} onChange={(e) => setBathPhoto(e.target.files[0])} />
                  <button type="button" className={`icon-btn ${bathPhoto ? 'uploaded' : ''}`} onClick={() => bathPhotoRef.current.click()}>
                    {bathPhoto ? "✅" : "📷"}
                  </button>
                </div>
              </div>

              <label className="fluid-label">Final Inspection Status</label>
              <div className="fluid-status-group" style={{ marginBottom: '1.5rem' }}>
                <div className="status-item">
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Pass</span>
                  <div
                    className={`fluid-dot ${formData.allCriteriaMet === true ? 'active-pass' : ''}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        allCriteriaMet:
                          formData.allCriteriaMet === true ? null : true
                      })
                    }
                  />
                </div>
                <div className="status-item">
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Fail</span>
                  <div
                    className={`fluid-dot ${formData.allCriteriaMet === false ? 'active-fail' : ''}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        allCriteriaMet:
                          formData.allCriteriaMet === false ? null : false
                      })
                    }
                  />
                </div>
              </div>

              <div className="fluid-row" style={{ gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Room Key #</label>
                  <input type="text" className="fluid-input" placeholder="####" onChange={(e) => setFormData({...formData, roomKey: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Closet Key #</label>
                  <input type="text" className="fluid-input" placeholder="####" onChange={(e) => setFormData({...formData, closetKey: e.target.value})} />
                </div>
              </div>

              <label className="fluid-label">Repairs/Notes:</label>
              <textarea className="fluid-textarea" placeholder="Describe damages..." onChange={(e) => setFormData({...formData, repairs: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="fluid-submit-btn" disabled={uploading} style={{ width: '100%', marginTop: '10px' }}>
            {uploading ? "Processing Checkout..." : "Submit Checkout Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DormCheckout;