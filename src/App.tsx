import { useState, useEffect } from 'react';

interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  personnelCode: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
}

const initialFormState: Omit<Personnel, 'id'> = {
  firstName: '',
  lastName: '',
  personnelCode: '',
  position: '',
  department: '',
  phone: '',
  email: '',
  hireDate: '',
};

const departments = [
  'فناوری اطلاعات',
  'منابع انسانی',
  'مالی',
  'بازاریابی',
  'فروش',
  'پشتیبانی',
  'تحقیق و توسعه',
];

function App() {
  const [personnels, setPersonnels] = useState<Personnel[]>(() => {
    const saved = localStorage.getItem('personnels');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('personnels', JSON.stringify(personnels));
  }, [personnels]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.personnelCode) {
      showNotification('لطفاً فیلدهای اجباری را پر کنید', 'error');
      return;
    }

    if (editingId) {
      setPersonnels((prev) =>
        prev.map((p) => (p.id === editingId ? { ...form, id: editingId } : p))
      );
      setEditingId(null);
      showNotification('اطلاعات پرسنل با موفقیت ویرایش شد', 'success');
    } else {
      const newPersonnel: Personnel = {
        ...form,
        id: Date.now().toString(),
      };
      setPersonnels((prev) => [...prev, newPersonnel]);
      showNotification('اطلاعات پرسنل با موفقیت ثبت شد', 'success');
    }

    setForm(initialFormState);
    setShowForm(false);
  };

  const handleEdit = (personnel: Personnel) => {
    setForm({
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      personnelCode: personnel.personnelCode,
      position: personnel.position,
      department: personnel.department,
      phone: personnel.phone,
      email: personnel.email,
      hireDate: personnel.hireDate,
    });
    setEditingId(personnel.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این پرسنل اطمینان دارید؟')) {
      setPersonnels((prev) => prev.filter((p) => p.id !== id));
      showNotification('اطلاعات پرسنل با موفقیت حذف شد', 'success');
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredPersonnels = personnels.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.personnelCode.includes(term) ||
      p.position.toLowerCase().includes(term) ||
      p.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">سامانه ثبت اطلاعات پرسنل</h1>
                <p className="text-sm text-gray-500">مدیریت اطلاعات کارکنان سازمان</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                />
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) handleCancel();
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                </svg>
                {showForm ? 'بستن' : 'ثبت پرسنل جدید'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{personnels.length}</div>
            <div className="text-sm text-gray-500 mt-1">کل پرسنل</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {new Set(personnels.map((p) => p.department)).size}
            </div>
            <div className="text-sm text-gray-500 mt-1">دپارتمان‌ها</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{filteredPersonnels.length}</div>
            <div className="text-sm text-gray-500 mt-1">نتایج جستجو</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {personnels.filter((p) => p.position).length > 0
                ? new Set(personnels.map((p) => p.position)).size
                : 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">سمت‌ها</div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {editingId ? 'ویرایش اطلاعات پرسنل' : 'ثبت پرسنل جدید'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="نام را وارد کنید"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="نام خانوادگی را وارد کنید"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کد پرسنلی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="personnelCode"
                    value={form.personnelCode}
                    onChange={handleChange}
                    placeholder="کد پرسنلی را وارد کنید"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سمت</label>
                  <input
                    type="text"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="سمت شغلی"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="">انتخاب دپارتمان</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="09xxxxxxxxx"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ استخدام</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={form.hireDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingId ? 'ذخیره تغییرات' : 'ثبت اطلاعات'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              لیست پرسنل
            </h2>
          </div>

          {filteredPersonnels.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'نتیجه‌ای یافت نشد' : 'هنوز پرسنلی ثبت نشده است'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  + ثبت اولین پرسنل
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">ردیف</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">نام و نام خانوادگی</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">کد پرسنلی</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">سمت</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">دپارتمان</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">شماره تماس</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">ایمیل</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPersonnels.map((personnel, index) => (
                    <tr key={personnel.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {personnel.firstName[0]}{personnel.lastName[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {personnel.firstName} {personnel.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{personnel.personnelCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{personnel.position || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {personnel.department || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600" dir="ltr">{personnel.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600" dir="ltr">{personnel.email || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(personnel)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(personnel.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/70 text-sm">
          <p>سامانه ثبت اطلاعات پرسنل © ۱۴۰۵</p>
        </div>
      </div>
    </div>
  );
}

export default App;
