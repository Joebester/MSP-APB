import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "Welcome to React": "Welcome to React and react-i18next",
            "register": "Registeration",
            "For MSP eWallet registration": "For MSP eWallet registration",
            "Please follow the instruction below": "Please follow the instruction below",
            "Internet": "Internet",
            "Phone number": "Phone number",
            "Identity document": "Identity document",
            "Document recording": "Document recording",
            "Privacy Policy": "Privacy Policy",
            "I have read and agree to the Privacy Policy": "I have read and agree to the Privacy Policy",
            "Register Now": "Register Now",
            "Cancel": "Cancel",
            "Back": "Back",
            "Next": "Next",
            "Enter the details to get going": "Enter the details to get going",
            "Let&apos;s get you started": "Let&apos;s get you started",
            "The country where you live permanently": "The country where you live permanently",
            "International": "International",
            "Laos": "Laos",
            "Verify": "Verify",
            "Telephone Number": "Telephone Number",
            "Enter your Telephone Number": "Enter your Telephone Number",
            "Enter your Telephone Number-for get OTP": "Enter your Telephone Number for get OTP",
            "Confirm OTP": "Confirm OTP",
            "Enter your Email": "Enter your Email",
            "example.gmail.com": "example.gmail.com",
            "Send": "Send",
            "Verify Email": "Verify Email",
            "Verifying…": "Verifying…",
            "Sending…": "Sending…",
            "Sending OTP to" : "Sending OTP to",

        },
    },
    la: {
        translation: {
            "Welcome to React": "ຍິນດີຕ້ອນຮັບສູ່ React ແລະ react-i18next",
            "register": "ລົງທະບຽນ",
            "For MSP eWallet registration": "ສຳລັບການລົງທະບຽນ MSP eWallet",
            "Please follow the instruction below": "ກະລຸນາປະຕິບັດຕາມຄຳແນະນຳດ້ານລຸ່ມ",
            "Internet": "ອິນເຕີເນັດ",
            "Phone number": "ເບີໂທລະສັບ",
            "Identity document": "ເອກະສານຢືນຢັນຕົວຕົນ",
            "Document recording": "ການບັນທຶກເອກະສານ",
            "Privacy Policy": "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
            "I have read and agree to the Privacy Policy": "ຂ້າພະເຈົ້າໄດ້ອ່ານ ແລະ ຕົກລົງຍອມຮັບນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
            "Register Now": "ລົງທະບຽນຕອນນີ້",
            "Cancel": "ຍົກເລີກ",
            "Back": "ກັບຄືນ",
            "Next": "ຕໍ່ໄປ",
            "Enter the details to get going": "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອເລີ່ມຕົ້ນ",
            "Let's get you started": "ມາເລີ່ມຕົ້ນກັນເລີຍ",
            "The country where you live permanently": "ປະເທດທີ່ທ່ານອາໄສຢູ່ເປັນປະຈຳ",
            "International": "ຕ່າງປະເທດ",
            "Laos": "ລາວ",
            "Verify": "ຢືນຢັນ",
            "Telephone Number": "ເບີໂທລະສັບ",
            "Enter your Telephone-Number": "ປ້ອນເບີໂທລະສັບຂອງທ່ານ",
            "Enter your Telephone Number-for get OTP": "ປ້ອນເບີໂທລະສັບຂອງທ່ານເພື່ອຮັບ OTP",
            "Confirm OTP": "ຢືນຢັນ OTP",
            "Enter your Email": "ປ້ອນອີເມວຂອງທ່ານ",
            "example.gmail.com": "example@gmail.com",
            "Send": "ສົ່ງ",
            "Verify Email": "ຢືນຢັນອີເມວ",
            "Verifying…": "ກຳລັງຢືນຢັນ…",
            "Sending…": "ກຳລັງສົ່ງ…",
            "Sending OTP to" : "ກຳລັງສົ່ງ OTP ໄປຫາ",
        },
    },
};

i18n
    .use(initReactI18next) 
    .init({
        resources,
 

        interpolation: {
            escapeValue: false 
        }
    });

export default i18n;