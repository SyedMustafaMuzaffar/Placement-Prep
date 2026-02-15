import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const CircularProgress = ({ value, size = 160, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        className="text-slate-100"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className="text-slate-900 transition-all duration-1000 ease-out"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{value}</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500 uppercase tracking-wider">Readiness Score</p>
        </div>
    );
};

const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const Dashboard = () => {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Overall Readiness */}
                <Card className="flex flex-col items-center justify-center p-6 min-h-[300px]">
                    <CardHeader className="pb-2">
                        <CardTitle>Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center pt-4">
                        <CircularProgress value={72} />
                    </CardContent>
                </Card>

                {/* 2. Skill Breakdown */}
                <Card className="flex flex-col min-h-[300px]">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                        <CardDescription>Current proficiency across key areas</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="#0f172a"
                                    strokeWidth={2}
                                    fill="#0f172a"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Continue Practice */}
                <Card>
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                        <CardDescription>Pick up where you left off</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Dynamic Programming</span>
                            <span className="text-sm text-slate-500">3/10</span>
                        </div>
                        <Progress value={30} />
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
                    </CardFooter>
                </Card>

                {/* 4. Weekly Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                        <CardDescription>Target: 20 problems</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-2xl font-bold">12</span>
                                <span className="text-sm text-slate-500">problems solved</span>
                            </div>
                            <Progress value={60} />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${[0, 1, 3, 4].includes(i) ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-400 border-slate-200'
                                        }`}>
                                        {day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 5. Upcoming Assessments */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", type: "Technical" },
                            { title: "System Design Review", time: "Wed, 2:00 PM", type: "Review" },
                            { title: "HR Interview Prep", time: "Friday, 11:00 AM", type: "Behavioral" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-md">
                                        <Calendar className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                                        <div className="flex items-center text-sm text-slate-500 mt-1">
                                            <Clock className="mr-1 h-3 w-3" /> {item.time}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
