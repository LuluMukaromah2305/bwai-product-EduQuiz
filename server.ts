import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

// Define the core structures for local quizzes
interface QuizQuestion {
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface QuizPreset {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

const QUIZ_DATABASE: QuizPreset[] = [
  {
    id: "biologi",
    title: "Asesmen HOTS: Sistem Pencernaan Manusia & Biokimia Sel",
    questions: [
      {
        questionText: "Seorang siswa mengonsumsi nasi tanpa lauk dan mengunyahnya sebanyak 30 kali sebelum menelan. Mengapa rasa manis mulai terasa di mulutnya, dan apa dampaknya jika proses mengunyah ini dilewatkan bagi usus halus siswa tersebut?",
        options: {
          A: "Enzim pepsin menguraikan glukosa di mulut; jika dilewatkan, usus halus akan bekerja secara pasif tanpa sekresi amilase lambung.",
          B: "Enzim amilase mengatalisis hidrolisis pati menjadi maltosa; jika dilewatkan, usus halus harus bekerja lebih keras memecah molekul kompleks secara mekanik karena minimnya degradasi awal.",
          C: "Enzim lipase memecah amilum secara kimiawi; jika dilewatkan, usus besar tidak mampu menyerap glikogen sekunder secara efisien.",
          D: "Air liur mereaksi selulosa secara termal; jika dilewatkan, pankreas akan berhenti mensekresi empedu untuk menetralkan asam usus halus."
        },
        correctOption: "B",
        explanation: "Enzim amilase (ptialin) dalam air liur menghidrolisis ikatan alfa-glikosidik amilum/pati menjadi molekul lebih sederhana seperti maltosa yang terasa manis. Kurangnya pencernaan mekanis dan enzimatis di mulut secara langsung menambah beban fisiologis organ pencernaan berikutnya."
      },
      {
        questionText: "Pasien mengalami gangguan sekresi empedu akibat penyumbatan pada saluran empedu (biliary obstruction). Manakah dampak metabolik paling signifikan pada sistem pencernaannya?",
        options: {
          A: "Kegagalan hidrolisis protein menjadi asam amino akibat inaktivasi enzim residu tripeptidase usus halus.",
          B: "Penurunan kemampuan emulsifikasi lemak yang mengakibatkan defisiensi penyerapan vitamin larut lemak (A, D, E, K).",
          C: "Kegagalan absorbsi glukosa di usus halus karena hilangnya gradien natrium-kalium aktif.",
          D: "Akumulasi getah lambung berlebih di duodenum yang menyebabkan dehidrasi intestinal ekstrim."
        },
        correctOption: "B",
        explanation: "Empedu berperan penting dalam mengemulsikan lemak menjadi partikel mikro (misel) agar dapat dihidrolisis efektif oleh lipase pankreas. Tanpa empedu, penyerapan lipid terganggu parah, memicu steatorea dan defisiensi vitamin larut lemak (A, D, E, K)."
      },
      {
        questionText: "Mengapa penderita gastritis kronis seringkali mengalami anemia megaloblastik (kurang darah akibat kegagalan pematangan sel darah merah)?",
        options: {
          A: "Rusaknya epitel usus besar memicu penurunan penyerapan zat besi penting untuk cincin hemoglobin.",
          B: "Sel parietal lambung rusak sehingga sekresi faktor intrinsik (intrinsic factor) yang mengikat vitamin B12 gagal, menurunkan penyerapan vitamin tersebut di ileum.",
          C: "Asam lambung yang terlalu asam menghancurkan molekul asam folat sebelum masuk ke area duodenum.",
          D: "Kurangnya enzim tripsin aktif menyebabkan ikatan sel eritrosit di usus mengalami pembusukan dini."
        },
        correctOption: "B",
        explanation: "Sel parietal lambung menghasilkan asam klorida (HCl) dan faktor intrinsik (intrinsic factor). Faktor intrinsik ini penting untuk pengikatan dan penyerapan kobalamin (vitamin B12) di usus halus bagian distal (ileum). Defisiensi vitamin B12 mengganggu sintesis DNA selama pembelahan sel eritrosit, memicu anemia pernisiosa/megaloblastik."
      },
      {
        questionText: "Jika seseorang mengalami gangguan pembuangan atau pembersihan serat makanan di usus besar akibat hipoperistaltik, apa implikasi patologis jangka panjangnya bagi mikrobiota usus?",
        options: {
          A: "Terjadinya fermentasi berlebih oleh bakteri obligat anaerob yang menghasilkan gas metana beracun dan peningkatan keasaman mukosa kolon.",
          B: "Penurunan drastis populasi escherichia coli yang memutus pembentukan vitamin K secara permanen.",
          C: "Berhentinya penyerapan air yang mengakibatkan diare sekretorik yang sulit disembuhkan dengan diet biasa.",
          D: "Usus besar menghasilkan enzim protease tambahan untuk mendaur ulang serat menjadi karbohidrat rantai pendek."
        },
        correctOption: "A",
        explanation: "Konstipasi akibat hipoperistaltik memperlama retensi tinja dan sisa serat, memicu pembusukan dan Overgrowth mikroba patogen atau fermentasi berlebih yang memproduksi racun, gas metan, serta merusak integritas mukosa sel kolon."
      },
      {
        questionText: "Seseorang mengonsumsi pil antasida dosis tinggi secara terus menerus untuk mengurangi keasaman lambungnya. Berdasarkan prinsip homeostasis, apa konsekuensi negatif hal tersebut bagi enzim lambung?",
        options: {
          A: "Enzim amilase lambung akan mengalami denaturasi permanen akibat lingkungan terlalu basa.",
          B: "Enzim pepsinogen gagal diaktivasi menjadi pepsin yang memerlukan pH rendah (~2), mengganggu awal pemecahan protein.",
          C: "Enzim tripsin lambung akan mencerna dinding usus halus akibat hilangnya peredam mukosa tebal.",
          D: "Produksi kimus menjadi berlebih sehingga mempercepat pembuangan makanan tanpa penyerapan air."
        },
        correctOption: "B",
        explanation: "Lambung memerlukan suasana asam kuat (pH 1.5 - 2.5) agar pepsinogen yang disekresikan sel peptik dapat diaktifkan menjadi enzim pepsin untuk menguraikan protein. Netralisasi berlebih kronis menggunakan antasida menghambat konversi pepsinogen ini secara metabolik sehingga menurunkan kapasitas pencernaan protein lambung."
      }
    ]
  },
  {
    id: "sejarah",
    title: "Asesmen HOTS: Krisis Moneter 1998 & Dampak Sosial Politik RI",
    questions: [
      {
        questionText: "Krisis finansial Asia 1997/1998 berawal dari devaluasi mata uang Baht Thailand. Analisislah mengapa Indonesia, yang awalnya dianggap memiliki fondasi makroekonomi kokoh, mengalami dampak krisis sosial-politik paling destruktif di kawasan tersebut?",
        options: {
          A: "Indonesia tidak memiliki hubungan perdagangan aktif dengan negara sekutu Barat dan kurang mendapat bantuan teknis.",
          B: "Ketergantungan ekstrem pada sektor agraris tradisional membuat daya tahan ekonomi masyarakat rentan perubahan cuaca.",
          C: "Adanya kerentanan struktural berupa besarnya utang luar negeri swasta jangka pendek non-hedging, kelemahan sistem perbankan nasional, serta akumulasi ketidakpuasan sosial terhadap praktik KKN.",
          D: "Kebijakan pemerintah menurunkan suku bunga perbankan secara mendadak yang memicu pelarian modal asing besar-besaran."
        },
        correctOption: "C",
        explanation: "Faktor fundamental ekonomi Indonesia rapuh di bawah permukaan akibat utang luar negeri swasta berkapitalisasi valas tanpa lindung nilai (hedging) yang jatuh tempo, sistem perbankan yang korup/lemah, serta krisis kepercayaan sosial-politik yang parah terhadap kronisme (KKN) era Orde Baru."
      },
      {
        questionText: "Manakah dari analisis berikut yang paling akurat menggambarkan efek domino ekonomi krisis moneter 1998 terhadap krisis sosial kemasyarakatan di perkotaan Indonesia?",
        options: {
          A: "Likuidasi bank lokal memicu kemandirian UMKM pedesaan yang menekan perpindahan penduduk ke kota.",
          B: "Depresiasi rupiah melipatgandakan biaya input impor pabrik, memicu PHK massal, peningkatan pengangguran, lonjakan harga bahan pokok (sembako), dan penurunan drastis daya beli masyarakat.",
          C: "Kenaikan harga emas memicu kriminalitas tambang liar di perkotaan karena masyarakat beramai-ramai merebut aset moneter negara.",
          D: "Masuknya komoditas murah luar negeri memanjakan masyarakat urban dengan pola konsumsi instan yang mematikan produsen lokal."
        },
        correctOption: "B",
        explanation: "Nilai tukar rupiah yang anjlok drastis dari Rp2.500 menjadi di atas Rp15.000 per USD melumpuhkan industri manufaktur urban yang mengandalkan bahan baku impor. PHK massal tak terhindarkan, memicu hilangnya pendapatan rumah tangga tepat di saat inflasi pangan pangan melonjak tinggi, yang melatari kerusuhan sosial Mei 1998."
      },
      {
        questionText: "Mengapa kesepakatan LOI (Letter of Intent) pertama antara pemerintah Indonesia dengan IMF pada kuartal akhir 1997 yang mencakup penutupan 16 bank swasta justru memperburuk krisis perbankan nasional?",
        options: {
          A: "Karena nasabah panik (bank run) akibat hilangnya jaminan simpanan penuh (blanket guarantee) dari pemerintah, memicu penarikan dana massal di sisa perbankan nasional.",
          B: "Karena penutupan tersebut memaksa bank-bank asing mengambil alih kepemilikan saham pelabuhan udara dan laut Indonesia.",
          C: "Karena bank sentral melarang penggunaan rupiah dalam semua transaksi kliring antar bank domestik.",
          D: "Karena IMF mewajibkan Indonesia mengubah sistem ekonomi sirkular pancasila menjadi sistem ekonomi pasar bebas penuh."
        },
        correctOption: "A",
        explanation: "Keputusan menutup 16 bank tanpa skema penjaminan deposito yang jelas menciptakan hiper-panik di kalangan masyarakat. Hal ini menimbulkan ketidakpercayaan publik yang masif terhadap sistem perbankan nasional secara keseluruhan, memicu kepanikan penarikan deposito besar-besaran (bank run)."
      },
      {
        questionText: "Gerakan mahasiswa 1998 berhasil mendesak Sidang Istimewa MPR dan Reformasi Konstitusi. Analisislah perubahan fundamental tata laksana pemerintahan pasca kejatuhan rezim Orde Baru!",
        options: {
          A: "Penerapan sentralisasi keuangan di pusat demi stabilitas rupiah dan integrasi militer penuh dalam birokrasi sipil.",
          B: "Pembatasan masa jabatan Presiden maksimal 2 periode, penguatan fungsi DPR, otonomi daerah yang luas, serta jaminan kebebasan pers dan berpendapat.",
          C: "Pembubaran partai oposisi untuk menjaga kondusivitas program kerja menteri kabinet persatuan gotong royong.",
          D: "Penghapusan sistem pemilihan umum multipartai demi menghemat kas negara yang tergerus utang luar negeri."
        },
        correctOption: "B",
        explanation: "Kejatuhan rezim Orde Baru melahirkan amandemen UUD 1945, yang membatasi kekuasaan eksekutif (masa jabatan presiden dibatasi 2 periode), meningkatkan checks and balances dari legislatif, mendelegasikan wewenang pusat ke daerah (otonomi daerah), dan menghapus dwifungsi ABRI."
      },
      {
        questionText: "Konflik sosial dan penjarahan massal di beberapa kota besar pada Mei 1998 merefleksikan kerapuhan integrasi nasional. Apa korelasi utama sosiologis antara ketimpangan ekonomi dan kerusuhan rasial tersebut berdasarkan telaah sejarah?",
        options: {
          A: "Sentimen primordialisme murni yang digerakkan oleh perbedaan ideologi teologis kelompok rentan.",
          B: "Kesenjangan distorsif kemakmuran ekonomi yang dieksploitasi oleh agitasi politik kelas, melahirkan kambing hitam rasial (scapegoating) di tengah frustrasi masyarakat bawah akibat hilangnya mata pencaharian.",
          C: "Migrasi penduduk pedesaan tanpa bekal pendidikan yang menolak asimilasi budaya di pusat kota metropolitan.",
          D: "Provokasi komoditas global yang mengubah pola interaksi bertetangga menjadi individualitas ekstrim urban."
        },
        correctOption: "B",
        explanation: "Secara sosiologis, krisis moneter menciptakan tekanan psikologis massal akibat kemiskinan instan. Ketimpangan ekonomi riil di mana kelompok etnis minoritas keturunan Tionghoa dipersepsikan menguasai sektor ritel dijadikan kambing hitam (scapegoating) oleh elemen provokatif guna mengalihkan amarah politik dan sosial."
      }
    ]
  },
  {
    id: "fisika",
    title: "Asesmen HOTS: Teori Relativitas Khusus Einstein & Kontraksi Ruang-Waktu",
    questions: [
      {
        questionText: "Seorang pengamat di Bumi mengukur panjang pesawat ruang angkasa yang meluncur melewatinya dengan kecepatan 0,8c (c = kecepatan cahaya). Hasil pengukuran Bumi menunjukkan panjang pesawat adalah 60 meter. Berapakah panjang pesawat tersebut menurut pilot di dalam pesawat tersebut, dan bagaimana analisis fisis fenomena ini?",
        options: {
          A: "60 meter; Panjang bersifat mutlak bagi semua pengamat dalam bingkai kecepatan inersia yang seragam.",
          B: "36 meter; Kontraksi panjang mengakibatkan dimensi fisik menyusut seiring dengan mengendurnya waktu relativistik pilot.",
          C: "100 meter; Pengamat diam mengukur panjang yang terkontraksi (lebih pendek) dibanding panjang sejati (proper length) yang diamati oleh pengamat diam terhadap objek (pilot).",
          D: "120 meter; Kecepatan 0.8c meningkatkan resistensi atomik material pesawat sehingga meregang di ruang hampa."
        },
        correctOption: "C",
        explanation: "Dengan faktor Lorentz gamma (γ = 5/3), Panjang terkontraksi L = L_0 / γ, maka L_0 = L * γ = 60 * (5/3) = 100 meter. Panjang sejati (proper length) L_0 diukur oleh pengamat yang relatif diam terhadap benda tersebut (pilot), sedangkan Bumi mengamati penyusutan kontrahir (kontraksi Lorentz) menjadi 60 meter."
      },
      {
        questionText: "Teori Relativitas Khusus mendiktekan bahwa tidak ada materi bermassa yang dapat berjalan menyamai atau melebihi kecepatan cahaya di ruang hampa (c). Manakah dari penjelasan mekanika relativistik berikut yang paling tepat melandasi batasan mutlak tersebut?",
        options: {
          A: "Gaya gesek kosmik antar materi meningkat secara eksponensial di dekat kecepatan cahaya sehingga menyerap seluruh energi dorong kinetik.",
          B: "Momentum relativistik dan energi total benda mendekati tak terhingga saat kecepatan mendekati c, sehingga membutuhkan kerja/energi tak terhingga untuk mempercepatnya melebihi c.",
          C: "Cahaya membawa muatan foton elektromagnetik negatif yang menolak fusi massa benda yang berakselerasi tinggi.",
          D: "Waktu yang melambat menyebabkan mesin pendorong berhenti berfungsi karena elektron diam pada suhu nol mutlak relativitas."
        },
        correctOption: "B",
        explanation: "Rumus energi relativistik total adalah E = γ * m_0 * c^2. Ketika v mendekati c, maka γ mendekati tak terhingga, yang berarti energi kinetik dan momentum relativistik benda mendekati tak terhingga. Menambahkan kecepatan di dekat c hanya menambah bobot massa inersial relativistik, sehingga dibutuhkan energi tak berhingga untuk mencapai kecepatan cahaya penuh."
      },
      {
        questionText: "Dua jam atomik ultra-presisi dikalibrasi bersama di laboratorium. Satu jam tetap diam di laboratorium Bumi, sementara jam satunya diletakkan dalam jet supersonik yang mengitari Bumi berkali-kali sebelum mendarat kembali. Berdasarkan postulat relativitas Einstein, manakah pernyataan yang benar mengenai catatan waktu kedua jam tersebut?",
        options: {
          A: "Kedua jam mencatat durasi waktu yang sama persis karena gravitasi bumi meniadakan dilatasi kecepatan kinetik.",
          B: "Jam pada jet supersonik mencatat waktu yang lebih lambat dibanding jam laboratorium karena efek dilatasi waktu relativistik akibat gerak relatifnya.",
          C: "Jam laboratorium berjalan lebih lambat karena Bumi berotasi berlawanan arah dengan arah rotasi bumi inersial heliosentris.",
          D: "Jam pada jet supersonik berjalan lebih cepat karena posisi ketinggian jet mengurangi kerapatan atom nitrogen di udara bebas."
        },
        correctOption: "B",
        explanation: "Dilatasi waktu meramalkan bahwa jam yang bergerak relatif terhadap suatu kerangka acuan inersia akan berjalan lebih lambat dibanding jam diam (Δt = γ * Δt_0). Ini dibuktikan secara empiris dalam eksperimen jam atomik penerbangan supersonik."
      },
      {
        questionText: "Konsep simultanitas (keserentakan) bersifat relatif dalam fisika relativistik. Jika dua lampu kilat menyala serentak di ujung timur dan barat stasiun menurut petugas stasiun, bagaimana kejadian ini diamati oleh penumpang kereta cepat yang melaju dari barat ke timur?",
        options: {
          A: "Kedua lampu tetap menyala serentak karena cahaya merambat searah ke semua pengamat secara seragam tanpa distorsi spasial.",
          B: "Lampu timur diamati menyala lebih dulu karena penumpang bergerak menyongsong dahi gelombang cahaya dari timur, sementara dahi gelombang dari barat bergerak menjauhi arah gerak kereta.",
          C: "Lampu barat menyala lebih dulu karena relativitas spasial membiaskan sinar inframerah searah kutub magnetik bumi.",
          D: "Tidak ada lampu yang memancarkan cahaya bagi penumpang kereta karena kecepatan cahaya kereta menandingi kecepatan foton stasiun."
        },
        correctOption: "B",
        explanation: "Karena kecepatan cahaya adalah konstan bagi semua pengamat (Postulat ke-2), penumpang kereta melaju ke arah timur menyongsong cahaya dari lampu timur dan menjauhi cahaya dari lampu barat. Akibatnya, penumpang akan mendeteksi lampu timur menyala lebih dahulu daripada lampu barat. Simultansi tidak lagi bersifat absolut."
      },
      {
        questionText: "Dalam fusi nuklir matahari, empat inti hidrogen bergabung menjadi satu inti helium. Namun, massa total helium yang dihasilkan selalu lebih kecil daripada massa total empat inti pembentuknya. Ke mana hilangnya selisih massa (defek massa) tersebut dan bagaimana dampaknya?",
        options: {
          A: "Massa tersebut hilang menguap menjadi air kosmis karena gaya tarik gravitasi matahari yang sangat masif.",
          B: "Selisih massa dikonversi langsung menjadi energi radiasi matahari (foton) sesuai persamaan equivalensi massa-energi Einstein, E = Δm * c^2.",
          C: "Selisih massa berubah menjadi partikel hipotetis antimateri gelap yang menjaga kestabilan posisi planet bumi.",
          D: "Selisih massa tersebut diserap oleh inti atom besi matahari guna menjaga suhu inti tetap konstan pada satu juta derajat kelvin."
        },
        correctOption: "B",
        explanation: "Defek massa (Δm) diubah menjadi energi kinetik dan radiasi elektromagnetik berenergi tinggi lewat persamaan kesetaraan massa-energi Albert Einstein (E = Δm * c^2). Karena nilai kuadrat kecepatan cahaya sangat besar, hilangnya massa yang sangat kecil sanggup membebaskan energi bahasan yang sangat masif sebagai sinar matahari."
      }
    ]
  },
  {
    id: "bahasa",
    title: "Asesmen HOTS: Sintaksis Kalimat Efektif & Analisis Semantik Majas",
    questions: [
      {
        questionText: "Analisislah kalimat berikut: 'Bagi para siswa-siswa sekalian yang mana merasa kesulitan dalam merumuskan hipotesis ujian akhir kurikulum, diharapkan agar supaya segera berkonsultasi dengan dosen pembimbing masing-masing.' Mengapa kalimat tersebut diklasifikasikan sebagai kalimat yang tidak efektif, dan bagaimana perbaikannya secara tepat?",
        options: {
          A: "Kalimat tersebut salah karena tidak memiliki subjek yang jelas; kata 'mahasiswa' harus ditambahkan di awal kalimat sebagai pelengkap SPOK.",
          B: "Mengandung redundansi/pemborosan kata (para siswa-siswa, agar supaya, bagi), struktur berbelit-belit ('yang mana'), serta tidak hemat. Perbaikannya: 'Siswa yang kesulitan merumuskan hipotesis ujian akhir diharapkan segera berkonsultasi dengan dosen pembimbing masing-masing.'",
          C: "Kalimat tersebut salah karena menggunakan kata kerja pasif seperti 'berkonsultasi' yang tidak didului oleh preposisi mutlak.",
          D: "Penggunaan kata 'ujian akhir' harusnya diganti dengan gabungan frasa nominal serapan sekunder beraksen kapital 'Ujian Akhir'."
        },
        correctOption: "B",
        explanation: "Kalimat efektif harus memenuhi syarat kehematan (tidak boros kata/pleonasme), kejelasan lambang logika (tidak berbelit-belit), ketepatan struktur, dan keparalelan. 'Para siswa-siswa' boros karena 'para' sudah menandakan jamak dan 'siswa-siswa' juga jamak. 'Agar supaya' juga pleonasme. 'Yang mana' adalah terjemahan literal bahasa asing 'which/who' yang janggal dalam tata bahasa baku Indonesia."
      },
      {
        questionText: "Cermati kalimat ilmiah populer berikut: 'Penelitian laboratorium menunjukkan bahwa sel kanker adalah penjelajah ulung yang melompati pembuluh darah guna menginvasi organ sehat lainnya.' Manakah majas yang dominan digunakan dalam narasi sains tersebut, dan apa implikasi sastranya?",
        options: {
          A: "Majas Litotes; menyederhanakan ancaman kanker agar tidak menakut-nakuti mental pasien yang lemah.",
          B: "Majas Personifikasi; mempersonifikasikan sel kanker (objek non-manusia) seolah-olah memiliki atribut kemanusiaan ('penjelajah ulung yang melompati') untuk menggambarkan agresivitas metastasis sel secara dramatis.",
          C: "Majas Sinekdoke totem pro parte; menyebutkan keseluruhan sistem organ untuk melambangkan satu materi fisis sekunder.",
          D: "Majas Hiperbola; mendramatisasi kecepatan gerak darah manusia sehingga terdengar cepat berkali lipat dari aslinya."
        },
        correctOption: "B",
        explanation: "Majas personifikasi melekatkan sifat-sifat manusia kepada objek atau benda mati/makhluk renik seperti 'sel kanker' (disebut sebagai 'penjelajah ulung' dan dibilang 'melompati'). Tujuannya adalah mempermudah visualisasi atau memberi penekanan artistik/retorik mengenai betapa agresifnya metastasis kanker."
      },
      {
        questionText: "Manakah dari kalimat di bawah ini yang menunjukkan pelanggaran terhadap asas keparalelan (paralelisme struktur) di dalam penulisan kalimat efektif?",
        options: {
          A: "Langkah-langkah penelitian tindakan kelas meliputi perencanaan tindakan, pelaksanaan pengamatan, analisis data, dan pelaporan hasil evaluasi.",
          B: "Pemerintah daerah bertugas mendata pemukiman kumuh, menata ruang terbuka hijau, dan mengedukasi warga bantaran sungai.",
          C: "Kegiatan kepramukaan di sekolah dasar bertujuan melatih kemandirian, kedisiplinan siswa, dan kita juga diajarkan bertahan hidup.",
          D: "Sejarah mengajarkan kita untuk merefleksikan kesalahan masa lalu, memahami realitas masa kini, dan mengantisipasi tantangan masa depan."
        },
        correctOption: "C",
        explanation: "Keparalelan berarti jika struktur pertama menggunakan nomina verbal (melatih, mendata, dll), maka struktur berikutnya juga harus sejajar jenis kata dan imbuhannya. Pilihan C berganti dari nominal verbal aktif transitif 'melatih...' ke klausa aktif orang pertama 'kita juga diajarkan...', sehingga merusak harmoni susunan paralel kalimat."
      },
      {
        questionText: "Di tengah krisis ekonomi, pejabat publik berujar: 'Rakyat harus ikat pinggang setahun ini agar kapal negara tidak tenggelam.' Analisislah gabungan majas yang terkandung di dalam kutipan pidato publik tersebut secara semantik!",
        options: {
          A: "Metonimia dan Asosiasi; untuk meniadakan peran eksekutif dalam menjaga ketertiban pergerakan finansial nasional.",
          B: "Istilah 'ikat pinggang' bermakna metafora untuk hidup hemat, sedangkan 'kapal negara' bermakna metafora untuk tata pemerintahan, bertujuan merasionalisasi pengorbanan ekonomi rakyat secara persuasif.",
          C: "Majas Ironi dan Sarkasme; guna menyerang kesombongan warga perkotaan yang tidak mau taat membayar pajak wajib daerah.",
          D: "Majas Pleonasme; karena kata 'tenggelam' sudah pasti bermassa negatif ke dasar permukaan laut."
        },
        correctOption: "B",
        explanation: "'Ikat pinggang' adalah metafora idiomatis klasik yang berarti berhemat di masa sulit. 'Kapal negara' adalah kiasan metaforis yang menyamakan negara/pemerintahan dengan kapal laut yang dapat tenggelam jika diterjang ombak/krisis ekonomi. Penggabungan ini bermaksud retoris untuk meyakinkan rakyat bahwa pengorbanan individual diperlukan demi keselamatan kolektif negara."
      },
      {
        questionText: "Perhatikan kalimat berikut: 'Rapat koordinasi membahas mengenai tentang peningkatan kualitas kurikulum sekolah umum swasta.' Mengapa kalimat ini dinilai tidak logis dan tidak hemat secara struktur tata kalimat?",
        options: {
          A: "Preposisi ganda 'membahas mengenai tentang' melanggar asas efisiensi kata karena kata kerja transitif langsung diikuti objek penderita tanpa preposisi ganda, dan 'mengenai' bermakna sama dengan 'tentang'. Perbaikannya: 'Rapat koordinasi membahas peningkatan kualitas...'",
          B: "Kata 'Rapat koordinasi' harus didampingi oleh subjek manusia berpredikat verbal murni agar unsur keaktoran kalimat terpenuhi.",
          C: "Penggunaan kata 'sekolah umum swasta' rancu karena sekolah umum tidak boleh digabung secara dikotomis dengan sistem swasta.",
          D: "Kalimat tersebut sudah benar, tidak ada perbaikan yang diperlukan karena merupakan variasi bahasa lisan formal Indonesia."
        },
        correctOption: "A",
        explanation: "Kata kerja transitif 'membahas' membutuhkan objek penderita langsung tanpa diantar oleh kata depan (preposisi). Penggunaan kata sambung beruntun 'mengenai tentang' selain tidak hemat (redundant) juga mengacaukan struktur gramatikal kalimat baku, menjadikannya rancu secara semantik."
      }
    ]
  }
];

function generateQuizMarkdown(title: string, questions: QuizQuestion[]): string {
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

  // API endpoint to serve appropriate quiz based on keyword matching
  app.post("/api/generate-quiz", (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Materi atau topik tidak boleh kosong."
      });
    }

    const userInput = prompt.toLowerCase();
    let matchedQuiz: QuizPreset | null = null;

    // Detect through keywords or substring matches with presets
    if (
      userInput.includes("cerna") || 
      userInput.includes("pencernaan") || 
      userInput.includes("biologi") || 
      userInput.includes("mulut") || 
      userInput.includes("lambung") || 
      userInput.includes("enzim") || 
      userInput.includes("pepsin") || 
      userInput.includes("amilase") || 
      userInput.includes("lipase") || 
      userInput.includes("usus") || 
      userInput.includes("nutrisi")
    ) {
      matchedQuiz = QUIZ_DATABASE.find(q => q.id === "biologi") || null;
    } else if (
      userInput.includes("krisis") || 
      userInput.includes("moneter") || 
      userInput.includes("1998") || 
      userInput.includes("1997") || 
      userInput.includes("sejarah") || 
      userInput.includes("orde baru") || 
      userInput.includes("soeharto") || 
      userInput.includes("rupiah") || 
      userInput.includes("imf") || 
      userInput.includes("phk") || 
      userInput.includes("reformasi")
    ) {
      matchedQuiz = QUIZ_DATABASE.find(q => q.id === "sejarah") || null;
    } else if (
      userInput.includes("relativitas") || 
      userInput.includes("relativity") || 
      userInput.includes("einstein") || 
      userInput.includes("fisika") || 
      userInput.includes("cahaya") || 
      userInput.includes("supersonik") || 
      userInput.includes("lorantz") || 
      userInput.includes("defek") || 
      userInput.includes("fusi") || 
      userInput.includes("kecepatan")
    ) {
      matchedQuiz = QUIZ_DATABASE.find(q => q.id === "fisika") || null;
    } else if (
      userInput.includes("kalimat") || 
      userInput.includes("efektif") || 
      userInput.includes("majas") || 
      userInput.includes("bahasa") || 
      userInput.includes("indonesia") || 
      userInput.includes("sastra") || 
      userInput.includes("personifikasi") || 
      userInput.includes("paralel") || 
      userInput.includes("pleonasme") || 
      userInput.includes("metafora") || 
      userInput.includes("sintaksis")
    ) {
      matchedQuiz = QUIZ_DATABASE.find(q => q.id === "bahasa") || null;
    }

    // Prepare response conformant with structured schema
    if (matchedQuiz) {
      const markdown = generateQuizMarkdown(matchedQuiz.title, matchedQuiz.questions);
      return res.json({
        success: true,
        data: {
          isValid: true,
          quizTitle: matchedQuiz.title,
          questions: matchedQuiz.questions,
          markdownContent: markdown
        }
      });
    } else {
      // Dynamic recommendation trigger when input is too brief or mismatch
      return res.json({
        success: true,
        data: {
          isValid: false,
          validationErrorMessage: "Materi atau kata kunci yang Anda masukkan terlalu umum, kurang spesifik, atau belum terdaftar dalam database kurikulum kami.",
          recommendations: [
            "Sistem Pencernaan Manusia (Biologi)",
            "Krisis Moneter 1998 & Dampak Sosial (Sejarah)",
            "Teori Relativitas Khusus (Fisika)",
            "Kalimat Efektif & Majas (Bahasa Indonesia)"
          ],
          quizTitle: "",
          questions: []
        }
      });
    }
  });

  // Serve static UI assets with fallback to SPA index.html
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
