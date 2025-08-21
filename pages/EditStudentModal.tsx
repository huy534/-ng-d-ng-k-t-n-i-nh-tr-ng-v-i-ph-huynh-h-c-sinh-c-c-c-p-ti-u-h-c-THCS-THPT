import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Student, UpdateStudentPayload } from '../types';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onSuccess: (updatedStudent: Student) => void;
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

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: 'Nam',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
            });
        }
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const payload: UpdateStudentPayload = { 
                id: student.id, 
                name: formData.name,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
            };
            const updatedStudent = await api.updateStudent(payload);
            onSuccess(updatedStudent);
        } catch (err) {
            setError('Cập nhật thất bại. Vui lòng thử lại.');
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
                        <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin học sinh</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <InputField label="Họ và tên học sinh" id="name" value={formData.name} onChange={handleChange} />
                        <InputField label="Ngày sinh" id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 min-w-[120px]">
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;