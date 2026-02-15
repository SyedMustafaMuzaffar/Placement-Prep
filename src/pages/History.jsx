import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../lib/storage';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Building2, Briefcase } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
                        <p className="text-slate-500">Your past job descriptions and preparation plans</p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">No history found yet.</p>
                        <Link to="/">
                            <Button>Analyze New JD</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <Link to={`/results?id=${item.id}`} key={item.id} className="block transition-transform hover:-translate-y-1">
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-row justify-between items-center text-left">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-slate-900">{item.role || "Untitled Role"}</h3>
                                                {item.company && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium flex items-center gap-1">
                                                        <Building2 className="w-3 h-3" /> {item.company}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span>•</span>
                                                <span>Score: <span className="font-bold text-slate-900">{item.readinessScore}</span></span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
