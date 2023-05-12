function add(a, b) {
    if (typeof a === 'string') {
        window.alert('a is string');
        return;
    }
    return a + b;
}

if (add(1, 2) === 3) {
    console.log('success');
} else {
    console.log('error');
}

describe('add function', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(add(1, 2)).toBe(3);
    });

    test('adds -2 + -3 to equal -5', () => {
        expect(add(-2, -3)).toBe(-5);
    });

    test('alerts if a is a string', () => {
        const alertSpy = jest.spyOn(window, 'alert');
        add('2', 3);
        expect(alertSpy).toHaveBeenCalledWith('a is string');
        alertSpy.mockRestore();
    });
});
