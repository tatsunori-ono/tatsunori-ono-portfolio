import React, { useState, useEffect } from "react";
import AstroidFieldWithConsent from "./AstroidFieldWithConsent";

export default function PortfolioSite() {
  const [section, setSection] = useState("intro");

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-sans"
      style={{ fontFamily: "Futura, ui-sans-serif, sans-serif" }}
    >
      <AstroidFieldWithConsent />

      {/* Nav */}
      <nav className="fixed top-4 right-8 z-30 flex gap-4 text-sm md:text-base">
        {["intro", "experience", "portfolio"].map((id) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={
              "px-3 py-1 rounded-md border transition-all duration-200 capitalize " +
              (section === id
                ? "bg-black text-white border-black"
                : "bg-white/70 text-black border-black/20 hover:bg-black/90 hover:text-white")
            }
          >
            {id}
          </button>
        ))}
      </nav>

      {/* Card container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[90%] max-w-5xl bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl pointer-events-auto overflow-y-auto max-h-[80vh]">
          {section === "intro" && <Intro />}
          {section === "experience" && <Experience />}
          {section === "portfolio" && <Portfolio />}
        </div>
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Nice to meet you, I am Tatsunori Ono.</h2>
      <p>
        I am a Computer Science student at the University of Warwick, passionate
        about software engineering and web development, as well as financial technology (as I am a stock trader). I love
        thinking about complex ideas and solving problems in real life using the power of computers and mathematics.
      </p>
      <p>
        I also love all things Vocaloid and creating multimedia. Turning creative ideas into interactive experiences
        is the part I enjoy (as you can tell from the astroids you see swirling behind this text).
      </p>
    </section>
  );
}

function Experience() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Experience</h2>
      <ul className="space-y-4">
        <li>
          <h3 className="font-semibold">
            Web Development Intern - Crypton Future Media Inc. (Aug 2025 &ndash; Sep&nbsp;2025)
          </h3>
          <p className="text-sm leading-relaxed">
            • Received an offer for back-end web development intern at the company (famously known for developing Hatsune Miku), and will contribute to their digital music e-commerce system, which manages 200,000+ audio products in the database.
          </p>
        </li>
        <li>
          <h3 className="font-semibold">
            Software Engineer Intern - Emath Inc. (Jul 2022 &ndash; Aug 2022)
          </h3>
          <p className="text-sm leading-relaxed">
            • Proposed and built a camera-free facial expression rendering system with 93% accuracy in internal tests, by linking API of AI real-time emotion analysis based on voice tone to VR avatars on 3D computer graphics software.<br />
            • Innovated reliance on facial tracking hardware and increased accessibility for 4,300+ users, reducing VR setup costs by £300 per user on average.
          </p>
        </li>
        <li>
          <h3 className="font-semibold">Machine Learning Research Intern - Fujitsu Ltd. (Jun 2022 &ndash; Jul 2022)</h3>
          <p className="text-sm leading-relaxed">
            • Researched applications of AI deductive reasoning systems on quantum computing output with the head of Fujitsu Research by analysing causal chains in probabilistic graphs.
          </p>
        </li>
        <li>
          <h3 className="font-semibold">Independent Stock Trader - Astroid Inc. (2019 &ndash; Present)</h3>
          <p className="text-sm leading-relaxed">
            • Grew Japanese stock portfolio by 48.7% within a year, focusing on semiconductors, Japanese subculture, and transport infrastructure sectors.<br />
            • Developed Python scripts for market-sentiment analysis and automated trade execution.
          </p>
        </li>
      </ul>
    </section>
  );
}

function Portfolio() {
  const portfolio = [
    {
      name: "WVS Official Website (Laravel, React, MySQL)",
      link: "https://vocaloidsoc.co.uk/about",
      imgs: [
        "/thumbs/vocasoc-website.png",
        "/thumbs/vocasoc-website-2.png",
      ],
    },
    {
      name: "Specialita (Ruby, JavaScript, SQLite)",
      link: "http://specialita.org/",
      imgs: ["/thumbs/specialita.png", "/thumbs/specialita-2.png"],
    },
    {
      name: "Resolution Theorem Prover (Prolog)",
      link: "",
      imgs: ["/thumbs/logic.png", "/thumbs/logic-2.png"],
    },
    {
      name: "Intrusion Detection System (C)",
      link: "",
      imgs: ["/thumbs/os.png", "/thumbs/os-2.png"],
    },
    {
      name: "Interactive Movie Database System (Java)",
      link: "",
      imgs: ["/thumbs/moviedb.jpeg", "/thumbs/moviedb-2.png"],
    },
    { 
      name: "Snake Game on 3D LED Cube (C)", 
      link: "https://github.com/Tatsunori-Ono/LEDProject/tree/main", 
      imgs: ["/thumbs/architecture.png", "/thumbs/architecture-2.png"] 
    },
    { 
      name: "Ticket Selling Website (Flask, PostgreSQL)", 
      link: "", 
      imgs: ["/thumbs/webdev.png", "/thumbs/webdev-2.png"] 
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Portfolio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {portfolio.map((p) => (
          <ProjectCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
}

/* ----------- image slideshow ----------- */
function ProjectCard({ name, imgs, link }) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  // auto‑cycle every 3 s unless hovering
  useEffect(() => {
    if (hover) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % imgs.length),
      3000
    );
    return () => clearInterval(id);
  }, [hover, imgs.length]);

  // if no link set, render a <div> instead of <a>
  const Wrapper = link ? "a" : "div";
  const wrapperProps = link
    ? {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={
        "group block rounded-xl overflow-hidden shadow-lg transition-shadow duration-200 " +
        (link ? "hover:shadow-xl cursor-pointer" : "")
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={imgs[index]}
        alt={`${name} screenshot ${index + 1}`}
        className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="p-3 bg-white/90 backdrop-blur-sm">
        <p className="text-center font-medium truncate" title={name}>
          {name}
        </p>
      </div>
    </Wrapper>
  );
}
