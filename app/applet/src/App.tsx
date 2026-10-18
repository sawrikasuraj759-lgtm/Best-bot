import React, { useState, useEffect } from 'react';
import {
  Menu, Bell, Crown, Zap, Bot, Smartphone, ArrowRight,
  Clock, Gauge, Home, LayoutGrid, FolderKanban, Wallet, Settings,
  Copy, CheckCircle2, RefreshCw, X, Radio, Shield, Send, Sliders,
  MessageSquare, Trash2, Power, AlertCircle
} from 'lucide-react';

interface BotConfig {
  botName: string;
  botLogoUrl: string;
  prefix: string;
  mode: string;
  ownerNumber: string;
  plan: string;
  autoReadStatus: boolean;
  voiceAutoReplyEnabled: boolean;
  channelAutoReact: boolean;
  callDetectorEnabled: boolean;
  smartAutoReply: boolean;
  customGreetingSinhala?: string;
  customGreetingEnglish?: string;
}

interface BotStatus {
  connectionStatus: string;
  isOnline: boolean;
  pairedNumber: string | null;
  qrCodeDataUrl: string | null;
  pairingCode: string | null;
  uptimeSeconds: number;
  lastPingMs?: number;
  totalMessagesReceived: number;
  totalCommandsExecuted: number;
  totalAiQueries: number;
  activeGroupCount?: number;
  config: BotConfig;
}

