/**
 * Knowledge Base & System Prompt Configuration for The Torcia School AI Chatbot
 * Slogan: "Growing Future Leaders"
 */

export const KNOWLEDGE_BASE = {
  schoolName: "The Torcia School",
  slogan: "Growing Future Leaders",
  contact: {
    phone: "0342-2049976",
    email: "thetorciaschool@gmail.com",
    address: "Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital, Nazimabad, Karachi, Pakistan",
  },
  programs: [
    {
      name: "Early Years",
      levels: "Playgroup & Montessori",
      description: "Montessori-inspired environment with sensory discovery, fine motor skills, phonics, and Islamic etiquette (Adab).",
      keyHighlights: ["Sensory activities", "Montessori manipulatives", "Rhymes & Phonics", "Adab & Daily Duas"],
    },
    {
      name: "Primary Education",
      levels: "Grade I to Grade V",
      description: "Structured academic foundation focusing on critical thinking, mathematical problem-solving, bilingual fluency (English & Urdu), and character building.",
      keyHighlights: ["Mathematics & Science", "English & Urdu Literacy", "Nazra Quran & Islamic Studies", "Social Studies"],
    },
    {
      name: "Flagship STEM Programme",
      levels: "Primary & Activity Lab",
      description: "Practical hands-on exploration in modern technology and scientific inquiry.",
      keyHighlights: ["Robotics", "Artificial Intelligence (AI)", "Coding Basics", "Internet of Things (IoT)", "Hands-on Science Kits"],
    },
  ],
  admissionCriteria: [
    { grade: "Playgroup", minAge: "2.5 years" },
    { grade: "Montessori", minAge: "3.5 to 5 years" },
    { grade: "Grade I", minAge: "Min 5 years" },
    { grade: "Grade II", minAge: "Min 6 years" },
    { grade: "Grade III", minAge: "Min 7 years" },
    { grade: "Grade IV & V", minAge: "Min 8 to 9 years" },
  ],
  requiredDocuments: [
    "Child's B-Form (Nadra Birth Registration)",
    "Passport size recent photographs of the student",
    "Last school leaving certificate (if transferring from another school)",
    "Copy of Father / Guardian's CNIC",
  ],
  schoolTimings: {
    prePrimary: {
      category: "Pre-Primary (Playgroup, Montessori & Kindergarten)",
      schedule: [
        { days: "Monday to Thursday", hours: "8:30 am – 12:30 pm" },
        { days: "Friday", hours: "8:30 am – 12:00 noon" },
      ],
    },
    primary: {
      category: "Primary Education (Grade I to Grade V)",
      schedule: [
        { days: "Monday to Thursday", hours: "7:45 am – 1:30 pm" },
        { days: "Friday", hours: "7:45 am – 12:30 pm" },
      ],
    },
  },
  feeStructure: {
    admissionFee: "Rs. 15,000 (One-time registration & admission fee)",
    annualCharges: "Rs. 4,000 (Annual development & resource charges)",
    monthlyTuitionFee: "Rs. 5,000 (Monthly tuition fee)",
    currency: "PKR (Pakistani Rupees)",
  },
};

/**
 * System Instructions for LLMs (OpenAI, Google Gemini, Anthropic, etc.)
 */
