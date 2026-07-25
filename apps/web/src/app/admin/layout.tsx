"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Terminal, LayoutDashboard, Globe, MessageSquare, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#3B82F6] animate-spin" />
          <span className="text-xs text-gray-500 font-mono">Initializing Admin Context...</span>
        </div>
      </div>
    );
  }

  // If visiting login, just render the page directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If unauthorized, render nothing while redirecting
  if (!authorized) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/admin/metadata", label: "SEO Manager", icon: <Globe size={16} /> },
    { href: "/admin/inquiries", label: "CRM Inbox", icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#CBD5E1] flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="border-b border-white/5 bg-[#18181B]/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg text-[#3B82F6]">
            <Terminal size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">BAGPACKERS AI</h1>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Control Cockpit</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-white bg-red-950/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 rounded-lg transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Exit Gate</span>
        </motion.button>
      </header>

      {/* Main Admin Panel body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 mb-6 border-b border-white/5 pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-400 bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        {children}
      </main>
    </div>
  );
}
