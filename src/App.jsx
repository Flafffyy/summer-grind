import { useState, useEffect } from "react";

const WORKOUTS = {
  Push: {
    color: "#f97316", emoji: "💪", focus: "Chest · Shoulders · Triceps",
    exercises: [
      { name: "Chest Press Machine",        sets: 4, reps: "10–12", rest: 90,  tip: "Squeeze chest at the top, slow on the way down. Builds the muscle under chest fat.", muscle: "Chest" },
      { name: "Pec Deck / Cable Fly",        sets: 3, reps: "12–15", rest: 75,  tip: "Feel the stretch across your chest at the open position — directly targets chest fat.", muscle: "Chest" },
      { name: "Incline Chest Press Machine", sets: 3, reps: "10–12", rest: 75,  tip: "Upper chest fills out just below your collarbone — makes chest look full not saggy.", muscle: "Upper Chest" },
      { name: "Shoulder Press Machine",      sets: 3, reps: "10–12", rest: 90,  tip: "Big shoulders create a V-shape and make your waist look smaller.", muscle: "Shoulders" },
      { name: "Cable Lateral Raise",         sets: 3, reps: "15",    rest: 60,  tip: "Lead with your elbow not your hand. Slight forward lean. No swinging.", muscle: "Side Delts" },
      { name: "Tricep Rope Pushdown",        sets: 3, reps: "12–15", rest: 60,  tip: "Pull rope apart at the bottom, lock elbows at sides throughout.", muscle: "Triceps" },
      { name: "Overhead Cable Extension",    sets: 3, reps: "12",    rest: 60,  tip: "Keep elbows close to your head. Full stretch at the bottom.", muscle: "Triceps" },
    ]
  },
  Pull: {
    color: "#3b82f6", emoji: "🏋️", focus: "Back · Biceps",
    exercises: [
      { name: "Lat Pulldown",          sets: 4, reps: "10–12", rest: 90, tip: "Pull to upper chest, lean back slightly. Wide back makes your waist look smaller.", muscle: "Lats" },
      { name: "Seated Cable Row",      sets: 3, reps: "12",    rest: 90, tip: "Drive elbows back past your body, hold 1 second at peak contraction.", muscle: "Mid Back" },
      { name: "Cable Face Pull",        sets: 3, reps: "15–20", rest: 60, tip: "Pull to your forehead, rotate wrists out at the end. Fixes posture.", muscle: "Rear Delts" },
      { name: "Reverse Pec Deck",      sets: 3, reps: "15",    rest: 60, tip: "Arms straight, squeeze shoulder blades together at the back.", muscle: "Rear Delts" },
      { name: "Cable Bicep Curl",      sets: 3, reps: "12",    rest: 60, tip: "No swinging — elbows stay pinned at your sides the whole time.", muscle: "Biceps" },
      { name: "Hammer Curl (DB)",      sets: 3, reps: "12",    rest: 60, tip: "Neutral grip. Slow on the way down — that is where growth happens.", muscle: "Biceps" },
    ]
  },
  Legs: {
    color: "#a855f7", emoji: "🦵", focus: "Quads · Hamstrings · Glutes · Calves",
    exercises: [
      { name: "Leg Press Machine",     sets: 4, reps: "12–15", rest: 90, tip: "Feet shoulder-width, push through heels not toes. Full range of motion.", muscle: "Quads/Glutes" },
      { name: "Leg Extension Machine", sets: 3, reps: "15",    rest: 75, tip: "Squeeze quads hard at the top, slow controlled descent.", muscle: "Quads" },
      { name: "Seated Leg Curl",       sets: 3, reps: "12–15", rest: 75, tip: "Full range, hold the peak contraction for 1 full second.", muscle: "Hamstrings" },
      { name: "Hip Adductor Machine",  sets: 3, reps: "15",    rest: 60, tip: "Slow and controlled. Do not slam the weight.", muscle: "Inner Thigh" },
      { name: "Calf Raise Machine",    sets: 4, reps: "20",    rest: 60, tip: "Full stretch at the bottom, pause at top. Calves only grow with high reps and full ROM.", muscle: "Calves" },
      { name: "Plank",                 sets: 3, reps: "45 sec", rest: 45, tip: "Squeeze abs AND glutes at the same time. Posterior pelvic tilt.", muscle: "Core" },
    ]
  }
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const SCHEDULE = { Monday:"Push", Tuesday:"Pull", Wednesday:"Rest", Thursday:"Legs", Friday:"Push", Saturday:"Pull", Sunday:"Rest" };
const todayName = DAYS[new Date().getDay()];
const todayWorkout = SCHEDULE[todayName];
const todayDate = new Date().toISOString().split("T")[0];

export default function App() {
const defaultWorkout = todayWorkout === "Rest" ? "Push" : todayWorkout;  const [workout, setWorkout] = useState(defaultWorkout);
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState("workout");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wlogs") || "{}"); } catch { return {}; }
  });
  const [lastWeights, setLastWeights] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wLastWeights") || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("wlogs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("wLastWeights", JSON.stringify(lastWeights)); }, [lastWeights]);

  useEffect(() => {
    if (!timerActive || timer <= 0) { if (timer <= 0) setTimerActive(false); return; }
    const t = setTimeout(() => setTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, timerActive]);

  const sessionKey = `${todayDate}-${workout}`;
  const session = logs[sessionKey] || {};
  const currentWorkout = WORKOUTS[workout];
  const getExLog = (i) => session[i] || { weight: "", sets: {}, name: "" };

  const setWeight = (i, w) => {
    const ex = currentWorkout.exercises[i];
    setLogs(prev => ({ ...prev, [sessionKey]: { ...prev[sessionKey], [i]: { ...getExLog(i), weight: w, name: ex.name } } }));
    setLastWeights(prev => ({ ...prev, [ex.name]: w }));
  };

  const toggleSet = (exIdx, setIdx, restSeconds) => {
    const exLog = getExLog(exIdx);
    const wasDone = exLog.sets[setIdx]?.done;
    setLogs(prev => ({
      ...prev,
      [sessionKey]: {
        ...prev[sessionKey],
        [exIdx]: { ...exLog, name: currentWorkout.exercises[exIdx].name, sets: { ...exLog.sets, [setIdx]: { done: !wasDone } } }
      }
    }));
    if (!wasDone) { setTimer(restSeconds); setTimerActive(true); }
  };

  const doneSetsForEx = (i) => Object.values(session[i]?.sets || {}).filter(s => s.done).length;
  const completedExercises = currentWorkout.exercises.filter((ex, i) => doneSetsForEx(i) >= ex.sets).length;

  const recentSessions = Object.entries(logs)
    .filter(([k]) => k.includes("-Push") || k.includes("-Pull") || k.includes("-Legs"))
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 15);

  return (
    <div style={{ background:"#0f172a", color:"#f1f5f9", minHeight:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", maxWidth:440, margin:"0 auto", display:"flex", flexDirection:"column", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        input[type="number"] { -moz-appearance: textfield; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #1e293b" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:26, letterSpacing:2, color:"#f97316", lineHeight:1 }}>SUMMER GRIND</div>
            <div style={{ fontSize:11, color:"#475569", marginTop:2, letterSpacing:"0.05em" }}>
              {todayName.toUpperCase()} · {SCHEDULE[todayName] === "Rest" ? "SCHEDULED REST" : `${SCHEDULE[todayName].toUpperCase()} DAY`}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:700, color:currentWorkout.color, lineHeight:1 }}>{completedExercises}/{currentWorkout.exercises.length}</div>
            <div style={{ fontSize:10, color:"#475569" }}>exercises</div>
          </div>
        </div>
        <div style={{ height:3, background:"#1e293b", borderRadius:2, marginTop:12, overflow:"hidden" }}>
          <div style={{ height:"100%", background:currentWorkout.color, borderRadius:2, width:`${(completedExercises/currentWorkout.exercises.length)*100}%`, transition:"width 0.4s ease" }}/>
        </div>
      </div>

      {/* REST TIMER */}
      {timerActive && timer > 0 && (
        <div style={{ background:"#0d2e1a", borderBottom:"1px solid #22c55e33", padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"#22c55e", fontWeight:700, letterSpacing:"0.1em" }}>REST TIMER</div>
            <div style={{ fontSize:28, fontWeight:700, color:"#22c55e", lineHeight:1, fontFamily:"'Bebas Neue', sans-serif", letterSpacing:2 }}>
              {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}
            </div>
          </div>
          <button onClick={() => { setTimer(0); setTimerActive(false); }} style={{ background:"none", border:"1px solid #22c55e", color:"#22c55e", borderRadius:8, padding:"6px 16px", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:600 }}>
            Skip
          </button>
        </div>
      )}

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid #1e293b" }}>
        {[{id:"workout",label:"Workout"},{id:"history",label:"History"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"12px", border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, color:tab===t.id?"#f97316":"#475569", borderBottom:`2px solid ${tab===t.id?"#f97316":"transparent"}`, transition:"color 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:24 }}>

        {/* WORKOUT TAB */}
        {tab === "workout" && (
          <div style={{ padding:"16px 16px 0" }}>
<div
  style={{
    background:"#1e293b",
    borderRadius:12,
    padding:"14px",
    marginBottom:14,
    borderLeft:`4px solid ${currentWorkout.color}`
  }}
>
  <div style={{ fontSize:11, color:"#64748b", fontWeight:700 }}>
    TODAY'S WORKOUT
  </div>

  <div style={{ fontSize:24, fontWeight:700, color:currentWorkout.color }}>
    {todayWorkout}
  </div>

  <div style={{ fontSize:12, color:"#94a3b8" }}>
    {todayWorkout === "Rest"
      ? "Recovery Day"
      : WORKOUTS[todayWorkout].focus}
  </div>
</div>
            {/* Push / Pull / Legs selector */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Push","Pull","Legs"].map(w => (
                <button key={w} onClick={() => { setWorkout(w); setExpanded(null); }} style={{
                  flex:1, padding:"10px 6px",
                  border:`1.5px solid ${workout===w ? WORKOUTS[w].color : "#1e293b"}`,
                  background:workout===w ? `${WORKOUTS[w].color}22` : "#1e293b",
                  color:workout===w ? WORKOUTS[w].color : "#475569",
                  borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, transition:"all 0.2s",
                }}>
                  <div style={{ fontSize:20, marginBottom:3 }}>{WORKOUTS[w].emoji}</div>
                  {w}
                </button>
              ))}
            </div>

            {/* Focus strip */}
            <div style={{ background:"#1e293b", borderRadius:10, padding:"10px 14px", marginBottom:14, borderLeft:`3px solid ${currentWorkout.color}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:currentWorkout.color, fontWeight:700 }}>{currentWorkout.focus}</div>
                <div style={{ fontSize:11, color:"#475569", marginTop:1 }}>Add weight or 1 rep each session</div>
              </div>
              <div style={{ fontSize:20 }}>{currentWorkout.emoji}</div>
            </div>

            {/* Exercise cards */}
            {currentWorkout.exercises.map((ex, i) => {
              const exLog = getExLog(i);
              const done = doneSetsForEx(i);
              const isComplete = done >= ex.sets;
              const isExpanded = expanded === i;
              const lastW = lastWeights[ex.name];
              return (
                <div key={i} style={{ background:"#1e293b", borderRadius:12, marginBottom:10, border:`1px solid ${isComplete ? currentWorkout.color : "#334155"}`, overflow:"hidden", transition:"border-color 0.3s" }}>
                  <div onClick={() => setExpanded(isExpanded ? null : i)} style={{ padding:"14px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        {isComplete && <span style={{ color:currentWorkout.color, fontSize:13, flexShrink:0 }}>✓</span>}
                        <span style={{ fontWeight:600, fontSize:14, color:isComplete?"#64748b":"#f1f5f9", textDecoration:isComplete?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ex.name}</span>
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                        <span style={{ fontSize:11, background:"#0f172a", color:currentWorkout.color, padding:"2px 8px", borderRadius:20, fontWeight:700, flexShrink:0 }}>{ex.sets}x{ex.reps}</span>
                        <span style={{ fontSize:11, color:"#475569", flexShrink:0 }}>{ex.muscle}</span>
{lastW && <span style={{ fontSize:11, color:"#22c55e", flexShrink:0 }}>Last: {lastW} lbs</span>}                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:done>0?currentWorkout.color:"#334155" }}>{done}/{ex.sets}</div>
                      <div style={{ fontSize:10, color:"#475569" }}>sets</div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop:"1px solid #334155", padding:"14px 16px" }}>
                      <div style={{ fontSize:12, color:"#86efac", background:"#0d2e1a", padding:"9px 12px", borderRadius:8, marginBottom:14, lineHeight:1.5 }}>
                        {ex.tip}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, background:"#0f172a", borderRadius:10, padding:"10px 14px" }}>
                        <span style={{ fontSize:12, color:"#64748b", flexShrink:0 }}>Weight</span>
                        <input
                          type="number"
                          value={exLog.weight}
                          onChange={e => setWeight(i, e.target.value)}
                          placeholder={lastW || "0"}
                          style={{ flex:1, background:"transparent", border:"none", color:"#f1f5f9", fontSize:20, fontWeight:700, fontFamily:"inherit", outline:"none", minWidth:0 }}
                        />
<span style={{ fontSize:13, color:"#64748b", flexShrink:0 }}>lbs</span>                      </div>
                      {Array.from({ length:ex.sets }, (_,j) => {
                        const setDone = exLog.sets[j]?.done;
                        return (
                          <div key={j} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:j<ex.sets-1?"1px solid #1e293b":"none" }}>
                            <div style={{ width:28, height:28, borderRadius:"50%", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#475569", flexShrink:0 }}>
                              {j+1}
                            </div>
                            <div style={{ flex:1, fontSize:13, color:setDone?"#64748b":"#94a3b8" }}>
{ex.reps} reps{exLog.weight ? ` @ ${exLog.weight} lbs` : ""}                            </div>
                            <button onClick={() => toggleSet(i, j, ex.rest)} style={{
                              width:36, height:36, borderRadius:"50%", flexShrink:0,
                              border:`2px solid ${setDone?currentWorkout.color:"#334155"}`,
                              background:setDone?currentWorkout.color:"transparent",
                              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:15, color:setDone?"#0f172a":"#334155", fontWeight:900, transition:"all 0.2s",
                            }}>
                              {setDone ? "✓" : ""}
                            </button>
                          </div>
                        );
                      })}
                      <div style={{ marginTop:12, fontSize:11, color:"#334155", textAlign:"center" }}>
                        Rest {ex.rest}s — timer starts automatically
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Post workout */}
            <div style={{ background:"#0d1e3a", border:"1px solid #1e3a5f", borderRadius:12, padding:"14px 16px", marginTop:6, marginBottom:24 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#3b82f6", marginBottom:6 }}>After Every Session</div>
              <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6 }}>
                15-20 min incline treadmill walk (level 8-10, slow pace). This burns belly fat without losing muscle. Do not skip it.
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div style={{ padding:16 }}>
            {recentSessions.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#475569" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🏋️</div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>No sessions yet</div>
                <div style={{ fontSize:13 }}>Complete your first workout and it will show up here.</div>
              </div>
            ) : recentSessions.map(([key, data]) => {
              const date = key.substring(0,10);
              const type = key.substring(11);
              const w = WORKOUTS[type];
              if (!w) return null;
              const totalSets = Object.values(data).reduce((s,ex) => s+Object.values(ex.sets||{}).filter(x=>x.done).length, 0);
              const totalDone = w.exercises.filter((_,i) => Object.values(data[i]?.sets||{}).filter(s=>s.done).length >= w.exercises[i].sets).length;
              return (
                <div key={key} style={{ background:"#1e293b", borderRadius:12, padding:"14px 16px", marginBottom:10, borderLeft:`3px solid ${w.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{w.emoji} {type}</div>
                      <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{date}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:w.color }}>{totalDone}/{w.exercises.length} done</div>
                      <div style={{ fontSize:11, color:"#475569" }}>{totalSets} sets</div>
                    </div>
                  </div>
                  <div style={{ borderTop:"1px solid #334155", paddingTop:8 }}>
                    {Object.entries(data).map(([idx, ex]) => {
                      const doneSets = Object.values(ex.sets||{}).filter(s=>s.done).length;
                      if (!ex.name || doneSets===0) return null;
                      return (
                        <div key={idx} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", paddingTop:4 }}>
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, marginRight:8 }}>{ex.name}</span>
<span style={{ flexShrink:0 }}>{ex.weight?`${ex.weight} lbs · `:""}{doneSets} sets</span>                        </div>
                      );
                    })}
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