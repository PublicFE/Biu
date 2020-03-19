import rollup  from 'rollup'
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve'

export default {
    input: 'src/main.js',
    output: {
        file: './build/bundle.js',
        format: 'iife'
    },
    watch: {
        include: './src/**'
    },
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

