

import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Users,
  ClipboardList,
  Package
} from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function StudentDashboardNoTeam() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  return (
    <GroupLeaderLayout>

      <div className="p-8 text-[#dae2fd]">

     

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome Back,
            {" "}
            {user?.full_name || "Student"}
          </h1>

          <p className="text-[#bbc9cd] mt-2">
            Complete your project onboarding
            to begin using LabTrack.
          </p>
        </div>



        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <UserCheck
                className="text-green-400"
                size={24}
              />

              <h2 className="font-semibold text-lg">
                Profile Status
              </h2>

            </div>

            <p className="text-green-400 font-medium">
              Completed
            </p>

          </div>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <Users
                className="text-yellow-400"
                size={24}
              />

              <h2 className="font-semibold text-lg">
                Team Status
              </h2>

            </div>

            <p className="text-yellow-400 font-medium">
              Team Not Registered
            </p>

          </div>

        </div>

    

        <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8 mb-8">

          <h2 className="text-2xl font-semibold mb-3">
            Register Your Project Team
          </h2>

          <p className="text-[#bbc9cd] mb-6">
            One member from every team
            should register the project.
            That member will become
            the Team Leader.
          </p>

          <button
            onClick={() =>
              navigate(
                "/student/team-management/register"
              )
            }
            className="
              bg-[#22d3ee]
              text-[#00363e]
              font-semibold
              px-6
              py-3
              rounded-lg
              hover:bg-[#8aebff]
              transition-all
            "
          >
            Register Team
          </button>

        </div>



        <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8">

          <h2 className="text-xl font-semibold mb-6">
            Project Workflow
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3 text-green-400">
              ✓ Account Created
            </div>

            <div className="flex items-center gap-3 text-green-400">
              ✓ Profile Completed
            </div>

            <div className="flex items-center gap-3 text-yellow-400">
              ○ Team Registration
            </div>


          </div>

        </div>

      </div>

    </GroupLeaderLayout>
  );
}