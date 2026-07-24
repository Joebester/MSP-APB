export const REGISTRATION_STEPS = [
  { number: 1, label: 'Verify' },
  { number: 2, label: 'General Details' },
  { number: 3, label: 'Documents Upload' },
  { number: 4, label: 'Confirm & Submit' },
];

export const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Miss'];

export const PROVINCES = [
  'Attapeu',
  'Bokeo',
  'Bolikhamxai',
  'Champasak',
  'Houaphanh',
  'Khammouane',
  'Luang Namtha',
  'Luang Prabang',
  'Oudomxay',
  'Phongsaly',
  'Salavan',
  'Savannakhet',
  'Vientiane',
  'Vientiane Capital',
  'Xaignabouli',
  'Xaisomboun',
  'Xekong',
  'Xiangkhouang',
];

export const DISTRICTS = [
  'Buolapha',
  'Champasak',
  'Luang Prabang',
  'Pakse',
  'Savannakhet',
  'Thakhek',
  'Vientiane',
];

export const DOCUMENT_TYPES = {
  passport: {
    typeId: 1,
    label: 'Passport',
    fields: [
      {
        key: 'documentNumber',
        label: 'Passport Number',
        placeholder: 'Enter your Passport Number',
        required: true,
      },
      {
        key: 'documentIssueDate',
        label: 'Passport issue date',
        placeholder: 'Enter your Passport issue date',
        required: true,
        type: 'date',
      },
      {
        key: 'documentExpirationDate',
        label: 'Passport expiration date',
        placeholder: 'Enter your Passport expiration date',
        required: true,
        type: 'date',
      },
    ],
  },
  id_card: {
    typeId: 2,
    label: 'ID Card',
    fields: [
      {
        key: 'documentNumber',
        label: 'Enter ID Card Number',
        placeholder: 'Enter your Passport Number',
        required: true,
      },
      {
        key: 'documentExpirationDate',
        label: 'ID Card expiration date',
        placeholder: 'Enter your Passport issue date',
        required: false,
        type: 'date',
      },
    ],
  },
  census: {
    typeId: 3,
    label: 'Census Number',
    fields: [
      {
        key: 'documentNumber',
        label: 'Enter Census Number',
        placeholder: 'Enter your Passport Number',
        required: true,
      },
      {
        key: 'documentIssueDate',
        label: 'Census Number issue date',
        placeholder: 'Enter your Passport issue date',
        required: true,
        type: 'date',
      },
    ],
  },
};

export const SECURITY_QUESTIONS = [
  'What is your Last name?',
  'What is your brother name?',
  'What is your first school?',
];

export const TERMS_TEXT = `Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

1914 translation by H. Rackham

But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.

No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.

To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`;
