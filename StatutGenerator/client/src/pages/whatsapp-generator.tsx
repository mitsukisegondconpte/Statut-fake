import { useState } from "react";
import WhatsAppStatusSimulator from "@/components/whatsapp-status-simulator";
import WhatsAppControlPanel from "@/components/whatsapp-control-panel";
import type { StatusConfig, GeneratedName } from "@shared/schema";

export default function WhatsAppGenerator() {
  const [config, setConfig] = useState<StatusConfig>({
    viewCount: 1247,
    statusType: 'text',
    statusText: "Bonsoir tout le monde! 🌟\n\nPassez une excellente soirée",
    backgroundType: "gradient-1",
    viewerNames: [],
    statusImage: undefined,
    imageName: undefined
  });

  const [viewers, setViewers] = useState<GeneratedName[]>([
    {
      name: "Marie Dubois",
      hasReacted: true,
      reaction: "❤️",
      timeAgo: "il y a 5 min",
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Jean Martin",
      hasReacted: true,
      reaction: "👍",
      timeAgo: "il y a 12 min",
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sophie Laurent",
      hasReacted: false,
      reaction: "",
      timeAgo: "il y a 18 min",
      isOnline: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const updateConfig = (updates: Partial<StatusConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateViewers = (newViewers: GeneratedName[]) => {
    setViewers(newViewers);
  };

  const removeViewer = (index: number) => {
    setViewers(prev => prev.filter((_, i) => i !== index));
  };

  const updateViewerName = (index: number, newName: string) => {
    setViewers(prev => prev.map((viewer, i) => 
      i === index ? { ...viewer, name: newName } : viewer
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-whatsapp-green rounded-lg flex items-center justify-center">
                <i className="fab fa-whatsapp text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Générateur Statut WhatsApp</h1>
            </div>
            <div className="text-sm text-gray-500">v2.25.22.80</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <WhatsAppStatusSimulator 
              config={config}
              viewers={viewers}
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <WhatsAppControlPanel
              config={config}
              viewers={viewers}
              onConfigUpdate={updateConfig}
              onViewersUpdate={updateViewers}
              onRemoveViewer={removeViewer}
              onUpdateViewerName={updateViewerName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
