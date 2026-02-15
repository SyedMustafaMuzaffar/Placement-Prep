import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const STORAGE_KEY = 'prp-test-checklist';
const REQUIRED_COUNT = 10;

const ShipPage = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const checked = JSON.parse(saved);
                if (Array.isArray(checked) && checked.length === REQUIRED_COUNT) {
                    setIsLocked(false);
                } else {
                    setIsLocked(true);
                }
            } catch (e) {
                setIsLocked(true);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <Card className="max-w-md w-full text-center p-8 bg-white shadow-xl border-orange-200">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Shipment Locked</h1>
                    <p className="text-slate-600 mb-8">
                        You must complete the 10-point verification checklist before shipping this build.
                    </p>
                    <Link to="/prp/07-test">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800">
                            Go to Test Checklist
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 font-sans text-center">
            <div className="max-w-2xl w-full">
                <div className="animate-bounce mb-8 inline-block">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 text-white">
                        <Rocket className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Ready for Lift-off!
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto">
                    All systems go. The Placement Readiness Platform is hardened, validated, and ready for use.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 h-14 px-8 text-lg rounded-full shadow-xl">
                            Go to Platform
                        </Button>
                    </Link>
                    <Link to="/prp/07-test">
                        <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 text-slate-600 hover:bg-white text-base">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Tests
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-green-700 font-medium bg-green-100/50 py-2 px-4 rounded-full inline-flex">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Build v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default ShipPage;
