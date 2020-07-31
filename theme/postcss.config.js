let plugins = [require("tailwindcss"), require("autoprefixer")];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    require("cssnano")({
      preset: "default",
    })
  );
}

module.exports = {
  plugins,
};
