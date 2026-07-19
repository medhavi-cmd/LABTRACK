import React from "react";
import { motion } from "framer-motion";
import { Mail, Send, User, MessageSquare } from "lucide-react";

const ContactForm = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full text-slate-600 font-sans"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50">
            <Mail className="text-cyan-600" size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            <p className="mt-1 text-sm text-slate-500">
              We'd love to hear your suggestions, feedback or bug reports.
            </p>
          </div>
        </div>
      </div>

      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
    
        <input
          type="hidden"
          name="access_key"
          value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY}
        />

        <input
          type="hidden"
          name="subject"
          value="New Contact Form Submission - LABTRACK"
        />

        <input
          type="hidden"
          name="redirect"
          value="http://localhost:5173/about-labtrack"
        />

        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          style={{ display: "none" }}
        />

        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent" />

        <div className="grid gap-5 md:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition focus:border-cyan-500 shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition focus:border-cyan-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Message
          </label>

          <div className="relative">
            <MessageSquare
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <textarea
              name="message"
              rows={6}
              required
              placeholder="Tell us your feedback, report an issue or ask us anything..."
              className="w-full resize-none rounded-md border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition focus:border-cyan-500 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-medium text-slate-400">
            Responses are usually sent within 24-48 hours.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4cb6] px-8 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1d4ed8] transition active:scale-95"
          >
            <Send size={15} />
            Send Message
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default ContactForm;