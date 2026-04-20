import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Layout, ChevronDown } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onSend?: () => void;
  onOptimize?: () => void;
  onTemplateSelect?: (template: string) => void;
  isOptimizing?: boolean;
  disabled?: boolean;
  isTypeSelected?: boolean;
  hideGenerate?: boolean;
}

const InputArea = ({
  value,
  onChange,
  placeholder,
  onSend,
  onOptimize,
  onTemplateSelect,
  isOptimizing,
  disabled,
  isTypeSelected = false,
  hideGenerate = false,
}: InputAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const [showTemplates, setShowTemplates] = React.useState(false);

  const templates = [
    { name: 'Sembuh Penyakit', value: 'Alhamdulillah, hari ini ada testimoni dari mitra/konsumen yang sudah ikhtiar dengan BP selama [DURASI]. Keluhan [PENYAKIT] yang diderita selama ini [HASILNYA].' },
    { name: 'Income Tambahan', value: 'MasyaAllah Tabarakallah, barusan ada yang japri tanya gimana cara join kemitraan BP. Ternyata banyak yang butuh income tambahan di tengah kesibukan [PEKERJAAN].' },
    { name: 'Mata Lelah/Fokus', value: 'Sering merasa mata lelah atau sulit fokus saat bekerja di depan layar? Kita harus waspada, itu tanda butuh asupan nutrisi otak yang tepat. BP Green solusinya!' },
    { name: 'Daily Health', value: 'Pernah nggak ngerasa badan gampang capek padahal aktivitas nggak terlalu berat? Mungkin imun kita lagi drop. Yuk biasakan minum BP 1 tetes per 10kg BB setiap pagi.' }
  ];

  return (
    <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-sm transition-all focus-within:ring-4 focus-within:ring-[#007A6E]/5 focus-within:border-[#00A896]/30">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e);
          adjustHeight();
        }}
        placeholder={placeholder}
        disabled={disabled || isOptimizing}
        rows={3}
        className={`
          w-full bg-transparent border-none outline-none 
          text-[16px] text-[#1C1C1E] 
          placeholder:text-[#CED4DA]
          resize-none overflow-hidden
          disabled:opacity-50 font-sans leading-relaxed
        `.trim()}
      />
      
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-[#F7F6F2] gap-4">
        <div className="flex w-full sm:w-auto gap-3 relative">
          <button 
            type="button"
            onClick={onOptimize}
            disabled={disabled || isOptimizing || !value.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#F7F6F2] border border-[#E8E5DF] rounded-full text-[11px] font-bold text-[#3D3D3D] hover:bg-[#E0F5F2] hover:text-[#00A896] transition-all disabled:opacity-30"
          >
            {isOptimizing ? (
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="animate-spin text-[#00A896]" />
                Optimizing...
              </span>
            ) : (
              <>
                <Sparkles size={12} className="text-[#00A896]" /> Optimize Prompt
              </>
            )}
          </button>
          
          <div className="relative flex-1 sm:flex-none">
            <button 
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              disabled={disabled || isOptimizing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8E5DF] rounded-full text-[11px] font-bold text-[#9B8EA0] hover:bg-[#F7F6F2] hover:text-[#1C1C1E] transition-all disabled:opacity-30"
            >
              <Layout size={12} /> Templates <ChevronDown size={10} className={`transition-transform duration-200 ${showTemplates ? 'rotate-180' : ''}`} />
            </button>
            
            {showTemplates && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                <div className="absolute left-0 bottom-full mb-3 w-64 bg-white border border-[#E8E5DF] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-3 border-b border-[#F7F6F2] bg-[#F7F6F2]/50">
                    <span className="text-[10px] font-bold text-[#9B8EA0] uppercase tracking-widest px-1">Blueprint Templates</span>
                  </div>
                  <div className="py-2">
                    {templates.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => {
                          onTemplateSelect?.(tpl.value);
                          setShowTemplates(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[12px] hover:bg-[#F7F6F2] hover:text-[#00A896] transition-colors font-medium text-[#3D3D3D]"
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {!hideGenerate && (
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            {!isTypeSelected && value.trim() && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full animate-bounce">
                <Sparkles size={10} className="text-amber-500" />
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                  Almost there! Select a type above
                </span>
              </div>
            )}
            <button
              onClick={onSend}
              disabled={disabled || isOptimizing || !value.trim() || !isTypeSelected}
              className={`
                w-full sm:w-auto
                h-[44px] px-10 flex items-center justify-center gap-3
                ${!isTypeSelected || !value.trim()
                  ? 'bg-[#E8E5DF] text-[#9B8EA0] cursor-not-allowed shadow-none'
                  : 'bg-[#00A896] hover:bg-[#008A7B] text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                }
                rounded-full font-black text-[12px] uppercase tracking-[0.1em]
                transition-all duration-300
                disabled:opacity-40
              `.trim()}
            >
              Generate Story <Send size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputArea;
