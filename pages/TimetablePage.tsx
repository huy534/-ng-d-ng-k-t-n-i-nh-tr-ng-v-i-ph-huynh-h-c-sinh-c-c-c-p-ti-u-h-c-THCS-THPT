import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { Timetable, TimetableEntry, UserRole } from '../types';

// Helper to process flat timetable entries into a grid structure
const processTimetableData = (entries: TimetableEntry[]) => {
  const grid: { [key: number]: { [key: number]: string } } = {};
  let maxPeriod = 0;

  entries.forEach(entry => {
    if (!grid[entry.period]) {
      grid[entry.period] = {};
    }
    grid[entry.period][entry.dayOfWeek] = entry.subjectName;
    if (entry.period > maxPeriod) {
      maxPeriod = entry.period;
    }
  });

  return { grid, maxPeriod };
};

const TimetableGrid: React.FC<{ timetable: Timetable }> = ({ timetable }) => {
    const { grid, maxPeriod } = processTimetableData(timetable.entries);
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];
    const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

    if (timetable.entries.length === 0) {
        return (
             <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{timetable.className}</h3>
                <p>Chưa có dữ liệu thời khóa biểu cho lớp này.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">{timetable.className}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                    <thead className="bg-primary-100">
                        <tr>
                            <th className="p-3 font-semibold text-primary-800 border">Tiết</th>
                            {days.map((day, index) => (
                                <th key={index} className="p-3 font-semibold text-primary-800 border">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-primary-700 border">Tiết {period}</td>
                                {days.map((_, dayIndex) => (
                                    <td key={dayIndex} className="p-4 text-gray-700 border">
                                        {grid[period]?.[dayIndex + 2] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedTimetableId, setSelectedTimetableId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getTimetablesForCurrentUser()
      .then(data => {
        setTimetables(data);
        if (data.length > 0) {
          setSelectedTimetableId(data[0].studentId);
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const selectedTimetable = timetables.find(t => t.studentId === selectedTimetableId);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Thời khóa biểu</h2>
      
      {user?.role === UserRole.PARENT && timetables.length > 1 && (
        <div className="mb-6 max-w-sm">
          <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Xem thời khóa biểu cho:</label>
          <select
            id="student-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={selectedTimetableId}
            onChange={e => setSelectedTimetableId(e.target.value)}
          >
            {timetables.map(t => <option key={t.studentId} value={t.studentId}>{t.studentName}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <p>Đang tải thời khóa biểu...</p>
      ) : selectedTimetable ? (
        <TimetableGrid timetable={selectedTimetable} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          <p>Không tìm thấy dữ liệu thời khóa biểu.</p>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
