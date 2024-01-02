/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = ({ env }) => ({
    plugins: [require("autoprefixer")(), require("postcss-flexbugs-fixes")()],
});
