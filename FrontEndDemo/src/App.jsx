import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  blue: "#0066FF", blueLt: "#E8F1FF", blueDk: "#0047B3",
  teal: "#00B894", tealLt: "#E0FBF4",
  amber: "#F59E0B", amberLt: "#FEF3C7",
  red: "#EF4444", redLt: "#FEE2E2",
  purple: "#7C3AED", purpleLt: "#EDE9FE",
  orange: "#F97316", orangeLt: "#FFEDD5",
  gray1: "#F8F9FC", gray2: "#EEF0F6", gray3: "#D1D5E0",
  gray4: "#8892A4", gray5: "#3D4557", text: "#181C2E", white: "#ffffff",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${G.gray1}; color: ${G.text}; font-size: 14px; -webkit-font-smoothing: antialiased; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  input, select { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.gray3}; border-radius: 99px; }

  @keyframes slideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse   { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.06); } }
  @keyframes shimmer { 0%{ background-position:-400px 0; } 100%{ background-position:400px 0; } }
  @keyframes slideInRight { from{ opacity:0; transform:translateX(40px); } to{ opacity:1; transform:translateX(0); } }
  @keyframes bounceIn { 0%{ transform:scale(0.7); opacity:0; } 60%{ transform:scale(1.05); } 100%{ transform:scale(1); opacity:1; } }

  .anim-up  { animation: slideUp 0.4s cubic-bezier(.22,.68,0,1.2) both; }
  .anim-fade{ animation: fadeIn 0.3s ease both; }
  .anim-in-r{ animation: slideInRight 0.35s cubic-bezier(.22,.68,0,1.2) both; }

  .hover-lift { transition: transform 0.18s, box-shadow 0.18s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,102,255,0.10); }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id:"T001", time:"11:42 AM", date:"2026-04-03", category:"Groceries",     items:"Atta 5kg, Dal 1kg",        mode:"UPI",    amount:420,  profit:84  },
  { id:"T002", time:"10:15 AM", date:"2026-04-03", category:"Beverages",     items:"Cold drinks ×4, Water ×2", mode:"QR Scan",amount:180,  profit:42  },
  { id:"T003", time:"09:05 AM", date:"2026-04-03", category:"Snacks",        items:"Chips ×3, Biscuits ×4",    mode:"Wallet", amount:260,  profit:65  },
  { id:"T004", time:"08:30 AM", date:"2026-04-03", category:"Personal Care", items:"Soap ×2, Shampoo",         mode:"Card",   amount:340,  profit:102 },
  { id:"T005", time:"07:55 AM", date:"2026-04-03", category:"Groceries",     items:"Amul Milk 1L ×3",          mode:"UPI",    amount:195,  profit:39  },
  { id:"T006", time:"07:10 AM", date:"2026-04-03", category:"Dairy",         items:"Paneer 200g, Curd 400g",   mode:"Wallet", amount:155,  profit:31  },
  { id:"T007", time:"06:45 AM", date:"2026-04-03", category:"Snacks",        items:"Maggi ×6, Noodles",        mode:"UPI",    amount:210,  profit:52  },
  { id:"T008", time:"05:30 PM", date:"2026-04-02", category:"Beverages",     items:"Pepsi 2L, Limca ×2",       mode:"QR Scan",amount:140,  profit:35  },
  { id:"T009", time:"04:15 PM", date:"2026-04-02", category:"Groceries",     items:"Rice 5kg, Masala",         mode:"Card",   amount:680,  profit:136 },
  { id:"T010", time:"03:00 PM", date:"2026-04-02", category:"Personal Care", items:"Dettol, Toothpaste",       mode:"UPI",    amount:290,  profit:87  },
  { id:"T011", time:"01:30 PM", date:"2026-04-02", category:"Snacks",        items:"Kurkure ×5, Lays ×3",      mode:"Wallet", amount:175,  profit:44  },
  { id:"T012", time:"12:00 PM", date:"2026-04-02", category:"Dairy",         items:"Butter 500g, Cheese",      mode:"UPI",    amount:380,  profit:76  },
];

