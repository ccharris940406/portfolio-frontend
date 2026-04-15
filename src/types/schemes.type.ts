import type { PortableTextBlock } from "@portabletext/types";

type Skill = {
  id: string;
  name: string;
  icon: string;
  categories: string[];
};

interface ProfileInfo {
  name: string;
  title: PortableTextBlock[];
  about?: string;
  avatarLight?: string;
  avatarDark?: string;
  CV?: string;
}

interface SkillMorphInfo {
  color: string;
  svgPath: string;
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
  repository: string;
  imageURL: string;
  imageOrientation: "landscape" | "portrait" | "square";
  skills: { name: string }[];
}

export type { Skill, ProfileInfo, SkillMorphInfo, ProjectType };
