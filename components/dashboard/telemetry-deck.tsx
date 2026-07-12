"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Activity, Cpu, Sparkles, AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  type: "INFO" | "WARN" | "SUCCESS" | "AI";
  message: string;
}

const mockMessages = [
  { type: "INFO", text: "Billet rolling speed stabilized at 122 RPM." },
  { type: "INFO", text: "LME Copper spot price fetched: $8,420/MT." },
  { type: "SUCCESS", text: "Customs gate cleared for container allocation PO-8812." },
  { type: "AI", text: "AI Model predicts steel rate spike of 0.8% tomorrow." },
  { type: "WARN", text: "Temperatures on Cooling Line B reaching high threshold (94°C)." },
  { type: "SUCCESS", text: "Production targets updated. June schedule synchronized." },
  { type: "INFO", text: "NHAVA SHEVA customs gate connection status: EXCELLENT." },
  { type: "AI", text: "Automated copper purchase hedge suggested for Rohan Steel." },
];

export function TelemetryDeck() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [conveyorSpeed, setConveyorSpeed] = useState(85);
  const [autoOptimizing, setAutoOptimizing] = useState(false);

  useEffect(() => {
    // Generate initial logs
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 6; i++) {
      const time = new Date(Date.now() - (6 - i) * 3000);
      const msg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      initialLogs.push({
        timestamp: time.toLocaleTimeString() + "." + String(time.getMilliseconds()).padStart(3, "0"),
        type: msg.type as any,
        message: msg.text,
      });
    }
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const time = new Date();
      const msg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      setLogs((prev) => [
        {
          timestamp: time.toLocaleTimeString() + "." + String(time.getMilliseconds()).padStart(3, "0"),
          type: msg.type as any,
          message: msg.text,
        },
        ...prev.slice(0, 7),
      ]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerOptimization = () => {
    setAutoOptimizing(true);
    const time = new Date();
    setLogs((prev) => [
      {
        timestamp: time.toLocaleTimeString() + "." + String(time.getMilliseconds()).padStart(3, "0"),
        type: "AI",
        message: "AUTO-OPTIMIZER ACTION: Recalculating billet sizing limits based on LME index.",
      },
      ...prev,
    ]);

    setTimeout(() => {
      setAutoOptimizing(false);
      const time2 = new Date();
      setLogs((prev) => [
        {
          timestamp: time2.toLocaleTimeString() + "." + String(time2.getMilliseconds()).padStart(3, "0"),
          type: "SUCCESS",
          message: "AUTO-OPTIMIZER COMPLETE: Steel allocations trimmed by 1.2% for maximum yield.",
        },
        ...prev,
      ]);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Live Cyber Telemetry Logs */}
      <div className="glass-card border border-white/8 rounded-2xl p-5 xl:col-span-2 flex flex-col justify-between overflow-hidden relative">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-cyan-400/5 blur-xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isPlaying ? "bg-cyan-400" : "bg-zinc-500")} />
                <span className={cn("relative inline-flex rounded-full h-2 w-2", isPlaying ? "bg-cyan-500" : "bg-zinc-500")} />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">Live System Telemetry Stream</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "p-1.5 rounded-lg border text-xs flex items-center gap-1 font-mono transition-all",
                  isPlaying
                    ? "bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                    : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20"
                )}
              >
                {isPlaying ? <Square size={10} /> : <Play size={10} />}
                {isPlaying ? "PAUSE FEED" : "RESUME"}
              </button>
            </div>
          </div>

          {/* Logs Terminal view */}
          <div className="font-mono text-[11px] space-y-2 max-h-[190px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {logs.map((log, idx) => (
                <motion.div
                  key={log.timestamp + idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 py-0.5 border-b border-white/[0.02]"
                >
                  <span className="text-zinc-500 select-none flex-shrink-0">{log.timestamp}</span>
                  <span
                    className={cn(
                      "font-bold px-1.5 py-0.2 rounded text-[9px] flex-shrink-0",
                      log.type === "INFO" && "bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-400/20",
                      log.type === "WARN" && "bg-red-400/10 text-red-400 border border-red-400/20 animate-pulse",
                      log.type === "SUCCESS" && "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
                      log.type === "AI" && "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                    )}
                  >
                    {log.type}
                  </span>
                  <span className="text-zinc-300 font-medium">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/5 text-[10px] text-muted-foreground font-mono mt-3">
          <span>Active Connection: ws://mundra-erp-edge.local:9001</span>
          <span>Logs Cache: 100/100</span>
        </div>
      </div>

      {/* Cyber Operator Controls */}
      <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative">
        {/* Glow corner */}
        <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-purple-400/5 blur-xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
            <Cpu size={15} className="text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">Cyber Controls</h3>
          </div>

          <div className="space-y-4">
            {/* Speed slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-foreground mb-1.5">
                <span>Line 1 Target Yield</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono">{conveyorSpeed}% Capacity</span>
              </div>
              <input
                type="range"
                min="50"
                max="120"
                value={conveyorSpeed}
                onChange={(e) => setConveyorSpeed(Number(e.target.value))}
                className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono">
                <span>50% (Eco)</span>
                <span>100% (Nominal)</span>
                <span>120% (Overdrive)</span>
              </div>
            </div>

            {/* AI Auto Optimizer */}
            <div>
              <button
                onClick={triggerOptimization}
                disabled={autoOptimizing}
                className={cn(
                  "relative overflow-hidden w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 text-xs font-bold transition-all",
                  autoOptimizing
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 border-gray-200 dark:border-white/10 hover:border-purple-400/30 text-foreground"
                )}
              >
                {autoOptimizing && (
                  <RefreshCcw size={13} className="animate-spin text-purple-400" />
                )}
                {!autoOptimizing && <Sparkles size={13} className="text-purple-400 animate-pulse" />}
                {autoOptimizing ? "RUNNING CYBER OPTIMIZATION..." : "TRIGGER AI OPTIMIZER"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-400/5 border border-amber-400/10 text-[10px] text-amber-400 mt-4">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span className="font-mono">Optimization override status: AUTOMATED BY LME TRIGGER.</span>
        </div>
      </div>
    </div>
  );
}