const INVENTORY = [
  { id:"I001", name:"Amul Milk 1L",      category:"Dairy",        stock:8,   minStock:15, unit:"packets",  sold7d:62, velocity:"high",  restockEst:"Today"    },
  { id:"I002", name:"Aashirvaad Atta 5kg",category:"Groceries",   stock:4,   minStock:10, unit:"bags",     sold7d:28, velocity:"high",  restockEst:"Tomorrow" },
  { id:"I003", name:"Parle-G 400g",       category:"Snacks",      stock:12,  minStock:20, unit:"packs",    sold7d:44, velocity:"high",  restockEst:"2 days"   },
  { id:"I004", name:"Tata Tea Gold 500g", category:"Beverages",   stock:6,   minStock:12, unit:"boxes",    sold7d:18, velocity:"med",   restockEst:"3 days"   },
  { id:"I005", name:"Dettol Handwash",    category:"Personal Care",stock:3,   minStock:8,  unit:"bottles",  sold7d:9,  velocity:"med",   restockEst:"Today"    },
  { id:"I006", name:"Maggi 2-Minute",     category:"Snacks",      stock:18,  minStock:24, unit:"packets",  sold7d:31, velocity:"high",  restockEst:"2 days"   },
  { id:"I007", name:"Amul Butter 500g",   category:"Dairy",       stock:5,   minStock:10, unit:"packs",    sold7d:22, velocity:"high",  restockEst:"Tomorrow" },
  { id:"I008", name:"Pepsi 2L",           category:"Beverages",   stock:9,   minStock:12, unit:"bottles",  sold7d:14, velocity:"med",   restockEst:"3 days"   },
  { id:"I009", name:"Colgate Paste 200g", category:"Personal Care",stock:7,   minStock:10, unit:"tubes",    sold7d:8,  velocity:"low",   restockEst:"4 days"   },
  { id:"I010", name:"Sunflower Oil 1L",   category:"Groceries",   stock:11,  minStock:15, unit:"bottles",  sold7d:19, velocity:"med",   restockEst:"3 days"   },
];

const CATEGORIES = ["All", "Groceries", "Beverages", "Snacks", "Personal Care", "Dairy"];
const MODES = ["All", "UPI", "QR Scan", "Wallet", "Card"];
const CAT_ICONS = {
  Groceries: "🛒", Beverages: "🥤", Snacks: "🍿", "Personal Care": "🧴",
  Dairy: "🥛", Others: "📦",
};
const CAT_COLORS = {
  Groceries: G.blue, Beverages: G.teal, Snacks: G.purple,
  "Personal Care": G.amber, Dairy: G.orange, Others: G.gray4,
};
const MODE_COLORS = {
  UPI: G.blue, "QR Scan": G.teal, Wallet: G.purple, Card: G.amber,
};
const VELOCITY_COLOR = { high: G.red, med: G.amber, low: G.teal };
const VELOCITY_BG    = { high: G.redLt, med: G.amberLt, low: G.tealLt };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pct = (s, m) => Math.round((s / m) * 100);
const fmt = n => "₹" + n.toLocaleString("en-IN");

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const Badge = ({ label, color, bg }) => (
  <span style={{
    display:"inline-flex", alignItems:"center",
    background: bg, color, fontSize:11, fontWeight:500,
    padding:"2px 9px", borderRadius:99, whiteSpace:"nowrap",
  }}>{label}</span>
);

const Card = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: G.white, borderRadius:14,
    border: `1px solid ${G.gray2}`, padding:"18px",
    ...style,
  }}>{children}</div>
);

const StatCard = ({ label, value, badge, badgeType, icon, accent }) => (
  <Card className="hover-lift anim-up" style={{ padding:"16px 18px", position:"relative", overflow:"hidden" }}>
    <div style={{ fontSize:11, color:G.gray4, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>{label}</div>
    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:600 }}>{value}</div>
    {badge && (
      <div style={{
        display:"inline-flex", alignItems:"center", gap:3, fontSize:11,
        padding:"2px 7px", borderRadius:20, marginTop:5, fontWeight:500,
        background: badgeType==="up" ? G.tealLt : G.redLt,
        color: badgeType==="up" ? "#059669" : G.red,
      }}>{badge}</div>
    )}
    <div style={{
      position:"absolute", right:14, top:14, width:36, height:36,
      borderRadius:10, background: accent, display:"flex",
      alignItems:"center", justifyContent:"center", fontSize:18,
    }}>{icon}</div>
  </Card>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:18 }}>
    <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:600 }}>{title}</h2>
    {sub && <p style={{ fontSize:12, color:G.gray4, marginTop:2 }}>{sub}</p>}
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { key:"dashboard",    label:"Dashboard",    icon:"⬛" },
  { key:"transactions", label:"Transactions", icon:"↕" },
  { key:"inventory",    label:"Inventory",    icon:"📦" },
  { key:"insights",     label:"Insights",     icon:"📈" },
];

