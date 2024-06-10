    COMMAND "tsc" "--pretty" "--sourceMap" "--declaration" "--module" "commonjs" "--lib" "es2020,dom" "--esModuleInterop" "main.ts"
    # fix https://stackoverflow.com/questions/43042889/typescript-referenceerror-exports-is-not-defined
    COMMAND "sed" "-i" ".bak" "'s/\"use strict\";/var exports = {};\\n\\n\"use strict\";/g'" "main.js"
