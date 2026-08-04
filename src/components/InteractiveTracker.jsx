'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { monthMilestones, prerequisiteItems } from '../data/docsData';

export function InteractiveTracker() {
  const [completedMonths, setCompletedMonths] = useState([]);
  const [completedPrereqs, setCompletedPrereqs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedMonths = localStorage.getItem('peritia_completed_months');
    const savedPrereqs = localStorage.getItem('peritia_completed_prereqs');
    if (savedMonths) setCompletedMonths(JSON.parse(savedMonths));
    if (savedPrereqs) setCompletedPrereqs(JSON.parse(savedPrereqs));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('peritia_completed_months', JSON.stringify(completedMonths));
    }
  }, [completedMonths, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('peritia_completed_prereqs', JSON.stringify(completedPrereqs));
    }
  }, [completedPrereqs, isLoaded]);

  const toggleMonth = (id) => {
    setCompletedMonths(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const togglePrereq = (id) => {
    setCompletedPrereqs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const monthProgress = Math.round((completedMonths.length / monthMilestones.length) * 100);
  const prereqProgress = Math.round((completedPrereqs.length / prerequisiteItems.length) * 100);

  return (
    <div className="tracker-container">
      {/* Header Dashboard Banner */}
      <div className="progress-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Zap size={12} /> Live Engineering Telemetry
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Bootcamp & Readiness Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Track your 12-month PeritiaOS engineering milestones and prerequisite skills.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '12px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {monthProgress}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Bootcamp
              </div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '12px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-violet)' }}>
                {prereqProgress}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Readiness
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                12-Month OS Milestones ({completedMonths.length}/{monthMilestones.length})
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{monthProgress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${monthProgress}%` }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                Prerequisite Skills Baseline ({completedPrereqs.length}/{prerequisiteItems.length})
              </span>
              <span style={{ color: 'var(--accent-violet)', fontWeight: 700 }}>{prereqProgress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${prereqProgress}%`, background: 'linear-gradient(90deg, var(--accent-violet), var(--accent-emerald))' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Milestones Section */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} />
          12-Month Engineering Milestones
        </h2>

        <div className="months-grid">
          {monthMilestones.map((m) => {
            const isDone = completedMonths.includes(m.id);
            return (
              <div
                key={m.id}
                className={`glass-card month-card ${isDone ? 'completed' : ''}`}
                onClick={() => toggleMonth(m.id)}
                style={{
                  borderColor: isDone ? 'rgba(16, 185, 129, 0.5)' : undefined,
                  background: isDone ? 'rgba(16, 185, 129, 0.08)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div className="checkbox-custom" style={{
                    marginTop: '2px',
                    borderColor: isDone ? 'var(--accent-emerald)' : undefined,
                    background: isDone ? 'var(--accent-emerald)' : undefined,
                    color: isDone ? '#fff' : undefined,
                  }}>
                    {isDone && <CheckCircle2 size={16} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isDone ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                        {m.title}
                      </span>
                      {isDone && (
                        <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                          DONE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {m.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prerequisites Checklist Section */}
      <div style={{ marginTop: '36px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-violet)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} />
          Prerequisite Skills Readiness Checklist
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          {prerequisiteItems.map((p) => {
            const isDone = completedPrereqs.includes(p.id);
            return (
              <div
                key={p.id}
                className={`glass-card ${isDone ? 'completed' : ''}`}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: isDone ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                  background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(26, 35, 51, 0.6)'
                }}
                onClick={() => togglePrereq(p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                    {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isDone ? 600 : 400 }}>
                    {p.label}
                  </div>
                </div>
                {isDone && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Verified
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
