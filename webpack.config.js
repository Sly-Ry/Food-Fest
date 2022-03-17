const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    // The first thing we want to declare is the entry property. 
    // The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code. 
    entry: './assets/js/script.js',
    // webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. 
    // It is common and best practice to put your bundled code into a folder named dist, which is short for distribution.
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    // Inside the empty array, we need to tell webpack which plugin we want to use.
    // We're going to use the providePlugin plugin to define the '$' and 'jQuery' variables to use the installed npm package. If we did not do this, the code would still not work even though we installed jQuery. 
    // Whenever you work with libraries that are dependent on the use of a global variable, just like jQuery is with '$' and 'jQuery', you must tell webpack to make exceptions for these variables by using 'webpack.ProvidePlugin'.
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery'
        }),
        new BundleAnalyzerPlugin({
            // Notice that when we added the BundleAnalyzerPlugin, we configured the analyzerMode property with a 'static' value. This will output an HTML file called -report.html- that will generate in the dist folder. 
            // We can also set this value to 'disable' to temporarily stop the reporting and automatic opening of this report in the browser.
            analyzerMode: 'static', // the report outputs to an HTML file in the dist folder
        })
    ],
    // The final piece of our basic setup will provide the mode in which we want webpack to run. By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions. We want our code to run in development mode, so add the following code:
    mode: 'development',
    devServer: {
        static: './',
    },
};