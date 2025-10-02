import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Career NJ - New Jersey Career Resources',
    short_name: 'My Career NJ',
    description: 'Explore job training, career resources, and employment opportunities with the New Jersey Department of Labor.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f3a93',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: '/stateSeal.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/stateSeal.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'business', 'government', 'productivity'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
    screenshots: [
      {
        src: '/stateSeal.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'My Career NJ - Training Explorer and Career Navigator'
      }
    ]
  };
}