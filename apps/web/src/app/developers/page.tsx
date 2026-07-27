"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchSkillsTaxonomyAction, fetchServicesTaxonomyAction } from "@/app/actions";
import { Search, SlidersHorizontal, Database, User, Star, Globe, Award, GraduationCap } from "lucide-react";

export default function DevelopersDirectoryPage() {
  const supabase = createClient();

  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter taxonomies
  const [skillsOptions, setSkillsOptions] = useState<any[]>([]);
  const [servicesOptions, setServicesOptions] = useState<any[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [experienceRange, setExperienceRange] = useState("all");

  useEffect(() => {
    async function loadDirectory() {
      setLoading(true);

      // Query profiles joined with developer_profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, developer_profiles!inner(*)")
        .eq("role", "developer")
        .eq("developer_profiles.verification_status", "verified"); // Only verified directory listings

      if (error) {
        console.error("Directory fetch error:", error);
      } else if (data) {
        setDevelopers(data);
      }

      // Load filter taxonomies
      const skillsRes = await fetchSkillsTaxonomyAction();
      const servicesRes = await fetchServicesTaxonomyAction();

      if (skillsRes.success && skillsRes.data) {
        setSkillsOptions(skillsRes.data);
      }
      if (servicesRes.success && servicesRes.data) {
        setServicesOptions(servicesRes.data);
      }

      setLoading(false);
    }
    loadDirectory();
  }, [supabase]);

  // Client side search and filter pipelines
  const filteredDevelopers = developers.filter((dev) => {
    const devProfile = dev.developer_profiles;
    if (!devProfile) return false;

    // Search query
    const searchString = `${dev.full_name} ${devProfile.bio} ${devProfile.institution_name}`.toLowerCase();
    if (searchQuery && !searchString.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Skill filter
    if (selectedSkill && !devProfile.primary_skills?.includes(selectedSkill)) {
      return false;
    }

    // Service filter
    if (selectedService && !devProfile.service_capabilities?.includes(selectedService)) {
      return false;
    }

    // Experience filter
    const exp = Number(devProfile.years_experience) || 0;
    if (experienceRange === "1-3" && (exp < 1 || exp > 3)) return false;
    if (experienceRange === "3-5" && (exp < 3 || exp > 5)) return false;
    if (experienceRange === "5+" && exp < 5) return false;

    return true;
  });

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[10px] font-mono text-[#10B891] font-bold uppercase tracking-wider">Verified Nodes</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Developer Collective Directory</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Audit qualifications, stack experience, and service capabilities of our vetted distributed engineering collective.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm">
          <div className="bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 space-y-4 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Search query */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search collective..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                />
              </div>

              {/* Skills taxonomy */}
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
              >
                <option value="">-- All Skills --</option>
                {skillsOptions.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>

              {/* Service Capabilities */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
              >
                <option value="">-- Specialized Capabilities --</option>
                {servicesOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>

              {/* Experience */}
              <select
                value={experienceRange}
                onChange={(e) => setExperienceRange(e.target.value)}
                className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
              >
                <option value="all">-- Experience Level --</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3-5">3 - 5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-zinc-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredDevelopers.length === 0 ? (
          /* Empty state */
          <div className="p-16 text-center bg-white border border-zinc-200/60 rounded-3xl space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
              <Database size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900 text-sm">No Developers Found</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Try adjusting your search terms or selecting different specialized capability filters.
              </p>
            </div>
          </div>
        ) : (
          /* Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredDevelopers.map((dev) => {
              const devProfile = dev.developer_profiles;
              return (
                <div
                  key={dev.id}
                  className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm flex"
                >
                  <div className="w-full bg-white border border-white/40 rounded-[calc(2.5rem-0.25rem)] p-6 shadow-inner flex flex-col justify-between space-y-6">
                    
                    {/* Header: Avatar, Name & Qualifications */}
                    <div className="flex gap-4 items-start">
                      {dev.avatar_url ? (
                        <img
                          src={dev.avatar_url}
                          alt={dev.full_name}
                          className="w-14 h-14 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 shrink-0">
                          {dev.full_name[0]}
                        </div>
                      )}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-950 truncate">{dev.full_name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[8px] font-black uppercase text-emerald-600 tracking-wider">
                            Vetted Node
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-[10px] text-zinc-400">
                          <div className="flex items-center gap-1">
                            <GraduationCap size={12} className="shrink-0" />
                            <span className="truncate">{devProfile.highest_qualification} • {devProfile.institution_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="shrink-0 text-amber-500 fill-amber-500" />
                            <span>{devProfile.years_experience} Years Vetted Stack Experience</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Statement */}
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                      {devProfile.bio}
                    </p>

                    {/* Primary Stack Badges */}
                    {devProfile.primary_skills && (
                      <div className="flex flex-wrap gap-1">
                        {devProfile.primary_skills.slice(0, 5).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-250 text-[9px] font-semibold text-zinc-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {devProfile.primary_skills.length > 5 && (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-400">
                            +{devProfile.primary_skills.length - 5} More
                          </span>
                        )}
                      </div>
                    )}

                    {/* Certifications & Capabilities Footer */}
                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {devProfile.github_url && (
                          <a
                            href={devProfile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-950 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </a>
                        )}
                        {devProfile.linkedin_url && (
                          <a
                            href={devProfile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-950 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                          </a>
                        )}
                        {devProfile.portfolio_url && (
                          <a
                            href={devProfile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-950 transition-colors"
                          >
                            <Globe size={14} />
                          </a>
                        )}
                      </div>
                      
                      {devProfile.certifications && devProfile.certifications.length > 0 && (
                        <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-medium">
                          <Award size={12} className="text-[#10B891]" />
                          <span className="max-w-[150px] truncate">{devProfile.certifications[0]}</span>
                          {devProfile.certifications.length > 1 && <span>(+{devProfile.certifications.length - 1})</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
