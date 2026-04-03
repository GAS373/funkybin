"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { districtMap, districtOrder, districtScenes } from "@/lib/game/data";
import { seoFaqs, seoHighlights } from "@/lib/seo";
import { defaultProgress, loadProgress, resetProgress, saveProgress } from "@/lib/game/storage";
import type { DistrictId, GameProgress } from "@/lib/game/types";

const cityNodePositions: Record<DistrictId, { top: string; left: string }> = {
  docs: { top: "40%", left: "20%" },
  debug: { top: "24%", left: "38%" },
  sql: { top: "44%", left: "64%" },
  regex: { top: "14%", left: "72%" },
  commit: { top: "56%", left: "84%" },
};

export function GameExperience() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const stored = loadProgress();
    setProgress(stored);
    setStarted(
      stored.completedDistricts.length > 0 ||
        stored.unlockedDistricts.length > 1 ||
        stored.selectedOptionByDistrict[districtOrder[0]] !== undefined
    );
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const currentScene = districtMap[progress.currentDistrict];
  const selectedOption = progress.selectedOptionByDistrict[currentScene.id];
  const selectedMeta = currentScene.validatorOptions.find((option) => option.id === selectedOption);
  const isCorrect = selectedOption === currentScene.correctOptionId;
  const allComplete = progress.completedDistricts.length === districtScenes.length;
  const progressRatio = (progress.completedDistricts.length / districtScenes.length) * 100;
  const currentIndex = districtOrder.indexOf(currentScene.id);
  const nextDistrictId = districtOrder[currentIndex + 1];
  const nextScene = nextDistrictId ? districtMap[nextDistrictId] : null;
  const currentThreatMeter = Array.from({ length: 5 }, (_, index) => index < currentScene.threatLevel);

  function startMission() {
    setStarted(true);
    jumpToDistrict(progress.currentDistrict);
  }

  function chooseDistrict(id: DistrictId) {
    if (!progress.unlockedDistricts.includes(id)) {
      return;
    }

    setStarted(true);

    setProgress((current) => ({
      ...current,
      currentDistrict: id,
    }));

    jumpToDistrict(id);
  }

  function evaluate(optionId: string) {
    setStarted(true);

    setProgress((current) => {
      const scene = districtMap[current.currentDistrict];
      const nextCompleted = current.completedDistricts.includes(scene.id)
        ? current.completedDistricts
        : optionId === scene.correctOptionId
          ? [...current.completedDistricts, scene.id]
          : current.completedDistricts;

      const currentIndex = districtOrder.indexOf(scene.id);
      const nextDistrict = districtOrder[currentIndex + 1];
      const nextUnlocked = nextDistrict && optionId === scene.correctOptionId && !current.unlockedDistricts.includes(nextDistrict)
        ? [...current.unlockedDistricts, nextDistrict]
        : current.unlockedDistricts;

      return {
        ...current,
        unlockedDistricts: nextUnlocked,
        completedDistricts: nextCompleted,
        selectedOptionByDistrict: {
          ...current.selectedOptionByDistrict,
          [scene.id]: optionId,
        },
      };
    });
  }

  function goNext() {
    const nextDistrict = districtOrder[currentIndex + 1];
    if (nextDistrict && progress.unlockedDistricts.includes(nextDistrict)) {
      chooseDistrict(nextDistrict);
    }
  }

  function restartCampaign() {
    resetProgress();
    setProgress(defaultProgress);
    setStarted(false);
    jumpToDistrict(districtOrder[0]);
  }

  const learnedSkills = useMemo(() => {
    return districtScenes
      .filter((scene) => progress.completedDistricts.includes(scene.id))
      .map((scene) => ({
        id: scene.id,
        title: scene.title,
        lesson: scene.lesson,
        accent: scene.accent,
      }));
  }, [progress.completedDistricts]);

  const cityStatusLabel = allComplete
    ? "City Core stable"
    : started
      ? `${districtScenes.length - progress.completedDistricts.length} unstable sectors left`
      : "Mission not started";

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="container">
          <div className="brand-row">
            <div className="brand">
              <div className="brand-mark">FB</div>
              <div className="brand-copy">
                <strong>funkybin.dev</strong>
                <span>Escape From Hallucination City</span>
              </div>
            </div>
          </div>

          <div className="hero-grid">
            <motion.div
              className="hero-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="eyebrow">Hallucination outbreak detected</div>
              <h1>
                <span className="hero-line">Restore the city.</span>
                <span className="hero-line hero-line-accent">Validate the machine.</span>
              </h1>
              <p className="lede">
                Escape From Hallucination City is a free AI hallucination game that teaches prompt
                validation across docs, debugging, SQL, regex, and commit workflows before bad answers
                reach production.
              </p>
              <div className="button-row">
                <button className="button-primary" onClick={startMission}>
                  {started ? "Continue Mission" : "Start Mission"}
                </button>
                <a className="button-secondary" href="#city-map">
                  View District Map
                </a>
              </div>
              <div className="status-grid">
                <div className="status-tile">
                  <strong>{progress.completedDistricts.length}/5</strong>
                  <span>districts stabilized</span>
                </div>
                <div className="status-tile">
                  <strong>{progress.unlockedDistricts.length}</strong>
                  <span>routes available</span>
                </div>
                <div className="status-tile">
                  <strong>{allComplete ? "100%" : `${Math.round(progressRatio)}%`}</strong>
                  <span>signal integrity</span>
                </div>
              </div>

              <div className="route-strip" aria-label="Campaign route">
                {districtScenes.map((scene, index) => {
                  const unlocked = progress.unlockedDistricts.includes(scene.id);
                  const completed = progress.completedDistricts.includes(scene.id);

                  return (
                    <button
                      key={scene.id}
                      className={clsx("route-stop", {
                        active: scene.id === currentScene.id,
                        completed,
                        locked: !unlocked,
                      })}
                      onClick={() => chooseDistrict(scene.id)}
                    >
                      <span className="route-index">0{index + 1}</span>
                      <strong>{scene.title}</strong>
                      <span>{completed ? "stabilized" : unlocked ? scene.difficulty : "locked"}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="city-blueprint"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            >
              <div className="city-view">
                <div className="city-label">
                  <div className="eyebrow">City Core // unstable</div>
                  <h2>Hallucination City</h2>
                  <p>
                    Each district teaches a different defense against convincing but wrong AI output.
                    Fix the signal. Unlock the route. Rewire trust.
                  </p>
                </div>
                <div className="hallucination-banner">
                  <strong>Threat Pattern</strong>
                  <p>
                    Confident answers. Missing assumptions. No examples. No proof. That is how Hallucination spreads.
                  </p>
                </div>
                <div className="city-status-panel">
                  <span>Core status</span>
                  <strong>{cityStatusLabel}</strong>
                  <p>Current route: {currentScene.title}</p>
                </div>
                <div className="city-network" aria-hidden="true">
                  {districtScenes.map((scene) => {
                    const unlocked = progress.unlockedDistricts.includes(scene.id);
                    const completed = progress.completedDistricts.includes(scene.id);

                    return (
                      <button
                        key={scene.id}
                        className={clsx("city-node", {
                          active: scene.id === currentScene.id,
                          completed,
                          locked: !unlocked,
                        })}
                        onClick={() => chooseDistrict(scene.id)}
                        style={{ top: cityNodePositions[scene.id].top, left: cityNodePositions[scene.id].left, borderColor: `${scene.accent}55` }}
                      >
                        <span className="city-node-dot" style={{ background: scene.accent, boxShadow: `0 0 20px ${scene.accent}` }} />
                        <div>
                          <strong>{scene.code}</strong>
                          <span>{scene.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="skyline" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section-tight" id="ai-validation-game">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">AI Validation Game</div>
              <h2 className="section-title">Learn how to catch AI hallucinations before they ship.</h2>
            </div>
            <p className="section-copy">
              This browser-based developer education game teaches prompt validation and AI output review through five practical districts that mirror real engineering work.
            </p>
          </div>

          <div className="seo-grid">
            {seoHighlights.map((item) => (
              <article className="seo-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="city-map">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">District Grid</div>
              <h2 className="section-title">Five systems. Five failure modes.</h2>
            </div>
            <p className="map-copy">
              The map is ordered as a guided campaign, but once unlocked each district can be replayed to sharpen a specific AI validation skill.
            </p>
          </div>

          <div className="map-grid">
            {districtScenes.map((scene) => {
              const unlocked = progress.unlockedDistricts.includes(scene.id);
              const completed = progress.completedDistricts.includes(scene.id);
              return (
                <button
                  key={scene.id}
                  className={clsx("district-card", {
                    active: scene.id === currentScene.id,
                    locked: !unlocked,
                  })}
                  onClick={() => chooseDistrict(scene.id)}
                  style={{ boxShadow: scene.id === currentScene.id ? `0 0 0 1px ${scene.accent}33, var(--shadow)` : undefined }}
                >
                  <div className="district-header">
                    <span className="district-code">{scene.code}</span>
                    <span className="district-status" style={{ color: scene.accent, border: `1px solid ${scene.accent}44` }}>
                      {completed ? "OK" : unlocked ? "IN" : "--"}
                    </span>
                  </div>
                  <h3>{scene.title}</h3>
                  <p>{scene.description}</p>
                  <span className="district-skill">
                    <span className="district-swatch" style={{ background: scene.accent, boxShadow: `0 0 16px ${scene.accent}` }} />
                    {scene.focus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="mission-panel">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Mission Console</div>
              <h2 className="section-title">{currentScene.title}</h2>
            </div>
            <p className="section-copy">{currentScene.subtitle}</p>
          </div>

          <div className="game-grid">
            <div className="panel panel-stack">
              <div>
                <div className="mission-kicker">Current objective</div>
                <h3 className="mission-title">{currentScene.rewardLabel}</h3>
              </div>

              <div className="intel-grid">
                <div className="intel-card">
                  <span>Difficulty</span>
                  <strong>{currentScene.difficulty}</strong>
                </div>
                <div className="intel-card">
                  <span>Threat</span>
                  <div className="threat-meter" aria-label={`Threat level ${currentScene.threatLevel} of 5`}>
                    {currentThreatMeter.map((active, index) => (
                      <span key={`${currentScene.id}-threat-${index}`} className={clsx("threat-bar", { active })} />
                    ))}
                  </div>
                </div>
                <div className="intel-card">
                  <span>Route reward</span>
                  <strong>{currentScene.rewardLabel}</strong>
                </div>
              </div>

              <div>
                <div className="panel-label">District brief</div>
                <p className="panel-copy">{currentScene.brief}</p>
              </div>

              <div>
                <div className="panel-label">Validation focus</div>
                <p className="panel-copy">{currentScene.focus}</p>
              </div>

              <div>
                <div className="panel-label">Why this district is dangerous</div>
                <p className="panel-copy">{currentScene.risk}</p>
              </div>

              <div className="checklist-panel">
                <div className="panel-label">Verification checklist</div>
                <ul className="checklist-list">
                  {currentScene.verifyChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-answer">
                <p>{currentScene.aiResponse}</p>
              </div>

              <div>
                <div className="panel-label">Campaign progress</div>
                <div className="progress-rail">
                  <div className="progress-fill" style={{ width: `${progressRatio}%` }} />
                </div>
              </div>
            </div>

            <div className="panel panel-stack">
              <div className="signal-banner">
                <span>Signal tip</span>
                <strong>{currentScene.signalTip}</strong>
              </div>

              <div>
                <div className="panel-label">Choose your validation move</div>
                <p className="panel-copy">
                  Do not fix the answer with instinct alone. Select the move that forces the model back into evidence, constraints, or concrete verification.
                </p>
              </div>

              <div className="tool-grid">
                {currentScene.validatorOptions.map((option) => (
                  <button
                    key={option.id}
                    className={clsx("tool-option", { active: selectedOption === option.id })}
                    onClick={() => evaluate(option.id)}
                  >
                    <div className="tool-option-meta">
                      <span>{option.id.replace(`${currentScene.id}-`, "").replace(/-/g, " ")}</span>
                    </div>
                    <strong>{option.label}</strong>
                    <span>{option.detail}</span>
                  </button>
                ))}
              </div>

              {nextScene ? (
                <div className="next-route-card" style={{ borderColor: `${nextScene.accent}33` }}>
                  <span>Next route</span>
                  <strong style={{ color: nextScene.accent }}>{nextScene.title}</strong>
                  <p>{nextScene.focus}</p>
                </div>
              ) : (
                <div className="next-route-card complete">
                  <span>Final state</span>
                  <strong>City core restored</strong>
                  <p>All five districts are stable. The only loop left is practice.</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {selectedMeta ? (
                  <motion.div
                    key={`${currentScene.id}-${selectedMeta.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={clsx("result-card", {
                      success: isCorrect,
                      fail: !isCorrect,
                    })}
                  >
                    <strong>{isCorrect ? "Signal Restored" : "Hallucination Still Active"}</strong>
                    <p>{currentScene.explanation}</p>
                    <div className="result-meta">
                      <div>
                        <span>Lesson</span>
                        <p>{currentScene.lesson}</p>
                      </div>
                      <div>
                        <span>Selected move</span>
                        <p>{selectedMeta.label}</p>
                      </div>
                      <div>
                        <span>Impact</span>
                        <p>{isCorrect ? currentScene.signalTip : currentScene.incorrectConsequence}</p>
                      </div>
                    </div>
                    <div className="button-row">
                      {isCorrect && !allComplete ? (
                        <button className="button-primary" onClick={goNext}>
                          Unlock Next District
                        </button>
                      ) : null}
                      {isCorrect && allComplete ? (
                        <a className="button-primary" href="#skills-summary">
                          View Final Summary
                        </a>
                      ) : null}
                      {!isCorrect ? (
                        <button className="button-secondary" onClick={() => evaluate(currentScene.correctOptionId)}>
                          Inspect Correct Move
                        </button>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills-summary">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Recovered Skills</div>
              <h2 className="section-title">What the city taught you</h2>
            </div>
            <p className="summary-copy">
              Progress is local, but the habits are portable: stronger prompts, sharper validation, fewer expensive mistakes.
            </p>
          </div>

          <div className="summary-grid">
            {(learnedSkills.length > 0 ? learnedSkills : districtScenes.slice(0, 3)).map((item) => (
              <div className="summary-card" key={item.id} style={{ borderColor: `${item.accent}33` }}>
                <strong style={{ color: item.accent }}>{item.title}</strong>
                <p>{item.lesson}</p>
              </div>
            ))}
          </div>

          <div className="campaign-summary-bar">
            <span>Unlocked districts: {progress.unlockedDistricts.length}</span>
            <span>Correct validations: {progress.completedDistricts.length}</span>
            <span>{allComplete ? "Ready for replay" : `Next target: ${nextScene?.title ?? "Summary Core"}`}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="footer-cta">
            <div>
              <div className="eyebrow">Replay Loop</div>
              <h3>Run the city again with better instincts.</h3>
              <p>
                The mission is cheap by design: no account, no backend, no waiting for an AI call. Just repeatable practice in spotting confident nonsense before it becomes production truth.
              </p>
            </div>
            <div className="button-row">
              <button className="button-primary" onClick={restartCampaign}>
                Reset Campaign
              </button>
              <a className="map-jump" href="#city-map">
                Jump To District Map
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">FAQ</div>
              <h2 className="section-title">Questions about AI hallucinations, prompt validation, and gameplay.</h2>
            </div>
            <p className="summary-copy">
              These answers are written for users searching for an AI validation game, prompt validation practice, and hands-on ways to learn safer AI usage.
            </p>
          </div>

          <div className="faq-grid">
            {seoFaqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function jumpToDistrict(id: DistrictId) {
  if (typeof window === "undefined") {
    return;
  }

  const target = id === districtOrder[0] ? "mission-panel" : "mission-panel";
  window.requestAnimationFrame(() => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}