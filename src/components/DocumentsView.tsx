import React, { useState, useRef } from 'react';
import { UploadedFile, DuplicateGroup, Language, DocumentMatch, DocumentRequirement } from '../types';
import { computeSHA256 } from '../utils/hashing';
import { inspectPDF } from '../utils/pdfParser';
import {
  UploadCloud,
  File,
  Trash2,
  AlertTriangle,
  Copy,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { LordIcon } from './LordIcon';

interface DocumentsViewProps {
  files: UploadedFile[];
  duplicateGroups: Map<string, UploadedFile[]>;
  requirements: DocumentRequirement[];
  matches: DocumentMatch[];
  onFilesAdded: (newFiles: UploadedFile[]) => void;
  onFileRemoved: (fileId: string) => void;
  lang: Language;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  files,
  duplicateGroups,
  requirements,
  matches,
  onFilesAdded,
  onFileRemoved,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File processing logic with exact rules (max 30 files, 50MB, PDF only)
  const processFileList = async (incomingFiles: FileList | File[]) => {
    setUploadError(null);
    setProcessing(true);

    const fileArray = Array.from(incomingFiles);

    if (files.length + fileArray.length > 30) {
      setUploadError('Maximum 30 files limit exceeded.');
      setProcessing(false);
      return;
    }

    const existingBytes = files.reduce((acc, f) => acc + f.size, 0);
    const newBytes = fileArray.reduce((acc, f) => acc + f.size, 0);
    if (existingBytes + newBytes > 50 * 1024 * 1024) {
      setUploadError('Maximum total upload size is 50 MB.');
      setProcessing(false);
      return;
    }

    const processed: UploadedFile[] = [];

    for (const f of fileArray) {
      if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
        setUploadError(`"${f.name}": This file is not a PDF and was not added.`);
        continue;
      }

      try {
        const arrayBuffer = await f.arrayBuffer();
        const hash = await computeSHA256(arrayBuffer);
        const inspection = await inspectPDF(arrayBuffer);

        processed.push({
          id: `${f.name}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          file: f,
          name: f.name,
          size: f.size,
          pages: inspection.pages,
          hash,
          isEncrypted: inspection.isEncrypted,
          isCorrupt: inspection.isCorrupt,
          error: inspection.error,
          arrayBuffer,
        });
      } catch (err: any) {
        processed.push({
          id: `${f.name}_${Date.now()}`,
          file: f,
          name: f.name,
          size: f.size,
          pages: 0,
          hash: '',
          isCorrupt: true,
          error: err?.message || 'Failed to read file',
          arrayBuffer: new ArrayBuffer(0),
        });
      }
    }

    if (processed.length > 0) {
      onFilesAdded(processed);
    }
    setProcessing(false);
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isMatched = matches.some((m) => m.fileId === f.id);
    if (filterType === 'matched') return matchesSearch && isMatched;
    if (filterType === 'unmatched') return matchesSearch && !isMatched;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Documents</h2>
        <p className="text-xs text-slate-500">
          Upload, manage, and verify source tender documents.
        </p>
      </div>

      {/* Top Utility Bar (Matching Reference Image) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 border border-slate-200 rounded-xl shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search uploaded files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Segmented Control & Upload Action */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded font-medium ${
                filterType === 'all' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              All Files ({files.length})
            </button>
            <button
              onClick={() => setFilterType('matched')}
              className={`px-2.5 py-1 rounded font-medium ${
                filterType === 'matched' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setFilterType('unmatched')}
              className={`px-2.5 py-1 rounded font-medium ${
                filterType === 'unmatched' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              Unassigned
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Upload Drop Zone Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) await processFileList(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/50'
        } shadow-2xs`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={async (e) => {
            if (e.target.files) await processFileList(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-bold text-slate-800">
          {processing ? 'Processing and verifying PDFs...' : 'UPLOAD DOCUMENTS'}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Drop PDF files here or <span className="text-blue-600 font-semibold underline">Choose Files</span>
        </p>

        <span className="text-[11px] text-slate-400 mt-2">
          Maximum 30 files &bull; Maximum 50 MB total &bull; Strict PDF format
        </span>
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Duplicate warning banner */}
      {duplicateGroups.size > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-900">
            <Copy className="w-4 h-4 text-amber-600" />
            <span>Duplicate Content Detected</span>
          </div>
          <p className="text-[11px] text-amber-700">
            Files with identical byte content cannot be matched to conflicting requirements:
          </p>
          <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-amber-900">
            {Array.from(duplicateGroups.entries()).map(([hash, group]) => (
              <li key={hash}>
                Identical files: <span className="font-semibold">{group.map((f) => f.name).join(' ↔ ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-800">Uploaded File Repository</span>
          <span>
            {files.length} Files &bull; {(files.reduce((a, b) => a + b.size, 0) / (1024 * 1024)).toFixed(2)} MB / 50 MB
          </span>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {files.length === 0
              ? 'No documents uploaded yet. Drop PDF files above to begin.'
              : 'No files match the search criteria.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-4">Filename</th>
                  <th className="py-2.5 px-4 text-center w-20">Pages</th>
                  <th className="py-2.5 px-4 w-24">Size</th>
                  <th className="py-2.5 px-4 w-32">Duplicate Status</th>
                  <th className="py-2.5 px-4">Assigned Requirement</th>
                  <th className="py-2.5 px-4 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => {
                  const isDuplicate = duplicateGroups.has(file.hash);
                  const matchedReq = matches.find((m) => m.fileId === file.id);
                  const reqObj = matchedReq ? requirements.find((r) => r.id === matchedReq.requirementId) : null;

                  return (
                    <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate max-w-xs" title={file.name}>
                          {file.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">{file.pages}</td>
                      <td className="py-3 px-4 text-slate-500">{(file.size / 1024).toFixed(0)} KB</td>
                      <td className="py-3 px-4">
                        {isDuplicate ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Copy className="w-3 h-3" />
                            <span>Duplicate</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unique</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {reqObj ? (
                          <span className="text-blue-700 font-medium">
                            {reqObj.id} &bull; {reqObj.title_en}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onFileRemoved(file.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
