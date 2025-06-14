export type AttachmentData = {
  id: string;
  name?: string;
  imagePath: string;
  techSpeciality?: string[];
  resourcesModifier?: number;
  influenceModifier?: number;
  token?: string;
  isLegendary?: boolean;
  isFakeAttachment?: boolean;
  planetTypes?: string[];
  spaceCannonHitsOn?: number;
  spaceCannonDieCount?: number;
  source: string;
};

export const attachments: AttachmentData[] = [
  {
    id: "biotic",
    name: "Biotic Research Facility",
    imagePath: "attachment_biotic.png",
    techSpeciality: ["biotic"],
    source: "pok",
  },
  {
    id: "bioticstat",
    name: "Biotic Research Facility",
    imagePath: "attachment_bioticstat.png",
    resourcesModifier: 1,
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "cybernetic",
    name: "Cybernetic Research Facility",
    imagePath: "attachment_cybernetic.png",
    techSpeciality: ["cybernetic"],
    source: "pok",
  },
  {
    id: "cyberneticstat",
    name: "Cybernetic Research Facility",
    imagePath: "attachment_cyberneticstat.png",
    resourcesModifier: 1,
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "dmz",
    name: "Demilitarized Zone",
    imagePath: "attachment_dmz.png",
    token: "dmz_large",
    source: "pok",
  },
  {
    id: "dysonsphere",
    name: "Dyson Sphere",
    imagePath: "attachment_dysonsphere.png",
    resourcesModifier: 2,
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "lazaxsurvivors",
    name: "Lazax Survivors",
    imagePath: "attachment_lazaxsurvivors.png",
    resourcesModifier: 1,
    influenceModifier: 2,
    source: "pok",
  },
  {
    id: "miningworld",
    name: "Mining World",
    imagePath: "attachment_miningworld.png",
    resourcesModifier: 2,
    source: "pok",
  },
  {
    id: "nanoforge",
    name: "Nanoforge",
    imagePath: "attachment_nanoforge.png",
    resourcesModifier: 2,
    influenceModifier: 2,
    isLegendary: true,
    source: "pok",
  },
  {
    id: "paradiseworld",
    name: "Paradise World",
    imagePath: "attachment_paradiseworld.png",
    resourcesModifier: 0,
    influenceModifier: 2,
    source: "pok",
  },
  {
    id: "propulsion",
    name: "Propulsion Research Facility",
    imagePath: "attachment_propulsion.png",
    techSpeciality: ["propulsion"],
    source: "pok",
  },
  {
    id: "propulsionstat",
    name: "Propulsion Research Facility",
    imagePath: "attachment_propulsionstat.png",
    resourcesModifier: 1,
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "richworld",
    name: "Rich World",
    imagePath: "attachment_richworld.png",
    resourcesModifier: 1,
    source: "pok",
  },
  {
    id: "titanshero",
    name: "Geoform",
    imagePath: "attachment_titanshero.png",
    resourcesModifier: 3,
    influenceModifier: 3,
    token: "ul",
    spaceCannonHitsOn: 5,
    spaceCannonDieCount: 3,
    source: "pok",
  },
  {
    id: "titanspn",
    name: "Terraform",
    imagePath: "attachment_titanspn.png",
    resourcesModifier: 1,
    influenceModifier: 1,
    planetTypes: ["cultural", "industrial", "hazardous"],
    source: "pok",
  },
  {
    id: "tombofemphidia",
    name: "Tomb of Emphidia",
    imagePath: "attachment_tombofemphidia.png",
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "warfare",
    name: "Warfare Research Facility",
    imagePath: "attachment_warfare.png",
    techSpeciality: ["warfare"],
    source: "pok",
  },
  {
    id: "warfarestat",
    name: "Warfare Research Facility",
    imagePath: "attachment_warfarestat.png",
    resourcesModifier: 1,
    influenceModifier: 1,
    source: "pok",
  },
  {
    id: "ixthduel",
    imagePath: "attachment_ixthduel.png",
    resourcesModifier: 1,
    influenceModifier: 3,
    source: "other",
  },
  {
    id: "custodiavigilia1",
    name: "Custodia Vigilia",
    imagePath: "attachment_custodiavigilia_1.png",
    isFakeAttachment: true,
    source: "codex3",
  },
  {
    id: "custodiavigilia2",
    name: "Custodia Vigilia",
    imagePath: "attachment_custodiavigilia_2.png",
    isFakeAttachment: true,
    source: "codex3",
  },
];

/**
 * Look up attachment data by ID
 */
export const getAttachmentData = (
  attachmentId: string
): AttachmentData | undefined => {
  return attachments.find((attachment) => attachment.id === attachmentId);
};

/**
 * Get the image path for an attachment by ID
 */
export const getAttachmentImagePath = (attachmentId: string): string | null => {
  const attachmentData = getAttachmentData(attachmentId);
  if (!attachmentData) return null;

  return `/attachment_token/${attachmentData?.imagePath}`;
};
