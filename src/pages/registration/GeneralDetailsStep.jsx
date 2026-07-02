import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DISTRICTS, PROVINCES, TITLE_OPTIONS } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { useLocationStore } from '../../store/useLocationStore';
import { Trans } from 'react-i18next';
import { DatePicker } from '../../components/ui/DatePicker';

export default function GeneralDetailsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const isLaos = data.country === 'laos';
  const {
    provinces, cities, prefixes,
    fetchProvinces, fetchCities, fetchPrefixes,
    loadingProvinces, loadingCities, loadingPrefixes,
  } = useLocationStore();

  useEffect(() => {
    fetchProvinces();
    fetchPrefixes();
  }, [fetchProvinces, fetchPrefixes]);

  useEffect(() => {
    if (data.province) {
      if (provinces.length > 0) {
        const selectedProv = provinces.find(
          p => String(p.id) === String(data.province) ||
            String(p.pvISO2Code) === String(data.province)
        );
        if (selectedProv && (selectedProv.iso2 || selectedProv.pvISO2Code)) {
          fetchCities(selectedProv.iso2 || selectedProv.pvISO2Code);
        } else {
          fetchCities(data.province);
        }
      } else {
        fetchCities(data.province);
      }
    }
  }, [data.province, provinces, fetchCities]);

  const lang = localStorage.getItem('lang') || 'la';

  const prefixOptions = prefixes.length > 0
    ? prefixes.map(p => ({
      label: lang === 'la'
        ? (p.nameLa || p.titleNameLa || p.nameEn || p.titleNameEn || p.titleCode)
        : (p.nameEn || p.titleNameEn || p.nameLa || p.titleNameLa || p.titleCode),
      value: p.id || p.titleCode,
    }))
    : TITLE_OPTIONS;

  const provinceOptions = provinces.length > 0
    ? provinces.map(p => ({
      label: lang === 'la'
        ? (p.nameLa || p.provinceNameLa || p.nameEn || p.provinceNameEn || p.pvISO2Code)
        : (p.nameEn || p.provinceNameEn || p.nameLa || p.provinceNameLa || p.pvISO2Code),
      value: p.id || p.pvISO2Code || p.provinceId,
    }))
    : PROVINCES;

  const districtOptions = cities.length > 0
    ? cities.map(c => ({
      label: lang === 'la'
        ? (c.nameLa || c.cityNameLa || c.nameEn || c.cityNameEn || c.cityId)
        : (c.nameEn || c.cityNameEn || c.nameLa || c.cityNameLa || c.cityId),
      value: c.id || c.cityId,
    }))
    : DISTRICTS;

  const canProceed = isLaos
    ? data.firstNameLa.trim() &&
    data.firstNameEn.trim() &&
    data.lastNameLa.trim() &&
    data.lastNameEn.trim() &&
    data.dateOfBirth &&
    data.email.trim() &&
    data.district &&
    data.province &&
    data.village.trim()
    : data.firstName.trim() &&
    data.dateOfBirth &&
    data.district &&
    data.province &&
    data.village.trim();

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={2} totalSteps={4} label={<Trans>General Details</Trans>} />

        <div className="flex-1 space-y-8 px-4 pb-6 sm:px-6">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              <Trans>Information</Trans>
            </h2>

            {/* Title */}
            <Select
              label={<Trans>Title</Trans>}
              required
              options={prefixOptions}
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder={loadingPrefixes ? 'Loading...' : 'Mr'}
              className="w-1/3"
            />

            {isLaos ? (
              <>
                {/* First Name */}
                <div>
                  <p className="mb-1.5 text-sm font-semibold text-gray-900">
                    <Trans>First Name</Trans> <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      // label={<Trans>Lao</Trans>}
                      placeholder="ຊື່ (ລາວ)"
                      value={data.firstNameLa}
                      onChange={(e) => updateData({ firstNameLa: e.target.value })}
                    />
                    <Input
                      // label={<Trans>English</Trans>}
                      placeholder="First Name (EN)"
                      value={data.firstNameEn}
                      onChange={(e) => updateData({ firstNameEn: e.target.value })}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <p className="mb-1.5 text-sm font-semibold text-gray-900">
                    <Trans>Last Name</Trans> <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      // label={<Trans>Lao</Trans>}
                      placeholder="ນາມສະກຸນ (ລາວ)"
                      value={data.lastNameLa}
                      onChange={(e) => updateData({ lastNameLa: e.target.value })}
                    />
                    <Input
                      // label={<Trans>English</Trans>}
                      placeholder="Last Name (EN)"
                      value={data.lastNameEn}
                      onChange={(e) => updateData({ lastNameEn: e.target.value })}
                    />
                  </div>
                </div>

                {/* Middle Name (optional) */}
                <div>
                  <p className="mb-1.5 text-sm font-semibold text-gray-900">
                    <Trans>Middle Name</Trans>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      // label={<Trans>Lao</Trans>}
                      placeholder="ຊື່ກາງ (ລາວ)"
                      value={data.middleNameLa}
                      onChange={(e) => updateData({ middleNameLa: e.target.value })}
                    />
                    <Input
                      // label={<Trans>English</Trans>}
                      placeholder="Middle Name (EN)"
                      value={data.middleNameEn}
                      onChange={(e) => updateData({ middleNameEn: e.target.value })}
                    />
                  </div>
                </div>
                <Input
                  label={<Trans>Email Address</Trans>}
                  type="email"
                  placeholder="Enter your Email Address"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label={<Trans>First Name</Trans>}
                    required
                    placeholder="Enter your First Name"
                    value={data.firstName}
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <Input
                  label={<Trans>Last Name</Trans>}
                  placeholder="Enter your Last Name"
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                />
                <Input
                  label={<Trans>Middle Name</Trans>}
                  placeholder="Enter Middle Name"
                  value={data.middleName}
                  onChange={(e) => updateData({ middleName: e.target.value })}
                />
              </>
            )}

            {/* Date of Birth */}
            <DatePicker
              label={<Trans>Date of Birth</Trans>}
              required
              value={data.dateOfBirth}
              onChange={(val) => updateData({ dateOfBirth: val })}
            />

            {!isLaos && (
              <Input
                label={<Trans>Email Address</Trans>}
                type="email"
                placeholder="Enter your Email Address"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
              />
            )}

            <Input
              label={<Trans>Occupation</Trans>}
              placeholder="Enter your Occupation"
              value={data.occupation}
              onChange={(e) => updateData({ occupation: e.target.value })}
            />
          </section>

          {/* Address */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              <Trans>Address details</Trans>
            </h2>

            <Select
              label={<Trans>Province</Trans>}
              required
              options={provinceOptions}
              value={data.province}
              onChange={(e) => updateData({ province: e.target.value, district: '' })}
              placeholder={loadingProvinces ? 'Loading...' : 'Select your Province'}
            />

            <Select
              label={<Trans>District</Trans>}
              required
              options={districtOptions}
              value={data.district}
              onChange={(e) => updateData({ district: e.target.value })}
              placeholder={loadingCities ? 'Loading...' : 'Select your District'}
              disabled={!data.province}
            />

            <Input
              label={<Trans>Village</Trans>}
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