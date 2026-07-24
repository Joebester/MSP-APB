import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { DocumentCaptureCard } from '../../components/registration/DocumentCaptureCard';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DOCUMENT_TYPES } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { DatePicker } from '../../components/ui/DatePicker';
import { useTranslation, Trans } from 'react-i18next';

export default function DocumentsUploadStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { t } = useTranslation();

  const docConfig = DOCUMENT_TYPES[data.documentType] || DOCUMENT_TYPES.passport;

  const requiredFieldsFilled = docConfig.fields
    .filter((field) => field.required)
    .every((field) => data[field.key]?.trim());

  const canProceed =
    requiredFieldsFilled &&
    data.docFile &&
    data.selfieFile &&
    data.videoFile;

  const handleDocTypeChange = (e) => {
    updateData({
      documentType: e.target.value,
      documentNumber: '',
      documentIssueDate: '',
      documentExpirationDate: '',
      documentPhotoTaken: false,
      selfiePhotoTaken: false,
      videoShortTaken: false,
      docFile: null,
      selfieFile: null,
      videoFile: null,
    });
  };

  const handleNext = () => {
    navigate('/review?type=kyc&lang=' + (localStorage.getItem('lang') || 'la'));
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader onBack={() => navigate('/kyc')} />
        <StepIndicator step={3} totalSteps={4} label={t("Documents Upload")} />
        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6 sm:px-6">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900"><Trans>Document details</Trans></h2>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                <Trans>Select type document</Trans><span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={data.documentType}
                  onChange={handleDocTypeChange}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20"
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {t(config.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>

            {docConfig.fields.map((field) =>
              field.type === 'date' ? (
                <DatePicker
                  key={field.key}
                  label={t(field.label)}
                  required={field.required}
                  value={data[field.key] || ''}
                  onChange={(val) => updateData({ [field.key]: val })}
                />
              ) : (
                <Input
                  key={field.key}
                  label={t(field.label)}
                  required={field.required}
                  placeholder={t(field.placeholder)}
                  value={data[field.key] || ''}
                  onChange={(e) => updateData({ [field.key]: e.target.value })}
                />
              )
            )}
          </section>

          <DocumentCaptureCard
            title={t("Upload document")}
            variant="document"
            completed={!!data.docFile}
            onCapture={(file) => updateData({ docFile: file, documentPhotoTaken: true })}
          />

          <DocumentCaptureCard
            title={t("Take photo with document")}
            instruction={t("Take selfie holding your passport open to the photo page")}
            variant="selfie"
            completed={!!data.selfieFile}
            onCapture={(file) => updateData({ selfieFile: file, selfiePhotoTaken: true })}
          />

          <DocumentCaptureCard
            title={t("Take video shorts")}
            instruction={t("Take a video shorts holding your document")}
            variant="selfie"
            actionLabel={t("Take Video")}
            actionType="video"
            completed={!!data.videoFile}
            onCapture={(file) => updateData({ videoFile: file, videoShortTaken: true })}
          />
        </div>

        <StepFooter
          onBack={() => navigate('/kyc')}
          onNext={handleNext}
          nextDisabled={!canProceed}
        />
      </PageContainer>
    </div>
  );
}