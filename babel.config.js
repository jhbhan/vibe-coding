module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', // Includes metro-react-native-babel-preset
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.ts', '.tsx', '.ios.js', '.android.js'],
          alias: {
            api: './src/api',
            assets: './src/assets',
            services: './src/services',
            styles: './src/styles',
            components: './src/components',
            app: './src',
          },
        },
      ],
      ['module:react-native-dotenv'],
    ],
  };
};
