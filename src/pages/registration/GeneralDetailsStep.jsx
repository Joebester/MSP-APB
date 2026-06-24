import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DISTRICTS, PROVINCES, TITLE_OPTIONS } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { useLocationStore } from '../../store/useLocationStore';

export default function GeneralDetailsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { provinces, cities, prefixes, fetchProvinces, fetchCities, fetchPrefixes, loadingProvinces, loadingCities, loadingPrefixes } = useLocationStore();

  useEffect(() => {
    fetchProvinces();
    fetchPrefixes();
  }, [fetchProvinces, fetchPrefixes]);

  useEffect(() => {
    if (data.province) {
      if (provinces.length > 0) {
        const selectedProv = provinces.find(p => String(p.id) === String(data.province) || String(p.pvISO2Code) === String(data.province));
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
        label: lang === 'la' ? (p.nameLa || p.titleNameLa || p.nameEn || p.titleNameEn || p.titleCode) : (p.nameEn || p.titleNameEn || p.nameLa || p.titleNameLa || p.titleCode), 
        value: p.id || p.titleCode 
      })) 
    : TITLE_OPTIONS;

  const provinceOptions = provinces.length > 0 
    ? provinces.map(p => ({ 
        label: lang === 'la' ? (p.nameLa || p.provinceNameLa || p.nameEn || p.provinceNameEn || p.pvISO2Code) : (p.nameEn || p.provinceNameEn || p.nameLa || p.provinceNameLa || p.pvISO2Code), 
        value: p.id || p.pvISO2Code || p.provinceId 
      })) 
    : PROVINCES;

  const districtOptions = cities.length > 0 
    ? cities.map(c => ({ 
        label: lang === 'la' ? (c.nameLa || c.cityNameLa || c.nameEn || c.cityNameEn || c.cityId) : (c.nameEn || c.cityNameEn || c.nameLa || c.cityNameLa || c.cityId), 
        value: c.id || c.cityId 
      })) 
    : DISTRICTS;

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
                options={prefixOptions}
                value={data.title}
                onChange={(e) => updateData({ title: e.target.value })}
                placeholder={loadingPrefixes ? "Loading..." : "Mr"}
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
       
            <Input 
             label="Midle Name"
              placeholder="Enter Midle Name"
              value={data.middleName}
              onChange={(e) => updateData({ middleName: e.target.value })}
            
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

            <Input
              label="Occupation"
              placeholder="Enter your Occupation"
              value={data.occupation}
              onChange={(e) => updateData({ occupation: e.target.value })}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Address details</h2>

            <Select
              label="Province"
              required
              options={provinceOptions}
              value={data.province}
              onChange={(e) => {
                updateData({ province: e.target.value, district: '' }); // Reset district when province changes
              }}
              placeholder={loadingProvinces ? "Loading..." : "Select your Province"}
            />

            <Select
              label="District"
              required
              options={districtOptions}
              value={data.district}
              onChange={(e) => updateData({ district: e.target.value })}
              placeholder={loadingCities ? "Loading..." : "Select your District"}
              disabled={!data.province}
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
