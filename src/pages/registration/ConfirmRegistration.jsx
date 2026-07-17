import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Checkbox } from '../../components/ui/Checkbox';
import { InfoRow, InfoSection } from '../../components/registration/InfoRow';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';
import { aesEncrypt } from '../../utils/crypto';
import { Trans } from 'react-i18next';
import toast from 'react-hot-toast';

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { data, updateData, fullName } = useRegistration();
  const { submitInfo, submitting } = useRegistrationStore();

  const lang = localStorage.getItem('lang') || 'la';
  const isLaos = data.country === 'laos';
  const contactValue = isLaos ? data.phone : data.email;

  const handleRegister = async () => {
    const passwordEncrypt = aesEncrypt(data.pin);
    const signupData = {
      profileId: data.profileId || null,
      prefixCode: data.title,
      firstNameLa: data.firstName,
      middleNameLa: data.MidleName || '',
      lastNameLa: data.lastName,
      firstNameEn: isLaos ? data.firstNameEn : data.firstName,
      middleNameEn: isLaos ? (data.MidleNameEn || '') : (data.MidleName || ''),
      lastNameEn: isLaos ? data.lastNameEn : data.lastName,
      birthday: data.dateOfBirth,
      tel: data.phone,
      email: data.email,
      occupation: data.occupation || '',
      latitude: 0,
      longitude: 0,
      password: passwordEncrypt,
      confirmPassword: aesEncrypt(data.confirmPin),
      customerType: isLaos ? 'LA' : 'FRN',
      addresses: {
        profileId: data.profileId || null,
        addressType: 'CURRENT',
        roadLineOne: '1',
        roadLineTwo: '2',
        provinceId: data.provinceName,
        cityId: data.districtName,
        village: data.village,
      },
      device: {
        deviceId: crypto.randomUUID?.() || 'DEV-' + Date.now(),
        deviceName: navigator.platform || '',
        deviceOS: /iPhone|iPad|iPod/.test(navigator.userAgent)
          ? 'ios'
          : /Android/.test(navigator.userAgent)
            ? 'android'
            : 'web',
        deviceModelName: '',
        deviceModelNumber: '',
        deviceIMEI: '',
        deviceMEID: '',
        deviceSEID: '',
        deviceInfo: navigator.userAgent || '',
        pushToken: '',
      },
    };

    const success = await submitInfo(signupData);

    if (success) {
      navigate('/review?lang=' + lang);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <div className="px-4 py-6 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900"><Trans>Register</Trans></h1>
          <div className="mt-1 h-1 w-12 bg-msp-green" />
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            <Trans>Please check your information and then confirm to sign up as a new user of MSP Wallet.</Trans>
          </p>
        </div>

        <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6">
          <div className="space-y-8">
            <InfoSection title={<Trans>Applicant details</Trans>}>
              <InfoRow label={<Trans>Full name</Trans>} value={fullName} />
              <InfoRow
                label={isLaos ? <Trans>Phone number</Trans> : <Trans>Email</Trans>}
                value={contactValue}
              />
              <InfoRow label={<Trans>Date of Birth</Trans>} value={formatDate(data.dateOfBirth)} />
            </InfoSection>

            <InfoSection title={<Trans>Present address</Trans>}>
              <InfoRow label={<Trans>Province</Trans>} value={data.provinceName || 'null'} />
              <InfoRow label={<Trans>District</Trans>} value={data.districtName || 'null'} />
              <InfoRow label={<Trans>Village</Trans>} value={data.village || 'null'} />
            </InfoSection>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <div className="flex justify-center">
            <Checkbox
              checked={data.confirmTermsAccepted}
              onChange={(e) => updateData({ confirmTermsAccepted: e.target.checked })}
              label={
                <span className="text-sm text-gray-900">
                  <Trans>Accept all terms</Trans>,{' '}
                  <Link
                    to={"/terms?lang=" + lang}
                    className="font-semibold text-blue-600 underline"
                  >
                    <Trans>Details</Trans>
                  </Link>
                </span>
              }
            />
          </div>
        </div>

        <StepFooter
          singleButton
          singleLabel={submitting ? <Trans>Submitting...</Trans> : <Trans>Register</Trans>}
          onSingle={handleRegister}
          nextDisabled={!data.confirmTermsAccepted || submitting}
        />
      </PageContainer>
    </div>
  );
}
