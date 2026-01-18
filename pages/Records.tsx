
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DisciplineRecord } from '../types';
import { getRecords, getAllRecordsCountByUUCMS } from '../services/dataService';
import { ChevronLeft, Search, FileText, Calendar, Clock, BarChart3 } from 'lucide-react';

interface RecordsProps {
  user: User;
}

const Records: React.FC<RecordsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [uucmsQuery, setUucmsQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DisciplineRecord[]>([]);
  const [counts, setCounts] = useState<{ [issue: string]: number }>({});
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uucmsQuery.trim()) return;

    setSearchResults(getRecords(uucmsQuery.toUpperCase()));
    setCounts(getAllRecordsCountByUUCMS(uucmsQuery.toUpperCase()));
    setHasSearched(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Detailed Discipline Records</h1>
        <p className="text-slate-500">Search by UUCMS Number to see full history and incident counts</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Enter UUCMS No (e.g., BCA1001)..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm text-lg font-mono"
              value={uucmsQuery}
              onChange={(e) => setUucmsQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-8 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Fetch Records
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {searchResults.length === 0 ? (
            <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
                <FileText size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Records Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                We couldn't find any discipline issues reported for UUCMS {uucmsQuery.toUpperCase()}.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold">
                    <BarChart3 size={20} />
                    Issue Summary
                  </div>
                  <div className="space-y-4">
                    {Object.entries(counts).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{type}</span>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                          {count}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center font-bold">
                      <span className="text-slate-800">Total Count</span>
                      <span className="text-indigo-600 text-xl">{searchResults.length}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText size={18} className="text-indigo-600" />
                      Incident Timeline
                    </h3>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Sorted by Recent</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {searchResults.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((record) => (
                      <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold border border-amber-100">
                            {record.issue_type}
                          </span>
                          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(record.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {new Date(record.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>
                        {record.reason && (
                          <div className="bg-slate-100 p-3 rounded-lg text-slate-700 text-sm italic mb-3 border-l-4 border-indigo-400">
                            "{record.reason}"
                          </div>
                        )}
                        <p className="text-xs text-slate-400">
                          Reported by <span className="text-indigo-600 font-bold">{record.reported_by}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
