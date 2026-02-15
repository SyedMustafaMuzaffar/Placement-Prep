import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Square, AlertTriangle, ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { cn } from '../lib/utils';

const TEST_ITEMS = [
    { id: 1, text: "JD required validation works", hint: "Try analyzing without JD text. Should show error." },
    { id: 2, text: "Short JD warning shows for <200 chars", hint: "Enter a short string. Verify yellow warning banner." },
    { id: 3, text: "Skills extraction groups correctly", hint: "Verify 'React' goes to Web, 'Java' to Languages." },
    { id: 4, text: "Round mapping changes based on company + skills", hint: "Compare 'Google' (Enterprise) vs 'Startup' outputs." },
    { id: 5, text: "Score calculation is deterministic", hint: "Same JD should always give same base score." },
    { id: 6, text: "Skill toggles update score live", hint: "Click skills in Results. Score should change (+2/-2)." },
    { id: 7, text: "Changes persist after refresh", hint: "Reload Results page. Toggles should remain." },
    { id: 8, text: "History saves and loads correctly", hint: "Check /history. Entry should exist and be loadable." },
    { id: 9, text: "Export buttons copy the correct content", hint: "Download TXT and verify contents." },
    { id: 10, text: "No console errors on core pages", hint: "Check Inspector during navigation." }
];

const STORAGE_KEY = 'prp-test-checklist';

const TestPage = () => {
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse checklist", e);
            }
        }
    }, []);

    const toggleItem = (id) => {
        const newChecked = checkedItems.includes(id)
            ? checkedItems.filter(i => i !== id)
            : [...checkedItems, id];

        setCheckedItems(newChecked);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newChecked));
    };

    const resetChecklist = () => {
        if (confirm("Reset all verification progress?")) {
            setCheckedItems([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const passedCount = checkedItems.length;
    const isComplete = passedCount === TEST_ITEMS.length;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans flex flex-col items-center">
            <div className="max-w-3xl w-full space-y-8">

                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900">System Verification Checklist</h1>
                    <p className="text-slate-600">Verify all features before shipping the update.</p>
                </div>

                <div className="grid gap-6">
                    {/* Summary Card */}
                    <Card className={cn("border-l-4 transition-colors", isComplete ? "border-l-green-500" : "border-l-orange-500")}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center">
                                <span>Tests Passed: {passedCount} / {TEST_ITEMS.length}</span>
                                {isComplete ? (
                                    <ShieldCheck className="w-8 h-8 text-green-500" />
                                ) : (
                                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                                )}
                            </CardTitle>
                            <CardDescription>
                                {isComplete
                                    ? "All systems normal. Ready to ship."
                                    : "Fix issues and mark items to proceed."}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Checklist */}
                    <Card>
                        <CardContent className="p-0">
                            {TEST_ITEMS.map((item) => {
                                const isChecked = checkedItems.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={cn(
                                            "flex items-start gap-4 p-4 border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-slate-50",
                                            isChecked ? "bg-slate-50/50" : ""
                                        )}
                                    >
                                        <div className={cn("mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                            isChecked ? "bg-green-600 border-green-600 text-white" : "border-slate-300 bg-white"
                                        )}>
                                            {isChecked && <CheckSquare className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn("font-medium text-slate-900 transition-colors", isChecked ? "text-slate-500 line-through" : "")}>
                                                {item.text}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">{item.hint}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4">
                        <Button variant="ghost" className="text-slate-500 hover:text-red-600" onClick={resetChecklist}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset Checklist
                        </Button>

                        <Link to="/prp/08-ship" onClick={(e) => !isComplete && e.preventDefault()}>
                            <Button size="lg" disabled={!isComplete} className={cn(isComplete ? "bg-green-600 hover:bg-green-700" : "")}>
                                {isComplete ? "Proceed to Ship" : "Locked: Complete Tests"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
