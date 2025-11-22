import { useParams } from "react-router-dom";
import FreelancerFullDetail from "../Firebasejobs/FreelancerFullDetail";

export default function FreelancerPage() {
  const { uid } = useParams();  
  const { jobid } = useParams();

  return (
    <div className="min-h-screen">
      <FreelancerFullDetail
        userId={uid}
        jobid={jobid}
        linkedinUrl=""
      />
    </div>
  );
}
