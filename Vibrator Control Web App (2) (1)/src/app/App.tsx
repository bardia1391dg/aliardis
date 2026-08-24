import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Power,
  Timer,
  BarChart2,
  Settings,
  LogOut,
  Zap,
  Moon,
  Sun,
  Globe,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Activity,
} from "lucide-react";

// ─── i18n ──────────────────────────────────────────────────────────────────────
const translations = {
  en: {
    dir: "ltr",
    font: "'Inter', sans-serif",
    appTitle: "VibeControl Pro",
    login: "Sign In",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    loginError: "Invalid credentials.",
    dashboard: "Dashboard",
    channels: "Channels",
    timer: "Timer",
    chart: "Usage Chart",
    settings: "Settings",
    logout: "Logout",
    channel: "Channel",
    power: "Power",
    intensity: "Intensity",
    on: "ON",
    off: "OFF",
    hz: "Hz",
    timerLabel: "Session Timer",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    colorTheme: "Color Theme",
    themeMode: "Theme Mode",
    language: "Language",
    dark: "Dark",
    light: "Light",
    blue: "Blue",
    green: "Green",
    red: "Red",
    purple: "Purple",
    orange: "Orange",
    chartTitle: "Power Usage Over Time",
    totalPower: "Total Power",
    activeChannels: "Active Channels",
    sessionTime: "Session Time",
    welcomeBack: "Welcome back",
    allChannels: "All Channels",
    masterOff: "All Off",
    masterOn: "All On",
    massageModes: "Massage Modes",
    massageModesTitle: "Massage Presets",
    massageModesDesc: "Tap a preset to instantly apply it, then fine-tune each channel.",
    modeApplied: "Applied",
    modeAfterWaking: "After Waking Up",
    modeBeforeSleep: "Before Sleep",
    modeAfterWorkout: "After Workout",
    modeRest: "Rest",
    modeWalking: "Walking",
    modeDuringSleep: "During Sleep",
    modeMeditation: "Meditation",
    modeEnergyBoost: "Energy Boost",
    modeAfterWakingDesc: "High intensity to kickstart your morning",
    modeBeforeSleepDesc: "Low intensity to ease into rest",
    modeAfterWorkoutDesc: "Very high intensity for muscle recovery",
    modeRestDesc: "Medium intensity for comfortable relaxation",
    modeWalkingDesc: "Light intensity for gentle on-the-go relief",
    modeDuringSleepDesc: "Very low intensity for uninterrupted sleep",
    modeMeditationDesc: "Gentle rhythmic vibration for mindfulness",
    modeEnergyBoostDesc: "Strong stimulating vibration to energize",
    intensityRange: "Intensity",
    goToChannels: "Fine-tune Channels",
  },
  fa: {
    dir: "rtl",
    font: "'Vazirmatn', sans-serif",
    appTitle: "ویب‌کنترل پرو",
    login: "ورود به سیستم",
    username: "نام کاربری",
    password: "رمز عبور",
    loginBtn: "ورود",
    loginError: "نام کاربری یا رمز عبور اشتباه است.",
    dashboard: "داشبورد",
    channels: "کانال‌ها",
    timer: "تایمر",
    chart: "نمودار مصرف",
    settings: "تنظیمات",
    logout: "خروج",
    channel: "کانال",
    power: "توان",
    intensity: "شدت",
    on: "روشن",
    off: "خاموش",
    hz: "هرتز",
    timerLabel: "تایمر جلسه",
    start: "شروع",
    pause: "مکث",
    reset: "ریست",
    colorTheme: "تم رنگی",
    themeMode: "حالت تم",
    language: "زبان",
    dark: "تاریک",
    light: "روشن",
    blue: "آبی",
    green: "سبز",
    red: "قرمز",
    purple: "بنفش",
    orange: "نارنجی",
    chartTitle: "مصرف توان در طول زمان",
    totalPower: "توان کل",
    activeChannels: "کانال‌های فعال",
    sessionTime: "زمان جلسه",
    welcomeBack: "خوش آمدید",
    allChannels: "همه کانال‌ها",
    masterOff: "همه خاموش",
    masterOn: "همه روشن",
    massageModes: "حالت‌های ماساژ",
    massageModesTitle: "پیش‌تنظیم‌های ماساژ",
    massageModesDesc: "روی یک پیش‌تنظیم ضربه بزنید تا فوری اعمال شود، سپس هر کانال را تنظیم کنید.",
    modeApplied: "اعمال شد",
    modeAfterWaking: "بعد از بیدار شدن",
    modeBeforeSleep: "قبل از خواب",
    modeAfterWorkout: "بعد از ورزش",
    modeRest: "استراحت",
    modeWalking: "پیاده‌روی",
    modeDuringSleep: "حین خواب",
    modeMeditation: "مدیتیشن",
    modeEnergyBoost: "افزایش انرژی",
    modeAfterWakingDesc: "شدت بالا برای شروع انرژیک صبح",
    modeBeforeSleepDesc: "شدت پایین برای آرامش قبل از خواب",
    modeAfterWorkoutDesc: "شدت خیلی بالا برای ریکاوری عضلات",
    modeRestDesc: "شدت متوسط برای آرامش راحت",
    modeWalkingDesc: "شدت سبک برای تسکین ملایم در حین حرکت",
    modeDuringSleepDesc: "شدت خیلی پایین برای خواب بدون وقفه",
    modeMeditationDesc: "لرزش ریتمیک ملایم برای آگاهی",
    modeEnergyBoostDesc: "لرزش قوی برای تقویت انرژی",
    intensityRange: "شدت",
    goToChannels: "تنظیم دقیق کانال‌ها",
  },
};

