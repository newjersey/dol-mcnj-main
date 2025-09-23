import { computeCorrectFieldSlug } from '@utils/validateFieldOccupation';

describe('computeCorrectFieldSlug', () => {
  const pathways = [
    { title: 'Welding', occupationsCollection: { items: [{ title: 'Welder' }, { title: 'Sr Welder' }] } },
    { title: 'Machinist', occupationsCollection: { items: [{ title: 'CNC Lead' }] } },
  ];

  test('returns matching field slug', () => {
    // @ts-ignore
    expect(computeCorrectFieldSlug(pathways, 'welder')).toBe('welding');
  });

  test('returns undefined if no match', () => {
    // @ts-ignore
    expect(computeCorrectFieldSlug(pathways, 'plant-manager')).toBeUndefined();
  });
});