const Sidebar = ({ page, setPage, onNotif }) => (
  <div style={{
    background: G.text, padding:"24px 0",
    display:"flex", flexDirection:"column", minHeight:"100vh",
    width:220, flexShrink:0,
  }}>
    {/* Logo */}
    <div style={{ padding:"0 20px 24px", display:"flex", alignItems:"center", gap:10 }}>
      <div style={{
        width:36, height:36, background:G.blue, borderRadius:10,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:16,
      }}>💳</div>
      <div>
        <div style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:600, color:"white" }}>VendorIQ</div>
        <div style={{ fontSize:10, color:G.gray4, letterSpacing:"0.5px", textTransform:"uppercase" }}>Paytm Analytics</div>
      </div>
    </div>

    {/* Nav */}
    <div style={{ padding:"0 12px", flex:1 }}>
      <div style={{ fontSize:10, color:G.gray4, letterSpacing:"1px", textTransform:"uppercase", padding:"8px 10px 6px" }}>Menu</div>
      {NAV.map(n => (
        <div key={n.key} onClick={() => setPage(n.key)} style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"9px 10px", borderRadius:8, marginBottom:2,
          background: page===n.key ? G.blue : "transparent",
          color: page===n.key ? "white" : G.gray4,
          cursor:"pointer", fontSize:13.5, transition:"all 0.15s",
          fontFamily:"'DM Sans',sans-serif",
        }}>
          <span style={{ fontSize:14 }}>{n.icon}</span>
          {n.label}
          {n.key==="inventory" && (
            <span style={{
              marginLeft:"auto", background:G.red, color:"white",
              fontSize:10, padding:"1px 6px", borderRadius:20,
            }}>5</span>
          )}
        </div>
      ))}

      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:10, color:G.gray4, letterSpacing:"1px", textTransform:"uppercase", padding:"8px 10px 6px" }}>Account</div>
        <div style={{
          display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
          borderRadius:8, color:G.gray4, cursor:"pointer", fontSize:13.5,
        }}>
          <span style={{ fontSize:14 }}>⚙️</span> Settings
        </div>
        <div onClick={onNotif} style={{
          display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
          borderRadius:8, color:G.gray4, cursor:"pointer", fontSize:13.5,
          transition:"all 0.15s",
        }}>
          <span style={{ fontSize:14 }}>🔔</span>
          Tag Payment
          <span style={{
            marginLeft:"auto", background:G.amber, color:"white",
            fontSize:10, padding:"1px 6px", borderRadius:20,
            animation:"pulse 2s infinite",
          }}>!</span>
        </div>
      </div>
    </div>

    {/* User */}
    <div style={{ padding:"16px 12px 0", borderTop:`1px solid rgba(255,255,255,0.07)` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:10 }}>
        <div style={{
          width:34, height:34, borderRadius:"50%", background:G.blue,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:600, color:"white",
        }}>RK</div>
        <div>
          <div style={{ fontSize:13, fontWeight:500, color:"white" }}>Ramesh Kumar</div>
          <div style={{ fontSize:11, color:G.gray4 }}>Kirana Store, Jhansi</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const HOURS = ["8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p"];
const HOUR_VALS = [1800,2400,3100,4200,5100,4600,3800,3200,4700,5400,6200,3900];
const DONUT_CATS = [
  { name:"Groceries",     pct:43, color:G.blue   },
  { name:"Beverages",     pct:21, color:G.teal   },
  { name:"Snacks",        pct:17, color:G.purple  },
  { name:"Personal Care", pct:12, color:G.amber   },
  { name:"Others",        pct:7,  color:G.gray3   },
];
const TOP_ITEMS = [
  { name:"Amul Butter 500g",     val:"₹8,400", pct:95, color:G.blue   },
  { name:"Aashirvaad Atta 5kg",  val:"₹6,200", pct:70, color:G.teal   },
  { name:"Parle-G Biscuits",     val:"₹4,800", pct:54, color:G.purple  },
  { name:"Tata Tea Gold 500g",   val:"₹3,900", pct:44, color:G.amber   },
  { name:"Maggi Noodles ×12",    val:"₹3,400", pct:38, color:G.red     },
];
const PREDICT_DATA = [
  { time:"8 AM – 11 AM",  product:"Milk, Bread, Eggs",       score:"94%" },
  { time:"11 AM – 2 PM",  product:"Snacks, Cold drinks",     score:"87%" },
  { time:"2 PM – 5 PM",   product:"Atta, Dal, Cooking oil",  score:"81%" },
  { time:"5 PM – 8 PM",   product:"Chips, Biscuits, Tea",    score:"78%" },
  { time:"8 PM – 10 PM",  product:"Ice cream, Soft drinks",  score:"72%" },
];

