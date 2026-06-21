import { useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";
 
const initialData = [
  {
    issueId: "ISS-001",
    component: "Arduino Uno R3",
    quantity: 2,
    issueDate: "2025-06-01",
    returnDeadline: "2025-06-08",
    status: "Overdue",
    student: {
      name: "Aarav Sharma",
      enrollmentNo: "EME2024001",
      batch: "2024",
      group: "Group 1",
      email: "aarav@bmu.edu.in",
    },
  },
  {
    issueId: "ISS-002",
    component: "Ultrasonic Sensor HC-SR04",
    quantity: 1,
    issueDate: "2025-06-03",
    returnDeadline: "2025-06-17",
    status: "Active",
    student: {
      name: "Priya Mehta",
      enrollmentNo: "EME2024014",
      batch: "2024",
      group: "Group 2",
      email: "priya@bmu.edu.in",
    },
  },
  {
    issueId: "ISS-003",
    component: "16x2 LCD Display",
    quantity: 1,
    issueDate: "2025-05-28",
    returnDeadline: "2025-06-04",
    status: "Returned",
    student: {
      name: "Rohan Verma",
      enrollmentNo: "EME2023027",
      batch: "2023",
      group: "Group 1",
      email: "rohan@bmu.edu.in",
    },
  },
  {
    issueId: "ISS-004",
    component: "Servo Motor SG90",
    quantity: 3,
    issueDate: "2025-06-05",
    returnDeadline: "2025-06-19",
    status: "Active",
    student: {
      name: "Sneha Kapoor",
      enrollmentNo: "EME2024039",
      batch: "2024",
      group: "Group 3",
      email: "sneha@bmu.edu.in",
    },
  },
  {
    issueId: "ISS-005",
    component: "Raspberry Pi 4 Model B",
    quantity: 1,
    issueDate: "2025-05-30",
    returnDeadline: "2025-06-06",
    status: "Overdue",
    student: {
      name: "Karan Singh",
      enrollmentNo: "EME2023052",
      batch: "2023",
      group: "Group 2",
      email: "karan@bmu.edu.in",
    },
  },
  {
    issueId: "ISS-006",
    component: "DHT11 Temperature Sensor",
    quantity: 2,
    issueDate: "2025-06-04",
    returnDeadline: "2025-06-18",
    status: "Active",
    student: {
      name: "Anjali Rao",
      enrollmentNo: "EME2024061",
      batch: "2024",
      group: "Group 1",
      email: "anjali@bmu.edu.in",
    },
  },
];
 
const getStatusStyle = (status) => {
  if (status === "Active") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
  }
  if (status === "Overdue") {
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  }
  return "bg-green-500/10 text-green-400 border border-green-500/30";
};
 
const StudentInfoModal = ({ student, onClose }) => {
  if (!student) return null;
 
  const fields = [
    { label: "Student Name", value: student.name },
    { label: "Enrollment Number", value: student.enrollmentNo },
    { label: "Batch", value: student.batch },
    { label: "Group", value: student.group },
    { label: "Email", value: student.email },
  ];
 
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold">Student Information</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
 
        <div className="space-y-3 text-sm">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-slate-400">{field.label}</span>
              <span className="text-right font-medium">{field.value}</span>
            </div>
          ))}
        </div>
 
        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
 
const IssuedComponents = () => {
  const [issues, setIssues] = useState(initialData);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const markReturned = (issueId) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.issueId === issueId ? { ...item, status: "Returned" } : item
      )
    );
  };
 
  const openStudentInfo = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
 
  const closeStudentInfo = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };
 
  const totalIssued = issues.length;
  const activeIssues = issues.filter((i) => i.status === "Active").length;
  const overdueReturns = issues.filter((i) => i.status === "Overdue").length;
 
  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issued Components</h1>
        <p className="text-slate-400 mt-1">
          Track components currently issued to students
        </p>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Issued</p>
          <h2 className="text-3xl font-bold mt-2">{totalIssued}</h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Active Issues</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {activeIssues}
          </h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Overdue Returns</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {overdueReturns}
          </h2>
        </div>
      </div>
 
      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Issued Components List</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Issue ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Issue Date</th>
                <th className="text-left px-6 py-4">Return Deadline</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
 
            <tbody>
              {issues.map((item) => (
                <tr
                  key={item.issueId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-300">{item.issueId}</span>
                      <button
                        onClick={() => openStudentInfo(item.student)}
                        className="self-end mt-1 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors"
                        title="View student details"
                      >
                        <FiInfo className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.component}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-300">{item.issueDate}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.returnDeadline}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => markReturned(item.issueId)}
                      disabled={item.status === "Returned"}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        item.status === "Returned"
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white"
                      }`}
                    >
                      {item.status === "Returned" ? "Returned" : "Mark Returned"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Student Info Modal */}
      {isModalOpen && (
        <StudentInfoModal
          student={selectedStudent}
          onClose={closeStudentInfo}
        />
      )}
    </div>
  );
};
 
export default IssuedComponents;