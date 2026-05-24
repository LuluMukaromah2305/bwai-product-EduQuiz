import React, { useState } from 'react';
import Header from './components/Header';
import QuizForm from './components/QuizForm';
import QuizRenderer from './components/QuizRenderer';
import { QuizData } from './types';
import { 
  Sparkles, CheckCircle, BookOpen, AlertCircle, Info, ChevronRight, 
  HelpCircle, Lightbulb, FileSpreadsheet, Compass 
} from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGenerateQuiz = async (promptText: string) => {
    setIsLoading(true);
    setValidationError(null);
    setRecommendations(null);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const quizData: QuizData = result.data;
        if (quizData.isValid) {
          setQuiz(quizData);
        } else {
          // Input was flagged as too short or confusing
          setValidationError(quizData.validationErrorMessage || "Input terlalu singkat atau tidak valid.");
          setRecommendations(quizData.recommendations || []);
        }
      } else {
        throw new Error(result.error || "Terjadi kegagalan memuat data kuis.");
      }

    } catch (err: any) {
      console.error("Error generating quiz:", err);
      setApiError(err.message || "Gagal menghubungi mesin kecerdasan EduQuiz Pro. Silakan periksa kembali konfigurasi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setValidationError(null);
    setRecommendations(null);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Decorative colored glow in background to set professional distinct tone */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column - Core interactive application */}
        <div className="lg:col-span-8 space-y-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm animate-fadeIn">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-red-800">Terjadi Kesalahan Server</h4>
                  <p className="text-red-700 leading-relaxed">
                    {apiError}
                  </p>
                  <p className="text-xs text-red-500 font-medium">
                    Silakan segarkan halaman atau pilih salah satu preset materi di bawah untuk memproses instan.
                  </p>
                  <button 
                    onClick={() => setApiError(null)}
                    className="mt-2 text-xs text-red-800 bg-red-100 hover:bg-red-200/80 px-3 py-1.5 rounded-lg font-semibold transition"
                  >
                    Tutup Pesan
                  </button>
                </div>
              </div>
            </div>
          )}

          {!quiz ? (
            <QuizForm 
              onSubmit={handleGenerateQuiz} 
              isLoading={isLoading} 
              recommendations={recommendations}
              validationError={validationError}
            />
          ) : (
            <QuizRenderer quiz={quiz} onReset={handleReset} />
          )}
        </div>

        {/* Right Column - Informative pedagogy block detailing HOTS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-indigo-600" />
              <span>Pedoman HOTS EduQuiz Pro</span>
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-display font-bold text-xs">
                  C4
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Analisis Mendalam (Analyzing)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Menguji kemampuan memecahkan masalah menjadi bagian detail, mendeteksi hubungan antar variabel sains/sosial secara logis.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-display font-bold text-xs">
                  C5
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Evaluasi Kritis (Evaluating)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mengukur tingkat pemikiran kritis dalam menilai kebenaran metode, argumen sastra/sejarah, serta efektivitas keputusan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-display font-bold text-xs">
                  C6
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Kreasi Solusi (Creating)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Memandu perumusan hipotesis alternatif atau mensintesis materi acak menjadi kesimpulan yang faktual dan aplikatif.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                <Info className="w-3.5 h-3.5 text-indigo-500" />
                <span>Karakteristik Distraktor Pilihan</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                “Setiap distractor (pilihan jawaban salah) didesain homogen dan representatif, memaksa peserta didik menganalisis dan menghindari sekadar menebak pola.”
              </p>
            </div>
          </div>

          {/* Educational quotes or guidelines to provide high-end decoration */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5">
              <Sparkles className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="p-2 bg-white/10 rounded-lg w-fit text-indigo-300">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-display font-bold">Standardisasi Kurikulum</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Asesmen terstruktur mendukung Guru, Dosen, & Siswa Mandiri dalam memvalidasi tingkat literasi & numerasi sesuai dengan instrumen Asesmen Nasional.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-300 font-mono border-t border-white/10">
                <span>Versi Engine</span>
                <span>Pro v2.5f (ID)</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 EduQuiz Pro • Dikembangkan oleh Ahli Kurikulum AI. Seluruh konten hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 transition">Panduan Guru</a>
            <a href="#" className="hover:text-slate-600 transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-600 transition">Syarat Penggunaan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