type Lang = "en" | "fa";
type ColorTheme = "blue" | "green" | "red" | "purple" | "orange";
type ThemeMode = "dark" | "light";

// ─── Color Palettes ────────────────────────────────────────────────────────────
const colorPalettes: Record<ColorTheme, { primary: string; accent: string; ring: string; glow: string; chart: string[] }> = {
  blue: {
    primary: "#3b82f6",
    accent: "#2563eb",
    ring: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
    chart: ["#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#bfdbfe"],
  },
  green: {
    primary: "#10b981",
    accent: "#059669",
    ring: "#10b981",
    glow: "rgba(16,185,129,0.35)",
    chart: ["#10b981", "#34d399", "#6ee7b7", "#065f46", "#a7f3d0"],
  },
  red: {
    primary: "#ef4444",
    accent: "#dc2626",
    ring: "#ef4444",
    glow: "rgba(239,68,68,0.35)",
    chart: ["#ef4444", "#f87171", "#fca5a5", "#991b1b", "#fee2e2"],
  },
  purple: {
    primary: "#8b5cf6",
    accent: "#7c3aed",
    ring: "#8b5cf6",
    glow: "rgba(139,92,246,0.35)",
    chart: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#5b21b6", "#ede9fe"],
  },
  orange: {
    primary: "#f59e0b",
    accent: "#d97706",
    ring: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    chart: ["#f59e0b", "#fbbf24", "#fcd34d", "#92400e", "#fef3c7"],
  },
};

