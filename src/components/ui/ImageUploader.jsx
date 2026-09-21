import { useState, useRef, useEffect } from 'react'
import { Upload, X, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const MAX_SIZE_MB = 5
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ file, onFileChange, label = 'Add a Photo (Optional)' }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      setErrorMsg(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const validateAndProcessFile = (selectedFile) => {
    if (!selectedFile) return

    setErrorMsg(null)

    // 1. Format validation
    if (!ALLOWED_TYPES.includes(selectedFile.type.toLowerCase())) {
      const err = "This image format isn't supported. Please use JPG, PNG, or WEBP."
      setErrorMsg(err)
      toast.error(err)
      return
    }

    // 2. File size validation
    if (selectedFile.size > MAX_BYTES) {
      const err = `This image is too large. Maximum allowed size is ${MAX_SIZE_MB}MB.`
      setErrorMsg(err)
      toast.error(err)
      return
    }

    onFileChange(selectedFile)
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0]
    validateAndProcessFile(selected)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const selected = e.dataTransfer.files?.[0]
    validateAndProcessFile(selected)
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setErrorMsg(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileChange(null)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#a39e8f]">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!file && !previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2.5 ${
            dragOver
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-emerald-900/60 bg-[#040a07] hover:border-emerald-500/50 hover:bg-[#06100b]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <Upload size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#f5f2eb]">
              Click to select photo or drag & drop
            </p>
            <p className="text-[11px] font-mono text-[#7a766a] mt-0.5">
              JPG, PNG, or WEBP (Max {MAX_SIZE_MB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#040a07] border border-emerald-900/60 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/40 bg-black shrink-0">
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#f5f2eb] truncate">{file?.name}</p>
            <p className="text-[10px] font-mono text-emerald-400 mt-0.5">
              {formatFileSize(file?.size)}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:underline font-semibold"
              >
                <RefreshCw size={11} /> Change photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 hover:underline font-semibold"
              >
                <X size={11} /> Remove photo
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono mt-1">
          <AlertCircle size={13} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
