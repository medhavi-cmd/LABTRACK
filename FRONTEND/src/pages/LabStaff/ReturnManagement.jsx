import { useState } from "react";
import { FiInfo, FiEye, FiX, FiSearch } from "react-icons/fi";
 
const initialData = [
  {
    returnId: "RET-001",
    component: "Arduino Uno R3",
    quantity: 2,
    issueDate: "2025-06-01",
    returnDate: "2025-06-08",
    condition: "Good",
    notes: "Returned in original condition.",
    student: {
      name: "Aarav Sharma",
      enrollmentNo: "EME2024001",
      batch: "2024",
      group: "Group 1",
      email: "aarav@bmu.edu.in",
    },
  },
  {
    returnId: "RET-002",
    component: "Ultrasonic Sensor HC-SR04",
    quantity: 1,
    issueDate: "2025-06-03",
    returnDate: "2025-06-10",
    condition: "Fair",
    notes: "Minor scratches on casing.",
    student: {
      name: "Priya Mehta",
      enrollmentNo: "EME2024014",
      batch: "2024",
      group: "Group 2",
      email: "priya@bmu.edu.in",
    },
  },
  {
    returnId: "RET-003",
    component: "16x2 LCD Display",
    quantity: 1,
    issueDate: "2025-05-28",
    returnDate: "2025-06-04",
    condition: "Damaged",
    notes: "One pin bent, display partially unresponsive.",
    student: {
      name: "Rohan Verma",
      enrollmentNo: "EME2023027",
      batch: "2023",
      group: "Group 1",
      email: "rohan@bmu.edu.in",
    },
  },
  {
    returnId: "RET-004",
    component: "Servo Motor SG90",
    quantity: 3,
    issueDate: "2025-06-05",
    returnDate: "2025-06-12",
    condition: "Good",
    notes: "All units working correctly.",
    student: {
      name: "Sneha Kapoor",
      enrollmentNo: "EME2024039",
      batch: "2024",
      group: "Group 3",
      email: "sneha@bmu.edu.in",
    },
  },
  {
    returnId: "RET-005",
    component: "Raspberry Pi 4 Model B",
    quantity: 1,
    issueDate: "2025-05-30",
    returnDate: "2025-06-09",
    condition: "Fair",
    notes: "SD card slot slightly worn.",
    student: {
      name: "Karan Singh",
      enrollmentNo: "EME2023052",
      batch: "2023",
      group: "Group 2",
      email: "karan@bmu.edu.in",
    },
  },
  {
    returnId: "RET-006",
    component: "DHT11 Temperature Sensor",
    quantity: 2,
    issueDate: "2025-06-04",
    returnDate: "2025-06-11",
    condition: "Damaged",
    notes: "One sensor not functioning after use.",
    student: {
      name: "Anjali Rao",
      enrollmentNo: "EME2024061",
      batch: "2024",
      group: "Group 1",
      email: "anjali@bmu.edu.in",
    },
  },
];
 
const getConditionStyle = (condition) => {
  if (condition === "Good") {
    return "bg-green-500/10 text-green-400 border border-green-500/30";
  }
  if (condition === "Fair") {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
  }
  return "bg-red-500/10 text-red-400 border border-red-500/30";
};
 
