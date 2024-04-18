const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 配置复制操作
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'node_modules/@zilliz/milvus2-sdk-node/dist/proto'), // 源文件目录
              to: path.resolve(__dirname, '.next/proto'), // 目标目录
            },
          ],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
