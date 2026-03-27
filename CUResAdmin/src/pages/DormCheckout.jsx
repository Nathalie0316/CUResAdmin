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
    failReason:"",
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

    if (formData.allCriteriaMet === false && !formData.failReason.trim()) {
      return alert("Please enter a reason for failure.");
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
        failReason: formData.allCriteriaMet === false ? formData.failReason : "",
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

          <h1 className="header-title">
            Checkouts
          </h1>
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
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        checkoutType: prev.checkoutType === type ? "" : type
                      }))
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* DROPDOWN STYLE CONSISTENT WITH ROOMCHECKS FORM */}
              <label className="fluid-label">Building & Floor</label>
                <div className="fluid-row" style={{ gap: '10px', marginBottom: '1.2rem' }}>

                  {/* BUILDING */}
                  <div className="select-wrapper" style={{ flex: 2 }}>
                    <select 
                      className="fluid-input"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          building: e.target.value,
                          floor: ""
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
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
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

                    <span className="select-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>

                </div>

              <div className="form-section full-width-section">
                <label className="fluid-label">Room Number</label>
                <input 
                  type="text" 
                  className="fluid-input"
                  placeholder="e.g. GH204"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                />

                <label className="fluid-label">Resident Name</label>
                <input 
                  type="text" 
                  className="fluid-input"
                  placeholder="Full Name"
                  value={formData.residentName}
                  onChange={(e) =>
                    setFormData({ ...formData, residentName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-column">
             <div className="upload-grid section-spacing">
              {/* ROOM PHOTO */}
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
                    {roomPhoto ? "Room Photo Selected" : "Upload Dorm Room Photo"}
                  </p>

                  {roomPhoto && (
                    <>
                      <span className="upload-filename">{roomPhoto.name}</span>

                      <button
                        type="button"
                        className="upload-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoomPhoto(null);
                          roomPhotoRef.current.value = null;
                        }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* BATHROOM PHOTO */}
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
                          e.stopPropagation();
                          setBathPhoto(null);
                          bathPhotoRef.current.value = null;
                        }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

              <div className="status-header-row section-spacing">
                <label className="fluid-label" style={{ marginBottom: 0 }}>
                  Final Inspection Status
                </label>

                <div className="fluid-status-group status-offset">
                  <div className="status-item">
                    <span className="status-label">PASS</span>
                    <div
                      className={`fluid-dot ${formData.allCriteriaMet === true ? 'active-pass' : ''}`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          allCriteriaMet:
                            formData.allCriteriaMet === true ? null : true,
                          failReason: ""
                        })
                      }
                    />
                  </div>

                  <div className="status-item">
                    <span className="status-label">FAIL</span>
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
                {/* SHOW TEXTAREA IF FAIL */}
                  {formData.allCriteriaMet === false && (
                    <div className="fail-reason-box" style={{ marginTop: '10px', marginBottom: '1.5rem' }}>
                      <textarea
                        className="fluid-textarea"
                        placeholder="Reason for failure..."
                        value={formData.failReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            failReason: e.target.value
                          })
                        }
                      />
                    </div>
                  )}
              </div>

              <div className="fluid-row section-spacing" style={{ gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Room Key Number</label>
                  <input type="text" className="fluid-input" placeholder="e.g. GH204 A" onChange={(e) => setFormData({...formData, roomKey: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="fluid-label">Closet Key Number</label>
                  <input type="text" className="fluid-input" placeholder="e.g. GH204 A CL" onChange={(e) => setFormData({...formData, closetKey: e.target.value})} />
                </div>
              </div>

              <div className="section-spacing">
                <label className="fluid-label">Repairs/Notes:</label>
                <textarea 
                  className="fluid-textarea" 
                  placeholder="Describe damages..." 
                  onChange={(e) => setFormData({...formData, repairs: e.target.value})} 
                />
              </div>
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