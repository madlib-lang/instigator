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
const PORT = process.env.PORT || "3000"
module.exports = {
  scripts: {
    test: "madlib test --coverage",
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
      reload: `browser-sync reload --url http://localhost:${PORT} --files="*.js"`,
      description: "run in browser",
      script: `concurrently ${[
        `"watch 'date && nps build.dev' src"`,
        `"nps build.sync dev.reload"`,
      ].join(" ")}`,
    },
    care: `nps build`,
  },
}
