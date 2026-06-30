import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  ShieldCheck,
  Boxes,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "./"

export default function AboutLabtrack() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-white">

      {/* Back Button */}

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* HERO */}

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="text-center py-14"
        >

          <img
            src={logo}
            alt="LABTRACK"
            className="h-28 mx-auto mb-8"
          />

          <h1 className="text-5xl font-bold mb-6">
            About
            <span className="text-cyan-400"> LABTRACK</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-lg leading-8">
            LABTRACK is a Laboratory Inventory Management System developed
            for BML Munjal University to simplify the complete laboratory
            workflow—from requesting components to issuing, returning,
            inventory management and tracking.
          </p>

        </motion.section>

        {/* FEATURES */}

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-7">
            <Boxes className="text-cyan-400 mb-5" size={34} />

            <h3 className="text-xl font-semibold mb-3">
              Inventory Tracking
            </h3>

            <p className="text-slate-400 leading-7">
              Manage laboratory components digitally with
              accurate stock tracking and request management.
            </p>
          </div>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-7">
            <ShieldCheck className="text-cyan-400 mb-5" size={34} />

            <h3 className="text-xl font-semibold mb-3">
              Approval Workflow
            </h3>

            <p className="text-slate-400 leading-7">
              Faculty approval and lab staff verification
              ensure secure component issue and return.
            </p>
          </div>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-7">
            <Users className="text-cyan-400 mb-5" size={34} />

            <h3 className="text-xl font-semibold mb-3">
              Team Collaboration
            </h3>

            <p className="text-slate-400 leading-7">
              Students can work in project teams while
              maintaining complete transparency of issued
              components and requests.
            </p>
          </div>

        </motion.section>

        {/* TEAM */}

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="mb-20"
        >

          <h2 className="text-3xl font-bold mb-10">
            Development Team
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              "Medhavi Singh",
              "Parikshit",
              "Neha"
            ].map((member) => (

              <motion.div
                whileHover={{ y: -5 }}
                key={member}
                className="bg-[#171f33] border border-[#3c494c] rounded-xl p-8 text-center"
              >

                <div className="w-24 h-24 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">

                  <Users
                    className="text-cyan-400"
                    size={40}
                  />

                </div>

                <h3 className="text-xl font-semibold">
                  {member}
                </h3>

                <p className="text-slate-400 mt-2">
                  B.Tech Computer Science Engineering
                </p>

              </motion.div>

            ))}

          </div>

        </motion.section>

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
