import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { captureScreenshot } from "@/lib/screenshot";
import type { StatusConfig, GeneratedName, GenerateNamesRequest } from "@shared/schema";

interface WhatsAppControlPanelProps {
  config: StatusConfig;
  viewers: GeneratedName[];
  onConfigUpdate: (updates: Partial<StatusConfig>) => void;
  onViewersUpdate: (viewers: GeneratedName[]) => void;
  onRemoveViewer: (index: number) => void;
  onUpdateViewerName: (index: number, name: string) => void;
}

const backgroundGradients = [
  { id: "gradient-1", class: "status-gradient-1" },
  { id: "gradient-2", class: "status-gradient-2" },
  { id: "gradient-3", class: "status-gradient-3" },
  { id: "gradient-4", class: "status-gradient-4" },
  { id: "gradient-5", class: "status-gradient-5" },
  { id: "gradient-6", class: "status-gradient-6" },
];

export default function WhatsAppControlPanel({
  config,
  viewers,
  onConfigUpdate,
  onViewersUpdate,
  onRemoveViewer,
  onUpdateViewerName
}: WhatsAppControlPanelProps) {
  const [nameType, setNameType] = useState<'french' | 'creole' | 'international' | 'mixed'>('french');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [isExportingHTML, setIsExportingHTML] = useState(false);
  const { toast } = useToast();

  const generateNamesMutation = useMutation({
    mutationFn: async (request: GenerateNamesRequest) => {
      const response = await apiRequest("POST", "/api/generate-names", request);
      return response.json();
    },
    onSuccess: (data) => {
      onViewersUpdate(data.names);
      toast({
        title: "Noms générés",
        description: `${data.names.length} noms ont été générés avec succès.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de générer les noms. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleViewCountChange = (value: string) => {
    const count = parseInt(value) || 0;
    onConfigUpdate({ viewCount: count });
  };

  const handleStatusTextChange = (value: string) => {
    onConfigUpdate({ statusText: value });
  };

  const handleBackgroundChange = (backgroundId: string) => {
    onConfigUpdate({ backgroundType: backgroundId });
  };

  const handleGenerateNames = () => {
    const count = Math.min(Math.max(config.viewCount, 1), 50);
    generateNamesMutation.mutate({
      count: Math.min(count, 20), // Limit to 20 for display
      type: nameType,
    });
  };

  const handleClearNames = () => {
    onViewersUpdate([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 5 MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        onConfigUpdate({ 
          statusImage: imageData,
          statusType: 'image',
          imageName: file.name
        });
        toast({
          title: "Image uploadée",
          description: "L'image a été ajoutée au statut.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onConfigUpdate({ 
      statusImage: undefined, 
      imageName: undefined,
      statusType: 'text' 
    });
    toast({
      title: "Image supprimée",
      description: "L'image a été retirée du statut.",
    });
  };

  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    setCaptureProgress(0);
    
    try {
      toast({
        title: "Capture en cours",
        description: "Génération de la capture d'écran...",
      });

      await captureScreenshot({
        onStart: () => {
          setCaptureProgress(5);
        },
        onProgress: (progress) => {
          setCaptureProgress(progress);
        },
        onComplete: () => {
          setCaptureProgress(100);
          toast({
            title: "Capture réussie",
            description: "La capture d'écran a été téléchargée avec succès.",
          });
        },
        onError: (error) => {
          throw error;
        },
        quality: 0.95,
        scale: 1.5
      });
    } catch (error) {
      toast({
        title: "Erreur de capture",
        description: "Impossible de capturer l'écran. Veuillez réessayer.",
        variant: "destructive",
      });
      setCaptureProgress(0);
    } finally {
      setIsCapturing(false);
      // Reset progress after a delay
      setTimeout(() => setCaptureProgress(0), 2000);
    }
  };

  const handleExportHTML = async () => {
    setIsExportingHTML(true);
    
    try {
      toast({
        title: "Export en cours",
        description: "Génération du fichier HTML...",
      });

      const element = document.querySelector('[data-testid="whatsapp-simulator"]');
      if (!element) {
        throw new Error('Élément non trouvé');
      }

      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get styles from the page to include in HTML
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Status</title>
  <style>${styles}</style>
</head>
<body>
  ${element.outerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Better filename with timestamp
      const timestamp = new Date();
      const dateStr = timestamp.toISOString().split('T')[0];
      const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
      a.download = `whatsapp-status-${dateStr}-${timeStr}.html`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Le fichier HTML a été téléchargé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le fichier HTML. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsExportingHTML(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Type Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-layer-group text-whatsapp-green mr-2"></i>
          Type de statut
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onConfigUpdate({ statusType: 'text' })}
            variant={config.statusType === 'text' ? 'default' : 'outline'}
            className={`flex items-center justify-center space-x-2 ${
              config.statusType === 'text' 
                ? 'bg-whatsapp-green text-white hover:bg-whatsapp-dark' 
                : 'border-2 hover:border-whatsapp-green'
            }`}
            data-testid="button-status-type-text"
          >
            <i className="fas fa-font"></i>
            <span>Texte</span>
          </Button>
          <Button
            onClick={() => onConfigUpdate({ statusType: 'image' })}
            variant={config.statusType === 'image' ? 'default' : 'outline'}
            className={`flex items-center justify-center space-x-2 ${
              config.statusType === 'image' 
                ? 'bg-whatsapp-green text-white hover:bg-whatsapp-dark' 
                : 'border-2 hover:border-whatsapp-green'
            }`}
            data-testid="button-status-type-image"
          >
            <i className="fas fa-image"></i>
            <span>Image</span>
          </Button>
        </div>
      </div>

      {/* Views Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-eye text-whatsapp-green mr-2"></i>
          Configuration des vues
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="viewsInput" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de vues
            </Label>
            <Input
              id="viewsInput"
              type="number"
              value={config.viewCount}
              onChange={(e) => handleViewCountChange(e.target.value)}
              placeholder="1247"
              data-testid="input-view-count"
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Format d'affichage
            </Label>
            <Select defaultValue="exact">
              <SelectTrigger data-testid="select-view-format">
                <SelectValue placeholder="Choisir le format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Nombre exact (1,247)</SelectItem>
                <SelectItem value="abbreviated">Abrégé (1.2K)</SelectItem>
                <SelectItem value="thousands">Milliers (1K+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Name Generator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-users text-whatsapp-green mr-2"></i>
          Générateur de noms
        </h3>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateNames}
              disabled={generateNamesMutation.isPending}
              className="flex-1 bg-whatsapp-green text-white hover:bg-whatsapp-dark"
              data-testid="button-generate-names"
            >
              <i className="fas fa-refresh mr-2"></i>
              {generateNamesMutation.isPending ? "Génération..." : "Générer noms"}
            </Button>
            <Button
              onClick={handleClearNames}
              variant="outline"
              data-testid="button-clear-names"
            >
              <i className="fas fa-trash"></i>
            </Button>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Type de noms
            </Label>
            <Select value={nameType} onValueChange={(value: any) => setNameType(value)}>
              <SelectTrigger data-testid="select-name-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="creole">Créole Haïtien</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="mixed">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Editor */}
          <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide" data-testid="name-editor">
            {viewers.map((viewer, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Input
                  value={viewer.name}
                  onChange={(e) => onUpdateViewerName(index, e.target.value)}
                  className="flex-1 text-sm border-none bg-transparent focus:outline-none"
                  data-testid={`input-viewer-name-${index}`}
                />
                <Button
                  onClick={() => onRemoveViewer(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`button-remove-viewer-${index}`}
                >
                  <i className="fas fa-times text-xs"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-palette text-whatsapp-green mr-2"></i>
          Arrière-plan du statut
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {backgroundGradients.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleBackgroundChange(bg.id)}
              className={`${bg.class} w-full h-16 rounded-lg border-2 shadow-sm transition-all ${
                config.backgroundType === bg.id 
                  ? 'border-whatsapp-green' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              data-testid={`button-background-${bg.id}`}
            />
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-image text-whatsapp-green mr-2"></i>
          Image du statut
        </h3>
        
        <div className="space-y-4">
          {config.statusImage ? (
            <div className="space-y-3">
              <div className="relative">
                <img 
                  src={config.statusImage} 
                  alt="Status preview" 
                  className="w-full h-32 object-cover rounded-lg border"
                  data-testid="image-preview"
                />
                <Button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full"
                  data-testid="button-remove-image"
                >
                  <i className="fas fa-times text-xs"></i>
                </Button>
              </div>
              <Button
                onClick={() => document.getElementById('image-upload')?.click()}
                variant="outline"
                className="w-full"
                data-testid="button-change-image"
              >
                <i className="fas fa-sync mr-2"></i>
                Changer l'image
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
              className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-whatsapp-green transition-colors"
              data-testid="button-upload-image"
            >
              <div className="text-center">
                <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                <div className="text-gray-600">Ajouter une image</div>
                <div className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</div>
              </div>
            </Button>
          )}
          
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            data-testid="input-image-upload"
          />
        </div>
      </div>

      {/* Status Text Editor */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-edit text-whatsapp-green mr-2"></i>
          Texte du statut
        </h3>
        
        <Textarea
          value={config.statusText}
          onChange={(e) => handleStatusTextChange(e.target.value)}
          className="w-full resize-none"
          rows={3}
          placeholder="Tapez votre message de statut..."
          data-testid="textarea-status-text"
        />
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-download text-whatsapp-green mr-2"></i>
          Export
        </h3>
        
        <div className="space-y-4">
          {/* Progress indicator for capture */}
          {(isCapturing || captureProgress > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progression de la capture</span>
                <span>{Math.round(captureProgress)}%</span>
              </div>
              <Progress value={captureProgress} className="w-full" data-testid="progress-capture" />
            </div>
          )}
          
          <Button
            onClick={handleCaptureScreenshot}
            disabled={isCapturing || isExportingHTML}
            className="w-full bg-whatsapp-green text-white hover:bg-whatsapp-dark disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-capture-screenshot"
          >
            {isCapturing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Capture en cours...
              </>
            ) : (
              <>
                <i className="fas fa-camera mr-2"></i>
                Capturer l'écran
              </>
            )}
          </Button>
          
          <Button
            onClick={handleExportHTML}
            disabled={isCapturing || isExportingHTML}
            variant="outline"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-export-html"
          >
            {isExportingHTML ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Export en cours...
              </>
            ) : (
              <>
                <i className="fas fa-code mr-2"></i>
                Exporter HTML
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
