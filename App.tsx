
import React, { useState } from 'react';
import { CATIONS, SOLUBILITY_TABLE, METAL_ACTIVITY } from './constants';
import { LEGEND_DATA, SALT_DETAILS_DB, SaltDetail } from './database';
import { SolubilityStatus } from './types';

const IonLabel: React.FC<{ label: string; isLarge?: boolean }> = ({ label, isLarge }) => {
  // Исправленная логика: ищем заряды (число+плюс/минус или просто плюс/минус) в конце или индексы (просто числа) внутри
  // Разбиваем по частям: (заряды) или (числа-индексы)
  const parts = label.split(/(\d+[+-]|[+-]$)|(\d+)/g).filter(Boolean);
  
  return (
    <span className={`font-bold text-slate-700 whitespace-nowrap tracking-tight ${isLarge ? 'text-xl' : 'text-[12px]'}`}>
      {parts.map((p, i) => {
        // Если это заряд (содержит + или -)
        if (p.includes('+') || p.includes('-')) {
          return <sup key={i} className="text-[0.7em] leading-none font-black align-top ml-0.5 text-blue-600">{p}</sup>;
        }
        // Если это число-индекс (не является зарядом)
        if (p.match(/^\d+$/)) {
          return <sub key={i} className="text-[0.7em] leading-none align-baseline text-slate-500">{p}</sub>;
        }
        // Обычный текст (символ элемента)
        return p;
      })}
    </span>
  );
};

const ReactionBlock: React.FC<{ formula: string }> = ({ formula }) => {
  const parts = formula.split(/(\d+)/g);
  return (
    <div className="my-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center overflow-x-auto shadow-sm">
      <code className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
        {parts.map((part, i) => 
          part.match(/^\d+$/) ? <sub key={i} className="text-[0.65em] bottom-[-0.1em]">{part}</sub> : part
        )}
      </code>
    </div>
  );
};

