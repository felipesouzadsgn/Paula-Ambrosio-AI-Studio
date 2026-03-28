import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Wand2, Image as ImageIcon, Download, Settings2, Loader2, Sparkles, AlertCircle, Eraser, Paintbrush, Undo, Layers, Upload, X, Palette, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Declare global aistudio for TypeScript
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const MATERIAL_LIBRARY = [
  {
    category: 'Stone & Marble',
    items: [
      { name: 'Calacatta Gold', color: '#f4f3f0', border: '#e0dcd3' },
      { name: 'Nero Marquina', color: '#1a1a1a', border: '#333333' },
      { name: 'Travertine', color: '#d2c5b3', border: '#b8a994' },
      { name: 'Green Onyx', color: '#8b9d83', border: '#6c7f64' },
      { name: 'Arabescato', color: '#f0ece1', border: '#d9d3c5' },
      { name: 'Pietra Grey', color: '#5c5c5c', border: '#404040' },
    ]
  },
  {
    category: 'Wood',
    items: [
      { name: 'Walnut', color: '#5c4033', border: '#422c22' },
      { name: 'Smoked Oak', color: '#4a4036', border: '#332b23' },
      { name: 'Ebony', color: '#2b2927', border: '#1a1817' },
      { name: 'White Oak', color: '#c4b092', border: '#a89476' },
      { name: 'Burl Wood', color: '#8a5a32', border: '#6b4526' },
      { name: 'Wenge', color: '#3d2e28', border: '#291e1a' },
    ]
  },
  {
    category: 'Metals',
    items: [
      { name: 'Brushed Brass', color: '#c5a059', border: '#a38242' },
      { name: 'Polished Nickel', color: '#e0e0e0', border: '#c2c2c2' },
      { name: 'Matte Black', color: '#222222', border: '#111111' },
      { name: 'Antique Bronze', color: '#5c4b3a', border: '#423528' },
      { name: 'Rose Gold', color: '#b76e79', border: '#965a63' },
      { name: 'Gunmetal', color: '#4a4a4a', border: '#333333' },
    ]
  },
  {
    category: 'Fabrics & Leather',
    items: [
      { name: 'Bouclé', color: '#f5f5f0', border: '#e0e0d6' },
      { name: 'Silk Velvet', color: '#800020', border: '#5c0017' },
      { name: 'Linen', color: '#e3dac9', border: '#c7bcab' },
      { name: 'Mohair', color: '#a39171', border: '#857559' },
      { name: 'Cashmere', color: '#d4c4b7', border: '#b5a598' },
      { name: 'Saddle Leather', color: '#8b4513', border: '#6b340e' },
    ]
  }
];

