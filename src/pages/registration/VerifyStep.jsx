import { useNavigate } from 'react-router-dom';
import { useVerifyStore } from '../../store/useVerifyStore';
// import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { InputMask } from '../../components/ui/InputMask'
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
  const { sending, sendError, sendSuccess, sendOtp, sendEmailOtp, countdown, verifying, verifyError, verifyOtp, verifyEmailOtp, message, otpBtnActive, emailBtnActive, verifySuccess } = useVerifyStore();
  const isLaos = data.country === 'laos';
  console.log(data)

  const canProceed = isLaos
    ? data.phone.trim() && data.otp.trim()
    : data.email.trim() && data.emailOtp.trim();


  return (
    <div className="min-h-dvh bg-gray-50">
      {/* <AppHeader /> */}
      <PageContainer>
        <OnboardingHeader />
        <Button
          className="absolute right-3 top-6.5"
          onClick={() => navigate('/kyc')}
        >
          <Trans>KYC</Trans>
        </Button>
        <StepIndicator step={1} totalSteps={4} label={<Trans>Verify</Trans>} />

        <div className="flex-1 space-y-6 px-4 pb-6 sm:px-6">
          <CountrySelector
            value={data.country}
            onChange={(country) => updateData({ country })}
          />

          {isLaos ? (
            <>
              <div>
                {/* <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                  <Trans>Telephone Number</Trans>
                </label> */}
                <div className="flex gap-2">
                  <InputMask
                    label={<Trans>Telephone Number</Trans>}
                    mask={"00-0000-0000"}
                    value={data.phone}
                    onAccept={(e) => updateData({ phone: e })}
                    required
                    placeholder="20-XXXX-XXXX"
                  />
                  {/* <Input
                    placeholder={localStorage.getItem("lang") === "la" ? "ປ້ອນເບີໂທລະສັບຂອງທ່ານ 20512345678" : "Enter your Telephone Number 20512345678"}
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    inputClassName="flex-1"
                    className="flex-1"
                    type="number"
                  /> */}
                  <Button
                    className="shrink-0 self-end px-5"
                    onClick={() => sendOtp(data.phone.trim())}
                    disabled={data.phone.length < 10 || sending || countdown > 0}
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
                {sendError && message != null && (
                  <p className="mt-1.5 text-xs text-red-500">{message}</p>
                )}
                {/* <p className="mt-1.5 text-xs text-gray-500">
                  <Trans>Enter your Telephone Number-for get OTP</Trans>
                </p> */}
              </div>
              <Input
                label={<Trans>Confirm OTP</Trans>}
                placeholder="xxxxxx"
                value={data.otp}
                onChange={(e) => updateData({ otp: e.target.value })}
                disabled={!otpBtnActive}
                type="number"
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
                    disabled={!data?.emailAlert || sending || countdown > 0}
                  >
                    {sending ? (
                      <Trans>Sending…</Trans>
                    ) : countdown > 0 ? (
                      `${countdown}s`
                    ) : (
                      <Trans>Send</Trans>
                    )}
                  </Button>

                  {/* {sendError && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {sendError}
                    </p>
                  )}

                  {sendSuccess && !sendError && (
                    <p className="mt-1.5 text-xs text-green-600">
                      <Trans>Email OTP sent successfully</Trans>
                    </p>
                  )} */}
                </div>
                <div>
                  {!data?.emailAlert && emailBtnActive ===false && <p className="mt-1.5 text-xs text-red-500">
                    <Trans>Please Enter Your Email</Trans>
                  </p>}
                </div>
              </div>
              <Input
                label={<Trans>Verify Email</Trans>}
                placeholder="xxxxxx"
                value={data.emailOtp}
                onChange={(e) => updateData({ emailOtp: e.target.value })}
                disabled={!emailBtnActive}
              />
            </>
          )}
        </div>

        {verifyError && (
          <p className="px-4 pb-2 text-center text-xs text-red-500 sm:px-6">{verifyError}</p>
        )}
        <StepFooter
          onBack={() => navigate('/policy?lang=' + localStorage.getItem("lang"))}
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
              navigate(`/details?lang=${localStorage.getItem('lang') || 'la'}`);
            }

            // if (result) {
            //   if (result.profileId) {
            //     updateData({ profileId: result.profileId });
            //   }
            //   if (verifySuccess) {
            //     navigate(
            //       '/details?lang=' +
            //       localStorage.getItem("lang")
            //     );
            //   }

            // }
          }}
          nextDisabled={!canProceed || verifying}
          nextLabel={verifying ? <Trans>Verifying…</Trans> : <Trans>Next</Trans>}
        />
      </PageContainer>
    </div>
  );
}
