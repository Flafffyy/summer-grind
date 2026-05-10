import { useState, useRef, useEffect } from "react";

const USER = { weight: 145, height: "6'0\"", calorieTarget: 2400, proteinTarget: 145, carbsTarget: 240, fatTarget: 70, waterTarget: 12 };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TODAY = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

const PLAN = {
  Monday: { type: "Push", color: "#f97316", icon: "💪", focus: "Chest · Shoulders · Triceps + Core" },
  Tuesday: { type: "Athletic", color: "#22c55e", icon: "⚡", focus: "Plyometrics · Speed · Agility" },
  Wednesday: { type: "Pull", color: "#3b82f6", icon: "🏋️", focus: "Back · Biceps + Core" },
  Thursday: { type: "Legs", color: "#a855f7", icon: "🦵", focus: "Quads · Hams · Glutes · Calves" },
  Friday: { type: "Athletic", color: "#22c55e", icon: "🏃", focus: "Speed · Conditioning · Core" },
  Saturday: { type: "Recovery", color: "#64748b", icon: "🧘", focus: "Mobility · Light Cardio · Stretch" },
  Sunday: { type: "Rest", color: "#64748b", icon: "😴", focus: "Full Rest · Meal Prep Sunday" },
};

const WORKOUTS = {
  Monday: {
    gym: [
      { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s", tip: "Pinch shoulder blades together" },
      { name: "Incline DB Press", sets: 3, reps: "10-12", rest: "75s", tip: "Full stretch at bottom" },
      { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s", tip: "Brace core like you're about to get punched" },
      { name: "Lateral Raises", sets: 3, reps: "15-20", rest: "60s", tip: "Control the descent — that's where growth is" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60s", tip: "Lock elbows at sides" },
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15", rest: "60s", tip: "No swinging — core controls it" },
      { name: "Plank", sets: 3, reps: "45-60s", rest: "45s", tip: "Squeeze glutes and abs simultaneously" },
    ],
    home: [
      { name: "Wide Push-ups", sets: 4, reps: "15-20", rest: "60s", tip: "Full range, nose to floor" },
      { name: "Pike Push-ups", sets: 3, reps: "10-12", rest: "60s", tip: "Hips high, head through arms" },
      { name: "Diamond Push-ups", sets: 3, reps: "10-12", rest: "60s", tip: "Tricep isolation" },
      { name: "Chair Dips", sets: 3, reps: "12-15", rest: "75s", tip: "Keep chest up, don't flare elbows" },
      { name: "Decline Push-ups", sets: 3, reps: "12", rest: "60s", tip: "Feet on bed/chair" },
      { name: "Leg Raises", sets: 3, reps: "15", rest: "45s", tip: "Lower back flat on floor" },
      { name: "Plank to Downdog", sets: 3, reps: "10", rest: "45s", tip: "Slow transition — shoulder stability" },
    ],
  },
  Tuesday: {
    gym: [
      { name: "Box Jumps", sets: 5, reps: "5", rest: "90s", tip: "Full extension at top, soft landing" },
      { name: "Broad Jumps", sets: 4, reps: "5", rest: "90s", tip: "Swing arms explosively — adds 3-4 inches" },
      { name: "Lateral Bounds", sets: 4, reps: "8/side", rest: "75s", tip: "Stick each landing single-leg" },
      { name: "Sprint 30m (max)", sets: 8, reps: "×", rest: "60s", tip: "Not pace — absolute max effort every rep" },
      { name: "Agility Ladder", sets: 3, reps: "3 drills", rest: "60s", tip: "Stay on toes, fast feet" },
      { name: "Depth Drops", sets: 4, reps: "6", rest: "75s", tip: "Builds reactive strength = jump height" },
      { name: "Calf Raises (explosive)", sets: 4, reps: "20", rest: "45s", tip: "Ankle stiffness = free inches on your jump" },
    ],
    home: [
      { name: "Squat Jumps", sets: 5, reps: "8", rest: "75s", tip: "Explode — arms swing overhead" },
      { name: "Tuck Jumps", sets: 4, reps: "6", rest: "90s", tip: "Drive knees as high as possible" },
      { name: "Broad Jumps", sets: 4, reps: "5", rest: "90s", tip: "Max distance — measure and beat it" },
      { name: "Lateral Shuffle 10m", sets: 8, reps: "×", rest: "45s", tip: "Stay in athletic squat position" },
      { name: "Bounding Strides", sets: 4, reps: "30m", rest: "60s", tip: "Long powerful strides, arms driving" },
      { name: "Calf Raises on Stair", sets: 4, reps: "25", rest: "45s", tip: "Full ROM — heel drop then rise" },
    ],
  },
  Wednesday: {
    gym: [
      { name: "Deadlift", sets: 4, reps: "5", rest: "2min", tip: "Hip hinge, bar scrapes shins all the way" },
      { name: "Pull-ups / Lat Pulldown", sets: 4, reps: "6-10", rest: "90s", tip: "Initiate with lats not arms" },
      { name: "Barbell Row", sets: 3, reps: "8-10", rest: "90s", tip: "Chest up, pull to belly button" },
      { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60s", tip: "Rear delts + posture fix — don't skip" },
      { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60s", tip: "Elbows pinned at sides" },
      { name: "Bicycle Crunches", sets: 3, reps: "20/side", rest: "45s", tip: "Slow and deliberate beats fast" },
    ],
    home: [
      { name: "Pull-ups (door bar)", sets: 4, reps: "max", rest: "90s", tip: "$15 doorframe bar changes everything" },
      { name: "Table Inverted Rows", sets: 3, reps: "12-15", rest: "75s", tip: "Chest to table edge, keep body rigid" },
      { name: "Superman Hold", sets: 3, reps: "12", rest: "60s", tip: "Squeeze glutes AND back" },
      { name: "Towel Bicep Curls", sets: 3, reps: "10", rest: "60s", tip: "Loop towel under foot for resistance" },
      { name: "Bicycle Crunches", sets: 3, reps: "20/side", rest: "45s", tip: "Elbow to opposite knee" },
      { name: "Dead Bug", sets: 3, reps: "10/side", rest: "45s", tip: "Lower back stays pressed down — ALWAYS" },
    ],
  },
  Thursday: {
    gym: [
      { name: "Barbell Squat", sets: 4, reps: "6-8", rest: "2min", tip: "Break parallel — depth builds real quads" },
      { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s", tip: "Push hips back, feel the hamstring stretch" },
      { name: "Leg Press", sets: 3, reps: "12-15", rest: "75s", tip: "High foot placement targets hamstrings" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10/side", rest: "90s", tip: "Single best exercise for athleticism" },
      { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60s", tip: "Full contraction and slow eccentric" },
      { name: "Standing Calf Raise", sets: 4, reps: "20-25", rest: "60s", tip: "Pause 1s at top, full drop at bottom" },
    ],
    home: [
      { name: "Bodyweight Squat", sets: 4, reps: "25", rest: "60s", tip: "Go full depth every rep" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "15/side", rest: "75s", tip: "Rear foot elevated on chair" },
      { name: "Glute Bridge", sets: 4, reps: "20", rest: "60s", tip: "Squeeze at top for 1 full second" },
      { name: "Single-leg RDL", sets: 3, reps: "12/side", rest: "60s", tip: "Balance = hip stability = athleticism" },
      { name: "Jump Squat", sets: 3, reps: "10", rest: "75s", tip: "Explosive — pairs with Tuesday athletic work" },
      { name: "Calf Raises (stair edge)", sets: 4, reps: "25", rest: "45s", tip: "Full ROM for max calf development" },
    ],
  },
  Friday: {
    gym: [
      { name: "Hang Power Clean", sets: 4, reps: "4", rest: "2min", tip: "Best exercise on earth for explosiveness" },
      { name: "Sprint 40m (max)", sets: 6, reps: "×", rest: "2min", tip: "Full recovery between — quality over quantity" },
      { name: "Sled Push / Prowler", sets: 4, reps: "20m", rest: "2min", tip: "Drives power output + conditioning" },
      { name: "Hurdle Jumps", sets: 4, reps: "6", rest: "90s", tip: "Minimize ground contact time" },
      { name: "Battle Ropes", sets: 4, reps: "30s", rest: "60s", tip: "Entire core fires — go hard" },
      { name: "V-ups", sets: 3, reps: "15", rest: "45s", tip: "Hardest core exercise — shreds lower belly" },
    ],
    home: [
      { name: "Burpees", sets: 5, reps: "10", rest: "60s", tip: "Full extension on jump — no lazy reps" },
      { name: "Mountain Climbers", sets: 4, reps: "30s", rest: "45s", tip: "Hips level — don't bounce" },
      { name: "High Knees (sprint)", sets: 6, reps: "20s on/20s off", rest: "—", tip: "Drive arms as hard as legs" },
      { name: "Jump Lunges", sets: 4, reps: "8/side", rest: "75s", tip: "Explosive switch — land soft" },
      { name: "Plank Variations", sets: 3, reps: "45s each", rest: "30s", tip: "Front → Side L → Side R" },
      { name: "V-ups", sets: 3, reps: "12", rest: "45s", tip: "If too hard, do tuck-ups first" },
    ],
  },
  Saturday: {
    gym: [
      { name: "Zone 2 Jog", sets: 1, reps: "25-30 min", rest: "—", tip: "Conversational pace. Burns fat, builds engine" },
      { name: "Hip Flexor Stretch", sets: 2, reps: "60s/side", rest: "—", tip: "You sit all day — your hips need this" },
      { name: "World's Greatest Stretch", sets: 2, reps: "8/side", rest: "—", tip: "One stretch to rule them all" },
      { name: "Cat-Cow", sets: 2, reps: "12", rest: "—", tip: "Spinal health and mobility" },
      { name: "Foam Roll Legs + Back", sets: 1, reps: "10 min", rest: "—", tip: "Slow rolls, pause on tight spots" },
    ],
    home: [
      { name: "Walk outside 30 min", sets: 1, reps: "×", rest: "—", tip: "Sunlight + movement = mood + metabolism" },
      { name: "Full body stretch routine", sets: 1, reps: "20 min", rest: "—", tip: "YouTube: 'follow along full body stretch'" },
      { name: "Box Breathing", sets: 1, reps: "10 min", rest: "—", tip: "4s in → 4s hold → 4s out → 4s hold" },
    ],
  },
  Sunday: {
    gym: [{ name: "Complete Rest", sets: 1, reps: "×", rest: "—", tip: "Growth happens when you rest. Honor it." }],
    home: [
      { name: "Meal prep for the week", sets: 1, reps: "×", rest: "—", tip: "Cook dal, rice, sabzi in bulk. Set yourself up." },
      { name: "Plan next week", sets: 1, reps: "×", rest: "—", tip: "15 mins of planning saves hours of confusion" },
    ],
  },
};

const FOODS = [
  { id: 1, name: "Roti / Chapati", serving: "1 piece", cal: 71, p: 2.7, c: 14, f: 0.4, cat: "staple" },
  { id: 2, name: "Paratha", serving: "1 piece", cal: 200, p: 4, c: 28, f: 8, cat: "staple" },
  { id: 3, name: "Rice (cooked)", serving: "1 cup", cal: 200, p: 4, c: 45, f: 0.4, cat: "staple" },
  { id: 4, name: "Dal Tadka", serving: "1 cup", cal: 130, p: 8, c: 20, f: 2.5, cat: "dal" },
  { id: 5, name: "Moong Dal", serving: "1 cup", cal: 147, p: 10, c: 26, f: 0.6, cat: "dal" },
  { id: 6, name: "Rajma", serving: "1 cup", cal: 210, p: 13, c: 38, f: 1, cat: "dal" },
  { id: 7, name: "Chana Masala", serving: "1 cup", cal: 270, p: 14, c: 45, f: 4, cat: "dal" },
  { id: 8, name: "Chole", serving: "1 cup", cal: 270, p: 14, c: 45, f: 4, cat: "dal" },
  { id: 9, name: "Bhindi Sabzi", serving: "1 cup", cal: 70, p: 2, c: 12, f: 2, cat: "sabzi" },
  { id: 10, name: "Aloo Gobi", serving: "1 cup", cal: 120, p: 3, c: 20, f: 4, cat: "sabzi" },
  { id: 11, name: "Palak Paneer", serving: "1 cup", cal: 280, p: 15, c: 10, f: 22, cat: "sabzi" },
  { id: 12, name: "Mixed Veg Curry", serving: "1 cup", cal: 150, p: 4, c: 20, f: 6, cat: "sabzi" },
  { id: 13, name: "Saag / Sarson", serving: "1 cup", cal: 150, p: 6, c: 15, f: 8, cat: "sabzi" },
  { id: 14, name: "Paneer", serving: "100g", cal: 265, p: 18, c: 3, f: 20, cat: "protein" },
  { id: 15, name: "Soya Chunks (dry)", serving: "30g", cal: 104, p: 16, c: 10, f: 0.2, cat: "protein" },
  { id: 16, name: "Tofu", serving: "100g", cal: 76, p: 8, c: 2, f: 4, cat: "protein" },
  { id: 17, name: "Egg", serving: "1 egg", cal: 70, p: 6, c: 0, f: 5, cat: "protein" },
  { id: 18, name: "Curd / Yogurt", serving: "1 cup", cal: 150, p: 8, c: 11, f: 8, cat: "dairy" },
  { id: 19, name: "Milk", serving: "1 cup", cal: 150, p: 8, c: 12, f: 8, cat: "dairy" },
  { id: 20, name: "Dosa", serving: "1 piece", cal: 120, p: 3, c: 19, f: 4, cat: "staple" },
  { id: 21, name: "Idli", serving: "1 piece", cal: 39, p: 2, c: 8, f: 0.4, cat: "staple" },
  { id: 22, name: "Sambar", serving: "1 cup", cal: 90, p: 4, c: 14, f: 2, cat: "dal" },
  { id: 23, name: "Khichdi", serving: "1 cup", cal: 200, p: 8, c: 36, f: 3, cat: "staple" },
  { id: 24, name: "Poha", serving: "1 cup", cal: 165, p: 3, c: 32, f: 4, cat: "staple" },
  { id: 25, name: "Upma", serving: "1 cup", cal: 180, p: 4, c: 30, f: 5, cat: "staple" },
  { id: 26, name: "Peanut Butter", serving: "2 tbsp", cal: 190, p: 8, c: 6, f: 16, cat: "protein" },
  { id: 27, name: "Banana", serving: "1 medium", cal: 105, p: 1, c: 27, f: 0.3, cat: "fruit" },
  { id: 28, name: "Almonds", serving: "28g (1 oz)", cal: 165, p: 6, c: 6, f: 14, cat: "nuts" },
  { id: 29, name: "Protein Shake (veg)", serving: "1 scoop", cal: 120, p: 24, c: 4, f: 2, cat: "protein" },
  { id: 30, name: "Whey (if lacto-veg)", serving: "1 scoop", cal: 130, p: 25, c: 3, f: 2.5, cat: "protein" },
];

const SKIN_ROUTINE = {
  morning: [
    { step: "01", name: "Gentle Cleanser", brand: "Cerave / Minimalist Gentle", desc: "Removes overnight oil. Don't over-wash — strips barrier." },
    { step: "02", name: "Niacinamide 10%", brand: "Minimalist Niacinamide", desc: "Reduces pores, fades acne marks, controls oil. Key for your skin type." },
    { step: "03", name: "Light Moisturizer", brand: "Cerave AM or gel moisturizer", desc: "Even oily skin needs moisture. Keeps barrier strong." },
    { step: "04", name: "SPF 50+", brand: "Minimalist SPF 60 or Neutrogena", desc: "Non-negotiable. Hyperpigmentation gets 10x worse without it." },
  ],
  night: [
    { step: "01", name: "Cleanser", brand: "Same as morning", desc: "Removes sweat, pollution, SPF from the day." },
    { step: "02", name: "Retinol (2-3×/week)", brand: "Minimalist 0.025% Retinol", desc: "Start low. Best for acne, texture, smoothness. Night only." },
    { step: "03", name: "Moisturizer", brand: "Cerave PM", desc: "Slightly thicker at night is fine." },
    { step: "04", name: "Spot Treatment", brand: "Benzoyl Peroxide 2.5%", desc: "On active pimples only. Don't spread everywhere." },
  ],
};

const DAILY_TIPS = [
  { icon: "💧", tip: "Drink 3L+ water daily. Hydration is 50% of skin health AND gym performance." },
  { icon: "😴", tip: "Sleep 7-9 hours. Muscle is built when you sleep. No sleep = no gains, period." },
  { icon: "🥩", tip: "Hit 145g protein daily. For veg: dal + paneer + soya chunks + curd every day." },
  { icon: "☀️", tip: "Get 15 min morning sunlight. Sets circadian rhythm. Better sleep at night." },
  { icon: "🧂", tip: "Take 5g creatine monohydrate daily. Safest supplement ever studied. Worth it." },
  { icon: "📱", tip: "No phone 30 min before bed. Better sleep → more testosterone → better gains." },
  { icon: "🧘", tip: "Stretch 10 min daily. Your hips are tight from sitting. It's limiting your athletic ability." },
  { icon: "🍳", tip: "Soya chunks: 52g protein per 100g dry weight. Your #1 vegetarian protein hack." },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [gymMode, setGymMode] = useState(true);
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [foodLog, setFoodLog] = useState(
    JSON.parse(localStorage.getItem("foodLog")) || []
  );
  const [water, setWater] = useState(
    JSON.parse(localStorage.getItem("water")) || 0
  );
  ; const [foodSearch, setFoodSearch] = useState("");
  const [foodCat, setFoodCat] = useState("all");
  const [scanState, setScanState] = useState("idle"); // idle | scanning | result
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const [completedEx, setCompletedEx] = useState(() => {
    const saved = localStorage.getItem("completedEx");
    return saved ? JSON.parse(saved) : {};
  });

  const [expandedEx, setExpandedEx] = useState({});

  const [skincareTab, setSkincareTab] = useState("morning");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const totalCal = Math.round(foodLog.reduce((s, f) => s + f.cal, 0));
  const totalP = Math.round(foodLog.reduce((s, f) => s + f.p, 0));
  const totalC = Math.round(foodLog.reduce((s, f) => s + f.c, 0));
  const totalF = Math.round(foodLog.reduce((s, f) => s + f.f, 0));

  const addFood = (food) => setFoodLog(prev => [...prev, { ...food, logId: Date.now() + Math.random() }]);
  const removeFood = (logId) => setFoodLog(prev => prev.filter(f => f.logId !== logId));

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setScanState("scanning");
      setScanError("");
    } catch {
      setScanError("Camera access denied. Allow camera in browser settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
    stopCamera();
    setScanState("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user", content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
              {
                type: "text", text: `Identify the food in this image and provide nutritional info. Return ONLY valid JSON (no markdown, no backticks):
{"foodName":"name of food","servingSize":"estimated portion","calories":number,"protein_g":number,"carbs_g":number,"fat_g":number,"notes":"brief 1-sentence tip about this food for someone trying to build muscle and lose fat"}
If you can't identify food clearly, return: {"error":"Could not identify food clearly"}`}
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) { setScanError(parsed.error); setScanState("idle"); }
      else { setScanResult(parsed); setScanState("result"); }
    } catch {
      setScanError("Analysis failed. Check connection and try again.");
      setScanState("idle");
    }
  };

  const addScannedFood = () => {
    if (!scanResult) return;
    addFood({
      name: scanResult.foodName,
      serving: scanResult.servingSize,
      cal: scanResult.calories,
      p: scanResult.protein_g,
      c: scanResult.carbs_g,
      f: scanResult.fat_g,
    });
    setScanResult(null);
    setScanState("idle");
    setPage("nutrition");
  };

  useEffect(() => {
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
  }, [foodLog]);

  useEffect(() => {
    localStorage.setItem("water", JSON.stringify(water));
  }, [water]);

  useEffect(() => {
    localStorage.setItem("completedEx", JSON.stringify(completedEx));
  }, [completedEx]);

  const pct = (v, max) => Math.min(100, Math.round((v / max) * 100));

  const filteredFoods = FOODS.filter(f =>
    (foodCat === "all" || f.cat === foodCat) &&
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const todayWorkout = WORKOUTS[selectedDay];
  const exercises = gymMode ? todayWorkout.gym : todayWorkout.home;
  const dayPlan = PLAN[selectedDay];

  const Ring = ({ val, max, color, size = 56, stroke = 5 }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct(val, max) / 100;
    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }} />
      </svg>
    );
  };

  const Bar = ({ label, val, max, color, unit = "" }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
        <span>{label}</span><span style={{ color: "#f1f5f9" }}>{val}{unit} / {max}{unit}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#1e293b", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct(val, max)}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );

  const NavBtn = ({ id, icon, label }) => (
    <button onClick={() => setPage(id)} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
      color: page === id ? "#f97316" : "#475569",
      transition: "color 0.2s",
      fontFamily: "inherit",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
    </button>
  );

  const todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

  return (
    <div style={{
      background: "#0f172a", color: "#f1f5f9", minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 440, margin: "0 auto",
      display: "flex", flexDirection: "column", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        input, select { background:#1e293b; color:#f1f5f9; border:1px solid #334155; border-radius:8px; padding:8px 12px; font-family:inherit; font-size:14px; outline:none; }
        input:focus, select:focus { border-color:#f97316; }
        button { font-family:inherit; cursor:pointer; }
        .card { background:#1e293b; border-radius:14px; padding:16px; border:1px solid #334155; }
        .orange { color:#f97316; }
        .tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .chip { background:#0f172a; border:1px solid #334155; border-radius:20px; padding:4px 12px; font-size:12px; color:#94a3b8; cursor:pointer; white-space:nowrap; }
        .chip.active { background:#f97316; border-color:#f97316; color:#fff; }
        video { width:100%; border-radius:12px; background:#000; }
        .section-title { font-family:'Bebas Neue', sans-serif; font-size:22px; letter-spacing:1px; color:#f97316; margin:0 0 12px; }
        .btn-orange { background:#f97316; color:#0f172a; border:none; border-radius:10px; padding:12px 20px; font-weight:700; font-size:14px; cursor:pointer; transition:transform 0.1s,background 0.2s; }
        .btn-orange:hover { background:#ea6c00; }
        .btn-orange:active { transform:scale(0.97); }
        .btn-ghost { background:transparent; border:1px solid #334155; color:#94a3b8; border-radius:10px; padding:10px 16px; font-size:13px; transition:border-color 0.2s,color 0.2s; }
        .btn-ghost:hover { border-color:#f97316; color:#f97316; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "14px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 2, color: "#f97316", lineHeight: 1 }}>SUMMER GRIND</div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.05em" }}>{USER.height} · {USER.weight}LB · VEGETARIAN</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#64748b" }}>TODAY</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{TODAY.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 80 }}>

        {/* ══════════ HOME ══════════ */}
        {page === "home" && (
          <div className="slide-in" style={{ padding: 20, width: "100%", boxSizing: "border-box" }}>
            {/* Tip of the day */}
            <div style={{ background: "linear-gradient(135deg,#1c2a3a,#1e293b)", borderRadius: 14, padding: 16, border: "1px solid #334155", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>TODAY'S TIP</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#cbd5e1" }}>{todayTip.icon} {todayTip.tip}</div>
            </div>

            {/* Today's workout card */}
            <div style={{ marginBottom: 20 }}>
              <div className="section-title">TODAY: {PLAN[TODAY].type.toUpperCase()}</div>
              <div className="card" style={{ borderLeft: `3px solid ${PLAN[TODAY].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 28 }}>{PLAN[TODAY].icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{PLAN[TODAY].type}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{PLAN[TODAY].focus}</div>
                  </div>
                  <button className="btn-orange" onClick={() => { setSelectedDay(TODAY); setPage("workout"); }}>View Workout →</button>
                </div>
              </div>
            </div>

            {/* Calorie quick view */}
            <div style={{ marginBottom: 20 }}>
              <div className="section-title">NUTRITION TODAY</div>
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ position: "relative" }}>
                    <Ring val={totalCal} max={USER.calorieTarget} color="#f97316" size={70} stroke={6} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{totalCal}</div>
                      <div style={{ fontSize: 9, color: "#64748b" }}>kcal</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Bar label="Protein" val={totalP} max={USER.proteinTarget} color="#22c55e" unit="g" />
                    <Bar label="Carbs" val={totalC} max={USER.carbsTarget} color="#3b82f6" unit="g" />
                    <Bar label="Fat" val={totalF} max={USER.fatTarget} color="#a855f7" unit="g" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-orange" style={{ flex: 1 }} onClick={() => setPage("nutrition")}>Log Food +</button>
                  <button className="btn-orange" style={{ flex: 1, background: "#1a3a2a", color: "#22c55e", border: "1px solid #22c55e" }} onClick={() => setPage("scanner")}>📷 Scan</button>
                </div>
              </div>
            </div>

            {/* Water tracker */}
            <div style={{ marginBottom: 20 }}>
              <div className="section-title">WATER</div>
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>{water}<span style={{ fontSize: 14, color: "#64748b" }}>/{USER.waterTarget} cups</span></div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{Math.round(water * 237)}ml · Goal: {Math.round(USER.waterTarget * 237)}ml (~3L)</div>
                  </div>
                  <div style={{ fontSize: 30 }}>💧</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {Array.from({ length: USER.waterTarget }).map((_, i) => (
                    <div key={i} onClick={() => setWater(i + 1)} style={{
                      width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
                      background: i < water ? "#3b82f6" : "#1e293b",
                      border: "1px solid", borderColor: i < water ? "#3b82f6" : "#334155",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setWater(Math.max(0, water - 1))}>−</button>
                  <button className="btn-orange" style={{ flex: 2 }} onClick={() => setWater(Math.min(USER.waterTarget, water + 1))}>+ Add Cup</button>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setWater(0)}>Reset</button>
                </div>
              </div>
            </div>

            {/* Weekly overview */}
            <div>
              <div className="section-title">WEEKLY PLAN</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DAYS.map(day => (
                  <div key={day} onClick={() => { setSelectedDay(day); setPage("workout"); }}
                    className="card" style={{
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", borderLeft: `3px solid ${PLAN[day].color}`,
                      opacity: day === TODAY ? 1 : 0.8,
                      background: day === TODAY ? "#1e2a3a" : "#1e293b",
                    }}>
                    <div style={{ fontSize: 22 }}>{PLAN[day].icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{day}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{PLAN[day].type} · {PLAN[day].focus}</div>
                    </div>
                    {day === TODAY && <span className="tag" style={{ background: "#f97316", color: "#0f172a" }}>TODAY</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ WORKOUT ══════════ */}
        {page === "workout" && (
          <div className="slide-in" style={{ padding: 20, width: "100%", boxSizing: "border-box" }}>
            {/* Day selector */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)} className={selectedDay === d ? "" : "chip"}
                  style={selectedDay === d ? {
                    background: PLAN[d].color, color: "#0f172a", border: "none", borderRadius: 20,
                    padding: "4px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit"
                  } : {}}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Day header */}
            <div className="card" style={{ borderLeft: `3px solid ${dayPlan.color}`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 26 }}>{dayPlan.icon}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1, color: dayPlan.color, marginTop: 2 }}>{dayPlan.type}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{dayPlan.focus}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button onClick={() => setGymMode(true)} style={{
                    background: gymMode ? "#f97316" : "transparent", color: gymMode ? "#0f172a" : "#94a3b8",
                    border: "1px solid", borderColor: gymMode ? "#f97316" : "#334155",
                    borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer"
                  }}>🏋️ Gym</button>
                  <button onClick={() => setGymMode(false)} style={{
                    background: !gymMode ? "#22c55e" : "transparent", color: !gymMode ? "#0f172a" : "#94a3b8",
                    border: "1px solid", borderColor: !gymMode ? "#22c55e" : "#334155",
                    borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer"
                  }}>🏠 Home</button>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="section-title">EXERCISES ({exercises.length})</div>
            {exercises.map((ex, i) => {
              const key = `${selectedDay}-${i}`;
              const done = completedEx[key];
              return (
                <div key={i} className="card" style={{ marginBottom: 10, borderLeft: "2px solid " + (done ? "#22c55e" : "#334155"), opacity: done ? 0.7 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
                    onClick={() => setExpandedEx(prev => ({ ...prev, [key]: !prev[key] }))}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={e => { e.stopPropagation(); setCompletedEx(p => ({ ...p, [key]: !p[key] })) }
                        } style={{
                          width: 20, height: 20, borderRadius: "50%", border: "2px solid",
                          borderColor: done ? "#22c55e" : "#475569", background: done ? "#22c55e" : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>
                          {done && <span style={{ color: "#0f172a", fontSize: 11, fontWeight: 900 }}>✓</span>}
                        </button>
                        <span style={{ fontWeight: 600, fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "#64748b" : "#f1f5f9" }}>{ex.name}</span>
                      </div>
                      <div style={{ marginTop: 4, marginLeft: 28, display: "flex", gap: 10 }}>
                        {ex.sets !== 1 && <span className="tag" style={{ background: "#1a2535", color: "#f97316", fontSize: 11 }}>{ex.sets} sets</span>}
                        <span className="tag" style={{ background: "#1a2535", color: "#3b82f6", fontSize: 11 }}>{ex.reps}</span>
                        <span className="tag" style={{ background: "#1a2535", color: "#64748b", fontSize: 11 }}>{ex.rest}</span>
                      </div>
                    </div>
                    <span style={{ color: "#475569", fontSize: 16 }}>{expandedEx[key] ? "▲" : "▼"}</span>
                  </div>
                  {expandedEx[key] && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #334155", marginLeft: 28 }}>
                      <div style={{ fontSize: 12, color: "#22c55e" }}>💡 {ex.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Progress */}
            {exercises.length > 0 && (
              <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Workout Progress</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>{Object.values(completedEx).filter(Boolean).length} / {exercises.length}</div>
                <div style={{ height: 6, borderRadius: 3, background: "#0f172a", marginTop: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, background: "#22c55e",
                    width: `${(Object.values(completedEx).filter(Boolean).length / exercises.length) * 100}%`,
                    transition: "width 0.4s ease"
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ NUTRITION ══════════ */}
        {page === "nutrition" && (
          <div className="slide-in" style={{ padding: 20, overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>
            {/* Macro summary */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
                {[
                  { label: "Calories", val: totalCal, max: USER.calorieTarget, color: "#f97316", unit: "" },
                  { label: "Protein", val: totalP, max: USER.proteinTarget, color: "#22c55e", unit: "g" },
                  { label: "Carbs", val: totalC, max: USER.carbsTarget, color: "#3b82f6", unit: "g" },
                  { label: "Fat", val: totalF, max: USER.fatTarget, color: "#a855f7", unit: "g" },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <Ring val={m.val} max={m.max} color={m.color} size={44} stroke={4} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.val}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>{m.label}</div>
                    <div style={{ fontSize: 9, color: "#475569" }}>{m.unit}/{m.max}{m.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-orange" style={{ flex: 1 }} onClick={() => setPage("scanner")}>📷 Scan Food</button>
                <button className="btn-ghost" onClick={() => setFoodLog([])}>Clear Log</button>
              </div>
            </div>

            {/* Food log */}
            {foodLog.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="section-title">TODAY'S LOG</div>
                {foodLog.map(f => (
                  <div key={f.logId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "10px 14px" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{f.serving} · {f.p}g P · {f.c}g C · {f.f}g F</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 700, color: "#f97316" }}>{f.cal}</div>
                      <button onClick={() => removeFood(f.logId)} style={{ background: "#3d1515", border: "1px solid #7f1d1d", color: "#f87171", borderRadius: 6, padding: "3px 8px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Food database */}
            <div className="section-title">ADD FOOD</div>
            <input placeholder="Search dal, paneer, roti..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
              {["all", "staple", "dal", "sabzi", "protein", "dairy", "fruit", "nuts"].map(cat => (
                <button key={cat} className={`chip ${foodCat === cat ? "active" : ""}`} onClick={() => setFoodCat(cat)}>{cat}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredFoods.map(f => (
                <div key={f.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{f.serving} · <span style={{ color: "#22c55e" }}>{f.p}g P</span> · {f.c}g C · {f.f}g F</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontWeight: 700, color: "#f97316", fontSize: 14 }}>{f.cal}</div>
                    <button className="btn-orange" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => addFood(f)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Protein tip */}
            <div style={{ background: "#142214", border: "1px solid #166534", borderRadius: 12, padding: 14, marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 6 }}>💡 VEGETARIAN PROTEIN STRATEGY</div>
              <div style={{ fontSize: 12, color: "#86efac", lineHeight: 1.6 }}>
                Daily targets: <strong>Soya chunks</strong> (60g dry = 31g protein) + <strong>Paneer</strong> (150g = 27g protein) + <strong>Dal</strong> (2 cups = 16g protein) + <strong>Curd</strong> (2 cups = 16g protein) = ~90g base. Add milk + peanut butter to reach 145g goal.
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SCANNER ══════════ */}
        {page === "scanner" && (
          <div className="slide-in" style={{ padding: 20, width: "100%", boxSizing: "border-box" }}>
            <div className="section-title">AI FOOD SCANNER</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Point camera at any food — stores, fast food, home cooked — and get instant nutrition info.</div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            {scanState === "idle" && !scanResult && (
              <div>
                <div style={{ background: "#1e293b", borderRadius: 14, border: "2px dashed #334155", padding: 40, textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Scan Any Food</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Works with Indian meals, store products, fast food, and more</div>
                  <button className="btn-orange" onClick={startCamera}>Open Camera</button>
                </div>
                {scanError && <div style={{ background: "#3d1515", border: "1px solid #7f1d1d", borderRadius: 10, padding: 12, color: "#fca5a5", fontSize: 13 }}>{scanError}</div>}
              </div>
            )}

            {scanState === "scanning" && (
              <div>
                <video ref={videoRef} autoPlay playsInline muted style={{ marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-orange" style={{ flex: 2 }} onClick={captureAndAnalyze}>📸 Capture & Analyze</button>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { stopCamera(); setScanState("idle"); }}>Cancel</button>
                </div>
              </div>
            )}

            {scanState === "analyzing" && (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }} className="pulse">🔍</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Analyzing your food...</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Claude AI is identifying nutrition info</div>
              </div>
            )}

            {scanState === "result" && scanResult && (
              <div>
                <div className="card" style={{ borderLeft: "3px solid #22c55e", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: "#22c55e", marginBottom: 4 }}>{scanResult.foodName}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{scanResult.servingSize}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Calories", val: `${scanResult.calories} kcal`, color: "#f97316" },
                      { label: "Protein", val: `${scanResult.protein_g}g`, color: "#22c55e" },
                      { label: "Carbs", val: `${scanResult.carbs_g}g`, color: "#3b82f6" },
                      { label: "Fat", val: `${scanResult.fat_g}g`, color: "#a855f7" },
                    ].map(m => (
                      <div key={m.label} style={{ background: "#0f172a", borderRadius: 8, padding: 10, textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: m.color }}>{m.val}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {scanResult.notes && <div style={{ fontSize: 12, color: "#94a3b8", background: "#0f172a", borderRadius: 8, padding: 10 }}>💡 {scanResult.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-orange" style={{ flex: 2 }} onClick={addScannedFood}>Add to Log ✓</button>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setScanResult(null); setScanState("idle"); }}>Discard</button>
                </div>
              </div>
            )}

            {/* Manual tips */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Add Common Meals</div>
              {[
                { name: "Dal Rice (home meal)", cal: 330, p: 12, c: 65, f: 3 },
                { name: "Roti Sabzi (2 roti + veg)", cal: 220, p: 7, c: 36, f: 6 },
                { name: "Paneer Curry + Rice", cal: 480, p: 22, c: 48, f: 24 },
                { name: "Idli Sambar (3+1)", cal: 207, p: 10, c: 38, f: 3 },
              ].map((m, i) => (
                <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "10px 14px" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{m.p}g P · {m.c}g C · {m.f}g F</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, color: "#f97316" }}>{m.cal}</span>
                    <button className="btn-orange" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => { addFood({ ...m, serving: "1 serving", logId: Date.now() }); setPage("nutrition"); }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ TIPS ══════════ */}
        {page === "tips" && (
          <div className="slide-in" style={{ padding: 20, width: "100%", boxSizing: "border-box" }}>

            {/* Skincare */}
            <div className="section-title">SKINCARE ROUTINE</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["morning", "night"].map(t => (
                <button key={t} onClick={() => setSkincareTab(t)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, border: "1px solid", fontWeight: 600, fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                  background: skincareTab === t ? "#f97316" : "transparent",
                  color: skincareTab === t ? "#0f172a" : "#94a3b8",
                  borderColor: skincareTab === t ? "#f97316" : "#334155",
                }}>{t === "morning" ? "☀️ Morning" : "🌙 Night"}</button>
              ))}
            </div>
            {SKIN_ROUTINE[skincareTab].map((s, i) => (
              <div key={i} className="card" style={{ marginBottom: 10, display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f97316", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#f97316", marginBottom: 2 }}>{s.brand}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            {/* Daily habits */}
            <div style={{ marginTop: 24 }}>
              <div className="section-title">DAILY HABITS</div>
              {DAILY_TIPS.map((t, i) => (
                <div key={i} className="card" style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px" }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{t.tip}</div>
                </div>
              ))}
            </div>

            {/* Athletic tips */}
            <div style={{ marginTop: 24 }}>
              <div className="section-title">JUMP HIGHER & MOVE FASTER</div>
              {[
                { icon: "🏀", title: "For vertical jump", desc: "Consistency is everything. Tuesday + Friday athletic days build reactive strength in 4-6 weeks. Add calf raises daily — ankle stiffness = free 2-3 inches." },
                { icon: "⚡", title: "Sprint mechanics", desc: "Arms drive legs. Pump arms hard to run faster. High knees aren't just a warm-up — they're training your stride. Do them daily." },
                { icon: "🧠", title: "CNS & sleep", desc: "Your nervous system builds explosive power during sleep. 8 hours is non-negotiable for athletic gains. Caffeine 30-60 min before training helps CNS." },
                { icon: "🦵", title: "Bulgarian split squats", desc: "Best single exercise for athleticism. Thursday mandatory. Builds unilateral strength that directly transfers to jumping, sprinting, and cutting." },
                { icon: "🥗", title: "Pre-workout meal", desc: "Eat 1-2 roti + dal + banana 90 min before training. Carbs = fuel for explosive output. Don't train fasted for athletic sessions." },
              ].map((t, i) => (
                <div key={i} className="card" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 24 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#f97316", marginBottom: 4 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{t.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Belly fat */}
            <div style={{ marginTop: 24 }}>
              <div className="section-title">LOSING THE BELLY</div>
              <div className="card" style={{ borderLeft: "3px solid #f97316" }}>
                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>
                  At 6'0" 145lbs, you're "skinny fat" — normal weight but higher body fat. The strategy:<br />
                  <br />
                  <span style={{ color: "#f97316", fontWeight: 600 }}>1. Eat at maintenance or slight surplus</span> (~2300–2400 cal). You need calories to build muscle.<br />
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>2. Hit 145g protein daily</span>. Preserves muscle while fat is lost.<br />
                  <span style={{ color: "#3b82f6", fontWeight: 600 }}>3. Do ALL workouts</span>. Lifting + athletic days = body recomp.<br />
                  <span style={{ color: "#a855f7", fontWeight: 600 }}>4. Be patient</span>. 3-4 months of this = visible abs, real muscle. Summer is your foundation.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 440, background: "#0f172a",
        borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom, 8px)", paddingTop: 4, zIndex: 20,
      }}>
        <NavBtn id="home" icon="🏠" label="Home" />
        <NavBtn id="workout" icon="🏋️" label="Workout" />
        <NavBtn id="nutrition" icon="🥗" label="Nutrition" />
        <NavBtn id="scanner" icon="📷" label="Scan" />
        <NavBtn id="tips" icon="💡" label="Tips" />
      </div>
    </div>
  );
}