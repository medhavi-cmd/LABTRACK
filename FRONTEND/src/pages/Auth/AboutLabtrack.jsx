import { motion } from "framer-motion";
import { Users, GraduationCap, Mail, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutLabtrack() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-center py-12"
>
  <img
    src={logo}
    alt="LABTRACK"
    className="h-24 mx-auto mb-5"
  />

  <h1 className="text-4xl font-bold text-white">
    Laboratory Inventory Management System
  </h1>

  <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
    A centralized platform for requesting, approving,
    issuing and managing laboratory components.
  </p>
</motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-cyan-400" />
            <h2 className="text-3xl font-bold">Development Team</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {["Medhavi Singh", "Parikshit", "Neha"].map((member) => (
              <div
                key={member}
                className="bg-[#171f33] rounded-xl border border-[#3c494c] p-6 text-center hover:border-cyan-400 transition"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-cyan-400" size={34} />
                </div>

                <h3 className="text-xl font-semibold">{member}</h3>

                <p className="text-slate-400 mt-2">B.Tech Computer Science</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mentor */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-cyan-400" />
            <h2 className="text-3xl font-bold">Mentor</h2>
          </div>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8">
            <h3 className="text-2xl font-semibold">Dr.Kiran Sharm</h3>

            <p className="text-slate-300 mt-3 leading-7">
              This project has been developed under the guidance of
              <span className="text-cyan-400 font-semibold">
                {" "}
                Dr.Kiran Sharm
              </span>
              , whose mentorship and valuable suggestions helped shape the
              development of LABTRACK.
            </p>
          </div>
        </motion.div>

        {/* About */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">About the Project</h2>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8 space-y-5 leading-8 text-slate-300">
            <p>
              Managing laboratory inventories manually often results in missing
              records, delays, and inefficient communication between students,
              faculty, and lab staff.
            </p>

            <p>
              LABTRACK digitizes the complete workflow by providing a
              centralized platform where students can request components,
              faculty can approve requests, lab staff can issue and receive
              components, and administrators can monitor inventory in real time.
            </p>

            <p>
              The application has been developed using React, Node.js,
              Express.js and PostgreSQL while focusing on simplicity, usability
              and an intuitive user experience.
            </p>
          </div>
        </motion.div>

        {/* Contact */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail className="text-cyan-400" />
            <h2 className="text-3xl font-bold">Contact Us</h2>
          </div>

          <form className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8 space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#0b1326] border border-[#3c494c] rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-[#0b1326] border border-[#3c494c] rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full bg-[#0b1326] border border-[#3c494c] rounded-lg px-4 py-3 outline-none resize-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="bg-cyan-400 text-[#00363e] font-semibold px-8 py-3 rounded-lg hover:bg-cyan-300 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