export const SYSTEM_PROMPT = `
You are the official AI Assistant for "The Torcia School" (Slogan: "Growing Future Leaders"), located in Nazimabad, Karachi.

Your objective is to provide parents, guardians, and visitors with accurate, courteous, and prompt answers regarding school admissions, academic programs, timings, fee schedule, and campus facilities.

STRICT KNOWLEDGE BASE TO REFERENCE:
1. SCHOOL IDENTITY:
   - Name: The Torcia School
   - Slogan: Growing Future Leaders
   - Location: Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital, Nazimabad, Karachi
   - Contact Number: 0342-2049976
   - Email: thetorciaschool@gmail.com

2. ACADEMIC PROGRAMS:
   - Early Years: Playgroup & Montessori featuring sensory activities, fine motor coordination, phonics, and Islamic values (Adab).
   - Primary Education: Grade I to Grade V with rigorous bilingual literacy, mathematical inquiry, and character development.
   - Flagship STEM Programme: Dedicated hands-on learning in Robotics, Artificial Intelligence (AI), Coding, and the Internet of Things (IoT).

3. ADMISSION AGE CRITERIA:
   - Playgroup: 2.5 years
   - Montessori: 3.5 to 5 years
   - Grade I: Minimum 5 years
   - Grade II: Minimum 6 years
   - Grade III: Minimum 7 years

4. REQUIRED DOCUMENTS FOR ADMISSION:
   - Child's B-Form (Nadra)
   - Passport-size student photographs
   - Last school leaving certificate (if transferring from another school)
   - Parent / Guardian's CNIC copy

5. SCHOOL TIMINGS:
   - Pre-Primary (Playgroup & Montessori):
     * Monday – Thursday: 8:30 am – 12:30 pm
     * Friday: 8:30 am – 12:00 noon
   - Primary (Grade I – Grade V):
     * Monday – Thursday: 7:45 am – 1:30 pm
     * Friday: 7:45 am – 12:30 pm

6. FEE STRUCTURE:
   - Admission Fee: Rs. 15,000 (One-time)
   - Annual Charges: Rs. 4,000
   - Monthly Tuition Fee: Rs. 5,000

OPERATIONAL GUIDELINES:
- STRICT FIDELITY: Never invent, assume, or modify fee amounts, ages, or timings. Always quote the exact numbers provided above.
- TONE: Warm, welcoming, respectful, professional, and encouraging.
- CONVERSATIONAL GREETINGS & CASUAL INTERACTION: When a user sends a casual greeting or friendly check-in (e.g., "Hello", "Hi", "Salam", "Assalam-o-Alaikum", "AOA", "Kaise hain?", "Kese ho", "How are you?"), respond naturally, warmly, and courteously with an appropriate polite greeting (e.g., "Walaikum Assalam! Welcome to The Torcia School. I'm doing well, thank you! How may I assist you with our admissions, programs, or timings today?"). DO NOT dump the fee structure, admission criteria, or long data summaries on simple greetings. Keep casual responses friendly, conversational, and helpful.
- NEXT STEPS: When discussing admissions, encourage the parent to visit the campus at Plot # 20/13 Block 5C, Nazimabad or call 0342-2049976 to schedule an in-person assessment.
`.trim();

/**
 * Intelligent Fallback Matcher:
 * Ensures the chatbot gives 100% accurate answers instantly even if no external AI API key is set.
 */
