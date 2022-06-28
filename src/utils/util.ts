import data from "../data/data.json";

interface Skill {
  name: string;
  gp: number;
  pr: number;
  requirements: string[];
  id: number;
}

interface GetChildrenOptions {
  recursive?: boolean;
  shouldReturnParentsRequirements?: boolean;
  shouldReturnParent?: boolean;
}

function getChildrenIds(
  parentId: number,
  options?: GetChildrenOptions
): number[] {
  const recursive = options?.recursive ?? true;
  const shouldReturnParent = options?.shouldReturnParent ?? false;
  const shouldReturnParentsRequirements =
    options?.shouldReturnParentsRequirements ?? false;

  const children = new Set<number>();

  const skill = data.find((s) => s.id === parentId);
  if (!skill) {
    throw new Error("Skill not found");
  }

  if (shouldReturnParent) children.add(skill.id);

  const requirements = skill?.requirements ?? [];
  if (parentId === 1) console.log(parentId, requirements);

  for (const req of requirements) {
    if (shouldReturnParentsRequirements) children.add(req);

    if (recursive) {
      for (const child of getChildrenIds(req, {
        recursive: true,
        shouldReturnParentsRequirements: true,
      })) {
        children.add(child);
      }
    }
  }

  return [...children];
}

/**
 * Returns all requirements for a skill. This includes all requirements of requirements.
 * @param parentId the id of the parent skill
 */
export function getChildren(
  parentId: number,
  options?: GetChildrenOptions
): Skill[] {
  const children = getChildrenIds(parentId, options);

  const res: Skill[] = [];

  for (const child of children) {
    const skill = data.find((s) => s.id === child);

    if (!skill) {
      console.error("getChildren: skill not found", child);

      continue;
    }

    // TODO remove this when add all data
    // @ts-ignore
    res.push(skill);
  }

  return res;
}

function getChildrenIDsByParents(
  parents: number[],
  options?: GetChildrenOptions
): number[] {
  const ids = new Set<number>();
  for (const parent of parents) {
    for (const child of getChildrenIds(parent, options)) {
      ids.add(child);
    }
  }

  return [...ids];
}

export function sumGP(skillIds: number[]): number {
  return getChildrenIDsByParents(skillIds, {
    shouldReturnParent: true,
    recursive: true,
    shouldReturnParentsRequirements: true,
  }).reduce((acc, id) => {
    const skill = data.find((s) => s.id === id);

    if (!skill) {
      console.error("sumGP: skill not found", id);
      return acc;
    }

    acc = acc + skill.gp;

    return acc;
  }, 0);
}

export function getChildrenByParents(parents: number[]): Skill[] {
  const ids = getChildrenIDsByParents(parents);

  const res: Skill[] = [];

  for (const id of ids) {
    const skill = data.find((s) => s.id === id);

    if (!skill) {
      console.error("getChildrenByParents: skill not found", id);

      continue;
    }

    // TODO remove this when add all data
    // @ts-ignore
    res.push(skill);
  }

  return res;
}

const isChildOne = (parentId: number, childId: number): boolean => {
  const children = getChildrenIds(parentId, {
    recursive: true,
    shouldReturnParent: false,
    shouldReturnParentsRequirements: true,
  });

  return children.includes(childId);
};

export const isChild = (parents: number[], childId: number): boolean => {
  for (const parent of parents) {
    if (isChildOne(parent, childId)) return true;
  }

  return false;
};

export const getParents = (parents: number[], childId: number): number[] => {
  const res = new Set<number>();

  for (const parentId of parents) {
    if (isChildOne(parentId, childId)) {
      res.add(parentId);
    }
  }

  return [...res];
};
