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

  // Area Data
  const areaData = {
    Griffith: [1, 2, 3],
    Stevens: [1, 2, 3, 4],
    Lee: [1, 2, 3],
    Patterson: [1, 2, 3, 4]
  };

  // Filter state MODIFIED
  const [filters, setFilters] = useState({
  building: "",
  floor: "",
  type: "",
  startDate: "",
  endDate: "",
  search: ""
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

  // Apply filters to the checkouts.
  const filteredCheckouts = checkouts.filter(c => {
    const matchesBuilding =
      filters.building === "" || c.building === filters.building;

    const matchesFloor =
      filters.floor === "" || String(c.floor) === filters.floor;

    const matchesType =
      filters.type === "" || c.checkoutType === filters.type;

    const checkoutDate = c.date || "";
    const matchesStartDate =
      filters.startDate === "" || checkoutDate >= filters.startDate;

    const matchesEndDate =
      filters.endDate === "" || checkoutDate <= filters.endDate;

    const searchText = filters.search.trim().toLowerCase();
    const residentName = c.residentName?.toLowerCase() || "";
    const roomNumber = c.roomNumber?.toLowerCase() || "";

    const matchesSearch =
      searchText === "" ||
      residentName.includes(searchText) ||
      roomNumber.includes(searchText);

  return (
    matchesBuilding &&
    matchesFloor &&
    matchesType &&
    matchesStartDate &&
    matchesEndDate &&
    matchesSearch
  );
});

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">
          
          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate("/admin")}>
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

            <h1 className="fluid-title">Dorm Checkout Logs</h1>
          </div>

          {/* Fluid Filter Bar */}
          <div className="fluid-filter-bar">

            {/* BUILDING */}
            <div className="filter-group">
              <label className="fluid-label-sm">Building</label>
              <div className="select-wrapper">
                <select
                  className="fluid-input-sm"
                  value={filters.building}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      building: e.target.value,
                      floor: ""
                    })
                  }
                >
                  <option value="">All Buildings</option>
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
            </div>

            {/* FLOOR */}
            <div className="filter-group">
              <label className="fluid-label-sm">Floor</label>
              <div className="select-wrapper">
                <select
                  className="fluid-input-sm"
                  value={filters.floor}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      floor: e.target.value
                    })
                  }
                  disabled={!filters.building}
                >
                  <option value="">All Floors</option>
                  {filters.building &&
                    areaData[filters.building].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                </select>

                <span className="select-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* TYPE */}
            <div className="filter-group">
              <label className="fluid-label-sm">Type</label>
              <div className="select-wrapper">
                <select
                  className="fluid-input-sm"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value
                    })
                  }
                >
                  <option value="">All Types</option>
                  <option value="Official">Official</option>
                  <option value="Winter">Winter</option>
                  <option value="Moving">Moving</option>
                </select>

                <span className="select-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* START DATE */}
            <div className="filter-group">
              <label className="fluid-label-sm">Start Date</label>
              <input
                className="fluid-input-sm"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value
                  })
                }
              />
            </div>

            {/* END DATE */}
            <div className="filter-group">
              <label className="fluid-label-sm">End Date</label>
              <input
                className="fluid-input-sm"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    endDate: e.target.value
                  })
                }
              />
            </div>

            {/* SEARCH */}
            <div className="filter-group search-group">
              <label className="fluid-label-sm">Search</label>
              <input
                className="fluid-input-sm"
                type="text"
                placeholder="Name/Room Number"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value
                  })
                }
              />
            </div>

            {/* RESET */}
            <button
              type="button"
              className="fluid-reset-btn"
              onClick={() =>
                setFilters({
                  building: "",
                  floor: "",
                  type: "",
                  startDate: "",
                  endDate: "",
                  search: ""
                })
              }
            >
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
                      <td>{c.building} {c.floor} {c.roomNumber}</td>
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
                          className="admin-action-btn"
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