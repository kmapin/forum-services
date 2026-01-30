import React, { useState } from 'react';
import { Upload, X, File, Image as ImageIcon, Music, Video as VideoIcon, Loader } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface MediaUploaderProps {
  courseId: string;
  onUploadComplete: (url: string, type: 'image' | 'audio' | 'video') => void;
  acceptedTypes?: 'image' | 'audio' | 'video' | 'all';
  label?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  courseId,
  onUploadComplete,
  acceptedTypes = 'all',
  label = 'Télécharger un fichier'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getAcceptString = () => {
    switch (acceptedTypes) {
      case 'image':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      case 'video':
        return 'video/*';
      default:
        return 'image/*,audio/*,video/*';
    }
  };

  const getMediaType = (file: File): 'image' | 'audio' | 'video' | null => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return null;
  };

  const getStoragePath = (type: 'image' | 'audio' | 'video', fileName: string) => {
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `courses/${courseId}/${type}s/${timestamp}_${sanitizedName}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = getMediaType(file);
    if (!mediaType) {
      setError('Type de fichier non supporté');
      return;
    }

    // Vérifier la taille du fichier (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux (max 50MB)');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const filePath = getStoragePath(mediaType, file.name);

      // Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('learning-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('learning-content')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      onUploadComplete(publicUrl, mediaType);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err: any) {
      console.error('Erreur upload:', err);
      setError(err.message || 'Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  const getIcon = () => {
    switch (acceptedTypes) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'audio':
        return <Music size={20} />;
      case 'video':
        return <VideoIcon size={20} />;
      default:
        return <Upload size={20} />;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <div className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${uploading 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-300 hover:border-teal-500 hover:bg-teal-50'
          }
        `}>
          <input
            type="file"
            accept={getAcceptString()}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader className="animate-spin text-teal-600" size={32} />
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Upload en cours... {uploadProgress}%</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full">
                  {getIcon()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptedTypes === 'image' && 'PNG, JPG, GIF jusqu\'à 50MB'}
                    {acceptedTypes === 'audio' && 'MP3, WAV, OGG jusqu\'à 50MB'}
                    {acceptedTypes === 'video' && 'MP4, WEBM jusqu\'à 50MB'}
                    {acceptedTypes === 'all' && 'Images, Audio, Vidéo jusqu\'à 50MB'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <X className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-red-800">Erreur d'upload</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Les fichiers sont stockés de manière sécurisée et optimisés pour un chargement rapide.
        </p>
      </div>
    </div>
  );
};
