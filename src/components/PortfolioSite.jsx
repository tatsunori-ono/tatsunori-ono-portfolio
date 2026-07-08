import React, { useState, useEffect } from "react";
import AstroidFieldWithConsent from "./AstroidFieldWithConsent";
import { content } from "../i18n";

export default function PortfolioSite() {
  const [section, setSection] = useState("intro");
  const [lang, setLang] = useState("en");
  const t = content[lang];

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-sans"
      style={{ fontFamily: "Futura, ui-sans-serif, sans-serif" }}
    >
      <AstroidFieldWithConsent />

      {/* Nav */}
      <nav className="fixed top-4 right-8 z-30 flex items-center gap-4 text-sm md:text-base">
        {["intro", "experience", "portfolio"].map((id) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={
              "px-3 py-1 rounded-md border transition-all duration-200 " +
              (section === id
                ? "bg-black text-white border-black"
                : "bg-white/70 text-black border-black/20 hover:bg-black/90 hover:text-white")
            }
          >
            {t.nav[id]}
          </button>
        ))}

        {/* Language toggle */}
        <div className="flex rounded-md border border-black/20 overflow-hidden">
          {["en", "ja"].map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={
                "px-3 py-1 text-xs md:text-sm transition-all duration-200 " +
                (lang === code
                  ? "bg-black text-white"
                  : "bg-white/70 text-black hover:bg-black/90 hover:text-white")
              }
            >
              {code === "en" ? "EN" : "日本語"}
            </button>
          ))}
        </div>
      </nav>

      {/* Card container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[90%] max-w-5xl bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl pointer-events-auto overflow-y-auto max-h-[80vh]">
          {section === "intro" && <Intro t={t} />}
          {section === "experience" && <Experience t={t} />}
          {section === "portfolio" && <Portfolio t={t} />}
        </div>
      </div>
    </div>
  );
}

function Intro({ t }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src="/me.jpg"
          alt="Tatsunori Ono"
          className="w-48 h-48 sm:w-60 sm:h-60 rounded-full object-cover shadow-lg shrink-0"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t.intro.title}</h2>
          {t.intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ t }) {
  const { heading, work, leadership } = t.experience;
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">{heading}</h2>

      <ExperienceGroup heading={work.heading} items={work.items} />
      <ExperienceGroup heading={leadership.heading} items={leadership.items} />
    </section>
  );
}

function ExperienceGroup({ heading, items }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">{heading}</h3>
      <ul className="space-y-4 ml-4">
        {items.map((item) => (
          <li key={item.title}>
            <h4 className="font-semibold">{item.title}</h4>
            <p className="text-sm leading-relaxed">
              {item.bullets.map((b, i) => (
                <React.Fragment key={i}>
                  • {b}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Portfolio({ t }) {
  const portfolio = [
    {
      name: "GiTrip - Git-Inspired Trip Planner (Node.js, Express, SQLite)",
      link: "https://gitrip.fly.dev",
      imgs: [
        "/thumbs/gitrip.png",
        "/thumbs/gitrip-2.png",
        "/thumbs/gitrip-3.png",
        "/thumbs/gitrip-4.png",
        "/thumbs/gitrip-5.png",
      ],
    },
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
      link: "",
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
      <h2 className="text-2xl font-semibold">{t.portfolio.heading}</h2>
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

  // auto-cycle every 3 sec unless hovering
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
