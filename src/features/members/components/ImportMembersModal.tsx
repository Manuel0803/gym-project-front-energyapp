'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Papa from 'papaparse';
import { Modal } from '@/common/components/ui/Modal';
import { useImportMembers } from '../hooks/useMembers';
import { ImportMembersResponse } from '../interfaces/members.interface';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ImportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

const REQUIRED_COLUMNS = ['nombre', 'apellido', 'dni'];

export function ImportMembersModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportMembersModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [estimatedRows, setEstimatedRows] = useState<number | null>(null);
  const [importResult, setImportResult] = useState<ImportMembersResponse | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importCsv, isPending } = useImportMembers();

  const resetState = () => {
    setFile(null);
    setIsDragging(false);
    setIsValidating(false);
    setValidationError(null);
    setParsedHeaders([]);
    setEstimatedRows(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateCsvFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
      setValidationError('El archivo debe tener extensión .csv');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setValidationError(null);
    setIsValidating(true);
    setImportResult(null);

    Papa.parse(selectedFile, {
      preview: 5,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsValidating(false);
        const headers = results.meta.fields || [];
        setParsedHeaders(headers);

        const normalizedHeaders = headers.map((h) =>
          h.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );

        const missing = REQUIRED_COLUMNS.filter(
          (col) => !normalizedHeaders.includes(col)
        );

        if (missing.length > 0) {
          setValidationError(
            `El archivo no contiene las columnas obligatorias: ${missing.join(
              ', '
            )}. Encabezados detectados: [${
              headers.length > 0 ? headers.join(', ') : 'ninguno'
            }].`
          );
        } else {
          setValidationError(null);
          // Quick full count
          Papa.parse(selectedFile, {
            skipEmptyLines: true,
            complete: (fullRes) => {
              // Exclude header row
              const count = Math.max(0, fullRes.data.length - 1);
              setEstimatedRows(count);
            },
          });
        }
      },
      error: (err) => {
        setIsValidating(false);
        setValidationError(`Error al leer el archivo CSV: ${err.message}`);
      },
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateCsvFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateCsvFile(droppedFile);
    }
  };

  const handleSubmit = () => {
    if (!file || validationError) return;

    importCsv(file, {
      onSuccess: (data) => {
        setImportResult(data);
        if (onImportSuccess) {
          onImportSuccess();
        }
      },
    });
  };

  const isUploadDisabled =
    !file || !!validationError || isValidating || isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : handleClose}
      title="Importar Alumnos por Excel / CSV"
      maxWidthClass="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        {/* State 1: Results screen */}
        {importResult ? (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div className="p-4 rounded-lg bg-surface border border-border-primary flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-success-surface text-success-main flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-main text-sm">
                  Proceso de importación finalizado
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Se procesaron {importResult.totalProcessed} registros del archivo.
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-surface border border-border-primary text-center">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Procesados
                </span>
                <span className="text-lg font-bold text-text-main mt-0.5 block">
                  {importResult.totalProcessed}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-success-surface/50 border border-success-main/30 text-center">
                <span className="text-[10px] font-bold text-success-main uppercase tracking-wider block">
                  Importados
                </span>
                <span className="text-lg font-bold text-success-main mt-0.5 block">
                  {importResult.success}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-warning-surface/50 border border-warning-main/30 text-center">
                <span className="text-[10px] font-bold text-warning-main uppercase tracking-wider block">
                  Omitidos / Error
                </span>
                <span className="text-lg font-bold text-warning-main mt-0.5 block">
                  {importResult.errors}
                </span>
              </div>
            </div>

            {/* Duplicated DNIs List */}
            {importResult.duplicatedDnis &&
              importResult.duplicatedDnis.length > 0 && (
                <div className="p-3 rounded-lg bg-warning-surface border border-warning-main/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-warning-main mb-1">
                    <AlertTriangle size={14} aria-hidden="true" />
                    <span>
                      {importResult.duplicatedDnis.length} DNI(s) omitidos por
                      duplicado:
                    </span>
                  </div>
                  <div className="max-h-24 overflow-y-auto mt-2 flex flex-wrap gap-1.5">
                    {importResult.duplicatedDnis.map((dni, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-background rounded text-[11px] font-mono text-text-main border border-border-primary"
                      >
                        {dni}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex justify-end gap-3 pt-2 border-t border-border-primary">
              <button
                type="button"
                onClick={resetState}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Importar otro archivo</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-main hover:bg-brand-hover text-white transition-colors cursor-pointer"
              >
                Cerrar y Actualizar Directorio
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Upload and Pre-validation screen */
          <>
            <p className="text-xs text-text-muted leading-relaxed">
              Sube un archivo <strong className="text-text-main">.csv</strong> con la nómina de alumnos. El archivo debe incluir obligatoriamente las columnas{' '}
              <span className="font-semibold text-brand-main">nombre</span>,{' '}
              <span className="font-semibold text-brand-main">apellido</span> y{' '}
              <span className="font-semibold text-brand-main">dni</span>.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-brand-main bg-brand-surface/40 scale-[0.99]'
                  : file && !validationError
                  ? 'border-success-main/60 bg-success-surface/10'
                  : validationError
                  ? 'border-danger-main/60 bg-danger-surface/10'
                  : 'border-border-primary hover:border-brand-main/50 bg-surface/50 hover:bg-surface'
              }`}
              role="button"
              tabIndex={0}
              aria-label="Zona para arrastrar y soltar archivo CSV"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isPending}
              />

              <div className="w-12 h-12 rounded-full bg-brand-surface text-brand-main flex items-center justify-center mb-3">
                <UploadCloud size={24} aria-hidden="true" />
              </div>

              <span className="text-sm font-bold text-text-main">
                {file ? file.name : 'Haz clic o arrastra un archivo CSV aquí'}
              </span>
              <span className="text-xs text-text-muted mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : 'Formatos soportados: CSV con encabezados estándar'}
              </span>
            </div>

            {/* Validation Loading */}
            {isValidating && (
              <div className="flex items-center gap-2 text-xs text-text-muted p-3 rounded-lg bg-surface border border-border-primary">
                <Loader2 size={16} className="animate-spin text-brand-main" />
                <span>Analizando estructura y columnas del archivo...</span>
              </div>
            )}

            {/* Validation Error Message */}
            {validationError && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-danger-surface border border-danger-main/30 text-danger-main text-xs flex items-start gap-2.5 animate-fadeIn"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold block mb-0.5">Columnas faltantes</span>
                  <span>{validationError}</span>
                </div>
              </div>
            )}

            {/* Validation Success Feedback */}
            {file && !validationError && !isValidating && (
              <div className="p-3.5 rounded-lg bg-success-surface border border-success-main/30 text-success-main text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <span className="font-bold block">
                    Estructura validada correctamente
                  </span>
                  <span className="text-[11px] opacity-90 block mt-0.5">
                    Contiene: {parsedHeaders.join(', ')}
                    {estimatedRows !== null &&
                      ` • Aprox. ${estimatedRows} filas listas`}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-border-primary">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-text-main border border-border-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploadDisabled}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-brand-main hover:bg-brand-hover disabled:bg-brand-main/50 text-white transition-colors cursor-pointer shadow-sm disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    <span>Subiendo al servidor...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={14} aria-hidden="true" />
                    <span>Subir al servidor</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
