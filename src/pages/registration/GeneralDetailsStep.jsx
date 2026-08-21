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
import { Trans } from 'react-i18next';

export default function GeneralDetailsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { provinces, cities, villages, prefixes, fetchProvinces, fetchCities, fetchVillages, fetchPrefixes, loadingProvinces, loadingCities, loadingVillages, loadingPrefixes } = useLocationStore();
  const isLaos = data.country === 'laos';

  useEffect(() => {
    fetchProvinces();
    fetchPrefixes();
  }, [fetchProvinces, fetchPrefixes]);

  useEffect(() => {
    if (data.province) {
      if (provinces.length > 0) {
        const selectedProv = provinces.find(p => String(p.id) === String(data.province) || String(p.iso2) === String(data.province));
        if (selectedProv && (selectedProv.iso2)) {
          fetchCities(selectedProv.iso2 || selectedProv.pvISO2Code);
        } else {
          fetchCities(data.province);
        }
      } else {
        fetchCities(data.province);
      }
    }
  }, [data.province, provinces, fetchCities]);

  useEffect(() => {
    if (isLaos && data.district) {
      fetchVillages(data.district);
    }
  }, [isLaos, data.district, fetchVillages]);

  const lang = localStorage.getItem('lang') || 'la';

  const prefixOptions = prefixes.length > 0
    ? prefixes.map(p => ({
      label: lang === 'la' ? (p.prefixName) : (p.prefixName),
      value: p.prefixId
    }))
    : TITLE_OPTIONS;

  const provinceOptions = provinces.length > 0
    ? provinces.map(p => ({
      label: lang === 'la' ? (p.nameLa) : (p.nameEn),
      value: p.id
    }))
    : PROVINCES;

  const districtOptions = cities.length > 0
    ? cities.map(c => ({
      label: lang === 'la' ? (c.nameLa || c.cityNameLa || c.nameEn || c.cityNameEn || c.cityId) : (c.nameEn || c.cityNameEn || c.nameLa || c.cityNameLa || c.cityId),
      value: c.id || c.cityId
    }))
    : DISTRICTS;

  const villageOptions = villages.length > 0
    ? villages.map(v => ({
      label: lang === 'la' ? (v.nameLa || v.villageNameLa || v.nameEn || v.villageNameEn || v.id) : (v.nameEn || v.villageNameEn || v.nameLa || v.villageNameLa || v.id),
      value: v.id
    }))
    : [];

  const canProceed =
    data.firstName.trim() &&
    data.lastName.trim() &&
    data.occupation &&
    (data.district || data.districtName) &&
    (data.province || data.provinceName) &&
    String(data.village || '').trim() &&
    data.alertDOB === false;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* <AppHeader /> */}
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={2} totalSteps={4} label={<Trans>General Details</Trans>} />

        <div className="flex-1 space-y-8 px-4 pb-6 sm:px-6">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900"><Trans>Information</Trans></h2>

            <div className="grid grid-cols-3 gap-3">
              <Select
                label={<Trans>Title</Trans>}
                required
                options={prefixOptions}
                value={data.title}
                onChange={(e) => updateData({ title: e.target.value })}
                placeholder={loadingPrefixes ? "Loading..." : "Mr"}
                className="col-span-1"
              />

              {data.country === "international" ? <Input
                label={<Trans>First Name</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນຊື່ຂອງທ່ານ" : "Enter your First Name"}
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                className="col-span-2"
                helperText={(data.alertFirstName && data.firstName === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your First Name</Trans></p>}
              /> : <Input
                label={<Trans>First Name Lao</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນຊື່ຂອງທ່ານ" : "Enter your First Name"}
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                className="col-span-2"
                helperText={(data.alertFirstName && data.firstName === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your First Name</Trans></p>}
              />}

            </div>

            {data.country === "international" ? <>
              <Input
                label={<Trans>Last Name</Trans>}
                placeholder={lang === 'la' ? "ປ້ອນນາມສະກຸນຂອງທ່ານ" : "Enter your Last Name"}
                value={data.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                helperText={(data.alertLastName && data.lastName === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Last Name</Trans></p>}
              />

              <Input
                label={<Trans>Middle Name</Trans>}
                placeholder={lang === 'la' ? "ປ້ອນຊື່ກາງ" : 'Enter Midle Name'}
                value={data.MidleName}
                onChange={(e) => updateData({ MidleName: e.target.value })}
              />
            </> : <>
              <Input
                label={<Trans>Last Name Lao</Trans>}
                placeholder={lang === 'la' ? "ປ້ອນນາມສະກຸນຂອງທ່ານ" : "Enter your Last Name"}
                value={data.lastName}
                required
                onChange={(e) => updateData({ lastName: e.target.value })}
                helperText={(data.alertLastName && data.lastName === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Last Name</Trans></p>}
              />

              <Input
                label={<Trans>Middle Name Lao</Trans>}
                placeholder={lang === 'la' ? "ປ້ອນຊື່ກາງ" : 'Enter Midle Name'}
                value={data.MidleName}
                onChange={(e) => updateData({ MidleName: e.target.value })}
              />

              <Input
                label={<Trans>First Name English</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນຊື່ຂອງທ່ານ" : "Enter your First Name"}
                value={data.firstNameEn}
                onChange={(e) => updateData({ firstNameEn: e.target.value })}
                className="col-span-2"
                helperText={(data.alertFirstNameEn && data.firstNameEn === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your First Name</Trans></p>}
              />
              <Input
                label={<Trans>Last Name English</Trans>}
                required
                placeholder={lang === 'la' ? "ປ້ອນນາມສະກຸນຂອງທ່ານ" : "Enter your Last Name"}
                value={data.lastNameEn}
                onChange={(e) => updateData({ lastNameEn: e.target.value })}
                helperText={(data.alertLastNameEn && data.lastNameEn === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Last Name</Trans></p>}
              />

              <Input
                label={<Trans>Middle Name English</Trans>}
                placeholder={lang === 'la' ? "ປ້ອນຊື່ກາງ" : 'Enter Midle Name'}
                value={data.MidleNameEn}
                onChange={(e) => updateData({ MidleNameEn: e.target.value })}
              />
            </>}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                <Trans>Date of Birth</Trans><span className="text-red-500">*</span>
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
              <div>
                {(data.alertDOB) && <p className='text-red-500'><Trans>You are under 18 Years old please contact MSP admin</Trans></p>}
              </div>
            </div>

            {(data.country === 'international') ? <Input
              label={<Trans>Email Address</Trans>}
              type="email"
              placeholder={'Enter your Email Address'}
              value={data.email}
              disabled={true}
              onChange={(e) => updateData({ email: e.target.value })}
            /> : <Input
              label={<Trans>Phone Number</Trans>}
              type="number"
              placeholder="Enter your Tel"
              value={data.phone}
              disabled={true}
              onChange={(e) => updateData({ phone: e.target.value })}
            />}

          </section>

          {(data.country === "laos") ? <div>
            <section className="space-y-4">
              <h2 className="text-base font-bold text-gray-900"><Trans>Address details</Trans></h2>
              <Select
                label={<Trans>Province</Trans>}
                required
                options={provinceOptions}
                value={data.province}
                onSelect={({ value, label }) => {
                  updateData({ province: value, provinceName: label, district: '', districtName: '', village: '', villageName: '' });
                }}
                placeholder={loadingProvinces ? <Trans>Loading...</Trans> : <Trans>Select your Province</Trans>}
              />

              <Select
                label={<Trans>District</Trans>}
                required
                options={districtOptions}
                value={data.district}
                onSelect={({ value, label }) => {
                  updateData({ district: value, districtName: label, village: '', villageName: '' });
                }}
                placeholder={loadingCities ? <Trans>Loading...</Trans> : <Trans>Select your District</Trans>}
                disabled={!data.province}
              />

              <Select
                label={<Trans>Village</Trans>}
                required
                options={villageOptions}
                value={data.village}
                onSelect={({ value, label }) => {
                  updateData({ village: value, villageName: label });
                }}
                placeholder={loadingVillages ? <Trans>Loading...</Trans> : <Trans>Select your Village</Trans>}
                disabled={!data.district}
              />

              <Input
                label={<Trans>occupation</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນອາຊີບຂອງທ່ານ" : "Enter your occupation"}
                value={data.occupation}
                onChange={(e) => updateData({ occupation: e.target.value })}
                helperText={(data.alertOccupation && data.occupation === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Occupation</Trans></p>}
              />
            </section>
          </div> : <div>
            <section className="space-y-4">
              <h2 className="text-base font-bold text-gray-900"><Trans>Address details</Trans></h2>
              <Input
                label={<Trans>Province</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນແຂວງຂອງທ່ານ" : "Enter your Province"}
                value={data.provinceName}
                onChange={(e) => updateData({ provinceName: e.target.value })}
              />

              <Input
                label={<Trans>District</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນເມືອງຂອງທ່ານ" : "Enter your District"}
                value={data.districtName}
                onChange={(e) => updateData({ districtName: e.target.value })}
              />

              <Input
                label={<Trans>Village</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນບ້ານຂອງທ່ານ" : "Enter your Village"}
                value={data.village}
                onChange={(e) => updateData({ village: e.target.value })}
                helperText={(data.alertVillage && data.village === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Village</Trans></p>}
              />
              <Input
                label={<Trans>occupation</Trans>}
                required
                placeholder={lang === "la" ? "ປ້ອນອາຊີບຂອງທ່ານ" : "Enter your occupation"}
                value={data.occupation}
                onChange={(e) => updateData({ occupation: e.target.value })}
                helperText={(data.alertOccupation && data.occupation === '') && <p className='text-red-500'><Trans>Please</Trans> <Trans>Enter your Occupation</Trans></p>}
              />
            </section>
          </div>}

        </div>

        <StepFooter
          onBack={() => navigate('/verify?lang=' + lang)}
          onNext={() => navigate('/pin?lang=' + lang)}
          nextDisabled={!canProceed}
        />
      </PageContainer>
    </div>
  );
}
