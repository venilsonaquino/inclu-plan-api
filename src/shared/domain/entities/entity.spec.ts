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

  it('should initialize created_at and updated_at with current date if not provided', () => {
    const before = new Date();
    const entity = new StubEntity({ name: 'test' });
    const after = new Date();

    expect(entity.created_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(entity.created_at.getTime()).toBeLessThanOrEqual(after.getTime());

    expect(entity.updated_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(entity.updated_at.getTime()).toBeLessThanOrEqual(after.getTime());

    expect(entity.deleted_at).toBeUndefined();
  });

  it('should accept provided created_at, updated_at, and deleted_at', () => {
    const created_at = new Date('2023-01-01T00:00:00Z');
    const updated_at = new Date('2023-01-02T00:00:00Z');
    const deleted_at = new Date('2023-01-03T00:00:00Z');
    const entity = new StubEntity({ name: 'test' }, undefined, created_at, updated_at, deleted_at);

    expect(entity.created_at).toBe(created_at);
    expect(entity.updated_at).toBe(updated_at);
    expect(entity.deleted_at).toBe(deleted_at);
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
