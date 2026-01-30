import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-accent selection:text-black">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 z-[60]"></div>
            <Navigation />
            <main className="container mx-auto px-4 py-8 pt-24 md:pt-32 max-w-7xl">
                {children}
            </main>
        </div>
    );
};

export default Layout;
