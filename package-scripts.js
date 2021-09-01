const input = {
  mad: {
    Main: "src/Main.mad",
  },
}
const out = {
  mad: {
    Main: "build/bundle.js",
  },
}

module.exports = {
  scripts: {
    build: {
      mad: `madlib compile -i ${input.mad.Main} --target browser --bundle -o ${out.mad.Main}`,
      html: `copy-and-watch src/*.html build/`,
      script: `nps build.mad build.html`,
    },
    run: {
      description: "run in browser",
      script: `browser-sync start -c browsersync.config.js`,
    },
    care: `nps build run`,
  },
}
