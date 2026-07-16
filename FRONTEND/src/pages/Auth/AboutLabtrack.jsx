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
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased selection:bg-[#2563EB]/20 selection:text-[#2563EB] relative overflow-x-hidden">
      
      <div className="max-w-6xl mx-auto px-6 pt-6 relative z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#2563EB] hover:text-[#1D4ED8] transition group"
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
              className="h-20 mx-auto opacity-95 relative z-10"
            />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#111827] mb-4">
            Laboratory Inventory Management System
          </h1>

          <p className="text-[#6B7280] text-base leading-relaxed">
            LABTRACK is a web-based inventory management system developed for
            <span className="text-[#111827] font-medium">
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
  
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 relative group hover:border-[#2563EB] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <Boxes className="text-[#2563EB] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#111827] mb-2 tracking-tight">
              Inventory Management
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Keep track of all laboratory components, available stock, issued
              items and returned components in one place.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 relative group hover:border-[#2563EB] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <ShieldCheck className="text-[#2563EB] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#111827] mb-2 tracking-tight">
              Approval Workflow
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Students can request components, faculty members approve requests,
              and lab staff issue and receive components through a structured
              workflow.
            </p>
          </div>

     
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 relative group hover:border-[#2563EB] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <Users className="text-[#2563EB] mb-4" size={26} />
            <h3 className="text-lg font-semibold text-[#111827] mb-2 tracking-tight">
              Project Team Management
            </h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">
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
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 sm:p-8 space-y-4 shadow-sm transition-all duration-200 hover:border-[#2563EB] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-1">
                <Cpu size={18} className="text-[#2563EB]" />
                <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
                  About the Project
                </h2>
              </div>
              <div className="text-sm text-[#6B7280] space-y-3.5 leading-relaxed">
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
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-[#2563EB] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <GraduationCap className="text-[#2563EB]" size={20} />
                <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
                  Project Mentor
                </h2>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                LABTRACK has been developed under the guidance of
                <span className="text-[#2563EB] font-medium">
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
          <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-6 text-center lg:text-left">
            Development Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {["Medhavi Singh", "Parikshit Kumar Jha", "Neha Sharma"].map((member) => (
              <motion.div
                whileHover={{ y: -2, borderColor: "#2563EB" }}
                key={member}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 text-center transition-all duration-200 shadow-sm relative overflow-hidden group"
              >
                <div className="w-14 h-14 rounded-full bg-[#EFF6FF] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-4 transition-colors duration-200 group-hover:border-[#2563EB]/40">
                  <Users className="text-[#2563EB]" size={20} />
                </div>

                <h3 className="text-base font-semibold text-[#111827] tracking-tight">
                  {member}
                </h3>

                <p className="font-mono text-[11px] text-[#6B7280] mt-1 uppercase tracking-wider">
                  B.Tech Computer Science Engineering
                </p>
                <p className="font-mono text-[11px] text-[#9CA3AF] mt-1 uppercase tracking-wider">
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