const StatusBadge: React.FC<{ 
  status: SolubilityStatus; 
  isIntersection?: boolean;
  onClick?: () => void;
  hasDetails?: boolean;
}> = ({ status, isIntersection, onClick, hasDetails }) => {
  const config = {
    'Р': 'bg-green-100 text-green-800 border-green-200',
    'М': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Н': 'bg-red-100 text-red-800 border-red-200',
    '–': 'bg-gray-100 text-gray-400 border-gray-200',
    '?': 'bg-blue-50 text-blue-400 border-blue-100',
    '': 'bg-transparent text-transparent'
  };

  if (!status) return <div className="h-7 w-7"></div>;

  return (
    <div 
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded border text-[11px] font-black shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:ring-2 hover:ring-red-500/30 active:scale-90' : 'cursor-default'
      } ${
        isIntersection ? 'ring-2 ring-blue-500 z-10 bg-white' : ''
      } ${hasDetails ? 'border-red-500 border-2 scale-110 shadow-red-100 shadow-md' : ''} ${config[status]}`}
    >
      {status}
    </div>
  );
};

const App: React.FC = () => {
  const [selectedCation, setSelectedCation] = useState<string | null>(null);
  const [selectedAnion, setSelectedAnion] = useState<string | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [activeSalt, setActiveSalt] = useState<SaltDetail | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleStatusClick = (cation: string, anion: string) => {
    const saltKey = `${cation}${anion}`;
    const details = SALT_DETAILS_DB[saltKey];
    if (details) {
      setActiveSalt(details);
      setIsInfoOpen(false);
    }
  };

  return (
    <div className="min-h-screen pb-6 flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Solubility Table in Qazaq (STQ)</h1>
            <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-wider">
              ҚЫШҚЫЛДАРДЫҢ, ТҰЗДАРДЫҢ ЖӘНЕ НЕГІЗДЕРДІҢ СУДАҒЫ ЕРІГІШТІК КЕСТЕСІ
            </p>
          </div>
          <button 
            onClick={() => setIsLegendOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-lg active:scale-95"
          >
            Шартты белгілер
          </button>
        </div>
      </header>

      {/* Legend Modal */}
      {isLegendOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsLegendOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 border-b pb-2 text-slate-900">Шартты белгілердің мағынасы</h2>
            <div className="space-y-4">
              {LEGEND_DATA.map(item => (
                <div key={item.status} className="flex items-center gap-4">
                  <StatusBadge status={item.status} />
                  <div className="flex flex-col">
                    <span className="text-slate-900 text-[13px] font-bold">{item.label}</span>
                    <span className="text-slate-500 text-[10px]">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Salt Card Modal */}
      {activeSalt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => { setActiveSalt(null); setIsInfoOpen(false); }}>
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-[320px] w-full shadow-2xl flex flex-col transform transition-all animate-in zoom-in-95 duration-300 relative" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 flex gap-2 z-30">
              <button 
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className={`p-2 rounded-full shadow-md transition-all border ${isInfoOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/95 text-blue-600 border-blue-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <button onClick={() => { setActiveSalt(null); setIsInfoOpen(false); }} className="p-2 bg-white/95 text-red-500 rounded-full shadow-md border border-red-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative aspect-[4/5] bg-white flex flex-col">
              <div className="flex-grow relative overflow-hidden bg-slate-50">
                {!isInfoOpen ? (
                  <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
                    <img src={activeSalt.image} className="flex-grow object-cover" alt={activeSalt.name} />
                    <div className="p-5 bg-white text-center border-t border-slate-50 shrink-0">
                      <div className="mb-0.5"><IonLabel label={activeSalt.formula} isLarge={true} /></div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">{activeSalt.name}</h2>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-white p-6 overflow-y-auto custom-scrollbar animate-in slide-in-bottom duration-300 z-10 flex flex-col">
                    <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>Анықтама
                    </h3>
                    <div className="space-y-6 flex-grow">
                      <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Алыну тәсілі</h4>
                        <p className="text-[12px] text-slate-700 leading-relaxed font-bold italic">{activeSalt.method}</p>
                        <ReactionBlock formula={activeSalt.reaction} />
                      </section>
                      <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Сипаттамасы</h4>
                        <p className="text-[12px] text-slate-700 leading-relaxed font-medium">{activeSalt.description}</p>
                      </section>
                    </div>
                    <button onClick={() => setIsInfoOpen(false)} className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Кері қайту</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Content */}
      <main className="max-w-[1600px] mx-auto px-4 mt-4 flex-grow space-y-4 w-full">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="sticky left-0 bg-slate-200 z-30 px-2 py-2.5 border-r-2 border-slate-300 min-w-[70px]"></th>
                  {CATIONS.map(cation => (
                    <th 
                      key={cation} 
                      className={`px-1 py-2 border-r border-slate-200 text-center min-w-[50px] cursor-pointer transition-all ${selectedCation === cation ? 'bg-blue-600 text-white scale-105 z-10 shadow-lg' : 'hover:bg-blue-50'}`}
                      onClick={() => setSelectedCation(selectedCation === cation ? null : cation)}
                    >
                      <IonLabel label={cation} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOLUBILITY_TABLE.map((row) => (
                  <tr key={row.anion} className="border-b border-slate-100">
                    <td 
                      className={`sticky left-0 z-30 px-2 py-1.5 border-r-2 border-slate-300 font-bold cursor-pointer text-center transition-all ${selectedAnion === row.anion ? 'bg-blue-600 text-white z-40' : 'bg-slate-50 hover:bg-blue-50'}`}
                      onClick={() => setSelectedAnion(selectedAnion === row.anion ? null : row.anion)}
                    >
                      <IonLabel label={row.anion} />
                    </td>
                    {CATIONS.map(cation => {
                      const status = row.results[cation];
                      const isColSelected = selectedCation === cation;
                      const isRowSelected = selectedAnion === row.anion;
                      const saltKey = `${cation}${row.anion}`;
                      const hasDetails = !!SALT_DETAILS_DB[saltKey];
                      
                      return (
                        <td key={cation} className={`px-0 py-0.5 border-r border-slate-100 text-center ${isColSelected || isRowSelected ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex justify-center items-center h-8">
                            <StatusBadge 
                              status={status || ''} 
                              isIntersection={isColSelected && isRowSelected}
                              hasDetails={hasDetails}
                              onClick={hasDetails ? () => handleStatusClick(cation, row.anion) : undefined}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Metal Activity Series */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <h2 className="text-[12px] font-black mb-4 text-slate-800 uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-4 bg-blue-600 rounded-full shadow-blue-100 shadow-lg"></span>
            МЕТАЛДАРДЫҢ ЭЛЕКТРОХИМИЯЛЫҚ БЕЛСЕНДІЛІК ҚАТАРЫ
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {METAL_ACTIVITY.map((metal) => (
              <div 
                key={metal} 
                className={`px-2 py-1.5 rounded-lg border-2 font-black text-[11px] min-w-[34px] text-center shadow-sm transition-transform hover:scale-105 ${
                  metal === '(H2)' ? 'bg-blue-600 border-blue-400 text-white shadow-blue-100' : 'bg-white border-slate-100 text-slate-700'
                }`}
              >
                {metal}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
        ХИМИЯ БАЗАСЫ &copy; 2026
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes zoom-in-95 { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation-fill-mode: forwards; }
        .zoom-in-95 { animation-name: zoom-in-95; }
        .fade-in { animation-name: fade-in; }
        .slide-in-bottom { animation-name: slide-in-bottom; }
      `}</style>
    </div>
  );
};

export default App;
