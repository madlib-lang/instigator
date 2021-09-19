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
      dev: `madlib compile -i ${input.mad.Main} --target browser --bundle -o ${out.mad.Main}`,
      html: `copy-and-watch src/*.html build/`,
      script: `nps build.dev build.html`,
      sync: {
        description: "sync the content with the client",
        script: `browser-sync start -c browsersync.config.js`,
      },
    },

    dev: {
      description: "run in browser",
      script: `concurrently ${[
        '"date"',
        `"watch 'nps build.dev' src"`,
        `"nps build.sync"`,
      ].join(" ")}`,
    },
    care: `nps build`,
  },
}