export function getKnowledgeResponse(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // 1. Check if the query asks for specific school information
  const hasSpecificTopic =
    q.includes("fee") ||
    q.includes("charges") ||
    q.includes("tuition") ||
    q.includes("cost") ||
    q.includes("pricing") ||
    q.includes("payment") ||
    q.includes("monthly") ||
    q.includes("timing") ||
    q.includes("time") ||
    q.includes("hour") ||
    q.includes("schedule") ||
    q.includes("closing") ||
    q.includes("opening") ||
    q.includes("age") ||
    q.includes("criteria") ||
    q.includes("eligibility") ||
    q.includes("document") ||
    q.includes("b-form") ||
    q.includes("bform") ||
    q.includes("certificate") ||
    q.includes("photo") ||
    q.includes("stem") ||
    q.includes("robotic") ||
    q.includes("coding") ||
    q.includes("iot") ||
    q.includes("curriculum") ||
    q.includes("program") ||
    q.includes("admission") ||
    q.includes("apply") ||
    q.includes("enroll") ||
    q.includes("register") ||
    q.includes("location") ||
    q.includes("address") ||
    q.includes("where") ||
    q.includes("phone") ||
    q.includes("contact") ||
    q.includes("number");

  // 2. Conversational Greeting & Check-in Handler (when no specific info was queried)
  if (!hasSpecificTopic) {
    const isSalam =
      q.includes("salam") ||
      q.includes("salaam") ||
      q.includes("assalam") ||
      q.includes("asalam") ||
      q.includes("aoa") ||
      q.includes("slm");

    const isUrduInquiry =
      q.includes("kaise") ||
      q.includes("kese") ||
      q.includes("kya hal") ||
      q.includes("kya haal") ||
      q.includes("hal chal") ||
      q.includes("haal chal") ||
      q.includes("theek ho") ||
      q.includes("thik ho");

    const isEnglishInquiry =
      q.includes("how are you") ||
      q.includes("how r u") ||
      q.includes("how do you do") ||
      q.includes("how's it going");

    const isEnglishGreeting =
      q === "hi" ||
      q.startsWith("hi ") ||
      q.endsWith(" hi") ||
      q.includes(" hi ") ||
      q === "hello" ||
      q.startsWith("hello ") ||
      q.endsWith(" hello") ||
      q.includes(" hello ") ||
      q === "hey" ||
      q.startsWith("hey ") ||
      q.endsWith(" hey") ||
      q.includes(" hey ") ||
      q.includes("good morning") ||
      q.includes("good afternoon") ||
      q.includes("good evening") ||
      q.includes("greetings");

    if (isSalam && (isUrduInquiry || isEnglishInquiry)) {
      return `Walaikum Assalam! Main theek hoon, Alhamdulillah. Welcome to **The Torcia School** (*"Growing Future Leaders"*).\n\nHow can I help you and your child today? Feel free to ask about our **Admissions for 2026-2027**, **Academic Programs**, **Fee Structure**, or **School Timings**!`;
    }

    if (isSalam) {
      return `Walaikum Assalam! Welcome to **The Torcia School** (*"Growing Future Leaders"*).\n\nHow can I assist you today? You can ask me about our **Admissions for 2026-2027**, **Academic Programs**, **Fee Structure**, **School Timings**, or our hands-on **STEM Programme**.`;
    }

    if (isUrduInquiry) {
      return `Assalam-o-Alaikum! Main bilkul theek hoon, shukriya! Welcome to **The Torcia School** (*"Growing Future Leaders"*).\n\nMain aap ki admissions, fee structure, ya school timings ke hawalay se kya madad kar sakta hoon?`;
    }

    if (isEnglishInquiry) {
      return `Assalam-o-Alaikum! I am doing very well, thank you for asking! Welcome to **The Torcia School** (*"Growing Future Leaders"*).\n\nHow can I assist you today? Feel free to ask about our **Admissions**, **Academic Programs**, **Fee Structure**, or **School Timings**!`;
    }

    if (isEnglishGreeting) {
      return `Hello and welcome to **The Torcia School** (*"Growing Future Leaders"*), located in Nazimabad, Karachi!\n\nHow can I help you today? Feel free to ask about our **Admissions for 2026-2027**, **Fee Structure**, **School Timings**, or our flagship **STEM Programme**.`;
    }
  }

  // 3. Specific School Information Matchers
  // Fee Structure
  if (
    q.includes("fee") ||
    q.includes("charges") ||
    q.includes("tuition") ||
    q.includes("cost") ||
    q.includes("pricing") ||
    q.includes("payment") ||
    q.includes("monthly")
  ) {
    return `Here is the official Fee Structure for **The Torcia School**:\n\n• **Admission Fee:** Rs. 15,000 (One-time)\n• **Annual Charges:** Rs. 4,000\n• **Monthly Tuition Fee:** Rs. 5,000\n\nFor installment options or admission desk support, feel free to call us at **0342-2049976**.`;
  }

  // School Timings
  if (
    q.includes("timing") ||
    q.includes("time") ||
    q.includes("hour") ||
    q.includes("schedule") ||
    q.includes("closing") ||
    q.includes("opening")
  ) {
    return `Here are the official **School Timings** at The Torcia School:\n\n**Pre-Primary (Playgroup & Montessori):**\n• Mon – Thu: 8:30 am – 12:30 pm\n• Friday: 8:30 am – 12:00 noon\n\n**Primary (Grade I to V):**\n• Mon – Thu: 7:45 am – 1:30 pm\n• Friday: 7:45 am – 12:30 pm`;
  }

  // Admission Criteria & Age
  if (
    q.includes("age") ||
    q.includes("criteria") ||
    q.includes("eligibility") ||
    q.includes("old") ||
    q.includes("grade 1") ||
    q.includes("grade i") ||
    q.includes("playgroup") ||
    q.includes("montessori")
  ) {
    return `Here are the **Admission Age Criteria** for The Torcia School:\n\n• **Playgroup:** 2.5 years\n• **Montessori:** 3.5 to 5 years\n• **Grade I:** Minimum 5 years\n• **Grade II:** Minimum 6 years\n• **Grade III:** Minimum 7 years\n\nAdmissions for session 2026-2027 are currently open!`;
  }

  // Required Documents
  if (
    q.includes("document") ||
    q.includes("b-form") ||
    q.includes("bform") ||
    q.includes("certificate") ||
    q.includes("photo") ||
    q.includes("requirement")
  ) {
    return `Here are the **Required Documents** for admission at The Torcia School:\n\n1. Child's **B-Form** (Nadra Birth Registration)\n2. **Passport-size photographs** of the student\n3. **Last school leaving certificate** (if transferring from another school)\n4. Copy of Father / Guardian's CNIC\n\nYou can bring these documents during your campus visit.`;
  }

  // STEM Programme & Programs
  if (
    q.includes("stem") ||
    q.includes("robotic") ||
    q.includes("ai") ||
    q.includes("coding") ||
    q.includes("iot") ||
    q.includes("program") ||
    q.includes("curriculum")
  ) {
    return `**The Torcia School** ("Growing Future Leaders") offers progressive learning programs:\n\n• **Early Years:** Playgroup & Montessori with sensory discovery, motor skills, and phonics.\n• **Primary Education:** Grade I to Grade V academic foundation with bilingual fluency and character education.\n• **Flagship STEM Programme:** Hands-on Robotics, Artificial Intelligence (AI), Coding, and Internet of Things (IoT) exploration in our dedicated Activity Lab!`;
  }

  // Admissions general
  if (q.includes("admission") || q.includes("apply") || q.includes("enroll") || q.includes("register")) {
    return `Admissions are currently **OPEN** at **The Torcia School** ("Growing Future Leaders") from Playgroup to Grade V!\n\n• **Admission Fee:** Rs. 15,000 | **Annual:** Rs. 4,000 | **Monthly:** Rs. 5,000\n• **Required Documents:** B-Form, Passport-size photographs, and School Leaving Certificate (if transferring).\n\nYou can apply through our online Admissions form or visit us at **Plot # 20/13 Block 5C, Nazimabad, Karachi** (Phone: **0342-2049976**).`;
  }

  // Location / Address / Contact
  if (q.includes("location") || q.includes("address") || q.includes("where") || q.includes("phone") || q.includes("contact") || q.includes("number")) {
    return `**The Torcia School Campus Details:**\n\n📍 **Address:** Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital, Nazimabad, Karachi\n📞 **Phone:** 0342-2049976\n✉️ **Email:** thetorciaschool@gmail.com\n\nCampus visits are welcome during operational hours!`;
  }

  // Slogan / Motto / About
  if (q.includes("slogan") || q.includes("motto") || q.includes("about") || q.includes("torcia")) {
    return `**The Torcia School** — *"Growing Future Leaders"*\n\nWe provide quality education from Playgroup through Grade V with certified Montessori educators and a cutting-edge STEM Programme (Robotics, AI, Coding, IoT). How can I assist you with admissions or details today?`;
  }

  return null;
}
