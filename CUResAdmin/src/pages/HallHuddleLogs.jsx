import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./AdminReports.css"; // Styling all log pages consistently
import PageTransition from "../components/PageTransition";

function HallHuddleLogs() {
  const navigate = useNavigate();
  const [huddles, setHuddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHuddle, setSelectedHuddle] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter state for building, floor, and date range (I am trying out these filters to see if they work best or should use others)
  const [filters, setFilters] = useState({
    building: "",
    floor: "",
    startDate: "",
    endDate: "",
    search: ""
  });

  const areaData = {
  Griffith: [1, 2, 3],
  Stevens: [1, 2, 3, 4],
  Lee: [1, 2, 3],
  Patterson: [1, 2, 3, 4]
};

  // Real-time listener to fetch hall huddle logs from Firestore, ordered by date (newest first)
  useEffect(() => {
    const q = query(collection(db, "hallhuddles"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHuddles(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setVisibleCount(5);
  }, [filters]);

  // Apply filters to the huddles based on selected building, floor, and date range
  const filteredHuddles = huddles.filter(h => {
    const matchesBuilding =
      filters.building === "" || h.building === filters.building;

    const matchesFloor =
      filters.floor === "" || String(h.floor) === filters.floor;

    const huddleDate = h.date || "";
    const matchesStart =
      filters.startDate === "" || huddleDate >= filters.startDate;

    const matchesEnd =
      filters.endDate === "" || huddleDate <= filters.endDate;

    const searchText = filters.search.trim().toLowerCase();
    const submittedBy = h.submittedBy?.toLowerCase() || "";
    const building = h.building?.toLowerCase() || "";
    const floor = String(h.floor || "");
    const engagementNotes = h.engagementNotes?.toLowerCase() || "";
    const engagementResponses = h.responses?.toLowerCase() || "";
    const absentList = h.absentList?.toLowerCase() || "";

    const matchesSearch =
      searchText === "" ||
      submittedBy.includes(searchText) ||
      building.includes(searchText) ||
      floor.includes(searchText) ||
      engagementNotes.includes(searchText) ||
      engagementResponses.includes(searchText) ||
      absentList.includes(searchText);

    return (
      matchesBuilding &&
      matchesFloor &&
      matchesStart &&
      matchesEnd &&
      matchesSearch
    );
  });

  const visibleHuddles = filteredHuddles.slice(0, visibleCount);

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

            <h1 className="fluid-title">Hall Huddle Logs</h1>
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

            {/* START DATE */}
            <div className="filter-group">
              <label className="fluid-label-sm">Start Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            {/* END DATE */}
            <div className="filter-group">
              <label className="fluid-label-sm">End Date</label>
              <input
                type="date"
                className="fluid-input-sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            {/* SEARCH */}
            <div className="filter-group">
              <label className="fluid-label-sm">Search</label>
              <input
                type="text"
                className="fluid-input-sm"
                placeholder="RA, floor, notes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value.toLowerCase() })}
              />
            </div>

            <button
              type="button"
              className="fluid-reset-btn"
              onClick={() =>
                setFilters({
                  building: "",
                  floor: "",
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
            {loading ? <p>Loading logs...</p> : (
              <table className="fluid-table">
                <thead>
                  <tr>
                    <th>Date & RA</th>
                    <th>Location</th>
                    <th>Attendance</th>
                    <th>Engagement Notes</th>
                    <th>Responses to Engagement</th>
                  </tr>
                </thead>
                <tbody>

                  {visibleHuddles.map(h => (
                    <tr key={h.id}>
                      {/* DATE & RA */}
                      <td>
                        <div style={{ fontSize: "0.90rem", color: "rgb(0, 24, 104)" }}>
                          <strong>{h.date || "No date"}</strong>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "rgb(119, 119, 119)" }}>
                          {h.submittedBy?.split("@")[0] || "Unknown RA"}
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td>
                          <div style={{ fontSize: "0.90rem", color: "rgb(0, 24, 104)" }}>
                            <strong>
                            {h.building} {h.floor}
                            </strong>
                          </div>
                        </td>

                      {/* ATTENDANCE */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

                          {/* Badge */}
                          <span className={`fluid-badge ${h.allPresent ? 'pass' : 'fail'}`}>
                            {h.allPresent ? 'FULL' : 'ABSENCES'}
                          </span>

                          {/* Icon */}
                          {!h.allPresent && h.absentList && (
                            <button
                              type="button"
                              onClick={() => setSelectedHuddle(h)}
                              className="admin-failicon-btn"
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

                      {/* ENGAGEMENT NOTES */}
                      <td style={{ maxWidth: "220px" }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "rgb(0, 0, 0)"
                          }}
                          title={h.engagementNotes}
                        >
                          {h.engagementNotes || <span style={{ color: "rgb(204, 204, 204)" }}>No notes</span>}
                        </div>
                      </td>

                      {/* RESPONSES TO ENGAGEMENT */}
                      <td style={{ maxWidth: "240px" }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "rgb(0, 0, 0)"
                          }}
                          title={h.responses}
                        >
                          {h.responses || <span style={{ color: "rgb(204, 204, 204)" }}>No responses</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              gap: "12px"
            }}
          >
            {filteredHuddles.length > visibleCount && (
              <button
                type="button"
                className="admin-action-btn"
                onClick={() => setVisibleCount(prev => prev + 10)}
              >
                Show More
              </button>
            )}

            {visibleCount > 5 && (
              <button
                type="button"
                className="admin-action-btn"
                onClick={() => {
                  setVisibleCount(5);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Show Less
              </button>
            )}
          </div>

          <p style={{ margin: "12px 0", color: "rgb(102, 102, 102)", fontSize: "0.9rem" }}>
            Showing {Math.min(visibleCount, filteredHuddles.length)} of {filteredHuddles.length} hall huddle logs
          </p>

          {/* Modal for viewing absent residents */}
          {selectedHuddle && (
            <div className="modal-overlay" onClick={() => setSelectedHuddle(null)}>
              <div className="fluid-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="fluid-header modal-header">
                  <button className="back-link" onClick={() => setSelectedHuddle(null)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"></path>
                    </svg>
                  </button>

                  <h3 className="fluid-title-sm">Attendance</h3>
                </div>

                <div className="modal-body">
                  <div className="fluid-absent-box">
                    <label className="fluid-label-sm">Absent Residents:</label>
                    <p style={{marginTop: '10px'}}>{selectedHuddle.absentList || "None listed."}</p>
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

export default HallHuddleLogs;