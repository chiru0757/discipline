
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, YearType, CourseType } from '../types';
import { ChevronLeft, Calendar } from 'lucide-react';

interface YearSelectionProps {
  user: User;
}

const YearSelection: React.FC<YearSelectionProps> = ({ user }) => {
  const { course } = useParams<{ course: CourseType }>();
  const navigate = useNavigate();

  const years: YearType[] = ['1st Year', '2nd Year', '3rd Year'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">{course} Stream</h1>
        <p className="text-slate-500">Please select an academic year to manage records</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => navigate(`/course/${course}/${year}`)}
            className="p-10 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col items-center group"
          >
            <div className="bg-indigo-50 text-indigo-600 p-6 rounded-full mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{year}</h3>
            <p className="text-slate-500 mt-2">View Student List</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelection;
