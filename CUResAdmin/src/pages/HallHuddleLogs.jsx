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

  // Filter state for building, floor, and date range (I am trying out these filters to see if they work best or should use others)
  const [filters, setFilters] = useState({
    building: "",
    floor: "",
    startDate: "",
    endDate: ""
  });

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

  // Apply filters to the huddles based on selected building, floor, and date range
  const filteredHuddles = huddles.filter(h => {
    const matchesBuilding = filters.building === "" || h.building === filters.building;
    const matchesFloor = filters.floor === "" || String(h.floor) === filters.floor;
    const huddleDate = new Date(h.date);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    const matchesStart = !start || huddleDate >= start;
    const matchesEnd = !end || huddleDate <= end;
    return matchesBuilding && matchesFloor && matchesStart && matchesEnd;
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

            <h1 className="fluid-title">Hall Huddle Logs</h1>
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
                <option value="">All</option>
                {[1, 2, 3, 4].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="fluid-label-sm">From</label>
              <input type="date" className="fluid-input-sm" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
            </div>

            <div className="filter-group">
              <label className="fluid-label-sm">To</label>
              <input type="date" className="fluid-input-sm" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
            </div>

            <button className="fluid-reset-btn" onClick={() => setFilters({building: "", floor: "", startDate: "", endDate: ""})}>
              Reset
            </button>
          </div>

          <div className="fluid-table-container">
            {loading ? <p>Loading logs...</p> : (
              <table className="fluid-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Location</th>
                    <th>RA</th>
                    <th>Attendance</th>
                    <th>Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHuddles.map(h => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td><strong>{h.building}</strong> {h.floor}</td>
                      <td>{h.submittedBy?.split('@')[0]}</td>
                      <td>
                        {h.allPresent ? (
                          <span className="fluid-badge pass">Full</span>
                        ) : (
                          <button className="fluid-badge fail" onClick={() => setSelectedHuddle(h)}>Absences</button>
                        )}
                      </td>
                      <td>{h.engagementNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal for viewing absent residents */}
          {selectedHuddle && (
            <div className="modal-overlay" onClick={() => setSelectedHuddle(null)}>
              <div className="fluid-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="fluid-header">
                  <h2>Attendance</h2>
                  <button className="back-link" onClick={() => setSelectedHuddle(null)}>X</button>
                </div>
                <div className="modal-body">
                  <p><strong>Building:</strong> {selectedHuddle.building} {selectedHuddle.floor}</p>
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