const modePalettes: Record<ThemeMode, { bg: string; card: string; secondary: string; muted: string; mutedFg: string; fg: string; border: string; inputBg: string }> = {
  dark: {
    bg: "#0f1117",
    card: "#1a1d27",
    secondary: "#1e2235",
    muted: "#1e2235",
    mutedFg: "#6b7280",
    fg: "#e8eaf0",
    border: "rgba(255,255,255,0.08)",
    inputBg: "#1e2235",
  },
  light: {
    bg: "#f0f4ff",
    card: "#ffffff",
    secondary: "#e8eef8",
    muted: "#e8eef8",
    mutedFg: "#6b7280",
    fg: "#0f172a",
    border: "rgba(0,0,0,0.1)",
    inputBg: "#e8eef8",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(s: number) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

// ─── Channel Colors (per channel accent) ──────────────────────────────────────
const channelHues = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

// ─── Login Page ────────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
  lang,
  setLang,
  colorTheme,
  themeMode,
}: {
  onLogin: (u: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  function attempt() {
    if (user === "admin" && pass === "1234") {
      onLogin(user);
    } else {
      setErr(true);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ direction: t.dir, fontFamily: t.font, background: mode.bg, color: mode.fg }}
    >
      {/* Language toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        {(["en", "fa"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? pal.primary : mode.secondary,
              color: lang === l ? "#fff" : mode.mutedFg,
              border: `1px solid ${mode.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {l === "en" ? "English" : "فارسی"}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        style={{
          background: mode.card,
          border: `1px solid ${mode.border}`,
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: `0 0 60px ${pal.glow}`,
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: `0 0 24px ${pal.glow}`,
            }}
          >
            <Zap size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: mode.fg }}>{t.appTitle}</h1>
          <p style={{ color: mode.mutedFg, marginTop: 6, fontSize: 14 }}>{t.login}</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: mode.mutedFg, display: "block", marginBottom: 6 }}>{t.username}</label>
            <input
              value={user}
              onChange={(e) => { setUser(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: mode.inputBg,
                border: `1px solid ${err ? "#ef4444" : mode.border}`,
                borderRadius: 10,
                color: mode.fg,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: t.font,
              }}
              placeholder=""
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: mode.mutedFg, display: "block", marginBottom: 6 }}>{t.password}</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: mode.inputBg,
                border: `1px solid ${err ? "#ef4444" : mode.border}`,
                borderRadius: 10,
                color: mode.fg,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: t.font,
              }}
              placeholder=""
            />
          </div>
          {err && (
            <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{t.loginError}</p>
          )}
          <button
            onClick={attempt}
            style={{
              marginTop: 8,
              padding: "14px",
              background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: `0 4px 20px ${pal.glow}`,
              transition: "transform 0.1s",
              fontFamily: t.font,
            }}
          >
            {t.loginBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Power Slider ──────────────────────────────────────────────────────────────
function PowerSlider({
  value,
  onChange,
  color,
  themeMode,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
  themeMode: ThemeMode;
}) {
  const mode = modePalettes[themeMode];
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 4, background: mode.secondary, cursor: "pointer" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${value}%`,
          borderRadius: 4,
          background: `linear-gradient(to right, ${color}99, ${color})`,
          transition: "width 0.1s",
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          opacity: 0,
          cursor: "pointer",
          height: "100%",
          margin: 0,
        }}
      />
    </div>
  );
}

// ─── Channel Card ──────────────────────────────────────────────────────────────
function ChannelCard({
  index,
  power,
  active,
  onPowerChange,
  onToggle,
  lang,
  colorTheme,
  themeMode,
}: {
  index: number;
  power: number;
  active: boolean;
  onPowerChange: (v: number) => void;
  onToggle: () => void;
  lang: Lang;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];
  const chColor = channelHues[index];

  // Pulsing animation when active
  const pulseStyle = active
    ? { boxShadow: `0 0 0 2px ${chColor}40, 0 4px 24px ${chColor}25` }
    : { boxShadow: `0 2px 8px rgba(0,0,0,0.15)` };

  return (
    <div
      style={{
        background: mode.card,
        border: `1px solid ${active ? chColor + "50" : mode.border}`,
        borderRadius: 16,
        padding: "20px",
        transition: "all 0.3s",
        ...pulseStyle,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: active
                ? `linear-gradient(135deg, ${chColor}cc, ${chColor})`
                : mode.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
          >
            <Activity size={18} color={active ? "#fff" : mode.mutedFg} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: mode.fg }}>
              {t.channel} {index + 1}
            </div>
            <div style={{ fontSize: 12, color: mode.mutedFg }}>
              {active ? `${power} ${t.hz}` : t.off}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            border: "none",
            background: active
              ? `linear-gradient(135deg, ${chColor}cc, ${chColor})`
              : mode.secondary,
            color: active ? "#fff" : mode.mutedFg,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s",
            boxShadow: active ? `0 2px 12px ${chColor}50` : "none",
            fontFamily: t.font,
          }}
        >
          {active ? t.on : t.off}
        </button>
      </div>

      {/* Power display */}
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, color: mode.mutedFg }}>{t.power}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPowerChange(Math.max(0, power - 5))}
            style={{ background: mode.secondary, border: "none", borderRadius: 6, padding: "2px 8px", cursor: "pointer", color: mode.fg }}
          >
            <ChevronDown size={14} />
          </button>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 16, color: active ? chColor : mode.fg, minWidth: 38, textAlign: "center" }}>
            {power}%
          </span>
          <button
            onClick={() => onPowerChange(Math.min(100, power + 5))}
            style={{ background: mode.secondary, border: "none", borderRadius: 6, padding: "2px 8px", cursor: "pointer", color: mode.fg }}
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <PowerSlider value={power} onChange={onPowerChange} color={chColor} themeMode={themeMode} />

      {/* Pattern dots */}
      <div className="flex gap-1 mt-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: active && power > i * 20 ? 16 + (i * 3) : 6,
              borderRadius: 3,
              background:
                active && power > i * 20
                  ? `${chColor}${Math.round(100 + i * 30).toString(16)}`
                  : mode.secondary,
              transition: "height 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Timer ─────────────────────────────────────────────────────────────────────
