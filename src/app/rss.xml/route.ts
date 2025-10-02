import { MetadataRoute } from 'next';
import { client } from '@utils/client';

interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  guid: string;
}

export default async function rss(): Promise<string> {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://mycareer.nj.gov';
  
  // Generate RSS feed items from your content
  const newsItems: NewsItem[] = [
    {
      title: 'New Jersey Training Explorer - Find Your Career Path',
      description: 'Discover training programs, certifications, and career opportunities in New Jersey with our comprehensive Training Explorer tool.',
      pubDate: new Date().toUTCString(),
      link: `${baseUrl}/training`,
      guid: `${baseUrl}/training`
    },
    {
      title: 'In-Demand Occupations in New Jersey',
      description: 'Explore high-demand career opportunities in New Jersey. Find occupations with strong job growth and competitive salaries.',
      pubDate: new Date().toUTCString(), 
      link: `${baseUrl}/in-demand-occupations`,
      guid: `${baseUrl}/in-demand-occupations`
    },
    {
      title: 'Career Navigator - Personalized Career Guidance',
      description: 'Get personalized career advice and discover pathways to success with the New Jersey Career Navigator.',
      pubDate: new Date().toUTCString(),
      link: `${baseUrl}/navigator`,
      guid: `${baseUrl}/navigator`
    }
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Career NJ - New Jersey Career Resources</title>
    <description>Latest updates on career resources, job training programs, and employment opportunities from the New Jersey Department of Labor.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>imycareernj@dol.nj.gov (New Jersey Department of Labor & Workforce Development)</managingEditor>
    <webMaster>mycareernj@dol.nj.gov (New Jersey Department of Labor & Workforce Development)</webMaster>
    <category>Government</category>
    <category>Career Development</category>
    <category>Job Training</category>
    <copyright>Copyright ${new Date().getFullYear()} New Jersey Department of Labor</copyright>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>My Career NJ RSS Generator</generator>
    <image>
      <url>${baseUrl}/stateSeal.png</url>
      <title>My Career NJ</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${newsItems.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>Career Resources</category>
      <author>mycareernj@dol.nj.gov (New Jersey Department of Labor & Workforce Development)</author>
    </item>`).join('')}
  </channel>
</rss>`;

  return rssXml;
}

export async function GET() {
  const rssContent = await rss();
  
  return new Response(rssContent, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}