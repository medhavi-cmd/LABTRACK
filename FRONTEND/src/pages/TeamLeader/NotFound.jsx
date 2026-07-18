import { Link } from "react-router-dom";
import illustration from "../../assets/404.svg";

export default function NotFound() {
  const user = JSON.parse(localStorage.getItem("user"));

  let redirectPath = "/login";
  let buttonText = "Back to Login";

  if (user) {
    switch (user.role) {
      case "student":
        redirectPath = "/student/student-dashboard";
        buttonText = "Go to Dashboard";
        break;

      case "faculty":
        redirectPath = "/faculty/dashboard";
        buttonText = "Go to Dashboard";
        break;

      case "lab_staff":
        redirectPath = "/lab-staff/dashboard";
        buttonText = "Go to Dashboard";
        break;

      default:
        break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">

        <img
          src={illustration}
          alt="404 Illustration"
          className="w-full max-w-md mx-auto mb-8"
        />

        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
          Oops! Page Not Found
        </h1>

        <p className="mt-4 text-slate-500 leading-relaxed text-lg">
          The page you're looking for doesn't exist,
          may have been moved,
          or the URL is incorrect.
        </p>

        <Link
          to={redirectPath}
          className="inline-flex items-center justify-center mt-8 px-7 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}