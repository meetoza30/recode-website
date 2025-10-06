import React, { useState, useEffect } from 'react';
import StepCard from './StepCard';
import Loading from './loading';

const Roadmap = ({ company = "Nvidia" }) => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual endpoint
        const response = await fetch(`/api/roadmap?company=${company}`);
        const data = await response.json();
        
        if (data.success) {
          setRoadmapData(data.roadmapStructure);
          // Expand first step by default
          setExpandedSteps(new Set([0]));
        } else {
          setError('Failed to load roadmap');
        }
      } catch (err) {
        setError('Error fetching roadmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [company]);

  const toggleStep = (stepIndex) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepIndex)) {
      newExpanded.delete(stepIndex);
    } else {
      newExpanded.add(stepIndex);
    }
    setExpandedSteps(newExpanded);
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!roadmapData) return <div>No roadmap data available</div>;

  return (
    <div className="roadmap-container">
      <header className="roadmap-header">
        <h1>{company} Interview Preparation Roadmap</h1>
        <p>Complete step-by-step guide to ace your {company} interview</p>
      </header>

      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '25%' }}></div>
        </div>
        <div className="progress-stats">
          <span>2/8 steps completed</span>
          <span>25% complete</span>
        </div>
      </div>

      <div className="steps-container">
        {roadmapData.roadmap.map((step, index) => (
          <StepCard
            key={step.step}
            step={step}
            stepNumber={index + 1}
            isExpanded={expandedSteps.has(index)}
            onToggle={() => toggleStep(index)}
          />
        ))}
      </div>

      <div className="roadmap-actions">
        <button className="btn-primary">
          <i className="fas fa-download"></i>
          Save Roadmap
        </button>
        <button className="btn-secondary">
          <i className="fas fa-share"></i>
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default Roadmap;