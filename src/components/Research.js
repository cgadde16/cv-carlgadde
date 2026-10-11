import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import "./Research.css";
import { externalLinkComponents } from "./markdownComponents";

export default function Research() {
  const { t } = useTranslation();
  const items = t("research.items", { returnObjects: true });

  return (
    <section className="research-section">
      <h1 className="section-headline">{t("research.title")}</h1>

      <ul className="research-list">
        {(Array.isArray(items) ? items : []).map((item) => (
          <li key={item.id} className="research-item">
            <div className="research-meta">
              <span className={`research-type ${item.kind}`}>{item.type}</span>
              <span className="research-date">{item.date}</span>
            </div>

            <h2 className="research-title">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h2>

            <div className="research-lines">
              {(item.lines || []).map((line, index) => (
                <ReactMarkdown key={index} components={externalLinkComponents}>
                  {line}
                </ReactMarkdown>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
