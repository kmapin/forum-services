import React, { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Image, Code, Quote, Heading1, Heading2, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onImageUpload,
  placeholder = 'Commencez à écrire...'
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      const url = await onImageUpload(file);
      insertMarkdown(`![${file.name}](${url})`);
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  };

  const toolbarButtons = [
    { icon: <Heading1 size={18} />, action: () => insertMarkdown('# ', '', 'Titre 1'), title: 'Titre 1' },
    { icon: <Heading2 size={18} />, action: () => insertMarkdown('## ', '', 'Titre 2'), title: 'Titre 2' },
    { icon: <Bold size={18} />, action: () => insertMarkdown('**', '**', 'texte en gras'), title: 'Gras' },
    { icon: <Italic size={18} />, action: () => insertMarkdown('*', '*', 'texte en italique'), title: 'Italique' },
    { icon: <List size={18} />, action: () => insertMarkdown('\n- ', '', 'élément de liste'), title: 'Liste' },
    { icon: <ListOrdered size={18} />, action: () => insertMarkdown('\n1. ', '', 'élément numéroté'), title: 'Liste numérotée' },
    { icon: <Link size={18} />, action: () => insertMarkdown('[', '](url)', 'texte du lien'), title: 'Lien' },
    { icon: <Code size={18} />, action: () => insertMarkdown('`', '`', 'code'), title: 'Code' },
    { icon: <Quote size={18} />, action: () => insertMarkdown('\n> ', '', 'citation'), title: 'Citation' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Image Upload */}
        {onImageUpload && (
          <label className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Insérer une image">
            <Image size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`p-2 rounded transition-colors ${showPreview ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-200'}`}
          title={showPreview ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="grid" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
        {/* Editor */}
        <div className={showPreview ? 'border-r border-gray-300' : ''}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 font-mono text-sm resize-none focus:outline-none min-h-[400px]"
            style={{ height: '400px' }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="p-4 bg-gray-50 overflow-auto" style={{ height: '400px' }}>
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:text-pink-600 prose-code:bg-pink-50 prose-pre:bg-gray-800 prose-a:text-teal-600 prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2 prose-td:border prose-td:border-gray-300 prose-td:p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || '*Aperçu vide*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        Utilisez la syntaxe Markdown pour formater le texte. 
        <a 
          href="https://www.markdownguide.org/basic-syntax/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 ml-1"
        >
          Guide Markdown
        </a>
      </div>
    </div>
  );
};
