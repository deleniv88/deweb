"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import Header from "./Header";
import Behaviors from "./Behaviors";
import { featureIcons, ArrowUpRight, CheckCircle, Lines } from "./Icons";

type Props = {
  query: string;
  variables: Record<string, unknown>;
  data: any;
};

/* useTina: на звичайному сайті просто віддає дані,
   а в /admin оновлює сторінку наживо, поки ти друкуєш у бічній панелі.
   data-tina-field — робить елемент клікабельним в адмінці (відкриває потрібне поле). */
export default function HomeClient(props: Props) {
  const { data } = useTina(props);
  const home = data.home;
  const { hero, work, services, features } = home;

  const cases = (work?.cases || []).filter(Boolean);
  const svcItems = (services?.items || []).filter(Boolean);
  const featItems = (features?.items || []).filter(Boolean);
  const depsKey = `${cases.length}-${svcItems.length}-${featItems.length}`;

  return (
    <>
      <Header />

      {/* ================= HERO ================= */}
      <section className="hero" aria-label="Deweb studio">
        <span className="hero__word" aria-hidden="true">DEWEB</span>

        <figure className="hero__photo" data-tina-field={tinaField(hero, "photo")}>
          {hero?.photo && (
            <img src={hero.photo} alt={hero?.photoAlt || ""} width={1684} height={1876} fetchPriority="high" decoding="async" />
          )}
        </figure>

        <p className="hero__name" data-tina-field={tinaField(hero, "name")}>{hero?.name}</p>

        <div className="hero__copy">
          <h1 className="hero__title">
            <span data-tina-field={tinaField(hero, "titleLine1")}>{hero?.titleLine1}</span>{" "}
            <span data-tina-field={tinaField(hero, "titleLine2")}>{hero?.titleLine2}</span>
          </h1>
          <p className="hero__lead" data-tina-field={tinaField(hero, "lead")}>{hero?.lead}</p>
        </div>

        <a className="cta" href={hero?.ctaHref || "#contact"} data-tina-field={tinaField(hero, "ctaLabel")}>
          {hero?.ctaLabel}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 7 7 17M7 17V9M7 17h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>

        <ul className="stats">
          {(hero?.stats || []).filter(Boolean).map((s: any, i: number) => (
            <li className="stat" key={i} data-tina-field={tinaField(s)}>
              <span className="stat__num">{s.value}</span>
              <span className="stat__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= RECENT WORK ================= */}
      <section className="work" id="projects" aria-labelledby="work-title">
        <div className="work__head">
          <div className="work__intro">
            <div className="work__titles">
              <h2 className="work__title" id="work-title">
                <em data-tina-field={tinaField(work, "titleAccent")}>{work?.titleAccent}</em>{" "}
                <span data-tina-field={tinaField(work, "titleRest")}>{work?.titleRest}</span>
              </h2>
              <p className="work__lead" data-tina-field={tinaField(work, "lead")}><Lines text={work?.lead} /></p>
            </div>
            <a className="btn-soft" href={work?.buttonHref || "#projects"} data-tina-field={tinaField(work, "buttonLabel")}>
              <span className="u-link">{work?.buttonLabel}</span>
              <ArrowUpRight />
            </a>
          </div>

          <div className="work__controls">
            <p className="sr-only" aria-live="polite" data-work-live></p>
            <div className="work__arrows">
              <button className="arrow-btn" type="button" data-work-prev aria-label="Previous project">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4M4 10l5.5-5.5M4 10l5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="arrow-btn" type="button" data-work-next aria-label="Next project">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M16 10l-5.5-5.5M16 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>

        <ul className="work__track" data-work-track aria-label="Projects" aria-roledescription="carousel" tabIndex={0} key={depsKey}>
          {cases.map((c: any, i: number) => {
            const href = c.url || "#";
            return (
              <li className="work__card" key={i}>
                <a className="work__media" href={href} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" draggable={false} data-tina-field={tinaField(c, "image")}>
                  {c.image && <img src={c.image} alt="" width={2690} height={1512} loading="lazy" decoding="async" draggable={false} />}
                </a>
                <div className="work__meta">
                  <div className="work__info">
                    <p className="work__cat" data-tina-field={tinaField(c, "category")}>{c.category}</p>
                    <h3 className="work__name" data-tina-field={tinaField(c, "name")}>{c.name}</h3>
                    <p className="work__desc" data-tina-field={tinaField(c, "description")}>{c.description}</p>
                  </div>
                  <a className="work__visit" href={href} target="_blank" rel="noopener" data-tina-field={tinaField(c, "url")}>
                    <span className="u-link">View website</span>
                    <ArrowUpRight />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="drag-cursor" aria-hidden="true">View website</div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="svc" id="services" aria-labelledby="svc-title">
        <div className="svc__inner">
          <div className="svc__pin">
            <div className="svc__head">
              <h2 className="svc__title" id="svc-title">
                <em data-tina-field={tinaField(services, "titleAccent")}>{services?.titleAccent}</em>{" "}
                <span data-tina-field={tinaField(services, "titleRest")}>{services?.titleRest}</span>
              </h2>
              <p className="svc__lead" data-tina-field={tinaField(services, "lead")}>{services?.lead}</p>
              <p className="svc__note" data-tina-field={tinaField(services, "note")}>{services?.note}</p>
            </div>
          </div>

          <ul className="svc__stack" data-svc-stack key={depsKey}>
            {svcItems.map((s: any, i: number) => (
              <li className="svc-card" key={i} style={{ ["--i" as any]: i }}>
                <div className="svc-card__top">
                  <span className="svc-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="svc-card__dot" aria-hidden="true"></span>
                  <span className="svc-card__type" data-tina-field={tinaField(s, "type")}>{s.type}</span>
                  <span className="svc-card__dot" aria-hidden="true"></span>
                  <span className="svc-card__time" data-tina-field={tinaField(s, "timeline")}>{s.timeline}</span>
                </div>
                <div className="svc-card__body">
                  <div className="svc-card__text">
                    <div className="svc-card__intro">
                      <h3 className="svc-card__name" data-tina-field={tinaField(s, "name")}>{s.name}</h3>
                      <p className="svc-card__desc" data-tina-field={tinaField(s, "description")}>{s.description}</p>
                    </div>
                    <ul className="svc-card__list" data-tina-field={tinaField(s, "features")}>
                      {(s.features || []).filter(Boolean).map((f: string, k: number) => (
                        <li key={k}><CheckCircle /><span>{f}</span></li>
                      ))}
                    </ul>
                    <a className="btn-primary" href={s.buttonHref || "#contact"} data-tina-field={tinaField(s, "buttonLabel")}>
                      <span>{s.buttonLabel}</span>
                      <ArrowUpRight />
                    </a>
                  </div>
                  <div className="svc-card__media" data-tina-field={tinaField(s, "image")}>
                    {s.image && <img src={s.image} alt={`${s.name} example`} width={748} height={421} loading="lazy" decoding="async" />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= EVERY SITE INCLUDES ================= */}
      <section className="feat" id="features" aria-labelledby="feat-title">
        <div className="feat__panel">
          <div className="feat__head">
            <h2 className="feat__title" id="feat-title">
              <em data-tina-field={tinaField(features, "titleAccent")}>{features?.titleAccent}</em>{" "}
              <span data-tina-field={tinaField(features, "titleRest")}>{features?.titleRest}</span>
            </h2>
            <p className="feat__lead" data-tina-field={tinaField(features, "lead")}>{features?.lead}</p>
          </div>

          <div className="feat__body" data-feat key={depsKey}>
            <ol className="feat__list" role="tablist" aria-orientation="vertical" aria-label="What every site includes">
              {featItems.map((f: any, i: number) => (
                <li className="feat__li" role="presentation" key={i}>
                  <button
                    className={`feat__item${i === 0 ? " is-active" : ""}`}
                    type="button"
                    role="tab"
                    id={`feat-tab-${i}`}
                    aria-controls={`feat-panel-${i}`}
                    aria-selected={i === 0}
                    tabIndex={i === 0 ? 0 : -1}
                  >
                    <span className="feat__icon" aria-hidden="true" data-tina-field={tinaField(f, "icon")}>{featureIcons[f.icon] || featureIcons.fast}</span>
                    <span className="feat__text">
                      <span className="feat__name" data-tina-field={tinaField(f, "name")}>{f.name}</span>
                      <span className="feat__desc"><span data-tina-field={tinaField(f, "description")}>{f.description}</span></span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="feat__stage">
              {featItems.map((f: any, i: number) => (
                <div
                  className={`feat__panelimg${i === 0 ? " is-active" : ""}`}
                  role="tabpanel"
                  id={`feat-panel-${i}`}
                  aria-labelledby={`feat-tab-${i}`}
                  hidden={i !== 0}
                  key={i}
                  data-tina-field={tinaField(f, "image")}
                >
                  {f.image ? (
                    <img src={f.image} alt={f.imageAlt || f.name || ""} width={1042} height={521} loading="lazy" decoding="async" />
                  ) : (
                    <div className="feat__ph">
                      {featureIcons[f.icon] || featureIcons.fast}
                      <span>{f.name}</span>
                      <small>Preview coming soon</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Behaviors depsKey={depsKey} page="home" />
    </>
  );
}
