import type { Locale } from "@/lib/i18n/config";

type UiStrings = {
  badge: string;
  navCatalog: string;
  navPro: string;
  navPrivacy: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  viewAllTools: string;
  howToUseTitle: (name: string) => string;
  whyUseTitle: (name: string) => string;
  privacyTitle: (name: string) => string;
  faqTitle: string;
  relatedSearches: string;
  moreIn: (group: string) => string;
  footerTagline: string;
  footerCopyright: string;
  comingSoonTitle: string;
  comingSoonBody: (name: string) => string;
  home: string;
};

type KindTemplates = {
  howTo: (name: string) => string[];
  benefits: () => string[];
  faqs: (name: string) => { q: string; a: string }[];
  privacy: (name: string) => string;
};

export const uiStrings: Record<Locale, UiStrings> = {
  es: {
    badge: "⚡ Sin registro. Sin inicio de sesión. Empieza al instante.",
    navCatalog: "Catálogo de Herramientas",
    navPro: "Funciones Pro",
    navPrivacy: "Privacidad y Seguridad",
    heroKicker: "50+ herramientas, cero instalaciones",
    heroTitle: "Cada herramienta de archivos que necesitas, en un solo lugar.",
    heroSubtitle: "Comprime PDFs, convierte imágenes y limpia texto — procesado en tu propio dispositivo, y desaparece al cerrar la pestaña.",
    viewAllTools: "Ver todas →",
    howToUseTitle: (n) => `Cómo usar ${n}`,
    whyUseTitle: (n) => `Por qué usar ${n}`,
    privacyTitle: (n) => `🔒 Tu privacidad con ${n}`,
    faqTitle: "Preguntas frecuentes",
    relatedSearches: "Búsquedas relacionadas",
    moreIn: (g) => `Más en ${g}`,
    footerTagline: "50+ herramientas diarias que funcionan totalmente en tu navegador. Sin registro, sin inicio de sesión, sin espera.",
    footerCopyright: "Todos los archivos se procesan localmente en tu navegador.",
    comingSoonTitle: "Esta herramienta llegará pronto",
    comingSoonBody: (n) => `Estamos terminando ${n.toLowerCase()} para que funcione completamente en tu navegador, igual que el resto de Toolkitties.`,
    home: "Inicio",
  },
  pt: {
    badge: "⚡ Sem cadastro. Sem login. Comece agora mesmo.",
    navCatalog: "Catálogo de Ferramentas",
    navPro: "Recursos Pro",
    navPrivacy: "Privacidade e Segurança",
    heroKicker: "50+ ferramentas, zero instalações",
    heroTitle: "Toda ferramenta de arquivo que você precisa, num só lugar.",
    heroSubtitle: "Comprima PDFs, converta imagens e organize texto — processado no seu próprio dispositivo, e desaparece ao fechar a aba.",
    viewAllTools: "Ver todas →",
    howToUseTitle: (n) => `Como usar ${n}`,
    whyUseTitle: (n) => `Por que usar ${n}`,
    privacyTitle: (n) => `🔒 Sua privacidade com ${n}`,
    faqTitle: "Perguntas frequentes",
    relatedSearches: "Buscas relacionadas",
    moreIn: (g) => `Mais em ${g}`,
    footerTagline: "50+ ferramentas do dia a dia que funcionam totalmente no seu navegador. Sem cadastro, sem login, sem espera.",
    footerCopyright: "Todos os arquivos são processados localmente no seu navegador.",
    comingSoonTitle: "Esta ferramenta chega em breve",
    comingSoonBody: (n) => `Estamos finalizando ${n.toLowerCase()} para funcionar totalmente no seu navegador, como o resto do Toolkitties.`,
    home: "Início",
  },
  de: {
    badge: "⚡ Keine Anmeldung. Kein Login. Sofort loslegen.",
    navCatalog: "Tool-Katalog",
    navPro: "Pro-Funktionen",
    navPrivacy: "Datenschutz & Sicherheit",
    heroKicker: "50+ Tools, keine Installation",
    heroTitle: "Jedes Datei-Tool, das du brauchst, an einem Ort.",
    heroSubtitle: "PDFs komprimieren, Bilder umwandeln und Text aufräumen — verarbeitet auf deinem eigenen Gerät, verschwindet beim Schließen des Tabs.",
    viewAllTools: "Alle ansehen →",
    howToUseTitle: (n) => `So verwendest du ${n}`,
    whyUseTitle: (n) => `Warum ${n} verwenden`,
    privacyTitle: (n) => `🔒 Deine Privatsphäre mit ${n}`,
    faqTitle: "Häufig gestellte Fragen",
    relatedSearches: "Verwandte Suchanfragen",
    moreIn: (g) => `Mehr in ${g}`,
    footerTagline: "50+ Alltags-Tools, die vollständig in deinem Browser laufen. Keine Anmeldung, kein Login, kein Warten.",
    footerCopyright: "Alle Dateien werden lokal in deinem Browser verarbeitet.",
    comingSoonTitle: "Dieses Tool kommt bald",
    comingSoonBody: (n) => `Wir arbeiten daran, dass ${n} vollständig in deinem Browser läuft, genau wie der Rest von Toolkitties.`,
    home: "Startseite",
  },
  fr: {
    badge: "⚡ Sans inscription. Sans connexion. Démarrez instantanément.",
    navCatalog: "Catalogue d'Outils",
    navPro: "Fonctions Pro",
    navPrivacy: "Confidentialité et Sécurité",
    heroKicker: "50+ outils, zéro installation",
    heroTitle: "Tous les outils de fichiers dont vous avez besoin, au même endroit.",
    heroSubtitle: "Compressez des PDF, convertissez des images et nettoyez du texte — traité sur votre propre appareil, et disparaît à la fermeture de l'onglet.",
    viewAllTools: "Voir tout →",
    howToUseTitle: (n) => `Comment utiliser ${n}`,
    whyUseTitle: (n) => `Pourquoi utiliser ${n}`,
    privacyTitle: (n) => `🔒 Votre confidentialité avec ${n}`,
    faqTitle: "Questions fréquentes",
    relatedSearches: "Recherches associées",
    moreIn: (g) => `Plus dans ${g}`,
    footerTagline: "50+ outils du quotidien qui fonctionnent entièrement dans votre navigateur. Sans inscription, sans connexion, sans attente.",
    footerCopyright: "Tous les fichiers sont traités localement dans votre navigateur.",
    comingSoonTitle: "Cet outil arrive bientôt",
    comingSoonBody: (n) => `Nous finalisons ${n.toLowerCase()} pour qu'il fonctionne entièrement dans votre navigateur, comme le reste de Toolkitties.`,
    home: "Accueil",
  },
  hi: {
    badge: "⚡ कोई साइनअप नहीं। कोई लॉगिन नहीं। तुरंत शुरू करें।",
    navCatalog: "टूल्स कैटलॉग",
    navPro: "प्रो फीचर्स",
    navPrivacy: "प्राइवेसी और सुरक्षा",
    heroKicker: "50+ टूल्स, ज़ीरो इंस्टॉल",
    heroTitle: "हर फ़ाइल टूल जो आपको चाहिए, एक ही जगह पर।",
    heroSubtitle: "पीडीएफ कंप्रेस करें, इमेज बदलें, और टेक्स्ट ठीक करें — यह सब आपके अपने डिवाइस पर होता है, टैब बंद करते ही खत्म।",
    viewAllTools: "सभी देखें →",
    howToUseTitle: (n) => `${n} का उपयोग कैसे करें`,
    whyUseTitle: (n) => `${n} का उपयोग क्यों करें`,
    privacyTitle: (n) => `🔒 ${n} के साथ आपकी प्राइवेसी`,
    faqTitle: "अक्सर पूछे जाने वाले सवाल",
    relatedSearches: "संबंधित खोजें",
    moreIn: (g) => `${g} में और भी`,
    footerTagline: "50+ रोज़मर्रा के टूल्स जो पूरी तरह आपके ब्राउज़र में चलते हैं। कोई साइनअप नहीं, कोई लॉगिन नहीं, कोई इंतज़ार नहीं।",
    footerCopyright: "सभी फ़ाइलें आपके ब्राउज़र में स्थानीय रूप से प्रोसेस होती हैं।",
    comingSoonTitle: "यह टूल जल्द आ रहा है",
    comingSoonBody: (n) => `हम ${n} को पूरी तरह आपके ब्राउज़र में चलाने के लिए तैयार कर रहे हैं, बाकी Toolkitties की तरह।`,
    home: "होम",
  },
  id: {
    badge: "⚡ Tanpa daftar. Tanpa login. Mulai langsung.",
    navCatalog: "Katalog Alat",
    navPro: "Fitur Pro",
    navPrivacy: "Privasi & Keamanan",
    heroKicker: "50+ alat, tanpa instalasi",
    heroTitle: "Semua alat file yang Anda butuhkan, di satu tempat.",
    heroSubtitle: "Kompres PDF, ubah gambar, dan rapikan teks — diproses di perangkat Anda sendiri, hilang begitu tab ditutup.",
    viewAllTools: "Lihat semua →",
    howToUseTitle: (n) => `Cara menggunakan ${n}`,
    whyUseTitle: (n) => `Kenapa pakai ${n}`,
    privacyTitle: (n) => `🔒 Privasi Anda dengan ${n}`,
    faqTitle: "Pertanyaan yang sering diajukan",
    relatedSearches: "Pencarian terkait",
    moreIn: (g) => `Lainnya di ${g}`,
    footerTagline: "50+ alat sehari-hari yang berjalan sepenuhnya di browser Anda. Tanpa daftar, tanpa login, tanpa menunggu.",
    footerCopyright: "Semua file diproses secara lokal di browser Anda.",
    comingSoonTitle: "Alat ini segera hadir",
    comingSoonBody: (n) => `Kami sedang menyelesaikan ${n} agar berjalan sepenuhnya di browser Anda, seperti alat Toolkitties lainnya.`,
    home: "Beranda",
  },
  ja: {
    badge: "⚡ 登録不要。ログイン不要。すぐに使えます。",
    navCatalog: "ツールカタログ",
    navPro: "Pro機能",
    navPrivacy: "プライバシーとセキュリティ",
    heroKicker: "50以上のツール、インストール不要",
    heroTitle: "必要なファイルツールが、すべてここに。",
    heroSubtitle: "PDFの圧縮、画像の変換、テキストの整理 — すべてあなたのデバイス上で処理され、タブを閉じれば消えます。",
    viewAllTools: "すべて見る →",
    howToUseTitle: (n) => `${n}の使い方`,
    whyUseTitle: (n) => `${n}を使う理由`,
    privacyTitle: (n) => `🔒 ${n}でのプライバシー`,
    faqTitle: "よくある質問",
    relatedSearches: "関連検索",
    moreIn: (g) => `${g}のその他`,
    footerTagline: "50以上の日常ツールがすべてブラウザ内で動作します。登録不要、ログイン不要、待ち時間なし。",
    footerCopyright: "すべてのファイルはブラウザ内でローカルに処理されます。",
    comingSoonTitle: "このツールは近日公開予定です",
    comingSoonBody: (n) => `${n}を他のToolkitiesツールと同じように、完全にブラウザ内で動作するよう準備しています。`,
    home: "ホーム",
  },
  ar: {
    badge: "⚡ بدون تسجيل. بدون تسجيل دخول. ابدأ فورًا.",
    navCatalog: "كتالوج الأدوات",
    navPro: "ميزات Pro",
    navPrivacy: "الخصوصية والأمان",
    heroKicker: "أكثر من 50 أداة، بدون تثبيت",
    heroTitle: "كل أداة ملفات تحتاجها، في مكان واحد.",
    heroSubtitle: "اضغط ملفات PDF، حوّل الصور، ونظّف النصوص — كل ذلك يتم على جهازك الخاص ويختفي عند إغلاق التبويب.",
    viewAllTools: "عرض الكل ←",
    howToUseTitle: (n) => `كيفية استخدام ${n}`,
    whyUseTitle: (n) => `لماذا تستخدم ${n}`,
    privacyTitle: (n) => `🔒 خصوصيتك مع ${n}`,
    faqTitle: "الأسئلة الشائعة",
    relatedSearches: "عمليات بحث ذات صلة",
    moreIn: (g) => `المزيد في ${g}`,
    footerTagline: "أكثر من 50 أداة يومية تعمل بالكامل داخل متصفحك. بدون تسجيل، بدون تسجيل دخول، بدون انتظار.",
    footerCopyright: "تتم معالجة جميع الملفات محليًا داخل متصفحك.",
    comingSoonTitle: "هذه الأداة قادمة قريبًا",
    comingSoonBody: (n) => `نحن نجهّز ${n} لتعمل بالكامل داخل متصفحك، مثل باقي أدوات Toolkitties.`,
    home: "الرئيسية",
  },
};

