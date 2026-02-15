const SKILL_CATEGORIES = {
    "coreCS": ["DSA", "Data Structures", "Algorithms", "OOP", "Object Oriented", "DBMS", "Database Management", "OS", "Operating Systems", "Networks", "Computer Networks", "System Design", "Low Level Design", "High Level Design", "LLD", "HLD"],
    "languages": ["Java", "Python", "JavaScript", "JS", "TypeScript", "TS", "C++", "C#", "Golang", "Go", "Ruby", "Swift", "Kotlin", "Rust", "PHP"],
    "web": ["React", "React.js", "Next.js", "Node", "Node.js", "Express", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap", "REST", "GraphQL", "API"],
    "data": ["SQL", "MySQL", "PostgreSQL", "Postgres", "MongoDB", "Mongo", "Redis", "Cassandra", "Elasticsearch", "Kafka", "Spark", "Hadoop"],
    "cloud": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "K8s", "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Linux", "Bash", "Shell"],
    "testing": ["Selenium", "Cypress", "Playwright", "Jest", "Mocha", "JUnit", "PyTest", "Manual Testing"]
};

const ENTERPRISE_COMPANIES = [
    "Google", "Amazon", "Microsoft", "Meta", "Facebook", "Apple", "Netflix",
    "TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "IBM", "Oracle",
    "Cisco", "Intel", "Samsung", "Adobe", "Salesforce", "SAP", "Deloitte", "Goldman Sachs"
];

// Questions bank mapping specific skills to questions
const QUESTION_BANK = {
    "React": ["Explain the Virtual DOM and how it improves performance.", "What are React Hooks? Name three common hooks.", "Difference between State and Props.", "Explain the useEffect dependency array."],
    "Node.js": ["Explain the Event Loop in Node.js.", "Difference between process.nextTick() and setImmediate().", "How does Node.js handle concurrency?", "What is Middleware in Express?"],
    "Java": ["Explain the difference between JDK, JRE, and JVM.", "What are the four pillars of OOP?", "Difference between Interface and Abstract Class.", "Explain Garbage Collection in Java."],
    "Python": ["Difference between list and tuple.", "Explain decorators in Python.", "What is the Global Interpreter Lock (GIL)?", "How is memory managed in Python?"],
    "SQL": ["Explain the difference between DELETE and TRUNCATE.", "What are ACID properties?", "Explain different types of Joins.", "What is Indexing and how does it work?"],
    "DSA": ["Explain Time and Space Complexity.", "Difference between Array and Linked List.", "How does a Hash Map work?", "Explain QuickSort algorithm."],
    "System Design": ["What is Load Balancing?", "Explain Horizontal vs Vertical Scaling.", "CAP Theorem explained.", "How would you design a URL shortener?"]
};

// ... existing helper functions (escapeRegExp) ...
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractSkills = (text) => {
    const extracted = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };
    const lowerText = text.toLowerCase();
    let totalSkillsFound = 0;

    Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
        const found = keywords.filter(keyword => {
            const regex = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, 'i');
            if (keyword === 'C++' || keyword === 'C#') {
                return lowerText.includes(keyword.toLowerCase());
            }
            return regex.test(lowerText);
        });

        if (found.length > 0) {
            extracted[category] = [...new Set(found)]; // Deduplicate
            totalSkillsFound += extracted[category].length;
        }
    });

    // Default if empty
    if (totalSkillsFound === 0) {
        extracted.other = ["Communication", "Problem Solving", "Basic Coding", "Projects"];
    }

    return extracted;
};

const getCompanyIntel = (company, text) => {
    let type = "Startup";
    let size = "< 200 Employees";
    let focus = "Product & Speed";
    let industry = "Technology";

    if (company) {
        const isEnterprise = ENTERPRISE_COMPANIES.some(c => company.toLowerCase().includes(c.toLowerCase()));
        if (isEnterprise) {
            type = "Enterprise";
            size = "2000+ Employees";
            focus = "Scale & Fundamentals";
        } else {
            if (text.includes("global") || text.includes("multinational") || text.includes("established")) {
                type = "Mid-Size";
                size = "200-2000 Employees";
            }
        }

        if (text.includes("Fintech") || text.includes("financial")) industry = "Fintech";
        if (text.includes("Healthcare") || text.includes("medical")) industry = "HealthTech";
        if (text.includes("E-commerce") || text.includes("retail")) industry = "E-commerce";
        if (text.includes("SaaS") || text.includes("B2B")) industry = "SaaS";
    }

    return { name: company || "Unknown Company", type, size, focus, industry };
};

const calculateScore = (skills, text, role, company) => {
    let score = 35;
    let categoryCount = 0;

    // Count populated categories
    Object.values(skills).forEach(list => {
        if (list.length > 0) categoryCount++;
    });

    score += Math.min(categoryCount * 5, 30);

    if (company && company.length > 1) score += 10;
    if (role && role.length > 1) score += 10;
    if (text && text.length > 800) score += 10;

    return Math.min(score, 100);
};

