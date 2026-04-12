import type { BuilderProject } from "./model";

const REQUIRED_PROJECT_FIELDS: Array<keyof BuilderProject> = [
  "name",
  "groupId",
  "artifactId",
  "javaVersion",
  "springBootVersion",
];

export const validateProjectMetadata = (project: BuilderProject): string[] => {
  const errors: string[] = [];

  for (const field of REQUIRED_PROJECT_FIELDS) {
    if (!project[field].trim()) {
      errors.push(`Project ${field} is required.`);
    }
  }

  return errors;
};

export const canGenerateProject = (project: BuilderProject): boolean =>
  validateProjectMetadata(project).length === 0;
