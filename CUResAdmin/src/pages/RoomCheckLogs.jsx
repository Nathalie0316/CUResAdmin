import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./AdminReports.css"; // Consistent styling for all log pages.
import PageTransition from "../components/PageTransition";

function RoomCheckLogs() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState(null);

  // Filter state for building and floor (Finalized filters).
  const [filters, setFilters] = useState({
  building: "",
  floor: "",
  startDate: "",
  endDate: "",
  search: ""
  });

  // Real-time listener to fetch room check logs from Firestore, ordered by creation date (newest first).
  useEffect(() => {
    const q = query(collection(db, "roomchecks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChecks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Apply filters to the checks.
  const filteredChecks = checks.filter(c => {
    const matchesBuilding = 
      filters.building === "" || c.building === filters.building;

    const matchesFloor = 
      filters.floor === "" || String(c.floor) === filters.floor;

    const matchesSearch =
      filters.search === "" ||
        c.roomNumber?.toString().includes(filters.search) ||
        c.residents?.some(r =>
          r.name.toLowerCase().includes(filters.search));

    const checkDate = c.date;
      const matchesStart =
        !filters.startDate || checkDate >= filters.startDate;

      const matchesEnd =
        !filters.endDate || checkDate <= filters.endDate;

    return (
      matchesBuilding && 
      matchesFloor && 
      matchesSearch && 
      matchesStart && 
      matchesEnd
    );
  });

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">
          
          <div className="fluid-header">
            <button className="back-link" onClick={() => navigate("/admin")}>Back</button>
            <h1>Roomcheck Logs</h1>
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
              <label className="fluid-label-sm">Floor</label>
              <select className="fluid-input-sm" value={filters.floor} onChange={(e) => setFilters({...filters, floor: e.target.value})}>
                <option value="">All Floors</option>
                {[1, 2, 3, 4].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Added Search Bar*/}
            <div className="filter-group">
              <label className="fluid-label-sm">Search</label>
              <input
                type="text"
                className="fluid-input-sm"
                placeholder="Resident or Room #"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value.toLowerCase() })}
              />
            </div>

            {/* Added Start Date */}
            <div className="filter-group">
              <label className="fluid-label-sm">Start Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            {/* AddedEnd Date */}
            <div className="filter-group">
              <label className="fluid-label-sm">End Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <button className="fluid-reset-btn" onClick={() => 
              setFilters({
                building: "", 
                floor: "",
                search: "",
                startDate: "",
                endDate: ""
                })}>
                  Reset
            </button>
          </div>

          <div className="fluid-table-container">
            {loading ? <p>Loading checks...</p> : (
              <table className="fluid-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Residents</th>
                    <th>Overall Status</th>
                    <th>RA / Date</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map(c => {
                    // Check if anyone in the room failed
                    const anyFail = c.residents?.some(r => r.status === "Fail");
                    
                    return (
                      <tr key={c.id}>
                        <td>
                          <div><strong>{c.building} {c.floor}</strong></div>
                          <div style={{ fontSize: "0.85rem", color: "rgb(65, 64, 64)" }}>
                            Room Number: {c.roomNumber}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {c.residents?.map((r, idx) => (
                            <div key={idx} style={{ color: r.status === 'Fail' ? '#d32f2f' : '#388e3c' }}>
                              {r.name} ({r.status})
                            </div>
                          ))}
                        </td>
                        <td>
                          <span className={`fluid-badge ${!anyFail ? 'pass' : 'fail'}`}>
                            {anyFail ? 'ACTION REQUIRED' : 'ALL PASS'}
                          </span>
                        </td>
                        <td>
                          <small>{c.submittedBy?.split('@')[0]}</small><br/>
                          <small style={{color: 'rgb(65, 64, 64)'}}>{c.date}</small>
                        </td>
                        <td>
                          <button 
                            className="fail-btn" 
                            style={{ background: 'rgb(0, 24, 104)', padding: '6px 12px' }} 
                            onClick={() => setSelectedCheck(c)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal (This one might still change to include photos only) */}
          {selectedCheck && (
            <div className="modal-overlay" onClick={() => setSelectedCheck(null)}>
              <div className="fluid-modal-card" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
                
                <div className="fluid-header">
                  <h3>{selectedCheck.building} Floor {selectedCheck.floor} Details</h3>
                  <button className="back-link" onClick={() => setSelectedCheck(null)}>Close</button>
                </div>

                <div className="modal-body" style={{ overflowY: 'auto' }}>
                  {/* Resident Status Section */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="fluid-label-sm">Resident Results</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                      {selectedCheck.residents?.map((res, i) => (
                        <div key={i} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #eee', background: res.status === 'Fail' ? '#fff5f5' : '#f5fff5' }}>
                          <strong>{res.name}</strong>
                          <div style={{ color: res.status === 'Fail' ? '#d32f2f' : '#388e3c', fontWeight: 'bold' }}>{res.status}</div>
                          {res.reason && <p style={{ fontSize: '0.8rem', margin: '5px 0 0', fontStyle: 'italic' }}>"{res.reason}"</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr', gap: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fluid-label-sm">Room Photo</p>
                      {selectedCheck.roomPhotoUrl ? (
                        <img src={selectedCheck.roomPhotoUrl} alt="Room" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                      ) : <div style={{ height: '200px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Photo</div>}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p className="fluid-label-sm">Bathroom Photo</p>
                      {selectedCheck.bathPhotoUrl ? (
                        <img src={selectedCheck.bathPhotoUrl} alt="Bath" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                      ) : <div style={{ height: '200px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Photo</div>}
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

export default RoomCheckLogs;