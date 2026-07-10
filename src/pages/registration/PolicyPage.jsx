import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Checkbox } from '../../components/ui/Checkbox';
import { usePolicyStore } from '../../store/usePolicyStore';
import { Trans } from 'react-i18next';

export default function PolicyPage() {
  const navigate = useNavigate();
  const { condition, info, loading, error, agreed, setAgreed, fetchPolicy } = usePolicyStore();

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* <AppHeader /> */}
      <PageContainer>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <h1 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            <Trans>Privacy Policy</Trans>
          </h1>

          <div className="mt-6 min-h-50">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-msp-green" />
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && condition && (
              <div className="space-y-6 text-sm leading-relaxed">
                {[{ label: 'Terms & Conditions', value: condition }, { label: 'Information', value: info }]
                  .filter((s) => s.value)
                  .map(({ label, value }) => {
                    const [lao, english] = value.split('|');
                    return (
                      <div key={label}>
                        <h2 className="mb-2 font-semibold text-gray-900">{label}</h2>
                        {lao && <p className="text-gray-700">{lao.trim()}</p>}
                        {english && <p className="mt-1 text-gray-500">{english.trim()}</p>}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 pt-4 sm:px-6">
          <Checkbox
            label={<Trans>I have read and agree to the Privacy Policy</Trans>}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mb-4"
            disabled={loading || !!error}
          />
        </div>

        <StepFooter
          onBack={() => navigate('/?lang=' + localStorage.getItem("lang"))}
          onNext={() => navigate('/verify?lang=' + localStorage.getItem("lang"))}
          nextDisabled={!agreed}
        />
      </PageContainer>
    </div>
  );
}
