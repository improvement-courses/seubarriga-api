test('Devo conhecer as principais assertivas do jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Devo saber trabalhar com objetos', () => {
  const obj = { nome: 'John', email: 'john@mail.com' };
  expect(obj).toHaveProperty('nome', 'John');
  expect(obj.nome).toBe('John');

  const obj2 = { nome: 'John', email: 'john@mail.com' };
  expect(obj).toEqual(obj2);
  expect(obj).toBe(obj);
});