const generatePlan = (skills) => {
    const plan = {
        "Day 1-2": ["Brush up on Aptitude & CS Fundamentals (OOP, DBMS, CN, OS)."],
        "Day 3-4": ["Focus on Data Structures & Algorithms (Arrays, Strings, Trees, Graphs)."],
        "Day 5": ["Project Deep Dive & Resume Walkthrough."],
        "Day 6": ["Mock Interviews & Behavioral Questions."],
        "Day 7": ["Final Revision & Cheat Sheets."]
    };

    if (skills.web && skills.web.length > 0) {
        plan["Day 1-2"].push(`Revise Web Fundamentals: ${skills.web.slice(0, 3).join(", ")}.`);
        plan["Day 5"].push("Prepare to explain architecture of your Web Projects.");
    }
    if (skills.data && skills.data.length > 0) {
        plan["Day 1-2"].push("Practice complex SQL Queries and Normalization.");
    }
    if (skills.coreCS && skills.coreCS.some(s => s.includes("System Design") || s.includes("HLD"))) {
        plan["Day 3-4"].push("Review High Level Design concepts (Scalability, Load Balancing).");
    }

    return plan;
};

const generateChecklist = (skills) => {
    // Keep this as backup or map to Round Mapping if needed
    return {
        "Round 1: Aptitude & Basics": ["Quantitative Aptitude", "Logical Reasoning", "Core CS: OOP", "DBMS Basics"],
        "Round 2: Coding & DSA": ["Arrays & Strings", "Stacks/Queues", "Trees/Graphs", "Time Complexity"],
        "Round 3: Technical Deep Dive": ["Project Architecture", "Language Internals", "API Design"],
        "Round 4: HR": ["Tell me about yourself", "Why this company?", "Strengths/Weaknesses"]
    };
};

const generateRoundMapping = (companyType, skills) => {
    const rounds = [];
    const hasDSA = skills.coreCS && skills.coreCS.some(s => ["DSA", "Algorithms", "Data Structures"].includes(s));
    const hasWeb = skills.web && skills.web.length > 0;

    if (companyType === "Enterprise") {
        rounds.push({
            title: "Online Assessment",
            description: "Aptitude + 2 Medium DSA Problems",
            purpose: "Filter candidates based on raw problem-solving speed and accuracy."
        });
        rounds.push({
            title: "Technical Round 1",
            description: hasDSA ? "Data Structures & Algorithms (Trees, Graphs, DP)" : "Deep dive into OS/DBMS & Coding",
            purpose: "Validate strong CS fundamentals and code quality."
        });
        rounds.push({
            title: "Technical Round 2",
            description: "System Design (LLD) + Project Deep Dive",
            purpose: "Assess capability to build scalable components and understand trade-offs."
        });
        rounds.push({
            title: "Managerial / HR",
            description: "Behavioral + Culture Fit",
            purpose: "Ensure alignment with company values and long-term retention."
        });
    } else {
        rounds.push({
            title: "Screening / Machine Coding",
            description: hasWeb ? "Build a small feature (React/Node) in 1-2 hours" : "Take-home assignment or Live Coding",
            purpose: "Verify hands-on practical coding skills immediately."
        });
        rounds.push({
            title: "Technical Discussion",
            description: "Code Review + Architecture Discussion",
            purpose: "Check depth of knowledge in your stack and decision-making process."
        });
        rounds.push({
            title: "Founder / Culture Fit",
            description: "Product thinking + Alignment",
            purpose: "Assess ownership mindset and cultural fit for a fast-paced environment."
        });
    }
    return rounds;
};

const generateQuestions = (skills) => {
    let questions = [];
    const flatSkills = [
        ...(skills.coreCS || []),
        ...(skills.languages || []),
        ...(skills.web || []),
        ...(skills.data || []),
        ...(skills.cloud || []),
        ...(skills.testing || [])
    ];

    flatSkills.forEach(skill => {
        const key = Object.keys(QUESTION_BANK).find(k => k.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(k.toLowerCase()));
        if (key && QUESTION_BANK[key]) {
            questions = [...questions, ...QUESTION_BANK[key]];
        }
    });

    if (questions.length < 5) {
        questions.push("Explain a challenging bug you fixed.", "How do you handle tight deadlines?");
    }

    return questions.sort(() => 0.5 - Math.random()).slice(0, 10);
};

export const analyzeJD = (text, role, company) => {
    const skills = extractSkills(text);
    const companyIntel = getCompanyIntel(company, text);
    const score = calculateScore(skills, text, role, company);
    const plan = generatePlan(skills);
    const checklist = generateChecklist(skills);
    const roundMapping = generateRoundMapping(companyIntel.type, skills);
    const questions = generateQuestions(skills);

    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: role || "",
        company: company || "",
        jdText: text,
        extractedSkills: skills,
        baseScore: score,
        readinessScore: score, // Initial final score = base score
        skillConfidence: {}, // Empty initially
        companyIntel,
        plan,
        checklist,
        roundMapping,
        questions
    };
};
