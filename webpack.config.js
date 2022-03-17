const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackManifest = require('webpack-pwa-manifest');

module.exports = {
    // The first thing we want to declare is the entry property. 
    // The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code. 
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    // webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. 
    // It is common and best practice to put your bundled code into a folder named dist, which is short for distribution.
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },
    module: {
        // This object will identify the type of files to pre-process using the test property to find a regular expression, or regex. 
        rules: [
            {
                // In our case, we are trying to process any image file with the file extension of .jpg. We could expand this expression to also search for other image file extensions such as .png, .svg, or .gif.
                test: /\.jpg$/i,
                use: [
                    {
                        // The default behavior of file-loader is such that file will be treated as an ES5 module. As a result, paths to images might be formatted incorrectly. To prevent this we can add a key-value pair in our options object: esModule: false,
                        loader: 'file-loader',
                        // As you can see, we added an options object below the loader assignment that contains a 'name' function, which returns the name of the file with the file extension
                        options: {
                            esModule: false,
                            name (file) {
                                return '[path][name].[ext]'
                            },
                            publicPath: function(url) {
                                return url.replace('../', '/assets/')
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
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
        }),
        //  After we instantiate our new WebpackPwaManifest, we provide an object as our only argument.
        new WebpackManifest({
            name: "Food Event",
            short_name: "Foodies",
            description: "An app that allows you to view upcoming food events.",
            // In the list of options, we included a start_url property to specify the homepage for the PWA relative to the location of the manifest file.
            start_url: "../index.html",
            background_color: "#01579b",
            theme_color: "#ffffff",
            // 'fingerprints' and 'inject' are both specific to the manifest plugin.
            // 'Fingerprints' tell webpack whether or not it should generate unique fingerprints so that each time a new manifest is generated, it looks like this: 'manifest.lhge325d.json'. Because we do not want this feature, we set fingerprints to be false.
            fingerprints: false,
            // The 'inject' property determines whether the link to the manifest.json is added to the HTML. 
            // Because we are not using 'fingerprints', we can also set 'inject' to be false. 
            inject: false,
            // Finally, we provide an 'icons' property, the value of which will be an array of objects. 
            icons: [{ 
                // The 'src' property is a path to the icon image we want to use. 
                src: path.resolve("assets/img/icons/icon-512x512.png"),
                // The next property is 'sizes' which will take the src image, and create icons with the dimensions of the numbers provided as the value of the sizes property. 
                sizes: [96, 128, 192, 256, 384, 512],
                // Finally, the 'destination' property designates where the icons will be sent after the creation of the web manifest is completed by the plugin.
                destination: path.join("assets", "icons")
            }]
        })
    ],
    // The final piece of our basic setup will provide the mode in which we want webpack to run. By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions. We want our code to run in development mode, so add the following code:
    mode: 'development',
    devServer: {
        static: './',
    },
};