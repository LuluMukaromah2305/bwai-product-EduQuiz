import React, { useState } from 'react';
import { 
  Award, Copy, Check, CheckCircle2, XCircle, AlertCircle, 
  HelpCircle, Sparkles, BookOpen, ThumbsUp, RefreshCw, FileText
} from 'lucide-react';
import { QuizData, UserAnswer } from '../types';

interface QuizRendererProps {
  quiz: QuizData;
  onReset: () => void;
}

export default function QuizRenderer({ quiz, onReset }: QuizRendererProps) {
  const [activeTab, setActiveTab] = useState<'interactive' | 'markdown'>('interactive');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectOption = (questionIndex: number, option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return; // Prevent change after submit
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionIndex !== questionIndex);
      return [...filtered, { questionIndex, selectedOption: option }].sort((a, b) => a.questionIndex - b.questionIndex);
    });
  };

  const handleSubmitQuiz = () => {
    if (answers.length < quiz.questions.length) {
      alert("Harap jawab semua soal sebelum menekan tombol Submit!");
      return;
    }
    setIsSubmitted(true);
  };

  const getScore = () => {
    let score = 0;
    answers.forEach(ans => {
      if (quiz.questions[ans.questionIndex].correctOption === ans.selectedOption) {
        score++;
      }
    });
    return Math.round((score / quiz.questions.length) * 100);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(quiz.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreValue = getScore();
  const allAnswered = answers.length === quiz.questions.length;

  return (
    <div className="space-y-6">
      {/* Sleek Tab Navigation Header */}
      <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-300/40">
        <button
          onClick={() => setActiveTab('interactive')}
          className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'interactive'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kuis Interaktif</span>
        </button>
        <button
          onClick={() => setActiveTab('markdown')}
          className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'markdown'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Format Cetak (Markdown)</span>
        </button>
      </div>

      {activeTab === 'interactive' ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Welcome and Quiz Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <header className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-800 tracking-tight text-sm uppercase">
                  QUIZ PREVIEW: {quiz.quizTitle || "KRISIS IKLIM & EKOSISTEM"}
                </h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0">
                  Validated
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onReset}
                  className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button 
                  onClick={handleCopyMarkdown}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Disalin' : 'Copy Markdown'}</span>
                </button>
              </div>
            </header>
            
            <div className="p-6 bg-slate-50/50 border-b border-slate-150">
              <p className="text-xs md:text-[13px] text-slate-500 leading-relaxed">
                Kuis buatan otomatis ini menguji pemahaman konsep tingkat tinggi (HOTS). Kerjakan keseluruhan soal analisis terstruktur di bawah dengan teliti, lalu kirim nilai Anda.
              </p>
            </div>
          </div>

          {/* Core Score Visualizer after Submit */}
          {isSubmitted && (
            <div className="bg-white border-2 border-indigo-600/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-scaleIn">
              <div className="space-y-2.5 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold border border-indigo-100">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Kalkulasi Skor Selesai</span>
                </div>
                
                <h4 className="text-xl md:text-2xl font-display font-bold text-slate-800 tracking-tight">
                  {scoreValue >= 80 ? "Luar Biasa! Pemahaman Sangat Baik 🔥" : scoreValue >= 60 ? "Kerja Bagus! Cukup Kompeten 👍" : "Perlu Belajar Lebih Mendalam 🚀"}
                </h4>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  Semua soal analitis telah dievaluasi secara cerdas menggunakan parameter taksonomi Bloom. Silakan periksa kunci jawaban ilmiah di bawah ini.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-slate-50/80 border border-slate-200 p-4 rounded-xl">
                <div 
                  className="w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center bg-white shrink-0" 
                  style={{ borderColor: scoreValue >= 80 ? '#10b981' : scoreValue >= 60 ? '#6366f1' : '#f59e0b' }}
                >
                  <span className="text-xl font-display font-black text-slate-800 leading-none">
                    {scoreValue}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">Skor</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-500 block uppercase tracking-wider">Hasil Ujian</span>
                  <div className="text-xs text-slate-650">
                    <p>Total Soal: <strong className="text-slate-800">5</strong></p>
                    <p>Benar: <strong className="text-emerald-600 font-semibold">{answers.filter(a => quiz.questions[a.questionIndex].correctOption === a.selectedOption).length}</strong> / 5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section of Individual Quiz items */}
          <div className="grid grid-cols-1 gap-6">
            {quiz.questions.map((q, qIdx) => {
              const selectedChoice = answers.find(a => a.questionIndex === qIdx)?.selectedOption;
              const isCorrect = selectedChoice === q.correctOption;

              return (
                <div 
                  key={qIdx} 
                  className={`bg-white border rounded-2xl shadow-xs transition-all relative overflow-hidden ${
                    isSubmitted 
                      ? isCorrect 
                        ? 'border-emerald-200' 
                        : 'border-red-100' 
                      : 'border-slate-200/80'
                  }`}
                >
                  {/* Soal Meta Header */}
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-700 font-display">
                      Soal {qIdx + 1}: Analisis HOTS
                    </p>
                    
                    {isSubmitted && (
                      <div className="text-xs font-semibold">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                            <XCircle className="w-3.5 h-3.5" /> Salah
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    {/* Stem of the question */}
                    <p className="text-[13px] md:text-sm text-slate-700 leading-relaxed mb-4 font-medium">
                      {q.questionText}
                    </p>

                    {/* Choices options (Sleek Theme pattern) */}
                    <div className="grid gap-2 text-xs md:text-[13px]">
                      {(Object.keys(q.options) as ('A' | 'B' | 'C' | 'D')[]).map((opt) => {
                        const isOptionSelected = selectedChoice === opt;
                        const isCorrectOpt = q.correctOption === opt;
                        
                        let choiceClass = 'p-3 text-left bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium cursor-pointer w-full flex items-start gap-2.5';
                        
                        if (isOptionSelected) {
                          choiceClass = 'p-3 text-left bg-indigo-50 border-indigo-300 rounded-xl ring-1 ring-indigo-500/30 font-medium w-full flex items-start gap-2.5';
                        }

                        if (isSubmitted) {
                          if (isCorrectOpt) {
                            // Highlighting correct choice
                            choiceClass = 'p-3 text-left bg-emerald-50 border-emerald-400 text-emerald-950 rounded-xl font-medium w-full flex items-start gap-2.5';
                          } else if (isOptionSelected && !isCorrect) {
                            // Highlighting incorrect submitted choice
                            choiceClass = 'p-3 text-left bg-red-50 border-red-350 text-red-950 rounded-xl font-medium w-full flex items-start gap-2.5';
                          } else {
                            choiceClass = 'p-3 text-left bg-slate-50 border-slate-200 text-slate-400 rounded-xl font-medium opacity-60 w-full flex items-start gap-2.5';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(qIdx, opt)}
                            className={choiceClass}
                          >
                            <span className={`w-5.5 h-5.5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                              isSubmitted
                                ? isCorrectOpt
                                  ? 'bg-emerald-600 text-white'
                                  : isOptionSelected
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                : isOptionSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {opt}
                            </span>
                            <span className="leading-normal mt-0.5">{q.options[opt]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Scientific/Factual Explanation Section - Seamless deep Indigo styling */}
                    {isSubmitted && (
                      <div className="mt-5 p-4 rounded-xl border border-indigo-200/50 bg-indigo-950 text-white animate-fadeIn">
                        <div className="flex items-center gap-2 mb-2 border-b border-indigo-805 pb-2">
                          <span className="text-sm">🔑</span>
                          <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                            JAWABAN SOAL {qIdx + 1}: {q.correctOption}
                          </h3>
                        </div>
                        <p className="text-[12px] text-indigo-150 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission and Reset actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-xs px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Buat Baru (Reset Form)</span>
            </button>
            
            {!isSubmitted && (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="w-full sm:w-auto bg-indigo-6050 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 px-8 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-100 hover:shadow-lg"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Submit Jawaban Kuis</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Markdown / Export View */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-fadeIn">
          <header className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Salinan Markdown Ujian</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Gunakan salinan ini untuk mengimpor kuis langsung ke Google Dokumen, LMS Sekolah, atau format cetak mandiri.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className={`py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Markdown</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onReset}
                className="text-xs bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg font-semibold text-slate-600 transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Mulai Baru</span>
              </button>
            </div>
          </header>

          <div className="p-6">
            {/* Display box adhering to tidy Indonesian typography */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl font-sans text-xs md:text-sm text-slate-700 overflow-auto max-h-[550px] leading-relaxed whitespace-pre-wrap select-all selection:bg-indigo-100">
              {quiz.markdownContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
