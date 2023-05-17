// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     compiler: {
//         styledComponents: true,
//     },
// };

// module.exports = {
//     images: {
//         domains: ['firebasestorage.googleapis.com'],
//     },
// };
// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
};

module.exports = nextConfig;
