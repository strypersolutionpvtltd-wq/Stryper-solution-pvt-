import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, BookOpen, Calendar } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import SEO from '@/components/shared/SEO';
import { BLOG_POSTS } from '@/data/blogData';
import img1 from '@/assets/image/1.jpeg';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';

const BlogList = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Stryper Solution Recruitment & HR Insights Blog",
    "description": "Expert advice, recruitment guides, and staffing industry insights for employers and job seekers across India.",
    "url": "https://strypersolution.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Stryper Solution Pvt Ltd",
      "logo": "https://strypersolution.com/vite.svg"
    },
    "blogPost": BLOG_POSTS.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": "2026-09-20",
      "url": `https://strypersolution.com/blog/${post.slug}`,
      "author": {
        "@type": "Person",
        "name": post.author
      }
    }))
  };

  return (
    <>
      <SEO
        title="Recruitment & HR Insights Blog | Hiring Guides Jaipur | Stryper Solution"
        description="Explore expert recruitment guides, staffing strategies, industrial manpower solutions, and HR compliance advice from Stryper Solution Pvt Ltd in Jaipur."
        keywords="recruitment blog, hiring guides Jaipur, staffing insights, HR consultancy tips, manpower management, employment news India"
        canonicalUrl="https://strypersolution.com/blog"
        schema={schema}
      />

      <PageHero
        title="Knowledge Hub & HR Insights"
        subtitle="Expert insights, industry trends, and strategic hiring guides for modern employers."
        breadcrumb="Blog & Guides"
        image={img1}
      />

      <section className="section-padding bg-neutral-50/50">
        <div className="container-base">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase mb-4">
              <BookOpen className="w-3.5 h-3.5 text-brand-purple-600" />
              Latest Articles & Hiring Guides
            </span>
            <h2 className="font-display font-bold text-neutral-900 text-3xl md:text-4xl mb-4">
              Empowering Businesses with Strategic Recruitment Intelligence
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Read actionable articles from our staffing, recruitment, and legal compliance specialists to help you build resilient, high-performing teams.
            </p>
          </div>

          {/* Grid of posts */}
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            {BLOG_POSTS.map((post) => (
              <motion.article
                key={post.slug}
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple-600 text-white shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-purple-500" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-gold-600" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-neutral-900 group-hover:text-brand-purple-700 transition-colors mb-3 leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      {post.author}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-purple-600 hover:text-brand-purple-800 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      Read Guide <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogList;
