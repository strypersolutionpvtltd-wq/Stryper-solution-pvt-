import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import PostJobForm from '@/hire-zone/components/jobs/PostJobForm';

const PostJob = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionHeader
        title="Post a Job"
        subtitle="Fill in the details below to create a new job listing."
      />
      <PostJobForm />
    </motion.div>
  </div>
);

export default PostJob;
