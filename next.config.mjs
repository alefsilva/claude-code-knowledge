/** @type {import('next').NextConfig} */
// GITHUB_ACTIONS é setada automaticamente pelo runner — funciona em qualquer OS
const isCI = Boolean(process.env.GITHUB_ACTIONS)
const repoName = 'claude-code-knowledge'

const nextConfig = {
  output: 'export',
  // basePath/assetPrefix só em CI: localmente o dev server roda na raiz
  basePath: isCI ? `/${repoName}` : '',
  assetPrefix: isCI ? `/${repoName}/` : '',
  // GitHub Pages não suporta otimização de imagem (requer servidor Node.js)
  images: {
    unoptimized: true,
  },
  // Gera index.html em cada rota — obrigatório para GH Pages navegar sem 404
  trailingSlash: true,
}

export default nextConfig
