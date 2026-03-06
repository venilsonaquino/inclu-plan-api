import { Entity } from './entity';

class StubEntity extends Entity<{ name: string }> { }

describe('Entity', () => {
  it('should create an entity with provided id', () => {
    const id = 'test-id';
    const entity = new StubEntity({ name: 'test' }, id);
    expect(entity.id).toBe(id);
    expect(entity.props.name).toBe('test');
  });

  it('should create an entity with generated id if not provided', () => {
    const entity = new StubEntity({ name: 'test' });
    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe('string');
  });

  describe('equals', () => {
    it('should return true if same instance', () => {
      const entity = new StubEntity({ name: 'test' });
      expect(entity.equals(entity)).toBe(true);
    });

    it('should return true if same id', () => {
      const id = '1';
      const entity1 = new StubEntity({ name: 'test1' }, id);
      const entity2 = new StubEntity({ name: 'test2' }, id);
      expect(entity1.equals(entity2)).toBe(true);
    });

    it('should return false if different id', () => {
      const entity1 = new StubEntity({ name: 'test' }, '1');
      const entity2 = new StubEntity({ name: 'test' }, '2');
      expect(entity1.equals(entity2)).toBe(false);
    });

    it('should return false if null or undefined', () => {
      const entity = new StubEntity({ name: 'test' });
      expect(entity.equals(null as any)).toBe(false);
      expect(entity.equals(undefined as any)).toBe(false);
    });

    it('should return false if not an instance of Entity', () => {
      const entity = new StubEntity({ name: 'test' });
      expect(entity.equals({ id: entity.id } as any)).toBe(false);
    });
  });
});
