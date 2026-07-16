import { useState, useRef, useEffect } from "react";
import { Star, Heart, Lightbulb, PartyPopper, Sparkles } from "lucide-react";

export const REACTIONS = [
  { type: "appreciate", label: "Appreciate", icon: Star, color: "var(--react-appreciate)" },
  { type: "support", label: "Support", icon: Heart, color: "var(--react-support)" },
  { type: "insightful", label: "Insightful", icon: Lightbulb, color: "var(--react-insightful)" },
  { type: "celebrate", label: "Celebrate", icon: PartyPopper, color: "var(--react-celebrate)" },
  { type: "curious", label: "Curious", icon: Sparkles, color: "var(--react-curious)" },
];

const ReactionPicker = ({ myReaction, onReact }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = REACTIONS.find((r) => r.type === myReaction);
  const CurrentIcon = current?.icon || Star;

  const handleMainClick = () => {
    if (myReaction) {
      onReact(myReaction); // toggling same reaction removes it
    } else {
      onReact("appreciate");
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setOpen(true), 250);
      }}
      onMouseLeave={() => {
        clearTimeout(timeoutRef.current);
        setOpen(false);
      }}
    >
      {open && (
        <div
          className="card fade-in"
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            marginBottom: 8,
            display: "flex",
            gap: 4,
            padding: 6,
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {REACTIONS.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.type}
                title={r.label}
                onClick={() => {
                  onReact(r.type);
                  setOpen(false);
                }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: myReaction === r.type ? r.color + "22" : "transparent",
                  transition: "transform 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Icon size={19} color={r.color} fill={r.color} fillOpacity={0.15} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={handleMainClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          color: current ? current.color : "var(--muted)",
        }}
      >
        <CurrentIcon
          size={17}
          color={current ? current.color : "var(--muted)"}
          fill={current ? current.color : "none"}
          fillOpacity={current ? 0.2 : 0}
        />
        {current ? current.label : "Appreciate"}
      </button>
    </div>
  );
};

export default ReactionPicker;
