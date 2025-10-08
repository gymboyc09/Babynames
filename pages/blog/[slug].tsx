import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { BlogPost } from '../../src/types';

interface BlogPostPageProps {
  post: Omit<BlogPost, 'publishedAt'> & { publishedAt: string };
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title} | OnlineBabyNames.com</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://onlinebabynames.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        
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
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </div>
          </nav>

          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>By {post.author}</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
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
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, you'd fetch this from a CMS or database
  const posts = [
    { slug: 'how-to-choose-perfect-baby-name' }
  ];

  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // In a real app, you'd fetch this from a CMS or database
  const posts: { [key: string]: BlogPost } = {
    'how-to-choose-perfect-baby-name': {
      id: '1',
      title: 'How to Choose the Perfect Baby Name for Your Girl or Boy Based on Astrology, Numerology & Phonology',
      slug: 'how-to-choose-perfect-baby-name',
      excerpt: 'Discover the art of choosing the perfect baby name using astrology, numerology, and phonology. Learn how these ancient sciences can help you find a name that brings positive energy and good fortune to your child.',
      content: `
        <p>Choosing the right <strong>baby name</strong> is one of the most meaningful decisions parents make. In India, naming a child is more than just picking a beautiful sound; it is a sacred art guided by <strong>astrology</strong>, <strong>numerology</strong>, and <strong>phonology</strong>. These time-tested sciences help ensure your <strong>baby boy</strong> or <strong>baby girl</strong> receives a name packed with positive energy, good fortune, and cultural harmony.</p>

        <p>At <a href="https://onlinebabynames.com/">OnlineBabyNames.com</a>, we bring you expert insights and tools to simplify this process—helping you find the best <strong>baby names Indian</strong> parents love, whether you are searching for <strong>baby boy names Hindu</strong>, <strong>baby girl names Tamil</strong>, or even <strong>unique baby girl names</strong> from diverse traditions.</p>

        <h2>Why Choose Baby Names based on Astrology?</h2>
        <p>Astrology plays a fundamental role in naming children in many Indian households. Every <strong>baby boy name</strong> or <strong>baby girl name</strong> ideally aligns with the child's cosmic profile determined at birth. This includes their <strong>Rashi</strong> (Moon sign) and <strong>Nakshatra</strong> (lunar mansion), which are derived from the exact birth time, date, and place.</p>

        <p>Each Nakshatra is associated with specific syllables—starting sounds—that bring luck and prosperity to the child. For instance, if a <strong>baby boy</strong> is born under the Visakha Nakshatra, names like <a href="https://onlinebabynames.com/calculator/aarav">Aarav</a>, <a href="https://onlinebabynames.com/calculator/vihaan">Vihaan</a>, or Reyansh suit best. Similarly, <strong>baby girl names</strong> like <a href="https://onlinebabynames.com/calculator/saanvi">Saanvi</a> or <a href="https://onlinebabynames.com/calculator/aadhya">Aadhya</a> resonate with specific sounds linked to their Nakshatra.</p>

        <p>Astrology-based naming not only honors ancient tradition but is believed to improve a child's health, wealth, and happiness by resonating with their unique planetary energies.</p>

        <h2>How Numerology Influences Baby Names</h2>
        <p><strong>Numerology</strong> assigns a numerical value to the letters in a name and studies their vibrational impact. Each letter corresponds to a number, and the sum of these numbers reveals an energetic vibration that can attract positive or negative effects.</p>

        <p>Choosing <strong>baby boy names</strong> and <strong>baby girl names</strong> with balanced numerology numbers helps harmonize a child's personality traits and destiny. For example, the name "Tejansh" adds up to the numerology number 6, which signifies harmony and nurturing.</p>

        <p>At <a href="https://onlinebabynames.com/">OnlineBabyNames.com</a>, you can explore detailed numerology reports for thousands of names through our personalized baby name calculator. Simply click on any name, such as <a href="https://onlinebabynames.com/calculator/aarav">Aarav</a>, and get instant numerology, astrology, and phonology insights.</p>

        <h2>The Importance of Phonology in Baby Naming</h2>
        <p>Phonology, or the study of sound, affects how a baby's name influences their mental and emotional well-being. The right <strong>baby girl names</strong> or <strong>baby boy names</strong> should sound harmonious, be easy to pronounce, and culturally pleasant.</p>

        <p>Many Indian parents emphasize phonological rules to select names that flow smoothly with the family surname and avoid harsh or disagreeable sounds. For Tamil and Telugu speakers, matching the initial sounds of a name to the Nakshatra ensures phonetic and cosmic alignment.</p>

        <h2>Combining Astrology, Numerology, and Phonology</h2>
        <p>The most powerful approach to naming is to combine these three elements—astrology, numerology, and phonology—creating a comprehensive framework. This ensures the name supports the child's cosmic energies, vibrational balance, and social ease.</p>

        <p>For example, when choosing <strong>boy baby names</strong> like <a href="https://onlinebabynames.com/calculator/advik">Advik</a> or <a href="https://onlinebabynames.com/calculator/kabir">Kabir</a>, or <strong>unique girl names</strong> such as <a href="https://onlinebabynames.com/calculator/bhavika">Bhavika</a>, start by:</p>
        <ul>
            <li>Finding suitable syllables based on Nakshatra and Rashi,</li>
            <li>Calculating the numerology number,</li>
            <li>Checking the name's sound and pronunciation.</li>
        </ul>
        <p>This method ensures the name's overall positive impact on your child's future.</p>

        <h2>Popular and Trending Baby Names to Consider</h2>
        <p>Based on recent trends visible on our <a href="https://onlinebabynames.com/trending">Trending Baby Names Page</a>, here are some popular and unique names that Indian parents are loving right now.</p>

        <h3>Trending Baby Boy Names Hindu & Indian</h3>
        <ul>
            <li><a href="https://onlinebabynames.com/calculator/aarav">Aarav</a> – Meaning "peaceful"</li>
            <li><a href="https://onlinebabynames.com/calculator/vihaan">Vihaan</a> – Meaning "dawn, beginning of a new era"</li>
            <li><a href="https://onlinebabynames.com/calculator/advik">Advik</a> – Meaning "unique"</li>
            <li>Reyansh – Meaning "part of Lord Vishnu"</li>
            <li>Kabir – Meaning "great" or "famous"</li>
        </ul>

        <h3>Popular Baby Girl Names Indian, Tamil & Hindu</h3>
        <ul>
            <li><a href="https://onlinebabynames.com/calculator/saanvi">Saanvi</a> – Meaning "knowledge"</li>
            <li><a href="https://onlinebabynames.com/calculator/aanya">Aanya</a> – Meaning "graceful"</li>
            <li><a href="https://onlinebabynames.com/calculator/bhavika">Bhavika</a> – Meaning "well-meaning" or "full of feelings"</li>
            <li><a href="https://onlinebabynames.com/calculator/aadhya">Aadhya</a> – Meaning "first power"</li>
            <li><a href="https://onlinebabynames.com/calculator/diya">Diya</a> – Meaning "light"</li>
        </ul>

        <h3>Unique and Modern Baby Girl Names</h3>
        <p>Names that are easy to pronounce, phonologically pleasant, and carry positive numerology are trending as well.</p>

        <p>Our growing database offers thousands of names with detailed analysis through easy navigation.</p>

        <h2>Tips for Choosing the Right Baby Name</h2>
        <ul>
            <li>Consider the <strong>baby boy name</strong> or <strong>baby girl name</strong> starting syllables dictated by astrology.</li>
            <li>Opt for names with auspicious or positive meanings.</li>
            <li>Use numerology to ensure the vibrational number supports your child's destiny.</li>
            <li>Keep phonology in mind for ease of pronunciation and harmonious sound.</li>
            <li>Explore family traditions and cultural significance.</li>
            <li>Avoid names associated with negative influences or sounds.</li>
        </ul>

        <h2>Tamil and Muslim Baby Names</h2>
        <p>If you are looking for <strong>Tamil baby girl names</strong> or <strong>Tamil boy baby names</strong>, our tool not only respects cultural nuances but also integrates phonological preferences specific to Tamil speakers.</p>

        <p>We also feature a rich collection of <strong>muslim baby names</strong>, carefully chosen for their beautiful meanings and numerological significance.</p>

        <h2>How to Use OnlineBabyNames.com to Find the Perfect Name</h2>
        <p>Visit the <a href="https://onlinebabynames.com/">Home Page</a> to start exploring names based on astrology, numerology, and phonology. Use the search and filtering options to narrow down to names that:</p>
        <ul>
            <li>Match your child's Nakshatra,</li>
            <li>Have auspicious numerology numbers,</li>
            <li>Sound pleasant and culturally appropriate.</li>
        </ul>
        <p>Click on any name, for example, <a href="https://onlinebabynames.com/calculator/aarav">Aarav</a>, to see a detailed personalized report including:</p>
        <ul>
            <li>Numerology score,</li>
            <li>Astrology details aligned with birth data,</li>
            <li>Phonetic and pronunciation guide.</li>
        </ul>
        <p>Use our <a href="https://onlinebabynames.com/trending">Trending Names Page</a> for inspiration on the most popular and unique names.</p>

        <h2>Final Thoughts</h2>
        <p>Selecting your <strong>baby boy name</strong> or <strong>baby girl name</strong> with the combined wisdom of <strong>astrology</strong>, <strong>numerology</strong>, and <strong>phonology</strong> is more than tradition; it is investing in a prosperous and harmonious future for your child.</p>

        <p>Explore our expert tools and rich database at <a href="https://onlinebabynames.com/">OnlineBabyNames.com</a> to find the perfect name that brings joy, success, and positivity to your little one's life.</p>

        <p>Start today by exploring popular options like <a href="https://onlinebabynames.com/calculator/aarav">Aarav</a>, <a href="https://onlinebabynames.com/calculator/saanvi">Saanvi</a>, and many more!</p>
      `,
      publishedAt: new Date('2024-01-15'),
      author: 'Online Baby Names Team',
      tags: ['Baby Names', 'Astrology', 'Numerology', 'Phonology', 'Naming Tips'],
      featured: true
    }
  };

  const post = posts[slug];

  if (!post) {
    return {
      notFound: true
    };
  }

  // Convert Date object to ISO string for serialization
  const serializedPost = {
    ...post,
    publishedAt: post.publishedAt.toISOString()
  };

  return {
    props: {
      post: serializedPost
    },
    revalidate: 3600 // Revalidate every hour
  };
};
