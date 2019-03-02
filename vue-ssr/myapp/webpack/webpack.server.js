const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = true

module.exports = {
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    target: 'node',
    entry: path.join(projectRoot, 'entry/entry-server.js'),
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(projectRoot, 'dist'),
        filename: 'bundle.server.js',
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // enable CSS extraction
                    extractCSS: isProduction
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/,
                options: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                // 重要：使用 vue-style-loader 替代 style-loader
                use: isProduction
                  ? ExtractTextPlugin.extract({
                      use: 'css-loader',
                      fallback: 'vue-style-loader'
                    })
                  : ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({filename : path.join(projectRoot, 'dist',"style.css")})
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js'
        }
    }
}