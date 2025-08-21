import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { Student, NewStudentPayload } from '../types';

interface AddStudentModalProps {
    classId: string;
    onClose: () => void;
    onSuccess: (newStudent: Student) => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean }> = 
({ label, id, value, onChange, type = 'text', required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
);

const AddStudentModal: React.FC<AddStudentModalProps> = ({ classId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        studentDateOfBirth: '',
        studentGender: 'Nam',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const payload: NewStudentPayload = { classId, ...formData };
            const newStudent = await api.addStudentToClass(payload);
            onSuccess(newStudent);
        } catch (err) {
            setError('Thêm học sinh thất bại. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800">Thêm học sinh mới</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <h4 className="font-semibold text-gray-700 border-b pb-2">Thông tin học sinh</h4>
                        <InputField label="Họ và tên học sinh" id="studentName" value={formData.studentName} onChange={handleChange} />
                        <InputField label="Ngày sinh" id="studentDateOfBirth" type="date" value={formData.studentDateOfBirth} onChange={handleChange} />
                        <div>
                            <label htmlFor="studentGender" className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select id="studentGender" name="studentGender" value={formData.studentGender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        
                        <h4 className="font-semibold text-gray-700 border-b pb-2 pt-4">Thông tin phụ huynh</h4>
                        <InputField label="Họ và tên phụ huynh" id="parentName" value={formData.parentName} onChange={handleChange} />
                        <InputField label="Email phụ huynh" id="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} />
                        <InputField label="Số điện thoại phụ huynh" id="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                        
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 min-w-[120px]">
                            {isSubmitting ? 'Đang lưu...' : 'Thêm học sinh'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
