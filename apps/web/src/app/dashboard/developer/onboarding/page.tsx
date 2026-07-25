"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { fetchSkillsTaxonomyAction, fetchServicesTaxonomyAction, submitDeveloperOnboardingAction } from "@/app/actions";
import { ArrowLeft, ArrowRight, Loader2, Upload, AlertCircle, Sparkles, Check } from "lucide-react";

export default function DeveloperOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User session state
  const [userId, setUserId] = useState<string | null>(null);

  // Taxonomy states loaded from DB
  const [skillsOptions, setSkillsOptions] = useState<any[]>([]);
  const [servicesOptions, setServicesOptions] = useState<any[]>([]);

  // Step 1: Personal info
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Step 2: Professional links
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Step 3: Credentials & Taxonomy
  const [highestQualification, setHighestQualification] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
        return;
      }
      setUserId(user.id);

      // Pre-fill profile name if exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (profile) {
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      // Pre-fill developer fields if they exist
      const { data: devProfile } = await supabase
        .from("developer_profiles")
        .select("*")
        .eq("profile_id", user.id)
        .single();
      if (devProfile) {
        setBio(devProfile.bio || "");
        setGithubUrl(devProfile.github_url || "");
        setLinkedinUrl(devProfile.linkedin_url || "");
        setPortfolioUrl(devProfile.portfolio_url || "");
        setHighestQualification(devProfile.highest_qualification || "");
        setInstitutionName(devProfile.institution_name || "");
        setYearsExperience(devProfile.years_experience ? String(devProfile.years_experience) : "");
        setCertifications(devProfile.certifications || []);
        setSelectedSkills(devProfile.primary_skills || []);
        setSelectedServices(devProfile.service_capabilities || []);
      }

      // Load taxonomies
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
    loadData();
  }, [router, supabase]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addCertification = () => {
    if (certificationInput.trim() && !certifications.includes(certificationInput.trim())) {
      setCertifications([...certifications, certificationInput.trim()]);
      setCertificationInput("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert));
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const toggleService = (serviceSlug: string) => {
    if (selectedServices.includes(serviceSlug)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceSlug));
    } else {
      setSelectedServices([...selectedServices, serviceSlug]);
    }
  };

  const validateStep1 = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!bio.trim() || bio.length < 20) return "Bio must be at least 20 characters.";
    return null;
  };

  const validateStep2 = () => {
    if (!githubUrl.trim()) return "GitHub profile URL is required.";
    if (!linkedinUrl.trim()) return "LinkedIn profile URL is required.";
    return null;
  };

  const validateStep3 = () => {
    if (!highestQualification.trim()) return "Please specify your highest qualification.";
    if (!institutionName.trim()) return "Institution name is required.";
    if (!yearsExperience.trim() || isNaN(Number(yearsExperience))) return "Years of experience must be a valid number.";
    if (selectedSkills.length === 0) return "Please select at least one primary skill.";
    if (selectedServices.length === 0) return "Please select at least one service capability.";
    return null;
  };

  const handleNext = () => {
    setError(null);
    let validationErr = null;
    if (step === 1) validationErr = validateStep1();
    if (step === 2) validationErr = validateStep2();

    if (validationErr) {
      setError(validationErr);
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError(null);
    const validationErr = validateStep3();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setSubmitting(true);

    const payload = {
      fullName,
      avatarUrl,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      highestQualification,
      institutionName,
      certifications,
      yearsExperience: Number(yearsExperience) || 0.0,
      primarySkills: selectedSkills,
      techStack: selectedSkills, // Reuses primary skills for techStack tags
      serviceCapabilities: selectedServices,
    };

    const result = await submitDeveloperOnboardingAction(payload);

    if (!result.success) {
      setError(result.error || "Failed to submit onboarding profile.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/developer");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] min-h-screen text-xs text-zinc-400">
        Loading developer credentials profile setup...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[#10B891] font-bold uppercase tracking-wider">Onboarding Wizard</span>
            <h1 className="text-xl font-bold tracking-tight">Developer Credentials Setup</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold">
            <span className={step >= 1 ? "text-zinc-900" : ""}>01</span>
            <span className="w-4 h-px bg-zinc-200" />
            <span className={step >= 2 ? "text-zinc-900" : ""}>02</span>
            <span className="w-4 h-px bg-zinc-200" />
            <span className={step >= 3 ? "text-zinc-900" : ""}>03</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm">
          <div className="bg-white border border-white/40 rounded-[calc(2.5rem-0.25rem)] p-8 shadow-inner space-y-6">
            
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Step 1 — Personal Telemetry</h2>
                
                {/* Avatar upload */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Avatar Photo</span>
                  <div className="flex items-center gap-6">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-zinc-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                        <Upload size={20} />
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-all flex items-center gap-2">
                      {uploadingAvatar ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                      Upload Avatar
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Nomad"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="bio">
                    Professional Statement / Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Full stack architect specializing in distributed databases, microservice meshes, and next-generation frontend portals..."
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                  />
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-[#09090B] hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Continue
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* STEP 2: Social/Professional Links */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Step 2 — Remote Node Identifiers</h2>
                
                {/* GitHub */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="githubUrl">
                    GitHub Profile URL *
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="linkedinUrl">
                    LinkedIn Profile URL *
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                  />
                </div>

                {/* Portfolio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="portfolioUrl">
                    Personal Portfolio Website URL (Optional)
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-[#09090B] hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Professional Credentials & Taxonomies */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Step 3 — Professional Registry Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Qualification */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="highestQualification">
                      Highest Qualification
                    </label>
                    <input
                      id="highestQualification"
                      type="text"
                      value={highestQualification}
                      onChange={(e) => setHighestQualification(e.target.value)}
                      placeholder="B.S. Computer Science"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                    />
                  </div>

                  {/* Institution */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="institutionName">
                      Institution Name
                    </label>
                    <input
                      id="institutionName"
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="Stanford University"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Years Experience */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="yearsExperience">
                      Years of Experience
                    </label>
                    <input
                      id="yearsExperience"
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                    />
                  </div>

                  {/* Certifications Array */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="certifications">
                      Professional Certifications
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="certifications"
                        type="text"
                        value={certificationInput}
                        onChange={(e) => setCertificationInput(e.target.value)}
                        placeholder="AWS Solutions Architect"
                        className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className="px-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    {/* Certs list */}
                    {certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {certifications.map((cert) => (
                          <span
                            key={cert}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-semibold text-zinc-600"
                          >
                            {cert}
                            <button type="button" onClick={() => removeCertification(cert)} className="text-zinc-400 hover:text-zinc-600 font-bold">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Skills (Multi-select) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Primary Stack Skills</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {skillsOptions.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.name);
                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() => toggleSkill(skill.name)}
                          className={`p-3 border rounded-xl text-xs text-left font-bold transition-all flex items-center justify-between ${
                            isSelected ? "border-[#10B891] bg-[#10B891]/5 text-[#10B891]" : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          <span>{skill.name}</span>
                          {isSelected && <Check size={12} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service capabilities (Checkboxes) */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Specialized service capabilities</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesOptions.map((service) => {
                      const isSelected = selectedServices.includes(service.slug);
                      return (
                        <button
                          key={service.slug}
                          type="button"
                          onClick={() => toggleService(service.slug)}
                          className={`p-4 border rounded-xl text-left transition-all flex items-start gap-3 ${
                            isSelected ? "border-[#10B891] bg-[#10B891]/5 text-[#10B891]" : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "border-[#10B891] bg-[#10B891]" : "border-zinc-300"
                          }`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </span>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-zinc-950">{service.title}</span>
                            <p className="text-[9px] text-zinc-400 leading-normal">{service.category}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 bg-[#09090B] hover:bg-zinc-800 disabled:bg-zinc-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Registering Node...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Complete Setup
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
