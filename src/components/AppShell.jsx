import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, User, ScrollText } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`
        }
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </NavLink>
);

const AppShell = () => {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <span className="text-xl font-bold text-primary">Placement Prep</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarItem to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/app/practice" icon={BookOpen} label="Practice" />
                    <SidebarItem to="/app/assessments" icon={FileText} label="Assessments" />
                    <SidebarItem to="/app/resources" icon={ScrollText} label="Resources" />
                    <SidebarItem to="/app/profile" icon={User} label="Profile" />
                </nav>

                <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
                    v1.0.0
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center md:hidden">
                        {/* Mobile menu trigger could go here */}
                        <span className="text-xl font-bold text-primary">Placement Prep</span>
                    </div>
                    <div className="hidden md:block text-slate-500 text-sm">
                        Welcome back, Candidate
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppShell;
