import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="fluid-dash-page">
        <div className="fluid-dash-card">

          {/* Header */}
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

            <h1 className="fluid-title">About</h1>
          </div>

          {/* Abstract */}
          <div style={{ maxWidth: "700px", textAlign: "left" }}>
            
            <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "20px" }}>
                CUResAdmin is a web-based application developed to support residence life operations for the Carolina University Student Services department. 
                The system addresses inefficiencies in traditional reporting workflows used by Residential Assistants (RAs), where tools such as Google Forms and Google Sheets were previously used to collect and store data for room checks, dorm checkouts, and hall huddle reports. 
                This approach made the weekly review of these reports time-consuming and difficult to manage. 
                To address these challenges, a centralized web application was designed and implemented using a modern full-stack architecture that leverages React for the front-end interface and Firebase services (Authentication, Firestore, and Storage) for backend functionality. 
                CUResAdmin enables RAs to submit residence life reports and provides Administrators with a dashboard for reviewing submissions in an organized table format. Key features for the application include role-based access control, dynamic filtering, real-time data handling, and a responsive design. 
                The system helps reduce manual workload, improve communication between RAs and Administrators, while also enhancing data accessibility for administrative operations. 
                Overall, CUResAdmin demonstrates the successful application of modern web technologies to address a real-world operational challenge in an administrative setting, providing a scalable, user-friendly solution for campus life management.
            </p>

            <p style={{ marginTop: "30px", fontSize: "0.85rem", color: "#888" }}>
                CUResAdmin Version 1.0 || Developed by Nathalie Lezama
            </p>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}

export default AboutPage;