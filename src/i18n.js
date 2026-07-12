export const content = {
  en: {
    nav: { intro: "Intro", experience: "Experience", portfolio: "Portfolio", contact: "Contact" },
    intro: {
      title: "初めまして, I am Tatsunori Ono.",
      paragraphs: [
        "I am a Computer Science student at the University of Warwick, passionate about software engineering and web development, as well as financial technology (as I am a stock trader). I love thinking about complex ideas and solving problems in real life using the power of computers and mathematics.",
        "I also love all things Vocaloid and creating multimedia. Turning creative ideas into interactive experiences is the part I enjoy (as you can tell from the astroids you see swirling behind this text).",
      ],
    },
    experience: {
      heading: "Experience",
      work: {
        heading: "Work Experience",
        items: [
          {
            title: "Full-Stack Web Development Intern - Crypton Future Media Inc. (Aug 2025 – Sep 2025)",
            bullets: [
              "Received an offer for full-stack web development intern at the company famously known for developing Hatsune Miku.",
              "Built a \"Pinterest x Creative Commons\" web app for the Vocaloid community, where creators upload illustrations with explicit license terms (non-commercial, derivative, attribution) and music producers discover artworks for track thumbnails and contact the creators.",
              "Developed a swipe-based discovery UI (\"Tinder-style\") using React, and programmed the backend in Laravel to rank candidates by hashtags, categories, and artworks pinned on users' artboards.",
              "Provisioned a fresh AlmaLinux cloud instance and deployed the app by configuring the Nginx web server and MySQL user permissions.",
              "Delivered the project end-to-end in 2 weeks and demoed live to the CEO, 20+ engineers, and HR, earning praise for decision-making and task prioritisation, and received a return offer.",
            ],
          },
          {
            title: "Software Engineer Intern - Emath Inc. (Jul 2022 – Aug 2022)",
            bullets: [
              "Proposed and built a camera-free facial expression rendering system with 93% accuracy in internal tests, by linking API of AI real-time emotion analysis based on voice tone to VR avatars on 3D computer graphics software.",
              "Innovated reliance on facial tracking hardware and increased accessibility for 4,300+ users, reducing VR setup costs by £300 per user on average.",
            ],
          },
          {
            title: "Machine Learning Research Intern - Fujitsu Ltd. (Jun 2022 – Jul 2022)",
            bullets: [
              "Researched applications of AI deductive reasoning systems on quantum computing output with the head of Fujitsu Research by analysing causal chains in probabilistic graphs.",
            ],
          },
          {
            title: "Independent Stock Trader - Astroid Inc. (2019 – Present)",
            bullets: [
              "Grew Japanese stock portfolio by 48.7% within a year, focusing on semiconductors, Japanese subculture, and transport infrastructure sectors.",
              "Developed Python scripts for market-sentiment analysis and automated trade execution.",
            ],
          },
        ],
      },
      leadership: {
        heading: "Leadership Experience",
        items: [
          {
            title: "President and Founder - Warwick Vocaloid Society (Nov 2023 – Feb 2025)",
            bullets: [
              "Founded the first Vocaloid society in the UK and gained 300+ members by cooperating with the university and the Student Union.",
              "Organised voice synthesis workshops, enabling members to record and transform their voices into custom Vocaloid-style voicebanks.",
              "Expanded reach by growing society's social media (Xiaohongshu) to 2,000+ followers and 11,300+ likes through viral event highlights; featured on national TV by NHK (Japan's BBC-equivalent broadcaster).",
            ],
          },
          {
            title: "CTO and Co-Founder - Muzartt via MIT LaunchX (Jun 2020 – Oct 2023)",
            bullets: [
              "Built Muzartt, an art & music therapy app for dementia patients, and delivered it to care homes serving 180+ residents.",
              "Led technical development while running weekly agile feedback loops with Harvard Business School mentors and clinicians.",
              "Pitched to investors and secured initial funding for pilot program deployment.",
            ],
          },
          {
            title: "President, Founder and Technical Leader - KIST Information Technology (Sep 2019 – Jun 2023)",
            bullets: [
              "Founded and led the largest student club in the school's 27-year history, enrolling over 25% of all KIST students.",
              "Designed and taught 30+ original tech courses for students, including ML in Python and web development in Ruby.",
              "Mentored 50+ students in programming and helped 15+ students get accepted to top computer science programs.",
            ],
          },
        ],
      },
    },
    portfolio: { heading: "Portfolio" },
    contact: {
      heading: "Contact",
      subheading:
        "Feel free to reach out — I'm always happy to chat about software, Vocaloid, or trading.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "Download Resume (PDF)",
    },
  },

  ja: {
    nav: { intro: "イントロ", experience: "経験", portfolio: "作品集", contact: "お問い合わせ" },
    intro: {
      title: "初めまして、小野辰典です。",
      paragraphs: [
        "私はウォーリック大学でコンピューターサイエンスを専攻する学生で、ソフトウェアエンジニアリングとWeb開発、そして金融工学（個人投資家として株式トレードも行っています）に情熱を注いでいます。複雑なアイデアについて考え、コンピューターと数学の力を使って現実の問題を解決することが大好きです。",
        "また、ボーカロイドをはじめとするマルチメディア制作全般が大好きです。創造的なアイデアをインタラクティブな体験へと変えていくことに、大きなやりがいを感じています（背景を漂うアステロイドからもその一端が伝わるかもしれません）。",
      ],
    },
    experience: {
      heading: "経験",
      work: {
        heading: "職務経験",
        items: [
          {
            title: "フルスタックWeb開発インターン - Crypton Future Media Inc.（2025年8月〜9月）",
            bullets: [
              "初音ミクの開発で知られる企業にて、フルスタックWeb開発インターンとして採用。",
              "ボーカロイドコミュニティ向けに「Pinterest×クリエイティブ・コモンズ」型のWebアプリを開発。イラストレーターが利用条件（非営利、二次創作可否、クレジット表記など）を明示して作品を投稿し、音楽プロデューサーが楽曲サムネイル用の作品を発掘してクリエイターに直接連絡できる仕組みを構築。",
              "Reactでスワイプ式の発見型UI（Tinderライク）を開発し、バックエンドはLaravelで実装。ハッシュタグ・カテゴリー・ユーザーのアートボードにピン留めされた作品をもとに候補作品をランキングするロジックを構築。",
              "AlmaLinuxのクラウドインスタンスを新規構築し、NginxとMySQLのユーザー権限を設定してアプリをデプロイ。",
              "2週間でプロジェクトをエンドツーエンドで完成させ、CEO・エンジニア20名以上・人事担当者の前でライブデモを実施。意思決定力とタスク優先度付けの能力が評価され、再オファーを獲得。",
            ],
          },
          {
            title: "ソフトウェアエンジニアインターン - Emath Inc.（2022年7月〜8月）",
            bullets: [
              "声のトーンをもとにAIがリアルタイムで感情を解析するAPIをVRアバターの3DCGソフトと連携させ、カメラ不要の表情レンダリングシステムを提案・開発。社内テストで93%の精度を達成。",
              "顔認識ハードウェアへの依存をなくすことで4,300人以上のユーザーのアクセシビリティを向上させ、VR環境構築コストを1人あたり平均300ポンド削減。",
            ],
          },
          {
            title: "機械学習リサーチインターン - 富士通（2022年6月〜7月）",
            bullets: [
              "富士通研究所の所長のもとで、量子コンピューティングの出力に対するAI推論システムの応用を研究。確率的グラフにおける因果連鎖の解析を実施。",
            ],
          },
          {
            title: "個人株式トレーダー - Astroid Inc.（2019年〜現在）",
            bullets: [
              "半導体、日本のサブカルチャー、交通インフラ関連銘柄を中心に、1年間で日本株ポートフォリオを48.7%成長させる。",
              "市場センチメント分析と自動売買執行のためのPythonスクリプトを開発。",
            ],
          },
        ],
      },
      leadership: {
        heading: "リーダーシップ経験",
        items: [
          {
            title: "会長・設立者 - Warwick Vocaloid Society（2023年11月〜2025年2月）",
            bullets: [
              "英国初のボーカロイドサークルを設立し、大学および学生自治会と連携して300人以上のメンバーを獲得。",
              "音声合成ワークショップを企画・運営し、メンバーが自身の声を録音してオリジナルのボーカロイド風音声バンクに変換できる機会を提供。",
              "SNS（小紅書/Xiaohongshu）でのイベントハイライトをバズらせ、フォロワー2,000人以上・いいね11,300件以上を獲得。NHK（日本のBBCに相当する国営放送）にも取り上げられる。",
            ],
          },
          {
            title: "CTO・共同設立者 - Muzartt（MIT LaunchX経由、2020年6月〜2023年10月）",
            bullets: [
              "認知症患者向けのアート・音楽セラピーアプリ「Muzartt」を開発し、入居者180人以上を抱える介護施設に導入。",
              "ハーバード・ビジネス・スクールのメンターや臨床専門家と週次のアジャイルフィードバックループを回しながら、技術開発を主導。",
              "投資家へのピッチを行い、パイロットプログラム展開のための初期資金を獲得。",
            ],
          },
          {
            title: "会長・設立者・技術リーダー - KIST Information Technology（2019年9月〜2023年6月）",
            bullets: [
              "学校創立27年の歴史の中で最大規模となる学生クラブを設立・運営し、全校生徒の25%以上が参加。",
              "Pythonによる機械学習やRubyによるWeb開発など、オリジナルの技術講座を30以上設計・指導。",
              "50人以上の生徒にプログラミングを指導し、15人以上をトップクラスのコンピューターサイエンス学科の合格へと導く。",
            ],
          },
        ],
      },
    },
    portfolio: { heading: "作品集" },
    contact: {
      heading: "お問い合わせ",
      subheading:
        "ソフトウェア、ボーカロイド、株式トレードについてなど、お気軽にご連絡ください。",
      email: "メール",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "履歴書をダウンロード (PDF)",
    },
  },
};