function TimerPanel({
  lang,
  colorTheme,
  themeMode,
  elapsed,
  setElapsed,
}: {
  lang: Lang;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
  elapsed: number;
  setElapsed: React.Dispatch<React.SetStateAction<number>>;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, setElapsed]);

  const pct = ((elapsed % 60) / 60) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <div
      style={{
        background: mode.card,
        border: `1px solid ${mode.border}`,
        borderRadius: 16,
        padding: "24px",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Timer size={18} color={pal.primary} />
        <span style={{ fontWeight: 600, color: mode.fg }}>{t.timerLabel}</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Circular timer */}
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={70} cy={70} r={r} fill="none" stroke={mode.secondary} strokeWidth={8} />
            <circle
              cx={70}
              cy={70}
              r={r}
              fill="none"
              stroke={pal.primary}
              strokeWidth={8}
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s ease", filter: `drop-shadow(0 0 6px ${pal.glow})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: mode.fg }}>
              {formatTime(elapsed)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: `0 4px 14px ${pal.glow}`,
              fontFamily: t.font,
            }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? t.pause : t.start}
          </button>
          <button
            onClick={() => { setRunning(false); setElapsed(0); }}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: `1px solid ${mode.border}`,
              background: mode.secondary,
              color: mode.fg,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: t.font,
            }}
          >
            <RotateCcw size={16} />
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chart ─────────────────────────────────────────────────────────────────────
function UsageChart({
  lang,
  colorTheme,
  themeMode,
  channels,
}: {
  lang: Lang;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
  channels: { power: number; active: boolean }[];
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];

  // Generate rolling 20-point history
  const [history, setHistory] = useState<Record<string, number>[]>(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const obj: Record<string, number> = { t: i };
      channels.forEach((ch, ci) => {
        obj[`ch${ci + 1}`] = ch.active ? Math.round(ch.power * (0.7 + Math.random() * 0.3)) : 0;
      });
      return obj;
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => {
        const next = [...prev.slice(1)];
        const obj: Record<string, number> = { t: (prev[prev.length - 1].t as number) + 1 };
        channels.forEach((ch, ci) => {
          obj[`ch${ci + 1}`] = ch.active ? Math.round(ch.power * (0.7 + Math.random() * 0.3)) : 0;
        });
        next.push(obj);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [channels]);

  return (
    <div
      style={{
        background: mode.card,
        border: `1px solid ${mode.border}`,
        borderRadius: 16,
        padding: "24px",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} color={pal.primary} />
        <span style={{ fontWeight: 600, color: mode.fg }}>{t.chartTitle}</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            {channelHues.map((color, i) => (
              <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={mode.border} />
          <XAxis dataKey="t" hide />
          <YAxis domain={[0, 100]} tick={{ fill: mode.mutedFg, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: mode.card,
              border: `1px solid ${mode.border}`,
              borderRadius: 10,
              color: mode.fg,
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: mode.mutedFg, paddingTop: 12 }}
            formatter={(val) => `${t.channel} ${val.replace("ch", "")}`}
          />
          {channelHues.map((color, i) => (
            <Area
              key={i}
              type="monotone"
              dataKey={`ch${i + 1}`}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad${i})`}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Settings Panel ────────────────────────────────────────────────────────────
function SettingsPanel({
  lang,
  setLang,
  colorTheme,
  setColorTheme,
  themeMode,
  setThemeMode,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];

  const colorOptions: { id: ColorTheme; label: string; color: string }[] = [
    { id: "blue", label: t.blue, color: "#3b82f6" },
    { id: "green", label: t.green, color: "#10b981" },
    { id: "red", label: t.red, color: "#ef4444" },
    { id: "purple", label: t.purple, color: "#8b5cf6" },
    { id: "orange", label: t.orange, color: "#f59e0b" },
  ];

  return (
    <div
      style={{
        background: mode.card,
        border: `1px solid ${mode.border}`,
        borderRadius: 16,
        padding: "24px",
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings size={18} color={pal.primary} />
        <span style={{ fontWeight: 600, color: mode.fg }}>{t.settings}</span>
      </div>

      {/* Color Theme */}
      <div className="mb-6">
        <div style={{ fontSize: 13, color: mode.mutedFg, marginBottom: 10 }}>{t.colorTheme}</div>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setColorTheme(opt.id)}
              title={opt.label}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: colorTheme === opt.id ? `2px solid ${opt.color}` : `2px solid transparent`,
                background: opt.color,
                cursor: "pointer",
                boxShadow: colorTheme === opt.id ? `0 0 12px ${opt.color}80` : "none",
                transform: colorTheme === opt.id ? "scale(1.15)" : "scale(1)",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Theme Mode */}
      <div className="mb-6">
        <div style={{ fontSize: 13, color: mode.mutedFg, marginBottom: 10 }}>{t.themeMode}</div>
        <div className="flex gap-2">
          {(["dark", "light"] as ThemeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setThemeMode(m)}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: `1px solid ${themeMode === m ? pal.primary : mode.border}`,
                background: themeMode === m ? pal.primary : mode.secondary,
                color: themeMode === m ? "#fff" : mode.fg,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
                fontFamily: t.font,
              }}
            >
              {m === "dark" ? <Moon size={14} /> : <Sun size={14} />}
              {m === "dark" ? t.dark : t.light}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <div style={{ fontSize: 13, color: mode.mutedFg, marginBottom: 10 }}>{t.language}</div>
        <div className="flex gap-2">
          {(["en", "fa"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: `1px solid ${lang === l ? pal.primary : mode.border}`,
                background: lang === l ? pal.primary : mode.secondary,
                color: lang === l ? "#fff" : mode.fg,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
                fontFamily: t.font,
              }}
            >
              <Globe size={14} />
              {l === "en" ? "English" : "فارسی"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Massage Modes ─────────────────────────────────────────────────────────────
type ModePreset = {
  id: string;
  emoji: string;
  nameKey: keyof typeof translations.en;
  descKey: keyof typeof translations.en;
  color: string;
  bgGradient: string;
  channels: { power: number; active: boolean }[];
};

const MASSAGE_PRESETS: ModePreset[] = [
  {
    id: "after-waking",
    emoji: "🌅",
    nameKey: "modeAfterWaking",
    descKey: "modeAfterWakingDesc",
    color: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #f59e0b22, #fbbf2412)",
    channels: [
      { power: 75, active: true },   // avg = 375/5 = 75 ✓
      { power: 70, active: true },
      { power: 80, active: true },
      { power: 75, active: true },
      { power: 75, active: true },
    ],
  },
  {
    id: "before-sleep",
    emoji: "🌙",
    nameKey: "modeBeforeSleep",
    descKey: "modeBeforeSleepDesc",
    color: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #8b5cf622, #a78bfa12)",
    channels: [
      { power: 25, active: true },   // avg = 100/4 = 25 ✓
      { power: 20, active: true },
      { power: 30, active: true },
      { power: 25, active: true },
      { power: 20, active: false },
    ],
  },
  {
    id: "after-workout",
    emoji: "💪",
    nameKey: "modeAfterWorkout",
    descKey: "modeAfterWorkoutDesc",
    color: "#ef4444",
    bgGradient: "linear-gradient(135deg, #ef444422, #f8717112)",
    channels: [
      { power: 85, active: true },   // avg = 425/5 = 85 ✓
      { power: 90, active: true },
      { power: 80, active: true },
      { power: 90, active: true },
      { power: 80, active: true },
    ],
  },
  {
    id: "rest",
    emoji: "🛋️",
    nameKey: "modeRest",
    descKey: "modeRestDesc",
    color: "#10b981",
    bgGradient: "linear-gradient(135deg, #10b98122, #34d39912)",
    channels: [
      { power: 50, active: true },   // avg = 200/4 = 50 ✓
      { power: 50, active: true },
      { power: 40, active: false },
      { power: 55, active: true },
      { power: 45, active: true },
    ],
  },
  {
    id: "walking",
    emoji: "🚶",
    nameKey: "modeWalking",
    descKey: "modeWalkingDesc",
    color: "#3b82f6",
    bgGradient: "linear-gradient(135deg, #3b82f622, #60a5fa12)",
    channels: [
      { power: 25, active: true },   // avg = 75/3 = 25 ✓
      { power: 20, active: false },
      { power: 30, active: true },
      { power: 20, active: true },
      { power: 20, active: false },
    ],
  },
  {
    id: "during-sleep",
    emoji: "😴",
    nameKey: "modeDuringSleep",
    descKey: "modeDuringSleepDesc",
    color: "#6366f1",
    bgGradient: "linear-gradient(135deg, #6366f122, #818cf812)",
    channels: [
      { power: 5,  active: true },   // avg = 15/3 = 5 ✓
      { power: 5,  active: true },
      { power: 10, active: false },
      { power: 5,  active: true },
      { power: 5,  active: false },
    ],
  },
  {
    id: "meditation",
    emoji: "🧘",
    nameKey: "modeMeditation",
    descKey: "modeMeditationDesc",
    color: "#ec4899",
    bgGradient: "linear-gradient(135deg, #ec489922, #f472b612)",
    channels: [
      { power: 15, active: true },   // avg = 75/5 = 15 ✓
      { power: 15, active: true },
      { power: 20, active: true },
      { power: 10, active: true },
      { power: 15, active: true },
    ],
  },
  {
    id: "energy-boost",
    emoji: "⚡",
    nameKey: "modeEnergyBoost",
    descKey: "modeEnergyBoostDesc",
    color: "#f97316",
    bgGradient: "linear-gradient(135deg, #f9731622, #fb923c12)",
    channels: [
      { power: 90, active: true },   // avg = 425/5 = 85 ✓
      { power: 80, active: true },
      { power: 90, active: true },
      { power: 85, active: true },
      { power: 80, active: true },
    ],
  },
];

function MassageModesPanel({
  lang,
  colorTheme,
  themeMode,
  onApply,
  onGoToChannels,
}: {
  lang: Lang;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
  onApply: (preset: ModePreset) => void;
  onGoToChannels: () => void;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [justApplied, setJustApplied] = useState<string | null>(null);

  function apply(preset: ModePreset) {
    onApply(preset);
    setActiveId(preset.id);
    setJustApplied(preset.id);
    setTimeout(() => setJustApplied(null), 1800);
  }

  // average power across active channels of a preset
  function avgPower(preset: ModePreset) {
    const active = preset.channels.filter((c) => c.active);
    return active.length
      ? Math.round(active.reduce((s, c) => s + c.power, 0) / active.length)
      : 0;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: mode.fg, margin: 0 }}>{t.massageModesTitle}</h2>
        <p style={{ fontSize: 13, color: mode.mutedFg, marginTop: 6 }}>{t.massageModesDesc}</p>
      </div>

      {/* Preset grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
        {MASSAGE_PRESETS.map((preset) => {
          const isSelected = activeId === preset.id;
          const isFlashing = justApplied === preset.id;
          const avg = avgPower(preset);
          const activeCount = preset.channels.filter((c) => c.active).length;

          return (
            <button
              key={preset.id}
              onClick={() => apply(preset)}
              style={{
                textAlign: t.dir === "rtl" ? "right" : "left",
                background: isSelected ? preset.bgGradient : mode.card,
                border: `1.5px solid ${isSelected ? preset.color + "70" : mode.border}`,
                borderRadius: 18,
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: isSelected
                  ? `0 0 0 2px ${preset.color}30, 0 6px 24px ${preset.color}20`
                  : "0 2px 8px rgba(0,0,0,0.12)",
                transform: isFlashing ? "scale(0.97)" : "scale(1)",
                position: "relative",
                overflow: "hidden",
                fontFamily: t.font,
              }}
            >
              {/* Selected shimmer */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: preset.bgGradient,
                    opacity: 0.6,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Applied flash badge */}
              {isFlashing && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: preset.color,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 20,
                    letterSpacing: "0.05em",
                  }}
                >
                  {t.modeApplied} ✓
                </div>
              )}

              <div style={{ position: "relative" }}>
                {/* Emoji + name row */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: `${preset.color}20`,
                      border: `1px solid ${preset.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {preset.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: isSelected ? preset.color : mode.fg,
                        lineHeight: 1.3,
                        transition: "color 0.25s",
                      }}
                    >
                      {t[preset.nameKey] as string}
                    </div>
                    <div style={{ fontSize: 11, color: mode.mutedFg, marginTop: 3, lineHeight: 1.4 }}>
                      {t[preset.descKey] as string}
                    </div>
                  </div>
                </div>

                {/* Intensity bar */}
                <div style={{ marginBottom: 10 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 10, color: mode.mutedFg, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {t.intensityRange}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: preset.color,
                      }}
                    >
                      {avg}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: mode.secondary,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${avg}%`,
                        borderRadius: 3,
                        background: `linear-gradient(to right, ${preset.color}88, ${preset.color})`,
                        transition: "width 0.4s ease",
                        boxShadow: isSelected ? `0 0 8px ${preset.color}80` : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Channel dots */}
                <div className="flex items-center gap-1">
                  {preset.channels.map((ch, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: ch.active ? `${channelHues[ci]}cc` : mode.secondary,
                        border: `1px solid ${ch.active ? channelHues[ci] : mode.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: ch.active ? "#fff" : mode.mutedFg,
                      }}
                    >
                      {ci + 1}
                    </div>
                  ))}
                  <span style={{ fontSize: 10, color: mode.mutedFg, marginLeft: 4 }}>
                    {activeCount}/5
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Go to channels CTA — only shown when a preset is active */}
      {activeId && (
        <div
          style={{
            background: mode.card,
            border: `1px solid ${mode.border}`,
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: mode.fg }}>
              {MASSAGE_PRESETS.find((p) => p.id === activeId)?.emoji}{" "}
              {t[MASSAGE_PRESETS.find((p) => p.id === activeId)!.nameKey] as string}
            </div>
            <div style={{ fontSize: 12, color: mode.mutedFg, marginTop: 2 }}>{t.massageModesDesc}</div>
          </div>
          <button
            onClick={onGoToChannels}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 14px ${pal.glow}`,
              fontFamily: t.font,
              flexShrink: 0,
            }}
          >
            {t.goToChannels} →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
type Tab = "channels" | "chart" | "settings" | "modes";

function Dashboard({
  user,
  onLogout,
  lang,
  setLang,
  colorTheme,
  setColorTheme,
  themeMode,
  setThemeMode,
}: {
  user: string;
  onLogout: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
}) {
  const t = translations[lang];
  const pal = colorPalettes[colorTheme];
  const mode = modePalettes[themeMode];
  const [tab, setTab] = useState<Tab>("channels");
  const [elapsed, setElapsed] = useState(0);

  const [channels, setChannels] = useState([
    { power: 60, active: true },
    { power: 40, active: false },
    { power: 75, active: true },
    { power: 30, active: false },
    { power: 50, active: true },
  ]);

  const updatePower = useCallback((i: number, v: number) => {
    setChannels((prev) => prev.map((ch, ci) => (ci === i ? { ...ch, power: v } : ch)));
  }, []);

  const toggleChannel = useCallback((i: number) => {
    setChannels((prev) => prev.map((ch, ci) => (ci === i ? { ...ch, active: !ch.active } : ch)));
  }, []);

  const activeCount = channels.filter((c) => c.active).length;
  const totalPower = channels.reduce((sum, c) => sum + (c.active ? c.power : 0), 0);

  const navItems: { id: Tab; icon: typeof BarChart2; label: string }[] = [
    { id: "channels", icon: Power,    label: t.channels },
    { id: "chart",    icon: BarChart2, label: t.chart },
    { id: "settings", icon: Settings, label: t.settings },
    { id: "modes",    icon: Zap,      label: t.massageModes },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: mode.bg,
        color: mode.fg,
        fontFamily: t.font,
        direction: t.dir,
      }}
    >
      {/* Sidebar + main layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          style={{
            width: 220,
            background: mode.card,
            borderRight: `1px solid ${mode.border}`,
            display: "flex",
            flexDirection: "column",
            padding: "24px 16px",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 12px ${pal.glow}`,
              }}
            >
              <Zap size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{t.appTitle}</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: tab === item.id ? `${pal.primary}20` : "transparent",
                    color: tab === item.id ? pal.primary : mode.mutedFg,
                    fontWeight: tab === item.id ? 600 : 400,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: t.dir === "rtl" ? "right" : "left",
                    fontFamily: t.font,
                    borderLeft: t.dir === "ltr" && tab === item.id ? `3px solid ${pal.primary}` : "3px solid transparent",
                    borderRight: t.dir === "rtl" && tab === item.id ? `3px solid ${pal.primary}` : "3px solid transparent",
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User + logout */}
          <div style={{ borderTop: `1px solid ${mode.border}`, paddingTop: 16 }}>
            <div style={{ fontSize: 13, color: mode.mutedFg, marginBottom: 8, paddingLeft: 12, paddingRight: 12 }}>
              {t.welcomeBack}, <span style={{ color: mode.fg, fontWeight: 600 }}>{user}</span>
            </div>
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: "#ef4444",
                fontSize: 14,
                cursor: "pointer",
                width: "100%",
                fontFamily: t.font,
              }}
            >
              <LogOut size={16} />
              {t.logout}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {/* Stats bar */}
          <div
            className="grid gap-4 mb-6"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {[
              { label: t.totalPower, value: `${totalPower}%`, icon: Zap, color: pal.primary },
              { label: t.activeChannels, value: `${activeCount} / 5`, icon: Activity, color: channelHues[1] },
              { label: t.sessionTime, value: formatTime(elapsed), icon: Timer, color: channelHues[2] },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    background: mode.card,
                    border: `1px solid ${mode.border}`,
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `${stat.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} color={stat.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: mode.mutedFg }}>{stat.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: mode.fg }}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === "channels" && (
            <div>
              {/* Master controls */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setChannels((prev) => prev.map((c) => ({ ...c, active: true })))}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${pal.primary}, ${pal.accent})`,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: t.font,
                  }}
                >
                  {t.masterOn}
                </button>
                <button
                  onClick={() => setChannels((prev) => prev.map((c) => ({ ...c, active: false })))}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: `1px solid ${mode.border}`,
                    background: mode.secondary,
                    color: mode.fg,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: t.font,
                  }}
                >
                  {t.masterOff}
                </button>
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {channels.map((ch, i) => (
                  <ChannelCard
                    key={i}
                    index={i}
                    power={ch.power}
                    active={ch.active}
                    onPowerChange={(v) => updatePower(i, v)}
                    onToggle={() => toggleChannel(i)}
                    lang={lang}
                    colorTheme={colorTheme}
                    themeMode={themeMode}
                  />
                ))}
              </div>

              <div className="mt-6">
                <TimerPanel lang={lang} colorTheme={colorTheme} themeMode={themeMode} elapsed={elapsed} setElapsed={setElapsed} />
              </div>
            </div>
          )}

          {tab === "chart" && (
            <UsageChart lang={lang} colorTheme={colorTheme} themeMode={themeMode} channels={channels} />
          )}

          {tab === "settings" && (
            <SettingsPanel
              lang={lang}
              setLang={setLang}
              colorTheme={colorTheme}
              setColorTheme={setColorTheme}
              themeMode={themeMode}
              setThemeMode={setThemeMode}
            />
          )}

          {tab === "modes" && (
            <MassageModesPanel
              lang={lang}
              colorTheme={colorTheme}
              themeMode={themeMode}
              onApply={(preset) => setChannels(preset.channels.map((c) => ({ ...c })))}
              onGoToChannels={() => setTab("channels")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  if (!user) {
    return (
      <LoginPage
        onLogin={setUser}
        lang={lang}
        setLang={setLang}
        colorTheme={colorTheme}
        themeMode={themeMode}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => setUser(null)}
      lang={lang}
      setLang={setLang}
      colorTheme={colorTheme}
      setColorTheme={setColorTheme}
      themeMode={themeMode}
      setThemeMode={setThemeMode}
    />
  );
}
