"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Terminal, Shield, Activity, ChevronDown, ArrowRight, ArrowUpRight, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setRole(null);
        setFullName("");
      }
    });

    async function fetchProfile(userId: string) {
      const { data: p } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", userId)
        .single();
      if (p) {
        setRole(p.role);
        setFullName(p.full_name);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const servicesCategories = [
    {
      title: "Core AI & Platforms",
      items: [
        { name: "Document Ingestion (IDP)", href: "/services/intelligent-document-processing" },
        { name: "Semantic RAG Systems", href: "/services/retrieval-augmented-generation" },
        { name: "Custom CRM & ERP", href: "/services/custom-crm-erp-integrations" },
        { name: "Multitenant SaaS Portals", href: "/services/multitenant-saas-portals" },
      ]
    },
    {
      title: "Enterprise Solutions",
      items: [
        { name: "IoT & Logistics Automation", href: "/services/industrial-company/iot-logistics-automation" },
        { name: "Computer Vision QC", href: "/services/industrial-company/computer-vision-quality-control" },
        { name: "Predictive Dashboards", href: "/services/business-company/predictive-analytics-dashboards" },
        { name: "Regulatory Compliance RAG", href: "/services/business-company/regulatory-compliance-rag" },
      ]
    },
    {
      title: "Creative & Brand",
      items: [
        { name: "Headless CMS & Static Sites", href: "/services/brand-website/headless-cms-static-sites" },
        { name: "Immersive WebGL Portals", href: "/services/brand-website/immersive-webgl-portals" },
      ]
    }
  ];

  return (
    <>
      <div className="fixed top-4 left-0 w-full flex justify-center z-50 px-4 pointer-events-none">
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-6xl p-1 bg-white/70 backdrop-blur-xl border border-zinc-200/80 rounded-full shadow-lg flex items-center justify-between"
        >
          <div className="w-full bg-zinc-50/40 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border border-white/50">
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-2.5 group relative z-50">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10B891] to-[#059669] flex items-center justify-center shadow-lg shadow-emerald-500/10"
              >
                <Terminal size={18} strokeWidth={1.25} className="text-white" />
              </motion.div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 group-hover:text-[#10B891] transition-colors font-sans whitespace-nowrap">
                Bagpacker<span className="text-[#10B891] font-medium">developers</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold relative font-sans">
              
              {/* Services Dropdown Trigger */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`py-2 px-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    pathname.startsWith("/services") ? "text-[#10B891]" : "text-zinc-600 hover:text-[#10B891]"
                  }`}
                >
                  Services
                  <motion.span
                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown size={14} strokeWidth={1.25} />
                  </motion.span>
                </button>

                {/* Dropdown Overlay Mega Menu (Double Bezel) */}
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[680px] p-1 bg-zinc-200/40 border border-zinc-200/60 rounded-[2rem] shadow-xl z-50 flex"
                    >
                      <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 flex flex-col gap-4 shadow-inner">
                        <div className="grid grid-cols-3 gap-6 text-left">
                          {servicesCategories.map((category) => (
                            <div key={category.title} className="flex flex-col gap-3">
                              <h4 className="text-[10px] font-bold text-[#10B891] uppercase tracking-widest border-b border-zinc-100 pb-1.5">
                                {category.title}
                              </h4>
                              <div className="flex flex-col gap-2">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-xs transition-colors py-0.5 ${
                                      pathname === item.href ? "text-[#10B891] font-bold" : "text-zinc-500 hover:text-zinc-950"
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer element in Mega Menu */}
                        <div className="mt-2 pt-4 border-t border-zinc-100 flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-medium">Looking for our complete catalog?</span>
                          <Link href="/services" className="text-[#10B891] hover:text-[#059669] font-bold transition-colors flex items-center gap-1 group/link">
                            View All Services 
                            <ArrowRight size={12} strokeWidth={1.5} className="group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Standard Navigation Links */}
              <Link
                href="/work"
                className={`relative py-2 px-1 transition-colors ${
                  pathname === "/work" ? "text-[#10B891] font-bold" : "text-zinc-600 hover:text-[#10B891]"
                }`}
              >
                Our Work
                {pathname === "/work" && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B891] to-[#059669] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              <Link
                href="/about"
                className={`relative py-2 px-1 transition-colors ${
                  pathname === "/about" ? "text-[#10B891] font-bold" : "text-zinc-600 hover:text-[#10B891]"
                }`}
              >
                Developers Profile
                {pathname === "/about" && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B891] to-[#059669] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              <Link
                href="/services/digital-marketing"
                className={`relative py-2 px-1 transition-colors ${
                  pathname === "/services/digital-marketing" ? "text-[#10B891] font-bold" : "text-zinc-600 hover:text-[#10B891]"
                }`}
              >
                Digital Marketing
                {pathname === "/services/digital-marketing" && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B891] to-[#059669] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              <Link
                href="/sandbox"
                className={`relative py-2 px-1 transition-colors flex items-center gap-1.5 ${
                  pathname === "/sandbox" ? "text-[#10B891] font-bold" : "text-zinc-600 hover:text-[#10B891]"
                }`}
              >
                <Activity size={14} strokeWidth={1.25} className="text-[#10B891] animate-pulse" />
                Utility Tools
                {pathname === "/sandbox" && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B891] to-[#059669] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </div>

            {/* Action Button & Mobile Toggle Container */}
            <div className="flex items-center gap-4">
              {session ? (
                /* Logged In - Avatar Dropdown */
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200/80 rounded-full bg-white hover:bg-zinc-50 transition-colors text-xs font-semibold text-zinc-700 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                      {fullName ? fullName[0] : (session.user?.email ? session.user.email[0] : "U")}
                    </div>
                    <span className="max-w-[100px] truncate">{fullName || "Nomad User"}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-44 p-1 bg-zinc-100 border border-zinc-200/80 rounded-2xl shadow-lg z-50 flex"
                      >
                        <div className="w-full bg-white border border-white/50 rounded-[calc(1rem-0.25rem)] p-1.5 shadow-inner text-xs space-y-1">
                          <Link
                            href={`/dashboard/${role || "client"}`}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
                          >
                            <LayoutDashboard size={13} />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-medium text-left transition-colors"
                          >
                            <LogOut size={13} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Logged Out - Auth Entry Actions */
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/auth/sign-in"
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/join-as-developer"
                      className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 text-xs font-bold rounded-full bg-zinc-950 hover:bg-black text-white border border-zinc-800 transition-all shadow-md shadow-black/10"
                    >
                      <span>Join as Developer</span>
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#E8823A] transition-colors">
                        <ArrowUpRight size={10} strokeWidth={1.5} className="text-white group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 transition-colors relative z-50 focus:outline-none"
                aria-label="Toggle Menu"
              >
                <div className="w-4 h-3 flex flex-col justify-between relative">
                  <motion.span
                    animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-0.5 bg-zinc-800 rounded-full origin-left"
                  />
                  <motion.span
                    animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-0.5 bg-zinc-800 rounded-full"
                  />
                  <motion.span
                    animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-0.5 bg-zinc-800 rounded-full origin-left"
                  />
                </div>
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl flex flex-col justify-start pt-28 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-lg font-bold pb-12 font-sans">
              
              {/* Mobile Services Accordion */}
              <div className="border-b border-zinc-100 pb-4">
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full flex items-center justify-between py-2 text-zinc-800 hover:text-[#10B891]"
                >
                  <span className="flex items-center gap-2">Services</span>
                  <motion.span
                    animate={{ rotate: isMobileServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} strokeWidth={1.5} className="text-zinc-500" />
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden pl-4 border-l border-zinc-100 mt-3 flex flex-col gap-4"
                    >
                      {servicesCategories.map((category) => (
                        <div key={category.title} className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {category.title}
                          </span>
                          <div className="flex flex-col gap-2 pl-2">
                            {category.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-sm font-semibold transition-colors ${
                                  pathname === item.href ? "text-[#10B891]" : "text-zinc-500 hover:text-zinc-900"
                                }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-[#10B891] hover:text-[#059669] py-2 border-t border-zinc-100 mt-2 flex items-center gap-1"
                      >
                        View All Services <ArrowRight size={14} strokeWidth={1.5} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Normal Links */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="border-b border-zinc-100 pb-4"
              >
                <Link
                  href="/work"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-2 transition-colors ${
                    pathname === "/work" ? "text-[#10B891]" : "text-zinc-800 hover:text-[#10B891]"
                  }`}
                >
                  Our Work
                  <ArrowRight size={16} strokeWidth={1.25} className="text-zinc-300" />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="border-b border-zinc-100 pb-4"
              >
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-2 transition-colors ${
                    pathname === "/about" ? "text-[#10B891]" : "text-zinc-800 hover:text-[#10B891]"
                  }`}
                >
                  Developers Profile
                  <ArrowRight size={16} strokeWidth={1.25} className="text-zinc-300" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
                className="border-b border-zinc-100 pb-4"
              >
                <Link
                  href="/services/digital-marketing"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-2 transition-colors ${
                    pathname === "/services/digital-marketing" ? "text-[#10B891]" : "text-zinc-800 hover:text-[#10B891]"
                  }`}
                >
                  Digital Marketing
                  <ArrowRight size={16} strokeWidth={1.25} className="text-zinc-300" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="border-b border-zinc-100 pb-4"
              >
                <Link
                  href="/sandbox"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between py-2 transition-colors ${
                    pathname === "/sandbox" ? "text-[#10B891]" : "text-zinc-800 hover:text-[#10B891]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Activity size={18} strokeWidth={1.25} className="text-[#10B891] animate-pulse" />
                    Utility Tools
                  </span>
                  <ArrowRight size={16} strokeWidth={1.25} className="text-zinc-300" />
                </Link>
              </motion.div>
              
              {session ? (
                <div className="space-y-3 pt-4 mt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Link
                      href={`/dashboard/${role || "client"}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-[#10B891] hover:bg-[#059669] text-white font-extrabold text-sm transition-colors shadow-lg"
                    >
                      <LayoutDashboard size={14} strokeWidth={1.5} />
                      Go to Dashboard
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-extrabold text-sm transition-colors border border-zinc-200 shadow-sm"
                    >
                      <LogOut size={14} strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4 mt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Link
                      href="/auth/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full h-11 rounded-full border border-zinc-200 bg-white text-zinc-800 font-extrabold text-sm hover:bg-zinc-50 transition-colors shadow-sm"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                  >
                    <Link
                      href="/join-as-developer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full h-11 rounded-full bg-zinc-950 hover:bg-black text-white font-extrabold text-sm transition-colors shadow-lg"
                    >
                      Join as Dev
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
