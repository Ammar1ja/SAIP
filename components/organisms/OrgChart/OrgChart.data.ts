export interface OrgNode {
  id: string;
  label: string;
  labelAr?: string; // Arabic translation
  name?: string;
  nameAr?: string; // Arabic translation
  image?: string;
  type?: 'top-level' | 'board' | 'ceo' | 'sector' | 'department' | 'audit';
  color?: string;
  children?: OrgNode[];
}

export const structure: OrgNode[] = [
  // Top level departments
  {
    id: 'smq',
    label: 'SMO',
    labelAr: 'مكتب إدارة الجودة',
    type: 'top-level',
  },
  {
    id: 'partnerships',
    label: 'Partnerships &\nInternational\nCooperation',
    labelAr: 'الشراكات\nوالتعاون الدولي',
    type: 'top-level',
  },
  {
    id: 'ip-policy-leg',
    label: 'IP Policy &\nLegislations',
    labelAr: 'سياسات\nوتشريعات الملكية الفكرية',
    type: 'top-level',
  },
  {
    id: 'transformation',
    label: 'Transformation',
    labelAr: 'التحول',
    type: 'top-level',
  },
  {
    id: 'innovation',
    label: 'Innovation',
    labelAr: 'الابتكار',
    type: 'top-level',
  },
  {
    id: 'finance',
    label: 'Finance',
    labelAr: 'المالية',
    type: 'top-level',
  },
  {
    id: 'hr',
    label: 'HR',
    labelAr: 'الموارد البشرية',
    type: 'top-level',
  },
  {
    id: 'it',
    label: 'IT',
    labelAr: 'تقنية المعلومات',
    type: 'top-level',
  },
  {
    id: 'facilities',
    label: 'Facilities and\nGeneral Services',
    labelAr: 'المرافق\nوالخدمات العامة',
    type: 'top-level',
  },
  {
    id: 'procurement',
    label: 'Procurement and\nContracts',
    labelAr: 'المشتريات\nوالعقود',
    type: 'top-level',
  },
  {
    id: 'documentation',
    label: 'Documentation and\nArchiving',
    labelAr: 'مركز الوثائق\nوالمحفوظات',
    type: 'top-level',
  },
  // Second level
  {
    id: 'ip-policy-strategy',
    label: 'IP Policy and Strategy',
    labelAr: 'سياسات واستراتيجية\nالملكية الفكرية',
    name: 'Ms. Norah Alammari',
    nameAr: 'أ. نوره العماري',
    type: 'sector',
  },
  {
    id: 'board',
    label: 'SAIP Board of Directors',
    labelAr: 'مجلس إدارة الهيئة السعودية\nللملكية الفكرية',
    type: 'board',
  },
  {
    id: 'corporate-resources',
    label: 'Corporate Resources',
    labelAr: 'الموارد المؤسسية',
    name: 'Mr. Fawaz Almubelli',
    nameAr: 'أ. فواز المبلغ',
    type: 'sector',
  },
  // Third level
  {
    id: 'ip-administration',
    label: 'IP Administration',
    labelAr: 'عمليات الملكية الفكرية',
    name: 'Dr Ali Alshanqeeti',
    nameAr: 'د. علي الشنقيطي',
    type: 'sector',
  },
  {
    id: 'ceo',
    label: 'CEO',
    labelAr: 'الرئيس التنفيذي',
    name: 'Dr. Abdulaziz bin Muhammad Al-Swalem',
    nameAr: 'د. عبد العزيز بن محمد السويلم',
    type: 'ceo',
  },
  {
    id: 'corporate-affairs',
    label: 'Corporate Affairs',
    labelAr: 'الشؤون المؤسسية',
    name: 'Eng. Sami Alsoddais',
    nameAr: 'م. سامي السديس',
    type: 'sector',
  },
  // CEO's departments
  {
    id: 'patent-admin',
    label: 'Patent\nAdministration',
    labelAr: 'البراءات',
    type: 'department',
  },
  {
    id: 'tm-admin',
    label: 'TM Administration',
    labelAr: 'العلامات التجارية',
    type: 'department',
  },
  {
    id: 'grs-designs',
    label: 'CRs and Designs\nAdministration',
    labelAr: 'حقوق المؤلف والتصاميم',
    type: 'department',
  },
  {
    id: 'ceo-office',
    label: 'CEO Office',
    labelAr: 'مكتب الرئيس التنفيذي',
    type: 'department',
  },
  {
    id: 'quality',
    label: 'Quality',
    labelAr: 'الجودة',
    type: 'department',
  },
  {
    id: 'beneficiary',
    label: 'Beneficiary Affairs',
    labelAr: 'شؤون المستفيدين',
    type: 'department',
  },
  {
    id: 'nipst',
    label: 'NIPST',
    labelAr: 'الاستراتيجية الوطنية',
    type: 'department',
  },
  {
    id: 'ip-respect',
    label: 'IP Respect',
    labelAr: 'احترام الملكية الفكرية',
    type: 'department',
  },
  {
    id: 'ip-enablement',
    label: 'IP Enablement',
    labelAr: 'تمكين الملكية الفكرية',
    type: 'department',
  },
  {
    id: 'legal',
    label: 'Legal',
    labelAr: 'الشؤون القانونية',
    type: 'department',
  },
  {
    id: 'ip-dispute',
    label: 'IP Dispute Affairs',
    labelAr: 'نزاعات الملكية الفكرية',
    type: 'department',
  },
  {
    id: 'governance',
    label: 'Governance, Risk\nand Compliance',
    labelAr: 'الحوكمة والمخاطر والالتزام',
    type: 'department',
  },
  {
    id: 'corp-communications',
    label: 'Corporate Communications',
    labelAr: 'الاتصال المؤسسي',
    type: 'department',
  },
  {
    id: 'dmo',
    label: 'DMO',
    labelAr: 'مكتب إدارة البيانات',
    type: 'department',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    labelAr: 'الأمن السيبراني',
    type: 'department',
  },
  // Audit (separate)
  {
    id: 'audit',
    label: 'Internal Audit',
    labelAr: 'المراجعة الداخلية',
    type: 'audit',
  },
];
