'use client';

import { useState } from 'react';
import { CheckCircle2, Phone, Mail, Clock, Send, AlertCircle } from 'lucide-react';
import AdmissionsPromo from '@/components/AdmissionsPromo';
import MotionCard from '@/components/MotionCard';

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    gradeApplyingFor: 'Playgroup',
    phone: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const [activeStep, setActiveStep] = useState(1);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActiveStep(3);
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName,
          parentName: formData.parentName,
          grade: formData.gradeApplyingFor,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit admission inquiry');
      }

      setStatus({ loading: false, success: true, error: '' });
      setFormData({
        parentName: '',
        studentName: '',
        gradeApplyingFor: 'Playgroup',
        phone: '',
        email: '',
        message: '',
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Submission failed. Please contact us directly via phone.',
      });
    }
  };

  return (
    <div className="w-full bg-transparent pt-8 pb-20 md:pt-12 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
            ADMISSIONS 2026 – 2027
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Join The Torcia School Family
          </h1>
          <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-3"></div>
          <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            Admissions are now open for Playgroup through Class V. We invite you to initiate the enrollment inquiry below or visit our Nazimabad campus.
          </p>
        </div>

        {/* 1.5. Admissions Promo Hero Card */}
        <MotionCard index={0}>
          <AdmissionsPromo className="mb-10 sm:mb-12" />
        </MotionCard>

        {/* 2. Main Grid: Steps & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-8 md:mb-10">
            {/* Left Column: Admission Procedure & Criteria */}
            <MotionCard index={0} className="lg:col-span-5 flex flex-col h-full gap-5">
              <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-8 border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 space-y-4 md:space-y-6">
                <h2 className="text-2xl font-bold font-serif text-gray-900 tracking-tight">Admission Process</h2>

                <ol className="space-y-6">
                  {[
                    {
                      step: '1',
                      title: 'Submit Inquiry Form',
                      desc: 'Fill out the online application inquiry or visit the admission desk on campus.',
                    },
                    {
                      step: '2',
                      title: 'Campus Tour & Assessment',
                      desc: 'An informal developmental review for kindergarten or age-appropriate evaluation for primary classes.',
                    },
                    {
                      step: '3',
                      title: 'Parent Discussion',
                      desc: 'An interactive meeting to align educational goals and shared values.',
                    },
                    {
                      step: '4',
                      title: 'Registration & Welcome',
                      desc: 'Submission of relevant documents, fee payment, and student onboarding.',
                    },
                  ].map((item) => (
                    <li key={item.step} className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-[#A01A22] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Quick Contact Card in Premium Theme */}
              <div className="w-full mt-auto bg-white/95 backdrop-blur-xl text-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 border-t-4 border-red-700">
                <h3 className="text-lg font-bold font-serif text-gray-900 tracking-tight mb-1">Admissions Office Details</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal mb-4">
                  You are welcome to visit our admission desk during working hours:
                </p>
                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Clock className="w-4 h-4 text-red-700" />
                    </div>
                    <span className="font-medium">Mon-Sat: 7:45 am - 2:00 pm (Fri: until 1:00 pm)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-4 h-4 text-red-700" />
                    </div>
                    <a href="tel:03422049976" className="hover:text-red-700 transition font-bold text-gray-900">0342-2049976</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="w-4 h-4 text-red-700" />
                    </div>
                    <a href="mailto:thetorciaschool@gmail.com" className="hover:text-red-700 transition text-gray-800">thetorciaschool@gmail.com</a>
                  </div>
                </div>
              </div>
            </MotionCard>

            {/* Right Column: Interactive Admission Inquiry Form */}
            <MotionCard index={1} className="lg:col-span-7">
              <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-8 border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 tracking-tight mb-2">
                  Online Admission Inquiry
                </h2>
                <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                  Please complete this preliminary form and our admissions counselor will reach out to you promptly.
                </p>

                {status.success && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-sm">
                      Thank you! Your admission inquiry has been received. Our team will contact you shortly.
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="text-sm">{status.error}</div>
                  </div>
                )}

                {/* Sticky Progress Bar */}
                <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md py-2.5 sm:py-4 border-b border-gray-100 mb-6 md:mb-8 -mx-4 sm:-mx-5 md:-mx-8 px-4 sm:px-5 md:px-8 overflow-x-auto scrollbar-none">
                  <div className="flex items-center justify-between w-full max-w-xl mx-auto gap-1 sm:gap-3 overflow-x-auto whitespace-nowrap py-1">
                    {/* Step 1: Personal Info */}
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                        activeStep === 1
                          ? 'text-red-700 font-bold'
                          : activeStep > 1
                          ? 'text-red-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        {activeStep >= 1 ? (
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-700 ring-2 sm:ring-4 ring-red-100" />
                        ) : (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
                        )}
                      </span>
                      <span className="text-[11px] sm:text-sm tracking-tight whitespace-nowrap">
                        1. Personal Info
                      </span>
                    </button>

                    {/* Connecting Line 1-2 */}
                    <div
                      className={`flex-1 min-w-3 sm:min-w-6 h-0.5 mx-1.5 sm:mx-4 rounded-full transition-colors duration-300 ${
                        activeStep >= 2 ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    />

                    {/* Step 2: Student Details */}
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                        activeStep === 2
                          ? 'text-red-700 font-bold'
                          : activeStep > 2
                          ? 'text-red-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        {activeStep >= 2 ? (
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-700 ring-2 sm:ring-4 ring-red-100" />
                        ) : (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
                        )}
                      </span>
                      <span className="text-[11px] sm:text-sm tracking-tight whitespace-nowrap">
                        2. Student Details
                      </span>
                    </button>

                    {/* Connecting Line 2-3 */}
                    <div
                      className={`flex-1 min-w-3 sm:min-w-6 h-0.5 mx-1.5 sm:mx-4 rounded-full transition-colors duration-300 ${
                        activeStep >= 3 ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    />

                    {/* Step 3: Submit */}
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                        activeStep === 3
                          ? 'text-red-700 font-bold'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        {activeStep === 3 ? (
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-700 ring-2 sm:ring-4 ring-red-100" />
                        ) : (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
                        )}
                      </span>
                      <span className="text-[11px] sm:text-sm tracking-tight whitespace-nowrap">
                        3. Submit
                      </span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    {/* Row 1: Guardian Name & Phone Number */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        GUARDIAN NAME *
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(1)}
                        placeholder="e.g. Muhammad Farooq"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(1)}
                        placeholder="0300-1234567"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                      />
                    </div>

                    {/* Row 2: Email (Optional) */}
                    <div className="col-span-2">
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        EMAIL (OPTIONAL)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(1)}
                        placeholder="parent@example.com"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                      />
                    </div>

                    {/* Row 3: Student Name & Grade Applying */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        STUDENT NAME *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        required
                        value={formData.studentName}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(2)}
                        placeholder="e.g. Azaan Farooq"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        GRADE APPLYING *
                      </label>
                      <select
                        name="gradeApplyingFor"
                        value={formData.gradeApplyingFor}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(2)}
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm"
                      >
                        <option value="Playgroup">Playgroup</option>
                        <option value="Nursery">Nursery</option>
                        <option value="KG-I">Kindergarten I (KG-I)</option>
                        <option value="KG-II">Kindergarten II (KG-II)</option>
                        <option value="Class I">Class I</option>
                        <option value="Class II">Class II</option>
                        <option value="Class III">Class III</option>
                        <option value="Class IV">Class IV</option>
                        <option value="Class V">Class V</option>
                      </select>
                    </div>

                    {/* Row 4: Additional Notes */}
                    <div className="col-span-2">
                      <label className="block text-[10px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase mb-1">
                        ADDITIONAL NOTES
                      </label>
                      <textarea
                        rows={3}
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveStep(2)}
                        placeholder="Tell us about the student's previous school, special interests, or any queries..."
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all shadow-sm resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Step 3 Section: Submit */}
                  <div className="pt-2 sm:pt-4 px-1 sm:px-0">
                    <button
                      type="submit"
                      disabled={status.loading}
                      onFocus={() => setActiveStep(3)}
                      className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#A01A22] hover:bg-red-800 active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1 text-white font-semibold text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{status.loading ? 'Submitting Inquiry...' : 'Submit Admission Inquiry'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </MotionCard>
          </div>
        </div>
      </div>
  );
}

