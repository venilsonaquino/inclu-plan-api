import { Neurodivergency } from './neurodivergency.entity';

describe('Neurodivergency Entity', () => {
  it('should create a neurodivergency with default values', () => {
    const neurodivergency = new Neurodivergency({});
    expect(neurodivergency.id).toBeDefined();
    expect(neurodivergency.name).toBe('');
    expect(neurodivergency.description).toBe('');
    expect(neurodivergency.createdAt).toBeInstanceOf(Date);
    expect(neurodivergency.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a neurodivergency with provided values', () => {
    const props = {
      name: 'ADHD',
      description: 'Attention Deficit Hyperactivity Disorder',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = 'test-id';
    const neurodivergency = new Neurodivergency(props, id);

    expect(neurodivergency.id).toBe(id);
    expect(neurodivergency.name).toBe(props.name);
    expect(neurodivergency.description).toBe(props.description);
    expect(neurodivergency.createdAt).toBe(props.createdAt);
    expect(neurodivergency.updatedAt).toBe(props.updatedAt);
  });
});
