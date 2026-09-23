import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Tag, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/shared/SEO';
import PageHero from '@/components/shared/PageHero';
import { BLOG_POSTS } from '@/data/blogData';

const BlogPost = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://strypersolution.com${post.image}`,
    "author": {
      "@type": "Organization",
      "name": "Stryper Solution Pvt Ltd",
      "url": "https://strypersolution.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stryper Solution Pvt Ltd",
      "logo": {
        "@type": "ImageObject",
        "url": "https://strypersolution.com/vite.svg"
      }
    },
    "datePublished": "2026-09-20T08:00:00+05:30",
    "dateModified": "2026-09-23T08:00:00+05:30",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://strypersolution.com/blog/${post.slug}`
    }
  };

  return (
    <>
      <SEO
        title={`${post.seoTitle || post.title} | Stryper Solution`}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords || 'recruitment agency jaipur, staffing solutions, manpower consultancy'}
        canonicalUrl={`https://strypersolution.com/blog/${post.slug}`}
        ogImage={post.image}
        schema={articleSchema}
      />

      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumb={`Blog / ${post.category}`}
        image={post.image}
      />

      <article className="section-padding bg-white">
        <div className="container-base max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple-700 hover:text-brand-purple-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
            </Link>
          </div>

          {/* Meta header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-neutral-100">
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-brand-purple-600" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-gold-600" />
                {post.readTime}
              </span>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-purple-50 text-brand-purple-700 border border-brand-purple-100">
              {post.category}
            </span>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-6
              [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-neutral-900 [&>h2]:mt-10 [&>h2]:mb-4
              [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-neutral-700
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:text-neutral-700
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:text-neutral-700
              [&>strong]:text-neutral-900 [&>strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Quick CTA Box */}
          <div className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-brand-purple-900 to-brand-purple-950 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-display font-bold text-2xl mb-3 text-white">
              Ready to Accelerate Your Hiring in Jaipur & Beyond?
            </h3>
            <p className="text-neutral-200 text-sm leading-relaxed mb-6 max-w-2xl">
              Partner with Stryper Solution Pvt Ltd for vetted permanent and contract candidates, rapid 48-hour turnarounds, and 100% statutory compliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-400 text-neutral-900 font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                Request a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/recruitment-services"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all inline-flex items-center gap-2"
              >
                View Sourcing Capabilities
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-neutral-200">
              <h3 className="font-display font-bold text-2xl text-neutral-900 mb-8">
                Recommended Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    className="p-6 rounded-2xl border border-neutral-100 hover:border-brand-purple-200 hover:shadow-lg transition-all duration-300 bg-neutral-50/50 hover:bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-brand-purple-600 uppercase tracking-wide">
                        {rel.category}
                      </span>
                      <h4 className="font-display font-bold text-lg text-neutral-900 group-hover:text-brand-purple-700 transition-colors mt-2 mb-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500">
                      <span>{rel.readTime}</span>
                      <span className="text-brand-purple-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost;
