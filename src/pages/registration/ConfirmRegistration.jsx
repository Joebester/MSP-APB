import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Checkbox } from '../../components/ui/Checkbox';
import { InfoRow, InfoSection } from '../../components/registration/InfoRow';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';
import { aesEncrypt } from '../../utils/crypto';

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
  const { data, updateData, fullName: fullNameForeign } = useRegistration();
  const { submitInfo, submitting } = useRegistrationStore();

  const isLaos = data.country === 'laos';

  const displayFullName = isLaos
    ? [data.title, data.firstNameLa, data.middleNameLa, data.lastNameLa]
        .filter(Boolean).join(' ').toUpperCase()
    : fullNameForeign;

  const contactValue = isLaos ? data.phone : data.email;

  const handleRegister = async () => {
    const signupData = {
      profileId: data.profileId || null,
      prefixCode: data.title,
      firstNameLa: isLaos ? data.firstNameLa : data.firstName,
      middleNameLa: isLaos ? data.middleNameLa : (data.middleName || ''),
      lastNameLa: isLaos ? data.lastNameLa : data.lastName,
      firstNameEn: isLaos ? data.firstNameEn : data.firstName,
      middleNameEn: isLaos ? data.middleNameEn : (data.middleName || ''),
      lastNameEn: isLaos ? data.lastNameEn : data.lastName,
      birthday: data.dateOfBirth,
      tel: data.phone,
      email: data.email,
      occupation: data.occupation || '',
      latitude: 0,
      longitude: 0,
      password: aesEncrypt(data.pin),
      confirmPassword: aesEncrypt(data.confirmPin),
      addresses: {
        profileId: data.profileId || null,
        addressType: 'CURRENT',
        roadLineOne: '1',
        roadLineTwo: '2',
        provinceId: parseInt(data.province, 10),
        cityId: parseInt(data.district, 10),
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
      customerType: isLaos ? 'LA' : 'foreign',
    };

    const success = await submitInfo(signupData);
    if (success) {
      navigate('/register/review');
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <div className="px-4 py-6 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">Register</h1>
          <div className="mt-1 h-1 w-12 bg-msp-green" />
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            Please check your information and then confirm to sign up as a new
            user of MSP Wallet.
          </p>
        </div>

        <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6">
          <div className="space-y-8">
            <InfoSection title="Applicant details">
              <InfoRow label="Full name:" value={displayFullName} />
              <InfoRow
                label={isLaos ? 'Phone number:' : 'Email:'}
                value={contactValue}
              />
              <InfoRow label="Date of birth:" value={formatDate(data.dateOfBirth)} />
            </InfoSection>

            <InfoSection title="Present address">
              <InfoRow label="Province:" value={data.province} />
              <InfoRow label="District:" value={data.district} />
              <InfoRow label="Village:" value={data.village || '—'} />
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
                  Accept all terms,{' '}
                  <Link
                    to="/register/terms"
                    className="font-semibold text-blue-600 underline"
                  >
                    Details
                  </Link>
                </span>
              }
            />
          </div>
        </div>

        <StepFooter
          singleButton
          singleLabel={submitting ? 'Submitting...' : 'Register'}
          onSingle={handleRegister}
          nextDisabled={!data.confirmTermsAccepted || submitting}
        />
      </PageContainer>
    </div>
  );
}