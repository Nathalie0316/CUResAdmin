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
  const [selectedReason, setSelectedReason] = useState(null); 

  const areaData = {
    Griffith: [1, 2, 3],
    Stevens: [1, 2, 3, 4],
    Lee: [1, 2, 3],
    Patterson: [1, 2, 3, 4]
  };

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

            <h1 className="fluid-title">Roomcheck Logs</h1>
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

            {/* Start Date */}
            <div className="filter-group">
              <label className="fluid-label-sm">Start Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            {/* End Date */}
            <div className="filter-group">
              <label className="fluid-label-sm">End Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            {/* Search Bar*/}
            <div className="filter-group">
              <label className="fluid-label-sm">Search</label>
              <input
                type="text"
                className="fluid-input-sm"
                placeholder="Name/Room Number"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value.toLowerCase() })}
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
                    <th>Date & RA</th>
                    <th>Location</th>
                    <th>Residents</th>
                    <th>Overall Status</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map(c => {
                    // Check if anyone in the room failed
                    const anyFail = c.residents?.some(r => r.status === "Fail");
                    
                    return (
                      <tr key={c.id}>
                        
                        {/* Date & RA */}
                        <td>
                          <div style={{ fontSize: "0.90rem", color: "rgb(0, 24, 104)" }}> 
                            <strong>
                            {c.date || "No date"}
                            </strong>
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "rgb(119, 119, 119)" }}>
                            {c.submittedBy?.split("@")[0] || "Unknown RA"}
                          </div>
                        </td>

                        {/* Location */}
                        <td>
                          <div style={{ fontSize: "0.85rem", color: "rgb(119, 119, 119)" }}>
                            {c.building} {c.floor}
                          </div>
                          <div>
                            {c.roomNumber}
                          </div>
                        </td>

                        {/* Residents */}
                        <td>
                          <div className="resident-list">
                            {c.residents?.map((r, idx) => (
                              <div
                                key={idx}
                                className={`resident-inline ${r.status === "Fail" ? "fail" : "pass"}`}
                              >
                                <span className="resident-name">{r.name}</span>
                                <span className="resident-separator"> | </span>
                                <span className="resident-status">{r.status}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Overall Status */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className={`fluid-badge ${!anyFail ? 'pass' : 'fail'}`}>
                              {anyFail ? 'ACTION REQ' : 'ALL PASS'}
                            </span>

                            {anyFail && c.residents?.some((r) => r.reason) && (
                              <button
                                type="button"
                                className="admin-failicon-btn"
                                onClick={() => setSelectedReason(c)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  color: "rgb(180, 40, 40)"
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <circle cx="12" cy="16" r="1"></circle>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Photos */}
                        <td>
                          <button 
                            className="admin-action-btn"
                            onClick={() => setSelectedCheck(c)}
                          >
                            View Photos
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Fail Reason Modal */}
          {selectedReason && (
            <div className="modal-overlay" onClick={() => setSelectedReason(null)}>
              <div
                className="fluid-modal-card"
                style={{ maxWidth: "550px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fluid-header modal-header">
                  <button className="back-link" onClick={() => setSelectedReason(null)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"></path>
                    </svg>
                  </button>

                  <h3 className="fluid-title-sm">Failure Reasons</h3>
                </div>

                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedReason.residents
                    ?.filter((r) => r.reason)
                    .map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          border: "1px solid rgb(235, 235, 235)",
                          borderRadius: "10px",
                          background: "rgba(0, 24, 104, 0.03)"
                        }}
                      >
                        <div style={{ fontWeight: "700", color: "rgb(0, 24, 104)", marginBottom: "4px" }}>
                          {r.name}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "rgb(0, 0, 0)" }}>
                          {r.reason}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Modal */}
          {selectedCheck && (
            <div className="modal-overlay" onClick={() => setSelectedCheck(null)}>
              <div
                className="fluid-modal-card"
                style={{
                  maxWidth: "800px",
                  width: "95%",
                  maxHeight: "85vh",
                  display: "flex",
                  flexDirection: "column"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fluid-header modal-header">
                  <button className="back-link" onClick={() => setSelectedCheck(null)}>
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

                  <h3 className="fluid-title-sm">Roomcheck Photos</h3>
                </div>

                <div className="modal-body" style={{ overflowY: "auto", padding: "10px 0" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: window.innerWidth > 600 ? "1fr 1fr" : "1fr",
                      gap: "15px"
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <p className="fluid-label-sm" style={{ marginBottom: "5px" }}>
                        Room
                      </p>
                      {selectedCheck.roomPhotoUrl ? (
                        <img
                          src={selectedCheck.roomPhotoUrl}
                          alt="Room"
                          style={{
                            width: "100%",
                            aspectRatio: "3 / 4",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid rgb(221, 221, 221)"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "3 / 4",
                            background: "rgb(245, 245, 245)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgb(153, 153, 153)"
                          }}
                        >
                          No Room Photo
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <p className="fluid-label-sm" style={{ marginBottom: "5px" }}>
                        Bathroom
                      </p>
                      {selectedCheck.bathPhotoUrl ? (
                        <img
                          src={selectedCheck.bathPhotoUrl}
                          alt="Bath"
                          style={{
                            width: "100%",
                            aspectRatio: "3 / 4",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid rgb(221, 221, 221)"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "3 / 4",
                            background: "rgb(245, 245, 245)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgb(153, 153, 153)"
                          }}
                        >
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

export default RoomCheckLogs;