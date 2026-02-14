import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBus, FaTaxi, FaCar, FaBicycle, FaCity, 
  FaLandmark, FaBars, FaTimes, FaMapMarkerAlt, FaSearch, FaCheckCircle
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

const TRAVEL_DATA = [
  {
    name: "Karnataka",
    cities: [
      { name: "Bangalore", places: ["Lalbagh Botanical Garden", "Bangalore Palace", "Vidhana Soudha"] },
      { name: "Mysore", places: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"] },
    ],
  },
  { name: "Gujarat", cities: [{ name: "Ahmedabad", places: ["Sabarmati Ashram", "Adalaj Stepwell"] }] },
  { name: "Rajasthan", cities: [{ name: "Jaipur", places: ["Hawa Mahal", "Amer Fort", "City Palace"] }] },
];

const TRANSPORT = [
  { name: "Car", icon: <FaCar />, desc: "Private & Fast" },
  { name: "Bus", icon: <FaBus />, desc: "Eco-friendly" },
  { name: "Auto", icon: <FaTaxi />, desc: "Local Vibes" },
  { name: "Bicycle", icon: <FaBicycle />, desc: "Fitness First" },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [status, setStatus] = useState({ loading: false, result: null, error: null });

  // Progress calculation for top bar
  const steps = [selectedState, selectedCity, selectedPlaces.length > 0, selectedTransport];
  const progress = (steps.filter(Boolean).length / steps.length) * 100;

  const handleSubmit = async () => {
    if (!selectedTransport || selectedPlaces.length === 0) return;
    setStatus({ loading: true, result: null, error: null });

    try {
      const response = await fetch("https://travelacrosscity-backend.onrender.com/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedState, selectedCity, selectedPlaces, selectedTransport }),
      });
      const data = await response.json();
      setStatus({ loading: false, result: data, error: null });
    } catch (err) {
      setStatus({ loading: false, result: null, error: "Server connection failed. Is the backend running?" });
    }
  };

  return (
    
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Dynamic Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1.5 bg-indigo-600 z-[60]" 
        animate={{ width: `${progress}%` }}
      />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 p-8">
              <div className="flex justify-between items-center mb-10">
                <div className="font-black text-indigo-600 text-xl tracking-tighter italic">PMJ.</div>
                <FaTimes className="cursor-pointer text-slate-400" onClick={() => setSidebarOpen(false)} />
              </div>
              <div className="space-y-6 font-semibold text-slate-600">
                {['Exploration', 'Saved Journeys', 'Travel AI', 'Account'].map(item => (
                  <div key={item} className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" /> {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
            <FaBars className="text-slate-600" />
          </button>
          <div className="text-2xl font-black tracking-tighter text-slate-900">
            PLAN<span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">MY</span>JOURNEY
          </div>
          <div className="hidden sm:block text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
            Beta 2.0
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Header */}
        <section className="text-center mb-20">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Explore the <span className="text-indigo-600 italic">Extraordinary</span>.
          </motion.h2>
          <div className="relative max-w-xl mx-auto group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search your next destination..."
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <div className="grid gap-20">
          {/* Section 1: States */}
          <StepSection number="01" title="Destination State">
            {TRAVEL_DATA.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((state) => (
              <GlassCard 
                key={state.name}
                active={selectedState === state.name}
                onClick={() => { setSelectedState(state.name); setSelectedCity(null); setSelectedPlaces([]); }}
                icon={<FaCity />}
                label={state.name}
              />
            ))}
          </StepSection>

          {/* Section 2: Cities */}
          <AnimatePresence>
            {selectedState && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <StepSection number="02" title={`Discover ${selectedState}`}>
                  {TRAVEL_DATA.find(s => s.name === selectedState)?.cities.map((city) => (
                    <GlassCard 
                      key={city.name}
                      active={selectedCity === city.name}
                      onClick={() => { setSelectedCity(city.name); setSelectedPlaces([]); }}
                      icon={<FaMapMarkerAlt />}
                      label={city.name}
                    />
                  ))}
                </StepSection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 3: Places */}
          <AnimatePresence>
            {selectedCity && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StepSection number="03" title="Curate Your Landmarks">
                  {TRAVEL_DATA.find(s => s.name === selectedState)?.cities.find(c => c.name === selectedCity)?.places.map((place) => (
                    <GlassCard 
                      key={place}
                      active={selectedPlaces.includes(place)}
                      onClick={() => setSelectedPlaces(prev => prev.includes(place) ? prev.filter(p => p !== place) : [...prev, place])}
                      icon={<FaLandmark />}
                      label={place}
                      multi
                    />
                  ))}
                </StepSection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 4: Transport */}
          <StepSection number="04" title="Transit Preference">
            {TRANSPORT.map((mode) => (
              <GlassCard 
                key={mode.name}
                active={selectedTransport === mode.name}
                onClick={() => setSelectedTransport(mode.name)}
                icon={mode.icon}
                label={mode.name}
                sublabel={mode.desc}
              />
            ))}
          </StepSection>

          {/* Submit Action */}
          <div className="flex flex-col items-center py-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={status.loading || !selectedTransport}
              className="relative overflow-hidden px-14 py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg shadow-2xl disabled:bg-slate-300 flex items-center gap-4 group transition-all"
            >
              {status.loading && <ImSpinner2 className="animate-spin" />}
              {status.loading ? "Building Your Trip..." : "Confirm Itinerary"}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.button>

            {/* API Result Feedback */}
            <AnimatePresence>
              {(status.result || status.error) && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-12 w-full max-w-2xl">
                  <div className={`p-1 bg-gradient-to-br ${status.error ? 'from-red-400 to-orange-400' : 'from-indigo-500 to-blue-500'} rounded-[2.5rem] shadow-2xl shadow-indigo-200`}>
                    <div className="bg-white rounded-[2.4rem] p-10">
                      <div className="flex items-center gap-4 mb-6">
                        {status.error ? <FaTimes className="text-red-500 text-2xl" /> : <FaCheckCircle className="text-indigo-600 text-2xl" />}
                        <h4 className="text-2xl font-black">{status.error ? "System Error" : "Journey Details"}</h4>
                      </div>
                      <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                        {status.error ? status.error : (
                          <>
                            <p className="font-bold text-slate-900 text-3xl mb-4">{status.result.journeyCost}</p>
                            <p>{status.result.message}</p>
                            <p className="text-sm italic">{status.result.thankYouMessage}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- High Quality UI Components ---

const StepSection = ({ number, title, children }) => (
  <section>
    <div className="flex items-center gap-4 mb-10">
      <span className="text-4xl font-black text-slate-200">{number}</span>
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
    <div className="flex flex-wrap gap-6">{children}</div>
  </section>
);

const GlassCard = ({ active, onClick, icon, label, sublabel, multi }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={onClick}
    className={`
      relative min-w-[180px] flex-1 basis-[200px] p-8 rounded-[2.5rem] cursor-pointer transition-all border-2
      ${active 
        ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-300" 
        : "bg-white border-transparent text-slate-600 shadow-xl shadow-slate-200/50 hover:shadow-indigo-100"
      }
    `}
  >
    <div className={`text-3xl mb-4 ${active ? 'text-white' : 'text-indigo-500'}`}>{icon}</div>
    <div className="font-bold text-lg mb-1">{label}</div>
    {sublabel && <div className={`text-xs ${active ? 'text-indigo-100' : 'text-slate-400'}`}>{sublabel}</div>}
    
    {active && (
      <motion.div layoutId="check" className="absolute top-6 right-6 text-white text-xl">
        <FaCheckCircle />
      </motion.div>
    )}
    {multi && active && <div className="mt-3 text-[10px] font-black uppercase tracking-widest bg-white/20 w-fit px-2 py-1 rounded-md">Added</div>}
  </motion.div>
  
);
