import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Video, TrendingUp, Search, Loader2, AlertCircle } from 'lucide-react';
import { analyzeJD } from '../lib/analyzer';
import { saveAnalysis } from '../lib/storage';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        jd: ''
    });

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!formData.jd) return;

        setLoading(true);

        // Simulate processing delay for effect
        setTimeout(() => {
            const analysis = analyzeJD(formData.jd, formData.role, formData.company);
            saveAnalysis(analysis);
            setLoading(false);
            navigate(`/results?id=${analysis.id}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="h-16 px-6 lg:px-12 flex items-center justify-between bg-white border-b border-slate-100">
                <span className="text-xl font-bold text-primary">Placement Prep</span>
                <div className="flex gap-4">
                    <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">History</Link>
                    <Link to="/app/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="px-6 lg:px-12 py-20 lg:py-24 flex flex-col items-center text-center">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Ace Your <span className="text-primary">Placement</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mb-10">
                        Paste a Job Description below to get a personalized preparation plan, readiness score, and interview checklist.
                    </p>

                    {/* Analysis Form */}
                    <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <form onSubmit={handleAnalyze} className="space-y-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google, Amazon"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SDE-1, Frontend Engineer"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Validation Warning */}
                            {formData.jd && formData.jd.length < 200 && (
                                <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    This JD is too short to analyze deeply. Paste full JD for better output.
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Description <span className="text-red-500">*</span></label>
                                <textarea
                                    placeholder="Paste the full JD here..."
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px]"
                                    value={formData.jd}
                                    onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !formData.jd}
                                className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                                {loading ? 'Analyzing...' : 'Analyze Job Description'}
                            </button>
                        </form>
                    </div>

                </section>

                {/* Features Grid */}
                <section className="px-6 lg:px-12 py-16 bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Code2}
                            title="Skill Extraction"
                            description="Automatically identify key technical skills and requirements from any JD."
                        />
                        <FeatureCard
                            icon={Video}
                            title="Tailored Plan"
                            description="Get a 7-day preparation roadmap specific to the role's tech stack."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Readiness Score"
                            description="See how well you match the job requirements with a heuristic score."
                        />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Placement Prep Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
