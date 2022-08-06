/**
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: © 2022 Stanislas Daniel Claude Dolcini
 */

{
    const cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
    if (!cmpPlayerManager)
        return;

    // Skip Gaia.
    for (let i = 1; i < cmpPlayerManager.GetNumPlayers(); ++i)
    {
        const cmpTechnologyManager = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(i), IID_TechnologyManager);
        if (!cmpTechnologyManager)
            continue;

        const civ = QueryPlayerIDInterface(i, IID_Identity).GetCiv();

        let cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);
        for (let templateName of cmpTemplateManager.FindAllTemplates(false))
        {
            if (templateName.search("/" + civ + "/") == -1)
                continue;

            let templateRes = cmpTemplateManager.GetTemplateWithoutValidation(templateName).Researcher;
            if (!templateRes)
                continue;

            let technologies = templateRes.Technologies._string.split(" ");
            for (let tech of technologies)
            {
                if (tech.endsWith("{civ}"))
                {
                    tech = tech.replace("{civ}", civ);
                    if (!TechnologyTemplates.Get(tech))
                        tech = tech.replace("_" + civ, "_generic");
                }

                if (tech.startsWith("pair"))
                    continue;

                cmpTechnologyManager.ResearchTechnology(tech);
            }
        }
    }
}
