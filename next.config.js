/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Always use HTTPS for one year
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  // Stop browsers guessing file types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stop other sites from putting Toolkitties inside a frame (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Share only the site name, not the full address, with other sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The tools never need the camera, microphone or location
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The AI PDF Chat tool's local AI library (@xenova/transformers) only ever
  // runs in the browser, where it uses onnxruntime-web — but its source
  // also references the Node-only onnxruntime-node native binary, which
  // webpack would otherwise try (and fail) to bundle. Marking it as `false`
  // tells webpack it's not needed for the client build.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
      sharp$: false,
    };
    return config;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/tools/:slug",
        destination: "/:slug",
        permanent: true,
      },
      // Common names people (and other sites) use for our trust pages. Each one goes to the real page.
      ...[
        ["/about-us", "/about"],
        ["/aboutus", "/about"],
        ["/about-toolkitties", "/about"],
        ["/privacy-policy", "/privacy"],
        ["/privacypolicy", "/privacy"],
        ["/privacy-policy.html", "/privacy"],
        ["/terms-and-conditions", "/terms"],
        ["/terms-conditions", "/terms"],
        ["/terms-of-service", "/terms"],
        ["/terms-of-use", "/terms"],
        ["/tos", "/terms"],
        ["/contact-us", "/contact"],
        ["/contactus", "/contact"],
        ["/contact-us.html", "/contact"],
        ["/feedback", "/contact"],
        ["/tools", "/all-tools"],
        ["/sitemap", "/sitemap.xml"],
        ["/faq", "/#faq"],
        ["/blogs", "/blog"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

module.exports = nextConfig;
