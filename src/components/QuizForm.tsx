import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, HelpCircle, AlertTriangle, ArrowRight, CornerDownRight } from 'lucide-react';

interface QuizFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  recommendations: string[] | null;
  validationError: string | null;
}

const PRESETS = [
  {
    title: "Sistem Pencernaan Manusia (Biologi)",
    text: "Sistem pencernaan manusia terdiri dari organ mulut, kerongkongan, lambung, usus halus, usus besar, dan anus. Enzim seperti amilase, pepsin, dan lipase memainkan peran penting dalam memecah makromolekul nutrisi guna penyerapan seluler."
  },
  {
    title: "Krisis Moneter 1998 & Dampak Sosial (Sejarah)",
    text: "Dampak krisis moneter tahun 1997/1998 berakar pada melemahnya nilai tukar Rupiah terhadap Dolar AS, pembengkakan utang luar negeri swasta, inflasi tinggi di atas 70%, yang memicu demonstrasi mahasiswa, hilangnya stabilitas sosial-ekonomi nasional, serta kejatuhan rezim Orde Baru."
  },
  {
    title: "Teori Relativitas Khusus (Fisika)",
    text: "Teori Relativitas Khusus Albert Einstein didasarkan pada dua postulat: Hukum fisika adalah sama untuk semua pengamat dalam bingkai acuan inersia, dan kecepatan cahaya dalam ruang hampa adalah konstan (c) tidak bergantung pada gerak sumber atau pengamat."
  },
  {
    title: "Kalimat Efektif & Majas (Bahasa Indonesia)",
    text: "Kalimat efektif adalah kalimat yang disusun berdasarkan kaidah yang berlaku, seperti unsur-unsur penting (SPOK) dan kehematan penulisan kata. Majas atau gaya bahasa memperkaya nilai sastra, contohnya metafora, hiperbola, personifikasi, dan ironi."
  }
];

const LOADING_QUOTES = [
  "Menganalisis dan menyelaraskan dengan taksonomi Bloom...",
  "Merumuskan skenario studi kasus (Soal HOTS)...",
  "Memverifikasi kebenaran ilmiah kunci jawaban...",
  "Menyusun distraktor pilihan jawaban (opsi A, B, C, D) secara logis...",
  "Menyusun penjelasan pedagogis untuk setiap opsi jawaban..."
];

export default function QuizForm({ onSubmit, isLoading, recommendations, validationError }: QuizFormProps) {
  const [prompt, setPrompt] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const handleApplyPreset = (text: string) => {
    setPrompt(text);
  };

  const handleApplyRecommendation = (topic: string) => {
    const fullPrompt = `${topic}`;
    setPrompt(fullPrompt);
    onSubmit(fullPrompt);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-display font-bold text-slate-800">
          Source Topic / Material
        </h2>
      </div>

      {/* Preset Buttons */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Pilih Cepat Presets Materi (Standar HOTS)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset(p.text)}
              className="text-left text-xs bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 hover:text-slate-950 p-3 rounded-xl border border-slate-200/60 transition-all flex items-start gap-2 hover:shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="materi" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Materi Pengujian, Bab, atau Topik Bahasan
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {prompt.length} karakter
            </span>
          </div>
          
          <textarea
            id="materi"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan topik kuis (misal: 'Proses Fotosintesis Kloroplas') atau salin teks cuplikan rangkuman materi pelajaran Anda di sini..."
            className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 bg-slate-50/50 font-sans outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-inner resize-none"
          />
        </div>

        {/* Dynamic AGENTIC Validation Recommendations */}
        {validationError && recommendations && recommendations.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-sm animate-fadeIn">
            <div className="flex gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-amber-900 font-medium leading-relaxed">
                  {validationError}
                </p>
                <div className="bg-white/80 border border-amber-100 rounded-lg p-3 space-y-2">
                  <span className="block text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    Klik Rekomendasi Pintar di Bawah Ini:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recommendations.map((rec, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyRecommendation(rec)}
                        className="flex items-center gap-2 text-left text-xs text-slate-700 hover:text-indigo-900 hover:bg-indigo-50 bg-amber-50/50 border border-amber-200/50 p-2.5 rounded-lg font-medium transition-all group"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                        <span>Kuis tentang <strong>{rec}</strong></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-100 hover:shadow-lg focus:ring-2 focus:ring-indigo-500/35 outline-none font-display"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-semibold text-white text-xs">Memformulasikan Soal Kuis...</span>
              </div>
              <span className="text-[10px] text-indigo-200 font-mono italic max-w-xs text-center animate-pulse">
                "{LOADING_QUOTES[quoteIndex]}"
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4.5 h-4.5 text-amber-200 group-hover:scale-110 transition-transform animate-pulse" />
              <span>Hasilkan Kuis Standar HOTS</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex gap-2 items-center text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
        <p>
          Asesmen otomatis mengutamakan taksonomi pemikiran kritis tingkat tinggi. Menghasilkan 5 kuis komparatif & analitis lengkap dengan pembahasan.
        </p>
      </div>
    </div>
  );
}
