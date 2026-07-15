// ==========================================
// i18n.js — Translation System
// Supports English (en) and Arabic (ar)
// ==========================================

const translations = {
  en: {
    // Global
    appName: 'Dental Workflow',
    appSubtitle: 'Connect labs with digital designers',
    login: 'Login',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    role: 'I am a',
    selectRole: 'Select role...',
    lab: 'Dental Lab',
    designer: 'Digital Designer',
    admin: 'Admin',
    createAccount: 'Create Account',
    logout: 'Logout',
    language: 'عربي',
    
    // Navbar
    dashboard: 'Dashboard',
    newCase: 'New Case',
    myCases: 'My Cases',
    notifications: 'Notifications',
    
    // Dashboard
    allCases: 'All',
    awaitingConversion: 'Awaiting Conversion',
    awaitingDesigner: 'Awaiting Designer',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    submitted: 'Submitted',
    approved: 'Approved',
    searchCases: 'Search cases...',
    noCasesFound: 'No cases found',
    noCasesMessage: 'Create your first case to get started.',
    createNewCase: 'Create New Case',
    due: 'Due',
    unassigned: 'Unassigned',
    backToDashboard: '← Back to Dashboard',
    
    // Case Detail
    caseInformation: 'Case Information',
    caseId: 'Case ID',
    patient: 'Patient',
    specialty: 'Specialty',
    lab: 'Lab',
    dueDate: 'Due Date',
    created: 'Submitted',
    descriptionNotes: 'Description / Notes',
    actions: 'Actions',
    approve: '✓ Approve',
    requestRevision: '↻ Request Revision',
    reject: '✗ Reject',
    accept: 'Accept Case',
    downloadFinal: '📥 Download Final File',
    revisionRequestedMsg: 'Revision requested. Waiting for designer to resubmit.',
    awaitingConversionMsg: 'Your file is waiting to be converted by the admin.',
    awaitingDesignerMsg: 'Waiting for admin to assign a designer.',
    assignedMsg: 'Case assigned. Designer will begin work soon.',
    designerWorkingMsg: 'Designer is working on this case.',
    rejectedMsg: 'This case was rejected.',
    noActions: 'No actions available.',
    previewNotAvailable: '3D preview not available yet',
    previewMessage: 'The admin will upload a preview after converting your file.',
    noPatient: '—',
    notSet: 'Not set',
    none: '—',
    
    // New Case
    createCase: 'Create New Case',
    caseName: 'Case Name',
    caseNamePlaceholder: 'e.g., Crown - Upper Right Molar',
    caseNameHelp: 'A clear, descriptive name for this case.',
    patientName: 'Patient Name',
    patientNamePlaceholder: 'e.g., Ahmed S.',
    patientNameHelp: 'Optional. Helps with identification.',
    specialtyHelp: 'Select specialty...',
    designerNotes: 'Description / Notes for Designer',
    designerNotesPlaceholder: 'Any special instructions, shade preferences, margin details...',
    datePlaceholder: 'Due Date',
    markUrgent: 'Mark as Urgent',
    uploadScan: 'Upload Scan File',
    uploadHelp: 'Accepted formats: STL, PLY, OBJ. Max size: 500MB.',
    saveDraft: 'Save as Draft',
    submitConversion: 'Submit for Conversion',
    submitting: 'Submitting...',
    caseCreated: 'Case created successfully!',
    
    // Designer Dashboard
    availabilityStatus: 'Availability Status',
    availableMessage: 'You are currently available for new cases.',
    unavailableMessage: 'You are currently unavailable. You will not receive new case assignments.',
    setUnavailable: 'Set Unavailable',
    setAvailable: 'Set Available',
    activeCases: 'Active Cases',
    completedMonth: 'Completed This Month',
    averageRating: 'Average Rating',
    assignedCases: 'Assigned Cases',
    designerEmptyMessage: 'When a lab submits a case and an admin assigns it to you, it will appear here.',
    daysLeft: 'days left',
    overdue: 'Overdue',
    newStatus: 'New',
    completed: 'Completed',
    
    // Admin
    adminPanel: 'Admin Panel',
    needsConversion: 'Needs Conversion',
    needsAssignment: 'Needs Assignment',
    allCasesTab: 'All Cases',
    allCaughtUp: 'All caught up',
    noConversionMessage: 'No cases waiting for conversion.',
    allAssigned: 'All assigned',
    noAssignmentMessage: 'No cases waiting for designer assignment.',
    caseNumber: 'Case',
    file: 'File',
    date: 'Date',
    actionsCol: 'Actions',
    download: '📥 Download',
    uploadGlb: '📤 Upload GLB',
    dateConverted: 'Date Converted',
    assignDesigner: 'Assign Designer',
    selectDesigner: 'Select designer...',
    noAvailableDesigners: 'No available designers',
    assign: 'Assign',
    allStatuses: 'All Statuses',
    searchAllCases: 'Search all cases...',
    caseCol: 'Case #',
    name: 'Name',
    statusCol: 'Status',
    action: 'Action',
    view: 'View',
    
    // Status labels
    status_draft: 'Draft',
    status_pending_conversion: 'Awaiting Conversion',
    status_ready_for_assignment: 'Awaiting Designer Assignment',
    status_assigned: 'Assigned',
    status_in_progress: 'In Progress',
    status_submitted: 'Submitted',
    status_revision_requested: 'Revision Requested',
    status_approved: 'Approved',
    status_rejected: 'Rejected',
    status_cancelled: 'Cancelled',
    status_rejected_by_designer: 'Rejected by Designer',
status_pending_admin_review: 'Pending Admin Review',
status_rejected_by_lab: 'Rejected by Lab',
status_modification_requested: 'Modification Requested',

// Rejection modal
rejectCase: 'Reject Case',
rejectionReason: 'Please provide a reason for rejection',
reasonPlaceholder: 'Enter the reason for rejection...',
cancel: 'Cancel',
confirmReject: 'Confirm Reject',
reasonRequired: 'Please enter a reason for rejection.',
    
    // Specialties
    spec_crown: 'Crown',
    spec_bridge: 'Bridge',
    spec_implant: 'Implant',
    spec_veneer: 'Veneer',
    spec_denture: 'Denture',
    spec_orthodontic: 'Orthodontic',
    spec_night_guard: 'Night Guard',
    spec_other: 'Other',
    
    // Misc
    loading: 'Loading...',
    demoNote: 'Auth will be connected in Week 2',
    submitConversion2: 'Submit for Conversion',
    processing: 'Processing...',
    uploadCompletedWork: 'Upload Completed Work',
    downloadSourceFiles: 'Download Source Files',
    startWork: 'Start Work',
    
    // Designer actions
    designerNote: 'Case assigned. Designer will begin work soon.',
    
    // Admin demo messages
    downloadingFile: 'Downloading',
    demoMode: 'Demo mode',
    productionNote: 'In production, this generates a signed URL from Supabase.',
    uploadGlbNote: 'In production, this opens a file picker and uploads to Supabase. Case status will change to "ready_for_assignment".',
    assignedTo: 'assigned to',
    assignNote: 'In production, this updates the case in Supabase.',
    selectDesignerFirst: 'Please select a designer first.',
    
    // Toast messages
    caseCreatedToast: 'Case created successfully!',
    caseUpdatedToast: 'Case updated successfully!',
    errorOccurred: 'An error occurred. Please try again.',
  },

  ar: {
    // Global
    appName: 'منصة طب الأسنان',
    appSubtitle: 'منصة تربط المعامل بالمصممين الرقميين',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    role: 'أنا',
    selectRole: 'اختر الدور...',
    lab: 'معمل أسنان',
    designer: 'مصمم رقمي',
    admin: 'مسؤول',
    createAccount: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    language: 'English',
    
    // Navbar
    dashboard: 'لوحة التحكم',
    newCase: 'حالة جديدة',
    myCases: 'حالاتي',
    notifications: 'الإشعارات',
    
    // Dashboard
    allCases: 'الكل',
    awaitingConversion: 'بانتظار التحويل',
    awaitingDesigner: 'بانتظار المصمم',
    assigned: 'مُسندة',
    inProgress: 'قيد التنفيذ',
    submitted: 'مُقدمة للمراجعة',
    approved: 'مقبولة',
    searchCases: 'بحث عن حالة...',
    noCasesFound: 'لا توجد حالات',
    noCasesMessage: 'أنشئ أول حالة للبدء.',
    createNewCase: 'إنشاء حالة جديدة',
    due: 'التسليم',
    unassigned: 'غير مُسند',
    backToDashboard: '← العودة للوحة التحكم',
    
    // Case Detail
    caseInformation: 'معلومات الحالة',
    caseId: 'رقم الحالة',
    patient: 'المريض',
    specialty: 'التخصص',
    lab: 'المعمل',
    dueDate: 'تاريخ التسليم',
    created: 'تاريخ الإنشاء',
    descriptionNotes: 'الوصف / الملاحظات',
    actions: 'الإجراءات',
    approve: '✓ قبول',
    requestRevision: '↻ طلب تعديل',
    reject: '✗ رفض',
    accept: 'قبول الحالة',
    downloadFinal: '📥 تحميل الملف النهائي',
    revisionRequestedMsg: 'تم طلب تعديل. في انتظار إعادة التقديم من المصمم.',
    awaitingConversionMsg: 'ملفك في انتظار التحويل من قبل المسؤول.',
    awaitingDesignerMsg: 'في انتظار إسناد مصمم من قبل المسؤول.',
    assignedMsg: 'تم إسناد الحالة. سيبدأ المصمم العمل قريباً.',
    designerWorkingMsg: 'المصمم يعمل على هذه الحالة.',
    rejectedMsg: 'تم رفض هذه الحالة.',
    noActions: 'لا توجد إجراءات متاحة.',
    previewNotAvailable: 'المعاينة ثلاثية الأبعاد غير متاحة بعد',
    previewMessage: 'سيقوم المسؤول برفع معاينة بعد تحويل ملفك.',
    noPatient: '—',
    notSet: 'غير محدد',
    none: '—',
    
    // New Case
    createCase: 'إنشاء حالة جديدة',
    caseName: 'اسم الحالة',
    caseNamePlaceholder: 'مثال: تاج - ضرس علوي أيمن',
    caseNameHelp: 'اسم واضح ووصفي للحالة.',
    patientName: 'اسم المريض',
    patientNamePlaceholder: 'مثال: أحمد س.',
    patientNameHelp: 'اختياري. يساعد في التعريف.',
    specialtyHelp: 'اختر التخصص...',
    designerNotes: 'وصف / ملاحظات للمصمم',
    designerNotesPlaceholder: 'أي تعليمات خاصة، تفضيلات اللون، تفاصيل الحواف...',
    datePlaceholder: 'تاريخ التسليم',
    markUrgent: 'وضع علامة كحالة عاجلة',
    uploadScan: 'رفع ملف المسح',
    uploadHelp: 'الصيغ المقبولة: STL, PLY, OBJ. الحد الأقصى: 500 ميجابايت.',
    saveDraft: 'حفظ كمسودة',
    submitConversion: 'تقديم للتحويل',
    submitting: 'جاري التقديم...',
    caseCreated: 'تم إنشاء الحالة بنجاح!',
    
    // Designer Dashboard
    availabilityStatus: 'حالة التوفر',
    availableMessage: 'أنت متاح حالياً لاستقبال حالات جديدة.',
    unavailableMessage: 'أنت غير متاح حالياً. لن تستقبل حالات جديدة.',
    setUnavailable: 'تعيين كغير متاح',
    setAvailable: 'تعيين كمتاح',
    activeCases: 'حالات نشطة',
    completedMonth: 'مكتملة هذا الشهر',
    averageRating: 'متوسط التقييم',
    assignedCases: 'الحالات المسندة',
    designerEmptyMessage: 'عندما يقدم معمل حالة ويقوم المسؤول بإسنادها لك، ستظهر هنا.',
    daysLeft: 'أيام متبقية',
    overdue: 'متأخرة',
    newStatus: 'جديدة',
    completed: 'مكتملة',
    
    // Admin
    adminPanel: 'لوحة المسؤول',
    needsConversion: 'بحاجة للتحويل',
    needsAssignment: 'بحاجة للإسناد',
    allCasesTab: 'جميع الحالات',
    allCaughtUp: 'لا يوجد متأخرات',
    noConversionMessage: 'لا توجد حالات بانتظار التحويل.',
    allAssigned: 'جميعها مسندة',
    noAssignmentMessage: 'لا توجد حالات بانتظار الإسناد.',
    caseNumber: 'الحالة',
    file: 'الملف',
    date: 'التاريخ',
    actionsCol: 'إجراءات',
    download: '📥 تحميل',
    uploadGlb: '📤 رفع GLB',
    dateConverted: 'تاريخ التحويل',
    assignDesigner: 'إسناد مصمم',
    selectDesigner: 'اختر مصمم...',
    noAvailableDesigners: 'لا يوجد مصممون متاحون',
    assign: 'إسناد',
    allStatuses: 'جميع الحالات',
    searchAllCases: 'بحث في جميع الحالات...',
    caseCol: 'رقم الحالة',
    name: 'الاسم',
    statusCol: 'الحالة',
    action: 'إجراء',
    view: 'عرض',
    
    // Status labels
    status_draft: 'مسودة',
    status_pending_conversion: 'بانتظار التحويل',
    status_ready_for_assignment: 'بانتظار الإسناد',
    status_assigned: 'مُسندة',
    status_in_progress: 'قيد التنفيذ',
    status_submitted: 'مُقدمة',
    status_revision_requested: 'مطلوب تعديل',
    status_approved: 'مقبولة',
    status_rejected: 'مرفوضة',
    status_cancelled: 'ملغية',
    status_rejected_by_designer: 'رفض من المصمم',
status_pending_admin_review: 'بانتظار مراجعة المسؤول',
status_rejected_by_lab: 'رفض من المعمل',
status_modification_requested: 'مطلوب تعديلات',

// Rejection modal
rejectCase: 'رفض الحالة',
rejectionReason: 'الرجاء تقديم سبب الرفض',
reasonPlaceholder: 'أدخل سبب الرفض...',
cancel: 'إلغاء',
confirmReject: 'تأكيد الرفض',
reasonRequired: 'الرجاء إدخال سبب الرفض.',
    
    // Specialties
    spec_crown: 'تاج',
    spec_bridge: 'جسر',
    spec_implant: 'زراعة',
    spec_veneer: 'قشور',
    spec_denture: 'طقم أسنان',
    spec_orthodontic: 'تقويم',
    spec_night_guard: 'واقي ليلي',
    spec_other: 'أخرى',
    
    // Misc
    loading: 'جاري التحميل...',
    demoNote: 'سيتم ربط المصادقة في الأسبوع الثاني',
    submitConversion2: 'تقديم للتحويل',
    processing: 'جاري المعالجة...',
    uploadCompletedWork: 'رفع العمل المكتمل',
    downloadSourceFiles: 'تحميل ملفات المصدر',
    startWork: 'بدء العمل',
    
    // Designer actions
    designerNote: 'تم إسناد الحالة. سيبدأ المصمم العمل قريباً.',
    
    // Admin demo messages
    downloadingFile: 'جاري التحميل',
    demoMode: 'الوضع التجريبي',
    productionNote: 'في النسخة النهائية، سيتم إنشاء رابط موقع من Supabase.',
    uploadGlbNote: 'في النسخة النهائية، سيتم فتح نافذة اختيار ملف والرفع إلى Supabase. ستتغير حالة الملف إلى "جاهز للإسناد".',
    assignedTo: 'مُسند إلى',
    assignNote: 'في النسخة النهائية، سيتم تحديث الحالة في Supabase.',
    selectDesignerFirst: 'الرجاء اختيار مصمم أولاً.',
    
    // Toast messages
    caseCreatedToast: 'تم إنشاء الحالة بنجاح!',
    caseUpdatedToast: 'تم تحديث الحالة بنجاح!',
    errorOccurred: 'حدث خطأ. الرجاء المحاولة مرة أخرى.',
  }
};

// Get saved language or default to English
let currentLang = localStorage.getItem('dental-workflow-lang') || 'en';

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  const lang = currentLang;
  const dict = translations[lang];
  
  // Update <html> direction and lang
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // If it's an input placeholder
      if (el.hasAttribute('placeholder')) {
        el.placeholder = dict[key];
      } 
      // If it's an option or has only text
      else if (el.children.length === 0) {
        el.textContent = dict[key];
      }
    }
  });
  
  // Update all elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
  
  // Update all elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.title = dict[key];
    }
  });
  
  // Update language toggle button text
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = dict['language'];
  }
  
  // Update document title
  const titleKey = document.title.split(' — ')[0]; // Get the part after emoji
  // Titles are handled per-page
}

// Toggle language
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('dental-workflow-lang', currentLang);
  applyTranslations();
  
  // Re-render dynamic content for the current page
  if (typeof rerenderPage === 'function') {
    rerenderPage();
  }
}

// Get translation for a key (for use in JavaScript)
function t(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});

// Expose to global scope (since we're not using modules yet)
window.t = t;
window.toggleLanguage = toggleLanguage;
window.currentLang = currentLang;
window.applyTranslations = applyTranslations;