import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { BlogPost } from '../../src/types';

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>Baby Names Blog - Expert Tips & Insights | OnlineBabyNames.com</title>
        <meta name="description" content="Expert insights on choosing perfect baby names based on astrology, numerology, and phonology. Discover trending names, naming tips, and cultural significance." />
        <meta name="keywords" content="baby names blog, baby naming tips, astrology baby names, numerology baby names, phonology baby names, indian baby names, hindu baby names, tamil baby names" />
        <meta property="og:title" content="Baby Names Blog - Expert Tips & Insights | OnlineBabyNames.com" />
        <meta property="og:description" content="Expert insights on choosing perfect baby names based on astrology, numerology, and phonology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://onlinebabynames.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baby Names Blog - Expert Tips & Insights | OnlineBabyNames.com" />
        <meta name="twitter:description" content="Expert insights on choosing perfect baby names based on astrology, numerology, and phonology." />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MEE4YRMFZL"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEE4YRMFZL');
            `,
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Baby Names Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert insights, tips, and guides for choosing the perfect baby name based on astrology, numerology, and phonology.
            </p>
          </div>

          <div className="grid gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="mx-2">•</span>
                    <span>By {post.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // In a real app, you'd fetch this from a CMS or database
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Choose the Perfect Baby Name for Your Girl or Boy Based on Astrology, Numerology & Phonology',
      slug: 'how-to-choose-perfect-baby-name',
      excerpt: 'Discover the art of choosing the perfect baby name using astrology, numerology, and phonology. Learn how these ancient sciences can help you find a name that brings positive energy and good fortune to your child.',
      content: '', // Will be loaded from the individual post page
      publishedAt: new Date('2024-01-15'),
      author: 'Online Baby Names Team',
      tags: ['Baby Names', 'Astrology', 'Numerology', 'Phonology', 'Naming Tips'],
      featured: true
    }
  ];

  return {
    props: {
      posts
    },
    revalidate: 3600 // Revalidate every hour
  };
};
