import { useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { DocumentCaptureCard } from '../../components/registration/DocumentCaptureCard';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DOCUMENT_TYPES } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { useTranslation, Trans } from 'react-i18next';

export default function DocumentsUploadStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { t } = useTranslation();

  const isEmailRegister = data?.isEmailRegister || localStorage.getItem('is_email_register') === 'true';

  useEffect(() => {
    const updates = {};
    if (isEmailRegister && data.documentType !== 'passport') {
      updates.documentType = 'passport';
    }
    if (!data.documentIssueDate) {
      updates.documentIssueDate = dayjs().subtract(5, 'year').format('YYYY-MM-DD');
    }
    if (!data.documentExpirationDate) {
      updates.documentExpirationDate = dayjs().add(5, 'year').format('YYYY-MM-DD');
    }
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  }, [isEmailRegister, data.documentType, data.documentIssueDate, data.documentExpirationDate, updateData]);

  const availableDocTypes = Object.entries(DOCUMENT_TYPES).filter(
    ([key]) => !isEmailRegister || key === 'passport'
  );

  const docConfig = DOCUMENT_TYPES[data.documentType] || DOCUMENT_TYPES.passport;

  const requiredFieldsFilled = docConfig.fields
    .filter((field) => field.required)
    .every((field) => data[field.key]?.trim());

  // Issue date validation (cannot be in the future)
  const getIssueDateError = () => {
    if (!data.documentIssueDate) return null;
    const issue = dayjs(data.documentIssueDate);
    const today = dayjs().startOf('day');
    if (issue.isAfter(today)) {
      return t('Issue date cannot be in the future');
    }
    return null;
  };

  // Expiration date validation (cannot be in the past & must be after issue date)
  const getExpirationDateError = () => {
    if (!data.documentExpirationDate) return null;
    const exp = dayjs(data.documentExpirationDate);
    const today = dayjs().startOf('day');
    if (exp.isBefore(today)) {
      return t('Document has expired');
    }
    if (data.documentIssueDate) {
      const issue = dayjs(data.documentIssueDate);
      if (exp.isBefore(issue) || exp.isSame(issue)) {
        return t('Expiration date must be after issue date');
      }
    }
    return null;
  };

  const issueDateError = getIssueDateError();
  const expirationDateError = getExpirationDateError();

  const canProceed =
    requiredFieldsFilled &&
    !issueDateError &&
    !expirationDateError &&
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

  const handleDocFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateData({ docFile: file, documentPhotoTaken: true });
    }
  };

  const handleSelfieFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateData({ selfieFile: file, selfiePhotoTaken: true });
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateData({ videoFile: file, videoShortTaken: true });
    }
  };

  const handleNext = () => {
    navigate('/review?type=kyc&langCode=' + (localStorage.getItem('lang') || 'la'));
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader />
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
                  disabled={isEmailRegister}
                  className={`w-full appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20 disabled:cursor-not-allowed disabled:bg-gray-200 ${
                    !isEmailRegister && availableDocTypes.length > 1 ? 'pr-10' : 'pr-4'
                  }`}
                >
                  {availableDocTypes.map(([key, config]) => (
                    <option key={key} value={key}>
                      {t(config.label)}
                    </option>
                  ))}
                </select>
                {!isEmailRegister && availableDocTypes.length > 1 && (
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>

            {docConfig.fields.map((field) => {
              if (field.type === 'date') {
                const errorMsg = field.key === 'documentIssueDate' ? issueDateError : expirationDateError;
                return (
                  <div key={field.key} className="w-full">
                    <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                      {t(field.label)}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative w-full">
                      <input
                        type="date"
                        value={data[field.key] || ''}
                        onChange={(e) => updateData({ [field.key]: e.target.value })}
                        className={`w-full min-h-[46px] appearance-none rounded-lg border bg-gray-100 px-4 py-3 pr-10 text-sm font-medium text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20 ${
                          errorMsg ? 'border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                        }`}
                      />
                      <Calendar
                        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    {errorMsg && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">{errorMsg}</p>
                    )}
                  </div>
                );
              }

              return (
                <Input
                  key={field.key}
                  label={t(field.label)}
                  required={field.required}
                  placeholder={t(field.placeholder)}
                  value={data[field.key] || ''}
                  onChange={(e) => updateData({ [field.key]: e.target.value })}
                />
              );
            })}
          </section>

          <input
            id="doc-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDocFileChange}
          />
          <input
            id="selfie-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelfieFileChange}
          />
          <input
            id="video-file-input"
            type="file"
            accept="video/*,image/*"
            className="hidden"
            onChange={handleVideoFileChange}
          />

          <DocumentCaptureCard
            title={t("Upload document")}
            variant="document"
            completed={!!data.docFile}
            onCapture={() => document.getElementById('doc-file-input').click()}
          />

          <DocumentCaptureCard
            title={t("Take photo with document")}
            instruction={t("Take selfie holding your passport open to the photo page")}
            variant="selfie"
            completed={!!data.selfieFile}
            onCapture={() => document.getElementById('selfie-file-input').click()}
          />

          <DocumentCaptureCard
            title={t("Take video shorts")}
            instruction={t("Take a video shorts holding your document")}
            variant="video"
            actionLabel={t("Take Video")}
            actionType="video"
            completed={!!data.videoFile}
            onCapture={() => document.getElementById('video-file-input').click()}
          />

        </div>

        <StepFooter
          onBack={() => navigate('/kyc?langCode=' + (localStorage.getItem('lang') || 'la'))}
          onNext={handleNext}
          nextDisabled={!canProceed}
        />
      </PageContainer>
    </div>
  );
}
