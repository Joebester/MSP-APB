import { useNavigate } from 'react-router-dom';
import { useVerifyStore } from '../../store/useVerifyStore';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CountrySelector } from '../../components/registration/CountrySelector';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { useRegistration } from '../../context/RegistrationContext';
import { Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function VerifyStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { sending, sendError, sendSuccess, sendOtp,sendEmailOtp, countdown, verifying, verifyError, verifyOtp, verifyEmailOtp } = useVerifyStore();
  const isLaos = data.country === 'laos';

  const canProceed = isLaos
    ? data.phone.trim() && data.otp.trim()
    : data.email.trim() && data.emailOtp.trim();


  return (
    <div className="min-h-dvh bg-gray-50">
      <AppHeader />
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={1} totalSteps={4} label={<Trans>Verify</Trans>} />

        <div className="flex-1 space-y-6 px-4 pb-6 sm:px-6">
          <CountrySelector
            value={data.country}
            onChange={(country) => updateData({ country })}
          />

          {isLaos ? (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                  <Trans>Telephone Number</Trans>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder={localStorage.getItem("lang") === "la" ? "ປ້ອນເບີໂທລະສັບຂອງທ່ານ" : "Enter your Telephone Number"}
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    inputClassName="flex-1"
                    className="flex-1"
                  />
                  <Button
                    className="shrink-0 self-end px-5"
                    onClick={() => sendOtp(data.phone.trim())}
                    disabled={!data.phone.trim() || sending || countdown > 0}
                  >
                    {sending ? <Trans>Sending…</Trans> : countdown > 0 ? `${countdown}s` : <Trans>Send</Trans>}
                  </Button>
                </div>
                {sendError && (
                  <p className="mt-1.5 text-xs text-red-500">{sendError}</p>
                )}
                {sendSuccess && !sendError && (
                  <p className="mt-1.5 text-xs text-green-600"><Trans>OTP sent successfully</Trans></p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  <Trans>Enter your Telephone Number-for get OTP</Trans>
                </p>
              </div>
              <Input
                label={<Trans>Confirm OTP</Trans>}
                placeholder="XXXXX"
                value={data.otp}
                onChange={(e) => updateData({ otp: e.target.value })}
              />
            </>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                  <Trans>Enter your Email</Trans>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder={localStorage.getItem("lang") === "la" ? "ປ້ອນອີເມວຂອງທ່ານ" : "Enter your Email"}
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    className="shrink-0 self-end px-5"
                    onClick={() => sendEmailOtp(data.email.trim())}
                    disabled={!data.email.trim() || sending || countdown > 0}
                  >
                    {sending ? (
                      <Trans>Sending…</Trans>
                    ) : countdown > 0 ? (
                      `${countdown}s`
                    ) : (
                      <Trans>Send</Trans>
                    )}
                  </Button>
                  {sendError && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {sendError}
                    </p>
                  )}

                  {sendSuccess && !sendError && (
                    <p className="mt-1.5 text-xs text-green-600">
                      <Trans>Email OTP sent successfully</Trans>
                    </p>
                  )}
                </div>
              </div>
              <Input
                label={<Trans>Verify Email</Trans>}
                placeholder="xxxxx"
                value={data.emailOtp}
                onChange={(e) => updateData({ emailOtp: e.target.value })}
              />
            </>
          )}
        </div>

        {verifyError && (
          <p className="px-4 pb-2 text-center text-xs text-red-500 sm:px-6">{verifyError}</p>
        )}
        <StepFooter
          onBack={() => navigate('/register/policy?lang=' + localStorage.getItem("lang"))}
          onNext={async () => {
            const result = isLaos
              ? await verifyOtp(
                data.phone.trim(),
                data.otp.trim()
              )
              : await verifyEmailOtp(
                data.email.trim(),
                data.emailOtp.trim()
              );

            if (result) {
              if (result.profileId) {
                updateData({ profileId: result.profileId });
              }
              navigate(
                '/register/details?lang=' +
                localStorage.getItem("lang")
              );
            }
          }}
          nextDisabled={!canProceed || verifying}
          nextLabel={verifying ? <Trans>Verifying…</Trans> : <Trans>Next</Trans>}
        />
      </PageContainer>
    </div>
  );
}