export const kindTemplates: Record<Locale, KindTemplates> = {
  es: {
    howTo: (n) => [
      `Abre la página de ${n} y suelta tu archivo, o haz clic para buscarlo en tu dispositivo.`,
      `Ajusta las opciones que necesites — todo se procesa al instante.`,
      `Haz clic en procesar y observa el progreso en pantalla.`,
      `Descarga el resultado directamente a tu dispositivo — nada se guarda en un servidor.`,
    ],
    benefits: () => [
      "Funciona totalmente en tu navegador — tu archivo nunca se sube a un servidor.",
      "No necesitas cuenta, registro ni correo electrónico.",
      "Completamente gratis, sin límite diario en el plan Starter.",
      "Resultado instantáneo, sin esperas.",
    ],
    faqs: (n) => [
      { q: `¿${n} es gratis?`, a: `Sí. ${n} es gratis en el plan Starter. El plan Pro elimina el límite diario y acelera el procesamiento.` },
      { q: `¿Necesito una cuenta para usar ${n}?`, a: `No. Abre la página y empieza a usar ${n} de inmediato.` },
      { q: `¿Es seguro usar ${n} con archivos privados?`, a: `Sí. ${n} procesa tu archivo localmente en tu navegador. Nunca se sube a los servidores de Toolkitties.` },
    ],
    privacy: (n) => `${n} funciona como JavaScript del lado del cliente dentro de tu propia pestaña del navegador. Tu archivo o texto se procesa en tu dispositivo — nunca se envía, almacena ni ve en los servidores de Toolkitties. Cerrar o actualizar la página lo borra todo.`,
  },
  pt: {
    howTo: (n) => [
      `Abra a página de ${n} e solte seu arquivo, ou clique para procurá-lo no seu dispositivo.`,
      `Ajuste as opções que precisar — tudo é processado instantaneamente.`,
      `Clique em processar e acompanhe o progresso na tela.`,
      `Baixe o resultado direto para seu dispositivo — nada fica salvo em um servidor.`,
    ],
    benefits: () => [
      "Funciona totalmente no seu navegador — seu arquivo nunca é enviado a um servidor.",
      "Não precisa de conta, cadastro ou e-mail.",
      "Totalmente grátis, sem limite diário no plano Starter.",
      "Resultado instantâneo, sem espera.",
    ],
    faqs: (n) => [
      { q: `${n} é grátis?`, a: `Sim. ${n} é grátis no plano Starter. O plano Pro remove o limite diário e acelera o processamento.` },
      { q: `Preciso de conta para usar ${n}?`, a: `Não. Abra a página e comece a usar ${n} imediatamente.` },
      { q: `É seguro usar ${n} com arquivos privados?`, a: `Sim. ${n} processa seu arquivo localmente no navegador. Nunca é enviado aos servidores do Toolkitties.` },
    ],
    privacy: (n) => `${n} funciona como JavaScript do lado do cliente dentro da sua própria aba do navegador. Seu arquivo ou texto é processado no seu dispositivo — nunca é enviado, armazenado ou visto pelos servidores do Toolkitties. Fechar ou atualizar a página apaga tudo.`,
  },
  de: {
    howTo: (n) => [
      `Öffne die ${n}-Seite und ziehe deine Datei hinein, oder klicke, um sie auf deinem Gerät auszuwählen.`,
      `Passe die Optionen an, die du brauchst — alles wird sofort verarbeitet.`,
      `Klicke auf Verarbeiten und verfolge den Fortschritt auf dem Bildschirm.`,
      `Lade das Ergebnis direkt auf dein Gerät herunter — nichts wird auf einem Server gespeichert.`,
    ],
    benefits: () => [
      "Läuft komplett in deinem Browser — deine Datei wird nie auf einen Server hochgeladen.",
      "Kein Konto, keine Anmeldung, keine E-Mail nötig.",
      "Komplett kostenlos, ohne Tageslimit im Starter-Plan.",
      "Sofortiges Ergebnis, keine Wartezeit.",
    ],
    faqs: (n) => [
      { q: `Ist ${n} kostenlos?`, a: `Ja. ${n} ist im Starter-Plan kostenlos. Der Pro-Plan entfernt das Tageslimit und beschleunigt die Verarbeitung.` },
      { q: `Brauche ich ein Konto für ${n}?`, a: `Nein. Öffne die Seite und nutze ${n} sofort.` },
      { q: `Ist ${n} sicher für private Dateien?`, a: `Ja. ${n} verarbeitet deine Datei lokal in deinem Browser. Sie wird nie auf Toolkitties-Server hochgeladen.` },
    ],
    privacy: (n) => `${n} läuft als clientseitiges JavaScript in deinem eigenen Browser-Tab. Deine Datei oder dein Text wird auf deinem Gerät verarbeitet — nie an Toolkitties-Server gesendet, dort gespeichert oder eingesehen. Schließen oder Neuladen der Seite löscht alles.`,
  },
  fr: {
    howTo: (n) => [
      `Ouvrez la page ${n} et déposez votre fichier, ou cliquez pour le parcourir sur votre appareil.`,
      `Ajustez les options nécessaires — tout est traité instantanément.`,
      `Cliquez sur traiter et suivez la progression à l'écran.`,
      `Téléchargez le résultat directement sur votre appareil — rien n'est conservé sur un serveur.`,
    ],
    benefits: () => [
      "Fonctionne entièrement dans votre navigateur — votre fichier n'est jamais envoyé à un serveur.",
      "Aucun compte, inscription ou e-mail requis.",
      "Entièrement gratuit, sans limite quotidienne sur le plan Starter.",
      "Résultat instantané, sans attente.",
    ],
    faqs: (n) => [
      { q: `${n} est-il gratuit ?`, a: `Oui. ${n} est gratuit sur le plan Starter. Le plan Pro supprime la limite quotidienne et accélère le traitement.` },
      { q: `Ai-je besoin d'un compte pour ${n} ?`, a: `Non. Ouvrez la page et utilisez ${n} immédiatement.` },
      { q: `Est-il sûr d'utiliser ${n} avec des fichiers privés ?`, a: `Oui. ${n} traite votre fichier localement dans votre navigateur. Il n'est jamais envoyé aux serveurs de Toolkitties.` },
    ],
    privacy: (n) => `${n} fonctionne comme du JavaScript côté client dans votre propre onglet de navigateur. Votre fichier ou texte est traité sur votre appareil — jamais envoyé, stocké ou vu par les serveurs de Toolkitties. Fermer ou actualiser la page efface tout.`,
  },
  hi: {
    howTo: (n) => [
      `${n} पेज खोलें और अपनी फ़ाइल ड्रॉप करें, या डिवाइस से चुनने के लिए क्लिक करें।`,
      `जो भी विकल्प चाहिए उन्हें सेट करें — सब कुछ तुरंत प्रोसेस होता है।`,
      `प्रोसेस पर क्लिक करें और स्क्रीन पर प्रगति देखें।`,
      `परिणाम सीधे अपने डिवाइस पर डाउनलोड करें — कुछ भी सर्वर पर सेव नहीं होता।`,
    ],
    benefits: () => [
      "पूरी तरह आपके ब्राउज़र में चलता है — आपकी फ़ाइल कभी सर्वर पर अपलोड नहीं होती।",
      "कोई अकाउंट, साइनअप या ईमेल की ज़रूरत नहीं।",
      "पूरी तरह मुफ़्त, स्टार्टर प्लान में कोई डेली लिमिट नहीं।",
      "तुरंत परिणाम, कोई इंतज़ार नहीं।",
    ],
    faqs: (n) => [
      { q: `क्या ${n} मुफ़्त है?`, a: `हां। ${n} स्टार्टर प्लान में मुफ़्त है। प्रो प्लान डेली लिमिट हटाता है और प्रोसेसिंग तेज़ करता है।` },
      { q: `क्या ${n} इस्तेमाल करने के लिए अकाउंट चाहिए?`, a: `नहीं। पेज खोलें और तुरंत ${n} इस्तेमाल करें।` },
      { q: `क्या प्राइवेट फ़ाइलों के लिए ${n} सुरक्षित है?`, a: `हां। ${n} आपकी फ़ाइल को आपके ब्राउज़र में ही प्रोसेस करता है। ये कभी Toolkitties सर्वर पर अपलोड नहीं होती।` },
    ],
    privacy: (n) => `${n} आपके अपने ब्राउज़र टैब के अंदर क्लाइंट-साइड जावास्क्रिप्ट के रूप में चलता है। आपकी फ़ाइल या टेक्स्ट आपके डिवाइस पर ही प्रोसेस होता है — यह कभी Toolkitties सर्वर पर भेजा, सेव या देखा नहीं जाता। पेज बंद या रिफ्रेश करते ही सब कुछ मिट जाता है।`,
  },
  id: {
    howTo: (n) => [
      `Buka halaman ${n} dan seret file Anda, atau klik untuk menelusuri dari perangkat Anda.`,
      `Sesuaikan opsi yang Anda butuhkan — semuanya diproses secara instan.`,
      `Klik proses dan lihat progresnya di layar.`,
      `Unduh hasilnya langsung ke perangkat Anda — tidak ada yang disimpan di server.`,
    ],
    benefits: () => [
      "Berjalan sepenuhnya di browser Anda — file Anda tidak pernah diunggah ke server.",
      "Tidak perlu akun, pendaftaran, atau email.",
      "Sepenuhnya gratis, tanpa batas harian di paket Starter.",
      "Hasil instan, tanpa menunggu.",
    ],
    faqs: (n) => [
      { q: `Apakah ${n} gratis?`, a: `Ya. ${n} gratis di paket Starter. Paket Pro menghapus batas harian dan mempercepat pemrosesan.` },
      { q: `Apakah saya perlu akun untuk ${n}?`, a: `Tidak. Buka halamannya dan langsung gunakan ${n}.` },
      { q: `Apakah aman menggunakan ${n} untuk file pribadi?`, a: `Ya. ${n} memproses file Anda secara lokal di browser. File tidak pernah diunggah ke server Toolkitties.` },
    ],
    privacy: (n) => `${n} berjalan sebagai JavaScript sisi klien di dalam tab browser Anda sendiri. File atau teks Anda diproses di perangkat Anda — tidak pernah dikirim, disimpan, atau dilihat oleh server Toolkitties. Menutup atau me-refresh halaman akan menghapus semuanya.`,
  },
  ja: {
    howTo: (n) => [
      `${n}のページを開き、ファイルをドロップするか、クリックしてデバイスから選択します。`,
      `必要なオプションを設定してください — すべて即座に処理されます。`,
      `処理をクリックし、画面上で進行状況を確認します。`,
      `結果をデバイスに直接ダウンロードします — サーバーには何も保存されません。`,
    ],
    benefits: () => [
      "完全にブラウザ内で動作します — ファイルがサーバーにアップロードされることはありません。",
      "アカウント、登録、メールアドレスは不要です。",
      "完全無料、スタータープランに1日の制限はありません。",
      "即座に結果が得られ、待ち時間はありません。",
    ],
    faqs: (n) => [
      { q: `${n}は無料ですか？`, a: `はい。${n}はスタータープランで無料です。Proプランでは1日の制限がなくなり、処理も高速化されます。` },
      { q: `${n}を使うのにアカウントは必要ですか？`, a: `いいえ。ページを開けばすぐに${n}を使えます。` },
      { q: `プライベートなファイルに${n}を使っても安全ですか？`, a: `はい。${n}はブラウザ内でローカルに処理されます。Toolkitiesのサーバーにアップロードされることはありません。` },
    ],
    privacy: (n) => `${n}はあなた自身のブラウザタブ内でクライアントサイドのJavaScriptとして動作します。ファイルやテキストはあなたのデバイス上で処理され — Toolkitiesのサーバーに送信、保存、閲覧されることは決してありません。ページを閉じるか更新すると、すべて消去されます。`,
  },
  ar: {
    howTo: (n) => [
      `افتح صفحة ${n} وأفلت ملفك، أو انقر لتصفحه من جهازك.`,
      `اضبط الخيارات التي تحتاجها — تتم المعالجة فورًا.`,
      `انقر على معالجة وتابع التقدم على الشاشة.`,
      `نزّل النتيجة مباشرة إلى جهازك — لا شيء يُحفظ على أي خادم.`,
    ],
    benefits: () => [
      "يعمل بالكامل داخل متصفحك — لا يتم رفع ملفك أبدًا إلى خادم.",
      "لا حاجة لحساب أو تسجيل أو بريد إلكتروني.",
      "مجاني بالكامل، بدون حد يومي في خطة Starter.",
      "نتيجة فورية، بدون انتظار.",
    ],
    faqs: (n) => [
      { q: `هل ${n} مجاني؟`, a: `نعم. ${n} مجاني في خطة Starter. خطة Pro تزيل الحد اليومي وتسرّع المعالجة.` },
      { q: `هل أحتاج حسابًا لاستخدام ${n}؟`, a: `لا. افتح الصفحة وابدأ استخدام ${n} فورًا.` },
      { q: `هل استخدام ${n} آمن للملفات الخاصة؟`, a: `نعم. ${n} يعالج ملفك محليًا داخل متصفحك. لا يُرفع أبدًا إلى خوادم Toolkitties.` },
    ],
    privacy: (n) => `يعمل ${n} كجافاسكريبت من جانب العميل داخل تبويب متصفحك الخاص. تتم معالجة ملفك أو نصك على جهازك — لا يُرسل أو يُحفظ أو يُشاهد أبدًا على خوادم Toolkitties. إغلاق الصفحة أو تحديثها يمسح كل شيء.`,
  },
};
