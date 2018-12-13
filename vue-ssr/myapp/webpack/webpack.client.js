const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = true

module.exports = {
      entry: ['babel-polyfill', path.join(projectRoot, 'entry/entry-client.js')],
      output: {
            path: path.join(projectRoot, 'dist'),
            filename: 'bundle.client.js',
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
};