export default function App() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'bots' | 'templates' | 'wallet' | 'settings'>('dashboard');
  const [selectedPlan, setSelectedPlan] = useState<'mini' | 'pro' | 'business'>('business');
  const [isPairModalOpen, setIsPairModalOpen] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('94740712934');
  const [pairingLoading, setPairingLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [coins, setCoins] = useState<number>(1630);
  const [logs, setLogs] = useState<string[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);

  // Fetch bot status from server
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatus(json.data);
          if (json.data.config?.plan) {
            setSelectedPlan(json.data.config.plan.toLowerCase() as any);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch bot status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/bot/logs');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLogs(json.data);
        }
      }
    } catch (e) {
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePair = async () => {
    if (!phoneNumber) return;
    setPairingLoading(true);
    try {
      const res = await fetch('/api/bot/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() })
      });
      const json = await res.json();
      if (json.success) {
        await fetchStatus();
      } else {
        alert(json.message || 'Pairing error');
      }
    } catch (err: any) {
      alert('Pairing request failed: ' + err.message);
    } finally {
      setPairingLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (status?.pairingCode) {
      navigator.clipboard.writeText(status.pairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleStartBot = async () => {
    try {
      await fetch('/api/bot/start', { method: 'POST' });
      fetchStatus();
    } catch (e) {}
  };

  const handleStopBot = async () => {
    try {
      await fetch('/api/bot/stop', { method: 'POST' });
      fetchStatus();
    } catch (e) {}
  };

  const handleRestartBot = async () => {
    try {
      await fetch('/api/bot/restart', { method: 'POST' });
      fetchStatus();
    } catch (e) {}
  };

  const handleClearSession = async () => {
    if (!confirm('Are you sure you want to unpair WhatsApp and clear current session?')) return;
    try {
      await fetch('/api/bot/clear-session', { method: 'POST' });
      fetchStatus();
    } catch (e) {}
  };

  const formatUptime = (seconds: number) => {
    if (!seconds) return '0h 0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans pb-24 selection:bg-cyan-500 selection:text-black">
      {/* Top Header Bar (Exact match to Screenshot 2) */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-950/40 px-4 py-3 flex items-center justify-between">
        {/* Left: Hamburger + Logo + Brand Name */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5">
            {/* Glowing Brand Icon Badge */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-[#080d1a] rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-xs font-black text-cyan-300 tracking-tighter">YH</span>
              </div>
            </div>

            {/* Brand Title: YASHI HALLS */}
            <h1 className="text-lg font-black tracking-wider text-white">
              YASHI <span className="text-cyan-400">HALLS</span>
            </h1>
          </div>
        </div>

        {/* Right: Coin Balance + Notification Bell + User Profile Badge */}
        <div className="flex items-center gap-3">
          {/* Gold Coin Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11192e] border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              $
            </div>
            <span className="text-sm font-bold text-white tracking-wide">{coins}</span>
          </div>

          {/* Bell Icon with Red Dot */}
          <button className="relative p-2 rounded-full text-slate-300 hover:text-white transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#070b14]"></span>
          </button>

          {/* User Avatar Circle with letter "L" and green online dot */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
              L
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b14]"></span>
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-4 space-y-5">
        {/* VIEW 1: DASHBOARD (Exact Replica of Screenshot 2) */}
        {activeNav === 'dashboard' && (
          <>
            {/* HERO CARD: "Your Bot Command Center" */}
            <div className="relative overflow-hidden rounded-[26px] border border-cyan-500/30 bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#0a1020] p-6 shadow-[0_0_40px_rgba(6,182,212,0.18)]">
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              {/* Fleet Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 text-[11px] font-bold tracking-wider text-cyan-300 uppercase mb-3">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>BUSINESS FLEET</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Bot</span> Command Center
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed max-w-sm mt-2">
                Ready to connect your WhatsApp?<br />
                Pair your WhatsApp number and start using your bot with powerful features and tools.
              </p>

              {/* Glowing Action Button: "PAIR WHATSAPP ➔" */}
              <button
                onClick={() => setIsPairModalOpen(true)}
                className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>PAIR WHATSAPP</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Holographic Mascot Art (Matching Screenshot 2) */}
              <div className="relative mt-8 mb-2 flex flex-col items-center justify-center">
                {/* Floating Animated Robot Head */}
                <div className="relative z-10 flex flex-col items-center animate-bounce [animation-duration:3.5s]">
                  {/* Glowing Crown on Robot */}
                  <Crown className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] -mb-1" />

                  {/* Robot Head Frame */}
                  <div className="w-32 h-20 rounded-[28px] bg-[#071326] border-2 border-cyan-400 p-2 shadow-[0_0_30px_rgba(6,182,212,0.7)] flex flex-col items-center justify-center">
                    {/* Robot Eyes (Happy Curved Arc) */}
                    <div className="flex items-center gap-5">
                      <div className="w-4 h-2 border-t-4 border-cyan-300 rounded-t-full"></div>
                      <div className="w-4 h-2 border-t-4 border-cyan-300 rounded-t-full"></div>
                    </div>
                    {/* Cute Smile */}
                    <div className="w-3 h-1.5 border-b-2 border-cyan-400 rounded-b-full mt-1.5"></div>
                  </div>
                </div>

                {/* Floating Stardust Particles */}
                <div className="absolute top-2 left-16 w-1.5 h-1.5 rounded-full bg-cyan-300 blur-[0.5px] animate-pulse"></div>
                <div className="absolute top-8 right-16 w-2 h-2 rounded-full bg-purple-400 blur-[0.5px] animate-ping [animation-duration:3s]"></div>
                <div className="absolute bottom-10 left-20 w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse"></div>

                {/* Hologram Pedestal Base Rings */}
                <div className="w-48 h-8 rounded-[100%] border-2 border-cyan-400/80 bg-gradient-to-t from-cyan-500/20 to-transparent shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center justify-center -mt-3">
                  <div className="w-36 h-5 rounded-[100%] border border-cyan-300/60 shadow-[inset_0_0_15px_rgba(6,182,212,0.6)]"></div>
                </div>
              </div>
            </div>

            {/* PLAN SWITCHER TABS (MINI / PRO / BUSINESS) */}
            <div className="bg-[#0b1222] p-1.5 rounded-full border border-slate-800/80 flex items-center justify-between gap-1 shadow-inner">
              <button
                onClick={() => setSelectedPlan('mini')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPlan === 'mini'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>MINI</span>
              </button>

              <button
                onClick={() => setSelectedPlan('pro')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPlan === 'pro'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>PRO</span>
              </button>

              <button
                onClick={() => setSelectedPlan('business')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPlan === 'business'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>BUSINESS</span>
              </button>
            </div>

            {/* BOT STATUS CARD (BOT OFFLINE / ONLINE) */}
            <div className="bg-[#0d162a]/90 border border-slate-800/80 rounded-[22px] p-5 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${status?.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {status?.isOnline ? 'BOT ONLINE' : 'BOT OFFLINE'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {status?.isOnline ? `Active as +${status.pairedNumber || status.config?.ownerNumber}` : 'Connect a device to go live'}
                </p>

                {/* Clickable Action Link */}
                <button
                  onClick={() => setIsPairModalOpen(true)}
                  className="pt-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                >
                  <span>Pair device now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Mini Robot Mascot Art */}
              <div className="relative w-16 h-16 flex flex-col items-center justify-center">
                <Crown className="w-3.5 h-3.5 text-cyan-300 -mb-0.5" />
                <div className="w-12 h-8 rounded-xl bg-[#091427] border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-0.5 bg-cyan-300 rounded-full"></span>
                    <span className="w-1.5 h-0.5 bg-cyan-300 rounded-full"></span>
                  </div>
                </div>
                <div className="w-14 h-2 rounded-[100%] border border-cyan-400/60 -mt-1 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>

            {/* QUICK STATS 2x2 GRID (Matching Screenshot 2) */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Active Bots */}
              <div className="bg-[#0d162a]/90 border border-slate-800/80 rounded-[20px] p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Active Bots</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    <span className="text-xl">{status?.isOnline ? '1' : '0'}</span> <span className="text-xs text-slate-400 font-normal">/ 25</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {status?.isOnline ? 'Live & Listening' : 'Offline / Standby'}
                  </p>
                </div>
              </div>

              {/* Card 2: Wallet Coins */}
              <div className="bg-[#0d162a]/90 border border-slate-800/80 rounded-[20px] p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Wallet</p>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5">
                    {coins} <span className="text-xs text-slate-300 font-normal">coins</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Free credit included</p>
                </div>
              </div>

              {/* Card 3: Uptime */}
              <div className="bg-[#0d162a]/90 border border-slate-800/80 rounded-[20px] p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Uptime</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {formatUptime(status?.uptimeSeconds || 0)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">24/7 Cloud Host</p>
                </div>
              </div>

              {/* Card 4: Engine Latency */}
              <div className="bg-[#0d162a]/90 border border-slate-800/80 rounded-[20px] p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Engine Speed</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">
                    {status?.lastPingMs || 18} <span className="text-xs text-slate-300 font-normal">ms</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ultra-low ping</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: BOTS FLEET & CONTROLS */}
        {activeNav === 'bots' && (
          <div className="space-y-4">
            <div className="bg-[#0d162a] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" /> WhatsApp Bot Instance
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  status?.isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {status?.isOnline ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400">Total Commands</p>
                  <p className="text-lg font-bold text-white mt-1">{status?.totalCommandsExecuted || 0}</p>
                </div>
                <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400">Messages Read</p>
                  <p className="text-lg font-bold text-white mt-1">{status?.totalMessagesReceived || 0}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartBot}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Power className="w-4 h-4" /> Start Bot Connection
                </button>
                <button
                  onClick={handleRestartBot}
                  className="w-full py-3 bg-[#111c33] hover:bg-[#162442] text-cyan-300 font-semibold rounded-xl border border-cyan-500/30 transition flex items-center justify-center gap-2 text-xs"
                >
                  <RefreshCw className="w-4 h-4" /> Restart Bot Engine
                </button>
                <button
                  onClick={handleStopBot}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-800 transition flex items-center justify-center gap-2 text-xs"
                >
                  Stop Engine
                </button>
                <button
                  onClick={handleClearSession}
                  className="w-full py-2.5 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Unpair & Clear Session
                </button>
              </div>
            </div>

            {/* Live Logs Card */}
            <div className="bg-[#0d162a] border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" /> Real-time Execution Logs
                </h4>
                <button
                  onClick={fetchLogs}
                  disabled={logsLoading}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${logsLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800 h-64 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1">
                {logs.length === 0 ? (
                  <p className="text-slate-500 italic">No logs recorded yet. Commands and incoming messages will appear here.</p>
                ) : (
                  logs.map((line, idx) => (
                    <p key={idx} className="hover:bg-slate-900/60 p-0.5 rounded leading-relaxed">{line}</p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TEMPLATES & AUTO REPLIES */}
        {activeNav === 'templates' && (
          <div className="space-y-4">
            <div className="bg-[#0d162a] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" /> Response Templates & Voice Rules
              </h3>
              <p className="text-xs text-slate-400">Automated replies for WhatsApp chat triggers and calls.</p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-cyan-300">Sinhala Greeting</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"හායි! මම YASHI HALLS Bot. විධාන බැලීමට .menu ලෙස එවන්න."</p>
                </div>

                <div className="p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-cyan-300">Keyword: 'මිල' (Pricing)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"💰 YASHI HALLS Bot මිල ගණන්: MINI (නොමිලේ), PRO (10 Coins), BUSINESS (30 Coins)"</p>
                </div>

                <div className="p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-cyan-300">Voice Note Reply Engine</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-semibold">Ready</span>
                  </div>
                  <p className="text-xs text-slate-400">Sends high-quality audio PTT voice notes when triggered.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: WALLET & COIN CREDITS */}
        {activeNav === 'wallet' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#101c38] via-[#0d162a] to-[#070b14] border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Coin Balance</p>
                  <p className="text-3xl font-black text-amber-400 mt-1 flex items-center gap-2">
                    <span>{coins}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                      FREE TIER
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#070b14]/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <p className="text-slate-300 font-semibold">Included Plan Allowances:</p>
                <div className="flex justify-between text-slate-400">
                  <span>AI Requests Remaining:</span>
                  <span className="text-cyan-400 font-bold">150 / 150</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Media Downloads:</span>
                  <span className="text-cyan-400 font-bold">150 / 150</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS */}
        {activeNav === 'settings' && (
          <div className="bg-[#0d162a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-cyan-400" /> Bot Configuration
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Bot Name</label>
                <input
                  type="text"
                  readOnly
                  value={status?.config?.botName || 'YASHI HALLS MINI'}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Command Prefix</label>
                <input
                  type="text"
                  readOnly
                  value={status?.config?.prefix || '.'}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2.5 text-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Owner WhatsApp Phone</label>
                <input
                  type="text"
                  readOnly
                  value={status?.config?.ownerNumber || '94740712934'}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200"
                />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <span>Auto Read Statuses</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">ON</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <span>Channel Auto-React</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">ON</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#070b14] border border-slate-800 rounded-xl">
                  <span>Call Detector & Rejector</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">ON</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* WHATSAPP PAIRING MODAL */}
      {isPairModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1325] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Pair WhatsApp Account</h3>
              </div>
              <button
                onClick={() => setIsPairModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                  Enter Phone Number with Country Code (e.g. 94740712934)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="94740712934"
                    className="flex-1 bg-[#070b14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handlePair}
                    disabled={pairingLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {pairingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Get Code'}
                  </button>
                </div>
              </div>

              {/* 8-Digit Pairing Code Display */}
              {status?.pairingCode && (
                <div className="p-4 bg-cyan-950/40 border border-cyan-400/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider">WhatsApp Link Code:</p>
                    <p className="text-2xl font-mono font-black text-cyan-200 tracking-widest mt-1">
                      {status.pairingCode}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 bg-cyan-800/60 hover:bg-cyan-700/60 text-cyan-200 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              {/* Pairing Instructions */}
              <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p className="font-bold text-cyan-300 mb-1">How to connect on WhatsApp:</p>
                <p>1. Open WhatsApp on your phone</p>
                <p>2. Tap Settings ➔ Linked Devices ➔ Link a Device</p>
                <p>3. Tap "Link with phone number instead"</p>
                <p>4. Enter the 8-digit code shown above</p>
              </div>

              {/* QR Code fallback */}
              {status?.qrCodeDataUrl && (
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400 mb-2">Or scan QR Code:</p>
                  <img
                    src={status.qrCodeDataUrl}
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 mx-auto rounded-xl bg-white p-2 border border-slate-700 shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (Exact replica of Screenshot 2) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around max-w-xl mx-auto">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveNav('dashboard')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeNav === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeNav === 'dashboard' && (
            <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          )}
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Dashboard</span>
        </button>

        {/* Tab 2: Bots */}
        <button
          onClick={() => setActiveNav('bots')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeNav === 'bots' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeNav === 'bots' && (
            <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          )}
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Bots</span>
        </button>

        {/* Tab 3: Templates */}
        <button
          onClick={() => setActiveNav('templates')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeNav === 'templates' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeNav === 'templates' && (
            <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          )}
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Templates</span>
        </button>

        {/* Tab 4: Wallet */}
        <button
          onClick={() => setActiveNav('wallet')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeNav === 'wallet' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeNav === 'wallet' && (
            <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          )}
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Wallet</span>
        </button>

        {/* Tab 5: Settings */}
        <button
          onClick={() => setActiveNav('settings')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeNav === 'settings' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeNav === 'settings' && (
            <span className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          )}
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Settings</span>
        </button>
      </nav>
    </div>
  );
}
