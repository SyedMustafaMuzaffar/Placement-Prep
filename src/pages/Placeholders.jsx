import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500">This feature is coming soon.</p>
    </div>
);

export const Practice = () => <PlaceholderPage title="Practice Problems" />;
export const Assessments = () => <PlaceholderPage title="Assessments" />;
export const Resources = () => <PlaceholderPage title="Learning Resources" />;
export const Profile = () => <PlaceholderPage title="User Profile" />;
