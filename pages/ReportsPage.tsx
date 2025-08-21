
import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { Student, Report } from '../types';

const ReportsPage: React.FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.getStudentsByParent(user.id).then(data => {
                setStudents(data);
                if (data.length > 0) {
                    setSelectedStudent(data[0]);
                } else {
                    setLoading(false);
                }
            });
        }
    }, [user]);
    
    useEffect(() => {
        if (selectedStudent) {
            setLoading(true);
            api.getReports(selectedStudent.id).then(data => {
                setReports(data);
                setLoading(false);
            })
        }
    }, [selectedStudent]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo Học tập</h2>
            
            {students.length > 1 && (
                <div className="mb-4">
                    <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Chọn học sinh:</label>
                    <select
                        id="student-select"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={selectedStudent?.id || ''}
                        onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value) || null)}
                    >
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            )}
            
            {loading ? <p>Đang tải báo cáo...</p> : (
                reports.length > 0 ? (
                    <div className="space-y-8">
                        {reports.map(report => (
                            <div key={report.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6 bg-gray-50 border-b">
                                    <h3 className="text-xl font-bold text-primary-800">{report.term} - Năm học {report.year}</h3>
                                    <p className="text-gray-600">Học sinh: {selectedStudent?.name}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-4 font-semibold text-sm text-gray-700 uppercase">Môn học</th>
                                                <th className="p-4 font-semibold text-sm text-gray-700 uppercase">Điểm TB</th>
                                                <th className="p-4 font-semibold text-sm text-gray-700 uppercase">Số buổi nghỉ</th>
                                                <th className="p-4 font-semibold text-sm text-gray-700 uppercase">Hạnh kiểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {report.records.map(record => (
                                                <tr key={record.subjectName} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-4 text-gray-800 font-medium">{record.subjectName}</td>
                                                    <td className="p-4 text-gray-800">{record.averageScore.toFixed(2)}</td>
                                                    <td className="p-4 text-gray-800">{record.absences}</td>
                                                    <td className="p-4 text-gray-800">{record.conduct}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {report.teacherComments && (
                                    <div className="p-6 border-t">
                                        <h4 className="font-semibold text-gray-700 mb-2">Nhận xét của giáo viên:</h4>
                                        <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md">{report.teacherComments}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">Không có báo cáo nào cho học sinh này.</p>
                )
            )}
        </div>
    );
};

export default ReportsPage;
