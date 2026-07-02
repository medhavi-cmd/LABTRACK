import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  ShieldCheck,
  Boxes,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import ContactForm from "../../components/ui/ContactForm";

export default function AboutLabtrack() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans antialiased selection:bg-[#22d3ee]/30 selection:text-[#22d3ee] relative overflow-x-hidden">
      {/* Visual Ambient Grid Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#859397_1px,transparent_1px),linear-gradient(to_bottom,#859397_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      
      <div className="max-w-6xl mx-auto px-6 pt-6 relative z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#22d3ee] hover:text-[#8aebff] transition group"
        >
          <ArrowLeft
            size={14}
            className="transform group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Login
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 relative z-10">
   
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10 max-w-3xl mx-auto"
        >
          <div className="relative inline-block mb-4">
            <img
              src={logo}
              alt="LABTRACK"
              className="h-20 mx-auto opacity-95 relative z-10 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#dae2fd] mb-4">
            Laboratory Inventory Management System
          </h1>

          <p className="text-[#bbc9cd] text-base leading-relaxed">
            LABTRACK is a web-based inventory management system developed for
            <span className="text-[#dae2fd] font-medium">
              {" "}
              BML Munjal University
            </span>
            . It simplifies laboratory operations by allowing students, faculty
            and lab staff to manage component requests, approvals, issuing,
            returns and inventory from a single platform.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
        >
  
          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6 relative group hover:border-[#22d3ee]/50 transition-all duration-300">
            <Boxes className="text-[#22d3ee] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#dae2fd] mb-2 tracking-tight">
              Inventory Management
            </h3>
            <p className="text-[#bbc9cd] text-sm leading-relaxed">
              Keep track of all laboratory components, available stock, issued
              items and returned components in one place.
            </p>
          </div>

          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6 relative group hover:border-[#22d3ee]/50 transition-all duration-300">
            <ShieldCheck className="text-[#22d3ee] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#dae2fd] mb-2 tracking-tight">
              Approval Workflow
            </h3>
            <p className="text-[#bbc9cd] text-sm leading-relaxed">
              Students can request components, faculty members approve requests,
              and lab staff issue and receive components through a structured
              workflow.
            </p>
          </div>

     
          <div className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6 relative group hover:border-[#22d3ee]/50 transition-all duration-300">
            <Users className="text-[#22d3ee] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#dae2fd] mb-2 tracking-tight">
              Project Team Management
            </h3>
            <p className="text-[#bbc9cd] text-sm leading-relaxed">
              Students can register project teams, manage team members and
              monitor all component requests made by their project.
            </p>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center gap-2.5 mb-1">
                <Cpu size={18} className="text-[#22d3ee]" />
                <h2 className="text-xl font-semibold text-[#dae2fd] tracking-tight">
                  About the Project
                </h2>
              </div>
              <div className="text-sm text-[#bbc9cd] space-y-3.5 leading-relaxed">
                <p>
                  Managing laboratory components manually often leads to missing
                  records, delays and difficulty in tracking issued items.
                </p>

                <p>
                  LABTRACK provides a digital platform where students can
                  request components, faculty members can approve requests and
                  lab staff can issue and receive components while maintaining
                  accurate inventory records.
                </p>

                <p>
                  The application has been developed using React, Node.js,
                  Express.js and PostgreSQL with a focus on simplicity,
                  performance and ease of use.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#171f33] border border-[#3c494c] rounded-xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <GraduationCap className="text-[#22d3ee]" size={20} />
                <h2 className="text-xl font-semibold text-[#dae2fd] tracking-tight">
                  Project Mentor
                </h2>
              </div>
              <p className="text-sm text-[#bbc9cd] leading-relaxed">
                LABTRACK has been developed under the guidance of
                <span className="text-[#22d3ee] font-medium">
                  {" "}
                  Dr. Kiran Sharma
                </span>
                , whose valuable suggestions and continuous support helped in
                planning, designing and developing the project.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5 h-full">
            <ContactForm />
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-4"
        >
          <h2 className="text-2xl font-bold tracking-tight text-[#dae2fd] mb-6 text-center lg:text-left">
            Development Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {["Medhavi Singh", "Parikshit Kumar Jha", "Neha Sharma"].map((member) => (
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.4)" }}
                key={member}
                className="bg-[#171f33] border border-[#3c494c] rounded-xl p-5 text-center transition-all duration-200 shadow-md relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-full bg-[#0b1326] border border-[#3c494c] flex items-center justify-center mx-auto mb-4 group-hover:border-[#22d3ee]/40">
                  <Users className="text-[#22d3ee]/80" size={20} />
                </div>

                <h3 className="text-base font-semibold text-[#dae2fd] tracking-tight">
                  {member}
                </h3>

                <p className="font-mono text-[11px] text-[#bbc9cd]/70 mt-1 uppercase tracking-wider">
                  B.Tech Computer Science Engineering
                </p>
                <p className="font-mono text-[11px] text-[#bbc9cd]/70 mt-1 uppercase tracking-wider">
                  Batch 2024
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
