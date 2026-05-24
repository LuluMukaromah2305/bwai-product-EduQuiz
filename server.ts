import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function generateQuizMarkdown(title: string, questions: any[]): string {
  let md = `### ${title}\n---\n`;
  questions.forEach((q, idx) => {
    md += `**Soal ${idx + 1}:** ${q.questionText}\n`;
    md += `A. ${q.options.A}\n`;
    md += `B. ${q.options.B}\n`;
    md += `C. ${q.options.C}\n`;
    md += `D. ${q.options.D}\n\n`;
  });
  
  md += `---\n### 🔑 Kunci Jawaban & Penjelasan\n`;
  questions.forEach((q, idx) => {
    md += `${idx + 1}. **Jawaban: ${q.correctOption}**\n`;
    md += `- ${q.explanation}\n\n`;
  });
  return md;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API endpoint to generate quiz
  app.post("/api/generate-quiz", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Materi atau topik tidak boleh kosong."
      });
    }

    try {
      const ai = getAiClient();
      
      const systemInstruction = `Anda adalah "EduQuiz Pro", seorang desainer kurikulum pendidikan dan ahli instructional design berpengalaman dalam membuat asesmen adaptif berstandar internasional.
Tugas Anda adalah menganalisis materi atau topik yang diberikan oleh pengguna, kemudian menghasilkan kuis berkualitas tinggi atau mendeteksi jika materi terlalu singkat/tidak valid.

1. ANALISIS VALIDITAS INPUT:
- Evaluasi materi/topik dari pengguna. Jika terlalu pendek (misalnya hanya satu atau dua kata yang kurang bermakna seperti "a", "abc", "kuis", "tes", "halo"), tidak valid, atau sangat membingungkan, Anda harus menyetel "isValid" ke false.
- Jika "isValid" adalah false:
  - Berikan 2 rekomendasi sub-topik spesifik dan menarik yang relevan dalam bahasa Indonesia. Misalnya jika input adalah "bio", rekomendasikan "Fotosintesis pada Tumbuhan" dan "Sistem Peredaran Darah Manusia".
  - Tulis "validationErrorMessage" dengan kalimat ramah bahasa Indonesia. Contoh: "Maaf, materi yang Anda masukkan terlalu singkat atau kurang spesifik. Apakah Anda ingin membuat kuis tentang Fotosintesis pada Tumbuhan atau Sistem Peredaran Darah Manusia?"
  - Kosongkan array "questions" atau isi dengan array kosong. Set "quizTitle" ke "".
- Jika input valid (berupa topik spesifik yang cukup, teori, bab buku, atau cuplikan materi pelajaran):
  - Setel "isValid" ke true.
  - Hasilkan kuis bertipe Campuran (Mudah, Sedang, Sulit) yang terdiri dari tepat 5 soal kuis HOTS (Higher Order Thinking Skills).

2. KETENTUAN SOAL KUIS (HOTS):
- Jumlah soal: Tepat 5 soal kuis.
- Tipe soal: Pilihan Ganda (Multiple Choice) dengan 4 opsi (A, B, C, D).
- Soal HARUS menguji pemahaman konsep mendalam (HOTS - Higher Order Thinking Skills), bukan sekadar mengingat istilah/hafalan. Gunakan studi kasus kehidupan nyata atau penyelesaian masalah (problem solving).
- "quizTitle" harus representatif diisi dengan judul kuis yang menarik (misalnya "Asesmen HOTS: Ekosistem Laut & Rantai Makanan").
- Setiap soal harus menyertakan:
  - "questionText": Teks pertanyaan yang jelas dalam bahasa Indonesia.
  - "options": Objek dengan key "A", "B", "C", "D" berisi pilihan jawaban.
  - "correctOption": Satu huruf besar ('A', 'B', 'C', atau 'D') yang merupakan kunci jawaban yang benar secara ilmiah/faktual.
  - "explanation": Penjelasan ilmiah singkat dalam bahasa Indonesia yang menjelaskan mengapa opsi tersebut benar dan mengapa opsi-opsi yang lain kurang tepat atau salah.`;

      const response = await ai.models.generateContent({
        model: ""gemini-3.5-flash",
        contents: `Buat kuis berdasarkan input pengguna berikut ini: "${prompt}"`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: {
                type: Type.BOOLEAN,
                description: "True if the user input is sufficient to generate high quality quiz questions. False if it is too short, gibberish, or completely ambiguous."
              },
              validationErrorMessage: {
                type: Type.STRING,
                description: "Friendly error message in Indonesian explaining that input is too short and presenting the recommendations."
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 2 recommended specific sub-topics in Indonesian when input is invalid/too short."
              },
              quizTitle: {
                type: Type.STRING,
                description: "The title of the quiz in Indonesian, blank if isValid is false."
              },
              questions: {
                type: Type.ARRAY,
                description: "Arrary of exactly 5 quiz questions. Empty if isValid is false.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionText: {
                      type: Type.STRING,
                      description: "The question text testing concept understanding (HOTS style) in Indonesian."
                    },
                    options: {
                      type: Type.OBJECT,
                      properties: {
                        A: { type: Type.STRING },
                        B: { type: Type.STRING },
                        C: { type: Type.STRING },
                        D: { type: Type.STRING }
                      },
                      required: ["A", "B", "C", "D"]
                    },
                    correctOption: {
                      type: Type.STRING,
                      description: "The correct option letter. Must be 'A', 'B', 'C', or 'D'."
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "A short, scientific explanation in Indonesian of why this option is correct and others are wrong."
                    }
                  },
                  required: ["questionText", "options", "correctOption", "explanation"]
                }
              }
            },
            required: ["isValid", "quizTitle", "questions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI engine.");
      }

      const quizData = JSON.parse(responseText.trim());

      // If valid, generate markdown content programmatically to guarantee exact visual schema requested
      if (quizData.isValid && quizData.questions && quizData.questions.length > 0) {
        quizData.markdownContent = generateQuizMarkdown(quizData.quizTitle, quizData.questions);
      } else {
        quizData.markdownContent = "";
      }

      res.json({
        success: true,
        data: quizData
      });

    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Terjadi kesalahan internal saat memproses instruksi cerdas."
      });
    }
  });

  // Vite development or production asset serving middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
