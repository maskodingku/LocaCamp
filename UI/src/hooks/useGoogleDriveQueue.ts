import { useState, useRef, useCallback, useEffect } from 'react'
import type { DriveQueueItem } from '../types/drive'
import type { useGoogleDrive } from './useGoogleDrive'
import { markPhotoAsUploadedToDrive } from '../utils/photoStorage'

interface UseGoogleDriveQueueProps {
  drive: ReturnType<typeof useGoogleDrive>
  onPhotoUploaded?: (photoId: string, fileId: string) => void
}

export interface DriveQueueStats {
  isProcessing: boolean
  total: number
  completed: number
  failed: number
  remaining: number
  percent: number
  activeCount: number
}

export function useGoogleDriveQueue({ drive, onPhotoUploaded }: UseGoogleDriveQueueProps) {
  const [queue, setQueue] = useState<DriveQueueItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const queueRef = useRef<DriveQueueItem[]>([])
  queueRef.current = queue

  const isProcessingRef = useRef(false)
  isProcessingRef.current = isProcessing

  const activeWorkersRef = useRef(0)
  const isCancelledRef = useRef(false)

  const concurrency = Math.min(4, Math.max(1, drive.config.concurrency || 2))

  // Worker loop yang memproses antrian sesuai batas concurrency
  const processNext = useCallback(async () => {
    if (isCancelledRef.current) return
    if (!drive.isConnected || !drive.session.accessToken) {
      setIsProcessing(false)
      return
    }

    // Ambil item berikutnya yang berstatus 'pending'
    const nextItem = queueRef.current.find(item => item.status === 'pending')
    if (!nextItem) {
      // Jika tidak ada lagi item pending dan tidak ada worker yang berjalan, selesai
      if (activeWorkersRef.current === 0) {
        setIsProcessing(false)
      }
      return
    }

    // Tandai item sedang diproses
    nextItem.status = 'uploading'
    setQueue(prev => prev.map(it => (it.id === nextItem.id ? { ...it, status: 'uploading' } : it)))
    activeWorkersRef.current += 1

    try {
      const filename = nextItem.filename || `LocaCamp_${nextItem.id}.jpg`
      const res = await drive.uploadPhoto(nextItem.dataUrl, filename, (pct) => {
        setQueue(prev =>
          prev.map(it => (it.id === nextItem.id ? { ...it, progress: pct } : it))
        )
      })

      if (res && res.fileId) {
        // Catat ke IndexedDB
        await markPhotoAsUploadedToDrive(nextItem.id, res.fileId)
        onPhotoUploaded?.(nextItem.id, res.fileId)

        setQueue(prev =>
          prev.map(it =>
            it.id === nextItem.id
              ? { ...it, status: 'completed', progress: 100 }
              : it
          )
        )
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal upload'
      setQueue(prev =>
        prev.map(it =>
          it.id === nextItem.id
            ? { ...it, status: 'error', error: msg }
            : it
        )
      )
    } finally {
      activeWorkersRef.current -= 1
      // Lanjutkan ke antrian berikutnya jika belum dibatalkan
      if (!isCancelledRef.current) {
        processNext()
      }
    }
  }, [drive, concurrency, onPhotoUploaded])

  // Menjalankan workers hingga batas concurrency
  const kickOffWorkers = useCallback(() => {
    isCancelledRef.current = false
    setIsProcessing(true)

    const availableSlots = concurrency - activeWorkersRef.current
    for (let i = 0; i < availableSlots; i++) {
      processNext()
    }
  }, [concurrency, processNext])

  // Tambahkan sejumlah foto ke dalam antrian (bulk upload)
  const enqueuePhotos = useCallback(
    (photos: Array<{ id: string; dataUrl: string; filename?: string }>) => {
      if (!photos || photos.length === 0) return

      setQueue(prev => {
        // Hindari duplikasi ID yang sudah ada di antrian (baik pending atau uploading)
        const existingIds = new Set(prev.map(it => it.id))
        const newItems: DriveQueueItem[] = photos
          .filter(p => !existingIds.has(p.id))
          .map(p => ({
            id: p.id,
            dataUrl: p.dataUrl,
            filename: p.filename || `LocaCamp_${p.id}.jpg`,
            status: 'pending',
            progress: 0,
          }))

        const combined = [...prev, ...newItems]
        queueRef.current = combined
        return combined
      })

      // Mulai proses
      setTimeout(() => {
        kickOffWorkers()
      }, 50)
    },
    [kickOffWorkers]
  )

  // Tambahkan satu foto ke dalam antrian (misal hasil jepretan baru)
  const enqueueSinglePhoto = useCallback(
    (photo: { id: string; dataUrl: string; filename?: string }) => {
      enqueuePhotos([photo])
    },
    [enqueuePhotos]
  )

  // Batalkan / bersihkan sisa antrian
  const cancelQueue = useCallback(() => {
    isCancelledRef.current = true
    setQueue(prev => prev.filter(it => it.status !== 'pending'))
    setIsProcessing(false)
  }, [])

  // Bersihkan riwayat antrian yang sudah selesai
  const clearCompleted = useCallback(() => {
    setQueue(prev => prev.filter(it => it.status !== 'completed'))
  }, [])

  // Perhitungan statistik real-time
  const total = queue.length
  const completed = queue.filter(it => it.status === 'completed').length
  const failed = queue.filter(it => it.status === 'error').length
  const remaining = queue.filter(it => it.status === 'pending' || it.status === 'uploading').length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats: DriveQueueStats = {
    isProcessing,
    total,
    completed,
    failed,
    remaining,
    percent,
    activeCount: activeWorkersRef.current,
  }

  // Jika antrian selesai dan semua berhasil, bersihkan otomatis setelah jeda
  useEffect(() => {
    if (!isProcessing && total > 0 && remaining === 0) {
      const timer = setTimeout(() => {
        setQueue([])
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isProcessing, total, remaining])

  return {
    queue,
    isProcessing,
    stats,
    concurrency,
    enqueuePhotos,
    enqueueSinglePhoto,
    cancelQueue,
    clearCompleted,
  }
}