const calculateDuration = (issueDate, returnDate) => {
  const issued = new Date(issueDate);
  const returned = new Date(returnDate);
  const diffTime = returned - issued;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
 
const Modal = ({ children, onClose, maxWidth = "max-w-md" }) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200"
    onClick={onClose}
  >
    <div
      className={`bg-[#0f172a] border border-slate-800 rounded-xl w-full ${maxWidth} p-6 shadow-xl transition-transform duration-200 scale-100 max-h-[90vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
 
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
    <Modal onClose={onClose}>
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
    </Modal>
  );
};
 
const ReturnDetailsModal = ({ returnItem, onClose }) => {
  if (!returnItem) return null;
 
  const duration = calculateDuration(returnItem.issueDate, returnItem.returnDate);
 
  const fields = [
    { label: "Return ID", value: returnItem.returnId },
    { label: "Component Name", value: returnItem.component },
    { label: "Quantity", value: returnItem.quantity },
    { label: "Issue Date", value: returnItem.issueDate },
    { label: "Return Date", value: returnItem.returnDate },
  ];
 
  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">Return Details</h3>
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
            className="flex justify-between gap-4 border-b border-slate-800 pb-3"
          >
            <span className="text-slate-400">{field.label}</span>
            <span className="text-right font-medium">{field.value}</span>
          </div>
        ))}
 
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
          <span className="text-slate-400">Condition</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(
              returnItem.condition
            )}`}
          >
            {returnItem.condition}
          </span>
        </div>
 
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
          <span className="text-slate-400">Return Duration</span>
          <span className="font-medium">{duration} Days</span>
        </div>
 
        <div className="pt-1">
          <span className="text-slate-400 block mb-1">Full Notes</span>
          <p className="text-slate-200 leading-relaxed">{returnItem.notes}</p>
        </div>
      </div>
 
      <button
        onClick={onClose}
        className="mt-6 w-full bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};
 
const ReturnManagement = () => {
  const [returns] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
 
  const totalReturns = returns.length;
  const goodCondition = returns.filter((r) => r.condition === "Good").length;
  const fairCondition = returns.filter((r) => r.condition === "Fair").length;
  const damagedReturns = returns.filter((r) => r.condition === "Damaged").length;
 
  const goodPercent = Math.round((goodCondition / totalReturns) * 100);
  const fairPercent = Math.round((fairCondition / totalReturns) * 100);
  const damagedPercent = Math.round((damagedReturns / totalReturns) * 100);
 
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };
 
  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
  };
 
  const openDetailsModal = (returnItem) => {
    setSelectedReturn(returnItem);
    setIsDetailsModalOpen(true);
  };
 
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedReturn(null);
  };
 
  const filteredReturns = returns.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.returnId.toLowerCase().includes(term) ||
      item.component.toLowerCase().includes(term) ||
      item.student.enrollmentNo.toLowerCase().includes(term)
    );
  });
 
  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Return Management</h1>
        <p className="text-slate-400 mt-1">
          Track component returns and condition assessments
        </p>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Returns This Week</p>
          <h2 className="text-3xl font-bold mt-2">{totalReturns}</h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Good Condition</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {goodCondition}
          </h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Fair Condition</p>
          <h2 className="text-3xl font-bold text-amber-400 mt-2">
            {fairCondition}
          </h2>
        </div>
 
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Damaged Returns</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {damagedReturns}
          </h2>
        </div>
      </div>
 
      {/* Return Condition Summary */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Return Condition Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Good Returns</span>
              <span className="text-slate-400">{goodPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${goodPercent}%` }}
              ></div>
            </div>
          </div>
 
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Fair Returns</span>
              <span className="text-slate-400">{fairPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${fairPercent}%` }}
              ></div>
            </div>
          </div>
 
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span>Damaged Returns</span>
              <span className="text-slate-400">{damagedPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${damagedPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Return ID, Component, or Enrollment No..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500"
        />
      </div>
 
      {/* Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Return History</h2>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111827]">
              <tr>
                <th className="text-left px-6 py-4">Return ID</th>
                <th className="text-left px-6 py-4">Component</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Issue Date</th>
                <th className="text-left px-6 py-4">Return Date</th>
                <th className="text-left px-6 py-4">Condition</th>
                <th className="text-left px-6 py-4">Details</th>
              </tr>
            </thead>
 
            <tbody>
              {filteredReturns.map((item) => (
                <tr
                  key={item.returnId}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{item.returnId}</span>
                      <button
                        onClick={() => openStudentModal(item.student)}
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors"
                        title="View student details"
                      >
                        <FiInfo className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.component}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-300">{item.issueDate}</td>
                  <td className="px-6 py-4 text-slate-300">{item.returnDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(
                        item.condition
                      )}`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDetailsModal(item)}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
                      title="View return details"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
 
              {filteredReturns.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No return records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Modals */}
      {isStudentModalOpen && (
        <StudentInfoModal
          student={selectedStudent}
          onClose={closeStudentModal}
        />
      )}
 
      {isDetailsModalOpen && (
        <ReturnDetailsModal
          returnItem={selectedReturn}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};
 
export default ReturnManagement;
 
