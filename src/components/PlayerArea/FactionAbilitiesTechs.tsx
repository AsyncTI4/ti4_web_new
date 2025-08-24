import { Flex } from "@mantine/core";
import { Ability } from "./Ability";
import { getAbility } from "@/lookup/abilities";
import { Tech } from "./Tech";

interface FactionAbilitiesTechsProps {
    abilities: string[] | undefined;
    notResearchedFactionTechs: string[];
}

export default function FactionAbilitiesTechs({ abilities, notResearchedFactionTechs }: FactionAbilitiesTechsProps) {

    return (
        <Flex justify="space-between" gap={1} wrap={"wrap"} my="xs">
            <Flex
                gap={4}
            >
                {abilities?.map((abilityId, index) => {
                    const abilityData = getAbility(abilityId);
                    if (!abilityData) {
                        console.log("Could not find ability", abilityId);
                    }
                    if (!abilityData) return null;

                    return (
                        <Flex
                            key={index}
                        >
                            <Ability id={abilityId} />
                        </Flex>
                    );
                })}
            </Flex>

            {notResearchedFactionTechs?.length > 0 &&
                notResearchedFactionTechs.map((techId) => (
                    <Tech techId={techId} />
                ))
            }
        </Flex>
    );
}