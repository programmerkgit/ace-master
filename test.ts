class A {
    b = 3;

    a = () => {
        console.warn(this.b);
    };
}

const a = new A();
a.a();

a.a.bind({b: 4})();
