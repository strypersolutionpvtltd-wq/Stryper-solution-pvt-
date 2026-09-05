const assert = require("assert");

const API_BASE = "http://localhost:3001/api/v1";

const verify = async () => {
  console.log("=== STARTING FULL RUNTIME VERIFICATION ===");

  // 1. Admin Login
  console.log("1. Logging in as Admin...");
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@stryper.com",
      password: "infra@@2026",
    }),
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginRes.status, 200, `Login failed: ${JSON.stringify(loginData)}`);
  assert.ok(loginData.token, "No token returned from login");
  const token = loginData.token;
  console.log("   Admin login successful. Token acquired.");

  // 2. Create and Verify Project
  console.log("\n2. Creating a new Project...");
  const projectTitle = `Verification Project ${Date.now()}`;
  const projectSlug = projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  const createProjRes = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: projectTitle,
      category: "Residential",
      description: "This is a verification project to check runtime details page loading and refresh stability.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop",
      location: "Jaipur",
      year: "2026",
      client: "Verification Client",
      area: "5,000 sq.ft.",
      duration: "6 Months",
      features: ["Premium Site Planning", "Verification Passed"],
    }),
  });
  const createProjData = await createProjRes.json();
  assert.strictEqual(createProjRes.status, 201, `Project creation failed: ${JSON.stringify(createProjData)}`);
  console.log(`   Project created successfully with slug: ${projectSlug}`);

  // Fetch all projects (public API) and verify slug exists
  console.log("   Fetching all projects to verify MongoDB persistence...");
  const getProjRes = await fetch(`${API_BASE}/projects`);
  const getProjData = await getProjRes.json();
  assert.strictEqual(getProjRes.status, 200, "Failed to fetch projects");
  const foundProj = getProjData.projects.find(p => p.slug === projectSlug);
  assert.ok(foundProj, `Created project with slug "${projectSlug}" was not found in the projects list fetched from backend!`);
  console.log(`   Verification SUCCESS: Project successfully saved to MongoDB and returned by getProjects().`);

  // 3. Create and Verify Blog
  console.log("\n3. Creating a new Blog...");
  const blogTitle = `Verification Blog ${Date.now()}`;
  const blogSlug = blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const createBlogRes = await fetch(`${API_BASE}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: blogTitle,
      category: "Residential",
      subtitle: "Checking blog rendering on refresh",
      author: "Stryper Verification Team",
      content: "This is a full content verification blog post. If this is visible on load and refresh, the integration is stable.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000",
    }),
  });
  const createBlogData = await createBlogRes.json();
  assert.strictEqual(createBlogRes.status, 201, `Blog creation failed: ${JSON.stringify(createBlogData)}`);
  console.log(`   Blog created successfully with slug: ${blogSlug}`);

  // Fetch all blogs (public API) and verify slug exists
  console.log("   Fetching all blogs to verify MongoDB persistence...");
  const getBlogsRes = await fetch(`${API_BASE}/blogs`);
  const getBlogsData = await getBlogsRes.json();
  assert.strictEqual(getBlogsRes.status, 200, "Failed to fetch blogs");
  const foundBlog = getBlogsData.blogs.find(b => b.slug === blogSlug);
  assert.ok(foundBlog, `Created blog with slug "${blogSlug}" was not found in the blogs list fetched from backend!`);
  console.log(`   Verification SUCCESS: Blog successfully saved to MongoDB and returned by getBlogs().`);

  // 4. Cleanup test data
  console.log("\n4. Cleaning up verification database entries...");
  const deleteProjRes = await fetch(`${API_BASE}/projects/${createProjData.project._id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  console.log(`   Project delete response code: ${deleteProjRes.status}`);

  const deleteBlogRes = await fetch(`${API_BASE}/blogs/${createBlogData.blog._id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  console.log(`   Blog delete response code: ${deleteBlogRes.status}`);

  console.log("\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY ===");
};

verify().catch(err => {
  console.error("\n❌ VERIFICATION FAILED:", err.message);
  process.exit(1);
});
