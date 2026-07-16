import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/axios";

const EditProfileModal = ({ profile, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: profile.name,
    headline: profile.headline,
    about: profile.about || "",
    location: profile.location || "",
    openToWork: profile.openToWork,
    skills: profile.skills || [],
    experience: profile.experience || [],
    education: profile.education || [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
    });
  };

  const updateExperience = (i, field, value) => {
    const updated = [...form.experience];
    updated[i][field] = value;
    setForm({ ...form, experience: updated });
  };

  const removeExperience = (i) => {
    setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
  };

  const addEducation = () => {
    setForm({ ...form, education: [...form.education, { school: "", degree: "", field: "", startYear: "", endYear: "" }] });
  };

  const updateEducation = (i, field, value) => {
    const updated = [...form.education];
    updated[i][field] = value;
    setForm({ ...form, education: updated });
  };

  const removeEducation = (i) => {
    setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/users/me/update", form);
      onSaved();
    } catch {
      Swal.fire({ icon: "error", title: "Couldn't save changes" });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13.5,
    outline: "none",
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 4, display: "block" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(18,36,31,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card fade-in"
        style={{ width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", padding: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>Edit profile</h3>
          <button onClick={onClose}><X size={20} color="var(--muted)" /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Full name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Headline</label>
            <input style={inputStyle} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>About</label>
            <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
            <input type="checkbox" checked={form.openToWork} onChange={(e) => setForm({ ...form, openToWork: e.target.checked })} />
            Open to work
          </label>

          <div>
            <label style={labelStyle}>Skills</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={inputStyle}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React.js"
              />
              <button onClick={addSkill} className="btn btn-outline" style={{ padding: "8px 14px" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {form.skills.map((skill) => (
                <span key={skill} style={{ background: "var(--primary-soft)", color: "var(--primary)", fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Experience</label>
              <button onClick={addExperience} style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <Plus size={13} /> Add
              </button>
            </div>
            {form.experience.map((exp, i) => (
              <div key={i} style={{ border: "1px solid var(--border-soft)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => removeExperience(i)}><Trash2 size={13} color="var(--danger)" /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input style={inputStyle} placeholder="Job title" value={exp.title} onChange={(e) => updateExperience(i, "title", e.target.value)} />
                  <input style={inputStyle} placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={inputStyle} placeholder="Start (e.g. Jan 2024)" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
                    <input style={inputStyle} placeholder="End (or blank)" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} disabled={exp.current} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                    <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, "current", e.target.checked)} />
                    I currently work here
                  </label>
                  <textarea rows={2} style={inputStyle} placeholder="Description" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Education</label>
              <button onClick={addEducation} style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <Plus size={13} /> Add
              </button>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} style={{ border: "1px solid var(--border-soft)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => removeEducation(i)}><Trash2 size={13} color="var(--danger)" /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input style={inputStyle} placeholder="School" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                  <input style={inputStyle} placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                  <input style={inputStyle} placeholder="Field of study" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={inputStyle} placeholder="Start year" value={edu.startYear} onChange={(e) => updateEducation(i, "startYear", e.target.value)} />
                    <input style={inputStyle} placeholder="End year" value={edu.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={save} disabled={saving} className="btn btn-primary" style={{ marginTop: 8 }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
