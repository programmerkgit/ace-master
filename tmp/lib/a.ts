interface MAP {
    a: 1
    b: 2
}

type Reverse<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
}

const N: Reverse<MAP> = {
    1: 'a',
    2: 'c'
};
