import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Copy, ExternalLink, ShieldCheck, AlertCircle, Box } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { cn } from '../lib/utils';

const STEPS = [
    { id: 1, text: "Project Setup & Dependencies" },
    { id: 2, text: "Dashboard UI Implementation" },
    { id: 3, text: "Analysis Engine Logic" },
    { id: 4, text: "Results Page & Interactivity" },
    { id: 5, text: "Company Intel & Round Mapping" },
    { id: 6, text: "Hardening & Validation" },
    { id: 7, text: "Test Checklist Verification" },
    { id: 8, text: "Final Proof & Submission" }
];

const STORAGE_KEY = 'prp_final_submission';
const CHECKLIST_KEY = 'prp-test-checklist';

const ProofPage = () => {
    const [completedSteps, setCompletedSteps] = useState([]);
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [checklistPassed, setChecklistPassed] = useState(false);

    useEffect(() => {
        // Load local state
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setCompletedSteps(data.completedSteps || []);
                setLinks(data.links || { lovable: '', github: '', deployed: '' });
            } catch (e) {
                console.error("Failed to load proof data", e);
            }
        }

        // Check verification status
        const checklistSaved = localStorage.getItem(CHECKLIST_KEY);
        if (checklistSaved) {
            try {
                const checked = JSON.parse(checklistSaved);
                if (Array.isArray(checked) && checked.length === 10) {
                    setChecklistPassed(true);
                }
            } catch (e) { }
        }
    }, []);

    // Save on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedSteps, links }));
    }, [completedSteps, links]);

    const toggleStep = (id) => {
        setCompletedSteps(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleLinkChange = (key, value) => {
        setLinks(prev => ({ ...prev, [key]: value }));
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const allStepsComplete = STEPS.every(s => completedSteps.includes(s.id));
    const allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);
    const isShipped = allStepsComplete && checklistPassed && allLinksValid;

    const copySubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();
        navigator.clipboard.writeText(text);
        alert("Submission copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Proof of Work</h1>
                        <p className="text-slate-600">Finalize your submission and generate proof.</p>
                    </div>
                    <div className={cn(
                        "px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase flex items-center gap-2",
                        isShipped ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}>
                        {isShipped ? <ShieldCheck className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                        {isShipped ? "Shipped" : "In Progress"}
                    </div>
                </div>

                {isShipped && (
                    <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        <CardContent className="p-8 relative z-10 text-center">
                            <h2 className="text-3xl font-extrabold mb-4">You built a real product.</h2>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Not a tutorial. Not a clone.<br />
                                A structured tool that solves a real problem.<br />
                                <span className="font-semibold text-white mt-4 block">This is your proof of work.</span>
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Steps Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Development Steps</CardTitle>
                                <CardDescription>Mark milestones as completed.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {STEPS.map(step => (
                                    <div
                                        key={step.id}
                                        onClick={() => toggleStep(step.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-slate-50",
                                            completedSteps.includes(step.id) ? "opacity-100" : "opacity-70"
                                        )}
                                    >
                                        {completedSteps.includes(step.id)
                                            ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            : <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                        }
                                        <span className={cn("font-medium text-sm", completedSteps.includes(step.id) ? "text-slate-900" : "text-slate-500")}>
                                            {step.text}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Prerequisites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link to="/prp/07-test" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {checklistPassed
                                            ? <CheckCircle className="w-5 h-5 text-green-600" />
                                            : <AlertCircle className="w-5 h-5 text-orange-500" />
                                        }
                                        <span className="font-medium text-sm text-slate-700">10-Point Verification Checklist</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </Link>
                                {!checklistPassed && (
                                    <p className="text-xs text-orange-600 mt-2 px-1">
                                        * Must be completed to enable shipping status.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Artifacts Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Submission Artifacts</CardTitle>
                                <CardDescription>Provide valid links to your work.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Lovable Project Link</label>
                                    <input
                                        type="url"
                                        placeholder="https://lovable.dev/..."
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        value={links.lovable}
                                        onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Repository</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        value={links.github}
                                        onChange={(e) => handleLinkChange('github', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Deployed Application URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        value={links.deployed}
                                        onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full gap-2"
                                    disabled={!isShipped}
                                    onClick={copySubmission}
                                    variant={isShipped ? "default" : "secondary"}
                                >
                                    <Copy className="w-4 h-4" />
                                    {isShipped ? "Copy Final Submission" : "Complete Requirements to Copy"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProofPage;
