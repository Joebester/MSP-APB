import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DISTRICTS, PROVINCES, TITLE_OPTIONS } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';

export default function GeneralDetailsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();

  const canProceed =
    data.firstName.trim() &&
    data.dateOfBirth &&
    data.district &&
    data.province &&
    data.village.trim();

  return (
    <div className="min-h-dvh bg-gray-50">
      <AppHeader />
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={2} totalSteps={4} label="General Details" />

        <div className="flex-1 space-y-8 px-4 pb-6 sm:px-6">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Infomation</h2>

            <div className="grid grid-cols-3 gap-3">
              <Select
                label="Title"
                required
                options={TITLE_OPTIONS}
                value={data.title}
                onChange={(e) => updateData({ title: e.target.value })}
                placeholder="Mr"
                className="col-span-1"
              />
              <Input
                label="First Name"
                required
                placeholder="Enter your First Name"
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                className="col-span-2"
              />
            </div>

            <Input
              label="Last Name"
              placeholder="Enter your Last Name"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
            />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                Date of Birth<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20"
                />
                <Calendar
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your Email Address"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Address details</h2>

            <Select
              label="District"
              required
              options={DISTRICTS}
              value={data.district}
              onChange={(e) => updateData({ district: e.target.value })}
              placeholder="Select your District"
            />

            <Select
              label="Province"
              required
              options={PROVINCES}
              value={data.province}
              onChange={(e) => updateData({ province: e.target.value })}
              placeholder="Select your Province"
            />

            <Input
              label="Village"
              required
              placeholder="Enter your Village"
              value={data.village}
              onChange={(e) => updateData({ village: e.target.value })}
            />
          </section>
        </div>

        <StepFooter
          onBack={() => navigate('/register/verify')}
          onNext={() => navigate('/register/pin')}
          nextDisabled={!canProceed}
        />
      </PageContainer>
    </div>
  );
}
