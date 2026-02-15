import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getAnalysis, updateAnalysis } from '../lib/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircle, CheckCircle, ChevronRight, Clock, BookOpen, Laptop, ArrowLeft, Download, Copy, Share2, Building2, Users, Target, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';

const CircularScore = ({ value }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
                <circle
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-900">{value}</span>
                <span className="text-xs text-slate-500 font-medium uppercase">Score</span>
            </div>
        </div>
    );
};

// Helper to flatten grouping for generic access or display if needed
const flattenSkills = (skillsObj) => {
    if (!skillsObj) return [];
    if (Array.isArray(skillsObj)) return skillsObj; // Handle legacy arrays if any
    return Object.values(skillsObj).flat();
};

const Results = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [skillConfidence, setSkillConfidence] = useState({});
    const [currentScore, setCurrentScore] = useState(0);

    // Initial Load
    useEffect(() => {
        if (id) {
            const data = getAnalysis(id);
            if (data) {
                setAnalysis(data);
                setSkillConfidence(data.skillConfidence || {});
                setCurrentScore(data.readinessScore || 0);
            } else {
                navigate('/');
            }
        }
    }, [id, navigate]);

    // Live Score Calculation & Persistence - Moved to a separate effect handled by handleSkillToggle mostly, 
    // but we can ensure sync here if loaded data has gaps.

    const handleSkillToggle = (skill) => {
        setSkillConfidence(prev => {
            const current = prev[skill] || 'practice';
            const next = current === 'know' ? 'practice' : 'know';

            const newMap = { ...prev, [skill]: next };

            // Calculate new score
            // Uses baseScore from analysis if available, else current readinessScore as fallback
            let base = analysis.baseScore;
            if (base === undefined) {
                base = analysis.readinessScore;
            }

            let delta = 0;
            Object.values(newMap).forEach(s => {
                if (s === 'know') delta += 2;
                if (s === 'practice') delta -= 2;
            });

            const newScore = Math.max(0, Math.min(100, base + delta));
            setCurrentScore(newScore);

            // Persist
            updateAnalysis(id, {
                skillConfidence: newMap,
                readinessScore: newScore,
                updatedAt: new Date().toISOString()
            });

            return newMap;
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const downloadTxt = () => {
        const flat = flattenSkills(analysis.extractedSkills);
        const content = `
PLACEMENT PREPARATION PLAN
For: ${analysis.role || 'Role'} at ${analysis.company || 'Company'}
Date: ${new Date().toLocaleDateString()}
Readiness Score: ${currentScore}/100
Company Type: ${analysis.companyIntel?.type || 'N/A'}

--- EXTRACTED SKILLS ---
${Object.entries(analysis.extractedSkills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('\n')}

--- ROUND MAPPING ---
${analysis.roundMapping ? analysis.roundMapping.map(r => `${r.title}: ${r.description}`).join('\n') : 'N/A'}

--- 7-DAY PLAN ---
${Object.entries(analysis.plan).map(([day, tasks]) => `${day}:\n${tasks.map(t => `  - ${t}`).join('\n')}`).join('\n')}

--- QUESTIONS ---
${analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-${analysis.role || 'job'}.txt`;
        a.click();
    };

    if (!analysis) return null;

    const flatSkills = flattenSkills(analysis.extractedSkills);
    const weakSkills = Object.keys(skillConfidence).filter(s => skillConfidence[s] === 'practice').slice(0, 3);
    const displayWeakSkills = weakSkills.length > 0 ? weakSkills : flatSkills.slice(0, 3);
    const intel = analysis.companyIntel;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link to="/" className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {analysis.role || 'Job'} Analysis {analysis.company ? `for ${analysis.company}` : ''}
                        </h1>
                        <p className="text-slate-500">Generated on {new Date(analysis.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={downloadTxt} className="flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download Plan
                        </Button>
                    </div>
                </div>

                {/* Company Intel Block */}
                {intel && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-slate-900 text-white md:col-span-1">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                <Building2 className="w-8 h-8 opacity-80 mb-2" />
                                <h3 className="font-bold text-lg">{intel.name}</h3>
                                <div className="text-slate-400 text-sm">{intel.industry || "Technology"}</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-3">
                            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                        <Users className="w-4 h-4" /> Size
                                    </h4>
                                    <div className="font-medium text-slate-900">{intel.size}</div>
                                    <div className="text-xs text-slate-500 mt-1">{intel.type}</div>
                                </div>
                                <div className="sm:col-span-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                        <Target className="w-4 h-4" /> Typical Hiring Focus
                                    </h4>
                                    <div className="font-medium text-slate-900">{intel.focus}</div>
                                    <div className="text-xs text-slate-400 italic mt-1">
                                        Demo Mode: Company intel generated heuristically.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
                        <CircularScore value={currentScore} />
                        <div className="mt-6 text-center px-4">
                            <h3 className="font-semibold text-slate-900">Live Readiness</h3>
                            <p className="text-xs text-slate-500 mt-2">
                                Adjust skills to update your score.
                            </p>
                        </div>
                    </Card>

                    {/* Skills Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Interactive Skill Assessment</CardTitle>
                            <CardDescription>Click to toggle: <span className="text-green-600 font-medium">Know</span> vs <span className="text-orange-500 font-medium">Need Practice</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(analysis.extractedSkills).map(([category, skills]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(skill => {
                                                const status = skillConfidence[skill] || 'practice';
                                                return (
                                                    <button
                                                        key={skill}
                                                        onClick={() => handleSkillToggle(skill)}
                                                        className={clsx(
                                                            "px-3 py-1 text-sm rounded-full font-medium transition-all border-2",
                                                            status === 'know'
                                                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                                : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                                        )}
                                                    >
                                                        {skill}
                                                        {status === 'know' ? <CheckCircle className="w-3 h-3 inline ml-1" /> : <AlertCircle className="w-3 h-3 inline ml-1" />}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Round Timeline */}
                    <Card className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                <CardTitle>Round Mapping</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(analysis.roundMapping, null, 2))}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-0 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200"></div>

                                {(analysis.roundMapping || []).map((round, i) => (
                                    <div key={i} className="relative pl-12 pb-8 last:pb-0">
                                        {/* Dot */}
                                        <div className="absolute left-[19px] top-1 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 z-10"></div>

                                        <h4 className="font-bold text-slate-900">{round.title}</h4>
                                        <p className="text-slate-700 font-medium text-sm mt-1">{round.description}</p>

                                        <div className="mt-2 bg-slate-50 p-2 rounded text-xs text-slate-500 border border-slate-100">
                                            <span className="font-semibold text-slate-600">Why this matters:</span> {round.purpose}
                                        </div>
                                    </div>
                                ))}

                                {(!analysis.roundMapping || analysis.roundMapping.length === 0) && (
                                    <p className="text-slate-500 italic">Round mapping not available for this analysis.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 7-Day Plan */}
                    <Card className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <CardTitle>7-Day Preparation Plan</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(analysis.plan, null, 2))}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-6">
                                {Object.entries(analysis.plan).map(([day, tasks]) => (
                                    <div key={day} className="relative pl-6 border-l-2 border-slate-100 last:border-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-1">{day}</h4>
                                        <ul className="space-y-1">
                                            {tasks.map((task, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start">
                                                    <span className="mr-2">•</span> {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Question Bank (Full Width at bottom) */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <CardTitle>Likely Interview Questions</CardTitle>
                                    <CardDescription>Based on your tech stack</CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(analysis.questions.join('\n'))}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis.questions.map((q, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-800 font-medium hover:bg-slate-100 transition-colors">
                                        Q{i + 1}. {q}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calm Action Box */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Ready to take action?</h3>
                        <p className="text-slate-300 mb-4 max-w-lg">
                            You identified <span className="font-semibold text-orange-400">{displayWeakSkills.length} key areas</span> to improve: {displayWeakSkills.slice(0, 3).join(", ")}.
                            Start your Day 1 plan focuses now.
                        </p>
                    </div>
                    <Link to="/app/dashboard">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                            Start Day 1 Plan <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Results;
