const path = require('path');

module.exports = {
    entry: './src/index.js', // Điểm nhập chính của ứng dụng
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.mjs', '.json'], // Đảm bảo Webpack giải quyết .mjs
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.mjs$/,
                include: /src/, // Đảm bảo Webpack xử lý các tệp .mjs trong thư mục src
                type: 'javascript/auto',
            },
        ],
    },
};