const DonutChart = () => {
  const cx=60, cy=60, r=42;
  let offset=-90;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:18 }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ flexShrink:0 }}>
        {DONUT_CATS.map((c,i) => {
          const deg=(c.pct/100)*360;
          const rad=s=>(s*Math.PI)/180;
          const x1=cx+r*Math.cos(rad(offset)), y1=cy+r*Math.sin(rad(offset));
          const x2=cx+r*Math.cos(rad(offset+deg)), y2=cy+r*Math.sin(rad(offset+deg));
          const large=deg>180?1:0;
          const path=`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
          offset+=deg;
          return <path key={i} d={path} fill={c.color} opacity={0.9}/>;
        })}
        <circle cx={cx} cy={cy} r={28} fill="white"/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={13} fontWeight={600} fill={G.text}>₹42K</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize={9} fill={G.gray4}>today</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:7, flex:1 }}>
        {DONUT_CATS.map((c,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
            <div style={{ fontSize:12, color:G.gray5, flex:1 }}>{c.name}</div>
            <div style={{ fontSize:12, fontWeight:500 }}>{c.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ setShowPredict }) => {
  const mx = Math.max(...HOUR_VALS);
  return (
    <div style={{ padding:24 }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
        <div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:600 }}>Good morning, Ramesh 👋</h1>
          <p style={{ fontSize:13, color:G.gray4, marginTop:2 }}>Here's what's happening with your store today</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{
            background:G.white, border:`1px solid ${G.gray3}`, borderRadius:8,
            padding:"7px 12px", fontSize:12.5, color:G.gray5, display:"flex", alignItems:"center", gap:6,
          }}>📅 3 Apr 2026</div>
          <button onClick={() => setShowPredict(true)} style={{
            background:G.blue, color:"white", border:"none", borderRadius:8,
            padding:"8px 14px", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:6,
          }}>⚡ Predict Sales</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <StatCard label="Total Revenue"    value="₹42,380" badge="↑ 12.4% vs yesterday" badgeType="up" icon="💰" accent={G.blueLt}/>
        <StatCard label="Transactions"     value="186"     badge="↑ 8 more than avg"    badgeType="up" icon="↕" accent={G.tealLt}/>
        <StatCard label="Top Category"     value="Groceries" badge="₹18,200 earned"      badgeType="up" icon="🛒" accent={G.purpleLt}/>
        <StatCard label="Avg Order Value"  value="₹228"    badge="↓ 3.1% vs last week"  badgeType="dn" icon="📊" accent={G.amberLt}/>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <Card className="anim-up">
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:600, marginBottom:2 }}>Sales by hour</div>
          <div style={{ fontSize:12, color:G.gray4, marginBottom:14 }}>Today's revenue distribution</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:110 }}>
            {HOURS.map((h,i) => {
              const p=Math.round((HOUR_VALS[i]/mx)*100);
              const isTop=i===10;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ flex:1, display:"flex", alignItems:"flex-end", width:"100%", height:90 }}>
                    <div style={{
                      width:"100%", borderRadius:"4px 4px 0 0",
                      height:`${p}%`, minHeight:4,
                      background: isTop ? G.blue : G.gray2,
                      transition:"opacity 0.2s",
                    }}/>
                  </div>
                  <div style={{ fontSize:10, color:G.gray4 }}>{h}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="anim-up">
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:600, marginBottom:2 }}>Category breakdown</div>
          <div style={{ fontSize:12, color:G.gray4, marginBottom:14 }}>Revenue share by category</div>
          <DonutChart/>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card className="anim-up">
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:600, marginBottom:4 }}>Paytm payment feed</div>
          <div style={{ fontSize:12, color:G.gray4, marginBottom:14 }}>Recent tagged transactions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {TRANSACTIONS.slice(0,4).map(t => (
              <div key={t.id} style={{
                display:"flex", alignItems:"flex-start", gap:10,
                background:G.gray1, borderRadius:8, padding:"10px 12px",
              }}>
                <div style={{
                  width:32, height:32, borderRadius:9, flexShrink:0,
                  background: (CAT_COLORS[t.category]||G.gray4)+"22",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                }}>{CAT_ICONS[t.category]||"📦"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:500, marginBottom:2 }}>{t.category} — {t.items}</div>
                  <div style={{ fontSize:11, color:G.gray4 }}>{t.time} · {t.mode}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:G.teal, flexShrink:0 }}>+{fmt(t.amount)}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="anim-up">
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:600, marginBottom:4 }}>Top selling items</div>
          <div style={{ fontSize:12, color:G.gray4, marginBottom:14 }}>By revenue this week</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {TOP_ITEMS.map((p,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ fontSize:11, color:G.gray4, width:16, textAlign:"right" }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:500, marginBottom:3 }}>{p.name}</div>
                  <div style={{ height:5, background:G.gray2, borderRadius:10, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${p.pct}%`, background:p.color, borderRadius:10 }}/>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:500, minWidth:52, textAlign:"right" }}>{p.val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── TRANSACTIONS PAGE ─────────────────────────────────────────────────────────
const Transactions = () => {
  const [cat, setCat]   = useState("All");
  const [mode, setMode] = useState("All");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("time");

  const filtered = TRANSACTIONS.filter(t =>
    (cat==="All"  || t.category===cat) &&
    (mode==="All" || t.mode===mode) &&
    (!date || t.date===date) &&
    (!search || t.items.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => sort==="amount" ? b.amount-a.amount : 0);

  const totalAmt = filtered.reduce((s,t) => s+t.amount, 0);
  const totalProfit = filtered.reduce((s,t) => s+t.profit, 0);

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding:"5px 13px", borderRadius:99, fontSize:12.5, fontWeight:500,
      border:`1px solid ${active ? G.blue : G.gray3}`,
      background: active ? G.blue : G.white,
      color: active ? "white" : G.gray5,
      transition:"all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:600 }}>Transactions</h1>
          <p style={{ fontSize:13, color:G.gray4, marginTop:2 }}>All Paytm payments with labels</p>
        </div>
        <button style={{
          background:G.teal, color:"white", border:"none", borderRadius:8,
          padding:"8px 14px", fontSize:13, fontWeight:500,
        }}>⬇ Export CSV</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Filtered Revenue", value:fmt(totalAmt),   color:G.blue,  bg:G.blueLt   },
          { label:"Filtered Profit",  value:fmt(totalProfit), color:G.teal,  bg:G.tealLt   },
          { label:"Transactions",     value:filtered.length,  color:G.purple,bg:G.purpleLt  },
        ].map((s,i) => (
          <div key={i} className="anim-up hover-lift" style={{
            background:G.white, borderRadius:14, border:`1px solid ${G.gray2}`,
            padding:"14px 18px", display:"flex", alignItems:"center", gap:14,
          }}>
            <div style={{ width:42, height:42, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:s.color }}/>
            </div>
            <div>
              <div style={{ fontSize:11, color:G.gray4, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.label}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:600 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
          <input
            placeholder="🔍  Search items or category..."
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{
              border:`1px solid ${G.gray3}`, borderRadius:8, padding:"7px 12px",
              fontSize:13, outline:"none", width:220, color:G.text,
            }}
          />
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{
            border:`1px solid ${G.gray3}`, borderRadius:8, padding:"7px 10px",
            fontSize:13, color:G.gray5, outline:"none",
          }}/>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:12, color:G.gray4 }}>Sort:</span>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{
              border:`1px solid ${G.gray3}`, borderRadius:8, padding:"6px 10px",
              fontSize:12.5, color:G.gray5, outline:"none", background:G.white,
            }}>
              <option value="time">Time</option>
              <option value="amount">Amount ↓</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:6 }}>
          <span style={{ fontSize:11, color:G.gray4, alignSelf:"center", marginRight:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>Category:</span>
          {CATEGORIES.map(c => <Chip key={c} label={c} active={cat===c} onClick={()=>setCat(c)}/>)}
        </div>
        <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:6 }}>
          <span style={{ fontSize:11, color:G.gray4, alignSelf:"center", marginRight:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>Mode:</span>
          {MODES.map(m => <Chip key={m} label={m} active={mode===m} onClick={()=>setMode(m)}/>)}
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:G.gray1, borderBottom:`1px solid ${G.gray2}` }}>
                {["ID","Time","Category","Items","Mode","Amount","Profit"].map(h => (
                  <th key={h} style={{
                    padding:"10px 16px", fontSize:11, fontWeight:600,
                    color:G.gray4, textAlign:"left", textTransform:"uppercase",
                    letterSpacing:"0.5px", whiteSpace:"nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:G.gray4, fontSize:13 }}>No transactions match the filters</td></tr>
              ) : filtered.map((t,i) => (
                <tr key={t.id} className="anim-up" style={{
                  borderBottom:`1px solid ${G.gray2}`,
                  animationDelay:`${i*0.04}s`,
                  transition:"background 0.15s",
                }}>
                  <td style={{ padding:"12px 16px", fontSize:12, color:G.gray4, whiteSpace:"nowrap" }}>{t.id}</td>
                  <td style={{ padding:"12px 16px", fontSize:12.5, whiteSpace:"nowrap" }}>
                    <div style={{ fontWeight:500 }}>{t.time}</div>
                    <div style={{ fontSize:11, color:G.gray4 }}>{t.date}</div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <span style={{
                        width:28, height:28, borderRadius:8, flexShrink:0,
                        background: (CAT_COLORS[t.category]||G.gray4)+"18",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:13,
                      }}>{CAT_ICONS[t.category]||"📦"}</span>
                      <Badge label={t.category} color={CAT_COLORS[t.category]||G.gray4} bg={(CAT_COLORS[t.category]||G.gray4)+"18"}/>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:12.5, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.items}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <Badge label={t.mode} color={MODE_COLORS[t.mode]||G.gray4} bg={(MODE_COLORS[t.mode]||G.gray4)+"18"}/>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:13.5, fontWeight:600, color:G.teal, whiteSpace:"nowrap" }}>+{fmt(t.amount)}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, fontWeight:500, color:G.gray5, whiteSpace:"nowrap" }}>{fmt(t.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          padding:"10px 16px", fontSize:12, color:G.gray4,
          borderTop:`1px solid ${G.gray2}`, background:G.gray1,
        }}>Showing {filtered.length} of {TRANSACTIONS.length} transactions</div>
      </Card>
    </div>
  );
};

