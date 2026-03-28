import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./AdminReports.css"; // Consistent styling for all log pages
import PageTransition from "../components/PageTransition";

function CheckoutLogs() {
  const navigate = useNavigate();
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter state for building, checkout type, and pass/fail status (I am trying out these filters to see if they work best or should use others).
  const [filters, setFilters] = useState({
    building: "",
    type: "",
    status: "" 
  });

  // Real-time listener to fetch checkout logs from Firestore, ordered by creation date (newest first).
  useEffect(() => {
    const q = query(collection(db, "checkouts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCheckouts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Apply filters to the checkouts based on selected building, checkout type, and pass/fail status.
  const filteredCheckouts = checkouts.filter(c => {
    const matchesBuilding = filters.building === "" || c.building === filters.building;
    const matchesType = filters.type === "" || c.checkoutType === filters.type;
    const matchesStatus = filters.status === "" || 
      (filters.status === "pass" ? c.allCriteriaMet === true : c.allCriteriaMet === false);

    return matchesBuilding && matchesType && matchesStatus;
  });

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">
          
          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate("/admin")}>Back</button>
            <h1>Dorm Checkout Logs</h1>
          </div>

          {/* Fluid Filter Bar */}
          <div className="fluid-filter-bar">
            <div className="filter-group">
              <label className="fluid-label-sm">Building</label>
              <select className="fluid-input-sm" value={filters.building} onChange={(e) => setFilters({...filters, building: e.target.value})}>
                <option value="">All Buildings</option>
                <option value="Griffith">Griffith</option>
                <option value="Stevens">Stevens</option>
                <option value="Lee">Lee</option>
                <option value="Patterson">Patterson</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="fluid-label-sm">Type</label>
              <select className="fluid-input-sm" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                <option value="">All Types</option>
                <option value="Official">Official</option>
                <option value="Winter">Winter</option>
                <option value="Moving">Moving</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="fluid-label-sm">Status</label>
              <select className="fluid-input-sm" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="">All Statuses</option>
                <option value="pass">PASS</option>
                <option value="fail">FAIL</option>
              </select>
            </div>

            <button className="fluid-reset-btn" onClick={() => setFilters({building: "", type: "", status: ""})}>
              Reset
            </button>
          </div>

          <div className="fluid-table-container">
            {loading ? <p>Loading checkouts...</p> : (
              <table className="fluid-table">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCheckouts.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.residentName}</strong><br/>
                        <small style={{color: '#777'}}>{c.submittedBy?.split('@')[0]}</small>
                      </td>
                      <td>{c.building} {c.roomNumber}</td>
                      <td>{c.checkoutType}</td>
                      <td>
                        <span className={`fluid-badge ${c.allCriteriaMet ? 'pass' : 'fail'}`}>
                          {c.allCriteriaMet ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      {/* Notes Column */}
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          color: '#444' 
                        }} title={c.repairs}>
                          {c.repairs || <span style={{color: '#ccc'}}>No notes</span>}
                        </div>
                      </td>
                      <td>
                        <button 
                          className="fail-btn" 
                          style={{ background: 'rgb(0, 24, 104)', padding: '6px 12px', fontSize: '0.8rem' }} 
                          onClick={() => setSelectedLog(c)}
                        >
                          View Photos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal for Photos */}
          {selectedLog && (
            <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
              <div className="fluid-modal-card" style={{ 
                maxWidth: '800px', 
                width: '95%', 
                maxHeight: '85vh', 
                display: 'flex', 
                flexDirection: 'column' 
              }} onClick={(e) => e.stopPropagation()}>
                
                <div className="fluid-header" style={{ paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{selectedLog.roomNumber} Inspection Photos</h3>
                  <button className="back-link" onClick={() => setSelectedLog(null)}>Close</button>
                </div>

                <div className="modal-body" style={{ overflowY: 'auto', padding: '10px 0' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr', 
                    gap: '15px' 
                  }}>
                    
                    <div style={{ textAlign: 'center' }}>
                      <p className="fluid-label-sm" style={{ marginBottom: '5px' }}>Room</p>
                      {selectedLog.roomPhotoUrl ? (
                        <img 
                          src={selectedLog.roomPhotoUrl} 
                          alt="Room" 
                          style={{ 
                            width: '100%', 
                            height: '250px', 
                            objectFit: 'cover', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd' 
                          }} 
                        />
                      ) : (
                        <div style={{ height: '250px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                          No Room Photo 
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <p className="fluid-label-sm" style={{ marginBottom: '5px' }}>Bathroom</p>
                      {selectedLog.bathPhotoUrl ? (
                        <img 
                          src={selectedLog.bathPhotoUrl} 
                          alt="Bath" 
                          style={{ 
                            width: '100%', 
                            height: '250px', 
                            objectFit: 'cover', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd' 
                          }} 
                        />
                      ) : (
                        <div style={{ height: '250px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                          No Bath Photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default CheckoutLogs;