interface CloudflareVideoProps {
  videoId: string;
  subdomain?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

const DEFAULT_SUBDOMAIN = 'customer-h044ipu9nb6m47zm';

export default function CloudflareVideo({
  videoId,
  subdomain,
  className = '',
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
}: CloudflareVideoProps) {
  // If we have a full URL, extract the video ID
  const extractVideoId = (url: string): string => {
    if (url.includes('cloudflarestream.com')) {
      const match = url.match(/cloudflarestream\.com\/([^/]+)/);
      return match?.[1] ?? url;
    }
    return url;
  };

  const id = extractVideoId(videoId);
  const domain = subdomain || DEFAULT_SUBDOMAIN;

  // Use Stream's iframe player for best performance and features
  const iframeUrl = `https://${domain}.cloudflarestream.com/${id}/iframe`;
  const params = new URLSearchParams({
    ...(autoplay && { autoplay: 'true' }),
    ...(muted && { muted: 'true' }),
    ...(loop && { loop: 'true' }),
    ...(preload && { preload }),
    ...(controls && { controls: 'true' }),
  });

  const fullUrl = `${iframeUrl}?${params.toString()}`;

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={fullUrl}
        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title="Cloudflare Stream video player"
      />
    </div>
  );
}

// Alternative: Direct video element with HLS support
interface CloudflareVideoDirectProps extends CloudflareVideoProps {
  poster?: string;
}

export function CloudflareVideoDirect({
  videoId,
  subdomain,
  className = '',
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  poster,
}: CloudflareVideoDirectProps) {
  const extractVideoId = (url: string): string => {
    if (url.includes('cloudflarestream.com')) {
      const match = url.match(/cloudflarestream\.com\/([^/]+)/);
      return match?.[1] ?? url;
    }
    return url;
  };

  const id = extractVideoId(videoId);
  const domain = subdomain || DEFAULT_SUBDOMAIN;
  const videoUrl = `https://${domain}.cloudflarestream.com/${id}/manifest/video.m3u8`;
  const posterUrl =
    poster || `https://${domain}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg`;

  return (
    <video
      src={videoUrl}
      poster={posterUrl}
      className={`w-full h-full object-cover rounded-lg ${className}`}
      controls={controls}
      autoPlay={autoplay}
      muted={muted}
      loop={loop}
      preload={preload}
    />
  );
}