export function Editor() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [style, setStyle] = useState('Luxury Modern');

  // Edit State
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'video'>('generate');
  const [editMode, setEditMode] = useState<'replace' | 'remove' | 'style' | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(30);
  const [history, setHistory] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoProgress, setVideoProgress] = useState('');
  
  // Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Reference Image State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceMode, setReferenceMode] = useState<'structure' | 'style' | 'both'>('both');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [extractedMaterials, setExtractedMaterials] = useState<string[]>([]);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [isExtractingMaterials, setIsExtractingMaterials] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [customMaterials, setCustomMaterials] = useState<any[]>([]);
  const [materialDraft, setMaterialDraft] = useState<any | null>(null);

  const displayLibrary = [
    ...MATERIAL_LIBRARY,
    ...(customMaterials.length > 0 ? [{ category: 'Custom Saved', items: customMaterials }] : [])
  ];

  const handleSaveMaterial = () => {
    if (!materialDraft) return;
    setCustomMaterials([...customMaterials, { ...materialDraft, isCustom: true }]);
    setMaterialDraft(null);
  };

  const getMaterialPromptText = (item: any) => {
    if (!item.isCustom) return item.name;
    let sheenText = '';
    if (item.sheen < 30) sheenText = 'matte ';
    else if (item.sheen > 70) sheenText = 'high-gloss ';
    else sheenText = 'satin ';

    let scaleText = '';
    if (item.scale < 30) scaleText = 'fine-grained ';
    else if (item.scale > 70) scaleText = 'large-scale ';

    return `${sheenText}${scaleText}${item.baseName} (tint: ${item.tint})`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (prompt.length > 10 && activeTab === 'generate') {
        fetchSuggestions(prompt, style);
      } else {
        setSuggestions([]);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [prompt, style, activeTab]);

  const fetchSuggestions = async (currentPrompt: string, currentStyle: string) => {
    setIsSuggesting(true);
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      
      const sysInstruction = "You are a luxury Miami interior design assistant. Based on the user's current prompt and chosen style, suggest 3 to 4 short, highly specific, premium design keywords or phrases (2-4 words each) that would enhance their prompt. Return ONLY a JSON array of strings. Example: [\"Calacatta marble\", \"Fluted wood panels\", \"Ambient cove lighting\"]";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Current prompt: "${currentPrompt}"\nStyle: ${currentStyle}`,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });
      
      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'edit' && generatedImage && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab, generatedImage, editMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)'; // Gold mask
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setGeneratedImage(prev);
      setHistory(h => h.slice(0, -1));
      clearMask();
    }
  };

  const checkApiKey = async () => {
    if (window.aistudio) {
      try {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } catch (e) {
        console.error("Error checking API key:", e);
        setHasKey(false);
      }
    } else {
      // Fallback if not in AI Studio environment
      setHasKey(true);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success to mitigate race conditions
        setHasKey(true);
        setError(null);
      } catch (e) {
        console.error("Error selecting API key:", e);
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create a new instance right before the call to ensure fresh key
      // @ts-ignore - API_KEY might be injected at runtime
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key not found. Please select a key.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      let fullPrompt = `High-end luxury interior design, Miami style, ${style} aesthetic. ${prompt}. Photorealistic, architectural photography, 8k resolution, highly detailed, perfect lighting, curated by Paula Ambrosio.`;
      
      if (referenceImage) {
        if (referenceMode === 'structure') {
          fullPrompt += " Use the provided reference image STRICTLY as a structural and compositional guide. Keep the exact layout, furniture placement, and room shape, but completely change the style, materials, and textures to match the requested luxury aesthetic.";
        } else if (referenceMode === 'style') {
          fullPrompt += " Use the provided reference image STRICTLY for its style, color palette, materials, and mood. Apply this aesthetic to the new room described in the prompt, ignoring the original structure.";
        } else {
          fullPrompt += " Use the provided reference image as a strong structural and stylistic guide, adapting it to the requested luxury interior design style while maintaining its core essence.";
        }
      }

      const parts: any[] = [{ text: fullPrompt }];

      if (referenceImage) {
        const base64Data = referenceImage.split(',')[1];
        const mimeType = referenceImage.split(';')[0].split(':')[1];
        parts.push({ inlineData: { data: base64Data, mimeType } });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts },
        config: {
          // @ts-ignore - imageConfig is valid for this model
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        }
      });

      let imageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setHistory(prev => generatedImage ? [...prev, generatedImage] : prev);
        setGeneratedImage(imageUrl);
        setActiveTab('edit');
      } else {
        throw new Error("No image generated. Please try again.");
      }

    } catch (err: any) {
      console.error("Generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key issue. Please select your key again.");
      } else {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!generatedImage || !editMode || !editPrompt) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = generatedImage.split(',')[1];
      const mimeType = generatedImage.split(';')[0].split(':')[1];

      let promptText = '';
      if (editMode === 'replace') {
        promptText = `Replace the masked/highlighted object with: ${editPrompt}. Maintain the surrounding room perfectly.`;
      } else if (editMode === 'remove') {
        promptText = `Remove the masked/highlighted object: ${editPrompt}. Fill in the background cleanly and realistically.`;
      } else if (editMode === 'style') {
        promptText = `Transform the style of this room to: ${editPrompt}. Keep the structural layout the same.`;
      }

      const parts: any[] = [
        { inlineData: { data: base64Data, mimeType } }
      ];

      if (canvasRef.current && (editMode === 'replace' || editMode === 'remove')) {
         const maskData = canvasRef.current.toDataURL('image/png').split(',')[1];
         parts.push({ inlineData: { data: maskData, mimeType: 'image/png' } });
         promptText += " The second image is a mask highlighting the exact area to modify.";
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts }
      });

      let newImageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (newImageUrl) {
        setHistory(prev => [...prev, generatedImage]);
        setGeneratedImage(newImageUrl);
        setEditPrompt('');
        clearMask();
      } else {
        throw new Error("No image generated.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to edit image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    
    setIsVideoGenerating(true);
    setError(null);
    setVideoProgress('Initializing...');
    
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const ai = new GoogleGenAI({ apiKey });

      const config: any = {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
      };

      let operation;

      if (referenceImage) {
        setVideoProgress('Uploading reference image...');
        const base64Data = referenceImage.split(',')[1];
        const mimeType = referenceImage.split(';')[0].split(':')[1];
        
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: videoPrompt,
          image: {
            imageBytes: base64Data,
            mimeType: mimeType,
          },
          config
        });
      } else {
        setVideoProgress('Starting generation...');
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: videoPrompt,
          config
        });
      }

      setVideoProgress('Generating video (this may take a few minutes)...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        setVideoProgress('Fetching video...');
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setGeneratedVideo(videoUrl);
      } else {
        throw new Error("No video generated.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate video.");
    } finally {
      setIsVideoGenerating(false);
      setVideoProgress('');
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
        setExtractedColors([]); // Reset colors on new upload
        setExtractedMaterials([]); // Reset materials
        setAnalysisResult(null); // Reset analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = async () => {
    if (!referenceImage) return;
    setIsExtractingColors(true);
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = referenceImage.split(',')[1];
      const mimeType = referenceImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Analyze this interior design image and extract the 4 most prominent colors. Return ONLY a comma-separated list of hex codes (e.g., #FFFFFF, #000000). Do not include any other text." }
          ]
        }
      });

      const text = response.text || '';
      const colors = text.split(',').map(c => c.trim()).filter(c => c.startsWith('#'));
      if (colors.length > 0) {
        setExtractedColors(colors.slice(0, 4));
        setPrompt(prev => prev.trim() + (prev ? ' ' : '') + `Color palette: ${colors.slice(0, 4).join(', ')}.`);
      }
    } catch (err) {
      console.error("Failed to extract colors:", err);
    } finally {
      setIsExtractingColors(false);
    }
  };

  const extractMaterials = async () => {
    if (!referenceImage) return;
    setIsExtractingMaterials(true);
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = referenceImage.split(',')[1];
      const mimeType = referenceImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Analyze this interior design image and extract the 3 most prominent materials used (e.g., Carrara Marble, Brushed Brass, Walnut Wood). Return ONLY a comma-separated list. Do not include any other text." }
          ]
        }
      });

      const text = response.text || '';
      const materials = text.split(',').map(m => m.trim()).filter(m => m.length > 0);
      if (materials.length > 0) {
        setExtractedMaterials(materials.slice(0, 3));
        setPrompt(prev => prev.trim() + (prev ? ' ' : '') + ` Materials: ${materials.slice(0, 3).join(', ')}.`);
      }
    } catch (err) {
      console.error("Failed to extract materials:", err);
    } finally {
      setIsExtractingMaterials(false);
    }
  };

  const analyzeImage = async () => {
    if (!referenceImage) return;
    setIsAnalyzing(true);
    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setError("API Key not found. Please select a key.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const base64Data = referenceImage.split(',')[1];
      const mimeType = referenceImage.split(';')[0].split(':')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: 'Analyze this interior design image in detail. Describe the architectural style, the lighting, the color palette, the materials used, and the key furniture pieces. Provide a comprehensive breakdown suitable for an interior designer.',
            },
          ],
        },
      });
      
      if (response.text) {
        setAnalysisResult(response.text);
      }
    } catch (err: any) {
      console.error("Failed to analyze image:", err);
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel p-10 rounded-3xl text-center">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-serif mb-4">API Key Required</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            To use the premium Nano Banana PRO 2 image generation model, you need to provide your own Gemini API key with billing enabled.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
          >
            Select API Key
          </button>
          <p className="text-xs text-muted-foreground mt-6">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-primary">
              Learn more about billing
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col lg:flex-row">
      {/* Sidebar / Controls */}
      <div className="w-full lg:w-96 border-r border-border bg-white p-6 flex flex-col h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <h2 className="text-xl font-serif mb-2">Design Studio</h2>
          <div className="flex gap-2 mt-4 p-1 bg-muted rounded-xl">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors ${activeTab === 'generate' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Generate
            </button>
            <button 
              onClick={() => setActiveTab('edit')}
              disabled={!generatedImage}
              className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors ${activeTab === 'edit' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Edit
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors ${activeTab === 'video' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              Video
            </button>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          {activeTab === 'generate' ? (
            <>
              {/* Prompt Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3">Vision Description</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A spacious living room with floor-to-ceiling windows overlooking the ocean, white marble floors, curved velvet sofa..."
                  className="w-full h-32 p-4 bg-muted border border-border rounded-2xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                />
                <AnimatePresence>
                  {(suggestions.length > 0 || isSuggesting) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                    >
                      {isSuggesting ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                          <Sparkles className="w-3 h-3 animate-pulse text-accent" />
                          <span>Curating ideas...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-full flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                            <Sparkles className="w-3 h-3 text-accent" /> AI Suggestions
                          </div>
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => setPrompt(prev => prev.trim() + (prev.endsWith(',') || prev.endsWith('.') ? ' ' : ', ') + s)}
                              className="px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 rounded-full text-xs transition-colors"
                            >
                              + {s}
                            </button>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Aesthetic
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Luxury Modern', 'Minimalist', 'Art Deco', 'Coastal Chic'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`p-3 text-xs rounded-xl border transition-colors ${
                        style === s 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-white border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Library */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Material Library
                </label>
                <div className="space-y-4">
                  {displayLibrary.map((category) => (
                    <div key={category.category}>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        {category.category}
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {category.items.map((item) => (
                          <div key={item.name} className="relative group flex-shrink-0 flex flex-col items-center gap-1.5 w-14">
                            <button
                              onClick={() => {
                                const materialText = getMaterialPromptText(item);
                                if (!prompt.includes(materialText)) {
                                  setPrompt(prev => prev.trim() + (prev.endsWith(',') || prev.endsWith('.') || prev === '' ? ' ' : ', ') + materialText);
                                }
                              }}
                              className="flex flex-col items-center gap-1.5 w-full"
                              title={`Add ${item.name} to prompt`}
                            >
                              <div 
                                className="w-10 h-10 rounded-full border-2 shadow-sm transition-transform group-hover:scale-110"
                                style={{ 
                                  backgroundColor: item.tint || item.color,
                                  borderColor: item.border,
                                  ...(item.isCustom && item.sheen > 70 ? { boxShadow: 'inset 0 10px 15px rgba(255,255,255,0.6)' } : {}),
                                  ...(item.isCustom && item.sheen < 30 ? { filter: 'contrast(0.9) brightness(0.9)' } : {})
                                }}
                              />
                              <span className="text-[9px] text-center text-muted-foreground group-hover:text-primary transition-colors leading-tight truncate w-full">
                                {item.name}
                              </span>
                            </button>
                            
                            {!item.isCustom && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMaterialDraft({
                                    baseName: item.name,
                                    baseColor: item.color,
                                    baseBorder: item.border,
                                    name: `Custom ${item.name}`,
                                    sheen: 50,
                                    scale: 50,
                                    tint: item.color
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-white border border-border rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted hover:text-primary z-10"
                                title="Customize Material"
                              >
                                <Settings2 className="w-3 h-3" />
                              </button>
                            )}
                            {item.isCustom && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCustomMaterials(customMaterials.filter(m => m.name !== item.name));
                                }}
                                className="absolute -top-2 -right-2 bg-white border border-border rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"
                                title="Remove Custom Material"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '1:1', value: '1:1' },
                    { label: '2:3', value: '2:3' },
                    { label: '3:2', value: '3:2' },
                    { label: '3:4', value: '3:4' },
                    { label: '4:3', value: '4:3' },
                    { label: '9:16', value: '9:16' },
                    { label: '16:9', value: '16:9' },
                    { label: '21:9', value: '21:9' }
                  ].map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`py-2 text-xs rounded-xl border transition-colors ${
                        aspectRatio === ratio.value 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-white border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Size */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1K', '2K', '4K'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-2 text-xs rounded-xl border transition-colors ${
                        imageSize === size 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-white border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Image */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Reference Image <span className="text-muted-foreground text-[10px] normal-case tracking-normal">(Optional)</span>
                </label>
                
                {referenceImage ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-muted">
                      <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => {
                          setReferenceImage(null);
                          setExtractedColors([]);
                          setExtractedMaterials([]);
                          setAnalysisResult(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-xl border border-border">
                      <label className="block text-[10px] uppercase tracking-widest font-medium mb-2 text-muted-foreground">
                        Use Reference For
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'structure', label: 'Layout' },
                          { id: 'style', label: 'Style' },
                          { id: 'both', label: 'Both' }
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setReferenceMode(mode.id as any)}
                            className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
                              referenceMode === mode.id 
                                ? 'bg-white shadow-sm text-primary font-medium' 
                                : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Extraction Feature */}
                    <div className="bg-muted p-3 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                          Color Palette
                        </label>
                        {extractedColors.length === 0 && (
                          <button 
                            onClick={extractColors}
                            disabled={isExtractingColors}
                            className="text-[10px] uppercase tracking-widest font-medium text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50"
                          >
                            {isExtractingColors ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Extract
                          </button>
                        )}
                      </div>
                      
                      {extractedColors.length > 0 ? (
                        <div className="flex gap-2 h-8">
                          {extractedColors.map((color, i) => (
                            <div 
                              key={i} 
                              className="flex-1 rounded-md border border-border/50 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          Extract colors to add to your prompt.
                        </div>
                      )}
                    </div>

                    {/* Material Extraction Feature */}
                    <div className="bg-muted p-3 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                          Key Materials
                        </label>
                        {extractedMaterials.length === 0 && (
                          <button 
                            onClick={extractMaterials}
                            disabled={isExtractingMaterials}
                            className="text-[10px] uppercase tracking-widest font-medium text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50"
                          >
                            {isExtractingMaterials ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Extract
                          </button>
                        )}
                      </div>
                      
                      {extractedMaterials.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {extractedMaterials.map((material, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 bg-white border border-border rounded-md text-[10px] uppercase tracking-wider font-medium text-muted-foreground"
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          Extract materials to add to your prompt.
                        </div>
                      )}
                    </div>

                    {/* Analyze Image Feature */}
                    <div className="bg-muted p-3 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                          Image Analysis
                        </label>
                        {!analysisResult && (
                          <button 
                            onClick={analyzeImage}
                            disabled={isAnalyzing}
                            className="text-[10px] uppercase tracking-widest font-medium text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50"
                          >
                            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Analyze
                          </button>
                        )}
                      </div>
                      
                      {analysisResult ? (
                        <div className="text-xs text-muted-foreground leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} />
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          Analyze image to get a detailed breakdown.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors bg-muted/50"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Upload Reference Image</span>
                    <span className="text-xs">JPEG, PNG up to 5MB</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleReferenceUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
            </>
          ) : (
            <>
              {/* Edit Controls */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3">Edit Tool</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'replace', label: 'Replace', icon: <Paintbrush className="w-4 h-4 mb-1" /> },
                    { id: 'remove', label: 'Remove', icon: <Eraser className="w-4 h-4 mb-1" /> },
                    { id: 'style', label: 'Style', icon: <Layers className="w-4 h-4 mb-1" /> }
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setEditMode(tool.id as any)}
                      className={`p-3 text-xs rounded-xl border flex flex-col items-center justify-center transition-colors ${
                        editMode === tool.id 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-white border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {tool.icon}
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              {editMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-medium mb-3">
                      {editMode === 'replace' ? 'What to add?' : editMode === 'remove' ? 'What to remove?' : 'New Style Description'}
                    </label>
                    <textarea 
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder={
                        editMode === 'replace' ? "e.g. A modern leather armchair" : 
                        editMode === 'remove' ? "e.g. The coffee table" : 
                        "e.g. Make it look like a rustic Italian villa"
                      }
                      className="w-full h-24 p-4 bg-muted border border-border rounded-2xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>

                  {(editMode === 'replace' || editMode === 'remove') && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs uppercase tracking-widest font-medium">Brush Size</label>
                        <button onClick={clearMask} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary">Clear Mask</button>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">Draw on the image to mask the area.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
          {activeTab === 'video' && (
            <>
              {/* Video Generation Controls */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3">Video Prompt</label>
                <textarea 
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="e.g. A cinematic pan across a luxury Miami living room, soft morning light..."
                  className="w-full h-32 p-4 bg-muted border border-border rounded-2xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                />
              </div>

              {/* Aspect Ratio for Video */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '16:9 (Landscape)', value: '16:9' },
                    { label: '9:16 (Portrait)', value: '9:16' }
                  ].map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`py-2 text-xs rounded-xl border transition-colors ${
                        aspectRatio === ratio.value 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-white border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Image for Video */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Starting Image <span className="text-muted-foreground text-[10px] normal-case tracking-normal">(Optional)</span>
                </label>
                
                {referenceImage ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-muted">
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setReferenceImage(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors bg-muted/50"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Upload Starting Image</span>
                    <span className="text-xs">JPEG, PNG up to 5MB</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleReferenceUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-6 border-t border-border">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {activeTab === 'generate' ? (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate Design</>
              )}
            </button>
          ) : activeTab === 'edit' ? (
            <button 
              onClick={handleEdit}
              disabled={isGenerating || !editMode || !editPrompt}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Applying Edit...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Apply Edit</>
              )}
            </button>
          ) : (
            <button 
              onClick={handleGenerateVideo}
              disabled={isVideoGenerating || !videoPrompt}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVideoGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {videoProgress || 'Generating Video...'}</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate Video</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 bg-muted/30 p-6 lg:p-12 flex items-center justify-center min-h-[50vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'video' && generatedVideo ? (
            <motion.div 
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white group"
            >
              <video 
                src={generatedVideo} 
                controls
                autoPlay
                loop
                className="w-full h-auto object-contain block"
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = generatedVideo;
                    a.download = `paula-ambrosio-video-${Date.now()}.mp4`;
                    a.click();
                  }}
                  className="p-3 bg-white/90 backdrop-blur-md text-primary rounded-full hover:bg-white transition-colors shadow-lg"
                  title="Download Video"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : generatedImage ? (
            <motion.div 
              key="image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white group"
            >
              <img 
                ref={imageRef}
                src={generatedImage} 
                alt="Generated Interior" 
                className="w-full h-auto object-contain block"
              />
              
              {activeTab === 'edit' && (editMode === 'replace' || editMode === 'remove') && (
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                  style={{ width: '100%', height: '100%' }}
                />
              )}

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {history.length > 0 && (
                  <button 
                    onClick={handleUndo}
                    className="p-3 bg-white/90 backdrop-blur-md text-primary rounded-full hover:bg-white transition-colors shadow-lg"
                    title="Undo Last Edit"
                  >
                    <Undo className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = generatedImage;
                    a.download = `paula-ambrosio-design-${Date.now()}.png`;
                    a.click();
                  }}
                  className="p-3 bg-white/90 backdrop-blur-md text-primary rounded-full hover:bg-white transition-colors shadow-lg"
                  title="Download High-Res"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-serif mb-2">Canvas Ready</h3>
              <p className="text-muted-foreground text-sm font-light">
                {activeTab === 'video' 
                  ? "Describe your vision or upload a starting image to generate a cinematic video."
                  : "Describe your vision in the studio panel to generate a high-end interior design concept."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Material Customization Modal */}
      <AnimatePresence>
        {materialDraft && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif">Customize Material</h3>
                <button onClick={() => setMaterialDraft(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div 
                  className="w-24 h-24 rounded-full border-4 shadow-lg mb-4 transition-all duration-300"
                  style={{ 
                    backgroundColor: materialDraft.tint,
                    borderColor: materialDraft.baseBorder,
                    boxShadow: materialDraft.sheen > 70 ? 'inset 0 15px 25px rgba(255,255,255,0.6), 0 10px 25px rgba(0,0,0,0.1)' : '0 10px 25px rgba(0,0,0,0.1)',
                    filter: materialDraft.sheen < 30 ? 'contrast(0.9) brightness(0.9)' : 'none'
                  }}
                />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Virtual Swatch</span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium mb-2">Material Name</label>
                  <input 
                    type="text" 
                    value={materialDraft.name}
                    onChange={(e) => setMaterialDraft({...materialDraft, name: e.target.value})}
                    className="w-full p-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <label className="font-medium">Sheen</label>
                    <span className="text-muted-foreground">{materialDraft.sheen < 30 ? 'Matte' : materialDraft.sheen > 70 ? 'Glossy' : 'Satin'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={materialDraft.sheen}
                    onChange={(e) => setMaterialDraft({...materialDraft, sheen: parseInt(e.target.value)})}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <label className="font-medium">Texture Scale</label>
                    <span className="text-muted-foreground">{materialDraft.scale < 30 ? 'Fine' : materialDraft.scale > 70 ? 'Large' : 'Standard'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={materialDraft.scale}
                    onChange={(e) => setMaterialDraft({...materialDraft, scale: parseInt(e.target.value)})}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2">Color Tint</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={materialDraft.tint}
                      onChange={(e) => setMaterialDraft({...materialDraft, tint: e.target.value})}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <div className="flex-1 p-2.5 bg-muted border border-border rounded-xl text-sm flex items-center text-muted-foreground uppercase">
                      {materialDraft.tint}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveMaterial}
                className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-xl text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Material
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
