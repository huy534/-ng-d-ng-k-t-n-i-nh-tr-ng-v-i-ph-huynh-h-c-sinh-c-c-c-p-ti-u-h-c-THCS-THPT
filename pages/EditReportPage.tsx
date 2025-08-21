import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Student, Report, AcademicRecord } from '../types';

const EditReportPage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const studentData = await api.getStudent(studentId);
                setStudent(studentData);
                const reportsData = await api.getReports(studentId);
                // For simplicity, we edit the first report. A real app might have term selection.
                if (reportsData.length > 0) {
                    setReport(reportsData[0]);
                } else {
                    // Handle case where no report exists yet
                    setReport({
                        id: `new_report_${studentId}`,
                        studentId: studentId,
                        term: 'Học kỳ 1',
                        year: new Date().getFullYear(),
                        records: [],
                        teacherComments: '',
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const handleRecordChange = (subjectName: string, field: keyof AcademicRecord, value: string | number) => {
        if (!report) return;
        
        const updatedRecords = [...report.records];
        const recordIndex = updatedRecords.findIndex(r => r.subjectName === subjectName);
        
        if (recordIndex > -1) {
            (updatedRecords[recordIndex] as any)[field] = value;
        } else {
             // This part is simplified; a real app would fetch all subjects
            updatedRecords.push({ subjectName, averageScore: 0, absences: 0, conduct: '', [field]: value });
        }

        setReport({ ...report, records: updatedRecords });
    };

    const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!report) return;
        setReport({ ...report, teacherComments: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!report) return;

        setIsSaving(true);
        setSaveStatus('idle');
        try {
            await api.updateReport(report.id, {
                records: report.records,
                teacherComments: report.teacherComments || ''
            });
            setSaveStatus('success');
            setTimeout(() => navigate('/classes'), 2000); // Redirect after 2s
        } catch (error) {
            console.error("Failed to save report:", error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return <p>Đang tải thông tin học bạ...</p>;
    }

    if (!student || !report) {
        return <p>Không tìm thấy thông tin học sinh hoặc học bạ.</p>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Cập nhật Học bạ</h2>
            <div className="flex items-center mb-6">
                 <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full mr-4" />
                 <p className="text-xl text-gray-700">Học sinh: <span className="font-semibold">{student.name}</span></p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gray-50 border-b">
                    <h3 className="text-xl font-bold text-primary-800">{report.term} - Năm học {report.year}</h3>
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
                                <tr key={record.subjectName} className="border-b border-gray-100">
                                    <td className="p-4 text-gray-800 font-medium">{record.subjectName}</td>
                                    <td className="p-2">
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            min="0" 
                                            max="10" 
                                            value={record.averageScore}
                                            onChange={(e) => handleRecordChange(record.subjectName, 'averageScore', parseFloat(e.target.value))}
                                            className="w-24 p-2 border rounded-md"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={record.absences}
                                            onChange={(e) => handleRecordChange(record.subjectName, 'absences', parseInt(e.target.value, 10))}
                                            className="w-20 p-2 border rounded-md"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select 
                                            value={record.conduct}
                                            onChange={(e) => handleRecordChange(record.subjectName, 'conduct', e.target.value)}
                                            className="p-2 border rounded-md bg-white"
                                        >
                                            <option>Tốt</option>
                                            <option>Khá</option>
                                            <option>Đạt</option>
                                            <option>Cần cố gắng</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 border-t">
                    <label htmlFor="teacherComments" className="font-semibold text-gray-700 mb-2 block">Nhận xét của giáo viên:</label>
                    <textarea 
                        id="teacherComments"
                        value={report.teacherComments}
                        onChange={handleCommentsChange}
                        rows={4}
                        className="w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Nhập nhận xét chung..."
                    ></textarea>
                </div>

                <div className="p-6 bg-gray-50 flex justify-end items-center space-x-4">
                    {saveStatus === 'success' && <p className="text-green-600 font-semibold">Đã lưu thành công!</p>}
                    {saveStatus === 'error' && <p className="text-red-600 font-semibold">Lưu thất bại. Vui lòng thử lại.</p>}
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 font-semibold"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditReportPage;
