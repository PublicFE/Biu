import * as rollup from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";


const inputOptions = {
    input: './src/main.js',
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        serve('../Biu')
    ]
};
const outputOptions = {
    file: './build/bundle.js',
    format: 'iife'
};

async function build() {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);


    // generate code and a sourcemap
    const { code, map } = await bundle.generate(outputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
}

build();


const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {
        include:'src/**',
    }
};
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
    console.log(event.code);
    // event.code 会是下面其中一个：
    //   START        — 监听器正在启动（重启）
    //   BUNDLE_START — 构建单个文件束
    //   BUNDLE_END   — 完成文件束构建
    //   END          — 完成所有文件束构建
    //   ERROR        — 构建时遇到错误
    //   FATAL        — 遇到无可修复的错误
});

// 停止监听
watcher.close();
