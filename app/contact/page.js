'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import MotionCard from '@/components/MotionCard';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Submission error. Please call us directly.',
      });
    }
  };

  return (
    <div className="w-full bg-transparent pt-8 pb-20 md:pt-12 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
            WE ARE HERE TO HELP
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Get in Touch
          </h1>
          <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-3"></div>
          <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            Have questions about our academic curriculum, admission guidelines, or fee structure? Reach out to our campus office.
          </p>
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-16 md:mb-12">
            {/* Left Column: Campus Information */}
            <div className="lg:col-span-5">
              <MotionCard index={0} className="space-y-6">
                <div className="w-full relative rounded-2xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 aspect-video bg-white border-t-4 border-red-700">
                  <Image
                    src="/images/3.jpeg"
                    alt="The Torcia School Nazimabad Campus"
                    fill
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5 text-white">
                    <div>
                      <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">Nazimabad Campus</span>
                      <span className="text-sm font-semibold">Plot # 20/13 Block 5C, Karachi</span>
                    </div>
                  </div>
                </div>

                {/* Campus Information Card */}
                <div className="w-full bg-white/95 backdrop-blur-xl text-gray-900 rounded-2xl p-4 sm:p-5 md:p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 border-t-4 border-red-700 space-y-5 sm:space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-900 tracking-tight mb-2">Campus Information</h2>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      Feel free to visit us or contact our reception during campus operational hours.
                    </p>
                  </div>

                <div className="space-y-6 text-sm text-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 shrink-0">
                      <MapPin className="w-5 h-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Campus Address</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Plot # 20/13 Block 5C near Abbasi Shaheed Hospital, Nazimabad Karachi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 shrink-0">
                      <Phone className="w-5 h-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Telephone / Mobile</h3>
                      <a href="tel:03422049976" className="text-xs text-red-700 font-bold mt-1 block hover:underline">
                        0342-2049976
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 shrink-0">
                      <Mail className="w-5 h-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Email Address</h3>
                      <a href="mailto:thetorciaschool@gmail.com" className="text-xs text-gray-600 mt-1 block hover:underline hover:text-red-700">
                        thetorciaschool@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 shrink-0">
                      <Clock className="w-5 h-5 text-red-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Office Timings</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Mon – Sat: 7:45 am – 2:00 pm<br />
                        Friday: 7:45 am – 1:00 pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </div>

            {/* Right Column: Contact Message Form */}
            <div className="lg:col-span-7">
              <MotionCard index={1}>
                <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-8 border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 tracking-tight mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    Leave your inquiry below and our administrative office will get back to you promptly.
                  </p>

                  {status.success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="text-sm">
                        Your message has been sent successfully! We will contact you soon.
                      </div>
                    </div>
                  )}

                  {status.error && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div className="text-sm">{status.error}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                      {/* Row 1 (2 columns): Your Name & Phone */}
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                          YOUR NAME *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Syed Farhan"
                          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                          PHONE *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0342-xxxxxxx"
                          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                        />
                      </div>

                      {/* Row 2 (Full width): Email */}
                      <div className="col-span-2">
                        <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                          EMAIL *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                        />
                      </div>

                      {/* Row 3 (Full width): Message */}
                      <div className="col-span-2">
                        <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                          MESSAGE *
                        </label>
                        <textarea
                          rows={4}
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your question or request here..."
                          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-4">
                      <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#A01A22] hover:bg-red-800 text-white font-semibold text-sm shadow-xl active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{status.loading ? 'Sending Message...' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </MotionCard>
            </div>
          </div>
        </div>
      </div>
  );
}