// ─── INVENTORY ALERTS PAGE ────────────────────────────────────────────────────
const Inventory = () => {
  const [filter, setFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");

  const URGENCY = item => {
    const p = pct(item.stock, item.minStock);
    if (p <= 40) return "critical";
    if (p <= 70) return "low";
    return "ok";
  };
  const URGENCY_CFG = {
    critical: { label:"Critical", bg:G.redLt,   color:G.red,   border:"#FCA5A5" },
    low:      { label:"Low stock", bg:G.amberLt, color:G.amber, border:"#FCD34D" },
    ok:       { label:"Adequate",  bg:G.tealLt,  color:G.teal,  border:"#6EE7B7" },
  };

  const filtered = INVENTORY.filter(item => {
    const u = URGENCY(item);
    const urgencyOk = filter==="All" || (filter==="Critical" && u==="critical") || (filter==="Low" && u==="low") || (filter==="OK" && u==="ok");
    const catOk = catFilter==="All" || item.category===catFilter;
    return urgencyOk && catOk;
  });

  const critical = INVENTORY.filter(i => URGENCY(i)==="critical").length;
  const low      = INVENTORY.filter(i => URGENCY(i)==="low").length;

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:600 }}>Inventory Alerts</h1>
          <p style={{ fontSize:13, color:G.gray4, marginTop:2 }}>Based on your sales velocity from Paytm</p>
        </div>
        <button style={{
          background:G.blue, color:"white", border:"none", borderRadius:8,
          padding:"8px 14px", fontSize:13, fontWeight:500,
        }}>📋 Reorder List</button>
      </div>

      {/* Alert summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Critical Stock",  value:critical, icon:"🚨", bg:G.redLt,   color:G.red,   desc:"Reorder today" },
          { label:"Low Stock",       value:low,       icon:"⚠️",  bg:G.amberLt, color:G.amber, desc:"Reorder this week" },
          { label:"Total SKUs",      value:INVENTORY.length, icon:"📦", bg:G.blueLt, color:G.blue, desc:"Tracked items" },
        ].map((s,i) => (
          <div key={i} className="hover-lift anim-up" style={{
            background:G.white, borderRadius:14, border:`1.5px solid ${s.bg}`,
            padding:"16px 18px", display:"flex", alignItems:"center", gap:14,
          }}>
            <div style={{
              width:44, height:44, borderRadius:12, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12.5, fontWeight:500, color:G.gray5 }}>{s.label}</div>
              <div style={{ fontSize:11, color:G.gray4 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom:16, padding:"14px 18px" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"center" }}>
          <div style={{ display:"flex", gap:6 }}>
            <span style={{ fontSize:11, color:G.gray4, alignSelf:"center", textTransform:"uppercase", letterSpacing:"0.5px", marginRight:4 }}>Status:</span>
            {["All","Critical","Low","OK"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:"5px 13px", borderRadius:99, fontSize:12, fontWeight:500,
                border:`1px solid ${filter===f ? G.blue : G.gray3}`,
                background: filter===f ? G.blue : G.white,
                color: filter===f ? "white" : G.gray5,
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span style={{ fontSize:11, color:G.gray4, alignSelf:"center", textTransform:"uppercase", letterSpacing:"0.5px", marginRight:4 }}>Category:</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding:"5px 13px", borderRadius:99, fontSize:12, fontWeight:500,
                border:`1px solid ${catFilter===c ? G.blue : G.gray3}`,
                background: catFilter===c ? G.blue : G.white,
                color: catFilter===c ? "white" : G.gray5,
              }}>{c}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Cards grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {filtered.map((item,i) => {
          const u = URGENCY(item);
          const cfg = URGENCY_CFG[u];
          const p = pct(item.stock, item.minStock);
          const barColor = u==="critical" ? G.red : u==="low" ? G.amber : G.teal;
          return (
            <div key={item.id} className="anim-up hover-lift" style={{
              background:G.white, borderRadius:14, padding:"16px 18px",
              border:`1.5px solid ${cfg.border}`,
              animationDelay:`${i*0.06}s`,
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{
                    width:38, height:38, borderRadius:10, background:cfg.bg,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                  }}>{CAT_ICONS[item.category]||"📦"}</div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600 }}>{item.name}</div>
                    <div style={{ fontSize:11.5, color:G.gray4 }}>{item.category}</div>
                  </div>
                </div>
                <Badge label={cfg.label} color={cfg.color} bg={cfg.bg}/>
              </div>

              {/* Stock bar */}
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                  <span style={{ color:G.gray4 }}>Stock level</span>
                  <span style={{ fontWeight:600, color:barColor }}>{item.stock} / {item.minStock} {item.unit}</span>
                </div>
                <div style={{ height:8, background:G.gray2, borderRadius:99, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", width:`${Math.min(p,100)}%`,
                    background:barColor, borderRadius:99,
                    transition:"width 0.6s ease",
                  }}/>
                </div>
              </div>

              {/* Meta */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[
                  { label:"Sold (7d)",    val:item.sold7d },
                  { label:"Restock in",  val:item.restockEst },
                  { label:"Velocity",    val:item.velocity,
                    badge:true, color:VELOCITY_COLOR[item.velocity], bg:VELOCITY_BG[item.velocity] },
                ].map((m,j) => (
                  <div key={j} style={{
                    background:G.gray1, borderRadius:8, padding:"8px 10px",
                  }}>
                    <div style={{ fontSize:10, color:G.gray4, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.3px" }}>{m.label}</div>
                    {m.badge
                      ? <Badge label={m.val} color={m.color} bg={m.bg}/>
                      : <div style={{ fontSize:13, fontWeight:600 }}>{m.val}</div>
                    }
                  </div>
                ))}
              </div>

              {u!=="ok" && (
                <button style={{
                  marginTop:12, width:"100%", background:u==="critical" ? G.red : G.amber,
                  color:"white", border:"none", borderRadius:8, padding:"8px 0",
                  fontSize:13, fontWeight:500,
                }}>
                  {u==="critical" ? "🚨 Reorder Now" : "⚠️ Schedule Reorder"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PAYTM TAG POPUP ───────────────────────────────────────────────────────────
const LABEL_CATS = [
  { key:"Groceries",     icon:"🛒", desc:"Rice, Atta, Dal…" },
  { key:"Beverages",     icon:"🥤", desc:"Tea, Juice, Water…" },
  { key:"Snacks",        icon:"🍿", desc:"Chips, Biscuits…" },
  { key:"Personal Care", icon:"🧴", desc:"Soap, Shampoo…" },
  { key:"Dairy",         icon:"🥛", desc:"Milk, Paneer…" },
  { key:"Others",        icon:"📦", desc:"Anything else" },
];
const TAG_STEPS = ["Category", "Items", "Done"];

const PaytmTagPopup = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [cat, setCat]   = useState("");
  const [items, setItems] = useState("");
  const [saved, setSaved] = useState(false);
  const AMOUNT = 420;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { onClose(); }, 1800);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(24,28,46,0.6)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:200, animation:"fadeIn 0.2s ease",
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="anim-up" style={{
        background:G.white, borderRadius:22, width:380, maxWidth:"94vw",
        overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.18)",
      }}>

        {/* Header */}
        <div style={{
          background:"linear-gradient(135deg, #00B9F2 0%, #0066FF 100%)",
          padding:"20px 22px 18px",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                background:"rgba(255,255,255,0.25)", borderRadius:10,
                width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
              }}>💳</div>
              <div>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10, letterSpacing:"0.5px", textTransform:"uppercase" }}>Paytm</div>
                <div style={{ color:"white", fontSize:13, fontWeight:600 }}>New payment received</div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background:"rgba(255,255,255,0.2)", border:"none", borderRadius:50,
              width:28, height:28, color:"white", fontSize:15, display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>✕</button>
          </div>

          {/* Amount */}
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11 }}>Amount received</div>
            <div style={{ color:"white", fontSize:28, fontWeight:700, fontFamily:"'Sora',sans-serif" }}>₹{AMOUNT}</div>
            <div style={{ display:"flex", gap:10, marginTop:6 }}>
              <Badge label="UPI" color="rgba(255,255,255,0.9)" bg="rgba(255,255,255,0.2)"/>
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:11, alignSelf:"center" }}>2:34 PM · Today</span>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ padding:"16px 22px 0", display:"flex", gap:6, alignItems:"center" }}>
          {TAG_STEPS.map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, flex: i<TAG_STEPS.length-1 ? 1 : 0 }}>
              <div style={{
                width:24, height:24, borderRadius:"50%", flexShrink:0,
                background: step>=i ? G.blue : G.gray2,
                color: step>=i ? "white" : G.gray4,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:600,
                transition:"all 0.3s",
              }}>{i<step ? "✓" : i+1}</div>
              <span style={{ fontSize:12, color: step===i ? G.text : G.gray4, fontWeight: step===i ? 500 : 400 }}>{s}</span>
              {i<TAG_STEPS.length-1 && <div style={{ flex:1, height:1, background:G.gray2, marginLeft:4 }}/>}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding:"16px 22px 22px" }}>
          {/* Step 0: Category */}
          {step===0 && (
            <div className="anim-in-r">
              <div style={{ fontSize:13.5, fontWeight:600, marginBottom:3 }}>What did you sell?</div>
              <div style={{ fontSize:12, color:G.gray4, marginBottom:14 }}>Select the category for this payment</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {LABEL_CATS.map(c => (
                  <div key={c.key} onClick={() => setCat(c.key)} style={{
                    border:`2px solid ${cat===c.key ? G.blue : G.gray2}`,
                    borderRadius:12, padding:"11px 12px", cursor:"pointer",
                    background: cat===c.key ? G.blueLt : G.white,
                    transition:"all 0.15s",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:20 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize:12.5, fontWeight:600, color: cat===c.key ? G.blue : G.text }}>{c.key}</div>
                      <div style={{ fontSize:10.5, color:G.gray4 }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button disabled={!cat} onClick={() => setStep(1)} style={{
                marginTop:14, width:"100%", background: cat ? G.blue : G.gray2,
                color: cat ? "white" : G.gray4, border:"none", borderRadius:10,
                padding:"11px 0", fontSize:14, fontWeight:600, transition:"all 0.2s",
              }}>Next →</button>
            </div>
          )}

          {/* Step 1: Items */}
          {step===1 && (
            <div className="anim-in-r">
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{
                  background:G.blueLt, borderRadius:10, width:36, height:36,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                }}>{LABEL_CATS.find(c=>c.key===cat)?.icon}</div>
                <div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>Items in {cat}</div>
                  <div style={{ fontSize:12, color:G.gray4 }}>What specific items were sold?</div>
                </div>
              </div>

              {/* Quick chips */}
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, color:G.gray4, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Quick add</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {({ Groceries:["Atta","Dal","Rice","Masala","Oil"], Beverages:["Pepsi","Tea","Water","Coffee"], Snacks:["Chips","Biscuits","Namkeen","Maggi"], "Personal Care":["Soap","Shampoo","Dettol","Paste"], Dairy:["Milk","Paneer","Curd","Butter"], Others:["Misc"] }[cat]||[]).map(q => (
                    <button key={q} onClick={() => setItems(p => p ? (p.includes(q) ? p : p+", "+q) : q)} style={{
                      padding:"4px 11px", borderRadius:99, fontSize:12, fontWeight:500,
                      border:`1px solid ${G.gray3}`, background:G.gray1, color:G.gray5,
                    }}>{q}</button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder={`e.g. Atta 5kg, Dal 1kg, Masala...`}
                value={items} onChange={e=>setItems(e.target.value)}
                style={{
                  width:"100%", border:`1px solid ${G.gray3}`, borderRadius:10,
                  padding:"10px 12px", fontSize:13, resize:"none", height:80,
                  outline:"none", color:G.text, fontFamily:"'DM Sans',sans-serif",
                }}
              />

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginTop:12 }}>
                <button onClick={() => setStep(0)} style={{
                  background:G.gray1, border:`1px solid ${G.gray3}`, borderRadius:10,
                  padding:"10px 0", fontSize:13.5, fontWeight:500, color:G.gray5,
                }}>← Back</button>
                <button disabled={!items.trim()} onClick={handleSave} style={{
                  background: items.trim() ? G.teal : G.gray2,
                  color: items.trim() ? "white" : G.gray4,
                  border:"none", borderRadius:10, padding:"10px 0",
                  fontSize:13.5, fontWeight:600, transition:"all 0.2s",
                }}>
                  {saved ? "✓ Saved!" : "Save Tag ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PREDICT PANEL ────────────────────────────────────────────────────────────
const PredictPanel = ({ onClose }) => (
  <div style={{
    position:"fixed", inset:0, background:"rgba(24,28,46,0.55)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:200, animation:"fadeIn 0.2s ease",
  }} onClick={e => e.target===e.currentTarget && onClose()}>
    <div className="anim-up" style={{
      background:G.white, borderRadius:20, width:380, maxWidth:"94vw",
      padding:28, boxShadow:"0 24px 80px rgba(0,0,0,0.18)",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:600 }}>⚡ Sales Prediction</div>
          <div style={{ fontSize:12, color:G.gray4, marginTop:2 }}>Today's forecast by time slot</div>
        </div>
        <button onClick={onClose} style={{
          background:G.gray1, border:"none", borderRadius:8,
          width:32, height:32, fontSize:16, color:G.gray5,
        }}>✕</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
        {PREDICT_DATA.map((p,i) => (
          <div key={i} style={{
            background:G.gray1, borderRadius:10, padding:"12px 14px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            borderLeft:`3px solid ${[G.blue,G.teal,G.purple,G.amber,G.orange][i]}`,
          }}>
            <div>
              <div style={{ fontSize:11.5, color:G.gray4, marginBottom:2 }}>{p.time}</div>
              <div style={{ fontSize:13, fontWeight:500 }}>{p.product}</div>
            </div>
            <div style={{
              background:G.blueLt, color:G.blueDk, fontSize:12, fontWeight:600,
              padding:"4px 10px", borderRadius:99,
            }}>{p.score}</div>
          </div>
        ))}
      </div>

      <button onClick={onClose} style={{
        width:"100%", background:G.gray2, border:"none", borderRadius:10,
        padding:"10px 0", fontSize:13.5, fontWeight:500, color:G.gray5,
      }}>Close</button>
    </div>
  </div>
);

// ─── INSIGHTS PAGE (placeholder) ──────────────────────────────────────────────
const Insights = () => (
  <div style={{ padding:24, display:"flex", alignItems:"center", justifyContent:"center", minHeight:500 }}>
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:60, marginBottom:16 }}>📈</div>
      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:600, marginBottom:8 }}>Insights coming soon</div>
      <div style={{ fontSize:13, color:G.gray4 }}>Advanced analytics powered by your Paytm data</div>
    </div>
  </div>
);

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [showPredict, setShowPredict] = useState(false);
  const [showTag, setShowTag]     = useState(false);

  // Simulate a Paytm notification after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowTag(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar page={page} setPage={setPage} onNotif={() => setShowTag(true)}/>
        <div style={{ flex:1, overflow:"auto" }}>
          {page==="dashboard"    && <Dashboard setShowPredict={setShowPredict}/>}
          {page==="transactions" && <Transactions/>}
          {page==="inventory"    && <Inventory/>}
          {page==="insights"     && <Insights/>}
        </div>
      </div>

      {showPredict && <PredictPanel onClose={() => setShowPredict(false)}/>}
      {showTag     && <PaytmTagPopup onClose={() => setShowTag(false)}/>}
    </>
  );
}
