import React, { useState } from 'react';
import AIOpportunityCard from './AIOpportunityCard';
import InvestmentCard from './InvestmentCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import './DecisionDeck.css';

const DecisionDeck = ({ onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (action) => setSelected(action);

  const handleSubmit = async () => {
    if (selected && !submitting) {
      setSubmitting(true);
      try {
        await onSubmit(selected);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelected(null);
        }, 2000);
      } catch (error) {
        console.error('Failed to submit decision:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="decision-deck">
      <h3 className="decision-deck__title">Make Your Decision</h3>
      <div className="decision-deck__cards">
        <AIOpportunityCard 
          selected={selected?.type === 'aiOpportunity'} 
          onSelect={handleSelect}
          disabled={submitting || submitted}
        />
        <InvestmentCard 
          selected={selected?.type === 'investment'} 
          onSelect={handleSelect}
          disabled={submitting || submitted}
        />
      </div>
      <div className="decision-deck__actions">
        <button 
          type="button" 
          onClick={handleSubmit} 
          disabled={!selected || submitting || submitted}
          className={`decision-deck__submit ${submitted ? 'decision-deck__submit--success' : ''}`}
        >
          {submitting && <LoadingSpinner size="sm" />}
          {submitted ? '✓ Decision Submitted' : 'Submit Decision'}
        </button>
        {selected && !submitted && (
          <p className="decision-deck__selection">
            Selected: {selected.type === 'aiOpportunity' ? 'AI Opportunity' : 'Investment'}
          </p>
        )}
      </div>
    </div>
  );
};

export default DecisionDeck;
