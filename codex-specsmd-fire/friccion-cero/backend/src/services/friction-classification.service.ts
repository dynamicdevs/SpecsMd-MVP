import type { AutomationPotential, FrictionCategory } from "../entities/friction.js";

const categoryKeywords: Array<{ category: FrictionCategory; keywords: string[] }> = [
  {
    category: "manual_repetitive_work",
    keywords: ["repetitive", "manual", "copy", "paste", "spreadsheet", "recurring", "repetitivo", "manual"]
  },
  {
    category: "third_party_waiting",
    keywords: ["wait", "waiting", "blocked", "dependency", "third party", "vendor", "espera", "proveedor"]
  },
  {
    category: "data_duplication",
    keywords: ["duplicate", "duplicated", "double entry", "re-enter", "repeated data", "duplicacion", "duplicado"]
  },
  {
    category: "unnecessary_meetings",
    keywords: ["meeting", "sync", "call", "standup", "reunion", "reuniones"]
  },
  {
    category: "manual_approvals",
    keywords: ["approval", "approve", "signature", "authorization", "validation", "aprobacion", "firma"]
  },
  {
    category: "missing_system_integration",
    keywords: ["integration", "disconnected", "export", "import", "no sync", "integracion", "sistemas"]
  },
  {
    category: "excessive_information_search",
    keywords: ["search", "find", "lookup", "where is", "information", "buscar", "busqueda", "informacion"]
  },
  {
    category: "recurring_human_errors",
    keywords: ["error", "mistake", "rework", "correction", "typo", "errores", "humano"]
  },
  {
    category: "lack_of_traceability",
    keywords: ["traceability", "status", "audit", "tracking", "visibility", "trazabilidad", "seguimiento"]
  }
];

const highAutomationCategories = new Set<FrictionCategory>([
  "manual_repetitive_work",
  "data_duplication",
  "manual_approvals",
  "missing_system_integration"
]);

const mediumAutomationCategories = new Set<FrictionCategory>([
  "excessive_information_search",
  "recurring_human_errors",
  "lack_of_traceability"
]);

export interface ClassificationInput {
  title: string;
  description: string;
  area?: string;
}

export function classifyFrictionCategory(input: ClassificationInput): FrictionCategory {
  const text = normalizeText(`${input.title} ${input.description} ${input.area ?? ""}`);
  const match = categoryKeywords.find((rule) => rule.keywords.some((keyword) => text.includes(normalizeText(keyword))));

  return match?.category ?? "unclassified";
}

export function suggestAutomationPotential(category: FrictionCategory): AutomationPotential {
  if (highAutomationCategories.has(category)) {
    return "high";
  }

  if (mediumAutomationCategories.has(category)) {
    return "medium";
  }

  return "low";
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
