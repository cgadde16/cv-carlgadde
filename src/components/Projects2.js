import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import "./Projects2.css";
import "./shared-styles.css";

export default function ProjectsSection() {
  const { t } = useTranslation();
  const projects = t("projects.items", { returnObjects: true }) || [];
  const [expandedProject, setExpandedProject] = useState(null);

  const toggleProject = (id) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const contentRefs = useRef({});

  return (
    <div className="projects-section">
      <h1 className="section-headline">{t("projects.title")}</h1>

      {projects.map((project, index) => {
        const isExpanded = expandedProject === project.id;
        
        return (
          <div key={project.id} className="project-wrapper">
            <button
              className={`project-header color-${(index % 5) + 1}`}
              onClick={() => toggleProject(project.id)}
            >
              <div className="project-header-text">
                <h2 className="project-title-text">{project.title}</h2>
                {project.subtitle && (
                  <p className="project-subtitle">{project.subtitle}</p>
                )}
              </div>
              {project.thumbnail && (
                <img 
                  src={process.env.PUBLIC_URL + project.thumbnail} 
                  alt={project.title}
                  className="project-thumbnail"
                />
              )}
            </button>

            <div
              className="project-content"
              style={{
                maxHeight: isExpanded 
                  ? `${contentRefs.current[project.id]?.scrollHeight || 2000}px` 
                  : '0px',
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? '0.75rem' : '0'
              }}
            >
              <div 
                ref={(el) => (contentRefs.current[project.id] = el)}
                className="project-content-inner"
              >
                <div className="project-description">
                  <ReactMarkdown 
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      )
                    }}
                  >
                    {project.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}