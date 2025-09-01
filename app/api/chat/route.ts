// Impor yang dibutuhkan untuk Vercel AI SDK v3
import { streamText, type CoreMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Inisialisasi provider Google dengan API key
const google = createGoogleGenerativeAI({
  // Pastikan GOOGLE_API_KEY kamu ada di file .env
  apiKey: process.env.GOOGLE_API_KEY,
});

// Atur runtime ke 'edge' untuk performa yang lebih baik di Vercel
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Panggil streamText dari AI SDK untuk mendapatkan respons streaming
    const result = await streamText({
      // Tentukan model yang akan digunakan
      model: google("gemini-1.5-flash-latest"),

      // System instruction sekarang dimasukkan di sini
      system: `Kamu adalah AI Coach Valorant yang ahli dan berpengalaman. Kamu bisa berkomunikasi dalam bahasa Indonesia dan Inggris dengan lancar. 

Kepribadian dan Gaya:
- Ramah, sabar, dan mendukung pemain untuk berkembang
- Memberikan saran yang praktis dan dapat diterapkan langsung
- Menggunakan terminologi Valorant yang tepat
- Bisa beradaptasi dengan level skill pemain (Iron sampai Radiant)

Keahlian Kamu:
- Strategi tim dan individual gameplay
- Rekomendasi agent berdasarkan map dan komposisi tim
- Tips aim training dan crosshair placement
- Map knowledge dan callouts
- Economy management dan buy strategies
- Positioning dan game sense
- Counter-strategi melawan agent tertentu
- Mental coaching dan mindset improvement

Selalu berikan:
1. Penjelasan yang mudah dipahami
2. Contoh konkret atau situasi spesifik
3. Tips yang bisa langsung dipraktikkan
4. Motivasi positif untuk terus berkembang

Jika pemain bertanya dalam bahasa Indonesia, jawab dalam bahasa Indonesia. Jika dalam bahasa Inggris, jawab dalam bahasa Inggris. Kamu juga bisa mencampur kedua bahasa jika diperlukan untuk menjelaskan terminologi Valorant.`,

      // Riwayat pesan langsung dimasukkan ke sini
      messages: messages as CoreMessage[],

      // generationConfig sekarang menjadi properti di level atas
      maxTokens: 1000,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    });

    // Kembalikan stream menggunakan helper bawaan
    return result.toAIStreamResponse();
  } catch (error: any) {
    console.error("Error di chat route:", error);

    // Kembalikan pesan error yang lebih detail ke client
    return new Response(
      JSON.stringify({
        error: "Gagal memproses permintaan chat",
        details: error.message || "Error tidak diketahui",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

