interface CaptureOptions {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  quality?: number;
  scale?: number;
}

export async function captureScreenshot(options: CaptureOptions = {}): Promise<void> {
  const {
    onProgress,
    onStart,
    onComplete,
    onError,
    quality = 0.9,
    scale = 1.5
  } = options;

  try {
    onStart?.();
    onProgress?.(10);

    // Dynamic import to avoid SSR issues
    const html2canvas = await import('html2canvas');
    onProgress?.(20);
    
    const element = document.querySelector('[data-testid="whatsapp-simulator"]') as HTMLElement;
    if (!element) {
      throw new Error('Element not found');
    }

    onProgress?.(30);

    // Optimized options for better performance
    const canvas = await html2canvas.default(element, {
      backgroundColor: '#ffffff',
      scale: scale, // Reduced from 2 to 1.5 for better performance
      useCORS: true,
      allowTaint: true,
      // Removed foreignObjectRendering for better performance
      logging: false, // Disable logging for performance
      onclone: () => onProgress?.(60),
    });

    onProgress?.(80);

    // Generate filename with better format
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().split('T')[0];
    const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `whatsapp-status-${dateStr}-${timeStr}.png`;

    // Convert canvas to blob with quality control
    canvas.toBlob((blob) => {
      if (blob) {
        onProgress?.(90);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        onProgress?.(100);
        onComplete?.();
      } else {
        throw new Error('Failed to create blob from canvas');
      }
    }, 'image/png', quality);
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    const errorObj = error instanceof Error ? error : new Error('Unknown error');
    onError?.(errorObj);
    throw errorObj;
  }
}

// Legacy function for backward compatibility
export async function captureScreenshotLegacy(): Promise<void> {
  return captureScreenshot();
}
