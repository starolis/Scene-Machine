import { useState, useRef } from 'react';
import LandingPage from './LandingPage';
import InputStep from './steps/InputStep';
import LearnStep from './steps/LearnStep';
import PracticeStep from './steps/PracticeStep';
import FeedbackStep from './steps/FeedbackStep';
import { generateVividExample, checkUserRewrite } from './services/api';

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [currentStep, setCurrentStep] = useState('input');
  const [originalText, setOriginalText] = useState('');
  const [aiExample, setAiExample] = useState(null);
  const [userRewrite, setUserRewrite] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [error, setError] = useState(null);
  const pendingRef = useRef(false);

  const handleGenerate = async () => {
    if (!originalText.trim() || pendingRef.current) return;
    pendingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateVividExample(originalText);
      setAiExample(result);
      setCurrentStep('learn');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    pendingRef.current = false;
  };

  const handleCheck = async () => {
    if (!userRewrite.trim() || userRewrite.trim().length < 50 || pendingRef.current) return;
    pendingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await checkUserRewrite(
        originalText,
        aiExample.vividText,
        userRewrite
      );
      setFeedback(result);
      setCurrentStep('feedback');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    pendingRef.current = false;
  };

  const startOver = () => {
    setCurrentStep('input');
    setOriginalText('');
    setAiExample(null);
    setUserRewrite('');
    setFeedback(null);
    setError(null);
  };

  const tryAgain = () => {
    setUserRewrite('');
    setFeedback(null);
    setError(null);
    setCurrentStep('practice');
  };

  if (!showApp) {
    return <LandingPage onStart={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
      {error && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">😕</span>
              <p className="text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white transition-colors text-xl px-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {currentStep === 'input' && (
        <InputStep
          originalText={originalText}
          onOriginalTextChange={setOriginalText}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      )}
      {currentStep === 'learn' && (
        <LearnStep
          originalText={originalText}
          aiExample={aiExample}
          showLegend={showLegend}
          onToggleLegend={() => setShowLegend(!showLegend)}
          onNext={() => setCurrentStep('practice')}
          onBack={() => setCurrentStep('input')}
        />
      )}
      {currentStep === 'practice' && (
        <PracticeStep
          aiExample={aiExample}
          userRewrite={userRewrite}
          onUserRewriteChange={setUserRewrite}
          onCheck={handleCheck}
          onBack={() => setCurrentStep('learn')}
          isLoading={isLoading}
        />
      )}
      {currentStep === 'feedback' && (
        <FeedbackStep
          feedback={feedback}
          onTryAgain={tryAgain}
          onStartOver={startOver}
        />
      )}
    </div>
  );
}
