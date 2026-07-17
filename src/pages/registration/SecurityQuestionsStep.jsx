import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { SecurityQuestionField } from '../../components/registration/SecurityQuestionField';
import { SECURITY_QUESTIONS } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';
import { useTranslation, Trans } from 'react-i18next';

export default function SecurityQuestionsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { submitQuestions } = useRegistrationStore();
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  const params = new URLSearchParams(window.location.search);
  const isMepormFlow = params.get('type') === 'meporm';
  const lang = params.get('lang') || localStorage.getItem('lang') || 'la';

  const canProceed = data.securityAnswers.every((answer) => answer.trim()) && !submitting;

  const handleNext = async () => {
    setSubmitting(true);
    const success = await submitQuestions(data.securityAnswers);
    setSubmitting(false);
    if (success) {
      if (isMepormFlow) {
        navigate(`/kyc/meporm?lang=${lang}`);
      } else {
        navigate(`/kyc?lang=${lang}`);
      }
    }
  };

  const updateAnswer = (index, value) => {
    const next = [...data.securityAnswers];
    next[index] = value;
    updateData({ securityAnswers: next });
  };

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>
        <div className="flex justify-end px-4 pt-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(isMepormFlow ? '/kyc' : '/confirm-pin')}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6">
          <h1 className="text-center text-xl font-bold text-gray-900">
            <Trans>Set Up Security Question</Trans>
          </h1>
          <div className="mx-auto mt-3 h-px w-full bg-gray-200" />
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            <Trans>Your selected question and answers will be used to verify your identity and confirm transactions</Trans>
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
          {SECURITY_QUESTIONS.map((question, index) => (
            <SecurityQuestionField
              key={question}
              number={index + 1}
              question={t(question)}
              value={data.securityAnswers[index]}
              onChange={(value) => updateAnswer(index, value)}
            />
          ))}
        </div>

        <StepFooter
          onBack={() => navigate(isMepormFlow ? '/kyc' : '/confirm-pin')}
          onNext={handleNext}
          nextDisabled={!canProceed}
          nextLabel={submitting ? t("Saving...") : t("Next")}
        />
      </PageContainer>
    </div>
  );
}
