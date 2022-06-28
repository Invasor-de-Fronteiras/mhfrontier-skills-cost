import data from '../data/data.json';

interface Skill {
  name: string;
  gp: number;
  pr: number;
  requirements: string[];
  id: string;
  
}

function getChildrenIds(parentId: string): string[] {
  const children = new Set<string>();

  const skill = data.find(s => s.id === parentId);
  const requirements = skill?.requirements ?? [];
  for (const req of requirements) {
    children.add(req);

    for (const child of getChildrenIds(req)) {
      children.add(child);
    }
  }

  return [...children];
}

/**
 * Returns all requirements for a skill. This includes all requirements of requirements.
 * @param parentId the id of the parent skill
 */
export function getChildren(parentId: string): Skill[] {
  const children = getChildrenIds(parentId);

  const res: Skill[] = [];

  for (const child of children) {
    const skill = data.find(s => s.id === child);

    if (!skill) {
      console.error('skill not found', child);

      continue;
    }

     // TODO remove this when add all data
    // @ts-ignore
    res.push(skill);
  }

  return res;
}