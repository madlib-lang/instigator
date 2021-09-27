const input = {
  mad: {
    Main: "src/Main.mad",
    Demo: "src/Demo.mad",
  },
}
const out = {
  mad: {
    Main: "Instigator.js",
    Demo: "build/bundle.js",
  },
}
const PORT = process.env.PORT || "3000"
module.exports = {
  scripts: {
    test: "madlib test --coverage",
    build: {
      dev: `madlib compile -i ${input.mad.Main} --target browser --bundle -o ${out.mad.Main}`,
      demo: `madlib compile -i ${input.mad.Demo} --target browser --bundle -o ${out.mad.Demo}`,
      html: `copy-and-watch src/*.html build/`,
      script: `nps build.dev build.demo build.html`,
      sync: {
        description: "sync the content with the client",
        script: `browser-sync start -c browsersync.config.js`,
      },
    },

    dev: {
      reload: `browser-sync reload --url http://localhost:${PORT} --files="*.js"`,
      description: "run in browser",
      script: `concurrently ${[
        `"watch 'date && nps build.demo build.dev' src"`,
        `"nps build.sync dev.reload"`,
      ].join(" ")}`,
    },
    care: `nps build`,
  },
}
