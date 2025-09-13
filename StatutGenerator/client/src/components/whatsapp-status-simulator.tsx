import { forwardRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { StatusConfig, GeneratedName } from "@shared/schema";

interface WhatsAppStatusSimulatorProps {
  config: StatusConfig;
  viewers: GeneratedName[];
}

const WhatsAppStatusSimulator = forwardRef<HTMLDivElement, WhatsAppStatusSimulatorProps>(
  ({ config, viewers }, ref) => {
    const formatViewCount = (count: number) => {
      return count.toLocaleString();
    };

    const getStatusBackgroundClass = (type: string) => {
      return `status-${type}`;
    };

    return (
      <div ref={ref} className="bg-white rounded-xl shadow-lg overflow-hidden" data-testid="whatsapp-simulator">
        {/* WhatsApp Header */}
        <div className="bg-whatsapp-dark px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-arrow-left text-lg" data-testid="back-button"></i>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                  alt="Photo de profil" 
                  className="w-8 h-8 rounded-full object-cover"
                  data-testid="profile-photo"
                />
              </div>
              <div>
                <div className="font-medium text-sm" data-testid="status-title">Mon Statut</div>
                <div className="text-xs opacity-75">Aujourd'hui, 14:32</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-ellipsis-v text-lg" data-testid="menu-button"></i>
            </div>
          </div>
        </div>

        {/* Status Display Area */}
        <div className="whatsapp-bg min-h-[500px] flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm mx-auto">
            {/* Status Background */}
            <div 
              className={`${config.statusType === 'image' ? '' : getStatusBackgroundClass(config.backgroundType)} rounded-xl aspect-[9/16] flex flex-col text-white shadow-lg overflow-hidden relative`}
              data-testid="status-background"
            >
              {/* Image Status Display */}
              {config.statusType === 'image' && config.statusImage && (
                <>
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${config.statusImage})` }}
                    data-testid="status-uploaded-image"
                  />
                </>
              )}
              
              {/* Text Status Display */}
              {config.statusType === 'text' && config.statusText && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="space-y-2 text-center">
                    <div className="text-2xl font-medium" data-testid="status-text-display">
                      {config.statusText.split('\n')[0] || 'Votre message...'}
                    </div>
                    {config.statusText.split('\n').slice(1).map((line, index) => (
                      <div key={index} className="text-sm opacity-90">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Default Display */}
              {((config.statusType === 'text' && !config.statusText) || 
                (config.statusType === 'image' && !config.statusImage) || 
                (!config.statusType)) && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-2xl font-medium text-center" data-testid="status-default-text">
                    {config.statusType === 'image' ? 'Ajouter une image...' : 'Votre message...'}
                  </div>
                </div>
              )}
            </div>

            {/* Status Info Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-2">
                <i className="fas fa-eye text-xs"></i>
                <span data-testid="view-count-display">{formatViewCount(config.viewCount)}</span>
              </div>
              <div className="text-xs opacity-75">il y a 2h</div>
            </div>
          </div>
        </div>

        {/* Viewers Section */}
        <div className="bg-white p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <i className="fas fa-eye text-gray-600"></i>
              <span className="font-medium text-gray-900">Vu par</span>
              <span 
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm" 
                data-testid="viewer-count-badge"
              >
                {formatViewCount(config.viewCount)}
              </span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-whatsapp-green text-sm font-medium" data-testid="view-all-button">
                  Voir tout
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left flex items-center space-x-2">
                    <i className="fas fa-eye text-gray-600"></i>
                    <span>Vu par {formatViewCount(config.viewCount)} personnes</span>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Viewers List in Sheet */}
                <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-hide" data-testid="viewers-list">
                  <div className="space-y-2">
                    {viewers.map((viewer, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0" data-testid={`viewer-item-${index}`}>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img 
                              src={viewer.avatar} 
                              alt="Avatar" 
                              className="w-12 h-12 rounded-full object-cover bg-white"
                              data-testid={`viewer-avatar-${index}`}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900" data-testid={`viewer-name-${index}`}>
                              {viewer.name}
                            </div>
                            <div className="text-xs text-gray-500">{viewer.timeAgo}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {viewer.hasReacted && (
                            <>
                              <i className="fas fa-heart text-red-500 text-sm"></i>
                              <span className="text-xs text-gray-500" data-testid={`viewer-reaction-${index}`}>
                                {viewer.reaction}
                              </span>
                            </>
                          )}
                          {!viewer.hasReacted && (
                            <span className="text-xs text-gray-400">👀</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    );
  }
);

WhatsAppStatusSimulator.displayName = "WhatsAppStatusSimulator";

export default WhatsAppStatusSimulator;
