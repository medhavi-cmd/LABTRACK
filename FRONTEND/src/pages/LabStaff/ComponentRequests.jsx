
import React, { useState } from "react";
import { FiEye, FiCheck, FiInfo, FiX } from "react-icons/fi";
 
const requestsData = [
  {
    id: "REQ-1023",
    component: "Arduino Uno R3",
    quantity: 2,
    date: "May 28, 2026",
    priority: "Normal",
    status: "Pending",
    student: {
      name: "Sarah Johnson",
      enrollmentNo: "EME2024001",
      batch: "2024",
      group: "Group 1",
      email: "sarah@bmu.edu.in",
    },
  },
  {
    id: "REQ-1022",
    component: "Raspberry Pi 4",
    quantity: 1,
    date: "May 28, 2026",
    priority: "High",
    status: "Pending",
    student: {
      name: "Michael Chen",
      enrollmentNo: "EME2024018",
      batch: "2024",
      group: "Group 2",
      email: "michael@bmu.edu.in",
    },
  },
  {
    id: "REQ-1021",
    component: "LED Strip 5m",
    quantity: 3,
    date: "May 27, 2026",
    priority: "Normal",
    status: "Approved",
    student: {
      name: "Emma Davis",
      enrollmentNo: "EME2023033",
      batch: "2023",
      group: "Group 1",
      email: "emma@bmu.edu.in",
    },
  },
  {
    id: "REQ-1020",
    component: "DC Motor 12V",
    quantity: 4,
    date: "May 27, 2026",
    priority: "Normal",
    status: "Rejected",
    student: {
      name: "James Wilson",
      enrollmentNo: "EME2023047",
      batch: "2023",
      group: "Group 3",
      email: "james@bmu.edu.in",
    },
  },
];
 
const statusStyle = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Approved: "bg-green-500/20 text-green-400",
  Rejected: "bg-red-500/20 text-red-400",
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
        className="bg-[#0b1730] border border-cyan-900/30 rounded-xl w-full max-w-md p-6 shadow-xl transition-transform duration-200 scale-100"
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
              className="flex justify-between gap-4 border-b border-cyan-900/20 pb-3 last:border-0 last:pb-0"
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
 
const ComponentRequests = () => {
  const [requests] = useState(requestsData);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const openStudentInfo = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
 
  const closeStudentInfo = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };
 
  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Component Requests</h1>
        <p className="text-slate-400 mt-2">
          Review and approve component requests from students
        </p>
      </div>
 
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Pending Requests</p>
          <h2 className="text-4xl font-bold mt-3">18</h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Approved This Month</p>
          <h2 className="text-4xl font-bold mt-3 text-cyan-400">156</h2>
        </div>
 
        <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl p-6">
          <p className="text-slate-400">Rejected This Month</p>
          <h2 className="text-4xl font-bold mt-3 text-red-400">12</h2>
        </div>
      </div>
 
      <div className="bg-[#0b1730] border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-cyan-900/20">
          <h2 className="text-2xl font-semibold">All Requests</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#081222]">
              <tr>
                <th className="text-left px-6 py-4">Request ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Priority</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
 
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-cyan-900/20 hover:bg-[#081222]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{request.id}</span>
                      <button
                        onClick={() => openStudentInfo(request.student)}
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors"
                        title="View student details"
                      >
                        <FiInfo className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">{request.component}</td>
                  <td className="px-6 py-4">{request.quantity}</td>
                  <td className="px-6 py-4">{request.date}</td>
 
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {request.priority}
                    </span>
                  </td>
 
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyle[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
 
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-cyan-400 hover:text-cyan-300">
                        <FiEye size={18} />
                      </button>
 
                      <button className="text-green-400 hover:text-green-300">
                        <FiCheck size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {isModalOpen && (
        <StudentInfoModal
          student={selectedStudent}
          onClose={closeStudentInfo}
        />
      )}
    </div>
  );
};
 
export default ComponentRequests;