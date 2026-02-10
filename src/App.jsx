import { useState } from 'react';
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

  const handleGenerate = async () => {
    if (!originalText.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateVividExample(originalText);
      setAiExample(result);
      setCurrentStep('learn');
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  const handleCheck = async () => {
    if (!userRewrite.trim()) {
      alert('Write your own version first!');
      return;
    }
    if (userRewrite.trim().length < 50) {
      alert('Your rewrite is too short! Try adding more details.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await checkUserRewrite(
        originalText,
        aiExample.vividText,
        userRewrite
      );
      setFeedback(result);
      setCurrentStep('feedback');
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  const startOver = () => {
    setCurrentStep('input');
    setOriginalText('');
    setAiExample(null);
    setUserRewrite('');
    setFeedback(null);
  };

  const tryAgain = () => {
    setUserRewrite('');
    setFeedback(null);
    setCurrentStep('practice');
  };

  if (!showApp) {
    return <LandingPage onStart={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6">
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
