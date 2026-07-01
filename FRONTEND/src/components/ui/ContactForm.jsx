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
      className="w-full"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
            <Mail className="text-cyan-400" size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>

            <p className="mt-1 text-sm text-slate-400">
              We'd love to hear your suggestions, feedback or bug reports.
            </p>
          </div>
        </div>
      </div>

      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="relative overflow-hidden rounded-2xl border border-[#3c494c] bg-[#171f33] p-8 shadow-xl"
      >
    
        <input
          type="hidden"
          name="access_key"
          value= {import.meta.env.VITE_WEB3FORMS_ACCESS_KEY}
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

        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full rounded-xl border border-[#3c494c] bg-[#0b1326] py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />
            </div>
          </div>

      

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-xl border border-[#3c494c] bg-[#0b1326] py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />
            </div>
          </div>
        </div>


        <div className="mt-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Message
          </label>

          <div className="relative">
            <MessageSquare
              size={18}
              className="absolute left-4 top-5 text-slate-500"
            />

            <textarea
              name="message"
              rows={6}
              required
              placeholder="Tell us your feedback, report an issue or ask us anything..."
              className="w-full resize-none rounded-xl border border-[#3c494c] bg-[#0b1326] py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>
        </div>


        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Responses are usually sent within 24-48 hours.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-8 py-3 font-semibold text-[#00363e] transition hover:scale-[1.02] hover:bg-cyan-300 active:scale-100"
          >
            <Send size={18} />
            Send Message
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default ContactForm;